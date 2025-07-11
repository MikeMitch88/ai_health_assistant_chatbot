import { Symptom } from '../types/medical';

// Comprehensive medical NER system
export class MedicalNER {
  private static symptomDatabase = {
    // Neurological symptoms
    headache: {
      aliases: ['head pain', 'migraine', 'tension headache', 'cluster headache', 'head ache'],
      bodyPart: 'head',
      category: 'neurological'
    },
    dizziness: {
      aliases: ['dizzy', 'lightheaded', 'vertigo', 'spinning sensation', 'unsteady'],
      bodyPart: 'head',
      category: 'neurological'
    },
    confusion: {
      aliases: ['confused', 'disoriented', 'memory problems', 'brain fog'],
      bodyPart: 'head',
      category: 'neurological'
    },
    numbness: {
      aliases: ['numb', 'tingling', 'pins and needles', 'loss of sensation'],
      bodyPart: 'limbs',
      category: 'neurological'
    },
    
    // Respiratory symptoms
    cough: {
      aliases: ['coughing', 'dry cough', 'wet cough', 'persistent cough', 'hacking cough'],
      bodyPart: 'chest',
      category: 'respiratory'
    },
    'shortness of breath': {
      aliases: ['breathless', 'difficulty breathing', 'can\'t breathe', 'winded', 'dyspnea'],
      bodyPart: 'chest',
      category: 'respiratory'
    },
    'chest pain': {
      aliases: ['chest ache', 'chest tightness', 'chest pressure', 'heart pain'],
      bodyPart: 'chest',
      category: 'respiratory'
    },
    wheezing: {
      aliases: ['whistling breath', 'noisy breathing'],
      bodyPart: 'chest',
      category: 'respiratory'
    },
    
    // Gastrointestinal symptoms
    nausea: {
      aliases: ['nauseated', 'queasy', 'sick to stomach', 'feeling sick'],
      bodyPart: 'abdomen',
      category: 'gastrointestinal'
    },
    vomiting: {
      aliases: ['throwing up', 'puking', 'being sick', 'retching'],
      bodyPart: 'abdomen',
      category: 'gastrointestinal'
    },
    'stomach ache': {
      aliases: ['stomach pain', 'belly ache', 'tummy ache', 'gastric pain'],
      bodyPart: 'abdomen',
      category: 'gastrointestinal'
    },
    diarrhea: {
      aliases: ['loose stools', 'watery stools', 'frequent bowel movements'],
      bodyPart: 'abdomen',
      category: 'gastrointestinal'
    },
    constipation: {
      aliases: ['can\'t poop', 'hard stools', 'difficulty passing stool'],
      bodyPart: 'abdomen',
      category: 'gastrointestinal'
    },
    
    // General symptoms
    fever: {
      aliases: ['high temperature', 'hot', 'burning up', 'feverish', 'pyrexia'],
      bodyPart: 'general',
      category: 'general'
    },
    fatigue: {
      aliases: ['tired', 'exhausted', 'weak', 'drained', 'no energy'],
      bodyPart: 'general',
      category: 'general'
    },
    chills: {
      aliases: ['shivering', 'cold', 'shaking', 'goosebumps'],
      bodyPart: 'general',
      category: 'general'
    },
    'joint pain': {
      aliases: ['aching joints', 'stiff joints', 'joint stiffness', 'arthritis pain'],
      bodyPart: 'joints',
      category: 'musculoskeletal'
    },
    'muscle ache': {
      aliases: ['muscle pain', 'sore muscles', 'muscle soreness', 'myalgia'],
      bodyPart: 'muscles',
      category: 'musculoskeletal'
    },
    
    // ENT symptoms
    'sore throat': {
      aliases: ['throat pain', 'scratchy throat', 'throat irritation'],
      bodyPart: 'throat',
      category: 'ent'
    },
    'runny nose': {
      aliases: ['nasal discharge', 'stuffy nose', 'congestion', 'blocked nose'],
      bodyPart: 'nose',
      category: 'ent'
    },
    'ear pain': {
      aliases: ['earache', 'ear infection', 'ear discomfort'],
      bodyPart: 'ear',
      category: 'ent'
    }
  };

  private static severityKeywords = {
    mild: ['slight', 'minor', 'light', 'mild', 'a little', 'barely', 'somewhat'],
    moderate: ['moderate', 'medium', 'noticeable', 'some', 'fairly', 'quite', 'decent'],
    severe: ['severe', 'intense', 'sharp', 'strong', 'terrible', 'awful', 'extreme', 'unbearable', 'excruciating']
  };

