using AElf.Types;

namespace AElf.Contracts.ReportEntity;

public static class ReportEntityExtensions
{
    public static Hash GetHash(this ReportingRegisterInput reportingItemInput, Address issuereporterAddress)
    {
        var input = reportingItemInput.Clone();
        input.Options.Clear();
        return HashHelper.ConcatAndCompute(HashHelper.ComputeFrom(input), HashHelper.ComputeFrom(issuereporterAddress));
    }

    public static Hash GetHash(this ReportingResult reportingResult)
    {
        return HashHelper.ComputeFrom(new ReportingResult
        {
            ReportingItemId = reportingResult.ReportingItemId,
            SnapshotNumber = reportingResult.SnapshotNumber
        });
    }
}