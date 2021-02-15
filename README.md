# lionstruckqa

Salesforce UI tests with Mocha, WebdriverIO v6

## Features
- WebdriverIO v6
- Allure Report

## How to Start

**Download or clone the project**

**Install**

(optional) Create your own configurations.
- Go to the `settings.json` and change required variables

```npm install```

**Run Tests**

```npx wdio wdio.conf.js --suite fullRegression```

**Allure Report**
(you must have installed [allure command line](https://docs.qameta.io/allure/#_get_started))

```allure generate 'C:\Source\lionstruckqa\webdriverio-test\allure-results' --clean```
```allure open```