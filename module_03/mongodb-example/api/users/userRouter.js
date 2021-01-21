const { Router } = require('express');
const userController = require('./userController');

const userRouter = Router();

userRouter.post(
  '/',
  userController.validateCreateUser,
  userController.createUser
);

userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.validateId, userController.getUserById);

userRouter.patch(
  '/:id',
  userController.validateId,
  userController.validateUpdateUser,
  userController.updateUser
);

userRouter.delete('/:id', userController.validateId, userController.deleteUser);

userRouter.patch(
  '/:id/films/add',
  userController.validateId,
  userController.validateAddFilmForUser,
  userController.addFilmForUser
);

userRouter.patch(
  '/:id/films/remove',
  userController.validateId,
  userController.removeFilmForUser
);

module.exports = userRouter;
