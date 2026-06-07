"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createTech(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;

  if (!name || !icon) {
    return { error: "Semua field harus diisi!" };
  }

  try {
    await prisma.tech.create({
      data: { name, icon },
    });
  } catch (error) {
    console.error(error);
    return { error: "Gagal menyimpan ke database." };
  }

  revalidatePath("/admin/tech");
  revalidatePath("/");
  return { success: true };
}

export async function updateTech(id: number, prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string;

  if (!name || !icon) {
    return { error: "Semua field harus diisi!" };
  }

  try {
    await prisma.tech.update({
      where: { id },
      data: { name, icon },
    });
  } catch (error) {
    console.error(error);
    return { error: "Gagal memperbarui database." };
  }

  revalidatePath("/admin/tech");
  revalidatePath("/");
  return { success: true };
}

export async function deleteTech(id: number) {
  try {
    await prisma.tech.delete({
      where: { id },
    });
    revalidatePath("/admin/tech");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus dari database." };
  }
}
