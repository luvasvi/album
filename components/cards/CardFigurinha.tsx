"use client";

import { FigurinhaComPosse } from "@/types/types";
import styles from "./CardFigurinha.module.css";

const AREA_CORES: Record<
  string,
  { topo: string; fundo: string; texto: string }
> = {
  SISTEMAS: { topo: "#1e5fa8", fundo: "#ddeeff", texto: "#1e5fa8" },
  "OPERAÇÃO BRADESCO": { topo: "#c0185a", fundo: "#fde8f0", texto: "#c0185a" },
  SERVIÇOS: { topo: "#2d8a4e", fundo: "#e0f5e8", texto: "#2d8a4e" },
  COMERCIAL: { topo: "#c8920a", fundo: "#fff6d6", texto: "#c8920a" },
  "GENTE & GESTÃO": { topo: "#6b2da8", fundo: "#f1e6ff", texto: "#6b2da8" },
  DELIVERY: { topo: "#e05311", fundo: "#ffebe0", texto: "#e05311" },
  PROJETOS: { topo: "#1180e0", fundo: "#e0f0ff", texto: "#1180e0" },
  SUPORTE: { topo: "#708090", fundo: "#f0f4f8", texto: "#708090" },
  "ADM/FINANCEIRO": { topo: "#008080", fundo: "#e0ffff", texto: "#008080" },
  FINANCEIRO: { topo: "#008080", fundo: "#e0ffff", texto: "#008080" },
  FATURAMENTO: { topo: "#008080", fundo: "#e0ffff", texto: "#008080" },
  "FINANCEIRO/FATURAMENTO": {
    topo: "#008080",
    fundo: "#e0ffff",
    texto: "#008080",
  },
  default: { topo: "#555", fundo: "#f0f0f0", texto: "#555" },
};

export default function CardFigurinha({ fig }: { fig: FigurinhaComPosse }) {
  const areaChave = fig.area ? fig.area.toUpperCase() : "DEFAULT";
  const cor = AREA_CORES[areaChave] ?? AREA_CORES.default;

  const temFoto = !!(fig.imagem || (fig as any).image || (fig as any).foto);

  return (
    <div
      className={styles.card}
      style={{
        boxShadow: fig.isRara
          ? "0 0 0 2px #c8920a, 0 6px 18px rgba(200,146,10,0.35)"
          : "0 3px 10px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      {/* TOPO */}
      <div
        className={styles.topo}
        style={{
          background: fig.isRara
            ? "linear-gradient(135deg, #c8920a, #f5d000, #c8920a)"
            : cor.topo,
          zIndex: 2, // Garante que fica acima da foto expandida
        }}
      >
        <span className={styles.numero}>
          {String(fig.numero).padStart(3, "0")}
        </span>
        <span className={styles.area}>{fig.area}</span>
      </div>

      {/* CORPO DINÂMICO (Estilo Álbum da Panini) */}
      <div
        className={styles.corpo}
        style={{
          background: cor.fundo,
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: temFoto ? "flex-end" : "center", // Se tem foto, empurra os textos pro rodapé
          alignItems: "center",
          overflow: "hidden",
          padding: temFoto ? "0" : "12px 8px",
        }}
      >
        {temFoto ? (
          <>
            {/* Foto expandida ocupando o card inteiro de ponta a ponta */}
            <img
              src={fig.imagem || (fig as any).image || (fig as any).foto}
              alt={fig.nome}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                zIndex: 1,
              }}
            />

            {/* Gradiente escuro na base da foto para dar contraste ao texto branco */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "60%",
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.4) 60%, transparent)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />

            {/* Bloco de Textos sobreposto à foto */}
            <div
              style={{
                zIndex: 3,
                width: "100%",
                padding: "8px",
                textAlign: "center",
              }}
            >
              <h3
                className={styles.nome}
                style={{
                  color: "#fff",
                  margin: "0 0 2px 0",
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                  fontSize: "12px",
                }}
              >
                {fig.nome}
              </h3>
              <p
                className={styles.cargo}
                style={{
                  color: fig.isRara ? "#f5d000" : "#ddd",
                  margin: 0,
                  textShadow: "0 1px 3px rgba(0,0,0,0.8)",
                  fontSize: "9px",
                }}
              >
                {fig.cargo}
              </p>
            </div>
          </>
        ) : (
          /* Modo padrão com Emoji se não tiver imagem cadastrada no banco */
          <>
            <div
              className={styles.avatar}
              style={{
                border: `3px solid ${fig.isRara ? "#c8920a" : cor.topo}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                marginBottom: "8px",
              }}
            >
              <span style={{ fontSize: "28px" }}>{fig.emoji}</span>
            </div>
            <h3 className={styles.nome}>{fig.nome}</h3>
            <p
              className={styles.cargo}
              style={{ color: fig.isRara ? "#c8920a" : cor.texto }}
            >
              {fig.cargo}
            </p>
          </>
        )}
      </div>

      {/* RODAPÉ */}
      <div
        className={styles.rodape}
        style={{
          borderTop: `2px solid ${fig.isRara ? "#c8920a" : cor.topo}`,
          zIndex: 2,
        }}
      >
        {fig.isRara ? (
          <span className={styles.rara}>★ RARA ★</span>
        ) : (
          <span className={styles.normal}>2026</span>
        )}
      </div>

      {/* BADGE DE REPETIDAS */}
      {fig.quantidade > 1 && (
        <div className={styles.badge} style={{ zIndex: 3 }}>
          {fig.quantidade}x
        </div>
      )}
    </div>
  );
}
