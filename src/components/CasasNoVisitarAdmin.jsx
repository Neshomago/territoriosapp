import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import { db, storage, COLLECTIONS } from "./firebase";
import { territorios } from "./utils/_utils";
import NavbarApp from "./NavbarApp";
import FooterNavbar from "./FooterNavbar";
import ImagePreviewModal from "./ImagePreviewModal";

// Registros que vivían hardcodeados en Home.jsx. Se importan una sola vez
// (ver `importarRegistrosAntiguos`) con los campos de vínculo a territorio
// en blanco, porque "etapa"/"mz" es una numeración distinta a la que usa
// el modelo actual de grupo/territorio/manzana y no se puede mapear sola.
const LEGACY_CASAS = [
  { etapa: "4ta", mz: "EC", villa: "6", ref: "Al lado del hno. Otto", fecha: "08-Jul-2025" },
  { etapa: "4ta", mz: "DP", villa: "6 o 12", ref: "Tercera casa a la izquierda de la villa 9", fecha: "19-Jul-2025" },
  { etapa: "4ta", mz: "DC", villa: "2", ref: "No tocar timbre", fecha: "07-Jul-2025" },
  { etapa: "4ta", mz: "FO", villa: "??", ref: "Techo rojo al lado de hna Norika", fecha: "16-Jul-2025" },
  { etapa: "4ta", mz: "DC", villa: "11", ref: "Perro guardián en entrada", fecha: "02-Ago-2025" },
  { etapa: "4ta", mz: "DM", villa: "6", ref: "Solicita no ser visitado", fecha: "06-Ago-2025" },
  { etapa: "4ta", mz: "FL", villa: "6", ref: "Hablan inglés únicamente", fecha: "06-Ago-2025" },
  { etapa: "5ta", mz: "CX", villa: "2", ref: "Horario especial tarde", fecha: "02-Ago-2025" },
  { etapa: "9na", mz: "934", villa: "1", ref: "Frente al parque central", fecha: "26-Jul-2025" },
  { etapa: "9na", mz: "928", villa: "15", ref: "Portón negro", fecha: "02-Ago-2025" },
  { etapa: "5ta", mz: "IF", villa: "9", ref: "No desea lo visiten", fecha: "15-Ago-2026" },
  { etapa: "9na", mz: "19", villa: "3", ref: "No desea ser visitado", fecha: "29-Nov-2026" },
  { etapa: "9na", mz: "20", villa: "7", ref: "No desea ser visitado", fecha: "29-Nov-2026" },
  { etapa: "9na", mz: "21", villa: "23", ref: "No desea ser visitado", fecha: "29-Nov-2026" },
  { etapa: "9na", mz: "913", villa: "19", ref: "Edificio departamentos", fecha: "3-Ene-2026" },
  { etapa: "5ta", mz: "IG", villa: "8", ref: "No desea lo visiten", fecha: "15-Ago-2026" },
  { etapa: "11va", mz: "28", villa: "9 y 10", ref: "Atrás de la hermana Zúñiga", fecha: "16-Abr-2026" },
  { etapa: "9na", mz: "948", villa: "4", ref: "No desea ser visitado", fecha: "07-Jul-2026" },
  { etapa: "5ta", mz: "IE", villa: "1", ref: "No desea lo visiten", fecha: "15-Ago-2026" },
];

const GRUPOS = Object.keys(territorios);

const emptyForm = {
  etapa: "",
  mz: "",
  villa: "",
  ref: "",
  fecha: "",
  grupo: "",
  territorioKey: "",
  manzanaName: "",
  imagenUrl: "",
};

function getUbicacion(casa) {
  if (casa.grupo && casa.territorioKey && casa.manzanaName) {
    return `${casa.grupo} · ${casa.manzanaName}`;
  }
  if (casa.etapa) {
    return `Etapa ${casa.etapa} · Mz ${casa.mz || "?"}`;
  }
  return "Sin ubicar";
}

