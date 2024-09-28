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
    // origin: "https://wordsplaylf.netlify.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("connect", () => {
    console.log("user connected");
  });

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
            // const randomLeadGroupColor = Math.random() < 0.5 ? "red" : "blue";
            // const minimapMappingArray =
            //   randomLeadGroupColor === "red" ? [9, 8, 7, 1] : [8, 9, 7, 1];

            // const tempMinimap = Array(25)
            //   .fill()
            //   .map((_, index) => {
            //     let randFactor = Math.floor(Math.random() * 4);

            //     // Make sure there are no more than 9 red, 8 blue, 7 neutral, and 1 black
            //     while (minimapMappingArray[randFactor] === 0) {
            //       randFactor = Math.floor(Math.random() * 4);
            //     }

            //     // Decrement the count of the current factor
            //     if (minimapMappingArray[randFactor] > 0) {
            //       minimapMappingArray[randFactor]--;
            //       const color =
            //         randFactor === 0
            //           ? "#ec4542"
            //           : randFactor === 1
            //           ? "#008ed5"
            //           : randFactor === 2
            //           ? "#d1c499"
            //           : randFactor === 3
            //           ? "#3d3b3a"
            //           : "";
            //       const subclass =
            //         randFactor === 0
            //           ? `red`
            //           : randFactor === 1
            //           ? `blue`
            //           : randFactor === 2
            //           ? `neutral`
            //           : randFactor === 3
            //           ? `black`
            //           : "";
            //       return {
            //         type: "div",
            //         key: index,
            //         props: {
            //           subclass: subclass,
            //           style: { backgroundColor: color },
            //         },
            //       };
            //     }
            //   });

            const randomLeadGroupColor = Math.random() < 0.5 ? "red" : "blue";
            const minimapMappingArray =
              randomLeadGroupColor === "red" ? [9, 8, 7, 1] : [8, 9, 7, 1];

            // Fisher-Yates shuffle algorithm
            function shuffleArray(array) {
              for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
              }
              return array;
            }

            const cellIndexes = Array.from({ length: 25 }, (_, index) => index);

            const blackCellIndex = cellIndexes.splice(
              Math.floor(Math.random() * cellIndexes.length),
              1
            )[0];
            minimapMappingArray[3]--;

            const shuffledIndexes = shuffleArray(cellIndexes);

            const redCellsIndexes = shuffledIndexes.splice(0, 8);
            minimapMappingArray[0] -= redCellsIndexes.length;

            const whiteCellsIndexes = shuffledIndexes.splice(0, 9);
            minimapMappingArray[2] -= whiteCellsIndexes.length;

            const blueCellsIndexes = shuffledIndexes;
            minimapMappingArray[1] -= blueCellsIndexes.length;

            const tempMinimap = Array(25)
              .fill()
              .map((_, index) => {
                let subclass = "";
                let color = "";

                if (index === blackCellIndex) {
                  subclass = "black";
                  color = "#3d3b3a";
                } else if (redCellsIndexes.includes(index)) {
                  subclass = "red";
                  color = "#ec4542";
                } else if (blueCellsIndexes.includes(index)) {
                  subclass = "blue";
                  color = "#008ed5";
                } else if (whiteCellsIndexes.includes(index)) {
                  subclass = "neutral";
                  color = "#d1c499";
                }

                return {
                  type: "div",
                  key: index,
                  props: {
                    subclass: subclass,
                    style: { backgroundColor: color },
                  },
                };
              });

            room.map = tempMinimap;

            console.log("Minimap generated");

            const uniqueRandomWords = [];
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
              randomLeadGroupColor
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

  socket.on(
    "lockCard",
    (
      roomId,
      myDetails,
      tempPlayers,
      finalRedTeamPlayers,
      finalBlueTeamPlayers,
      roomDetails,
      wordLocked
    ) => {

      const playingTeam = myDetails.team;
      let imTheOnlyOnePickedCard = false;
      let action = "none";

      // remove the first player from each team
      const tempRedTeam = [...finalRedTeamPlayers].slice(1);

      const tempBlueTeam = [...finalBlueTeamPlayers].slice(1);

      // get the length of the playing group
      const groupMembersLength =
        playingTeam === "red" ? tempRedTeam.length : tempBlueTeam.length;

      // get the length of the players who picked a card in the playing group
      const groupMembersPickedCardLength =
        playingTeam === "red"
          ? tempRedTeam.filter((player) => player.pickedCard === true).length
          : tempBlueTeam.filter((player) => player.pickedCard === true).length;

      // check if im the only one who picked a card in the playing group
      if (groupMembersPickedCardLength === 1) {
        if (playingTeam === "red") {
          imTheOnlyOnePickedCard =
            tempRedTeam.find((player) => player.pickedCard === true).name ===
            myDetails.name;
        } else {
          imTheOnlyOnePickedCard =
            tempBlueTeam.find((player) => player.pickedCard === true).name ===
            myDetails.name;
        }
      }

      // console.log({
      //   name: myDetails.name,
      //   playingTeam,
      //   wordLocked,
      //   groupMembersPickedCardLength,
      //   groupMembersLength,
      //   imTheOnlyOnePickedCard,
      // });

      if (!wordLocked && groupMembersPickedCardLength === 1) {
        action = "start";
      } else if (
        wordLocked &&
        groupMembersPickedCardLength === 0
      ) {
        action = "stop";
      } else if (groupMembersPickedCardLength === groupMembersLength) {
        action = "next";
      } else {
        action = "none";
      }

      io.to(roomId).emit(
        "updateTimerPlayingGroup",
        myDetails,
        tempPlayers,
        finalRedTeamPlayers,
        finalBlueTeamPlayers,
        roomDetails,
        action
      );
    }
  );

  socket.on("flipCard", (roomId, myDetails, index, word) => {
    console.log(myDetails.name + " flipped a card");
    io.to(roomId).emit("flippingCardToAll", myDetails, index, word);
  });

  socket.on("skipTurn", (roomId, myDetails) => {
    console.log(myDetails.name + " skipped their turn");
    io.to(roomId).emit("skippingTurn", myDetails);
  });

  socket.on("gameOver", (roomId, winner, myDetails) => {
    console.log("Game over");
    io.to(roomId).emit("gameOverToAll", winner, myDetails);
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
