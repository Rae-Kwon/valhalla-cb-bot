const { Modal, TextInputComponent, MessageActionRow } = require('discord.js')
const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createsheet')
        .setDescription('Create a new google sheet for Clan Battle score recording')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        if(interaction.commandName === 'createsheet') {
            const modal = new Modal()
                .setCustomId('createCbSheet')
                .setTitle('Create a new Clan Battle Sheet')
            const cbSheetInput = new TextInputComponent()
                .setCustomId('cbSheetInput')
                .setLabel('What number Clan Battle is this?')
                .setStyle('SHORT')
                .setRequired(true)

            const cbSheetActionRow = new MessageActionRow().addComponents(cbSheetInput)

            modal.addComponents(cbSheetActionRow)

            await interaction.showModal(modal)
        }
    }
}