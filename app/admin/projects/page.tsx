import React from "react";
import { prisma } from "@/lib/prisma";
import ProjectsClientPage from "./projects-client";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [projects, techs] = await Promise.all([
    prisma.project.findMany({
      include: {
        images: {
          orderBy: { id: "asc" },
        },
      },
      orderBy: { id: "desc" },
    }),
    prisma.tech.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <ProjectsClientPage initialProjects={projects} availableTechs={techs} />
    </div>
  );
}
