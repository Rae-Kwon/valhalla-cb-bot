const db = require('./database')
const settingsSchema = require('../schema/settingsSchema')

const cacheData = async (guildId, cache) => {
    let data = cache[guildId]

    if (!data) {
        console.log('Fetching from database')
        const connectDb = await db()
        try {
            const res = await settingsSchema.findOne({ _id: guildId })

            cache[guildId] = data = [res.priconneLogChannelId, res.eventAnnounceChannelId]
        } finally {
            connectDb.connection.close()
        }
    }

    console.log(data)
}

module.exports = { cacheData }
