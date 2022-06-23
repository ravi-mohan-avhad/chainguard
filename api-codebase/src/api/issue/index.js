import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { master, token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Issue, { schema } from './model'

const router = new Router()
const { date, party, address, description, reportedby, riskscore, validitystatus } = schema.tree

/**
 * @api {post} /issues Create issue
 * @apiName CreateIssue
 * @apiGroup Issue
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam date Issue's date.
 * @apiParam party Issue's party.
 * @apiParam address Issue's address.
 * @apiParam description Issue's description.
 * @apiParam reportedby Issue's reportedby.
 * @apiParam riskscore Issue's riskscore.
 * @apiParam validitystatus Issue's validitystatus.
 * @apiSuccess {Object} issue Issue's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Issue not found.
 * @apiError 401 master access only.
 */
router.post('/',
  master(),
  body({ date, party, address, description, reportedby, riskscore, validitystatus }),
  create)

/**
 * @api {get} /issues Retrieve issues
 * @apiName RetrieveIssues
 * @apiGroup Issue
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Object[]} issues List of issues.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /issues/:id Retrieve issue
 * @apiName RetrieveIssue
 * @apiGroup Issue
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} issue Issue's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Issue not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

/**
 * @api {put} /issues/:id Update issue
 * @apiName UpdateIssue
 * @apiGroup Issue
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiParam date Issue's date.
 * @apiParam party Issue's party.
 * @apiParam address Issue's address.
 * @apiParam description Issue's description.
 * @apiParam reportedby Issue's reportedby.
 * @apiParam riskscore Issue's riskscore.
 * @apiParam validitystatus Issue's validitystatus.
 * @apiSuccess {Object} issue Issue's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Issue not found.
 * @apiError 401 master access only.
 */
router.put('/:id',
  master(),
  body({ date, party, address, description, reportedby, riskscore, validitystatus }),
  update)

/**
 * @api {delete} /issues/:id Delete issue
 * @apiName DeleteIssue
 * @apiGroup Issue
 * @apiPermission master
 * @apiParam {String} access_token master access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Issue not found.
 * @apiError 401 master access only.
 */
router.delete('/:id',
  master(),
  destroy)

export default router
