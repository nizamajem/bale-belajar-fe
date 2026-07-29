import { HeartHandshake, ShieldCheck } from "lucide-react";
import { ParentSupportRequest } from "../../types";

export function ParentSupportCard({
  message = "Belajar 10 menit dulu sudah cukup.",
  request,
  selectedContext = [],
  onToggleContext,
  onSend,
}: {
  message?: string;
  request?: ParentSupportRequest;
  selectedContext?: string[];
  onToggleContext?: (item: string) => void;
  onSend?: () => void;
}) {
  if (!request) {
    return <div className="rounded-[8px] bg-[#f0fdf4] p-4 font-bold text-[#166534]">{message}</div>;
  }

  return (
    <section className="rounded-[8px] border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-[#166534]">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-white text-[#16a34a]">
          <HeartHandshake size={21} />
        </span>
        <div>
          <p className="text-xs font-black uppercase">Dukungan orang tua</p>
          <h2 className="font-heading text-xl font-black">Minta dukungan {request.parentName}</h2>
          <p className="mt-2 text-sm font-bold leading-6">{request.reason}</p>
        </div>
      </div>
      <div className="mt-3 rounded-[8px] bg-white/75 p-3">
        <div className="flex items-center gap-2 text-sm font-black">
          <ShieldCheck size={17} />
          Data yang akan dibagikan
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {request.shareableContext.map((item) => (
            <label className="flex items-center gap-2 rounded-[8px] bg-white px-3 py-2 text-sm font-bold" key={item}>
              <input checked={selectedContext.includes(item)} onChange={() => onToggleContext?.(item)} type="checkbox" />
              {item}
            </label>
          ))}
        </div>
      </div>
      <p className="mt-3 rounded-[8px] bg-white/75 p-3 text-sm font-bold leading-6">{request.messageDraft}</p>
      <button
        className="mt-3 rounded-[8px] bg-[#22c55e] px-4 py-3 font-heading font-black text-white shadow-[0_5px_0_#129447]"
        onClick={onSend}
        type="button"
      >
        Minta dukungan orang tua
      </button>
    </section>
  );
}
