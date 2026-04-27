import type { IncomingMessage, ServerResponse } from "http";
import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { appRouter } from "../../server/routers";

const handler = createHTTPHandler({
  router: appRouter,
  createContext: ({ req, res }) => ({ req, res }),
  basePath: "/api/trpc/",
});

export default function trpcHandler(req: IncomingMessage, res: ServerResponse) {
  return handler(req, res);
}
