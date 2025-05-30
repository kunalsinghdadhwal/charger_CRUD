<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="top-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <span class="brand-icon">⚡</span>
          <span class="brand-text">EV Manager</span>
        </div>
        <div class="nav-links">
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link nav-link-primary">Sign Up</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-grid"></div>
      </div>
      <div class="hero-content">
        <div class="container">
          <div class="hero-text">
            <h1 class="hero-title">
              <span class="gradient-text">EV Charger</span>
              <br />Management System
            </h1>
            <p class="hero-description">
              Streamline your electric vehicle charging infrastructure with our comprehensive
              management platform. Monitor, manage, and optimize your charging stations in
              real-time.
            </p>
            <div class="hero-actions">
              <router-link to="/register" class="btn btn-primary btn-large">
                <span class="btn-icon">⚡</span>
                Get Started
              </router-link>
              <button @click="scrollToFeatures" class="btn btn-secondary btn-large">
                <span class="btn-icon">📖</span>
                Learn More
              </button>
            </div>
          </div>
          <div class="hero-visual">
            <div class="charging-animation">
              <div class="charging-station">
                <div class="station-body"></div>
                <div class="station-screen"></div>
                <div class="charging-cable"></div>
                <div class="power-indicator" :class="{ active: isPowerActive }"></div>
              </div>
              <div class="energy-particles">
                <div
                  class="particle"
                  v-for="i in 6"
                  :key="i"
                  :style="{ animationDelay: `${i * 0.3}s` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item" v-for="(stat, index) in stats" :key="index">
            <div class="stat-icon">{{ stat.icon }}</div>
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Powerful Features</h2>
          <p class="section-description">
            Everything you need to manage your EV charging network efficiently
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="(feature, index) in features" :key="index">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Preview Section -->
    <section class="map-preview-section">
      <div class="container">
        <div class="map-preview-content">
          <div class="map-preview-text">
            <h2 class="section-title">Interactive Map View</h2>
            <p class="section-description">
              Visualize your entire charging network on an interactive map. Monitor status, track
              usage, and manage operations from a single, intuitive interface.
            </p>
            <div class="map-features">
              <div class="map-feature" v-for="(mapFeature, index) in mapFeatures" :key="index">
                <span class="map-feature-icon">{{ mapFeature.icon }}</span>
                <span class="map-feature-text">{{ mapFeature.text }}</span>
              </div>
            </div>
            <router-link to="/dashboard" class="btn btn-primary"> View Live Map </router-link>
          </div>
          <div class="map-preview-visual">
            <div class="map-mockup">
              <div class="map-header">
                <div class="map-controls">
                  <div class="control-btn"></div>
                  <div class="control-btn"></div>
                  <div class="control-btn"></div>
                </div>
              </div>
              <div class="map-content">
                <div class="map-markers">
                  <div class="marker marker-active" style="top: 30%; left: 40%"></div>
                  <div class="marker marker-maintenance" style="top: 60%; left: 70%"></div>
                  <div class="marker marker-offline" style="top: 80%; left: 20%"></div>
                  <div class="marker marker-active" style="top: 40%; left: 80%"></div>
                </div>
                <div class="map-grid"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Transform Your EV Infrastructure?</h2>
          <p class="cta-description">
            Join the future of electric vehicle charging management today.
          </p>
          <router-link to="/dashboard" class="btn btn-primary btn-large">
            <span class="btn-icon">🚀</span>
            Start Managing Now
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>EV Charger Manager</h3>
            <p>Powering the future of electric mobility</p>
          </div>
          <div class="footer-links">
            <router-link to="/dashboard">Dashboard</router-link>
            <router-link to="/settings">Settings</router-link>
            <a href="#" @click.prevent>Support</a>
            <a href="#" @click.prevent>Documentation</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; 2025 EV Charger Manager. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Reactive data
const isPowerActive = ref(false)
const featuresSection = ref<HTMLElement>()

// Stats data
const stats = [
  { icon: '⚡', number: '1,000+', label: 'Chargers Managed' },
  { icon: '🌍', number: '50+', label: 'Cities Covered' },
  { icon: '📊', number: '99.9%', label: 'Uptime' },
  { icon: '🔋', number: '24/7', label: 'Monitoring' },
]

// Features data
const features = [
  {
    icon: '📊',
    title: 'Real-time Monitoring',
    description:
      'Track charger status, usage patterns, and performance metrics in real-time with live updates.',
  },
  {
    icon: '🗺️',
    title: 'Interactive Maps',
    description:
      'Visualize your charging network on interactive maps with detailed location information and status indicators.',
  },
  {
    icon: '🔧',
    title: 'Maintenance Management',
    description:
      'Schedule maintenance, track repairs, and manage service requests efficiently to ensure optimal performance.',
  },
  {
    icon: '📈',
    title: 'Analytics & Reports',
    description:
      'Generate comprehensive reports and analytics to optimize operations and maximize revenue.',
  },
  {
    icon: '🔔',
    title: 'Smart Alerts',
    description:
      'Receive instant notifications for status changes, maintenance needs, and system anomalies.',
  },
  {
    icon: '💰',
    title: 'Revenue Tracking',
    description:
      'Monitor revenue streams, pricing strategies, and financial performance across your network.',
  },
]

