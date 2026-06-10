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

      {/* Projects Reorder List */}
      <div className="space-y-3 max-w-4xl">
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
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                isDragging
                  ? "bg-slate-800/40 border-blue-500/50 border-dashed opacity-50 scale-[0.99]"
                  : "bg-slate-900/60 hover:bg-slate-800/20 border-slate-800 hover:border-slate-700/80"
              }`}
            >
              {/* Grip Handle Indicator */}
              <div className="text-slate-600 hover:text-slate-400 shrink-0">
                <GripVertical size={20} />
              </div>

              {/* Number Badge */}
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-semibold text-slate-300 shrink-0 font-mono">
                {index + 1}
              </div>

              {/* Thumbnail */}
              <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 shrink-0 hidden sm:block">
                <img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/150x100/1e293b/ffffff?text=Preview";
                  }}
                />
              </div>

              {/* Project Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">{project.title}</h3>
                <p className="text-xs text-slate-500 truncate mt-0.5 hidden md:block">
                  {project.description}
                </p>
              </div>

              {/* Tech Stack Badges */}
              <div className="hidden lg:flex items-center gap-1.5 shrink-0 max-w-[30%] flex-wrap justify-end">
                {techArray.slice(0, 3).map((techName) => (
                  <span
                    key={techName}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[10px] font-medium"
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
          );
        })}

        {projects.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl">
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
