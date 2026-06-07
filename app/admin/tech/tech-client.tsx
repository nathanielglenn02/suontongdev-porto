"use client";

import React, { useState, useTransition } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { createTech, updateTech, deleteTech } from "./actions";
import { useActionState } from "react";
import { iconMap } from "@/lib/icons";
import IconPicker from "../components/icon-picker";


interface TechItem {
  id: number;
  name: string;
  icon: string;
}

export default function TechClientPage({ initialTechs }: { initialTechs: TechItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<TechItem | null>(null);
  const [name, setName] = useState("");
  const [isPendingDelete, startDeleteTransition] = useTransition();

  // For the Form
  const formAction = editingTech 
    ? updateTech.bind(null, editingTech.id)
    : createTech;

  const [state, action, isPending] = useActionState(async (prevState: { error?: string; success?: boolean } | null, formData: FormData) => {
    const res = await formAction(prevState, formData);
    if (res.success) {
      setIsModalOpen(false);
      setEditingTech(null);
      setName("");
    }
    return res;
  }, null);

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus tech stack ini?")) {
      startDeleteTransition(async () => {
        const res = await deleteTech(id);
        if (res.error) {
          alert(res.error);
        }
      });
    }
  };

  const openAddModal = () => {
    setEditingTech(null);
    setName("");
    setIsModalOpen(true);
  };

  const openEditModal = (tech: TechItem) => {
    setEditingTech(tech);
    setName(tech.name);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-slate-500 text-sm">Daftar teknologi dan bahasa pemrograman yang Anda kuasai.</p>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm text-sm cursor-pointer"
        >
          <Plus size={18} />
          Tambah Tech Stack
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initialTechs.map((tech) => {
          return (
            <div key={tech.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                  {tech.icon.startsWith("devicon-") ? (
                    <i className={`${tech.icon} colored text-xl`} />
                  ) : (
                    (() => {
                      const IconComponent = iconMap[tech.icon] || Code2;
                      return <IconComponent size={20} />;
                    })()
                  )}
                </div>
                <span className="font-semibold text-slate-800">{tech.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => openEditModal(tech)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md cursor-pointer"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(tech.id)}
                  disabled={isPendingDelete}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md cursor-pointer disabled:opacity-50"
                  title="Hapus"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-100 relative">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center rounded-t-2xl">
              <h3 className="font-bold text-slate-800">
                {editingTech ? "Edit Tech Stack" : "Tambah Tech Stack Baru"}
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingTech(null); }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form action={action} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">
                  Nama Tech Stack
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Next.js, MySQL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="icon">
                  Pilih Ikon
                </label>
                <IconPicker
                  name="icon"
                  defaultValue={editingTech?.icon || "Code2"}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Pilih salah satu jenis ikon yang paling sesuai untuk tech stack ini.
                </p>
              </div>

              {state?.error && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-2.5 rounded-lg border border-red-100">
                  {state.error}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsModalOpen(false); setEditingTech(null); }}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm cursor-pointer disabled:bg-blue-800"
                >
                  {isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
