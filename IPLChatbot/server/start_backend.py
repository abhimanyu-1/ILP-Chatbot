#!/usr/bin/env python3
"""
Standalone backend startup script for TCS ILP Chatbot API
"""

import subprocess
import sys
import os

def main():
    print("🤖 TCS ILP Chatbot Backend API")
    print("=" * 40)
    print("Installing dependencies...")
    
    try:
        # Install dependencies
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependencies installed successfully")
        
        print("\n🚀 Starting Flask API server...")
        print("📡 Backend will be available at: http://localhost:5000")
        print("📊 Health check: http://localhost:5000/api/health")
        print("📈 Statistics: http://localhost:5000/api/stats")
        print("\nPress Ctrl+C to stop the server")
        print("-" * 40)
        
        # Start Flask server
        subprocess.run([sys.executable, 'app.py'])
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        print("💡 Make sure you have Python 3.7+ installed")
        return 1
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped by user")
        print("👋 Goodbye!")
        return 0

if __name__ == "__main__":
    sys.exit(main())