

export const UserRole = {
    STUDENT: "student",
    EXAMINER: "examiner",
    ADMIN: "admin",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}