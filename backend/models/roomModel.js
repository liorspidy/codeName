const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    players: { type: Array, required: true },
    status: { type: String, required: true },
    turn: { type: String, required: true },
    winner: { type: String, required: true },
    cards: { type: Array, required: true },
    board: { type: Array, required: true },
    round: { type: Number, required: true },
});

module.exports = mongoose.model('Room', roomSchema);
