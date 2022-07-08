require('dotenv').config()

const fs = require('fs')
const { Client, Collection } = require('discord.js')
const cron = require('cron')
const { getA1Notation, getValues, dupCbSheet, updateCbSheet } = require('./googleSheetsFuncs')
const { getEvents } = require('./getPriconneEvents')
const { convertHoursToMs } = require('./utilities')
const { roleMention } = require('@discordjs/builders')

const bot = new Client({ 
    intents: [
        'GUILDS', 
        'GUILD_MESSAGES', 
        'GUILD_PRESENCES'
    ] 
})

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
            await command.execute(interaction)
        }
    } catch (error) {
        console.error(error)
        await interaction.reply({ content: 'There was an error executing this command', ephemeral: true })
    }
})

bot.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return
    if (interaction.customId === 'createCbSheet') {
        const membersCbRole = await interaction.guild.roles.fetch('872114916352458822')
        const nonBotMembers = membersCbRole.members.filter((member) => !member.user.bot)
        const members = nonBotMembers.map((member) => member.nickname ? member.nickname : member.user.username)
        members.sort((a, b) => a.localeCompare(b))
        const cbSheetNum = interaction.fields.getTextInputValue('cbSheetInput')
        const sheetName = `CB ${cbSheetNum}`
        const createNewSheet = await dupCbSheet(sheetName)

        if (createNewSheet.status === 200) {
            for (let row = 0; row < members.length; row++) {
                // row + 2 to skip the first 2 header cells
                const cell = getA1Notation(row + 2, 0)
                const values = [[members[row]]]
                const resource = { values }
                updateCbSheet(sheetName, cell, resource)
            }
        }

        await interaction.reply({ content: `Yatta!! ${sheetName} created!` })
    }
})


bot.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === 'registerCbAttack') {
        const dayNum = interaction.fields.getTextInputValue('dayInput')
        const attackNum = interaction.fields.getTextInputValue('attackInput')
        const score = interaction.fields.getTextInputValue('scoreInput')
        const cbNum = interaction.fields.getTextInputValue('cbNumInput')

        const clanBattleNum = `CB ${cbNum}`
        const spreadSheet = await getValues(clanBattleNum)
        const sheetData = spreadSheet.values

        let cell
        let values
        let resource
        const attackNumsCol = []

        let memberRow
        const dayNumIndex = dayNum - 1
        values = [[score]]
        resource = { values }
        for (let row = 0; row < sheetData.length; row++) {
            for (let col = 0; col < sheetData.length; col++) {
                if (sheetData[row][0].includes(interaction.member.nickname || interaction.member.user.username)) {
                    memberRow = row
                }

                if (`Attack ${attackNum}` === sheetData[row][col]) {
                    attackNumsCol.push(col)
                }
            }
        }
        cell = getA1Notation(memberRow, attackNumsCol[dayNumIndex])
        updateCbSheet(clanBattleNum, cell, resource)

        await interaction.reply({ content: `Yatta!! ${interaction.member.nickname || interaction.member.user.username} sent a score of ${score} to Day ${dayNum}, Attack ${attackNum}, ${clanBattleNum}` })
    }
})

bot.on('interactionCreate', async interaction => {
    if (!interaction.isModalSubmit())
    if (interaction.customId === 'registerCbIngameScore') {
        let cell
        let values
        let resource
        let memberRow
        const ingameScore = interaction.fields.getTextInputValue('ingameScoreInput')
        const cbNum = interaction.fields.getTextInputValue('cbNumInput')
    
        const clanBattleNum = `CB ${cbNum}`
        const spreadSheet = await getValues(clanBattleNum)
        const sheetData = spreadSheet.values

        values = [[ingameScore]]
        resource = { values }
        for (let row = 0; row < sheetData.length; row++) {
            for (let col = 0; col < sheetData.length; col++) {
                if (sheetData[row][0].includes(interaction.member.nickname || interaction.member.user.username)) {
                    memberRow = row
                }
            }
        }
        cell = getA1Notation(memberRow, 22)
        updateCbSheet(clanBattleNum, cell, resource)
        await interaction.reply(`Yatta!! ${interaction.member.nickname || interaction.member.user.username} sent an in-game score of ${ingameScore} to ${clanBattleNum}`)
    }
})


const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))

for (const file of eventFiles) {
    const event = require(`./events/${file}`)
    if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

bot.on('ready', () => {
    console.log(`Ready! Logged in as ${bot.user.tag}`)
    bot.user.setActivity('Clan Battle', { type: 'COMPETING' })

    const scheduledMessage = new cron.CronJob('0 * * * *', () => {
        console.log('Scheduled job runnning')
        const guild = bot.guilds.cache.get('814520809765994517')
        const channel = guild.channels.cache.get('900250215976697858')
        const mentionRole = roleMention('872114916352458822')
        const currentDateTime = new Date()
        const eventsData = getEvents()

        eventsData.forEach((data) => {
            const checkStartTime = data.eventStart.getTime() - currentDateTime.getTime()
            const checkEndTime =  data.eventEnd.getTime() - currentDateTime.getTime()
            if (checkStartTime < convertHoursToMs(48) && checkStartTime > convertHoursToMs(47)) {
                channel.send(`${mentionRole} ${data.eventName} starts in less than 48 hours!!!`)
            }

            if (checkStartTime < convertHoursToMs(24) && checkStartTime > convertHoursToMs(23)) {
                channel.send(`${mentionRole} ${data.eventName} starts in less than 24 hours!!!`)
            }

            if (checkStartTime < convertHoursToMs(0) && checkStartTime > convertHoursToMs(-1)) {
                channel.send(`${mentionRole} ${data.eventName} has started!!!`)
            }

            if (checkEndTime < convertHoursToMs(48) && checkEndTime > convertHoursToMs(47)) {
                channel.send(`${mentionRole} ${data.eventName} ends in less than 48 hours!!!`)
            }

            if (checkEndTime < convertHoursToMs(24) && checkEndTime > convertHoursToMs(23)) {
                channel.send(`${mentionRole} ${data.eventName} ends in less than 24 hours!!!`)
            }

            if (checkEndTime < convertHoursToMs(0) && checkEndTime > convertHoursToMs(-1)) {
                channel.send(`${mentionRole} ${data.eventName} has ended!!!`)
            }
        })
    })

    scheduledMessage.start()
})



bot.login(process.env.DISCORD_TOKEN)
