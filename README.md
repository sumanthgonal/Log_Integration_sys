# Log Ingestion and Querying System

A full-stack application for ingesting, storing, and querying log data with a beautiful, production-ready interface inspired by professional monitoring tools like Grafana Loki and Datadog.

## 🚀 Features

### Backend (Node.js + Express)
- **RESTful API** with comprehensive log ingestion and querying endpoints
- **JSON file persistence** for simple, dependency-free data storage
- **Advanced filtering** supporting multiple simultaneous filters (level, message search, resourceId, timestamp range, traceId, spanId, commit)
- **Robust validation** with detailed error messages
- **Security middleware** including CORS, Helmet, and request logging
- **Health check endpoint** for monitoring

### Frontend (React + TypeScript)
- **Modern, responsive UI** with professional design aesthetics
- **Real-time search** with debounced input for optimal performance
- **Visual log level indicators** with color-coded system (error: red, warn: amber, info: blue, debug: gray)
- **Advanced filtering interface** with quick date range selectors
- **Reverse chronological display** with relative timestamps
- **Expandable metadata** for detailed log inspection
- **Loading states and error handling** with user-friendly messages

## 🛠 Technology Stack

- **Backend**: Node.js, Express.js, JSON file storage
- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Development**: Hot reload, ESLint, TypeScript strict mode

## 📋 API Specification

### Log Data Schema
```json
{
  "level": "error|warn|info|debug",
  "message": "string",
  "resourceId": "string", 
  "timestamp": "ISO 8601 string",
  "traceId": "string",
  "spanId": "string", 
  "commit": "string",
  "metadata": "object"
}
```

### Endpoints

#### POST /logs
Ingest a single log entry
- **Body**: Log object conforming to schema
- **Response**: 201 Created with stored log object
- **Error**: 400 Bad Request for validation errors

#### GET /logs
Retrieve and filter log entries
- **Query Parameters** (all optional):
  - `level`: Filter by log level
  - `message`: Full-text search in message field
  - `resourceId`: Filter by resource identifier
  - `timestamp_start`: Start of time range (ISO 8601)
  - `timestamp_end`: End of time range (ISO 8601)
  - `traceId`: Filter by trace identifier
  - `spanId`: Filter by span identifier
  - `commit`: Filter by commit hash
- **Response**: 200 OK with array of matching logs (reverse chronological order)

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation & Running

1. **Install dependencies**:
```bash
npm install
```

2. **Start the backend server**:
```bash
npm run server
```
The API server will start on http://localhost:3001

3. **Start the frontend development server** (in a new terminal):
```bash
npm run dev  
```
The React app will start on http://localhost:5173

### Sample Data
The system includes sample log data for immediate testing. You can also create new logs via the API:

```bash
curl -X POST http://localhost:3001/logs \
  -H "Content-Type: application/json" \
  -d '{
    "level": "error",
    "message": "Database connection failed",
    "resourceId": "server-001", 
    "timestamp": "2023-09-15T10:30:00Z",
    "traceId": "trace-123",
    "spanId": "span-456",
    "commit": "abc123",
    "metadata": {"errorCode": "DB_CONN_FAILED"}
  }'
```

## 🎨 Design Philosophy

The interface draws inspiration from industry-leading monitoring tools, emphasizing:

- **Clarity**: Clean, uncluttered layout focusing on log data
- **Efficiency**: Fast filtering with real-time updates
- **Visual Hierarchy**: Color-coded log levels and consistent typography
- **Professional Aesthetics**: Modern design suitable for production environments
- **User Experience**: Intuitive controls with helpful feedback

## 🏗 Architecture

### Backend Architecture
- **Modular design** with separate routes, services, and utilities
- **Service layer** for business logic abstraction
- **Validation layer** for request/response validation
- **Error handling** with consistent error responses
- **File-based persistence** using JSON for simplicity

### Frontend Architecture  
- **Component-based** with clear separation of concerns
- **Custom hooks** for reusable logic (debouncing, etc.)
- **Type safety** with comprehensive TypeScript interfaces
- **Service layer** for API communication
- **Utility functions** for date formatting and data manipulation

## 📁 Project Structure

```
├── server/
│   ├── server.js          # Express server setup
│   ├── routes/logs.js     # Log API routes
│   ├── services/logService.js  # Business logic
│   ├── utils/validation.js     # Request validation
│   └── data/logs.json     # JSON database
├── src/
│   ├── components/        # React components
│   ├── services/          # API service layer
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main application
└── package.json          # Dependencies and scripts
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start frontend development server
- `npm run server` - Start backend API server  
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Features Implemented
- ✅ Log ingestion via POST API
- ✅ Advanced filtering with multiple simultaneous filters
- ✅ Full-text search with debouncing
- ✅ Date range filtering with quick selectors
- ✅ Visual log level indicators
- ✅ Reverse chronological sorting
- ✅ Responsive design
- ✅ Error handling and loading states
- ✅ TypeScript throughout
- ✅ Professional UI/UX design

## 🎯 Production Considerations

This implementation demonstrates production-ready patterns:
- Comprehensive error handling
- Input validation and sanitization  
- Security middleware
- Performance optimizations (debouncing, efficient filtering)
- Maintainable code architecture
- Professional user interface design
- Type safety with TypeScript