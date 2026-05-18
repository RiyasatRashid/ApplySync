"use client";

import { useState } from "react";
import AddApplicationModal, {
  type NewApplicationFormData,
  type ApplicationStatus,
} from "@/components/AddApplicationModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobApplication {
  id: string;
  company: string;
  role: string;
  jobDescription?: string;
  status: ApplicationStatus;
  notes?: string;
  appliedAt: string;
  logoInitial: string;
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string; dot: string }
> = {
  Applied: {
    label: "Applied",
    className: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    dot: "bg-blue-400",
  },
  Screening: {
    label: "Screening",
    className: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
    dot: "bg-violet-400",
  },
  Interview: {
    label: "Interview",
    className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400",
  },
  Offer: {
    label: "Offer",
    className: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  Rejected: {
    label: "Rejected",
    className: "bg-red-500/10 text-red-400 border border-red-500/20",
    dot: "bg-red-400",
  },
  Withdrawn: {
    label: "Withdrawn",
    className: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
    dot: "bg-slate-400",
  },
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_APPLICATIONS: JobApplication[] = [
  {
    id: "1",
    company: "Nominal",
    role: "Software Engineer",
    status: "Interview",
    notes: "Reached out to recruiter on LinkedIn. Great culture fit.",
    appliedAt: "2025-05-06",
    logoInitial: "N",
  },
  {
    id: "2",
    company: "Palantir",
    role: "Forward Deployed Engineer",
    status: "Screening",
    notes: "Case study round coming up next week.",
    appliedAt: "2025-05-02",
    logoInitial: "P",
  },
  {
    id: "3",
    company: "Stripe",
    role: "Full Stack Engineer",
    status: "Applied",
    notes: "",
    appliedAt: "2025-05-08",
    logoInitial: "S",
  },
  {
    id: "4",
    company: "Anthropic",
    role: "AI Software Engineer",
    status: "Offer",
    notes: "Negotiating compensation. Strong offer.",
    appliedAt: "2025-04-28",
    logoInitial: "A",
  },
  {
    id: "5",
    company: "Ramp",
    role: "Frontend Engineer",
    status: "Rejected",
    notes: "CodeSignal challenge — didn't advance.",
    appliedAt: "2025-04-20",
    logoInitial: "R",
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.03] px-5 py-4">
      <div
        className={`absolute top-0 left-0 h-[2px] w-full ${accent} opacity-70`}
      />
      <p className="font-mono text-2xl font-semibold text-white">{value}</p>
      <p className="mt-0.5 text-xs font-medium tracking-wide text-slate-500 uppercase">
        {label}
      </p>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────────

function ApplicationCard({ app }: { app: JobApplication }) {
  const status = STATUS_CONFIG[app.status];

  const formattedDate = new Date(app.appliedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-white/[0.03] p-5 transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Logo initial */}
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.06] font-mono text-sm font-bold text-white">
            {app.logoInitial}
          </div>
          <div>
            <p className="font-semibold leading-tight text-white">
              {app.company}
            </p>
            <p className="mt-0.5 text-sm text-slate-400">{app.role}</p>
          </div>
        </div>

        {/* Status badge */}
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.className} flex-shrink-0`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* Notes */}
      {app.notes && (
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-500">
          {app.notes}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-white/[0.05] pt-3">
        <p className="font-mono text-xs text-slate-600">{formattedDate}</p>
        <button className="text-xs font-medium text-slate-500 opacity-0 transition-opacity duration-150 group-hover:opacity-100 hover:text-white">
          View details →
        </button>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [filter, setFilter] = useState<ApplicationStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [apps, setApps] = useState<JobApplication[]>(MOCK_APPLICATIONS);

  function handleAddApplication(data: NewApplicationFormData) {
    const newApp: JobApplication = {
      id: crypto.randomUUID(),
      company: data.company,
      role: data.role,
      jobDescription: data.jobDescription,
      status: data.status,
      notes: data.notes,
      appliedAt: new Date().toISOString().split("T")[0],
      logoInitial: data.company.charAt(0).toUpperCase(),
    };
    setApps((prev) => [newApp, ...prev]);
  }

  const filtered = apps.filter((app) => {
    const matchesStatus = filter === "All" || app.status === filter;
    const matchesSearch =
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: apps.length,
    active: apps.filter((a) =>
      ["Applied", "Screening", "Interview"].includes(a.status)
    ).length,
    interviews: apps.filter((a) => a.status === "Interview").length,
    offers: apps.filter((a) => a.status === "Offer").length,
  };

  const filterOptions: (ApplicationStatus | "All")[] = [
    "All",
    "Applied",
    "Screening",
    "Interview",
    "Offer",
    "Rejected",
  ];

  return (
    <div className="min-h-screen bg-[#0c0d10] px-6 py-8 font-sans">
      {/* Subtle background texture */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Page Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Applications
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Track and manage your job search pipeline
            </p>
          </div>

          {/* Add Application Button */}
          <button onClick={() => setModalOpen(true)} className="group flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-150 hover:bg-slate-100 active:scale-[0.98]">
            <svg
              className="h-4 w-4 transition-transform duration-150 group-hover:rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Application
          </button>
        </div>

        {/* Stats Row */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total" value={stats.total} accent="bg-white" />
          <StatCard label="Active" value={stats.active} accent="bg-blue-400" />
          <StatCard
            label="Interviews"
            value={stats.interviews}
            accent="bg-amber-400"
          />
          <StatCard
            label="Offers"
            value={stats.offers}
            accent="bg-emerald-400"
          />
        </div>

        {/* Filters + Search */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
                  filter === option
                    ? "bg-white text-slate-900"
                    : "bg-white/[0.05] text-slate-400 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-white/[0.07] bg-white/[0.03] py-1.5 pl-8 pr-3 text-sm text-white placeholder-slate-600 outline-none transition-colors focus:border-white/[0.15] focus:bg-white/[0.05] sm:w-56"
            />
          </div>
        </div>

        {/* Applications Grid */}
        {filtered.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          // Empty state
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] py-20 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04]">
              <svg
                className="h-5 w-5 text-slate-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-500">
              No applications found
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {filter !== "All"
                ? `No ${filter} applications match your search.`
                : "Start tracking your job search by adding your first application."}
            </p>
          </div>
        )}
      </div>

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddApplication}
      />
    </div>
  );
}