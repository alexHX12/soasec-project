const { authSdk } = require("../auth_sdk");
const Post=require("../schemas/post");

module.exports = {
    getAuthors: async function (req, res, next) {
        all_authors = await Post.aggregate( 
            [
                {$group: { "_id": { user_id: "$user_id", author: "$author" } } }
            ]
        )
        var result=[];
        for(var i=0;i<all_authors.length;i++){
            user_info=await authSdk.getUserInfo(all_authors[i]._id.user_id);
            tmp_obj={};
            tmp_obj.user_id=all_authors[i]._id.user_id;
            tmp_obj.author=all_authors[i]._id.author;
            tmp_obj.user_image=user_info.image;
            result.push(tmp_obj);
        }
        res.contentType('application/json');
        res.send(result);
    }
}