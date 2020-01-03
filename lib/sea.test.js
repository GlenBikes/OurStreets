const SeaLookup = require("./sea");

describe("SEA Lookup", () => {
  it("return citations with the right keys for WA:BNW6502", async () => {
    const sea = new SeaLookup();
    const citations = await sea.lookup("WA", "BNW6502");
    expect(Object.keys(citations[0])).toEqual([
      "ChargeDocNumber",
      "Citation",
      "Type",
      "CaseNumber",
      "Status",
      "FilingDate",
      "ViolationDate",
      "ViolationLocation",
      "InCollections",
      "CollectionsStatus"
    ]);
  });
});
