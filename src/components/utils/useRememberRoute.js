import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "territoriosapp_last_route";

// Recuerda la última ruta visitada (por pestaña) para poder volver a ella
// si el sistema operativo recarga la app en segundo plano y la deja en "/".
export function useRememberRoute() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") return;

    try {
      sessionStorage.setItem(STORAGE_KEY, location.pathname);
    } catch {
      // Almacenamiento no disponible (navegación privada, etc.): no pasa nada.
    }
  }, [location.pathname]);
}

export function getRememberedRoute() {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}
