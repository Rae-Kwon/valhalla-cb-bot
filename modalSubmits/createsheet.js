const { getA1Notation, dupCbSheet, updateCbSheet } = require('../utilities')

module.exports = {
  name: 'createCbSheet',
  async onSubmit(interaction, channel, channelPermission, bot) {
    await interaction.deferReply()
    const membersCbRole = await interaction.guild.roles.fetch(
      '872114916352458822'
    )
    const nonBotMembers = membersCbRole.members.filter(
      (member) => !member.user.bot
    )
    const members = nonBotMembers.map((member) =>
      member.nickname ? member.nickname : member.user.username
    )
    members.sort((a, b) => a.localeCompare(b))
    const cbSheetNum = interaction.fields.getTextInputValue('cbSheetInput')
    const sheetName = `CB ${cbSheetNum}`

    try {
      const createNewSheet = await dupCbSheet(sheetName)

      if (createNewSheet.status === 200) {
        for (let row = 0; row < members.length; row++) {
          // row + 2 to skip the first 2 header cells
          const cell = getA1Notation(row + 2, 0)
          const values = [[members[row]]]
          const resource = { values }
          await updateCbSheet(sheetName, cell, resource)
        }

        await interaction.editReply({
          content: `Yatta!! ${
            interaction.member.nickname || interaction.member.user.username
          } created sheet ${sheetName}!`,
          ephemeral: true,
        })

        if (channelPermission) {
          await channel.send({
            content: `Yatta!! ${
              interaction.member.nickname || interaction.member.user.username
            } created sheet ${sheetName}!`,
          })
        } else {
          channel.permissionOverwrites.edit(bot.user.id, { VIEW_CHANNEL: true })

          await channel.send({
            content: `Yatta!! ${
              interaction.member.nickname || interaction.member.user.username
            } created sheet ${sheetName}!`,
          })
        }
      }
      return createNewSheet
    } catch (error) {
      console.error(error)
      await interaction.editReply({
        content: `Yabai!! There was an error. Here it is: ${error.message}`,
        ephemeral: true,
      })
    }
  },
}
