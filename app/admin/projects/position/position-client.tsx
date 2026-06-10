"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { GripVertical, Loader2, CheckCircle, AlertCircle, ArrowLeft, Sparkles } from "lucide-react";

interface ProjectImage {
  id: number;
  url: string;
}

interface ProjectItem {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  githubUrl: string | null;
  liveUrl: string | null;
  techStack: string;
  images: ProjectImage[];
}

export default function PositionClientPage({
  initialProjects,
}: {
  initialProjects: ProjectItem[];
}) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [isPending, startTransition] = useTransition();

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    
    // Create an empty transparent drag image to avoid default browser drag image issues if desired, 
    // but the default is usually fine for simple lists.
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedProjects = [...projects];
    const draggedItem = updatedProjects[draggedIndex];
    
    // Remove from old position and insert at new position
    updatedProjects.splice(draggedIndex, 1);
    updatedProjects.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setProjects(updatedProjects);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    
    // Trigger saving to database
    startTransition(async () => {
      setSaveStatus("saving");
      try {
        const response = await fetch("/api/projects/reorder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ids: projects.map((p) => p.id),
          }),
        });

        if (response.ok) {
          setSaveStatus("success");
          setTimeout(() => {
            setSaveStatus("idle");
          }, 3000);
        } else {
          setSaveStatus("error");
        }
      } catch (error) {
        console.error("Failed to save reorder position:", error);
        setSaveStatus("error");
      }
    });
  };

  return (
    <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-6 md:p-8 backdrop-blur-sm">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link 
              href="/admin/projects" 
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Kembali ke Kelola Proyek
            </Link>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            Kelola Posisi Proyek
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Geser dan urutkan kartu proyek untuk mengatur posisinya di halaman utama portofolio.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center">
          {saveStatus === "saving" && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Loader2 size={14} className="animate-spin" />
              Menyimpan urutan...
            </span>
          )}
          {saveStatus === "success" && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
              <CheckCircle size={14} />
              Urutan berhasil disimpan!
            </span>
          )}
          {saveStatus === "error" && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
              <AlertCircle size={14} />
              Gagal menyimpan posisi
            </span>
          )}
          {saveStatus === "idle" && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/50 text-slate-400 text-xs font-semibold">
              Mode Susun Aktif
            </span>
          )}
        </div>
      </div>

      {/* Projects Reorder Grid (3 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => {
          const isDragging = draggedIndex === index;
          const techArray = project.techStack
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t !== "");

          return (
            <div
              key={project.id}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`group relative rounded-3xl bg-slate-950/60 border overflow-hidden backdrop-blur-sm transition-all duration-300 cursor-grab active:cursor-grabbing flex flex-col select-none ${
                isDragging
                  ? "border-blue-500/50 bg-slate-800/40 border-dashed opacity-50 scale-[0.98]"
                  : "border-slate-800 hover:border-slate-700/80 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)]"
              }`}
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden bg-slate-950 shrink-0">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-70"></div>
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/800x450/1e293b/ffffff?text=Preview";
                  }}
                />
                
                {/* Number Badge */}
                <div className="absolute top-3 left-3 z-20 w-8 h-8 rounded-lg bg-blue-600 border border-blue-500 flex items-center justify-center text-sm font-semibold text-white font-mono shadow-md">
                  {index + 1}
                </div>

                {/* Grip Handle Indicator */}
                <div className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/50 text-slate-400 group-hover:text-white backdrop-blur-sm shadow-md transition-colors">
                  <GripVertical size={16} />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/60 mt-auto">
                  {techArray.slice(0, 3).map((techName) => (
                    <span
                      key={techName}
                      className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/50 text-slate-400 text-[10px] font-medium"
                    >
                      {techName}
                    </span>
                  ))}
                  {techArray.length > 3 && (
                    <span className="text-[10px] text-slate-500 font-semibold font-mono">
                      +{techArray.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl col-span-full">
            <Sparkles className="mx-auto text-slate-600 mb-3" size={32} />
            <p className="text-slate-400 text-sm">Belum ada proyek yang dapat disusun.</p>
            <p className="text-slate-600 text-xs mt-1">
              Silakan tambahkan proyek baru terlebih dahulu di halaman Kelola Proyek.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
