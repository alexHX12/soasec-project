const ClientApp=require('../schemas/client_app')

module.exports = {
    verifyClientConf: async function (client_id,redirect_url) {
        c_client=null
        //check if params are defined
        if(client_id==undefined || redirect_url==undefined){
            return null
        }
        //check if a client app with the provided id exists
        try {
            c_client=await ClientApp.findById(client_id)
        } catch (error) {
            return null
        }
        //check the correct association with the callback url
        if(c_client.redirect_url!=redirect_url){
            return null
        }
        return c_client
    },

    verifyClientConfExt: async function(client_id,redirect_url,authorization_code){
        c_client=await this.verifyClientConf(client_id,redirect_url)
        if(c_client==null||authorization_code==undefined){
            return null
        }
        if(!c_client.authorization_codes.includes(authorization_code)){
            return null
        }
        return c_client
    }
}