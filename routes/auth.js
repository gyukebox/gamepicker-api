const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('../config/jwt-config');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

module.exports = function() {
    passport.use(new Strategy(params, (payload, done) => {
        //user에 id가 일치하는 데이터
        //id name email password
        const conn = mysql.createConnection(dbConfig);
        conn.query(`SELECT email FROM accounts WHERE email=${payload.id}`, (err, rows) => {
            if (err)        return done(err, false);
            if (rows[0])    return done(null, user);
            else            return done(null, false);
        });
    }));
};