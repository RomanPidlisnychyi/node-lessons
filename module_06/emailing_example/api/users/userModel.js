const mongoose = require('mongoose');
const {
  Schema,
  Types: { ObjectId },
} = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
  status: {
    type: String,
    required: true,
    enum: ['Verified', 'Created'],
    default: 'Created',
  },
  verified: { type: Boolean, required: true, default: false },
  verificationToken: { type: String, required: false },
  favoriteFilmIds: [{ type: ObjectId, ref: 'Film' }],
});

userSchema.statics.findUserByIdAndUpdate = findUserByIdAndUpdate;
userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.updateToken = updateToken;
userSchema.statics.addFilmForUser = addFilmForUser;
userSchema.statics.removeFilmForUser = removeFilmForUser;
userSchema.statics.aggregateUserWithFilm = aggregateUserWithFilm;

async function findUserByIdAndUpdate(userId, updateParams) {
  return this.findByIdAndUpdate(
    userId,
    {
      $set: updateParams,
    },
    {
      new: true,
    }
  );
}

async function addFilmForUser(userId, filmId) {
  return this.findByIdAndUpdate(
    userId,
    {
      $push: { favoriteFilmIds: filmId },
    },
    {
      new: true,
    }
  ).populate('favoriteFilmIds');
}

async function removeFilmForUser(userId, filmId) {
  return this.findByIdAndUpdate(
    userId,
    {
      $pull: { favoriteFilmIds: filmId },
    },
    {
      new: true,
    }
  );
}

async function aggregateUserWithFilm(userId) {
  return this.aggregate([
    { $match: { _id: userId } }, // перевірка щоб пвертався тільки наш користувач а не всі
    {
      $lookup: {
        from: 'films',
        localField: 'favoriteFilmIds',
        foreignField: '_id',
        as: 'films',
      },
    },
  ]);
}

async function findUserByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
