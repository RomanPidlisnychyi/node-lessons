const express = require('express');
const cors = require('cors');
const userRouter = require('./users/userRouter');
require('dotenv').config();

module.exports = class UsersServer {
  constructor() {
    this.server = null;
    this.PORT = process.env.PORT;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(cors({ origin: 'http://localhost:3000' }));
  }

  initRoutes() {
    this.server.use('/users', userRouter);
  }

  startListening() {
    this.server.listen(this.PORT, () => {
      console.log('Server started listening on port:', this.PORT);
    });
  }
};