  private static durationKeywords = {
    acute: ['suddenly', 'just started', 'this morning', 'today', 'few hours'],
    subacute: ['yesterday', 'couple days', 'few days', 'this week'],
    chronic: ['weeks', 'months', 'long time', 'always', 'chronic']
  };

  private static urgencyKeywords = {
    emergency: [
      'can\'t breathe', 'chest pain', 'severe headache', 'unconscious', 'bleeding heavily',
      'severe abdominal pain', 'difficulty breathing', 'heart attack', 'stroke symptoms',
      'severe allergic reaction', 'high fever with stiff neck'
    ],
    high: [
      'severe pain', 'high fever', 'persistent vomiting', 'severe dizziness',
      'difficulty swallowing', 'severe fatigue', 'unexplained weight loss'
    ]
  };

  static extractSymptoms(text: string): Symptom[] {
    const symptoms: Symptom[] = [];
    const lowerText = text.toLowerCase();
    const processedSymptoms = new Set<string>();

    // Extract symptoms using NER
    Object.entries(this.symptomDatabase).forEach(([symptomName, symptomData]) => {
      const allTerms = [symptomName, ...symptomData.aliases];
      
      for (const term of allTerms) {
        if (lowerText.includes(term.toLowerCase()) && !processedSymptoms.has(symptomName)) {
          const severity = this.extractSeverity(text, term);
          const duration = this.extractDuration(text);
          const onset = this.extractOnset(text);
          
          symptoms.push({
            id: `${Date.now()}-${Math.random()}`,
            name: symptomName,
            severity,
            duration,
            bodyPart: symptomData.bodyPart,
            onset
          });
          
          processedSymptoms.add(symptomName);
          break;
        }
      }
    });

    return symptoms;
  }

  private static extractSeverity(text: string, symptom: string): 'mild' | 'moderate' | 'severe' {
    const lowerText = text.toLowerCase();
    const symptomIndex = lowerText.indexOf(symptom.toLowerCase());
    
    // Look for severity keywords near the symptom
    const contextWindow = lowerText.substring(
      Math.max(0, symptomIndex - 50),
      Math.min(lowerText.length, symptomIndex + symptom.length + 50)
    );

    for (const [level, keywords] of Object.entries(this.severityKeywords)) {
      if (keywords.some(keyword => contextWindow.includes(keyword))) {
        return level as 'mild' | 'moderate' | 'severe';
      }
    }

    return 'moderate'; // default
  }

  private static extractDuration(text: string): string | undefined {
    const lowerText = text.toLowerCase();
    
    const durationPatterns = [
      /(\d+)\s*(hour|hours|hr|hrs)/,
      /(\d+)\s*(day|days)/,
      /(\d+)\s*(week|weeks)/,
      /(\d+)\s*(month|months)/,
      /(yesterday|today|this morning|last night)/,
      /(few hours|couple hours|several hours)/,
      /(few days|couple days|several days)/,
      /(few weeks|couple weeks|several weeks)/
    ];

    for (const pattern of durationPatterns) {
      const match = lowerText.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return undefined;
  }

  private static extractOnset(text: string): string | undefined {
    const lowerText = text.toLowerCase();
    
    const onsetPatterns = [
      'suddenly', 'gradually', 'slowly', 'quickly', 'immediately',
      'this morning', 'last night', 'after eating', 'when I woke up'
    ];

    for (const pattern of onsetPatterns) {
      if (lowerText.includes(pattern)) {
        return pattern;
      }
    }

    return undefined;
  }

  static assessUrgency(symptoms: Symptom[], text: string): 'low' | 'medium' | 'high' | 'emergency' {
    const lowerText = text.toLowerCase();

    // Check for emergency keywords
    if (this.urgencyKeywords.emergency.some(keyword => lowerText.includes(keyword))) {
      return 'emergency';
    }

    // Check for high urgency keywords
    if (this.urgencyKeywords.high.some(keyword => lowerText.includes(keyword))) {
      return 'high';
    }

    // Check symptom combinations for urgency
    const symptomNames = symptoms.map(s => s.name);
    
    // Emergency combinations
    if (symptomNames.includes('chest pain') && symptomNames.includes('shortness of breath')) {
      return 'emergency';
    }
    
    if (symptomNames.includes('severe headache') && symptomNames.includes('fever')) {
      return 'emergency';
    }

    // High urgency combinations
    if (symptoms.some(s => s.severity === 'severe')) {
      return 'high';
    }

    if (symptoms.length >= 4) {
      return 'medium';
    }

    return 'low';
  }
}