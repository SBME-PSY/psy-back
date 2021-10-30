const dotenv = require('dotenv');
// eslint-disable-next-line no-unused-vars
const colors = require('colors');

dotenv.config({ path: './config/config.env' });
const connectDB = require('./config/db');

connectDB();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}`.yellow.bold)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit
  server.close(() => process.exit(1));
});
