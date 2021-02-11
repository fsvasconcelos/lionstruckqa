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

  it('should convert lead ', () => {    
    const dropdown = $('//flexipage-record-home-with-subheader-template-desktop2/div[1]/div[1]/slot[1]/slot[1]/flexipage-component2[1]/slot[1]/records-lwc-highlights-panel[1]/records-lwc-record-layout[1]/forcegenerated-highlightspanel_lead___012000000000000aaa___compact___view___recordlayout2[1]/force-highlights2[1]/div[1]/div[1]/div[3]/div[1]/runtime_platform_actions-actions-ribbon[1]/ul[1]/li[4]/lightning-button-menu[1]');
    browser.waitUntil(
      () => dropdown.waitForExist({ timeout: 5000 }),
      {
          timeout: 5000,
          timeoutMsg: 'expected element to exist after 5s'
      }
    )
		dropdown.click();
		const convert = dropdown.$("//div[1]/div[1]/slot[1]/runtime_platform_actions-action-renderer[6]/runtime_platform_actions-aura-legacy-action[1]/slot[1]/slot[1]/runtime_platform_actions-ribbon-menu-item[1]/a[1]/span[1]");
    browser.waitUntil(
      () => convert.waitForClickable({ timeout: 5000 }),
      {
          timeout: 5000,
          timeoutMsg: 'expected element to exist after 5s'
      }
    )
    convert.click();
    $('/html[1]/body[1]/div[4]/div[2]/div[1]/div[2]/div[1]/div[3]/button[2]').click();
    browser.waitUntil(
      () => $("//span[contains(text(),'Your lead has been converted')]").isExisting(),
      {
        timeout: 30000,
        timeoutMsg: 'expected element to exist after 30s'
      }
    );
    
    console.log('Lead coverted!');
  });

  it('should return created account, contact and opportunity',  () => {   
    getOpportunity(company);
    //browser.debug();
    var accountName = $('//flexipage-record-home-with-subheader-template-desktop2/div[1]/div[3]/div[1]/slot[1]/slot[1]/flexipage-component2[1]/slot[1]/flexipage-tabset2[1]/div[1]/lightning-tabset[1]/div[1]/slot[1]/slot[1]/slot[1]/flexipage-tab2[1]/slot[1]/flexipage-component2[1]/slot[1]/records-lwc-detail-panel[1]/records-base-record-form[1]/div[1]/div[1]/div[1]/div[1]/records-record-layout-event-broker[1]/slot[1]/records-lwc-record-layout[1]/forcegenerated-detailpanel_opportunity___012090000005zy0aam___full___view___recordlayout2[1]/force-record-layout-block[1]/slot[1]/force-record-layout-section[1]/div[1]/div[1]/div[1]/slot[1]/force-record-layout-row[4]/slot[1]/force-record-layout-item[1]/div[1]/div[1]/div[2]/span[1]/slot[1]/slot[1]/force-lookup[1]');
    assert.strictEqual(company,accountName.getText());
    getAccount(company);
    accountName = $('//body/div[4]/div[1]/section[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[3]/div[1]/one-record-home-flexipage2[1]/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___account_record_page___account___view[1]/forcegenerated-flexipage_account_record_page_account__view_js[1]/record_flexipage-record-page-decorator[1]/div[1]/slot[1]/flexipage-record-home-template-desktop2[1]/div[1]/div[2]/div[1]/slot[1]/slot[1]/flexipage-component2[1]/slot[1]/flexipage-tabset2[1]/div[1]/lightning-tabset[1]/div[1]/slot[1]/slot[1]/slot[1]/flexipage-tab2[1]/slot[1]/flexipage-component2[1]/slot[1]/records-lwc-detail-panel[1]/records-base-record-form[1]/div[1]/div[1]/div[1]/div[1]/records-record-layout-event-broker[1]/slot[1]/records-lwc-record-layout[1]/forcegenerated-detailpanel_account___012000000000000aaa___full___view___recordlayout2[1]/force-record-layout-block[1]/slot[1]/force-record-layout-section[1]/div[1]/div[1]/div[1]/slot[1]/force-record-layout-row[2]/slot[1]/force-record-layout-item[1]/div[1]/div[1]/div[2]/span[1]/slot[1]/slot[1]/lightning-formatted-text[1]');
    assert.strictEqual(company,accountName.getText());
    getContact(company);
    accountName = $('//body/div[4]/div[1]/section[1]/div[1]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]/div[4]/div[1]/one-record-home-flexipage2[1]/forcegenerated-adgrollup_component___forcegenerated__flexipage_recordpage___contact_record_page___contact___view[1]/forcegenerated-flexipage_contact_record_page_contact__view_js[1]/record_flexipage-record-page-decorator[1]/div[1]/slot[1]/flexipage-record-home-template-desktop2[1]/div[1]/div[2]/div[1]/slot[1]/slot[1]/flexipage-component2[1]/slot[1]/flexipage-tabset2[1]/div[1]/lightning-tabset[1]/div[1]/slot[1]/slot[1]/slot[1]/flexipage-tab2[1]/slot[1]/flexipage-component2[1]/slot[1]/records-lwc-detail-panel[1]/records-base-record-form[1]/div[1]/div[1]/div[1]/div[1]/records-record-layout-event-broker[1]/slot[1]/records-lwc-record-layout[1]/forcegenerated-detailpanel_contact___012000000000000aaa___full___view___recordlayout2[1]/force-record-layout-block[1]/slot[1]/force-record-layout-section[1]/div[1]/div[1]/div[1]/slot[1]/force-record-layout-row[3]/slot[1]/force-record-layout-item[1]/div[1]/div[1]/div[2]/span[1]/slot[1]/slot[1]/force-lookup[1]/div[1]/force-hoverable-link[1]/div[1]/a[1]/span[1]');
    assert.strictEqual(company,accountName.getText());
   
  });

  
  it('should delete created account, contact and opportunity',  () => {   
    deleteAccount(company)
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

async function getAccount(name) {
  return await conn.sobject('Account')
  .find({ 'Name' : name}, function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
    browser.url(`${conn.instanceUrl}/lightning/r/Account/${rets[0].Id}/view`);
  });
}

async function getContact(name) {
  return await conn.sobject('Contact')
  .find({ 'Account.Name' : name}, function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
    browser.url(`${conn.instanceUrl}/lightning/r/Contact/${rets[0].Id}/view`);
  });
}

async function getOpportunity(name) {
  return await conn.sobject('Opportunity')
  .find({ 'Account.Name' : name}, function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
    browser.url(`${conn.instanceUrl}/lightning/r/Opportunity/${rets[0].Id}/view`);
  });
}

async function createNewLead(firstName, lastName, company) {
  
  return await conn.sobject("Lead").create({ FirstName : firstName , LastName: lastName, Company: company}, function(err, ret) {
    if (err || !ret.success) { return console.error(err, ret); }
    console.log("Created record id : " + ret.id);
    browser.url(`${conn.instanceUrl}/lightning/r/Lead/${ret.id}/view`);
  })
}

function deleteAccount(name){

  return conn.query(`SELECT Id FROM Account WHERE Name = '${name}'`)
  .destroy('Account', function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
    // ...
  });
}
