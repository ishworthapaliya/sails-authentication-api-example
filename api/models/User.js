/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        // The user's full name
        // e.g. Mister Tester
        name: {
            type: 'string',
            required: true
        },

        // The user's title at their job (or something)
        // e.g. Genius
        title: {
            type: 'string'
        },

        // The user's email address
        // e.g. name@domain.tld
        email: {
            type: 'email',
            required: true,
            unique: true
        },

        // The encrypted password for the user
        // e.g. asdgh8a249321e9dhgaslcbqn2913051#T(@GHASDGA
        encryptedPassword: {
            type: 'string',
            required: true
        },

        // The timestamp when the the user last logged in
        // (i.e. sent a username and password to the server)
        lastLoggedIn: {
            type: 'date',
            required: true,
            defaultsTo: new Date(0)
        },

        // url for gravatar
        gravatarUrl: {
            type: 'string'
        },

        Role: {
            type: 'string',
            enum: ['User', 'Admin'],
            defaultsTo: 'User'
        },
        
        toJSON: function(){
            var obj = this.toObject();
            delete obj.encryptedPassword;
            return obj;
        }
    }
    
};