const Post=require("../schemas/post");

async function getUserPosts(req,res,next){
    if(req.jwt_decoded.sub!=req.query.user_id){
        res.status(403);
        res.end();
        return;
    }
    const user_posts=await Post.find({ user_id: req.query.user_id});
    res.status(200).send(user_posts);
}

async function getPopularPosts(req,res,next){
    const popular_posts=await Post.find().sort({"views":"desc"}).limit(req.query.limit);
    res.status(200).send(popular_posts);
}

module.exports={
    getPosts: async function(req,res,next){
        if((req.query.user_id!=""&&req.query.user_id!=null)&&(req.query.popular==""||req.query.popular==null)){
            await getUserPosts(req,res,next);
        }else if(req.query.popular=="1"&&req.query.popular!=null&&req.query.limit!=""&&req.query.limit!=null){
            await getPopularPosts(req,res,next);
        }else{
            all_posts=await Post.find()
            res.contentType('application/json');
            res.send(all_posts);
        }
    },
    getSinglePost: async function(req,res,next){
        single_post=await Post.findById(req.params.id);
        single_post.views++;
        await single_post.save();
        res.contentType('application/json');
        res.send(single_post);
    },
    addPost: async function(req,res,next){
        const path_tokens = req.file.path.split('/');
        new_post_req={
            "user_id":req.jwt_decoded.sub,
            "date":Date.now(),
            "short_text":req.body.short_text,
            "text":req.body.text,
            "members_only":req.body.members_only=="true",
            "author":req.body.author,
            "title":req.body.title,
            "image":path_tokens[2]
        }
        const new_post=new Post(new_post_req);
        const new_post_db_obj=await new_post.save();
        res.status(200).send(new_post_db_obj);
    }
}