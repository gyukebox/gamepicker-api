const FCM = require('fcm-push');
const fcm_config = require('../config/push');
const fcm = new FCM(fcm_config.secret);

const pushSend = async (reg_id, title, msg) => {
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
    try {
        const res = await fcm.send(push_data);
        console.log(res);
    } catch (err) {
        console.error("error", err);
        return err;
    }
    return;
}

module.exports.pushSend = pushSend;
