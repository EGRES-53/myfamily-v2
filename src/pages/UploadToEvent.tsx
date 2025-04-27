// src/pages/UploadToEvent.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../supabaseClient";

/* ------------------------------------------------------------------
   utilitaire : « slugifie » un nom de fichier pour éviter les caractères
   exotiques (accents, espaces, etc.) dans la clé du bucket
-------------------------------------------------------------------*/
const slugify = (name: string) =>
  name
    .normalize("NFD")                 // décompose les accents
    .replace(/[\u0300-\u036f]/g, "")  // retire les diacritiques
    .replace(/[^A-Za-z0-9._-]/g, "_") // remplace le reste par « _ »
    .toLowerCase();

export default function UploadToEvent() {
  /* id de l’événement récupéré depuis l’URL  /event/:eventId/upload */
  const { eventId } = useParams<{ eventId: string }>();

  const [file,        setFile]        = useState<File | null>(null);
  const [uploading,   setUploading]   = useState(false);
  const [message,     setMessage]     = useState("");

  /* -------------------------------------------------------------
     téléversement + enregistrement dans la table `event_files`
  ----------------------------------------------------------------*/
  const handleUpload = async () => {
    if (!file || !eventId) return;     // garde-fou

    setUploading(true);
    setMessage("");

    /* on fabrique une clé de stockage “propre” */
    const safeName = slugify(file.name);
    const filePath = `${eventId}/${Date.now()}-${safeName}`;

    /* 1️⃣  upload dans le bucket Supabase Storage */
    const { error: uploadError } = await supabase.storage
      .from("fichiers-evenements")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      setMessage("❌  Erreur lors du téléversement.");
      setUploading(false);
      return;
    }

    /* 2️⃣  enregistrement du chemin dans la table `event_files` */
    const { error: dbError } = await supabase
      .from("event_files")
      .insert([{ event_id: eventId, file_path: filePath }]);

    if (dbError) {
      console.error("Insert DB error:", dbError);
      setMessage("⚠️  Fichier téléversé mais non enregistré en base.");
    } else {
      setMessage("✅  Fichier téléversé et enregistré !");
      setFile(null);                  // on réinitialise le champ
    }

    setUploading(false);
  };

  return (
    <div className="max-w-lg mx-auto py-12 text-center">
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
        className="px-6 py-3 rounded bg-blue-600 text-white disabled:opacity-40"
      >
        {uploading ? "Téléversement en cours…" : "Téléverser"}
      </button>

      {message && <p className="mt-6 text-lg">{message}</p>}
    </div>
  );
}
