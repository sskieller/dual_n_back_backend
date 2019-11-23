const mongoose = require('mongoose');
const dbURI = process.env.MONGODB_URL;

mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`)
});
mongoose.connection.on('error', (error) => {
  console.log(`Mongoose connection error: `, error);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

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