"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Verificando autenticação...</p>;
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#d6ddd6" }}>
      <div style={{ background: "#fff", padding: "40px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "36px", color: "#2d8a4e", marginBottom: "24px" }}>
          ÁLBUM GREEN COPA
        </h1>
        <button
          onClick={() => signIn("google")}
          style={{
            background: "#2d8a4e",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Entrar com o Google
        </button>
      </div>
    </div>
  );
}