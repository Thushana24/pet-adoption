import { RegisterUserSchema } from "@/schemas/user.schema";
import z from "zod";

export type RegisterInput = z.infer<typeof RegisterUserSchema>;
