// src/components/album/AlbumBackground.tsx
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

          top: "-60px",
          left: "-60px",

          width: "320px",
          height: "320px",

          borderRadius: "50%",

          background: blob1,

          opacity: 0.85,

          pointerEvents: "none",

          zIndex: 0,
        }}
      />

      {/* Blob topo */}
      <div
        style={{
          position: "absolute",

          top: "-40px",
          left: "180px",

          width: "260px",
          height: "260px",

          borderRadius: "50%",

          background: blob2,

          opacity: 0.9,

          pointerEvents: "none",

          zIndex: 0,
        }}
      />

      {/* Blob direita */}
      <div
        style={{
          position: "absolute",

          top: "60px",
          right: "-40px",

          width: "200px",
          height: "200px",

          borderRadius: "50%",

          background: blob3,

          opacity: 0.8,

          pointerEvents: "none",

          zIndex: 0,
        }}
      />

      {/* Blob fundo */}
      <div
        style={{
          position: "absolute",

          bottom: "-80px",
          left: "30%",

          width: "280px",
          height: "280px",

          borderRadius: "50%",

          background: blob1,

          opacity: 0.12,

          pointerEvents: "none",

          zIndex: 0,
        }}
      />
    </>
  );
}
