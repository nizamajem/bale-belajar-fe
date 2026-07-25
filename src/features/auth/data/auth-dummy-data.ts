import { AuthUser } from "@/lib/auth";

export type StudentRegisterMethod = "google" | "whatsapp" | "email" | "username";

export type DummyStudentRegistration = {
  nickname: string;
  method: StudentRegisterMethod;
  contact?: string;
};

export const dummyStudentUser = (nickname: string): AuthUser => ({
  id: `student-${Date.now()}`,
  name: nickname.trim() || "Siswa Bale",
  role: "STUDENT",
  roles: ["STUDENT"],
  studentProfileId: `profile-${Date.now()}`,
});

export const registerMethods: {
  id: StudentRegisterMethod;
  label: string;
  description: string;
}[] = [
  {
    id: "google",
    label: "Google",
    description: "Paling cepat kalau kamu sudah punya akun Google.",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    description: "Pakai nomor dan kode OTP dummy.",
  },
  {
    id: "email",
    label: "Email",
    description: "Masuk pakai email pribadi.",
  },
  {
    id: "username",
    label: "Username",
    description: "Tanpa email, cukup nama pengguna.",
  },
];
