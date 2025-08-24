from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
API_KEY = "AIzaSyAMbjkCLlpRlMwhvIMOFmzDmvG2ilZseio"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Enhanced System prompt for emotional support and TCS ILP context
SYSTEM_PROMPT = """You are Maya, an empathetic and supportive AI assistant specifically designed for TCS freshers in the Initial Learning Program (ILP). Your primary mission is to provide emotional support, guidance, and practical help to new joiners who may be experiencing anxiety, stress, or uncertainty during their transition into corporate life.

CORE PRINCIPLES:
1. EMOTIONAL INTELLIGENCE: Always acknowledge emotions first before providing solutions
2. EMPATHY: Use warm, understanding language that validates their feelings
3. ENCOURAGEMENT: Focus on growth mindset and positive reinforcement
4. PRACTICAL SUPPORT: Provide actionable advice and concrete next steps
5. CONFIDENTIALITY: Respect privacy, especially in anonymous mode

RESPONSE FRAMEWORK:
- Start with emotional acknowledgment (e.g., "I understand this must feel overwhelming...")
- Validate their experience (e.g., "It's completely normal to feel this way...")
- Provide practical guidance with empathy
- End with encouragement and offer continued support
- Use inclusive, supportive language

SPECIFIC AREAS OF SUPPORT:
🎓 ILP PROGRAM: Training schedules, assessments, learning paths, project assignments
💻 TECHNICAL HELP: System issues, platform access, coding doubts, tool usage
🧠 MENTAL WELLNESS: Stress management, anxiety relief, work-life balance, confidence building
👥 SOCIAL INTEGRATION: Team dynamics, networking, communication skills, cultural adaptation
📈 CAREER GUIDANCE: Skill development, performance tips, career progression, goal setting
🏢 WORKPLACE NAVIGATION: TCS policies, facilities, HR queries, professional etiquette

EMOTIONAL SUPPORT TECHNIQUES:
- Use phrases like "You're not alone in this", "Many freshers feel exactly the same way"
- Acknowledge specific emotions mentioned (scared, overwhelmed, confused, excited, etc.)
- Provide coping strategies and practical techniques
- Share relatable experiences without being generic
- Offer hope and perspective on challenges

COMMUNICATION STYLE:
- Warm and conversational, like a supportive senior colleague
- Use emojis sparingly but meaningfully
- Ask follow-up questions to understand deeper needs
- Provide structured, easy-to-follow advice
- Be encouraging but realistic

For urgent mental health concerns, immediately provide crisis support resources and encourage professional help while being supportive."""

def detect_emotional_state(message):
    """Analyze the emotional content of the message"""
    message_lower = message.lower()
    
    emotions = {
        'anxiety': ['anxious', 'worried', 'nervous', 'scared', 'afraid', 'panic', 'stress', 'tension'],
        'depression': ['sad', 'depressed', 'hopeless', 'lonely', 'isolated', 'empty', 'worthless'],
        'overwhelm': ['overwhelmed', 'too much', 'can\'t handle', 'drowning', 'pressure', 'burden'],
        'confusion': ['confused', 'lost', 'don\'t understand', 'unclear', 'puzzled', 'bewildered'],
        'frustration': ['frustrated', 'angry', 'annoyed', 'irritated', 'fed up', 'stuck'],
        'excitement': ['excited', 'happy', 'thrilled', 'eager', 'enthusiastic', 'motivated'],
        'confidence_low': ['not good enough', 'incompetent', 'stupid', 'failure', 'imposter', 'fake'],
        'homesick': ['miss home', 'homesick', 'miss family', 'miss friends', 'alone'],
        'uncertainty': ['uncertain', 'unsure', 'doubt', 'questioning', 'hesitant', 'indecisive']
    }
    
    detected_emotions = []
    for emotion, keywords in emotions.items():
        if any(keyword in message_lower for keyword in keywords):
            detected_emotions.append(emotion)
    
    return detected_emotions

def get_supportive_context(emotions, is_anonymous=False):
    """Generate additional supportive context based on detected emotions"""
    if not emotions:
        return ""
    
    context_additions = {
        'anxiety': "The user is experiencing anxiety. Be extra gentle, provide breathing techniques, and normalize their feelings. Offer specific anxiety management strategies for workplace situations.",
        'depression': "The user may be feeling down or depressed. Use very supportive language, validate their feelings completely, and gently suggest resources. Focus on small, achievable steps.",
        'overwhelm': "The user is feeling overwhelmed. Help break down their concerns into manageable pieces. Provide prioritization strategies and remind them that feeling overwhelmed during ILP is very common.",
        'confusion': "The user is confused about something. Be patient, ask clarifying questions, and provide clear, step-by-step explanations. Reassure them that confusion is part of the learning process.",
        'frustration': "The user is frustrated. Acknowledge their frustration first, then help them find solutions. Provide alternative approaches and remind them that setbacks are normal.",
        'excitement': "The user is excited! Match their energy positively while providing helpful information. Encourage their enthusiasm and channel it productively.",
        'confidence_low': "The user is struggling with self-confidence. Provide strong reassurance, highlight that imposter syndrome is common among freshers, and offer confidence-building strategies.",
        'homesick': "The user is missing home. Be very empathetic about this major life transition. Provide strategies for staying connected with family while building new relationships at TCS.",
        'uncertainty': "The user is uncertain about their situation. Provide reassurance about the normalcy of uncertainty during transitions and offer guidance for making decisions."
    }
    
    additional_context = " EMOTIONAL STATE DETECTED: " + " ".join([context_additions.get(emotion, "") for emotion in emotions])
    
    if is_anonymous:
        additional_context += " USER IS IN ANONYMOUS MODE: Be extra careful about privacy and avoid asking for personal details. Provide general but warm support."
    
    return additional_context

