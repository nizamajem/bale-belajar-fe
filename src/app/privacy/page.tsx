import Link from "next/link";
import { BookOpen, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi",
  description: "Ringkasan cara BaleBelajar mengelola data akun, progres belajar, asesmen, dan laporan siswa.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <article className="mx-auto max-w-3xl rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <Link className="mb-8 flex items-center gap-3" href="/welcome">
          <span className="grid size-10 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={22} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black text-[#172033]">BaleBelajar</span>
        </Link>
        <ShieldCheck className="text-[#2563eb]" size={30} />
        <h1 className="font-heading mt-4 text-3xl font-black">Kebijakan Privasi</h1>
        <p className="mt-3 font-bold leading-7 text-slate-600">
          Halaman ini menjelaskan prinsip pengelolaan data BaleBelajar untuk kebutuhan pilot dan operasional sekolah.
        </p>

        <Section title="Data yang diproses">
          Data akun, sekolah, kelas, progress belajar, jawaban tes, hasil asesmen, dan rekomendasi belajar yang dibutuhkan untuk menjalankan layanan.
        </Section>
        <Section title="Tujuan penggunaan">
          Data dipakai untuk autentikasi, menampilkan materi, menyimpan progress, menghitung hasil, membuat rekomendasi remedial, dan membantu guru memantau kelas.
        </Section>
        <Section title="Akses data">
          Siswa melihat data dirinya. Guru dan admin sekolah melihat data sesuai sekolah atau kelas yang dikelola. Super admin mengakses data untuk dukungan operasional.
        </Section>
        <Section title="AI dan rekomendasi">
          AI digunakan sebagai pendukung analisis dan rekomendasi belajar. Keputusan pembelajaran tetap dapat ditinjau oleh guru atau admin sekolah.
        </Section>
        <Section title="Kontak">
          Untuk permintaan koreksi atau penghapusan data pilot, hubungi tim BaleBelajar melalui kontak resmi sekolah atau pengelola platform.
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
