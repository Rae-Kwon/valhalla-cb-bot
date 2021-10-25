const string = require('lodash/string')

const getUsername = (message) => {
    return message.member.displayName
}

const getMessage = (message) => {
    return message.content.split(',')
}

const getClanBattleData = (message) => {
    if (getMessage(message).length === 3) {
        let [day, attack, score] = getMessage(message)

        day = string.capitalize(day)
        attack = parseInt(attack)
        score = parseInt(score)

        return [day, attack, score]
    }
}

module.exports = {
    getUsername,
    getClanBattleData
}
