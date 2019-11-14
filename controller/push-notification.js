const FCM = require("fcm-push");
const fcm_config = require("../config/push");
const fcm = new FCM(fcm_config.secret);
console.log(fcm_config.secret);

module.exports = async (age, lastLogin, gender, reserve, title, content) => {
  console.log(lastLogin);

  const users = await getTargets(age, gender, lastLogin);
  console.log(users);

  for (const user of users) {
    const res = await pushSend(user.osType, user.reg_id, title, content);
    console.log(res);
  }

  const reg_id =
    "duXqz72gRi8:APA91bG6JKCWkBaHjamI7bQhA_NOwUaNfmDkwyT-OFBAi27z349j6aL88zoxYaTD3BSo0iNXCaBLxvy8tDM1yM8KX-yCGiVLXISjk11VeuT7shLZ5ozB7Jnxy9yKyX6ANlMz603yc50a";
};

const getTargets = async (age, gender, lastLogin) => {
  let sql = `SELECT os_type, reg_id FROM users`;
  const options = [];
  const conditions = [];
  const today = new Date();
  const year = today.getFullYear();
  if (!isNaN(age.from)) {
    today.setFullYear(year - age.from);
    conditions.push(`birthday < ?`);
    options.push(today.toISOString().slice(0, 10));
  }
  if (!isNaN(age.to)) {
    today.setFullYear(year - age.to);
    conditions.push(`birthday > ?`);
    options.push(today.toISOString().slice(0, 10));
  }

  if (gender) {
    conditions.push(`gender = ?`);
    options.push(gender);
  }

  if (lastLogin.from) {
    conditions.push(`updated_at > ?`);
    options.push(lastLogin.from);
  }

  if (lastLogin.to) {
    conditions.push(`updated_at < ?`);
    options.push(lastLogin.to);
  }

  conditions.forEach((cond, idx) => {
    if (idx === 0) {
      sql += ` WHERE `;
    }
    sql += cond;
    sql += ` AND `;
  });
  sql += `reg_id IS NOT NULL`;
  console.log(sql);
  console.log(options);

  const [users] = await pool.query(sql, options);
  return users;
};

const pushSend = async (osType, reg_id, title, msg) => {
  const push_data = {
    to: reg_id,
    notification: {
      title: title,
      body: msg,
      sound: "default",
      click_action: "FCM_PLUGIN_ACTIVITY",
      icon: "fcm_push_icon"
    }
  };
  fcm.send(push_data);
  try {
    const res = await fcm.send(push_data);
    console.log(res);
  } catch (err) {
    console.error("error", err);
    return err;
  }
  return;
};

module.exports.pushSend = pushSend;
