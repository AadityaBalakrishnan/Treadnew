"use client";

import { trpc } from "../../lib/trpc";
import Link from "next/link";

export default function ClubsPage() {
  const { data: clubs, isLoading, error } = trpc.getClubs.useQuery();

  if (isLoading) return <div className="container" style={{ padding: "2rem" }}>Loading clubs...</div>;
  if (error) return <div className="container" style={{ padding: "2rem", color: "red" }}>Error: {error.message}</div>;

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <h1>Running Clubs</h1>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", marginTop: "2rem" }}>
        {clubs?.map((club) => (
          <div key={club.id} className="glass-panel" style={{ padding: "1.5rem" }}>
            <h2>{club.name}</h2>
            <p>{club.description}</p>
            <Link href={`/clubs/${club.id}`} style={{ display: "inline-block", marginTop: "1rem", color: "#0070f3" }}>
              View Details &rarr;
            </Link>
          </div>
        ))}
        {(!clubs || clubs.length === 0) && <p>No clubs found.</p>}
      </div>
    </div>
  );
}
