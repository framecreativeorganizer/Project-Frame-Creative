"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";

interface DBService {
  id: string;
  name: string;
  description: string;
  benefits: string;
  imageUrl: string;
}

interface DBPackage {
  id: string;
  serviceName: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string;
}

export default function Pricing() {
  const { t, language } = useLanguage();
  const [services, setServices] = useState<DBService[]>([]);
  const [packages, setPackages] = useState<DBPackage[]>([]);
  const [selectedPackageDetail, setSelectedPackageDetail] = useState<DBPackage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services) {
          setServices(data.services);
        }
        if (data.packages) {
          setPackages(data.packages);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading pricing data:", err);
        setLoading(false);
      });
  }, []);

  const getFormatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-[var(--color-surface-container-lowest)] min-h-screen pb-[var(--spacing-section-gap)] scroll-smooth">
      {/* Header */}
      <section className="py-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent text-center">
        <h1 className="font-display-lg text-display-lg text-primary mb-4">
          {t("pricing.title")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {t("pricing.subtitle")}
        </p>
      </section>

      {/* Navigation Quick Jump Links */}
      {!loading && services.length > 0 && (
        <div className="sticky top-20 z-40 bg-[var(--color-surface)]/90 backdrop-blur-md border-b border-[var(--color-outline-variant)]/20 py-4 mb-16 shadow-sm">
          <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-thin">
              <span className="text-xs font-bold text-primary shrink-0 uppercase tracking-wider font-label-md">
                {language === "id" ? "Lompat ke:" : "Jump to:"}
              </span>
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`#service-${service.id}`}
                  onClick={(e) => handleScrollTo(e, `service-${service.id}`)}
                  className="px-4 py-1.5 rounded-full font-label-md text-xs bg-white text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)]/30 hover:border-primary hover:text-primary transition-all whitespace-nowrap shadow-sm hover:scale-95"
                >
                  {service.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pricing Sections Stacked Vertically */}
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] space-y-24">
        {loading ? (
          <div className="space-y-16">
            {[1, 2].map((sectionIndex) => (
              <div key={sectionIndex} className="space-y-6">
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="bg-white rounded-2xl border border-[var(--color-outline-variant)]/20 p-8 h-96 animate-pulse flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="h-6 w-24 bg-gray-200 rounded"></div>
                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          services.map((service, index) => {
            const servicePackages = packages.filter((p) => p.serviceName === service.name);
            if (servicePackages.length === 0) return null;

            return (
              <section
                key={service.id}
                id={`service-${service.id}`}
                className="scroll-mt-36"
              >
                {/* Service Header inside Pricing */}
                <div className="border-l-4 border-[var(--color-secondary)] pl-4 mb-10">
                  <h2 className="font-headline-lg text-headline-lg text-primary font-bold">
                    {service.name}
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1.5 max-w-3xl">
                    {service.description}
                  </p>
                </div>

                {/* Service Packages Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)] items-stretch">
                  {servicePackages.map((plan) => {
                    const isPopular = plan.name.toLowerCase() === "premium";
                    const featuresList = plan.features ? plan.features.split(",") : [];

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPackageDetail(plan)}
                        className={`relative bg-white rounded-2xl border flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                          isPopular
                            ? "border-[var(--color-secondary)] shadow-xl md:-translate-y-2 ring-1 ring-[var(--color-secondary)]/20"
                            : "border-[var(--color-outline-variant)]/40 soft-shadow hover:border-primary/20"
                        } p-8 hover:-translate-y-1`}
                      >
                        {isPopular && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--color-secondary)] text-white font-caption text-[11px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow">
                            {t("pricing.popular")}
                          </div>
                        )}

                        <div>
                          {/* Plan Name & Desc */}
                          <div className="mb-6 text-center">
                            <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">
                              {plan.name}
                            </h3>
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                              {plan.description}
                            </p>
                          </div>

                          {/* Price & Duration */}
                          <div className="mb-8 text-center bg-[var(--color-surface-container-low)] py-4 px-2 rounded-xl">
                            <span className="font-display-lg-mobile text-display-lg-mobile text-primary font-extrabold block">
                              {getFormatPrice(plan.price)}
                            </span>
                            <span className="text-[var(--color-on-surface-variant)] font-label-md text-label-md mt-1 block">
                              {plan.duration}
                            </span>
                          </div>

                          {/* Features List */}
                          <ul className="space-y-3.5 mb-6">
                            {featuresList.slice(0, 4).map((feature, i) => (
                              <li key={i} className="flex items-start text-on-surface text-xs leading-tight">
                                <span className="material-symbols-outlined text-[var(--color-secondary)] mr-2.5 text-base shrink-0 font-bold">
                                  check
                                </span>
                                <span>{feature.trim()}</span>
                              </li>
                            ))}
                            {featuresList.length > 4 && (
                              <li className="text-[var(--color-secondary)] text-xs font-semibold pl-6 italic">
                                + {featuresList.length - 4} {language === "id" ? "fitur lainnya..." : "more features..."}
                              </li>
                            )}
                          </ul>
                        </div>

                        <div>
                          {/* Details & Booking Link */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPackageDetail(plan);
                            }}
                            className="w-full text-center text-xs text-[var(--color-secondary)] hover:text-primary font-bold transition-colors cursor-pointer block mb-3 hover:underline"
                          >
                            {language === "id" ? "Lihat Detail Layanan" : "View Included Services"}
                          </button>

                          <Link
                            href={`/booking?service=${encodeURIComponent(
                              plan.serviceName
                            )}&package=${encodeURIComponent(plan.name.toLowerCase())}`}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full block text-center font-label-md text-label-md px-6 py-3.5 rounded-lg transition-all font-bold ${
                              isPopular
                                ? "bg-gradient-btn text-white hover:shadow-lg hover:opacity-95"
                                : "border border-primary text-primary hover:bg-[var(--color-surface-container-low)]"
                            }`}
                          >
                            {t("pricing.btn")}{plan.name}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Section Separator */}
                {index < services.length - 1 && (
                  <div className="w-full border-b border-[var(--color-outline-variant)]/20 mt-16"></div>
                )}
              </section>
            );
          })
        )}
      </div>

      {/* Detail Pop-up Modal */}
      {selectedPackageDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedPackageDetail(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10 animate-fade-in max-h-[90vh] overflow-y-auto">
            {/* Header info */}
            <div className="flex items-start justify-between mb-6 border-b pb-4">
              <div>
                <span className="text-[11px] font-bold text-[var(--color-secondary)] uppercase tracking-wider block">
                  {selectedPackageDetail.serviceName}
                </span>
                <h2 className="font-headline-lg text-lg text-primary font-bold">
                  {selectedPackageDetail.name} Package
                </h2>
              </div>
              <button
                onClick={() => setSelectedPackageDetail(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Price & Duration banner */}
              <div className="flex justify-between items-center bg-[var(--color-surface-container-low)] p-4 rounded-xl border border-[var(--color-outline-variant)]/10">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide">
                    {language === "id" ? "Total Biaya" : "Service cost"}
                  </span>
                  <span className="text-xl font-extrabold text-primary block">
                    {getFormatPrice(selectedPackageDetail.price)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wide">
                    {language === "id" ? "Durasi Kerja" : "Service duration"}
                  </span>
                  <span className="font-bold text-primary text-sm block">
                    {selectedPackageDetail.duration}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                  {language === "id" ? "Deskripsi Paket" : "Description"}
                </h4>
                <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                  {selectedPackageDetail.description}
                </p>
              </div>

              {/* Features list */}
              <div>
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                  {language === "id" ? "Layanan yang Didapat (Fitur):" : "Included Features:"}
                </h4>
                <ul className="space-y-2.5">
                  {selectedPackageDetail.features.split(",").map((feat, idx) => (
                    <li key={idx} className="flex items-start text-xs text-on-surface leading-tight">
                      <span className="material-symbols-outlined text-green-600 mr-2 text-sm font-bold shrink-0">
                        check_circle
                      </span>
                      <span>{feat.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Parent category general benefits */}
              {(() => {
                const parentService = services.find(s => s.name === selectedPackageDetail.serviceName);
                if (!parentService?.benefits) return null;
                return (
                  <div className="bg-[var(--color-surface-bright)] p-4 rounded-xl border border-gray-100">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                      {language === "id" 
                        ? `Benefit Kategori ${parentService.name}:`
                        : `Category ${parentService.name} Benefits:`
                      }
                    </h4>
                    <ul className="space-y-2">
                      {parentService.benefits.split(",").map((benefit, idx) => (
                        <li key={idx} className="flex items-start text-[11px] text-[var(--color-on-surface-variant)] leading-tight">
                          <span className="material-symbols-outlined text-[var(--color-secondary)] mr-2 text-xs font-bold shrink-0">
                            verified
                          </span>
                          <span>{benefit.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}

              {/* Footer CTAs */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedPackageDetail(null)}
                  className="flex-1 border border-gray-300 text-gray-700 text-xs font-bold py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-center"
                >
                  {language === "id" ? "Tutup" : "Close"}
                </button>
                <Link
                  href={`/booking?service=${encodeURIComponent(
                    selectedPackageDetail.serviceName
                  )}&package=${encodeURIComponent(selectedPackageDetail.name.toLowerCase())}`}
                  onClick={() => setSelectedPackageDetail(null)}
                  className="flex-1 bg-gradient-btn text-white text-xs font-bold py-3 rounded-lg hover:opacity-95 transition-opacity text-center shadow-md"
                >
                  {language === "id" ? "Pesan Sekarang" : "Book Now"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add-ons Note */}
      <div className="max-w-3xl mx-auto mt-16 px-[var(--spacing-margin-mobile)] text-center">
        <p className="text-[var(--color-on-surface-variant)] text-sm leading-relaxed">
          {t("pricing.note")}
        </p>
      </div>
    </div>
  );
}
