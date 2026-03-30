import { email, z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),

  parentFolderId: z
  .uuid("Invalid folder id")
  .optional()
  .nullable()
  .transform((val) => val ?? null),
}).strict()

export const updateFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").max(100),
});

export const moveFolderSchema = z.object({
  newParentFolderId: z.uuid(), 
});

export const shareFolderSchema = z.object({
  email: z.email('invalid email format'),
  role: z.enum(["editor", "viewer"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});


