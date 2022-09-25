const { getA1Notation, getValues, updateCbSheet } = require('../utilities')

module.exports = {
  name: 'registerCbAttack',
  async onSubmit(interaction, channel, channelPermission, bot) {
    await interaction.deferReply()
    const dayNum = interaction.fields.getTextInputValue('dayInput')
    const attackNum = interaction.fields.getTextInputValue('attackInput')
    const score = interaction.fields.getTextInputValue('scoreInput')
    const cbNum = interaction.fields.getTextInputValue('cbNumInput')
    const clanBattleNum = `CB ${cbNum}`

    try {
      const spreadSheet = await getValues(clanBattleNum)
      const sheetData = spreadSheet.values

      let cell
      let values
      let resource
      const attackNumsCol = []

      let memberRow
      const dayNumIndex = dayNum - 1
      values = [[score]]
      resource = { values }
      for (let row = 0; row < sheetData.length; row++) {
        for (let col = 0; col < sheetData.length; col++) {
          if (
            sheetData[row][0].includes(
              interaction.member.nickname || interaction.member.user.username
            ) &&
            sheetData[row][0] !== undefined
          ) {
            memberRow = row
          }

          if (`Attack ${attackNum}` === sheetData[row][col]) {
            attackNumsCol.push(col)
          }
        }
      }
      cell = getA1Notation(memberRow, attackNumsCol[dayNumIndex])
      const updateSheet = await updateCbSheet(clanBattleNum, cell, resource)

      if (updateSheet.status === 200 && channelPermission) {
        await interaction.editReply({
          content: `Yatta!! You sent a score of ${score} to Day ${dayNum}, Attack ${attackNum}, ${clanBattleNum} to the ${channel} channel`,
          ephemeral: true,
        })
      }
      return updateSheet
    } catch (error) {
      console.error(error)
      await interaction.editReply({
        content: `Yabai!! There was an error. Here it is: ${error.message}`,
        ephemeral: true,
      })
    }
  },
}
