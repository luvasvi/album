// src/services/albumService.ts

import { AlbumData } from "@/types/types";

export async function buscarAlbum(): Promise<AlbumData> {
  const res = await fetch("/api/album");

  if (!res.ok) {
    throw new Error("Erro ao carregar álbum");
  }

  return res.json();
}

export async function abrirPacoteRequest() {
  const res = await fetch("/api/pacotes/abrir", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Erro ao abrir pacote");
  }

  return res.json();
}
