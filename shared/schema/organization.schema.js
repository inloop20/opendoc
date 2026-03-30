import { z } from "zod";

export const orgCreateSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
});

export const AddUserBodySchema = z.object({
  userId: z.uuid("Invalid user ID"),
});


