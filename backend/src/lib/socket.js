import { Server } from "socket.io";

const userSocketMap = {}; // { userId: socketId }

let ioInstance = null; // for external access in controllers

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function setupSocket(server) {
  ioInstance = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
        ioInstance.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });
}

export const io = {
  to: (...args) => ioInstance?.to(...args),
  emit: (...args) => ioInstance?.emit(...args),
};
