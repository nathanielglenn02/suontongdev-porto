import React from "react";
import {
  Mail,
  ChevronDown,
  MapPin,
  Sparkles,
  Rocket
} from 'lucide-react';
import { Github, Linkedin } from "@/app/components/custom-icons";
import { prisma } from "@/lib/prisma";
import { iconMap } from "@/lib/icons";
import ProjectSection from "./components/project-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const techs = await prisma.tech.findMany({
    orderBy: { id: "asc" },
  });

  const projects = await prisma.project.findMany({
    include: {
      images: {
        orderBy: { id: "asc" },
      },
    },
    orderBy: { id: "desc" },
  });

  return (
    <div className="bg-[#050505] text-slate-300 font-sans min-h-screen selection:bg-blue-500/30 selection:text-blue-200 relative overflow-hidden">

      {/* Custom Keyframes for Animations */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
          0% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
          100% { opacity: 0.5; transform: scale(1); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-slide-down {
          animation: slideDown 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-[pulseGlow_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[30%] h-[40%] rounded-full bg-purple-600/10 blur-[120px] animate-[pulseGlow_10s_ease-in-out_infinite_reverse]"></div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 animate-slide-down">
        <div className="mx-auto mt-4 max-w-5xl px-6">
          <div className="h-14 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-between px-6 shadow-lg shadow-black/20">
            <div className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="text-blue-500 w-5 h-5" />
              Suontong<span className="text-blue-500">Dev</span>
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium">
              <a href="#home" className="hover:text-blue-400 transition-colors">Beranda</a>
              <a href="#tech" className="hover:text-blue-400 transition-colors">Stack</a>
              <a href="#projects" className="hover:text-blue-400 transition-colors">Proyek</a>
            </div>
            <a href="#contact" className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-all border border-white/5 hover:border-white/20">
              Sapa Saya
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">

        {/* Hero Section */}
        <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">

            {/* Status Badge */}
            <div className="animate-fade-in-up delay-100 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-800 text-slate-300 text-sm font-medium mb-8 backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Tersedia untuk proyek baru
            </div>

            {/* Main Headline */}
            <h1 className="animate-fade-in-up delay-200 text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Membangun Solusi Digital <br className="hidden md:block" />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl opacity-20"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500">
                  Terintegrasi dengan Arsitektur Modern.
                </span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="animate-fade-in-up delay-300 text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Saya seorang Software Engineer yang ahli dalam pengembangan full-stack web dan aplikasi mobile. Berfokus pada perancangan sistem berskala enterprise dan integrasi API yang solid menggunakan ekosistem modern seperti NestJS, Next.js, dan Laravel.
            </p>

            {/* CTA Buttons */}
            <div className="animate-fade-in-up delay-400 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <a href="#projects" className="group relative px-8 py-4 rounded-xl bg-blue-600 text-white font-medium transition-all hover:bg-blue-500 flex items-center gap-2 w-full sm:w-auto justify-center overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                <Rocket size={20} className="relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                <span className="relative z-10">Jelajahi Proyek</span>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all border border-white/10 flex items-center gap-2 w-full sm:w-auto justify-center backdrop-blur-sm">
                <Github size={20} />
                Lihat GitHub
              </a>
            </div>

            {/* Scroll Indicator */}
            <div className="animate-fade-in-up delay-500 mt-24 animate-float text-slate-500 flex justify-center opacity-50">
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
                <ChevronDown size={20} />
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech" className="py-32 px-6 relative">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/3">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Senjata <br /><span className="text-blue-500">Pilihan</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-6">
                  Teknologi modern yang saya gunakan sehari-hari untuk membangun aplikasi yang cepat, aman, dan skalabel.
                </p>
                <div className="h-1 w-12 bg-blue-500 rounded-full"></div>
              </div>

              <div className="w-full md:w-2/3 flex flex-wrap gap-3">
                {techs.map((tech) => {
                  return (
                    <div
                      key={tech.id}
                      className="group relative px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-medium overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] hover:text-white"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span className="relative z-10 flex items-center gap-2">
                        {tech.icon.startsWith("devicon-") ? (
                          <i className={`${tech.icon} colored text-base group-hover:scale-110 transition-transform`} />
                        ) : (
                          (() => {
                            const IconComponent = iconMap[tech.icon] || Sparkles;
                            return <IconComponent size={14} className="text-blue-500/50 group-hover:text-blue-400 transition-colors" />;
                          })()
                        )}
                        {tech.name}
                      </span>
                    </div>
                  );
                })}
                {techs.length === 0 && (
                  <p className="text-slate-500 text-sm italic">Belum ada tech stack yang ditambahkan.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <ProjectSection projects={projects} />

        {/* Contact & Footer */}
        <footer id="contact" className="py-24 px-6 relative overflow-hidden">
          <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">Mari Ciptakan Sesuatu</h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg">
              Sedang merencanakan proyek baru atau butuh diskusi seputar arsitektur sistem? Kotak masuk saya selalu terbuka.
            </p>
            <a href="mailto:halo@suontongdev.com" className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white text-black font-bold hover:bg-slate-200 hover:scale-105 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] mb-24">
              <Mail size={20} />
              Kirim Pesan
            </a>

            <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 text-slate-500 text-sm">
              <p>&copy; {new Date().getFullYear()} SuontongDev. All rights reserved.</p>
              <div className="flex items-center gap-6 mt-4 md:mt-0">
                <div className="flex items-center gap-1"><MapPin size={16} /> Surabaya, ID</div>
                <a href="https://www.linkedin.com/in/nathanielglenn02/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"><Linkedin size={18} /></a>
                <a href="https://github.com/nathanielglenn02" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/5"><Github size={18} /></a>
              </div>
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}