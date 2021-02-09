var chai = require('chai'),
    assert = chai.assert,
    jsforce = require('jsforce'),
    conn = new jsforce.Connection(),
    settings = require('../../../.vscode/settings.json'),
    myConstClass = require('../utils/constants.js');
    
describe('Salesforce E2E', function () {

  this.timeout(30000);

  const firstName = myConstClass.LEAD_FIRST_NAME;
  const lastName = myConstClass.LEAD_LAST_NAME;
  const company = myConstClass.LEAD_COMPANY;
  const leadName = `${firstName} ${lastName}`;

  it('should login', login);

  it('should create a new lead', () => {  
    createNewLead(firstName, lastName, company);
    const res = $('//flexipage-record-home-with-subheader-template-desktop2/div[1]/div[3]/div[1]/slot[1]/slot[1]/flexipage-component2[1]/slot[1]/flexipage-tabset2[1]/div[1]/lightning-tabset[1]/div[1]/slot[1]/slot[1]/slot[1]/flexipage-tab2[1]/slot[1]/flexipage-component2[1]/slot[1]/records-lwc-detail-panel[1]/records-base-record-form[1]/div[1]/div[1]/div[1]/div[1]/records-record-layout-event-broker[1]/slot[1]/records-lwc-record-layout[1]/forcegenerated-detailpanel_lead___012000000000000aaa___full___view___recordlayout2[1]/force-record-layout-block[1]/slot[1]/force-record-layout-section[1]/div[1]/div[1]/div[1]/slot[1]/force-record-layout-row[2]/slot[1]/force-record-layout-item[1]/div[1]/div[1]/div[2]/span[1]/slot[1]/slot[1]/lightning-formatted-name[1]');
    console.log('my lead name: ' + res.getText());
    assert.strictEqual(res.getText(), leadName);
    
  });

  it('should convert lead to account, contact and opportunity', () => {    
    browser.refresh();
    const menu = $('//flexipage-record-home-with-subheader-template-desktop2/div[1]/div[1]/slot[1]/slot[1]/flexipage-component2[1]/slot[1]/records-lwc-highlights-panel[1]/records-lwc-record-layout[1]/forcegenerated-highlightspanel_lead___012000000000000aaa___compact___view___recordlayout2[1]/force-highlights2[1]/div[1]/div[1]/div[3]/div[1]/runtime_platform_actions-actions-ribbon[1]/ul[1]/li[4]/lightning-button-menu[1]');
    browser.waitUntil(
      () => menu.waitForExist({ timeout: 5000 }),
      {
          timeout: 5000,
          timeoutMsg: 'expected element to exist after 5s'
      }
    )
		menu.click();
		menu.$("//div[1]/div[1]/slot[1]/runtime_platform_actions-action-renderer[6]/runtime_platform_actions-aura-legacy-action[1]/slot[1]/slot[1]/runtime_platform_actions-ribbon-menu-item[1]/a[1]").click();
    $('//body/div[4]/div[2]/div[1]/div[2]/div[1]/div[3]/button[2]').click();
    //console.log('Lead coverted!');
    getOpportunity(company).then(browser.debug());
  });
  
  it('should delete lead',  () => {   
    deleteCreatedLead(leadName)
      .then(console.log('Test Complete'));
   
  });

});

async function login() {
  return await conn.login(settings.username, settings.passwordWithToken)
    .then(userInfo => `${conn.instanceUrl}/secur/frontdoor.jsp?sid=${conn.accessToken}`)
    .then(url => browser.url(url));

}

function goToNewAccount() {
  return conn.describe("Account")
      .then(meta => meta.urls['uiNewRecord'])
      .then(url => browser.url(url));
}

function goToNewLead() {
  return conn.describe("Lead")
      .then(meta => meta.urls['uiNewRecord'])
      .then(url => browser.url(url));
}

function getLead(name) {
  return conn.query(`SELECT Id, Name FROM Lead WHERE Name = '${name}'`, function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
  });
}

function getAccount(name) {
  return conn.query(`SELECT Id, Name FROM Account WHERE Name = '${name}'`, function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
  });
}

function getContact(name) {
  return conn.query(`SELECT Id, Name FROM Contact WHERE Name = '${name}'`, function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
  });
}

function getOpportunity(name) {
  return conn.sobject('Opportunity')
  .find({ 'Account.Name' : name}, function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
    browser.url(`${conn.instanceUrl}${rets[0].attributes.url}`);
  });
}

async function createNewLead(firstName, lastName, company) {
  
  return await conn.sobject("Lead").create({ FirstName : firstName , LastName: lastName, Company: company}, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }
    console.log("Created record id : " + ret.id);
    browser.url(`${conn.instanceUrl}/lightning/r/Lead/${ret.id}/view`);
  })
}

function deleteCreatedLead(name){

  return conn.query(`SELECT Id FROM Lead WHERE Name = '${name}'`)
  .destroy('Lead', function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
    // ...
  });
}