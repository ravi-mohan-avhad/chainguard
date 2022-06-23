using System.Linq;
using AElf.Contracts.MultiToken;
using AElf.CSharp.Core;
using AElf.Sdk.CSharp;
using AElf.Types;
using Google.Protobuf.WellKnownTypes;

namespace AElf.Contracts.ReportEntity;

/// <summary>
///     Comments and documents see README.md of current project.
/// </summary>
public partial class ReportEntityContract : ReportEntityContractImplContainer.ReportEntityContractImplBase
{
    /// <summary>
    ///     To register a new reporting item while filling up with details.
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    public override Empty Register(ReportingRegisterInput input)
    {
        var reportingItemId = AssertValidNewReportingItem(input);

        if (State.TokenContract.Value == null)
            State.TokenContract.Value =
                Context.GetContractAddressByName(SmartContractConstants.TokenContractSystemName);

        // Accepted currency is in white list means this token symbol supports reporting.
        var isInWhiteList = State.TokenContract.IsInWhiteList.Call(new IsInWhiteListInput
        {
            Symbol = input.AcceptedCurrency,
            Address = Context.Self
        }).Value;
        Assert(isInWhiteList, "Claimed accepted token is not available for reporting.");

        // Initialize reporting event.
        var reportingItem = new ReportingItem
        {
            IssueReporter = Context.Sender,
            ReportingItemId = reportingItemId,
            AcceptedCurrency = input.AcceptedCurrency,
            IsLockToken = input.IsLockToken,
            TotalSnapshotNumber = input.TotalSnapshotNumber,
            CurrentSnapshotNumber = 1,
            CurrentSnapshotStartTimestamp = input.StartTimestamp,
            StartTimestamp = input.StartTimestamp,
            EndTimestamp = input.EndTimestamp,
            RegisterTimestamp = Context.CurrentBlockTime,
            Options = { input.Options },
            IsQuadratic = input.IsQuadratic,
            TicketCost = input.TicketCost
        };

        State.ReportingItems[reportingItemId] = reportingItem;

        // Initialize first reporting going information of registered reporting event.
        var reportingResultHash = GetReportingResultHash(reportingItemId, 1);
        State.ReportingResults[reportingResultHash] = new ReportingResult
        {
            ReportingItemId = reportingItemId,
            SnapshotNumber = 1,
            SnapshotStartTimestamp = input.StartTimestamp
        };

        Context.Fire(new ReportingItemRegistered
        {
            IssueReporter = reportingItem.IssueReporter,
            ReportingItemId = reportingItemId,
            AcceptedCurrency = reportingItem.AcceptedCurrency,
            IsLockToken = reportingItem.IsLockToken,
            TotalSnapshotNumber = reportingItem.TotalSnapshotNumber,
            CurrentSnapshotNumber = reportingItem.CurrentSnapshotNumber,
            CurrentSnapshotStartTimestamp = reportingItem.StartTimestamp,
            StartTimestamp = reportingItem.StartTimestamp,
            EndTimestamp = reportingItem.EndTimestamp,
            RegisterTimestamp = reportingItem.RegisterTimestamp,
            IsQuadratic = reportingItem.IsQuadratic,
            TicketCost = reportingItem.TicketCost
        });

        return new Empty();
    }

    /// <summary>
    ///     Execute the ReportEntity action,save the ReportEntityRecords and update the ReportingResults and the ReportEntitydItems
    ///     Before Reporting,the ReportingItem's token must be locked,except the votes delegated to a contract.
    /// </summary>
    /// <param name="input">ReportEntityInput</param>
    /// <returns></returns>
    public override Empty ReportEntity(ReportEntityInput input)
    {
        var reportingItem = AssertValidReportEntityInput(input);
        var amount = 0L;
        if (!reportingItem.IsQuadratic)
        {
            amount = input.Amount;
        }
        else
        {
            var currentReportEntitysCount = State.QuadraticReportEntitysCountMap[input.ReportEntityId].Add(1);
            State.QuadraticReportEntitysCountMap[input.ReportEntityId] = currentReportEntitysCount;
            amount = reportingItem.TicketCost.Mul(currentReportEntitysCount);
        }

        var reportingRecord = new ReportingRecord
        {
            ReportingItemId = input.ReportingItemId,
            Amount = amount,
            SnapshotNumber = reportingItem.CurrentSnapshotNumber,
            Option = input.Option,
            IsWithdrawn = false,
            ReportEntityTimestamp = Context.CurrentBlockTime,
            ReportEntityr = input.ReportEntityr,
            IsChangeTarget = input.IsChangeTarget
        };

        State.ReportingRecords[input.ReportEntityId] = reportingRecord;

        UpdateReportingResult(reportingItem, input.Option, reportingItem.IsQuadratic ? 1 : amount);
        UpdateReportEntitydItems(input.ReportEntityId, reportingRecord.ReportEntityr, reportingItem);

        if (reportingItem.IsLockToken)
            // Lock voted token.
            State.TokenContract.Lock.Send(new LockInput
            {
                Address = reportingRecord.ReportEntityr,
                Symbol = reportingItem.AcceptedCurrency,
                LockId = input.ReportEntityId,
                Amount = amount
            });

        Context.Fire(new ReportEntityd
        {
            ReportEntityId = input.ReportEntityId,
            ReportingItemId = reportingRecord.ReportingItemId,
            ReportEntityr = reportingRecord.ReportEntityr,
            Amount = reportingRecord.Amount,
            Option = reportingRecord.Option,
            SnapshotNumber = reportingRecord.SnapshotNumber,
            ReportEntityTimestamp = reportingRecord.ReportEntityTimestamp
        });

        return new Empty();
    }

