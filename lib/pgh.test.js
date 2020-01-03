const PghLookup = require("./pgh");

describe("PGH Lookup", () => {
  it("return citations with the right keys for PA:HJB7789", async () => {
    const pgh = new PghLookup();
    const citations = await pgh.lookup("PA", "HJB7789");
    expect(Object.keys(citations[0])).toEqual([
      "MoneyFields",
      "DisplayFields",
      "ParkciteUniqueKey",
      "AgencyDesignator",
      "LicensePlateNumber",
      "LicStateProv",
      "LicPlateType",
      "AmountDue",
      "IssueNo",
      "RecStatus",
      "ClosedStatus",
      "WentToCollections",
      "IssueDate",
      "IsPayable",
      "SubAgency",
      "ConvenienceFee",
      "ApCollectionKey",
      "VoidReason",
      "ActiveBoot",
      "TrialCode",
      "InCollections",
      "IssueType",
      "Limited",
      "TotalAmountDue",
      "DueDate",
      "LastPaymentDate",
      "ROLastName",
      "IsMilitary",
      "WaiveFee",
      "WaiveIndigent",
      "TripPopupHtml",
      "WaivedFeeForMilitary",
      "WaivedFeeForState",
      "WaivedFeeForDebit",
      "WaivedFeeForIndigent",
      "ConvienceFeeCharged"
    ]);
  });
});
