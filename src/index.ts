// server.js - Basic Express SSE implementation
import express from "express";
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// SSE endpoint
app.get("/events", (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send a comment to keep the connection alive
  res.write(":ping\n\n");

  // Send an initial event
  const data = {
    message: "Connection established!",
    timestamp: Date.now(),
  };

  res.write(`data: ${JSON.stringify(data)}\n\n`);

  // Set up interval to send updates every 3 seconds
  const intervalId = setInterval(() => {
    const eventData = {
      message: `Server update at ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now(),
    };

    // You can also specify an event type
    res.write(`event: update\n`);
    res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  }, 3000);

  // Clean up when client disconnects
  req.on("close", () => {
    clearInterval(intervalId);
    console.log("Connection closed");
  });
});

// Regular API endpoint to trigger custom events
app.get("/trigger-event", (req, res) => {
  // Normally you'd want to broadcast to all connected clients
  // For simplicity, we're just responding with a confirmation
  res.json({
    status:
      "Event triggered (Note: in a real app this would broadcast to SSE clients)",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
