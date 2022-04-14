require('dotenv').config();
const { parse } = require('rss-to-json');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const hbs = require('hbs');
const { sequelize, Post, User } = require('./db/models');

const session = require('express-session');
const FileStore = require('session-file-store')(session);
const dbConCheck = require('./db/dbConnectCheck');
const { sessionLogger, userName } = require('./middleware/sessionLogger');
const userRouter = require('./routes/user');

const app = express();
const PORT = 3000;

const sessionConfig = {
  store: new FileStore(),
  name: 'MyCookieName',
  secret: process.env.SESSION_SECRET ?? 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 12,
    httpOnly: true,
  },
};

app.use(session(sessionConfig));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(`${__dirname}/views/partials`);
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', userRouter);
app.use(sessionLogger);
app.use(userName);

app.listen(PORT, async () => {
  console.log(`Server started on PORT ${PORT}!`);
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД успешно');
  } catch (error) {
    console.log('Не удалось подключиться к БД');
    console.log(error.message);
  }
});
