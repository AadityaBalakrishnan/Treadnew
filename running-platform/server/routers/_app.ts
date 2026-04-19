import { router, publicProcedure } from "../trpc";
import { z } from "zod";
import { supabase } from "../../lib/supabase";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: "ok", timestamp: new Date() };
  }),

  // Fetch all clubs
  getClubs: publicProcedure.query(async () => {
    const { data, error } = await supabase.from("clubs").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }),

  // Fetch all events
  getEvents: publicProcedure.query(async () => {
    const { data, error } = await supabase.from("events").select("*");
    if (error) {
      throw new Error(error.message);
    }
    return data;
  }),

  // Fetch a single club by ID
  getClubById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("id", input.id)
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),

  // Create an event
  createEvent: publicProcedure
    .input(
      z.object({
        title: z.string().min(3),
        type: z.enum(["running", "other"]),
        city: z.string().optional(),
        location: z.string().optional(),
        club_id: z.string().optional(),
        creator_id: z.string(), // normally taken from auth ctx
        date: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // In a real app we derive creator_id from ctx.user.id
      const { data, error } = await supabase.from("events").insert([input]).select("*").single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    }),
});

export type AppRouter = typeof appRouter;
