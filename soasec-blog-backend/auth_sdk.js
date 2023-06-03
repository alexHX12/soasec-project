class authSdk {
    static getAuthToken() {
        var res = null;
        do {
            try {
                res = fetch("http://auth:3000/m2m-token", {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "client_id": "647a788799e5d8ae17cf0481", "client_secret": "6f03ded0-4fde-486e-9d07-0d7b55e30267" })
                })
            } catch (error) {
                console.log("Retrying getting Auth token...");
            }
        } while (res == null);
        return res;
    }

    static async getUserInfo(user_id) {
        var res=await fetch("http://auth:3000/api/userinfo?user_id="+user_id,{
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Token '+global.access_token
            },
        });
        return res.json();
    }
}

module.exports = { authSdk };