var chai = require('chai'),
    assert = chai.assert,
    jsforce = require('jsforce'),
    conn = new jsforce.Connection(),
    settings = require('../../.vscode/settings.json'),
    myConstClass = require('../utils/constants.js');

describe('Salesforce E2E', function () {

  this.timeout(30000);

  const account = myConstClass.LEAD_COMPANY;

  it('should login', login);

  it('should update opportunity stage',  () => {   
    updateOpportunity(account);
    browser.pause(7000);

  });

  it('should add quote',  () => {   
    getOpportunityQuotes(account);
    browser.pause(3000);
    const addQuote = $("//div[contains(text(),'New Quote')]");
    addQuote.click();
    browser.pause(3000);
    browser.keys('\uE015');//Arrow down
    browser.keys('\uE007');//Enter
    browser.pause(3000);

    //const quoteName = $('//*[@id="8:2203;a"]/div/div[2]/div[1]');
    //quoteName.setValue("Test Quote");

    browser.keys('\uE004');//Tab
    browser.keys('\uE004');//Tab
    browser.keys(['T','e','s','t']);

    browser.pause(3000);
    /*const syncing = $('//body/div[5]/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/article[1]/div[3]/div[1]/div[1]/div[1]/div[1]/div[2]/div[2]/div[1]/div[2]/span[1]/span[1]/img[1]');
    syncing.click();

    assert.isTrue(syncing.isSelected());
    
    browser.pause(3000);*/
    /*const save = $('//body/div[5]/div[2]/div[1]/div[2]/div[1]/div[2]/div[1]/div[1]/div[2]/div[1]/div[1]/div[2]/button[3]');
    save.click();*/
    for(i=0;i<23;i++){
        browser.keys('\uE004');//Tab
    }

    browser.keys('\uE007');//Enter
    browser.pause(3000);
  });

  
  it('should return created quote',  () => {   
    getQuote(account);
    browser.pause(3000);
  });

  it('should update quote',  () => {   
    updateQuote(account);
    browser.pause(3000);
  });

  it('should return order and assets',  () => {   
    getOrder(account);
    browser.pause(3000);

    getAsset(account);
    browser.pause(3000);
  });

  it('should return order and assets',  () => {    
    updateOrder(account);
    browser.pause(3000);
  });


});

async function login() {
  return await conn.login(settings.username, settings.passwordWithToken)
    .then(userInfo => `${conn.instanceUrl}/secur/frontdoor.jsp?sid=${conn.accessToken}`)
    .then(url => browser.url(url));

}

async function getAccount(name) {
  return await conn.sobject('Account')
  .find({ 'Name' : name}, function(err, rets) {
    if (err) { return console.error(err); }
    //console.log(rets);
    assert.strictEqual(rets[0].Name,name);
    browser.url(`${conn.instanceUrl}/lightning/r/Account/${rets[0].Id}/view`);
  });
}

async function getQuote(account) {
    getAccount(account);
    browser.pause(3000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
    return await conn.sobject('Quote')
    .find({ AccountId : accountId}, function(err, rets) {
        if (err) { return console.error(err); }
        console.log(rets);
        browser.url(`${conn.instanceUrl}/lightning/r/Quote/${rets[0].Id}/view`);
    });
}

async function updateQuote(account) {

    getAccount(account);
    browser.pause(3000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
  
    return await conn.sobject('Quote')
        .find({ AccountId : accountId })
            .update({ Status: 'Accepted' }, function(err, rets) {
                if (err) { return console.error(err); }
                console.log(rets);
                browser.url(`${conn.instanceUrl}/lightning/r/Quote/${rets[0].id}/view`);
      });
}

async function updateOpportunity(account) {

    getAccount(account);
    browser.pause(5000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
  
    return await conn.sobject('Opportunity')
    .find({ AccountId : accountId })
        .update({ StageName: 'Proposal/Price Quote' }, function(err, rets) {
            if (err) { return console.error(err); }
            console.log(rets);
            browser.url(`${conn.instanceUrl}/lightning/r/Opportunity/${rets[0].id}/view`);
  });
}

 async function getOpportunityQuotes(account) {
    getAccount(account);
    browser.pause(3000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
    return await conn.sobject('Opportunity')
    .find({ AccountId : accountId}, function(err, rets) {
      if (err) { return console.error(err); }
      console.log(rets);
      browser.url(`${conn.instanceUrl}/lightning/r/Quote/${rets[0].Id}/related/Quotes/view`);
    });
}

async function getOrder(account) {
    getAccount(account);
    browser.pause(3000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
    return await conn.sobject('Order')
    .find({ AccountId : accountId}, function(err, rets) {
      if (err) { return console.error(err); }
      console.log(rets);
      browser.url(`${conn.instanceUrl}/lightning/r/Order/${rets[0].Id}/view`);
    });
}

async function updateOrder(account) {

    getAccount(account);
    browser.pause(3000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
  
    return await conn.sobject('Order')
        .find({ AccountId : accountId })
            .update({ Status: 'Activated' }, function(err, rets) {
                if (err) { return console.error(err); }
                console.log(rets);
                browser.url(`${conn.instanceUrl}/lightning/r/Order/${rets[0].id}/view`);
      });
}

async function getAsset(account) {
    getAccount(account);
    browser.pause(3000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
    return await conn.sobject('Asset')
    .find({ AccountId : accountId}, function(err, rets) {
      if (err) { return console.error(err); }
      console.log(rets);
      rets.forEach(i => {
        browser.url(`${conn.instanceUrl}/lightning/r/Asset/${rets[i].Id}/view`);
        browser.pause(3000);
      });
    });
}
/*async function createNewOpportunity(oppName, stageName) {
    var currentDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    var day = currentDate.getDate()
    var month = currentDate.getMonth() + 1
    var year = currentDate.getFullYear()
    var tomorrow = `${year}-${month}-${day}`
  
    return await conn.sobject("Opportunity").create({ Name : oppName , StageName: stageName, CloseDate: tomorrow}, function(err, ret) {
      if (err || !ret.success) { return console.error(err, ret); }
      console.log("Created record id : " + ret.id);
      browser.url(`${conn.instanceUrl}/lightning/r/Opportunity/${ret.id}/view`);
    })
}
*/
async function deleteAccount(name){

  return await conn.sobject('Account')
  .find({ 'Name' : name })
  .destroy(function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
  })
}