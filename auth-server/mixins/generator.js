var uuid=require('uuid')
var jwt=require('jsonwebtoken')
const fs = require('fs')
const User=require('../schemas/user')

module.exports = {
    genAuthCode: async function (c_client,user_id){
        code=uuid.v4().replace("=","a");
        c_client.authorization_codes.push({"user_id":user_id,"code":code});
        await c_client.save();
        return code;
    },
    
    genAccessToken:function (user){
        payload= {
            "iss":"test_issuer",
            "sub":user._id,
            "exp":Date.now()+1000,
            "scope":"my_amazing_scope"
        }
        access_token=jwt.sign(payload,fs.readFileSync('./private.pem'),{ algorithm: 'RS256' })
        return access_token
    },

    genIDToken: function(user){
        payload= {
            "iss":"test_issuer",
            "sub":user._id,
            "exp":Date.now()+1000,
            "name":user.name,
            "email":user.username
        }
        id_token=jwt.sign(payload,fs.readFileSync('./private.pem'),{ algorithm: 'RS256' })
        return id_token
    }
}