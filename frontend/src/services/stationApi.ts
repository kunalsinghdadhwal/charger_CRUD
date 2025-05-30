import { useAuth } from '@/composables/useAuth'

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

export interface CreateStationRequest {
  name: string
  location: {
    latitude: number
    longitude: number
  }
  status?: 'Active' | 'Inactive'
  powerOutput: number
  connectorType: string
}

export interface UpdateStationRequest extends Partial<CreateStationRequest> {}

export interface StationFilters {
  page?: number
  limit?: number
  status?: 'Active' | 'Inactive'
  connectorType?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  search?: string
}

export interface StationResponse {
  stations: Station[]
  pagination: {
    currentPage: number
    totalPages: number
    totalStations: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
}

export interface StationStats {
  overview: {
    totalStations: number
    activeStations: number
    inactiveStations: number
    averagePowerOutput: number
    maxPowerOutput: number
    minPowerOutput: number
  }
  connectorTypeDistribution: Array<{
    _id: string
    count: number
  }>
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1'

class StationAPIService {
  private baseURL = `${API_BASE_URL}/stations`

  async getStations(filters?: StationFilters): Promise<StationResponse> {
    const { authenticatedRequest } = useAuth()
    
    const params = new URLSearchParams()
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.status) params.append('status', filters.status)
    if (filters?.connectorType) params.append('connectorType', filters.connectorType)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
    if (filters?.search) params.append('search', filters.search)

    const url = `${this.baseURL}${params.toString() ? `?${params.toString()}` : ''}`
    
    const response = await authenticatedRequest(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch stations: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.data
  }

  async getStationById(id: string): Promise<Station> {
    const { authenticatedRequest } = useAuth()
    
    const response = await authenticatedRequest(`${this.baseURL}/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch station: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.data
  }

  async createStation(station: CreateStationRequest): Promise<Station> {
    const { authenticatedRequest } = useAuth()
    
    const response = await authenticatedRequest(`${this.baseURL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(station),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to create station: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.data
  }

  async updateStation(id: string, updates: UpdateStationRequest): Promise<Station> {
    const { authenticatedRequest } = useAuth()
    
    const response = await authenticatedRequest(`${this.baseURL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to update station: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.data
  }

  async deleteStation(id: string): Promise<void> {
    const { authenticatedRequest } = useAuth()
    
    const response = await authenticatedRequest(`${this.baseURL}/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || `Failed to delete station: ${response.statusText}`)
    }
  }

  async getStationsByStatus(status: 'Active' | 'Inactive'): Promise<Station[]> {
    const { authenticatedRequest } = useAuth()
    
    const response = await authenticatedRequest(`${this.baseURL}/status/${status}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch stations by status: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.data
  }

  async getStationStats(): Promise<StationStats> {
    const { authenticatedRequest } = useAuth()
    
    const response = await authenticatedRequest(`${this.baseURL}/statistics`)
    if (!response.ok) {
      throw new Error(`Failed to fetch station stats: ${response.statusText}`)
    }
    
    const result = await response.json()
    return result.data
  }
}

export const stationAPI = new StationAPIService()
