import React from "react";

type CardVariant = "default" | "elevated" | "glass";

interface CardProps {
  variant?: CardVariant;
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-background border border-gray-border/50",
  elevated: "bg-background shadow-xl shadow-foreground/5 border border-gray-border/30",
  glass: "glass-white",
};

const paddingStyles = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  variant = "default",
  children,
  className = "",
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`
        rounded-2xl
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
