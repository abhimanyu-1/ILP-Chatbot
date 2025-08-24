#!/usr/bin/env python3
"""
Development startup script for TCS ILP Chatbot
Starts both frontend and backend services
"""

import subprocess
import sys
import os
import time
from threading import Thread

def run_backend():
    """Start the Flask backend server"""
    print("🚀 Starting Backend API Server...")
    try:
        os.chdir('server')
        # Install dependencies if needed
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        # Start Flask server
        subprocess.run([sys.executable, 'app.py'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Backend startup failed: {e}")
    except KeyboardInterrupt:
        print("\n🛑 Backend server stopped")

def run_frontend():
    """Start the React frontend server"""
    print("🚀 Starting Frontend Development Server...")
    try:
        # Give backend time to start
        time.sleep(3)
        os.chdir('/workspace/shadcn-ui')
        # Start React dev server
        subprocess.run(['pnpm', 'run', 'dev'], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Frontend startup failed: {e}")
    except KeyboardInterrupt:
        print("\n🛑 Frontend server stopped")

def main():
    print("🤖 TCS ILP Chatbot Development Environment")
    print("=" * 50)
    
    # Start backend in a separate thread
    backend_thread = Thread(target=run_backend, daemon=True)
    backend_thread.start()
    
    # Start frontend in main thread
    try:
        run_frontend()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down development environment...")
        print("👋 Goodbye!")

if __name__ == "__main__":
    main()