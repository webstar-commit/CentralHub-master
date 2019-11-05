/**
 * tokenAuth
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */
module.exports = function (req, res, next) {
    let token,
        ip = 'na';

    try {
        ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
    } catch (e) {}

    sails.log.verbose(`${new Date()} - auth request from ${ip} for route: ${req.route.path}. socket status: ${req.isSocket ? 'socket request' : 'http request'}`);

    if (req.param('token')) {
        token = req.param('token');

        // We delete the token from param to not mess with blueprints
        //delete req.query.token; Enabled for demo purposes
    }
    else if (req.headers && req.headers.authorization) {
        let parts = req.headers.authorization.split(' ');
        if (parts.length === 2) {
            let scheme = parts[0],
                credentials = parts[1];

            if (/^Bearer$/i.test(scheme)) {
                token = credentials;
            }
        } else {
            return res.json(401, {err: 'Format is Authorization: Bearer [token]'});
        }
    } else {
        return res.json(401, {err: 'No Authorization header was found'});
    }

    jwToken.verify(token, function (err, token) {
        if (err) {
            return res.json(401, {err: 'Invalid Token'});
        }

        if(token.requester !== ip && !req.isSocket){
            sails.log.verbose('This token is not valid for current IP');
            return res.json(401, {err: 'Not a valid token. Please login again to get another'});
        }

        User.findOne(token.userId)
        .then(_user=>{

            if(!_user || _user.isDeleted)
                throw new CustomError('Invalid token. User doesn\'t exist');
            //TODO:: check user status

            req.token = {user: _user};
            
            next();
        })
            .catch(err=> util.errorResponse(err, res));

    });
};