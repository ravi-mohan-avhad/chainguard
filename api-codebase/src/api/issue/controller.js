import { success, notFound } from '../../services/response/'
import { Issue } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Issue.create(body)
    .then((issue) => issue.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Issue.find(query, select, cursor)
    .then((issues) => issues.map((issue) => issue.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Issue.findById(params.id)
    .then(notFound(res))
    .then((issue) => issue ? issue.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Issue.findById(params.id)
    .then(notFound(res))
    .then((issue) => issue ? Object.assign(issue, body).save() : null)
    .then((issue) => issue ? issue.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Issue.findById(params.id)
    .then(notFound(res))
    .then((issue) => issue ? issue.remove() : null)
    .then(success(res, 204))
    .catch(next)
