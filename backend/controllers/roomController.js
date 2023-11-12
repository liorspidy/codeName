const Room = require('../models/roomModel');

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json(rooms);
  } catch (error) {
    console.error('Error getting rooms:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room);
  } catch (error) {
    console.error('Error getting room:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getPlayers = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.players);
  } catch (error) {
    console.error('Error getting players:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getCards = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.cards);
  } catch (error) {
    console.error('Error getting cards:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBoard = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.board);
  } catch (error) {
    console.error('Error getting board:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTurn = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.turn);
  } catch (error) {
    console.error('Error getting turn:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getRound = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.round);
  } catch (error) {
    console.error('Error getting round:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getStarted = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.status === 'started');
  } catch (error) {
    console.error('Error getting started status:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getEnded = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.status === 'ended');
  } catch (error) {
    console.error('Error getting ended status:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getWinner = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.winner);
  } catch (error) {
    console.error('Error getting winner:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getLoser = async (req, res) => {
  try {
    const roomId = req.params.id;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    return res.status(200).json(room.loser);
  } catch (error) {
    console.error('Error getting loser:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const startGame = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Add logic to start the game (initialize cards, set status, etc.)

    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    console.error('Error starting game:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const playTurn = async (req, res) => {
  try {
    const roomId = req.body.roomId;
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Add logic to handle a player's turn

    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    console.error('Error playing turn:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createRoom = async (req, res) => {
  try {
    const { name, password, createdBy } = req.body;

    // Check if the room name is unique
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ error: 'Room with this name already exists' });
    }

    const newRoom = new Room({
      name,
      password,
      createdBy,
      players: [createdBy], // Add the creator to the list of players
      status: 'waiting', // Set the initial status
      turn: 'red', // Set the initial turn
      winner: 'none', // Set the initial winner
      cards: [], // Initialize cards array
      board: [], // Initialize board array
      round: 1, // Set the initial round
    });

    await newRoom.save();

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error('Error creating room:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId, playerId } = req.body;

    // Check if the room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if the room is full
    if (room.players.length >= 4) {
      return res.status(400).json({ error: 'Room is full' });
    }

    // Check if the player is already in the room
    if (room.players.includes(playerId)) {
      return res.status(400).json({ error: 'Player is already in the room' });
    }

    room.players.push(playerId);

    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    console.error('Error joining room:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const leaveRoom = async (req, res) => {
  try {
    const { roomId, playerId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if the player is in the room
    if (!room.players.includes(playerId)) {
      return res.status(400).json({ error: 'Player is not in the room' });
    }

    // Remove the player from the room
    room.players = room.players.filter((player) => player !== playerId);

    // Update other game-related logic based on your requirements

    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    console.error('Error leaving room:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const endGame = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Add logic to end the game

    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    console.error('Error ending game:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Add logic to handle deleting the room

    await room.remove();

    return res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const resetRoom = async (req, res) => {
  try {
    const roomId = req.body.roomId;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Add logic to reset the room state

    await room.save();

    return res.status(200).json(room);
  } catch (error) {
    console.error('Error resetting room:', error.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getRooms, getRoom, 
    getPlayers, getCards,getBoard, getTurn,
    getRound, getStarted, getEnded, getWinner, getLoser , 
    createRoom, joinRoom , startGame , playTurn , 
    leaveRoom , endGame , deleteRoom , resetRoom};
