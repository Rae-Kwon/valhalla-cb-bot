module.exports = {
    name: 'setBotPresence',
    once: true,
    execute(bot) {
        bot.user.setPresence({ 
            status: 'available', 
            activity: {
                name: 'Clan Battle', 
                type: 'COMPETING' 
            }
        })
    },
}