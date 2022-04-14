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

app.get('/', async (req, res) => {
  try {
    const entries = await Post.findAll();
    res.render('main', { entries });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

app.post('/', async (req, res) => {
  for (let i = 0; i < 10; i++) {
    (async () => {
      try {
        const rssrbc = await parse('https://rssexport.rbc.ru/rbcnews/news/30/full.rss');
        const rbcTitile = JSON.stringify(rssrbc.items[i].title);
        const rbcDesctiption = JSON.stringify(rssrbc.items[i].description);
        const rbcLink = JSON.stringify(rssrbc.items[i].link);
        const rbcDate = JSON.stringify(rssrbc.items[i].published);
        await Post.create({
          title: rbcTitile.slice(1, -1),
          description: rbcDesctiption.slice(1, -1),
          link: rbcLink.slice(1, -1),
          date: rbcDate,
        });
      } catch (error) {
        console.log('error', { error: error.message });
      }

      try {
        const rssria = await parse('https://ria.ru/export/rss2/archive/index.xml');
        const riaTitile = JSON.stringify(rssria.items[i].title);
        const riaDesctiption = JSON.stringify(rssria.items[i].description);
        const riaLink = JSON.stringify(rssria.items[i].link);
        const riaDate = JSON.stringify(rssria.items[i].published);
        await Post.create({
          title: riaTitile.slice(1, -1),
          description: riaDesctiption.slice(1, -1),
          link: riaLink.slice(1, -1),
          date: riaDate,
        });
      } catch (error) {
        console.log('error', { error: error.message });
      }
    })();
  }
  res.redirect('/');
});

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
