"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.services"), href: "/services" },
    { name: t("nav.portfolio"), href: "/portfolio" },
    { name: t("nav.pricing"), href: "/pricing" },
    { name: t("nav.dashboard"), href: "/dashboard" },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--color-surface)]/80 backdrop-blur-md border-b border-[var(--color-outline-variant)]/20 shadow-sm">
      <div className="flex justify-between items-center w-full px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] h-20 max-w-[var(--spacing-container-max)] mx-auto">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
          <img
            alt="Frame Creative Logo"
            className="h-10 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuV-f6mZmr53G0VbFsNTUkxt2ClQZV_TsvflnYQiuMzhMFdWrm3FCVLhIGfRiLKr9A1Crx-l54RePDAwMez-w1j7xpR8Dy0xWQzUMmKODE2ydS9E52pMzJOaSELbNZme2HPobbK5ztndP0ELINPBLyR48KnMWXrOwV2h3uga2q_GxXoq0O7ikgti9RDEdhGtj7ayE4uRUywQF9Pq9GrlLf3QbvLotcSP4M9jptEkLKfdNUz_gMtynOc3yjIpZmFD-7RK4IfKhFkrg"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-label-md text-label-md px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-[var(--color-secondary)] border-b-2 border-[var(--color-secondary)] font-bold pb-1"
                    : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Language Toggle */}
          <div className="flex items-center border border-[var(--color-outline-variant)]/50 rounded-lg p-0.5 bg-[var(--color-surface-container-low)]">
            <button
              onClick={() => setLanguage("id")}
              className={`px-2.5 py-1 rounded-md font-label-md text-[11px] transition-all ${
                language === "id"
                  ? "bg-white text-primary shadow-sm font-bold"
                  : "text-[var(--color-on-surface-variant)] hover:text-primary"
              }`}
            >
              ID
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-md font-label-md text-[11px] transition-all ${
                language === "en"
                  ? "bg-white text-primary shadow-sm font-bold"
                  : "text-[var(--color-on-surface-variant)] hover:text-primary"
              }`}
            >
              EN
            </button>
          </div>

          <Link
            href="/booking"
            className="bg-gradient-btn text-on-primary font-label-md text-label-md px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            {t("nav.booking")}
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span className="material-symbols-outlined">
            {isMobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)]/20 shadow-lg flex flex-col items-center py-6 space-y-4 animate-slide-down">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-label-md text-label-md px-4 py-2 w-full text-center ${
                  isActive
                    ? "text-[var(--color-secondary)] font-bold bg-[var(--color-surface-container-low)]"
                    : "text-[var(--color-on-surface-variant)]"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Mobile Language Switcher */}
          <div className="flex items-center border border-[var(--color-outline-variant)]/50 rounded-lg p-0.5 bg-[var(--color-surface-container-low)] my-2">
            <button
              onClick={() => setLanguage("id")}
              className={`px-4 py-1.5 rounded-md font-label-md text-xs transition-all ${
                language === "id"
                  ? "bg-white text-primary shadow-sm font-bold"
                  : "text-[var(--color-on-surface-variant)]"
              }`}
            >
              Bahasa Indonesia
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`px-4 py-1.5 rounded-md font-label-md text-xs transition-all ${
                language === "en"
                  ? "bg-white text-primary shadow-sm font-bold"
                  : "text-[var(--color-on-surface-variant)]"
              }`}
            >
              English
            </button>
          </div>

          <Link
            href="/booking"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-gradient-btn text-on-primary font-label-md text-label-md px-8 py-3 rounded-lg hover:opacity-90 mt-4 w-3/4 text-center"
          >
            {t("nav.booking")}
          </Link>
        </div>
      )}
    </nav>
  );
}
