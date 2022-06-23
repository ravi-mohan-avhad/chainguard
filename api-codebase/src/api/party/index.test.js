import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Party } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, party

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  party = await Party.create({})
})

test('POST /parties 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, partyname: 'test', riskscore: 'test', status: 'test', conflictcount: 'test', linkedaccount: 'test', address: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.partyname).toEqual('test')
  expect(body.riskscore).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.conflictcount).toEqual('test')
  expect(body.linkedaccount).toEqual('test')
  expect(body.address).toEqual('test')
})

test('POST /parties 401 (admin)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('POST /parties 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /parties 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /parties 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /parties 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /parties 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /parties/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${party.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(party.id)
})

test('GET /parties/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${party.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /parties/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${party.id}`)
  expect(status).toBe(401)
})

test('GET /parties/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /parties/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${party.id}`)
    .send({ access_token: masterKey, partyname: 'test', riskscore: 'test', status: 'test', conflictcount: 'test', linkedaccount: 'test', address: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(party.id)
  expect(body.partyname).toEqual('test')
  expect(body.riskscore).toEqual('test')
  expect(body.status).toEqual('test')
  expect(body.conflictcount).toEqual('test')
  expect(body.linkedaccount).toEqual('test')
  expect(body.address).toEqual('test')
})

test('PUT /parties/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${party.id}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('PUT /parties/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${party.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /parties/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${party.id}`)
  expect(status).toBe(401)
})

test('PUT /parties/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, partyname: 'test', riskscore: 'test', status: 'test', conflictcount: 'test', linkedaccount: 'test', address: 'test' })
  expect(status).toBe(404)
})

test('DELETE /parties/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${party.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /parties/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${party.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('DELETE /parties/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${party.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /parties/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${party.id}`)
  expect(status).toBe(401)
})

test('DELETE /parties/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
