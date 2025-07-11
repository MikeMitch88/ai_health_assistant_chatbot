export interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration?: string;
  bodyPart?: string;
  onset?: string;
  frequency?: string;
  triggers?: string[];
  alleviatingFactors?: string[];
}

export interface MedicalCondition {
  id: string;
  name: string;
  likelihood: number;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  symptoms: string[];
  recommendations: string[];
  whenToSeekCare: string[];
  riskFactors?: string[];
}

export interface ConversationContext {
  patientAge?: number;
  patientGender?: string;
  chronicConditions?: string[];
  medications?: string[];
  allergies?: string[];
  previousSymptoms: Symptom[];
  discussedTopics: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  lastSymptomUpdate: Date;
}

export interface HealthcareProvider {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'urgent_care' | 'pharmacy';
  address: string;
  phone: string;
  distance?: number;
  rating?: number;
  specialties?: string[];
  emergencyServices?: boolean;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'symptom' | 'diagnosis' | 'recommendation' | 'disclaimer' | 'urgency' | 'followup' | 'summary';
  urgencyLevel?: 'low' | 'medium' | 'high' | 'emergency';
  relatedSymptoms?: string[];
}