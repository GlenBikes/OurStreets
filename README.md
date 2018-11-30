# Plate lookup service

Currently looks up plate in DC by using Pupeteer & Tesseract.js to use this form:
prodpci.etimspayments.com/pbw/include/dc_parking/input.jsp

Mostly copied from https://github.com/dschep/hows-my-driving-dc

Uses https://gitlab.com/hows-my-driving/serverless-puppeteer-layers
to have the headless chrome binary for puppeteer in a lambda layer

## Deploy
```
npm i
npx sls deploy
npx sls invoke -f dc -d '{"state":"dc","number":"ASDF"}'
```
