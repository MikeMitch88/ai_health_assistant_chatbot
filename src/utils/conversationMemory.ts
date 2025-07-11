import { ConversationContext, Symptom, Message } from '../types/medical';

export class ConversationMemory {
  private static context: ConversationContext = {
    previousSymptoms: [],
    discussedTopics: [],
    urgencyLevel: 'low',
    lastSymptomUpdate: new Date()
  };

  static updateContext(symptoms: Symptom[], urgencyLevel: 'low' | 'medium' | 'high' | 'emergency'): void {
    // Merge new symptoms with existing ones, avoiding duplicates
    const existingSymptomNames = this.context.previousSymptoms.map(s => s.name);
    const newSymptoms = symptoms.filter(s => !existingSymptomNames.includes(s.name));
    
    this.context.previousSymptoms = [...this.context.previousSymptoms, ...newSymptoms];
    this.context.urgencyLevel = urgencyLevel;
    this.context.lastSymptomUpdate = new Date();
  }

  static addDiscussedTopic(topic: string): void {
    if (!this.context.discussedTopics.includes(topic)) {
      this.context.discussedTopics.push(topic);
    }
  }

  static getContext(): ConversationContext {
    return { ...this.context };
  }

  static generateContextualResponse(newSymptoms: Symptom[]): string {
    const context = this.getContext();
    const responses: string[] = [];

    // Reference previous symptoms
    if (context.previousSymptoms.length > 0) {
      const previousSymptomNames = context.previousSymptoms.map(s => s.name);
      const newSymptomNames = newSymptoms.map(s => s.name);
      
      // Check for symptom progression
      const commonSymptoms = previousSymptomNames.filter(name => 
        newSymptomNames.includes(name)
      );

      if (commonSymptoms.length > 0) {
        responses.push(`I see you're still experiencing ${commonSymptoms.join(', ')}. `);
        
        // Check if symptoms are worsening
        const previousSeverity = context.previousSymptoms.find(s => commonSymptoms.includes(s.name))?.severity;
        const currentSeverity = newSymptoms.find(s => commonSymptoms.includes(s.name))?.severity;
        
        if (previousSeverity && currentSeverity && this.compareSeverity(currentSeverity, previousSeverity) > 0) {
          responses.push(`It sounds like your symptoms may be getting worse. `);
        }
      }

      // Identify new symptoms
      const trulyNewSymptoms = newSymptomNames.filter(name => 
        !previousSymptomNames.includes(name)
      );

      if (trulyNewSymptoms.length > 0) {
        responses.push(`I notice you're now also experiencing ${trulyNewSymptoms.join(', ')}. `);
      }
    }

    // Time-based context
    const timeSinceLastUpdate = Date.now() - context.lastSymptomUpdate.getTime();
    const hoursSince = timeSinceLastUpdate / (1000 * 60 * 60);

    if (hoursSince > 24) {
      responses.push(`Since it's been over a day since we last talked, `);
    } else if (hoursSince > 4) {
      responses.push(`Since we spoke earlier today, `);
    }

    return responses.join('');
  }

  private static compareSeverity(current: string, previous: string): number {
    const severityOrder = { 'mild': 1, 'moderate': 2, 'severe': 3 };
    return severityOrder[current as keyof typeof severityOrder] - 
           severityOrder[previous as keyof typeof severityOrder];
  }

  static generateFollowUpQuestions(symptoms: Symptom[]): string[] {
    const context = this.getContext();
    const questions: string[] = [];

    // Ask about symptom changes
    if (context.previousSymptoms.length > 0) {
      const previousSymptomNames = context.previousSymptoms.map(s => s.name);
      const currentSymptomNames = symptoms.map(s => s.name);
      
      const resolvedSymptoms = previousSymptomNames.filter(name => 
        !currentSymptomNames.includes(name)
      );

      if (resolvedSymptoms.length > 0) {
        questions.push(`Has your ${resolvedSymptoms[0]} improved or resolved?`);
      }
    }

    // Duration-specific questions
    const chronicSymptoms = symptoms.filter(s => 
      s.duration && (s.duration.includes('week') || s.duration.includes('month'))
    );

    if (chronicSymptoms.length > 0 && !context.discussedTopics.includes('chronic-care')) {
      questions.push(`Since you've had ${chronicSymptoms[0].name} for ${chronicSymptoms[0].duration}, have you seen a healthcare provider about this?`);
    }

    return questions.slice(0, 2); // Limit to 2 questions
  }

  static shouldShowDisclaimer(): boolean {
    return this.context.discussedTopics.length === 0 || 
           !this.context.discussedTopics.includes('disclaimer-shown');
  }

  static reset(): void {
    this.context = {
      previousSymptoms: [],
      discussedTopics: [],
      urgencyLevel: 'low',
      lastSymptomUpdate: new Date()
    };
  }
}