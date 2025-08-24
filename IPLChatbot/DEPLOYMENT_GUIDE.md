# TCS ILP Chatbot - Deployment Guide

## 🚀 Complete Deployment Instructions

### Prerequisites
- **Python 3.7+** for backend API
- **Node.js 16+** and **pnpm** for frontend
- **Gemini API access** (already configured)

---

## 🔧 Quick Start (Development)

### Option 1: Automatic Startup (Recommended)
```bash
python start_dev.py
```
This will start both backend (port 5000) and frontend (port 5173) automatically.

### Option 2: Manual Startup

#### Start Backend API:
```bash
cd server
pip install -r requirements.txt
python app.py
```
Backend will run on: `http://localhost:5000`

#### Start Frontend (New Terminal):
```bash
cd /workspace/shadcn-ui
pnpm install
pnpm run dev
```
Frontend will run on: `http://localhost:5173`

---

## 🌐 API Endpoints

### Backend API (Port 5000)
- **Chat**: `POST /api/chat` - Send messages to AI
- **Health**: `GET /api/health` - Check API status  
- **Statistics**: `GET /api/stats` - Get dashboard data

### Example API Usage:
```bash
# Test chat endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is ILP?", "isAnonymous": false}'

# Check health
curl http://localhost:5000/api/health
```

---

## 🧪 Testing the Integration

1. **Start both services** using one of the methods above
2. **Open frontend**: Navigate to `http://localhost:5173`
3. **Test chat functionality**:
   - Try asking: "What is the ILP program?"
   - Test anonymous mode toggle
   - Check different priority levels
4. **View analytics dashboard**: Switch to the "Analytics Dashboard" tab
5. **Monitor backend logs** in the terminal for API calls

---

## 🔧 Configuration

### Backend Configuration (`server/app.py`):
- **Gemini API Key**: Already configured
- **CORS**: Enabled for frontend integration
- **Port**: 5000 (configurable)

### Frontend Configuration:
- **API URL**: `http://localhost:5000/api` (in `src/services/chatService.ts`)
- **Development Port**: 5173 (Vite default)

---

## 🚨 Troubleshooting

### Common Issues:

1. **Backend won't start**:
   ```bash
   pip install --upgrade pip
   pip install -r server/requirements.txt
   ```

2. **Frontend API calls fail**:
   - Ensure backend is running on port 5000
   - Check browser console for CORS errors
   - Verify API URL in `chatService.ts`

3. **Gemini API errors**:
   - Check API key validity
   - Verify internet connection
   - Monitor rate limits

### Debug Commands:
```bash
# Check backend health
curl http://localhost:5000/api/health

# View backend logs
tail -f server/app.log  # if logging to file

# Frontend development tools
pnpm run build  # Test production build
pnpm run lint   # Check code quality
```

---

## 📊 Features Overview

### ✅ Implemented Features:
- **Real-time AI chat** with Gemini integration
- **Smart prioritization** (urgent, high, medium, low)
- **Anonymous mode** for sensitive conversations  
- **Category classification** (technical, HR, wellness, etc.)
- **Live analytics dashboard** with real-time stats
- **Responsive design** for all devices
- **Error handling** and fallback responses

### 🎯 Key Capabilities:
- **24/7 availability** with instant responses
- **Intelligent triage** for efficient support
- **Privacy protection** with anonymous options
- **Empathetic responses** for sensitive topics
- **Scalable architecture** for production deployment

---

## 🎉 Success Indicators

When everything is working correctly, you should see:

1. **Backend**: Console shows "Server running on http://localhost:5000"
2. **Frontend**: Browser opens to chatbot interface
3. **Chat works**: Messages get AI-powered responses
4. **Dashboard updates**: Real-time statistics display
5. **No errors**: Clean console logs and proper API responses

---

**🎯 The TCS ILP Chatbot is now fully functional with AI integration!**

For production deployment, consider:
- Environment variables for API keys
- Database integration for conversation history
- Load balancing for high traffic
- Enhanced security measures
- User authentication system