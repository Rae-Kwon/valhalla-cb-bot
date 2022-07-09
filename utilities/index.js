const { convertHoursToMs } = require('./convertHoursToMs')
const { convertMsToTime } = require('./convertMsToTime')
const { getA1Notation, getValues, dupCbSheet, updateCbSheet } = require('./googleSheetsFuncs')

module.exports = { convertMsToTime, convertHoursToMs, getA1Notation, getValues, dupCbSheet, updateCbSheet }
