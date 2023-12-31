const ctrl = {};
const model = require("../model/users");
const respone = require("../utils/respon");
const argon = require("argon2");
const jwt = require("../utils/jwt");

ctrl.Login = async (req, res) => {
  try {
    const passDb = await model.getByUser(req.body.username);
    if (passDb.length <= 0) {
      return respone(res, 401, "username tidak terdaftar");
    }

    const passUser = req.body.password;
    const check = await argon.verify(passDb[0].password, passUser);
    if (check) {
      const token = jwt.genToken(passDb[0].username, passDb[0].role);
      return respone(res, 200, {
        message: "token created",
        token,
      });
    } else {
      return respone(res, 401, "password salah");
    }
  } catch (error) {
    console.log(error);
    return respone(res, 500, error.message);
  }
};

module.exports = ctrl;
