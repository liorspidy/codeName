const Room = require("../models/roomModel");

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
    const room = await Room.findOne({ id: roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // If the room is found, return it as a response
    res.status(200).json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
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

const startGame = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Add logic to start the game (initialize cards, set status, etc.)

    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    console.error("Error starting game:", error.message);
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
      players: [createdBy],
      redTeam: [],
      blueTeam: [],
      status: "waiting",
      turn: "",
      winner: "",
      cards: [],
      map: [],
      round: 1,
    });

    await newRoom.save();

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error.message);
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
    if (room.players.length >= 4) {
      return res.status(405).json({ error: "Room is full" });
    } else {
      if (!room.players.includes(playerName)) {
        room.players.push(playerName);
      }
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
    const { roomId, playerId } = req.body;

    const room = await Room.findOne({ id: roomId });
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Check if the player is in the room
    if (!room.players.includes(playerId)) {
      return res.status(400).json({ error: "Player is not in the room" });
    }

    // Remove the player from the room
    room.players = room.players.filter((player) => player !== playerId);

    // Update other game-related logic based on your requirements

    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    console.error("Error leaving room:", error.message);
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

    // Add logic to end the game

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

    // Add logic to reset the room state

    await room.save();

    return res.status(200).json(room);
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

const setTeamPlayers = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const redTeam = req.body.redTeamPlayers;
    const blueTeam = req.body.blueTeamPlayers;

    const room = await Room.findOne({ id: roomId }).exec();

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

const setMap = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const map = req.body.map;

    const room = await Room.findOne({ id: roomId }).exec();
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

const checkCard = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const cardIndex = req.body.index;

    const room = await Room.findOne({ id: roomId }).exec();
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    const map = room.map;

    const checkInMap = (colorMap) => {
      let tempColor = "";
      colorMap.forEach((color) => {
        if (map[cardIndex].props.className.includes(color)) {
          tempColor = color;
        }
      });
      return tempColor;
    };

    const cardsColor = checkInMap(["red", "blue", "black", "neutral"]);
    return res.status(200).json({ color: cardsColor });
  } catch (error) {
    console.error("Error checking card:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const nextTurn = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findOne({ id: roomId }).exec();
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    room.round++;
    const turn = room.turn;
    if (turn === "red") {
      room.turn = "blue";
    } else if (turn === "blue") {
      room.turn = "red";
    }
    return res.status(200).json(room);
  } catch (error) {
    console.error("Error next turn:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getRooms,
  getRoom,
  getPlayers,
  createRoom,
  joinRoom,
  startGame,
  playTurn,
  leaveRoom,
  endGame,
  deleteRoom,
  resetRoom,
  setCards,
  setTurn,
  setMap,
  setTeamPlayers,
  checkCard,
  nextTurn,
};
