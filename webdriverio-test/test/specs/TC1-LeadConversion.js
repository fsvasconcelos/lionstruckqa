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

  it('should convert lead into account, contact and opportunity', () => {    
    browser.pause(3000);
    const dropdown = $('//flexipage-record-home-with-subheader-template-desktop2/div[1]/div[1]/slot[1]/slot[1]/flexipage-component2[1]/slot[1]/records-lwc-highlights-panel[1]/records-lwc-record-layout[1]/forcegenerated-highlightspanel_lead___012000000000000aaa___compact___view___recordlayout2[1]/force-highlights2[1]/div[1]/div[1]/div[3]/div[1]/runtime_platform_actions-actions-ribbon[1]/ul[1]/li[4]/lightning-button-menu[1]');
		dropdown.click();
		browser.pause(3000);
    browser.keys('\uE015');//Arrow down
    browser.keys('\uE015');//Arrow down
    browser.keys('\uE015');//Arrow down
    browser.keys('\uE015');//Arrow down
    browser.keys('\uE015');//Arrow down
    browser.keys('\uE007');//Enter

    browser.pause(3000);
    
    $('/html[1]/body[1]/div[4]/div[2]/div[1]/div[2]/div[1]/div[3]/button[2]').click();
    
    browser.waitUntil(
      () => $("//span[contains(text(),'Your lead has been converted')]").isExisting(),
      {
        timeout: 5000,
        timeoutMsg: 'expected element to exist after 5s'
      }
    );

    browser.pause(3000);
    
    console.log('Lead converted!');
  });

  it('should return created account, contact and opportunity',  () => {   
    getOpportunity(company);
    
    getAccount(company);

    getContact(company, firstName, lastName);
    browser.pause(3000);

  });

  
  it('should delete created account, contact and opportunity',  () => {   
    browser.pause(3000);
    deleteAccount(company);
    console.log('Test Complete');
   
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
    console.log(rets);
    assert.strictEqual(rets[0].Name,name);
    browser.url(`${conn.instanceUrl}/lightning/r/Account/${rets[0].Id}/view`);
  });
}

async function getContact(name, firstName, lastName) {
  return await conn.sobject('Contact')
  .find({ 'Account.Name' : name}, function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
    assert.strictEqual(rets[0].FirstName,firstName);
    assert.strictEqual(rets[0].LastName,lastName);
    browser.url(`${conn.instanceUrl}/lightning/r/Contact/${rets[0].Id}/view`);
  });
}

async function getOpportunity(name) {
  return await conn.sobject('Opportunity')
  .find({ 'Account.Name' : name}, function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
    assert.strictEqual(rets[0].Name,name+'-');
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

async function deleteAccount(name){

  return await conn.sobject('Account')
  .find({ 'Name' : name })
  .destroy(function(err, rets) {
    if (err) { return console.error(err); }
    console.log(rets);
  })
}
