import express from "express";
import { createFolder, deleteFolder, getFolderContents, getFolders, moveFolder, revokeFolderAccess, shareFolder, updateFolder } from "../controllers/folder.controller.js";
import validate from "../middleware/validate.middleware.js";
import { createFolderSchema, moveFolderSchema, shareFolderSchema, updateFolderSchema } from "../../../shared/index.js";
import { checkPermission } from "../middleware/authz.middleware.js";

const folderRouter = express.Router();

folderRouter.get(
  "/workspace/:workspaceId",
  checkPermission("member", "workspace", "workspaceId"),
  getFolders,
);

folderRouter.post(
  "/:folderId/share", 
  validate(shareFolderSchema),
  checkPermission("editor", "folder", "folderId"), 
  shareFolder
);

folderRouter.delete(
  "/:folderId/share/:userId", 
  checkPermission("editor", "folder", "folderId"), 
  revokeFolderAccess
);


folderRouter.put(
  "/:folderId/move",
  validate(moveFolderSchema),
  checkPermission("editor","folder","folderId"),
  moveFolder
);
folderRouter.patch(
  "/:folderId",
  validate(updateFolderSchema),
  checkPermission("editor", "folder", "folderId"),
  updateFolder
);

folderRouter.delete(
  "/:folderId",
  checkPermission("editor", "folder", "folderId"),
  deleteFolder
);

folderRouter.get(
  "/:folderId",
  checkPermission("viewer", "folder", "folderId"),
  getFolderContents
);

folderRouter.post(
  "/workspace/:workspaceId",
  validate(createFolderSchema),
  checkPermission("member", "workspace", "workspaceId"),
  createFolder,
);





export default folderRouter;