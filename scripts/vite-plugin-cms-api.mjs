/**
 * Local CMS API for Vite dev server — reads/writes public/data and public/assets.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = join(root, "public", "data");
const ASSETS_DIR = join(root, "public", "assets");

const FILES = {
  site: "site.json",
  projects: "projects.json",
  experiences: "experiences.json",
  certifications: "certifications.json",
  gallery: "gallery.json",
};

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseMultipart(buffer, boundary) {
  const parts = buffer.toString("binary").split(`--${boundary}`);
  for (const part of parts) {
    if (!part.includes('name="file"')) continue;
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;
    const headers = part.slice(0, headerEnd);
    const filenameMatch = headers.match(/filename="([^"]+)"/);
    if (!filenameMatch) continue;
    const data = part.slice(headerEnd + 4);
    const content = data.replace(/\r\n$/, "").replace(/\r\n--$/, "");
    return {
      filename: filenameMatch[1],
      buffer: Buffer.from(content, "binary"),
    };
  }
  return null;
}

export function cmsApiPlugin() {
  return {
    name: "portfolio-cms-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        if (!url.startsWith("/api/")) return next();

        if (req.method === "OPTIONS") {
          res.statusCode = 204;
          res.end();
          return;
        }

        // Local dev: OAuth stub redirects back with a fake token
        if (url.startsWith("/api/auth") && req.method === "GET") {
          const requestUrl = new URL(url, "http://localhost");
          const returnUrl =
            requestUrl.searchParams.get("return_url") ||
            "http://localhost:8080/My-portfolio/admin/oauth-callback";
          const hash = new URLSearchParams({
            token: "local-dev-token",
            provider: "github",
          }).toString();
          res.statusCode = 302;
          res.setHeader("Location", `${returnUrl}#${hash}`);
          res.end();
          return;
        }

        if (url === "/api/user" && req.method === "GET") {
          sendJson(res, 200, {
            login: "local-dev",
            avatar_url: "",
            name: "Local Developer",
          });
          return;
        }

        const contentMatch = url.match(/^\/api\/content\/(site|projects|experiences|certifications|gallery)$/);
        if (contentMatch && req.method === "GET") {
          const key = contentMatch[1];
          const filePath = join(DATA_DIR, FILES[key]);
          if (!existsSync(filePath)) {
            sendJson(res, 404, { error: "Content file not found." });
            return;
          }
          sendJson(res, 200, JSON.parse(readFileSync(filePath, "utf8")));
          return;
        }

        if (contentMatch && req.method === "PUT") {
          const key = contentMatch[1];
          try {
            const body = await readBody(req);
            const filePath = join(DATA_DIR, FILES[key]);
            writeFileSync(filePath, `${JSON.stringify(JSON.parse(body), null, 2)}\n`);
            sendJson(res, 200, { ok: true });
          } catch {
            sendJson(res, 400, { error: "Invalid JSON payload." });
          }
          return;
        }

        if (url === "/api/media" && req.method === "POST") {
          try {
            const contentType = req.headers["content-type"] ?? "";
            const boundaryMatch = contentType.match(/boundary=(.+)$/);
            if (!boundaryMatch) {
              sendJson(res, 400, { error: "Expected multipart upload." });
              return;
            }

            const raw = Buffer.from(await readBody(req), "binary");
            const parsed = parseMultipart(raw, boundaryMatch[1]);
            if (!parsed) {
              sendJson(res, 400, { error: "No file uploaded." });
              return;
            }

            const safeName = parsed.filename.replace(/[^a-zA-Z0-9._-]/g, "-");
            const folder = join(ASSETS_DIR, "uploads");
            mkdirSync(folder, { recursive: true });
            const dest = join(folder, `${Date.now()}-${safeName}`);
            writeFileSync(dest, parsed.buffer);
            sendJson(res, 200, { path: `/assets/uploads/${dest.split(/[/\\]/).pop()}` });
          } catch (err) {
            sendJson(res, 500, { error: err instanceof Error ? err.message : "Upload failed." });
          }
          return;
        }

        sendJson(res, 404, { error: "Not found." });
      });
    },
    closeBundle() {
      const indexPath = join(root, "dist", "index.html");
      const fallbackPath = join(root, "dist", "404.html");
      if (existsSync(indexPath)) {
        copyFileSync(indexPath, fallbackPath);
      }
    },
  };
}
