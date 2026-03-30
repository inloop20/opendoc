import {z} from "zod"

export const registrationSchema = z.object({
    username: z.string().min(1,'username is required').transform(s=> s.trim().toLowerCase()),
    email: z.email("invalid email format"),
    password: z.string().min(6,'password length should not be below 6').transform(s => s.toLowerCase().trim())
});

export const loginSchema = z.object({
    email:z.email('invalid email format'),
    password: z.string().min(1,"password required").transform(s=> s.toLowerCase().trim()),
})