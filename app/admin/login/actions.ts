"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { signToken } from "@/lib/auth";

export async function loginAdmin(prevState: { error?: string } | null, formData: FormData) {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";
  const jwtSecret = process.env.JWT_SECRET || "fallback-secret-key-1234567890";

  if (password !== adminPassword) {
    return { error: "Password salah!" };
  }

  // Generate session token (valid for 24 hours)
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  const token = await signToken({ username: "admin", expiresAt }, jwtSecret);

  // Set HTTP-Only Cookie
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
