'use client';

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

interface DeleteAccountFormProps {
  isAppView: boolean;
}

export const DeleteAccountForm: React.FC<DeleteAccountFormProps> = ({ isAppView }) => {
  const [phone, setPhone] = useState("");
  const [storeName, setStoreName] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Simple validation
    const trimmedPhone = phone.trim();
    if (!trimmedPhone) {
      setErrorMsg("Please enter your registered phone number.");
      return;
    }

    // Ensure phone number contains only numbers, optionally starts with +
    if (!/^\+?[1-9]\d{1,14}$/.test(trimmedPhone.replace(/[\s-]/g, ""))) {
      setErrorMsg("Please enter a valid phone number (e.g. +91 98765 43210) including country code.");
      return;
    }

    setShowConfirmModal(true);
  };

  const performDeleteRequest = async () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const formattedPhone = phone.trim().replace(/[\s()+-]/g, "");
      const response = await fetch(
        "https://mtsfsgtcaoyfidcsvufg.supabase.co/functions/v1/delete-user-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: formattedPhone,
            reason: reason.trim() || undefined,
            store_name: storeName.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit request. Please verify your phone number is correct.");
      }

      setSuccessMsg(
        "A confirmation message has been sent to your WhatsApp. Please click the button \"I confirm, delete my account\" in the WhatsApp message within 15 minutes to complete the deletion."
      );
      setPhone("");
      setStoreName("");
      setReason("");
    } catch (error: any) {
      console.error("Account deletion request failed:", error);
      setErrorMsg(
        error.message || "An error occurred while submitting your request. Please try again later."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Section className={isAppView ? "bg-white !py-4" : "bg-surface"}>
      <Container className="max-w-3xl">
        <div className="mb-8">
          <h1 className="font-display-lg text-3xl md:text-4xl text-on-surface mb-2">
            Delete Account
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Request permanent deletion of your Nearbyshops vendor account and business data.
          </p>
        </div>

        {/* Warning Card */}
        <div className="mb-8 flex gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl items-start">
          <span className="material-symbols-outlined text-red-600 text-3xl select-none" style={{ fontVariationSettings: '"FILL" 1' }}>
            warning
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-red-700 mb-1">Warning: Permanent Action</h3>
            <p className="text-sm text-red-900 leading-relaxed">
              Deleting your account is irreversible. All of your personal and business data will be permanently wiped out once confirmed.
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Deletion Process */}
          <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Deletion Process
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {/* Step 1 */}
              <div className="p-4 flex gap-3 items-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Submit Request</h4>
                  <p className="text-xs text-slate-500">
                    Fill and submit the request form below with your registered phone number.
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="p-4 flex gap-3 items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm font-bold" style={{ fontVariationSettings: '"FILL" 1' }}>
                    chat
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">WhatsApp Confirmation</h4>
                  <p className="text-xs text-slate-500 leading-normal">
                    Click the button <span className="font-semibold text-slate-900">"I confirm, delete my account"</span> in the WhatsApp message within <span className="font-semibold text-slate-900">15 minutes</span>.
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="p-4 flex gap-3 items-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Permanent Removal</h4>
                  <p className="text-xs text-slate-500">
                    Your account, profile, products, and categories will be completely and permanently wiped.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Deleted */}
          <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden shadow-xs">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Data to be Deleted
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {/* Row 1 */}
              <div className="p-4 flex gap-3 items-center">
                <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">
                  person
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Personal Data</h4>
                  <p className="text-xs text-slate-500">
                    Your registered phone number and authentication credentials.
                  </p>
                </div>
              </div>
              {/* Row 2 */}
              <div className="p-4 flex gap-3 items-center">
                <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">
                  store
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Store & Product Data</h4>
                  <p className="text-xs text-slate-500">
                    Your store profile,  products and categories.
                  </p>
                </div>
              </div>
              {/* Row 3 */}
              <div className="p-4 flex gap-3 items-center">
                <span className="material-symbols-outlined text-slate-400 text-xl shrink-0">
                  credit_card
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-800">Subscriptions Warning</h4>
                  <p className="text-xs text-slate-500">
                    Active subscriptions must be cancelled manually via App Store or Google Play Store.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <div className="border border-slate-200 rounded-2xl bg-white p-6 shadow-xs">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-6">
            Deletion Request Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-900 rounded-xl text-sm flex gap-2 items-center">
                <span className="material-symbols-outlined text-red-600 select-none">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-sm flex gap-3 items-start">
                <span className="material-symbols-outlined text-emerald-600 select-none mt-0.5" style={{ fontVariationSettings: '"FILL" 1' }}>
                  check_circle
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-emerald-900 mb-1">Request Sent Successfully</p>
                  <p className="leading-relaxed">{successMsg}</p>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Registered Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="e.g. +919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all text-on-surface"
                disabled={isSubmitting}
                required
              />
              <p className="text-xs text-slate-400 mt-1.5">
                Enter your WhatsApp number including country code (e.g. +91 for India, +1 for USA) without spaces or hyphens.
              </p>
            </div>

            <div>
              <label htmlFor="storeName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Store Name <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <input
                id="storeName"
                type="text"
                placeholder="Your store name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all text-on-surface"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="reason" className="block text-sm font-semibold text-slate-700">
                  Why are you leaving? <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <span className="text-xs text-slate-400">{reason.length} / 300</span>
              </div>
              <textarea
                id="reason"
                rows={4}
                maxLength={300}
                placeholder="Help us improve. Tell us why you are deleting your account..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-container/20 focus:border-primary-container transition-all text-on-surface resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center !py-4 font-bold bg-red-600 text-white shadow-md hover:bg-red-700 hover:brightness-100 disabled:opacity-50 disabled:cursor-not-allowed select-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing Request...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Delete My Account
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Container>

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <span className="material-symbols-outlined text-4xl select-none" style={{ fontVariationSettings: '"FILL" 1' }}>
                warning
              </span>
              <h3 className="text-xl font-bold text-slate-900">
                Confirm Deletion
              </h3>
            </div>
            
            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Are you sure you want to request account deletion? A confirmation message will be sent to your WhatsApp number <strong className="text-slate-950 font-bold">{phone}</strong>.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer select-none"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={performDeleteRequest}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 hover:shadow-md transition-all active:scale-95 cursor-pointer select-none"
              >
                Yes, Request Deletion
              </button>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};
