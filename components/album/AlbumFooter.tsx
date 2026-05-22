// src/components/album/AlbumFooter.tsx
"use client";

interface Props {
  tituloCor: string;
}

export default function AlbumFooter({ tituloCor }: Props) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,

        background: "rgba(0,0,0,0.08)",

        borderTop: "1px solid rgba(0,0,0,0.08)",

        padding: "8px 28px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: "8px",
          fontWeight: 900,

          color: "rgba(0,0,0,0.25)",

          textTransform: "uppercase",

          letterSpacing: "3px",
        }}
      >
        OFFICIAL LICENSED PRODUCT
      </span>

      <span
        style={{
          fontSize: "8px",
          fontWeight: 900,

          color: tituloCor,

          textTransform: "uppercase",

          letterSpacing: "3px",

          opacity: 0.6,
        }}
      >
        GREEN COPA 2026
      </span>
    </div>
  );
}
