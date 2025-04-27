// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import UploadToEvent from "./pages/UploadToEvent";
import FileListForEvent from "./pages/FileListForEvent";
import "./App.css";

export default function App() {
  return (
    <Routes>
      {/* téléversement de fichiers */}
      <Route path="/event/:eventId/upload" element={<UploadToEvent />} />

      {/* liste des fichiers */}
      <Route path="/event/:eventId/files" element={<FileListForEvent />} />

      {/* redirige toute autre URL vers /event/1234/upload (exemple) */}
      <Route path="*" element={<Navigate to="/event/1234/upload" replace />} />
    </Routes>
  );
}
