const jwt = require('jwt-simple');
const config = require('../config/jwt');

module.exports = {
    encode: (payload) => {
        return jwt.encode(payload, config.secret);
    },
    decode: (token) => {
        return jwt.decode(token, config.secret);
    }
}
