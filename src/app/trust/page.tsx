import Link from "next/link";
import { BookOpen, CheckCircle2, LockKeyhole, ShieldCheck, UserCheck } from "lucide-react";

export const metadata = {
  title: "Keamanan Data dan Kepercayaan",
  description: "Kebijakan kepercayaan BaleBelajar untuk sekolah, orang tua, guru, dan siswa.",
};

const items = [
  {
    title: "Data siswa dipisahkan",
    text: "Akun siswa, sekolah, kelas, dan laporan ditempatkan berdasarkan relasi sekolah dan role pengguna.",
    icon: ShieldCheck,
  },
  {
    title: "Akses berbasis peran",
    text: "Siswa, guru, admin, dan super admin punya jalur akses berbeda agar data tidak terbuka ke pihak yang tidak berwenang.",
    icon: UserCheck,
  },
  {
    title: "AI sebagai rekomendasi",
    text: "AI membantu analisis dan saran belajar, bukan mengganti keputusan guru atau sekolah.",
    icon: LockKeyhole,
  },
];

export default function TrustPage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <Link className="flex items-center gap-3" href="/welcome">
          <span className="grid size-11 place-items-center rounded-[8px] bg-[#22c55e] text-white shadow-[0_5px_0_#129447]">
            <BookOpen size={23} strokeWidth={3} />
          </span>
          <span className="font-heading text-xl font-black">BaleBelajar</span>
        </Link>
        <div className="mt-10 rounded-[8px] bg-[#172033] p-6 text-white shadow-[0_10px_0_#020617]">
          <p className="text-sm font-black uppercase text-[#f9c74f]">Trust center</p>
          <h1 className="font-heading mt-3 text-4xl font-black leading-tight sm:text-6xl">
            Sekolah perlu percaya sebelum memberi akses ke data siswa.
          </h1>
          <p className="mt-4 max-w-3xl font-bold leading-8 text-white/75">
            Halaman ini menjelaskan cara BaleBelajar menjaga akses, data siswa, rekomendasi AI, dan kontrol guru.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon;

            return (
            <article className="rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm" key={item.title}>
              <span className="grid size-12 place-items-center rounded-[8px] bg-[#eff6ff] text-[#2563eb]">
                <Icon size={23} />
              </span>
              <h2 className="font-heading mt-4 text-xl font-black">{item.title}</h2>
              <p className="mt-2 text-sm font-bold leading-6 text-slate-600">{item.text}</p>
            </article>
            );
          })}
        </div>

        <section className="mt-6 rounded-[8px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-heading text-2xl font-black">Checklist sebelum pilot sekolah</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {["Sekolah tahu data apa yang dikumpulkan", "Guru tahu cara membaca laporan", "Orang tua mendapat penjelasan sederhana", "Siswa tahu hasil tes dipakai untuk latihan ulang"].map((item) => (
              <p className="flex items-center gap-2 rounded-[8px] bg-[#f8fafc] p-4 font-bold text-slate-600" key={item}>
                <CheckCircle2 className="text-[#22c55e]" size={18} />
                {item}
              </p>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
