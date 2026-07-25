import Link from "next/link";
import { Award, BookOpen, CheckCircle2, Download } from "lucide-react";

export const metadata = {
  title: "Contoh Sertifikat BaleBelajar",
  description: "Contoh sertifikat mini yang didapat siswa setelah menyelesaikan jalur belajar.",
};

export default function CertificateDemoPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-4xl">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>

        <article className="mt-8 rounded-[8px] border-4 border-[#f9c74f] bg-white p-6 text-center shadow-[0_10px_0_#d8e2ef] sm:p-10">
          <Award className="mx-auto text-[#f59e0b]" size={54} />
          <p className="mt-4 text-sm font-black uppercase text-[#2563eb]">Sertifikat mini</p>
          <h1 className="font-heading mt-2 text-4xl font-black leading-tight">Alya resmi menjadi Pembaca Bukti Level 1.</h1>
          <p className="mx-auto mt-4 max-w-2xl font-bold leading-7 text-slate-600">
            Sertifikat tidak hanya hadiah visual. Isinya menjelaskan skill yang selesai, bukti belajar, dan rekomendasi langkah berikutnya.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {["Fakta vs dugaan", "Bukti kuat/lemah", "Kesimpulan aman"].map((skill) => (
              <div className="rounded-[8px] bg-[#f0fdf4] p-4 text-left" key={skill}>
                <CheckCircle2 className="text-[#16a34a]" size={22} />
                <p className="font-heading mt-2 font-black">{skill}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">Selesai</p>
              </div>
            ))}
          </div>

          <button className="mt-7 inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#2563eb] px-5 py-4 font-heading font-black text-white shadow-[0_6px_0_#1d4ed8]" type="button">
            <Download size={18} />
            Contoh Unduh Sertifikat
          </button>
        </article>
      </section>
    </main>
  );
}
