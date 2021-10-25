module.exports = {
    name: 'messageCreate',
    execute(message) {
        console.log(`Testing... ${message.author.username} posted a score of ${message.content}`)
    },
}