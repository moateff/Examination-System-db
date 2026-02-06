import { BaseService } from '@/shared/api/baseService';
import { ENDPOINTS } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { User } from '../types';

export interface LoginResponse {
    user: User;
}

export interface LoginData {
    userID: number;
    fName: string;
    lName: string;
    username: string;
    email: string;
    role: string;
    gender: string;
}

export class AuthService extends BaseService {
    async login(username: string, password: string): Promise<LoginResponse> {
        const response = await this.post<ApiResponse<LoginData>>(ENDPOINTS.AUTH.LOGIN, { username, password });
        
        // Extract user data from ApiResponse wrapper
        const userData = response.data;
        
        // Transform the API response to match our LoginResponse format
        return {
            user: {
                userID: userData.userID,
                fName: userData.fName,
                lName: userData.lName,
                username: userData.username,
                email: userData.email,
                role: userData.role as User['role'],
                gender: userData.gender,
            },
        };
    }
}

export const authService = new AuthService();
