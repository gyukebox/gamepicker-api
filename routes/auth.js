const express = require("express");
const router = express.Router();
const jwt = require("../model/jwt");
const nodemailer = require("nodemailer");
const mail_config = require("../config/mail");
const pbkdf2Password = require("pbkdf2-password");
const hasher = pbkdf2Password();

/**
 * @api {post} /auth/login Login
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiParam {Object} body
 * @apiParam {String} body.email Email of the user
 * @apiParam {String} body.password Password of the user
 *
 * @apiSuccess {String} user_id The ID of this user
 * @apiSuccess {String} token Token of this user
 * @apiSuccess {Boolean} admin The value to check if this user is an administrator
 * @apiSuccessExample SUCCESS:
 *      HTTP/1.1 200 OK
 *      {
 *          "user_id": 23,
 *          "token": "rgewoubngkjgsdbfkhgb"
 *          "admin": true
 *      }
 *
 * @apiError USER_NOT_FOUND Can not find a user with email
 * @apiError INCORRECT_PASSWORD Can not find a user with email and password
 * @apiError MAIL_AUTHENTICATION_FAILED This account is not activated by email authentication
 *
 * @apiErrorExample INCORRECT_PASSWORD:
 *      HTTP/1.1 401 Unauthorized
 *      {
 *          "code": "INCORRECT_PASSWORD",
 *          "message": "Can not find a user with email and password"
 *      }
 * @apiErrorExample MAIL_AUTHENTICATION_FAILED:
 *      HTTP/1.1 401 Unauthorized
 *      {
 *          "code": "MAIL_AUTHENTICATION_FAILED",
 *          "message": "This account is not activated by email authentication"
 *      }
 * @apiErrorExample USER_NOT_FOUND:
 *      HTTP/1.1 404 Not Found
 *      {
 *          "code": "USER_NOT_FOUND",
 *          "message": "Can not find a user with email"
 *      }
 */
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const getHash = (salt, password) =>
    new Promise((resolve, reject) => {
      hasher({ password: password, salt: salt }, (err, pass, salt, hash) => {
        if (err) reject(err);
        else resolve(hash);
      });
    });
  try {
    const [
      [user]
    ] = await pool.query(
      `SELECT salt, id, active, password FROM users WHERE email = ?`,
      [email]
    );
    if (!user) throw { status: 404, message: "User not found" };
    const hash = await getHash(user.salt, password);
    if (hash != user.password)
      throw { status: 400, message: "Incorrect password" };
    if (!user.active)
      throw { status: 401, message: "Mail authentication required" };
    const [
      [admin]
    ] = await pool.query(`SELECT user_id FROM admin WHERE user_id = ?`, [
      user.id
    ]);

    if (admin) {
      const [
        [admin]
      ] = await pool.query(`SELECT user_id FROM admin WHERE user_id = ?`, [
        user.id
      ]);
      if (!admin) throw { status: 403, message: "Admin not found" };
    }
    await pool.query(`UPDATE users SET updated_at = NOW() WHERE id = ?`, [
      user.id
    ]);
    res.status(200).json({
      user_id: user.id,
      token: jwt.encode({ email: email, password: hash }),
      admin: !!admin
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /auth/register Register
 * @apiName Register
 * @apiGroup Auth
 *
 * @apiParam {Object} query
 * @apiParam {String} query.auth Type of social login
 * @apiParam {Object} body
 * @apiParam {String} body.name Name of the user
 * @apiParam {String} body.email Email of the user
 * @apiParam {String} body.password Password of the user
 * @apiParam {String} body.birthday Birthday of the user
 * @apiParam {String} body.Gender of the user
 *
 * @apiUse SUCCESS_EMPTY
 */
router.post("/register", async (req, res, next) => {
  const { name, email, password, birthday, gender } = req.body;
  const { auth } = req.query;

  const encrypt = password =>
    new Promise((resolve, reject) => {
      hasher({ password: password }, (err, pass, salt, hash) => {
        if (err) reject(err);
        else resolve({ hash: hash, salt: salt });
      });
    });
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: mail_config
  });
  try {
    const { salt, hash } = await encrypt(password);
    const token = jwt.encode({ email: email, password: hash });
    if (auth === "google") {
      await pool.query(
        "INSERT INTO users(name, email, password, birthday, gender, salt, active) VALUES (?, ?, ?, ?, ?, ?, 1)",
        [name, email, hash, birthday, gender, salt]
      );
    } else {
      await pool.query(
        "INSERT INTO users(name, email, password, birthday, gender, salt) VALUES (?, ?, ?, ?, ?, ?)",
        [name, email, hash, birthday, gender, salt]
      );
      await transporter.sendMail({
        from: "게임피커 인증팀",
        to: email,
        subject: "GamePicker 인증",
        html: `<p>Test</p><a href='http://api.gamepicker.co.kr/auth/activate?token=${token}'>인증하기</a>`
      });
    }
    res.status(204).json();
  } catch (err) {
    next(err);
  }
});

//FIXME: change login when web published
router.get("/activate", async (req, res, next) => {
  const { token } = req.query;
  const { email, password } = jwt.decode(token);
  try {
    const [
      rows
    ] = await pool.query(
      "UPDATE users SET active = 1 WHERE email = ? AND password = ?",
      [email, password]
    );
    if (rows.affectedRows === 0)
      throw { status: 404, message: "User not found" };
    res.status(301).redirect("http://www.gamepicker.co.kr");
  } catch (err) {
    next(err);
  }
});

/**
 * @api {post} /auth/forgot Reset password
 * @apiName ResetPassword
 * @apiGroup Auth
 *
 * @apiParam {Object} body
 * @apiParam {String} body.email Email of the user
 *
 * @apiUse SUCCESS_EMPTY
 */
router.post("/forgot", async (req, res, next) => {
  const { email } = req.body;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: mail_config
  });
  try {
    const [
      [user]
    ] = await pool.query(`SELECT email, password FROM users WHERE email = ?`, [
      email
    ]);
    if (!user) throw { status: 404, message: "User not found" };
    const token = jwt.encode(user);
    await transporter.sendMail({
      from: "Gamepicker" + mail_config.user,
      to: email,
      subject: "GamePicker 비밀번호 재설정",
      html: `<p>Test</p><a href='http://www.gamepicker.co.kr/gamepicker/resetpw.php?token=${token}'>비밀번호 재설정 하기</a>`
    });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
