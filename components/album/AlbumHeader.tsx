"use client";

import { useEffect, useState } from "react";
import { AlbumData } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

interface Props {
  data: (AlbumData & { ultimoResgate?: string | Date }) | null;
  abrirPacote: () => void;
  abrindoPacote: boolean;
}

export default function AlbumHeader({
  data,
  abrirPacote,
  abrindoPacote,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  // ⚡ ESTADO LOCAL CRÍTICO: Controla os pacotes na tela de forma reativa e instantânea
  const [saldoPacotes, setSaldoPacotes] = useState(data?.totalPacotes ?? 0);

  // Sincroniza o estado local caso os dados vindos do servidor mudem
  useEffect(() => {
    if (data) {
      setSaldoPacotes(data.totalPacotes);
    }
  }, [data?.totalPacotes]);

  const totalPacotes = saldoPacotes;
  const temPacotes = totalPacotes > 0;

  // Estados do Cooldown e Cronômetro
  const [dataAlvoCooldown, setDataAlvoCooldown] = useState<number | null>(null);
  const [tempoRestante, setTempoRestante] = useState<string>("");
  const [abrindoMassa, setAbrindoMassa] = useState(false);

  // 1. Verifica a API ao carregar a página (Versão Blindada Anti-Crash)
  useEffect(() => {
    if (session?.user?.email) {
      const verificarEreclamarPacotes = async () => {
        try {
          const res = await fetch("/api/pacotes/reclamar", { method: "POST" });

          const textoResposta = await res.text();
          if (!textoResposta) {
            console.warn("⚠️ API de pacotes retornou um corpo vazio.");
            return;
          }

          const resultado = JSON.parse(textoResposta);

          if (res.ok && resultado.success) {
            // Atualiza o saldo local adicionando os 5 pacotes sem travar a tela com alerta
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

  // 2. Cronômetro Regressivo Baseado na Resposta Real da API
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

      const hStr = String(horas).padStart(2, "0");
      const mStr = String(minutos).padStart(2, "0");
      const sStr = String(segundos).padStart(2, "0");

      setTempoRestante(`${hStr}h ${mStr}m ${sStr}s`);
    };

    atualizarCronometro();
    const intervalo = setInterval(atualizarCronometro, 1000);

    return () => clearInterval(intervalo);
  }, [dataAlvoCooldown, temPacotes]);

  // 🔥 3. Função Reativa para disparar a abertura em lote/massa
  const abrirPacotesEmMassa = async (quantidade: number) => {
    if (abrindoMassa || abrindoPacote) return;

    // ⚡ Efeito Fluido: Subtrai os pacotes na interface visual imediatamente antes da API responder
    setSaldoPacotes((prev) => Math.max(0, prev - quantidade));
    setAbrindoMassa(true);

    try {
      const res = await fetch("/api/pacotes/abrir-massa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade }),
      });

      const resultado = await res.json();

      if (res.ok && resultado.success) {
        // 🔥 GATILHO GLOBAL: Avisa o Grid que as figurinhas entraram para ele atualizar sem F5!
        window.dispatchEvent(new Event("atualizarColecao"));
        router.refresh();
      } else {
        console.error(
          `Erro da API: ${resultado.error || "Falha ao abrir lote"}`,
        );
        router.refresh(); // Devolve a quantidade real se o servidor rejeitar
      }
    } catch (error) {
      console.error("Erro na requisição de abertura em lote:", error);
      router.refresh();
    } finally {
      setAbrindoMassa(false);
    }
  };

  // Envelopa a função original de abrir 1 pacote para também descontar visualmente na hora
  const lidarComAberturaUnica = () => {
    setSaldoPacotes((prev) => Math.max(0, prev - 1));
    abrirPacote();
    // Dispara a revalidação da coleção também para abertura unitária
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
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      {/* Bloco 1: Logo Oficial */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "45px",
          flexShrink: 0,
        }}
      >
        <Image
          src="/images/logo green.png"
          alt="Logo Green Paperless"
          width={140}
          height={45}
          style={{ objectFit: "contain" }}
          priority
        />
      </div>

      {/* Bloco 2: Perfil do Usuário */}
      {session?.user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(0,0,0,0.03)",
            padding: "6px 14px",
            borderRadius: "30px",
            border: "1px solid rgba(0,0,0,0.04)",
            flexShrink: 0,
          }}
        >
          {session.user.image && (
            <img
              src={session.user.image}
              alt={session.user.name ?? "Usuário"}
              referrerPolicy="no-referrer"
              style={{
                width: "28px",
                height: "28px",
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
              fontSize: "14px",
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

          {/* Divisor interno discreto */}
          <span style={{ color: "rgba(0,0,0,0.15)", fontSize: "12px" }}>|</span>

          {/* 🔥 BOTÃO DE SAIR REATIVO */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })} // Desloga e redireciona direto pro login
            style={{
              background: "none",
              border: "none",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "12px",
              fontWeight: 800,
              color: "#dc2626", // Vermelho Alerta
              cursor: "pointer",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(220, 38, 38, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "none";
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
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* Card: Coleção Geral */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "6px 16px",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
            minWidth: "95px",
            height: "54px",
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
              letterSpacing: "1.5px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            COLEÇÃO
          </p>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "22px",
              color: "#2d8a4e",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            {data?.totalPossuidas ?? 0}
            <span
              style={{ fontSize: "12px", color: "#aaa", marginLeft: "1px" }}
            >
              /{data?.totalFigurinhas ?? 0}
            </span>
          </p>
        </div>

        {/* Card: Pacotes Disponíveis + Cronômetro */}
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "6px 16px",
            textAlign: "center",
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.02)",
            minWidth: "85px",
            height: "54px",
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
              letterSpacing: "1.5px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            PACOTES
          </p>
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "22px",
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
                letterSpacing: "0.2px",
                whiteSpace: "nowrap",
                marginTop: "-1px",
              }}
            >
              {tempoRestante}
            </div>
          )}
        </div>

        {/* Seção de Botões Unificada */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {/* Botão de Abrir 1 Pacote Tradicional */}
          <button
            onClick={lidarComAberturaUnica}
            disabled={!temPacotes || abrindoPacote || abrindoMassa}
            style={{
              background: temPacotes
                ? "linear-gradient(135deg, #f5d000, #c8920a)"
                : "#e0e0e0",
              color: temPacotes ? "#1a0a00" : "#999",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "16px",
              letterSpacing: "1.5px",
              cursor:
                temPacotes && !abrindoPacote && !abrindoMassa
                  ? "pointer"
                  : "not-allowed",
              boxShadow: temPacotes ? "0 4px 0 #a06c00" : "none",
              transition: "all 0.1s ease",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {abrindoPacote
              ? "ABRINDO..."
              : abrindoMassa
                ? "PROCESSANDO..."
                : "ABRIR 1 PACOTE 🔥"}
          </button>

          {/* Sub-Ações para Abertura em Massa Dinâmica sem Alerts */}
          {temPacotes && !abrindoPacote && !abrindoMassa && (
            <div style={{ display: "flex", gap: "6px", width: "100%" }}>
              {totalPacotes >= 5 && (
                <button
                  onClick={() => abrirPacotesEmMassa(5)}
                  style={{
                    flex: 1,
                    background: "#2d8a4e",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Abrir 5x 📦
                </button>
              )}

              {totalPacotes > 1 && (
                <button
                  onClick={() => abrirPacotesEmMassa(totalPacotes)}
                  style={{
                    flex: 2,
                    background: "#1a1a1a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textTransform: "uppercase",
                  }}
                >
                  Abrir Tudo ({totalPacotes}) ⚡
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
