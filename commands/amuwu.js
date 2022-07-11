const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('amuwu')
        .setDescription('Let Amuwu know!')
        .addSubcommand(subcommand => 
            subcommand
                .setName('spark')
                .setDescription('Amuwu had to spark!'))
        .addSubcommand(subcommand => 
            subcommand
                .setName('onepull')
                .setDescription('Kick!')),
    async execute(interaction) {
        if (interaction.commandName === "amuwu") {
            if (interaction.options.getSubcommand() === "spark") {
                await interaction.reply("⚡️")
                await interaction.followUp("Amuwu's gacha luck revoked")
            }

            if (interaction.options.getSubcommand() === "onepull") {
                await interaction.reply("<:FuckYuI:957037662156492960>")
                await interaction.followUp("Amuwu one pulled!! Kick!")
            }
        }
    }
}