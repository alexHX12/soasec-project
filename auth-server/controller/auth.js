const User = require('../schemas/user')
const basicError = require('../mixins/basicError')
const verifyClient = require('../mixins/verifyClient')
const generator = require('../mixins/generator')
const sha256 = require('js-sha256');
const base64url = require('base64url');
var uuid = require('uuid')
const bcrypt = require('bcrypt');
const M2M = require('../schemas/m2m');
const { dbConnection } = require("../dbConnection");

module.exports = {
    //this function define how user will authenticate to the Auth server
    //it then render the login page with the client_id and redirect_url
    //corresponding to the client app
    authUser: async function (req, res, next) {
        var cookie = req.cookies.auth_sid;
        client_id = req.query.client_id
        redirect_url = req.query.redirect_url
        code_challenge = req.query.code_challenge
        state = req.query.state
        c_client = await verifyClient.verifyClientConf(client_id, redirect_url)
        if (c_client == null || code_challenge == undefined || state == undefined) {
            basicError.invalidRequest(res)
            return
        }
        code_c_found = false;
        c_client.code_challenges.forEach(el => {
            if (el.state == state && el.hash == code_challenge) {
                code_c_found = true;
            }
        });
        if (!code_c_found) {
            c_client.code_challenges.push({ state: state, hash: code_challenge })
        }
        await c_client.save()
        if (cookie != undefined) {
            auth_code = await generator.genAuthCode(c_client, cookie)
            res.redirect(redirect_url + "?auth_code=" + auth_code + "&state=" + state)
        } else {
            res.render("index.ejs", {
                client_id: client_id,
                client_name: c_client.name,
                code_challenge: code_challenge,
                redirect_url: redirect_url,
                state: state
            })
        }
    },
    //verify credentials and redirect to the 
    //callback url(redirect_url) with the authorization code
    signIn: async function (req, res, next) {
        client_id = req.body.client_id
        redirect_url = req.body.redirect_url
        username = req.body.username
        password = req.body.password
        state = req.body.state
        const session = await dbConnection.connectToDB().startSession();
        session.withTransaction(async () => {
            c_client = await verifyClient.verifyClientConf(client_id, redirect_url)
            if (c_client == null || state == undefined) {
                basicError.invalidRequest(res)
                return
            }
            user = null
            try {
                user = await User.findOne({ username: username }).lean()
            } catch (error) {

            }
            if (user == null || !await bcrypt.compare(password, user.password)) {
                basicError.unauthorized(res)
                return
            }
            sid = uuid.v4()
            auth_code = await generator.genAuthCode(c_client, user._id)
            res.cookie('auth_sid', user._id, { maxAge: 900000, httpOnly: true });
            res.redirect(redirect_url + "?auth_code=" + auth_code + "&state=" + state);
        });
        session.endSession();
    },
    //invoked by the client app to request an access token
    getToken: async function (req, res, next) {
        authorization_code = req.body.auth_code
        client_id = req.body.client_id
        code_verifier = req.body.code_verifier
        redirect_url = req.body.redirect_url
        state = req.body.state
        const session = await dbConnection.connectToDB().startSession();
        session.withTransaction(async () => {
            c_client = await verifyClient.verifyClientConfExt(client_id, redirect_url, authorization_code)
            if (c_client == null || code_verifier == undefined || state == undefined) {
                basicError.invalidRequest(res)
                return
            }
            codeT = null
            c_client.code_challenges.forEach(el => {
                if (el.state == state) {
                    codeT = el
                }
            });
            if (codeT == null) {
                basicError.invalidRequest(res)
                return
            }

            bCodeT = base64url.decode(codeT.hash)
            cVerH = sha256(base64url.decode(code_verifier))
            if (bCodeT != cVerH) {
                basicError.unauthorized(res)
                return
            }

            auth_code_obj = null
            c_client.authorization_codes.forEach(el => {
                if (el.code == authorization_code) {
                    auth_code_obj = el
                }
            });



            if (auth_code_obj == null) {
                basicError.invalidRequest(res)
                return
            }

            user = null
            try {
                user = await User.findById(auth_code_obj.user_id).lean()
            } catch (error) {

            }
            if (user == null) {
                basicError.unauthorized(res)
                return
            }

            //delete code challenge and authorization code
            c_client.code_challenges.pull(codeT)
            c_client.authorization_codes.pull(auth_code_obj)
            res.json({
                "access_token": generator.genAccessToken(user),
                "id_token": generator.genIDToken(user)
            })
            //for some reason that the humanity can't explain why this must be the last operation
            await c_client.save();
        });
        session.endSession();
    },

    logout: function (req, res, next) {
        redirect_url = req.query.redirect_url
        res.clearCookie("auth_sid", { httpOnly: true });
        res.redirect(redirect_url);
    },

    getM2MToken: async function (req, res, next) {
        client_id = req.body.client_id;
        client_secret = req.body.client_secret;
        if (client_id == undefined || client_id == "" || client_secret == undefined || client_secret == "") {
            basicError.invalidRequest(res);
            return;
        }
        m2m_client = null
        try {
            m2m_client = await M2M.findById(client_id).lean();
        } catch (error) {

        }
        if (m2m_client == null || !await bcrypt.compare(client_secret, m2m_client.client_secret)) {
            basicError.unauthorized(res)
            return
        }
        res.json({
            "access_token": generator.genAccessToken(m2m_client)
        })
    }
}