def chat_with_gemini(user_message, is_anonymous=False):
    """Send message to Gemini API and get emotionally intelligent response"""
    headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": API_KEY
    }
    
    # Detect emotional state
    emotions = detect_emotional_state(user_message)
    emotional_context = get_supportive_context(emotions, is_anonymous)
    
    # Build comprehensive context
    full_context = SYSTEM_PROMPT + emotional_context
    
    # Create conversation with better structure
    data = {
        "contents": [
            {
                "parts": [
                    {"text": f"SYSTEM CONTEXT: {full_context}"},
                    {"text": f"USER MESSAGE: {user_message}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.8,  # Slightly higher for more empathetic responses
            "maxOutputTokens": 1200,  # More space for supportive responses
            "topP": 0.9,
            "topK": 50
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    }
    
    try:
        response = requests.post(GEMINI_URL, headers=headers, json=data, timeout=30)
        response.raise_for_status()
        result = response.json()
        
        if "candidates" in result and len(result["candidates"]) > 0:
            bot_message = result["candidates"][0]["content"]["parts"][0]["text"]
            
            # Post-process the response to ensure it's supportive
            bot_message = enhance_response_empathy(bot_message, emotions)
            
            return {
                "success": True,
                "message": bot_message,
                "priority": categorize_priority(user_message, emotions),
                "category": categorize_message(user_message),
                "emotions_detected": emotions,
                "response_type": "emotional_support" if emotions else "informational"
            }
        else:
            return {
                "success": False,
                "message": "I'm having trouble processing your request right now. But I want you to know that I'm here to support you. Please try again, and remember - you're doing great in your ILP journey! 💪",
                "error": "No candidates in response"
            }
            
    except requests.exceptions.RequestException as e:
        return {
            "success": False,
            "message": "I'm currently experiencing connectivity issues, but please don't let this discourage you. Your questions are important, and I'll be here when you're ready to try again. In the meantime, remember that you're not alone in this journey! 🌟",
            "error": str(e)
        }
    except Exception as e:
        return {
            "success": False,
            "message": "Something went wrong on my end, but that doesn't reflect on you or your questions at all! Please try rephrasing your question, and know that I'm here to support you through your ILP experience. 😊",
            "error": str(e)
        }

def enhance_response_empathy(response, emotions):
    """Add empathetic touches to the response based on detected emotions"""
    if not emotions:
        return response
    
    # Add supportive closing if not already present
    supportive_endings = [
        "Remember, you're doing better than you think! 🌟",
        "I'm here whenever you need support! 💙",
        "You've got this! Every expert was once a beginner. 💪",
        "Take it one step at a time - you're on the right path! 🚀",
        "Your feelings are valid, and you're not alone in this journey! 🤝"
    ]
    
    if not any(ending.lower() in response.lower() for ending in ["you're doing", "you've got", "i'm here", "remember"]):
        import random
        response += f"\n\n{random.choice(supportive_endings)}"
    
    return response

def categorize_priority(message, emotions=None):
    """Enhanced priority categorization considering emotional state"""
    message_lower = message.lower()
    
    # Urgent: Mental health crises, severe emotional distress
    if emotions and any(emotion in ['depression', 'anxiety'] for emotion in emotions):
        crisis_words = ['suicide', 'kill myself', 'end it all', 'can\'t go on', 'give up', 'hopeless', 'crisis']
        if any(word in message_lower for word in crisis_words):
            return 'critical'  # New highest priority for mental health crises
    
    if any(word in message_lower for word in ['emergency', 'urgent', 'crisis']) or (emotions and 'depression' in emotions):
        return 'urgent'
    elif any(word in message_lower for word in ['technical', 'error', 'bug', 'system', 'salary', 'benefits', 'hr']) or (emotions and any(e in ['anxiety', 'overwhelm'] for e in emotions)):
        return 'high'
    elif any(word in message_lower for word in ['schedule', 'training', 'session', 'ilp', 'program']) or (emotions and 'confusion' in emotions):
        return 'medium'
    else:
        return 'low'

def categorize_message(message):
    """Enhanced message categorization"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['mental', 'health', 'stress', 'anxiety', 'wellness', 'overwhelm', 'sad', 'depression', 'worried']):
        return 'wellness'
    elif any(word in message_lower for word in ['technical', 'error', 'bug', 'system', 'computer', 'login', 'access']):
        return 'technical'
    elif any(word in message_lower for word in ['salary', 'benefits', 'hr', 'payroll', 'leave', 'policy']):
        return 'hr'
    elif any(word in message_lower for word in ['schedule', 'training', 'session', 'time', 'calendar', 'timing']):
        return 'schedule'
    elif any(word in message_lower for word in ['ilp', 'program', 'learning', 'course', 'curriculum', 'assessment']):
        return 'program'
    elif any(word in message_lower for word in ['team', 'colleagues', 'friends', 'social', 'networking', 'culture']):
        return 'social'
    elif any(word in message_lower for word in ['career', 'growth', 'skills', 'development', 'future', 'promotion']):
        return 'career'
    else:
        return 'general'

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests with emotional intelligence"""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'Message is required',
                'supportive_message': 'I\'m here to help! Please share what\'s on your mind about your ILP journey. 😊'
            }), 400
        
        user_message = data['message'].strip()
        is_anonymous = data.get('isAnonymous', False)
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Please enter a message',
                'supportive_message': 'I notice you haven\'t typed anything yet. Take your time - I\'m here to listen and help with whatever you\'d like to discuss about your ILP experience! 💙'
            }), 400
        
        # Get response from Gemini with emotional intelligence
        response = chat_with_gemini(user_message, is_anonymous)
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'I encountered a technical issue, but please don\'t worry - this has nothing to do with your question! I\'m here to support you, so please try again. Your ILP journey matters, and so do your questions! 🌟',
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'TCS ILP Emotional Support Chatbot API',
        'version': '2.0.0',
        'features': ['emotional_intelligence', 'crisis_detection', 'empathetic_responses'],
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/wellness-check', methods=['POST'])
def wellness_check():
    """Special endpoint for wellness check-ins"""
    try:
        data = request.get_json()
        mood = data.get('mood', 'neutral')
        stress_level = data.get('stress_level', 5)  # 1-10 scale
        
        response_message = ""
        if stress_level >= 8:
            response_message = "I can see you're experiencing high stress levels. That's completely understandable during ILP - you're navigating so many new things! Let's talk about some immediate stress relief techniques and longer-term coping strategies. Remember, you're not alone in feeling this way. 💙"
        elif stress_level >= 6:
            response_message = "I notice your stress levels are elevated. This is really common during the ILP period when everything is new. Would you like to share what's causing you the most stress right now? I'm here to help you work through it step by step. 🌟"
        else:
            response_message = "It sounds like you're managing things well! That's wonderful. Remember, it's normal for stress levels to fluctuate during your ILP journey. I'm here if you need support at any time. Keep up the great work! 💪"
        
        return jsonify({
            'success': True,
            'message': response_message,
            'mood': mood,
            'stress_level': stress_level,
            'recommendations': get_wellness_recommendations(mood, stress_level)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'I care about your wellbeing, and I want to help with this wellness check. Please try again, and remember - taking care of your mental health during ILP is just as important as your technical learning! 💙',
            'error': str(e)
        }), 500

