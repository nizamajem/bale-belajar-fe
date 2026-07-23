"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { AuthUser, dashboardPathForRole, switchRole, UserRole } from "@/lib/auth";
import { ROLE_META, SWITCHABLE_ROLES } from "@/lib/roles";

export function RoleSwitcher({ user }: { user: AuthUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState<UserRole | null>(null);

  const roles = (user.roles ?? [user.role]).filter((role): role is "STUDENT" | "TEACHER" =>
    SWITCHABLE_ROLES.includes(role as "STUDENT" | "TEACHER"),
  );

  if (roles.length <= 1) return null;

  const activeMeta = ROLE_META[user.role];
  const ActiveIcon = activeMeta.icon;

  async function handleSwitch(role: UserRole) {
    if (role === user.role || switching) return;
    setOpen(false);
    setSwitching(role);
    try {
      await switchRole(role);
      window.setTimeout(() => {
        router.push(dashboardPathForRole(role));
      }, 420);
    } catch {
      setSwitching(null);
    }
  }

  return (
    <>
      <div className="relative">
        <button
          className="inline-flex items-center gap-2 rounded-[8px] border-2 border-slate-200 bg-white px-3 py-2 font-heading text-sm font-black text-slate-700 shadow-[0_4px_0_#e2e8f0] transition hover:-translate-y-0.5"
          onClick={() => setOpen((prev) => !prev)}
          type="button"
        >
          <ActiveIcon size={16} style={{ color: activeMeta.color }} />
          {activeMeta.label}
          <ChevronDown className={`transition ${open ? "rotate-180" : ""}`} size={14} />
        </button>

        <AnimatePresence>
          {open ? (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <motion.div
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-[8px] border border-slate-200 bg-white p-1.5 shadow-xl"
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <p className="px-2.5 py-1.5 text-[11px] font-black uppercase text-slate-400">
                  Pindah peran
                </p>
                {roles.map((role) => {
                  const meta = ROLE_META[role];
                  const Icon = meta.icon;
                  const isActive = role === user.role;
                  return (
                    <button
                      className={[
                        "flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2.5 text-left font-heading text-sm font-black transition",
                        isActive ? "bg-slate-50 text-slate-800" : "text-slate-600 hover:bg-slate-50",
                      ].join(" ")}
                      key={role}
                      onClick={() => handleSwitch(role)}
                      type="button"
                    >
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-[6px]"
                        style={{ backgroundColor: `${meta.color}1a`, color: meta.color }}
                      >
                        <Icon size={16} />
                      </span>
                      {meta.label}
                      {isActive ? <Check className="ml-auto text-slate-400" size={16} /> : null}
                    </button>
                  );
                })}
              </motion.div>
            </>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {switching ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[999] grid place-items-center"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            style={{ background: ROLE_META[switching].color }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3 text-white"
              initial={{ opacity: 0, scale: 0.85 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 260, damping: 20 }}
            >
              <span className="grid size-16 place-items-center rounded-full bg-white/15">
                <Loader2 className="animate-spin" size={28} />
              </span>
              <p className="font-heading text-xl font-black">
                Beralih ke mode {ROLE_META[switching].label}...
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
