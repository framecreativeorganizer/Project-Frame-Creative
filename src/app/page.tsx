"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Home() {
  const { t } = useLanguage();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setSettings(data);
      })
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  const stats = [
    { value: "500+", label: t("home.stats.events") },
    { value: "50k+", label: t("home.stats.prints") },
    { value: "200+", label: t("home.stats.clients") },
    { value: "10+", label: t("home.stats.cities") },
  ];

  const testimonials = [
    {
      name: "Rian & Dita",
      event: "Wedding Reception",
      comment: "Photobooth-nya super rame! Cetakannya cepet dan kualitas fotonya bener-bener kaya foto studio. Sangat recommended!",
      rating: 5,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXRfTJLI5MZnte5XjK8Es16MCoqDCE0t2wqlX9z1G_ic_AGc83s9aW6Jec-lqhJIoHHUK-4uYAomywOVG_-vByuMu9f9zVb9RGuqHKEPSP8MLO4OuejNaqQ9PNtNF4YigqoPwTXzp_weBhwXPViVVigWRUD3zqvOWQrQPUyiHFZ8FQec9d0hRR4j2RNUI2PcxTVgShV7Zxt4Ew5fl0dtKbm-gM0irLpP_AokgntiEn26Jmz964l-_Z_f57BYGI3expDVqRux_EHQ0"
    },
    {
      name: "PT Maju Jaya",
      event: "Annual Corporate Gathering",
      comment: "Live streaming-nya berjalan tanpa lag sedikit pun. VJ Visual di panggung juga dapet pujian dari direksi. Kerja bagus!",
      rating: 5,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc"
    },
    {
      name: "Universitas Indonesia",
      event: "Graduation Gala Night",
      comment: "Sudah 3 tahun berturut-turut pakai Frame Creative untuk VJ dan Photobooth. Selalu memuaskan dan profesional.",
      rating: 5,
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w"
    }
  ];

  const faqs = [
    { q: t("home.faq.q1"), a: t("home.faq.a1") },
    { q: t("home.faq.q2"), a: t("home.faq.a2") },
    { q: t("home.faq.q3"), a: t("home.faq.a3") },
    { q: t("home.faq.q4"), a: t("home.faq.a4") },
  ];

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] overflow-hidden bg-gradient-to-br from-[#001948] to-[#0A2D6D] text-white">
        <div className="absolute inset-0 z-0">
          <img
            alt="Event Photobooth"
            className="w-full h-full object-cover opacity-15"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXRfTJLI5MZnte5XjK8Es16MCoqDCE0t2wqlX9z1G_ic_AGc83s9aW6Jec-lqhJIoHHUK-4uYAomywOVG_-vByuMu9f9zVb9RGuqHKEPSP8MLO4OuejNaqQ9PNtNF4YigqoPwTXzp_weBhwXPViVVigWRUD3zqvOWQrQPUyiHFZ8FQec9d0hRR4j2RNUI2PcxTVgShV7Zxt4Ew5fl0dtKbm-gM0irLpP_AokgntiEn26Jmz964l-_Z_f57BYGI3expDVqRux_EHQ0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#001948] via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-[var(--spacing-container-max)] mx-auto text-center mt-10">
          <span className="inline-block bg-[var(--color-secondary)]/30 text-[var(--color-secondary-fixed)] font-label-md text-xs px-4 py-1.5 rounded-full mb-6 border border-[var(--color-secondary)]/20 uppercase tracking-widest">
            Frame Creative Organizer
          </span>
          <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg mb-6 max-w-4xl mx-auto leading-tight whitespace-pre-line text-white">
            {t("home.hero.title")}
          </h1>
          <p className="font-body-lg text-body-lg text-white/80 max-w-2xl mx-auto mb-10">
            {t("home.hero.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/booking"
              className="bg-white text-[#001948] font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-white/90 hover:scale-95 transition-all duration-200 shadow-lg text-center"
            >
              {t("home.hero.cta.check")}
            </Link>
            <Link
              href="/services"
              className="border border-white/30 text-white font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-white/10 transition-colors duration-200 text-center"
            >
              {t("home.hero.cta.services")}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 bg-white border-b border-[var(--color-outline-variant)]/20 shadow-sm relative z-20">
        <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-4xl md:text-5xl font-bold text-gradient font-display-lg mb-2">
                  {stat.value}
                </span>
                <span className="text-xs md:text-sm font-label-md text-[var(--color-on-surface-variant)] uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition (Bento Grid) */}
      <section className="py-[var(--spacing-section-gap)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-[var(--spacing-container-max)] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-gutter)]">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-[var(--color-outline-variant)]/20 p-8 soft-shadow hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-[var(--color-secondary-fixed)]/30 rounded-lg flex items-center justify-center mb-6 text-[var(--color-primary-container)]">
              <span className="material-symbols-outlined">star</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-3">
              {t("home.value.premium.title")}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("home.value.premium.desc")}
            </p>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-xl border border-[var(--color-outline-variant)]/20 p-8 soft-shadow hover:-translate-y-1 transition-transform duration-300 md:-translate-y-4">
            <div className="w-12 h-12 bg-[var(--color-secondary-fixed)]/30 rounded-lg flex items-center justify-center mb-6 text-[var(--color-primary-container)]">
              <span className="material-symbols-outlined">group</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-3">
              {t("home.value.team.title")}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("home.value.team.desc")}
            </p>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-xl border border-[var(--color-outline-variant)]/20 p-8 soft-shadow hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-[var(--color-secondary-fixed)]/30 rounded-lg flex items-center justify-center mb-6 text-[var(--color-primary-container)]">
              <span className="material-symbols-outlined">bolt</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-3">
              {t("home.value.instant.title")}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {t("home.value.instant.desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-[var(--spacing-section-gap)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-[var(--color-surface-container-low)]/50 border-t border-[var(--color-outline-variant)]/10">
        <div className="max-w-[var(--spacing-container-max)] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">
              {t("home.featured.title")}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {t("home.featured.subtitle")}
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-gutter)]">
            {/* Package 1 */}
            <div className="bg-white rounded-xl border border-[var(--color-outline-variant)]/20 overflow-hidden flex flex-col sm:flex-row soft-shadow">
              <div className="w-full sm:w-2/5 h-64 sm:h-auto relative">
                <img
                  alt="Photobooth Experience"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w"
                />
              </div>
              <div className="p-8 w-full sm:w-3/5 flex flex-col justify-center">
                <span className="inline-block bg-[var(--color-secondary-fixed)]/40 text-[var(--color-primary-container)] font-caption text-caption px-3 py-1 rounded-full mb-4 w-max">
                  Wedding & Events
                </span>
                <h3 className="font-headline-md text-headline-md text-primary mb-2">
                  Wedding & Event Photobooth
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Elite photobooth setup featuring studio lighting, physical backdrops, themed props, and instant prints with custom template branding.
                </p>
                <Link
                  href="/services"
                  className="border border-[var(--color-primary-container)] text-[var(--color-primary-container)] font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors self-start animate-pulse"
                >
                  View Details
                </Link>
              </div>
            </div>
            {/* Package 2 */}
            <div className="bg-white rounded-xl border border-[var(--color-outline-variant)]/20 overflow-hidden flex flex-col sm:flex-row soft-shadow">
              <div className="w-full sm:w-2/5 h-64 sm:h-auto relative">
                <img
                  alt="Live Streaming Production"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc"
                />
              </div>
              <div className="p-8 w-full sm:w-3/5 flex flex-col justify-center">
                <span className="inline-block bg-[var(--color-secondary-fixed)]/40 text-[var(--color-primary-container)] font-caption text-caption px-3 py-1 rounded-full mb-4 w-max">
                  Production Focus
                </span>
                <h3 className="font-headline-md text-headline-md text-primary mb-2">
                  Live Streaming & VJ Visual
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Broadcast your event globally with multi-camera configurations, live graphic overlays, and dynamic VJ screen visualizations.
                </p>
                <Link
                  href="/services"
                  className="border border-[var(--color-primary-container)] text-[var(--color-primary-container)] font-label-md text-label-md px-6 py-2.5 rounded-lg hover:bg-[var(--color-surface-container-low)] transition-colors self-start"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-[var(--spacing-section-gap)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] max-w-4xl mx-auto text-center">
        <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
          {t("home.testimonials.title")}
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-12">
          {t("home.testimonials.subtitle")}
        </p>
        
        <div className="relative bg-white border border-[var(--color-outline-variant)]/20 p-8 md:p-12 rounded-2xl soft-shadow min-h-[300px] flex flex-col justify-between">
          <div className="absolute top-6 left-6 text-6xl text-[var(--color-primary-container)]/10 font-serif leading-none">“</div>
          
          <div className="mb-6">
            <div className="flex justify-center gap-1 mb-4 text-amber-400">
              {[...Array(testimonials[testimonialIndex].rating)].map((_, i) => (
                <span key={i} className="material-symbols-outlined fill-1">star</span>
              ))}
            </div>
            <p className="font-body-lg text-lg text-primary italic leading-relaxed">
              &ldquo;{testimonials[testimonialIndex].comment}&rdquo;
            </p>
          </div>

          <div className="flex flex-col items-center">
            <img 
              src={testimonials[testimonialIndex].avatar} 
              alt={testimonials[testimonialIndex].name}
              className="w-14 h-14 rounded-full object-cover border-2 border-primary mb-3 shadow-md"
            />
            <h4 className="font-headline-md text-md text-primary font-bold">{testimonials[testimonialIndex].name}</h4>
            <span className="font-caption text-xs text-[var(--color-on-surface-variant)]">{testimonials[testimonialIndex].event}</span>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={handlePrevTestimonial}
              className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center hover:bg-[var(--color-surface-container-low)] text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button 
              onClick={handleNextTestimonial}
              className="w-10 h-10 border border-primary/20 rounded-full flex items-center justify-center hover:bg-[var(--color-surface-container-low)] text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section className="py-[var(--spacing-section-gap)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-[var(--color-surface-container-low)]/50 border-t border-b border-[var(--color-outline-variant)]/10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-2">
              {t("home.faq.title")}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {t("home.faq.subtitle")}
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="bg-white border border-[var(--color-outline-variant)]/30 rounded-xl overflow-hidden shadow-sm transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-6 flex justify-between items-center gap-4 font-headline-md text-base text-primary font-semibold hover:bg-[var(--color-surface-container-low)]/30 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-secondary)]' : 'text-primary/60'}`}>
                      keyboard_arrow_down
                    </span>
                  </button>
                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-60 border-t border-[var(--color-outline-variant)]/10' : 'max-h-0'
                    }`}
                  >
                    <p className="p-6 font-body-md text-[var(--color-on-surface-variant)] leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-[var(--spacing-section-gap)] px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-white text-center">
        <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-[#001948] to-[#0A2D6D] rounded-2xl text-white soft-shadow">
          <h2 className="font-headline-lg text-headline-lg mb-4 text-white">
            {t("home.cta.title")}
          </h2>
          <p className="font-body-lg text-body-lg text-white/80 mb-8">
            {t("home.cta.desc")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center bg-white text-[#001948] font-label-md text-label-md px-8 py-4 rounded-lg hover:scale-95 transition-transform duration-200 shadow-md"
            >
              <span className="material-symbols-outlined mr-2">event_available</span>
              Book Now & Lock Date
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp_number || "6287784728972"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-white/40 text-white font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              <span className="material-symbols-outlined mr-2">chat</span>
              {t("home.cta.btn")}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
