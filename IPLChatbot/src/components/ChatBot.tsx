import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Shield, AlertTriangle, Clock, CheckCircle, Heart, Star, Smile, Frown, Volume2, VolumeX, Pause, Play, Mic, MicOff } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  priority?: 'critical' | 'urgent' | 'high' | 'medium' | 'low';
  category?: string;
  isAnonymous?: boolean;
  emotions_detected?: string[];
  response_type?: 'emotional_support' | 'informational';
}

interface ChatBotProps {
  isAnonymous?: boolean;
  onToggleAnonymous?: () => void;
}

const emotionalQuestions = [
  { text: "I'm feeling overwhelmed with ILP", category: "wellness", priority: "high" },
  { text: "How do I cope with homesickness?", category: "wellness", priority: "medium" },
  { text: "I'm anxious about assessments", category: "program", priority: "high" },
  { text: "How to connect with teammates?", category: "social", priority: "medium" },
  { text: "I don't feel confident enough", category: "wellness", priority: "high" },
  { text: "Work-life balance tips", category: "wellness", priority: "medium" }
];

const predefinedQuestions = [
  { text: "What is the ILP program structure?", category: "program", priority: "medium" },
  { text: "How to access learning materials?", category: "resources", priority: "medium" },
  { text: "When is my training schedule?", category: "schedule", priority: "medium" },
  { text: "I'm facing technical issues", category: "technical", priority: "high" },
  { text: "Mental health support", category: "wellness", priority: "urgent" },
  { text: "Salary and benefits queries", category: "hr", priority: "high" }
];

const wellnessResources = [
  { text: "TCS Employee Assistance Program", priority: "urgent" },
  { text: "Stress management techniques", priority: "high" },
  { text: "Mindfulness and meditation", priority: "medium" },
  { text: "Building resilience", priority: "medium" }
];

