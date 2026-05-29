// src/types/types.ts
export interface Figurinha {
  id: string;
  numero: number;
  nome: string;
  cargo: string;
  area: string;
  emoji: string;
  imagem?: string; // 👈 Adicionado aqui como opcional (?) para não quebrar se alguma figurinha antiga não tiver foto
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
  | "SISTEMAS" 
  | "OPERAÇÃO BRADESCO" 
  | "SERVIÇOS" 
  | "COMERCIAL" 
  | "GENTE & GESTÃO" 
  | "DELIVERY" 
  | "PROJETOS" 
  | "SUPORTE" 
  | "ADM/FINANCEIRO" 
  | "FINANCEIRO/FATURAMENTO" 
  | "DIRETORIA" 
  | "Raras";