import { Symptom, MedicalCondition } from '../types/medical';

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  type: 'otc' | 'prescription' | 'herbal';
  dosage: string;
  frequency: string;
  duration: string;
  sideEffects: string[];
  contraindications: string[];
  availability: 'widely_available' | 'common' | 'prescription_only';
  estimatedCost: string;
  imageUrl?: string;
}

export class MedicationRecommendations {
  private static kenyaMedications: Record<string, Medication[]> = {
    // Pain and Fever
    'headache': [
      {
        id: 'paracetamol-kenya',
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        brandNames: ['Panadol', 'Hedex', 'Tylenol'],
        type: 'otc',
        dosage: '500mg-1000mg',
        frequency: 'Every 4-6 hours',
        duration: 'As needed, max 3 days',
        sideEffects: ['Rare allergic reactions', 'Liver damage with overdose'],
        contraindications: ['Liver disease', 'Alcohol dependency'],
        availability: 'widely_available',
        estimatedCost: 'KSh 50-150',
        imageUrl: '💊'
      },
      {
        id: 'ibuprofen-kenya',
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        brandNames: ['Brufen', 'Advil', 'Nurofen'],
        type: 'otc',
        dosage: '200mg-400mg',
        frequency: 'Every 6-8 hours',
        duration: 'As needed, max 3 days',
        sideEffects: ['Stomach upset', 'Dizziness', 'Heartburn'],
        contraindications: ['Stomach ulcers', 'Kidney disease', 'Heart conditions'],
        availability: 'widely_available',
        estimatedCost: 'KSh 80-200'
      }
    ],

    // Respiratory
    'cough': [
      {
        id: 'dextromethorphan-kenya',
        name: 'Cough Syrup',
        genericName: 'Dextromethorphan',
        brandNames: ['Benylin', 'Robitussin', 'Actifed'],
        type: 'otc',
        dosage: '15ml',
        frequency: 'Every 4 hours',
        duration: '5-7 days',
        sideEffects: ['Drowsiness', 'Dizziness', 'Nausea'],
        contraindications: ['Children under 6', 'Pregnancy (first trimester)'],
        availability: 'widely_available',
        estimatedCost: 'KSh 200-400',
        imageUrl: '🍯'
      },
      {
        id: 'honey-ginger-kenya',
        name: 'Honey & Ginger',
        genericName: 'Natural remedy',
        brandNames: ['Local honey', 'Fresh ginger'],
        type: 'herbal',
        dosage: '1 tablespoon honey + ginger tea',
        frequency: '2-3 times daily',
        duration: 'Until symptoms improve',
        sideEffects: ['Minimal', 'Possible allergic reaction to honey'],
        contraindications: ['Children under 1 year (honey)'],
        availability: 'widely_available',
        estimatedCost: 'KSh 100-300'
      }
    ],

    'sore throat': [
      {
        id: 'strepsils-kenya',
        name: 'Throat Lozenges',
        genericName: 'Antiseptic lozenges',
        brandNames: ['Strepsils', 'Tyrozets', 'Difflam'],
        type: 'otc',
        dosage: '1 lozenge',
        frequency: 'Every 2-3 hours',
        duration: '3-5 days',
        sideEffects: ['Mouth irritation', 'Temporary taste changes'],
        contraindications: ['Severe throat swelling'],
        availability: 'widely_available',
        estimatedCost: 'KSh 150-300'
      }
    ],

    // Gastrointestinal
    'nausea': [
      {
        id: 'ors-kenya',
        name: 'ORS (Oral Rehydration Salts)',
        genericName: 'Electrolyte solution',
        brandNames: ['WHO-ORS', 'Electrolade', 'Dioralyte'],
        type: 'otc',
        dosage: '1 sachet in 1 liter water',
        frequency: 'Sip frequently',
        duration: 'Until rehydrated',
        sideEffects: ['Minimal', 'Possible bloating'],
        contraindications: ['Severe kidney disease'],
        availability: 'widely_available',
        estimatedCost: 'KSh 20-50 per sachet',
        imageUrl: '💧'
      }
    ],

    'diarrhea': [
      {
        id: 'ors-diarrhea-kenya',
        name: 'ORS (Oral Rehydration Salts)',
        genericName: 'Electrolyte solution',
        brandNames: ['WHO-ORS', 'Electrolade'],
        type: 'otc',
        dosage: '1 sachet in 1 liter water',
        frequency: 'After each loose stool',
        duration: 'Until symptoms resolve',
        sideEffects: ['Minimal'],
        contraindications: ['Severe dehydration requiring IV fluids'],
        availability: 'widely_available',
        estimatedCost: 'KSh 20-50 per sachet'
      },
      {
        id: 'loperamide-kenya',
        name: 'Loperamide',
        genericName: 'Loperamide HCl',
        brandNames: ['Imodium', 'Lopex'],
        type: 'otc',
        dosage: '2mg initially, then 1mg after each loose stool',
        frequency: 'As needed',
        duration: 'Max 2 days',
        sideEffects: ['Constipation', 'Dizziness', 'Dry mouth'],
        contraindications: ['Bloody diarrhea', 'High fever', 'Children under 6'],
        availability: 'common',
        estimatedCost: 'KSh 300-500'
      }
    ],

    // Allergies
    'runny nose': [
      {
        id: 'piriton-kenya',
        name: 'Piriton',
        genericName: 'Chlorpheniramine',
        brandNames: ['Piriton', 'Allergex'],
        type: 'otc',
        dosage: '4mg',
        frequency: 'Every 4-6 hours',
        duration: 'As needed',
        sideEffects: ['Drowsiness', 'Dry mouth', 'Blurred vision'],
        contraindications: ['Glaucoma', 'Enlarged prostate', 'Severe asthma'],
        availability: 'widely_available',
        estimatedCost: 'KSh 100-250'
      }
    ],

    // Respiratory conditions
    'shortness of breath': [
      {
        id: 'ventolin-kenya',
        name: 'Ventolin Inhaler',
        genericName: 'Salbutamol',
        brandNames: ['Ventolin', 'Airomir', 'Asthalin'],
        type: 'prescription',
        dosage: '1-2 puffs',
        frequency: 'As needed for breathing difficulty',
        duration: 'As prescribed by doctor',
        sideEffects: ['Tremor', 'Rapid heartbeat', 'Headache'],
        contraindications: ['Heart rhythm disorders', 'Hyperthyroidism'],
        availability: 'prescription_only',
        estimatedCost: 'KSh 800-1500',
        imageUrl: '💨'
      }
    ]
  };

