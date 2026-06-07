"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, X, Trash } from "lucide-react";
import { createProject, updateProject, deleteProject } from "./actions";
import { useActionState } from "react";
import ImageUploader from "../components/image-uploader";
import { iconMap } from "@/lib/icons";

interface TechItem {
  id: number;
  name: string;
  icon: string;
}

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

export default function ProjectsClientPage({ 
  initialProjects,
  availableTechs = []
}: { 
  initialProjects: ProjectItem[];
  availableTechs?: TechItem[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [extraImages, setExtraImages] = useState<string[]>([]);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isPendingDelete, startDeleteTransition] = useTransition();

  // For the Form Action
  const formAction = editingProject 
    ? updateProject.bind(null, editingProject.id)
    : createProject;

  const [state, action, isPending] = useActionState(async (prevState: { error?: string; success?: boolean } | null, formData: FormData) => {
    const res = await formAction(prevState, formData);
    if (res.success) {
      setIsModalOpen(false);
      setEditingProject(null);
      setExtraImages([]);
      setSelectedTechs([]);
      setTitle("");
      setDescription("");
      setGithubUrl("");
      setLiveUrl("");
    }
    return res;
  }, null);

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      startDeleteTransition(async () => {
        const res = await deleteProject(id);
        if (res.error) {
          alert(res.error);
        }
      });
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    setExtraImages([]);
    setSelectedTechs([]);
    setTitle("");
    setDescription("");
    setGithubUrl("");
    setLiveUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (project: ProjectItem) => {
    setEditingProject(project);
    setExtraImages(project.images.map(img => img.url));
    const techs = project.techStack
      ? project.techStack.split(",").map(t => t.trim()).filter(Boolean)
      : [];
    setSelectedTechs(techs);
    setTitle(project.title);
    setDescription(project.description);
    setGithubUrl(project.githubUrl || "");
    setLiveUrl(project.liveUrl || "");
    setIsModalOpen(true);
  };

  const handleToggleTech = (techName: string) => {
    if (selectedTechs.includes(techName)) {
      setSelectedTechs(selectedTechs.filter(t => t !== techName));
    } else {
      setSelectedTechs([...selectedTechs, techName]);
    }
  };

  const handleRemoveTech = (techName: string) => {
    setSelectedTechs(selectedTechs.filter(t => t !== techName));
  };

  const handleAddCustomTech = (techName: string) => {
    const trimmed = techName.trim();
    if (trimmed && !selectedTechs.includes(trimmed)) {
      setSelectedTechs([...selectedTechs, trimmed]);
    }
  };

  const handleAddImageField = () => {
    setExtraImages([...extraImages, ""]);
  };

  const handleRemoveImageField = (index: number) => {
    setExtraImages(extraImages.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-slate-500 text-sm">Kelola semua proyek yang akan ditampilkan di halaman portofolio.</p>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm cursor-pointer"
        >
          <Plus size={18} />
          Tambah Proyek Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm text-slate-600">
                <th className="p-4 font-semibold">Info Proyek</th>
                <th className="p-4 font-semibold hidden md:table-cell">Tech Stack</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initialProjects.map((project) => {
                const techArray = project.techStack
                  .split(",")
                  .map((t) => t.trim())
                  .filter((t) => t !== "");

                return (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={project.thumbnailUrl} 
                          alt={project.title} 
                          className="w-24 h-16 object-cover rounded-md border border-slate-200 hidden sm:block bg-slate-100" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://placehold.co/150x100/1e293b/ffffff?text=No+Image";
                          }}
                        />
                        <div className="max-w-md">
                          <h3 className="font-semibold text-slate-800 text-base">{project.title}</h3>
                          <p className="text-slate-500 text-sm mt-0.5 line-clamp-1">{project.description}</p>
                          <div className="flex items-center gap-1.5 mt-2 text-xs md:hidden flex-wrap">
                            {techArray.map((t) => (
                              <span key={t} className="px-2 py-0.5 bg-slate-100 rounded text-slate-600">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1.5">
                        {techArray.map((t) => (
                          <span key={t} className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-xs font-medium text-slate-600">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(project)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer" 
                          title="Edit Proyek"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(project.id)}
                          disabled={isPendingDelete}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50" 
                          title="Hapus Proyek"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {initialProjects.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500 text-sm">
                    Belum ada proyek yang ditambahkan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-bold text-slate-800">
                {editingProject ? "Edit Proyek" : "Tambah Proyek Baru"}
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingProject(null); setExtraImages([]); }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form action={action} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="title">
                    Judul Proyek
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Contoh: Portfolio Website"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tech Stack Proyek
                  </label>
                  
                  {/* Selected Techs area / Pills */}
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[42px] items-center mb-2">
                    {selectedTechs.length > 0 ? (
                      selectedTechs.map((tech) => (
                        <span 
                          key={tech} 
                          className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-blue-200"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(tech)}
                            className="hover:text-blue-900 focus:outline-none cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 px-1">Pilih teknologi di bawah atau tambahkan yang kustom...</span>
                    )}
                  </div>

                  {/* Hidden input to submit the comma-separated string */}
                  <input type="hidden" name="techStack" value={selectedTechs.join(", ")} />

                  {/* Selection from Tech Table */}
                  {availableTechs.length > 0 && (
                    <div className="space-y-1.5 mb-2">
                      <p className="text-xs text-slate-500 font-medium">Pilih dari Tech Stack Anda:</p>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 border border-slate-100 rounded-lg bg-slate-50/50">
                        {availableTechs.map((tech) => {
                          const isSelected = selectedTechs.includes(tech.name);
                          return (
                            <button
                              key={tech.id}
                              type="button"
                              onClick={() => handleToggleTech(tech.name)}
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-blue-600 border-blue-600 text-white shadow-sm font-semibold"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                              }`}
                            >
                              <span className="shrink-0 flex items-center justify-center">
                                {tech.icon.startsWith("devicon-") ? (
                                  <i className={`${tech.icon} ${isSelected ? "text-white" : "colored"} text-xs`} />
                                ) : (
                                  (() => {
                                    const IconComponent = iconMap[tech.icon];
                                    return IconComponent ? <IconComponent size={12} className={isSelected ? "text-white" : "text-slate-500"} /> : null;
                                  })()
                                )}
                              </span>
                              {tech.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add Custom Tech Stack Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="custom-tech-input"
                      placeholder="Masukkan tech stack kustom lainnya..."
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (val) {
                            handleAddCustomTech(val);
                            e.currentTarget.value = "";
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById("custom-tech-input") as HTMLInputElement;
                        if (input && input.value.trim()) {
                          handleAddCustomTech(input.value.trim());
                          input.value = "";
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-xs cursor-pointer border border-slate-200"
                    >
                      Tambah
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tekan Enter atau klik Tambah untuk memasukkan teknologi kustom yang belum terdaftar di tabel Tech.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="description">
                  Deskripsi Proyek
                </label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsikan fitur, tantangan, dan arsitektur proyek ini..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="githubUrl">
                    GitHub URL (Opsional)
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://github.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="liveUrl">
                    Live Demo URL (Opsional)
                  </label>
                  <input
                    type="url"
                    name="liveUrl"
                    id="liveUrl"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="thumbnailUrl">
                  Gambar Thumbnail Proyek
                </label>
                <ImageUploader
                  name="thumbnailUrl"
                  defaultValue={editingProject?.thumbnailUrl || ""}
                  placeholder="Masukkan URL atau unggah file di bawah..."
                />
              </div>

              {/* Dynamic Project Image Gallery URL Inputs */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700">
                    Galeri Gambar Tambahan (Opsional)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddImageField}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md border border-slate-200 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} />
                    Tambah URL Gambar
                  </button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {extraImages.map((imgUrl, index) => (
                    <div key={index} className="flex gap-2 items-start bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <div className="flex-1 min-w-0">
                        <ImageUploader
                          name="imageUrls"
                          defaultValue={imgUrl}
                          placeholder="Masukkan URL atau unggah file di bawah..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveImageField(index)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mt-1"
                        title="Hapus gambar"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                  {extraImages.length === 0 && (
                    <p className="text-xs text-slate-400 italic">Belum ada gambar tambahan di galeri.</p>
                  )}
                </div>
              </div>

              {state?.error && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-2.5 rounded-lg border border-red-100 shrink-0">
                  {state.error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 shrink-0">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingProject(null); setExtraImages([]); }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm cursor-pointer disabled:bg-blue-800"
                >
                  {isPending ? "Menyimpan..." : "Simpan Proyek"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
