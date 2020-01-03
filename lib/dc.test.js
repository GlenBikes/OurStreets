const puppeteer = require("puppeteer");
const DcLookup = require("./dc");

describe("DC Lookup", () => {
  let dc;
  beforeAll(async () => {
    dc = new DcLookup();
    await dc.initialize();
  });
  afterAll(async () => {
    await dc.teardown();
  });
  it("return data for DC:69", async () => {
    const citations = await dc.lookup("DC", "69");
    expect(citations.tickets.length).toEqual(29);
  });
});