  static getMedicationRecommendations(symptoms: Symptom[], conditions: MedicalCondition[]): Medication[] {
    const recommendations: Medication[] = [];
    const processedMedications = new Set<string>();

    // Get medications based on symptoms
    symptoms.forEach(symptom => {
      const symptomMeds = this.kenyaMedications[symptom.name] || [];
      symptomMeds.forEach(med => {
        if (!processedMedications.has(med.id)) {
          recommendations.push(med);
          processedMedications.add(med.id);
        }
      });
    });

    // Sort by availability and type (OTC first, then prescription)
    return recommendations.sort((a, b) => {
      const availabilityOrder = { 'widely_available': 0, 'common': 1, 'prescription_only': 2 };
      const typeOrder = { 'otc': 0, 'herbal': 1, 'prescription': 2 };
      
      return (availabilityOrder[a.availability] - availabilityOrder[b.availability]) ||
             (typeOrder[a.type] - typeOrder[b.type]);
    });
  }

  static formatMedicationRecommendations(medications: Medication[]): string {
    if (medications.length === 0) {
      return "No specific medication recommendations available. Please consult with a healthcare provider or visit your local pharmacy for appropriate treatment options.";
    }

    let response = "## 💊 **Medication Recommendations (Kenya)**\n\n";
    response += "⚠️ **IMPORTANT:** These are general suggestions only. Always consult a doctor or pharmacist before taking any medication.\n\n";

    const otcMeds = medications.filter(m => m.type === 'otc');
    const prescriptionMeds = medications.filter(m => m.type === 'prescription');
    const herbalMeds = medications.filter(m => m.type === 'herbal');

    if (otcMeds.length > 0) {
      response += "### 🏪 **Over-the-Counter (Available at Chemists)**\n\n";
      otcMeds.forEach((med, index) => {
        response += `**${index + 1}. ${med.name}** ${med.imageUrl || '💊'}\n`;
        response += `• **Brand names:** ${med.brandNames.join(', ')}\n`;
        response += `• **Dosage:** ${med.dosage}\n`;
        response += `• **Frequency:** ${med.frequency}\n`;
        response += `• **Duration:** ${med.duration}\n`;
        response += `• **Estimated cost:** ${med.estimatedCost}\n`;
        response += `• **Availability:** Widely available at most chemists\n\n`;
      });
    }

    if (herbalMeds.length > 0) {
      response += "### 🌿 **Natural/Herbal Remedies**\n\n";
      herbalMeds.forEach((med, index) => {
        response += `**${index + 1}. ${med.name}** 🌱\n`;
        response += `• **Usage:** ${med.dosage}\n`;
        response += `• **Frequency:** ${med.frequency}\n`;
        response += `• **Cost:** ${med.estimatedCost}\n\n`;
      });
    }

    if (prescriptionMeds.length > 0) {
      response += "### 🏥 **Prescription Medications (Require Doctor's Prescription)**\n\n";
      prescriptionMeds.forEach((med, index) => {
        response += `**${index + 1}. ${med.name}** ${med.imageUrl || '💊'}\n`;
        response += `• **Brand names:** ${med.brandNames.join(', ')}\n`;
        response += `• **Usage:** ${med.dosage}, ${med.frequency}\n`;
        response += `• **Estimated cost:** ${med.estimatedCost}\n`;
        response += `• **⚠️ Requires prescription from a licensed doctor**\n\n`;
      });
    }

    response += "### 🏥 **Where to Buy in Kenya:**\n";
    response += "• **Chemists/Pharmacies:** Goodlife Pharmacy, Haltons, Mediplus\n";
    response += "• **Hospitals:** Kenyatta National Hospital, Aga Khan, Nairobi Hospital\n";
    response += "• **Supermarkets:** Carrefour, Nakumatt (pharmacy sections)\n\n";

    response += "### ⚠️ **Important Safety Notes:**\n";
    response += "• Always read medication labels carefully\n";
    response += "• Check expiry dates before use\n";
    response += "• Inform your pharmacist about other medications you're taking\n";
    response += "• Stop use and consult a doctor if symptoms worsen\n";
    response += "• Keep medications away from children\n\n";

    response += "**Remember:** This is not medical advice. Always consult with a qualified healthcare provider before starting any medication.";

    return response;
  }

  static getEmergencyMedications(): string {
    return `## 🚨 **Emergency Medications to Keep at Home (Kenya)**

### **Basic First Aid Kit:**
• **Paracetamol (Panadol)** - For fever and pain
• **ORS sachets** - For dehydration
• **Antiseptic (Dettol)** - For wound cleaning
• **Bandages and plasters** - For cuts and wounds
• **Piriton** - For allergic reactions

### **Where to Buy:**
• **24-Hour Pharmacies in Nairobi:** Goodlife Pharmacy (Yaya Centre), Haltons (various locations)
• **Emergency contacts:** 999 (Ambulance), 020 2725272 (St. John Ambulance)

**Always consult a pharmacist for proper guidance on medication use.**`;
  }
}