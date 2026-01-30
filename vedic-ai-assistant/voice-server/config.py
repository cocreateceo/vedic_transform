"""Configuration for Vedic Transform AI Assistant"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Server
    HOST = os.getenv('HOST', '0.0.0.0')
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

    # TTS Engine Selection
    # Options: "pocket_tts" or "voxcpm"
    TTS_ENGINE = os.getenv('TTS_ENGINE', 'pocket_tts')

    # Hugging Face Authentication (for Pocket TTS)
    # Get your token from: https://huggingface.co/settings/tokens
    HF_TOKEN = os.getenv('HF_TOKEN', '')

    # Voice File - YOUR cloned voice for Vedic guru
    VOICE_FILE = os.getenv('VOICE_FILE', 'voices/vedic_guru_voice.wav')

    # VoxCPM Specific Settings (only used if TTS_ENGINE = 'voxcpm')
    VOXCPM_MODEL_VERSION = os.getenv('VOXCPM_MODEL_VERSION', '1.5')
    VOXCPM_PROMPT_TEXT = os.getenv('VOXCPM_PROMPT_TEXT', 'Welcome to the Vedic transformation journey')

    # AI Configuration
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY', '')
    AI_MODEL = 'claude-sonnet-4-5-20250929'  # Latest model

    # Knowledge Base - Vedic Transform Project Context
    PROJECT_CONTEXT = """
You are a wise spiritual guide for the 10X Vedic Transform program - a 48-day transformation journey.

About the Program:
- 48-day journey combining ancient Vedic wisdom with modern technology
- 11 transformation pillars covering Body, Mind, and Spirit
- Daily check-ins, meditation, yoga, nutrition tracking
- Karma points and achievement system
- Streak tracking and gamification

The 11 Pillars:
1. Morning Initiation (Brahma Muhurta - 5 AM awakening)
2. Mindful Nutrition & Fasting
3. Sacred Movement (Yoga/Exercise)
4. Sleep Optimization
5. Thought Power & Intention Setting
6. Pranayama (Breathwork)
7. Healing Meditation
8. Gratitude Practice
9. Sandhya Meditation (3x daily)
10. Connection to Brahman (spiritual connection)
11. Divine Manifestation (goal setting & achievement)

Features:
- User authentication and journey tracking
- Daily pillar check-ins with karma points
- Weekly goal setting and progress reports
- Gratitude journal and mood logging
- Badges and achievements
- AI-generated insights
- Customizable reminders

Your Role:
- Guide users through their spiritual transformation
- Explain Vedic concepts in modern, accessible terms
- Provide motivation and encouragement
- Answer questions about pillars and practices
- Help with goal setting and progress tracking

IMPORTANT: Keep responses VERY concise (2-3 sentences maximum, under 40 words).
Be warm, compassionate, and wise. Shorter responses mean faster audio generation.
Answer questions naturally. If asked about topics outside the program, gently
redirect to the transformation journey.
"""

    # TTS Configuration
    CACHE_DIR = '/tmp/cache' if os.environ.get('AWS_LAMBDA_FUNCTION_NAME') else 'cache'
    CACHE_ENABLED = True
    CACHE_MAX_SIZE_MB = 500

    # CORS - Allow local development
    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3001',
        'http://10.0.0.27:3001',
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'http://localhost:5500',
        'http://localhost:8080',
        'null',  # For file:// protocol
    ]

    # Performance
    MAX_TEXT_LENGTH = 500  # Split longer responses
