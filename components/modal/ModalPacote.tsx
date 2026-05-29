"use client";

import { useEffect, useState } from "react";
import { Figurinha, FigurinhaComPosse } from "@/types/types";
import CardFigurinha from "@/components/cards/CardFigurinha";
import styles from "./ModalPacote.module.css";

interface Props {
  figurinhas: Figurinha[];
  onFechar: () => void;
}

export default function ModalPacote({ figurinhas, onFechar }: Props) {
  const [reveladas, setReveladas] = useState<number[]>([]);
  const [todasReveladas, setTodasReveladas] = useState(false);

  // Detecta se é a abertura em lote (mais de 5 figurinhas acumuladas)
  const isAberturaEmLote = figurinhas.length > 5;

  useEffect(() => {
    if (isAberturaEmLote) {
      // ⚡ COMPORTAMENTO EM LOTE: Revela tudo em blocos rápidos de 5 em 5 para não demorar uma eternidade
      figurinhas.forEach((_, i) => {
        const bloco = Math.floor(i / 5);
        setTimeout(
          () => {
            setReveladas((prev) => {
              const next = [...prev, i];
              if (next.length === figurinhas.length) setTodasReveladas(true);
              return next;
            });
          },
          bloco * 200 + 200,
        ); // Intervalo bem curto entre os blocos
      });
    } else {
      // 🕒 COMPORTAMENTO PADRÃO: Revelação clássica sequencial de 1 em 1
      figurinhas.forEach((_, i) => {
        setTimeout(
          () => {
            setReveladas((prev) => {
              const next = [...prev, i];
              if (next.length === figurinhas.length) setTodasReveladas(true);
              return next;
            });
          },
          i * 450 + 400,
        );
      });
    }
  }, [figurinhas, isAberturaEmLote]);

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && todasReveladas) {
          onFechar();
        }
      }}
    >
      <p className={styles.titulo}>
        {isAberturaEmLote
          ? "⚡ TODOS OS PACOTES ABERTOS!"
          : "🔥 PACOTE ABERTO!"}
      </p>

      {/* Grid controlado que se ajusta ao volume de cartas */}
      <div className={styles.grid}>
        {figurinhas.map((fig, i) => {
          const revelada = reveladas.includes(i);

          const figurinhaAdaptada: FigurinhaComPosse = {
            ...fig,
            possui: true,
            quantidade: 1,
          };

          return (
            <div
              key={i}
              className={`${styles.card} ${revelada ? styles.cardRevelado : ""} ${
                isAberturaEmLote
                  ? styles.loteAnimacao
                  : styles.sequencialAnimacao
              }`}
            >
              <CardFigurinha fig={figurinhaAdaptada} />
            </div>
          );
        })}
      </div>

      {/* Espaço reservado do botão para evitar pulos de layout */}
      <div style={{ minHeight: "80px", display: "flex", alignItems: "center" }}>
        {todasReveladas && (
          <button onClick={onFechar} className={styles.botao}>
            COLECIONAR FIGURINHAS
          </button>
        )}
      </div>
    </div>
  );
}
