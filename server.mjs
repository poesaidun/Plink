import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5177);
const host = "127.0.0.1";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);
    if (url.pathname === "/canvas-proxy") {
      await proxyCanvas(url, request, response);
      return;
    }
    if (url.pathname === "/plink-user.js") {
      send(response, 200, `window.PLINK_USER = ${JSON.stringify({ name: process.env.USERNAME || process.env.USER || "" })};`, "text/javascript; charset=utf-8");
      return;
    }
    await serveStatic(url, response);
  } catch (error) {
    console.error(error);
    send(response, 500, "Internal server error", "text/plain; charset=utf-8");
  }
});

server.listen(port, host, () => {
  console.log(`Plink running at http://${host}:${port}`);
});

async function proxyCanvas(url, request, response) {
  const target = url.searchParams.get("url");
  if (!target) {
    send(response, 400, JSON.stringify({ error: "Missing Canvas URL" }), "application/json; charset=utf-8");
    return;
  }

  const targetUrl = new URL(target);
  if (targetUrl.protocol !== "https:" || !targetUrl.hostname.endsWith(".instructure.com")) {
    send(response, 400, JSON.stringify({ error: "Canvas proxy only allows instructure.com hosts" }), "application/json; charset=utf-8");
    return;
  }

  const proxied = await fetch(targetUrl, {
    headers: {
      Authorization: request.headers.authorization || "",
      Accept: "application/json",
    },
  });

  const headers = {
    "content-type": proxied.headers.get("content-type") || "application/json; charset=utf-8",
    "access-control-expose-headers": "Link",
  };
  const link = proxied.headers.get("link");
  if (link) headers.link = link;

  response.writeHead(proxied.status, headers);
  response.end(Buffer.from(await proxied.arrayBuffer()));
}

async function serveStatic(url, response) {
  const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const normalized = normalize(pathname).replace(/^[/\\]+/, "").replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, normalized);

  if (!filePath.toLowerCase().startsWith(root.toLowerCase())) {
    send(response, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  const fileStat = await stat(filePath).catch(() => null);
  if (!fileStat || !fileStat.isFile()) {
    send(response, 404, "Not found", "text/plain; charset=utf-8");
    return;
  }

  const content = await readFile(filePath);
  send(response, 200, content, mimeTypes[extname(filePath)] || "application/octet-stream");
}

function send(response, status, body, contentType) {
  response.writeHead(status, {
    "content-type": contentType,
    "cache-control": "no-store",
  });
  response.end(body);
}
