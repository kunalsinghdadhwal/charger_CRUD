<template>
  <div class="dashboard-container">
    <!-- Header Section -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="dashboard-title">EV Charger Management</h1>
        <div class="header-actions">
          <button @click="refreshData" class="btn btn-secondary" :disabled="isLoading">
            {{ isLoading ? 'Loading...' : 'Refresh' }}
          </button>
          <button @click="showAddModal = true" class="btn btn-primary">
            Add Charger
          </button>
        </div>
      </div>
    </header>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="loadChargers" class="btn btn-secondary">Try Again</button>
    </div>

    <!-- Stats Overview -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-content">
            <h3>Total Chargers</h3>
            <p class="stat-number">{{ stats.totalChargers }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <h3>Active</h3>
            <p class="stat-number">{{ stats.activeChargers }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <h3>Maintenance</h3>
            <p class="stat-number">{{ stats.maintenanceChargers }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-content">
            <h3>Offline</h3>
            <p class="stat-number">{{ stats.offlineChargers }}</p>
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
            placeholder="Search chargers..."
            class="search-input"
          />
        </div>
        <div class="filter-container">
          <select v-model="statusFilter" class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="maintenance">Maintenance</option>
            <option value="offline">Offline</option>
          </select>
          <select v-model="typeFilter" class="filter-select">
            <option value="">All Types</option>
            <option value="fast">Fast Charging</option>
            <option value="standard">Standard</option>
            <option value="rapid">Rapid</option>
          </select>
        </div>
        <div class="view-toggle">
          <button
            @click="currentView = 'list'"
            :class="{ active: currentView === 'list' }"
            class="view-btn"
          >
            📋 List
          </button>
          <button
            @click="currentView = 'map'"
            :class="{ active: currentView === 'map' }"
            class="view-btn"
          >
            🗺️ Map
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- List View -->
        <div v-if="currentView === 'list'" class="list-view">
          <div class="charger-grid">
            <div
              v-for="charger in filteredChargers"
              :key="charger.id"
              class="charger-card"
              :class="`status-${charger.status}`"
            >
              <div class="card-header">
                <h3 class="charger-name">{{ charger.name }}</h3>
                <span class="status-badge" :class="`status-${charger.status}`">
                  {{ charger.status }}
                </span>
              </div>
              <div class="card-body">
                <div class="charger-info">
                  <p><strong>Location:</strong> {{ charger.location }}</p>
                  <p><strong>Type:</strong> {{ charger.type }}</p>
                  <p><strong>Power:</strong> {{ charger.power }}kW</p>
                  <p><strong>Connector:</strong> {{ charger.connectorType }}</p>
                  <p><strong>Price:</strong> ${{ charger.pricePerKwh }}/kWh</p>
                </div>
              </div>
              <div class="card-actions">
                <button @click="editCharger(charger)" class="btn btn-small btn-secondary">
                  Edit
                </button>
                <button @click="deleteCharger(charger.id)" class="btn btn-small btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Map View -->
        <div v-if="currentView === 'map'" class="map-view">
          <MapView
            :chargers="filteredChargers"
            :selected-charger="selectedCharger"
            map-height="500px"
            @charger-selected="onChargerSelected"
            @edit-charger="editCharger"
            @delete-charger="deleteCharger"
          />
        </div>
      </div>
    </main>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showAddModal ? 'Add New Charger' : 'Edit Charger' }}</h2>
          <button @click="closeModals" class="modal-close">✕</button>
        </div>
        <form @submit.prevent="saveCharger" class="modal-body">
          <div class="form-group">
            <label>Charger Name</label>
            <input v-model="chargerForm.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Location</label>
            <input v-model="chargerForm.location" type="text" required />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Type</label>
              <select v-model="chargerForm.type" required>
                <option value="fast">Fast Charging</option>
                <option value="standard">Standard</option>
                <option value="rapid">Rapid</option>
              </select>
            </div>
            <div class="form-group">
              <label>Power (kW)</label>
              <input v-model="chargerForm.power" type="number" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Connector Type</label>
              <select v-model="chargerForm.connectorType" required>
                <option value="CCS">CCS</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="Type 2">Type 2</option>
                <option value="Tesla">Tesla</option>
              </select>
            </div>
            <div class="form-group">
              <label>Price per kWh ($)</label>
              <input v-model="chargerForm.pricePerKwh" type="number" step="0.01" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Latitude</label>
              <input v-model="chargerForm.latitude" type="number" step="any" required />
            </div>
            <div class="form-group">
              <label>Longitude</label>
              <input v-model="chargerForm.longitude" type="number" step="any" required />
            </div>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="chargerForm.status" required>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModals" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">
              {{ showAddModal ? 'Add Charger' : 'Update Charger' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { stationAPI, type Station, type CreateStationRequest, type UpdateStationRequest } from '@/services/stationApi'
import { useAuth } from '@/composables/useAuth'
import MapView from '@/components/MapView.vue'

// Auth composable
const { user } = useAuth()

// Types - Map Station to EVCharger for UI compatibility
interface EVCharger {
  id: string
  name: string
  location: string
  type: 'fast' | 'standard' | 'rapid'
  power: number
  connectorType: string
  pricePerKwh: number
  status: 'active' | 'maintenance' | 'offline'
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}

interface Stats {
  totalChargers: number
  activeChargers: number
  maintenanceChargers: number
  offlineChargers: number
}

// Convert Station to EVCharger for UI
const mapStationToCharger = (station: Station): EVCharger => ({
  id: station._id,
  name: station.name,
  location: `${station.location.latitude}, ${station.location.longitude}`,
  type: station.powerOutput >= 150 ? 'fast' : station.powerOutput >= 50 ? 'standard' : 'rapid',
  power: station.powerOutput,
  connectorType: station.connectorType,
  pricePerKwh: 0.35, // Default value as it's not in backend model
  status: station.status === 'Active' ? 'active' : 'offline',
  latitude: station.location.latitude,
  longitude: station.location.longitude,
  createdAt: station.createdAt,
  updatedAt: station.updatedAt,
})

// Convert EVCharger to Station for API
const mapChargerToStation = (charger: any): CreateStationRequest | UpdateStationRequest => ({
  name: charger.name,
  location: {
    latitude: Number(charger.latitude),
    longitude: Number(charger.longitude),
  },
  powerOutput: Number(charger.power),
  connectorType: charger.connectorType,
  status: charger.status === 'active' ? 'Active' : 'Inactive',
})

// Reactive data
const chargers = ref<EVCharger[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const currentView = ref<'list' | 'map'>('list')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingCharger = ref<EVCharger | null>(null)
const selectedCharger = ref<EVCharger | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const chargerForm = ref({
  id: '',
  name: '',
  location: '',
  type: 'fast' as 'fast' | 'standard' | 'rapid',
  power: 0,
  connectorType: 'CCS',
  pricePerKwh: 0,
  status: 'active' as 'active' | 'maintenance' | 'offline',
  latitude: 0,
  longitude: 0,
})

// Computed properties
const stats = computed<Stats>(() => {
  const total = chargers.value.length
  const active = chargers.value.filter((c) => c.status === 'active').length
  const maintenance = chargers.value.filter((c) => c.status === 'maintenance').length
  const offline = chargers.value.filter((c) => c.status === 'offline').length

  return {
    totalChargers: total,
    activeChargers: active,
    maintenanceChargers: maintenance,
    offlineChargers: offline,
  }
})

const filteredChargers = computed(() => {
  let filtered = chargers.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (charger) =>
        charger.name.toLowerCase().includes(query) ||
        charger.location.toLowerCase().includes(query),
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((charger) => charger.status === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter((charger) => charger.type === typeFilter.value)
  }

  return filtered
})

// Methods
const loadChargers = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const response = await stationAPI.getStations({ limit: 100 })
    chargers.value = response.stations.map(mapStationToCharger)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load chargers'
    console.error('Failed to load chargers:', err)
  } finally {
    isLoading.value = false
  }
}

const refreshData = () => {
  loadChargers()
}

const editCharger = (charger: EVCharger) => {
  editingCharger.value = charger
  chargerForm.value = { ...charger }
  showEditModal.value = true
}

const deleteCharger = async (id: string) => {
  if (confirm('Are you sure you want to delete this charger?')) {
    try {
      await stationAPI.deleteStation(id)
      chargers.value = chargers.value.filter((c) => c.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete charger'
      console.error('Failed to delete charger:', err)
    }
  }
}

const saveCharger = async () => {
  try {
    if (showAddModal.value) {
      const stationData = mapChargerToStation(chargerForm.value)
      const newStation = await stationAPI.createStation(stationData as CreateStationRequest)
      const newCharger = mapStationToCharger(newStation)
      chargers.value.push(newCharger)
    } else {
      const stationData = mapChargerToStation(chargerForm.value)
      const updatedStation = await stationAPI.updateStation(chargerForm.value.id, stationData)
      const updatedCharger = mapStationToCharger(updatedStation)
      
      const index = chargers.value.findIndex((c) => c.id === chargerForm.value.id)
      if (index !== -1) {
        chargers.value[index] = updatedCharger
      }
    }
    closeModals()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to save charger'
    console.error('Failed to save charger:', err)
  }
}

const closeModals = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingCharger.value = null
  chargerForm.value = {
    id: '',
    name: '',
    location: '',
    type: 'fast',
    power: 0,
    connectorType: 'CCS',
    pricePerKwh: 0,
    status: 'active',
    latitude: 0,
    longitude: 0,
  }
}

const onChargerSelected = (charger: EVCharger) => {
  selectedCharger.value = charger
}

// Lifecycle
onMounted(() => {
  loadChargers()
})
</script>

<style scoped>
/* Import clean, modern fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.dashboard-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Error Message */
.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.error-message p {
  margin: 0;
  color: #dc2626;
  font-weight: 500;
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
  font-size: 1.75rem;
  font-weight: 600;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #3b82f6;
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
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
.charger-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.charger-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.charger-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.charger-card.status-active {
  border-left: 4px solid #10b981;
}

.charger-card.status-maintenance {
  border-left: 4px solid #f59e0b;
}

.charger-card.status-offline {
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

.charger-name {
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

.status-badge.status-maintenance {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.status-offline {
  background: #fee2e2;
  color: #991b1b;
}

.card-body {
  padding: 1.5rem;
}

.charger-info p {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  color: #4b5563;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
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
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-family: inherit;
}

.btn:disabled {
  opacity: 0.6;
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
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-small {
  padding: 0.375rem 0.75rem;
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

  .charger-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
