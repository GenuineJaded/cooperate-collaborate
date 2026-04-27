import type { IncomingMessage, ServerResponse } from "http";
import { getDbHealth } from "../server/db";

export default async function healthHandler(_req: IncomingMessage, res: ServerResponse) {
  const db = await getDbHealth();
  const body = {
    ok: db.ok,
    db,
    storage: {
      configured: Boolean(process.env.BUILT_IN_FORGE_API_URL && process.env.BUILT_IN_FORGE_API_KEY),
    },
  };

  res.statusCode = db.ok ? 200 : 503;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}
