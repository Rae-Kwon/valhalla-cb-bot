const { google } = require('googleapis')
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

const auth = new google.auth.GoogleAuth({ scopes: SCOPES })
const sheets = google.sheets('v4', auth)

async function getAuthToken() {
    const authToken = await auth.getClient()
    return authToken
}

async function dupSheet({ spreadsheetId, auth, resource }) {
    const req = await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource,
        auth
    })
}

async function updateSheet({ spreadsheetId, sheetName, cell, resource }) {
    const req = await sheets.spreadsheets.values.update({
        spreadsheetId,
        auth,
        range: `${sheetName}!${cell}`,
        valueInputOption: 'USER_ENTERED',
        resource
    })
}

async function getSpreadSheetValues({ spreadsheetId, sheetName }) {
    const res = await sheets.spreadsheets.values.get({
        spreadsheetId,
        auth,
        range: `${sheetName}!A1:X35`,
    })
    return res
}

module.exports = {
    getAuthToken,
    dupSheet,
    updateSheet,
    getSpreadSheetValues,
}

