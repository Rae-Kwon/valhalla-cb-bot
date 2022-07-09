const { getA1Notation, getValues, updateCbSheet } = require('../utilities')


module.exports = {
    name: 'registerCbIngameScore',
    async onSubmit(interaction, channel) {
        let cell
        let values
        let resource
        let memberRow
        const ingameScore = interaction.fields.getTextInputValue('ingameScoreInput')
        const cbNum = interaction.fields.getTextInputValue('cbNumInput')
    
        const clanBattleNum = `CB ${cbNum}`
        const spreadSheet = await getValues(clanBattleNum)
        const sheetData = spreadSheet.values

        values = [[ingameScore]]
        resource = { values }
        for (let row = 0; row < sheetData.length; row++) {
            for (let col = 0; col < sheetData.length; col++) {
                if (sheetData[row][0].includes(interaction.member.nickname || interaction.member.user.username)) {
                    memberRow = row
                }
            }
        }
        cell = getA1Notation(memberRow, 22)
        const updateSheet = await updateCbSheet(clanBattleNum, cell, resource)

        if (updateSheet.status === 200) {
            await interaction.reply({ content: `Yatta!! ${interaction.member.nickname || interaction.member.user.username} sent an in-game score of ${ingameScore} to ${clanBattleNum}`, ephemeral: true})
            await channel.send({ content: `Yatta!! ${interaction.member.nickname || interaction.member.user.username} sent an in-game score of ${ingameScore} to ${clanBattleNum}` })
        }

        return updateSheet
    }
}