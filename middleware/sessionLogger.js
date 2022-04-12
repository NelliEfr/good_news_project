const userName = (req, res, next) => {
  res.locals.user = req.session?.user;
  next();
};
const sessionLogger = (req, res, next) => {
  console.log(req.session);
  next();
};
module.exports = { userName, sessionLogger };
