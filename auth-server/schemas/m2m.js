const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const m2m = new Schema(
  {
    // AUTO-GENERATED ID(client_id)

    name: {
      type: String,
      required: true
    },

    client_secret: {
      type: String,
      required: true
    }
  },
  {
    collection: "m2m",
  }
);


const M2M = mongoose.model("M2M", m2m);

module.exports = M2M;