    private void UpdateReportEntitydItems(Hash voteId, Address voter, ReportingItem reportingItem)
    {
        var votedItems = State.ReportEntitydItemsMap[voter] ?? new ReportEntitydItems();
        var voterItemIndex = reportingItem.ReportingItemId.ToHex();
        if (votedItems.ReportEntitydItemReportEntityIds.ContainsKey(voterItemIndex))
            votedItems.ReportEntitydItemReportEntityIds[voterItemIndex].ActiveReportEntitys.Add(voteId);
        else
            votedItems.ReportEntitydItemReportEntityIds[voterItemIndex] =
                new ReportEntitydIds
                {
                    ActiveReportEntitys = { voteId }
                };

        votedItems.ReportEntitydItemReportEntityIds[voterItemIndex].WithdrawnReportEntitys.Remove(voteId);
        State.ReportEntitydItemsMap[voter] = votedItems;
    }

    /// <summary>
    ///     Update the State.ReportingResults.include the ReportEntityrsCount,ReportEntitysAmount and the votes int the results[option]
    /// </summary>
    /// <param name="reportingItem"></param>
    /// <param name="option"></param>
    /// <param name="amount"></param>
    private void UpdateReportingResult(ReportingItem reportingItem, string option, long amount)
    {
        // Update ReportingResult based on this reporting behaviour.
        var reportingResultHash = GetReportingResultHash(reportingItem.ReportingItemId, reportingItem.CurrentSnapshotNumber);
        var reportingResult = State.ReportingResults[reportingResultHash];
        if (!reportingResult.Results.ContainsKey(option)) reportingResult.Results.Add(option, 0);

        var currentReportEntitys = reportingResult.Results[option];
        reportingResult.Results[option] = currentReportEntitys.Add(amount);
        reportingResult.ReportEntityrsCount = reportingResult.ReportEntityrsCount.Add(1);
        reportingResult.ReportEntitysAmount = reportingResult.ReportEntitysAmount.Add(amount);
        State.ReportingResults[reportingResultHash] = reportingResult;
    }

