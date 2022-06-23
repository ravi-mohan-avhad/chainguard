import { success, notFound } from '../../services/response/'
import { Party } from '.'

export const create = ({ bodymen: { body } }, res, next) =>
  Party.create(body)
    .then((party) => party.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Party.find(query, select, cursor)
    .then((parties) => parties.map((party) => party.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Party.findById(params.id)
    .then(notFound(res))
    .then((party) => party ? party.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ bodymen: { body }, params }, res, next) =>
  Party.findById(params.id)
    .then(notFound(res))
    .then((party) => party ? Object.assign(party, body).save() : null)
    .then((party) => party ? party.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
  Party.findById(params.id)
    .then(notFound(res))
    .then((party) => party ? party.remove() : null)
    .then(success(res, 204))
    .catch(next)
