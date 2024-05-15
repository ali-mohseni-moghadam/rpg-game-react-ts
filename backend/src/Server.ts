import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`user connected : ${socket.id}`);

  socket.emit("message", "Hello from the server!");

  socket.on("message", (data) => {
    console.log(`Received message from ${socket.id}: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});
