import express from 'express'
import validate from '../middleware/validate.middleware.js'
import {
  AddUserBodySchema,
  orgCreateSchema,
  UpdateMemberRoleSchema,
} from "../../../shared/index.js";
import { addUser, createOrganization, deleteOrganization, getOrganizationById, getOrganizationMembers, removeMember, updateMemberRole, updateOrganization } from '../controllers/organization.controller.js';
import { checkPermission } from "../middleware/authz.middleware.js";

const organizationRouter = express.Router();

organizationRouter.post('/', validate(orgCreateSchema), createOrganization);

organizationRouter.post("/:id/members",validate(AddUserBodySchema),checkPermission("admin", "organization", "id"),addUser);

organizationRouter.get("/:id/members",checkPermission("member", "organization", "id"),getOrganizationMembers);

organizationRouter.delete("/:id/members/:userId",checkPermission("admin", "organization", "id"),removeMember);

organizationRouter.patch("/:id/members/:userId",checkPermission("admin", "organization", "id"),validate(UpdateMemberRoleSchema),updateMemberRole);

organizationRouter.delete("/:id",checkPermission("admin", "organization", "id"),deleteOrganization);

organizationRouter.get("/:id",checkPermission("member", "organization", "id"),getOrganizationById);

organizationRouter.patch("/:id",validate(orgCreateSchema),checkPermission("admin", "organization", "id"),updateOrganization);


export default organizationRouter;