"use client";

import { useEffect, useState } from "react";

import { Figurinha } from "@/types/types";

import styles from "./ModalPacote.module.css";

interface Props {
  figurinhas: Figurinha[];

  onFechar: () => void;
}

export default function ModalPacote({ figurinhas, onFechar }: Props) {
  const [reveladas, setReveladas] = useState<number[]>([]);

  const [todasReveladas, setTodasReveladas] = useState(false);

  useEffect(() => {
    figurinhas.forEach((_, i) => {
      setTimeout(
        () => {
          setReveladas((prev) => {
            const next = [...prev, i];

            if (next.length === figurinhas.length) {
              setTodasReveladas(true);
            }

            return next;
          });
        },
        i * 400 + 300,
      );
    });
  }, [figurinhas]);

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && todasReveladas) {
          onFechar();
        }
      }}
    >
      <p className={styles.titulo}>🔥 PACOTE ABERTO!</p>

      <div className={styles.grid}>
        {figurinhas.map((fig, i) => {
          const revelada = reveladas.includes(i);

          return (
            <div
              key={i}
              className={styles.card}
              style={{
                transform: revelada
                  ? "scale(1) rotateY(0deg)"
                  : "scale(0.8) rotateY(90deg)",

                opacity: revelada ? 1 : 0,

                background: fig.isRara
                  ? "linear-gradient(135deg, #fbbf24, #f59e0b)"
                  : "linear-gradient(180deg, #1e293b, #0f172a)",

                border: fig.isRara ? "2px solid #facc15" : "2px solid #334155",

                boxShadow: fig.isRara
                  ? "0 0 20px rgba(251,191,36,0.5)"
                  : "0 4px 12px rgba(0,0,0,0.5)",
              }}
            >
              <span className={styles.emoji}>{fig.emoji}</span>

              <span
                className={styles.nome}
                style={{
                  color: fig.isRara ? "#7c2d12" : "#ffffff",
                }}
              >
                {fig.nome}
              </span>

              {fig.isRara && (
                <span
                  className={styles.rara}
                  style={{
                    color: "#7c2d12",
                  }}
                >
                  ★ RARA
                </span>
              )}
            </div>
          );
        })}
      </div>

      {todasReveladas && (
        <button onClick={onFechar} className={styles.botao}>
          FECHAR PACOTE
        </button>
      )}
    </div>
  );
}
