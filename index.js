require('dotenv').config()

const fs = require('fs')
const { Client, Collection } = require('discord.js')
const db = require('./serverFunctions/database')
const settingsSchema = require('./schema/settingsSchema')
const { cacheData } = require('./serverFunctions/cacheData')

const localCache = {}

const bot = new Client({ 
    intents: [
        'GUILDS', 
        'GUILD_MESSAGES', 
        'GUILD_PRESENCES'
    ] 
})

// Initialize bot for commands
bot.commands = new Collection()
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    bot.commands.set(command.data.name, command)
}

bot.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return

    const command = bot.commands.get(interaction.commandName)

    if (!command) return;

    try {
        if (interaction.commandName !== "setup") {
            await cacheData(interaction.guildId, localCache)
        }

        if (command.execute) {
            const channelId = localCache[interaction.guildId][1]
            const eventChannel = bot.channels.cache.get(channelId)
            await command.execute(interaction, eventChannel)
        }
    } catch (error) {
        console.error('Catch error', error)
        await interaction.reply({ content: `Yabai!! There was an error! This is what went wrong: ${error.message}`, ephemeral: true })
    }
})

// Initialize bot for modal submits
const modalSubmitFiles = fs.readdirSync('./modalSubmits').filter(file => file.endsWith('js'))

for (const file of modalSubmitFiles) {
    const modalSubmit = require(`./modalSubmits/${file}`)

    bot.on('interactionCreate', async interaction => {
        if (!interaction.isModalSubmit()) return
        if (interaction.customId === modalSubmit.name) {
            try {
                const channelId = localCache[interaction.guildId][0]
                const attackChannel = bot.channels.cache.get(channelId)
                await modalSubmit.onSubmit(interaction, attackChannel)
            } catch (error) {
                console.error(error)
                await interaction.reply({ content: `Yabai!! There was an error! This is what went wrong: ${error.message}`, ephemeral: true })
            }
        }
    })
}

// Initialize bot for events
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

bot.on('ready', async () => {
    console.log(`Ready! Logged in as ${bot.user.tag}`)
    bot.user.setActivity('Clan Battle', { type: 'COMPETING' })
})

bot.on('interactionCreate', async interaction => {
    if (!interaction.isSelectMenu()) return
    if (interaction.customId === 'selectAttackLogCategory') {
        await interaction.deferReply()
        const selectedCategoryId = interaction.values[0]
        const createChannel = interaction.guild.channels.create('attack-channel', {
            type: 'GUILD_TEXT',
            parent: selectedCategoryId
        })

        const categoryName = bot.channels.cache.get(selectedCategoryId).name
        const channelData = await createChannel
        
        const connectDb = await db()
        try {
            await settingsSchema.findOneAndUpdate({
                _id: interaction.guildId
            }, {
                _id: interaction.guildId,
                priconneLogChannelId: channelData.id
            }, { upsert: true })
        } finally {
            connectDb.connection.close()
        }

        await interaction.editReply({ content: `${channelData.name} created in the ${categoryName} category!` })
    }

    if (interaction.customId === 'selectEventAnnouncementCategory') {
        await interaction.deferReply()
        const selectedCategoryId = interaction.values[0]
        const createChannel = interaction.guild.channels.create('event-announcements', {
            type: 'GUILD_TEXT',
            parent: selectedCategoryId
        })

        const categoryName = bot.channels.cache.get(selectedCategoryId).name
        const channelData = await createChannel
        
        const connectDb = await db()
        try {
            await settingsSchema.findOneAndUpdate({
                _id: interaction.guildId
            }, {
                _id: interaction.guildId,
                eventAnnounceChannelId: channelData.id
            }, { upsert: true })
        } finally {
            connectDb.connection.close()
        }

        await interaction.editReply({ content: `${channelData.name} created in the ${categoryName} category!` })
    }
})

bot.login(process.env.DISCORD_TOKEN)
