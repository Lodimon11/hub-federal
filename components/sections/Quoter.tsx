"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, TrendingUp, Package, DollarSign, ArrowRight } from "lucide-react";
import { quoterSchema, type QuoterFormValues } from "@/lib/validators";
import { calculateQuote, PRODUCT_LABELS, ORIGIN_LABELS } from "@/lib/quoter";
import type { QuoterResult, ProductType, Origin } from "@/types";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const PRODUCT_OPTIONS = (Object.entries(PRODUCT_LABELS) as [ProductType, string][]).map(
  ([value, label]) => ({ value, label })
);

const ORIGIN_OPTIONS = (Object.entries(ORIGIN_LABELS) as [Origin, string][]).map(
  ([value, label]) => ({ value, label })
);

export default function Quoter() {
  const [result, setResult] = useState<QuoterResult | null>(null);
  const { ref, isVisible } = useScrollAnimation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoterFormValues>({
    resolver: zodResolver(quoterSchema),
    defaultValues: {
      weight: undefined,
      productType: undefined,
      origin: undefined,
      declaredValue: undefined,
    },
  });

  const onSubmit = (data: QuoterFormValues) => {
    const quote = calculateQuote(data);
    setResult(quote);
  };

  return (
    <section id="cotizador" className="py-20 sm:py-28 bg-white">
      <div
        ref={ref}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}
      >
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary text-sm font-semibold mb-4">
            <Calculator className="w-4 h-4" />
            Cotizador Online
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-dark mb-4">
            Cotizá tu envío en{" "}
            <span className="text-primary">segundos</span>
          </h2>
          <p className="text-lg text-gray-text max-w-2xl mx-auto">
            Ingresá los datos de tu envío y obtené un presupuesto estimado al instante.
            Sin compromiso, sin registro.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* ── Form ────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            <Card variant="elevated" padding="lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Input
                    label="Peso del envío (kg)"
                    type="number"
                    step="0.1"
                    placeholder="Ej: 2.5"
                    error={errors.weight?.message}
                    {...register("weight", { valueAsNumber: true })}
                  />
                  <Input
                    label="Valor declarado (USD)"
                    type="number"
                    step="1"
                    placeholder="Ej: 350"
                    error={errors.declaredValue?.message}
                    {...register("declaredValue", { valueAsNumber: true })}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <Select
                    label="Tipo de producto"
                    options={PRODUCT_OPTIONS}
                    placeholder="Seleccionar..."
                    error={errors.productType?.message}
                    {...register("productType")}
                  />
                  <Select
                    label="Origen"
                    options={ORIGIN_OPTIONS}
                    placeholder="Seleccionar..."
                    error={errors.origin?.message}
                    {...register("origin")}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Calculator className="w-5 h-5" />}
                >
                  Calcular presupuesto
                </Button>
              </form>
            </Card>
          </div>

          {/* ── Result ──────────────────────────────────────────── */}
          <div className="lg:col-span-2">
            {result ? (
              <div className="space-y-4 animate-fade-in-up">
                {/* Total Card */}
                <div className="gradient-primary rounded-2xl p-6 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-5 h-5 text-white/70" />
                    <span className="text-sm text-white/70 font-medium">
                      Costo total estimado
                    </span>
                  </div>
                  <div className="font-display text-4xl sm:text-5xl font-bold mb-4">
                    USD {result.total.toFixed(2)}
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-white/60">Envío</span>
                      <div className="font-semibold">
                        USD {result.shippingCost.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-white/60">Impuestos est.</span>
                      <div className="font-semibold">
                        USD {result.taxes.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <Card variant="default" padding="md">
                  <h4 className="font-semibold text-dark mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    Desglose
                  </h4>
                  <div className="space-y-3">
                    {result.breakdown.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-2 border-b border-gray-border/30 last:border-0"
                      >
                        <div>
                          <div className="text-sm font-medium text-dark">
                            {item.label}
                          </div>
                          {item.detail && (
                            <div className="text-xs text-gray-text">
                              {item.detail}
                            </div>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-dark">
                          USD {item.value.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <p className="text-xs text-gray-text text-center">
                  * Valores estimados. El precio final puede variar según dimensiones y peso volumétrico.
                </p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center py-12 px-6">
                  <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
                    <DollarSign className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="font-display text-xl font-semibold text-dark mb-2">
                    Tu presupuesto
                  </h4>
                  <p className="text-gray-text text-sm max-w-xs mx-auto">
                    Completá el formulario y hacé clic en &quot;Calcular&quot; para ver el
                    costo estimado de tu envío.
                  </p>
                  <div className="mt-4 flex justify-center">
                    <ArrowRight className="w-5 h-5 text-primary animate-float" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
