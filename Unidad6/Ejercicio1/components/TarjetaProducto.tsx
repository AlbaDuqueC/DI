import React from "react";
import BotonPersonalizado from "./BotonPersonalizado";

export interface TarjetaProductoProps {
  name: string;
  price: number;
  Image: string | React.ReactNode;
  onAddToCart: () => void;
}

export default function TarjetaProducto({
  name,
  price,
  Image,
  onAddToCart,
}: TarjetaProductoProps) {
  const renderImage = () =>
    typeof Image === "string" ? (
      <img src={Image} alt={name} style={{ width: "100%", borderRadius: 8 }} />
    ) : (
      <div style={{ width: "100%" }}>{Image}</div>
    );

  return (
    <article
      style={{
        width: 240,
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        background: "#fff",
      }}
    >
      <div style={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {renderImage()}
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{name}</h3>
        <p style={{ margin: "8px 0 0", color: "#374151", fontWeight: 700 }}>
          €{price.toFixed(2)} EUR
        </p>
      </div>

      <div>
        <BotonPersonalizado onClick={onAddToCart}>Añadir al Carrito</BotonPersonalizado>
      </div>
    </article>
  );
}

