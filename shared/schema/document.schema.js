import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200).optional(),

  content: z.string().optional(),
});

export const memberSchema = z.object({
  email: z.email('invalid email'), 
  role: z.enum(["admin", "editor", "member"]),
});