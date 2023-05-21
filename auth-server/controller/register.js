const ClientApp=require('../schemas/client_app')

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
    }
}