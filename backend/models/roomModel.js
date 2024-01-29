const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true},
    createdBy: { type: String, required: true },
    players: { type: Array,default: [] },
    redTeam: { type: Array, default: [] },
    blueTeam: { type: Array, default: [] },
    status: { type: String, default: "Waiting" },
    turn: { type: String, default: '' },
    winner: { type: String, default: ''},
    cards: { type: Array, default: [] },
    map: { type: Array, default: [] },
    round: { type: Number,default: 1 },
});

module.exports = mongoose.model('Room', roomSchema);
