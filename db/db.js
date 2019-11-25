const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URL;

mongoose.Promise = Promise;

// await mongoose.connect(dbURI, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true
// });

const db = mongoose.connection;
db.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`)
});
db.on('reconnected', () => {
  console.log('Connection Reestablished')
});
db.on('error', (error) => {
  console.log(`Mongoose connection error: `, error);
});
db.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
db.on('close', () => {
  console.log('Connection Closed')
});

const run = async () => {
  await mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    autoReconnect: true,
    reconnectTries: 1000000,
    reconnectInterval: 3000
  });
};

run().catch(error => console.error(error));

// For nodemon restart
process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
// For app termination
process.once('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
// For Heroku app termination
process.once('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});