import { z } from "zod";

// Phone number regex - basic international format
const phoneRegex = /^\+?[1-9]\d{1,14}$/;

// NIC regex for Sri Lankan NIC (old: 9 digits + V, new: 12 digits)
const nicRegex = /^(?:\d{9}[vVxX]|\d{12})$/;

// Passport regex - alphanumeric, 6-9 characters
const passportRegex = /^[A-Z0-9]{6,9}$/;

export const updateUserSchema = z
    .object({
        // Personal Information
        name: z
            .string()
            .min(1, "First name is required")
            .max(50, "First name must be less than 50 characters")
            .regex(
                /^[a-zA-Z\s'-]+$/,
                "First name can only contain letters, spaces, hyphens and apostrophes",
            )
            .optional(),

        title: z
            .enum(["Mr", "Mrs", "Miss", "Dr", "Prof", "Rev"], {
                message: "Invalid title",
            })
            .optional(),

        age: z
            .number()
            .int("Age must be an integer")
            .min(1, "Age must be at least 1")
            .max(150, "Age must be less than 150")
            .or(
                z
                    .string()
                    .regex(/^\d+$/, "Age must be a number")
                    .transform(Number),
            )
            .optional(),

        gender: z
            .enum(["male", "female", "other"], {
                message: "Gender must be male, female, or other",
            })
            .optional(),

        // Contact Information
        email: z
            .string()
            .min(1, "Email is required")
            .email("Invalid email format")
            .max(255, "Email must be less than 255 characters")
            .toLowerCase()
            .optional(),

        contactNumber: z
            .string()
            .min(10, "Contact number must be at least 10 characters")
            .max(20, "Contact number must be less than 20 characters")
            .optional(),

        country_code: z
            .string()
            .regex(
                /^\+\d{1,4}$/,
                "Country code must start with + and contain 1-4 digits",
            )
            .optional(),

        phone_number: z
            .string()
            .min(9, "Phone number must be at least 9 digits")
            .max(13, "Phone number must be less than 13 digits")
            .regex(/^\d+$/, "Phone number must contain only digits")
            .optional(),

        // Identification
        nic_number: z
            .string()
            .regex(nicRegex, "Invalid NIC format")
            .optional()
            .nullable()
            .or(z.literal("")),

        nicNumber: z
            .string()
            .regex(nicRegex, "Invalid NIC format")
            .optional()
            .nullable()
            .or(z.literal("")),

        passport_number: z
            .string()
            .regex(passportRegex, "Invalid passport format")
            .optional()
            .nullable()
            .or(z.literal("")),

        passportNumber: z
            .string()
            .regex(passportRegex, "Invalid passport format")
            .optional()
            .nullable()
            .or(z.literal("")),

        nationality: z
            .string()
            .min(2, "Nationality must be at least 2 characters")
            .max(50, "Nationality must be less than 50 characters")
            .optional()
            .nullable()
            .or(z.literal("")),
    })
    .refine(
        (data) => {
            // If passport_number or passportNumber is provided, nationality should also be provided
            // If nic_number or nicNumber is provided, that's fine on its own
            const hasPassport =
                data.passport_number || (data as any).passportNumber;
            if (hasPassport && !data.nationality) {
                return false;
            }
            return true;
        },
        {
            message: "Nationality is required when passport number is provided",
            path: ["nationality"],
        },
    )
    .refine(
        (data) => {
            // Either NIC number OR (nationality AND passport number) must be provided if any identification is being updated
            const hasNic =
                (data.nic_number && data.nic_number !== "") ||
                ((data as any).nicNumber && (data as any).nicNumber !== "");
            const hasPassport =
                (data.passport_number && data.passport_number !== "") ||
                ((data as any).passportNumber &&
                    (data as any).passportNumber !== "");
            const hasNationality = data.nationality && data.nationality !== "";

            // If no identification fields are being updated, skip validation
            if (!hasNic && !hasPassport && !hasNationality) {
                return true;
            }

            // If identification fields are being updated, ensure valid combination
            return hasNic || (hasNationality && hasPassport);
        },
        {
            message:
                "Either NIC number OR both nationality and passport number are required",
            path: ["nic_number"],
        },
    );

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
