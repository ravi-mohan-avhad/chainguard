import request from 'supertest'
import { masterKey, apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Issue } from '.'

const app = () => express(apiRoot, routes)

let userSession, adminSession, issue

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  adminSession = signSync(admin.id)
  issue = await Issue.create({})
})

test('POST /issues 201 (master)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: masterKey, date: 'test', party: 'test', address: 'test', description: 'test', reportedby: 'test', riskscore: 'test', validitystatus: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.date).toEqual('test')
  expect(body.party).toEqual('test')
  expect(body.address).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.reportedby).toEqual('test')
  expect(body.riskscore).toEqual('test')
  expect(body.validitystatus).toEqual('test')
})

test('POST /issues 401 (admin)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('POST /issues 401 (user)', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('POST /issues 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /issues 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /issues 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /issues 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /issues/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${issue.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(issue.id)
})

test('GET /issues/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${issue.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /issues/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${issue.id}`)
  expect(status).toBe(401)
})

test('GET /issues/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /issues/:id 200 (master)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${issue.id}`)
    .send({ access_token: masterKey, date: 'test', party: 'test', address: 'test', description: 'test', reportedby: 'test', riskscore: 'test', validitystatus: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(issue.id)
  expect(body.date).toEqual('test')
  expect(body.party).toEqual('test')
  expect(body.address).toEqual('test')
  expect(body.description).toEqual('test')
  expect(body.reportedby).toEqual('test')
  expect(body.riskscore).toEqual('test')
  expect(body.validitystatus).toEqual('test')
})

test('PUT /issues/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${issue.id}`)
    .send({ access_token: adminSession })
  expect(status).toBe(401)
})

test('PUT /issues/:id 401 (user)', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${issue.id}`)
    .send({ access_token: userSession })
  expect(status).toBe(401)
})

test('PUT /issues/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${issue.id}`)
  expect(status).toBe(401)
})

test('PUT /issues/:id 404 (master)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: masterKey, date: 'test', party: 'test', address: 'test', description: 'test', reportedby: 'test', riskscore: 'test', validitystatus: 'test' })
  expect(status).toBe(404)
})

test('DELETE /issues/:id 204 (master)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${issue.id}`)
    .query({ access_token: masterKey })
  expect(status).toBe(204)
})

test('DELETE /issues/:id 401 (admin)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${issue.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(401)
})

test('DELETE /issues/:id 401 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${issue.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('DELETE /issues/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${issue.id}`)
  expect(status).toBe(401)
})

test('DELETE /issues/:id 404 (master)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: masterKey })
  expect(status).toBe(404)
})
