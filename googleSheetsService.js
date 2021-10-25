const { google } = require('googleapis')
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

const auth = new google.auth.GoogleAuth({ scopes: SCOPES })
const sheets = google.sheets('v4', auth)

async function getAuthToken() {
    const authToken = await auth.getClient()
    return authToken
}

async function getSpreadSheetValues({ spreadsheetId, sheetName }) {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: `${sheetName}!A1:X35`,
    })
    return res
}

async function writeSpreadSheetValue({ spreadsheetId, sheetName, cell, resource }) {
    const res = await sheets.spreadsheets.values.append({
        spreadsheetId,
        auth,
        range: `${sheetName}!${cell}`,
        valueInputOption: 'USER_ENTERED',
        resource
    })
}

module.exports = {
    getAuthToken,
    getSpreadSheetValues,
    writeSpreadSheetValue,
}

