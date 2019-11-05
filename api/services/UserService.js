
const validator = require('validator');
const Joi = require('joi');
module.exports = {
    sendActivationEmail: async (email)=>{
        if(!email || !validator.isEmail(email))
            throw new CustomError('Please provide a valid email address', {status: 400});
        let user = await User.findOne({
            email: email,
            isDeleted: false
        });

        if(!user)
            throw new CustomError('Could not find any inactive user with your provided details', {status: 400});

        const activationToken = UserService.makeLinkToken({
            email: email,
            userId: user.id
        }, sails.config.BASE_URL + 'beta/user/activate');
        console.log(activationToken);

        let msg = `Hello and welcome to TriForce Tokens. Please click on the link below to activate your account
      <br><br>
      <a href="${sails.config.APP_URL}beta/user/activate?token=${activationToken}">Activate Your Account</a>
      <br>
     <br />
      Kind Regards,<br />
      Support @ TriForce Tokens
    `;

        return await EmailService.sendEmail({
            fromEmail: 'support',
            fromName: 'Support',
            toEmail: user.email,
            toName: `${user.firstName} ${user.lastName}`,
            subject: 'Welcome to TriforceTokens',
            body: msg
        })

    },

    changeEmailRequest: async (userId, email) => {
        const user = await User.findOne({id: userId});
        if (!user || user.isDeleted)
            throw new CustomError('Invalid request to process. Could not find any user details with your provided details');

        await UserService.sendActivationChangeEmail(email, user);

        return {msg: `An email has been sent to ${email} with instructions.`};
    },

    sendActivationChangeEmail: async (newEmail, userInfo)=>{
        if(!newEmail || !validator.isEmail(newEmail))
            throw new CustomError('Please provide a valid email address', {status: 400});
        let user = await User.findOne({
            email: newEmail
        });
        if(user)
            throw new CustomError('This mail is already existed', {status: 400});

        const activationToken = UserService.makeLinkToken({
            email: newEmail,
            userId: userInfo.id
        }, sails.config.BASE_URL + 'beta/user/update-email');
        console.log(activationToken);

        let msg = `Please click on link below to change your email address. If you didn't make this request please ignore this message.
      <br><br>
      <a href="${sails.config.APP_URL}beta/user/update-email?token=${activationToken}">Change My Email</a>
      <br>
     <br />
      Kind Regards,<br />
      Support @ TriForce Tokens
    `;

        return await EmailService.sendEmail({
            fromEmail: 'support',
            fromName: 'Support',
            toEmail: newEmail,
            toName: `${userInfo.firstName} ${userInfo.lastName}`,
            subject: 'Welcome to TriforceTokens',
            body: msg
        })

    },

    sendMailForgotPass: async (email)=>{
        if(!email || !validator.isEmail(email))
            throw new CustomError('Please provide a valid email address', {status: 400});

        // var randomstring = Math.random().toString(36).slice(-8);
        let userInfo = await User.findOne({
            email: email
        });
        if (!userInfo || userInfo.isDeleted)
            throw new CustomError('Invalid request to process. Could not find any user details with your provided details');
        const activationToken = UserService.makeLinkToken({
            email: email,
            userId: userInfo.id
        }, sails.config.BASE_URL + 'beta/user/update-passwd');
        console.log(activationToken);

        let msg = `We head that you lost your password, Sorry about that!
        But don't worry! You can use following link to reset your password:
            <br><br>
            <a href="${sails.config.APP_URL}password-reset?token=${activationToken}">Update Your Password</a>
            <br>
            <br />
            If you don't use this link within 12 hours, it will expire.
            Kind Regards,<br />
            Support @ TriForce Tokens
            `;

        return await EmailService.sendEmail({
            fromEmail: 'support',
            fromName: 'TriForce Support',
            toEmail: email,
            toName: `${userInfo.firstName} ${userInfo.lastName}`,
            subject: 'Please reset your password',
            body: msg
        })

    },

    getRequestIP: async (req) => {
        return new Promise((resolve, reject) => {
            let ip = 'na';

            try {
                ip = req.headers['x-forwarded-for'] ||
                    req.connection.remoteAddress ||
                    req.socket.remoteAddress ||
                    req.connection.socket.remoteAddress;
            } catch (e) {
                return reject(e);
            }
            return resolve(ip);
        })
    },

    makeLinkToken: (data, route) => {
        return jwToken.issue({
            route: route,
            data: data,
        }, sails.config.LOGIN_TOKEN_EXPIRY)
    },

    makeToken: async (req, userId, data) => {
        const ip = await UserService.getRequestIP(req);
        return jwToken.issue({
            requester: ip,
            userId: userId,
            data: data,
        }, sails.config.LOGIN_TOKEN_EXPIRY)
    },

    actionLogin: async (req, userId, userInfo) => {
        if (!userInfo) {
            userInfo = await User.findOne(userId);
        }
        const _sanitizedUser = _.omit(userInfo, ['password', 'statusId','isDeleted']);
        const token = await UserService.makeToken(req, userInfo.id);
        const rsp = {
            user: _sanitizedUser,
            token: token
        };
        return rsp;
    }
};