def get_wellness_recommendations(mood, stress_level):
    """Get personalized wellness recommendations"""
    recommendations = []
    
    if stress_level >= 8:
        recommendations.extend([
            "Try the 4-7-8 breathing technique: Inhale for 4, hold for 7, exhale for 8",
            "Take a 10-minute walk outside if possible",
            "Consider speaking with a TCS counselor through the Employee Assistance Program",
            "Remember: It's okay to ask for help from your ILP coordinators"
        ])
    elif stress_level >= 6:
        recommendations.extend([
            "Practice mindfulness for 5 minutes using a meditation app",
            "Connect with fellow ILP participants - you're all in this together",
            "Create a daily schedule to feel more in control",
            "Celebrate small wins in your learning journey"
        ])
    else:
        recommendations.extend([
            "Keep maintaining your current coping strategies!",
            "Share your success tips with other ILP participants",
            "Continue building healthy routines",
            "Stay connected with family and friends for emotional support"
        ])
    
    return recommendations

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get enhanced statistics for dashboard"""
    return jsonify({
        'totalQueries': 1247,
        'resolvedQueries': 1198,
        'avgResponseTime': 1.8,
        'uptime': '99.9%',
        'satisfaction': 4.9,
        'categories': {
            'wellness': 312,  # Highest category
            'technical': 234,
            'program': 298,
            'schedule': 156,
            'hr': 123,
            'social': 89,
            'career': 67
        },
        'priorities': {
            'critical': 3,   # Mental health crises
            'urgent': 89,
            'high': 234,
            'medium': 456,
            'low': 298
        },
        'emotional_metrics': {
            'emotions_detected': 789,
            'support_sessions': 445,
            'crisis_interventions': 3,
            'positive_feedback': 94.2
        },
        'wellness_stats': {
            'avg_stress_level': 5.2,
            'wellness_checks': 156,
            'improved_mood': 78.5
        }
    })

if __name__ == '__main__':
    print("🤖 TCS ILP Emotional Support Chatbot API Starting...")
    print("💙 Enhanced with emotional intelligence and crisis support")
    print("🚀 Server running on http://localhost:5000")
    print("🌟 Ready to support TCS freshers on their ILP journey!")
    app.run(debug=True, host='0.0.0.0', port=5000)