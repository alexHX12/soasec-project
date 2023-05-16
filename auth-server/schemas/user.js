const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user = new Schema(
  {
    // AUTO-GENERATED ID

    username: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },
  },
  {
    collection: "user",
  }
);


const User = mongoose.model("User", user);

module.exports = User;
