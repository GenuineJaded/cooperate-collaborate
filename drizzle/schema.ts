import {
  bigint,
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Artifacts — the core presences in the field
export const artifacts = mysqlTable("artifacts", {
  id: int("id").autoincrement().primaryKey(),
  nama: varchar("nama", { length: 128 }), // optional Sanskrit name/tag
  body: text("body"), // text content
  fileUrl: text("fileUrl"), // uploaded file URL (gif, image, audio, etc.)
  fileKey: varchar("fileKey", { length: 256 }), // S3 key for the file
  type: mysqlEnum("type", ["writing", "music", "art"]).notNull().default("writing"),
  // Life tracking: base 7 days = 604800 seconds, extended by interactions
  lifeSeconds: bigint("lifeSeconds", { mode: "number" }).notNull().default(604800),
  // Purple shade 0 = white outline (new), 1-7 = deepening purple, 8 = expired
  purpleShade: int("purpleShade").notNull().default(0),
  isExpired: boolean("isExpired").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  // Last interaction timestamp — used to calculate shade advancement
  lastInteractedAt: timestamp("lastInteractedAt").defaultNow().notNull(),
});

export type Artifact = typeof artifacts.$inferSelect;
export type InsertArtifact = typeof artifacts.$inferInsert;

// Quips — responses to artifacts, structurally identical to artifacts
export const quips = mysqlTable("quips", {
  id: int("id").autoincrement().primaryKey(),
  artifactId: int("artifactId").notNull(),
  nama: varchar("nama", { length: 128 }),
  body: text("body"),
  fileUrl: text("fileUrl"),
  fileKey: varchar("fileKey", { length: 256 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Quip = typeof quips.$inferSelect;
export type InsertQuip = typeof quips.$inferInsert;

// Interactions — views and quips that extend artifact life
export const interactions = mysqlTable("interactions", {
  id: int("id").autoincrement().primaryKey(),
  artifactId: int("artifactId").notNull(),
  type: mysqlEnum("type", ["view", "quip"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Interaction = typeof interactions.$inferSelect;

// Intimate Collaborate — ephemeral DM threads scoped to artifact + two sessions
export const intimateThreads = mysqlTable("intimate_threads", {
  id: int("id").autoincrement().primaryKey(),
  artifactId: int("artifactId").notNull(),
  sessionA: varchar("sessionA", { length: 128 }).notNull(),
  sessionB: varchar("sessionB", { length: 128 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const intimateMessages = mysqlTable("intimate_messages", {
  id: int("id").autoincrement().primaryKey(),
  threadId: int("threadId").notNull(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type IntimateThread = typeof intimateThreads.$inferSelect;
export type IntimateMessage = typeof intimateMessages.$inferSelect;
