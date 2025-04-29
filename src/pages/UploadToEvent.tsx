// src/pages/UploadToEvent.tsx
import { useParams, Link } from "react-router-dom";
import { useState }        from "react";
import { supabase }        from "../supabaseClient";

const slugify = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9._-]/g, "_")
    .toLowerCase();

export default function UploadToEvent() {
  const { eventId } = useParams<{ eventId: string }>();
  const [file, setFile]       = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!file || !eventId) return;
    setUploading(true);

    const fileName = `${eventId}/${Date.now()}_${slugify(file.name)}`;
    const { error: upErr } = await supabase.storage
      .from(import.meta.env.VITE_SUPABASE_BUCKET!)
      .upload(fileName, file);

    if (upErr) {
      setMessage(`❌ Erreur upload: ${upErr.message}`);
      setUploading(false);
      return;
    }

    const { error: dbErr } = await supabase
      .from("event_files")
      .insert({ event_id: eventId, name: file.name, bucket_path: fileName });

    if (dbErr) {
      setMessage(`❌ Erreur base: ${dbErr.message}`);
    } else {
      setMessage(`✅ Fichier téléversé et enregistré !`);
      setFile(null);
    }

    setUploading(false);
  };

  return (
    <>
      <div className="max-w-lg mx-auto py-12">
        <div className="mb-6">
          <Link
            to={`/event/${eventId}/files`}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Retour à la galerie
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-8">
          Ajouter un fichier à l’événement
        </h1>

        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="mb-6"
        />

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="px-6 py-3 rounded bg-blue-600 text-white disabled:opacity-50 mb-4"
        >
          {uploading ? "Téléversement en cours…" : "Téléverser"}
        </button>

        {message && <p className="mt-6 text-lg">{message}</p>}
      </div>
    </>
  );
}


