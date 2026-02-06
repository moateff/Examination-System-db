

export const UserRole = {
    STUDENT: "S",
    APPLICANT: "P",
    ADMIN: "A",
    INSTRUCTOR: "I",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface User {
    userID: number;
    fName: string;
    lName: string;
    username: string;
    email: string;
    role: UserRole;
    gender: string;
}