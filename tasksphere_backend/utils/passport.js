const passport = require("passport")
const GoogleStrategy =  require('passport-google-oauth20').Strategy;
const User = require("../models/userModel")
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://tasksphere-six.vercel.app/user/googlecbk",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        const userExist = await User.findOne({ email: profile.emails[0].value });

        if (!userExist) {
           await User.create({
            email: profile.emails[0].value,
            fullname: profile.displayName,
            googleId: profile.id,
            profileImage: profile.photos[0].value,
            emailVerified: true
          });
        }

        const user = await User.findOne({ email: profile.emails[0].value });

        return done(null, user);
      } catch (error) {

        return done(error, null);
        
      }
    }
  )
);

