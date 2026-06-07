"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  name: string;
  defaultValue?: string;
  placeholder?: string;
}

export default function ImageUploader({ name, defaultValue = "", placeholder = "https://..." }: ImageUploaderProps) {
  const [url, setUrl] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        setUrl(data.url);
      } else if (data.error) {
        alert("Gagal mengunggah: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {/* URL Text Input & Upload Trigger Row */}
      <div className="flex gap-2">
        <input
          type="text"
          name={name}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={placeholder}
        />
        {url && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg text-sm flex items-center justify-center cursor-pointer"
            title="Reset"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
          dragActive
            ? "border-blue-500 bg-blue-50/50"
            : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-1 text-slate-500">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="text-xs font-medium">Mengunggah gambar...</span>
          </div>
        ) : url ? (
          <div className="flex items-center gap-4 w-full">
            <div className="w-16 h-12 rounded-md overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
              <img
                src={url}
                alt="Upload preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/150x100/1e293b/ffffff?text=Preview";
                }}
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs text-slate-400 truncate font-mono">{url}</p>
              <p className="text-xs text-blue-500 font-semibold mt-0.5">Berhasil diunggah! Klik untuk ganti gambar.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-500 text-center">
            <Upload size={20} className="text-slate-400" />
            <span className="text-xs font-medium">Tarik & lepas gambar di sini, atau <span className="text-blue-500">pilih file</span></span>
            <span className="text-[10px] text-slate-400">PNG, JPG, JPEG up to 10MB</span>
          </div>
        )}
      </div>
    </div>
  );
}
