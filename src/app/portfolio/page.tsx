"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { TranslationKey } from "@/lib/translations";

interface PortfolioItem {
  id: number;
  category: "Wedding" | "Corporate" | "Wisuda" | "Gathering" | "Seminar";
  title: string;
  imageUrl: string;
  videoUrl?: string;
}

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 1,
    category: "Wedding",
    title: "Elegant Outdoor Wedding",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXRfTJLI5MZnte5XjK8Es16MCoqDCE0t2wqlX9z1G_ic_AGc83s9aW6Jec-lqhJIoHHUK-4uYAomywOVG_-vByuMu9f9zVb9RGuqHKEPSP8MLO4OuejNaqQ9PNtNF4YigqoPwTXzp_weBhwXPViVVigWRUD3zqvOWQrQPUyiHFZ8FQec9d0hRR4j2RNUI2PcxTVgShV7Zxt4Ew5fl0dtKbm-gM0irLpP_AokgntiEn26Jmz964l-_Z_f57BYGI3expDVqRux_EHQ0",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    category: "Corporate",
    title: "Tech Summit 2024",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    category: "Wedding",
    title: "Luxury Reception Photobooth",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w"
  },
  {
    id: 4,
    category: "Wisuda",
    title: "University Graduation Night",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXRfTJLI5MZnte5XjK8Es16MCoqDCE0t2wqlX9z1G_ic_AGc83s9aW6Jec-lqhJIoHHUK-4uYAomywOVG_-vByuMu9f9zVb9RGuqHKEPSP8MLO4OuejNaqQ9PNtNF4YigqoPwTXzp_weBhwXPViVVigWRUD3zqvOWQrQPUyiHFZ8FQec9d0hRR4j2RNUI2PcxTVgShV7Zxt4Ew5fl0dtKbm-gM0irLpP_AokgntiEn26Jmz964l-_Z_f57BYGI3expDVqRux_EHQ0",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 5,
    category: "Gathering",
    title: "Annual Gala Hybrid Event",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDcWUwJiULqzaOgAwotOtra9DWv1zBQLMDWJPJycv7F5TvgM8HZ3HkLtjVRW5fgjE75dm-sbe9aodgMZ5HikwdYLlkU2h2jdCfbL09TQPDoJAfBamEB6pKoPVva_v5k6ZJNwuoVK3SL5i5-_ISL1yPX_6KIUDzkD_HAhR52SdPV5xC6oqQBrLGKnagEkG82ua7eYHSkI87md96OTIXJa5c6mbtGHSkvDAesP4ulOAtfzqiCBVo-9jvfl-tE4H7wm9j27j8_3GKCntc"
  },
  {
    id: 6,
    category: "Seminar",
    title: "Brand Activation Booth",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBL3cHaiX10lRvPF-DA-PVqERSSJaCqEdq-JPjyQgnskVVlhn7tsujMfKpfWr39ViiXA_lbZ38okjwoMxh265TEG8eU_TMadOz97s4m-izAiQqS87VRHpeVZQeZ_qWNP3ffIn5-4T7sPYm7mJKMfoB7ETW2OGAoFq0o3Z-J1WtS03kzPBxwGC9VJA5LvUkbw_EQAb8j0BzzcsbRtcshVnkDjIWIwmq11fs515IfeRmFRb1X07ywYI1JS-M4On83VbeKAE21sc2lf3w",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];

const CATEGORIES = ["All", "Wedding", "Corporate", "Wisuda", "Gathering", "Seminar"] as const;

export default function Portfolio() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("All");
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);

  const filteredItems = activeCategory === "All" 
    ? PORTFOLIO_ITEMS 
    : PORTFOLIO_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="bg-[var(--color-surface-container-lowest)] min-h-screen pb-[var(--spacing-section-gap)]">
      {/* Header */}
      <section className="py-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent text-center">
        <h1 className="font-display-lg text-display-lg text-primary mb-4">
          {t("portfolio.title")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {t("portfolio.subtitle")}
        </p>
      </section>

      {/* Filter Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12 px-[var(--spacing-margin-mobile)]">
        {CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`font-label-md text-label-md px-6 py-2 rounded-full transition-all duration-300 cursor-pointer ${
              activeCategory === category
                ? "bg-[var(--color-primary-container)] text-white shadow-md font-bold"
                : "bg-white text-[var(--color-on-surface-variant)] border border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] hover:text-primary"
            }`}
          >
            {category === "All" ? t("portfolio.cat.all") : t(`portfolio.cat.${category.toLowerCase()}` as TranslationKey)}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-gutter)]">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => item.videoUrl && setModalVideoUrl(item.videoUrl)}
              className={`group relative rounded-xl overflow-hidden soft-shadow bg-[var(--color-surface)] aspect-[4/5] ${item.videoUrl ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Play video overlay badge */}
              {item.videoUrl && (
                <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-white rounded-full p-2.5 shadow-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-[var(--color-secondary-fixed)] font-caption text-caption mb-1 uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-white font-headline-md text-headline-md font-bold mb-2">
                  {item.title}
                </h3>
                {item.videoUrl && (
                  <span className="inline-flex items-center text-xs text-white/90 font-label-md">
                    <span className="material-symbols-outlined mr-1.5 text-sm">play_circle</span>
                    {t("portfolio.play_video")}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {modalVideoUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden aspect-video shadow-2xl">
            <button 
              onClick={() => setModalVideoUrl(null)}
              className="absolute -top-12 right-0 text-white flex items-center gap-1.5 font-label-md text-sm hover:text-white/80 cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
              Close
            </button>
            <iframe
              className="w-full h-full"
              src={modalVideoUrl}
              title="Portfolio Highlight Reel"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}
