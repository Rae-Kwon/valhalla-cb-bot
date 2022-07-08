const padTo2Digits = (num) => {
  return num.toString().padStart(2, '0');
}

const convertMsToTime = (milliseconds) => {
    let seconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)
    let days = Math.floor(hours / 24)

    seconds = seconds % 60
    minutes = minutes % 60
    hours = hours % 24
    
    return `${padTo2Digits(days)} days ${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(
    seconds,
    )}`
}

const convertHoursToMs = (hours) => {
    const msIn1Hour = 3600000
    return hours * msIn1Hour
}

module.exports = { convertMsToTime, convertHoursToMs }
