const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

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
  await getRequestUrl(bvUrl, bvBetHistoryRoute, credentials, selectors);
})();
