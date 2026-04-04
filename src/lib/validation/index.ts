import * as z from "zod";

export const signInSchema = z.object({
  identifier: z
    .string()
    .min(3, { message: "Identifier must be at least 3 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export type SigninFormValues = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .regex(/^[a-z0-9_]+$/, {
      message:
        "Username can only contain lowercase letters, numbers, and underscores.",
    }),

  name: z
    .string()
    .min(2, { message: "Display name must be at least 2 characters" }),
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
      message:
        "Password must contain at least one letter, one number, and one special character",
    }),
});

export type SignupFormValues = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  secret: z.string().min(1, "Secret is required"),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
      message:
        "Password must contain at least one letter, one number, and one special character",
    }),
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 5MB

export const postFormSchema = z.object({
  creator: z.string().min(1, "Creator is required"),
  caption: z
    .string()
    .min(5, "Caption must be at least 5 characters")
    .max(2200, "Caption is too long"),
  tags: z.array(z.string()),
  image: z
    .custom<File | string | null>()
    .optional()
    .refine((val) => {
      if (val instanceof File) {
        return val.size <= MAX_FILE_SIZE;
      }
      return true;
    }, "File size must be less than 4MB"),
  quality: z.number().min(0.1).max(1.0),
});

export type PostFormValues = z.infer<typeof postFormSchema>;

export const userProfileFormSchema = z.object({
  avatar: z.any().nullable(),
  name: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.email({ message: "Invalid email address" }),
  bio: z.string().max(150, "Bio is too long"),
});

export const newsLetterFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  file: z.any().nullable(),
});

export const nanogramFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  content: z.string().optional(),
  file: z.any().nullable(),
  linkedin: z
    .string()
    .url({ message: "Invalid LinkedIn URL" })
    .or(z.string().min(0))
    .optional(),
  instagram: z
    .string()
    .url({ message: "Invalid Instagram URL" })
    .or(z.string().min(0))
    .optional(),
  github: z
    .string()
    .url({ message: "Invalid GitHub URL" })
    .or(z.string().min(0))
    .optional(),
  alumini: z.boolean(),
  core: z.boolean(),
  priority: z.number().int().min(0, "Priority must be at least 0"),
});

export const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  completed: z.boolean(),
  registration: z
    .string()
    .url({ message: "Invalid Registration URL" })
    .or(z.string().min(0))
    .optional(),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  image: z.any().nullable(),
});
