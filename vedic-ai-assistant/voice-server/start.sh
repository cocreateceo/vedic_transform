#!/bin/bash

echo "============================================================"
echo "🕉️ Starting Vedic Transform Voice Server"
echo "============================================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your API keys:"
    echo "   1. HF_TOKEN - Get from https://huggingface.co/settings/tokens"
    echo "   2. ANTHROPIC_API_KEY - Get from https://console.anthropic.com/"
    echo ""
    echo "Run this script again after adding your keys."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Check if dependencies are installed
if ! python -c "import flask" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
    echo "✅ Dependencies installed"
fi

echo ""
echo "============================================================"
echo "🚀 Starting Flask server..."
echo "============================================================"
echo ""

# Start the server
python app.py
