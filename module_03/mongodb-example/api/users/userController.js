const Joi = require('joi');
const userModel = require('./userModel');
const { isValidObjectId } = require('mongoose');

const createUser = async (req, res, next) => {
  try {
    const newUser = await userModel.create(req.body);

    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userModel.find();

    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const targetUser = await userModel.findById(userId);

    return targetUser
      ? res.status(200).json(targetUser)
      : res.status(404).send('User not found');
  } catch (err) {
    next(err);
  }
};

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
    const { id: userId } = req.params;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $push: { films: req.body },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const removeFilmForUser = async (req, res, next) => {
  try {
    const { id: userId } = req.params;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { films: { _id: req.body.id } },
      },
      {
        new: true,
      }
    );

    return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

const validateAddFilmForUser = (req, res, next) => {
  const createFilmRules = Joi.object({
    name: Joi.string().required(),
  });

  const validationResult = createFilmRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
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

const validateId = (req, res, next) => {
  const { id: userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).send('Invalid userId');
  }

  next();
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  validateCreateUser,
  validateUpdateUser,
  validateId,
  addFilmForUser,
  removeFilmForUser,
  validateAddFilmForUser,
};
