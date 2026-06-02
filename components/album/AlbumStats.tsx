"use client";

import { useEffect, useState } from "react";
import { FigurinhaComPosse } from "@/types/types";

interface Props {
  abaAtiva: string;
  figurinhas: FigurinhaComPosse[];
}

export default function AlbumStats({ abaAtiva, figurinhas }: Props) {
  const totalPossuidas = figurinhas.filter((f) => f.possui).length;
  const totalAbas = figurinhas.length;

  // 📱 Estado para controlar o layout responsivo
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const nomeFormatado =
    abaAtiva.charAt(0).toUpperCase() + abaAtiva.slice(1).toLowerCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: isMobile ? "row" : "row", // Mantém lado a lado, mas redistribui o espaço
        justifyContent: "space-between",
        gap: isMobile ? "12px" : "24px",
        marginBottom: "20px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        padding: isMobile ? "12px 16px" : "18px 28px",
        boxSizing: "border-box",
      }}
    >
      {/* Bloco Esquerdo: Título da Aba */}
      <div style={{ flex: 1 }}>
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: isMobile ? "10px" : "12px",
            color: "#2d8a4e",
            letterSpacing: isMobile ? "1.5px" : "3px",
            fontWeight: 700,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          Área Atual
        </p>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: isMobile ? "26px" : "40px",
            fontWeight: 800,
            color: "#1a1a1a",
            letterSpacing: "0.5px",
            lineHeight: 1,
            margin: "2px 0 0 0",
          }}
        >
          {nomeFormatado}
        </h1>
      </div>

      {/* Bloco Central: Logo (Exibida APENAS no Desktop para não poluir o celular) */}
      {!isMobile && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "55px",
          }}
        >
          <img
            src="/images/logo green.png"
            alt="Logo Green Paperless"
            style={{
              height: "55px",
              width: "auto",
              objectFit: "contain",
              mixBlendMode: "multiply", // ⚡ Esconde o quadrado branco no computador
            }}
          />
        </div>
      )}

      {/* Bloco Direito: Contador de Figurinhas */}
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: isMobile ? "6px 12px" : "8px 20px",
          textAlign: "center",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          minWidth: isMobile ? "90px" : "120px",
          boxSizing: "border-box",
        }}
      >
        <p
          style={{
            fontSize: "8px",
            color: "#777",
            textTransform: "uppercase",
            letterSpacing: "1px",
            fontWeight: 800,
            margin: "0 0 2px 0",
          }}
        >
          {isMobile ? "FIGURINHAS" : "TOTAL COMPLETO"}
        </p>
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: isMobile ? "20px" : "28px",
            color: "#1a1a1a",
            lineHeight: 1,
            margin: 0,
          }}
        >
          {totalPossuidas}
          <span
            style={{
              fontSize: isMobile ? "11px" : "14px",
              color: "#aaa",
              marginLeft: "2px",
            }}
          >
            /{totalAbas}
          </span>
        </p>
      </div>
    </div>
  );
}
