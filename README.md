# Transaction API Dashboard


## Project Overview

A comprehensive Transaction API for efficient transaction management, built with the MERN stack (MongoDB, Express.js, React, Node.js). This dashboard application allows users to create, search, filter, and analyze transactions through an intuitive interface.

## Features

### Core Functionality
- **Transaction Management**
  - Create transactions with detailed information
  - View transaction details by ID
  - Search with multiple criteria (User ID, date range, description, tags)
  - Sort by amount or timestamp

- **Advanced Analytics**
  - Generate transaction reports for any period
  - Visual representation of transaction data
  - Summary statistics and trend analysis

- **Automated Transaction Generation**
  - Built-in CRON job for test transaction generation
  - Start/Stop controls directly from the dashboard

### Technical Features
- Responsive UI optimized for all devices
- RESTful API following best practices
- Efficient pagination system
- Proper database indexing for optimized queries
- Support for INR (₹) currency

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Shadcn UI component library
- React Query for state management
- Recharts for data visualization

### Backend
- Node.js with Express
- MongoDB for database storage
- Proper indexes for efficient queries
- RESTful API design

### DevOps
- Docker for containerization and deployment
- Git for version control

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn package manager
- MongoDB (local or Atlas connection)

### Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashdivya5/Flagright_task.git
   cd transaction-api-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/transactions | Create a new transaction |
| GET | /api/transactions/:id | Get transaction by ID |
| GET | /api/transactions | List transactions (with filter/sort options) |
| GET | /api/reports | Generate transaction reports |
| POST | /api/cron/toggle | Toggle the CRON job status |

## Filtering Options

The transaction list can be filtered by:
- User ID
- Date range (start and end dates)
- Description (text search)
- Tags
- Status
- Country
- Amount range

## Project Structure

```
transaction-api-dashboard/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript type definitions
│   └── App.tsx          # Main application component
├── .env                 # Environment variables
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
└── README.md            # Project documentation
```


## Acknowledgements

This project was created as an assignment for Flagright. It demonstrates the application of MERN stack development skills for creating a scalable and performant transaction management system.

---

