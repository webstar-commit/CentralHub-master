const bcrypt = require('bcryptjs');
const SALT_ROUND = 10;
module.exports = {

    async hashPassword(password){

        try {
            var salt = await bcrypt.genSalt(SALT_ROUND);
            return await bcrypt.hash(password, SALT_ROUND);
        }
        catch (err) {
            throw err;
        }
    },

    async comparedPassword(password, hash){
        try {
            return await bcrypt.compare(password, hash);
        }
        catch (err) {
            throw err;
        }
    },

    /**
     * a helper method to process error object and return apporpriate message based on status if err = instance of CustomError
     * @param {CustomError|Error} err - standard error
     * @param res - sails response object
     * @param {string} [responseFormat] - possible values: xml, json
     */
    errorResponse(err, res, responseFormat) {

        let rsp = {}, _status = 500;
        if (err instanceof CustomError) {
            rsp = {err: err.message};
            if (err.errors) {
                rsp.errors = _.clone(err.errors);
            }

            if (typeof err === 'object') {
                for (let prop in err) {
                    if (['message', 'status', 'errors', 'error', 'name', 'stack'].indexOf(prop) !== -1) continue;
                    rsp[prop] = err[prop];
                }
            }

            _status = err.status || 500;


        } else if (err instanceof Error) {
            rsp = {err: err.message};
        } else {
            rsp = err;
        }

        _status === 500 && sails.log.error(err);
        _status !== 500 && sails.log.verbose(err);

        if (responseFormat && responseFormat === 'xml') {
            const xml = require('xml');
            res.setHeader("Content-type", "text/xml");
            return res.send(xml(FeedService.objToXmlArray(rsp), {declaration: true}), _status);
        } else {
            res.send(rsp, _status);
        }
    },

    sendBadRequest(msg, status, res) {
        return res.status(status).send(msg);
    }

};