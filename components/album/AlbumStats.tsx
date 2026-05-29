"use client";

import { FigurinhaComPosse } from "@/types/types";

interface Props {
  abaAtiva: string;
  figurinhas: FigurinhaComPosse[];
}

export default function AlbumStats({ abaAtiva, figurinhas }: Props) {
  const totalPossuidas = figurinhas.filter((f) => f.possui).length;
  const totalAbas = figurinhas.length;

  // Função simples para deixar apenas a primeira letra maiúscula (ex: "Sistemas", "Todas")
  const nomeFormatado =
    abaAtiva.charAt(0).toUpperCase() + abaAtiva.slice(1).toLowerCase();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        marginBottom: "32px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        padding: "18px 28px",
      }}
    >
      {/* Bloco Esquerdo: Título da Aba Suavizado */}
      <div>
        <p
          style={{
            fontFamily: "'Barlow Condensed', sans-serif", // Fonte mais moderna e limpa
            fontSize: "12px",
            color: "#2d8a4e",
            letterSpacing: "3px",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: "0px",
          }}
        >
          Área Atual
        </p>
        <h1
          style={{
            fontFamily: "'Barlow Condensed', sans-serif", // Mudado aqui também
            fontSize: "40px", // Reduzido de 52px para não ficar gigante
            fontWeight: 800,
            color: "#1a1a1a",
            letterSpacing: "0.5px",
            lineHeight: 1,
          }}
        >
          {nomeFormatado} {/* 👈 Agora exibe "Todas", "Sistemas", etc. */}
        </h1>
      </div>

      {/* Bloco Central: Logo Real Aumentada */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "65px",
        }}
      >
        <img
          src="/images/logo green.png"
          alt="Logo Green Paperless"
          style={{
            height: "92px",
            width: "auto",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Bloco Direito: Contador de Figurinhas */}
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          padding: "8px 20px",
          textAlign: "center",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
          minWidth: "120px",
        }}
      >
        <p
          style={{
            fontSize: "9px",
            color: "#777",
            textTransform: "uppercase",
            letterSpacing: "2px",
            fontWeight: 800,
            marginBottom: "2px",
          }}
        >
          FIGURINHAS
        </p>
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "28px",
            color: "#1a1a1a",
            lineHeight: 1,
          }}
        >
          {totalPossuidas}
          <span style={{ fontSize: "14px", color: "#aaa", marginLeft: "2px" }}>
            /{totalAbas}
          </span>
        </p>
      </div>
    </div>
  );
}
