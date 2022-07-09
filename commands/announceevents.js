const { SlashCommandBuilder } = require('@discordjs/builders')
const { PermissionFlagsBits } = require('discord-api-types/v10')
const { createSelectMenu } = require('../components/selectMenu')
const { notifyEventStartEnd } = require('../scheduledJobs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announceevents')
        .setDescription('Setup announcements for events remaining time')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(interaction, channel) {
        if (interaction.commandName === "announceevents") {
            // const roles = interaction.guild.channels.cache.filter(channel => channel.type === "GUILD_CATEGORY")

            // const rolesInfo = roles.map((category) => ({ label: category.name, description: `${category.name} category`, value: category.id }))
            const roles = await interaction.guild.roles.fetch()

            const priconneRoles = roles.filter((role) => role.name.toLowerCase().includes('priconne' || 'princess connect' || 'clan'))

            const rolesInfo = priconneRoles.map((role) => ({ label: role.name, description: `${role.name} role`, value: role.id }))
            
            const selectRole = createSelectMenu('selectRole', 'Select a role to announce events to!', rolesInfo)

            await interaction.reply({ content: 'Select a role to announce events remaining time to start/end!)', components: [selectRole], ephemeral: true })

            const selectedRoles = await interaction.channel.awaitMessageComponent({
                componentType: 'SELECT_MENU',
                filter: i => i.user.id === interaction.user.id
            }).catch(error => {
                console.error(error)
                return null
            })

            const selectedRole = selectedRoles.values[0]
            const selectedRoleObj = await interaction.guild.roles.fetch(selectedRole)

            notifyEventStartEnd.start(channel, selectedRole)
console.log(selectedRoleObj)
            await interaction.followUp({ content: `I'll let the ${selectedRoleObj.name} role know when an event is about to start or end now!` })
        }
    }
}