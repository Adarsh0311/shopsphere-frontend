export interface Role {
    roleId: string;
    name: string;
    description?: string;
}

export enum UserRole {
    USER = 'ROLE_USER',
    ADMIN = 'ROLE_ADMIN'
};

export const ROLE_NAMES = {
    USER: 'User',
    ADMIN: 'Administrator'
} as const;