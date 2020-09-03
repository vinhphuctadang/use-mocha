'use strict'
const express = require('express')
const db = require('./routes/db')

// new web app
const app = express()

const bodyParser = require('body-parser')
// use bodyParser
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

const expressSession = require('express-session')
// use mongo store to store session in mongodb
const MongoStore = require('connect-mongo')(expressSession);

app.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // store in mongo
  store: new MongoStore({ mongooseConnection: db.connection })
}));

// use our custom routes
const auth = require('./routes/auth')
app.use('/auth', auth)

// listen
app.listen(8080, () => {
  console.log('Listening on port 8080')
})
