var chai = require('chai'),
    assert = chai.assert,
    jsforce = require('jsforce'),
    conn = new jsforce.Connection(),
    settings = require('../../../.vscode/settings.json'),
    myConstClass = require('../utils/constants.js');
    
describe('Salesforce E2E', function () {

  this.timeout(30000);

  const account = myConstClass.LEAD_COMPANY;

  it('should login', login);

  it('should return an opportunity with line items', () => {  
    getAccount(account);
    browser.pause(3000);
    const url = browser.getUrl();
    const pattern = url.match(/Account\/(.*?)\/view/);
    const accountId = pattern[1];
    getOpportunity(accountId);
    browser.pause(3000);    
    
  });

  it('should not allow change quantity of service', () => {  
    const editProduct = $("//div[contains(text(),'Edit Products')]");
    editProduct.click();
    
    browser.pause(3000);
    const quantity = $('//tbody/tr[2]/td[2]/span[1]/span[2]/button[1]');
    quantity.click();
    browser.keys(['Control', 'a', 'NULL'])
    browser.keys('\uE003');//Backspace
    browser.keys('\uE01C');//Press '2'
    
    const save = $("//body/div[4]/div[2]/div[1]/div[2]/div[1]/div[3]/div[1]/button[2]/span[1]");
    save.click();
    browser.waitUntil(
      () => $('//span[contains(text(),"Can\'t save records with errors.")]').isExisting(),
      {
        timeout: 5000,
        timeoutMsg: 'expected element to exist after 5s'
      }
    );
    browser.pause(3000);

    browser.keys('\uE004');//Tab
    browser.keys('\uE004');//Tab
    browser.keys('\uE007');//Enter
  });

  it('should update quantity of service accordingly', () => {  
    
    const editProduct = $("//div[contains(text(),'Edit Products')]");
    editProduct.click();
    
    browser.pause(3000);
    const quantity = $('//tbody/tr[1]/td[2]/span[1]/span[2]/button[1]');
    quantity.click();
    browser.keys(['Control', 'a', 'NULL'])
    browser.keys('\uE003');//Backspace
    //browser.keys('\uE009');//Ctrl to release
    browser.keys('\uE01D');//Press '3'
    
    const save = $("//body/div[4]/div[2]/div[1]/div[2]/div[1]/div[3]/div[1]/button[2]/span[1]");
    save.click();
    browser.pause(3000);

    const truckUnit = $('//tbody/tr[1]/td[2]').getValue();
    const serviceUnit = $('//tbody/tr[2]/td[2]').getValue();
    assert.strictEqual(truckUnit, serviceUnit);

    var truckPrice = $('//tbody/tr[1]/td[3]').getText();
    var servicePrice = $('//tbody/tr[2]/td[3]').getText();
    console.log(`Truck price : ${truckPrice}`);
    console.log(`Service price : ${servicePrice}`);
    truckPrice = truckPrice.substring(1);
    truckPrice = truckPrice.replace(",","");
    servicePrice = servicePrice.substring(1);
    servicePrice = servicePrice.replace(",","");
    var tax = (truckPrice / servicePrice);
    console.log(`Tax : ${tax}%`)
    assert.strictEqual(tax, 10, "Service is not 10% of the truck price!");

  });

  it('should delete added service', () => {  
    const editProduct = $("//div[contains(text(),'Edit Products')]");
    editProduct.click();
    
    browser.pause(3000);
    const quantity = $('//tbody/tr[1]/td[2]/span[1]/span[2]/button[1]');
    quantity.click();
    browser.keys(['Control', 'a', 'NULL'])
    browser.keys('\uE003');//Backspace
    browser.keys('\uE01B');//Press '1'
    
    const save = $("//body/div[4]/div[2]/div[1]/div[2]/div[1]/div[3]/div[1]/button[2]/span[1]");
    save.click();
    browser.pause(3000);
    console.log('Test Completed');
    
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