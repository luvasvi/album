"use client";

import { useState, useEffect, useCallback, useRef } from "react";

import { AlbumData, Area, FigurinhaComPosse } from "@/types/types";

import { buscarAlbum, abrirPacoteRequest } from "../app/services/albumService";

import AlbumHeader from "@/components/album/AlbumHeader";
import AlbumTabs from "@/components/album/AlbumTabs";
import AlbumGrid from "@/components/album/AlbumGrid";
import AlbumFooter from "@/components/album/AlbumFooter";
import AlbumBackground from "@/components/album/AlbumBackground";
import AlbumStats from "@/components/album/AlbumStats";

import ModalPacote from "@/components/modal/ModalPacote";

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

  Tech: {
    bg: "#eef3fb",
    blob1: "#1e5fa8",
    blob2: "#2d8a4e",
    blob3: "#f5d000",
    titulo: "#1e5fa8",
  },

  RH: {
    bg: "#fdf0f5",
    blob1: "#c0185a",
    blob2: "#f5d000",
    blob3: "#2d8a4e",
    titulo: "#c0185a",
  },

  Marketing: {
    bg: "#f0faf2",
    blob1: "#2d8a4e",
    blob2: "#f5d000",
    blob3: "#1e5fa8",
    titulo: "#2d8a4e",
  },

  Financeiro: {
    bg: "#fffbee",
    blob1: "#c8920a",
    blob2: "#2d8a4e",
    blob3: "#1e5fa8",
    titulo: "#c8920a",
  },

  Raras: {
    bg: "#fffbee",
    blob1: "#c8920a",
    blob2: "#f5d000",
    blob3: "#c0185a",
    titulo: "#c8920a",
  },
};

export default function AlbumPage() {
  const [data, setData] = useState<AlbumData | null>(null);

  const [abaAtiva, setAbaAtiva] = useState<Area>("Todas");

  const [loading, setLoading] = useState(true);

  const [abrindoPacote, setAbrindoPacote] = useState(false);

  const [figurinhasPacote, setFigurinhasPacote] = useState<
    FigurinhaComPosse[] | null
  >(null);

  const carregou = useRef(false);

  const carregarAlbum = useCallback(async () => {
    try {
      const json = await buscarAlbum();

      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (carregou.current) return;

    carregou.current = true;

    void carregarAlbum();
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

  const figurinhasFiltradas =
    data?.figurinhas.filter((f) => {
      if (abaAtiva === "Todas") return true;

      if (abaAtiva === "Raras") {
        return f.isRara;
      }

      return f.area === abaAtiva;
    }) ?? [];

  const cfg = AREA_CONFIG[abaAtiva] ?? AREA_CONFIG.Todas;

  if (loading) {
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
          CARREGANDO ÁLBUM...
        </p>
      </div>
    );
  }

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
            maxWidth: "1000px",

            margin: "0 auto",

            borderRadius: "12px",

            overflow: "hidden",

            boxShadow: "0 8px 40px rgba(0,0,0,0.25)",

            position: "relative",

            background: cfg.bg,

            transition: "background 0.3s ease",

            minHeight: "500px",
          }}
        >
          <AlbumBackground
            blob1={cfg.blob1}
            blob2={cfg.blob2}
            blob3={cfg.blob3}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,

              padding: "24px 28px 0",
            }}
          >
            <AlbumStats abaAtiva={abaAtiva} figurinhas={figurinhasFiltradas} />
          </div>

          <AlbumGrid figurinhas={figurinhasFiltradas} />

          <AlbumFooter tituloCor={cfg.titulo} />
        </main>
      </div>

      {figurinhasPacote && (
        <ModalPacote figurinhas={figurinhasPacote} onFechar={fecharModal} />
      )}
    </>
  );
}
