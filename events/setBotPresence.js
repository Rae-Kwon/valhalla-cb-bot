module.exports = {
    name: 'setBotPresence',
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