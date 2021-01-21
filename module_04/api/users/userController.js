const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('./userModel');
const filmModel = require('../films/filmModel');
const { isValidObjectId } = require('mongoose');
const {
  UnauthorizedError,
  NotFoundError,
} = require('../helpers/errorsConstructor');

const validateId = (req, res, next) => {
  const { id: userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).send('Invalid userId');
  }

  next();
};

const costFactor = () => 4;

const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isEmailAlradyExist = await userModel.findUserByEmail(email);
    if (isEmailAlradyExist) {
      return res.status(409).send('User with this email already exists');
    }

    const passwordHash = await bcryptjs.hash(password, costFactor());

    const newUser = await userModel.create({
      ...req.body,
      password: passwordHash,
    });

    delete newUser._doc.password;

    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const validateCreateUser = (req, res, next) => {
  const createUserRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = createUserRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

const singIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('User not authorized');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('User not authorized');
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 2 * 24 * 60 * 60, // two days
    });

    await userModel.updateToken(user._id, token);
    return res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

const checkUser = async (email, password) => {
  const user = await userModel.findUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('User not authorized');
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('User not authorized');
  }

  const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: 2 * 24 * 60 * 60, // two days
  });

  await userModel.updateToken(user._id, token);
  return res.status(200).json({ token });
};

const validateSingIn = (req, res, next) => {
  const singInRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = singInRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

const authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization' || '');
    const token = authorizationHeader.replace('Bearer ', '');

    const userId = await jwt.verify(token, process.env.JWT_SECRET).id;

    if (!userId) {
      throw new UnauthorizedError('User not authorized');
    }

    const user = await userModel.findById(userId);
    if (!user || user.token !== token) {
      throw new UnauthorizedError('User not authorized');
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

const getCurrentUser = (req, res, next) =>
  res.status(200).json(prepareUsersResponse([req.user]));

const logoutUser = async (req, res, next) => {
  try {
    const { user } = req;
    await userModel.updateToken(user._id, null);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();

    return res.status(200).json(prepareUsersResponse(users));
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const user = await userModel.findById(userId);

    return user
      ? res.status(200).json(prepareUsersResponse([user]))
      : res.status(404).send('User not found');
  } catch (err) {
    next(err);
  }
};

const prepareUsersResponse = users =>
  users.map(({ _id, name, email, films, favoriteFilmIds }) => ({
    _id,
    name,
    email,
    films,
    favoriteFilmIds,
  }));

const updateUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const updatedUser = await userModel.findUserByIdAndUpdate(userId, req.body);

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    return res
      .status(200)
      .send(
        `User with email: ${updatedUser.email} has been successfully updated`
      );
  } catch (err) {
    next(err);
  }
};

const validateUpdateUser = (req, res, next) => {
  const createUserRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
  }).min(1);

  const validationResult = createUserRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

const deleteUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const deletedUser = await userModel.findByIdAndDelete(userId);

    return deletedUser
      ? res
          .status(200)
          .send(
            `User with email: '${deletedUser.email}' was successfully deleted`
          )
      : res.status(404).send('User not found!!!');
  } catch (err) {
    next(err);
  }
};

const addFilmForUser = async (req, res, next) => {
  try {
    const { id: filmId } = req.params;

    const film = await filmModel.findById(filmId);
    if (!film) {
      throw new NotFoundError('Film does not exists');
    }

    await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $push: { favoriteFilmIds: filmId },
      },
      {
        new: true,
      }
    );

    const userWithFilms = await userModel.aggregate([
      { $match: { _id: req.user._id } }, // перевірка щоб пвертався тільки наш користувач а не всі
      {
        $lookup: {
          from: 'films',
          localField: 'favoriteFilmIds',
          foreignField: '_id',
          as: 'films',
        },
      },
    ]);

    return res.status(200).json(prepareUsersResponse(userWithFilms));
  } catch (err) {
    next(err);
  }
};

const removeFilmForUser = async (req, res, next) => {
  try {
    const { id: filmId } = req.params;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { favoriteFilmIds: filmId },
      },
      {
        new: true,
      }
    );
    // .populate('favoriteFilmIds');

    const userWithFilms = await userModel.aggregate([
      { $match: { _id: req.user._id } }, // перевірка щоб пвертався тільки наш користувач а не всі
      {
        $lookup: {
          from: 'films',
          localField: 'favoriteFilmIds',
          foreignField: '_id',
          as: 'films',
        },
      },
    ]);

    return res.status(200).json(prepareUsersResponse(userWithFilms));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkUser,
  validateId,
  createUser,
  validateCreateUser,
  singIn,
  validateSingIn,
  authorize,
  getCurrentUser,
  logoutUser,
  getUsers,
  getUserById,
  updateUser,
  validateUpdateUser,
  deleteUser,
  addFilmForUser,
  removeFilmForUser,
};
