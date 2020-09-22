const {Strategy, ExtractJwt} = require('passport-jwt')
const userModel = require('../models/user')


const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken() //token을 생설할때 payload, secretkey, expiresin이 담김, 그걸 뽑아옴.
//그래서 payload를 알 수 있음.
opts.secretOrKey = process.env.SECRETKEY


module.exports = passport => {

    passport.use(

        new Strategy(opts, (payload,done) => {
          userModel
              .findById(payload.id)
              .then(user => {
                  if(!user) {
                      return done(null, false);
                  }
                  else {
                      done(null, user)
                  }
              })
              .catch(err => console.log(err))
        })
    )
}