export default function ChatBot({ isAnonymous = true, onToggleAnonymous }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hi there! I'm Maya, your emotional support companion for the TCS ILP journey! 🌟 

I'm here to help you navigate not just the technical aspects of your training, but also support you through any emotional challenges you might face. Whether you're feeling anxious, overwhelmed, homesick, or just need someone to talk to - I'm here 24/7.

Your mental wellbeing matters just as much as your professional growth. ${isAnonymous ? 'You\'re in a safe, anonymous space where you can share openly.' : 'Feel free to share whatever is on your mind.'} 

What would you like to talk about today? 💙`,
      sender: 'bot',
      timestamp: new Date(),
      priority: 'low',
      response_type: 'emotional_support'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentAnonymous, setCurrentAnonymous] = useState(isAnonymous);
  const [showWellnessPanel, setShowWellnessPanel] = useState(false);
  const [userMood, setUserMood] = useState<'great' | 'good' | 'okay' | 'struggling' | null>(null);
  const [showQuickActions, setShowQuickActions] = useState('emotional'); // 'emotional' or 'general'
  
  // Voice-related state
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    rate: 0.9, // Slightly slower for a calming effect
    pitch: 1.1, // Slightly higher for a warm, friendly tone
    volume: 0.8
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleAnonymous = () => {
    setCurrentAnonymous(!currentAnonymous);
    if (onToggleAnonymous) {
      onToggleAnonymous();
    }
  };

  // Voice functionality
  const cleanTextForSpeech = (text: string): string => {
    return text
      .replace(/🌟|💙|🤗|😊|💫|✨|🎯|🚀|💪|🎉|🌈|⭐|❤️|💖|🙏|👍|🔥|💡|🎨|🌸|🦋|🌺|🎵|🎶|🎭|🎪|🎨|🌟/g, '') // Remove emojis
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const speakText = (text: string, messageId?: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return;

    // Stop any current speech
    if (isSpeaking && currentSpeech) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeech(null);
      return;
    }

    const cleanedText = cleanTextForSpeech(text);
    if (!cleanedText) return;

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Configure voice settings for Maya's caring personality
    utterance.rate = voiceSettings.rate;
    utterance.pitch = voiceSettings.pitch;
    utterance.volume = voiceSettings.volume;

    // Try to select a female voice for Maya
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('zira') ||
      voice.name.toLowerCase().includes('susan') ||
      voice.name.toLowerCase().includes('samantha')
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeech(utterance);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeech(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeech(null);
    };

    speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeech(null);
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const pauseOrResumeVoice = () => {
    if (isSpeaking && currentSpeech) {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        speechSynthesis.pause();
      }
    }
  };

  // Speech-to-text functionality
  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Mock API Integration function (since we can't make actual API calls in this environment)
  const sendToAPI = async (userMessage: string, isAnonymous: boolean) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock emotional intelligence responses
    const emotionalKeywords = {
      anxiety: ['anxious', 'worried', 'nervous', 'panic', 'fear'],
      overwhelm: ['overwhelmed', 'too much', 'stressed', 'pressure', 'burden'],
      confidence: ['confident', 'doubt', 'unsure', 'imposter', 'capable'],
      homesick: ['homesick', 'miss home', 'family', 'lonely', 'isolated'],
      support: ['help', 'support', 'guidance', 'advice', 'assistance']
    };

    const lowerMessage = userMessage.toLowerCase();
    const detectedEmotions: string[] = [];

    // Detect emotions
    Object.entries(emotionalKeywords).forEach(([emotion, keywords]) => {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedEmotions.push(emotion);
      }
    });

    // Generate appropriate responses
    let response = '';
    let priority: Message['priority'] = 'medium';
    let responseType: 'emotional_support' | 'informational' = 'informational';

    if (detectedEmotions.length > 0) {
      responseType = 'emotional_support';
      priority = 'high';
      
      if (detectedEmotions.includes('anxiety')) {
        response = `I can sense you're feeling anxious, and that's completely understandable. The ILP journey can feel overwhelming at times. Remember, anxiety is your mind trying to prepare you for challenges, which shows you care about doing well. 

Take a deep breath with me - in for 4 counts, hold for 4, out for 6. You're not alone in this feeling, and it doesn't define your capabilities.

Would you like some specific techniques to manage these anxious feelings, or would you prefer to talk about what's specifically worrying you? 💙`;
      } else if (detectedEmotions.includes('overwhelm')) {
        response = `Feeling overwhelmed is so common during ILP - you're processing a lot of new information and experiences. It's okay to feel this way, and it's actually a sign that you're pushing yourself to grow.

Let's break this down together. When we feel overwhelmed, it often helps to focus on just one small thing at a time. What's one small step you could take today that would make you feel a bit more in control?

Remember: You don't have to master everything at once. Progress, not perfection. 🌟`;
      } else if (detectedEmotions.includes('homesick')) {
        response = `Homesickness during ILP is so natural and shows how much your support system means to you. It's not a weakness - it's love for the people and places that shaped you.

This feeling will ease as you build new connections and create a sense of belonging in your new environment. In the meantime, staying connected with home while also opening yourself to new friendships can help.

What's one thing about home that you miss most? Sometimes talking about it can help process these feelings. 🤗`;
      } else {
        response = `I can hear that you're going through something challenging right now. Your feelings are valid, and it's brave of you to reach out.

The ILP journey has ups and downs for everyone, and experiencing difficult emotions doesn't mean you're not cut out for this - it means you're human and you're growing.

I'm here to listen and support you through this. What would feel most helpful right now - some practical strategies, or would you like to talk more about what's on your mind? 💙`;
      }
    } else if (lowerMessage.includes('ilp') || lowerMessage.includes('program')) {
      response = `Great question about the ILP program! The Initial Learning Program is designed to give you a comprehensive foundation in technology and professional skills.

The program typically includes:
- Technical training modules in your chosen stream
- Soft skills development sessions  
- Project-based learning experiences
- Peer collaboration opportunities
- Mentorship and support systems

Is there a specific aspect of the ILP structure you'd like to know more about? I'm here to help you navigate any part of your journey! 🚀`;
    } else {
      response = `Thank you for sharing that with me! I'm here to support you throughout your ILP journey, whether it's technical questions, emotional support, or just someone to talk to.

Every question and concern you have is important. Feel free to share whatever is on your mind - there's no topic too big or small.

How can I best support you today? 💙`;
    }

    return {
      content: response,
      priority,
      category: detectedEmotions.length > 0 ? 'wellness' : 'general',
      emotions_detected: detectedEmotions,
      response_type: responseType
    };
  };

  const sendMessage = async (content: string, isQuickReply = false) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      isAnonymous: currentAnonymous
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Get AI response from mock backend with emotional intelligence
      const response = await sendToAPI(content, currentAnonymous);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        priority: response.priority as Message['priority'],
        category: response.category,
        emotions_detected: response.emotions_detected,
        response_type: response.response_type
      };

      // Add extra delay for emotional support responses to feel more human and thoughtful
      const delay = response.response_type === 'emotional_support' ? 2500 : 1500;
      
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, botResponse]);
        
        // Automatically speak Maya's response if voice is enabled
        if (isVoiceEnabled) {
          setTimeout(() => {
            speakText(response.content, botResponse.id);
          }, 500); // Small delay to ensure message is rendered
        }
      }, delay);

    } catch (error) {
      console.error('Error sending message:', error);
      
      setTimeout(() => {
        const errorResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "I'm experiencing some technical difficulties, but I want you to know that I'm still here for you. Your ILP journey matters, and so do your feelings. Please try again when you're ready. 💙",
          sender: 'bot',
          timestamp: new Date(),
          priority: 'low',
          response_type: 'emotional_support'
        };

        setIsTyping(false);
        setMessages(prev => [...prev, errorResponse]);
        
        // Speak error response if voice enabled
        if (isVoiceEnabled) {
          setTimeout(() => {
            speakText(errorResponse.content, errorResponse.id);
          }, 500);
        }
      }, 1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      sendMessage(inputValue.trim());
    }
  };

  const handleMoodSelection = (mood: typeof userMood) => {
    setUserMood(mood);
    const moodMessages = {
      'great': "That's wonderful to hear! 🌟 I'm so glad you're feeling great. What's going particularly well in your ILP journey?",
      'good': "I'm happy you're feeling good! 😊 Keep up that positive energy. Is there anything specific that's contributing to your good mood?",
      'okay': "It's completely normal to feel 'okay' sometimes. 💙 Every day in ILP doesn't have to be perfect. Would you like to talk about what's on your mind?",
      'struggling': "I hear you, and I want you to know that struggling is a normal part of the ILP experience. You're not alone in this. 🤗 Would you like to share what's making things challenging right now?"
    };
    
    if (mood) {
      sendMessage(moodMessages[mood], true);
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-600';
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getPriorityIcon = (priority?: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="w-3 h-3" />;
      case 'urgent': return <AlertTriangle className="w-3 h-3" />;
      case 'high': return <Clock className="w-3 h-3" />;
      case 'medium': return <CheckCircle className="w-3 h-3" />;
      default: return <CheckCircle className="w-3 h-3" />;
    }
  };

  const getEmotionIcon = (emotions?: string[]) => {
    if (!emotions || emotions.length === 0) return null;
    
    const hasNegativeEmotion = emotions.some(e => 
      ['anxiety', 'depression', 'overwhelm', 'frustration', 'confidence_low'].includes(e)
    );
    
    return hasNegativeEmotion ? 
      <Heart className="w-3 h-3 text-pink-500" /> : 
      <Smile className="w-3 h-3 text-green-500" />;
  };

  return (
    <div className="w-full h-[700px] flex flex-col bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-200" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Maya - Your ILP Support Companion</h2>
              <p className="text-xs text-purple-100">Emotional Support & Guidance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Voice Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleVoice}
                className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                  isVoiceEnabled 
                    ? "bg-white/20 hover:bg-white/30" 
                    : "bg-white/10 hover:bg-white/20 opacity-60"
                }`}
                title={isVoiceEnabled ? "Voice enabled" : "Voice disabled"}
              >
                {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              
              {isSpeaking && (
                <button
                  onClick={pauseOrResumeVoice}
                  className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors"
                  title={speechSynthesis.paused ? "Resume" : "Pause"}
                >
                  {speechSynthesis.paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
              )}
            </div>

            <button
              onClick={handleToggleAnonymous}
              className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
                currentAnonymous 
                  ? "bg-white/20 hover:bg-white/30" 
                  : "bg-transparent hover:bg-white/20"
              }`}
            >
              <Shield className="w-4 h-4" />
              {currentAnonymous ? 'Anonymous' : 'Identified'}
            </button>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Voice Status Indicator */}
      {isSpeaking && (
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 border-b flex items-center justify-center gap-2">
          <Volume2 className="w-4 h-4 text-purple-600 animate-pulse" />
          <span className="text-sm text-purple-700">Maya is speaking...</span>
          <div className="flex space-x-1">
            <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-1 h-4 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-4 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Listening Indicator */}
      {isListening && (
        <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 border-b flex items-center justify-center gap-2">
          <Mic className="w-4 h-4 text-green-600 animate-pulse" />
          <span className="text-sm text-green-700">Listening... Speak now</span>
          <div className="flex space-x-1">
            <div className="w-1 h-3 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-1 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      )}

      {/* Mood Check Panel - Shows initially */}
      {!userMood && messages.length === 1 && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-b p-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">How are you feeling about your ILP journey today?</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <button
                onClick={() => handleMoodSelection('great')}
                className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors text-sm"
              >
                <Star className="w-4 h-4" />
                Great!
              </button>
              <button
                onClick={() => handleMoodSelection('good')}
                className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors text-sm"
              >
                <Smile className="w-4 h-4" />
                Good
              </button>
              <button
                onClick={() => handleMoodSelection('okay')}
                className="flex items-center gap-1 px-3 py-2 bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition-colors text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Okay
              </button>
              <button
                onClick={() => handleMoodSelection('struggling')}
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors text-sm"
              >
                <Heart className="w-4 h-4" />
                Struggling
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 max-w-full ${
              message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Enhanced Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.sender === 'bot' 
                ? 'bg-gradient-to-br from-purple-400 to-pink-400' 
                : 'bg-gradient-to-br from-blue-400 to-indigo-400'
            }`}>
              {message.sender === 'bot' ? 
                <Heart className="w-5 h-5 text-white" /> : 
                <User className="w-5 h-5 text-white" />
              }
            </div>
            
            {/* Message Content */}
            <div className={`flex flex-col min-w-0 flex-1 max-w-[80%] ${
              message.sender === 'user' ? 'items-end' : 'items-start'
            }`}>
              {/* Enhanced Message Header */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-medium text-gray-600">
                  {message.sender === 'bot' ? 'Maya (Support Companion)' : (message.isAnonymous ? 'You (Anonymous)' : 'You')}
                </span>
                
                {/* Voice control for bot messages */}
                {message.sender === 'bot' && isVoiceEnabled && (
                  <button
                    onClick={() => speakText(message.content, message.id)}
                    className="flex items-center gap-1 px-1 py-0.5 text-xs text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded transition-colors"
                    title="Listen to this message"
                  >
                    <Volume2 className="w-3 h-3" />
                  </button>
                )}
                
                {/* Emotion Indicator */}
                {message.emotions_detected && message.emotions_detected.length > 0 && (
                  <span className="flex items-center gap-1">
                    {getEmotionIcon(message.emotions_detected)}
                    <span className="text-xs text-pink-600">emotional support</span>
                  </span>
                )}
                
                {/* Priority Badge */}
                {message.priority && message.priority !== 'low' && (
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs text-white ${getPriorityColor(message.priority)}`}>
                    {getPriorityIcon(message.priority)}
                    {message.priority}
                  </span>
                )}
                
                <span className="text-xs text-gray-400">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              {/* Enhanced Message Bubble */}
              <div
                className={`p-4 rounded-2xl max-w-full leading-relaxed shadow-sm ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-tr-md'
                    : message.response_type === 'emotional_support'
                    ? 'bg-gradient-to-br from-purple-50 to-pink-50 text-gray-800 border border-purple-100 rounded-tl-md'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-md'
                }`}
                style={{
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  hyphens: 'auto'
                }}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* Support indicator for emotional responses */}
                {message.sender === 'bot' && message.response_type === 'emotional_support' && (
                  <div className="mt-3 pt-3 border-t border-purple-100 flex items-center gap-2 text-xs text-purple-600">
                    <Heart className="w-3 h-3" />
                    <span>Emotional support response</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-md border border-gray-200 shadow-sm">
              <div className="flex space-x-1 items-center">
                <span className="text-sm text-gray-500 mr-2">Maya is thinking with care...</span>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Dynamic Quick Actions Panel */}
      <div className="border-t bg-gradient-to-r from-purple-50 to-pink-50 p-4">
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Support Options:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowQuickActions('emotional')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    showQuickActions === 'emotional' 
                      ? 'bg-purple-200 text-purple-800' 
                      : 'text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  <Heart className="w-3 h-3 inline mr-1" />
                  Emotional
                </button>
                <button
                  onClick={() => setShowQuickActions('general')}
                  className={`px-2 py-1 text-xs rounded transition-colors ${
                    showQuickActions === 'general' 
                      ? 'bg-blue-200 text-blue-800' 
                      : 'text-blue-600 hover:bg-blue-100'
                  }`}
                >
                  <Bot className="w-3 h-3 inline mr-1" />
                  General
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowWellnessPanel(!showWellnessPanel)}
              className="text-xs text-purple-600 hover:text-purple-800 flex items-center gap-1"
            >
              <Heart className="w-3 h-3" />
              {showWellnessPanel ? 'Hide' : 'Show'} Wellness Resources
            </button>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {(showQuickActions === 'emotional' ? emotionalQuestions : predefinedQuestions)
              .slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => sendMessage(question.text, true)}
                className={`px-3 py-2 text-xs border rounded-full transition-colors shadow-sm ${
                  showQuickActions === 'emotional'
                    ? 'bg-white border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-purple-700'
                    : 'bg-white border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700'
                }`}
                disabled={isTyping}
              >
                {question.text}
              </button>
            ))}
          </div>
        </div>

        {/* Wellness Resources Panel */}
        {showWellnessPanel && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-purple-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
              <Heart className="w-4 h-4 text-pink-500" />
              Immediate Wellness Support
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {wellnessResources.map((resource, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(`Tell me about ${resource.text}`, true)}
                  className={`text-xs p-2 rounded border text-left hover:shadow-sm transition-all ${
                    resource.priority === 'urgent' 
                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                  }`}
                  disabled={isTyping}
                >
                  {resource.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Input Area */}
      <div className="border-t bg-white p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          {/* Main Input Section */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isTyping ? "Maya is responding..." : "Share what's on your mind... Maya is here to listen 💙"}
              disabled={isTyping}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 pr-12"
            />
            
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleListening}
              disabled={isTyping}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors ${
                isListening 
                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              } ${isTyping ? 'opacity-50 cursor-not-allowed' : ''}`}
              title={isListening ? "Stop listening" : "Voice input"}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 flex items-center gap-2 ${
              !inputValue.trim() || isTyping
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-md hover:shadow-lg transform hover:scale-105'
            }`}
          >
            {isTyping ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span className="text-sm">Send</span>
              </>
            )}
          </button>
        </form>

        {/* Input Helper Text */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>✨ Safe space for sharing</span>
            <span>🤗 No judgment here</span>
            <span>💪 You're doing great!</span>
          </div>
          {currentAnonymous && (
            <span className="flex items-center gap-1 text-purple-600">
              <Shield className="w-3 h-3" />
              Anonymous mode active
            </span>
          )}
        </div>
      </div>
    </div>
  );
}