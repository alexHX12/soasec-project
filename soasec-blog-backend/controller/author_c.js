const Post=require("../schemas/post");

module.exports = {
    getAuthors: async function (req, res, next) {
        all_authors = await Post.aggregate( 
            [
                {$group: { "_id": { user_id: "$user_id", author: "$author" } } }
            ]
        )

        res.contentType('application/json');
        res.send(all_authors);
    }
}