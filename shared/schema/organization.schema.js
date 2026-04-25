import { z } from "zod";

export const orgCreateSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
});

export const AddUserBodySchema = z.object({
  email: z.email('Invalid email format').min(1,'at least one email is required')
});


