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
    
    genAccessToken:function (client_app,user,audience){
        app_roles=null;
        app_scopes=[];
        if(user.app_roles!=undefined&&client_app.roles!=undefined){
            user.app_roles.forEach(el => {
                if(el.app_id==client_app._id){
                    app_roles=el.roles;
                }
            });
            client_app.roles.forEach(c_app_role => {
                app_roles.forEach(u_app_role => {
                    if(c_app_role._id==u_app_role){
                        c_app_role.scopes.forEach(c_app_scope => {
                            app_scopes.push(c_app_scope);
                        });
                    }
                });
            });
        }
        payload= {
            "aud":audience,
            "iss":"auth_server",
            "sub":user._id,
            "exp":Date.now()+1000*1200,
            "scope":app_scopes
        }
        access_token=jwt.sign(payload,fs.readFileSync('./private.pem'),{ algorithm: 'RS256' })
        return access_token
    },

    genIDToken: function(client_app,user){
        payload= {
            "aud":client_app.redirect_url.split('?')[0],        //for now OK
            "iss":"auth_server",
            "sub":user._id,
            "exp":Date.now()+1000*1200,
            "name":user.name,
            "email":user.username,
            "image":user.image
        }
        id_token=jwt.sign(payload,fs.readFileSync('./private.pem'),{ algorithm: 'RS256' })
        return id_token
    }
}