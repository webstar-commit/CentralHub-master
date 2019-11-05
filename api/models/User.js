/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

    attributes: {

        //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
        //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
        //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


        //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
        //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
        //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


        //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
        //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
        //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

        firstName: {
            type: 'string'
        },

        lastName: {
            type: 'string'
        },
        password: {
            type: 'string',
            required: true
        },

        email: {
            type: 'string',
            required: true,
            unique: true
        },

        twoFactorAuth: {
            type: 'boolean',
            defaultsTo: false
        },

        image: {
            type: 'string',
            defaultsTo: 'our/default/image.jpg'
        },

        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },

        statusId: {
            type: 'number',
            defaultsTo: 1
        },

        about: {
            type: 'string',
            defaultsTo: ''
        },

        team: {
            model: 'team',
            columnName: 'teamId'
        }

    },

    customToJSON: function () {
        return _.omit(this, ['password', 'twoFactorAuth', 'statusId', 'isDeleted'])
    }

};

