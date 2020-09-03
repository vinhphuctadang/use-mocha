'use strict'
const mongoose = require('mongoose')
mongoose.connect(
  'mongodb://localhost:27017',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

const models = {
  User : mongoose.model(
    'User',
    new mongoose.Schema ({
      username : String,
      password : String
    })
  )
}

// clear for dev purpose
async function clearDB(){
  for(let modelName in models){
    await models[modelName].deleteMany({})
  }
}

module.exports = {
  models: models,
  connection: mongoose.connection,
  clear: clearDB
}


