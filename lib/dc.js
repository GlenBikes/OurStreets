const EtimspaymentsLookup = require("./etimspayments.js");

class DcLookup extends EtimspaymentsLookup {
  constructor(browser) {
    super(
      "https://prodpci.etimspayments.com/pbw/include/dc_parking/input.jsp",
      browser
    );
  }
}

module.exports = DcLookup;
