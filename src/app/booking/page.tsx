"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { TranslationKey } from "@/lib/translations";

interface DBService {
  id: string;
  name: string;
  description: string;
}

interface DBPackage {
  id: string;
  serviceName: string;
  name: string;
  price: number;
  duration: string;
  features: string;
}

type FormStep = 1 | 2 | 3 | 4;

function BookingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  // Route query params preselection
  const queryService = searchParams.get("service") || "Photobooth Event";
  const queryPackage = searchParams.get("package") || "premium";

  // Data fetching state
  const [services, setServices] = useState<DBService[]>([]);
  const [packages, setPackages] = useState<DBPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Wizard state
  const [step, setStep] = useState<FormStep>(1);
  const [selectedService, setSelectedService] = useState(queryService);
  const [selectedPackage, setSelectedPackage] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("18:00");
  
  // Client details
  const [clientName, setClientName] = useState("");
  const [clientWhatsapp, setClientWhatsapp] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Mock booked dates for availability checks
  const bookedDates = ["2026-06-15", "2026-06-20", "2026-06-25", "2026-07-04"];
  const pendingDates = ["2026-06-10", "2026-06-28", "2026-07-12"];

  useEffect(() => {
    fetch("/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.services) setServices(data.services);
        if (data.packages) {
          setPackages(data.packages);
          // Set preselected package from query params
          const match = data.packages.find(
            (p: DBPackage) =>
              p.serviceName.toLowerCase() === queryService.toLowerCase() &&
              p.name.toLowerCase() === queryPackage.toLowerCase()
          );
          if (match) {
            setSelectedPackage(match.name);
          } else {
            const firstOfService = data.packages.find((p: DBPackage) => p.serviceName === queryService);
            if (firstOfService) setSelectedPackage(firstOfService.name);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading services:", err);
        setLoading(false);
      });
  }, [queryService, queryPackage]);

  // Adjust package list when service changes
  const activePackages = packages.filter((p) => p.serviceName === selectedService);

  const getSelectedPackageObj = () => {
    return activePackages.find((p) => p.name === selectedPackage);
  };

  const getFormatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Availability calendar status helper
  const getDateStatus = (dateStr: string) => {
    if (!dateStr) return "Available";
    if (bookedDates.includes(dateStr)) return "Booked";
    if (pendingDates.includes(dateStr)) return "Pending";
    return "Available";
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setFormError("");

    const pkg = getSelectedPackageObj();
    const totalPrice = pkg ? pkg.price : 2500000;

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientWhatsapp,
          clientEmail,
          eventName,
          eventLocation,
          eventDate,
          eventTime,
          packageName: selectedPackage,
          serviceName: selectedService,
          notes,
          totalPrice,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat booking.");
      }

      // Redirect to invoice page
      router.push(`/invoice/${data.invoiceId}`);
    } catch (err: unknown) {
      setSubmitting(false);
      setFormError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center flex flex-col items-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-on-surface-variant font-body-md">Loading wizard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Steps indicator bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 bg-[var(--color-surface-container-low)] p-4 rounded-xl border border-[var(--color-outline-variant)]/20 shadow-sm">
        <button
          type="button"
          onClick={() => step > 1 && setStep(1)}
          className={`w-full text-center font-label-md py-2.5 rounded-lg text-xs md:text-sm transition-all cursor-pointer ${
            step >= 1 ? "bg-primary text-white font-bold shadow-sm" : "bg-white/40 text-gray-400 border border-gray-200/50"
          }`}
        >
          {t("booking.step.1")}
        </button>
        <button
          type="button"
          onClick={() => step > 2 && setStep(2)}
          className={`w-full text-center font-label-md py-2.5 rounded-lg text-xs md:text-sm transition-all cursor-pointer ${
            step >= 2 ? "bg-primary text-white font-bold shadow-sm" : "bg-white/40 text-gray-400 border border-gray-200/50"
          }`}
        >
          {t("booking.step.2")}
        </button>
        <button
          type="button"
          onClick={() => step > 3 && setStep(3)}
          className={`w-full text-center font-label-md py-2.5 rounded-lg text-xs md:text-sm transition-all cursor-pointer ${
            step >= 3 ? "bg-primary text-white font-bold shadow-sm" : "bg-white/40 text-gray-400 border border-gray-200/50"
          }`}
        >
          {t("booking.step.3")}
        </button>
        <button
          type="button"
          disabled={!clientName || !clientWhatsapp || !clientEmail}
          onClick={() => step > 4 && setStep(4)}
          className={`w-full text-center font-label-md py-2.5 rounded-lg text-xs md:text-sm transition-all ${
            step >= 4 ? "bg-primary text-white font-bold shadow-sm" : "bg-white/40 text-gray-400 border border-gray-200/50"
          }`}
        >
          {t("booking.step.4")}
        </button>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-500 shrink-0">error</span>
          <p className="text-red-700 text-sm">{formError}</p>
        </div>
      )}

      {/* STEP 1: Select Service & Package */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-3 font-bold">
              Select Service Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {services.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => {
                    setSelectedService(s.name);
                    const pkgs = packages.filter((p) => p.serviceName === s.name);
                    if (pkgs.length > 0) setSelectedPackage(pkgs[0].name);
                  }}
                  className={`p-4 rounded-xl border text-center font-label-md text-xs md:text-sm transition-all cursor-pointer ${
                    selectedService === s.name
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                      : "border-[var(--color-outline-variant)] bg-white text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-low)]"
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-3 font-bold">
              Select Package Tier
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activePackages.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelectedPackage(p.name)}
                  className={`p-6 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    selectedPackage === p.name
                      ? "border-primary bg-primary/5 shadow-md"
                      : "border-[var(--color-outline-variant)] bg-white hover:bg-[var(--color-surface-container-low)]"
                  }`}
                >
                  <div className="w-full">
                    <span className="font-headline-md text-base text-primary font-bold block mb-1">
                      {p.name}
                    </span>
                    <span className="font-caption text-xs text-gray-500 block mb-3">
                      Duration: {p.duration}
                    </span>

                    {/* Features list inside selector */}
                    <ul className="space-y-2 mt-3 border-t pt-3 border-[var(--color-outline-variant)]/20 w-full">
                      {p.features && p.features.split(",").map((feat, idx) => (
                        <li key={idx} className="flex items-start text-[11px] text-[var(--color-on-surface-variant)] leading-tight">
                          <span className="material-symbols-outlined text-[var(--color-secondary)] mr-1.5 text-[14px] shrink-0 font-bold">
                            check
                          </span>
                          <span className="break-words">{feat.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="text-base font-bold text-primary block mt-4 border-t pt-3 border-[var(--color-outline-variant)]/10 w-full text-right">
                    {getFormatPrice(p.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="bg-primary text-white font-label-md px-8 py-3 rounded-lg hover:bg-primary/95 shadow cursor-pointer"
            >
              Continue to Schedule
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Date & Time & availability calendar */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-3 font-bold">
                {t("booking.form.date")} <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-white border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface font-body-md"
              />

              <div className="mt-6">
                <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-3 font-bold">
                  {t("booking.form.time")} <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  required
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-white border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface font-body-md"
                />
              </div>

              {eventDate && (
                <div className="mt-6 p-4 rounded-xl border flex items-center gap-3 bg-[var(--color-surface-container-low)]">
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      getDateStatus(eventDate) === "Available"
                        ? "bg-green-500"
                        : getDateStatus(eventDate) === "Pending"
                        ? "bg-amber-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  <span className="font-label-md text-sm text-primary">
                    Status for {eventDate}: <strong>{t(`calendar.${getDateStatus(eventDate).toLowerCase()}` as TranslationKey)}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Interactive Availability Indicator Calendar */}
            <div className="bg-white p-6 rounded-xl border border-[var(--color-outline-variant)]/20 soft-shadow">
              <h3 className="font-headline-md text-sm text-primary font-bold mb-4 uppercase tracking-wider">
                {t("calendar.title")}
              </h3>
              <p className="text-xs text-gray-500 mb-6 font-caption">
                * View mock booking schedules to check availability.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b">
                  <span className="font-bold text-primary">Sample Dates</span>
                  <span className="font-bold text-primary">Status</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>2026-06-10 (Corporate Gala)</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-caption font-bold">
                    {t("calendar.pending")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>2026-06-15 (Wedding Booking)</span>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-caption font-bold">
                    {t("calendar.booked")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>2026-06-20 (Mahasiswa Graduation)</span>
                  <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-caption font-bold">
                    {t("calendar.booked")}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Other Dates</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded font-caption font-bold">
                    {t("calendar.available")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="border border-primary/20 text-primary font-label-md px-8 py-3 rounded-lg hover:bg-[var(--color-surface-container-low)] cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!eventDate || !eventTime}
              onClick={() => setStep(3)}
              className="bg-primary text-white font-label-md px-8 py-3 rounded-lg hover:bg-primary/95 shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Details
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Client Details */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-2 font-bold">
                {t("booking.form.name")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t("booking.form.name.placeholder")}
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-white border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>

            <div>
              <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-2 font-bold">
                {t("booking.form.whatsapp")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t("booking.form.whatsapp.placeholder")}
                value={clientWhatsapp}
                onChange={(e) => setClientWhatsapp(e.target.value)}
                className="w-full bg-white border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-2 font-bold">
                {t("booking.form.email")} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder={t("booking.form.email.placeholder")}
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full bg-white border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>

            <div>
              <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-2 font-bold">
                {t("booking.form.event_name")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t("booking.form.event_name.placeholder")}
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full bg-white border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>
          </div>

          <div>
            <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-2 font-bold">
              {t("booking.form.location")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={t("booking.form.location.placeholder")}
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              className="w-full bg-white border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
            />
          </div>

          <div>
            <label className="block text-[var(--color-on-surface)] font-label-md text-sm mb-2">
              {t("booking.form.notes")} <span className="text-[var(--color-outline)] font-normal">{t("booking.form.notes.optional")}</span>
            </label>
            <textarea
              rows={4}
              placeholder={t("booking.form.notes.placeholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-[var(--color-outline-variant)] rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface"
            ></textarea>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="border border-primary/20 text-primary font-label-md px-8 py-3 rounded-lg hover:bg-[var(--color-surface-container-low)] cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!clientName || !clientWhatsapp || !clientEmail || !eventName || !eventLocation}
              onClick={() => setStep(4)}
              className="bg-primary text-white font-label-md px-8 py-3 rounded-lg hover:bg-primary/95 shadow cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review Booking
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Review & Confirm */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-[var(--color-surface-container-low)] border rounded-2xl p-6 md:p-8 space-y-4">
            <h3 className="font-headline-md text-lg text-primary font-bold border-b pb-3">
              Booking Overview
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block">Service Selected:</span>
                <span className="font-bold text-primary">{selectedService}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Package Tier:</span>
                <span className="font-bold text-primary">{selectedPackage}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Event Date:</span>
                <span className="font-bold text-primary">{eventDate}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Event Start Time:</span>
                <span className="font-bold text-primary">{eventTime}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Client Name:</span>
                <span className="font-bold text-primary">{clientName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">WhatsApp Number:</span>
                <span className="font-bold text-primary">{clientWhatsapp}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Event Name:</span>
                <span className="font-bold text-primary">{eventName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Venue Location:</span>
                <span className="font-bold text-primary">{eventLocation}</span>
              </div>
            </div>

            <div className="border-t pt-4 mt-6 flex justify-between items-center">
              <span className="text-base text-gray-600 font-label-md">Total Service Cost:</span>
              <span className="text-2xl font-bold text-primary">
                {getFormatPrice(getSelectedPackageObj()?.price || 2500000)}
              </span>
            </div>

            <div className="bg-[var(--color-secondary-fixed)]/20 border border-[var(--color-secondary)]/10 p-4 rounded-xl text-xs text-primary flex items-start gap-3">
              <span className="material-symbols-outlined shrink-0 text-sm">info</span>
              <p>
                * An invoice code will be generated immediately. <strong>50% Deposit (DP)</strong> payment is required to confirm date locks.
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              disabled={submitting}
              onClick={() => setStep(3)}
              className="border border-primary/20 text-primary font-label-md px-8 py-3 rounded-lg hover:bg-[var(--color-surface-container-low)] cursor-pointer disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="bg-primary text-white font-label-md px-8 py-3.5 rounded-lg hover:bg-primary/95 shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("booking.form.submitting")}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">assignment_turned_in</span>
                  {t("booking.form.submit")}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Booking() {
  const { t } = useLanguage();

  return (
    <div className="bg-[var(--color-surface-container-lowest)] min-h-screen pb-[var(--spacing-section-gap)]">
      <section className="py-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent text-center">
        <h1 className="font-display-lg text-display-lg text-primary mb-4">
          {t("booking.title")}
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          {t("booking.subtitle")}
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-[var(--spacing-margin-mobile)] md:px-0">
        <div className="bg-white border border-[var(--color-outline-variant)]/20 rounded-2xl p-8 md:p-10 soft-shadow">
          <Suspense fallback={<div className="text-center">Loading wizard...</div>}>
            <BookingWizard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
