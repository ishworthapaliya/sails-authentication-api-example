/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var mp_passwords = require('machinepack-passwords');
var mp_gravatar = require('machinepack-gravatar');

module.exports = {
    login: function (req, res) {

        // Try to look up user using the provided email address
        User.findOne({
            email: req.param('email')
        }, function foundUser(err, user) {
            if (err) return res.negotiate(err);
            if (!user) return res.notFound();

            // Compare password attempt from the form params to the encrypted password
            // from the database (`user.password`)
            mp_passwords.checkPassword({
                passwordAttempt: req.param('password'),
                encryptedPassword: user.encryptedPassword
            }).exec({

                error: function (err) {
                    return res.negotiate(err);
                },

                // If the password from the form params doesn't checkout w/ the encrypted
                // password from the database...
                incorrect: function () {
                    return res.notFound();
                },

                success: function () {

                    // Store user id in the user session
                    req.session.me = user.id;
                    req.session.role = user.role;

                    // All done- let the client know that everything worked.
                    return res.ok();
                    //return req.session.me;
                }
            });
        });

    },

    /**
     * Sign up for a user account.
     */
    signup: function (req, res) {



        // Encrypt a string using the BCrypt algorithm.
        mp_passwords.encryptPassword({
            password: req.param('password'),
            difficulty: 10,
        }).exec({
            // An unexpected error occurred.
            error: function (err) {
                return res.negotiate(err);
            },
            // OK.
            success: function (encryptedPassword) {
                mp_gravatar.getImageUrl({
                    emailAddress: req.param('email')
                }).exec({
                    error: function (err) {
                        return res.negotiate(err);
                    },
                    success: function (gravatarUrl) {
                        // Create a User with the params sent from
                        // the sign-up form --> signup.ejs
                        User.create({
                            name: req.param('name'),
                            title: req.param('title'),
                            email: req.param('email'),
                            encryptedPassword: encryptedPassword,
                            lastLoggedIn: new Date(),
                            gravatarUrl: gravatarUrl
                        }, function userCreated(err, newUser) {
                            if (err) {

                                console.log("err: ", err);
                                console.log("err.invalidAttributes: ", err.invalidAttributes)

                                // If this is a uniqueness error about the email attribute,
                                // send back an easily parseable status code.
                                if (err.invalidAttributes && err.invalidAttributes.email && err.invalidAttributes.email[0] && err.invalidAttributes.email[0].rule === 'unique') {
                                    return res.emailAddressInUse();
                                }

                                // Otherwise, send back something reasonable as our error response.
                                return res.negotiate(err);
                            }

                            // Log user in
                            req.session.me = newUser.id

                            // Send back the id of the new user
                            return res.json({
                                id: newUser.id
                            });
                        });
                    }
                });
            }
        });
    },

    /**
     * Log out of Activity Overlord.
     * (wipes `me` from the sesion)
     */
    logout: function (req, res) {

        // Look up the user record from the database which is
        // referenced by the id in the user session (req.session.me)
        User.findOne(req.session.me, function foundUser(err, user) {
            if (err) return res.negotiate(err);

            // If session refers to a user who no longer exists, still allow logout.
            if (!user) {
                sails.log.verbose('Session refers to a user who no longer exists.');
                return res.notFound();
            }

            // Wipe out the session (log out)
            req.session.me = null;
            req.session.role = null;

            // Either send a 200 OK or redirect to the home page
            return res.ok();

        });
    },

    loggedInUser: function (req, res) {
        User.findOne(req.session.me, function foundUser(err, user) {
            if (err) return res.negotiate(err);

            if (!user) {
                sails.log.verbose('Not found');
                return res.notFound();
            }

            return res.json({
                name: user.name,
                email: user.email
            });
        });
    }



};