const { Router } = require('express');
const userController = require('./userController');

const userRouter = Router();

// CRUD

// Create
userRouter.post(
  '/',
  userController.validateCreateUser,
  userController.createUser
);

// Read
userRouter.get('/', userController.getUsers);

// Update
userRouter.put(
  '/:id',
  userController.validateUpdateUser,
  userController.updateUser
);

// Delete
userRouter.delete('/:id', userController.deleteUser);

module.exports = userRouter;
