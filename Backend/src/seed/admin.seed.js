const mongoose = require("mongoose");
const dotenv = require("dotenv");

const User = require("../models/User");

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = String(process.env.ADMIN_EMAIL || "")
      .toLowerCase()
      .trim();

    const password = String(process.env.ADMIN_PASSWORD || "");

    const name = String(process.env.ADMIN_NAME || "Aurevyn Admin").trim();

    if (!email) {
      throw new Error("ADMIN_EMAIL is required");
    }

    if (password.length < 6) {
      throw new Error("ADMIN_PASSWORD must be at least 6 characters");
    }

    let user = await User.findOne({
      email,
    }).select("+password");

    if (user) {
      user.name = name;
      user.email = email;
      user.password = password;
      user.role = "admin";

      await user.save();
    } else {
      user = new User({
        name,
        email,
        password,
        role: "admin",
      });

      await user.save();
    }

    console.log(`Admin ready: ${user.email}`);

    console.log(`Role: ${user.role}`);

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("Admin seed error:", error.message);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
};

run();
