var uuid=require('uuid')
var jwt=require('jsonwebtoken')
const fs = require('fs')

function genAuthCode(client_id,redirect_url){
    return uuid.v4().replace("=","a");
}

function genAccessToken(){
    payload= {
        "iss":"test_issuer",
        "exp":Date.now()+1000
    }
    access_token=jwt.sign(payload,fs.readFileSync('./private.pem'),{ algorithm: 'RS256' })
    console.log("dede")
    return access_token
}

module.exports = {
    authUser:  function (req, res, next) {
        client_id=req.query.client_id
        redirect_url=req.query.redirect_url
        if(client_id==undefined || redirect_url==undefined){
            res.status(400)
            res.send("Invalid request")
        }
        //Verify client conf(id+url)
        res.render("index.ejs",{
            client_id:client_id,
            redirect_url:redirect_url
        })
    },
    signIn:  function (req, res, next) {
        client_id=req.body.client_id
        redirect_url=req.body.redirect_url
        username=req.body.username
        password=req.body.password
        if(client_id==undefined||redirect_url==undefined||username==undefined||password==undefined){
            res.status(400)
            res.send("Invalid request")
        }
        //Verify client conf(id+url)
        //Authenticate user creds
        console.log("ws")
        auth_code=genAuthCode(client_id,redirect_url)
        console.log("hcehj")
        res.redirect(redirect_url+"?auth_code="+auth_code)
    },
    getToken:  function (req, res, next) {
        authorization_code=req.body.auth_code
        client_id=req.body.client_id
        client_secret=req.body.client_secret
        redirect_url=req.body.redirect_url
        if(authorization_code==undefined||client_id==undefined||client_secret==undefined||redirect_url==undefined){
            res.status(400)
            res.send("Invalid request")
            return
        }
        //auth client
        //verify auth code
        res.json(genAccessToken())
    }
}