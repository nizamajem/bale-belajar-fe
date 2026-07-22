"use client";

import { FirebaseError } from "firebase/app";
import { signInWithPopup } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { firebaseAuth, googleAuthProvider } from "@/lib/firebase";

const errorMessageByCode: Record<string, string> = {
  "auth/popup-closed-by-user": "Kamu menutup jendela Google sebelum selesai. Coba lagi.",
  "auth/popup-blocked": "Browser memblokir pop-up Google. Izinkan pop-up untuk situs ini, lalu coba lagi.",
  "auth/unauthorized-domain": "Domain ini belum diizinkan di pengaturan Firebase. Hubungi admin.",
  "auth/network-request-failed": "Gagal terhubung ke internet. Periksa koneksi lalu coba lagi.",
  "auth/invalid-api-key": "Konfigurasi Firebase server ini belum benar. Hubungi admin.",
};

function describeAuthError(error: unknown): string {
  if (error instanceof FirebaseError) {
    return errorMessageByCode[error.code] ?? `Login Google gagal (${error.code}). Coba lagi.`;
  }
  return "Login Google gagal. Coba lagi.";
}

export function GoogleAuthButton({
  onSuccess,
  onError,
}: {
  onSuccess: (idToken: string) => void;
  onError?: (message: string) => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const result = await signInWithPopup(firebaseAuth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      onSuccess(idToken);
    } catch (error) {
      console.error("Google sign-in failed:", error);
      onError?.(describeAuthError(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className="flex w-full items-center justify-center gap-3 rounded-[8px] border-2 border-slate-200 bg-white px-5 py-4 font-heading font-black text-slate-700 shadow-[0_5px_0_#e2e8f0] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:opacity-60"
      disabled={loading}
      onClick={handleClick}
      type="button"
    >
      {loading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <GoogleGlyph />
      )}
      Lanjutkan dengan Google
    </button>
  );
}

function GoogleGlyph() {
  return (
    <svg height="20" viewBox="0 0 48 48" width="20">
      <path
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
        fill="#4285F4"
      />
      <path
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
        fill="#34A853"
      />
      <path
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
        fill="#FBBC05"
      />
      <path
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
        fill="#EA4335"
      />
    </svg>
  );
}
