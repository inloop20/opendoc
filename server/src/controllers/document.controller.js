import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/db.config.js";
import fgaClient from "../config/openfga.js";

export const createDocument = asyncHandler(async (req, res) => {
  const { folderId } = req.params;
  if (!folderId) throw new ApiError("folder id is required", 400);

  const { title, content } = req.body;

  const document = await prisma.document.create({
    data: {
      title,
      content,
      folderId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      folderId: true,
      created_at: true,
    },
  });
  
  await fgaClient.write({
  writes: [{ 
  
    user: `folder:${folderId}`, 
    relation: 'parent', 
    object: `document:${document.id}` 
  }]
});

  return res
    .status(201)
    .json(new ApiResponse(201, "document created", document));
});

export const getDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  if (!documentId) throw new ApiError("document id is required", 400);

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      id: true,
      folderId: true,
      title: true,
      created_at: true,
      updated_at: true,
    },
  });

  if (!document) {
    throw new ApiError("Document not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "document fetched", document));
});

export const updateDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  if (!documentId) throw new ApiError("document id is required", 400);

  const { title, content } = req.body;

  const updatedDocument = await prisma.document.update({
    where: { id: documentId },
    data: {
     ...(title && { title }), 
      ...(content && { content })
    },
    select: {
      id: true,
      title: true,
      content: true,
      updated_at: true,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "document updated", updatedDocument));
});

export const deleteDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  if (!documentId) throw new ApiError("document id is required", 400);

  const doc = await prisma.document.findUnique({ where: { id: documentId } });
  if (!doc) throw new ApiError("Document not found", 404);

  await prisma.document.delete({
    where: { id: documentId },
  });
   await fgaClient.write({
    deletes: [{ 
      user: `folder:${doc.folderId}`, 
      relation: 'parent', 
      object: `document:${documentId}` 
    }]
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "document deleted", { documentId }));
});



export const shareDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { email, role } = req.body; 

  const targetUser = await prisma.user.findUnique({ where: { email } });
  if (!targetUser) throw new ApiError("User not found", 404);

  await fgaClient.write({
    writes: [{ 
      user: `user:${targetUser.id}`, 
      relation: role,
      object: `document:${documentId}` 
    }]
  });

  return res.status(200).json(new ApiResponse(200, `Document shared as ${role}`, { email }));
});

export const revokeDocAccess = asyncHandler(async (req, res) => {
  const { docId, userId } = req.params;
  if(!docId || !userId) throw new ApiError('user id and document id is required',400);

  const tuples = await fgaClient.read({
  tuple_keys: [
    { user: `user:${userId}`, object: `document:${docId}` }
  ]
});

const deletes = tuples.tuples
  .filter(t => ['viewer', 'editor'].includes(t.key.relation))
  .map(t => t.key);

if (deletes.length > 0) {
  await fgaClient.write({ deletes });
}


  return res.status(200).json(new ApiResponse(200, "External access revoked"));
});


