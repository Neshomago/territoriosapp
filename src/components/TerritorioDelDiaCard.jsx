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
import ImagePreviewModal from "./ImagePreviewModal";
import fondoNoche from "../assets/clima/noche.svg";
import fondoNublado from "../assets/clima/nublado.svg";
import fondoNiebla from "../assets/clima/niebla.svg";
import fondoNieve from "../assets/clima/nieve.svg";
import fondoLluvia from "../assets/clima/lluvia.svg";
import fondoSoleado from "../assets/clima/soleado.svg";
import fondoTormenta from "../assets/clima/tormenta.svg";

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

// Ubicación fija para el clima (Guayaquil).
const CLIMA_UBICACION = {
  ciudad: "Guayaquil",
  latitud: -2.1342551,
  longitud: -79.8991505,
};

const CLIMA_CACHE_KEY = "clima-guayaquil";
const CLIMA_CACHE_MS = 30 * 60 * 1000;

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

function getClimaInfo(code, isDay) {
  const noche = isDay === 0;

  if (code === 0) {
    return {
      texto: "Despejado",
      icono: noche ? "clear_night" : "clear_day",
    };
  }
  if (code === 1) {
    return {
      texto: "Mayormente despejado",
      icono: noche ? "partly_cloudy_night" : "partly_cloudy_day",
    };
  }
  if (code === 2) {
    return {
      texto: "Parcialmente nublado",
      icono: noche ? "partly_cloudy_night" : "partly_cloudy_day",
    };
  }
  if (code === 3) return { texto: "Nublado", icono: "cloud" };
  if (code === 45 || code === 48) {
    return { texto: "Niebla", icono: "foggy" };
  }
  if (code >= 51 && code <= 57) {
    return { texto: "Llovizna", icono: "rainy" };
  }
  if (code >= 61 && code <= 67) {
    return { texto: "Lluvia", icono: "rainy" };
  }
  if (code >= 71 && code <= 77) {
    return { texto: "Nieve", icono: "weather_snowy" };
  }
  if (code >= 80 && code <= 82) {
    return { texto: "Chubascos", icono: "rainy" };
  }
  if (code === 85 || code === 86) {
    return { texto: "Chubascos de nieve", icono: "weather_snowy" };
  }
  if (code === 95) {
    return { texto: "Tormenta", icono: "thunderstorm" };
  }
  if (code === 96 || code === 99) {
    return { texto: "Tormenta con granizo", icono: "thunderstorm" };
  }
  return { texto: "Sin datos", icono: "help" };
}

function getClimaFondo(code, isDay) {
  const noche = isDay === 0;

  if (code === 0 || code === 1) return noche ? fondoNoche : fondoSoleado;
  if (code === 2 || code === 3) return fondoNublado;
  if (code === 45 || code === 48) return fondoNiebla;
  if (code >= 51 && code <= 67) return fondoLluvia;
  if (code >= 71 && code <= 77) return fondoNieve;
  if (code >= 80 && code <= 82) return fondoLluvia;
  if (code === 85 || code === 86) return fondoNieve;
  if (code >= 95) return fondoTormenta;

  return fondoNublado;
}

function getPicoLluvia(hourly, fechaIso, desde, hasta) {
  if (!hourly?.time) return null;

  let pico = null;

  hourly.time.forEach((tiempo, index) => {
    if (!tiempo.startsWith(fechaIso)) return;

    const hora = Number(tiempo.slice(11, 13));
    if (hora < desde || hora > hasta) return;

    const probabilidad = hourly.precipitation_probability?.[index] ?? 0;
    const milimetros = hourly.precipitation?.[index] ?? 0;

    if (
      !pico ||
      probabilidad > pico.probabilidad ||
      (probabilidad === pico.probabilidad && milimetros > pico.milimetros)
    ) {
      pico = { hora, probabilidad, milimetros };
    }
  });

  return pico;
}

