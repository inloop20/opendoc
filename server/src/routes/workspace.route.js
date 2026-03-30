import express from "express";
import {
  addMember,
  createWorkspace,
  deleteWorkspace,
  getMembers,
  getMyWorkspaces,
  getWorkspaceById,
  removeMember,
  updateMemberRole,
  updateWorkspace,
} from "../controllers/workspace.controller.js";

import {
  addMemberSchema,
  nameSchema,
  UpdateMemberRoleSchema,
} from "../../../shared/index.js";

import validate from "../middleware/validate.middleware.js";
import { checkPermission } from "../middleware/authz.middleware.js";

const workspaceRouter = express.Router();

workspaceRouter.post("/organization/:orgId",validate(nameSchema),checkPermission("admin", "organization", "orgId"),createWorkspace);

workspaceRouter.get("/organization/:orgId",checkPermission("member", "organization", "orgId"),getMyWorkspaces);

workspaceRouter.get(
  "/:id/members",
  checkPermission("member", "workspace", "id"),
  getMembers,
);

workspaceRouter.post(
  "/:id/members",
  validate(addMemberSchema),
  checkPermission("admin", "workspace", "id"),
  addMember,
);

workspaceRouter.patch(
  "/:id/members/:userId",
  validate(UpdateMemberRoleSchema),
  checkPermission("admin", "workspace", "id"),
  updateMemberRole,
);

workspaceRouter.delete(
  "/:id/members/:userId",
  checkPermission("admin", "workspace", "id"),
  removeMember,
);

workspaceRouter.get(
  "/:id",
  checkPermission("member", "workspace", "id"),
  getWorkspaceById,
);

workspaceRouter.patch(
  "/:id",
  validate(nameSchema),
  checkPermission("admin", "workspace", "id"),
  updateWorkspace,
);

workspaceRouter.delete(
  "/:id",
  checkPermission("admin", "workspace", "id"),
  deleteWorkspace,
);

export default workspaceRouter
