const basicError = require("../../mixins/basicError");
const User = require("../../schemas/user");

module.exports = {
    getUserInfo: async function (req, res, next) {
        user_id=req.query.user_id;
        if(user_id==undefined||user_id==""){
            basicError.invalidRequest(res);
            return;
        }
        user=null
        try{
            user=await User.findById(user_id);
        } catch (error) {
            
        }
        if (user==null){
            basicError.unauthorized(res)
            return
        }
        res.json({
            "username": user.username,
            "name":user.name,
            "image":user.image
        })
    }
}