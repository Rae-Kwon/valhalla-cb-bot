const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('moka')
        .setDescription('Throw a brick at Moka'),
    async execute(interaction) {
        await interaction.reply('Moka!!!\nBAAAAAAAAAAKA!')
        await interaction.followUp('<:WorryThrowBrick:981953737394372668>')
    }
}