const NyLookup = require("./ny");

describe("NY Lookup", () => {
  it("return citations with the right keys for NY:HSZ6132", async () => {
    const ny = new NyLookup();
    const citations = await ny.lookup("NY", "HSZ6132");
    expect(Object.keys(citations[0])).toEqual([
      "plate",
      "state",
      "license_type",
      "summons_number",
      "issue_date",
      "violation_time",
      "violation",
      "judgment_entry_date",
      "fine_amount",
      "penalty_amount",
      "interest_amount",
      "reduction_amount",
      "payment_amount",
      "amount_due",
      "precinct",
      "county",
      "issuing_agency",
      "summons_image"
    ]);
  });
});
