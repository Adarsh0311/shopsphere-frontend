import { Role } from "./role.model";

export interface User {
    userId: string;
    username: string;
    password: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    roles: Role[];
    registrationDate: string;
    lastLogin?: string;
}

