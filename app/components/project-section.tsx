"use client";

import React, { useState } from "react";
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Github } from "./custom-icons";

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

export default function ProjectSection({ projects }: { projects: ProjectItem[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openModal = (project: ProjectItem) => {
    setSelectedProject(project);
    setActiveImageIndex(0); // Reset to first image (thumbnail)
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsLightboxOpen(false);
  };

  return (
    <section id="projects" className="py-32 px-6 relative bg-slate-900/20 border-y border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Karya Unggulan</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Beberapa proyek komersial dan personal terbaik yang pernah saya kembangkan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const techArray = project.techStack
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t !== "");

            return (
              <div
                key={project.id}
                onClick={() => openModal(project)}
                className="group relative rounded-3xl bg-white/5 border border-white/10 overflow-hidden backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)] hover:border-white/20 flex flex-col cursor-pointer"
              >
                {/* Image Container with Zoom Effect */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-80"></div>
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/800x450/1e293b/ffffff?text=SuontongDev";
                    }}
                  />
                  {/* Top Right Links */}
                  <div className="absolute top-4 right-4 z-20 flex gap-2 translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-blue-600 backdrop-blur-md border border-white/10 transition-colors"
                      >
                        <Github size={16} />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-full bg-black/50 text-white hover:bg-blue-600 backdrop-blur-md border border-white/10 transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-8 leading-relaxed flex-1 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags - Footer */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5 mt-auto">
                    {techArray.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative bg-[#0b0f19] border border-white/10 rounded-3xl w-full max-w-4xl my-8 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 text-white hover:bg-blue-600 border border-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Left Column: Image Gallery */}
            <div className="w-full md:w-1/2 bg-black/40 flex flex-col justify-between p-6 border-b md:border-b-0 md:border-r border-white/5">
              {/* Active Image View */}
              <div className="relative flex-1 flex items-center justify-center min-h-[250px] md:min-h-[350px] overflow-hidden">
                {(() => {
                  const allImages = [selectedProject.thumbnailUrl, ...selectedProject.images.map(img => img.url)];
                  const currentImgUrl = allImages[activeImageIndex];

                  return (
                    <>
                      <img
                        src={currentImgUrl}
                        alt={`${selectedProject.title} screenshot`}
                        onClick={() => setIsLightboxOpen(true)}
                        className="max-w-full max-h-[350px] object-contain rounded-xl shadow-lg cursor-zoom-in hover:scale-[1.02] transition-all duration-300"
                        title="Klik untuk memperbesar gambar"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/800x450/1e293b/ffffff?text=Image+Unavailable";
                        }}
                      />

                      {/* Navigation Arrows */}
                      {allImages.length > 1 && (
                        <>
                          <button
                            onClick={() => setActiveImageIndex((activeImageIndex - 1 + allImages.length) % allImages.length)}
                            className="absolute left-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-blue-600 border border-white/5 cursor-pointer"
                          >
                            <ChevronLeft size={18} />
                          </button>
                          <button
                            onClick={() => setActiveImageIndex((activeImageIndex + 1) % allImages.length)}
                            className="absolute right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-blue-600 border border-white/5 cursor-pointer"
                          >
                            <ChevronRight size={18} />
                          </button>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Thumbnails list */}
              {(() => {
                const allImages = [selectedProject.thumbnailUrl, ...selectedProject.images.map(img => img.url)];
                if (allImages.length <= 1) return null;

                return (
                  <div className="flex gap-2 mt-4 overflow-x-auto py-2 px-1 justify-center scrollbar-thin scrollbar-thumb-white/10">
                    {allImages.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activeImageIndex === idx ? "border-blue-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Right Column: Project Details */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                  {selectedProject.title}
                </h3>
                
                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedProject.techStack.split(",").map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>

                <div className="h-[1px] bg-white/5 w-full mb-6"></div>

                <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Tentang Proyek</h4>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line mb-8">
                  {selectedProject.description}
                </p>
              </div>

              {/* Project Links */}
              {(selectedProject.githubUrl || selectedProject.liveUrl) && (
                <div className="flex gap-4 mt-auto pt-6 border-t border-white/5 shrink-0">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all text-sm cursor-pointer"
                    >
                      <Github size={18} />
                      Repository
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 text-sm cursor-pointer"
                    >
                      <ExternalLink size={18} />
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Full-Screen Lightbox */}
      {isLightboxOpen && selectedProject && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md cursor-zoom-out"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 text-white hover:bg-red-600 hover:text-white border border-white/10 transition-colors cursor-pointer z-[110]"
          >
            <X size={24} />
          </button>

          {/* Lightbox Content Container */}
          <div 
            className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center"
          >
            {(() => {
              const allImages = [selectedProject.thumbnailUrl, ...selectedProject.images.map(img => img.url)];
              const currentImgUrl = allImages[activeImageIndex];

              return (
                <>
                  <img
                    src={currentImgUrl}
                    alt={`${selectedProject.title} full screenshot`}
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-full max-h-[90vh] object-contain rounded-2xl border border-white/10 shadow-2xl select-none cursor-default"
                  />

                  {/* Navigation Arrows inside Lightbox */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex - 1 + allImages.length) % allImages.length); }}
                        className="absolute left-4 p-3 rounded-full bg-black/60 text-white hover:bg-blue-600 border border-white/10 cursor-pointer transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveImageIndex((activeImageIndex + 1) % allImages.length); }}
                        className="absolute right-4 p-3 rounded-full bg-black/60 text-white hover:bg-blue-600 border border-white/10 cursor-pointer transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
}
