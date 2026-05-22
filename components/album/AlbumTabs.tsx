// src/components/album/AlbumTabs.tsx
"use client";

import { Area } from "@/types/types";

const AREAS: Area[] = [
  "Todas",
  "Tech",
  "RH",
  "Marketing",
  "Financeiro",
  "Raras",
];

const AREA_CONFIG: Record<string, { blob1: string }> = {
  Todas: { blob1: "#2d8a4e" },
  Tech: { blob1: "#1e5fa8" },
  RH: { blob1: "#c0185a" },
  Marketing: { blob1: "#2d8a4e" },
  Financeiro: { blob1: "#c8920a" },
  Raras: { blob1: "#c8920a" },
};

interface Props {
  abaAtiva: Area;
  setAbaAtiva: (aba: Area) => void;
}

export default function AlbumTabs({ abaAtiva, setAbaAtiva }: Props) {
  const cfg = AREA_CONFIG[abaAtiva];

  return (
    <nav
      style={{
        maxWidth: "1000px",
        margin: "0 auto 12px",
        background: "#fff",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "5px",
        display: "flex",
        gap: "3px",
        overflowX: "auto",
      }}
    >
      {AREAS.map((aba) => (
        <button
          key={aba}
          onClick={() => setAbaAtiva(aba)}
          style={{
            padding: "7px 18px",
            borderRadius: "7px",
            border: "none",

            background: abaAtiva === aba ? cfg.blob1 : "transparent",

            color: abaAtiva === aba ? "#fff" : "#555",

            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "12px",
            fontWeight: 900,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition: "all 0.15s",
          }}
        >
          {aba}
        </button>
      ))}
    </nav>
  );
}
