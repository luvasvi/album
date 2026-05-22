"use client";

import { FigurinhaComPosse } from "@/types/types";

import styles from "./CardFigurinha.module.css";

const AREA_CORES: Record<
  string,
  {
    topo: string;
    fundo: string;
    texto: string;
  }
> = {
  Tech: {
    topo: "#1e5fa8",
    fundo: "#ddeeff",
    texto: "#1e5fa8",
  },

  RH: {
    topo: "#c0185a",
    fundo: "#fde8f0",
    texto: "#c0185a",
  },

  Marketing: {
    topo: "#2d8a4e",
    fundo: "#e0f5e8",
    texto: "#2d8a4e",
  },

  Financeiro: {
    topo: "#c8920a",
    fundo: "#fff6d6",
    texto: "#c8920a",
  },

  default: {
    topo: "#555",
    fundo: "#f0f0f0",
    texto: "#555",
  },
};

export default function CardFigurinha({ fig }: { fig: FigurinhaComPosse }) {
  const cor = AREA_CORES[fig.area] ?? AREA_CORES.default;

  return (
    <div
      className={styles.card}
      style={{
        boxShadow: fig.isRara
          ? "0 0 0 2px #c8920a, 0 6px 18px rgba(200,146,10,0.35)"
          : "0 3px 10px rgba(0,0,0,0.18)",
      }}
    >
      {/* TOPO */}
      <div
        className={styles.topo}
        style={{
          background: fig.isRara
            ? "linear-gradient(135deg, #c8920a, #f5d000, #c8920a)"
            : cor.topo,
        }}
      >
        <span className={styles.numero}>
          {String(fig.numero).padStart(3, "0")}
        </span>

        <span className={styles.area}>{fig.area}</span>
      </div>

      {/* CORPO */}
      <div
        className={styles.corpo}
        style={{
          background: cor.fundo,
        }}
      >
        <div
          className={styles.avatar}
          style={{
            border: `3px solid ${fig.isRara ? "#c8920a" : cor.topo}`,

            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          {fig.emoji}
        </div>

        <h3 className={styles.nome}>{fig.nome}</h3>

        <p
          className={styles.cargo}
          style={{
            color: fig.isRara ? "#c8920a" : cor.texto,
          }}
        >
          {fig.cargo}
        </p>
      </div>

      {/* RODAPÉ */}
      <div
        className={styles.rodape}
        style={{
          borderTop: `2px solid ${fig.isRara ? "#c8920a" : cor.topo}`,
        }}
      >
        {fig.isRara ? (
          <span className={styles.rara}>★ RARA ★</span>
        ) : (
          <span className={styles.normal}>2026</span>
        )}
      </div>

      {/* BADGE */}
      {fig.quantidade > 1 && (
        <div className={styles.badge}>{fig.quantidade}x</div>
      )}
    </div>
  );
}
