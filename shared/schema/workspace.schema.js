import { z } from "zod";

export const nameSchema = z.object({
    name: z
      .string()
      .trim()
      .min(3, "Workspace name must not be lower than 3 characters")
      .transform((val) => val.toLowerCase()),
});

export const UpdateMemberRoleSchema = z.object({
  role: z.enum(["admin", "editor", "member"], {
    required_error: "Role is required",
    invalid_type_error: "Invalid role",
  }),
});

export const addMemberSchema = z.object({
  email : z.email('email is required'),
})