const User=require('../schemas/user')
const basicError=require('../mixins/basicError')
const verifyClient = require('../mixins/verifyClient')
const generator=require('../mixins/generator')
const sha256 = require('js-sha256');
const base64url = require('base64url');

module.exports = {
    //this function define how user will authenticate to the Auth server
    //it then render the login page with the client_id and redirect_url
    //corresponding to the client app
    authUser: async function (req, res, next) {
        client_id=req.query.client_id
        redirect_url=req.query.redirect_url
        code_challenge=req.query.code_challenge
        c_client=await verifyClient.verifyClientConf(client_id,redirect_url)
        if(c_client==null||code_challenge==undefined){
            basicError.invalidRequest(res)
            return
        }
        c_client.code_challenges.push({session_id:"1",hash:code_challenge})
        c_client.save()
        res.render("index.ejs",{
            client_id:client_id,
            client_name:c_client.name,
            redirect_url:redirect_url
        })
    },
    //verify credentials and redirect to the 
    //callback url(redirect_url) with the authorization code
    signIn: async function (req, res, next) {
        client_id=req.body.client_id
        redirect_url=req.body.redirect_url
        username=req.body.username
        password=req.body.password
        c_client=await verifyClient.verifyClientConf(client_id,redirect_url)
        if(c_client==null){
            basicError.invalidRequest(res)
            return
        }
        user=await User.findOne({ username: username })
        //Crypt password
        if(user.password!=password){
            basicError.unauthorized(res)
            return
        }
        auth_code=generator.genAuthCode(c_client)
        res.redirect(redirect_url+"?auth_code="+auth_code)
    },
    //invoked by the client app to request an access token
    getToken: async function (req, res, next) {
        authorization_code=req.body.auth_code
        client_id=req.body.client_id
        code_verifier=req.body.code_verifier
        redirect_url=req.body.redirect_url
        c_client=await verifyClient.verifyClientConfExt(client_id,redirect_url,authorization_code)
        if(c_client==null||code_verifier==undefined){
            basicError.invalidRequest(res)
            return
        }
        codeT=null
        c_client.code_challenges.forEach(el => {
            //get the last one
            if(el.session_id==1){
                codeT=el
            }
        });
        if(codeT!=null){
            bCodeT=base64url.decode(codeT.hash)
            cVerH=sha256(base64url.decode(code_verifier))
            if(bCodeT!=cVerH){
                basicError.unauthorized(res)
                return
            }
        }
        res.json(generator.genAccessToken())
    }
}