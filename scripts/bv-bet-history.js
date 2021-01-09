const path = require('path')
const dataForge = require('data-forge');
const { request } = require('http');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const Bet = require('../models/bet');
const importJsonFromRestApi = require('../toolkits/extract/importJsonFromRestApi.js')
const getRequestUrl = require('../toolkits/extract/getRequestUrl.js');

const bvUrl = 'https://www.bovada.lv/sports/player-props?overlay=login'
const bvBetHistoryRoute = '**/api/mybets*'
const credentials = { username: process.env.BV_USER, password: process.env.BV_PASS }
const selectors = {
  email: 'input[type="text"]',
  password: 'input[type = "password"]',
  submit: 'button[type="submit"]'
};

const betHistory = async () => {
  try {
    let requestUrl = await getRequestUrl(bvUrl, bvBetHistoryRoute, credentials, selectors);

    requestUrl.searchParams.set('bet.isActive', '0');
    requestUrl.searchParams.delete('limit');

    requestUrl = requestUrl.href

    const rawBets = await importJsonFromRestApi(requestUrl)

    const cleanedBets = rawBets.data.map(entry => {
      const bet = {
        id: entry.id,
        date: entry.events[0].games[0].date,
        title: entry.title,
        odds: entry.odds,
        player: entry.events[0].players !== null ? entry.events[0].players[0].name : null,
        setup: entry.events[0].statistic.title,
        playerTeam: entry.events[0].teams !== null ? entry.events[0].teams[0].abbreviation : null,
        homeTeam: entry.events[0].games[0].homeTeam.abbreviation,
        awayTeam: entry.events[0].games[0].visitingTeam.abbreviation,
        wager: entry.amount,
        result: entry.events[0].settlement.result,
        gain: entry.events[0].settlement.result === 'Lost' ? -Math.abs(entry.amount) : (entry.odds * entry.amount) - entry.amount,
        isParlay: entry.isAccumulator
      }
      return bet;
    })
    const straightBets = cleanedBets.filter(bet => bet.isParlay === 0); // we want to filter out parlays for now

    Bet.insertMany(straightBets); // save bets to mongo
  } catch (err) {
    console.log('error: ' + err)
  }
};


module.exports = betHistory;