"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, MapPin, Phone, Mail, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { contactSchema, type ContactFormValues } from "@/lib/validators";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const { ref, isVisible } = useScrollAnimation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("loading");

    try {
      const endpoint = process.env.NEXT_PUBLIC_LAMBDA_URL || "/api/contact";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Error al enviar");

      setStatus("success");
      reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contacto" className="py-20 sm:py-28 bg-surface">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary text-sm font-semibold mb-4">
            <Mail className="w-4 h-4" />
            Contacto
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4">
            ¿Tenés alguna{" "}
            <span className="text-primary">consulta?</span>
          </h2>
          <p className="text-lg text-gray-text max-w-2xl mx-auto">
            Escribinos y nuestro equipo te responderá a la brevedad.
            Estamos para ayudarte.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ── Form ────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <Card variant="elevated" padding="lg">
              {status === "success" ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                  <h4 className="font-display text-xl font-semibold text-dark mb-2">
                    ¡Mensaje enviado!
                  </h4>
                  <p className="text-gray-text">
                    Nos pondremos en contacto a la brevedad.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <Input
                      label="Nombre completo"
                      placeholder="Juan Pérez"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="juan@empresa.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>

                  <Input
                    label="Empresa (opcional)"
                    placeholder="Mi Empresa S.A."
                    error={errors.company?.message}
                    {...register("company")}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="message"
                      className="text-sm font-medium text-dark/80"
                    >
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Contanos en qué podemos ayudarte..."
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-dark placeholder:text-gray-text/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none ${
                        errors.message
                          ? "border-error focus:ring-error/30 focus:border-error"
                          : "border-gray-border hover:border-primary/40"
                      }`}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="text-sm text-error flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {status === "error" && (
                    <div className="p-4 rounded-xl bg-error/5 border border-error/20 text-error text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Hubo un error al enviar. Por favor intentá nuevamente.
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={status === "loading"}
                    icon={<Send className="w-5 h-5" />}
                  >
                    Enviar mensaje
                  </Button>
                </form>
              )}
            </Card>
          </div>

          {/* ── Contact Info ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="elevated" padding="md">
              <div className="space-y-6">
                <ContactInfoItem
                  icon={<MapPin className="w-5 h-5" />}
                  title="Oficina Central"
                  detail="Av. Corrientes 1234, Piso 8, CABA, Argentina"
                />
                <ContactInfoItem
                  icon={<Phone className="w-5 h-5" />}
                  title="Teléfono"
                  detail="+54 11 4567-8900"
                />
                <ContactInfoItem
                  icon={<Mail className="w-5 h-5" />}
                  title="Email"
                  detail="info@hubfederal.com"
                />
                <ContactInfoItem
                  icon={<Clock className="w-5 h-5" />}
                  title="Horario de atención"
                  detail="Lunes a Viernes, 9:00 a 18:00 hs"
                />
              </div>
            </Card>

            {/* Map Placeholder */}
            <Card variant="default" padding="sm" className="overflow-hidden">
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface-alt">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                    <p className="text-sm text-gray-text font-medium">
                      CABA, Argentina
                    </p>
                  </div>
                </div>
                {/* Simulated map with grid lines */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="map-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#map-grid)" className="text-primary" />
                </svg>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfoItem({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center shrink-0 text-primary">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-dark">{title}</div>
        <div className="text-sm text-gray-text">{detail}</div>
      </div>
    </div>
  );
}