    /// <summary>
    ///     Withdraw the ReportEntitys.
    ///     first,mark the related record IsWithdrawn.
    ///     second,delete the vote form ActiveReportEntitys and add the vote to withdrawnReportEntitys.
    ///     finally,unlock the token that Locked in the ReportingItem
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    public override Empty Withdraw(WithdrawInput input)
    {
        var reportingRecord = State.ReportingRecords[input.ReportEntityId];
        if (reportingRecord == null) throw new AssertionException("Reporting record not found.");
        var reportingItem = State.ReportingItems[reportingRecord.ReportingItemId];

        if (reportingItem.IsLockToken)
            Assert(reportingRecord.ReportEntityr == Context.Sender, "No permission to withdraw votes of others.");
        else
            Assert(reportingItem.IssueReporter == Context.Sender, "No permission to withdraw votes of others.");

        // Update ReportingRecord.
        reportingRecord.IsWithdrawn = true;
        reportingRecord.WithdrawTimestamp = Context.CurrentBlockTime;
        State.ReportingRecords[input.ReportEntityId] = reportingRecord;

        var reportingResultHash = GetReportingResultHash(reportingRecord.ReportingItemId, reportingRecord.SnapshotNumber);

        var votedItems = State.ReportEntitydItemsMap[reportingRecord.ReportEntityr];
        votedItems.ReportEntitydItemReportEntityIds[reportingItem.ReportingItemId.ToHex()].ActiveReportEntitys.Remove(input.ReportEntityId);
        votedItems.ReportEntitydItemReportEntityIds[reportingItem.ReportingItemId.ToHex()].WithdrawnReportEntitys.Add(input.ReportEntityId);
        State.ReportEntitydItemsMap[reportingRecord.ReportEntityr] = votedItems;

        var reportingResult = State.ReportingResults[reportingResultHash];
        reportingResult.Results[reportingRecord.Option] =
            reportingResult.Results[reportingRecord.Option].Sub(reportingRecord.Amount);
        if (!votedItems.ReportEntitydItemReportEntityIds[reportingRecord.ReportingItemId.ToHex()].ActiveReportEntitys.Any())
            reportingResult.ReportEntityrsCount = reportingResult.ReportEntityrsCount.Sub(1);

        reportingResult.ReportEntitysAmount = reportingResult.ReportEntitysAmount.Sub(reportingRecord.Amount);

        State.ReportingResults[reportingResultHash] = reportingResult;

        if (reportingItem.IsLockToken)
            State.TokenContract.Unlock.Send(new UnlockInput
            {
                Address = reportingRecord.ReportEntityr,
                Symbol = reportingItem.AcceptedCurrency,
                Amount = reportingRecord.Amount,
                LockId = input.ReportEntityId
            });

        Context.Fire(new Withdrawn
        {
            ReportEntityId = input.ReportEntityId
        });

        return new Empty();
    }

    public override Empty TakeSnapshot(TakeSnapshotInput input)
    {
        var reportingItem = AssertReportingItem(input.ReportingItemId);

        Assert(reportingItem.IssueReporter == Context.Sender, "Only issuereporter can take snapshot.");

        Assert(reportingItem.CurrentSnapshotNumber - 1 < reportingItem.TotalSnapshotNumber,
            "Current reporting item already ended.");

        // Update previous reporting going information.
        var previousReportingResultHash = GetReportingResultHash(input.ReportingItemId, reportingItem.CurrentSnapshotNumber);
        var previousReportingResult = State.ReportingResults[previousReportingResultHash];
        previousReportingResult.SnapshotEndTimestamp = Context.CurrentBlockTime;
        State.ReportingResults[previousReportingResultHash] = previousReportingResult;

        Assert(reportingItem.CurrentSnapshotNumber == input.SnapshotNumber,
            $"Can only take snapshot of current snapshot number: {reportingItem.CurrentSnapshotNumber}, but {input.SnapshotNumber}");
        var nextSnapshotNumber = input.SnapshotNumber.Add(1);
        reportingItem.CurrentSnapshotNumber = nextSnapshotNumber;
        State.ReportingItems[reportingItem.ReportingItemId] = reportingItem;

        // Initial next reporting going information.
        var currentReportingGoingHash = GetReportingResultHash(input.ReportingItemId, nextSnapshotNumber);
        State.ReportingResults[currentReportingGoingHash] = new ReportingResult
        {
            ReportingItemId = input.ReportingItemId,
            SnapshotNumber = nextSnapshotNumber,
            SnapshotStartTimestamp = Context.CurrentBlockTime,
            ReportEntityrsCount = previousReportingResult.ReportEntityrsCount,
            ReportEntitysAmount = previousReportingResult.ReportEntitysAmount
        };
        return new Empty();
    }

    /// <summary>
    ///     Add a option for corresponding ReportingItem.
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    public override Empty AddOption(AddOptionInput input)
    {
        var reportingItem = AssertReportingItem(input.ReportingItemId);
        Assert(reportingItem.IssueReporter == Context.Sender, "Only issuereporter can update options.");
        AssertOption(reportingItem, input.Option);
        Assert(reportingItem.Options.Count < ReportEntityContractConstants.MaximumOptionsCount,
            $"The count of options can't greater than {ReportEntityContractConstants.MaximumOptionsCount}");
        reportingItem.Options.Add(input.Option);
        State.ReportingItems[reportingItem.ReportingItemId] = reportingItem;
        return new Empty();
    }

    private void AssertOption(ReportingItem reportingItem, string option)
    {
        Assert(option.Length <= ReportEntityContractConstants.OptionLengthLimit, "Invalid input.");
        Assert(!reportingItem.Options.Contains(option), "Option already exists.");
    }

