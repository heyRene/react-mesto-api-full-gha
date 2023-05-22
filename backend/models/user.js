const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');
// const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
      validate: {
        validator: (link) => /^(http|https)?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]*)?$/im.test(link),
        message: 'Неверный формат ссылки',
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => isEmail(email),
        message: 'Неверно введен email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
    // statics: {
    //   findUserByCredentials(email, password) {
    //     return this.findOne({ email })
    //       .select('+password')
    //       .orFail(new UnauthorizedError('Пользователь с таким email не найден'))
    //       .then((user) => bcrypt.compare(password, user.password)
    //         .then((matched) => {
    //           if (!matched) {
    //             return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
    //           }
    //           return user;
    //         }));
    //   },
    // },
  },
);

userSchema.methods.toJSON = function noShowPassword() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('user', userSchema);
