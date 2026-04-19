"use client";

import { useState } from "react";
import { trpc } from "../../lib/trpc";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();
  const mutation = trpc.createEvent.useMutation({
    onSuccess: () => {
      router.push("/events");
      router.refresh();
    },
  });

  const [formData, setFormData] = useState({
    title: "",
    type: "running" as "running" | "other",
    city: "",
    location: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      ...formData,
      creator_id: "00000000-0000-0000-0000-000000000000", // Hardcoded until auth is re-enabled
    });
  };

  return (
    <div className="container" style={{ padding: "2rem", maxWidth: "600px" }}>
      <h1>Create New Event</h1>
      <div className="glass-panel" style={{ padding: "2rem", marginTop: "2rem" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Event Title</label>
            <input 
              required 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "var(--foreground)", color: "var(--background)", border: "none" }}
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>Event Type</label>
            <select 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "var(--foreground)", color: "var(--background)", border: "none" }}
              value={formData.type} 
              onChange={e => setFormData({...formData, type: e.target.value as "running" | "other"})}
            >
              <option value="running">Running</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>City</label>
            <input 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", background: "var(--foreground)", color: "var(--background)", border: "none" }}
              value={formData.city} 
              onChange={e => setFormData({...formData, city: e.target.value})} 
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ padding: "1rem", marginTop: "1rem", opacity: mutation.isPending ? 0.7 : 1 }}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create Event"}
          </button>
          {mutation.isError && <p style={{ color: "red" }}>Error: {mutation.error.message}</p>}
        </form>
      </div>
    </div>
  );
}
