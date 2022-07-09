const { MessageActionRow, MessageButton } = require('discord.js')


const createButton = (id, placeholder, style) => {
    const button = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(id)
                .setLabel(placeholder)
                .setStyle(style)
        )

    return button
}

module.exports = { createButton }
