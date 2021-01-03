"use strict";

const request = require('request-promise');

async function importJsonFromRestApi(url) {
  try {
    const response = await request.get(url);
    return JSON.parse(response);
  } catch (err) {
    console.error("An error occurred.");
    console.error(err.stack);
  }

};

module.exports = importJsonFromRestApi;