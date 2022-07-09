const { SlashCommandBuilder } = require('@discordjs/builders')
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { createSelectMenu } = require('../components/selectMenu')
const settingsSchema = require('../schema/settingsSchema')
const db = require('../serverFunctions/database')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .setDescription('Intial setup for Val-chan!')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction) {
        if (interaction.commandName === 'setup') {
            let attackChannelId
            let eventChannelId

            const guildCategories = interaction.guild.channels.cache.filter(channel => channel.type === "GUILD_CATEGORY")

            const categoriesInfo = guildCategories.map((category) => ({ label: category.name, description: `${category.name} category`, value: category.id }))

            const modal = new Modal()
                .setCustomId('addChannelIds')
                .setTitle('Add existing attack or event channel ID!')
            const attackChannelIdInput = new TextInputComponent()
                .setCustomId('attackChannelIdInput')
                .setLabel('Enter channel Id for existing attack channel.')
                .setStyle('SHORT')
            const eventChannelIdInput = new TextInputComponent()
                .setCustomId('eventChannelIdInput')
                .setLabel('Enter channel Id for existing event channel.')
                .setStyle('SHORT')

            const attackChannelIdActionRow = new MessageActionRow().addComponents(attackChannelIdInput)

            const eventChannelIdActionRow = new MessageActionRow().addComponents(eventChannelIdInput)

            modal.addComponents(attackChannelIdActionRow, eventChannelIdActionRow)

            await interaction.showModal(modal)

            const submitted = await interaction.awaitModalSubmit({
                time: 60000,
                filter: i => i.user.id === interaction.user.id,
            }).catch(error => {
                console.error(error)
                return null
            })

            if (submitted) {
                attackChannelId = submitted.fields.getTextInputValue('attackChannelIdInput')
                eventChannelId = submitted.fields.getTextInputValue('eventChannelIdInput')

                const connectDb = await db()
                try {
                    await settingsSchema.findOneAndUpdate({
                        _id: interaction.guildId
                    }, {
                        _id: interaction.guildId,
                        priconneLogChannelId: attackChannelId,
                        eventAnnounceChannelId: eventChannelId
                    }, { upsert: true })
                } finally {
                    connectDb.connection.close()
                }

                await submitted.reply({ content: `Attack channel ID: ${attackChannelId} | Event channel ID: ${eventChannelId} submitted` })
            }

            if (attackChannelId === "") {
                const selectAttackLogCategory = createSelectMenu('selectAttackLogCategory', 'Select Your Channel Category to create the attack log channel in', categoriesInfo)

                await interaction.followUp({ content: 'Select a category to create the attack-channel channel! (This is where all the successfully logged attacks go!)', components: [selectAttackLogCategory] })
            }

            if (eventChannelId === "") {
                const selectEventAnnouncementCategory = createSelectMenu('selectEventAnnouncementCategory', 'Select Your Channel Category to create the event announcement channel in', categoriesInfo)

                await interaction.followUp({ content: 'Select a category to create the event-announcement channel! (This is where all the event announcements go!)', components: [selectEventAnnouncementCategory] })
            }
        }
    }
}
