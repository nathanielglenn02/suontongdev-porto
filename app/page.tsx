import { prisma } from "@/lib/prisma";

export default async function Home() {
  // Mengambil data dari tabel Tech di TiDB
  const techStacks = await prisma.tech.findMany();

  return (
    <main className="p-10 flex flex-col gap-4 items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-blue-500">Koneksi TiDB Sukses! 🚀</h1>
      <p className="text-gray-500">Berikut adalah isi tabel Tech saat ini:</p>

      <div className="bg-gray-900 text-green-400 p-6 rounded-xl w-full max-w-md overflow-auto">
        <pre>{JSON.stringify(techStacks, null, 2)}</pre>
      </div>
    </main>
  );
}