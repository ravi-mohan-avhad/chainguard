import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Transaction } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, transaction

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  transaction = await Transaction.create({})
})

test('POST /transactions 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, date: 'test', type: 'test', description: 'test', status: 'test', sender: 'test', receipient: 'test', hash: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.date).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.sender).toEqual('test')
  expect(body.receipient).toEqual('test')
  expect(body.hash).toEqual('test')
})

test('POST /transactions 401 (admin)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('POST /transactions 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /transactions 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /transactions 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /transactions 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /transactions 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /transactions/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${transaction.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(transaction.id)
})

test('GET /transactions/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${transaction.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /transactions/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${transaction.id}`)
  expect(status).toBe(401)
})

test('GET /transactions/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /transactions/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${transaction.id}`)
    .send({ access_token: masterKey, date: 'test', type: 'test', description: 'test', status: 'test', sender: 'test', receipient: 'test', hash: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(transaction.id)
  expect(body.date).toEqual('test')
  expect(body.type).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.sender).toEqual('test')
  expect(body.receipient).toEqual('test')
  expect(body.hash).toEqual('test')
})

test('PUT /transactions/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${transaction.id}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('PUT /transactions/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${transaction.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /transactions/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${transaction.id}`)
  expect(status).toBe(401)
})

test('PUT /transactions/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, date: 'test', type: 'test', description: 'test', status: 'test', sender: 'test', receipient: 'test', hash: 'test' })
  expect(status).toBe(404)
})

test('DELETE /transactions/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${transaction.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /transactions/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${transaction.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('DELETE /transactions/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${transaction.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /transactions/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${transaction.id}`)
  expect(status).toBe(401)
})

test('DELETE /transactions/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
