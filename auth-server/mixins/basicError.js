module.exports = {
    invalidRequest: function (res) {
        res.status(400)
        res.send("Invalid request")
    },
    unauthorized: function(res){
        res.status(404)
        res.send("Unauthorized")
    }
}