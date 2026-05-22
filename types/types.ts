// src/types/types.ts
export interface Figurinha {
  id: string;
  numero: number;
  nome: string;
  cargo: string;
  area: string;
  emoji: string;
  isRara: boolean;
}

export interface FigurinhaComPosse extends Figurinha {
  possui: boolean;
  quantidade: number;
}

export interface AlbumData {
  figurinhas: FigurinhaComPosse[];
  totalPacotes: number;
  totalPossuidas: number;
  totalFigurinhas: number;
}

export type Area =
  | "Todas"
  | "Tech"
  | "RH"
  | "Marketing"
  | "Financeiro"
  | "Raras";
