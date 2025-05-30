<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">EV Station Management</h1>
        <div class="header-actions">
          <button @click="handleLogout" class="btn btn-secondary">
            Logout
          </button>
          <router-link to="/settings" class="btn btn-secondary">
            Settings
          </router-link>
          <button @click="showAddModal = true" class="btn btn-primary">
            Add Station
          </button>
        </div>
      </div>
    </header>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading stations...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="loadStations" class="btn btn-primary">Retry</button>
    </div>

    <!-- Main Content -->
    <div v-if="!isLoading && !error">
      <!-- Stats Overview -->
      <section class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-content">
              <h3>Total Stations</h3>
              <p class="stat-number">{{ stats.totalStations }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <h3>Active</h3>
              <p class="stat-number">{{ stats.activeStations }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-content">
              <h3>Inactive</h3>
              <p class="stat-number">{{ stats.inactiveStations }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Controls Bar -->
        <div class="controls-bar">
          <div class="search-container">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search stations..."
              class="search-input"
            />
          </div>
          <div class="filter-container">
            <select v-model="statusFilter" class="filter-select">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select v-model="connectorTypeFilter" class="filter-select">
              <option value="">All Connectors</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
              <option value="Type 2">Type 2</option>
              <option value="Tesla">Tesla</option>
            </select>
          </div>
          <button @click="loadStations" class="btn btn-secondary">
            Refresh
          </button>
        </div>

        <!-- Content Area -->
        <div class="content-area">
          <!-- List View -->
          <div class="list-view">
            <div v-if="filteredStations.length === 0" class="empty-state">
              <p>No stations found matching your criteria.</p>
            </div>
            <div v-else class="station-grid">
              <div
                v-for="station in filteredStations"
                :key="station._id"
                class="station-card"
                :class="`status-${station.status.toLowerCase()}`"
              >
                <div class="card-header">
                  <h3 class="station-name">{{ station.name }}</h3>
                  <span class="status-badge" :class="`status-${station.status.toLowerCase()}`">
                    {{ station.status }}
                  </span>
                </div>
                <div class="card-body">
                  <div class="card-content">
                    <div class="station-info">
                      <p><strong>Power Output:</strong> {{ station.powerOutput }}kW</p>
                      <p><strong>Connector:</strong> {{ station.connectorType }}</p>
                      <p><strong>Location:</strong> {{ station.location.latitude }}, {{ station.location.longitude }}</p>
                      <p><strong>Created:</strong> {{ formatDate(station.createdAt) }}</p>
                    </div>
                    
                    <!-- Default Map Section -->
                    <div class="station-map-container">
                      <MapComponent
                        :latitude="station.location.latitude"
                        :longitude="station.location.longitude"
                        :interactive="false"
                        height="180px"
                        :zoom="10"
                      />
                    </div>
                  </div>
                </div>
                <div class="card-actions">
                  <button @click="editStation(station)" class="btn btn-small btn-secondary">
                    Edit
                  </button>
                  <button @click="deleteStation(station._id)" class="btn btn-small btn-danger">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? 'Add New Station' : 'Edit Station' }}</h2>
          <button @click="closeModals" class="modal-close">×</button>
        </div>
        <form @submit.prevent="saveStation" class="modal-body">
          <div class="form-group">
            <label>Station Name</label>
            <input v-model="stationForm.name" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Latitude</label>
              <input 
                v-model.number="stationForm.location.latitude" 
                type="number" 
                step="0.000001" 
                min="-90" 
                max="90"
                placeholder="e.g., 40.712776"
                required 
                @input="onCoordinateChange"
              />
            </div>
            <div class="form-group">
              <label>Longitude</label>
              <input 
                v-model.number="stationForm.location.longitude" 
                type="number" 
                step="0.000001" 
                min="-180" 
                max="180"
                placeholder="e.g., -74.005974"
                required 
                @input="onCoordinateChange"
              />
            </div>
          </div>
          
          <!-- Interactive Map for Location Selection -->
          <div class="form-group">
            <label>Location (Click on map to select)</label>
            <MapComponent
              :latitude="stationForm.location.latitude || 40.712776"
              :longitude="stationForm.location.longitude || -74.005974"
              :interactive="true"
              height="300px"
              :zoom="10"
              @locationChanged="onMapLocationChanged"
            />
            <p class="map-help-text">Click on the map to set the station location, or enter coordinates manually above.</p>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Power Output (kW)</label>
              <input v-model="stationForm.powerOutput" type="number" required />
            </div>
            <div class="form-group">
              <label>Connector Type</label>
              <select v-model="stationForm.connectorType" required>
                <option value="">Select connector type</option>
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="Type 2">Type 2</option>
                <option value="Tesla">Tesla</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="stationForm.status" required>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              {{ showAddModal ? 'Add Station' : 'Update Station' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { stationApi, type Station, type CreateStationData } from '@/services/stationApi'
import MapComponent from '@/components/MapComponent.vue'

const router = useRouter()
const { logout } = useAuth()

// Types
interface Stats {
  totalStations: number
  activeStations: number
  inactiveStations: number
}

// Reactive data
const stations = ref<Station[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const connectorTypeFilter = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingStation = ref<Station | null>(null)
const isLoading = ref(false)
const error = ref('')

const stationForm = ref({
  _id: '',
  name: '',
  location: {
    latitude: 0.0,
    longitude: 0.0,
  },
  status: 'Active' as 'Active' | 'Inactive',
  powerOutput: 0,
  connectorType: '',
})

// Computed properties
const stats = computed<Stats>(() => {
  const total = stations.value.length
  const active = stations.value.filter((s) => s.status === 'Active').length
  const inactive = stations.value.filter((s) => s.status === 'Inactive').length

  return {
    totalStations: total,
    activeStations: active,
    inactiveStations: inactive,
  }
})

const filteredStations = computed(() => {
  let filtered = stations.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (station) =>
        station.name.toLowerCase().includes(query) ||
        station.connectorType.toLowerCase().includes(query),
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((station) => station.status === statusFilter.value)
  }

  if (connectorTypeFilter.value) {
    filtered = filtered.filter((station) => station.connectorType === connectorTypeFilter.value)
  }

  return filtered
})

// Methods
const loadStations = async () => {
  isLoading.value = true
  error.value = ''
  try {
    const response = await stationApi.getStations()
    stations.value = response.data.stations
  } catch (err) {
    console.error('Failed to load stations:', err)
    error.value = 'Failed to load stations. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const editStation = (station: Station) => {
  editingStation.value = station
  stationForm.value = {
    _id: station._id,
    name: station.name,
    location: {
      latitude: station.location.latitude,
      longitude: station.location.longitude,
    },
    status: station.status,
    powerOutput: station.powerOutput,
    connectorType: station.connectorType,
  }
  showEditModal.value = true
}

const deleteStation = async (id: string) => {
  if (confirm('Are you sure you want to delete this station?')) {
    isLoading.value = true
    try {
      await stationApi.deleteStation(id)
      stations.value = stations.value.filter((s) => s._id !== id)
    } catch (err) {
      console.error('Failed to delete station:', err)
      error.value = 'Failed to delete station. Please try again.'
    } finally {
      isLoading.value = false
    }
  }
}

const saveStation = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    if (showAddModal.value) {
      // Create new station
      const stationData: CreateStationData = {
        name: stationForm.value.name,
        location: stationForm.value.location,
        status: stationForm.value.status,
        powerOutput: stationForm.value.powerOutput,
        connectorType: stationForm.value.connectorType,
      }
      
      const response = await stationApi.createStation(stationData)
      stations.value.push(response.data)
    } else {
      // Update existing station
      const response = await stationApi.updateStation(stationForm.value._id, {
        name: stationForm.value.name,
        location: stationForm.value.location,
        status: stationForm.value.status,
        powerOutput: stationForm.value.powerOutput,
        connectorType: stationForm.value.connectorType,
      })
      
      const index = stations.value.findIndex((s) => s._id === stationForm.value._id)
      if (index !== -1) {
        stations.value[index] = response.data
      }
    }
    closeModals()
  } catch (err) {
    console.error('Failed to save station:', err)
    error.value = 'Failed to save station. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingStation.value = null
  stationForm.value = {
    _id: '',
    name: '',
    location: {
      latitude: 0,
      longitude: 0,
    },
    status: 'Active',
    powerOutput: 0,
    connectorType: '',
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const handleLogout = async () => {
  const result = await logout()
  if (result.success) {
    router.push('/login')
  }
}

// Map-related methods
const onMapLocationChanged = (location: { latitude: number; longitude: number }) => {
  stationForm.value.location.latitude = parseFloat(location.latitude.toFixed(6))
  stationForm.value.location.longitude = parseFloat(location.longitude.toFixed(6))
}

const onCoordinateChange = () => {
  // This method is called when coordinates are manually entered
  // The reactive binding will automatically update the map
}

// Lifecycle
onMounted(() => {
  loadStations()
})
</script>

<style scoped>
* {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.dashboard-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 1rem;
}

/* Loading and Error States */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.error-message {
  color: #ef4444;
  margin-bottom: 1rem;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

/* Header Styles */
.dashboard-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
}

.dashboard-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

/* Stats Section */
.stats-section {
  margin-bottom: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-number {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

/* Main Content */
.main-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.controls-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-container {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
}

.filter-container {
  display: flex;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  background: white;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 0.25rem;
}

.view-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn.active {
  background: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Content Area */
.content-area {
  padding: 2rem;
}

/* List View */
.station-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 1.5rem;
}

.station-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.station-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.station-card.status-active {
  border-left: 4px solid #10b981;
}

.station-card.status-inactive {
  border-left: 4px solid #ef4444;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.station-name {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.card-body {
  padding: 1.5rem;
}

.card-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.station-info {
  flex: 1;
  min-width: 0;
}

.station-info p {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #4b5563;
}

.station-map-container {
  flex: 0 0 200px;
  border-radius: 8px;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* Map Styles */
.map-help-text {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6b7280;
  font-style: italic;
}

/* Map View */
.map-view {
  height: 500px;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 0.5rem;
  }

  .header-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .controls-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-container {
    max-width: none;
  }

  .station-grid {
    grid-template-columns: 1fr;
  }

  .card-content {
    flex-direction: column;
    gap: 1rem;
  }

  .station-map-container {
    flex: none;
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
