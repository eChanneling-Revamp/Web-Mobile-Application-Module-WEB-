import prisma from "@/lib/db/prisma";
import { UpdateUserInput } from "@/validations/user/updateUser.schema";

// get all user information by ID
export async function getUserById(id: string) {
    return prisma.user.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            companyName: true,
            contactNumber: true,
            isActive: true,
            nicNumber: true,
            passportNumber: true,
            nationality: true,
            userType: true,
            title: true,
            packageId: true,
            employeeId: true,
            age: true,
            gender: true,
        },
    });
}

// update user by id
export async function updateUserById(id: string, data: UpdateUserInput) {
    const updatedData: any = { ...data };

    // Handle contact number: combine country_code and phone_number if provided
    if (data.country_code && data.phone_number) {
        updatedData.contactNumber = `${data.country_code}${data.phone_number}`;
    }

    delete updatedData.country_code;
    delete updatedData.phone_number;

    // Handle both camelCase and snake_case for nicNumber
    if (updatedData.nic_number !== undefined) {
        updatedData.nicNumber = updatedData.nic_number;
        delete updatedData.nic_number;
    }
    // If nicNumber is already provided (camelCase), keep it as is

    // Handle both camelCase and snake_case for passportNumber
    if (updatedData.passport_number !== undefined) {
        updatedData.passportNumber = updatedData.passport_number;
        delete updatedData.passport_number;
    }
    // If passportNumber is already provided (camelCase), keep it as is

    const updateUser = prisma.user.update({
        where: { id },
        data: updatedData,
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            companyName: true,
            contactNumber: true,
            isActive: true,
            nicNumber: true,
            passportNumber: true,
            nationality: true,
            userType: true,
            title: true,
            packageId: true,
            employeeId: true,
            age: true,
            gender: true,
        },
    });

    return updateUser;
}

// delete user by id
export async function deleteUserById(id: string) {
    return prisma.user.delete({
        where: { id },
    });
}
