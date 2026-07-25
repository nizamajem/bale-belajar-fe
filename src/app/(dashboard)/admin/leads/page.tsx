"use client";

import { motion } from "framer-motion";
import { CalendarDays, Loader2, MessageCircle, Phone, School, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { SchoolLead } from "@/lib/types";
import { DashboardShell, MetricCard } from "../../_components/dashboard-shell";

const statusLabel: Record<SchoolLead["status"], string> = {
  NEW: "Baru",
  CONTACTED: "Sudah dihubungi",
  DEMO_SCHEDULED: "Demo dijadwalkan",
  PILOT: "Pilot",
  REJECTED: "Tidak lanjut",
  CONVERTED: "Jadi pelanggan",
};

export default function AdminLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<SchoolLead[]>([]);

  useEffect(() => {
    apiFetch<SchoolLead[]>("/leads", { query: { page: 1, limit: 100 } })
      .then(({ data }) => setLeads(data))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    const newLead = leads.filter((lead) => lead.status === "NEW").length;
    const contacted = leads.filter((lead) => lead.status === "CONTACTED" || lead.status === "DEMO_SCHEDULED").length;
    const pilot = leads.filter((lead) => lead.status === "PILOT").length;
    const converted = leads.filter((lead) => lead.status === "CONVERTED").length;
    return { newLead, contacted, pilot, converted };
  }, [leads]);

  return (
    <DashboardShell role="admin" title="CRM Leads Pilot">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Lead baru" tone="red" value={loading ? "-" : String(metrics.newLead)} />
        <MetricCard label="Perlu follow-up" tone="yellow" value={loading ? "-" : String(metrics.contacted)} />
        <MetricCard label="Pilot" tone="blue" value={loading ? "-" : String(metrics.pilot)} />
        <MetricCard label="Converted" tone="green" value={loading ? "-" : String(metrics.converted)} />
      </div>

      <section className="mt-5 rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-5">
          <p className="text-sm font-black uppercase text-[#2563eb]">Pipeline sales</p>
          <h2 className="font-heading text-2xl font-black">Sekolah yang mengajukan pilot</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-500">
            Gunakan halaman ini untuk follow-up WhatsApp, jadwal demo, dan prioritas sekolah dengan jumlah siswa besar.
          </p>
        </div>

        {loading ? (
          <div className="grid place-items-center py-10">
            <Loader2 className="animate-spin text-slate-400" size={28} />
          </div>
        ) : leads.length === 0 ? (
          <p className="rounded-[8px] bg-[#f8fafc] p-6 text-center font-bold text-slate-500">
            Belum ada lead pilot.
          </p>
        ) : (
          <div className="grid gap-3">
            {leads.map((lead, index) => (
              <motion.article
                animate={{ opacity: 1, y: 0 }}
                className="grid gap-4 rounded-[8px] bg-[#f8fafc] p-4 lg:grid-cols-[1.1fr_0.8fr_0.8fr] lg:items-center"
                initial={{ opacity: 0, y: 10 }}
                key={lead.id}
                transition={{ delay: index * 0.03 }}
              >
                <div>
                  <p className="font-heading text-xl font-black">{lead.schoolName}</p>
                  <p className="mt-1 text-sm font-bold text-slate-500">{lead.contactName} {lead.position ? `- ${lead.position}` : ""}</p>
                  {lead.message ? (
                    <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{lead.message}</p>
                  ) : null}
                </div>
                <div className="grid gap-2 text-sm font-bold text-slate-600">
                  <p className="flex items-center gap-2"><Phone size={16} /> {lead.phone}</p>
                  <p className="flex items-center gap-2"><UsersRound size={16} /> {lead.studentCount ?? "-"} siswa</p>
                  <p className="flex items-center gap-2"><CalendarDays size={16} /> {new Date(lead.createdAt).toLocaleDateString("id-ID")}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="rounded-full bg-white px-3 py-2 text-center text-xs font-black text-slate-600">
                    {statusLabel[lead.status]}
                  </span>
                  <a
                    className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]"
                    href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <MessageCircle size={17} />
                    Follow-up WA
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <section className="mt-5 rounded-[8px] bg-[#172033] p-5 text-white">
        <School className="text-[#f9c74f]" size={28} />
        <h2 className="font-heading mt-3 text-2xl font-black">SOP follow-up 24 jam</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {["Kirim link demo dan contoh laporan", "Tawarkan jadwal demo 30 menit", "Catat kebutuhan kelas dan jumlah siswa"].map((item, index) => (
            <p className="rounded-[8px] bg-white/10 p-4 text-sm font-bold leading-6" key={item}>
              {index + 1}. {item}
            </p>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
