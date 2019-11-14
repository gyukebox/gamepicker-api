const multer = require("multer");
const cert = require("../controller/certification")().user;
const jwt = require("../model/jwt");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: async (req, file, cb) => {
    const user_id = await cert(req);
    const filename = jwt.encode({
      user_id,
      object: "profile"
    });
    cb(null, filename + ".jpg");
  }
});
module.exports = multer({ storage });
