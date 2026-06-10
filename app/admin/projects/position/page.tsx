import React from "react";
import { prisma } from "@/lib/prisma";
import PositionClientPage from "./position-client";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPositionPage() {
  const projects = await prisma.project.findMany({
    include: {
      images: {
        orderBy: { id: "asc" },
      },
    },
    orderBy: [
      { order: "asc" },
      { id: "desc" },
    ],
  });

  return (
    <div className="space-y-6">
      <PositionClientPage initialProjects={projects} />
    </div>
  );
}
