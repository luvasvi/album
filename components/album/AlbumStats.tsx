// src/components/album/AlbumStats.tsx
"use client";

import { FigurinhaComPosse } from "@/types/types";

interface Props {
  abaAtiva: string;
  figurinhas: FigurinhaComPosse[];
}

export default function AlbumStats({ abaAtiva, figurinhas }: Props) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "14px",
        marginBottom: "20px",
      }}
    >
      {/* Título */}
      <div>
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",

            fontSize: "13px",

            color: "#fff",

            letterSpacing: "5px",

            opacity: 0.85,

            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
          }}
        >
          WE ARE
        </p>

        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",

            fontSize: "52px",

            color: "#fff",

            letterSpacing: "2px",

            lineHeight: 1,

            textShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          {abaAtiva.toUpperCase()}
        </h1>
      </div>

      {/* Mini logo */}
      <div
        style={{
          marginBottom: "8px",

          background: "rgba(255,255,255,0.9)",

          borderRadius: "8px",

          padding: "6px 12px",

          display: "flex",

          flexDirection: "column",

          alignItems: "center",

          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",

            fontSize: "18px",

            color: "#1a1a1a",

            letterSpacing: "1px",

            lineHeight: 1,
          }}
        >
          green<span style={{ color: "#2d8a4e" }}>.</span>
        </span>

        <span
          style={{
            fontSize: "6px",

            color: "#2d8a4e",

            letterSpacing: "3px",

            fontWeight: 900,

            textTransform: "uppercase",
          }}
        >
          PAPERLESS
        </span>
      </div>

      {/* Progresso */}
      <div
        style={{
          marginBottom: "8px",

          marginLeft: "auto",

          background: "rgba(255,255,255,0.85)",

          borderRadius: "8px",

          padding: "5px 14px",

          textAlign: "center",

          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            fontSize: "7px",

            color: "#666",

            fontWeight: 800,

            textTransform: "uppercase",

            letterSpacing: "2px",
          }}
        >
          Figurinhas
        </p>

        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",

            fontSize: "22px",

            color: "#1a1a1a",

            lineHeight: 1,
          }}
        >
          {figurinhas.filter((f) => f.possui).length}

          <span
            style={{
              fontSize: "12px",
              color: "#aaa",
            }}
          >
            /{figurinhas.length}
          </span>
        </p>
      </div>
    </div>
  );
}
