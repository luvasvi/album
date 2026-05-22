// src/components/album/AlbumHeader.tsx
"use client";

import { AlbumData } from "@/types/types";

interface Props {
  data: AlbumData | null;
  abrirPacote: () => void;
  abrindoPacote: boolean;
}

export default function AlbumHeader({
  data,
  abrirPacote,
  abrindoPacote,
}: Props) {
  return (
    <header
      style={{
        maxWidth: "1000px",
        margin: "0 auto 12px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "32px",
            color: "#1a1a1a",
            letterSpacing: "1px",
            lineHeight: 1,
          }}
        >
          green<span style={{ color: "#2d8a4e" }}>.</span>
        </span>

        <span
          style={{
            fontSize: "8px",
            fontWeight: 900,
            color: "#2d8a4e",
            letterSpacing: "5px",
            textTransform: "uppercase",
            marginTop: "-2px",
          }}
        >
          PAPERLESS
        </span>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Coleção */}
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "8px",
            padding: "6px 14px",
            textAlign: "center",
            border: "1px solid #e0e0e0",
          }}
        >
          <p
            style={{
              fontSize: "8px",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 800,
            }}
          >
            Coleção
          </p>

          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "22px",
              color: "#2d8a4e",
              lineHeight: 1,
            }}
          >
            {data?.totalPossuidas ?? 0}

            <span
              style={{
                fontSize: "12px",
                color: "#bbb",
                marginLeft: "2px",
              }}
            >
              /{data?.totalFigurinhas ?? 0}
            </span>
          </p>
        </div>

        {/* Pacotes */}
        <div
          style={{
            background: "#f5f5f5",
            borderRadius: "8px",
            padding: "6px 14px",
            textAlign: "center",
            border: "1px solid #e0e0e0",
          }}
        >
          <p
            style={{
              fontSize: "8px",
              color: "#888",
              textTransform: "uppercase",
              letterSpacing: "2px",
              fontWeight: 800,
            }}
          >
            Pacotes
          </p>

          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "22px",
              color: "#c8920a",
              lineHeight: 1,
            }}
          >
            {data?.totalPacotes ?? 0}
          </p>
        </div>

        {/* Botão */}
        <button
          onClick={abrirPacote}
          disabled={!data || data.totalPacotes === 0 || abrindoPacote}
          style={{
            background:
              data && data.totalPacotes > 0
                ? "linear-gradient(135deg, #f5d000, #c8920a)"
                : "#e0e0e0",

            color: data && data.totalPacotes > 0 ? "#1a0a00" : "#aaa",

            border: "none",
            borderRadius: "10px",
            padding: "11px 20px",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "15px",
            letterSpacing: "2px",

            cursor: data && data.totalPacotes > 0 ? "pointer" : "not-allowed",

            boxShadow:
              data && data.totalPacotes > 0 ? "0 4px 0 #a06c00" : "none",

            transition: "all 0.12s",
          }}
          onMouseDown={(e) => {
            if (data && data.totalPacotes > 0) {
              e.currentTarget.style.transform = "translateY(3px)";
              e.currentTarget.style.boxShadow = "0 1px 0 #a06c00";
            }
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "";

            e.currentTarget.style.boxShadow =
              data && data.totalPacotes > 0 ? "0 4px 0 #a06c00" : "none";
          }}
        >
          {abrindoPacote ? "ABRINDO..." : "ABRIR PACOTE 🔥"}
        </button>
      </div>
    </header>
  );
}
