const jwt = require('jwt-simple');
const secret = require('../config/jwt').secret;
const mysql = require('mysql2/promise');
const db = require('../config/database');
const pool = mysql.createPool(db);

module.exports = () => {
    return {
        user: async (req) => {
            const token = req.headers['x-access-token'];
            if (!token)
                throw { status: 400, message: 'Token required' }
            const { email, password } = jwt.decode(token, secret);
            const [[user]] = await pool.query(`SELECT id FROM users WHERE email = ? AND password = ?`, [email, password]);
            if (!user)
                throw { status: 404, message: 'User not found' }
            return user.id;
        },
        admin: async (req) => {
            const token = req.headers['x-access-token'];
            if (!token)
                throw { status: 400, message: 'Token required' }
            const { email, password } = jwt.decode(token, secret);
            const [[admin]] = await pool.query(`SELECT user_id FROM admin LEFT JOIN users ON users.id = admin.user_id WHERE email = ? AND password = ?`, [email, password]);
            if (!admin)
                throw { status: 401, message: 'Admin authentication required' }
            console.log('success');
            return admin.user_id;
        }
    }
}