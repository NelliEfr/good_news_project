const bcrypt = require('bcrypt');
const router = require('express').Router();
const { User } = require('../db/models');

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
    res.render('main');
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
    console.log('0');
    const { name, password } = req.body;
    const loginUser = await User.findOne({
      where: { name },
      raw: true,
    });
    let passwordCheck;
    if (loginUser !== null) {
      passwordCheck = await bcrypt.compare(password, loginUser.password);
      console.log('1');
    }
    if (passwordCheck && loginUser !== null) {
      req.session.user = loginUser.name;
      req.session.userId = loginUser.id;
      res.json(loginUser);
      res.render('main');
      res.redirect('main');
      console.log('2');
    } else {
      res.json('errors');
      console.log('3');
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
