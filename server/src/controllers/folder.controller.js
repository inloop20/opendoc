import { prisma } from "../config/db.config.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import fgaClient from "../config/openfga.js";

export const createFolder = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  if (!workspaceId) throw new ApiError("workspace id is required", 400);
  const { name, parentFolderId } = req.body;

  const folderExist = await prisma.folder.findFirst({
    where: {
        workspaceId,
        parentFolderId: parentFolderId ?? null,
        name,
      },
    select: { id: true },
  });
  if (folderExist) {
    throw new ApiError("Folder already exists", 409);
  }
  const newFolder = await prisma.folder.create({
    data: {
      name,
      parentFolderId: parentFolderId ?? null,
      workspaceId,
    },
    select: {
      id: true,
      name: true,
      parentFolderId: true,
      workspaceId: true,
      created_at: true,
    },
  });

   const parentIdentifier = parentFolderId 
    ? `folder:${parentFolderId}` 
    : `workspace:${workspaceId}`;

  await fgaClient.write({
    writes: [{ 
      user: parentIdentifier, 
      relation: 'parent', 
      object: `folder:${newFolder.id}`  
    },
    {
      user: `user:${req.user.id}`,
      relation: 'editor',
      object: `folder:${newFolder.id}`
    }]
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "folder created", newFolder));
});

export const getFolders = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  if (!workspaceId) throw new ApiError("workspace id is required", 400);
  const folders = await prisma.folder.findMany({
    where: { workspaceId },
    select: {
      id: true,
      name: true,
      parentFolderId: true,
      created_at: true,
    },
    orderBy: {
      created_at: "asc",
    },
  });
  return res.status(200).json(new ApiResponse(200, "folders fetched", folders));
});

export const updateFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  if (!folderId) throw new ApiError("folder id is required", 400);
  const { name } = req.body;

  const updatedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: {
      name,
    },
    select: { id: true, name: true },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "folder name updated", updatedFolder));
});

export const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  if (!folderId) throw new ApiError("folder id is required", 400);

  const folder = await prisma.folder.findUnique({ where: { id: folderId } });
  if (!folder) throw new ApiError("Folder not found", 404);

  await prisma.folder.delete({
    where: { id: folderId },
  });

  const parentId = folder.parentFolderId ? `folder:${folder.parentFolderId}` : `workspace:${folder.workspaceId}`;
  await fgaClient.write({
    deletes: [{ user: parentId, relation: 'parent', object: `folder:${folderId}` }]
  });


  return res
    .status(200)
    .json(new ApiResponse(200, "folder deleted"));
});

export const getFolderContents = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  const folder = await prisma.folder.findUnique({
    where: { id: folderId },
    select:{   
      name:true,   
      subfolders:{
        select:{id:true,name:true,created_at:true}
      },
      documents:{
        select:{id:true,title:true,created_at:true}
      }
    }
   
  });
  return res.status(200).json(new ApiResponse(200, "Folder contents fetched", folder));
});

export const moveFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const { newParentFolderId } = req.body; 
  if(!folderId) throw new ApiError("folder id is invalid",400);
  if (folderId === newParentFolderId) 
  throw new ApiError('A folder cannot be moved inside itself.', 400);
  
  const currentFolder = await prisma.folder.findUnique({ where: { id: folderId } });
  if (!currentFolder) throw new ApiError("Folder not found", 404);

  const updatedFolder = await prisma.folder.update({
    where: { id: folderId },
    data: { parentFolderId: newParentFolderId ?? null },select:{workspaceId:true}
  });

  const oldParent = currentFolder.parentFolderId 
    ? `folder:${currentFolder.parentFolderId}` 
    : `workspace:${currentFolder.workspaceId}`;
    
  const newParent = newParentFolderId 
    ? `folder:${newParentFolderId}` 
    : `workspace:${workspaceId}`;

  await fgaClient.write({
    deletes: [{ user: oldParent, relation: 'parent', object: `folder:${folderId}` }],
    writes: [{ user: newParent, relation: 'parent', object: `folder:${folderId}` }]
  });

  return res.status(200).json(new ApiResponse(200, "Folder moved successfully", updatedFolder));
});

export const shareFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  const { email,role } = req.body; 

  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) throw new ApiError("User not found", 404);

  await fgaClient.write({
    writes: [{ 
      user: `user:${targetUser.id}`, 
      relation: role, 
      object: `folder:${folderId}` 
    }]
  });

  return res.status(200).json(new ApiResponse(200, `Folder shared to ${email}`, { email }));
});


// DELETE /folders/:folderId/share/:userId
export const revokeFolderAccess = asyncHandler(async (req, res) => {
  const { folderId, userId } = req.params;

  if (!folderId || !userId) {
    throw new ApiError("Folder ID and User ID are required", 400);
  }

  const tuples = await fgaClient.read({
  tuple_keys: [
    { user: `user:${userId}`, object: `folder:${folderId}` }
  ]
});

const deletes = tuples.tuples
  .filter(t => ['viewer', 'editor'].includes(t.key.relation))
  .map(t => t.key);

if (deletes.length > 0) {
  await fgaClient.write({ deletes });
}

  return res
    .status(200)
    .json(new ApiResponse(200, "Folder access revoked for user"));
});
