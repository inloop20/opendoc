import { z } from "zod";

export const usernameField = z
  .string()
  .min(1, "username required")
  .transform((s) => s.trim().toLowerCase());


export const usernameSchema = z.object({
  username: usernameField,
});

export const searchUserSchema = z
  .object({
    email: z.string().email("email is required").optional(),
  })
  .extend({
    username: usernameField.optional(),
  })
  .refine(
    (data) => !!data.email ^ !!data.username,
    { message: "username or email required" }
  );