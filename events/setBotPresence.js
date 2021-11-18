module.exports = {
    name: 'setBotPresence',
    once: true,
    execute(bot) {
        bot.user.setActivity('Clan Battle', { type: 'COMPETING' })
    },
}