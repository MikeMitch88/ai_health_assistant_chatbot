import { MedicalCondition, Symptom } from '../types/medical';
import { MedicationRecommendations } from './medicationRecommendations';

export class MedicalKnowledgeBase {
  private static conditions: MedicalCondition[] = [
    {
      id: 'upper-respiratory-infection',
      name: 'Upper Respiratory Infection',
      likelihood: 0,
      description: 'A viral or bacterial infection affecting the nose, throat, and upper airways.',
      urgency: 'low',
      symptoms: ['cough', 'sore throat', 'runny nose', 'fever', 'fatigue'],
      recommendations: [
        'Get plenty of rest and stay well-hydrated',
        'Use throat lozenges or warm salt water gargles',
        'Consider over-the-counter pain relievers',
        'Use a humidifier to ease congestion'
      ],
      whenToSeekCare: [
        'Symptoms persist longer than 10 days',
        'High fever (over 101.3°F/38.5°C)',
        'Severe headache or sinus pain',
        'Difficulty breathing or swallowing'
      ]
    },
    {
      id: 'migraine',
      name: 'Migraine Headache',
      likelihood: 0,
      description: 'A neurological condition causing intense headaches often accompanied by nausea and sensitivity to light.',
      urgency: 'medium',
      symptoms: ['headache', 'nausea', 'dizziness', 'fatigue'],
      recommendations: [
        'Rest in a quiet, dark room',
        'Apply cold or warm compress to head',
        'Stay hydrated and maintain regular sleep',
        'Avoid known triggers (stress, certain foods)'
      ],
      whenToSeekCare: [
        'Sudden, severe headache unlike any before',
        'Headache with fever, stiff neck, or rash',
        'Headache after head injury',
        'Progressive worsening of headaches'
      ]
    },
    {
      id: 'gastroenteritis',
      name: 'Gastroenteritis',
      likelihood: 0,
      description: 'Inflammation of the stomach and intestines, usually caused by viral or bacterial infection.',
      urgency: 'medium',
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'stomach ache', 'fever'],
      recommendations: [
        'Stay hydrated with clear fluids',
        'Follow BRAT diet (bananas, rice, applesauce, toast)',
        'Rest and avoid dairy temporarily',
        'Consider probiotics after symptoms improve'
      ],
      whenToSeekCare: [
        'Signs of severe dehydration',
        'Blood in vomit or stool',
        'High fever with severe abdominal pain',
        'Symptoms persist longer than 3 days'
      ]
    },
    {
      id: 'anxiety-disorder',
      name: 'Anxiety-Related Symptoms',
      likelihood: 0,
      description: 'Physical symptoms that can occur due to anxiety or stress responses.',
      urgency: 'low',
      symptoms: ['dizziness', 'chest pain', 'shortness of breath', 'fatigue', 'nausea'],
      recommendations: [
        'Practice deep breathing exercises',
        'Try relaxation techniques or meditation',
        'Regular exercise and adequate sleep',
        'Consider speaking with a mental health professional'
      ],
      whenToSeekCare: [
        'Symptoms interfere with daily activities',
        'Panic attacks become frequent',
        'Physical symptoms are severe or persistent',
        'Thoughts of self-harm'
      ]
    },
    {
      id: 'dehydration',
      name: 'Dehydration',
      likelihood: 0,
      description: 'Condition caused by losing more fluids than you take in.',
      urgency: 'medium',
      symptoms: ['dizziness', 'fatigue', 'headache', 'nausea'],
      recommendations: [
        'Increase fluid intake gradually',
        'Drink electrolyte solutions',
        'Rest in a cool environment',
        'Avoid alcohol and caffeine'
      ],
      whenToSeekCare: [
        'Severe dizziness or fainting',
        'No urination for 8+ hours',
        'Rapid heartbeat or breathing',
        'Confusion or irritability'
      ]
    },
    {
      id: 'heart-attack',
      name: 'Possible Heart Attack',
      likelihood: 0,
      description: 'A medical emergency where blood flow to the heart is blocked.',
      urgency: 'emergency',
      symptoms: ['chest pain', 'shortness of breath', 'nausea', 'dizziness'],
      recommendations: [
        'Call 911 immediately',
        'Chew aspirin if not allergic',
        'Stay calm and rest',
        'Do not drive yourself to hospital'
      ],
      whenToSeekCare: [
        'Immediate emergency care required',
        'Call 911 now'
      ]
    }
  ];

  static diagnoseConditions(symptoms: Symptom[]): MedicalCondition[] {
    const symptomNames = symptoms.map(s => s.name);
    const diagnoses: MedicalCondition[] = [];

    for (const condition of this.conditions) {
      const matchingSymptoms = condition.symptoms.filter(s => 
        symptomNames.includes(s)
      );
      
      if (matchingSymptoms.length > 0) {
        const likelihood = (matchingSymptoms.length / condition.symptoms.length) * 100;
        
        // Adjust likelihood based on symptom severity
        const severityMultiplier = symptoms.some(s => s.severity === 'severe') ? 1.2 : 
                                 symptoms.some(s => s.severity === 'moderate') ? 1.0 : 0.8;
        
        const adjustedLikelihood = Math.min(95, likelihood * severityMultiplier);
        
        if (adjustedLikelihood >= 30) { // Only include if reasonable match
          diagnoses.push({
            ...condition,
            likelihood: Math.round(adjustedLikelihood)
          });
        }
      }
    }

    return diagnoses.sort((a, b) => b.likelihood - a.likelihood);
  }

  static getMedicationRecommendations(symptoms: Symptom[], conditions: MedicalCondition[]): string {
    const medications = MedicationRecommendations.getMedicationRecommendations(symptoms, conditions);
    return MedicationRecommendations.formatMedicationRecommendations(medications);
  }

  static getFollowUpQuestions(symptoms: Symptom[], previousQuestions: string[]): string[] {
    const questions: string[] = [];
    const symptomNames = symptoms.map(s => s.name);

    // Duration-based questions
    if (symptoms.some(s => !s.duration)) {
      questions.push("How long have you been experiencing these symptoms?");
    }

    // Severity clarification
    if (symptoms.some(s => s.severity === 'moderate')) {
      questions.push("On a scale of 1-10, how would you rate your pain or discomfort?");
    }

    // Specific symptom follow-ups
    if (symptomNames.includes('headache') && !previousQuestions.includes('headache-location')) {
      questions.push("Where exactly is your headache located? (forehead, temples, back of head)");
    }

    if (symptomNames.includes('chest pain') && !previousQuestions.includes('chest-pain-type')) {
      questions.push("Can you describe your chest pain? Is it sharp, dull, crushing, or burning?");
    }

    if (symptomNames.includes('fever') && !previousQuestions.includes('fever-temp')) {
      questions.push("Have you taken your temperature? If so, what was it?");
    }

    // Associated symptoms
    if (symptomNames.includes('nausea') && !symptomNames.includes('vomiting')) {
      questions.push("Have you actually vomited, or just felt nauseous?");
    }

    return questions.filter(q => !previousQuestions.includes(q)).slice(0, 2);
  }

  static generatePersonalizedAdvice(symptoms: Symptom[], context: any): string[] {
    const advice: string[] = [];
    const symptomNames = symptoms.map(s => s.name);

    // Duration-based advice
    const chronicSymptoms = symptoms.filter(s => 
      s.duration && (s.duration.includes('week') || s.duration.includes('month'))
    );

    if (chronicSymptoms.length > 0) {
      advice.push(`Since you've had ${chronicSymptoms[0].name} for ${chronicSymptoms[0].duration}, it's important to consult with a healthcare provider for proper evaluation.`);
    }

    // Combination-based advice
    if (symptomNames.includes('headache') && symptomNames.includes('dizziness')) {
      advice.push("The combination of headache and dizziness could indicate several conditions. Consider checking your blood pressure and staying well-hydrated.");
    }

    if (symptomNames.includes('fatigue') && symptoms.length >= 3) {
      advice.push("Multiple symptoms with fatigue suggest your body may be fighting an infection or dealing with stress. Prioritize rest and nutrition.");
    }

    return advice;
  }
}