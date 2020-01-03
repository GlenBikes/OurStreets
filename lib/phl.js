const https = require("https");
const _ = require("lodash");
const fetch = require("node-fetch");
const { JSDOM } = require("jsdom");

// No clue why.. but I can't get node to work with PPA's SSL cert :/
const agent = new https.Agent({
  rejectUnauthorized: false
});

class PhlLookup {
  async initialize() {}
  async lookup(state, number) {
    const resp = await fetch(
      "https://onlineserviceshub.com/ParkingPortal/Philadelphia/Home/DoSearch",
      {
        agent,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:71.0) Gecko/20100101 Firefox/71.0",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest"
        },
        referrer: "https://onlineserviceshub.com/ParkingPortal/Philadelphia",
        body: `SearchBy=ticketNumber&OtherFirstField=&OtherSecondField=KDM3102&State=PA&X-Requested-With=XMLHttpRequest`,
        method: "POST"
      }
    );
    const dom = new JSDOM(await resp.text());
    const columns = Array.from(dom.window.document.querySelectorAll("thead th"))
      .map(({ textContent }) => textContent)
      .slice(1);
    const citations = [];
    for (const row of dom.window.document.querySelectorAll("tbody tr")) {
      citations.push(
        _.fromPairs(columns.map((col, i) => [col, row.cells[i + 1]]))
      );
    }
    return citations;
  }
}

module.exports = PhlLookup;
