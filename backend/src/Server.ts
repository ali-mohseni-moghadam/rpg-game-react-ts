import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

instrument(io, {
  auth: false,
  mode: "development",
  namespaceName: "/admin",
});

type clientData = {
  id: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
};

const clients: clientData[] = [];

io.on("connection", (socket) => {
  console.log(`user connected : ${socket.id}`);

  clients.push({
    id: socket.id,
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  });

  let client: clientData;

  // emit to any user that client has online
  socket.broadcast.emit("userConnected", { socketId: socket.id });

  socket.on("position", (position) => {
    console.log(`recived position from user ${socket.id} :`, position);

    clients.forEach((item) => {
      if (item.id === socket.id) {
        item.position = position;

        return item;
      }
    });

    socket.timeout(5000).broadcast.emit("position", clients);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // emit to any user that client has offline
    socket.broadcast.emit("userDisconnected", { socketId: socket.id });
  });
});

httpServer.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});
