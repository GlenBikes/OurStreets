const puppeteer = require("puppeteer");
const DcLookup = require("./dc");

describe("DC Lookup", () => {
  it("return data for DC:69", async () => {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-gpu", "--single-process"]
    });
    const sea = new DcLookup(browser);
    const citations = await sea.lookup("DC", "69");
    expect(citations.tickets.length).toEqual(29);
    await browser.close();
  });
});
