var uuid=require('uuid')
var jwt=require('jsonwebtoken')
const fs = require('fs')

module.exports = {
    genAuthCode:function (c_client){
        code=uuid.v4().replace("=","a");
        c_client.authorization_codes.push(code);
        c_client.save();
        return code;
    },
    
    genAccessToken:function (){
        payload= {
            "iss":"test_issuer",
            "exp":Date.now()+1000
        }
        access_token=jwt.sign(payload,fs.readFileSync('./private.pem'),{ algorithm: 'RS256' })
        return access_token
    }
}