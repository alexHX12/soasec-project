const mongoose = require("mongoose");

class dbConnection {
  static db = null;
  static admin = null;
  static url = "mongodb://root:test@127.0.0.1:27017/blog?authSource=admin";
  static options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  static connectToDB() {
    if (!this.db) {
      mongoose.connection.on("open", function (ref) {
        console.log("Connected to mongo server.");
      });

      mongoose.connection.on("error", function (err) {
        console.log("Could not connect to mongo server!");
        console.log(err);
      });

      mongoose
        .connect(this.url, this.options)
        .then(() => {
          console.log("DB init success!");
        })
        .catch(() => {
          console.log("DB init failed!");
        });
        this.db = mongoose.connection;
    }
    return this.db;
  }
}

module.exports = { dbConnection };