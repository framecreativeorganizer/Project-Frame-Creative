"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

interface InvoiceData {
  id: string;
  invoiceNo: string;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  status: "UNPAID" | "DP_PAID" | "PAID";
  createdAt: string;
  booking: {
    clientName: string;
    clientWhatsapp: string;
    clientEmail: string;
    eventName: string;
    eventLocation: string;
    eventDate: string;
    eventTime: string;
    serviceName: string;
    packageName: string;
  };
}

export default function InvoiceDetail() {
  const params = useParams();
  const { t, language } = useLanguage();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const invoiceId = params.id as string;

  useEffect(() => {
    // Fetch settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) setSettings(data);
      })
      .catch((err) => console.error("Error loading settings:", err));

    if (invoiceId) {
      fetch(`/api/invoices/${invoiceId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && !data.error) {
            setInvoice(data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching invoice:", err);
          setLoading(false);
        });
    }
  }, [invoiceId]);

  const getFormatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "UNPAID":
        return (
          <span className="bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase font-caption">
            {t("invoice.status.unpaid")}
          </span>
        );
      case "DP_PAID":
        return (
          <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase font-caption">
            {t("invoice.status.dp")}
          </span>
        );
      case "PAID":
        return (
          <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-full text-xs font-bold uppercase font-caption">
            {t("invoice.status.paid")}
          </span>
        );
      default:
        return null;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-on-surface-variant font-body-md">Loading invoice details...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen py-20 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Invoice Not Found</h2>
        <Link href="/" className="text-primary hover:underline font-label-md">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-surface-container-lowest)] min-h-screen py-12 px-[var(--spacing-margin-mobile)] md:px-0">
      <div className="max-w-3xl mx-auto space-y-8 print:my-0">
        
        {/* Actions bar (hidden during print) */}
        <div className="flex justify-between items-center print:hidden bg-white border border-[var(--color-outline-variant)]/20 p-4 rounded-xl soft-shadow">
          <Link
            href="/dashboard"
            className="flex items-center text-sm font-label-md text-primary hover:underline"
          >
            <span className="material-symbols-outlined mr-1.5 text-sm">arrow_back</span>
            Portal Klien
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center border border-primary/20 hover:bg-[var(--color-surface-container-low)] text-primary font-label-md px-4 py-2 rounded-lg text-sm cursor-pointer"
            >
              <span className="material-symbols-outlined mr-1.5 text-sm">print</span>
              Print / PDF
            </button>
            {invoice.status !== "PAID" && (
              <Link
                href={`/payment/${invoice.id}`}
                className="bg-primary hover:opacity-90 text-white font-label-md px-5 py-2 rounded-lg text-sm shadow"
              >
                {t("invoice.pay_now")}
              </Link>
            )}
          </div>
        </div>
 
        {/* Invoice Page Container */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 soft-shadow print:border-0 print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
            <div>
              <h1 className="text-2xl font-bold font-headline-lg text-primary">
                FRAME CREATIVE
              </h1>
              <span className="text-xs text-gray-500 font-caption">Event Production & Photobooth Jasa</span>
            </div>
            <div className="text-left md:text-right">
              <h2 className="text-lg font-bold text-primary mb-1">INVOICE</h2>
              <span className="font-mono text-sm font-bold text-gray-600 block">{invoice.invoiceNo}</span>
              <span className="text-xs text-gray-400 font-caption">
                Date: {new Date(invoice.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
 
          {/* Client & Booking details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b text-sm">
            <div>
              <h4 className="font-bold text-primary mb-3 text-xs uppercase tracking-wider">BILLED TO:</h4>
              <div className="space-y-1.5 text-gray-700">
                <p className="font-bold text-primary">{invoice.booking.clientName}</p>
                <p>{invoice.booking.clientEmail}</p>
                <p>{invoice.booking.clientWhatsapp}</p>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-3 text-xs uppercase tracking-wider">EVENT PARAMETERS:</h4>
              <div className="space-y-1.5 text-gray-700">
                <p className="font-bold text-primary">{invoice.booking.eventName}</p>
                <p>{invoice.booking.eventLocation}</p>
                <p>
                  {new Date(invoice.booking.eventDate + "T00:00:00").toLocaleDateString(
                    language === "id" ? "id-ID" : "en-US",
                    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
                  )} @ {invoice.booking.eventTime}
                </p>
              </div>
            </div>
          </div>
 
          {/* Table summary of service cost */}
          <div className="py-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-xs text-gray-500 uppercase font-label-md">
                  <th className="pb-3">Service & Package Description</th>
                  <th className="pb-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b">
                  <td className="py-4">
                    <p className="font-bold text-primary">{invoice.booking.serviceName}</p>
                    <p className="text-xs text-gray-500 font-caption">Package: {invoice.booking.packageName}</p>
                  </td>
                  <td className="py-4 text-right font-bold text-primary">
                    {getFormatPrice(invoice.totalAmount)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
 
          {/* Totals, DP, Sisa */}
          <div className="flex flex-col items-end gap-3 text-sm py-4 border-b">
            <div className="flex justify-between w-64">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-bold text-primary">{getFormatPrice(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between w-64">
              <span className="text-gray-500">{t("invoice.deposit")}:</span>
              <span className="font-bold text-primary">{getFormatPrice(invoice.depositAmount)}</span>
            </div>
            <div className="flex justify-between w-64 pt-2 border-t">
              <span className="text-gray-500">Sisa Pelunasan:</span>
              <span className="font-bold text-primary">{getFormatPrice(invoice.balanceAmount)}</span>
            </div>
          </div>
 
          {/* Payment state and terms */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="max-w-md text-xs text-gray-400 leading-relaxed italic">
              {settings.terms_conditions || t("invoice.terms")}
            </div>
            <div className="text-right flex flex-col items-start md:items-end gap-2">
              <span className="text-xs text-gray-500 font-label-md">Payment Status</span>
              {getStatusBadge(invoice.status)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
