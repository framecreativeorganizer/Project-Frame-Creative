"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full py-[var(--spacing-section-gap)] bg-[var(--color-primary)] text-on-primary font-body-md text-body-md mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-[var(--spacing-gutter)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto">
        <div className="col-span-1 md:col-span-1">
          <div className="font-headline-md text-headline-md font-bold mb-4">
            <img
              alt="Frame Creative Logo"
              className="h-12 w-auto object-contain brightness-0 invert"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuV-f6mZmr53G0VbFsNTUkxt2ClQZV_TsvflnYQiuMzhMFdWrm3FCVLhIGfRiLKr9A1Crx-l54RePDAwMez-w1j7xpR8Dy0xWQzUMmKODE2ydS9E52pMzJOaSELbNZme2HPobbK5ztndP0ELINPBLyR48KnMWXrOwV2h3uga2q_GxXoq0O7ikgti9RDEdhGtj7ayE4uRUywQF9Pq9GrlLf3QbvLotcSP4M9jptEkLKfdNUz_gMtynOc3yjIpZmFD-7RK4IfKhFkrg"
            />
          </div>
          <p className="text-white/80 text-sm">
            {t("footer.desc")}
          </p>
        </div>
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
          <Link href="#" className="text-white/80 hover:text-white transition-colors hover:underline decoration-[var(--color-secondary-fixed)] underline-offset-4">
            {t("footer.privacy")}
          </Link>
          <Link href="#" className="text-white/80 hover:text-white transition-colors hover:underline decoration-[var(--color-secondary-fixed)] underline-offset-4">
            {t("footer.terms")}
          </Link>
          <Link href="#" className="text-white/80 hover:text-white transition-colors hover:underline decoration-[var(--color-secondary-fixed)] underline-offset-4">
            {t("footer.faq")}
          </Link>
          <Link href="#" className="text-white/80 hover:text-white transition-colors hover:underline decoration-[var(--color-secondary-fixed)] underline-offset-4">
            {t("footer.contact")}
          </Link>
        </div>
        <div className="col-span-1 md:col-span-1 flex items-end justify-start md:justify-end">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Frame Creative Organizer. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
