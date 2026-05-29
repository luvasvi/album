"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FigurinhaComPosse } from "@/types/types";
import CardFigurinha from "@/components/cards/CardFigurinha";

interface Props {
  figurinhas: FigurinhaComPosse[];
}

export default function AlbumGrid({ figurinhas }: Props) {
  const router = useRouter();

  // 🔥 ESCUTADOR GLOBAL REATIVO: Atualiza o grid na hora que os pacotes abrem, sem dar F5
  useEffect(() => {
    const escutarAberturaDePacotes = () => {
      router.refresh(); // Puxa as novas figurinhas do Server Component silenciosamente
    };

    window.addEventListener("atualizarColecao", escutarAberturaDePacotes);
    return () =>
      window.removeEventListener("atualizarColecao", escutarAberturaDePacotes);
  }, [router]);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "16px",
        padding: "0 28px 32px",
      }}
    >
      {figurinhas.map((fig) =>
        fig.possui ? (
          /* Card que o usuário já possui */
          <div
            key={fig.id}
            data-figurinha-id={fig.id} // Identificador lido pelo onClick do page.tsx
            style={{
              cursor: "pointer",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <CardFigurinha fig={fig} />
          </div>
        ) : (
          /* Slot Vazio Estilizado (Figurinha Faltando) */
          <div
            key={fig.id}
            style={{
              aspectRatio: "3/4",
              background: "rgba(255, 255, 255, 0.4)",
              borderRadius: "10px",
              border: "2px dashed rgba(0, 0, 0, 0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 8px",
              backdropFilter: "blur(6px)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)";
            }}
          >
            {/* Topo: Número da Figurinha */}
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "22px",
                color: "rgba(0, 0, 0, 0.25)",
                letterSpacing: "1px",
                lineHeight: 1,
              }}
            >
              #{String(fig.numero).padStart(3, "0")}
            </span>

            {/* MEIO: Nome de quem falta */}
            <div
              style={{
                textAlign: "center",
                width: "100%",
                padding: "0 4px",
              }}
            >
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "rgba(0, 0, 0, 0.4)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  margin: 0,
                  lineHeight: 1.2,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {fig.nome || "Disponível"}
              </p>
            </div>

            {/* Fim: Tag do Setor */}
            <span
              style={{
                fontSize: "8px",
                fontWeight: 800,
                color: "rgba(0, 0, 0, 0.35)",
                textTransform: "uppercase",
                letterSpacing: "1px",
                background: "rgba(0, 0, 0, 0.05)",
                padding: "2px 8px",
                borderRadius: "4px",
                maxWidth: "95%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {fig.area}
            </span>
          </div>
        ),
      )}
    </div>
  );
}
