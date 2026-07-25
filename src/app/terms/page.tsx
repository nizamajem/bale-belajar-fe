import Link from "next/link";
import { BookOpen, FileText } from "lucide-react";

export const metadata = {
  title: "Ketentuan Layanan",
  description: "Ketentuan penggunaan BaleBelajar untuk siswa, guru, admin sekolah, dan pengajuan pilot.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <article className="mx-auto max-w-3xl rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <Link className="mb-8 flex items-center gap-3" href="/welcome">
          <span className="grid size-10 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={22} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black text-[#172033]">BaleBelajar</span>
        </Link>
        <FileText className="text-[#6d28d9]" size={30} />
        <h1 className="font-heading mt-4 text-3xl font-black">Ketentuan Layanan</h1>
        <p className="mt-3 font-bold leading-7 text-slate-600">
          Ketentuan ini membantu sekolah, guru, dan siswa memahami penggunaan BaleBelajar selama pilot maupun operasional.
        </p>

        <Section title="Penggunaan akun">
          Pengguna wajib memakai akun resmi. Kode peserta siswa hanya boleh digunakan oleh siswa yang menerima kode tersebut dari sekolah atau guru.
        </Section>
        <Section title="Konten belajar">
          Materi, studi kasus, tes, dan rekomendasi BaleBelajar digunakan sebagai alat bantu belajar. Guru tetap dapat menyesuaikan keputusan pembelajaran.
        </Section>
        <Section title="Keamanan">
          Pengguna tidak boleh membagikan password, token, atau akses admin kepada pihak yang tidak berwenang.
        </Section>
        <Section title="Pilot sekolah">
          Pengajuan pilot akan ditinjau oleh tim BaleBelajar. Jadwal, cakupan, dan paket penggunaan dapat disepakati bersama sekolah.
        </Section>
        <Section title="Perubahan layanan">
          BaleBelajar dapat memperbarui fitur, kurikulum, dan tampilan untuk meningkatkan kualitas pembelajaran dan operasional sekolah.
        </Section>
      </article>
    </main>
  );
}

function Section({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="mt-6 border-t border-slate-100 pt-5">
      <h2 className="font-heading text-xl font-black">{title}</h2>
      <p className="mt-2 font-bold leading-7 text-slate-600">{children}</p>
    </section>
  );
}
