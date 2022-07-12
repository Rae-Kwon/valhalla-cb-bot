const { Modal, TextInputComponent, MessageActionRow } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ingamescore')
    .setDescription('Register your ingame score for Clan Battle'),
  async execute(interaction) {
    if (!interaction.isCommand()) return
    if (interaction.commandName === 'ingamescore') {
      const modal = new Modal()
        .setCustomId('registerCbIngameScore')
        .setTitle('Register your Clan Battle ingame score')

      const ingameScoreInput = new TextInputComponent()
        .setCustomId('ingameScoreInput')
        .setLabel('What was your ingame score?')
        .setStyle('SHORT')
        .setRequired(true)
      const cbNumInput = new TextInputComponent()
        .setCustomId('cbNumInput')
        .setLabel('What Clan Battle Number is this for?')
        .setStyle('SHORT')
        .setRequired(true)

      const ingameScoreActionRow = new MessageActionRow().addComponents(
        ingameScoreInput
      )
      const cbNumActionRow = new MessageActionRow().addComponents(cbNumInput)

      modal.addComponents(ingameScoreActionRow, cbNumActionRow)

      await interaction.showModal(modal)
    }
  },
}
