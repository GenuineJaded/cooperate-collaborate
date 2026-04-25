import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Artifact,
  InsertArtifact,
  InsertUser,
  artifacts,
  interactions,
  intimateMessages,
  intimateThreads,
  quips,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Artifacts ───────────────────────────────────────────────────────────────

export async function createArtifact(data: InsertArtifact) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const [result] = await db.insert(artifacts).values({
    ...data,
    lifeSeconds: 604800, // 7 days base
    purpleShade: 0,
    isExpired: false,
    lastInteractedAt: new Date(),
  });
  return result;
}

export async function listArtifacts(type?: "writing" | "music" | "art") {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(artifacts.isExpired, false)];
  if (type) conditions.push(eq(artifacts.type, type));
  return db
    .select()
    .from(artifacts)
    .where(and(...conditions))
    .orderBy(sql`${artifacts.purpleShade} DESC, ${artifacts.createdAt} DESC`);
}

export async function getArtifactById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(artifacts).where(eq(artifacts.id, id)).limit(1);
  return result[0];
}

// Record a view: extend life by 6 hours (21600 seconds), update lastInteractedAt
export async function recordView(artifactId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(interactions).values({ artifactId, type: "view" });
  await db
    .update(artifacts)
    .set({
      lifeSeconds: sql`${artifacts.lifeSeconds} + 21600`,
      lastInteractedAt: new Date(),
    })
    .where(and(eq(artifacts.id, artifactId), eq(artifacts.isExpired, false)));
}

// Record a quip: extend life by 18 hours (64800 seconds), update lastInteractedAt
export async function recordQuipInteraction(artifactId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(interactions).values({ artifactId, type: "quip" });
  await db
    .update(artifacts)
    .set({
      lifeSeconds: sql`${artifacts.lifeSeconds} + 64800`,
      lastInteractedAt: new Date(),
    })
    .where(and(eq(artifacts.id, artifactId), eq(artifacts.isExpired, false)));
}

// ─── Decay ───────────────────────────────────────────────────────────────────

// Calculate purple shade: each shade = 18 hours (64800s) of inactivity from lastInteractedAt
// Shade 0 = white (new/active), 1-7 = deepening purple, expire at 7 days total
export function calculateShade(artifact: Artifact): number {
  const now = Date.now();
  const lastInteraction = artifact.lastInteractedAt.getTime();
  const inactiveSeconds = (now - lastInteraction) / 1000;
  const shade = Math.min(7, Math.floor(inactiveSeconds / 64800));
  return shade;
}

export async function runDecay() {
  const db = await getDb();
  if (!db) return { expired: 0, updated: 0 };

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Find artifacts that have exceeded their lifespan
  const expired = await db
    .select({ id: artifacts.id })
    .from(artifacts)
    .where(
      and(
        eq(artifacts.isExpired, false),
        sql`DATE_ADD(${artifacts.createdAt}, INTERVAL ${artifacts.lifeSeconds} SECOND) < NOW()`
      )
    );

  let expiredCount = 0;
  for (const a of expired) {
    // Delete related data first, then the artifact (compost — unseen)
    await db.delete(interactions).where(eq(interactions.artifactId, a.id));
    await db.delete(quips).where(eq(quips.artifactId, a.id));
    await db.delete(intimateMessages)
      .where(
        sql`${intimateMessages.threadId} IN (
          SELECT id FROM intimate_threads WHERE artifactId = ${a.id}
        )`
      );
    await db.delete(intimateThreads).where(eq(intimateThreads.artifactId, a.id));
    await db.delete(artifacts).where(eq(artifacts.id, a.id));
    expiredCount++;
  }

  // Update purple shades for remaining active artifacts
  const active = await db
    .select()
    .from(artifacts)
    .where(eq(artifacts.isExpired, false));

  let updated = 0;
  for (const artifact of active) {
    const shade = calculateShade(artifact);
    if (shade !== artifact.purpleShade) {
      await db
        .update(artifacts)
        .set({ purpleShade: shade })
        .where(eq(artifacts.id, artifact.id));
      updated++;
    }
  }

  return { expired: expiredCount, updated };
}

// ─── Quips ───────────────────────────────────────────────────────────────────

export async function createQuip(data: {
  artifactId: number;
  nama?: string;
  body?: string;
  fileUrl?: string;
  fileKey?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const [result] = await db.insert(quips).values(data);
  await recordQuipInteraction(data.artifactId);
  return result;
}

export async function listQuips(artifactId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(quips)
    .where(eq(quips.artifactId, artifactId))
    .orderBy(quips.createdAt);
}

// ─── Intimate Collaborate ─────────────────────────────────────────────────────

export async function getOrCreateThread(artifactId: number, sessionId: string) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");

  // Find existing thread where this session is either A or B
  const existing = await db
    .select()
    .from(intimateThreads)
    .where(
      and(
        eq(intimateThreads.artifactId, artifactId),
        sql`(${intimateThreads.sessionA} = ${sessionId} OR ${intimateThreads.sessionB} = ${sessionId})`
      )
    )
    .limit(1);

  if (existing.length > 0) return existing[0];

  // Find an open thread (sessionB is null) for this artifact to join
  const open = await db
    .select()
    .from(intimateThreads)
    .where(
      and(
        eq(intimateThreads.artifactId, artifactId),
        sql`${intimateThreads.sessionB} IS NULL`
      )
    )
    .limit(1);

  if (open.length > 0) {
    await db
      .update(intimateThreads)
      .set({ sessionB: sessionId })
      .where(eq(intimateThreads.id, open[0].id));
    return { ...open[0], sessionB: sessionId };
  }

  // Create a new thread
  await db.insert(intimateThreads).values({ artifactId, sessionA: sessionId });
  const created = await db
    .select()
    .from(intimateThreads)
    .where(
      and(
        eq(intimateThreads.artifactId, artifactId),
        eq(intimateThreads.sessionA, sessionId)
      )
    )
    .limit(1);
  return created[0];
}

export async function addIntimateMessage(
  threadId: number,
  sessionId: string,
  body: string
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(intimateMessages).values({ threadId, sessionId, body });
}

export async function getIntimateMessages(threadId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(intimateMessages)
    .where(eq(intimateMessages.threadId, threadId))
    .orderBy(intimateMessages.createdAt);
}
