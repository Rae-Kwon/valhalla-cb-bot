module.exports = {
    name: 'setBotPresence',
    once: true,
    execute(client) {
        client.user.setPresence({ 
            status: 'available', 
            activity: {
                name: 'Clan Battle', 
                type: 'COMPETING' 
            }
        })
    },
}