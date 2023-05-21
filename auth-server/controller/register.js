const ClientApp=require('../schemas/client_app')
const User=require('../schemas/user')
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    registerApp: async function (req, res, next) {
        res.render("app-register.ejs");
    },
    registerAppBackend: async function (req, res, next) {
        app_name=req.body.app_name
        redirect_url=req.body.redirect_url
        if(app_name==undefined||app_name==""||redirect_url==undefined||redirect_url==""){
            res.status(400);
            res.end();
        }else{
            const new_app = new ClientApp({ "name": app_name, "redirect_url": redirect_url });
            new_app.save();
            res.json({"client_id":new_app._id})
        }
    },
    registerUser: async function (req, res, next) {
        client_id=req.query.client_id
        redirect_url=req.query.redirect_url
        code_challenge=req.query.code_challenge
        state=req.query.state
        res.render("user-register.ejs",{
            client_id:client_id,
            redirect_url:redirect_url,
            code_challenge:code_challenge,
            state:state
        });
    },
    registerUserBackend: async function (req, res, next) {
        username=req.body.username
        u_name=req.body.name
        password=req.body.password
        if(username==undefined||username==""||u_name==undefined||u_name==""||password==undefined||password==""){
            res.status(400);
            res.end();
        }else{
            bcrypt.hash(password, saltRounds, function(err, hash) {
                const new_user = new User({ "username": username, "name": u_name , "password": hash});
                new_user.save();
                res.end();
            });            
        }
    },
}