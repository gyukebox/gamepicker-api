var passport = require('passport');
var passportJWT = require('passport-jwt');
var cfg = require('../config/jwt-config');
var ExtractJwt = passportJWT.ExtractJwt;
var Strategy = passportJWT.Strategy;
const params = {
    secretOrKey: cfg.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
}

const Database = require('../model/Database');
const database = new Database();

module.exports = () => {
    var strategy = new Strategy(params, function (payload, done) {
        database.query(`SELECT id, email, password FROM accounts WHERE email=${payload.id}`)
        .then((rows) => {
            const user = rows[0];
            if(!user)
                done(new Error('User not found'), null);
            else
                return done(null, {id: user.id});
        });
    });
    passport.use(strategy);
    return {
        initialize: () => {return passport.initialize()},
        authenticate: () => {return passport.authenticate('jwt', cfg.jwtSession)}
    };
};

