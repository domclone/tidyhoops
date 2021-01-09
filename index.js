const mongoose = require('mongoose');

const betHistory = require('./scripts/bv-bet-history.js');

(async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/betHistory',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
    console.log('mongo connection open..')
  } catch (err) {
    console.log('error: ' + err)
  }
})()

betHistory();
