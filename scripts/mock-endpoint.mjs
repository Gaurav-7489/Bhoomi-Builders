#!/usr/bin/env node
/**
 * Local stand-in for the form delivery endpoints (CONTACT_WEBHOOK_URL /
 * NEWSLETTER_WEBHOOK_URL). Run with `npm run mock`.
 *
 *   POST /contact, POST /newsletter  -> 200 {ok:true}, stores the JSON body
 *   GET  /submissions                -> everything received so far
 *   DELETE /submissions              -> clear the log
 *
 * To exercise the error state, submit with an email containing "fail"
 * (e.g. fail@example.com): the mock answers 500 and nothing is stored.
 */
import { createServer } from "node:http";

const port = Number(process.env.MOCK_PORT ?? 4010);
const secret = process.env.FORMS_WEBHOOK_SECRET;
const submissions = [];

const send = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${port}`);

  if (url.pathname === "/submissions") {
    if (req.method === "DELETE") submissions.length = 0;
    return send(res, 200, submissions);
  }

  if (req.method === "POST" && (url.pathname === "/contact" || url.pathname === "/newsletter")) {
    if (secret && req.headers.authorization !== `Bearer ${secret}`) {
      return send(res, 401, { ok: false, error: "bad secret" });
    }
    let raw = "";
    for await (const chunk of req) raw += chunk;
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return send(res, 400, { ok: false, error: "invalid json" });
    }
    if (String(body.email ?? "").includes("fail")) {
      console.log(`[mock] ${url.pathname} -> 500 (simulated failure)`);
      return send(res, 500, { ok: false, error: "simulated failure" });
    }
    const delay = Number(process.env.MOCK_DELAY_MS ?? 400);
    await new Promise((r) => setTimeout(r, delay));
    submissions.push({ endpoint: url.pathname.slice(1), receivedAt: new Date().toISOString(), body });
    console.log(`[mock] ${url.pathname} <-`, body);
    return send(res, 200, { ok: true });
  }

  send(res, 404, { ok: false, error: "not found" });
}).listen(port, () => {
  console.log(`[mock] form endpoint listening on http://localhost:${port}`);
});
