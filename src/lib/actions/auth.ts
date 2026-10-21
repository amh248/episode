"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { usernameFromEmail } from "@/lib/utils";
import { redirect } from "next/navigation";

export type AuthState = { error?: string };

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  if (!email || !password) return { error: "Email and password are required." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const finalUsername = username || usernameFromEmail(email);

  const existing = await db.user.findFirst({
    where: { OR: [{ email }, { username: finalUsername }] },
  });
  if (existing) return { error: "Email or username already taken." };

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({
    data: {
      email,
      username: finalUsername,
      passwordHash,
      displayName: finalUsername,
    },
  });

  redirect("/sign-in?registered=1");
}