    /// <summary>
    ///     Delete a option for corresponding ReportingItem
    /// </summary>
    /// <param name="input"></param>
    /// <returns></returns>
    public override Empty RemoveOption(RemoveOptionInput input)
    {
        var reportingItem = AssertReportingItem(input.ReportingItemId);
        Assert(reportingItem.IssueReporter == Context.Sender, "Only issuereporter can update options.");
        Assert(input.Option.Length <= ReportEntityContractConstants.OptionLengthLimit, "Invalid input.");
        Assert(reportingItem.Options.Contains(input.Option), "Option doesn't exist.");
        reportingItem.Options.Remove(input.Option);
        State.ReportingItems[reportingItem.ReportingItemId] = reportingItem;
        return new Empty();
    }

    public override Empty AddOptions(AddOptionsInput input)
    {
        var reportingItem = AssertReportingItem(input.ReportingItemId);
        Assert(reportingItem.IssueReporter == Context.Sender, "Only issuereporter can update options.");
        foreach (var option in input.Options) AssertOption(reportingItem, option);
        reportingItem.Options.AddRange(input.Options);
        Assert(reportingItem.Options.Count <= ReportEntityContractConstants.MaximumOptionsCount,
            $"The count of options can't greater than {ReportEntityContractConstants.MaximumOptionsCount}");
        State.ReportingItems[reportingItem.ReportingItemId] = reportingItem;
        return new Empty();
    }

    public override Empty RemoveOptions(RemoveOptionsInput input)
    {
        var reportingItem = AssertReportingItem(input.ReportingItemId);
        Assert(reportingItem.IssueReporter == Context.Sender, "Only issuereporter can update options.");
        foreach (var option in input.Options)
        {
            Assert(reportingItem.Options.Contains(option), "Option doesn't exist.");
            Assert(option.Length <= ReportEntityContractConstants.OptionLengthLimit, "Invalid input.");
            reportingItem.Options.Remove(option);
        }

        State.ReportingItems[reportingItem.ReportingItemId] = reportingItem;
        return new Empty();
    }

    private ReportingItem AssertReportingItem(Hash reportingItemId)
    {
        var reportingItem = State.ReportingItems[reportingItemId];
        Assert(reportingItem != null, $"Reporting item not found. {reportingItemId.ToHex()}");
        return reportingItem;
    }

    /// <summary>
    ///     Initialize the related contracts=>TokenContract;
    /// </summary>
    private Hash AssertValidNewReportingItem(ReportingRegisterInput input)
    {
        // Use input without options and sender's address to calculate reporting item id.
        var reportingItemId = input.GetHash(Context.Sender);

        Assert(State.ReportingItems[reportingItemId] == null, "Reporting item already exists.");

        // total snapshot number can't be 0. At least one epoch is required.
        if (input.TotalSnapshotNumber == 0) input.TotalSnapshotNumber = 1;

        Assert(input.EndTimestamp > input.StartTimestamp, "Invalid active time.");

        Context.LogDebug(() => $"Reporting item created by {Context.Sender}: {reportingItemId.ToHex()}");

        return reportingItemId;
    }

    private Hash GetReportingResultHash(Hash reportingItemId, long snapshotNumber)
    {
        return new ReportingResult
        {
            ReportingItemId = reportingItemId,
            SnapshotNumber = snapshotNumber
        }.GetHash();
    }

    private ReportingItem AssertValidReportEntityInput(ReportEntityInput input)
    {
        var reportingItem = AssertReportingItem(input.ReportingItemId);
        Assert(input.Option.Length <= ReportEntityContractConstants.OptionLengthLimit, "Invalid input.");
        Assert(reportingItem.Options.Contains(input.Option), $"Option {input.Option} not found.");
        Assert(reportingItem.CurrentSnapshotNumber <= reportingItem.TotalSnapshotNumber,
            "Current reporting item already ended.");
        if (!reportingItem.IsLockToken)
        {
            Assert(reportingItem.IssueReporter == Context.Sender, "Sender of delegated reporting event must be the IssueReporter.");
            Assert(input.ReportEntityr != null, "ReportEntityr cannot be null if reporting event is delegated.");
            Assert(input.ReportEntityId != null, "ReportEntity Id cannot be null if reporting event is delegated.");
        }
        else
        {
            var reportingResultHash = GetReportingResultHash(reportingItem.ReportingItemId, reportingItem.CurrentSnapshotNumber);
            var reportingResult = State.ReportingResults[reportingResultHash];
            // ReportEntityr = Transaction Sender
            input.ReportEntityr = Context.Sender;
            // ReportEntityId = Transaction Id;
            input.ReportEntityId = Context.GenerateId(Context.Self, reportingResult.ReportEntitysAmount.ToBytes(false));
        }

        return reportingItem;
    }
}