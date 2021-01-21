const Joi = require('joi');
const nodemailer = require('nodemailer');
const { isValidObjectId } = require('mongoose');
const userModel = require('../users/userModel');
const { NotFoundError } = require('../helpers/errorsConstructor');

const validateId = (req, res, next) => {
  const { id: userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).send('Invalid ObjectId');
  }

  next();
};

const changeVerificationStatus = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const userToVerify = await userModel.findOneAndUpdate(
      { verificationToken },
      {
        $set: { status: 'Verified', verified: true },
        $unset: { verificationToken },
      },
      {
        new: true,
      }
    );
    if (!userToVerify) {
      throw new NotFoundError('User not found');
    }

    return res.status(200).send(userToVerify);
  } catch (err) {
    next(err);
  }
};

const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const resault = await transporter.sendMail({
    from: process.env.NODEMAILER_USER,
    to: email,
    subject: 'Email verification',
    text: 'Hello tab on this link and confirm yor email',
    html: `<a href="http://localhost:3000/verify/${verificationToken}">Tab link to confirm</a>`,
  });
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

const validateSingUp = (req, res, next) => {
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

module.exports = {
  validateId,
  changeVerificationStatus,
  sendVerificationEmail,
  validateSingIn,
  validateSingUp,
};
