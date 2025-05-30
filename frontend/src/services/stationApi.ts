const API_BASE_URL = 'https://charger-crud.vercel.app/api/v1'

// Types matching the backend model
export interface Station {
    _id: string
    name: string
    location: {
        latitude: number
        longitude: number
    }
    status: 'Active' | 'Inactive'
    powerOutput: number
    connectorType: string
    createdAt: string
    updatedAt: string
}

export interface StationResponse {
    success: boolean
    data: {
        stations: Station[]
        pagination: {
            currentPage: number
            totalPages: number
            totalStations: number
            hasNextPage: boolean
            hasPreviousPage: boolean
        }
    }
    message: string
}

export interface CreateStationData {
    name: string
    location: {
        latitude: number
        longitude: number
    }
    status?: 'Active' | 'Inactive'
    powerOutput: number
    connectorType: string
}

export interface UpdateStationData extends Partial<CreateStationData> { }

// Station API service
export const stationApi = {
    // Get all stations with optional filters
    getStations: async (params?: {
        page?: number
        limit?: number
        status?: string
        connectorType?: string
        search?: string
        sortBy?: string
        sortOrder?: 'asc' | 'desc'
    }): Promise<StationResponse> => {
        const queryParams = new URLSearchParams()

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString())
                }
            })
        }

        const url = `${API_BASE_URL}/stations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`

        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch stations: ${response.statusText}`)
        }

        return response.json()
    },

    // Get station by ID
    getStationById: async (id: string): Promise<{ success: boolean; data: Station; message: string }> => {
        const response = await fetch(`${API_BASE_URL}/stations/${id}`, {
            method: 'GET',
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch station: ${response.statusText}`)
        }

        return response.json()
    },

    // Create new station
    createStation: async (stationData: CreateStationData): Promise<{ success: boolean; data: Station; message: string }> => {
        const response = await fetch(`${API_BASE_URL}/stations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(stationData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to create station')
        }

        return response.json()
    },

    // Update station
    updateStation: async (id: string, stationData: UpdateStationData): Promise<{ success: boolean; data: Station; message: string }> => {
        const response = await fetch(`${API_BASE_URL}/stations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(stationData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to update station')
        }

        return response.json()
    },

    // Delete station
    deleteStation: async (id: string): Promise<{ success: boolean; data: { deletedStation: Station }; message: string }> => {
        const response = await fetch(`${API_BASE_URL}/stations/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || 'Failed to delete station')
        }

        return response.json()
    },

    // Get stations by status
    getStationsByStatus: async (status: 'Active' | 'Inactive'): Promise<{ success: boolean; data: Station[]; message: string }> => {
        const response = await fetch(`${API_BASE_URL}/stations/status/${status}`, {
            method: 'GET',
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch ${status} stations: ${response.statusText}`)
        }

        return response.json()
    },

    // Get station statistics
    getStationStats: async (): Promise<{ success: boolean; data: any; message: string }> => {
        const response = await fetch(`${API_BASE_URL}/stations/statistics`, {
            method: 'GET',
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error(`Failed to fetch station statistics: ${response.statusText}`)
        }

        return response.json()
    },
}