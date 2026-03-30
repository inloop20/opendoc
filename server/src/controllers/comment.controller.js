import { prisma } from "../config/db.config.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from '../utils/asyncHandler.js'
import fgaClient from "../config/openfga.js";

export const createComment = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  if(!documentId) throw new ApiError('document id is required',400);
  const { content } = req.body;
  if(!content || content.trim() === '') throw new ApiError('comment is required',400);

  const comment = await prisma.comment.create({
    data: {
      content,
      authorId: req.user.id,
      documentId,
    },
    select: {
      id: true,
      content: true,
      authorId: true,
      author: { select: { username: true } },
      documentId: true,
      created_at: true,
    },
  });

  await fgaClient.write({
    writes: [{
        user: `user:${req.user.id}`,
        relation: "owner",
        object: `comment:${comment.id}`,
      },
      {
        user: `document:${documentId}`,
        relation: "parent",
        object: `comment:${comment.id}`,
      },
    ],
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "comment created", comment));
});

export const getComments = asyncHandler(async(req,res) =>{
    const {documentId} = req.params;
    if(!documentId) throw new ApiError('document id is required',400);
  const comments = await prisma.comment.findMany({
    where:{
        documentId
    },select:{
        authorId:true,
        author:{select:{username:true,id:true}},
        content:true,
        created_at:true,
        id:true
    },orderBy:{created_at:'asc'}
  })

  
  return res.status(200).json(new ApiResponse(200,'comments fetched',comments));
})