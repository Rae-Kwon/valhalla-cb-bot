const getUsername = (message) => {
    return message.member.displayName
}

const getMessage = (message) => {
    if (!message.author.bot) {
        return message.content.split(',')
    }
}

const getClanBattleData = (message) => {
    if (getMessage(message).length === 3) {
        let [day, attack, score] = getMessage(message)

        day = parseInt(day.split('day')[1])
        attack = parseInt(attack)
        score = parseInt(score)

        return [day, attack, score]
    }
}

module.exports = {
    getUsername,
    getClanBattleData
}
