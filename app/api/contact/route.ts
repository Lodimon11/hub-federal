import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, message } = body;

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("No se encontró process.env.RESEND_API_KEY");
      return NextResponse.json(
        { message: "Falta configurar RESEND_API_KEY en .env.local" },
        { status: 500 }
      );
    }

    // Usamos el dominio de pruebas por defecto de Resend y el email del form o un predeterminado de test.
    // IMPORTANTE: Con cuentas de Resend no verificadas (testing), solo se pueden enviar
    // correos a tu propia dirección (la registrada en Resend).
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Prueba Hub Federal <onboarding@resend.dev>", 
        to: ["facundolodico@gmail.com"], // Usamos tu correo como solicitaste
        reply_to: email,
        subject: `Test Contacto Web: ${name}`,
        html: `
          <div style="font-family: sans-serif;">
            <h2>Nuevo Mensaje de Contacto</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Empresa:</strong> ${company || "No especificada"}</p>
            <hr />
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Resend API error:", errorData);
      return NextResponse.json(
        { message: "Error enviando email via Resend", error: errorData },
        { status: 500 }
      );
    }

    const data = await res.json();
    console.log("Email enviado exitosamente:", data);
    return NextResponse.json({ message: "Email enviado", data });
  } catch (error) {
    console.error("Error en /api/contact:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
