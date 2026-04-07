import { getDb } from "../server/db";
import { clubs, events } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const CHENNAI_DISTRICTS = {
  "cloka": "Besant Nagar, Chennai",
  "pace-and-blaze": "T. Nagar, Chennai",
  "vamos": "Adyar, Chennai",
  "voko": "Mylapore, Chennai",
  "styd": "Velachery, Chennai",
  "batclub": "Nungambakkam, Chennai",
  "project-vanta": "Thiruvanmiyur, Chennai",
  "vault-club": "Kilpauk, Chennai",
  "fitrx": "Egmore, Chennai",
};

async function updateChennaiClubs() {
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    return;
  }

  try {
    console.log("Updating Chennai clubs with specific districts...");

    for (const [slug, address] of Object.entries(CHENNAI_DISTRICTS)) {
      await db
        .update(clubs)
        .set({ address })
        .where(eq(clubs.slug, slug));
      console.log(`✓ Updated ${slug} to ${address}`);
    }

    // Update event dates to be spread across March 2026
    const clubSlugs = Object.keys(CHENNAI_DISTRICTS);
    const baseDates = [
      new Date(2026, 2, 14), // March 14
      new Date(2026, 2, 21), // March 21
      new Date(2026, 2, 28), // March 28
    ];

    for (let i = 0; i < clubSlugs.length; i++) {
      const slug = clubSlugs[i];
      const [club] = await db
        .select({ id: clubs.id })
        .from(clubs)
        .where(eq(clubs.slug, slug));

      if (club) {
        const eventDate = new Date(baseDates[i % baseDates.length]);
        eventDate.setHours(6, 0, 0, 0);

        // Update first event
        const [event] = await db
          .select({ id: events.id })
          .from(events)
          .where(eq(events.clubId, club.id))
          .limit(1);

        if (event) {
          await db
            .update(events)
            .set({ datetimeUtc: eventDate })
            .where(eq(events.id, event.id));
          console.log(`✓ Updated event for ${slug} to ${eventDate.toDateString()}`);
        }
      }
    }

    console.log("\n✅ Successfully updated all Chennai clubs!");
  } catch (error) {
    console.error("Error updating clubs:", error);
    throw error;
  }
}

updateChennaiClubs();
