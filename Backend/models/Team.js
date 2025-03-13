const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Player Schema
const playerSchema = new Schema({
  position: {
    type: String
  },
  playerName: {
    type: String,
    required: true
  },
  goals: {
    type: Number,
    default: 0
  },
  assists: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  shots: {
    type: Number,
    default: 0
  },
  shotsOnGoal: {
    type: Number,
    default: 0
  },
  groundBalls: {
    type: Number,
    default: 0
  },
  turnovers: {
    type: Number,
    default: 0
  },
  causedTurnovers: {
    type: Number,
    default: 0
  },
  drawControls: {
    type: Number,
    default: 0
  },
  fouls: {
    type: Number,
    default: 0
  },
  freePositionShots: {
    type: String, // Format: "x-y" (successful-attempts)
    default: "0-0"
  }
});

// Team Schema
const teamSchema = new Schema({
  teamName: {
    type: String,
    required: true,
    // default: "Charlotte Women's Lacrosse"
  },
  teamStats: [playerSchema], // Array of players
});

// Avoid overwriting the model if it already exists
const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);

module.exports = Team;