export default function CasasNoVisitarAdmin() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [territorioOptions, setTerritorioOptions] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, COLLECTIONS.CASAS_NO_VISITAR),
      (snapshot) => {
        setCasas(snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })));
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsubscribe();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setTerritorioOptions({});
  };

  const loadTerritorioOptions = async (grupo) => {
    if (!grupo) {
      setTerritorioOptions({});
      return;
    }

    try {
      const snap = await getDoc(doc(db, COLLECTIONS.TERRITORIES, grupo));
      const area = snap.exists()
        ? snap.data()?.mapa?.area
        : territorios[grupo]?.mapa?.area;
      setTerritorioOptions(area || {});
    } catch (error) {
      console.error(error);
      setTerritorioOptions(territorios[grupo]?.mapa?.area || {});
    }
  };

  const handleGrupoChange = async (grupo) => {
    setForm((prev) => ({ ...prev, grupo, territorioKey: "", manzanaName: "" }));
    await loadTerritorioOptions(grupo);
  };

  const handleTerritorioChange = (territorioKey) => {
    setForm((prev) => ({ ...prev, territorioKey, manzanaName: "" }));
  };

  const manzanaOptions = form.territorioKey
    ? territorioOptions[form.territorioKey]?.manzanas || []
    : [];

  const handleEdit = async (casa) => {
    setEditingId(casa.id);
    setForm({
      etapa: casa.etapa || "",
      mz: casa.mz || "",
      villa: casa.villa || "",
      ref: casa.ref || "",
      fecha: casa.fecha || "",
      grupo: casa.grupo || "",
      territorioKey: casa.territorioKey || "",
      manzanaName: casa.manzanaName || "",
      imagenUrl: casa.imagenUrl || "",
    });
    setSelectedFile(null);

    if (casa.grupo) {
      await loadTerritorioOptions(casa.grupo);
    }
  };

  const handleDelete = async (casa) => {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CASAS_NO_VISITAR, casa.id));

      if (casa.imagenUrl) {
        deleteObject(storageRef(storage, `casas_no_visitar/${casa.id}.jpg`)).catch(
          () => {}
        );
      }

      setMessage("Registro eliminado.");
    } catch (error) {
      console.error(error);
      setMessage("No se pudo eliminar el registro.");
    }
  };

  const uploadImage = async (file, casaId) => {
    const compressed = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
    });

    const fileRef = storageRef(storage, `casas_no_visitar/${casaId}.jpg`);
    await uploadBytes(fileRef, compressed);
    return getDownloadURL(fileRef);
  };

  const handleSave = async () => {
    if (!form.villa.trim()) {
      setMessage("La villa es obligatoria.");
      return;
    }

    try {
      setSaving(true);

      const casaId = editingId || doc(collection(db, COLLECTIONS.CASAS_NO_VISITAR)).id;
      let imagenUrl = form.imagenUrl;

      if (selectedFile) {
        setUploading(true);
        imagenUrl = await uploadImage(selectedFile, casaId);
        setUploading(false);
      }

      await setDoc(
        doc(db, COLLECTIONS.CASAS_NO_VISITAR, casaId),
        { ...form, imagenUrl },
        { merge: true }
      );

      setMessage(editingId ? "Registro actualizado." : "Registro creado.");
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("No se pudo guardar el registro.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const importarRegistrosAntiguos = async () => {
    try {
      setSaving(true);

      const batch = writeBatch(db);

      LEGACY_CASAS.forEach((legacyCasa) => {
        const newDocRef = doc(collection(db, COLLECTIONS.CASAS_NO_VISITAR));
        batch.set(newDocRef, {
          ...legacyCasa,
          grupo: "",
          territorioKey: "",
          manzanaName: "",
          imagenUrl: "",
        });
      });

      await batch.commit();
      setMessage(`Se importaron ${LEGACY_CASAS.length} registros antiguos.`);
    } catch (error) {
      console.error(error);
      setMessage("No se pudo importar los registros antiguos.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <NavbarApp />

      <section className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-purple-600">
            Administración
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Casas no visitar
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Visible para todos en el dashboard; esta página es donde se
            gestiona la información y las fotos.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-700">
            {message}
          </div>
        )}

        {!loading && casas.length === 0 && (
          <div className="mb-6 rounded-xl border border-dashed border-purple-300 bg-purple-50/50 p-4">
            <p className="mb-2 text-sm text-gray-700">
              No hay registros todavía. Puedes importar los 19 registros
              antiguos (sin territorio vinculado, para asignarlo después
              editando cada uno) o crear uno nuevo abajo.
            </p>
            <button
              type="button"
              onClick={importarRegistrosAntiguos}
              disabled={saving}
              className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Importar registros antiguos
            </button>
          </div>
        )}

        {/* =========================================
            FORMULARIO
        ========================================= */}

        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            {editingId ? "Editar registro" : "Nuevo registro"}
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Grupo
              </label>
              <select
                value={form.grupo}
                onChange={(e) => handleGrupoChange(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >
                <option value="">Sin grupo</option>
                {GRUPOS.map((grupo) => (
                  <option key={grupo} value={grupo}>
                    {grupo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Territorio
              </label>
              <select
                value={form.territorioKey}
                onChange={(e) => handleTerritorioChange(e.target.value)}
                disabled={!form.grupo}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Sin territorio</option>
                {Object.entries(territorioOptions).map(([key, data]) => (
                  <option key={key} value={key}>
                    {data.name || key}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Manzana
              </label>
              <select
                value={form.manzanaName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, manzanaName: e.target.value }))
                }
                disabled={!form.territorioKey}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">Sin manzana</option>
                {manzanaOptions.map((manzana) => (
                  <option key={manzana.name} value={manzana.name}>
                    {manzana.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Villa
              </label>
              <input
                type="text"
                value={form.villa}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, villa: e.target.value }))
                }
                placeholder="Ej. 6"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Referencia / motivo
              </label>
              <input
                type="text"
                value={form.ref}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, ref: e.target.value }))
                }
                placeholder="Ej. No desea ser visitado"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Fecha
              </label>
              <input
                type="text"
                value={form.fecha}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, fecha: e.target.value }))
                }
                placeholder="Ej. 28-Sep-2026"
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Foto
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
              {form.imagenUrl && !selectedFile && (
                <p className="mt-1 text-xs text-gray-500">
                  Ya tiene una foto guardada; elige otra solo si quieres reemplazarla.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Subiendo foto..." : saving ? "Guardando..." : "Guardar"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>

        {/* =========================================
            LISTA
        ========================================= */}

        <div>
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Registros ({casas.length})
          </h2>

          {loading ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : casas.length === 0 ? (
            <p className="text-sm text-gray-500">Todavía no hay registros.</p>
          ) : (
            <div className="space-y-2">
              {casas.map((casa) => (
                <div
                  key={casa.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3"
                >
                  <div className="flex items-center gap-3">
                    {casa.imagenUrl ? (
                      <button
                        type="button"
                        onClick={() => setPreviewImage(casa.imagenUrl)}
                      >
                        <img
                          src={casa.imagenUrl}
                          alt="Foto de la casa"
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      </button>
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-gray-100" />
                    )}

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {getUbicacion(casa)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Villa {casa.villa || "?"} · {casa.ref || "Sin motivo"} ·{" "}
                        {casa.fecha || "Sin fecha"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleEdit(casa)}
                      className="text-xs font-medium text-purple-600 hover:text-purple-800"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(casa)}
                      className="text-xs font-medium text-red-500 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FooterNavbar />

      <ImagePreviewModal
        imageUrl={previewImage}
        onClose={() => setPreviewImage(null)}
      />
    </>
  );
}
