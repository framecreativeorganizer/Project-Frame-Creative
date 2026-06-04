"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/lib/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

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

type Tab = "bookings" | "calendar" | "pricing" | "settings";

// ─── Modal Overlay ────────────────────────────────────────────────────────────

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 z-10 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-md text-lg text-primary font-bold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────

function Toast({
  message,
  type,
}: {
  message: string;
  type: "success" | "error";
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-sm font-bold animate-slide-up ${
        type === "success"
          ? "bg-green-600 text-white"
          : "bg-red-600 text-white"
      }`}
    >
      <span className="material-symbols-outlined text-base">
        {type === "success" ? "check_circle" : "error"}
      </span>
      {message}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { t } = useLanguage();

  // ── Bookings state ──
  const [bookings, setBookings] = useState<DBBooking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ── Services & Packages state ──
  const [services, setServices] = useState<DBService[]>([]);
  const [packages, setPackages] = useState<DBPackage[]>([]);
  const [loadingPricing, setLoadingPricing] = useState(true);
  const [mutatingId, setMutatingId] = useState<string | null>(null);

  // ── Settings state ──
  const [settingsForm, setSettingsForm] = useState({
    whatsapp_number: "",
    bank_transfer_va: "",
    bank_transfer_info: "",
    bank_transfer_instruction: "",
    qris_name: "",
    terms_conditions: "",
    qris_image: "",
  });
  const [uploadingQris, setUploadingQris] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // ── UI state ──
  const [activeTab, setActiveTab] = useState<Tab>("bookings");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ── Modal state ──
  type ModalType =
    | "add-service"
    | "edit-service"
    | "add-package"
    | "edit-package"
    | "delete-service"
    | "delete-package"
    | null;

  const [modal, setModal] = useState<ModalType>(null);
  const [editingService, setEditingService] = useState<DBService | null>(null);
  const [editingPackage, setEditingPackage] = useState<DBPackage | null>(null);
  const [deletingService, setDeletingService] = useState<DBService | null>(null);
  const [deletingPackage, setDeletingPackage] = useState<DBPackage | null>(null);

  // ── Form state ──
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    benefits: "",
    imageUrl: "",
  });
  const [packageForm, setPackageForm] = useState({
    serviceName: "",
    name: "",
    price: "",
    duration: "",
    description: "",
    features: "",
  });

  // ─── Utilities ────────────────────────────────────────────────────────────

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const closeModal = () => {
    setModal(null);
    setEditingService(null);
    setEditingPackage(null);
    setDeletingService(null);
    setDeletingPackage(null);
  };

  // ─── Data Fetching ────────────────────────────────────────────────────────

  const fetchBookings = useCallback(() => {
    setLoadingBookings(true);
    fetch("/api/bookings")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBookings(data);
        setLoadingBookings(false);
      })
      .catch(() => setLoadingBookings(false));
  }, []);

  const fetchPricing = useCallback(() => {
    setLoadingPricing(true);
    Promise.all([
      fetch("/api/admin/services").then((r) => r.json()),
      fetch("/api/admin/packages").then((r) => r.json()),
    ])
      .then(([svcData, pkgData]) => {
        if (svcData.services) setServices(svcData.services);
        if (pkgData.packages) setPackages(pkgData.packages);
        setLoadingPricing(false);
      })
      .catch(() => setLoadingPricing(false));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (activeTab === "pricing") fetchPricing();
  }, [activeTab, fetchPricing]);

  const fetchSettings = useCallback(() => {
    setLoadingSettings(true);
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettingsForm({
          whatsapp_number: data.whatsapp_number || "",
          bank_transfer_va: data.bank_transfer_va || "",
          bank_transfer_info: data.bank_transfer_info || "",
          bank_transfer_instruction: data.bank_transfer_instruction || "",
          qris_name: data.qris_name || "",
          terms_conditions: data.terms_conditions || "",
          qris_image: data.qris_image || "",
        });
        setLoadingSettings(false);
      })
      .catch(() => setLoadingSettings(false));
  }, []);

  useEffect(() => {
    if (activeTab === "settings") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSettings();
    }
  }, [activeTab, fetchSettings]);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm),
      });
      if (!res.ok) throw new Error();
      showToast("Configuration saved successfully!", "success");
    } catch {
      showToast("Failed to save configuration.", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleUploadQris = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingQris(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error();
      }

      const data = await res.json();
      setSettingsForm((prev) => ({
        ...prev,
        qris_image: data.url,
      }));
      showToast("QR Code uploaded successfully!", "success");
    } catch {
      showToast("Failed to upload QR Code.", "error");
    } finally {
      setUploadingQris(false);
    }
  };

  // ─── Booking Actions ──────────────────────────────────────────────────────

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_booking_status", bookingId, status }),
      });
      if (!res.ok) throw new Error();
      fetchBookings();
    } catch {
      alert("Action failed, please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleUpdateInvoiceStatus = async (invoiceId: string, status: string) => {
    setUpdatingId(invoiceId);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_invoice_status", invoiceId, status }),
      });
      if (!res.ok) throw new Error();
      fetchBookings();
    } catch {
      alert("Action failed, please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ─── Service Actions ──────────────────────────────────────────────────────

  const openAddService = () => {
    setServiceForm({ name: "", description: "", benefits: "", imageUrl: "" });
    setModal("add-service");
  };

  const openEditService = (svc: DBService) => {
    setEditingService(svc);
    setServiceForm({
      name: svc.name,
      description: svc.description,
      benefits: svc.benefits,
      imageUrl: svc.imageUrl,
    });
    setModal("edit-service");
  };

  const openDeleteService = (svc: DBService) => {
    setDeletingService(svc);
    setModal("delete-service");
  };

  const handleSaveService = async () => {
    if (!serviceForm.name || !serviceForm.description) {
      showToast("Name and description are required.", "error");
      return;
    }
    const isEdit = modal === "edit-service";
    const url = isEdit
      ? `/api/admin/services/${editingService!.id}`
      : "/api/admin/services";
    const method = isEdit ? "PUT" : "POST";
    setMutatingId("service-save");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serviceForm),
      });
      if (!res.ok) throw new Error();
      closeModal();
      fetchPricing();
      showToast(isEdit ? "Service updated!" : "Service created!", "success");
    } catch {
      showToast("Operation failed, please try again.", "error");
    } finally {
      setMutatingId(null);
    }
  };

  const handleDeleteService = async () => {
    if (!deletingService) return;
    setMutatingId("service-delete");
    try {
      const res = await fetch(`/api/admin/services/${deletingService.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      closeModal();
      fetchPricing();
      showToast("Service deleted.", "success");
    } catch {
      showToast("Delete failed, please try again.", "error");
    } finally {
      setMutatingId(null);
    }
  };

  // ─── Package Actions ──────────────────────────────────────────────────────

  const openAddPackage = (serviceName = "") => {
    setPackageForm({
      serviceName: serviceName || (services[0]?.name ?? ""),
      name: "",
      price: "",
      duration: "",
      description: "",
      features: "",
    });
    setModal("add-package");
  };

  const openEditPackage = (pkg: DBPackage) => {
    setEditingPackage(pkg);
    setPackageForm({
      serviceName: pkg.serviceName,
      name: pkg.name,
      price: String(pkg.price),
      duration: pkg.duration,
      description: pkg.description,
      features: pkg.features,
    });
    setModal("edit-package");
  };

  const openDeletePackage = (pkg: DBPackage) => {
    setDeletingPackage(pkg);
    setModal("delete-package");
  };

  const handleSavePackage = async () => {
    if (!packageForm.serviceName || !packageForm.name || !packageForm.price) {
      showToast("Service, name, and price are required.", "error");
      return;
    }
    const isEdit = modal === "edit-package";
    const url = isEdit
      ? `/api/admin/packages/${editingPackage!.id}`
      : "/api/admin/packages";
    const method = isEdit ? "PUT" : "POST";
    setMutatingId("package-save");
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...packageForm,
          price: parseFloat(packageForm.price),
        }),
      });
      if (!res.ok) throw new Error();
      closeModal();
      fetchPricing();
      showToast(isEdit ? "Package updated!" : "Package created!", "success");
    } catch {
      showToast("Operation failed, please try again.", "error");
    } finally {
      setMutatingId(null);
    }
  };

  const handleDeletePackage = async () => {
    if (!deletingPackage) return;
    setMutatingId("package-delete");
    try {
      const res = await fetch(`/api/admin/packages/${deletingPackage.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      closeModal();
      fetchPricing();
      showToast("Package deleted.", "success");
    } catch {
      showToast("Delete failed, please try again.", "error");
    } finally {
      setMutatingId(null);
    }
  };

  // ─── Grouped packages helper ──────────────────────────────────────────────

  const packagesByService = services.map((svc) => ({
    service: svc,
    packages: packages.filter((p) => p.serviceName === svc.name),
  }));

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="bg-[var(--color-surface-container-lowest)] min-h-screen pb-[var(--spacing-section-gap)]">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* ── Modals ─────────────────────────────────────────────────────── */}

      {/* Add / Edit Service Modal */}
      {(modal === "add-service" || modal === "edit-service") && (
        <Modal
          title={modal === "add-service" ? "Add New Service" : "Edit Service"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Photobooth Event"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm((f) => ({ ...f, name: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Brief description of the service..."
                value={serviceForm.description}
                onChange={(e) =>
                  setServiceForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Benefits{" "}
                <span className="text-gray-400 font-normal">
                  (comma-separated)
                </span>
              </label>
              <input
                type="text"
                placeholder="Professional setup, HD quality, ..."
                value={serviceForm.benefits}
                onChange={(e) =>
                  setServiceForm((f) => ({ ...f, benefits: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Image URL{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={serviceForm.imageUrl}
                onChange={(e) =>
                  setServiceForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveService}
                disabled={!!mutatingId}
                className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg text-sm hover:bg-primary/90 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mutatingId === "service-save" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-sm">save</span>
                )}
                {modal === "add-service" ? "Create Service" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Package Modal */}
      {(modal === "add-package" || modal === "edit-package") && (
        <Modal
          title={modal === "add-package" ? "Add New Package" : "Edit Package"}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Service <span className="text-red-500">*</span>
              </label>
              <select
                value={packageForm.serviceName}
                onChange={(e) =>
                  setPackageForm((f) => ({ ...f, serviceName: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Package Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Basic, Premium"
                  value={packageForm.name}
                  onChange={(e) =>
                    setPackageForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5">
                  Price (IDR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2500000"
                  value={packageForm.price}
                  onChange={(e) =>
                    setPackageForm((f) => ({ ...f, price: e.target.value }))
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g. 4 Hours, Full Day"
                value={packageForm.duration}
                onChange={(e) =>
                  setPackageForm((f) => ({ ...f, duration: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Short Description
              </label>
              <input
                type="text"
                placeholder="One-line summary of this package..."
                value={packageForm.description}
                onChange={(e) =>
                  setPackageForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">
                Features{" "}
                <span className="text-gray-400 font-normal">
                  (comma-separated)
                </span>
              </label>
              <textarea
                rows={3}
                placeholder="Unlimited prints, Digital copies, ..."
                value={packageForm.features}
                onChange={(e) =>
                  setPackageForm((f) => ({ ...f, features: e.target.value }))
                }
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePackage}
                disabled={!!mutatingId}
                className="flex-1 bg-primary text-white font-bold py-2.5 rounded-lg text-sm hover:bg-primary/90 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mutatingId === "package-save" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-sm">save</span>
                )}
                {modal === "add-package" ? "Create Package" : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Service Confirmation */}
      {modal === "delete-service" && deletingService && (
        <Modal title="Delete Service" onClose={closeModal}>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-0.5">warning</span>
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">
                  This action cannot be undone.
                </p>
                <p className="text-xs text-red-600">
                  Deleting{" "}
                  <strong>&ldquo;{deletingService.name}&rdquo;</strong> will
                  permanently remove the service. Associated packages may also
                  be affected.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
                disabled={!!mutatingId}
                className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-red-700 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mutatingId === "service-delete" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-sm">delete</span>
                )}
                Delete Service
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Package Confirmation */}
      {modal === "delete-package" && deletingPackage && (
        <Modal title="Delete Package" onClose={closeModal}>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 mt-0.5">warning</span>
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">
                  This action cannot be undone.
                </p>
                <p className="text-xs text-red-600">
                  Delete package{" "}
                  <strong>
                    &ldquo;{deletingPackage.name}&rdquo; ({deletingPackage.serviceName})
                  </strong>{" "}
                  priced at{" "}
                  <strong>{formatPrice(deletingPackage.price)}</strong>?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-lg text-sm hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePackage}
                disabled={!!mutatingId}
                className="flex-1 bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm hover:bg-red-700 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {mutatingId === "package-delete" ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-sm">delete</span>
                )}
                Delete Package
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <section className="py-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] bg-gradient-to-b from-[var(--color-surface-container-low)] to-transparent">
        <div className="max-w-[var(--spacing-container-max)] mx-auto">
          <h1 className="font-display-lg text-display-lg text-primary mb-2">
            {t("admin.title")}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {t("admin.subtitle")}
          </p>
        </div>
      </section>

      {/* ── Dashboard Content ─────────────────────────────────────────────── */}
      <div className="max-w-[var(--spacing-container-max)] mx-auto px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] space-y-6">

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200">
          {(
            [
              { key: "bookings", label: t("admin.all_bookings") },
              { key: "calendar", label: t("admin.calendar_control") },
              { key: "pricing", label: "Services & Pricing" },
              { key: "settings", label: "Settings" },
            ] as { key: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-label-md text-sm transition-all cursor-pointer ${
                activeTab === tab.key
                  ? "border-b-2 border-primary text-primary font-bold"
                  : "text-gray-400 hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: BOOKINGS ─────────────────────────────────────────────── */}
        {activeTab === "bookings" && (
          loadingBookings ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-on-surface-variant font-body-md">Syncing bookings...</p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl overflow-hidden soft-shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--color-surface-container-low)] text-xs text-gray-500 font-label-md uppercase border-b">
                      <th className="p-4">Invoice / Event</th>
                      <th className="p-4">Client Detail</th>
                      <th className="p-4">Schedule</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4 text-center">{t("admin.actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-gray-700 divide-y">
                    {bookings.map((booking) => {
                      const isUpdating = !!(
                        updatingId === booking.id ||
                        (booking.invoice && updatingId === booking.invoice.id)
                      );
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50/50">
                          <td className="p-4 space-y-1">
                            <span className="font-mono font-bold text-gray-400 block">
                              {booking.invoice?.invoiceNo || "N/A"}
                            </span>
                            <span className="font-bold text-primary text-sm block">
                              {booking.eventName}
                            </span>
                            <span className="text-[10px] text-gray-500">
                              {booking.serviceName} ({booking.packageName})
                            </span>
                          </td>
                          <td className="p-4">
                            <p className="font-bold text-primary">{booking.clientName}</p>
                            <p className="text-[10px] text-gray-500">{booking.clientEmail}</p>
                            <p className="text-[10px] text-gray-500">{booking.clientWhatsapp}</p>
                          </td>
                          <td className="p-4 space-y-1">
                            <p className="font-bold text-primary">
                              {new Date(booking.eventDate + "T00:00:00").toLocaleDateString()}
                            </p>
                            <p className="text-[10px] text-gray-500">{booking.eventTime}</p>
                            <p className="text-[9px] font-caption text-gray-400 max-w-44 truncate">
                              {booking.eventLocation}
                            </p>
                          </td>
                          <td className="p-4 font-bold text-primary">
                            {booking.invoice ? formatPrice(booking.invoice.totalAmount) : "N/A"}
                          </td>
                          <td className="p-4 space-y-1.5">
                            <div>
                              <span
                                className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase font-caption ${
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
                            {booking.invoice && (
                              <div>
                                <span
                                  className={`px-2 py-0.5 rounded-[4px] text-[9px] font-bold uppercase font-caption ${
                                    booking.invoice.status === "PAID"
                                      ? "bg-green-100 text-green-800"
                                      : booking.invoice.status === "DP_PAID"
                                      ? "bg-amber-100 text-amber-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {booking.invoice.status}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex flex-wrap gap-1.5 justify-center max-w-44 mx-auto">
                              {booking.invoice && booking.invoice.status === "UNPAID" && (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateInvoiceStatus(booking.invoice!.id, "DP_PAID")}
                                  className="bg-amber-500 text-white font-caption font-bold px-2 py-1 rounded hover:bg-amber-600 disabled:opacity-50 cursor-pointer"
                                >
                                  {t("admin.set_dp")}
                                </button>
                              )}
                              {booking.invoice && booking.invoice.status !== "PAID" && (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateInvoiceStatus(booking.invoice!.id, "PAID")}
                                  className="bg-green-600 text-white font-caption font-bold px-2 py-1 rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer"
                                >
                                  {t("admin.verify_payment")}
                                </button>
                              )}
                              {booking.status === "PENDING" && (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateBookingStatus(booking.id, "CONFIRMED")}
                                  className="border border-green-200 text-green-700 bg-green-50 font-caption font-bold px-2 py-1 rounded hover:bg-green-100 disabled:opacity-50 cursor-pointer"
                                >
                                  Confirm Event
                                </button>
                              )}
                              {booking.status !== "CANCELLED" && (
                                <button
                                  disabled={isUpdating}
                                  onClick={() => handleUpdateBookingStatus(booking.id, "CANCELLED")}
                                  className="border border-red-200 text-red-700 bg-red-50 font-caption font-bold px-2 py-1 rounded hover:bg-red-100 disabled:opacity-50 cursor-pointer"
                                >
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}

        {/* ── TAB: CALENDAR ─────────────────────────────────────────────── */}
        {activeTab === "calendar" && (
          <div className="bg-white border rounded-xl p-8 soft-shadow space-y-6 max-w-xl mx-auto">
            <h3 className="font-headline-md text-base text-primary font-bold">
              Event Booking Dates Map
            </h3>
            <p className="text-xs text-gray-500 font-caption leading-relaxed">
              * A summary of booked/pending event date slots. Ensure you confirm
              or reject pending dates to free up calendar slots.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b font-bold text-primary">
                <span>Date &amp; Client Info</span>
                <span>Category</span>
                <span>Status</span>
              </div>
              {bookings
                .filter((b) => b.status !== "CANCELLED")
                .map((b) => (
                  <div key={b.id} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-primary block">
                        {new Date(b.eventDate + "T00:00:00").toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-gray-400 font-caption">
                        {b.clientName} ({b.eventName})
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500">{b.serviceName}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-caption ${
                        b.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── TAB: SERVICES & PRICING ───────────────────────────────────── */}
        {activeTab === "pricing" && (
          loadingPricing ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-on-surface-variant font-body-md">Loading pricing data...</p>
            </div>
          ) : (
            <div className="space-y-8">

              {/* ── SERVICES PANEL ─────────────────────────────────────── */}
              <div className="bg-white border rounded-xl overflow-hidden soft-shadow">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-[var(--color-surface-container-low)]">
                  <div>
                    <h3 className="font-headline-md text-base text-primary font-bold">Services</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Manage available service categories shown during booking.
                    </p>
                  </div>
                  <button
                    onClick={openAddService}
                    className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Service
                  </button>
                </div>

                {services.length === 0 ? (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">
                      category
                    </span>
                    <p className="text-sm text-gray-400">No services yet. Add your first service.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {services.map((svc) => {
                      const pkgCount = packages.filter((p) => p.serviceName === svc.name).length;
                      return (
                        <div
                          key={svc.id}
                          className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/60 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary text-base">
                                  category
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-sm text-primary truncate">{svc.name}</p>
                                <p className="text-xs text-gray-400 truncate max-w-xs">{svc.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 ml-4 shrink-0">
                            <span className="text-xs text-gray-400 font-caption hidden sm:block">
                              {pkgCount} package{pkgCount !== 1 ? "s" : ""}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => openEditService(svc)}
                                className="flex items-center gap-1 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                                Edit
                              </button>
                              <button
                                onClick={() => openDeleteService(svc)}
                                className="flex items-center gap-1 text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 cursor-pointer"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ── PACKAGES PANEL ─────────────────────────────────────── */}
              <div className="bg-white border rounded-xl overflow-hidden soft-shadow">
                <div className="flex items-center justify-between px-6 py-4 border-b bg-[var(--color-surface-container-low)]">
                  <div>
                    <h3 className="font-headline-md text-base text-primary font-bold">
                      Packages &amp; Pricing
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Edit prices, durations, and features. Changes reflect immediately in booking.
                    </p>
                  </div>
                  <button
                    onClick={() => openAddPackage()}
                    className="flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary/90 cursor-pointer transition-all"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    Add Package
                  </button>
                </div>

                {packages.length === 0 ? (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-4xl text-gray-300 block mb-2">
                      inventory_2
                    </span>
                    <p className="text-sm text-gray-400">No packages yet. Add your first package.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {packagesByService.map(({ service: svc, packages: pkgs }) =>
                      pkgs.length === 0 ? null : (
                        <div key={svc.id}>
                          {/* Service group header */}
                          <div className="px-6 py-3 bg-gray-50/80 flex items-center justify-between">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                              {svc.name}
                            </span>
                            <button
                              onClick={() => openAddPackage(svc.name)}
                              className="text-xs text-primary font-bold flex items-center gap-1 hover:underline cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-sm">add_circle</span>
                              Add package to this service
                            </button>
                          </div>

                          {/* Packages table */}
                          <table className="w-full text-left text-xs">
                            <thead>
                              <tr className="text-gray-400 uppercase text-[10px] border-b">
                                <th className="px-6 py-2.5">Package</th>
                                <th className="px-4 py-2.5">Duration</th>
                                <th className="px-4 py-2.5">Price (IDR)</th>
                                <th className="px-4 py-2.5">Features</th>
                                <th className="px-4 py-2.5 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y">
                              {pkgs.map((pkg) => (
                                <tr
                                  key={pkg.id}
                                  className="hover:bg-gray-50/50 transition-colors group"
                                >
                                  <td className="px-6 py-4">
                                    <span className="font-bold text-primary">{pkg.name}</span>
                                    {pkg.description && (
                                      <p className="text-[10px] text-gray-400 mt-0.5 max-w-[160px] truncate">
                                        {pkg.description}
                                      </p>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 text-gray-600">{pkg.duration || "—"}</td>
                                  <td className="px-4 py-4">
                                    <span className="font-bold text-primary text-sm">
                                      {formatPrice(pkg.price)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 max-w-[200px]">
                                    {pkg.features ? (
                                      <div className="flex flex-wrap gap-1">
                                        {pkg.features
                                          .split(",")
                                          .slice(0, 3)
                                          .map((f, i) => (
                                            <span
                                              key={i}
                                              className="bg-primary/8 text-primary px-2 py-0.5 rounded-full text-[10px] font-caption whitespace-nowrap"
                                            >
                                              {f.trim()}
                                            </span>
                                          ))}
                                        {pkg.features.split(",").length > 3 && (
                                          <span className="text-gray-400 text-[10px]">
                                            +{pkg.features.split(",").length - 3} more
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-gray-300">—</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-4 text-center">
                                    <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                      <button
                                        onClick={() => openEditPackage(pkg)}
                                        className="flex items-center gap-1 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-2.5 py-1.5 rounded-lg hover:bg-primary/10 cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => openDeletePackage(pkg)}
                                        className="flex items-center gap-1 text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 cursor-pointer"
                                      >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    )}
                    {/* Orphaned packages (service deleted but packages remain) */}
                    {packages
                      .filter((p) => !services.find((s) => s.name === p.serviceName))
                      .length > 0 && (
                        <div>
                          <div className="px-6 py-3 bg-amber-50 flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500 text-sm">warning</span>
                            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                              Unassigned Packages
                            </span>
                          </div>
                          <table className="w-full text-left text-xs">
                            <tbody className="divide-y">
                              {packages
                                .filter((p) => !services.find((s) => s.name === p.serviceName))
                                .map((pkg) => (
                                  <tr key={pkg.id} className="hover:bg-gray-50/50 group">
                                    <td className="px-6 py-4">
                                      <span className="font-bold text-gray-600">{pkg.name}</span>
                                      <p className="text-[10px] text-gray-400">{pkg.serviceName}</p>
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">{pkg.duration || "—"}</td>
                                    <td className="px-4 py-4 font-bold text-primary text-sm">
                                      {formatPrice(pkg.price)}
                                    </td>
                                    <td className="px-4 py-4" />
                                    <td className="px-4 py-4 text-center">
                                      <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => openEditPackage(pkg)}
                                          className="flex items-center gap-1 text-xs font-bold text-primary border border-primary/20 bg-primary/5 px-2.5 py-1.5 rounded-lg hover:bg-primary/10 cursor-pointer"
                                        >
                                          <span className="material-symbols-outlined text-sm">edit</span>
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => openDeletePackage(pkg)}
                                          className="flex items-center gap-1 text-xs font-bold text-red-600 border border-red-200 bg-red-50 px-2.5 py-1.5 rounded-lg hover:bg-red-100 cursor-pointer"
                                        >
                                          <span className="material-symbols-outlined text-sm">delete</span>
                                          Delete
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Info tip */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-blue-500 mt-0.5 shrink-0">info</span>
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>Live updates:</strong> All pricing changes here are
                  immediately reflected in the booking wizard and service pages.
                  No rebuild required.
                </p>
              </div>
            </div>
          )
        )}

        {/* ── TAB: SETTINGS ─────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          loadingSettings ? (
            <div className="text-center py-12 flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-on-surface-variant font-body-md">Loading configuration...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-white border rounded-xl p-8 soft-shadow space-y-6">
                <div className="border-b pb-4">
                  <h3 className="font-headline-md text-base text-primary font-bold">
                    General & Payment Configurations
                  </h3>
                  <p className="text-xs text-gray-500 font-caption mt-1">
                    Manage virtual accounts, QRIS labels, terms and conditions, and contact details.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* WhatsApp Contact */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600">
                      WhatsApp Number (628...)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 6287784728972"
                      value={settingsForm.whatsapp_number}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, whatsapp_number: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-[10px] text-gray-400">
                      Used for WhatsApp redirection links across the website. Must start with country code (e.g. 62).
                    </p>
                  </div>

                  {/* QRIS display name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600">
                      QRIS Display Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FRAME CREATIVE QRIS"
                      value={settingsForm.qris_name}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, qris_name: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-[10px] text-gray-400">
                      Account name printed below the QR code mockup in the payment gateway.
                    </p>
                  </div>
                </div>

                {/* QRIS Image Upload */}
                <div className="bg-gray-50 border border-dashed rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">qr_code_2</span>
                    <div>
                      <h4 className="text-xs font-bold text-gray-700">QRIS QR Code Image</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        Upload your official QRIS image. If uploaded, it replaces the default mockup on checkout.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 flex-wrap">
                    {settingsForm.qris_image ? (
                      <div className="relative w-32 h-32 border bg-white rounded-lg p-2 flex items-center justify-center group overflow-hidden">
                        <img
                          src={settingsForm.qris_image}
                          alt="Uploaded QRIS"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setSettingsForm(f => ({ ...f, qris_image: "" }))}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity font-bold text-xs cursor-pointer"
                        >
                          Remove QRIS
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 border rounded-lg bg-gray-100/50 flex flex-col items-center justify-center text-gray-400 p-2 text-center select-none border-dashed">
                        <span className="material-symbols-outlined text-3xl">image</span>
                        <span className="text-[9px] mt-1">No QRIS Image</span>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="inline-flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-primary/95 shadow cursor-pointer transition-all">
                        <span className="material-symbols-outlined text-sm">upload_file</span>
                        {uploadingQris ? "Uploading..." : "Upload QR Image"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadQris}
                          disabled={uploadingQris}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[9px] text-gray-400 block">
                        Accepts PNG, JPG, GIF up to 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Virtual Account number */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600">
                      BCA Virtual Account Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8802-0877-8472-8972"
                      value={settingsForm.bank_transfer_va}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, bank_transfer_va: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                    <p className="text-[10px] text-gray-400">
                      Virtual Account code displayed to clients choosing Bank Transfer.
                    </p>
                  </div>

                  {/* Bank Account Info */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-600">
                      Bank Account Details Label
                    </label>
                    <input
                      type="text"
                      placeholder="Nomor Rekening: 123-4567-890 (BCA a/n Frame Creative)"
                      value={settingsForm.bank_transfer_info}
                      onChange={(e) =>
                        setSettingsForm((f) => ({ ...f, bank_transfer_info: e.target.value }))
                      }
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <p className="text-[10px] text-gray-400">
                      Exact account details displayed in bold on the payment page.
                    </p>
                  </div>
                </div>

                {/* Bank transfer instruction */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-600">
                    Bank Transfer Instruction Text
                  </label>
                  <input
                    type="text"
                    placeholder="Kirim transfer ke nomor rekening resmi kami:"
                    value={settingsForm.bank_transfer_instruction}
                    onChange={(e) =>
                      setSettingsForm((f) => ({ ...f, bank_transfer_instruction: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                  <p className="text-[10px] text-gray-400">
                    Instruction header text shown above the bank account details.
                  </p>
                </div>

                {/* Terms and conditions */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-600">
                    Invoice Terms & Conditions
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Specify terms for booking, refunds, balance payments..."
                    value={settingsForm.terms_conditions}
                    onChange={(e) =>
                      setSettingsForm((f) => ({ ...f, terms_conditions: e.target.value }))
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-gray-400">
                    Terms shown in italic footer text on generated invoice pages.
                  </p>
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                    className="bg-primary text-white font-bold px-8 py-3 rounded-lg text-sm hover:bg-primary/95 shadow cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {savingSettings ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-sm">save</span>
                    )}
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
