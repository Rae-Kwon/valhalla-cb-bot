const { Modal, TextInputComponent, MessageActionRow } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')


module.exports = {
    data: new SlashCommandBuilder()
        .setName('attack')
        .setDescription('Add attack to clan battle database'),
    async execute(interaction) {
        if (interaction.commandName === 'attack') {
            const modal = new Modal()
                .setCustomId('registerCbAttack')
                .setTitle('Register your Clan Battle attack')

            const dayInput = new TextInputComponent()
                .setCustomId('dayInput')
                .setLabel('What day is this attack for?')
                .setStyle('SHORT')
                .setRequired(true)
            const attackInput = new TextInputComponent()
                .setCustomId('attackInput')
                .setLabel('What number attack is this?')
                .setStyle('SHORT')
                .setRequired(true)
            const scoreInput = new TextInputComponent()
                .setCustomId('scoreInput')
                .setLabel('What was your score?')
                .setStyle('SHORT')
                .setRequired(true)
            const cbNumInput = new TextInputComponent()
                .setCustomId('cbNumInput')
                .setLabel('What Clan Battle Number is this for?')
                .setStyle('SHORT')
                .setRequired(true)

            const dayActionRow = new MessageActionRow().addComponents(dayInput)
            const attackActionRow = new MessageActionRow().addComponents(attackInput)
            const scoreActionRow = new MessageActionRow().addComponents(scoreInput)
            const cbNumActionRow = new MessageActionRow().addComponents(cbNumInput)

            modal.addComponents(dayActionRow, attackActionRow, scoreActionRow, cbNumActionRow)

            await interaction.showModal(modal)
        }
    }
}