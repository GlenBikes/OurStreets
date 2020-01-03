const DsPaymentsLookup = require('./dspayments')

class PghLookup extends DsPaymentsLookup {
  constructor() {
    super('https://dspayments.com/pittsburgh')
  }
}

module.exports = PghLookup

const ds = new PghLookup()
ds.lookup('PA', 'HJB7789').then(console.log)
