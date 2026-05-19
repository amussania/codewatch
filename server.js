const http = require("http");
const fs = require("fs");
const path = require("path");

// ← PASTE YOUR ANTHROPIC API KEY BETWEEN THE QUOTES BELOW
const ANTHROPIC_API_KEY = "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";

const PORT = 8080;

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // Serve the HTML file
  if (req.method === "GET") {
    const fileName = req.url === "/" ? "codewatch-v3.html" : req.url.slice(1);
    const filePath = path.join(__dirname, fileName);
    if (fs.existsSync(filePath)) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fs.readFileSync(filePath));
      return;
    }
  }

  // Proxy API calls — your key never touches the browser
  if (req.method === "POST" && req.url === "/api/claude") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        // Parse and enforce correct model string
        const parsed = JSON.parse(body);
        parsed.model = "claude-sonnet-4-5";

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify(parsed)
        });
        const data = await response.json();
        res.writeHead(response.status, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: { message: err.message } }));
      }
    });
    return;
  }

  res.writeHead(404); res.end("Not found");
});

server.listen(PORT, () => {
  console.log("✅ CODEWATCH running at http://localhost:" + PORT);
  console.log("   Open http://localhost:" + PORT + " in your browser");
  if (ANTHROPIC_API_KEY === "YOUR_API_KEY_HERE") {
    console.log("⚠️  WARNING: Paste your Anthropic API key into this file first!");
    console.log("   Open server.js in Notepad, find YOUR_API_KEY_HERE and replace it.");
  }
});
