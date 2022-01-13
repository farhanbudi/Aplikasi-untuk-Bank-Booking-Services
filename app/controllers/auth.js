require("dotenv").config();
const db = require("../models");
const User = db.users;
const bcrypt = require("bcryptjs");
const utils = require("../utils");

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (user == null) {
    return res.status(401).send({ error: "email salah" });
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (err) {
      return next(new Error(e));
    }

    if (result == true) {
      const { nama, id, role } = user;
      const token = utils.jwtToken.createToken(user);
      return res.status(200).send({ token, user: { id, nama, email, role } });
    } else return res.status(401).send({ error: "password salah" });
  });
};

exports.logoutUser = async (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
