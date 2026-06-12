import express, { type Express } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import pinoHttp from "pino-http";
import router from "./routes";
import postbackRouter from "./routes/postback";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount postback router at root so /file is reachable (before /api and static)
app.use(postbackRouter);

app.use("/api", router);

// Serve static files - works in both production and development
const staticDir = path.join(__dirname, "public");

// Log static directory configuration at startup
try {
  const assetsDir = path.join(staticDir, "assets");
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    logger.info({ staticDir, assetsCount: files.length, assetsFiles: files }, "Static files directory verified");
  } else {
    logger.warn({ staticDir, assetsDir }, "Assets directory not found");
  }
} catch (err) {
  logger.error({ err }, "Error checking static files directory");
}

// Static file middleware with proper MIME types
app.use(express.static(staticDir, {
  index: false,
  setHeaders: (res, filePath) => {
    // Set correct MIME types
    if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    } else if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
    } else if (filePath.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    } else if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
    // Disable caching for HTML, JS and CSS to prevent stale builds
    if (filePath.endsWith('.html') || filePath.endsWith('.js') || filePath.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

// SPA fallback - only for non-file routes (routes that don't have extensions)
app.get("/{*splat}", (req, res, next) => {
  // If the request has a file extension, skip (let it 404 naturally)
  if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
    return next();
  }
  // Set no-cache headers for HTML
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.sendFile(path.join(staticDir, "index.html"));
});

export default app;
