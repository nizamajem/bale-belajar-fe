"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch, clearSession, setToken, USER_KEY } from "./api";

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "TEACHER" | "STUDENT";

export type AuthUser = {
  id: string;
  name: string;
  email?: string;
  avatarUrl?: string;
  role: UserRole;
  roles: UserRole[];
  schoolId?: string;
  teacherProfileId?: string;
  studentProfileId?: string;
};

type AuthResponse = { accessToken: string; user: AuthUser };
type GoogleAuthResponse = AuthResponse & { isNewUser: boolean };

function storeSession(accessToken: string, user: AuthUser) {
  setToken(accessToken);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export async function login(email: string, password: string) {
  const { data } = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  storeSession(data.accessToken, data.user);
  return data.user;
}

export async function studentLogin(participantCode: string) {
  const { data } = await apiFetch<AuthResponse>("/auth/student-login", {
    method: "POST",
    body: { participantCode },
    auth: false,
  });
  storeSession(data.accessToken, data.user);
  return data.user;
}

export async function registerStudent(
  name: string,
  email: string,
  password: string,
  gradeLevel?: number,
) {
  const { data } = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: { name, email, password, gradeLevel },
    auth: false,
  });
  storeSession(data.accessToken, data.user);
  return data.user;
}

export async function loginWithGoogle(idToken: string) {
  const { data } = await apiFetch<GoogleAuthResponse>("/auth/google", {
    method: "POST",
    body: { idToken },
    auth: false,
  });
  storeSession(data.accessToken, data.user);
  return { user: data.user, isNewUser: data.isNewUser };
}

export async function switchRole(role: UserRole) {
  const { data } = await apiFetch<AuthResponse>("/auth/switch-role", {
    method: "POST",
    body: { role },
  });
  storeSession(data.accessToken, data.user);
  return data.user;
}

export async function addRole(role: UserRole) {
  const { data } = await apiFetch<{ roles: UserRole[] }>("/auth/roles", {
    method: "POST",
    body: { role },
  });
  const current = getStoredUser();
  if (current) {
    window.localStorage.setItem(
      USER_KEY,
      JSON.stringify({ ...current, roles: data.roles }),
    );
  }
  return data.roles;
}

export function logout() {
  clearSession();
}

export function dashboardPathForRole(role: UserRole): string {
  if (role === "STUDENT") return "/student/dashboard";
  if (role === "TEACHER") return "/teacher/dashboard";
  return "/admin/dashboard";
}

export function useRequireAuth(allowedRoles: UserRole[], loginPath = "/student/login") {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = getStoredUser();
    if (!stored || !allowedRoles.includes(stored.role)) {
      router.replace(loginPath);
      return;
    }
    setUser(stored);
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { user, ready };
}
