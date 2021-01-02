const { chromium } = require('playwright');

const importJsonFromRestApi = require('./importJsonFromRestApi.js')

const getRequestUrl = async (url, route, credentials, selectors) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  await page.fill(selectors.email, credentials.username);
  await page.fill(selectors.password, credentials.password);
  await page.click(selectors.submit);

  await page.route(route, route => {
    const requestUrl = new URL(route.request().url());

    requestUrl.searchParams.set('bet.isActive', '0');
    requestUrl.searchParams.set('order', 'desc')
    requestUrl.searchParams.delete('limit');

    const cleanedUrl = requestUrl.href

    importJsonFromRestApi(cleanedUrl) // Use our toolkit function to import data from the REST API.
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
}

module.exports = getRequestUrl;