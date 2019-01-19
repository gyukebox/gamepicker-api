const FCM = require('fcm-push');
const path = require('path');
const fcm_config = require('../../config/push');
const fcm = new FCM(fcm_config.secret);

module.exports = async (req, res, next) => {
    const { age, gender, lastLogin, title, content } = req.body;
    //const users = await getTargets(age, gender, lastLogin);
    //for (const user of users) {
        //await pushSend(user.osType, user.reg_id, title, content);
    //}
    const reg_id = 'duXqz72gRi8:APA91bG6JKCWkBaHjamI7bQhA_NOwUaNfmDkwyT-OFBAi27z349j6aL88zoxYaTD3BSo0iNXCaBLxvy8tDM1yM8KX-yCGiVLXISjk11VeuT7shLZ5ozB7Jnxy9yKyX6ANlMz603yc50a';
    pushSend('android', reg_id, 'tttt', 'aaaa');
}

const getTargets = async (age, gender, lastLogin) => {
    let sql = `SELECT osType, reg_id FROM users`;
    const options = [];
    const conditions = [];
    
    const today = new Date();
    const year = today.getFullYear();
    if (!isNan(age.from)) {
        today.setFullYear(year-age.from);
        conditions.push(`birthday < ?`);
        options.push(today.toISOString().slice(0,10));
    }
    if (!isNan(age.to)) {
        today.setFullYear(year - age.to);
        conditions.push(`birthday > ?`);
        options.push(today.toISOString().slice(0,10));
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
        if (idx !== conditions.length-1) {
            sql += ` AND `
        }
    });

    const [users] = await pool.query(sql, options);
    return users;
}

const pushSend = (osType, reg_id, title, msg) => {
    const push_data = {
        to: reg_id,
        notification: {
            title: title,
            body: msg,
            sound: 'default',
            click_action: "FCM_PLUGIN_ACTIVITY",
            icon: "fcm_push_icon"
        }
    }
    fcm.send(push_data);
    /*
    try {
        const res = await fcm.send(push_data);
        console.log(res);
    } catch (err) {
        console.error(err);
        return err;
    }
    */
}

module.exports = pushSend;