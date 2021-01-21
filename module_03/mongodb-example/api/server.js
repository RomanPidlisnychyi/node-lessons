const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRouter = require('./users/userRouter');

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.listeningServer();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use('/users', userRouter);
  }

  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL);
  }

  listeningServer() {
    const { PORT } = process.env;

    this.server.listen(PORT, () =>
      console.log('Server started listening on port:', PORT)
    );
  }
};
