import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

// Konfigurasi koneksi database Anda (sama seperti di file register)
// Pastikan Anda sudah mengatur environment variables di .env.local
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // Password root MySQL Anda
  database: process.env.DB_NAME || "jurusan_app_db",
};

export async function POST(request: Request) {
  let connection;

  try {
    // 1. Ambil data email dan password dari body request
    const { email, password } = await request.json();

    // 2. Validasi input dasar
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email dan password tidak boleh kosong." },
        { status: 400 }
      );
    }

    // 3. Buat koneksi ke database
    connection = await mysql.createConnection(dbConfig);

    // 4. Cari pengguna berdasarkan email
    const [users] = await connection.execute(
      "SELECT id, name, email, password_hash, provider FROM users WHERE email = ?",
      [email]
    );

    // Cek apakah pengguna ditemukan
    // `users` akan menjadi array. Jika kosong, pengguna tidak ditemukan.
    if (!Array.isArray(users) || users.length === 0) {
      await connection.end();
      return NextResponse.json(
        { message: "Email atau password salah." }, // Pesan generik agar tidak memberi info spesifik
        { status: 401 } // 401 Unauthorized
      );
    }

    // Ambil data pengguna pertama (karena email itu unik)
    const user = users[0] as any; // Lakukan type assertion jika perlu, atau definisikan interface User

    // 5. Jika pengguna mendaftar via Google, jangan biarkan login dengan password
    if (user.provider && user.provider !== "credentials") {
      await connection.end();
      return NextResponse.json(
        {
          message: `Akun ini terdaftar melalui ${user.provider}. Silakan login menggunakan metode tersebut.`,
        },
        { status: 403 } // 403 Forbidden
      );
    }

    // Jika pengguna tidak memiliki password_hash (misalnya akun Google yang belum pernah set password)
    // atau jika provider bukan 'credentials', ini seharusnya tidak terjadi jika alur registrasi benar.
    if (!user.password_hash) {
      await connection.end();
      return NextResponse.json(
        {
          message:
            "Akun ini tidak memiliki password. Mungkin Anda mendaftar via metode lain?",
        },
        { status: 401 }
      );
    }

    // 6. Bandingkan password yang diinput dengan password_hash yang tersimpan
    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      await connection.end();
      return NextResponse.json(
        { message: "Email atau password salah." }, // Pesan generik
        { status: 401 }
      );
    }

    // 7. Login berhasil (untuk saat ini, kita hanya kirim pesan sukses dan data pengguna dasar)
    // Pembuatan sesi/token akan ditangani oleh NextAuth.js nanti
    await connection.end();

    // Jangan kirim password_hash ke frontend
    const { password_hash, ...userWithoutPassword } = user;

    return NextResponse.json(
      {
        message: "Login berhasil!",
        user: userWithoutPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error login:", error);
    if (connection) {
      await connection.end();
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
