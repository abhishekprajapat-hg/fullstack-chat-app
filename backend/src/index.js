import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from './routes/message.route.js'
import { connectDB } from "./lib/db.js";
import cors from 'cors';
import {app,server} from './lib/socket.js';

import path from 'path';

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ Middleware to parse JSON
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
  // Serve static files from the React frontend app
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
});

// ✅ Start server and connect DB
server.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
  connectDB();
});
