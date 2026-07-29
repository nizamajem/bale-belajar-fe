"use client";

import { Clock, UserRoundCheck } from "lucide-react";
import { MentorQueueItem } from "../../types";

export function MentorCard({ item }: { item: MentorQueueItem }) {
  return (
    <section aria-live="polite" className="rounded-[8px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid size-11 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
          <UserRoundCheck size={22} />
        </span>
        <div>
          <p className="text-xs font-black uppercase text-[#2563eb]">Menunggu mentor</p>
          <h2 className="font-heading text-xl font-black">Permintaan masuk antrean {item.urgency}</h2>
          <p className="mt-2 text-sm font-bold leading-6 text-slate-600">
            Permintaanmu sudah dikirim. Sambil menunggu, kamu bisa mencoba contoh yang lebih sederhana.
          </p>
          <div className="mt-3 rounded-[8px] bg-[#f8fafc] p-3 text-sm font-bold leading-6 text-slate-600">
            <p><strong>Topik:</strong> {item.topic}</p>
            <p><strong>Ringkasan AI:</strong> {item.aiSummary}</p>
            <p><strong>Respons diminta:</strong> {item.requestedResponseType}</p>
          </div>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#fff7ed] px-3 py-2 text-xs font-black text-[#c2410c]">
            <Clock size={15} /> Estimasi: {item.dueTime}
          </p>
        </div>
      </div>
    </section>
  );
}
