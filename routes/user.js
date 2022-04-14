const bcrypt = require('bcrypt');
const router = require('express').Router();
const { parse } = require('rss-to-json');
const { sequelize, Post, User } = require('../db/models');

async function parsing() {

  for (let i = 0; i < 10; i++) {
    (async () => {
      try {
        const rssrbc = await parse('https://rssexport.rbc.ru/rbcnews/news/30/full.rss');
        const rbcTitile = JSON.stringify(rssrbc.items[i].title);
        const rbcDesctiption = JSON.stringify(rssrbc.items[i].description);
        const rbcLink = JSON.stringify(rssrbc.items[i].link);
        const rbcDate = JSON.stringify(rssrbc.items[i].published);
        const findDublesRbc = await Post.findAll()
        const filterRbc = await findDublesRbc.filter((el) => el.title === rbcTitile.slice(1, -1))
  
        if (findDublesRbc.length === 0) {
          await Post.create({
            title: rbcTitile.slice(1, -1),
            description: rbcDesctiption.slice(1, -1),
            link: rbcLink.slice(1, -1),
            date: rbcDate,
          });
        }

        if (!filterRbc.length) {
          await Post.create({
            title: rbcTitile.slice(1, -1),
            description: rbcDesctiption.slice(1, -1),
            link: rbcLink.slice(1, -1),
            date: rbcDate,
          });
        }
      } catch (error) {
        console.log('error', { error: error.message });
      }
    })();
  }

  for (let i = 0; i < 10; i++) {
    (async () => {
      try {
        const rssria = await parse('https://ria.ru/export/rss2/archive/index.xml');
        const riaTitile = JSON.stringify(rssria.items[i].title);
        const riaDesctiption = JSON.stringify(rssria.items[i].description);
        const riaLink = JSON.stringify(rssria.items[i].link);
        const riaDate = JSON.stringify(rssria.items[i].published);
        const findDublesRia = await Post.findAll()
        const filterRia = await findDublesRia.filter((el) => el.title === riaTitile.slice(1, -1))

        if (findDublesRia.length === 0) {
          await Post.create({
            title: riaTitile.slice(1, -1),
            description: riaDesctiption.slice(1, -1),
            link: riaLink.slice(1, -1),
            date: riaDate,
          });
        }

        if (!filterRia.length) {
          await Post.create({
            title: riaTitile.slice(1, -1),
            description: riaDesctiption.slice(1, -1),
            link: riaLink.slice(1, -1),
            date: riaDate,
          });
        }
      } catch (error) {
        console.log('error', { error: error.message });
      }
    })();
  }
}

router.get('/', async (req, res) => {
  await parsing();

  try {
    const bodyObj = []
    const bodyTitle = []
    const entries = await Post.findAll();
    const searchUniq = entries.forEach((el) => {
      if (!bodyTitle.includes(el.title)) {
        bodyTitle.push(el.title)
        bodyObj.push(el)
      }
    });
    console.log('============>', bodyObj.length)
    res.render('main', { bodyObj });
  } catch (error) {
    res.render('error', { error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { key } = req.body;
    res.json(key);
  } catch (err) {
    res.json(err);
    console.error(err);
  }
});

router.get('/registration', (req, res) => {
  res.render('registration');
});

router.post('/registration', async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const hashPassword = await bcrypt.hash(password, 5);
    const addUser = await User.create({ name, password: hashPassword, email });
    req.session.user = addUser.name;
    req.session.userId = addUser.id;
    res.json(addUser);
  } catch (err) {
    res.json(err);
    console.error(err);
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    const loginUser = await User.findOne({
      where: { email },
      raw: true,
    });
    let passwordCheck;
    if (loginUser !== null) {
      passwordCheck = await bcrypt.compare(password, loginUser.password);
    }
    if (passwordCheck && loginUser !== null) {
      req.session.user = loginUser.name;
      req.session.userId = loginUser.id;
      res.json({ name: loginUser.name, isAutorise: true });
    } else {
      res.json('errors');
    }
  } catch (err) {
    console.log(err);
    res.json(err);
  }
});

router.get('/logout', async (req, res) => {
  if (req.session.user) {
    await req.session.destroy();
    res.clearCookie('MyCookieName');
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});

module.exports = router;
