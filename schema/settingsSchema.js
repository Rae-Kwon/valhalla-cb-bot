const mongoose = require('mongoose')

const reqString = {
  type: String,
  required: true,
}

const settingsSchema = mongoose.Schema({
  _id: reqString,
  priconneLogChannelId: String,
  eventAnnounceChannelId: String,
})

module.exports = mongoose.model('settings', settingsSchema)
