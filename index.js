require('dotenv').config()

const fs = require('fs')
const { Client, Intents } = require('discord.js')
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))
const { getClanBattleData, getIngameScore } = require('./discordFuncs')
const { getA1Notation, getValues, dupCbSheet, updateCbSheet } = require('./googleSheetsFuncs')

const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

async function main() {
    const spreadSheet = await getValues()
    const sheetData = spreadSheet.values

    for (const file of eventFiles) {
        const event = require(`./events/${file}`)
        if (event.once) {
            bot.once(event.name, (...args) => event.execute(...args))
        } else {
            bot.on(event.name, (...args) => {
                if (event.name === 'messageCreate') {
                    args.forEach((message) => {
                        try {
                            if (message.channel.name === 'attack-channel' && message.member.user.tag === 'Rayy#9837' && message.content.startsWith('CB')) {
                                dupCbSheet(message.content)
                                message.reply(`${message.content} Sheet created!`)
                            } else if (message.channel.name === 'attack-channel' && !message.author.bot && !(message.content.startsWith('CB'))) {
                                let cell
                                let values
                                let resource
                                const attackNumsCol = []
    
                                if (message.content.includes('ingame')) {
                                    let memberRow
                                    const ingameScore = getIngameScore(message)[1]
                                    const clanBattleNum = `CB ${getIngameScore(message)[2]}`
                                    values = [[ingameScore]]
                                    resource = { values }
                                    for (let row = 0; row < sheetData.length; row++) {
                                        for (let col = 0; col < sheetData.length; col++) {
                                            if (sheetData[row][0].includes(message.member.displayName)) {
                                                memberRow = row
                                            }
                                        }
                                    }
                                    cell = getA1Notation(memberRow, 22)
                                    updateCbSheet(clanBattleNum, cell, resource)
                                    message.reply(`Yatta!! ${message.member.displayName} sent an in-game score of ${ingameScore} to CB ${clanBattleNum}`)
                                } else {
                                    let memberRow
                                    const dayNum = getClanBattleData(message)[0]
                                    const attackNum = getClanBattleData(message)[1]
                                    const score = getClanBattleData(message)[2]
                                    const clanBattleNum = `CB ${getClanBattleData(message)[3]}`
                                    const dayNumIndex = dayNum - 1
                                    values = [[score]]
                                    resource = { values }
                                    for (let row = 0; row < sheetData.length; row++) {
                                        for (let col = 0; col < sheetData.length; col++) {
                                            if (sheetData[row][0].includes(message.member.displayName)) {
                                                memberRow = row
                                            }
        
                                            if (`Attack ${attackNum}` === sheetData[row][col]) {
                                                attackNumsCol.push(col)
                                            }
                                        }
                                    }
                                    cell = getA1Notation(memberRow, attackNumsCol[dayNumIndex])
                                    updateCbSheet(clanBattleNum, cell, resource)
                                    message.reply(`Yatta!! ${message.member.displayName} sent a score of ${score} to Day ${dayNum}, Attack ${attackNum}, ${clanBattleNum}`)
                                }
                            }
                        } catch (error) {
                            if (error) {
                                message.reply("Yabai, there was an error with your input! Try putting it in the format 'day x, x, xxxxxx, CB x'. If this is Ray and you're making a new CB sheet try the format 'CB x'")
                                console.log(error)
                            }
                        }
                    })
                }
                event.execute(...args)
            })
        }
    }
}

main()
bot.login(process.env.DISCORD_TOKEN)
