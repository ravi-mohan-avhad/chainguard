using System.Linq;
using AElf.Types;

namespace AElf.Contracts.ReportEntity;

public partial class ReportEntityContract
{
    public override ReportingRecords GetReportingRecords(GetReportingRecordsInput input)
    {
        var reportingRecords = new ReportingRecords();
        reportingRecords.Records.AddRange(input.Ids.Select(id => State.ReportingRecords[id]));
        return reportingRecords;
    }

    public override ReportEntitydItems GetReportEntitydItems(Address input)
    {
        return State.ReportEntitydItemsMap[input] ?? new ReportEntitydItems();
    }

    public override ReportingRecord GetReportingRecord(Hash input)
    {
        var reportingRecord = State.ReportingRecords[input];
        Assert(reportingRecord != null, "Reporting record not found.");
        return reportingRecord;
    }

    public override ReportingItem GetReportingItem(GetReportingItemInput input)
    {
        var reportingEvent = State.ReportingItems[input.ReportingItemId];
        Assert(reportingEvent != null, "Reporting item not found.");
        return reportingEvent;
    }

    public override ReportingResult GetReportingResult(GetReportingResultInput input)
    {
        var reportingResultHash = new ReportingResult
        {
            ReportingItemId = input.ReportingItemId,
            SnapshotNumber = input.SnapshotNumber
        }.GetHash();
        return State.ReportingResults[reportingResultHash];
    }

    public override ReportingResult GetLatestReportingResult(Hash input)
    {
        var reportingItem = AssertReportingItem(input);
        var reportingResultHash = new ReportingResult
        {
            ReportingItemId = input,
            SnapshotNumber = reportingItem.CurrentSnapshotNumber
        }.GetHash();
        return State.ReportingResults[reportingResultHash];
    }

    public override ReportEntitydIds GetReportingIds(GetReportingIdsInput input)
    {
        return State.ReportEntitydItemsMap[input.ReportEntityr].ReportEntitydItemReportEntityIds.Where(p => p.Key == input.ReportingItemId.ToHex())
            .Select(p => p.Value).First();
    }
}