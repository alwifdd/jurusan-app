import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise"; // Menggunakan mysql2/promise untuk async/await

// Konfigurasi koneksi database Anda
// AMANkan kredensial ini menggunakan environment variables di proyek production!
// Untuk development, Anda bisa set di file .env.local
const dbConfig = {
  host: process.env.DB_HOST || "localhost", // atau 127.0.0.1
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "", // Isi dengan password root MySQL Anda jika ada
  database: process.env.DB_NAME || "jurusan_app_db",
};

export async function POST(request: Request) {
  let connection; // Deklarasikan di luar try-catch agar bisa diakses di finally

  try {
    // 1. Ambil data dari body request
    const { name, email, password } = await request.json();

    // 2. Validasi input dasar
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nama, email, dan password tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Validasi format email (sederhana)
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { message: "Format email tidak valid." },
        { status: 400 }
      );
    }

    // Validasi panjang password (contoh)
    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password minimal harus 6 karakter." },
        { status: 400 }
      );
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Buat koneksi ke database
    connection = await mysql.createConnection(dbConfig);

    // 5. Cek apakah email sudah terdaftar (opsional tapi direkomendasikan)
    const [existingUsers] = await connection.execute(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );

    // TypeScript mungkin akan menganggap existingUsers sebagai array RowDataPacket[], OkPacket, dll.
    // Kita perlu melakukan type assertion atau pengecekan yang lebih baik
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      await connection.end(); // Tutup koneksi sebelum return
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 } // 409 Conflict
      );
    }

    // 6. Simpan pengguna baru ke database
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password_hash, provider) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "credentials"] // provider diisi 'credentials'
    );

    // Anda bisa cek result.insertId untuk mendapatkan ID pengguna baru jika perlu

    await connection.end(); // Tutup koneksi setelah selesai

    // 7. Kirim respons berhasil
    return NextResponse.json(
      { message: "Registrasi berhasil!", userId: (result as any).insertId }, // Memberikan user ID kembali
      { status: 201 } // 201 Created
    );
  } catch (error) {
    console.error("Error registrasi:", error);
    if (connection) {
      await connection.end(); // Pastikan koneksi ditutup jika terjadi error
    }
    // Cek apakah error disebabkan oleh duplikasi email (kode error ER_DUP_ENTRY untuk MySQL biasanya 1062)
    if ((error as any).code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
