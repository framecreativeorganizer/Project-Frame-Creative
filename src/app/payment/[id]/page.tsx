"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

interface InvoiceData {
  id: string;
  invoiceNo: string;
  totalAmount: number;
  depositAmount: number;
  balanceAmount: number;
  status: "UNPAID" | "DP_PAID" | "PAID";
}

type PaymentMethod = "QRIS" | "BANK_TRANSFER" | "GATEWAY";

export default function PaymentSimulator() {
  const params = useParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<PaymentMethod>("QRIS");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

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
          console.error("Error loading invoice:", err);
          setLoading(false);
        });
    }
  }, [invoiceId]);

  const handleSimulatePayment = async (payType: "DP" | "FULL") => {
    setPaying(true);
    const targetStatus = payType === "DP" ? "DP_PAID" : "PAID";
    const amount = payType === "DP" ? invoice?.depositAmount : invoice?.totalAmount;

    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStatus,
          method,
          amount,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment update failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/invoice/${invoiceId}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Simulation failed, please try again.");
      setPaying(false);
    }
  };

  const getFormatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 text-center flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-on-surface-variant font-body-md">Loading payment portal...</p>
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
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Info panel */}
        <div className="bg-white border rounded-2xl p-6 md:p-8 soft-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs text-gray-500 font-label-md">Paying for Invoice</span>
            <h2 className="text-lg font-bold text-primary font-mono">{invoice.invoiceNo}</h2>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-gray-500 font-label-md block">Total Billing</span>
            <span className="text-xl font-bold text-primary">{getFormatPrice(invoice.totalAmount)}</span>
          </div>
        </div>

        {/* Payment simulator methods layout */}
        <div className="bg-white border rounded-2xl p-8 soft-shadow space-y-6">
          <h3 className="font-headline-md text-base text-primary font-bold border-b pb-4">
            {t("payment.title")}
          </h3>

          {/* Methods select grid */}
          <div className="grid grid-cols-3 gap-3">
            {(["QRIS", "BANK_TRANSFER", "GATEWAY"] as PaymentMethod[]).map((m) => (
              <button
                key={m}
                onClick={() => setMethod(m)}
                className={`p-4 rounded-xl border text-center font-label-md text-xs transition-all cursor-pointer ${
                  method === m
                    ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                    : "border-gray-200 bg-white text-gray-500 hover:bg-[var(--color-surface-container-low)]"
                }`}
              >
                {m === "QRIS" ? "QRIS" : m === "BANK_TRANSFER" ? "Bank Transfer" : "Credit Card"}
              </button>
            ))}
          </div>

          {/* Method specific layout display */}
          <div className="bg-[var(--color-surface-container-low)] border border-gray-100 p-6 rounded-xl text-center">
            {method === "QRIS" && (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm w-44 h-44 flex items-center justify-center relative overflow-hidden">
                  {settings.qris_image ? (
                    <img
                      src={settings.qris_image}
                      alt="QRIS Code"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    /* Visual QR Code simulator mockup box */
                    <div className="w-full h-full border border-dashed border-gray-300 rounded flex flex-col items-center justify-center p-2 text-primary">
                      <span className="material-symbols-outlined text-5xl">qr_code_2</span>
                      <span className="text-[9px] font-bold tracking-widest mt-1">
                        {settings.qris_name || "FRAME QRIS"}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 max-w-sm">
                  {t("payment.qris.desc")}
                </p>
              </div>
            )}

            {method === "BANK_TRANSFER" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm inline-block">
                  <span className="text-xs text-gray-500 font-label-md block">BCA Virtual Account</span>
                  <span className="font-bold text-lg text-primary font-mono select-all">
                    {settings.bank_transfer_va || "8802-0877-8472-8972"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 max-w-sm mx-auto">
                  {settings.bank_transfer_instruction || t("payment.bank.desc")} <br />
                  <strong>{settings.bank_transfer_info || t("payment.bank.account")}</strong>
                </p>
              </div>
            )}

            {method === "GATEWAY" && (
              <div className="max-w-md mx-auto space-y-4 text-left">
                <div>
                  <label className="block text-xs font-label-md text-gray-500 mb-1.5">Card Number</label>
                  <input
                    type="text"
                    disabled
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-label-md text-gray-500 mb-1.5">Expiry</label>
                    <input
                      type="text"
                      disabled
                      placeholder="12/28"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-label-md text-gray-500 mb-1.5">CVV</label>
                    <input
                      type="text"
                      disabled
                      placeholder="123"
                      className="w-full bg-white border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Trigger payment actions */}
          {!success ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
              {invoice.status === "UNPAID" && (
                <button
                  onClick={() => handleSimulatePayment("DP")}
                  disabled={paying}
                  className="border border-primary/20 text-primary font-label-md py-3 rounded-lg hover:bg-[var(--color-surface-container-low)] text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {paying ? "Processing..." : t("payment.simulate.dp")}
                </button>
              )}
              <button
                onClick={() => handleSimulatePayment("FULL")}
                disabled={paying}
                className="bg-primary hover:opacity-95 text-white font-label-md py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {paying ? "Processing..." : t("payment.simulate.full")}
              </button>
            </div>
          ) : (
            <div className="text-center py-6 text-green-600 space-y-2 flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl animate-bounce">check_circle</span>
              <h4 className="font-bold font-headline-md text-base">{t("payment.success")}</h4>
              <p className="text-xs text-gray-500">Redirecting back to invoice...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
