"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { AlbumData, Area, FigurinhaComPosse } from "@/types/types";
import { buscarAlbum, abrirPacoteRequest } from "./services/albumService";

import AlbumHeader from "@/components/album/AlbumHeader";
import AlbumTabs from "@/components/album/AlbumTabs";
import AlbumGrid from "@/components/album/AlbumGrid";
import AlbumFooter from "@/components/album/AlbumFooter";
import AlbumBackground from "@/components/album/AlbumBackground";
import AlbumStats from "@/components/album/AlbumStats";
import ModalPacote from "@/components/modal/ModalPacote";
import ModalDetalheFigurinha from "@/components/album/ModalDetalheFigurinha";

// 🎨 Configuração de fundos e blobs atualizada com as cores e chaves exclusivas de cada aba
const AREA_CONFIG: Record<
  string,
  {
    bg: string;
    blob1: string;
    blob2: string;
    blob3: string;
    titulo: string;
  }
> = {
  Todas: {
    bg: "#f0f4f0",
    blob1: "#2d8a4e",
    blob2: "#f5d000",
    blob3: "#1e5fa8",
    titulo: "#2d8a4e",
  },
  SISTEMAS: {
    bg: "#eef3fb",
    blob1: "#1e5fa8",
    blob2: "#2d8a4e",
    blob3: "#f5d000",
    titulo: "#1e5fa8",
  },
  "OPERAÇÃO BRADESCO": {
    bg: "#fff5f5",
    blob1: "#cc092f",
    blob2: "#f5d000",
    blob3: "#1e5fa8",
    titulo: "#cc092f",
  },
  SERVIÇOS: {
    bg: "#fcf8f2",
    blob1: "#e67e22",
    blob2: "#2d8a4e",
    blob3: "#1e5fa8",
    titulo: "#e67e22",
  },
  COMERCIAL: {
    bg: "#f3f0fa",
    blob1: "#8e44ad",
    blob2: "#f5d000",
    blob3: "#2d8a4e",
    titulo: "#8e44ad",
  },
  "GENTE & GESTÃO": {
    bg: "#fdf0f5",
    blob1: "#c0185a",
    blob2: "#f5d000",
    blob3: "#2d8a4e",
    titulo: "#c0185a",
  },
  DELIVERY: {
    bg: "#f0faf9",
    blob1: "#16a085",
    blob2: "#f5d000",
    blob3: "#1e5fa8",
    titulo: "#16a085",
  },
  PROJETOS: {
    bg: "#fbfcf2",
    blob1: "#d35400",
    blob2: "#1e5fa8",
    blob3: "#2d8a4e",
    titulo: "#d35400",
  },
  SUPORTE: {
    bg: "#f4f6f6",
    blob1: "#34495e",
    blob2: "#2d8a4e",
    blob3: "#f5d000",
    titulo: "#34495e",
  },
  "ADM/FINANCEIRO": {
    bg: "#fffbee",
    blob1: "#c8920a",
    blob2: "#2d8a4e",
    blob3: "#1e5fa8",
    titulo: "#c8920a",
  },
  "FINANCEIRO/FATURAMENTO": {
    bg: "#eaf4fc",
    blob1: "#0984e3",
    blob2: "#2d8a4e",
    blob3: "#34495e",
    titulo: "#0984e3",
  },
  DIRETORIA: {
    bg: "#eaeded",
    blob1: "#2c3e50",
    blob2: "#c8920a",
    blob3: "#cc092f",
    titulo: "#2c3e50",
  },
  Raras: {
    bg: "#fdf2f2",
    blob1: "#d63031",
    blob2: "#f5d000",
    blob3: "#8e44ad",
    titulo: "#d63031",
  },
};

