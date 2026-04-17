"use client";

import { useState } from "react";
import { Search, ArrowRight, Shield, Globe, MapPin, DollarSign } from "lucide-react";
import Button from "@/components/ui/Button";

const BADGES = [
  { icon: Shield, label: "Courier Simplificado ARCA" },
  { icon: DollarSign, label: "Hasta USD 3.000/envío" },
  { icon: Globe, label: "Cobertura Nacional" },
  { icon: MapPin, label: "Agentes en todo el país" },
];

export default function Hero() {
  const [trackingTab, setTrackingTab] = useState<"tracking" | "order">("tracking");
  const [trackingValue, setTrackingValue] = useState("");

  return (
    <section id="hero" className="relative gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.04]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Decorative Circles */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-light/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ── Left: Text Content ─────────────────────────────── */}
          <div className="text-white space-y-8">
            <div className="space-y-6">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Importá desde{" "}
                <span className="text-primary-100">USA, China y España</span>{" "}
                a todo el país
              </h1>
              <p className="text-lg sm:text-xl text-white/75 max-w-lg leading-relaxed">
                Hub Federal conecta compradores de toda Argentina con el mercado
                internacional. Régimen Courier Simplificado ARCA. Entrega puerta a
                puerta en las 24 provincias.
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {BADGES.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-sm text-white/90 font-medium"
                >
                  <badge.icon className="w-4 h-4 text-primary-100" />
                  {badge.label}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button variant="white" size="lg">
                Cotizar mi envío
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg">
                Rastrear paquete
              </Button>
            </div>
          </div>

          {/* ── Right: Tracking Form ──────────────────────────── */}
          <div className="w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
            <div className="glass-white rounded-2xl overflow-hidden">
              {/* Form Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-lg font-semibold text-dark">
                    Rastreá tu envío
                  </h3>
                </div>
                <p className="text-sm text-gray-text mb-4">
                  Ingresá tu número de tracking para ver el estado de tu envío en tiempo real
                </p>

                {/* Tabs */}
                <div className="flex rounded-xl bg-surface p-1 gap-1">
                  <button
                    onClick={() => setTrackingTab("tracking")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      trackingTab === "tracking"
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-text hover:text-dark"
                    }`}
                  >
                    Nº de Tracking
                  </button>
                  <button
                    onClick={() => setTrackingTab("order")}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      trackingTab === "order"
                        ? "bg-primary text-white shadow-md"
                        : "text-gray-text hover:text-dark"
                    }`}
                  >
                    Nº de Orden
                  </button>
                </div>
              </div>

              {/* Form Body */}
              <div className="px-6 pb-6 space-y-4">
                <input
                  type="text"
                  value={trackingValue}
                  onChange={(e) => setTrackingValue(e.target.value)}
                  placeholder={
                    trackingTab === "tracking"
                      ? "Ej: HF-1098-89254"
                      : "Ej: ORD-2024-00123"
                  }
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-border bg-white text-dark placeholder:text-gray-text/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  className="w-full py-3.5 rounded-xl bg-dark text-white font-semibold hover:bg-dark-light transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  Buscar envío
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
