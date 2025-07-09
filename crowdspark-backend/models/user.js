const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    default: "user", 
  },
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
