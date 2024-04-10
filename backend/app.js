const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const wordsList = require("./words.json");
const Room = require("./models/roomModel");

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

  socket.on("joinRoom", (roomDetails, name) => {
    if (roomDetails.id) {
      console.log(name + " joined room " + roomDetails.id);
      socket.join(roomDetails.id);
      // Emit updated player list to all clients in the room
      const players = roomDetails.players || [];
      const redTeam = roomDetails.redTeam || [];
      const blueTeam = roomDetails.blueTeam || [];
      io.to(roomDetails.id).emit(
        "updatingPlayersAndTeams",
        players,
        redTeam,
        blueTeam
      );
    } else {
      console.log("Invalid room details");
    }
  });

  socket.on("playerLeft", async (roomDetails, name) => {
    console.log(name + " left the room");

    if (roomDetails.players.length === 4) {
      io.to(roomDetails.id).emit("showPlayersAmountError", name);
    }

    // Emit updatingPlayersAndTeams event
    io.to(roomDetails.id).emit(
      "updatingPlayersAndTeams",
      roomDetails.players.filter((p) => p !== name),
      roomDetails.redTeam.filter((p) => p !== name),
      roomDetails.blueTeam.filter((p) => p !== name)
    );
  });

  socket.on(
    "playerReady",
    async (roomId, player, players, redTeam, blueTeam) => {
      console.log(player + " is ready");

      // Check if all players are ready
      if (!players.some((player) => !player.ready)) {
        try {
          const room = await Room.findOne({ id: roomId });
          if (!room) {
            throw new Error("Room not found");
          }

          io.to(roomId).emit("playerJoinedToGame", room);

          if (
            room &&
            room.round === 1 &&
            room.redScore === 0 &&
            room.blueScore === 0
          ) {
            const uniqueRandomWords = [];
            const randomLeadGroupColor = Math.random() < 0.5 ? "red" : "blue";
            const minimapMappingArray =
              randomLeadGroupColor === "red" ? [9, 8, 7, 1] : [8, 9, 7, 1];
            const tempMinimap = Array(25)
              .fill()
              .map((_, index) => {
                let randFactor = Math.floor(Math.random() * 4);

                while (minimapMappingArray[randFactor] === 0) {
                  randFactor = Math.floor(Math.random() * 4);
                }

                if (minimapMappingArray[randFactor] > 0) {
                  minimapMappingArray[randFactor]--;
                  const color =
                    randFactor === 0
                      ? "#ec4542"
                      : randFactor === 1
                      ? "#008ed5"
                      : randFactor === 2
                      ? "#d1c499"
                      : randFactor === 3
                      ? "#3d3b3a"
                      : "";
                  const subclass =
                    randFactor === 0
                      ? `red`
                      : randFactor === 1
                      ? `blue`
                      : randFactor === 2
                      ? `neutral`
                      : randFactor === 3
                      ? `black`
                      : "";
                  return {
                    type: "div",
                    key: index,
                    props: {
                      subclass: subclass,
                      style: { backgroundColor: color },
                    },
                  };
                }
              });

            room.map = tempMinimap;

            console.log("Minimap generated");

            while (uniqueRandomWords.length < 25) {
              const randomWord =
                wordsList.words[
                  Math.floor(Math.random() * wordsList.words.length)
                ];

              if (!uniqueRandomWords.includes(randomWord)) {
                uniqueRandomWords.push(randomWord);
              }
            }

            console.log("Unique random words generated");

            room.turn = randomLeadGroupColor;
            console.log("Lead group color set");

            room.cards = uniqueRandomWords;
            console.log("Unique random words set");

            if (randomLeadGroupColor === "red") {
              room.redScore = 9;
              room.blueScore = 8;
            } else if (randomLeadGroupColor === "blue") {
              room.blueScore = 9;
              room.redScore = 8;
            }

            console.log("Scores set");

            if (room.status === "waiting") {
              room.status = "playing";
              console.log("Status set to playing");
            }

            room.players = players;
            room.redTeam = redTeam;
            room.blueTeam = blueTeam;

            console.log("Room updated");

            await room.save();
            io.to(roomId).emit(
              "updatingReadyPlayers",
              room,
              uniqueRandomWords,
              randomLeadGroupColor,
              tempMinimap
            );
          }
        } catch (error) {
          console.error("Error getting room:", error.message);
        }
      } else {
        // If not all players are ready, emit the updated players and teams
        io.to(roomId).emit(
          "updatingPlayersAndTeams",
          players,
          redTeam,
          blueTeam
        );
      }
    }
  );

  socket.on("playerSwitchedRole", (roomId, player, redTeam, blueTeam) => {
    console.log(player + " switched role");
    io.to(roomId).emit("updatingTeams", redTeam, blueTeam);
  });

  socket.on("switchTeams", (roomId, redTeam, blueTeam) => {
    console.log("Teams switched");
    io.to(roomId).emit("updatingTeams", redTeam, blueTeam);
  });

  socket.on("operatorsWordSet", (roomId, word, count) => {
    console.log("Operators word set");
    io.to(roomId).emit("updatingOperatorsWord", word, count);
  });

  socket.on("lockCard", async (roomId, pickedCard, myDetails) => {
    console.log(myDetails.name + " locked a card");
    try {
      const room = await Room.findOne({ id: roomId });
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      if (myDetails.team === "red") {
        room.redTeam.find((p) => p.name === myDetails.name).pickedCard = true;
        console.log(room.redTeam);
      } else {
        room.blueTeam.find((p) => p.name === myDetails.name).pickedCard = true;
        console.log(room.blueTeam);
      }

      await room.save();
    } catch (error) {
      console.error("Error getting room:", error.message);
    }
    io.to(roomId).emit("playerLockedCard", pickedCard, myDetails);
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
