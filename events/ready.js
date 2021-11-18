module.exports = {
    name: 'ready',
    execute(bot) {
        console.log(`Ready! Logged in as ${bot.user.tag}`)
        bot.user.setActivity('Clan Battle', { type: 'COMPETING' })
    },
}