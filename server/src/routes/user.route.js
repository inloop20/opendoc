import express from "express";
import validate from "../middleware/validate.middleware.js";
import {
  getUserById,
  updateCurrentUser,
  deleteCurrentUser,
  getUserBySearch,
  getUserWorkSpace,
  getUserOrganizations,
} from "../controllers/user.controller.js";

import { usernameSchema, searchUserSchema } from "../../../shared/index.js";

const userRouter = express.Router();

userRouter.patch("/me", validate(usernameSchema), updateCurrentUser);

userRouter.delete("/me", deleteCurrentUser);

userRouter.get("/search", validate(searchUserSchema), getUserBySearch);

userRouter.get("/workspaces", getUserWorkSpace);


userRouter.get("/organizations", getUserOrganizations);

userRouter.get("/:id", getUserById);

export default userRouter;