export default function AlbumPage() {
  const { status } = useSession();
  const router = useRouter();

  const [data, setData] = useState<AlbumData | null>(null);
  const [abaAtiva, setAbaAtiva] = useState<Area>("Todas");
  const [loading, setLoading] = useState(true);
  const [abrindoPacote, setAbrindoPacote] = useState(false);
  const [figurinhasPacote, setFigurinhasPacote] = useState<
    FigurinhaComPosse[] | null
  >(null);

  // Controle da figurinha selecionada para troca
  const [figurinhaSelecionada, setFigurinhaSelecionada] =
    useState<FigurinhaComPosse | null>(null);

  const carregou = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Função que bate no banco e atualiza o estado reativo principal da tela
  const carregarAlbum = useCallback(async () => {
    if (status !== "authenticated") return;

    try {
      const json = await buscarAlbum();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar o álbum na API, redirecionando...", err);
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || carregou.current) return;

    carregou.current = true;
    void carregarAlbum();
  }, [carregarAlbum, status]);

  // Escutador reativo que recarrega o estado local das figurinhas instantaneamente sem F5!
  useEffect(() => {
    const escutarMudancasNaColecao = () => {
      void carregarAlbum();
    };

    window.addEventListener("atualizarColecao", escutarMudancasNaColecao);
    return () =>
      window.removeEventListener("atualizarColecao", escutarMudancasNaColecao);
  }, [carregarAlbum]);

  const abrirPacote = async () => {
    if (!data || data.totalPacotes === 0 || abrindoPacote) {
      return;
    }

    setAbrindoPacote(true);

    try {
      const json = await abrirPacoteRequest();

      if (json.figurinhas) {
        setFigurinhasPacote(json.figurinhas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAbrindoPacote(false);
    }
  };

  const fecharModal = () => {
    setFigurinhasPacote(null);
    void carregarAlbum();
  };

  // 🔥 FILTRAGEM CORRIGIDA: Comparação estrita letra por letra eliminando duplicações
  const figurinhasFiltradas =
    data?.figurinhas.filter((f) => {
      if (abaAtiva === "Todas") return true;
      if (abaAtiva === "Raras") return f.isRara;

      // Retorna apenas se o setor gravado for estritamente igual à aba ativa
      return f.area.toUpperCase() === abaAtiva.toUpperCase();
    }) ?? [];

  const cfg = AREA_CONFIG[abaAtiva] ?? AREA_CONFIG.Todas;

  if (status === "loading" || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f4f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "28px",
            color: "#2d8a4e",
            letterSpacing: "6px",
          }}
        >
          {status === "loading"
            ? "VERIFICANDO LOGIN..."
            : "CARREGANDO ÁLBUM..."}
        </p>
      </div>
    );
  }

  if (status !== "authenticated") return null;

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          background: "#d6ddd6",
          fontFamily: "'Barlow Condensed', sans-serif",
          padding: "16px",
        }}
      >
        <AlbumHeader
          data={data}
          abrirPacote={abrirPacote}
          abrindoPacote={abrindoPacote}
        />

        <AlbumTabs abaAtiva={abaAtiva} setAbaAtiva={setAbaAtiva} />

        <main
          style={{
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 12px 50px rgba(0,0,0,0.3)",
            position: "relative",
            background: cfg.bg,
            transition: "background 0.3s ease",
            minHeight: "80vh",
          }}
        >
          <AlbumBackground
            blob1={cfg.blob1}
            blob2={cfg.blob2}
            blob3={cfg.blob3}
          />

          <div
            style={{ position: "relative", zIndex: 1, padding: "24px 28px 0" }}
          >
            <AlbumStats abaAtiva={abaAtiva} figurinhas={figurinhasFiltradas} />
          </div>

          {/* Contêiner capturador de clique em volta do Grid */}
          <div
            onClick={(e) => {
              const target = e.target as HTMLElement;
              const cardElement = target.closest("[data-figurinha-id]");
              if (cardElement) {
                const figId = cardElement.getAttribute("data-figurinha-id");
                const figurinhaAchada = figurinhasFiltradas.find(
                  (f) => f.id === figId,
                );

                if (figurinhaAchada && figurinhaAchada.possui) {
                  setFigurinhaSelecionada(figurinhaAchada);
                }
              }
            }}
          >
            <AlbumGrid figurinhas={figurinhasFiltradas} />
          </div>

          <AlbumFooter tituloCor={cfg.titulo} />
        </main>
      </div>

      {figurinhasPacote && (
        <ModalPacote figurinhas={figurinhasPacote} onFechar={fecharModal} />
      )}

      {figurinhaSelecionada && (
        <ModalDetalheFigurinha
          fig={figurinhaSelecionada}
          onFechar={() => setFigurinhaSelecionada(null)}
        />
      )}
    </>
  );
}
