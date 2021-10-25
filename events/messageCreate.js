module.exports = {
    name: 'messageCreate',
    execute(message) {
        if (message.channel.name === 'attack-channel') {
            console.log(`${message.member.displayName} sent ${message.content}`)
        }
    },
}