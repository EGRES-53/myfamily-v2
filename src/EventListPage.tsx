// src/pages/EventListPage.tsx
import { useEffect, useState } from "react";
import { Link }                  from "react-router-dom";
import { supabase }              from "../supabaseClient";

interface Event {
  id: string;
  title: string;
}

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from<Event>("events")
        .select("*")
        .order("title", { ascending: true });

      if (!error && data) setEvents(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="p-6">Chargement…</p>;
  if (events.length === 0) return <p className="p-6">Aucun événement trouvé.</p>;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Vos événements</h1>
      <ul className="space-y-4">
        {events.map(evt => (
          <li key={evt.id}>
            <Link
              to={`/event/${evt.id}/upload`}
              className="text-xl text-blue-600 hover:underline"
            >
              {evt.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

