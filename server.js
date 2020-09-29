const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const dotEnv = require('dotenv')
dotEnv.config()
require('./config/database')
const userRoutes = require('./routes/user')
const profileRoutes = require('./routes/profile')
const passport = require('passport')
const postRoutes = require('./routes/post')

app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(passport.initialize())
require('./config/passport')(passport)



app.use('/users',userRoutes)
app.use('/profiles',profileRoutes)
app.use('/post',postRoutes)


const PORT = process.env.PORT || 6111
app.listen(PORT, () => console.log(`server started...on port ${PORT}`))