const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('A test command to see if this works'),
    async execute(interaction) {
        await interaction.reply('Test Success!!')
    },
}
