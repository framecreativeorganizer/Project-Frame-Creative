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

export default function Services() {
  const { t } = useLanguage();
  const [services, setServices] = useState<DBService[]>([]);
  const [packages, setPackages] = useState<DBPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setServices(data.services);
        if (data.packages) setPackages(data.packages);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading services:", err);
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

  if (loading) {
    return (
      <div className="bg-[var(--color-surface-container-lowest)] min-h-screen py-20 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-body-md text-on-surface-variant">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-container-lowest)] min-h-screen pb-[var(--spacing-section-gap)]">
      {/* Header */}
      <section className="py-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent text-center">
        <h1 className="font-display-lg text-display-lg text-primary mb-4">
          {t("services.title")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {t("services.subtitle")}
        </p>
      </section>

      {/* Services List */}
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] space-y-24">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;
          const servicePackages = packages.filter((p) => p.serviceName === service.name);
          const benefitsList = service.benefits.split(",");

          return (
            <section
              key={service.id}
              className={`flex flex-col lg:flex-row gap-12 items-center ${
                isEven ? "" : "lg:flex-row-reverse"
              }`}
            >
              {/* Service Visual */}
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-2xl overflow-hidden soft-shadow group aspect-[4/3]">
                  <img
                    src={service.imageUrl}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </div>

              {/* Service Info */}
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <span className="text-sm font-label-md text-[var(--color-secondary)] uppercase tracking-wider mb-2">
                  Service Category
                </span>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
                  {service.name}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Benefits List */}
                <h4 className="font-label-md text-xs uppercase tracking-wider text-primary mb-3 font-bold">
                  {t("services.benefits")}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {benefitsList.map((benefit, i) => (
                    <li key={i} className="flex items-center text-on-surface text-sm">
                      <span className="material-symbols-outlined text-[var(--color-secondary)] mr-3 text-lg">
                        check_circle
                      </span>
                      <span>{benefit.trim()}</span>
                    </li>
                  ))}
                </ul>

                {/* Package prices card inline */}
                <div className="bg-[var(--color-surface-container-low)] border border-[var(--color-outline-variant)]/20 p-6 rounded-xl mb-6">
                  <h4 className="font-label-md text-xs uppercase tracking-wider text-primary mb-4 font-bold">
                    {t("services.packages")}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {servicePackages.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white border border-[var(--color-outline-variant)]/30 rounded-lg p-4 text-center flex flex-col justify-between"
                      >
                        <div>
                          <span className="font-label-md text-xs text-[var(--color-on-surface-variant)] block">
                            {p.name}
                          </span>
                          <span className="font-bold text-sm text-primary block my-1">
                            {getFormatPrice(p.price)}
                          </span>
                          <span className="text-[10px] text-gray-500 font-caption">
                            {p.duration}
                          </span>
                        </div>
                        <Link
                          href={`/booking?service=${encodeURIComponent(
                            service.name
                          )}&package=${p.name.toLowerCase()}`}
                          className="mt-3 block bg-[var(--color-primary-container)] text-white hover:bg-primary font-caption text-[11px] py-1.5 rounded transition-colors text-center"
                        >
                          Book Now
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
