import Link from "next/link";
import { ArrowRight, HeartHandshake } from "lucide-react";

export default function RegisterParentPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafc] px-4 py-8">
      <section className="max-w-xl rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <HeartHandshake className="text-[#2563eb]" size={34} />
        <h1 className="font-heading mt-4 text-3xl font-black">Orang tua masuk setelah diundang siswa.</h1>
        <p className="mt-2 font-bold leading-7 text-slate-500">
          Untuk MVP pertama, siswa mencoba misi dulu. Setelah itu siswa bisa membuat kode Lingkar Belajar untuk orang tua.
        </p>
        <Link
          className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#22c55e] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#129447]"
          href="/daftar"
        >
          Mulai sebagai Siswa
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
