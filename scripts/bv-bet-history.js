const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const importJsonFromRestApi = require('../toolkits/data-extraction-toolkit/importJsonFromRestApi.js')
const getRequestUrl = require('../toolkits/data-extraction-toolkit/getRequestUrl.js');

const bvUrl = 'https://www.bovada.lv/sports/player-props?overlay=login'
const bvBetHistoryRoute = '**/api/mybets*'
const credentials = { username: process.env.BV_USER, password: process.env.BV_PASS }
const selectors = {
  email: 'input[type="text"]',
  password: 'input[type = "password"]',
  submit: 'button[type="submit"]'
};

(async () => {
  const requestUrl = await getRequestUrl(bvUrl, bvBetHistoryRoute, credentials, selectors);

  requestUrl.searchParams.set('bet.isActive', '0');
  requestUrl.searchParams.set('order', 'desc')
  requestUrl.searchParams.delete('limit');

  const cleanedUrl = requestUrl.href
  const rawBets = await importJsonFromRestApi(cleanedUrl)

  const cleanedBets = rawBets.data.map(entry => {
    const bet = {
      date: entry.events[0].games[0].date,
      isParlay: entry.isAccumulator,
      homeTeam: entry.events[0].games[0].homeTeam.abbreviation,
      awayTeam: entry.events[0].games[0].visitingTeam.abbreviation,
      playerTeam: entry.events[0].teams !== null ? entry.events[0].teams[0].abbreviation : null,
      player: entry.events[0].players !== null ? entry.events[0].players[0].name : null,
      setup: entry.events[0].statistic.title,
      title: entry.title,
      wager: entry.amount,
      odds: entry.odds,
      result: entry.events[0].settlement.result
    }
    return bet;
  })
  const straightBets = cleanedBets.filter(bet => bet.isParlay === 0); // we want to filter out parlays for now
  console.log(straightBets);

  return straightBets
})();
