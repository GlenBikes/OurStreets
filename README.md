# Plate lookup service

Currently looks up plate in DC by using Pupeteer & Tesseract.js to use this form:
prodpci.etimspayments.com/pbw/include/dc_parking/input.jsp

Mostly copied from https://github.com/dschep/hows-my-driving-dc

Uses https://github.com/RafalWilinski/serverless-puppeteer-layers
to have the headless chrome binary for puppeteer in a lambda layer

## Deploy
```
npm i
npx sls deploy
npx sls invoke -f dc -d '{"state":"dc","number":"ASDF"}'
```

## Invoke from python service
```python
import json
import boto3

lambda_client = boto3.client('lambda')
lambda_client.invoke(FunctionName='plate-lookup-service-dev-dc',
                     Payload=json.dumps({'state': 'dc', 'number': 'xyz'}))
```