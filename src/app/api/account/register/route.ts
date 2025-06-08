// File: src/app/api/account/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // Menggunakan instance Prisma yang sudah ada

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 1. Validasi input dasar
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, dan password harus diisi." },
        { status: 400 }
      );
    }

    // 2. Cek apakah pengguna sudah ada di database menggunakan Prisma
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 } // 409 Conflict: Email sudah ada
      );
    }

    // 3. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat pengguna baru di database menggunakan Prisma
    await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
        provider: "credentials", // Tandai provider-nya
      },
    });

    // 5. Kirim respons sukses
    return NextResponse.json(
      { message: "Registrasi berhasil!" },
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Kesalahan saat registrasi:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
