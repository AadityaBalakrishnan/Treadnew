import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getUserFitness,
  upsertUserFitness,
  addGymActivity,
  getGymActivities,
  getGymLeaderboard,
  updateGymLeaderboard,
} from "../fitness-db";

export const fitnessRouter = router({
  // Get or create user fitness profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    return getUserFitness(ctx.user.id);
  }),

  // Update fitness profile
  updateProfile: protectedProcedure
    .input(
      z.object({
        gymName: z.string().min(1, "Gym name required"),
        gymCity: z.string().min(1, "City required"),
        bio: z.string().optional(),
        profilePhotoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await upsertUserFitness(ctx.user.id, input);
      if (result) {
        await updateGymLeaderboard(input.gymName, input.gymCity);
      }
      return result;
    }),

  // Log a gym activity
  logActivity: protectedProcedure
    .input(
      z.object({
        activityType: z.string().min(1),
        duration: z.number().int().positive(),
        caloriesBurned: z.number().int().positive(),
        notes: z.string().optional(),
        activityDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const activities = await addGymActivity(ctx.user.id, input);
      // Update leaderboard after adding activity
      const profile = await getUserFitness(ctx.user.id);
      if (profile) {
        await updateGymLeaderboard(profile.gymName, profile.gymCity);
      }
      return activities;
    }),

  // Get user's activity history
  getActivities: protectedProcedure
    .input(z.object({ limit: z.number().default(50) }).optional())
    .query(async ({ ctx, input }) => {
      return getGymActivities(ctx.user.id, input?.limit);
    }),

  // Get gym leaderboard
  getLeaderboard: publicProcedure
    .input(
      z.object({
        gymName: z.string().min(1),
        gymCity: z.string().min(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ input }) => {
      return getGymLeaderboard(input.gymName, input.gymCity, input.limit);
    }),
});
