import { eq, desc, and } from "drizzle-orm";
import { userFitness, gymActivities, gymLeaderboards, users } from "../drizzle/schema";
import { getDb } from "./db";

export async function getUserFitness(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(userFitness)
    .where(eq(userFitness.userId, userId))
    .limit(1);
  return result[0] || null;
}

export async function upsertUserFitness(
  userId: number,
  data: {
    gymName: string;
    gymCity: string;
    bio?: string;
    profilePhotoUrl?: string;
  }
) {
  const db = await getDb();
  if (!db) return null;

  const existing = await getUserFitness(userId);
  if (existing) {
    await db
      .update(userFitness)
      .set(data)
      .where(eq(userFitness.userId, userId));
  } else {
    await db.insert(userFitness).values({
      userId,
      ...data,
    });
  }

  return getUserFitness(userId);
}

export async function addGymActivity(
  userId: number,
  data: {
    activityType: string;
    duration: number;
    caloriesBurned: number;
    notes?: string;
    activityDate: Date;
  }
) {
  const db = await getDb();
  if (!db) return null;

  await db.insert(gymActivities).values({
    userId,
    ...data,
  });

  // Update user fitness stats
  const fitness = await getUserFitness(userId);
  if (fitness) {
    const newTotalWorkouts = fitness.totalWorkouts + 1;
    const newTotalCalories = fitness.totalCaloriesBurned + data.caloriesBurned;

    await db
      .update(userFitness)
      .set({
        totalWorkouts: newTotalWorkouts,
        totalCaloriesBurned: newTotalCalories,
      })
      .where(eq(userFitness.userId, userId));
  }

  return getGymActivities(userId);
}

export async function getGymActivities(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(gymActivities)
    .where(eq(gymActivities.userId, userId))
    .orderBy(desc(gymActivities.activityDate))
    .limit(limit);
}

export async function getGymLeaderboard(gymName: string, gymCity: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      id: gymLeaderboards.id,
      rank: gymLeaderboards.rank,
      totalWorkouts: gymLeaderboards.totalWorkouts,
      totalCaloriesBurned: gymLeaderboards.totalCaloriesBurned,
      streakDays: gymLeaderboards.streakDays,
      userName: users.name,
      userId: users.id,
    })
    .from(gymLeaderboards)
    .innerJoin(users, eq(gymLeaderboards.userId, users.id))
    .where(
      and(
        eq(gymLeaderboards.gymName, gymName),
        eq(gymLeaderboards.gymCity, gymCity)
      )
    )
    .orderBy(gymLeaderboards.rank)
    .limit(limit);
}

export async function updateGymLeaderboard(gymName: string, gymCity: string) {
  const db = await getDb();
  if (!db) return;

  // Get all users in this gym
  const gymUsers = await db
    .select()
    .from(userFitness)
    .where(and(eq(userFitness.gymName, gymName), eq(userFitness.gymCity, gymCity)))
    .orderBy(desc(userFitness.totalCaloriesBurned));

  // Update leaderboard
  for (let i = 0; i < gymUsers.length; i++) {
    const existing = await db
      .select()
      .from(gymLeaderboards)
      .where(eq(gymLeaderboards.userId, gymUsers[i].userId))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(gymLeaderboards)
        .set({
          rank: i + 1,
          totalWorkouts: gymUsers[i].totalWorkouts,
          totalCaloriesBurned: gymUsers[i].totalCaloriesBurned,
          streakDays: gymUsers[i].streakDays,
        })
        .where(eq(gymLeaderboards.userId, gymUsers[i].userId));
    } else {
      await db.insert(gymLeaderboards).values({
        gymName,
        gymCity,
        userId: gymUsers[i].userId,
        rank: i + 1,
        totalWorkouts: gymUsers[i].totalWorkouts,
        totalCaloriesBurned: gymUsers[i].totalCaloriesBurned,
        streakDays: gymUsers[i].streakDays,
      });
    }
  }
}
