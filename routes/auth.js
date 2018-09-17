const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('../config/jwt-config');
const ExtractJwt = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const param = {
    secretOrKey: config.jwtSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeader()
}

module.exports = function() {
    const strategy = new Strategy(params, (payload, done) => {
        //user에 id가 일치하는 데이터
        //id name email password
        if(user) {
            return done(null, {
                id: user.id
            });
        } else {
            return done(new Error('User not found!'), null);
        }
    });
    passport.use(strategy);
    return {
        initialize: () => {
            return passport.initialize();
        },
        authenticate: () => {
            return passport.authenticate('jwt',config.jwtSession);
        }
    };
};