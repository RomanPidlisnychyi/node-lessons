const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const userRouter = require('./users/userRouter');
const filmRouter = require('./films/filmRouter');

mongoose.set('debug', true);

module.exports = class Server {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    return this.listeningServer();
  }

  initServer() {
    this.server = express();
  }

  initMiddlewares() {
    this.server.use(express.json());
  }

  initRoutes() {
    this.server.use('/users', userRouter);
    this.server.use('/films', filmRouter);
  }

  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL);
  }

  listeningServer() {
    const { PORT } = process.env;

    return this.server.listen(PORT, () =>
      console.log('Server started listening on port:', PORT)
    );
  }
};
