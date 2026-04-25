import { prisma } from "../config/db.config.js";
import fgaClient from "../config/openfga.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createWorkspace = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  const { name } = req.body;
  if (!orgId) throw new ApiError("invalid organization id", 400);

  const workspace = await prisma.workspace.create({
    data: {
      name,
      organizationId: orgId,
      workspace_member: {
        create: {
          userId: req.user.id,
          role:'admin'
        },
      },
    },
    select: {
      id: true,
      name: true,
    },
  });
   await fgaClient.write({
    writes: [
      { user: `organization:${orgId}`, relation: 'parent', object: `workspace:${workspace.id}` },
      { user: `user:${req.user.id}`, relation: 'admin', object: `workspace:${workspace.id}` }
    ]
  });
 
  return res
    .status(201)
    .json(new ApiResponse(201, "workspace created", workspace));
});

export const getMyWorkspaces = asyncHandler(async (req, res) => {
  const { orgId } = req.params;
  if (!orgId) throw new ApiError("invalid organization id", 400);

  const { objects } = await fgaClient.listObjects({
    user: `user:${req.user.id}`,
    relation: 'member', 
    type: 'workspace',
    contextual_tuples: [
      { user: `workspace:*`, relation: 'parent', object: `organization:${orgId}` }
    ]
  });

  const authorizedIds = objects.map(obj => obj.split(':')[1]);
  const workspaces = await prisma.workspace.findMany({
    where: {
      id: { in: authorizedIds },
      organizationId: orgId 
    },
    select: {
      id: true,
      name: true,
      updated_at:true,
      _count:{
        select:{
          folders:true,
        }
      }
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "workspace fetched", workspaces));
});

export const getWorkspaceById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError("workspace id is required", 400);
  const workspace = await prisma.workspace.findUnique({
    where: { id },
    select: { id: true, name: true, organizationId: true, created_at: true,_count:{select:{workspace_member:true,folders:true}} },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "workspace fetched", workspace));
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!id) throw new ApiError("workspace id is required", 400);
  const updatedWorkspace = await prisma.workspace.update({
    where: { id },
    data: {
      name,
    },
    select: { name: true, id: true },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "workspace updated", updatedWorkspace));
});

export const deleteWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError("workspace id is required", 400);
  await prisma.workspace.delete({ where: { id } });

  
  return res
    .status(200)
    .json(new ApiResponse(200, "workspace deleted", { id }));
});

export const addMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!id) throw new ApiError("workspace id is required", 400);

  const userAdded = await prisma.workspaceMember.create({
    data: {
      userId,
      workspaceId: id,
      role:'member'
    },
    select: {
      user: {
        select: {
          username: true,
        },
      },
      workspaceId: true,
    },
  });
   await fgaClient.write({
    writes: [
      {
        user: `user:${userId}`,
        relation: "member",
        object: `workspace:${id}`,
      },
    ],
  });
  return res.status(201).json(new ApiResponse(201, "member added", userAdded));
});

export const getMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError("workspace id is required", 400);
 const members = await prisma.workspaceMember.findMany({where:{
  workspaceId:id
 },select:{
  role:true,
  userId:true,
  user:{
    select:{
      username:true,
    }
  }
 }})
 if(!members.length) throw new ApiError('workspace not found',404);
  return res
    .status(200)
    .json(new ApiResponse(200, "members fetched", members));
});

export const removeMember = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  if (!id) throw new ApiError("workspace id is required", 400);

  if (!userId) throw new ApiError("user id is required", 400);
  
  await prisma.workspaceMember.delete({
    where: {
      userId_workspaceId: { userId, workspaceId:id },
    },
  });

   await fgaClient.write({
    deletes: [{ user: `user:${userId}`, relation: 'member', object: `workspace:${id}` }]
  });
 
  return res
    .status(200)
    .json(new ApiResponse(200, "member remove"));
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  const { role } = req.body;

  const existingMember = await prisma.workspaceMember.findUnique({
  where: { userId_workspaceId: { userId, workspaceId: id } },select:{role:true}
});
if(existingMember.role === role) return res.status(200).json(new ApiResponse(200,'role updated'));

const oldRole = existingMember.role;

  await prisma.workspaceMember.update({
    where:{userId_workspaceId:{userId,workspaceId:id}},data:{
      role
    }
  })

  await fgaClient.write({
    deletes: [{ user: `user:${userId}`, relation: oldRole, object: `workspace:${id}` }],
    writes: [{ user: `user:${userId}`, relation: role, object: `workspace:${id}` }]
  });
  return res.status(200).json(new ApiResponse(200, `Role updated to ${role}`, { userId, role }));
});
