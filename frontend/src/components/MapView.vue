<template>
  <div class="map-component">
    <LMap
      ref="map"
      v-model:zoom="zoom"
      v-model:center="center"
      :use-global-leaflet="false"
      :style="{ height: mapHeight }"
      class="leaflet-map"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      <!-- Charger Markers -->
      <LMarker
        v-for="charger in chargers"
        :key="charger.id"
        :lat-lng="[charger.latitude, charger.longitude]"
        @click="selectCharger(charger)"
      >
        <LIcon
          :icon-url="getMarkerIcon(charger.status)"
          :icon-size="[32, 32]"
          :icon-anchor="[16, 32]"
        />
        <LPopup>
          <div class="charger-popup">
            <h3>{{ charger.name }}</h3>
            <p>
              <strong>Status:</strong>
              <span :class="`status-${charger.status}`">{{ charger.status }}</span>
            </p>
            <p><strong>Type:</strong> {{ charger.type }}</p>
            <p><strong>Power:</strong> {{ charger.power }}kW</p>
            <p><strong>Price:</strong> ${{ charger.pricePerKwh }}/kWh</p>
            <div class="popup-actions">
              <button @click="editCharger(charger)" class="btn btn-small btn-primary">Edit</button>
              <button @click="deleteCharger(charger.id)" class="btn btn-small btn-danger">
                Delete
              </button>
            </div>
          </div>
        </LPopup>
      </LMarker>

      <!-- Selected Charger Highlight -->
      <LCircle
        v-if="selectedCharger"
        :lat-lng="[selectedCharger.latitude, selectedCharger.longitude]"
        :radius="100"
        :color="'#3b82f6'"
        :fill-color="'#3b82f6'"
        :fill-opacity="0.2"
      />
    </LMap>

    <!-- Map Controls -->
    <div class="map-controls">
      <button @click="centerOnChargers" class="map-control-btn" title="Fit all chargers">🎯</button>
      <button @click="getCurrentLocation" class="map-control-btn" title="My location">📍</button>
      <button @click="toggleSatellite" class="map-control-btn" title="Toggle satellite view">
        🛰️
      </button>
    </div>

    <!-- Map Legend -->
    <div class="map-legend">
      <h4>Legend</h4>
      <div class="legend-item">
        <img :src="getMarkerIcon('active')" alt="Active" />
        <span>Active</span>
      </div>
      <div class="legend-item">
        <img :src="getMarkerIcon('maintenance')" alt="Maintenance" />
        <span>Maintenance</span>
      </div>
      <div class="legend-item">
        <img :src="getMarkerIcon('offline')" alt="Offline" />
        <span>Offline</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { LMap, LTileLayer, LMarker, LIcon, LPopup, LCircle } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

// Props and Emits
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

interface Props {
  chargers: EVCharger[]
  selectedCharger?: EVCharger | null
  mapHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  mapHeight: '500px',
  selectedCharger: null,
})

const emit = defineEmits<{
  chargerSelected: [charger: EVCharger]
  editCharger: [charger: EVCharger]
  deleteCharger: [id: string]
}>()

// Reactive data
const map = ref()
const zoom = ref(12)
const center = ref<[number, number]>([40.7128, -74.006]) // Default to NYC
const useSatellite = ref(false)

// Computed
const tileLayerUrl = computed(() => {
  return useSatellite.value
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
})

// Methods
const getMarkerIcon = (status: string) => {
  const iconMap = {
    active:
      'data:image/svg+xml;base64,' +
      btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#10b981" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">⚡</text>
      </svg>
    `),
    maintenance:
      'data:image/svg+xml;base64,' +
      btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#f59e0b" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">🔧</text>
      </svg>
    `),
    offline:
      'data:image/svg+xml;base64,' +
      btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="12" fill="#ef4444" stroke="white" stroke-width="2"/>
        <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">❌</text>
      </svg>
    `),
  }
  return iconMap[status as keyof typeof iconMap] || iconMap.offline
}

const selectCharger = (charger: EVCharger) => {
  emit('chargerSelected', charger)
}

const editCharger = (charger: EVCharger) => {
  emit('editCharger', charger)
}

const deleteCharger = (id: string) => {
  emit('deleteCharger', id)
}

const centerOnChargers = () => {
  if (props.chargers.length === 0) return

  const latitudes = props.chargers.map((c) => c.latitude)
  const longitudes = props.chargers.map((c) => c.longitude)

  const minLat = Math.min(...latitudes)
  const maxLat = Math.max(...latitudes)
  const minLng = Math.min(...longitudes)
  const maxLng = Math.max(...longitudes)

  const bounds = [
    [minLat, minLng],
    [maxLat, maxLng],
  ]

  if (map.value && map.value.leafletObject) {
    map.value.leafletObject.fitBounds(bounds, { padding: [20, 20] })
  }
}

const getCurrentLocation = () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        center.value = [position.coords.latitude, position.coords.longitude]
        zoom.value = 15
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to get your location. Please enable location services.')
      },
    )
  } else {
    alert('Geolocation is not supported by this browser.')
  }
}

const toggleSatellite = () => {
  useSatellite.value = !useSatellite.value
}

// Watchers
watch(
  () => props.selectedCharger,
  (newCharger) => {
    if (newCharger) {
      center.value = [newCharger.latitude, newCharger.longitude]
      zoom.value = 16
    }
  },
)

// Lifecycle
onMounted(() => {
  if (props.chargers.length > 0) {
    // Center on first charger or fit all chargers
    setTimeout(() => {
      centerOnChargers()
    }, 100)
  }
})
</script>

<style scoped>
.map-component {
  position: relative;
  width: 100%;
  height: 100%;
}

.leaflet-map {
  border-radius: 8px;
  overflow: hidden;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.map-control-btn {
  width: 40px;
  height: 40px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.map-control-btn:hover {
  background: #f3f4f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.map-legend {
  position: absolute;
  bottom: 10px;
  left: 10px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
}

.map-legend h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.legend-item img {
  width: 16px;
  height: 16px;
}

/* Popup Styles */
.charger-popup {
  min-width: 200px;
}

.charger-popup h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.charger-popup p {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: #4b5563;
}

.status-active {
  color: #059669;
  font-weight: 500;
}

.status-maintenance {
  color: #d97706;
  font-weight: 500;
}

.status-offline {
  color: #dc2626;
  font-weight: 500;
}

.popup-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-small {
  font-size: 0.625rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .map-controls {
    top: 5px;
    right: 5px;
  }

  .map-legend {
    bottom: 5px;
    left: 5px;
    padding: 0.75rem;
  }

  .map-control-btn {
    width: 36px;
    height: 36px;
  }
}
</style>
