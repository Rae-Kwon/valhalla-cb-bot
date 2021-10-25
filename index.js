const fs = require('fs')
const { clientId, guildId, token } = require('./config.json')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { Client, Intents } = require('discord.js')
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
}

client.login(token)