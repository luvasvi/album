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
        background: "rgba(0, 0, 0, 0.04)", // Um toque sutil de contraste
        borderTop: "1px solid rgba(0, 0, 0, 0.06)",
        padding: "12px 28px", // Aumentado levemente para respirar melhor na tela larga
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          fontSize: "9px",
          fontWeight: 900,
          color: "rgba(0, 0, 0, 0.3)",
          textTransform: "uppercase",
          letterSpacing: "3px",
        }}
      ></span>

      <span
        style={{
          fontSize: "9px",
          fontWeight: 900,
          color: tituloCor,
          textTransform: "uppercase",
          letterSpacing: "3px",
          opacity: 0.7,
          transition: "color 0.3s ease",
        }}
      >
        GREEN COPA 2026
      </span>
    </div>
  );
}
