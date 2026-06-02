"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FigurinhaComPosse } from "@/types/types";
import CardFigurinha from "@/components/cards/CardFigurinha";

interface Props {
  figurinhas: FigurinhaComPosse[];
}

export default function AlbumGrid({ figurinhas }: Props) {
  const router = useRouter();

  // 📱 Estado para tratar as margens e tamanhos específicos de grid no mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const escutarAberturaDePacotes = () => {
      router.refresh();
    };

    window.addEventListener("atualizarColecao", escutarAberturaDePacotes);
    return () =>
      window.removeEventListener("atualizarColecao", escutarAberturaDePacotes);
  }, [router]);

  // Listener para monitorar tamanho da tela
  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        // ⚡ No mobile aceita cards de até 105px para caber 3 colunas por linha sem quebrar layout
        gridTemplateColumns: isMobile
          ? "repeat(auto-fill, minmax(105px, 1fr))"
          : "repeat(auto-fill, minmax(140px, 1fr))",
        gap: isMobile ? "10px" : "16px",
        padding: isMobile ? "0 12px 24px" : "0 28px 32px",
        boxSizing: "border-box",
      }}
    >
      {figurinhas.map((fig) =>
        fig.possui ? (
          /* Card que o usuário já possui */
          <div
            key={fig.id}
            data-figurinha-id={fig.id}
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
              padding: isMobile ? "8px 4px" : "12px 8px",
              backdropFilter: "blur(6px)",
              boxShadow: "inset 0 2px 8px rgba(0,0,0,0.05)",
              transition: "transform 0.2s, border-color 0.2s",
              boxSizing: "border-box",
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
                fontSize: isMobile ? "16px" : "22px",
                color: "rgba(0, 0, 0, 0.25)",
                letterSpacing: "1px",
                lineHeight: 1,
              }}
            >
              #{String(fig.numero).padStart(3, "0")}
            </span>

            {/* MEIO: Nome de quem falta com anti-estouro */}
            <div
              style={{
                textAlign: "center",
                width: "100%",
                padding: "0 2px",
                boxSizing: "border-box",
              }}
            >
              <p
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: isMobile ? "11px" : "14px",
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

            {/* Fim: Tag do Setor com anti-estouro */}
            <span
              style={{
                fontSize: isMobile ? "6px" : "8px",
                fontWeight: 800,
                color: "rgba(0, 0, 0, 0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                background: "rgba(0, 0, 0, 0.05)",
                padding: "2px 6px",
                borderRadius: "4px",
                maxWidth: "95%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                boxSizing: "border-box",
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
