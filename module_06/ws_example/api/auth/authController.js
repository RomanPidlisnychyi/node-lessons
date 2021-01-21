const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const userModel = require('../users/userModel');
const { UnauthorizedError } = require('../helpers/errorsConstructor');
const authValidator = require('./authValidator');

const singUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const isEmailAlradyExist = await userModel.findUserByEmail(email);
    if (isEmailAlradyExist) {
      return res.status(409).send('User with this email already exists');
    }

    const passwordHash = await bcryptjs.hash(password, 4);

    const verificationToken = uuid.v4();

    const newUser = await userModel.create({
      ...req.body,
      password: passwordHash,
      verificationToken,
    });

    authValidator.sendVerificationEmail(newUser.email, verificationToken);

    delete newUser._doc.password;

    return res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
};

const singIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user || !user.verified) {
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

const authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization' || '');
    if (!authorizationHeader) {
      throw new UnauthorizedError('User not authorized');
    }
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

const logoutUser = async (req, res, next) => {
  try {
    const { user } = req;
    await userModel.updateToken(user._id, null);

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  singUp,
  singIn,
  authorize,
  logoutUser,
};
