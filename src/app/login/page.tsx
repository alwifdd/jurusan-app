// File: src/app/login/page.tsx (VERSI BARU)

import { Suspense } from "react";
import LoginForm from "./LoginForm";

// Halaman ini sekarang menjadi Server Component
export default function LoginPage() {
  return (
    // Bungkus komponen dinamis dengan Suspense
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
