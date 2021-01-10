const awsServerlessExpress = require('aws-serverless-express');
const { connect } = reauire('./mongoose');

let connection = null;

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false; // persist db connection

  if (connection === null) connection = await connect();
  const app = require('./app');
  const server = awsServerlessExpress.createServer(app);
  return awsServerlessExpress.proxy(server, event, context, 'PROMISE').promise;
};
