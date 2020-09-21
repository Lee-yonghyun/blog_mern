const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')


const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true,
        },
        avatar:{
            type: String
        },
        role:{
            type: String,
            default: "user"
        },
        resetPasswordLink: ""
    },
    {
        timestamps:true
    }
)

userSchema.pre('save',async function(next) {

    try{

        const avatar = gravatar.url(this.email,{
            s:"150",
            r:"pg",
            d:"mm"
        });

        this.avatar  = avatar;

        const salt = await bcrypt.genSalt(10)

        const passwordHash = await bcrypt.hash(this.password, salt)

        this.password = passwordHash

        next()
    }

    catch (err) {
        next(err)
    }
})

userSchema.methods.comparePassword = function (candidatePassword , callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, result) {
        if(err || result === false) {
            return callback(err)
        }
        callback(null, result)
    })
}



module.exports = mongoose.model('user',userSchema)