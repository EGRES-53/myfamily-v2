// src/pages/FileListForEvent.tsx
import { useEffect, useState } from "react";
import { useParams, Link }     from "react-router-dom";
import { supabase }             from "../supabaseClient";

interface EventFile {
  id: number;
  name: string;
  bucket_path: string;
  uploaded_at: string;
}

export default function FileListForEvent() {
  const { eventId } = useParams<{ eventId: string }>();
  const [files, setFiles] = useState<EventFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      const { data, error } = await supabase
        .from<EventFile>("event_files")
        .select("*")
        .eq("event_id", eventId)
        .order("uploaded_at", { ascending: false });

      if (!error && data) setFiles(data);
      setLoading(false);
    })();
  }, [eventId]);

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="mb-6">
        <Link to={`/event/${eventId}/upload`} className="text-sm text-blue-600 hover:underline">
          ← Ajouter un nouveau fichier
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Galerie de l’événement</h1>

      {loading && <p>Chargement des fichiers…</p>}
      {!loading && files.length === 0 && <p>Aucun fichier pour cet événement.</p>}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {files.map(f => (
          <div key={f.id} className="border rounded p-2 text-center">
            <div className="mb-2 font-medium">{f.name}</div>
            <img
              src={supabase.storage
                .from(import.meta.env.VITE_SUPABASE_BUCKET!)
                .getPublicUrl(f.bucket_path)
                .publicURL}
              alt={f.name}
              className="w-full h-32 object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}





