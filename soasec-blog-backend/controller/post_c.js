const { authSdk } = require("../auth_sdk");
const Post=require("../schemas/post");
var jwt = require('jsonwebtoken');
const fs = require('fs');

function jwtVerify (req, res, next) {
    console.log('verifying token...');
    check=true;
    const authHeader = String(req.headers['authorization'] || '');
    var token=null;
    if (authHeader.startsWith('Token ')) {
      token = authHeader.substring(6, authHeader.length);
    }else{
      res.status(404);
      res.end();
      check=false;
      return check;
    }

    try {
      req.jwt_decoded = jwt.verify(token, fs.readFileSync('./public.pem'));
      console.log(req.jwt_decoded);
    } catch(err) {
      console.log(err);
      console.log("Auth error");
      res.status(404);
      res.end();
      check=false;
      return check;
    }
    return check;
  }

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
    const popular_posts=await Post.find().sort({"views":"desc"}).limit(req.query.limit).lean();
    for(var i=0;i<popular_posts.length;i++){
        user_info=await authSdk.getUserInfo(popular_posts[i].user_id);
        popular_posts[i].user_image=user_info.image;
    }
    res.status(200).send(popular_posts);
}

module.exports={
    getPosts: async function(req,res,next){
        if((req.query.user_id!=""&&req.query.user_id!=null)&&(req.query.popular==""||req.query.popular==null)){
            if(jwtVerify(req,res)){
                await getUserPosts(req,res,next);
            }
        }else if(req.query.popular=="1"&&req.query.popular!=null&&req.query.limit!=""&&req.query.limit!=null){
            await getPopularPosts(req,res,next);
        }else{
            all_posts=await Post.find().lean();
            for(var i=0;i<all_posts.length;i++){
                user_info=await authSdk.getUserInfo(all_posts[i].user_id);
                all_posts[i].user_image=user_info.image;
            }
            res.contentType('application/json');
            res.send(all_posts);
        }
    },
    //user:
    //username-->email
    //name
    //image
    getSinglePost: async function(req,res,next){
        single_post=await Post.findById(req.params.id);
        if(single_post.members_only){
            if(!jwtVerify(req,res)){
                return
            }
            if(!req.jwt_decoded.scope.includes("read:post_members")){
                res.status(401);
                res.end();
                return
            }
        }
        if(single_post.premium){
            if(!jwtVerify(req,res)){
                return
            }
            if(!req.jwt_decoded.scope.includes("read:post_premium")){
                res.status(401);
                res.end();
                return
            }
        }
        single_post.views++;
        await single_post.save();
        user_info=await authSdk.getUserInfo(single_post.user_id);
        single_post.user_name=user_info.name;
        single_post.user_image=user_info.image;
        res.contentType('application/json');
        res.send(single_post);
    },
    addPost: async function(req,res,next){
        if(jwtVerify(req,res)&&req.jwt_decoded.scope.includes("write:post")){
            if(req.body.members_only=="true"&&!req.jwt_decoded.scope.includes("write:post_members")){
                res.status(401);
                res.end();
                return
            }
            if(req.body.premium=="true"&&!req.jwt_decoded.scope.includes("write:post_premium")){
                res.status(401);
                res.end();
                return
            }
            const path_tokens = req.file.path.split('/');
            user_info=await authSdk.getUserInfo(req.jwt_decoded.sub);
            new_post_req={
                "user_id":req.jwt_decoded.sub,
                "date":Date.now(),
                "short_text":req.body.short_text,
                "text":req.body.text,
                "members_only":req.body.members_only=="true",
                "premium":req.body.premium=="true",
                "author":user_info.name,
                "title":req.body.title,
                "image":path_tokens[2]
            }
            const new_post=new Post(new_post_req);
            const new_post_db_obj=await new_post.save();
            res.status(200).send(new_post_db_obj);
        }
    }
}