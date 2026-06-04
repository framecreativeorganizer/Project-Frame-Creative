"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

interface DBBooking {
  id: string;
  clientName: string;
  clientWhatsapp: string;
  clientEmail: string;
  eventName: string;
  eventLocation: string;
  eventDate: string;
  eventTime: string;
  packageName: string;
  serviceName: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  invoice: {
    id: string;
    invoiceNo: string;
    totalAmount: number;
    depositAmount: number;
    balanceAmount: number;
    status: "UNPAID" | "DP_PAID" | "PAID";
  } | null;
}

export default function ClientDashboard() {
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<DBBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("client@example.com"); // default pre-seeded client

  const fetchBookings = () => {
    setLoading(true);
    fetch("/api/bookings")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading dashboard:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, []);

  const getFormatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Filter bookings based on the client email input
  const filteredBookings = bookings.filter(
    (b) => b.clientEmail.trim().toLowerCase() === searchEmail.trim().toLowerCase()
  );

  return (
    <div className="bg-[var(--color-surface-container-lowest)] min-h-screen pb-[var(--spacing-section-gap)]">
      {/* Header */}
      <section className="py-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent">
        <div className="max-w-[var(--spacing-container-max)] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="font-display-lg text-display-lg text-primary mb-2">
              {t("dashboard.title")}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {t("dashboard.subtitle")}
            </p>
          </div>
          
          {/* Active Email selection selector */}
          <div className="bg-white border p-4 rounded-xl soft-shadow flex flex-col gap-2 w-full md:w-80">
            <label className="block text-xs font-label-md text-gray-500 uppercase tracking-wider">
              Viewing Client Space for:
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="client@example.com"
                className="flex-1 bg-[var(--color-surface-container-low)] border border-gray-200 rounded px-3 py-1.5 text-xs text-primary font-bold focus:outline-none"
              />
              <button 
                onClick={fetchBookings}
                className="bg-primary text-white text-xs px-3 rounded hover:opacity-90"
              >
                Sync
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main dashboard content */}
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        {loading ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-on-surface-variant font-body-md">Loading portal bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border p-12 text-center max-w-xl mx-auto soft-shadow space-y-4">
            <span className="material-symbols-outlined text-5xl text-gray-300">receipt_long</span>
            <p className="font-body-md text-on-surface-variant">
              {t("dashboard.empty")}
            </p>
            <p className="text-xs text-gray-500 font-caption">
              Create a new event booking or sync using <strong className="text-primary">client@example.com</strong> (seeded mock email) or the email you filled during booking.
            </p>
            <Link
              href="/booking"
              className="inline-block bg-primary text-white font-label-md text-sm px-6 py-2.5 rounded-lg shadow mt-2"
            >
              Book Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Bookings & Invoices list column */}
            <div className="lg:col-span-2 space-y-6">
              {filteredBookings.map((booking) => {
                const hasInvoice = !!booking.invoice;
                return (
                  <div
                    key={booking.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 soft-shadow flex flex-col md:flex-row justify-between gap-6 hover:border-primary/30 transition-all"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-headline-md text-base text-primary">
                          {booking.eventName}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase font-caption ${
                            booking.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-gray-600">
                        <p>
                          <strong>Category:</strong> {booking.serviceName}
                        </p>
                        <p>
                          <strong>Package:</strong> {booking.packageName}
                        </p>
                        <p>
                          <strong>Date:</strong> {new Date(booking.eventDate + "T00:00:00").toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Location:</strong> {booking.eventLocation}
                        </p>
                      </div>
                    </div>

                    {/* Invoice status and actions */}
                    {hasInvoice && (
                      <div className="flex flex-col justify-between items-start md:items-end gap-3 md:border-l md:pl-6 border-gray-100 min-w-52">
                        <div className="text-left md:text-right">
                          <span className="text-[10px] text-gray-400 block font-mono">
                            {booking.invoice?.invoiceNo}
                          </span>
                          <span className="font-bold text-primary block my-0.5">
                            {getFormatPrice(booking.invoice?.totalAmount || 0)}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-caption ${
                              booking.invoice?.status === "PAID"
                                ? "bg-green-100 text-green-800"
                                : booking.invoice?.status === "DP_PAID"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.invoice?.status === "PAID"
                              ? t("invoice.status.paid")
                              : booking.invoice?.status === "DP_PAID"
                              ? t("invoice.status.dp")
                              : t("invoice.status.unpaid")}
                          </span>
                        </div>

                        <div className="flex gap-2 w-full">
                          <Link
                            href={`/invoice/${booking.invoice?.id}`}
                            className="flex-1 text-center border border-primary/20 hover:bg-[var(--color-surface-container-low)] text-primary font-caption text-xs py-1.5 rounded transition-colors"
                          >
                            View Invoice
                          </Link>
                          {booking.invoice?.status !== "PAID" && (
                            <Link
                              href={`/payment/${booking.invoice?.id}`}
                              className="flex-1 text-center bg-primary text-white hover:opacity-90 font-caption text-xs py-1.5 rounded transition-colors shadow"
                            >
                              Pay Now
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Media delivery column */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6 soft-shadow space-y-6">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <span className="material-symbols-outlined">photo_library</span>
                  <h3 className="font-headline-md text-base">{t("dashboard.files")}</h3>
                </div>
                <p className="text-xs text-[var(--color-on-surface-variant)] leading-relaxed">
                  * Download high-resolution photo prints, GIFs, and cinematic highlights after event completion.
                </p>

                <div className="space-y-4">
                  {filteredBookings.map((b) => {
                    const isConfirmed = b.status === "CONFIRMED";
                    return (
                      <div
                        key={b.id}
                        className="p-4 rounded-xl border bg-[var(--color-surface-container-low)] text-xs space-y-3"
                      >
                        <div>
                          <strong className="text-primary block">{b.eventName}</strong>
                          <span className="text-[10px] text-gray-500 font-caption">{b.serviceName}</span>
                        </div>

                        {isConfirmed ? (
                          <div className="space-y-2">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded uppercase font-caption">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                              {t("dashboard.files.ready")}
                            </span>
                            <a
                              href="https://drive.google.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-center block bg-primary hover:opacity-90 text-white font-caption text-[11px] py-1.5 rounded shadow"
                            >
                              {t("dashboard.files.access")}
                            </a>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase font-caption">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            {t("dashboard.files.pending")}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
