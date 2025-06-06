// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User, Account, Profile } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Pastikan ini diimpor
import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

// Konfigurasi koneksi database Anda (dari .env.local)
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jurusan_app_db",
};

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password tidak boleh kosong.");
        }

        let connection;
        try {
          connection = await mysql.createConnection(dbConfig);
          const [users] = await connection.execute(
            "SELECT id, name, email, password_hash, provider FROM users WHERE email = ?",
            [credentials.email]
          );

          if (!Array.isArray(users) || users.length === 0) {
            await connection.end();
            console.log("User tidak ditemukan untuk email:", credentials.email);
            throw new Error("Email atau password salah.");
          }

          const user = users[0] as any;

          if (user.provider !== "credentials" || !user.password_hash) {
            await connection.end();
            console.log(
              "Attempt to login with credentials for non-credentials user:",
              user.email,
              user.provider
            );
            throw new Error(
              "Metode login tidak sesuai atau akun tidak memiliki password."
            );
          }

          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          if (!isPasswordMatch) {
            await connection.end();
            console.log("Password tidak cocok untuk email:", credentials.email);
            throw new Error("Email atau password salah.");
          }

          await connection.end();
          console.log("Login berhasil untuk (credentials):", user.email);
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image, // Sertakan image jika ada di tabel user Anda
          };
        } catch (error) {
          if (connection) {
            await connection.end();
          }
          console.error("Authorize error:", error);
          // Biarkan error dilempar agar NextAuth menanganinya
          // Jika ingin pesan kustom, pastikan tidak null
          if (error instanceof Error) {
            throw new Error(error.message || "Terjadi kesalahan autentikasi.");
          }
          throw new Error("Terjadi kesalahan autentikasi.");
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        let connection;
        try {
          connection = await mysql.createConnection(dbConfig);
          const [existingUsers] = await connection.execute(
            "SELECT id, name, email, image, provider FROM users WHERE email = ?",
            [profile.email]
          );

          let dbUserId = user.id; // Ambil id dari user object yang mungkin sudah diisi NextAuth dari profile

          if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            const existingUser = existingUsers[0] as any;
            dbUserId = existingUser.id.toString(); // Gunakan ID dari DB jika user sudah ada
            // Update nama atau gambar jika dari Google berbeda dan lebih baru (opsional)
            if (
              existingUser.name !== profile.name ||
              existingUser.image !== (profile as any).picture
            ) {
              await connection.execute(
                "UPDATE users SET name = ?, image = ?, provider = ?, provider_id = ?, updated_at = NOW() WHERE email = ?",
                [
                  profile.name,
                  (profile as any).picture,
                  account.provider,
                  account.providerAccountId,
                  profile.email,
                ]
              );
            }
          } else {
            // User belum ada, buat user baru
            const [result] = await connection.execute(
              "INSERT INTO users (name, email, image, provider, provider_id, email_verified) VALUES (?, ?, ?, ?, ?, NOW())",
              [
                profile.name,
                profile.email,
                (profile as any).picture,
                account.provider,
                account.providerAccountId,
              ]
            );
            dbUserId = (result as any).insertId.toString();
          }
          // Pastikan user object yang diteruskan ke callback jwt memiliki id yang benar dari database kita
          user.id = dbUserId;
          // Dan properti lain yang mungkin dibutuhkan jwt/session callback
          user.name = profile.name;
          user.email = profile.email;
          user.image = (profile as any).picture;

          await connection.end();
          console.log(`User ${profile.email} signed in/updated via Google.`);
          return true;
        } catch (error) {
          console.error("Error during Google sign-in DB upsert:", error);
          if (connection) await connection.end();
          return false; // GAGALKAN sign in jika ada error DB
        }
      }
      return true; // Izinkan sign in untuk provider lain (seperti credentials) jika tidak ada error
    },
    async jwt({ token, user, account }) {
      // Saat sign in awal (user object ada) atau saat token diupdate
      if (user) {
        // user object dari authorize (credentials) atau dari signIn callback (OAuth)
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image; // Gunakan 'picture' agar konsisten dengan tipe default NextAuth
      }
      return token;
    },
    async session({ session, token }) {
      // `token` adalah hasil dari callback `jwt`
      if (session.user) {
        (session.user as any).id = token.id as string;
        // Ambil nama, email, gambar dari token yang sudah dimodifikasi
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Arahkan ke halaman login kustom Anda
    // error: '/auth/error', // (Opsional) Halaman untuk menampilkan error autentikasi
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
