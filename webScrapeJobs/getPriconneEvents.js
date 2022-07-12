const puppeteer = require('puppeteer')

const getEvents = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.goto('https://got.cr/priconne-update')
  const events = await page.evaluate(() => {
    for (let i = 2; i < 6; i++) {
      if (
        document.querySelectorAll(`.contents ul:nth-last-child(${i})`)
          .length === 1
      ) {
        return Array.from(
          document.querySelectorAll(`.contents ul:nth-last-child(${i}) > li`)
        ).map((element) => element.textContent)
      }
    }
  })
  await browser.close()

  /* Current year is assigned due to web scraped date format only containing month and day in 
    mm/dd format */
  const currentYear = new Date().getFullYear()
  const findDateTime = /(?:\d{2}|\d{1})\/(?:\d{2}|\d{1}) \d{2}:\d{2} UTC/gi
  const findStringBeforeDate = /(.*?)\(\d/
  const headline = events
    .map((event) => event.split('\n')[0])
    .filter((event) => event.match(findDateTime))
  const eventInfo = headline.map((header) => {
    return {
      eventName: header.match(findStringBeforeDate)[1].trim(),
      eventStart: new Date(`${currentYear}/${header.match(findDateTime)[0]}`),
      eventEnd: new Date(`${currentYear}/${header.match(findDateTime)[1]}`),
    }
  })

  return eventInfo.sort((a, b) => a.eventEnd.getTime() - b.eventEnd.getTime())
}

module.exports = { getEvents }
