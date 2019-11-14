const jwt = require("jwt-simple");
const config = require("../config/jwt");

module.exports = {
  encode: payload => {
    return jwt.encode(payload, config.secret);
  },
  decode: token => {
    try {
      const res = jwt.decode(token, config.secret);
      return res;
    } catch (err) {
      throw err;
    }
  }
};
