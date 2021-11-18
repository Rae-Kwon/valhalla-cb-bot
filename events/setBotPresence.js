module.exports = {
    name: 'setBotPresence',
    once: true,
    execute(client) {
        bot.user.setPresence({ 
            status: 'available', 
            activity: {
                name: 'Clan Battle', 
                type: 'COMPETING' 
            }
        })
    },
}