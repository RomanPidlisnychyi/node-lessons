const express = require('express');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const authRouter = require('./auth/authRouter');
const userRouter = require('./users/userRouter');
const filmRouter = require('./films/filmRouter');

mongoose.set('debug', true);

module.exports = class Server {
  constructor() {
    this.server = null;
    this.httpServer = null;
    this.io = null;
    this.socketsByIds = {};
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.initWsHandlers();
    await this.initDatabase();
    return this.listeningServer();
  }

  initServer() {
    this.server = express();
    this.httpServer = http.createServer(this.server);
    this.io = socketIO(this.httpServer);
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(express.static(path.join(__dirname, 'static')));
  }

  initRoutes() {
    this.server.use('/', authRouter);
    this.server.use('/users', userRouter);
    this.server.use('/films', filmRouter);
  }

  initWsHandlers() {
    this.io.on('connection', socket => {
      console.log('connection received');
      socket.on('join', token => {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        this.socketsByIds[id] = socket;
      });
      socket.on('chat message', data => {
        if (data.to) {
          const socketRecepient = this.socketsByIds[data.to];
          if (!socketRecepient) {
            return socket.emit('errorMessage', {
              message: 'user does not exist or does not connected to server',
            });
          }
          console.log('it is worked!');
          return socket.emit(data.to, data.message);
          // return socketRecepient.emit('chat message', data.message);
        }
        this.io.emit('chat message', data);
      });
    });
  }

  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  }

  listeningServer() {
    const { PORT } = process.env;

    return this.httpServer.listen(PORT, () =>
      console.log('Server started listening on port:', PORT)
    );
  }
};
