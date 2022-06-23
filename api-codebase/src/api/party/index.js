import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master, token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Party, { schema } from './model'

const router = new Router()
const { partyname, riskscore, status, conflictcount, linkedaccount, address } = schema.tree

/**
 * @api {post} /parties Create party
 * @apiName CreateParty
 * @apiGroup Party
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam partyname Party's partyname.
 * @apiParam riskscore Party's riskscore.
 * @apiParam status Party's status.
 * @apiParam conflictcount Party's conflictcount.
 * @apiParam linkedaccount Party's linkedaccount.
 * @apiParam address Party's address.
 * @apiSuccess {Object} party Party's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Party not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ partyname, riskscore, status, conflictcount, linkedaccount, address }),
  create)

/**
 * @api {get} /parties Retrieve parties
 * @apiName RetrieveParties
 * @apiGroup Party
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} parties List of parties.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /parties/:id Retrieve party
 * @apiName RetrieveParty
 * @apiGroup Party
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} party Party's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Party not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

/**
 * @api {put} /parties/:id Update party
 * @apiName UpdateParty
 * @apiGroup Party
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam partyname Party's partyname.
 * @apiParam riskscore Party's riskscore.
 * @apiParam status Party's status.
 * @apiParam conflictcount Party's conflictcount.
 * @apiParam linkedaccount Party's linkedaccount.
 * @apiParam address Party's address.
 * @apiSuccess {Object} party Party's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Party not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ partyname, riskscore, status, conflictcount, linkedaccount, address }),
  update)

/**
 * @api {delete} /parties/:id Delete party
 * @apiName DeleteParty
 * @apiGroup Party
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Party not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
