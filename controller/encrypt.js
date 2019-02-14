const pbkdf2Password = require('pbkdf2-password');
const hasher = pbkdf2Password(); 

module.exports = (password) => new Promise((resolve, reject) => {
    hasher({ password: password }, (err, pass, salt, hash) => {
        if (err)    reject(err);
        else        resolve({hash: hash, salt: salt});
    })
});