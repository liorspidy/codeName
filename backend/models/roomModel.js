const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true},
    createdBy: { type: String, required: true },
    lastTimePlayed: { type: Date, default: null },
    players: { type: Array,default: [] },
    redTeam: { type: Array, default: [] },
    redScore: { type: Number, default: 8 },
    blueTeam: { type: Array, default: [] },
    blueScore: { type: Number, default: 8 },
    status: { type: String, default: "Waiting" },
    turn: { type: String, default: '' },
    winner: { type: String, default: ''},
    cards: { type: Array, default: [] },
    revealedCards: { type: Array, default: [] },
    map: { type: Array, default: [] },
    round: { type: Number,default: 1 },
    currentWord: { type: String, default: '' },
    currentWordCount: { type: Number, default: 0 },
    wordsToGuess: { type: Number, default: 0 },
    // usersScoreWasSet: { type: Boolean, default: false },
});

module.exports = mongoose.model('Room', roomSchema);
