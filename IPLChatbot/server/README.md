# TCS ILP Chatbot Backend API

This is the backend API for the TCS Initial Learning Program (ILP) chatbot, built with Flask and integrated with Google's Gemini AI.

## Features

- **Gemini AI Integration**: Uses Google's Gemini 2.0 Flash model for intelligent responses
- **Smart Categorization**: Automatically categorizes messages by priority and topic
- **Anonymous Support**: Handles anonymous chat requests with privacy consideration
- **CORS Enabled**: Allows frontend integration from different origins
- **Health Monitoring**: Provides health check and statistics endpoints

## API Endpoints

### POST /api/chat
Send a message to the chatbot and get an AI-powered response.

**Request Body:**
```json
{
  "message": "What is the ILP program structure?",
  "isAnonymous": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "The Initial Learning Program (ILP) is a comprehensive...",
  "priority": "medium",
  "category": "program"
}
```

### GET /api/health
Check the health status of the API service.

### GET /api/stats
Get dashboard statistics and metrics.

## Installation & Setup

1. **Install Python dependencies:**
```bash
cd server
pip install -r requirements.txt
```

2. **Run the server:**
```bash
python app.py
```

The server will start on `http://localhost:5000`

## Configuration

- **Gemini API Key**: Already configured in the code
- **CORS**: Enabled for all origins (configure as needed for production)
- **Port**: Default 5000 (can be modified in app.py)

## Message Categories

The API automatically categorizes messages into:
- **Priority**: urgent, high, medium, low
- **Topic**: wellness, technical, hr, schedule, program, general

## Security Features

- Request validation and error handling
- Timeout protection for external API calls
- Anonymous mode support for sensitive conversations
- Input sanitization and proper error responses

## Usage with Frontend

The backend is designed to work with the React chatbot frontend. Make sure to:
1. Update the frontend API URLs to point to `http://localhost:5000`
2. Start the backend server before testing the frontend
3. Both services can run simultaneously during development