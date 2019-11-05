/**
 * UserController
 *
 * @description :: Server-side logic for managing User
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

const Joi = require('joi');

module.exports = {
    /**
     * @api {post} /beta/users/signup
     * @apiGroup Users
     * @apiParam {String} [email]  A user must need to provide email
     * @apiParam {String} [password]  A user must need to provide password
     * @apiParam {String} [firstName]  The firstName of the user
     * @apiParam {String} [lastName]  The lastName of the user
     * @apiParamExample {json} Request Params Example:
     * {
     *  "email" : "test@email.com",
     *  "password" : "password",
     *  "firstName" : "Haider",
     *  "lastName" : "malik",
     * }
     * @apiSuccess {String} ActivationLink  Please check your inbox and activate your account
     * @apiDescription User can register to TriforceHub API
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/signup
     */
    async signup(req, res) {
        const userSchema = Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional(),
            twoFactorAuth: Joi.string().optional(),
            image: Joi.string().optional(),
        });
        try {
            const userParams = await Joi.validate(req.body, userSchema);
            const encryptedPassword = await util.hashPassword(userParams.password);
            await User.create({
                firstName: userParams.firstName,
                lastName: userParams.lastName,
                email: userParams.email,
                password: encryptedPassword
            });
            await UserService.sendActivationEmail(userParams.email);
            return res.ok({msg: 'Please check your inbox and activate your account'});
        } catch(err) {
            return util.errorResponse(err, res);
        }
    },
    
    /**
     * @api {get} /beta/user/activate
     * @apiGroup Users
     * @apiParam {String} [token] JWT token to access restrict route
     * @apiParamExample {json} Token param Example:
     * {
     * "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3V0ZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9iZXRhL3VzZXIvYWN0aXZhdGUiLCJkYXRhIjp7ImVtYWlsIjoiaGFpZGVybWFsaWs1MDRAZ21haWwuY29tIiwidXNlcklkIjoxfSwiaWF0IjoxNTE3MjI0NDc5LCJleHAiOjE1MTcyNjc2Nzl9.JDhCHGAEUc0r99-BQsFZvrCZX_xcX2hQBXZk7RHLfa4"
     * }
     * @apiSuccess {String} SuccessMessage  account activated
     * @apiDescription User can activate his/her acccount
     * @apiExample {curl} Example Usage:
     * curl -i http://localhost:1337/beta/user/activate
     */
    async activateAccount(req, res) {
        let userId = req.payload.userId;
        try {
            await User.update({
                id: userId,
                isDeleted: false,
                statusId: Status.PENDING
            }, {
                statusId: Status.ACTIVE
            });
            const rsp = await UserService.actionLogin(req, userId);
            return res.ok({msg: 'account activated', res: rsp});
        } catch (err) {
            return util.errorResponse(err, res);
        }
    },

    /**
     * @api {post} /beta/users/login
     * @apiGroup Users
     * @apiParam {String} [email]  A user must need to provide email
     * @apiParam {String} [password]  A user must need to provide password
     * @apiParamExample {json} Request Params Example:
     * {
     *  "email" : "test@email.com",
     *  "password" : "password"
     * }
     * @apiSuccess {Object} User  A user object with token
     * @apiSuccessExample {json} Login Success Example:
     * {
     *    "user": {
     *   "createdAt": 1517228955238,
     *   "updatedAt": 1517228955238,
     *   "id": 3,
     *   "firstName": "Haider",
     *   "lastName": "Malik",
     *   "email": "haidermalik5044@gmail.com",
     *   "twoFactorAuth": false,
     *   "image": "our/default/image.jpg",
     *   "isDeleted": false,
     *   "statusId": 1,
     *   "team": null
     *    },
     *  "token" : "WSDAJHSGDJHASGDJHSAGDJHAGDSJH"
     * }
     * @apiDescription User can login to the TriforceHub API
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/login
     */
    async login(req, res) {

        let email = req.param('email'),
            password = req.param('password');

        if (!_.isString(email) || !_.isString(password)) {
            sails.log.error("Failing to login user:", email, password);
            return util.sendBadRequest('Invalid email or password provided', 400, res);
        }

        try {
            let user = await User.findOne({email, isDeleted: false});
            if (!user)
                return util.sendBadRequest('Invalid email or password', 401, res);

            const isValidPassword = await util.comparedPassword(password, user.password);
            if (!isValidPassword)
                return util.sendBadRequest('Invalid email or password', 401, res);

            if ([Status.PENDING, Status.ACTIVE].indexOf(user.statusId) === -1)
                return util.sendBadRequest('This account is not active. Please contact support for help', 401, res);

            const rsp = await UserService.actionLogin(req, user.id, user);
            delete user.password;
            return res.ok(rsp);
        } catch(err) {
            return util.errorResponse(err, res);
        }

    },

    /**
     * @api {get} /beta/user/change-email
     * @apiGroup Users
     * @apiParam {String} [token] JWT token to access restrict route
     * @apiParamExample {json} Token param Example:
     * {
     * "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3V0ZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9iZXRhL3VzZXIvYWN0aXZhdGUiLCJkYXRhIjp7ImVtYWlsIjoiaGFpZGVybWFsaWs1MDRAZ21haWwuY29tIiwidXNlcklkIjoxfSwiaWF0IjoxNTE3MjI0NDc5LCJleHAiOjE1MTcyNjc2Nzl9.JDhCHGAEUc0r99-BQsFZvrCZX_xcX2hQBXZk7RHLfa4"
     * }
     * @apiSuccess {String} SuccessMessage  email update request sent successfully
     * @apiDescription User can request to change his email address. This route will then send a confirmation email to new email address provided and update once user clicks on link in email
     * @apiExample {curl} Example Usage:
     * curl -i http://localhost:1337/beta/user/changeemail
     */
    async changeEmailRequest(req, res) {
        
        const paramsSchema = Joi.object().keys({
            email: Joi.string().email().required(),
            token: Joi.string().optional(),
        });
        try {
            const userParams = await Joi.validate(req.body, paramsSchema);
            const email = userParams.email;

            let result = await UserService.changeEmailRequest(req.token.user.id, email);
            await User.update({
                id: req.token.user.id,
            }, {
                email: email,
                statusId: Status.PENDING
            });
            return res.ok(result);
        } catch(err) {
            return util.errorResponse(err, res);
        }

    },

    /**
     * @api {get} /beta/user/update-email
     * @apiGroup Users
     * @apiParam {String} [token]  authentication token
     * @apiParamExample {json} Request Params Example:
     * {
     * "token" : "jwt-token-here"
     * }
     * @apiSuccess {String} msg email address updated successfully
     * @apiDescription User's email address is updated in this function.
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/update-email
     */
    async updateEmail(req, res) {

        const {userId, email} = req.payload;
        try {
            let user = await User.findOne(userId);
            //check if user is still active
            if (!user || user.isDeleted)
                return util.sendBadRequest('Invalid request to process. Could not find any user', 400, res);

            await User.update({
                id: userId,
            }, {
                statusId: Status.ACTIVE
            });

            const rsp = await UserService.actionLogin(req, userId, user);
            return res.ok({msg: 'User email updated successfully', res: rsp});
        }
        catch(e) {
            return util.errorResponse(err, res);
        }
    },


    /**
     * @api {get} /beta/user/profile
     * @apiGroup Users
     * @apiParamExample {json} Request Params Example:
     * {
     * "id" : "1",
     *  "firstName" : "Haider",
     *  "lastName" : "malik",
     *  "email" : "test@email.com"
     * }
     * @apiSuccess {Object} success message with currently logged-in user object
     * @apiDescription Get User profile
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/profile
     */
    async getUserProfile(req, res) {
        const userId = req.token.user.id;

        try{
            res.ok({user: await User.findOne(userId)});
        }
        catch(e){
            return util.errorResponse(e, res);
        }
    },
    /**
     * @api {put} /beta/user/profile
     * @apiGroup Users
     * @apiParam {String} [id]  user id
     * @apiParam {String} [email]  A user can change email
     * @apiParam {String} [firstName]  The firstName of the user
     * @apiParam {String} [lastName]  The lastName of the user
     * @apiParamExample {json} Request Params Example:
     * {
     * "id" : "1",
     *  "firstName" : "Haider",
     *  "lastName" : "malik",
     *  "email" : "test@email.com"
     * }
     * @apiSuccess {Object} success message with new user object
     * @apiDescription User profile update
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/profile
     */
    async saveProfile(req, res) {

        let rsp = {msg: []};
        const userSchema = Joi.object().keys({
            email: Joi.string().optional(),
            password: Joi.string().optional(),
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional(),
            about: Joi.string().optional(),
            image: Joi.string().optional(),
            token: Joi.string().optional(),
        });
        try {
            let user = await User.findOne({where: {id: req.token.user.id}, select: ['firstName', 'lastName', 'password', 'email', 'image']});
            const userParams = await Joi.validate(req.body, userSchema);

            let newUserInfo = {};
            if (userParams.password){
                newUserInfo.password = await util.hashPassword(userParams.password);
            }
            if (userParams.firstName){
                newUserInfo.firstName = userParams.firstName;
            }
            if (userParams.lastName){
                newUserInfo.lastName = userParams.lastName;
            }
            if (userParams.about){
                newUserInfo.about = userParams.about;
            }
            if (userParams.image){
                newUserInfo.image = userParams.image;
            }
            if (userParams.email && user.email != userParams.email){
                let emailReq = await UserService.changeEmailRequest(req.token.user.id, {
                    email: userParams.email,
                    token: userParams.token
                });
                rsp.msg.push(emailReq.msg);
                newUserInfo.email = userParams.email;
                newUserInfo.statusId = Status.PENDING;
            }
            newUserInfo.updateAt = Date.now();
            
            await User.update({
                id: req.token.user.id,
            }, newUserInfo);

            rsp.msg = 'updated profile';
            rsp.user = newUserInfo;

            return res.ok(rsp);

        } catch(err) {
            util.errorResponse(err, res);
        }

    },

    /**
     * @api {get} /beta/user/forgotpasswd
     * @apiGroup Users
     * @apiParam {String} [token] JWT token to access restrict route
     * @apiParamExample {json} Token param Example:
     * {
     * "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3V0ZSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTMzNy9iZXRhL3VzZXIvYWN0aXZhdGUiLCJkYXRhIjp7ImVtYWlsIjoiaGFpZGVybWFsaWs1MDRAZ21haWwuY29tIiwidXNlcklkIjoxfSwiaWF0IjoxNTE3MjI0NDc5LCJleHAiOjE1MTcyNjc2Nzl9.JDhCHGAEUc0r99-BQsFZvrCZX_xcX2hQBXZk7RHLfa4"
     * }
     * @apiSuccess {String} SuccessMessage  success
     * @apiDescription User can activate his/her acccount
     * @apiExample {curl} Example Usage:
     * curl -i http://localhost:1337/beta/user/forgotpasswd
     */
    async forgotPassword(req, res) {

        let rsp = {msg: []};
        const userSchema = Joi.object().keys({
            email: Joi.string().email().required()
        });
        const userParams = await Joi.validate(req.body, userSchema);
        try {
            let emailReq = await UserService.sendMailForgotPass(userParams.email);
            rsp.msg.push(emailReq.msg);
            return res.ok({msg: 'success send mail'});
        } catch(err) {
            return util.errorResponse(err, res);
        }
    },

    /**
     * @api {get} /beta/user/update-password
     * @apiGroup Users
     * @apiParam {String} [token]  authentication token
     * @apiParamExample {json} Request Params Example:
     * {
     * "token" : "jwt-token-here"
     * }
     * @apiSuccess {String} msg User password updated successfully
     * @apiDescription User's password is updated in this function.
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/update-password
     */
    async updatePassword(req, res) {
        const userId = req.payload.userId;
        const userSchema = Joi.object().keys({
            password: Joi.string().required(),
            token: Joi.string().optional()
        });
        try {
            const userParams = await Joi.validate(req.body, userSchema);

            let user = await User.findOne(userId);
            //check if user is still active
            if (!user || user.isDeleted)
                return util.sendBadRequest('Invalid request to process. Could not find any user', 400, res);

            const encryptedPassword = await util.hashPassword(userParams.password);
            user.password = encryptedPassword;
            
            await User.update({
                id: userId,
            }, {
                password: encryptedPassword
            });
            
            const rsp = await UserService.actionLogin(req, userId, user);
            return res.ok(rsp);
        } catch(err) {
            return util.errorResponse(err, res);
        }
    },


    /**
     * @api {post} /beta/users/google-signup
     * @apiGroup Users
     * @apiParam {String} [token]  google token
     * @apiParamExample {json} Request Params Example:
     * {
     *  "token" : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyNzY3MWQ3M2EyNjA1Y2NkNDU0NDEzYzRjOTRlMjViM2Y2NmNkZWEifQ.eyJhenAiOiI4NDQzNzY5NzIxOTAtZWR0dDlybGMybm8yOXEyOWtoaXI5N3I3dnRlNDVtaWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NDQzNzY5NzIxOTAtZWR0dDlybGMybm8yOXEyOWtoaXI5N3I3dnRlNDVtaWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3OTQwMDYzMzQ5NDQxNTM2NzciLCJlbWFpbCI6ImhpZ2hkZXZlbG9wbWVudDg4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiNmZnVHpkRlpkeXRYRjFmNVFUaEtEQSIsImV4cCI6MTUxODQ3MzYxNCwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImp0aSI6IjhkM2VkMjU3MjQ1MGY1ZDljNzk4ZGQwNDNhMDJkY2RmZWIyMjA4M2EiLCJpYXQiOjE1MTg0NzAwMTQsIm5hbWUiOiJoaWdoZGV2ZWxvcG1lbnQgbWFzdGVyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tVmV4VUxnUG1mTVkvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUNTSUxqWG5CSFRkTWxobXoyYUduUmZtaEc0SDJIcFdzUS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiaGlnaGRldmVsb3BtZW50IiwiZmFtaWx5X25hbWUiOiJtYXN0ZXIiLCJsb2NhbGUiOiJlbiJ9.MZvmz61NlJRMAs9TTDaYFu2Ko3mszZFzgbR_Ay07RHuEh8IK-xseEmSozLtfuL5Y_M1sZwDDNdJgf_5uSErcunwKnoDZMEiOoyOvTLv2vjkZeqbRk7HDsmeJMxWrYeHWFYutvZtHNm40HqRYWaNtNf0zm2PW6qP_vX99Sr3swvZFzfMadiMdC9C1S1D8Nm6iDN13QzJc1jWiOqLsINQTn_xoKxNJO3juYeeRTvJaJa_IJ7e8OVe5c2bCnMyg48n78WLtPrjK9nlrKpsWEvDPlIjxvyd9yNFStqUb309JsGInTlwYJ-8RLR6l5euGyx9m6MSj16s2PASOfzB0otbNqg"
     * }
     * @apiSuccess {String} Success
     * @apiDescription User can register to TriforceHub API
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/google-signup
     */
    async googleSignup(req, res) {

        const userSchema = Joi.object().keys({
            token: Joi.string().required(),
        });
        const userParams = await Joi.validate(req.body, userSchema);

        try {
            const result = await SocialService.actionGoogleSignin(userParams.token);
            if (!result.email_verified) {
                return util.sendBadRequest('can not sign up with unverified account', 401, res);
            }
            await User.create({
                firstName: result.given_name,
                lastName: result.family_name,
                email: result.email,
                image: result.picture,
                password: result.kid
            });
            const user = await User.findOne({email:result.email});
            await SocialAccount.create({
                email: user.email,
                socialType: 'google',
                clientId: result.sub,
                clientSecret: result.jti,
                rawData: JSON.stringify(result)
            })
            // await UserService.sendActivationEmail(userParams.email);
            const rsp = await UserService.actionLogin(req, user.id, user);
            return res.ok(rsp);
        } catch(err) {
            return util.errorResponse(err, res);
        }
    },
    
    /**
     * @api {post} /beta/users/google-signin
     * @apiGroup Users
     * @apiParam {String} [token]  google token
     * @apiParamExample {json} Request Params Example:
     * {
     *  "token" : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyNzY3MWQ3M2EyNjA1Y2NkNDU0NDEzYzRjOTRlMjViM2Y2NmNkZWEifQ.eyJhenAiOiI4NDQzNzY5NzIxOTAtZWR0dDlybGMybm8yOXEyOWtoaXI5N3I3dnRlNDVtaWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NDQzNzY5NzIxOTAtZWR0dDlybGMybm8yOXEyOWtoaXI5N3I3dnRlNDVtaWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3OTQwMDYzMzQ5NDQxNTM2NzciLCJlbWFpbCI6ImhpZ2hkZXZlbG9wbWVudDg4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiNmZnVHpkRlpkeXRYRjFmNVFUaEtEQSIsImV4cCI6MTUxODQ3MzYxNCwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImp0aSI6IjhkM2VkMjU3MjQ1MGY1ZDljNzk4ZGQwNDNhMDJkY2RmZWIyMjA4M2EiLCJpYXQiOjE1MTg0NzAwMTQsIm5hbWUiOiJoaWdoZGV2ZWxvcG1lbnQgbWFzdGVyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tVmV4VUxnUG1mTVkvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUNTSUxqWG5CSFRkTWxobXoyYUduUmZtaEc0SDJIcFdzUS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiaGlnaGRldmVsb3BtZW50IiwiZmFtaWx5X25hbWUiOiJtYXN0ZXIiLCJsb2NhbGUiOiJlbiJ9.MZvmz61NlJRMAs9TTDaYFu2Ko3mszZFzgbR_Ay07RHuEh8IK-xseEmSozLtfuL5Y_M1sZwDDNdJgf_5uSErcunwKnoDZMEiOoyOvTLv2vjkZeqbRk7HDsmeJMxWrYeHWFYutvZtHNm40HqRYWaNtNf0zm2PW6qP_vX99Sr3swvZFzfMadiMdC9C1S1D8Nm6iDN13QzJc1jWiOqLsINQTn_xoKxNJO3juYeeRTvJaJa_IJ7e8OVe5c2bCnMyg48n78WLtPrjK9nlrKpsWEvDPlIjxvyd9yNFStqUb309JsGInTlwYJ-8RLR6l5euGyx9m6MSj16s2PASOfzB0otbNqg"
     * }
     * @apiSuccess {Object} User  A user object with token
     * @apiSuccessExample {json} Login Success Example:
     * {
     *    "user": {
     *   "createdAt": 1517228955238,
     *   "updatedAt": 1517228955238,
     *   "id": 3,
     *   "firstName": "Haider",
     *   "lastName": "Malik",
     *   "email": "haidermalik5044@gmail.com",
     *   "twoFactorAuth": false,
     *   "image": "our/default/image.jpg",
     *   "isDeleted": false,
     *   "statusId": 1,
     *   "team": null
     *    },
     *  "token" : "WSDAJHSGDJHASGDJHSAGDJHAGDSJH"
     * }
     * @apiDescription User can login to the TriforceHub API
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/google-signin
     */
    async googleSignin(req, res) {
        
        const userSchema = Joi.object().keys({
            token: Joi.string().required(),
        });
        const userParams = await Joi.validate(req.body, userSchema);

        try {
            const result = await SocialService.actionGoogleSignin(userParams.token);
            if (!result.email_verified) {
                return util.sendBadRequest('can not sign in with unverified account', 401, res);
            }

            let social = await SocialAccount.findOne({ clientId: result.sub });
            if (social.statusId != 2) {
                return util.sendBadRequest('You are blocked one', 400, res);
            }

            let user = await User.findOne({email: result.email, isDeleted: false});
            if (!user) {
                return util.sendBadRequest('Invalid email', 400, res);
            }
        
            if ([Status.PENDING, Status.ACTIVE].indexOf(user.statusId) === -1) {
                return util.sendBadRequest('This account is not active. Please contact support for help', 401, res);
            }
    
            const rsp = await UserService.actionLogin(req, user.id, user);
            rsp.social = social;
            return res.ok(rsp);
        } catch(err) {
            return util.errorResponse(err, res);
        }
    },
    
    /**
     * @api {post} /beta/users/google-signup
     * @apiGroup Users
     * @apiParam {String} [token]  google token
     * @apiParamExample {json} Request Params Example:
     * {
     *  "token" : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyNzY3MWQ3M2EyNjA1Y2NkNDU0NDEzYzRjOTRlMjViM2Y2NmNkZWEifQ.eyJhenAiOiI4NDQzNzY5NzIxOTAtZWR0dDlybGMybm8yOXEyOWtoaXI5N3I3dnRlNDVtaWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NDQzNzY5NzIxOTAtZWR0dDlybGMybm8yOXEyOWtoaXI5N3I3dnRlNDVtaWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3OTQwMDYzMzQ5NDQxNTM2NzciLCJlbWFpbCI6ImhpZ2hkZXZlbG9wbWVudDg4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiNmZnVHpkRlpkeXRYRjFmNVFUaEtEQSIsImV4cCI6MTUxODQ3MzYxNCwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImp0aSI6IjhkM2VkMjU3MjQ1MGY1ZDljNzk4ZGQwNDNhMDJkY2RmZWIyMjA4M2EiLCJpYXQiOjE1MTg0NzAwMTQsIm5hbWUiOiJoaWdoZGV2ZWxvcG1lbnQgbWFzdGVyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tVmV4VUxnUG1mTVkvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUNTSUxqWG5CSFRkTWxobXoyYUduUmZtaEc0SDJIcFdzUS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiaGlnaGRldmVsb3BtZW50IiwiZmFtaWx5X25hbWUiOiJtYXN0ZXIiLCJsb2NhbGUiOiJlbiJ9.MZvmz61NlJRMAs9TTDaYFu2Ko3mszZFzgbR_Ay07RHuEh8IK-xseEmSozLtfuL5Y_M1sZwDDNdJgf_5uSErcunwKnoDZMEiOoyOvTLv2vjkZeqbRk7HDsmeJMxWrYeHWFYutvZtHNm40HqRYWaNtNf0zm2PW6qP_vX99Sr3swvZFzfMadiMdC9C1S1D8Nm6iDN13QzJc1jWiOqLsINQTn_xoKxNJO3juYeeRTvJaJa_IJ7e8OVe5c2bCnMyg48n78WLtPrjK9nlrKpsWEvDPlIjxvyd9yNFStqUb309JsGInTlwYJ-8RLR6l5euGyx9m6MSj16s2PASOfzB0otbNqg"
     * }
     * @apiSuccess {String} Success
     * @apiDescription User can register to TriforceHub API
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/google-signup
     */
    async facebookSignup(req, res){
        const userSchema = Joi.object().keys({
            token: Joi.string().required(),
        });
        const userParams = await Joi.validate(req.body, userSchema);

        try {
            const result = await SocialService.actionFacebookLogin(userParams.token);
            if (!result.verified) {
                return util.sendBadRequest({msg: 'can not sign up with unverified account'}, 401, res);
            }
            await User.create({
                firstName: result.last_name,
                lastName: result.first_name,
                email: result.email,
                image: result.picture.data.url,
                password: userParams.token
            });
            const user = await User.findOne({email:result.email});
            if (!user) {
                return util.sendBadRequest({msg: 'Invalid email'}, 400, res);
            }

            await SocialAccount.create({
                email: user.email,
                socialType: 'facebook',
                clientId: result.id,
                rawData: JSON.stringify(result)
            })
            // await UserService.sendActivationEmail(userParams.email);
            const rsp = await UserService.actionLogin(req, user.id, user);
            return res.ok(rsp);
        } catch(err) {
            return util.errorResponse(err, res);
        }
    },

    /**
     * @api {post} /beta/users/facebook-signin
     * @apiGroup Users
     * @apiParam {String} [token]  facebook access token
     * @apiParamExample {json} Request Params Example:
     * {
     *  "token" : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImUyNzY3MWQ3M2EyNjA1Y2NkNDU0NDEzYzRjOTRlMjViM2Y2NmNkZWEifQ.eyJhenAiOiI4NDQzNzY5NzIxOTAtZWR0dDlybGMybm8yOXEyOWtoaXI5N3I3dnRlNDVtaWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4NDQzNzY5NzIxOTAtZWR0dDlybGMybm8yOXEyOWtoaXI5N3I3dnRlNDVtaWwuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDk3OTQwMDYzMzQ5NDQxNTM2NzciLCJlbWFpbCI6ImhpZ2hkZXZlbG9wbWVudDg4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJhdF9oYXNoIjoiNmZnVHpkRlpkeXRYRjFmNVFUaEtEQSIsImV4cCI6MTUxODQ3MzYxNCwiaXNzIjoiYWNjb3VudHMuZ29vZ2xlLmNvbSIsImp0aSI6IjhkM2VkMjU3MjQ1MGY1ZDljNzk4ZGQwNDNhMDJkY2RmZWIyMjA4M2EiLCJpYXQiOjE1MTg0NzAwMTQsIm5hbWUiOiJoaWdoZGV2ZWxvcG1lbnQgbWFzdGVyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS8tVmV4VUxnUG1mTVkvQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUNTSUxqWG5CSFRkTWxobXoyYUduUmZtaEc0SDJIcFdzUS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiaGlnaGRldmVsb3BtZW50IiwiZmFtaWx5X25hbWUiOiJtYXN0ZXIiLCJsb2NhbGUiOiJlbiJ9.MZvmz61NlJRMAs9TTDaYFu2Ko3mszZFzgbR_Ay07RHuEh8IK-xseEmSozLtfuL5Y_M1sZwDDNdJgf_5uSErcunwKnoDZMEiOoyOvTLv2vjkZeqbRk7HDsmeJMxWrYeHWFYutvZtHNm40HqRYWaNtNf0zm2PW6qP_vX99Sr3swvZFzfMadiMdC9C1S1D8Nm6iDN13QzJc1jWiOqLsINQTn_xoKxNJO3juYeeRTvJaJa_IJ7e8OVe5c2bCnMyg48n78WLtPrjK9nlrKpsWEvDPlIjxvyd9yNFStqUb309JsGInTlwYJ-8RLR6l5euGyx9m6MSj16s2PASOfzB0otbNqg"
     * }
     * @apiSuccess {Object} User  A user object with token
     * @apiSuccessExample {json} Login Success Example:
     * {
     *    "user": {
     *   "createdAt": 1517228955238,
     *   "updatedAt": 1517228955238,
     *   "id": 3,
     *   "firstName": "Haider",
     *   "lastName": "Malik",
     *   "email": "haidermalik5044@gmail.com",
     *   "twoFactorAuth": false,
     *   "image": "our/default/image.jpg",
     *   "isDeleted": false,
     *   "statusId": 1,
     *   "team": null
     *    },
     *  "token" : "WSDAJHSGDJHASGDJHSAGDJHAGDSJH"
     * }
     * @apiDescription User can login to the TriforceHub API
     * @apiExample {crul} Example Usage:
     * curl -i http://localhost:1337/beta/user/facebook-signin
     */
    async facebookSignin(req, res) {

        const userSchema = Joi.object().keys({
            token: Joi.string().required(),
        });
        const userParams = await Joi.validate(req.body, userSchema);

        try {
            const result = await SocialService.actionFacebookLogin(userParams.token);
            if (!result.verified) {
                return util.sendBadRequest('can not sign in with unverified account', 401, res);
            }
            let social = await SocialAccount.findOne({ clientId: result.id });
            if (social.statusId != 2) {
                return util.sendBadRequest('You are blocked one', 401, res);
            }

            let user = await User.findOne({email: result.email, isDeleted: false});
            if (!user) return util.sendBadRequest('Invalid email', 400, res);
        
            if ([Status.PENDING, Status.ACTIVE].indexOf(user.statusId) === -1) {
                return util.sendBadRequest('This account is not active. Please contact support for help', 401, res);
            }
    
            const rsp = await UserService.actionLogin(req, user.id, user);
            rsp.social = social;
            return res.ok(rsp);
        } catch(err) {
            return util.errorResponse(err, res);
        }
    },
    
};
