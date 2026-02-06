import prisma from "@/lib/db/prisma";
import { ApiError } from "@/lib/utils/api-error";
import { SignupInput } from "@/validations/signup/createUser.schema";
import { v4 as UUIDv4 } from "uuid";
import { hash } from "bcryptjs";

// auth service response
interface AuthServiceResponse {
    user?: {
        id: string;
    };
    accessToken?: string;
    error?: string;
}

export async function registerUser(validatedData: SignupInput) {
    let authUserId: string | null = null;

    try {
        const contactNumber = `${validatedData.country_code}${validatedData.phone_number}`;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: validatedData.email,
                contactNumber: contactNumber,
            },
        });

        if (existingUser) {
            throw new ApiError(
                "User with this email or contact number already exists",
                409
            );
        }

        // check the employee id in the employees table
        const employee = await prisma.corporate_employees.findUnique({
            where: {
                employeeid: validatedData.employee_id,
            },
        });

        if (validatedData.employee_id !== "" && !employee) {
            throw new ApiError("Invalid employee ID", 400);
        }

        const AUTH_SERVICE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`;

        // call auth service
        const authRes = await fetch(AUTH_SERVICE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                first_name: validatedData.first_name,
                last_name: validatedData.last_name,
                email: validatedData.email,
                password: validatedData.password,
                confirm_password: validatedData.confirm_password,
                phone_number: validatedData.phone_number,
                role: "patient",
                age: validatedData.age,
                gender: validatedData.gender,
                nic: validatedData.nic_number,
            }),
        });

        if (!authRes.ok) {
            const errorData = await authRes.json().catch(() => ({}));
            console.error("Auth service error:", errorData);
            throw new ApiError(
                errorData.message ||
                    "Authentication service error. Please try again later.",
                authRes.status
            );
        }

        const authData: AuthServiceResponse = await authRes.json();
        console.log("SuperBase response ", authData);

        if (!authData.user?.id) {
            console.error("Invalid auth service response:", authData);
            throw new ApiError(
                "Invalid response from authentication service",
                500
            );
        }

        authUserId = authData.user.id;
        const name = `${validatedData.first_name} ${validatedData.last_name}`;
        const userId = UUIDv4();
        const hashedPassword = await hash(validatedData.password, 12);

        const user = await prisma.user.create({
            data: {
                id: userId,
                authUserId: authUserId,
                name: name,
                userType: validatedData.user_type || "",
                role: "PATIENT",
                title: validatedData.title || null,
                age:
                    typeof validatedData.age === "number"
                        ? validatedData.age
                        : parseInt(validatedData.age as string),
                gender: validatedData.gender || null,
                email: validatedData.email,
                contactNumber: contactNumber,
                nicNumber: validatedData.nic_number || null,
                passportNumber: validatedData.passport_number || null,
                password: hashedPassword,
                employeeId: validatedData.employee_id || null,
                packageId: validatedData.package || null,
                nationality: validatedData.nationality,
                acceptedTerms: validatedData.accepted_terms,
                isNumberVerified: validatedData.is_number_verified || false,
                isEmailVerified: validatedData.is_email_verified || false,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return {
            message: "User registered successfully",
            data: {
                userId: user.id,
                authUserId: authUserId,
                name: user.name,
                email: user.email,
            },
            userId: user.id,
            ...(authData.accessToken && {
                accessToken: authData.accessToken,
            }),
        };
    } catch (error) {
        console.error(
            "Signup error:",
            error instanceof Error ? error.message : "Unknown error"
        );

        if (authUserId) {
            try {
                // Rollback - delete the auth user
            } catch (cleanupError) {
                console.error("Auth rollback failed:", cleanupError);
            }
        }

        throw error;
    }
}
