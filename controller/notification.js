const FCM = require("fcm-push");
const fcm_config = require("../config/push");
const fcm = new FCM(fcm_config.secret);

module.exports = async (reg_id, notification, data) => {
  const push_data = {
    to: reg_id,
    notification,
    data
  };
  await fcm.send(push_data);
};
