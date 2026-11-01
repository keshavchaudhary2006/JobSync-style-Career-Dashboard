# JobSync - Career Dashboard 🚀

A modern full-stack career dashboard and job application pipeline tracker built with **Node.js, Express, MongoDB (Mongoose)** on the backend and **Next.js (App Router), React, and Tailwind CSS** on the frontend.

---

## 🌟 Key Features

- **5-Stage Kanban Application Funnel**: Drag, sort, and transition jobs through stages (`Wishlist` → `Applied` → `Interview` → `Offer` → `Rejected`).
- **Interactive Metric Cards**: Real-time counters showing total tracked applications, active interview stages, pending offers, and wishlist items.
- **RESTful CRUD Operations**: Full Create, Read, Update, and Delete endpoints backed by MongoDB.
- **Optimistic UI Updates**: Instant client transitions with automated server synchronization and error rollback.
- **Responsive Layout**: Collapsible sidebar drawer on mobile with glassmorphic top navigation bar on desktop.
- **Dual View Modes**: Switch seamlessly between interactive Kanban Board columns and structured Table List views.
- **Global Search**: Instant keyword filtering across companies, roles, and status tags.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose ODM**
- **CORS** & **Dotenv**

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript**

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/keshavchaudhary2006/JobSync-style-Career-Dashboard.git
cd JobSync-style-Career-Dashboard
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Configure environment variables
cp .env.example .env

# Start backend server (runs on http://localhost:5000)
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install

# Configure client environment variables
cp .env.example .env.local

# Start Next.js development server (runs on http://localhost:3000)
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/jobs` | Retrieve all job applications (supports `?status=` and `?search=`) |
| `GET` | `/api/jobs/:id` | Get details for a specific application |
| `POST` | `/api/jobs` | Create a new job application |
| `PUT` | `/api/jobs/:id` | Update an existing application's status, notes, or details |
| `DELETE` | `/api/jobs/:id` | Delete a job application |
| `GET` | `/api/health` | Service and MongoDB connection health check |

---

## 📄 License
ISC
