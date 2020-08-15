'use strict'
const mongoose = require('mongoose')
mongoose.connect(
  'mongodb://localhost:27017',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
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
  clear: clearDB
}
// DO NOT RUN THIS SCOPE UNLESS WE ARE IN DEV/TEST STAGE!!!
// if (require.main === module) {
//   console.log('Going to clear DB')
//   clearDB()
// }
