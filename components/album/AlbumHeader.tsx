"use client";

import { useEffect, useState } from "react";
import { AlbumData } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface Props {
  data: (AlbumData & { ultimoResgate?: string | Date }) | null;
  abrirPacote: () => void; // Gatilho nativo para 1 pacote (abre o modal no page.tsx)
  abrindoPacote: boolean;
}

export default function AlbumHeader({
  data,
  abrirPacote,
  abrindoPacote,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  // Controla o saldo de pacotes na tela de forma reativa
  const [saldoPacotes, setSaldoPacotes] = useState(data?.totalPacotes ?? 0);

  // 📱 Estado para controlar a responsividade via JS de forma limpa
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (data) {
      setSaldoPacotes(data.totalPacotes);
    }
  }, [data?.totalPacotes]);

  // Listener para identificar se a tela é mobile (abaixo de 768px)
  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalPacotes = saldoPacotes;
  const temPacotes = totalPacotes > 0;

  const [dataAlvoCooldown, setDataAlvoCooldown] = useState<number | null>(null);
  const [tempoRestante, setTempoRestante] = useState<string>("");
  const [abrindoMassa, setAbrindoMassa] = useState(false);

  // Verifica a API ao carregar a página
  useEffect(() => {
    if (session?.user?.email) {
      const verificarEreclamarPacotes = async () => {
        try {
          const res = await fetch("/api/pacotes/reclamar", { method: "POST" });
          const textoResposta = await res.text();
          if (!textoResposta) return;

          const resultado = JSON.parse(textoResposta);

          if (res.ok && resultado.success) {
            setSaldoPacotes((prev) => prev + 5);
            window.dispatchEvent(new Event("atualizarColecao"));
            router.refresh();
          } else if (res.status === 400 && resultado.proximoResgate) {
            setDataAlvoCooldown(new Date(resultado.proximoResgate).getTime());
          }
        } catch (error) {
          console.error("Erro ao verificar pacotes por tempo:", error);
        }
      };

      verificarEreclamarPacotes();
    }
  }, [session, router, data?.totalPacotes]);

  // Cronômetro Regressivo
  useEffect(() => {
    if (temPacotes || !dataAlvoCooldown) {
      setTempoRestante("");
      return;
    }

    const atualizarCronometro = () => {
      const AGORA = new Date().getTime();
      const diferenca = dataAlvoCooldown - AGORA;

      if (diferenca <= 0) {
        setTempoRestante("Disponível! Recarregue");
        return;
      }

      const horas = Math.floor(
        (diferenca % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

      setTempoRestante(
        `${String(horas).padStart(2, "0")}h ${String(minutos).padStart(2, "0")}m ${String(segundos).padStart(2, "0")}s`,
      );
    };

    atualizarCronometro();
    const intervalo = setInterval(atualizarCronometro, 1000);
    return () => clearInterval(intervalo);
  }, [dataAlvoCooldown, temPacotes]);

  // 🔥 1. Ajuste na função em massa para passar o evento customizado que o page.tsx vai ler
  const lidarComAberturaMassaLinkada = () => {
    if (totalPacotes < 5 || abrindoMassa || abrindoPacote) return;

    setSaldoPacotes((prev) => Math.max(0, prev - 5));
    setAbrindoMassa(true);

    // Dispara um evento global informando ao page.tsx para abrir o modal no modo "LOTE 5x"
    const eventoLote = new CustomEvent("dispararAberturaLote", {
      detail: { qtd: 5 },
    });
    window.dispatchEvent(eventoLote);

    // Trava um timer pequeno idêntico à abertura única para revalidar estados
    setTimeout(() => {
      setAbrindoMassa(false);
    }, 1000);
  };

  const lidarComAberturaUnica = () => {
    setSaldoPacotes((prev) => Math.max(0, prev - 1));
    abrirPacote();
    setTimeout(() => {
      window.dispatchEvent(new Event("atualizarColecao"));
    }, 800);
  };

  return (
    <header
      style={{
        maxWidth: "1400px",
        width: "100%",
        margin: "0 auto 16px",
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        borderRadius: "14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        padding: isMobile ? "16px" : "12px 24px",
        display: "flex",
        alignItems: "center",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: isMobile ? "center" : "space-between",
        gap: isMobile ? "16px" : "12px",
        boxSizing: "border-box",
      }}
    >
      {/* Bloco 1: Logo Oficial com Ajuste de Fundo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "45px",
          flexShrink: 0,
        }}
      >
        <Image
          src="/images/logo green.png"
          alt="Logo Green Paperless"
          width={130}
          height={42}
          style={{
            objectFit: "contain",
            mixBlendMode: "multiply",
          }}
          priority
        />
      </div>

      {/* Bloco 2: Perfil do Usuário */}
      {session?.user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "rgba(0,0,0,0.03)",
            padding: "6px 14px",
            borderRadius: "30px",
            border: "1px solid rgba(0,0,0,0.04)",
            width: isMobile ? "100%" : "auto",
            boxSizing: "border-box",
          }}
        >
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name ?? "Usuário"}
              referrerPolicy="no-referrer"
              style={{
                width: "26px",
                height: "26px",
                borderRadius: "50%",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.currentTarget.src =
                  "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
              }}
            />
          )}
          <span
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "13px",
              fontWeight: 700,
              color: "#333",
              letterSpacing: "0.5px",
            }}
          >
            ÁLBUM DE{" "}
            <span style={{ color: "#2d8a4e", textTransform: "uppercase" }}>
              {session.user.name?.split(" ")[0]}
            </span>
          </span>

          <span style={{ color: "rgba(0,0,0,0.15)", fontSize: "12px" }}>|</span>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              background: "none",
              border: "none",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "12px",
              fontWeight: 800,
              color: "#dc2626",
              cursor: "pointer",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "4px",
            }}
          >
            Sair
          </button>
        </div>
      )}

      {/* Bloco 3: Grupo unificado de Stats + Botões Dinâmicos */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          width: isMobile ? "100%" : "auto",
        }}
      >
        {/* Card: Coleção Geral */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "6px 12px",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
            flex: isMobile ? "1" : "none",
            minWidth: "85px",
            height: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: "8px",
              color: "#777",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            COLEÇÃO
          </p>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              color: "#2d8a4e",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {data?.totalPossuidas ?? 0}
            <span
              style={{ fontSize: "11px", color: "#aaa", marginLeft: "1px" }}
            >
              /{data?.totalFigurinhas ?? 0}
            </span>
          </p>
        </div>

        {/* Card: Pacotes Disponíveis */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "6px 12px",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
            flex: isMobile ? "1" : "none",
            minWidth: "85px",
            height: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <p
            style={{
              fontSize: "8px",
              color: "#777",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            PACOTES
          </p>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "20px",
              color: "#c8920a",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {totalPacotes}
          </p>
          {tempoRestante && !temPacotes && (
            <div
              style={{
                fontSize: "7px",
                fontWeight: "900",
                color: "#dc2626",
                whiteSpace: "nowrap",
                marginTop: "-1px",
              }}
            >
              {tempoRestante}
            </div>
          )}
        </div>

        {/* 🔥 Seção de Botões Exclusivos (Removido botão "Abrir Tudo") */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            width: isMobile ? "100%" : "auto",
          }}
        >
          {/* Botão Principal: 1 Pacote */}
          <button
            onClick={lidarComAberturaUnica}
            disabled={!temPacotes || abrindoPacote || abrindoMassa}
            style={{
              background: temPacotes
                ? "linear-gradient(135deg, #f5d000, #c8920a)"
                : "#e0e0e0",
              color: temPacotes ? "#1a0a00" : "#999",
              border: "none",
              borderRadius: "8px",
              padding: "10px 16px",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "15px",
              letterSpacing: "1px",
              cursor:
                temPacotes && !abrindoPacote && !abrindoMassa
                  ? "pointer"
                  : "not-allowed",
              boxShadow: temPacotes ? "0 3px 0 #a06c00" : "none",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            {abrindoPacote
              ? "ABRINDO..."
              : abrindoMassa
                ? "PROCESSANDO..."
                : "ABRIR 1 PACOTE 🔥"}
          </button>

          {/* 🔥 Botão de Lote Fixo: Apenas 5x com Animação */}
          {temPacotes &&
            totalPacotes >= 5 &&
            !abrindoPacote &&
            !abrindoMassa && (
              <button
                onClick={lidarComAberturaMassaLinkada}
                style={{
                  background: "linear-gradient(135deg, #2d8a4e, #1e5fa8)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "14px",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  boxShadow: "0 3px 0 #144d2b",
                  whiteSpace: "nowrap",
                  width: "100%",
                  textTransform: "uppercase",
                }}
              >
                Abrir 5 Pacotes 📦
              </button>
            )}
        </div>
      </div>
    </header>
  );
}