export default function TerritorioDelDiaCard() {
  const today = useMemo(() => new Date(), []);
  const dayOfWeek = today.getDay();
  const grupoHoy = GRUPO_POR_DIA[dayOfWeek];

  const [territorioData, setTerritorioData] = useState(null);
  const [entradasSabado, setEntradasSabado] = useState([]);
  const [lugares, setLugares] = useState({});
  const [lugarHoy, setLugarHoy] = useState(null);
  const [casasNoVisitar, setCasasNoVisitar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [clima, setClima] = useState(null);
  const [climaError, setClimaError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    let cache = null;
    try {
      cache = JSON.parse(sessionStorage.getItem(CLIMA_CACHE_KEY));
    } catch {
      cache = null;
    }

    if (cache?.data && Date.now() - cache.savedAt < CLIMA_CACHE_MS) {
      setClima(cache.data);
      return () => controller.abort();
    }

    if (!navigator.onLine) {
      setClimaError(true);
      return () => controller.abort();
    }

    const url =
      "https://api.open-meteo.com/v1/forecast" +
      `?latitude=${CLIMA_UBICACION.latitud}` +
      `&longitude=${CLIMA_UBICACION.longitud}` +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,precipitation" +
      "&hourly=precipitation_probability,precipitation" +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max" +
      "&timezone=auto&forecast_days=1";

    fetch(url, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Clima: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setClima(data);
        try {
          sessionStorage.setItem(
            CLIMA_CACHE_KEY,
            JSON.stringify({ savedAt: Date.now(), data })
          );
        } catch (error) {
          console.warn("No se pudo guardar el clima en caché", error);
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setClimaError(true);
        }
      });

    return () => controller.abort();
  }, []);

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

  // Casas no visitar vinculadas al grupo de hoy, para mostrarlas junto al
  // territorio correspondiente más abajo.
  useEffect(() => {
    if (!grupoHoy) {
      setCasasNoVisitar([]);
      return undefined;
    }

    const q = query(
      collection(db, COLLECTIONS.CASAS_NO_VISITAR),
      where("grupo", "==", grupoHoy)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCasasNoVisitar(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      );
    });

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

  // Lunes a viernes: resolver el lugar de predicación del día desde el
  // arreglo semanal, para mostrarlo como botón a Google Maps.
  useEffect(() => {
    if (dayOfWeek === 0 || dayOfWeek === 6) return undefined;

    const q = query(
      collection(db, COLLECTIONS.ARREGLO_PREDICACION),
      where("tipo", "==", "semanal"),
      where("dia", "==", NOMBRES_DIA[dayOfWeek])
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const lugarId = snapshot.docs[0]?.data()?.lugarId;
      if (!lugarId) {
        setLugarHoy(null);
        return;
      }

      const lugarSnap = await getDoc(
        doc(db, COLLECTIONS.LUGARES_PREDICACION, lugarId)
      );
      setLugarHoy(lugarSnap.exists() ? lugarSnap.data() : null);
    });

    return () => unsubscribe();
  }, [dayOfWeek]);

  const renderClima = () => {
    if (climaError) {
      return (
        <div className="flex items-center gap-2 rounded-xl border border-surface-container bg-surface-container-low px-3 py-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            cloud_off
          </span>
          <p className="text-xs text-on-surface-variant">
            Clima no disponible
          </p>
        </div>
      );
    }

    if (!clima?.current) {
      return (
        <div className="flex items-center gap-2 rounded-xl border border-surface-container bg-surface-container-low px-3 py-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
            progress_activity
          </span>
          <p className="text-xs text-on-surface-variant">Cargando clima...</p>
        </div>
      );
    }

    const { current, daily } = clima;
    const fondo = getClimaFondo(current.weather_code, current.is_day);
    const { texto, icono } = getClimaInfo(
      current.weather_code,
      current.is_day
    );
    const temperatura = Math.round(current.temperature_2m);
    const sensacion = Math.round(current.apparent_temperature);
    const maxima = Math.round(daily?.temperature_2m_max?.[0]);
    const minima = Math.round(daily?.temperature_2m_min?.[0]);
    const lluvia = daily?.precipitation_probability_max?.[0];
    const hoyIso = dateToIso(today);
    const picoManana = getPicoLluvia(clima.hourly, hoyIso, 8, 10);
    const picoTarde = getPicoLluvia(clima.hourly, hoyIso, 17, 20);

    const renderPico = (etiqueta, pico) => {
      if (!pico) return null;

      return (
        <span className="inline-flex items-center gap-1 rounded-lg border border-surface-container bg-white px-2 py-1">
          <span className="material-symbols-outlined text-[15px] text-primary">
            rainy
          </span>
          <span className="font-semibold text-on-surface">{etiqueta}</span>
          <span className="text-on-surface-variant">
            {pico.probabilidad}% · {String(pico.hora).padStart(2, "0")}:00
          </span>
          {pico.milimetros > 0 && (
            <span className="text-on-surface-variant">
              · {pico.milimetros} mm
            </span>
          )}
        </span>
      );
    };

    return (
      <div className="relative isolate flex flex-wrap items-center gap-x-4 gap-y-2 overflow-hidden rounded-xl border border-surface-container bg-surface-container-low px-3 py-2">
        <img
          src={fondo}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[26px] text-primary">
            {icono}
          </span>
          <div>
            <p className="text-sm font-bold text-on-surface">
              {temperatura}°C
            </p>
            <p className="text-[11px] text-on-surface-variant">
              {texto} · {CLIMA_UBICACION.ciudad}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-on-surface-variant">
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">
              thermostat
            </span>
            Sensación {sensacion}°C
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">
              device_thermostat
            </span>
            {maxima}° / {minima}°
          </span>
          {lluvia !== undefined && (
            <span className="inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">
                water_drop
              </span>
              Lluvia {lluvia}%
            </span>
          )}
        </div>

        {(picoManana || picoTarde) && (
          <div className="flex w-full flex-wrap items-center gap-2 border-t border-surface-container pt-2 text-[11px]">
            <span className="font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
              Hora con más lluvia
            </span>
            {renderPico("08–10", picoManana)}
            {renderPico("17–20", picoTarde)}
          </div>
        )}

        <p className="flex w-full items-start gap-1 text-[10px] leading-snug text-on-surface-variant/80">
          <span className="material-symbols-outlined text-[13px]">
            info
          </span>
          Proyección referencial: puede existir un margen de error y el clima
          puede cambiar repentinamente.
        </p>
      </div>
    );
  };

  const renderCasasNoVisitar = (area) => {
    if (casasNoVisitar.length === 0) return null;

    return (
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-3">
        <p className="mb-2 text-xs font-semibold text-red-600">
          🚫 Casas no visitar en {grupoHoy}
        </p>
        <div className="space-y-2">
          {casasNoVisitar.map((casa) => {
            const territorioNombre =
              area[casa.territorioKey]?.name || casa.territorioKey;

            return (
              <div
                key={casa.id}
                className="flex items-center gap-3 rounded-lg bg-white p-2"
              >
                {casa.imagenUrl ? (
                  <button
                    type="button"
                    onClick={() => setPreviewImage(casa.imagenUrl)}
                  >
                    <img
                      src={casa.imagenUrl}
                      alt="Foto de la casa"
                      className="h-12 w-12 rounded-lg object-cover border border-red-200"
                    />
                  </button>
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-red-100 border border-red-200" />
                )}
                <p className="text-xs text-on-surface">
                  {territorioNombre} · Manzana{" "}
                  <strong>{casa.manzanaName}</strong> · Villa{" "}
                  <strong>{casa.villa || "?"}</strong>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLugarButton = (lugar) => {
    if (!lugar?.mapsUrl) return null;

    return (
      <a
        href={lugar.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
      >
        <span className="material-symbols-outlined text-[16px]">
          location_on
        </span>
        {lugar.nombre}
        <span className="material-symbols-outlined text-[16px]">
          open_in_new
        </span>
      </a>
    );
  };

  const renderWeekday = () => {
    const area = territorioData?.mapa?.area || {};
    const todayFormatted = formatDate(today);

    const iniciadosHoy = Object.entries(area).filter(
      ([, data]) => data.fechaInicio === todayFormatted
    );

    return (
      <div className="space-y-3">
        {iniciadosHoy.length === 0 ? (
          <p className="text-sm text-on-surface-variant">
            Ningún territorio de {grupoHoy} se ha iniciado hoy.
          </p>
        ) : (
          iniciadosHoy.map(([areaKey, data]) => {
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
                <div className="mt-3">
                  <p className="mb-2 text-xs font-mono font-semibold uppercase tracking-wider text-on-surface-variant">
                    Manzanas ({total})
                  </p>
                  <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                    {manzanas.map((m, index) => {
                      const isChecked = Boolean(m.completed);

                      return (
                        <div
                          key={m.name ?? index}
                          title={isChecked ? "Completada" : "Pendiente"}
                          className={`flex items-center justify-center gap-1 rounded-xl border px-2 py-1.5 text-xs font-mono font-bold ${
                            isChecked
                              ? "bg-primary text-white border-primary"
                              : "bg-surface-container-low text-on-surface border-surface-container"
                          }`}
                        >
                          {isChecked && (
                            <span className="material-symbols-outlined text-[13px]">
                              check
                            </span>
                          )}
                          <span>{m.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {renderCasasNoVisitar(area)}
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
                  renderLugarButton(lugar)
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
          <div className="flex-1">
            <p className="text-xs font-mono font-semibold text-on-surface-variant uppercase tracking-wider">
              Hoy · {NOMBRES_DIA[dayOfWeek]}
            </p>
            <h2 className="text-lg font-bold text-on-surface">
              Territorio del día
            </h2>
          </div>
          {renderLugarButton(lugarHoy)}
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

        <div className="mt-4">{renderClima()}</div>

      </div>

      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </section>
  );
}
