import { describe, expect, it } from "vitest";
import { calculateShade } from "./db";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { COOKIE_NAME } from "../shared/const";

// ─── Shade calculation tests ──────────────────────────────────────────────────

describe("calculateShade", () => {
  it("returns 0 for a freshly created artifact", () => {
    const artifact = {
      id: 1,
      nama: null,
      body: "test",
      fileUrl: null,
      fileKey: null,
      type: "writing" as const,
      lifeSeconds: BigInt(604800),
      purpleShade: 0,
      isExpired: false,
      createdAt: new Date(),
      lastInteractedAt: new Date(), // just now
    };
    expect(calculateShade(artifact)).toBe(0);
  });

  it("returns 1 after 18 hours of inactivity", () => {
    const eighteenHoursAgo = new Date(Date.now() - 18 * 60 * 60 * 1000 - 1000);
    const artifact = {
      id: 2,
      nama: null,
      body: "test",
      fileUrl: null,
      fileKey: null,
      type: "writing" as const,
      lifeSeconds: BigInt(604800),
      purpleShade: 0,
      isExpired: false,
      createdAt: eighteenHoursAgo,
      lastInteractedAt: eighteenHoursAgo,
    };
    expect(calculateShade(artifact)).toBe(1);
  });

  it("returns 3 after 54 hours of inactivity", () => {
    const fiftyFourHoursAgo = new Date(Date.now() - 54 * 60 * 60 * 1000 - 1000);
    const artifact = {
      id: 3,
      nama: null,
      body: "test",
      fileUrl: null,
      fileKey: null,
      type: "writing" as const,
      lifeSeconds: BigInt(604800),
      purpleShade: 0,
      isExpired: false,
      createdAt: fiftyFourHoursAgo,
      lastInteractedAt: fiftyFourHoursAgo,
    };
    expect(calculateShade(artifact)).toBe(3);
  });

  it("caps at 7 regardless of inactivity duration", () => {
    const veryOld = new Date(Date.now() - 200 * 60 * 60 * 1000);
    const artifact = {
      id: 4,
      nama: null,
      body: "test",
      fileUrl: null,
      fileKey: null,
      type: "writing" as const,
      lifeSeconds: BigInt(604800),
      purpleShade: 0,
      isExpired: false,
      createdAt: veryOld,
      lastInteractedAt: veryOld,
    };
    expect(calculateShade(artifact)).toBe(7);
  });
});

// ─── Auth logout test (from template) ────────────────────────────────────────

type CookieCall = { name: string; options: Record<string, unknown> };
type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext; clearedCookies: CookieCall[] } {
  const clearedCookies: CookieCall[] = [];
  const user: AuthenticatedUser = {
    id: 1,
    openId: "sample-user",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: (name: string, options: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };
  return { ctx, clearedCookies };
}

describe("auth.logout", () => {
  it("clears the session cookie and reports success", async () => {
    const { ctx, clearedCookies } = createAuthContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result).toEqual({ success: true });
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe(COOKIE_NAME);
    expect(clearedCookies[0]?.options).toMatchObject({
      maxAge: -1,
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  });
});
