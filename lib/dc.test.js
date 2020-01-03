const DcLookup = require("./dc");

describe("DC Lookup", () => {
  it("return data for DC:69", async () => {
    const sea = new DcLookup();
    const citations = await sea.lookup("DC", "69");
    expect(citations.tickets.length).toEqual(29);
  });
});
