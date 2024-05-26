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
    z: number;
  };
  enemyAnimation: string;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
};

const clients: clientData[] = [];

io.on("connection", (socket) => {
  console.log(`user : ${socket.id}`);
  clients.push({
    id: socket.id,
    position: {
      x: 0,
      z: 0,
    },
    enemyAnimation: "idle",
    rotationX: 0,
    rotationY: 1,
    rotationZ: 1,
  });

  console.log("numbers of players : ", clients.length);

  io.emit("updatePlayers", clients);

  socket.on("update", (data) => {
    console.log(data.animationName);
    clients.forEach((item) => {
      if (item.id === socket.id) {
        item.position.x = data.x;
        item.position.z = data.z;
        item.enemyAnimation = data.animationName;
        item.rotationX = data.rotationX;
        item.rotationY = data.rotationY;
        item.rotationZ = data.rotationZ;
      }
      return item;
    });
  });

  socket.on("disconnect", () => {
    clients.splice(0, 1);
    console.log(`User disconnected: ${socket.id}`);
    console.log("numbers of players : ", clients.length);

    io.emit("updatePlayers", clients);
  });
});

setInterval(() => {
  io.emit("updatePosition", clients);
}, 30);

httpServer.listen(5000, () => {
  console.log("server running at http://localhost:5000");
});
