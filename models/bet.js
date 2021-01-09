const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true
  },
  date: {
    type: Date
  },
  title: {
    type: String
  },
  odds: {
    type: Number
  },
  player: {
    type: String
  },
  setup: {
    type: String
  },
  playerTeam: {
    type: String
  },
  homeTeam: {
    type: String
  },
  awayTeam: {
    type: String
  },
  wager: {
    type: Number
  },
  result: {
    type: String
  },
  isParlay: {
    type: Number
  }
})

const Bet = mongoose.model('Bet', betSchema);

module.exports = Bet;
