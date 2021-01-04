const { chromium } = require('playwright');

const importJsonFromRestApi = require('./importJsonFromRestApi.js')

const getRequestUrl = async (url, route, credentials, selectors) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);

  await page.fill(selectors.email, credentials.username);
  await page.fill(selectors.password, credentials.password);
  await page.click(selectors.submit);

  const interceptReq = async () => {
    await page.route(route, async route => {
      const requestUrl = new URL(route.request().url());

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
      const straightBets = cleanedBets.filter(bet => bet.isParlay === 0);
      console.log(straightBets);

    });
  }
  await interceptReq();

  await page.waitForNavigation(); // if this times out it is due to login not working
  await browser.close(); // without the above, the browser will close too early
}

module.exports = getRequestUrl;