const express = require('express');
const router = express.Router();

const mysql = require('mysql');
const dbConfig = require('../config/db-config');

const passport = require('passport');

router.get('/',(req, res) => {

});

router.put('/',(req, res) => {

})

router.post('/login', passport.authenticate('local', {
    failureRedirect: '/'
}), (req,res) => {
    res.redirect('/');
});


module.exports = router;