const Joi = require('joi');
const filmModel = require('./filmModel');

const createFilm = async (req, res, next) => {
  const createdFilm = await filmModel.create(req.body);

  return res.status(401).json(createFilm);
};

const createFilmValidation = (req, res, next) => {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    genre: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

const getAllFilms = async (req, res, next) => {
  try {
    const { id: filmId } = req.params;

    const films = await filmModel.find().sort({ name: 1 }).skip(2).limit(3);

    return res.status(200).json(films);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createFilm,
  createFilmValidation,
  getAllFilms,
};
