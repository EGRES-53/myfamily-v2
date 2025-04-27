// src/pages/FileListForEvent.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

interface EventFile {
  id: string;
  event_id: string;
  file_path: string;
  uploaded_at: string;
}

export default function FileListForEvent() {
  /* ───────── routing ───────── */
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  /* ───────── état ──────────── */
  const [files,   setFiles]   = useState<EventFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<string | null>(null);  // ← plein-écran

  /* ───────── fetch au montage / après suppression ───────── */
  useEffect(() => {
    if (!eventId) return;

    (async () => {
      setLoading(true);
      const { data, error } = await supabase
      .from("event_files")
      .select()         // ✅ générique à la bonne place
      .eq("event_id", eventId)
      .order("uploaded_at", { ascending: false })
      .returns<EventFile[]>();
    
    if (!error && data) {              //  ← on vérifie que data n’est pas null
      setFiles(data);                  //  TypeScript est rassuré
    }
    setLoading(false);
    
    })();
  }, [eventId]);

  /* ───────── utilitaires ────── */
  const isImage = (path: string) => /\.(jpe?g|png|gif|webp|bmp)$/i.test(path);

  const publicUrl = (path: string, thumb = false) => {
    const { data } = supabase.storage
      .from("fichiers-evenements")
      .getPublicUrl(path);

    return thumb && isImage(path)
      ? `${data.publicUrl}?width=250`
      : data.publicUrl;
  };

  const handleDelete = async (f: EventFile) => {
    if (!confirm("Supprimer ce fichier ?")) return;

    // 1. Storage
    const { error: sError } = await supabase
      .storage
      .from("fichiers-evenements")
      .remove([f.file_path]);

    // 2. Base
    const { error: dbError } = await supabase
      .from("event_files")
      .delete()
      .eq("id", f.id);

    if (!sError && !dbError) {
      setFiles(prev => prev.filter(x => x.id !== f.id));
      if (preview) setPreview(null);
    } else {
      alert("Erreur lors de la suppression.");
    }
  };

  /* ───────── rendu ──────────── */
  return (
    <>
      {/* bouton + */}
      <button
        onClick={() => navigate(`/event/${eventId}/upload`)}
        className="mb-6 px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-2"
      >
        <span className="text-xl leading-none">＋</span> Ajouter un fichier
      </button>

      {/* loader */}
      {loading && <p className="text-gray-500 italic p-4">Chargement…</p>}

      {/* aucun fichier */}
      {!loading && files.length === 0 && (
        <p className="text-gray-500 p-4">Aucun fichier trouvé.</p>
      )}

      {/* galerie */}
      <div className="gallery">
  {files.map(f => (
    <div key={f.id} className="card group relative">
      {/* miniature ou icône */}
      {isImage(f.file_path) ? (
        <img
          src={publicUrl(f.file_path, true)}
          alt={f.file_path}
          className="cursor-zoom-in"
          onClick={() => setPreview(f.file_path)}
        />
      ) : (
        <div className="placeholder">
          <span role="img" aria-label="file">📄</span>
        </div>
      )}

      {/* corbeille – apparaît au survol */}
      <button
        title="Supprimer"
        onClick={() => handleDelete(f)}
        className="delete-btn group-hover:scale-100"
      >
        🗑️
      </button>

      {/* nom du fichier */}
      <p className="filename">{f.file_path.split('/').pop()}</p>
    </div>
  ))}
</div>


      {/* aperçu plein écran */}
      {preview && (
        <div
          className="lightbox"
          onClick={() => setPreview(null)}
        >
          <img src={publicUrl(preview)} alt="preview" />
        </div>
      )}
    </>
  );
}



