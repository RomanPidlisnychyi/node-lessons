const { Router } = require('express');
const userController = require('./userController');

const userRouter = Router();

userRouter.post(
  '/',
  userController.validateCreateUser,
  userController.createUser
);

userRouter.get(
  '/current',
  userController.authorize,
  userController.getCurrentUser
);
userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.validateId, userController.getUserById);

userRouter.patch(
  '/sing-in',
  userController.validateSingIn,
  userController.singIn
);

userRouter.patch(
  '/logout',
  userController.authorize,
  userController.logoutUser
);

userRouter.patch(
  '/films/favorites/:id',
  userController.authorize,
  userController.validateId,
  userController.addFilmForUser
);

userRouter.delete(
  '/films/favorites/:id',
  userController.authorize,
  userController.validateId,
  userController.removeFilmForUser
);

userRouter.patch(
  '/:id',
  userController.validateId,
  userController.validateUpdateUser,
  userController.updateUser
);

userRouter.delete('/:id', userController.validateId, userController.deleteUser);

module.exports = userRouter;
