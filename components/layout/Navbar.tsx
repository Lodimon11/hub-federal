"use client";

import { useState, useEffect } from "react";
import { Menu, X, Package, Search } from "lucide-react";
import Button from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "Clientes", href: "#clientes" },
  { label: "Cotizador", href: "#cotizador" },
  { label: "Orígenes", href: "#origenes" },
  { label: "Red de Agentes", href: "#agentes" },
  { label: "Contacto", href: "#contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Top Banner ─────────────────────────────────────────── */}
      <div className="bg-primary-dark text-white text-sm py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <Package className="w-4 h-4 shrink-0" />
          <span>
            Importaciones desde USA, China y España · Régimen Courier Simplificado ARCA
          </span>
          <span className="hidden sm:inline text-white/60">|</span>
          <a href="#cotizador" className="hidden sm:inline underline hover:text-primary-100 transition-colors font-medium">
            Rastrear envío
          </a>
          <a href="#agentes" className="hidden sm:inline underline hover:text-primary-100 transition-colors font-medium">
            Ser Agente
          </a>
        </div>
      </div>

      {/* ── Main Navbar ────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-dark/5"
            : "bg-white"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2.5 shrink-0">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-xl font-bold text-dark leading-tight">
                  Hub <span className="text-primary">Federal</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-text font-medium leading-tight">
                  Courier Internacional
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-dark/70 hover:text-primary transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full" />
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Button variant="ghost" size="sm" icon={<Search className="w-4 h-4" />}>
                Rastrear envío
              </Button>
              <Button variant="primary" size="sm">
                Quiero ser agente
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-dark" />
              ) : (
                <Menu className="w-6 h-6 text-dark" />
              )}
            </button>
          </div>
        </nav>

        {/* ── Mobile Menu ──────────────────────────────────────── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-4 pb-6 pt-2 space-y-1 bg-white border-t border-gray-border/30">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 px-4 rounded-xl text-dark/80 hover:bg-primary-50 hover:text-primary font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Button variant="ghost" size="md" icon={<Search className="w-4 h-4" />} fullWidth>
                Rastrear envío
              </Button>
              <Button variant="primary" size="md" fullWidth>
                Quiero ser agente
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
