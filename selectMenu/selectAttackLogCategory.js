const { Permissions } = require('discord.js')
const db = require('../serverFunctions/database')
const settingsSchema = require('../schema/settingsSchema')

module.exports = {
  name: 'selectAttackLogCategory',
  async onSelect(interaction, bot, cache) {
    await interaction.deferReply()
    const selectedCategoryId = interaction.values[0]
    const createChannel = interaction.guild.channels.create('attack-channel', {
      type: 'GUILD_TEXT',
      parent: selectedCategoryId,
      permissionOverwrites: [
        {
          id: bot.user.id,
        },
      ],
    })

    const categoryName = bot.channels.cache.get(selectedCategoryId).name
    const channelData = await createChannel

    const connectDb = await db()
    try {
      await settingsSchema.findOneAndUpdate(
        {
          _id: interaction.guildId,
        },
        {
          _id: interaction.guildId,
          priconneLogChannelId: channelData.id,
        },
        { upsert: true }
      )
    } finally {
      cache[interaction.guildId] = {
        ...cache[interaction.guildId],
        priconneLogChannelId: channelData.id,
      }
      connectDb.connection.close()
    }

    const reply = await interaction.editReply({
      content: `${channelData.name} created in the ${categoryName} category!`,
    })

    return reply
  },
}
