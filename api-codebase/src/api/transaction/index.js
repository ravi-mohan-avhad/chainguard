import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master, token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Transaction, { schema } from './model'

const router = new Router()
const { date, type, description, status, sender, receipient, hash } = schema.tree

/**
 * @api {post} /transactions Create transaction
 * @apiName CreateTransaction
 * @apiGroup Transaction
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam date Transaction's date.
 * @apiParam type Transaction's type.
 * @apiParam description Transaction's description.
 * @apiParam status Transaction's status.
 * @apiParam sender Transaction's sender.
 * @apiParam receipient Transaction's receipient.
 * @apiParam hash Transaction's hash.
 * @apiSuccess {Object} transaction Transaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Transaction not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ date, type, description, status, sender, receipient, hash }),
  create)

/**
 * @api {get} /transactions Retrieve transactions
 * @apiName RetrieveTransactions
 * @apiGroup Transaction
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} transactions List of transactions.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /transactions/:id Retrieve transaction
 * @apiName RetrieveTransaction
 * @apiGroup Transaction
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} transaction Transaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Transaction not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

/**
 * @api {put} /transactions/:id Update transaction
 * @apiName UpdateTransaction
 * @apiGroup Transaction
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam date Transaction's date.
 * @apiParam type Transaction's type.
 * @apiParam description Transaction's description.
 * @apiParam status Transaction's status.
 * @apiParam sender Transaction's sender.
 * @apiParam receipient Transaction's receipient.
 * @apiParam hash Transaction's hash.
 * @apiSuccess {Object} transaction Transaction's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Transaction not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ date, type, description, status, sender, receipient, hash }),
  update)

/**
 * @api {delete} /transactions/:id Delete transaction
 * @apiName DeleteTransaction
 * @apiGroup Transaction
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Transaction not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
