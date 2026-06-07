import React from "react";
import { prisma } from "@/lib/prisma";
import TechClientPage from "./tech-client";

export const dynamic = "force-dynamic";

export default async function AdminTechPage() {
  const techs = await prisma.tech.findMany({
    orderBy: { id: "asc" },
  });

  return (
    <div className="space-y-6">
      <TechClientPage initialTechs={techs} />
    </div>
  );
}
