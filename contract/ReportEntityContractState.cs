using AElf.Sdk.CSharp.State;
using AElf.Standards.ACS1;
using AElf.Types;

namespace AElf.Contracts.ReportEntity;

public partial class ReportEntityContractState : ContractState
{
    public MappedState<Hash, ReportingItem> ReportingItems { get; set; }

    /// <summary>
    ///     This hash is calculated by: reporting_item_id & epoch_number
    /// </summary>
    public MappedState<Hash, ReportingResult> ReportingResults { get; set; }

    /// <summary>
    ///     ReportEntityId -> ReportingRecord
    /// </summary>
    public MappedState<Hash, ReportingRecord> ReportingRecords { get; set; }

    /// <summary>
    ///     ReportEntityr's Address -> ReportEntitydItems
    /// </summary>
    public MappedState<Address, ReportEntitydItems> ReportEntitydItemsMap { get; set; }

    public MappedState<string, MethodFees> TransactionFees { get; set; }

    public SingletonState<AuthorityInfo> MethodFeeController { get; set; }

    /// <summary>
    ///     ReportEntity Id -> ReportEntitys Count
    /// </summary>
    public MappedState<Hash, long> QuadraticReportEntitysCountMap { get; set; }
}