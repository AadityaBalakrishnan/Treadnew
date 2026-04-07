import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { analyticsRouter } from "./routers/analytics";
import { claimsRouter } from "./routers/claims";
import { clubsRouter } from "./routers/clubs";
import { eventsRouter } from "./routers/events";
import { reviewsRouter } from "./routers/reviews";
import { sessionsRouter } from "./routers/sessions";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  clubs: clubsRouter,
  sessions: sessionsRouter,
  events: eventsRouter,
  claims: claimsRouter,
  reviews: reviewsRouter,
  analytics: analyticsRouter,
});

export type AppRouter = typeof appRouter;
