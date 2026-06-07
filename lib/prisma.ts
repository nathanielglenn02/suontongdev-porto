import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ||
    (() => {
        // 1. Kita bedah URL TiDB dari file .env
        const dbUrl = new URL(process.env.DATABASE_URL as string);

        // 2. Kita masukkan konfigurasinya dalam bentuk Object
        const adapter = new PrismaMariaDb({
            host: dbUrl.hostname,
            port: Number(dbUrl.port) || 4000,
            user: dbUrl.username,
            password: dbUrl.password,
            database: dbUrl.pathname.substring(1), // Menghapus tanda '/' di awal nama database
            ssl: { rejectUnauthorized: true },     // KUNCI UTAMA: Memaksa enkripsi SSL menyala!
            connectTimeout: 10000,                 // Batas waktu pembuatan socket baru (10 detik)
            acquireTimeout: 10000,                 // Batas waktu mengambil koneksi dari pool (10 detik)
        });

        // 3. Injeksi ke Prisma Client
        return new PrismaClient({
            adapter,
            log: ["query"]
        });
    })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;