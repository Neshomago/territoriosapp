import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import NavbarApp from "./NavbarApp";
import FooterNavbar from "./FooterNavbar";

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

const DIAS_SEMANA = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
];

const DIAS_CORTOS = [
  "Dom",
  "Lun",
  "Mar",
  "Mié",
  "Jue",
  "Vie",
  "Sáb",
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

function formatDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return {
    dayNumber: date.getDate(),
    dayName: DIAS_CORTOS[date.getDay()],
  };
}

function formatMonth(date) {
  return `${MESES[date.getMonth()]} ${date.getFullYear()}`;
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

export default function PredicacionView() {
  const [weekly, setWeekly] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const weeklyQuery = query(
      collection(db, "arregloPredicacion"),
      where("tipo", "==", "semanal")
    );

    const monthlyQuery = query(
      collection(db, "arregloPredicacion"),
      where("tipo", "==", "mensual")
    );

    const unsubscribeWeekly = onSnapshot(
      weeklyQuery,
      (snapshot) => {
        setWeekly(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );

        setLoading(false);
      },
      (error) => {
        console.error("Error obteniendo horario semanal:", error);
        setLoading(false);
      }
    );

    const unsubscribeMonthly = onSnapshot(
      monthlyQuery,
      (snapshot) => {
        setMonthly(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (error) => {
        console.error("Error obteniendo arreglo mensual:", error);
      }
    );

    return () => {
      unsubscribeWeekly();
      unsubscribeMonthly();
    };
  }, []);

  const months = useMemo(() => getThreeMonths(), []);

  const getWeeklyDay = (day) => {
    return weekly.find((item) => item.dia === day);
  };

  const getSaturdayData = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const dateString = `${year}-${month}-${day}`;

    return monthly.find((item) => item.dia === dateString);
  };

  if (loading) {
    return (
      <>
        <NavbarApp />
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="text-sm text-gray-500">
            Cargando arreglo de predicación...
          </div>
        </div>
        <FooterNavbar />
      </>
    );
  }

  return (
    <>
      <NavbarApp />

      <section className="mx-auto w-full max-w-6xl px-4 py-6">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
          Predicación
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
          Arreglo de predicación
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Horario semanal y arreglo de los próximos tres meses.
        </p>
      </div>

      {/* =========================================
          HORARIO SEMANAL
      ========================================= */}

      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-purple-600" />

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Horario semanal
            </h2>

            <p className="text-sm text-gray-500">
              Lunes a viernes
            </p>
          </div>
        </div>

        {/* Desktop */}
        <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:block">
          <div className="grid grid-cols-4 bg-purple-100 text-sm font-semibold text-purple-900">
            <div className="px-5 py-3">Día</div>
            <div className="px-5 py-3">Horario</div>
            <div className="px-5 py-3">Lugar</div>
            <div className="px-5 py-3">Asignado</div>
          </div>

          {DIAS_SEMANA.map((dia) => {
            const item = getWeeklyDay(dia);

            return (
              <div
                key={dia}
                className="grid grid-cols-4 border-t border-gray-100 text-sm"
              >
                <div className="px-5 py-4 font-semibold text-gray-900">
                  {dia}
                </div>

                <div className="px-5 py-4 text-gray-600">
                  {item?.horario || "—"}
                </div>

                <div className="px-5 py-4 text-gray-600">
                  {item?.lugar || "—"}
                </div>

                <div className="px-5 py-4 font-medium text-gray-800">
                  {item?.asignado || "—"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile */}
        <div className="space-y-3 md:hidden">
          {DIAS_SEMANA.map((dia) => {
            const item = getWeeklyDay(dia);

            return (
              <div
                key={dia}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">
                    {dia}
                  </h3>

                  <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                    {item?.horario || "—"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-400">
                      Lugar
                    </p>

                    <p className="mt-1 font-medium text-gray-700">
                      {item?.lugar || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Asignado
                    </p>

                    <p className="mt-1 font-medium text-gray-700">
                      {item?.asignado || "—"}
                    </p>
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
        <div className="mb-4 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-purple-600" />

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Arreglo por sábado
            </h2>

            <p className="text-sm text-gray-500">
              Próximos tres meses
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {months.map((month) => {
            const saturdays = getSaturdays(
              month.getFullYear(),
              month.getMonth()
            );

            return (
              <div key={formatMonth(month)}>
                {/* Month */}
                <div className="mb-3 rounded-xl bg-gray-100 px-4 py-3">
                  <h3 className="font-bold text-gray-800">
                    {formatMonth(month)}
                  </h3>
                </div>

                <div className="space-y-3">
                  {saturdays.map((date, index) => {
                    const year = date.getFullYear();

                    const monthNumber = String(
                      date.getMonth() + 1
                    ).padStart(2, "0");

                    const dayNumber = String(
                      date.getDate()
                    ).padStart(2, "0");

                    const dateString = `${year}-${monthNumber}-${dayNumber}`;

                    const item = getSaturdayData(date);

                    const formatted = formatDate(dateString);

                    return (
                      <div
                        key={dateString}
                        className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row">
                          {/* Date */}
                          <div className="flex min-w-[120px] items-center gap-3 bg-purple-100 px-5 py-4 sm:flex-col sm:justify-center sm:gap-0">
                            <span className="text-xs font-semibold uppercase text-purple-600">
                              {formatted.dayName}
                            </span>

                            <span className="text-2xl font-bold text-purple-900">
                              {formatted.dayNumber}
                            </span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 p-4 sm:p-5">
                            <div className="mb-2">
                              <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                {item?.grupos || "Sin asignar"}
                              </span>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <p className="text-xs text-gray-400">
                                  Lugar
                                </p>

                                <p className="mt-1 font-medium text-gray-800">
                                  {item?.lugar || "—"}
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400">
                                  Asignado
                                </p>

                                <p className="mt-1 font-medium text-gray-800">
                                  {item?.asignado || "—"}
                                </p>
                              </div>
                            </div>
                          </div>
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