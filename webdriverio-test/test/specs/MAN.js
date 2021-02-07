var chai = require('chai'),
    assert = chai.assert,
    jsforce = require('jsforce'),
    conn = new jsforce.Connection(),
    settings = require('../../../.vscode/settings.json');
    
describe('Salesforce E2E', function () {

  this.timeout(30000);

  it('should login', login);

  it('should create a new lead', () => {   
    createNewLead('Lead', 'Test', 'Test Company');
    const res = $('/html/body/div[4]/div[1]/section/div[1]/div[2]/div[2]/div[1]/div/div/div/div/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___lead_record_page___lead___view/forcegenerated-flexipage_lead_record_page_lead__view_js/record_flexipage-record-page-decorator/div[1]/slot/flexipage-record-home-with-subheader-template-desktop2/div/div[3]/div[1]/slot/slot/flexipage-component2/slot/flexipage-tabset2/div/lightning-tabset/div/slot/slot/slot/flexipage-tab2[1]/slot/flexipage-component2/slot/records-lwc-detail-panel/records-base-record-form/div/div/div/div/records-record-layout-event-broker/slot/records-lwc-record-layout/forcegenerated-detailpanel_lead___012000000000000aaa___full___view___recordlayout2/force-record-layout-block/slot/force-record-layout-section[1]/div/div/div/slot/force-record-layout-row[2]/slot/force-record-layout-item[1]/div/div/div[2]/span/slot[1]/slot/lightning-formatted-name');
    console.log('my lead name: ' + res.getText());
    assert.strictEqual(res.getText(), 'Lead Test');
    
  });

  it('should convert lead to account, contact and opportunity', () => {   
    $('#down').click();
    $('/html/body/div[5]/div[1]/section/div[1]/div[2]/div[2]/div[1]/div/div/div/div/div/one-record-home-flexipage2/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___lead_record_page___lead___view/forcegenerated-flexipage_lead_record_page_lead__view_js/record_flexipage-record-page-decorator/div[1]/slot/flexipage-record-home-with-subheader-template-desktop2/div/div[1]/slot/slot/flexipage-component2/slot/records-lwc-highlights-panel/records-lwc-record-layout/forcegenerated-highlightspanel_lead___012000000000000aaa___compact___view___recordlayout2/force-highlights2/div[1]/div[1]/div[3]/div/runtime_platform_actions-actions-ribbon/ul/li[4]/lightning-button-menu/div/div/slot/runtime_platform_actions-action-renderer[6]/runtime_platform_actions-aura-legacy-action/slot/slot/runtime_platform_actions-ribbon-menu-item/a/span').click();
    $('/html/body/div[5]/div[2]/div/div[2]/div/div[3]/button[2]/span').click();
  });
  
  it('should delete lead',  () => {   
    deleteCreatedLead('Lead Test')
      .then(console.log('Test Complete'));
   
  });

});

async function login() {
  return await conn.login(settings.username, settings.passwordWithToken)
    .then(userInfo => `${conn.instanceUrl}/secur/frontdoor.jsp?sid=${conn.accessToken}`)
    .then(url => browser.url(url));

}

/*function login() {
    var username = settings.username,
        password = settings.password,
        loginUrl = 'https://login.salesforce.com';
  
    browser.url(loginUrl)
    title = browser.getTitle();
    assert.strictEqual(title, 'Login | Salesforce');
    $('#username').setValue(username);
    $('#password').setValue(password);
    browser.saveScreenshot('./errorShots/login.png');
    $('#Login').click();

    browser.waitUntil(
      () => $('#tsidButton').waitForExist({ timeout: 5000 }),
      {
          timeout: 5000,
          timeoutMsg: 'expected text to be different after 5s'
      }
    ) // The SF App Switcher
    
    goToApp;

    assert.strictEqual(browser.getTitle(), 'Awesome App');
}*/

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
  return conn.query(`SELECT Id, Name FROM Opportunity WHERE Name = '${name}'`, function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
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