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

export const postFormSchema = z.object({
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(3000, "Caption is too long"),
  tags: z.string().optional(),
  image: z.any().nullable(),
});

export const userProfileFormSchema = z.object({
  avatar: z.any().nullable(),
  name: z.string().min(2, "Display name must be at least 2 characters"),
  email: z.email({ message: "Invalid email address" }),
  bio: z.string().max(150, "Bio is too long"),
});

export const commentFormSchema = z.object({
  comment: z.string().min(1, "Comment is required"),
});

export const messageFormSchema = z.object({
  message: z.string().min(1, "Message is required"),
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
