"use client";

import { setToken, USER_KEY } from "@/lib/api";
import { AuthUser } from "@/lib/auth";
import {
  dummyStudentUser,
  DummyStudentRegistration,
} from "../data/auth-dummy-data";

const delay = (ms = 650) => new Promise((resolve) => window.setTimeout(resolve, ms));

export async function registerDummyStudent(
  input: DummyStudentRegistration,
): Promise<AuthUser> {
  await delay();
  const user = dummyStudentUser(input.nickname);
  setToken(`dummy-student-token-${Date.now()}`);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.localStorage.setItem("bb_dummy_register_method", input.method);
  if (input.contact) window.localStorage.setItem("bb_dummy_contact", input.contact);
  return user;
}

export async function loginDummyStudent(): Promise<AuthUser> {
  await delay(500);
  const user = dummyStudentUser("Ajem");
  setToken(`dummy-student-login-${Date.now()}`);
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}
