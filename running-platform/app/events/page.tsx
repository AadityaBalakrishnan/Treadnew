"use client";

import { trpc } from "../../lib/trpc";

export default function EventsPage() {
  const { data: events, isLoading, error } = trpc.getEvents.useQuery();

  if (isLoading) return <div className="container" style={{ padding: "2rem" }}>Loading events...</div>;
  if (error) return <div className="container" style={{ padding: "2rem", color: "red" }}>Error: {error.message}</div>;

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h1>Upcoming Runs & Events</h1>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", marginTop: "2rem" }}>
        {events?.map((evt) => (
          <div key={evt.id} className="glass-panel" style={{ padding: "1.5rem" }}>
            <h2>{evt.title}</h2>
            <div style={{ margin: "0.5rem 0", display: "flex", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.875rem", padding: "0.2rem 0.5rem", background: "rgba(0,100,250,0.2)", borderRadius: "4px" }}>{evt.type}</span>
              {evt.city && <span style={{ fontSize: "0.875rem", padding: "0.2rem 0.5rem", background: "rgba(255,255,255,0.1)", borderRadius: "4px" }}>📍 {evt.city}</span>}
            </div>
          </div>
        ))}
        {(!events || events.length === 0) && <p>No events found.</p>}
      </div>
    </div>
  );
}
