import { z } from "zod";

/**
 * Shared between the client form and the server route, so validation rules
 * cannot drift apart. Imported by both — keep it free of server-only code.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name")
    .max(80, "That name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email")
    .email("That doesn't look like a valid email"),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least 10 characters")
    .max(4000, "That message is too long"),
  /**
   * Honeypot. Real users never see this field, so anything in it means a bot.
   * Named innocuously because scrapers fill fields called "website".
   *
   * Deliberately unconstrained: if the schema rejected a filled honeypot, the
   * response would name the field and hand bots the exact signal needed to
   * start skipping it. The route accepts these silently instead.
   */
  website: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
