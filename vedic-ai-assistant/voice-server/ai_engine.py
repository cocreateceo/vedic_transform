"""AI Engine for Vedic Transform - Intelligent Q&A"""
from config import Config

# Try to import anthropic, but make it optional
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("⚠️  anthropic package not installed. Using fallback mode.")

class AIEngine:
    """Claude AI for answering Vedic Transform questions"""

    def __init__(self):
        """Initialize Claude API"""
        if not ANTHROPIC_AVAILABLE:
            print("ℹ️  Running in fallback mode (no Claude API)")
            self.client = None
        elif not Config.ANTHROPIC_API_KEY:
            print("⚠️  WARNING: ANTHROPIC_API_KEY not set!")
            print("   Set it: export ANTHROPIC_API_KEY='your-key'")
            print("   Using fallback mode for now.")
            self.client = None
        else:
            try:
                self.client = anthropic.Anthropic(api_key=Config.ANTHROPIC_API_KEY)
                print("✅ Claude AI initialized for Vedic Transform")
            except Exception as e:
                print(f"⚠️  WARNING: Could not initialize Claude API: {e}")
                print("   Using fallback mode for now.")
                self.client = None

    def get_response(self, user_question):
        """
        Get AI response to user question

        Args:
            user_question (str): User's question

        Returns:
            str: AI-generated response
        """
        if not self.client:
            # Fallback to knowledge base if no API key
            return self._fallback_response(user_question)

        try:
            # Call Claude API
            message = self.client.messages.create(
                model=Config.AI_MODEL,
                max_tokens=300,
                system=Config.PROJECT_CONTEXT,
                messages=[{
                    "role": "user",
                    "content": user_question
                }]
            )

            response_text = message.content[0].text
            print(f"🤖 AI Response: {response_text[:50]}...")
            return response_text

        except Exception as e:
            print(f"❌ Claude API error: {e}")
            return self._fallback_response(user_question)

    def _fallback_response(self, question):
        """Fallback responses when API unavailable - Vedic Transform specific"""
        q_lower = question.lower()

        # Vedic Transform specific keywords
        if 'pillar' in q_lower or 'practice' in q_lower:
            return "The 11 pillars cover body, mind, and spirit transformation through ancient Vedic practices like meditation, yoga, and mindful living."
        elif 'brahma muhurta' in q_lower or 'morning' in q_lower or '5 am' in q_lower:
            return "Brahma Muhurta at 5 AM is the sacred awakening time when spiritual energy is highest. Start your day with meditation and intention setting."
        elif 'karma' in q_lower or 'points' in q_lower:
            return "Karma points track your dedication to daily practices. Complete pillar check-ins to earn points and unlock achievement badges."
        elif 'meditation' in q_lower or 'sandhya' in q_lower:
            return "Practice Sandhya meditation three times daily—morning, noon, and evening—to connect with divine consciousness and inner peace."
        elif 'yoga' in q_lower or 'movement' in q_lower or 'exercise' in q_lower:
            return "Sacred movement combines yoga asanas with mindful exercise for physical transformation and energy balance."
        elif 'pranayama' in q_lower or 'breath' in q_lower:
            return "Pranayama breathwork regulates prana (life force) for mental clarity, emotional balance, and spiritual awakening."
        elif 'gratitude' in q_lower:
            return "Daily gratitude practice rewires your mind for abundance, positive energy, and deeper appreciation of life's blessings."
        elif 'fast' in q_lower or 'nutrition' in q_lower or 'food' in q_lower:
            return "Mindful nutrition and periodic fasting purify the body, enhance mental clarity, and deepen spiritual awareness."
        elif 'sleep' in q_lower:
            return "Optimize sleep by aligning with natural cycles—early to bed by 10 PM, early to rise at 5 AM for maximum vitality."
        elif 'day' in q_lower or 'journey' in q_lower or '48' in q_lower:
            return "The 48-day journey systematically transforms you through consistent daily practice of all 11 pillars. Stay committed to see profound changes."
        elif 'streak' in q_lower:
            return "Maintain your daily streak by completing at least 3 pillar check-ins each day. Consistency builds lasting transformation."
        elif 'badge' in q_lower or 'achievement' in q_lower:
            return "Earn badges by reaching milestones—7-day streak, 100 karma points, all pillars completed, and more. Badges track your progress."
        elif 'goal' in q_lower or 'intention' in q_lower:
            return "Set weekly goals and daily intentions to focus your energy. Clear intentions manifest your desires and guide your transformation."
        elif 'manifestation' in q_lower or 'desire' in q_lower:
            return "Divine manifestation combines visualization, intention, and aligned action to bring your deepest desires into reality."
        elif 'vedic' in q_lower or 'program' in q_lower or 'transform' in q_lower:
            return "10X Vedic Transform blends 5000-year-old Vedic wisdom with modern science for holistic body-mind-spirit transformation in 48 days."
        elif 'start' in q_lower or 'begin' in q_lower or 'how' in q_lower:
            return "Start by waking at Brahma Muhurta (5 AM), set your daily intention, and complete check-ins for each pillar you practice."
        else:
            return "I'm here to guide your Vedic transformation journey. Ask about pillars, practices, karma points, or your spiritual growth."
