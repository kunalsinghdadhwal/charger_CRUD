<template>
  <div class="map-container">
    <div ref="mapRef" class="map" :style="{ height: height }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface Props {
  latitude: number
  longitude: number
  height?: string
  interactive?: boolean
  zoom?: number
}

interface Emits {
  (e: 'locationChanged', location: { latitude: number; longitude: number }): void
}

const props = withDefaults(defineProps<Props>(), {
  height: '300px',
  interactive: true,
  zoom: 10,
})

const emit = defineEmits<Emits>()

const mapRef = ref<HTMLElement>()
let map: L.Map | null = null
let marker: L.Marker | null = null

const initMap = async () => {
  await nextTick()
  
  if (!mapRef.value) return

  // Create map
  map = L.map(mapRef.value, {
    dragging: props.interactive,
    touchZoom: props.interactive,
    doubleClickZoom: props.interactive,
    scrollWheelZoom: props.interactive,
    boxZoom: props.interactive,
    keyboard: props.interactive,
  }).setView([props.latitude, props.longitude], props.zoom)

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  // Add marker
  updateMarker()

  // Add click event for interactive maps
  if (props.interactive) {
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      emit('locationChanged', { latitude: lat, longitude: lng })
    })
  }
}

const updateMarker = () => {
  if (!map) return

  // Remove existing marker
  if (marker) {
    map.removeLayer(marker)
  }

  // Add new marker
  marker = L.marker([props.latitude, props.longitude])
    .addTo(map)

  // Center map on marker
  map.setView([props.latitude, props.longitude])
}

// Watch for prop changes
watch([() => props.latitude, () => props.longitude], () => {
  updateMarker()
})

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<style scoped>
.map-container {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.map {
  width: 100%;
}

/* Override Leaflet styles for better integration */
:deep(.leaflet-container) {
  border-radius: 8px;
}

:deep(.leaflet-control-attribution) {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.8);
}
</style>
