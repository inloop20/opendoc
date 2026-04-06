import { prisma } from "../config/db.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import fgaClient from "../config/openfga.js";
import { WriteRequestWritesOnDuplicate } from "@openfga/sdk";

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
    .json(new ApiResponse(200, "organization fetched", {...organization,canCreateWorkspace:req.permission}));
});

export const addUsers = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { emails } = req.body;
  if (!id) throw new ApiError("organization id is required", 400);

  const users = await prisma.user.findMany({
    where: {
      email: { in: emails }
    },
    select: { id: true, email: true }
  });

  const foundEmails = users.map(user => user.email);
  const nonExistentEmails = emails.filter(email => !foundEmails.includes(email));

  if (users.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, "No users were added.", {
        addedCount: 0,
        nonExistentEmails,
        alreadyMembers: []
      })
    );
  }

  const userIds = users.map(user => user.id);

  const memberData = userIds.map(userId => ({
    organizationId: id,
    userId: userId,
    role: 'member'
  }));

 const createdMembers= await prisma.organizationMember.createManyAndReturn({
    data: memberData,
    skipDuplicates: true
  });

  const successfullyAddedUserIds = createdMembers.map(m => m.userId);
  const alreadyMembers = users
    .filter(u => !successfullyAddedUserIds.includes(u.id))
    .map(u => u.email);

    if (successfullyAddedUserIds.length > 0) {
    const fgaWrites = successfullyAddedUserIds.map(userId => ({
      user: `user:${userId}`,
      relation: 'member',
      object: `organization:${id}`
    }))
    await fgaClient.write({
      writes: fgaWrites
    },{
      conflict:{
        onDuplicateWrites:WriteRequestWritesOnDuplicate.Ignore
      }
    });
  }


 return res.status(201).json(
    new ApiResponse(
      201, 
      `${createdMembers.length} user(s) added successfully.`, 
      {
        addedCount:createdMembers.length,
        nonExistentEmails: nonExistentEmails.length > 0 ? nonExistentEmails : undefined,
        alreadyMembers: alreadyMembers.length > 0 ? alreadyMembers : undefined
      }
    )
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

