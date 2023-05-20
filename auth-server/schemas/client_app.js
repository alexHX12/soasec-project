const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientApp = new Schema(
  {
    // AUTO-GENERATED ID(client_id)

    name: {
      type: String,
      required: true
    },

    redirect_url: {
      type: String,
      required: true
    },

    authorization_codes:[
      {
        user_id:{
          type:String,
          required:true
        },
        code:{
          type:String,
          required:true
        }
      }
    ],

    code_challenges:[
      {
        state:{
          type:String,
          required:true
        },
        hash:{
          type:String,
          required:true
        }
      }
    ]
  },
  {
    collection: "client_app",
  }
);


const ClientApp = mongoose.model("ClientApp", clientApp);

module.exports = ClientApp;
