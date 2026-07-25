import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

export default function RegisterMentorPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f8fafc] px-4 py-8">
      <section className="max-w-xl rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
        <GraduationCap className="text-[#6d28d9]" size={34} />
        <h1 className="font-heading mt-4 text-3xl font-black">Mentor akan masuk di vertical slice berikutnya.</h1>
        <p className="mt-2 font-bold leading-7 text-slate-500">
          Blueprint memprioritaskan siswa sampai misi pertama. Setelah flow itu stabil, mentor invitation dan review dibangun.
        </p>
        <Link
          className="mt-5 inline-flex items-center gap-2 rounded-[8px] bg-[#6d28d9] px-5 py-4 font-heading font-black text-white shadow-[0_7px_0_#4c1d95]"
          href="/welcome"
        >
          Kembali
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
}
