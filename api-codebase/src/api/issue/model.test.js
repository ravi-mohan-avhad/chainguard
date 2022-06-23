import { Issue } from '.'

let issue

beforeEach(async () => {
  issue = await Issue.create({ date: 'test', party: 'test', address: 'test', description: 'test', reportedby: 'test', riskscore: 'test', validitystatus: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = issue.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(issue.id)
    expect(view.date).toBe(issue.date)
    expect(view.party).toBe(issue.party)
    expect(view.address).toBe(issue.address)
    expect(view.description).toBe(issue.description)
    expect(view.reportedby).toBe(issue.reportedby)
    expect(view.riskscore).toBe(issue.riskscore)
    expect(view.validitystatus).toBe(issue.validitystatus)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = issue.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(issue.id)
    expect(view.date).toBe(issue.date)
    expect(view.party).toBe(issue.party)
    expect(view.address).toBe(issue.address)
    expect(view.description).toBe(issue.description)
    expect(view.reportedby).toBe(issue.reportedby)
    expect(view.riskscore).toBe(issue.riskscore)
    expect(view.validitystatus).toBe(issue.validitystatus)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
