const string = require('lodash/string')

const getUsername = (message) => {
    return message.author.username
}

const getMessage = (message) => {
    return message.content 
}

const getClanBattleData = (message) => {
    let [day, attack, score] = getMessage(message).split(',')

    day = string.capitalize(day)
    score = parseInt(score)

    return [day, attack, score]
}

module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.channel.name === 'attack-channel') {
            messageContent = message
            getUsername(message)
            getClanBattleData(message)
            console.log(`${getUsername(message)} sent ${getClanBattleData(message)}`)
        }
    },
}