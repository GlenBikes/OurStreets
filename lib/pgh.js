const DsPaymentsLookup = require("./dspayments");

class PghLookup extends DsPaymentsLookup {
  constructor() {
    super("https://dspayments.com/pittsburgh");
  }
}

module.exports = PghLookup;
