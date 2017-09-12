var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    chrome = require('selenium-webdriver/chrome'),
    nw = require('nw'),
    path = require('path'),
    chai = require('chai'),
    chaiAsPromised = require("chai-as-promised"),
    expect = chai.expect;

chai.use(chaiAsPromised);

// A first integration test. Mostly a proof of concept to show that Selenium,
// Mocha, and nwjs can work together.

describe('OnlyKey Configuration', function() {

    var driver;

    before(function() {
        // Use chromedriver that comes with nwjs
        var service = new chrome.ServiceBuilder(path.join(path.dirname(require.resolve('nw')), 'nwjs', 'chromedriver')).build();
        chrome.setDefaultService(service);

        // Point chromedriver to the nwjs app
        var options = new chrome.Options()
            .addArguments('nwapp=' + path.dirname(__dirname));

        driver = new webdriver.Builder()
            .withCapabilities(webdriver.Capabilities.chrome())
            .setChromeOptions(options)
            .build();
    });

    after(function() {
        return driver.quit();
    });

    it('should start disconnected', function() {
        driver.wait(until.titleIs('OnlyKey Configuration Wizard'));

        var disconnected = driver.findElement(By.id('disconnected-dialog'));
        return expect(disconnected.getAttribute('open')).to.eventually.equal('true');
    });

    it('should not show "working..." dialog', function() {
        driver.wait(until.titleIs('OnlyKey Configuration Wizard'));

        var working = driver.findElement(By.id('working-dialog'));
        return expect(working.getAttribute('open')).to.eventually.equal(null);
    });
});
