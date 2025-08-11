import z from "zod";

export const PetPostSchema = z.object({
  age: z
    .string("Age is required")
    .min(1, "Age cannot be empty")
    .max(20, "Age is too long")
    .trim(),

  color: z
    .string("Color is required")
    .min(2, "Color must be at least 2 characters")
    .max(50, "Color must be at most 50 characters")
    .trim(),

  description: z
    .string("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long")
    .trim(),

  contact: z
    .string("Contact info is required")
    .min(6, "Contact must be valid")
    .max(50, "Contact is too long")
    .trim(),

  isForAdoption: z.boolean().optional().default(true),

  isForSale: z.boolean().optional().default(false),

  price: z
    .number()
    .optional()
    .refine((val) => val === undefined || val >= 0, {
      message: "Price must be a positive number or omitted",
    }),

  location: z
    .string("Location is required")
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location is too long")
    .trim(),

  imageUrls: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image URL is required"),

  vaccinated: z.boolean().optional().default(false),

  dewormed: z.boolean().optional().default(false),

  type: z
    .string("PetType ID is required")
    .length(24, "PetType  must be a valid ObjectId"),

  breed: z
    .string("Breed ID is required")
    .length(24, "Breed must be a valid ObjectId"),
});

export const PetQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Page must be a positive number",
    }),
  size: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 25))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Size must be a positive number",
    }),
  search: z.string().optional(),
});

export type PetPostInput = z.infer<typeof PetPostSchema>;
