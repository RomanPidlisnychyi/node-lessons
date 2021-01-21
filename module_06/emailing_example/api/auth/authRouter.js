const { Router } = require('express');
const authValidator = require('./authValidator');
const authController = require('./authController');

const authRouter = Router();

authRouter.post(
  '/register',
  authValidator.validateSingUp,
  authController.singUp
);

authRouter.get(
  '/verify/:verificationToken',
  authValidator.changeVerificationStatus
);

authRouter.patch(
  '/logout',
  authController.authorize,
  authController.logoutUser
);

authRouter.patch('/login', authValidator.validateSingIn, authController.singIn);

module.exports = authRouter;
