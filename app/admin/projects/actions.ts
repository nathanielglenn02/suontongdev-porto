"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProject(prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;
  const githubUrl = (formData.get("githubUrl") as string) || null;
  const liveUrl = (formData.get("liveUrl") as string) || null;
  const techStack = formData.get("techStack") as string;
  
  // Parse dynamic project image URLs
  const imageUrls = formData.getAll("imageUrls") as string[];
  const filteredImageUrls = imageUrls.filter(url => url.trim() !== "");

  if (!title || !description || !thumbnailUrl || !techStack) {
    return { error: "Field Judul, Deskripsi, Thumbnail, dan Tech Stack wajib diisi!" };
  }

  try {
    await prisma.project.create({
      data: {
        title,
        description,
        thumbnailUrl,
        githubUrl,
        liveUrl,
        techStack,
        images: {
          create: filteredImageUrls.map(url => ({ url })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Gagal menyimpan proyek ke database." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

export async function updateProject(id: number, prevState: { error?: string; success?: boolean } | null, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const thumbnailUrl = formData.get("thumbnailUrl") as string;
  const githubUrl = (formData.get("githubUrl") as string) || null;
  const liveUrl = (formData.get("liveUrl") as string) || null;
  const techStack = formData.get("techStack") as string;
  
  // Parse dynamic project image URLs
  const imageUrls = formData.getAll("imageUrls") as string[];
  const filteredImageUrls = imageUrls.filter(url => url.trim() !== "");

  if (!title || !description || !thumbnailUrl || !techStack) {
    return { error: "Field Judul, Deskripsi, Thumbnail, dan Tech Stack wajib diisi!" };
  }

  try {
    await prisma.project.update({
      where: { id },
      data: {
        title,
        description,
        thumbnailUrl,
        githubUrl,
        liveUrl,
        techStack,
        images: {
          deleteMany: {},
          create: filteredImageUrls.map(url => ({ url })),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return { error: "Gagal memperbarui proyek di database." };
  }

  revalidatePath("/admin/projects");
  revalidatePath("/");
  return { success: true };
}

export async function deleteProject(id: number) {
  try {
    await prisma.project.delete({
      where: { id },
    });
    revalidatePath("/admin/projects");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus proyek dari database." };
  }
}
