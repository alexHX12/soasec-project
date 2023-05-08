const Post=require("../schemas/post")

module.exports={
    getPosts: async function(req,res,next){
        all_posts=await Post.find()
        res.contentType('application/json');
        res.send(all_posts);
    },
    addPost: async function(req,res,next){
        const new_post=new Post(req.body);
        const new_post_db_obj=new_post.save();
        res.status(200).send(new_post_db_obj);
    }
}