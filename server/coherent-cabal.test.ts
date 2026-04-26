import { describe, expect, it } from "vitest";
import { calculateShade } from "./db";


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
