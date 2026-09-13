const Activity = require("../models/Activity");

const logActivity = async (user, type, description, meta = {}) => {
  try {
    await Activity.create({ user, type, description, meta });
  } catch (error) {
    console.warn("Activity logging failed:", error.message);
  }
};

module.exports = logActivity;
