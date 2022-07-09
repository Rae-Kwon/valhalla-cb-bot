const convertHoursToMs = (hours) => {
    const msIn1Hour = 3600000
    return hours * msIn1Hour
}

module.exports = { convertHoursToMs }
