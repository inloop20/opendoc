import { prisma } from "../config/db.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import fgaClient from "../config/openfga.js";

export const createOrganization = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  const org = await prisma.organization.create({
    data: {
      name,
      organization_member: {
        create: {
          userId,
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
    writes: [{ user: `user:${userId}`, relation: 'admin', object: `organization:${org.id}` }]
  });
 
  res.status(201).json(new ApiResponse(201, "Organization created", org));
});

export const getOrganizationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError("organization id is required", 400);

  const organization = await prisma.organization.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      _count:{select:{organization_member:true}}
    },
  });

  if (!organization) {
    throw new ApiError("Organization not found", 404);
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "organization fetched", organization));
});

export const addUsers = asyncHandler(async (req, res) => {
  const orgId = req.params.id;
  const { email } = req.body;
  if (!orgId) {
    throw new ApiError("Organization id is required", 400);
  }

  if (!email) {
    throw new ApiError("Email is required", 400);
  }

  const user = await prisma.user.findUnique({
    where: {email},
    select: { id: true },
  });

  if (!user) {
    throw new ApiError("User not found", 404);
  }


  const createdMember= await prisma.organizationMember.create({
    data: {
      userId: user.id,
      organizationId: orgId,
      role:'member'
    },
  });

  await fgaClient.write({
    writes: [
      {
        user: `user:${user.id}`,
        relation: "member",
        object: `organization:${orgId}`,
      },
    ],
  });

  return res.status(201).json(
    new ApiResponse(201, "User added successfully", {
      member: createdMember,
    })
  );
});

export const getOrganizationMembers = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) throw new ApiError("organization id is required", 400);
  const getMembers = await prisma.organizationMember.findMany({
    where: {
      organizationId: id,
    },
    select: { userId: true, role:true,user: { select: { username: true } } },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "organizations members fetched", getMembers));
});

export const deleteOrganization = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) throw new ApiError("organization id is required", 400);
  await prisma.organization.delete({
    where: { id },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "organization deleted successfully", id));
});

export const updateOrganization = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id) throw new ApiError("organization id is required", 400);
  const { name } = req.body;
  const updatedOrg = await prisma.organization.update({
    where: { id },
    data: { name:name.trim() },
    select: { id: true, name: true },
  });
  return res.status(200).json(new ApiResponse(200, "name updated", updatedOrg));
});

export const removeMember = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  if (!id) throw new ApiError("organization id is required", 400);
  const deletedMember = await prisma.organizationMember.delete({
    where: { userId_organizationId: { userId, organizationId: id } },select:{role:true}
  });


  await fgaClient.write({
    deletes: [
      { user: `user:${userId}`, relation: deletedMember.role, object: `organization:${id}` }
    ]
  });
  
  return res
    .status(200)
    .json(new ApiResponse(200, "member removed", { userId }));
});

export const leaveOrg = asyncHandler(async (req, res) => {
  
  const { orgId } = req.params;
  const userId = req.user.id;

  if (!orgId) throw new ApiError("organization id is required", 400);
  const deletedMember = await prisma.organizationMember.delete({
    where: { userId_organizationId: { userId, organizationId: orgId } },select:{role:true}
  });


  await fgaClient.write({
    deletes: [
      { user: `user:${userId}`, relation: deletedMember.role, object: `organization:${orgId}` }
    ]
  });
  
  return res
    .status(200)
    .json(new ApiResponse(200, "org leaved successfully", { userId }));
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;
  if (!id || !userId)
    throw new ApiError("organization and user id is required", 400);

  const { role } = req.body;
  
 const existing = await prisma.organizationMember.findUnique({
  where: {
    userId_organizationId: { userId, organizationId: id }
  }
});

if (!existing) throw new ApiError("member not found", 404);

if (existing.role === role) {
  return res.json(new ApiResponse(200, "role already up to date"));
}

await prisma.organizationMember.update({
  where: {
    userId_organizationId: { userId, organizationId: id }
  },
  data: { role }
});

await fgaClient.write({
  deletes: [
    {
      user: `user:${userId}`,
      relation: existing.role, 
      object: `organization:${id}`
    }
  ],
  writes: [
    {
      user: `user:${userId}`,
      relation: role,
      object: `organization:${id}`
    }
  ]
});
  return res
    .status(200)
    .json(new ApiResponse(200, "role updated", { id, userId, role }));
});

export const getOrgPermissions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (!id) {
    throw new ApiError("organization id is required", 400);
  }

  const [isAdmin, isMember] = await Promise.all([
    fgaClient.check({
      user: `user:${userId}`,
      relation: "admin",
      object: `organization:${id}`,
    }),
    fgaClient.check({
      user: `user:${userId}`,
      relation: "member",
      object: `organization:${id}`,
    }),
  ]);

  const permissions = {
    canManageOrg: isAdmin.allowed,
  };

  return res.status(200).json(
    new ApiResponse(200, "permissions fetched", permissions)
  );
});

