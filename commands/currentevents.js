const { SlashCommandBuilder } = require('@discordjs/builders')
const { getEvents } = require('../webScrapeJobs')
const { convertMsToTime } = require('../utilities')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('currentevents')
    .setDescription(
      'Lets you know what events are happening in Princess Connect'
    ),
  async execute(interaction) {
    if (interaction.commandName === 'currentevents') {
      await interaction.deferReply({ ephemeral: true })
      const currentDateTime = new Date()
      const eventData = await getEvents()
      const dateTimeOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      }
      const userLocale = interaction.locale

      const eventDataEmbedFieldFormat = eventData.map((data) => {
        const calculateEndTime =
          data.eventEnd.getTime() - currentDateTime.getTime()
        const endTimeInMilliseconds = new Date(calculateEndTime)
        const endTime = convertMsToTime(endTimeInMilliseconds)

        return {
          name: data.eventName,
          value: `Ends in: ${endTime} \n Start: ${data.eventStart.toLocaleString(
            userLocale,
            dateTimeOptions
          )} \n End: ${data.eventEnd.toLocaleString(
            userLocale,
            dateTimeOptions
          )}`,
        }
      })

      const embed = {
        color: '#0099ff',
        title: 'Current Priconne Events',
        description: 'A list of current events going on in Princess Connect',
        fields: eventDataEmbedFieldFormat,
        timestamp: currentDateTime,
      }

      await interaction.editReply({ embeds: [embed] })
    }
  },
}
