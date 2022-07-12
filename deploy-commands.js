require('dotenv').config()

const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

const commands = []
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN)

const updateCommands = async () => {
  try {
    console.log('Successfully registered commands')
    const update = await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
      { body: commands }
    )
    return update
  } catch (error) {
    console.error(error)
  }
}

updateCommands()
