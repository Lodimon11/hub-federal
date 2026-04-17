"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useEffect, useState } from "react";

interface MetricItemProps {
  value: string;
  label: string;
  prefix?: string;
  isVisible: boolean;
  delay: number;
}

function MetricItem({ value, label, prefix, isVisible, delay }: MetricItemProps) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isVisible) return;

    // Extract the number from the value string
    const numericPart = value.replace(/[^0-9]/g, "");
    const target = parseInt(numericPart, 10);

    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    const suffix = value.replace(/[0-9]/g, "");
    const duration = 2000;
    const startTime = Date.now() + delay;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed < 0) return;

      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      setDisplayValue(current + suffix);

      if (progress >= 1) clearInterval(timer);
    }, 30);

    return () => clearInterval(timer);
  }, [isVisible, value, delay]);

  return (
    <div
      className={`text-center transition-all duration-700 ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-2">
        {prefix && <span className="text-3xl sm:text-4xl lg:text-5xl">{prefix}</span>}
        {displayValue}
      </div>
      <div className="text-sm sm:text-base text-gray-text font-medium">
        {label}
      </div>
    </div>
  );
}

const METRICS = [
  { value: "80+", label: "Agentes en todo el país" },
  { value: "3", label: "Orígenes Internacionales" },
  { value: "24", label: "Provincias con cobertura" },
  { value: "400", label: "Franquicia libre de tributos", prefix: "USD " },
];

export default function Metrics() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="bg-surface py-16 sm:py-20 border-y border-gray-border/30">
      <div
        ref={ref}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {METRICS.map((metric, idx) => (
            <MetricItem
              key={metric.label}
              value={metric.value}
              label={metric.label}
              prefix={metric.prefix}
              isVisible={isVisible}
              delay={idx * 150}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
