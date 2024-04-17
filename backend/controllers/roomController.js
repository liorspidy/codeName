const Room = require("../models/roomModel");
const User = require("../models/userModel");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json(rooms);
  } catch (error) {
    console.error("Error getting rooms:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRoom = async (req, res) => {
  const roomId = req.params.id;

  try {
    console.log("Getting room");
    const room = await Room.findOne({ id: roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // If the room is found, return it as a response

    console.log("Room found");
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error getting room:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPlayers = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findOne({ id: roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    return res.status(200).json(room.players);
  } catch (error) {
    console.error("Error getting players:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setStatus = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const status = req.body.status;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.status = status;

    await room.save();
    return res.status(200);
  } catch (error) {
    console.error("Error starting game:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setWinner = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const winner = req.body.winner;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    
    room.winner = winner;
    room.status = "finished";

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error setting winner:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const playTurn = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Add logic to handle a player's turn

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error playing turn:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const createRoom = async (req, res) => {
  try {
    const { name, createdBy } = req.body;

    // Check if the room name is more than 10 characters
    if (name.length > 20) {
      return res
        .status(401)
        .json({ error: "Room name cannot be more than 10 characters" });
    }

    let randomId;
    let room;

    do {
      randomId = Math.floor(Math.random() * 900000000) + 100000000;
      room = await Room.findOne({ id: String(randomId) });
    } while (room);

    const newRoom = new Room({
      id: String(randomId),
      name,
      createdBy,
      lastTimePlayed: null,
      players: [{ name: createdBy, ready: false, pickedCard: false }],
      redTeam: [],
      redScore: 0,
      blueTeam: [],
      blueScore: 0,
      status: "waiting",
      turn: "",
      winner: "",
      cards: [],
      revealedCards: [],
      map: [],
      round: 1,
      currentWord: "",
      currentWordCount: 0,
      wordsToGuess: 0,
      usersScoreWasSet: false,
    });

    await newRoom.save();
    return res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateTimer = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const myDetails = req.body.myDetails;
    const players = req.body.players;
    const redTeam = req.body.redTeam; 
    const blueTeam = req.body.blueTeam;
    const team = myDetails.team + "Team";

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    
    if (room.lastTimePlayed !== null) {
      // Check if all players have picked a card or i reconsidered the card then reset the timer
      if (
        // if all players have picked a card or only one player has not picked a card and it's me then reset the timer
        !room[team].some((player) => player.pickedCard === false) ||
        (room[team].filter((player) => player.pickedCard === true).length ===
          1 &&
          room[team].find(
            (player) =>
              player.pickedCard === true && player.name === myDetails.name
          ) !== undefined)
      ) {
        room.lastTimePlayed = null;
      }
    } else {
      const time = new Date();
      room.lastTimePlayed = time.getTime();
    }
  
    room.players = players;
    room.redTeam = redTeam;
    room.blueTeam = blueTeam;


    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error updating timer:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId, playerName } = req.body;

    // Check if the room exists
    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the room is full

    if (room.players.length < 8) {
      if (!room.players.some((player) => player.name === playerName)) {
        room.players.push({
          name: playerName,
          ready: false,
          pickedCard: false,
        });
      }
    } else {
      return res.status(405).json({ error: "Room is full" });
    }

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error joining room:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const leaveRoom = async (req, res) => {
  try {
    const { roomId, username } = req.body;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (room.players.some((player) => player.name === username)) {
      room.players = room.players.filter((player) => player.name !== username);
    }

    if (room.redTeam.find((player) => player.name === username)) {
      room.redTeam = room.redTeam.filter((player) => player.name !== username);
    }

    if (room.blueTeam.find((player) => player.name === username)) {
      room.blueTeam = room.blueTeam.filter(
        (player) => player.name !== username
      );
    }

    // if(room.players.length < 4){
    //   room.status = "waiting";
    // }

    await room.save();
    return res.status(200).json(room);
  } catch (err) {
    console.error("Error exiting room:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const endGame = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }



    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error ending game:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Add logic to handle deleting the room

    await room.remove();
    return res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const resetRoom = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.lastTimePlayed = null;
    room.players.forEach((player) => {
      player.ready = false;
    });
    room.redTeam.forEach((player) => {
      player.ready = false;
    });
    room.blueTeam.forEach((player) => {
      player.ready = false;
    });
    room.redScore = 0;
    room.blueScore = 0;
    room.status = "waiting";
    room.turn = "";
    room.winner = "";
    room.cards = [];
    room.revealedCards = [];
    room.map = [];
    room.round = 1;
    room.currentWord = "";
    room.currentWordCount = 0;
    room.wordsToGuess = 0;
    room.usersScoreWasSet = false;

    await room.save();
    return res.status(200);
  } catch (error) {
    console.error("Error resetting room:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setCards = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const cards = req.body.cards;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.cards = cards;

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error setting cards:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setTurn = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const turn = req.body.turn;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.turn = turn;

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error setting cards:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setPlayers = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const players = req.body.players;
    const redTeam = req.body.redTeamPlayers;
    const blueTeam = req.body.blueTeamPlayers;

    const room = await Room.findOne({ id: roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.players = players;
    room.redTeam = redTeam;
    room.blueTeam = blueTeam;

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error setting team players:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setTeamPlayers = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const redTeam = req.body.redTeamPlayers;
    const blueTeam = req.body.blueTeamPlayers;

    const room = await Room.findOne({ id: roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.redTeam = redTeam;
    room.blueTeam = blueTeam;

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error setting team players:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setPlayerNotReady = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const playerName = req.body.playerName;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const playerIndex = room.players.findIndex(
      (player) => player.name === playerName
    );

    if (playerIndex !== -1) {
      room.players[playerIndex].ready = false;
    }

    const redTeamIndex = room.redTeam.findIndex(
      (player) => player.name === playerName
    );
    if (redTeamIndex === -1) {
      const blueTeamIndex = room.blueTeam.findIndex(
        (player) => player.name === playerName
      );
      if (blueTeamIndex !== -1) {
        room.blueTeam[blueTeamIndex].ready = false;
      }
    } else {
      room.redTeam[redTeamIndex].ready = false;
    }

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error setting player not ready:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setMap = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const map = req.body.map;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.map = map;

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error setting map:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const nextRound = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.round = room.round + 1;

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error next turn:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const nextTurn = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const turn = room.turn;

    if (turn === "red") {
      room.turn = "blue";
    } else if (turn === "blue") {
      room.turn = "red";
    }

    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error next turn:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setOperatorsWord = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const word = req.body.word;
    const wordCount = req.body.count;
    const wordsToGuess = req.body.wordsToGuess;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.currentWord = word;
    room.currentWordCount = wordCount;
    room.wordsToGuess = wordsToGuess;

    await room.save();
    return res.status(200);
  } catch (error) {
    console.error("Error setting operators word:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setWordsToGuess = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const wordsToGuess = req.body.wordsToGuess;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.wordsToGuess = wordsToGuess;

    if (room.wordsToGuess === 0) {
      room.currentWord = "";
      room.currentWordCount = 0;
    }

    await room.save();
    return res.status(200);
  } catch (error) {
    console.error("Error setting operators word:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateRevealedCards = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const cardIndex = req.body.index;
    const color = req.body.color;

    const room = await Room.findOne({ id: roomId });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.revealedCards.push({ index: cardIndex, color: color });
    await room.save();
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error updating revealed cards:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setScore = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const team = req.body.team;
    const score = req.body.score;

    console.log("setting score...");

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (team === "red") {
      room.redScore = score;
    } else if (team === "blue") {
      room.blueScore = score;
    }

    await room.save();
    console.log("score set");
    return res.status(200);
  } catch (err) {
    console.error("Error setting score:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const setUsersScore = async (req, res) => {
  try {
    const { roomId, winnigTeam, scoreToAdd } = req.body;

    const room = await Room.findOne({ id: roomId }).exec();
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    winnigTeam.forEach(async (winner) => {
      const user = await User.findOne({ username: winner }).exec();
      if (!user) {
        return res.status(401).json({ error: "Username was not found" });
      }

      const updatedScore = user.score + scoreToAdd;
      user.score = updatedScore;
      await user.save();
    });

    room.usersScoreWasSet = true;

    await room.save();
    return res
      .status(200)
      .json({ message: "Winning team score updated successfully" });
  } catch (error) {
    console.error("Error setting score:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getRooms,
  getRoom,
  getPlayers,
  createRoom,
  joinRoom,
  updateTimer,
  leaveRoom,
  setStatus,
  setWinner,
  playTurn,
  endGame,
  deleteRoom,
  resetRoom,
  setCards,
  setTurn,
  setMap,
  setPlayers,
  setTeamPlayers,
  setPlayerNotReady,
  nextRound,
  nextTurn,
  setOperatorsWord,
  setWordsToGuess,
  updateRevealedCards,
  setScore,
  setUsersScore,
};
