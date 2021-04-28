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

  it('should return an opportunity', () => {  
    getAccount(account);
    browser.pause(5000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
    getOpportunity(accountId);
    browser.pause(5000);    
  });

 it('should add service in opportunity', () => {  
    const addProduct = $("//div[contains(text(),'Add Products')]");
    addProduct.click();
    browser.pause(3000); 
    browser.keys('\uE004');//Tab
    browser.keys('\uE004');//Tab
    browser.keys('\uE007');//Enter
    browser.pause(3000);  
    const searchText = $('[title="Search Products"]');
    searchText.setValue('Truck TGX');
	browser.keys('\uE007');//Enter
	browser.pause(3000);
    $('//tbody/tr[1]/td[2]/span[1]/span[1]/label[1]/span[1]').click();
    browser.pause(3000);
    $('//body/div[4]/div[2]/div[1]/div[2]/div[1]/div[3]/div[1]/button[2]/span[1]').click();
    
    browser.pause(3000);
    const quantity = $('//tbody/tr[1]/td[2]/span[1]/span[2]/button[1]');
    quantity.click();
    browser.keys('\uE01B');//Press '1'
    const service = $('//tbody/tr[1]/td[4]/span[1]/span[2]/button[1]');
    service.click();
    browser.keys('\uE00D');//Add space
    browser.pause(3000);
    $('//body/div[4]/div[2]/div[1]/div[2]/div[1]/div[3]/div[1]/button[3]/span[1]').click();
    

    const truckUnit = $('//tbody/tr[3]/td[2]').getValue();
    const serviceUnit = $('//tbody/tr[4]/td[2]').getValue();
    assert.strictEqual(truckUnit, serviceUnit);

    const serviceName = $('//tbody/tr[4]/td[4]').getText();
    assert.strictEqual(serviceName, 'Service for Truck TGX');

    var truckPrice = $('//tbody/tr[3]/td[3]').getText();
    var servicePrice = $('//tbody/tr[4]/td[3]').getText();
    console.log(`Truck price : ${truckPrice}`);
    console.log(`Service price : ${servicePrice}`);
    truckPrice = truckPrice.substring(1);
    truckPrice = truckPrice.replace(",","");
    servicePrice = servicePrice.substring(1);
    servicePrice = servicePrice.replace(",","");
    var tax = (truckPrice / servicePrice);
    console.log(`Tax : ${tax}%`)
    assert.strictEqual(tax, 10);

  });

});

async function login() {
  return await conn.login(settings.username, settings.passwordWithToken)
    .then(userInfo => `${conn.instanceUrl}/secur/frontdoor.jsp?sid=${conn.accessToken}`)
    .then(url => browser.url(url));

}

async function getOpportunity(accountId) {
    return await conn.sobject('Opportunity')
    .find({ 'AccountId' : accountId}, function(err, rets) {
      if (err) { return console.error(err); }
      console.log(rets);
      browser.url(`${conn.instanceUrl}/lightning/r/OpportunityLineItem/${rets[0].Id}/related/OpportunityLineItems/view`);
    });
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