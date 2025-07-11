import React, { useState, useEffect, useRef } from 'react';
import { Send, Heart, Phone, MapPin, Globe, Target, AlertTriangle } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { HealthStats } from './components/HealthStats';
import { VoiceAssistant } from './components/VoiceAssistant';
import { SymptomChart } from './components/SymptomChart';
import { LoadingIndicator } from './components/LoadingIndicator';
import { UrgencyAlert } from './components/UrgencyAlert';
import { ExportSummary } from './components/ExportSummary';
import { MedicalNER } from './utils/medicalNER';
import { MedicalKnowledgeBase } from './utils/medicalKnowledge';
import { ConversationMemory } from './utils/conversationMemory';
import { HealthcareFinder } from './utils/healthcareFinder';
import { MedicationRecommendations } from './utils/medicationRecommendations';
import { Message, Symptom, ConversationContext } from './types/medical';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingType, setLoadingType] = useState<'thinking' | 'analyzing' | 'searching'>('thinking');
  const [currentSymptoms, setCurrentSymptoms] = useState<Symptom[]>([]);
  const [conversationStep, setConversationStep] = useState<'initial' | 'gathering' | 'analyzing' | 'results' | 'followup'>('initial');
  const [isListening, setIsListening] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState<'low' | 'medium' | 'high' | 'emergency'>('low');
  const [disclaimerShown, setDisclaimerShown] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Initialize with welcome message
    if (!disclaimerShown) {
      addMessage(
        "Hello! I'm your AI Health Assistant, supporting UN SDG 3 - Good Health and Well-being. I can help you understand your symptoms and provide preliminary health insights.\n\n⚠️ **IMPORTANT:** This is not medical advice - always consult with a healthcare professional for proper diagnosis and treatment.\n\nHow are you feeling today? Please describe your symptoms in your own words.",
        false,
        'disclaimer'
      );
      setDisclaimerShown(true);
      ConversationMemory.addDiscussedTopic('disclaimer-shown');
    }
  }, [disclaimerShown]);

  const addMessage = (text: string, isUser: boolean, type?: Message['type'], urgencyLevel?: Message['urgencyLevel']) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      isUser,
      timestamp: new Date(),
      type,
      urgencyLevel
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback: () => void, delay: number = 1500, type: 'thinking' | 'analyzing' | 'searching' = 'thinking') => {
    setIsTyping(true);
    setLoadingType(type);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleFindHealthcare = async () => {
    await findHealthcareProviders();
  };

  const findHealthcareProviders = async (location?: string) => {
    setIsTyping(true);
    setLoadingType('searching');
    
    try {
      // Try to get user's location if not provided
      let searchLocation = location;
      if (!searchLocation) {
        const userLocation = await HealthcareFinder.getUserLocation();
        if (userLocation?.city) {
          searchLocation = userLocation.city;
        }
      }
      
      const providers = await HealthcareFinder.findNearbyProviders(
        urgencyLevel, 
        searchLocation
      );
      const providerList = HealthcareFinder.formatProviderList(providers, searchLocation);
      
      setIsTyping(false);
      addMessage(providerList, false, 'recommendation');
      
      // Add follow-up message
      setTimeout(() => {
        addMessage(
          "Would you like me to:\n• Find more healthcare facilities in a different area?\n• Help you with specific medical specialties?\n• Provide emergency contact information?",
          false,
          'followup'
        );
      }, 1000);
      
    } catch (error) {
      setIsTyping(false);
      addMessage(
        `I'm having trouble finding healthcare providers${location ? ` in ${location}` : ' in your area'}. Please try:\n• Searching online for 'hospitals near me'\n• Calling your local emergency services\n• Contacting your insurance provider\n• Using your local healthcare directory`,
        false,
        'recommendation'
      );
    }
  };

  const processUserInput = (input: string) => {
    // Extract symptoms using advanced NER
    const extractedSymptoms = MedicalNER.extractSymptoms(input);
    const newUrgencyLevel = MedicalNER.assessUrgency(extractedSymptoms, input);
    
    // Extract location for healthcare finder
    const extractedLocation = HealthcareFinder.extractLocationFromText(input);
    
    // Update conversation memory
    ConversationMemory.updateContext(extractedSymptoms, newUrgencyLevel);
    
    // Update state
    if (extractedSymptoms.length > 0) {
      setCurrentSymptoms(prev => {
        const existingNames = prev.map(s => s.name);
        const newSymptoms = extractedSymptoms.filter(s => !existingNames.includes(s.name));
        return [...prev, ...newSymptoms];
      });
    }
    
    setUrgencyLevel(newUrgencyLevel);
    
    return { extractedSymptoms, newUrgencyLevel, extractedLocation };
  };

  const generateAIResponse = (extractedSymptoms: Symptom[], input: string, extractedLocation?: string | null) => {
    const context = ConversationMemory.getContext();
    const contextualIntro = ConversationMemory.generateContextualResponse(extractedSymptoms);
    const lowerInput = input.toLowerCase();
    
    // Check for healthcare finder requests
    const isHealthcareRequest = 
      lowerInput.includes('find') && (
        lowerInput.includes('hospital') || 
        lowerInput.includes('doctor') || 
        lowerInput.includes('clinic') || 
        lowerInput.includes('healthcare') ||
        lowerInput.includes('medical center') ||
        lowerInput.includes('pharmacy')
      );
    
    // Check for medication requests
    const isMedicationRequest = 
      lowerInput.includes('medicine') || 
      lowerInput.includes('medication') || 
      lowerInput.includes('drug') || 
      lowerInput.includes('treatment') ||
      lowerInput.includes('paracetamol') ||
      lowerInput.includes('panadol') ||
      lowerInput.includes('what should i take');
    
    if (isHealthcareRequest) {
      findHealthcareProviders(extractedLocation || undefined);
      return;
    }
    
    if (isMedicationRequest && (extractedSymptoms.length > 0 || currentSymptoms.length > 0)) {
      provideMedicationRecommendations([...currentSymptoms, ...extractedSymptoms]);
      return;
    }
    
    if (extractedSymptoms.length > 0) {
      setConversationStep('analyzing');
      
      simulateTyping(() => {
        // Acknowledge symptoms with context
        let response = contextualIntro;
        response += `I've identified these symptoms: ${extractedSymptoms.map(s => s.name).join(', ')}. `;
        
        // Add severity and duration info
        const severeSymptoms = extractedSymptoms.filter(s => s.severity === 'severe');
        if (severeSymptoms.length > 0) {
          response += `I notice you described ${severeSymptoms.map(s => s.name).join(', ')} as severe. `;
        }
        
        response += "Let me analyze this information and provide some insights.";
        addMessage(response, false, 'symptom');
        
        // Generate follow-up questions
        const questions = ConversationMemory.generateFollowUpQuestions([...currentSymptoms, ...extractedSymptoms]);
        setFollowUpQuestions(questions);
        
        // Provide medical analysis after a delay
        setTimeout(() => {
          provideMedicalAnalysis([...currentSymptoms, ...extractedSymptoms]);
        }, 2000);
        
      }, 1500, 'analyzing');
      
    } else if (conversationStep === 'initial') {
      simulateTyping(() => {
        addMessage(
          "I'd like to help you understand your symptoms better. Please describe what you're experiencing in detail. For example:\n\n• 'I have a severe headache and feel nauseous for 2 days'\n• 'I've been coughing with a sore throat since yesterday'\n• 'My stomach hurts and I feel dizzy when I stand up'\n\nI can also help you:\n• Find healthcare facilities in Kenya\n• Recommend appropriate medications\n• Provide health guidance\n\nThe more specific you are about your symptoms, their severity, and duration, the better I can assist you.",
          false
        );
      });
    } else {
      // Handle follow-up responses
      simulateTyping(() => {
        let response = contextualIntro;
        
        if (followUpQuestions.length > 0) {
          response += "Thank you for the additional information. ";
          
          // Ask follow-up questions
          if (followUpQuestions.length > 0) {
            response += `\n\n${followUpQuestions[0]}`;
            setFollowUpQuestions(prev => prev.slice(1));
          }
        } else {
          response += "Is there anything else about your symptoms you'd like to discuss, or would you like me to help you find healthcare providers in your area?";
        }
        
        addMessage(response, false, 'followup');
      });
    }
  };

  const provideMedicalAnalysis = (allSymptoms: Symptom[]) => {
    setLoadingType('analyzing');
    setIsTyping(true);
    
    setTimeout(() => {
      const diagnoses = MedicalKnowledgeBase.diagnoseConditions(allSymptoms);
      const personalizedAdvice = MedicalKnowledgeBase.generatePersonalizedAdvice(allSymptoms, ConversationMemory.getContext());
      
      setIsTyping(false);
      setConversationStep('results');
      
      if (diagnoses.length > 0) {
        diagnoses.forEach((diagnosis, index) => {
          setTimeout(() => {
            let analysisText = `**${diagnosis.condition}** (${diagnosis.likelihood}% likelihood)\n\n`;
            analysisText += `${diagnosis.description}\n\n`;
            analysisText += `**Recommendations:**\n${diagnosis.recommendations.map(r => `• ${r}`).join('\n')}\n\n`;
            analysisText += `**When to seek care:**\n${diagnosis.whenToSeekCare.map(w => `• ${w}`).join('\n')}`;
            
            addMessage(analysisText, false, 'diagnosis', diagnosis.urgency);
          }, index * 1000);
        });
        
        // Add personalized advice
        if (personalizedAdvice.length > 0) {
          setTimeout(() => {
            const adviceText = `**Personalized Insights:**\n${personalizedAdvice.map(a => `• ${a}`).join('\n')}`;
            addMessage(adviceText, false, 'recommendation');
          }, diagnoses.length * 1000);
        }
        
        // Offer next steps
        setTimeout(() => {
          addMessage(
            "Would you like me to:\n• Recommend appropriate medications available in Kenya?\n• Help you find nearby healthcare facilities or pharmacies?\n• Provide more information about any of these conditions?\n• Export this consultation summary for your doctor?",
            false,
            'recommendation'
          );
        }, (diagnoses.length + 1) * 1000);
        
      } else {
        addMessage(
          "Based on the symptoms you've described, I recommend monitoring your condition and considering a consultation with a healthcare provider if symptoms persist or worsen.\n\nWould you like me to help you find nearby healthcare facilities?",
          false,
          'recommendation'
        );
      }
    }, 2000);
  };

  const provideMedicationRecommendations = (allSymptoms: Symptom[]) => {
    setLoadingType('analyzing');
    setIsTyping(true);
    
    setTimeout(() => {
      const diagnoses = MedicalKnowledgeBase.diagnoseConditions(allSymptoms);
      const medicationRecommendations = MedicalKnowledgeBase.getMedicationRecommendations(allSymptoms, diagnoses);
      
      setIsTyping(false);
      
      addMessage(medicationRecommendations, false, 'recommendation');
      
      // Add follow-up about where to buy
      setTimeout(() => {
        addMessage(
          "Would you like me to help you find nearby pharmacies in Kenya where you can purchase these medications?",
          false,
          'followup'
        );
      }, 1500);
      
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    addMessage(inputText, true);
    const { extractedSymptoms, extractedLocation } = processUserInput(inputText);
    
    // Check for specific requests
    const lowerInput = inputText.toLowerCase();
    
    // Healthcare finder requests
    if (lowerInput.includes('find') && (
      lowerInput.includes('hospital') || 
      lowerInput.includes('doctor') || 
      lowerInput.includes('clinic') || 
      lowerInput.includes('healthcare') ||
      lowerInput.includes('medical center') ||
      lowerInput.includes('pharmacy')
    )) {
      findHealthcareProviders(extractedLocation || undefined);
    } else if (lowerInput.includes('export') || lowerInput.includes('summary') || lowerInput.includes('download')) {
      addMessage(
        "You can export your consultation summary using the 'Export Consultation' section in the sidebar. This will create a detailed report you can share with your healthcare provider.",
        false,
        'recommendation'
      );
    } else if (lowerInput.includes('medicine') || lowerInput.includes('medication') || lowerInput.includes('what should i take')) {
      if (currentSymptoms.length > 0) {
        provideMedicationRecommendations(currentSymptoms);
      } else {
        addMessage(
          "I'd be happy to recommend medications, but I need to understand your symptoms first. Please describe what you're experiencing, and I'll suggest appropriate treatments available in Kenya.",
          false,
          'recommendation'
        );
      }
    } else {
      generateAIResponse(extractedSymptoms, inputText, extractedLocation);
    }

    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = (text: string) => {
    setInputText(text);
  };

  const handleEmergencyCall = () => {
    if (urgencyLevel === 'emergency') {
      window.open('tel:911');
    } else {
      handleFindHealthcare();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-teal-50">
      {/* Header with SDG 3 Branding */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    AI Health Assistant
                  </h1>
                  <p className="text-sm text-gray-600">Supporting UN SDG 3 - Good Health and Well-being</p>
                </div>
              </div>
            </div>
            
            {/* SDG 3 Badge */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full border border-green-200">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm font-semibold text-green-700">SDG 3</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Globe className="w-4 h-4" />
                <span>Global Health Impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Urgency Alert */}
      {urgencyLevel !== 'low' && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <UrgencyAlert 
            urgencyLevel={urgencyLevel}
            symptoms={currentSymptoms.map(s => s.name)}
            onEmergencyCall={handleEmergencyCall}
          />
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 h-[85vh] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-700">AI Health Assistant Online</span>
                    {urgencyLevel !== 'low' && (
                      <div className="flex items-center space-x-1 text-xs text-red-600">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="uppercase font-semibold">{urgencyLevel} Priority</span>
                      </div>
                    )}
                  </div>
                  <VoiceAssistant
                    onVoiceInput={handleVoiceInput}
                    isListening={isListening}
                    setIsListening={setIsListening}
                  />
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {/* Loading indicator */}
                {isTyping && (
                  <LoadingIndicator 
                    message={
                      loadingType === 'analyzing' ? 'Analyzing your symptoms...' :
                      loadingType === 'searching' ? 'Finding healthcare providers...' :
                      'AI is thinking...'
                    }
                    type={loadingType}
                  />
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-100 p-4 bg-gray-50 rounded-b-2xl">
                <div className="flex space-x-3">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your symptoms in detail (e.g., 'I have a severe headache for 2 days with nausea')..."
                    className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none bg-white"
                    rows={2}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats, Tips, and Charts */}
          <div className="space-y-6">
            {/* Health Stats */}
            <HealthStats />
            
            {/* Symptom Chart */}
            <SymptomChart symptoms={currentSymptoms} />
            
            {/* Export Summary */}
            <ExportSummary 
              messages={messages}
              symptoms={currentSymptoms}
              context={ConversationMemory.getContext()}
            />
          </div>
        </div>

        {/* Bottom Section - Emergency Contacts and Healthcare Finder */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Phone className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="font-medium text-red-900">Emergency Services</span>
                <a href="tel:999" className="text-lg font-bold text-red-600 hover:text-red-700">999</a>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="font-medium text-orange-900">St. John Ambulance</span>
                <a href="tel:+254202725272" className="text-lg font-bold text-orange-600 hover:text-orange-700">020 2725272</a>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="font-medium text-purple-900">Kenya Red Cross</span>
                <a href="tel:1199" className="text-lg font-bold text-purple-600 hover:text-purple-700">1199</a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Find Healthcare</h3>
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleFindHealthcare}
                className="w-full text-left p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <span className="text-blue-700 font-medium">🏥 Find hospitals in Kenya</span>
              </button>
              <button 
                onClick={handleFindHealthcare}
                className="w-full text-left p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
              >
                <span className="text-green-700 font-medium">💊 Find pharmacies in Kenya</span>
              </button>
              <button 
                onClick={handleFindHealthcare}
                className="w-full text-left p-3 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <span className="text-purple-700 font-medium">🚑 Emergency services</span>
              </button>
            </div>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-900 mb-2">Important Medical Disclaimer</h3>
              <p className="text-sm text-red-800 leading-relaxed">
                This AI Health Assistant provides general health information and preliminary insights only. 
                It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek advice 
                from qualified healthcare providers for medical concerns. Never disregard professional medical advice 
                or delay seeking treatment because of information provided by this tool. In medical emergencies, call 999 (Kenya) immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;