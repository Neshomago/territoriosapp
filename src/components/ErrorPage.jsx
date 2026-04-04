import React from "react";

export const ErrorPage = () => {

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>404 - Página no encontrada</h1>
      <p>La página que estás buscando no existe o ha ocurrido un error.</p>
      <a href="/" style={{ textDecoration: "underline", color: "blue" }}>
        Volver al inicio
      </a>
    </div>
  );
}
