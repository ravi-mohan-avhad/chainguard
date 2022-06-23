import { Transaction } from '.'

let transaction

beforeEach(async () => {
  transaction = await Transaction.create({ date: 'test', type: 'test', description: 'test', status: 'test', sender: 'test', receipient: 'test', hash: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = transaction.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(transaction.id)
    expect(view.date).toBe(transaction.date)
    expect(view.type).toBe(transaction.type)
    expect(view.description).toBe(transaction.description)
    expect(view.status).toBe(transaction.status)
    expect(view.sender).toBe(transaction.sender)
    expect(view.receipient).toBe(transaction.receipient)
    expect(view.hash).toBe(transaction.hash)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = transaction.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(transaction.id)
    expect(view.date).toBe(transaction.date)
    expect(view.type).toBe(transaction.type)
    expect(view.description).toBe(transaction.description)
    expect(view.status).toBe(transaction.status)
    expect(view.sender).toBe(transaction.sender)
    expect(view.receipient).toBe(transaction.receipient)
    expect(view.hash).toBe(transaction.hash)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
