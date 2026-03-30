import express from 'express';
import { createDocument, deleteDocument, getDocument, revokeDocAccess, shareDocument, updateDocument } from '../controllers/document.controller.js';
import validate from '../middleware/validate.middleware.js';
import {createDocumentSchema, memberSchema, updateDocumentSchema} from '../../../shared/index.js'
import { createComment, getComments } from '../controllers/comment.controller.js';
import { checkPermission } from "../middleware/authz.middleware.js";

const documentRouter = express.Router();

documentRouter.post(
  "/:documentId/share", 
  validate(memberSchema),
  checkPermission("editor", "document", "documentId"), 
  shareDocument
);

documentRouter.delete(
  "/:documentId/share/:userId", 
  checkPermission("editor", "document", "documentId"), 
  revokeDocAccess
);

documentRouter.post(
  "/folder/:folderId",
  validate(createDocumentSchema),
  checkPermission("editor", "folder", "folderId"),
  createDocument
);

documentRouter.get(
  "/:documentId/comments",
  checkPermission("viewer", "document", "documentId"),
  getComments
);

documentRouter.post(
  "/:documentId/comments",
  checkPermission("viewer", "document", "documentId"),
  createComment
);

documentRouter.get('/:documentId',checkPermission("viewer", "document", "documentId"),getDocument)

documentRouter.patch(
  "/:documentId",
  validate(updateDocumentSchema),
  checkPermission("editor", "document", "documentId"),
  updateDocument
);

documentRouter.delete(
  "/:documentId",
  checkPermission("editor", "document", "documentId"),
  deleteDocument
);

export default documentRouter;