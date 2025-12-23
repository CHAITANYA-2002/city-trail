import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";

const app = express();
const httpServer = createServer(app);

// --- RAW BODY SUPPORT (for webhooks etc.)
declare module "http" {
  interface IncomingMessage {
    rawBody?: Buffer;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

app.use(express.urlencoded({ extended: false }));

// --- SIMPLE LOGGER
export function log(message: string, source = "express") {
  const time = new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  console.log(`${time} [${source}] ${message}`);
}

// --- API REQUEST LOGGER
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  const originalJson = res.json.bind(res);
  let responseBody: any;

  res.json = (body: any) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      const duration = Date.now() - start;
      log(
        `${req.method} ${path} ${res.statusCode} (${duration}ms)${
          responseBody ? ` :: ${JSON.stringify(responseBody)}` : ""
        }`
      );
    }
  });

  next();
});

(async () => {
  // --- REGISTER API ROUTES
  await registerRoutes(httpServer, app);

  // --- GLOBAL ERROR HANDLER
  app.use(
    (err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
      log(message, "error");
    }
  );

  // --- FRONTEND (Vite in dev, static in prod)
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // --- SERVER START (WINDOWS SAFE)
  const PORT = parseInt(process.env.PORT || "5000", 10);

  httpServer.listen(PORT, "127.0.0.1", () => {
    log(`🚀 Server running at http://127.0.0.1:${PORT}`);
  });
})();
