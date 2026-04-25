import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  addIntimateMessage,
  createArtifact,
  createQuip,
  getArtifactById,
  getIntimateMessages,
  getOrCreateThread,
  listArtifacts,
  listQuips,
  recordView,
  runDecay,
} from "./db";
import { storagePut } from "./storage";
import { z } from "zod";
import { scheduledRouter } from "./routers/scheduled";
import { nanoid } from "nanoid";

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

  artifact: router({
    list: publicProcedure
      .input(
        z.object({
          type: z.enum(["writing", "music", "art"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return listArtifacts(input.type);
      }),

    get: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getArtifactById(input.id);
      }),

    create: publicProcedure
      .input(
        z.object({
          nama: z.string().max(128).optional(),
          body: z.string().optional(),
          fileUrl: z.string().optional(),
          fileKey: z.string().optional(),
          type: z.enum(["writing", "music", "art"]).default("writing"),
        })
      )
      .mutation(async ({ input }) => {
        return createArtifact(input);
      }),

    view: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await recordView(input.id);
        return { ok: true };
      }),

    uploadFile: publicProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          base64: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const key = `artifacts/${nanoid()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url, key };
      }),
  }),

  quip: router({
    list: publicProcedure
      .input(z.object({ artifactId: z.number() }))
      .query(async ({ input }) => {
        return listQuips(input.artifactId);
      }),

    create: publicProcedure
      .input(
        z.object({
          artifactId: z.number(),
          nama: z.string().max(128).optional(),
          body: z.string().optional(),
          fileUrl: z.string().optional(),
          fileKey: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return createQuip(input);
      }),

    uploadFile: publicProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
          base64: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const key = `quips/${nanoid()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.contentType);
        return { url, key };
      }),
  }),

  intimate: router({
    initiate: publicProcedure
      .input(
        z.object({
          artifactId: z.number(),
          sessionId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const thread = await getOrCreateThread(input.artifactId, input.sessionId);
        return thread;
      }),

    messages: publicProcedure
      .input(z.object({ threadId: z.number(), sessionId: z.string() }))
      .query(async ({ input }) => {
        return getIntimateMessages(input.threadId);
      }),

    send: publicProcedure
      .input(
        z.object({
          threadId: z.number(),
          sessionId: z.string(),
          body: z.string().min(1).max(4000),
        })
      )
      .mutation(async ({ input }) => {
        await addIntimateMessage(input.threadId, input.sessionId, input.body);
        return { ok: true };
      }),
  }),

  decay: router({
    run: publicProcedure.mutation(async () => {
      return runDecay();
    }),
  }),

  scheduled: scheduledRouter,
});

export type AppRouter = typeof appRouter;
