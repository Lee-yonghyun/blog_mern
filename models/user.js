const mongoose = require('mongoose')



const userShema = new mongoose.Schema()



module.exports = mongoose.model('user',userShema)