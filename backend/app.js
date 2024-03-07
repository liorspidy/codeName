const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");

require("dotenv").config();

const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("joinRoom", (roomDetails , name) => {
    if (roomDetails.id) {
      console.log(name + " joined room " + roomDetails.id);
      socket.join(roomDetails.id);
      // Emit updated player list to all clients in the room
      const players = roomDetails.players || [];
      const redTeam = roomDetails.redTeam || [];
      const blueTeam = roomDetails.blueTeam || [];
      io.to(roomDetails.id).emit("updatingPlayers", players, redTeam, blueTeam);
    } else {
      console.log("Invalid room details");
    }
  });

  socket.on("playerLeft", (roomDetails, name) => {
    console.log(name + " left the room");
    io.to(roomDetails.id).emit(
      "updatingPlayers",
      roomDetails.players.filter((p) => p !== name),
      roomDetails.redTeam.filter((p) => p !== name),
      roomDetails.blueTeam.filter((p) => p !== name)
    );
  });

  socket.on("switchTeams", (roomId, redTeam, blueTeam) => {
    console.log("Teams switched");
    io.to(roomId).emit("switchingTeams", redTeam, blueTeam);
  });
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/room", roomRoutes);

module.exports = { app, server, io }; // Export the io object along with app and server
