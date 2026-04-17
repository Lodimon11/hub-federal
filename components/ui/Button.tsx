import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "white";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-primary/40",
  secondary:
    "bg-accent text-white hover:bg-accent-dark shadow-lg shadow-accent/25",
  outline:
    "border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm",
  ghost:
    "text-primary hover:bg-primary-50",
  white:
    "bg-background text-primary hover:bg-primary-50 shadow-lg",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-lg gap-1.5",
  md: "px-6 py-3 text-base rounded-xl gap-2",
  lg: "px-8 py-4 text-lg rounded-xl gap-2.5",
};

export default function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-semibold
        transition-all duration-300 ease-out
        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.97]
        cursor-pointer
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        icon
      )}
      {children}
      {iconRight}
    </button>
  );
}
