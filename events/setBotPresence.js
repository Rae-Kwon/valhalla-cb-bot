module.exports = {
    name: 'setBotPresence',
    once: true,
    execute(bot) {
        bot.user.setPresence({
            status: 'online',
            activities: [{
                name: 'Clan Battle',
                type: 5
            }]
        })
    },
}