import { Server } from "socket.io";

// Store userId-to-socketId mapping
const userSocketMap = {}; // { userId: socketId }

// Exported function to retrieve receiver socket ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Setup function to initialize socket.io on the passed server
export function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 A user connected:", socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap[userId] = socket.id;
    }

    // Notify all clients of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
      console.log("🔴 A user disconnected:", socket.id);
      if (userId) {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });
}
