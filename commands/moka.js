const { SlashCommandBuilder, userMention } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')

const id = '276492742127910912'
const user = userMention(id)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moka')
        .setDescription('Throw a brick at Moka'),
    async execute(interaction) {
        await interaction.reply(user)
        await interaction.followUp('<:WorryThrowBrick:981953737394372668>')
        await interaction.followUp('BAKA!')
    }
}