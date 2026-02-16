import { z } from "zod";

export const runningNumberQuerySchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .transform((val) => val.trim().replace(/\s+/g, "")) // remove spaces only
    .refine(
      (val) =>
        /^07\d{8}$/.test(val) || // 0712345678
        /^\+947\d{8}$/.test(val) || // +94712345678
        /^947\d{8}$/.test(val), // 94712345678
      {
        message:
          "Enter a valid Sri Lankan mobile number (0712345678 / +94712345678 / 94712345678)",
      }
    ),
});
