const FCM = require('fcm-push');
const fcm_config = require('../config/push');
const fcm = new FCM(fcm_config.secret);

module.exports = async (reg_id, title, msg) => {
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
    const push_result = await fcm.send(push_data);    
}
