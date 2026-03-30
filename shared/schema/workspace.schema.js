import { z } from "zod";

export const nameSchema = z.object({
    name: z
      .string()
      .trim()
      .min(1, "Workspace name is required")
      .transform((val) => val.toLowerCase()),
});

export const UpdateMemberRoleSchema = z.object({
  role: z.enum(["admin", "editor", "member"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});

export const addMemberSchema = z.object({
  userId : z.uuid('userId is required'),
})