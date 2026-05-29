"use client";

import { useState } from "react";
import { FigurinhaComPosse } from "@/types/types";
import { useRouter } from "next/navigation";
import CardFigurinha from "@/components/cards/CardFigurinha";
import { IoClose } from "react-icons/io5";

interface Props {
  fig: FigurinhaComPosse;
  onFechar: () => void;
}

export default function ModalDetalheFigurinha({ fig, onFechar }: Props) {
  const router = useRouter();

  const [emailAmigo, setEmailAmigo] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Só pode trocar repetida
  const podeTrocar = fig.quantidade > 1;

  const lidarComTroca = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailAmigo.trim()) return;

    setEnviando(true);

    try {
      const res = await fetch("/api/figurinhas/trocar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          figurinhaId: fig.id,
          emailDestino: emailAmigo.trim().toLowerCase(),
        }),
      });

      const resultado = await res.json();

      if (res.ok && resultado.success) {
        alert("🤝 Figurinha transferida com sucesso!");

        setEmailAmigo("");

        router.refresh();

        onFechar();
      } else {
        alert(`Erro: ${resultado.error}`);
      }
    } catch (error) {
      console.error("Erro na transferência:", error);

      alert("Erro interno ao tentar transferir.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      onClick={onFechar}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.82)",
        backdropFilter: "blur(10px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "20px 20px 18px 20px",
          maxWidth: "360px",
          width: "100%",
          boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BOTÃO FECHAR */}
        <button
          onClick={onFechar}
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(0,0,0,0.06)",
            color: "#666",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "0.2s",
            zIndex: 20,
          }}
        >
          <IoClose size={20} />
        </button>

        {/* FIGURINHA */}
        <div
          style={{
            width: "270px",
            marginTop: "8px",
            marginBottom: "22px",
            transform: "scale(1.08)",
            filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.28))",
            transition: "0.25s ease",
          }}
        >
          <CardFigurinha fig={fig} />
        </div>

        {/* ÁREA INFERIOR */}
        {podeTrocar ? (
          <form
            onSubmit={lidarComTroca}
            style={{
              width: "100%",
              borderTop: "1px solid #ececec",
              paddingTop: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <label
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "16px",
                letterSpacing: "1.5px",
                color: "#555",
              }}
            >
              🤝 ENVIAR REPETIDA PARA
            </label>

            <input
              type="email"
              placeholder="Digite o e-mail do colega..."
              required
              value={emailAmigo}
              onChange={(e) => setEmailAmigo(e.target.value)}
              style={{
                width: "100%",
                padding: "13px 5px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                fontSize: "14px",
                outline: "none",
                transition: "0.2s ease",
                background: "#fafafa",
                fontFamily: "'Barlow Condensed', sans-serif",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#2d8a4e";

                e.target.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb";

                e.target.style.background = "#fafafa";
              }}
            />

            <button
              type="submit"
              disabled={enviando}
              style={{
                background: enviando
                  ? "#7fb492"
                  : "linear-gradient(135deg, #2d8a4e, #226f3d)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "14px 16px",
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "20px",
                letterSpacing: "1.5px",
                fontWeight: 400,
                cursor: enviando ? "not-allowed" : "pointer",
                boxShadow: "0 8px 18px rgba(45,138,78,0.25)",
                transition: "0.2s ease",
              }}
            >
              {enviando ? "TRANSFERINDO..." : "CONFIRMAR ENVIO"}
            </button>
          </form>
        ) : (
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #ececec",
              paddingTop: "18px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: "15px",
                color: "#666",
                lineHeight: "1.4",
                margin: 0,
                fontWeight: 500,
              }}
            >
              Você possui apenas <strong>1 cópia</strong> desta figurinha.
              <br />
              Só é permitido transferir cartas repetidas.
            </p>
          </div>
        )}

        {/* VOLTAR */}
        <button
          onClick={onFechar}
          style={{
            marginTop: "18px",
            background: "none",
            border: "none",
            color: "#444",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "18px",
            letterSpacing: "1px",
            fontWeight: 400,
            cursor: "pointer",
            textDecoration: "underline",
            transition: "0.2s",
          }}
        >
          Voltar ao Álbum
        </button>
      </div>
    </div>
  );
}
