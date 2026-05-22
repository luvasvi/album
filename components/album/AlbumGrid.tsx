// src/components/album/AlbumGrid.tsx
"use client";

import { FigurinhaComPosse } from "@/types/types";
import CardFigurinha from "@/components/cards/CardFigurinha";

interface Props {
  figurinhas: FigurinhaComPosse[];
}

export default function AlbumGrid({ figurinhas }: Props) {
  return (
    <div
      style={{
        position: "relative",
        zIndex: 1,

        display: "grid",

        gridTemplateColumns: "repeat(auto-fill, minmax(105px, 1fr))",

        gap: "12px",

        padding: "0 24px 24px",
      }}
    >
      {figurinhas.map((fig) =>
        fig.possui ? (
          <CardFigurinha key={fig.id} fig={fig} />
        ) : (
          <div
            key={fig.id}
            style={{
              aspectRatio: "3/4",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "6px",

              border: "2px dashed rgba(0,0,0,0.12)",

              display: "flex",
              flexDirection: "column",

              alignItems: "center",
              justifyContent: "center",

              gap: "4px",

              backdropFilter: "blur(4px)",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",

                fontSize: "20px",

                color: "rgba(0,0,0,0.18)",

                letterSpacing: "2px",
              }}
            >
              {String(fig.numero).padStart(3, "0")}
            </span>

            <span
              style={{
                fontSize: "7px",
                fontWeight: 800,

                color: "rgba(0,0,0,0.2)",

                textTransform: "uppercase",
                letterSpacing: "1px",

                background: "rgba(0,0,0,0.06)",

                padding: "1px 6px",

                borderRadius: "3px",
              }}
            >
              {fig.area}
            </span>
          </div>
        ),
      )}
    </div>
  );
}
