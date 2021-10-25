const {
    getAuthToken,
    getSpreadSheetValues,
    writeSpreadSheetValue,
} = require("./googleSheetsService.js")

const spreadsheetId = process.argv[2]
const sheetName = process.argv[3]

function getA1Notation(row, column) {
    const a1Notation = [`${row + 1}`]
    const totalAlphabets = "Z".charCodeAt() - "A".charCodeAt() + 1
    let block = column
    while (block >= 0) {
        a1Notation.unshift(
            String.fromCharCode((block % totalAlphabets) + "A".charCodeAt())
        )
        block = Math.floor(block / totalAlphabets) - 1
    }

    return a1Notation.join("")
}

async function getValues() {
    try {
        const auth = await getAuthToken()
        const response = await getSpreadSheetValues({
            spreadsheetId,
            auth,
            sheetName,
        })
        const sheetData = JSON.parse(JSON.stringify(response.data, null, 2))
        return sheetData
    } catch (error) {
        console.log(`Error getting ${sheetName}`, error.message)
    }
}

async function writeValue(cell, resource) {
    try {
        const auth = await getAuthToken()
        const request = await writeSpreadSheetValue({
            spreadsheetId,
            auth,
            sheetName,
            cell,
            resource,
        })
        console.log(request)
    } catch (error) {
        console.log(`Error updating ${sheetName}`, error.message)
    }
}

module.exports = {
    getA1Notation,
    getValues,
    writeValue
}
