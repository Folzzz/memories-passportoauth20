const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const User = require('../models/User');

const passportConfig = (passport) => {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        const { id, displayName, name, photos } = profile;
        const newUser = {
            googleId: id,
            displayName: displayName,
            firstName: name.givenName,
            lastName: name.familyName,
            image: photos[0].value
        }

        try {
            let user = await User.findOne({ googleId: id });

            if (user) {
                done(null, user);
            }
            else {
                user = await User.create(newUser);
                done(null, user);
            }
        } catch (error) {
            console.error(error);
        }
    }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id)
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    });
}

module.exports = passportConfig;