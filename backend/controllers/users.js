const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const UserExistError = require('../errors/UserExistError');
const ValidationError = require('../errors/ValidationError');
// const UnauthorizedError = require('../errors/UnauthorizedError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const getUserId = (req, res, next) => {
  const { userId } = req.params.userId;
  User.findById(userId)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id'));
      } else {
        next(err);
      }
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      })
        .then((newUser) => {
          res.status(201).send({
            email: newUser.email,
            name: newUser.name,
            about: newUser.about,
            avatar: newUser.avatar,
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new UserExistError('Пользователь с таким email уже существует'));
          } else if (err.name === 'ValidationError') {
            next(new ValidationError('Передан некорректные данные'));
          } else {
            next(err);
          }
        });
    });
};

const updateUserProfile = (req, res, data, next) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, data, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  updateUserProfile(req, res, { name, about });
};
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  updateUserProfile(req, res, { avatar });
};

module.exports = {
  createUser,
  getUsers,
  getUserId,
  updateAvatar,
  updateUserInfo,
  login,
  getCurrentUser,
};
