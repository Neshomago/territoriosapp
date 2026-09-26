import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db, COLLECTIONS } from "./firebase";

// Grupo fijo por día de la semana (getDay(): 0=Domingo ... 6=Sábado).
// No es editable por el usuario, es el calendario oficial del sistema.
const GRUPO_POR_DIA = {
  1: "Murillo",
  2: "Jara",
  3: "Mosquera(mañana)",
  4: "Echeverría",
  5: "Villareal",
};

const NOMBRES_DIA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function formatDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function dateToIso(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function TerritorioDelDiaCard() {
  const today = useMemo(() => new Date(), []);
  const dayOfWeek = today.getDay();
  const grupoHoy = GRUPO_POR_DIA[dayOfWeek];

  const [territorioData, setTerritorioData] = useState(null);
  const [entradasSabado, setEntradasSabado] = useState([]);
  const [lugares, setLugares] = useState({});
  const [loading, setLoading] = useState(true);

  // Lunes a viernes: escuchar el documento del grupo que corresponde hoy.
  useEffect(() => {
    if (!grupoHoy) {
      setLoading(false);
      return undefined;
    }

    const unsubscribe = onSnapshot(
      doc(db, COLLECTIONS.TERRITORIES, grupoHoy),
      (snapshot) => {
        setTerritorioData(snapshot.exists() ? snapshot.data() : null);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [grupoHoy]);

  // Sábado: escuchar el arreglo de predicación de la fecha de hoy.
  useEffect(() => {
    if (dayOfWeek !== 6) return undefined;

    const todayIso = dateToIso(today);

    const q = query(
      collection(db, COLLECTIONS.ARREGLO_PREDICACION),
      where("tipo", "==", "mensual"),
      where("dia", "==", todayIso)
    );

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const entradas = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        setEntradasSabado(entradas);
        setLoading(false);

        const lugarIds = [
          ...new Set(entradas.map((e) => e.lugarId).filter(Boolean)),
        ];

        const resolved = await Promise.all(
          lugarIds.map(async (lugarId) => {
            const lugarSnap = await getDoc(
              doc(db, COLLECTIONS.LUGARES_PREDICACION, lugarId)
            );
            return [lugarId, lugarSnap.exists() ? lugarSnap.data() : null];
          })
        );

        setLugares(Object.fromEntries(resolved));
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, [dayOfWeek, today]);

  const renderWeekday = () => {
    const area = territorioData?.mapa?.area || {};
    const todayFormatted = formatDate(today);

    const iniciadosHoy = Object.entries(area).filter(
      ([, data]) => data.fechaInicio === todayFormatted
    );

    if (iniciadosHoy.length === 0) {
      return (
        <p className="text-sm text-on-surface-variant">
          Ningún territorio de {grupoHoy} se ha iniciado hoy.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {iniciadosHoy.map(([areaKey, data]) => {
          const manzanas = Array.isArray(data.manzanas) ? data.manzanas : [];
          const completadas = manzanas.filter((m) => m.completed).length;
          const total = manzanas.length;
          const progreso = total > 0 ? (completadas / total) * 100 : 0;

          return (
            <div
              key={areaKey}
              className="rounded-xl border border-surface-container p-3"
            >
              <p className="text-sm font-semibold text-on-surface">
                {data.name || areaKey}
              </p>
              <p className="text-xs text-on-surface-variant">
                Asignado a {data.user || "Sin asignar"} · Iniciado{" "}
                {data.fechaInicio}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${progreso}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-on-surface-variant">
                  {completadas}/{total}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSaturday = () => {
    if (entradasSabado.length === 0) {
      return (
        <p className="text-sm text-on-surface-variant">
          Todavía no hay arreglo de predicación guardado para hoy.
        </p>
      );
    }

    return (
      <div className="space-y-3">
        {entradasSabado.map((entrada) => {
          const lugar = entrada.lugarId
            ? lugares[entrada.lugarId]
            : null;

          return (
            <div
              key={entrada.id}
              className="rounded-xl border border-surface-container p-3"
            >
              <p className="text-sm font-semibold text-on-surface">
                {entrada.grupos || "Sin asignar"}
              </p>
              <p className="text-xs text-on-surface-variant">
                Asignado a {entrada.asignado || "Sin asignar"}
              </p>
              <p className="text-xs mt-1">
                {lugar ? (
                  <a
                    href={lugar.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline"
                  >
                    {lugar.nombre}
                  </a>
                ) : (
                  <span className="text-on-surface-variant">
                    Sin lugar asignado
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="mb-8">
      <div className="bg-white rounded-3xl shadow-ambient border border-surface-container p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-primary text-[28px]">
            today
          </span>
          <div>
            <p className="text-xs font-mono font-semibold text-on-surface-variant uppercase tracking-wider">
              Hoy · {NOMBRES_DIA[dayOfWeek]}
            </p>
            <h2 className="text-lg font-bold text-on-surface">
              Territorio del día
            </h2>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-on-surface-variant">Cargando...</p>
        ) : dayOfWeek === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Hoy domingo no hay territorio de predicación asignado.
          </p>
        ) : dayOfWeek === 6 ? (
          renderSaturday()
        ) : (
          renderWeekday()
        )}
      </div>
    </section>
  );
}
