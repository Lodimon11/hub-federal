// ─────────────────────────────────────────────────────────────────
// AWS Lambda Handler — Contact Form → Resend Email
// Runtime: Node.js 20.x | Handler: index.handler
// ─────────────────────────────────────────────────────────────────

/**
 * Environment Variables (configure in Lambda console):
 *   RESEND_API_KEY   – Your Resend API key (re_xxxx...)
 *   CONTACT_EMAIL    – Email address to receive contact form submissions
 *   ALLOWED_ORIGIN   – Frontend domain for CORS (e.g. https://hubfederal.com)
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contacto@hubfederal.com";
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

// Simple validation (mirrors Zod schemas on the frontend)
function validateInput(body) {
  const errors = [];

  if (!body.name || body.name.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push("Email inválido");
  }
  if (!body.message || body.message.length < 10) {
    errors.push("El mensaje debe tener al menos 10 caracteres");
  }

  return errors;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.requestContext?.http?.method === "OPTIONS" || event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders(),
      body: "",
    };
  }

  try {
    // 1. Parse body
    const body = JSON.parse(event.body || "{}");

    // 2. Validate
    const errors = validateInput(body);
    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Datos inválidos", errors }),
      };
    }

    // 3. Build email HTML
    const emailHtml = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #003D99, #2684FF); padding: 32px; border-radius: 16px 16px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📦 Nuevo Contacto — Hub Federal</h1>
        </div>
        <div style="background: #f7f9fc; padding: 32px; border-radius: 0 0 16px 16px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #dfe1e6; font-weight: 600; color: #0A1628;">Nombre</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #dfe1e6; color: #5E6C84;">${body.name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #dfe1e6; font-weight: 600; color: #0A1628;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #dfe1e6; color: #5E6C84;"><a href="mailto:${body.email}">${body.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #dfe1e6; font-weight: 600; color: #0A1628;">Empresa</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #dfe1e6; color: #5E6C84;">${body.company || "No especificada"}</td>
            </tr>
          </table>
          <div style="margin-top: 24px; padding: 20px; background: white; border-radius: 12px; border: 1px solid #dfe1e6;">
            <h3 style="margin: 0 0 12px; color: #0A1628;">Mensaje</h3>
            <p style="margin: 0; color: #5E6C84; white-space: pre-wrap;">${body.message}</p>
          </div>
        </div>
      </div>
    `;

    // 4. Send email via Resend API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Hub Federal <noreply@hubfederal.com>",
        to: [CONTACT_EMAIL],
        reply_to: body.email,
        subject: `Contacto Web: ${body.name}${body.company ? ` — ${body.company}` : ""}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Resend API error:", error);
      return {
        statusCode: 500,
        headers: { ...corsHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Error al enviar email" }),
      };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Email enviado correctamente", id: data.id }),
    };
  } catch (error) {
    console.error("Lambda error:", error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Error interno del servidor" }),
    };
  }
};
