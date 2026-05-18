"use client";

import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Rejected"
  | "Withdrawn";

export interface NewApplicationFormData {
  company: string;
  role: string;
  jobDescription: string;
  status: ApplicationStatus;
  notes: string;
}

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewApplicationFormData) => void;
}

// ─── Status Options ───────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; dot: string }[] = [
  { value: "Applied",   label: "Applied",   dot: "bg-blue-400" },
  { value: "Screening", label: "Screening", dot: "bg-violet-400" },
  { value: "Interview", label: "Interview", dot: "bg-amber-400" },
  { value: "Offer",     label: "Offer",     dot: "bg-emerald-400" },
  { value: "Rejected",  label: "Rejected",  dot: "bg-red-400" },
  { value: "Withdrawn", label: "Withdrawn", dot: "bg-slate-400" },
];

// ─── Field Components ─────────────────────────────────────────────────────────

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-medium tracking-wide text-slate-400 uppercase"
    >
      {children}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition-all duration-150 focus:border-white/[0.2] focus:bg-white/[0.06] focus:ring-1 focus:ring-white/[0.08]";

// ─── Modal Component ──────────────────────────────────────────────────────────

const EMPTY_FORM: NewApplicationFormData = {
  company: "",
  role: "",
  jobDescription: "",
  status: "Applied",
  notes: "",
};

export default function AddApplicationModal({
  isOpen,
  onClose,
  onSubmit,
}: AddApplicationModalProps) {
  const [form, setForm] = useState<NewApplicationFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof NewApplicationFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 80);
    } else {
      setForm(EMPTY_FORM);
      setErrors({});
      setStatusOpen(false);
    }
  }, [isOpen]);

  // Close status dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.company.trim()) newErrors.company = "Company name is required";
    if (!form.role.trim()) newErrors.role = "Role is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setIsSubmitting(true);
    // Simulate async (replace with real API call)
    await new Promise((r) => setTimeout(r, 500));
    onSubmit(form);
    setIsSubmitting(false);
    onClose();
  }

  function set<K extends keyof NewApplicationFormData>(key: K, value: NewApplicationFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  const selectedStatus = STATUS_OPTIONS.find((s) => s.value === form.status)!;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer / Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add Application"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-white/[0.07] bg-[#0e0f13] shadow-2xl"
        style={{ animation: "slideIn 0.22s cubic-bezier(0.16,1,0.3,1)" }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
          <div>
            <h2 className="text-base font-semibold text-white">New Application</h2>
            <p className="mt-0.5 text-xs text-slate-500">Fill in the details below to start tracking</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="flex flex-col gap-5">

            {/* Company */}
            <div>
              <Label htmlFor="company">
                Company <span className="text-red-500">*</span>
              </Label>
              <input
                ref={firstInputRef}
                id="company"
                type="text"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="e.g. Stripe"
                className={`${inputBase} ${errors.company ? "border-red-500/50 focus:border-red-500/60" : ""}`}
              />
              {errors.company && (
                <p className="mt-1.5 text-xs text-red-400">{errors.company}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <input
                id="role"
                type="text"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="e.g. Software Engineer"
                className={`${inputBase} ${errors.role ? "border-red-500/50 focus:border-red-500/60" : ""}`}
              />
              {errors.role && (
                <p className="mt-1.5 text-xs text-red-400">{errors.role}</p>
              )}
            </div>

            {/* Status — custom dropdown */}
            <div>
              <Label htmlFor="status">Status</Label>
              <div ref={statusRef} className="relative">
                <button
                  id="status"
                  type="button"
                  onClick={() => setStatusOpen((v) => !v)}
                  className={`${inputBase} flex items-center justify-between text-left`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${selectedStatus.dot}`} />
                    {selectedStatus.label}
                  </span>
                  <svg
                    className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-150 ${statusOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {statusOpen && (
                  <div className="absolute left-0 right-0 top-full z-10 mt-1 overflow-hidden rounded-lg border border-white/[0.08] bg-[#13141a] py-1 shadow-xl">
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => { set("status", opt.value); setStatusOpen(false); }}
                        className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition-colors hover:bg-white/[0.05] ${
                          form.status === opt.value ? "text-white" : "text-slate-400"
                        }`}
                      >
                        <span className={`h-2 w-2 flex-shrink-0 rounded-full ${opt.dot}`} />
                        {opt.label}
                        {form.status === opt.value && (
                          <svg className="ml-auto h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div>
              <Label htmlFor="jobDescription">Job Description</Label>
              <textarea
                id="jobDescription"
                rows={5}
                value={form.jobDescription}
                onChange={(e) => set("jobDescription", e.target.value)}
                placeholder="Paste the job description here — useful for AI tailoring later..."
                className={`${inputBase} resize-none leading-relaxed`}
              />
              <p className="mt-1.5 text-xs text-slate-600">
                Optional — used for resume/cover letter matching
              </p>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Recruiter name, referral, next steps..."
                className={`${inputBase} resize-none leading-relaxed`}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.07] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.05] hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition-all duration-150 hover:bg-slate-100 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Saving...
              </>
            ) : (
              "Save Application"
            )}
          </button>
        </div>
      </div>
    </>
  );
}