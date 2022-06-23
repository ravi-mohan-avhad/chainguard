using AElf.Contracts.MultiToken;
using AElf.Contracts.Parliament;

namespace AElf.Contracts.ReportEntity;

public partial class ReportEntityContractState
{
    internal TokenContractContainer.TokenContractReferenceState TokenContract { get; set; }
    internal ParliamentContractContainer.ParliamentContractReferenceState ParliamentContract { get; set; }
}