// Map features data
const mapFeatures = [
  { icon: '📍', text: 'Real-time charger locations' },
  { icon: '🟢', text: 'Live status indicators' },
  { icon: '🛣️', text: 'Route planning integration' },
  { icon: '📊', text: 'Usage analytics overlay' },
]

// Methods
const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Lifecycle
onMounted(() => {
  // Animate power indicator
  setInterval(() => {
    isPowerActive.value = !isPowerActive.value
  }, 2000)
})
</script>

<style scoped>
/* Base Styles */
.landing-page {
  min-height: 100vh;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Navigation Styles */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.25rem;
  color: #1f2937;
}

.brand-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #1f2937;
  background: rgba(0, 0, 0, 0.05);
}

.nav-link-primary {
  background: #3b82f6;
  color: white;
  padding: 0.5rem 1.25rem;
}

.nav-link-primary:hover {
  background: #2563eb;
  color: white;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 70px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.03;
}

.hero-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

.hero-content {
  position: relative;
  z-index: 2;
  width: 100%;
}

.hero-content .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.gradient-text {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  color: #6b7280;
}

.hero-actions {
  display: flex;
  gap: 1rem;
}

/* Charging Animation - Simplified */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.charging-animation {
  position: relative;
  width: 280px;
  height: 280px;
}

.charging-station {
  position: relative;
  width: 100px;
  height: 160px;
  margin: 0 auto;
}

.station-body {
  width: 100%;
  height: 140px;
  background: linear-gradient(145deg, #f1f5f9, #ffffff);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  position: relative;
}

.station-screen {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 50px;
  background: #1e293b;
  border-radius: 8px;
  overflow: hidden;
}

.station-screen::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  bottom: 8px;
  background: linear-gradient(45deg, #10b981, #3b82f6);
  border-radius: 4px;
  opacity: 0.9;
}

.charging-cable {
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 32px;
  background: #64748b;
  border-radius: 8px;
}

.power-indicator {
  position: absolute;
  top: 80px;
  right: 12px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ef4444;
  transition: all 0.3s ease;
}

.power-indicator.active {
  background: #10b981;
  box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
}

.energy-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.particle {
  position: absolute;
  width: 6px;
  height: 6px;
  background: #3b82f6;
  border-radius: 50%;
  animation: particle-float 3s infinite ease-in-out;
  opacity: 0.7;
}

.particle:nth-child(1) { top: 20%; left: 60%; }
.particle:nth-child(2) { top: 40%; left: 80%; }
.particle:nth-child(3) { top: 60%; left: 70%; }
.particle:nth-child(4) { top: 30%; left: 30%; }
.particle:nth-child(5) { top: 70%; left: 40%; }
.particle:nth-child(6) { top: 50%; left: 90%; }

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-15px) scale(1.1);
    opacity: 1;
  }
}

/* Stats Section */
.stats-section {
  padding: 5rem 0;
  background: #ffffff;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 2.5rem 2rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-number {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: #f8fafc;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.feature-title {
  font-size: 1.375rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.feature-description {
  color: #6b7280;
  line-height: 1.6;
  font-size: 1rem;
}

/* Map Preview Section */
.map-preview-section {
  padding: 5rem 0;
  background: #ffffff;
}

.map-preview-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.map-features {
  margin: 2rem 0;
}

.map-feature {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #6b7280;
}

.map-feature-icon {
  font-size: 1.25rem;
}

/* Map Mockup */
.map-mockup {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.map-header {
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.map-controls {
  display: flex;
  gap: 0.5rem;
}

.control-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d5db;
}

.control-btn:nth-child(1) { background: #ef4444; }
.control-btn:nth-child(2) { background: #f59e0b; }
.control-btn:nth-child(3) { background: #10b981; }

.map-content {
  position: relative;
  height: 280px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.map-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.5;
}

.map-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.marker {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.marker-active { background: #10b981; }
.marker-maintenance { background: #f59e0b; }
.marker-offline { background: #ef4444; }

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-description {
  font-size: 1.125rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
}

/* Footer */
.footer {
  padding: 3rem 0 1.5rem;
  background: #1f2937;
  color: white;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.footer-brand h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.footer-brand p {
  opacity: 0.7;
  font-size: 0.95rem;
}

.footer-links {
  display: flex;
  gap: 2rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  font-size: 0.95rem;
}

.footer-links a:hover {
  opacity: 1;
}

.footer-bottom {
  border-top: 1px solid #374151;
  padding-top: 1rem;
  text-align: center;
  opacity: 0.6;
  font-size: 0.875rem;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: white;
  color: #3b82f6;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f8fafc;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .container {
    padding: 0 1rem;
  }

  .hero-content .container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .map-preview-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .section-title {
    font-size: 2rem;
  }

  .cta-title {
    font-size: 1.875rem;
  }
}

@media (max-width: 480px) {
  .nav-links {
    gap: 0.5rem;
  }
  
  .nav-link {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 2rem;
  }

  .charging-animation {
    width: 200px;
    height: 200px;
  }

  .charging-station {
    width: 80px;
    height: 120px;
  }
}
</style>
