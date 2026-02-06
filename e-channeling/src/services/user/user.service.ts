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
    const contactNumber = `${data.country_code}${data.phone_number}`;

    const updatedData = { ...data, contactNumber };
    delete (updatedData as any).country_code;
    delete (updatedData as any).phone_number;

    // update nic_number key as a nicNumber and passport_number as passportNumber
    if ((updatedData as any).nic_number !== undefined) {
        (updatedData as any).nicNumber = (updatedData as any).nic_number;
        delete (updatedData as any).nic_number;
    }

    if ((updatedData as any).passport_number !== undefined) {
        (updatedData as any).passportNumber = (
            updatedData as any
        ).passport_number;
        delete (updatedData as any).passport_number;
    }

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
