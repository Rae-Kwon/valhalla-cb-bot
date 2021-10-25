const fs = require('fs')
const string = require('lodash/string')
const { token } = require('./config.json')
const { Client, Intents } = require('discord.js')
const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'))
const { getUsername, getClanBattleData } = require('./discordFuncs')
const { getA1Notation, getValues, writeValue } = require('./googleSheetsFuncs')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })


let values = [[]]

const resource = { values }
let cell

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
                        const dayNum = getClanBattleData(message)[0]
                        const attackNum = getClanBattleData(message)[1]
                        const score = getClanBattleData(message)[2]

                        for (let row = 0; row < sheetData.length; row++) {
                            for (let col = 0; col < sheetData.length; col++) {
                                if (message.member.displayName === sheetData[row][col]) {
                                    console.log(getA1Notation(row, col))
                                }
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
