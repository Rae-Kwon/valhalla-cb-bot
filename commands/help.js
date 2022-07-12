const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription("I'll let you know about the slash commands!"),
  async execute(interaction) {
    if (interaction.commandName === 'help') {
      const thisUser = interaction.user

      const helpEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Here to help you understand slash commands!')
        .addFields(
          {
            name: `ヤハロ〜!! ${thisUser.username}!!`,
            value: "Here's some info about the commands you can use!!",
          },
          {
            name: '/attack',
            value: `This one is for clan battles!! Type in the command and I'll bring up a window where you can type in you attack score!!
                
                1. You want to type in the day number of the clan battle! If it's the first day you type in 1!
                2. This is where you put in the attack number. You are allowed 3 attacks in a day. So if it's your first attack of the day 1. If you have an overkill or carryover don't worry! You can just combine the scores of your regular attack and the overkill or carryover attack into the one attack!!
                4. This one is pretty easy to understand! Just put in your attack score!
                5. This is the clan battle number! Just the number ok? Nothing else. You'll know what number clan battle it is when the mods create the sheet for the clan battle. If you're not sure what number clan battle it is ask someone in the clan
                
                Now that you're finished hit submit and I'll do the rest!!`,
          },
          {
            name: '/ingamescore',
            value: `This one is for when you've finished all your hits for the clan battle!! Your ingame score is viewable in Priconne under the in-clan clan battle rankings! 
                For this one there are only 2 fields!
                1. This is where you put in your ingame score!
                2. This is the clan battle number! Again if you're not sure you might be a baka so ask someone what number it is!`,
          },
          {
            name: '/currentevents',
            value: `This command lets you know what events are going on in Priconne!! Crunchyroll did not make it easy for Machu to get the data from so it's coming automatically from their site. If for any reason it looks broken then Crunchyroll are being baka baka's and changed it so you should contact Machu asap!!`,
          },
          { name: '/moka', value: `Throw a brick at Moka for bricking units!!` }
        )

      const modCommandsHelpEmbed = new MessageEmbed()
        .setColor('BLUE')
        .setTitle('Here to help you understand slash commands! For mods!')
        .addFields(
          {
            name: '/announceevents',
            value: `This is a command that lets me know to remind members with a selected role that an event is about to start or end!
                When you start the command a selection menu will pop up! This is where you can select the role for me to mention to people!!
                If I crash for whatever reason you will have to use this command again to let me know if I should announce events again!
                
                Do know that only mods and admins can use this command, so if you notice I'm not announcing events let one of them know they're being an aho!!`,
          },
          {
            name: '/createsheet',
            value: `This one is for the mods and admins! You can type in this command and a window will pop up where you will put in the clan battle number! I'll then create a sheet with everyone in it so make sure the role where all the clan battle members are is up to date!! Don't be a baaaaaka`,
          },
          {
            name: '/setup',
            value: `This one is for the mods and admins! This is to setup the attack channel and event announcement channel! If you already have both type in this command and type in or paste in the channel ID of what you want the attack and event channel to be. If you don't have either then leave them blank and I will automatically make them for you!!
                
                This is meant to be run one time, unless you decide to manually delete the channels, then you can run this and I will make new ones for you!!`,
          }
        )
        .setFooter({
          text: 'Any questions or concerns contact Machu!! またね!!',
        })
      thisUser.send({ embeds: [helpEmbed, modCommandsHelpEmbed] })

      await interaction.reply(`I sent you a DM ${thisUser}!`)
    }
  },
}
