const PhlLookup = require("./phl");

describe("PHL Lookup", () => {
  it("return citations with the right keys for PA:HSZ6132", async () => {
    const phl = new PhlLookup();
    const citations = await phl.lookup("PA", "HSZ6132");
    expect(Object.keys(citations[0])).toEqual([
      "TicketNumber",
      "LicensePlate",
      "State orProvince",
      "IssueDate",
      "Status",
      "AmountDue"
    ]);
  });
});
