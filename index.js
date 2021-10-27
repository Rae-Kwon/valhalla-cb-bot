const fs = require('fs')
const string = require('lodash/string')
const { token } = require('./config.json')
const { Client, Intents } = require('discord.js')
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))
const { getUsername, getClanBattleData } = require('./discordFuncs')
const { getA1Notation, getValues, writeValue, dupCbSheet } = require('./googleSheetsFuncs')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

async function main() {
    const spreadSheet = await getValues()
    const sheetData = spreadSheet.values

    for (const file of eventFiles) {
        const event = require(`./events/${file}`)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => {
                if (event.name === 'messageCreate') {
                    args.forEach((message) => {
                        try {
                            // Rayy#9837
                            console.log(message.author.username)
                            if (message.channel.name === 'attack-channel' && message.member.user.tag === 'MachuPichu#3535' && message.content.includes('CB')) {
                                dupCbSheet(message.content)
                                message.reply(`${message.content} Sheet created!`)
                            } else if (message.channel.name === 'attack-channel' && !message.author.bot && !(message.content.includes('CB'))) {
                                let memberRow
                                let cell
                                const attackNumsCol = []
                                const dayNum = getClanBattleData(message)[0]
                                const attackNum = getClanBattleData(message)[1]
                                const score = getClanBattleData(message)[2]
                                const dayNumIndex = dayNum - 1
                                const values = [[score]]
                                const resource = { values }
    
                                for (let row = 0; row < sheetData.length; row++) {
                                    for (let col = 0; col < sheetData.length; col++) {
                                        console.log(sheetData[row][col])
                                        if (sheetData[row][0].includes(message.member.displayName)) {
                                            console.log(row)
                                            memberRow = row
                                        }
    
                                        if (`Attack ${attackNum}` === sheetData[row][col]) {
                                            attackNumsCol.push(col)
                                        }
                                    }
                                }
    
                                cell = getA1Notation(memberRow, attackNumsCol[dayNumIndex])
                                writeValue(cell, resource)
                                message.reply(`Yatta!! ${message.member.displayName} sent a score of ${score} to Day ${dayNum}, Attack ${attackNum}`)
                            }
                        } catch (error) {
                            if (error) {
                                message.reply("Yabai, there was an error with your input! Try putting it in the format 'day x, x, xxxxxx'. If this is Ray and you're making a new CB sheet try the format 'CB x'")
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
client.login(token)
