const { MessageActionRow, MessageSelectMenu } = require('discord.js')


const createSelectMenu = (id, placeholder, options) => {
    const selectMenu = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId(id)
                .setPlaceholder(placeholder)
                .addOptions(options)
        )

    return selectMenu
}

module.exports = { createSelectMenu }
