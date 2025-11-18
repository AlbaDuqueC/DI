import React from "react";

interface BotonPersonalizadoProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

export default function BotonPersonalizado({
  children,
  onClick,
  className = "",
}: BotonPersonalizadoProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}
