const { chromium } = require('playwright');
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const importJsonFromRestApi = require('../toolkits/importJsonFromRestApi.js');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.bovada.lv/sports/player-props?overlay=login');

  await page.fill('input[type="text"]', process.env.BV_USER);
  await page.fill('input[type="password"]', process.env.BV_PASS);
  await page.click('button[type="submit"]');

  await page.route('**/api/mybets*', route => {
    const betHistoryApi = new URL(route.request().url());

    betHistoryApi.searchParams.set('bet.isActive', '0');
    betHistoryApi.searchParams.set('order', 'desc')
    betHistoryApi.searchParams.delete('limit');

    const betHistory = betHistoryApi.href

    importJsonFromRestApi(betHistory) // Use our toolkit function to import data from the REST API.
      .then(data => { // Callback to handle imported data.
        const bets = data.data.map(entry => {
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
        const straightBets = bets.filter(bet => bet.isParlay === 0);
        console.log(straightBets); // Print the data to the console so that we can verify it.
      })
      .catch(err => { // Handle any error that might have occurred.
        console.error("An error occurred.");
        console.error(err.stack);
      });
  });

})()
