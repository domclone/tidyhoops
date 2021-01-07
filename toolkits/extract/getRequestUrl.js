const { chromium } = require('playwright');

const getRequestUrl = async (url, route, credentials, selectors) => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(url);
  await page.fill(selectors.email, credentials.username);
  await page.fill(selectors.password, credentials.password);
  await page.click(selectors.submit);
  const request = await page.waitForRequest(route);
  await browser.close(); // without the above, the browser will close too early

  return new URL(request.url());
}

module.exports = getRequestUrl;