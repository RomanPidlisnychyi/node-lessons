const { Router } = require('express');
const userController = require('./userController');
const userValidate = require('./userValidate');
const authValidator = require('../auth/authValidator');
const authController = require('../auth/authController');

const userRouter = Router();

userRouter.get(
  '/current',
  authController.authorize,
  userController.getCurrentUser
);
userRouter.get('/', userController.getUsers);
userRouter.get('/:id', authValidator.validateId, userController.getUserById);

userRouter.patch(
  '/films/favorites/:id',
  authController.authorize,
  authValidator.validateId,
  userController.addFilmForUser
);

userRouter.patch(
  '/:id',
  authValidator.validateId,
  userValidate.validateUpdateUser,
  userController.updateUser
);

userRouter.delete('/:id', authValidator.validateId, userController.deleteUser);

userRouter.delete(
  '/films/favorites/:id',
  authController.authorize,
  authValidator.validateId,
  userController.removeFilmForUser
);

module.exports = userRouter;
