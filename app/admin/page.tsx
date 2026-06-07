import React from "react";
import { prisma } from "@/lib/prisma";
import { FolderKanban, Code2, Eye } from "lucide-react";

export default async function AdminDashboardPage() {
  const projectCount = await prisma.project.count();
  const techCount = await prisma.tech.count();

  // Fetch recent entries to show in "Aktivitas Terbaru"
  const recentProjects = await prisma.project.findMany({
    orderBy: { id: "desc" },
    take: 3,
  });
  
  const recentTech = await prisma.tech.findMany({
    orderBy: { id: "desc" },
    take: 3,
  });

  // Combine and sort (since Tech has no createdAt, we use a fallback timestamp order using id)
  const activities = [
    ...recentProjects.map(p => ({
      id: `p-${p.id}`,
      type: "project",
      name: p.title,
      timeLabel: "Proyek baru",
      order: p.id * 2, // Sort order
    })),
    ...recentTech.map(t => ({
      id: `t-${t.id}`,
      type: "tech",
      name: t.name,
      timeLabel: "Tech baru",
      order: t.id * 2 - 1, // Sort order
    })),
  ].sort((a, b) => b.order - a.order).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-slate-500 text-sm">Selamat datang kembali! Berikut adalah ringkasan portofolio Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Proyek" value={projectCount} icon={<FolderKanban size={24} className="text-blue-500" />} />
        <StatCard title="Total Tech Stack" value={techCount} icon={<Code2 size={24} className="text-purple-500" />} />
        <StatCard title="Pengunjung Bulan Ini" value="1,024" icon={<Eye size={24} className="text-emerald-500" />} />
      </div>
      
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          {activities.length > 0 ? (
            activities.map((act) => (
              <div key={act.id} className="flex items-center gap-4 text-sm pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                <div className={`w-2 h-2 rounded-full ${act.type === 'project' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                <p className="text-slate-600 flex-1">
                  {act.type === 'project' ? 'Menambahkan proyek baru: ' : 'Menambahkan tech stack baru: '}
                  <span className="font-semibold text-slate-800">
                    {act.name}
                  </span>
                </p>
                <span className="text-slate-400 text-xs bg-slate-100 px-2 py-0.5 rounded-full">{act.timeLabel}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-500 text-sm">Belum ada aktivitas terbaru.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">
        {icon}
      </div>
    </div>
  );
}
