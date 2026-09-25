import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import NavbarApp from "./NavbarApp";
import FooterNavbar from "./FooterNavbar";

const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
];

const OPCIONES_GRUPOS = [
  "Toda la congregación",
  "Grupos 1, 2, 3 y 4",
  "Grupos 5, 6, 7 y 8",
  "Predicación por cada grupo",
  "Visita de superintendente",
  "Asamblea de circuito",
  "Asamblea regional",
];

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function getSaturdays(year, month) {
  const saturdays = [];

  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    if (date.getDay() === 6) {
      saturdays.push(new Date(date));
    }

    date.setDate(date.getDate() + 1);
  }

  return saturdays;
}

function dateToString(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getThreeMonths() {
  const today = new Date();

  return Array.from({ length: 3 }, (_, index) => {
    return new Date(
      today.getFullYear(),
      today.getMonth() + index,
      1
    );
  });
}

export default function PredicacionEditor() {
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const weeklyQuery = query(
      collection(db, "arregloPredicacion"),
      where("tipo", "==", "semanal")
    );

    const monthlyQuery = query(
      collection(db, "arregloPredicacion"),
      where("tipo", "==", "mensual")
    );

    const unsubscribeWeekly = onSnapshot(weeklyQuery, (snapshot) => {
      setWeekly(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    const unsubscribeMonthly = onSnapshot(monthlyQuery, (snapshot) => {
      setMonthly(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => {
      unsubscribeWeekly();
      unsubscribeMonthly();
    };
  }, []);

  const getWeekly = (dia) => {
    return (
      weekly.find((item) => item.dia === dia) || {
        dia,
        horario: "",
        lugar: "",
        asignado: "",
      }
    );
  };

  const getSaturday = (dateString) => {
    return (
      monthly.find((item) => item.dia === dateString) || {
        dia: dateString,
        grupos: "",
        lugar: "",
        asignado: "",
      }
    );
  };

  const updateWeekly = async (dia, field, value) => {
    try {
      setSaving(true);

      const id = `semanal_${dia
        .toLowerCase()
        .replaceAll(" ", "_")}`;

      const current = getWeekly(dia);

      await setDoc(
        doc(db, "arregloPredicacion", id),
        {
          tipo: "semanal",
          dia,
          horario:
            field === "horario"
              ? value
              : current.horario,
          lugar:
            field === "lugar"
              ? value
              : current.lugar,
          asignado:
            field === "asignado"
              ? value
              : current.asignado,
        },
        { merge: true }
      );

      setMessage("Horario actualizado.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo actualizar.");
    } finally {
      setSaving(false);
    }
  };

  const updateSaturday = async (
    dateString,
    field,
    value
  ) => {
    try {
      setSaving(true);

      const id = `mensual_${dateString}`;

      const current = getSaturday(dateString);

      await setDoc(
        doc(db, "arregloPredicacion", id),
        {
          tipo: "mensual",
          dia: dateString,
          grupos:
            field === "grupos"
              ? value
              : current.grupos,
          lugar:
            field === "lugar"
              ? value
              : current.lugar,
          asignado:
            field === "asignado"
              ? value
              : current.asignado,
        },
        { merge: true }
      );

      setMessage("Sábado actualizado.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo actualizar.");
    } finally {
      setSaving(false);
    }
  };

  const generateThreeMonths = async () => {
    try {
      setSaving(true);
      setMessage("");

      const months = getThreeMonths();

      for (const month of months) {
        const saturdays = getSaturdays(
          month.getFullYear(),
          month.getMonth()
        );

        for (let index = 0; index < saturdays.length; index++) {
          const date = saturdays[index];

          const dateString = dateToString(date);

          const isFirst = index === 0;
          const isLast =
            index === saturdays.length - 1;

          let grupos = "";

          if (isFirst) {
            grupos = "Toda la congregación";
          } else if (isLast) {
            grupos = "Predicación por cada grupo";
          } else {
            grupos = "Grupos 1, 2, 3 y 4";
          }

          const id = `mensual_${dateString}`;

          await setDoc(
            doc(db, "arregloPredicacion", id),
            {
              tipo: "mensual",
              dia: dateString,
              grupos,
              lugar: "",
              asignado: "",
            },
            {
              merge: true,
            }
          );
        }
      }

      setMessage(
        "Se generaron los sábados de los próximos 3 meses."
      );
    } catch (error) {
      console.error(error);
      setMessage(
        "Ocurrió un error generando los sábados."
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteSaturday = async (dateString) => {
    try {
      setSaving(true);

      await deleteDoc(
        doc(
          db,
          "arregloPredicacion",
          `mensual_${dateString}`
        )
      );

      setMessage("Registro eliminado.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo eliminar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <NavbarApp />

      <section className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
            Administración
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Editar arreglo de predicación
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Los cambios se guardan directamente en Firebase.
          </p>
        </div>

        <button
          type="button"
          onClick={generateThreeMonths}
          disabled={saving}
          className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving
            ? "Guardando..."
            : "Generar próximos 3 meses"}
        </button>
      </div>

      {message && (
        <div className="mb-6 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-700">
          {message}
        </div>
      )}

      {/* =========================================
          SEMANA
      ========================================= */}

      <div className="mb-10">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Horario semanal
          </h2>

          <p className="text-sm text-gray-500">
            Edita los horarios de lunes a viernes.
          </p>
        </div>

        <div className="space-y-4">
          {DIAS_SEMANA.map((dia) => {
            const item = getWeekly(dia);

            return (
              <div
                key={dia}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h3 className="mb-4 font-bold text-gray-900">
                  {dia}
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Horario
                    </label>

                    <input
                      type="text"
                      value={item.horario || ""}
                      onChange={(e) =>
                        updateWeekly(
                          dia,
                          "horario",
                          e.target.value
                        )
                      }
                      placeholder="Ej. 8:30"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Lugar
                    </label>

                    <input
                      type="text"
                      value={item.lugar || ""}
                      onChange={(e) =>
                        updateWeekly(
                          dia,
                          "lugar",
                          e.target.value
                        )
                      }
                      placeholder="Lugar"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-500">
                      Asignado
                    </label>

                    <input
                      type="text"
                      value={item.asignado || ""}
                      onChange={(e) =>
                        updateWeekly(
                          dia,
                          "asignado",
                          e.target.value
                        )
                      }
                      placeholder="Nombre"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================
          SÁBADOS
      ========================================= */}

      <div>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            Arreglo de los sábados
          </h2>

          <p className="text-sm text-gray-500">
            Se muestran automáticamente los sábados de los
            próximos tres meses.
          </p>
        </div>

        <div className="space-y-8">
          {getThreeMonths().map((month) => {
            const saturdays = getSaturdays(
              month.getFullYear(),
              month.getMonth()
            );

            return (
              <div key={month.toISOString()}>
                <div className="mb-3 rounded-xl bg-gray-100 px-4 py-3">
                  <h3 className="font-bold text-gray-800">
                    {MESES[month.getMonth()]}{" "}
                    {month.getFullYear()}
                  </h3>
                </div>

                <div className="space-y-4">
                  {saturdays.map((date, index) => {
                    const dateString = dateToString(date);

                    const item =
                      getSaturday(dateString);

                    const isFirst = index === 0;
                    const isLast =
                      index === saturdays.length - 1;

                    return (
                      <div
                        key={dateString}
                        className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
                      >
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-medium text-gray-400">
                              SÁBADO
                            </p>

                            <p className="font-bold text-gray-900">
                              {date.getDate()} de{" "}
                              {MESES[
                                date.getMonth()
                              ]}
                            </p>
                          </div>

                          {(isFirst || isLast) && (
                            <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                              {isFirst
                                ? "Primer sábado"
                                : "Último sábado"}
                            </span>
                          )}
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                          {/* GRUPOS */}

                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                              Grupos / actividad
                            </label>

                            <select
                              value={item.grupos || ""}
                              onChange={(e) =>
                                updateSaturday(
                                  dateString,
                                  "grupos",
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                            >
                              <option value="">
                                Seleccionar...
                              </option>

                              {OPCIONES_GRUPOS.map(
                                (option) => (
                                  <option
                                    key={option}
                                    value={option}
                                  >
                                    {option}
                                  </option>
                                )
                              )}
                            </select>
                          </div>

                          {/* LUGAR */}

                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                              Lugar
                            </label>

                            <input
                              type="text"
                              value={item.lugar || ""}
                              onChange={(e) =>
                                updateSaturday(
                                  dateString,
                                  "lugar",
                                  e.target.value
                                )
                              }
                              placeholder="Lugar"
                              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                            />
                          </div>

                          {/* ASIGNADO */}

                          <div>
                            <label className="mb-1 block text-xs font-medium text-gray-500">
                              Asignado
                            </label>

                            <input
                              type="text"
                              value={item.asignado || ""}
                              onChange={(e) =>
                                updateSaturday(
                                  dateString,
                                  "asignado",
                                  e.target.value
                                )
                              }
                              placeholder="Nombre"
                              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              deleteSaturday(
                                dateString
                              )
                            }
                            className="text-xs font-medium text-red-500 hover:text-red-700"
                          >
                            Eliminar registro
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </section>

      <FooterNavbar />
    </>
  );
}