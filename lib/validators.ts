import { z } from "zod";

// ── Quoter Schema ───────────────────────────────────────────────────

export const quoterSchema = z.object({
  weight: z
    .number({ error: "Ingresá un peso válido" })
    .min(0.1, "El peso mínimo es 0.1 kg")
    .max(100, "El peso máximo es 100 kg"),
  productType: z.enum(
    ["electronics", "clothing", "supplements", "parts", "other"],
    { error: "Seleccioná un tipo de producto" }
  ),
  origin: z.enum(["usa", "spain", "china"], {
    error: "Seleccioná un origen",
  }),
  declaredValue: z
    .number({ error: "Ingresá un valor válido" })
    .min(1, "El valor mínimo es USD 1")
    .max(50000, "El valor máximo es USD 50.000"),
});

export type QuoterFormValues = z.infer<typeof quoterSchema>;

// ── Contact Schema ──────────────────────────────────────────────────

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo"),
  email: z
    .string()
    .email("Ingresá un email válido"),
  company: z
    .string()
    .max(100, "El nombre de empresa es demasiado largo")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(2000, "El mensaje es demasiado largo"),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
