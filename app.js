const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));

app.get('/', async (req, res) => {
  try {
    const Bet = require('./models/bet');
    const bets = await Bet.find({});
    return res.status(200).send(
      `<!DOCTYPE html>
      <html lang="en">
      
      <head>
        <title>tidyhoops</title>
      </head>
      
      <body>
        <h1>My Bets</h1>
        
        ${bets.map(bet => `<p>${bet.title}</p>`).join('')}

      </body>`
    );
  } catch (err) {
    return res.send(err);
  }
});

module.exports = app;