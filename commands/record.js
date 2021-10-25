const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('record')
        .setDescription('Records clan battle data to sheet'),
    async execute(interaction) {
        await interaction.reply('Should record to sheet later...')
    }
}