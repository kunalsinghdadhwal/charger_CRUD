export interface User {
    _id: string
    fullName: string
    email: string
    createdAt: string
    updatedAt: string
}

export interface LoginResponse {
    success: boolean
    data: {
        user: User
        accessToken: string
        refreshToken: string
    }
    message: string
}

export interface ApiResponse<T = any> {
    success: boolean
    data: T
    message: string
}
