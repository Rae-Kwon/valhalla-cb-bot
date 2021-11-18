module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        bot.user.setPresence({ 
            status: 'available', 
            activity: {
                name: 'Clan Battle', 
                type: 'COMPETING' 
            }
        })
        console.log(`Ready! Logged in as ${client.user.tag}`)
    },
}