const Post=require("../schemas/post")

async function getUserPosts(req,res,next){
    if(req.jwt_decoded.sub!=req.query.user_id){
        res.status(403);
        res.end();
        return;
    }
    const user_posts=await Post.find({ user_id: req.query.user_id});
    res.status(200).send(user_posts);
}

module.exports={
    getPosts: async function(req,res,next){
        if(req.query.user_id!=""&&req.query.user_id!=null){
            await getUserPosts(req,res,next)
        }else{
            all_posts=await Post.find()
            res.contentType('application/json');
            res.send(all_posts);
        }
    },
    getSinglePost: async function(req,res,next){
        single_post=await Post.findById(req.params.id);
        res.contentType('application/json');
        res.send(single_post);
    },
    addPost: async function(req,res,next){
        new_post_req={
            "user_id":req.jwt_decoded.sub,
            "date":Date.now(),
            "short_text":req.body.short_text,
            "text":req.body.text,
            "members_only":req.body.members_only=="true",
            "author":req.body.author,
            "title":req.body.title,
            "image":req.body.image
        }
        const new_post=new Post(new_post_req);
        const new_post_db_obj=await new_post.save();
        res.status(200).send(new_post_db_obj);
    }
}