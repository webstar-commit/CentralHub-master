
const GoogleSignIn = require('google-sign-in');
const request = require('request');

module.exports = {

    actionGoogleSignin: async (token) => {
        return new Promise((resolve, reject) => {
            var project = new GoogleSignIn.Project(sails.config.GOOGLE_APP_KEY);
            project.verifyToken(token).then((jsonData) => {
                return resolve(jsonData);
            }, (err) => {
                return reject(err);
            });

        })
    },
    
    actionFacebookLogin: async (acessToken) => {
        return new Promise((resolve, reject) => {
            const url = 'https://graph.facebook.com/me?\
                fields=id,email,first_name,last_name,picture,about,name,address,birthday,education,gender,hometown,interested_in,location,public_key,significant_other,verified,website,work\
                &access_token=' + acessToken;
            request(url, { json: true }, (err, res, body) => {
                if (err) {
                    return reject(err);
                } else {
                    if (body.error) {
                        return reject(body.error);
                    } else {
                        return resolve(body);
                    }
                }
            });
        })
    }
};