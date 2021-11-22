const getUsername = (message) => {
    return message.member.displayName
}

const getMessage = (message) => {
    if (!message.author.bot) {
        return message.content.split(',')
    }
}

const getClanBattleData = (message) => {
    if (getMessage(message).length === 4) {
        let [day, attack, score, clanBattle] = getMessage(message)

        let daySplit = day.toLowerCase().split('day')
        let clanBattleSplit = clanBattle.toUpperCase().split('CB')
        day = parseInt(daySplit[daySplit.length - 1].trim())
        attack = parseInt(attack)
        score = parseInt(score)
        clanBattle = parseInt(clanBattleSplit[clanBattleSplit.length - 1].trim())
        if (day > 5 || day < 1 || attack > 3 || attack < 1) {
            throw 'The day or attack number is out of range'
        }

        return [day, attack, score, clanBattle]
    }
}

const getIngameScore = (message) => {
    if (getMessage(message).length === 3) {
        let [ingame, score, clanBattle] = getMessage(message)
        let clanBattleSplit = clanBattle.toUpperCase().split('CB')

        clanBattle = parseInt(clanBattleSplit[clanBattleSplit.length - 1].trim())

        return [ingame, score, clanBattle]
    }
}

module.exports = {
    getUsername,
    getClanBattleData,
    getIngameScore
}
