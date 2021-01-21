const userModel = require('./userModel');
const filmModel = require('../films/filmModel');
const {
  UnauthorizedError,
  NotFoundError,
} = require('../helpers/errorsConstructor');

const getCurrentUser = (req, res, next) =>
  res.status(200).json(prepareUsersResponse([req.user]));

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

    const { favoriteFilmIds } = req.user;

    const isFilmAlreadyInFavorite = favoriteFilmIds.find(
      favoriteFilmId => favoriteFilmId.toString() === filmId
    );

    if (isFilmAlreadyInFavorite) {
      return res.status(200).send('Film already in favorites');
    }

    const userWithFilms = await userModel.addFilmForUser(req.user._id, filmId);
    // .populate('favoriteFilmIds');

    // const userWithFilms = await userModel.aggregateUserWithFilm(req.user._id);

    return res.status(200).json(...prepareUsersResponse([userWithFilms]));
  } catch (err) {
    next(err);
  }
};

const removeFilmForUser = async (req, res, next) => {
  try {
    const { id: filmId } = req.params;

    const updatedUser = await userModel.removeFilmForUser(req.user._id, filmId);
    // .populate('favoriteFilmIds');

    const userWithFilms = await userModel.aggregateUserWithFilm(req.user._id);

    return res.status(200).json(prepareUsersResponse(userWithFilms));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getCurrentUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addFilmForUser,
  removeFilmForUser,
};
