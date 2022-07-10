const cron = require('cron')
const { roleMention } = require('@discordjs/builders')
const { getEvents } = require('../webScrapeJobs')
const { convertHoursToMs } = require('../utilities')

const getChannelRole = (channel, role) => {
    return { channel, role }
}

// Run every hour 0 * * * *
const notifyEventStartEnd = (channel, role) => {
        const scheduler = cron.job('0 * * * *', async () => {
        console.log('Scheduled job runnning')
        const mentionRole = roleMention(role)

        const currentDateTime = new Date()
        const eventsData = await getEvents()

            eventsData.forEach((data) => {
                const checkStartTime = data.eventStart.getTime() - currentDateTime.getTime()
                const checkEndTime =  data.eventEnd.getTime() - currentDateTime.getTime()
                if (checkStartTime < convertHoursToMs(48) && checkStartTime > convertHoursToMs(47)) {
                    channel.send(`${mentionRole} ${data.eventName} starts in less than 48 hours!!!`)
                }

                if (checkStartTime < convertHoursToMs(24) && checkStartTime > convertHoursToMs(23)) {
                    channel.send(`${mentionRole} ${data.eventName} starts in less than 24 hours!!!`)
                }

                if (checkStartTime < convertHoursToMs(0) && checkStartTime > convertHoursToMs(-1)) {
                    channel.send(`${mentionRole} ${data.eventName} has started!!!`)
                }

                if (checkEndTime < convertHoursToMs(48) && checkEndTime > convertHoursToMs(47)) {
                    channel.send(`${mentionRole} ${data.eventName} ends in less than 48 hours!!!`)
                }

                if (checkEndTime < convertHoursToMs(24) && checkEndTime > convertHoursToMs(23)) {
                    channel.send(`${mentionRole} ${data.eventName} ends in less than 24 hours!!!`)
                }

                if (checkEndTime < convertHoursToMs(0) && checkEndTime > convertHoursToMs(-1)) {
                    channel.send(`${mentionRole} ${data.eventName} has ended!!!`)
                }
            })
        })

        return scheduler
}


module.exports = { notifyEventStartEnd, getChannelRole }
