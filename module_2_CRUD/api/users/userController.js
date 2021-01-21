const Joi = require('joi');

const users = [
  {
    id: 1,
    name: 'Richard',
    email: 'richard@email.com',
    password: 'qwerty',
  },
];

const createUser = (req, res, next) => {
  const newUser = {
    ...req.body,
    id: users.reduce((acc, user) => {
      if (acc === user.id) {
        return (acc += 1);
      }
      return acc;
    }, 1),
  };

  const isEmailAlradyExist = users.find(user => user.email === newUser.email);

  if (isEmailAlradyExist) {
    return res
      .status(400)
      .send(`Email: ${newUser.email} alrady used! Please enter enother.`);
  }

  users.push(newUser);

  users.sort((a, b) => a.id - b.id);

  return res.send(users);
};

const getUsers = (req, res, next) => res.json(users);

const updateUser = (req, res, next) => {
  const targetUserIndex = findUserIndexByiD(parseInt(req.params.id));

  users[targetUserIndex] = {
    ...users[targetUserIndex],
    ...req.body,
  };

  return res.send(users[targetUserIndex]);
};

const deleteUser = async (req, res, next) => {
  try {
    const targetUserIndex = findUserIndexByiD(parseInt(req.params.id));

    users.splice(targetUserIndex, 1);

    return res.send(users);
  } catch (error) {
    next(error);
  }
};

const findUserIndexByiD = userId => {
  const targetUserIndex = users.findIndex(user => user.id === userId);

  if (targetUserIndex === -1) {
    throw new NotFoundError('User not found');
  }

  return targetUserIndex;
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
  const updateUserRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
  });

  const validationResult = updateUserRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);

    this.status = 404;
    delete this.stack;
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  validateCreateUser,
  validateUpdateUser,
};
