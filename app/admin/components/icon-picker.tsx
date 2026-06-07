"use client";

import React, { useState } from "react";
import { iconMap, devicons } from "@/lib/icons";
import { Search, ChevronDown, Code2 } from "lucide-react";

interface IconPickerProps {
  name: string;
  defaultValue?: string;
}

export default function IconPicker({ name, defaultValue = "Code2" }: IconPickerProps) {
  const [selectedIcon, setSelectedIcon] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"brand" | "lucide">(
    defaultValue.startsWith("devicon-") ? "brand" : "lucide"
  );
  const [search, setSearch] = useState("");

  const handleSelect = (iconName: string) => {
    setSelectedIcon(iconName);
    setIsOpen(false);
  };

  // Render trigger icon preview (either Devicon or Lucide)
  const renderTriggerPreview = () => {
    if (selectedIcon.startsWith("devicon-")) {
      return <i className={`${selectedIcon} colored text-xl shrink-0`} />;
    }
    const SelectedLucideIcon = iconMap[selectedIcon] || Code2;
    return <SelectedLucideIcon size={18} className="shrink-0" />;
  };

  // Filter Devicons (Brand icons)
  const filteredBrands = Object.entries(devicons).filter(([label, className]) =>
    label.toLowerCase().includes(search.toLowerCase()) || className.toLowerCase().includes(search.toLowerCase())
  );

  // Filter Lucide icons
  const filteredLucide = Object.keys(iconMap).filter((iconName) =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selectedIcon} />
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className="w-8 h-8 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0">
            {renderTriggerPreview()}
          </span>
          <span className="font-medium truncate">
            {selectedIcon.startsWith("devicon-") 
              ? Object.keys(devicons).find(key => devicons[key] === selectedIcon) || selectedIcon
              : selectedIcon
            }
          </span>
        </span>
        <ChevronDown size={16} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Popover Panel */}
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          <div className="absolute left-0 bottom-full mb-2 w-full min-w-[320px] max-w-sm bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[300px]">
            {/* Search Input */}
            <div className="p-3 border-b border-slate-100 flex items-center bg-slate-50 gap-2 shrink-0">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari ikon..."
                className="w-full bg-transparent border-0 text-sm text-slate-800 focus:outline-none placeholder-slate-400"
                autoFocus
              />
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100 text-xs font-semibold bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => { setActiveTab("brand"); setSearch(""); }}
                className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === "brand"
                    ? "border-blue-500 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Brand Coding
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("lucide"); setSearch(""); }}
                className={`flex-1 py-2 text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === "lucide"
                    ? "border-blue-500 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                Ikon Umum
              </button>
            </div>

            {/* Grid List area */}
            <div className="overflow-y-auto p-3 grid grid-cols-4 gap-2 flex-1 scrollbar-thin scrollbar-thumb-slate-200">
              {activeTab === "brand" ? (
                filteredBrands.map(([label, className]) => (
                  <button
                    key={className}
                    type="button"
                    onClick={() => handleSelect(className)}
                    className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1.5 border transition-all hover:bg-blue-50 hover:border-blue-300 group cursor-pointer ${
                      selectedIcon === className
                        ? "bg-blue-50 border-blue-500"
                        : "border-slate-100"
                    }`}
                    title={label}
                  >
                    <i className={`${className} colored text-2xl group-hover:scale-110 transition-transform`} />
                    <span className="text-[9px] truncate w-full text-center text-slate-500 group-hover:text-blue-600 font-medium mt-0.5">
                      {label}
                    </span>
                  </button>
                ))
              ) : (
                filteredLucide.map((iconName) => {
                  const IconComp = iconMap[iconName];
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleSelect(iconName)}
                      className={`p-2 rounded-lg flex flex-col items-center justify-center gap-1.5 border transition-all hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 group cursor-pointer ${
                        selectedIcon === iconName
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "border-slate-100 text-slate-500"
                      }`}
                      title={iconName}
                    >
                      <IconComp size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] truncate w-full text-center group-hover:text-blue-600 font-medium mt-0.5">
                        {iconName}
                      </span>
                    </button>
                  );
                })
              )}
              {activeTab === "brand" && filteredBrands.length === 0 && (
                <div className="col-span-4 py-8 text-center text-xs text-slate-400 italic">
                  Brand coding tidak ditemukan.
                </div>
              )}
              {activeTab === "lucide" && filteredLucide.length === 0 && (
                <div className="col-span-4 py-8 text-center text-xs text-slate-400 italic">
                  Ikon tidak ditemukan.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
