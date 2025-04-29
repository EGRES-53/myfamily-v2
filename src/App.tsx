// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EventListPage      from "./pages/EventListPage";
import UploadToEvent      from "./pages/UploadToEvent";
import FileListForEvent   from "./pages/FileListForEvent";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* page d’accueil */}
        <Route path="/" element={<EventListPage />} />

        {/* téléversement */}
        <Route path="/event/:eventId/upload" element={<UploadToEvent />} />

        {/* galerie */}
        <Route path="/event/:eventId/files" element={<FileListForEvent />} />

        {/* toute autre URL → page d’accueil */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
