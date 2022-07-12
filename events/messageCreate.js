module.exports = {
  name: 'messageCreate',
  execute(message) {
    if (message.channel.name === 'attack-channel') {
      console.log(`Message by ${message.member.user.tag} detected`)
    }
  },
}
