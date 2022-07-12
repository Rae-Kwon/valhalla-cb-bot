const db = require('./database')
const settingsSchema = require('../schema/settingsSchema')

const cacheData = async (guildId, cache, commandName) => {
  let data = cache[guildId]

  if (!data) {
    console.log('Fetching from database')
    const connectDb = await db()
    try {
      const res = await settingsSchema.findOne({ _id: guildId })

      cache[guildId] = data = {
        priconneLogChannelId: res.priconneLogChannelId,
        eventAnnounceChannelId: res.eventAnnounceChannelId,
      }
    } finally {
      connectDb.connection.close()
    }
  }

  return data
}

module.exports = { cacheData }
