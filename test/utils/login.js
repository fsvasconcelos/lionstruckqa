var jsforce = require('jsforce'),
    settings = require('../../../.vscode/settings.json');

let currentConnection

async function createConnection() {
    currentConnection = new jsforce.Connection();
    return await currentConnection.login(settings.username, settings.passwordWithToken)
      .then(userInfo => `${conn.instanceUrl}/secur/frontdoor.jsp?sid=${conn.accessToken}`)
      .then(url => browser.url(url));
}

function connection() {
    if(!currentConnection){
        createConnection();
    }
    console.log(currentConnection.accessToken);
    console.log(currentConnection.instanceUrl);
    // logged in user property
    return currentConnection;
}

module.exports = connection;