require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const dbConCheck = require('./db/dbConnectCheck');
const { sessionLogger, userName } = require('./middleware/sessionLogger');

const userRouter = require('./routes/user');
// const mainRouter = require('./routes/main');

const app = express();
const PORT = process.env.PORT ?? 3000;
dbConCheck();

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

app.use('/', userRouter);
// app.use('/', mainRouter);

app.use(sessionLogger);
app.use(userName);

app.get('/', (req, res) => {
  res.render('main');
});

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}!`);
});
