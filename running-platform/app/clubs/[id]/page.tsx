"use client";

import { trpc } from "../../../lib/trpc";
import { useParams } from "next/navigation";

export default function ClubDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: club, isLoading, error } = trpc.getClubById.useQuery({ id }, { enabled: !!id });

  if (isLoading) return <div className="container" style={{ padding: "2rem" }}>Loading club details...</div>;
  if (error || !club) return <div className="container" style={{ padding: "2rem", color: "red" }}>Error loading club or not found.</div>;

  return (
    <div className="container" style={{ padding: "2rem" }}>
      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <h1>{club.name}</h1>
        <p style={{ marginTop: "1rem", fontSize: "1.1rem", opacity: 0.8 }}>{club.description || "No description provided."}</p>
        <div style={{ marginTop: "2rem" }}>
          <span style={{ padding: "0.25rem 0.75rem", background: "rgba(255,255,255,0.1)", borderRadius: "99px", fontSize: "0.875rem" }}>
            {club.is_private ? "Private Club" : "Public Club"}
          </span>
        </div>
      </div>
      
      <h2>Upcoming Events managed by this club</h2>
      <p style={{ opacity: 0.6 }}>To be dynamically fetched...</p>
    </div>
  );
}
