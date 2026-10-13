// Minimal local mock API for load testing with JMeter.
// Run with:  node mock-server.js
// Endpoints: GET /objects and GET /objects/{id}

const http = require("http");

const objects = Array.from({ length: 13 }, (_, i) => ({
  id: String(i + 1),
  name: `Test object ${i + 1}`,
  data: { color: "silver", capacity: `${(i + 1) * 64} GB` },
}));

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method not allowed" }));
  }

  if (req.url === "/objects") {
    return res.end(JSON.stringify(objects));
  }

  const match = req.url.match(/^\/objects\/(\d+)$/);
  if (match) {
    const found = objects.find((o) => o.id === match[1]);
    if (found) {
      return res.end(JSON.stringify(found));
    }
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(3000, () => {
  console.log("Mock API running on http://localhost:3000");
});
