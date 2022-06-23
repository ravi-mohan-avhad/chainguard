# ReportEntity Contract

## Actions

<details>

  <summary><b>InitialReportEntityContract</b></summary>

This method will be called once by an inline transaction right after `ReportEntity Contract` get deployed.

### Purpose

Set contract system name of `Token Contract` in order to get its addresses in the future.

### Notes

- Sender must be the owner of `ReportEntity Contract`, which should be the address of `Basic Contract Zero`.

- Contract system names can neither be same nor empty.

- Cannot initialize more than once.

</details>

<details>

  <summary><b>Register</b></summary>

### Purpose

For a `IssueReporter` to register / create a reporting event.

### Notes

- Transction sender will be the `IssueReporter`.

- The values of `IssueReporter` fields can identify a `ReportingEvent`.

- A `ReportingEvent` with specific `EpochNumber` called `ReportingGoing` in this contract, which isn't really exists.

- Thus we can use `GetHash()` of `ReportingResult` to get the hash of a `ReportingGoing`.

- If `Delegated` is true, it means the sender address of `ReportEntity` transaction must be the address of `IssueReporter`.

- If `StartTimestamp` of input value is smaller than current block time, will use current block time as `StartTimestamp`
  .

- Cannot create a reporting event with maximum active time but only 1 epoch. This means voter can never with their votes.
  Also, voters cannot vote to a reporting event with maximum active time in its last epoch.

- Anyway, voters can withdraw their votes after a certain days according to the value
  of `ReportEntityContractConsts.MaxActiveDays`.

</details>

<details>

  <summary><b>ReportEntity</b></summary>

### Purpose

For a `ReportEntityr` to vote for a reporting going (a epoch of a reporting event).

### Notes

- Basically, a reporting behaviour is to update related `ReportingResult` and `ReportingHistories`, also add a new `ReportingRecord`
  .

- `ReportingHistories` contains vote histories of all `ReportingEvent`s - more precisely - `ReportingGoing`s of a voter.

- `ReportingHistory` just for one `ReportingGoing` (of a voter).

- The values of `IssueReporter` and `EpochNumber` fields can identify a `ReportingGoing` or a `ReportingResult`.

- We can get a certain `ReportingRecord` by providing transaction id of `ReportEntity` transaction, which actually called `ReportEntityId`.

- This method will only lock token if reporting event isn't delegated. Delegated reporting event should lock in higher level
  contract, like `Election Contract`.

</details>

<details>

  <summary><b>Withdraw</b></summary>

### Purpose

For a `ReportEntityr` to withdraw his previous votes.

### Notes

- Will update related `ReportingResult` and `ReportingRecord`.

- Unlock token logic is same as `ReportEntity` method, delegated reporting event should unlock token on

- Cannot withdraw votes of on-going reporting events, it means `EpochNumber` of `ReportingRecord` must be less
  than `CurrentEpoch` of `ReportingEvent`.

- Extra limitation of voters withdrawing their votes should be coded in higher level contract. Like
  in `Election Contract`, voters need to keep locking their tokens at least for several epoches (terms).

</details>

<details>

  <summary><b>UpdateEpochNumber</b></summary>

### Purpose

For the `IssueReporter` to update epoch number.

### Notes

- Can only increase the epoch number 1 each time.

- Will update previous on-going reporting event and initialize new on-going event.

- After updating, votes of previous epoch is possible withdrawable for voters.

- When `TotalEpoch` of `ReportingEvent` is `x`, if the `IssueReporter` set `EpochNumber` to `x + 1`, the whole reporting event will
  be regarded as terminated immediately.

</details>

<details>

  <summary><b>AddOption</b></summary>

### Purpose

For the `IssueReporter` to add an option of a certain `ReportingEvent`.

### Notes

</details>

<details>

  <summary><b>RemoveOption</b></summary>

### Purpose

For the `IssueReporter` to remove an option of a certain `ReportingEvent`.

### Notes

</details>

## Views

<details>

  <summary><b>GetReportingResult</b></summary>

</details>

<details>

  <summary><b>GetReportingRecord</b></summary>

</details>

<details>

  <summary><b>GetReportingHistories</b></summary>

</details>

<details>

  <summary><b>GetReportingHistory</b></summary>

</details>