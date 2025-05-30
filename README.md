# EV Station Management System

A comprehensive full-stack web application for managing Electric Vehicle (EV) charging stations with interactive map integration, built with Vue.js frontend and Node.js backend.

## 🌐 Deployment

### Live Application
- **Frontend**: [https://charger-crud.netlify.app](https://charger-crud.netlify.app)
- **Backend API**: [https://charger-crud.vercel.app](https://charger-crud.vercel.app)

## 🧪 API Testing

Use the included Postman collection for API testing:
- Import `Charger CRUD.postman_collection.json`
- Import `Charger Crud Environment.postman_environment.json`
- Set up environment variables for your deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB database
- pnpm package manager

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```bash
   cp .env.example .env
   ```

4. **Enter the Required Variables**
   Below are Command to generate `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`

> [!IMPORTANT]
> 
> Will not work for windows
>

  Just Paste the below command for `ACCESS_TOKEN_SECRET`
  ```bash
ACCESS_SECRET="EVOLTSOFT+$(openssl rand -base64 50 | tr -d '\n' | tr -d '=')+EVOLTSOFT" && (grep -q "^ACC
ESS_TOKEN_SECRET=" .env && sed -i "s|^ACCESS_TOKEN_SECRET=.*|ACCESS_TOKEN_SECRET=$ACCESS_SECRET|" .env || echo "ACCESS_TOKEN_SECRET=$ACCESS_SECR
ET" >> .env)
```
and this for `REFRESH_TOKEN_SECRET`
```bash
 REFRESH_SECRET="EVOLTSOFT+$(openssl rand -base64 50 | tr -d '\n' | tr -d '=')+EVOLTSOFT" && (grep -q "^REFRESH_TOKEN_SECRET=" .env && sed -i "s|^REFRESH_TOKEN_SECRET=.*|REFRESH_TOKEN_SECRET=$REFRESH_SECRET|" .env || echo "REFRESH_TOKEN_SECRET=$REFRESH_SECRET" >> .env)
```


4. **Start development server**
   ```bash
   pnpm dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Access the application**
   Open [http://localhost:5173](http://localhost:5173) in your browser



## 📡 API Endpoints

### Authentication Endpoints
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token
- `GET /api/v1/users/current-user` - Get current user
- `POST /api/v1/users/change-password` - Change password

### Station Management Endpoints
- `GET /api/v1/stations` - Get all stations with pagination
- `POST /api/v1/stations` - Create new station
- `GET /api/v1/stations/:id` - Get station by ID
- `PUT /api/v1/stations/:id` - Update station
- `DELETE /api/v1/stations/:id` - Delete station
- `GET /api/v1/stations/status/:status` - Get stations by status
- `GET /api/v1/stations/statistics` - Get station statistics

### Health Check
- `GET /api/v1/healthcheck` - Server health status


## 🛠️ Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vue Router** - Client-side routing
- **Leaflet.js** - Interactive maps
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### Deployment
- **Frontend**: Netlify
- **Backend**: Vercel
- **Database**: MongoDB Atlas

## 📁 Project Structure

```
charger_CRUD/
├── backend/                    # Node.js backend application
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   │   ├── station.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── healthCheck.controller.js
│   │   ├── models/             # Database models
│   │   │   ├── station.model.js
│   │   │   └── user.model.js
│   │   ├── routes/             # API routes
│   │   │   ├── station.routes.js
│   │   │   ├── user.routes.js
│   │   │   └── healthCheck.routes.js
│   │   ├── middlewares/        # Custom middlewares
│   │   │   └── auth.middleware.js
│   │   ├── utils/              # Utility functions
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   └── asyncHandler.js
│   │   ├── db/                 # Database connection
│   │   │   └── index.js
│   │   ├── app.js              # Express app configuration
│   │   └── index.js            # Server entry point
│   ├── package.json
│   └── vercel.json             # Vercel deployment config
│
├── frontend/                   # Vue.js frontend application
│   ├── src/
│   │   ├── components/         # Vue components
│   │   │   └── MapComponent.vue
│   │   ├── views/              # Page components
│   │   │   ├── DashboardView.vue
│   │   │   ├── LoginView.vue
│   │   │   ├── RegisterView.vue
│   │   │   └── SettingsView.vue
│   │   ├── services/           # API services
│   │   │   └── stationApi.ts
│   │   ├── composables/        # Vue composables
│   │   │   └── useAuth.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── auth.ts
│   │   ├── router/             # Vue Router configuration
│   │   │   └── index.ts
│   │   ├── assets/             # Static assets
│   │   ├── App.vue             # Root component
│   │   └── main.ts             # Application entry point
│   ├── package.json
│   └── vite.config.ts          # Vite configuration
│
├── Charger CRUD.postman_collection.json  # API testing collection
└── Charger Crud Environment.postman_environment.json
```

## 💾 Database Schema

### Station Model
```javascript
{
  name: String,           // Station name
  location: {
    latitude: Number,     // GPS latitude
    longitude: Number     // GPS longitude
  },
  status: String,         // "Active" | "Inactive"
  powerOutput: Number,    // Power output in kW
  connectorType: String,  // Connector type (CCS, CHAdeMO, Type 2, Tesla)
  createdAt: Date,
  updatedAt: Date
}
```

### User Model
```javascript
{
  username: String,
  email: String,
  fullName: String,
  password: String,       // Hashed with bcrypt
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```
