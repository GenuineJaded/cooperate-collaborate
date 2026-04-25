import { publicProcedure, router } from "../_core/trpc";
import { runDecay } from "../db";

// Scheduled decay endpoint — called by the Manus scheduled task agent
// Accessible to "user" role (which scheduled tasks run as)
export const scheduledRouter = router({
  decay: publicProcedure.mutation(async () => {
    const result = await runDecay();
    return { ok: true, ...result };
  }),
});
