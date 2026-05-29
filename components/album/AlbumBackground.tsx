"use client";

interface Props {
  blob1: string;
  blob2: string;
  blob3: string;
}

export default function AlbumBackground({ blob1, blob2, blob3 }: Props) {
  return (
    <>
      {/* Blob esquerda */}
      <div
        style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "480px", // Expandido proporcionalmente para a tela larga
          height: "480px",
          borderRadius: "50%",
          background: blob1,
          opacity: 0.85,
          pointerEvents: "none",
          zIndex: 0,
          transition: "background 0.3s ease",
        }}
      />

      {/* Blob topo */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          left: "25%", // Posicionamento fluido baseado em porcentagem para acompanhar a largura
          width: "380px", // Ajustado para dar volume ao banner central
          height: "380px",
          borderRadius: "50%",
          background: blob2,
          opacity: 0.9,
          pointerEvents: "none",
          zIndex: 0,
          transition: "background 0.3s ease",
        }}
      />

      {/* Blob direita */}
      <div
        style={{
          position: "absolute",
          top: "40px",
          right: "-60px",
          width: "320px", // Ajustado para marcar a extremidade direita da grade
          height: "320px",
          borderRadius: "50%",
          background: blob3,
          opacity: 0.8,
          pointerEvents: "none",
          zIndex: 0,
          transition: "background 0.3s ease",
        }}
      />

      {/* Blob fundo */}
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "35%",
          width: "420px", // Aumentado para criar uma bela marca d'água sob a grade de figurinhas
          height: "420px",
          borderRadius: "50%",
          background: blob1,
          opacity: 0.12,
          pointerEvents: "none",
          zIndex: 0,
          transition: "background 0.3s ease",
        }}
      />
    </>
  );
}
