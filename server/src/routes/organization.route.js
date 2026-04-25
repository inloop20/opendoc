import express from 'express'
import validate from '../middleware/validate.middleware.js'
import {
  AddUserBodySchema,
  orgCreateSchema,
  UpdateMemberRoleSchema,
} from "../../../shared/index.js";
import { addUsers, createOrganization, deleteOrganization, getOrganizationById, getOrganizationMembers, getOrgPermissions, leaveOrg, removeMember, updateMemberRole, updateOrganization } from '../controllers/organization.controller.js';
import { checkPermission } from "../middleware/authz.middleware.js";

const organizationRouter = express.Router();

organizationRouter.post('/', validate(orgCreateSchema), createOrganization);

organizationRouter.post("/:id/members",validate(AddUserBodySchema),checkPermission("admin", "organization", "id"),addUsers);

organizationRouter.get("/:id/members",checkPermission("member", "organization", "id"),getOrganizationMembers);

organizationRouter.delete("/:id/members/:userId",checkPermission("admin", "organization", "id"),removeMember);

organizationRouter.delete("/:orgId/leave",checkPermission("member", "organization", "orgId"),leaveOrg);

organizationRouter.patch("/:id/members/:userId",checkPermission("admin", "organization", "id"),validate(UpdateMemberRoleSchema),updateMemberRole);

organizationRouter.delete("/:id",checkPermission("admin", "organization", "id"),deleteOrganization);

organizationRouter.get("/:id",checkPermission("member", "organization", "id"),getOrganizationById);

organizationRouter.patch("/:id",validate(orgCreateSchema),checkPermission("admin", "organization", "id"),updateOrganization);

organizationRouter.get('/:id/permissions',checkPermission('member','organization','id'),getOrgPermissions);


export default organizationRouter;