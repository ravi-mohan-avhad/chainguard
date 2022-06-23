import { Party } from '.'

let party

beforeEach(async () => {
  party = await Party.create({ partyname: 'test', riskscore: 'test', status: 'test', conflictcount: 'test', linkedaccount: 'test', address: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = party.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(party.id)
    expect(view.partyname).toBe(party.partyname)
    expect(view.riskscore).toBe(party.riskscore)
    expect(view.status).toBe(party.status)
    expect(view.conflictcount).toBe(party.conflictcount)
    expect(view.linkedaccount).toBe(party.linkedaccount)
    expect(view.address).toBe(party.address)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = party.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(party.id)
    expect(view.partyname).toBe(party.partyname)
    expect(view.riskscore).toBe(party.riskscore)
    expect(view.status).toBe(party.status)
    expect(view.conflictcount).toBe(party.conflictcount)
    expect(view.linkedaccount).toBe(party.linkedaccount)
    expect(view.address).toBe(party.address)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
