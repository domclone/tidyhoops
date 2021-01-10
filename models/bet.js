const mongoose = require('mongoose');
const { getConnection } = require('../mongoose');
const conn = getConnection();
const Schema = mongoose.Schema;

const betSchema = new Schema({
  id: { type: String, unique: true },
  date: { type: Date },
  title: { type: String },
  odds: { type: Number },
  player: { type: String },
  setup: { type: String },
  playerTeam: { type: String },
  homeTeam: { type: String },
  awayTeam: { type: String },
  wager: { type: Number },
  result: { type: String },
  gain: { type: Number },
  isParlay: { type: Number }
});

module.exports = conn.model('Bet', betSchema);