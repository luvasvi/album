"use client";

import { Area } from "@/types/types";

// 🔥 PALETA DE CORES 100% EXCLUSIVA (Sem nenhuma repetição)
const CORES_BOTÕES: Record<string, string> = {
  Todas: "#2d8a4e", // Verde Oficial Green
  SISTEMAS: "#1e5fa8", // Azul Corporativo
  "OPERAÇÃO BRADESCO": "#cc092f", // Vermelho Bradesco
  SERVIÇOS: "#e67e22", // Laranja
  COMERCIAL: "#8e44ad", // Roxo
  "GENTE & GESTÃO": "#c0185a", // Rosa Escuro / Magenta
  DELIVERY: "#16a085", // Verde Água / Teal
  PROJETOS: "#d35400", // Abóbora / Terracota
  SUPORTE: "#34495e", // Azul Asfalto / Slate
  "ADM/FINANCEIRO": "#c8920a", // Dourado / Mostarda
  "FINANCEIRO/FATURAMENTO": "#0984e3", // Azul Royal Intenso (Nova Cor!)
  DIRETORIA: "#2c3e50", // Grafite Escuro / Charcoal (Nova Cor!)
  Raras: "#d63031", // Vermelho Rubi Vivo (Nova Cor!)
};

const AREAS_OFICIAIS: Area[] = [
  "Todas",
  "SISTEMAS",
  "OPERAÇÃO BRADESCO",
  "SERVIÇOS",
  "COMERCIAL",
  "GENTE & GESTÃO",
  "DELIVERY",
  "PROJETOS",
  "SUPORTE",
  "ADM/FINANCEIRO",
  "FINANCEIRO/FATURAMENTO",
  "DIRETORIA",
  "Raras",
];

interface Props {
  abaAtiva: Area;
  setAbaAtiva: (aba: Area) => void;
}

export default function AlbumTabs({ abaAtiva, setAbaAtiva }: Props) {
  const corAtiva = CORES_BOTÕES[abaAtiva] || "#2d8a4e";

  return (
    <nav
      style={{
        maxWidth: "1400px",
        width: "100%",
        margin: "0 auto 16px",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(8px)",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        padding: "8px 12px",
        display: "flex",
        gap: "6px",
        overflowX: "auto",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        WebkitOverflowScrolling: "touch",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
      }}
    >
      <style>{`
        nav::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>

      {AREAS_OFICIAIS.map((aba) => {
        const isActive = abaAtiva === aba;
        const corBotaoEstatico = CORES_BOTÕES[aba] || "#2d8a4e";

        return (
          <button
            key={aba}
            onClick={() => setAbaAtiva(aba)}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: isActive ? corAtiva : "transparent",
              color: isActive ? "#fff" : "#555",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "13px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1.2px",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease",
              boxShadow: isActive ? `0 4px 10px ${corAtiva}40` : "none",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "rgba(0, 0, 0, 0.04)";
                e.currentTarget.style.color = corBotaoEstatico;
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#555";
              }
            }}
          >
            {aba}
          </button>
        );
      })}
    </nav>
  );
}
