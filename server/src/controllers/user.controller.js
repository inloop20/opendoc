import { prisma } from "../config/db.config.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError("invalid id", 400);
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, username: true, email: true },
  });
  if (!user) throw new ApiError("User not found", 404);
  
  return res.status(200).json(new ApiResponse(200, "user found", user));
});

export const updateCurrentUser = asyncHandler(async (req, res) => {
  const { username } = req.body;
  const { id } = req.user;

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { username },
    select: { username: true, id: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "username updated", updatedUser));
});

export const deleteCurrentUser = asyncHandler(async (req, res) => {
  const { id } = req.user;

  await prisma.user.delete({
    where: { id },
  });
  return res.status(200).json(new ApiResponse(200, "user deleted"));
});

export const getUserBySearch = asyncHandler(async (req,res) => {
  const { username, email } = req.query;
    if (!username && !email)
    throw new ApiError("Provide at least username or email to search", 400);

   const whereClause = username
    ? { username: { contains: username, mode: "insensitive" } }
    : { email: { contains: email, mode: "insensitive" } };
  
  const user = await prisma.user.findMany({
    where: 
      whereClause,
    take: 7,
    select: {
      id: true,
      username: true,
      email: true,
    },
  });
  return res.status(200).json(new ApiResponse(200, "users fetched", user));
});

export const getUserWorkSpace = asyncHandler(async (req, res) => {
  const { id } = req.user;
  if (!id) throw new ApiError("invalid id", 400);
  const workspaces = await prisma.workspaceMember.findMany({
    where: {
      userId: id,
    },
     select: {

      workspace: {

        select: {
          _count:{select:{folders:true}},
          id: true,
          name: true,
          organizationId: true,
          created_at:true,
          updated_at:true,
          organization:{
            select:{
              name:true
            }
          }
        },
      },
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "workspace fetched", workspaces));
});

export const getUserOrganizations = asyncHandler(async (req, res) => {
  const { id } = req.user;

  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId: id,
    },select: {
      role:true,
      organization: {
        select: {
          id: true,
          name: true,
          created_at: true,
          _count:{select:{organization_member:true}}
        },
      },
    },
  });
   const organizations = memberships.map(m => ({
    id: m.organization.id,
    name: m.organization.name,
    created_at: m.organization.created_at,
    memberCount: m.organization._count.organization_member,
    role: m.role,
  }));
  return res
    .status(200)
    .json(new ApiResponse(200, "organizations fetched", organizations));
});

