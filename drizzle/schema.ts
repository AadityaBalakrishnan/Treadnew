import {
  boolean,
  decimal,
  float,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "moderator"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Clubs ────────────────────────────────────────────────────────────────────

export const clubs = mysqlTable("clubs", {
  id: int("id").autoincrement().primaryKey(),
  /** URL-safe slug derived from name + city, e.g. "chennai-runners-club" */
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 256 }).notNull(),
  /** Normalised city key, e.g. "chennai", "mumbai" */
  city: varchar("city", { length: 64 }).notNull(),
  /** Display name for city, e.g. "Chennai" */
  cityLabel: varchar("cityLabel", { length: 64 }).notNull(),
  /** Normalised sport key, e.g. "running", "cycling" */
  sport: varchar("sport", { length: 64 }).notNull(),
  /** Display name for sport, e.g. "Running", "Cycling" */
  sportLabel: varchar("sportLabel", { length: 64 }).notNull(),
  description: text("description"),
  shortDescription: varchar("shortDescription", { length: 280 }),
  /** Submission status: pending → approved / rejected */
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  /** Verified badge – set by moderators after manual review */
  verified: boolean("verified").default(false).notNull(),
  /** Whether the club is beginner-friendly */
  beginnerFriendly: boolean("beginnerFriendly").default(false).notNull(),
  pricingType: mysqlEnum("pricingType", ["free", "paid", "donation"]).default("free").notNull(),
  /** Monthly fee in INR, if applicable */
  monthlyFeeInr: int("monthlyFeeInr"),
  /** Primary meeting latitude */
  lat: float("lat"),
  /** Primary meeting longitude */
  lng: float("lng"),
  /** Human-readable address */
  address: text("address"),
  instagramUrl: varchar("instagramUrl", { length: 512 }),
  whatsappUrl: varchar("whatsappUrl", { length: 512 }),
  websiteUrl: varchar("websiteUrl", { length: 512 }),
  /** Cover image URL (stored in S3) */
  coverImageUrl: varchar("coverImageUrl", { length: 1024 }),
  /** Logo image URL (stored in S3) */
  logoUrl: varchar("logoUrl", { length: 1024 }),
  /** User who submitted this club */
  submittedBy: int("submittedBy").references(() => users.id),
  /** User who currently owns/admins this club (after claim approval) */
  ownedBy: int("ownedBy").references(() => users.id),
  /** Moderator note on approval/rejection */
  moderatorNote: text("moderatorNote"),
  /** Total average rating (denormalised for performance) */
  avgRating: decimal("avgRating", { precision: 3, scale: 2 }),
  reviewCount: int("reviewCount").default(0).notNull(),
  /** Page view count (analytics) */
  viewCount: int("viewCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Club = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;

// ─── Sessions (recurring weekly meetups) ─────────────────────────────────────

export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  clubId: int("clubId").notNull().references(() => clubs.id),
  /** 0 = Sunday … 6 = Saturday */
  dayOfWeek: int("dayOfWeek").notNull(),
  /** HH:MM 24-hour format, e.g. "06:00" */
  startTime: varchar("startTime", { length: 8 }).notNull(),
  /** HH:MM 24-hour format */
  endTime: varchar("endTime", { length: 8 }),
  /** Meeting point latitude */
  lat: float("lat"),
  /** Meeting point longitude */
  lng: float("lng"),
  locationName: varchar("locationName", { length: 256 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// ─── Events (one-off open sessions / races / meetups) ─────────────────────────

export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  clubId: int("clubId").notNull().references(() => clubs.id),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  /** UTC Unix timestamp (ms) */
  datetimeUtc: timestamp("datetimeUtc").notNull(),
  /** Whether non-members can join */
  isOpen: boolean("isOpen").default(true).notNull(),
  lat: float("lat"),
  lng: float("lng"),
  locationName: varchar("locationName", { length: 256 }),
  registrationUrl: varchar("registrationUrl", { length: 512 }),
  maxParticipants: int("maxParticipants"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ─── Claims (user requests to own a club) ─────────────────────────────────────

export const claims = mysqlTable("claims", {
  id: int("id").autoincrement().primaryKey(),
  clubId: int("clubId").notNull().references(() => clubs.id),
  userId: int("userId").notNull().references(() => users.id),
  /** Proof text: role in club, contact info, etc. */
  proofText: text("proofText"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  moderatorNote: text("moderatorNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Claim = typeof claims.$inferSelect;
export type InsertClaim = typeof claims.$inferInsert;

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  clubId: int("clubId").notNull().references(() => clubs.id),
  userId: int("userId").notNull().references(() => users.id),
  /** 1–5 star rating */
  rating: int("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// ─── Analytics Events ─────────────────────────────────────────────────────────

export const analyticsEvents = mysqlTable("analyticsEvents", {
  id: int("id").autoincrement().primaryKey(),
  /** "page_view" | "outbound_click" | "search" */
  eventType: varchar("eventType", { length: 64 }).notNull(),
  /** Page path or club slug */
  path: varchar("path", { length: 512 }),
  /** For outbound clicks: "instagram" | "whatsapp" | "website" */
  target: varchar("target", { length: 64 }),
  clubId: int("clubId").references(() => clubs.id),
  userId: int("userId").references(() => users.id),
  /** Anonymous session identifier */
  sessionId: varchar("sessionId", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = typeof analyticsEvents.$inferInsert;


// ─── Fitness Profiles ─────────────────────────────────────────────────────────

export const userFitness = mysqlTable("userFitness", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique().references(() => users.id),
  gymName: varchar("gymName", { length: 256 }).notNull(),
  gymCity: varchar("gymCity", { length: 64 }).notNull(),
  bio: text("bio"),
  profilePhotoUrl: varchar("profilePhotoUrl", { length: 512 }),
  totalWorkouts: int("totalWorkouts").default(0).notNull(),
  totalCaloriesBurned: int("totalCaloriesBurned").default(0).notNull(),
  streakDays: int("streakDays").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserFitness = typeof userFitness.$inferSelect;
export type InsertUserFitness = typeof userFitness.$inferInsert;

// ─── Gym Activities ───────────────────────────────────────────────────────────

export const gymActivities = mysqlTable("gymActivities", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  activityType: varchar("activityType", { length: 64 }).notNull(), // "cardio", "strength", "yoga", "swimming", etc.
  duration: int("duration").notNull(), // in minutes
  caloriesBurned: int("caloriesBurned").notNull(),
  notes: text("notes"),
  activityDate: timestamp("activityDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GymActivity = typeof gymActivities.$inferSelect;
export type InsertGymActivity = typeof gymActivities.$inferInsert;

// ─── Gym Leaderboards ─────────────────────────────────────────────────────────

export const gymLeaderboards = mysqlTable("gymLeaderboards", {
  id: int("id").autoincrement().primaryKey(),
  gymName: varchar("gymName", { length: 256 }).notNull(),
  gymCity: varchar("gymCity", { length: 64 }).notNull(),
  userId: int("userId").notNull().references(() => users.id),
  rank: int("rank").notNull(),
  totalWorkouts: int("totalWorkouts").default(0).notNull(),
  totalCaloriesBurned: int("totalCaloriesBurned").default(0).notNull(),
  streakDays: int("streakDays").default(0).notNull(),
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
});

export type GymLeaderboard = typeof gymLeaderboards.$inferSelect;
export type InsertGymLeaderboard = typeof gymLeaderboards.$inferInsert;
