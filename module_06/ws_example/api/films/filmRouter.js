const { Router } = require('express');
const filmController = require('./filmController');

const filmRouter = Router();

filmRouter.post(
  '/',
  filmController.createFilmValidation,
  filmController.createFilm
);

filmRouter.get('/', filmController.getAllFilms);

module.exports = filmRouter;
