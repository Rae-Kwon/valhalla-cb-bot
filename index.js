require('dotenv').config()

const fs = require('fs')
const { Client, Collection, Permissions } = require('discord.js')
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
        if (command.execute) {
            await cacheData(interaction.guildId, localCache)
            const channelId = localCache[interaction.guildId].eventAnnounceChannelId
            const eventChannel = bot.channels.cache.get(channelId)
            await command.execute(interaction, eventChannel, localCache)
        }
    } catch (error) {
        console.error('Catch error', error)
    }
})

// Initialize bot for modal submits
const modalSubmitFiles = fs.readdirSync('./modalSubmits').filter(file => file.endsWith('js'))

for (const file of modalSubmitFiles) {
    const modalSubmit = require(`./modalSubmits/${file}`)

    bot.on('interactionCreate', async interaction => {
        if (!interaction.isModalSubmit()) return
        try {
            if (interaction.customId === modalSubmit.name && modalSubmit.onSubmit) {
                const channelId = localCache[interaction.guildId].priconneLogChannelId
                const attackChannel = bot.channels.cache.get(channelId)
                const hasAttackChannelPermission = interaction.guild.me.permissionsIn(attackChannel).has(Permissions.FLAGS.VIEW_CHANNEL)
                await modalSubmit.onSubmit(interaction, attackChannel, hasAttackChannelPermission, bot)
            }
        } catch (error) {
            console.error(error)
        }
    })
}

// Initialize bot for select menu submits
const selectMenuFiles = fs.readdirSync('./selectMenu').filter((file) => file.endsWith('.js'))

for (const file of selectMenuFiles) {
    const selectMenu = require(`./selectMenu/${file}`)
    bot.on('interactionCreate', async interaction => {
        if (!interaction.isSelectMenu()) return
        try {
            if (interaction.customId === selectMenu.name && selectMenu.onSelect) {
                await selectMenu.onSelect(interaction, bot, localCache)
            }
        } catch (error) {
            console.error(error)
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

bot.login(process.env.DISCORD_TOKEN)
