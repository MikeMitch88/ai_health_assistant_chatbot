import { HealthcareProvider } from '../types/medical';

export class HealthcareFinder {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
  private static readonly OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

  // Enhanced mock data with real Kenyan healthcare facilities
  private static mockProviders: Record<string, HealthcareProvider[]> = {
    'kenya': [
      {
        id: '1',
        name: 'Kenyatta National Hospital',
        type: 'hospital',
        address: 'Hospital Road, Upper Hill, Nairobi',
        phone: '+254 20 2726300',
        distance: 2.1,
        rating: 4.2,
        specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'Oncology'],
        emergencyServices: true
      },
      {
        id: '2',
        name: 'Nairobi Hospital',
        type: 'hospital',
        address: 'Argwings Kodhek Road, Nairobi',
        phone: '+254 20 2845000',
        distance: 3.5,
        rating: 4.6,
        specialties: ['Private Healthcare', 'Surgery', 'Maternity', 'Pediatrics'],
        emergencyServices: true
      },
      {
        id: '3',
        name: 'Aga Khan University Hospital',
        type: 'hospital',
        address: '3rd Parklands Avenue, Nairobi',
        phone: '+254 20 3662000',
        distance: 4.2,
        rating: 4.8,
        specialties: ['Specialized Care', 'Research', 'Teaching Hospital'],
        emergencyServices: true
      },
      {
        id: '4',
        name: 'MP Shah Hospital',
        type: 'hospital',
        address: 'Shivachi Road, Parklands, Nairobi',
        phone: '+254 20 4264000',
        distance: 3.8,
        rating: 4.4,
        specialties: ['General Medicine', 'Surgery', 'Maternity'],
        emergencyServices: true
      },
      {
        id: '5',
        name: 'Gertrude\'s Children\'s Hospital',
        type: 'hospital',
        address: 'Muthaiga Road, Nairobi',
        phone: '+254 20 2095000',
        distance: 5.1,
        rating: 4.7,
        specialties: ['Pediatrics', 'Child Healthcare', 'Neonatal Care'],
        emergencyServices: true
      },
      {
        id: 'goodlife-yaya',
        name: 'Goodlife Pharmacy',
        type: 'pharmacy',
        address: 'Yaya Centre, Nairobi',
        phone: '+254 711 939000',
        distance: 2.8,
        rating: 4.3,
        specialties: ['Prescription Medicines', 'OTC Drugs', 'Health Consultations'],
        emergencyServices: false
      },
      {
        id: 'haltons-westlands',
        name: 'Haltons Pharmacy',
        type: 'pharmacy',
        address: 'Westlands, Nairobi',
        phone: '+254 20 4448000',
        distance: 4.1,
        rating: 4.2,
        specialties: ['Prescription Medicines', 'Medical Supplies', 'Health Screening'],
        emergencyServices: false
      },
      {
        id: 'mediplus-karen',
        name: 'Mediplus Pharmacy',
        type: 'pharmacy',
        address: 'Karen Shopping Centre, Nairobi',
        phone: '+254 20 2024000',
        distance: 8.2,
        rating: 4.1,
        specialties: ['Prescription Medicines', 'Baby Care', 'Health Products'],
        emergencyServices: false
      }
    ],
    'kisumu': [
      {
        id: '6',
        name: 'Jaramogi Oginga Odinga Teaching and Referral Hospital',
        type: 'hospital',
        address: 'Kakamega Road, Kisumu',
        phone: '+254 57 2023902',
        distance: 1.2,
        rating: 4.1,
        specialties: ['Teaching Hospital', 'General Medicine', 'Surgery'],
        emergencyServices: true
      },
      {
        id: '7',
        name: 'Aga Khan Hospital Kisumu',
        type: 'hospital',
        address: 'Nairobi Road, Kisumu',
        phone: '+254 57 2023740',
        distance: 2.8,
        rating: 4.5,
        specialties: ['Private Healthcare', 'Specialized Care'],
        emergencyServices: true
      },
      {
        id: 'goodlife-kisumu',
        name: 'Goodlife Pharmacy Kisumu',
        type: 'pharmacy',
        address: 'Mega Plaza, Kisumu',
        phone: '+254 57 2025000',
        distance: 1.8,
        rating: 4.2,
        specialties: ['Prescription Medicines', 'OTC Drugs'],
        emergencyServices: false
      }
    ],
    'mombasa': [
      {
        id: '8',
        name: 'Coast Provincial General Hospital',
        type: 'hospital',
        address: 'Cathedral Road, Mombasa',
        phone: '+254 41 2314204',
        distance: 1.5,
        rating: 3.9,
        specialties: ['General Medicine', 'Emergency Care'],
        emergencyServices: true
      },
      {
        id: '9',
        name: 'Aga Khan Hospital Mombasa',
        type: 'hospital',
        address: 'Vanga Road, Mombasa',
        phone: '+254 41 2227710',
        distance: 3.2,
        rating: 4.6,
        specialties: ['Private Healthcare', 'Specialized Care'],
        emergencyServices: true
      },
      {
        id: 'haltons-mombasa',
        name: 'Haltons Pharmacy Mombasa',
        type: 'pharmacy',
        address: 'Nyali Centre, Mombasa',
        phone: '+254 41 2471000',
        distance: 2.5,
        rating: 4.0,
        specialties: ['Prescription Medicines', 'Medical Supplies'],
        emergencyServices: false
      }
    ]
  };

  static extractLocationFromText(text: string): string | null {
    const lowerText = text.toLowerCase();
    
    // Kenyan cities and regions
    const kenyanLocations = [
      'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi', 'kitale',
      'garissa', 'kakamega', 'machakos', 'meru', 'nyeri', 'kericho', 'embu', 'migori',
      'kenya', 'nairobi county', 'coast province', 'western kenya', 'central kenya',
      'rift valley', 'eastern kenya', 'nyanza province', 'north eastern province'
    ];

    // International locations
    const internationalLocations = [
      'usa', 'united states', 'uk', 'united kingdom', 'canada', 'australia',
      'south africa', 'nigeria', 'ghana', 'tanzania', 'uganda', 'rwanda',
      'new york', 'london', 'toronto', 'sydney', 'johannesburg', 'lagos',
      'accra', 'dar es salaam', 'kampala', 'kigali'
    ];

    const allLocations = [...kenyanLocations, ...internationalLocations];

    for (const location of allLocations) {
      if (lowerText.includes(location)) {
        return location;
      }
    }

    return null;
  }

  static async findNearbyProviders(
    urgencyLevel: 'low' | 'medium' | 'high' | 'emergency',
    location?: string,
    providerType?: 'hospital' | 'clinic' | 'urgent_care' | 'pharmacy'
  ): Promise<HealthcareProvider[]> {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      let providers: HealthcareProvider[] = [];

      if (location) {
        const normalizedLocation = location.toLowerCase();
        
        // Try to find providers for the specific location
        if (this.mockProviders[normalizedLocation]) {
          providers = [...this.mockProviders[normalizedLocation]];
        } else if (normalizedLocation.includes('kenya') || normalizedLocation.includes('nairobi')) {
          providers = [...this.mockProviders['kenya']];
        } else if (normalizedLocation.includes('kisumu')) {
          providers = [...this.mockProviders['kisumu']];
        } else if (normalizedLocation.includes('mombasa')) {
          providers = [...this.mockProviders['mombasa']];
        } else {
          // For international or unknown locations, try to fetch from OpenStreetMap
          providers = await this.fetchFromOpenStreetMap(location, providerType);
        }
      } else {
        // Default to Kenya providers if no location specified
        providers = [...this.mockProviders['kenya']];
      }

      // Filter by type if specified
      if (providerType) {
        providers = providers.filter(p => p.type === providerType);
      }

      // Filter based on urgency
      if (urgencyLevel === 'emergency') {
        providers = providers.filter(p => p.emergencyServices);
      } else if (urgencyLevel === 'high') {
        providers = providers.filter(p => 
          p.type === 'hospital' || p.type === 'urgent_care'
        );
      }

      // Sort by distance and rating
      providers.sort((a, b) => {
        if (urgencyLevel === 'emergency') {
          return (a.distance || 0) - (b.distance || 0); // Closest first for emergencies
        }
        return ((b.rating || 0) * 0.7) + ((5 - (a.distance || 0)) * 0.3) - 
               (((a.rating || 0) * 0.7) + ((5 - (b.distance || 0)) * 0.3));
      });

      return providers.slice(0, 8); // Return top 8

    } catch (error) {
      console.error('Error finding healthcare providers:', error);
      // Return default Kenya providers as fallback
      return this.mockProviders['kenya'].slice(0, 5);
    }
  }

  private static async fetchFromOpenStreetMap(
    location: string, 
    providerType?: string
  ): Promise<HealthcareProvider[]> {
    try {
      // First, geocode the location
      const geocodeResponse = await fetch(
        `${this.NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(location)}&limit=1`
      );
      
      if (!geocodeResponse.ok) {
        throw new Error('Geocoding failed');
      }

      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.length === 0) {
        throw new Error('Location not found');
      }

      const { lat, lon } = geocodeData[0];

      // Query for healthcare facilities using Overpass API
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:10000,${lat},${lon});
          node["amenity"="clinic"](around:10000,${lat},${lon});
          node["amenity"="pharmacy"](around:10000,${lat},${lon});
        );
        out body;
      `;

      const overpassResponse = await fetch(this.OVERPASS_BASE_URL, {
        method: 'POST',
        body: overpassQuery,
        headers: {
          'Content-Type': 'text/plain',
        },
      });

      if (!overpassResponse.ok) {
        throw new Error('Overpass API failed');
      }

      const overpassData = await overpassResponse.json();
      
      const providers: HealthcareProvider[] = overpassData.elements
        .filter((element: any) => element.tags && element.tags.name)
        .slice(0, 10)
        .map((element: any, index: number) => ({
          id: `osm-${element.id}`,
          name: element.tags.name,
          type: this.mapAmenityToType(element.tags.amenity),
          address: this.formatAddress(element.tags, location),
          phone: element.tags.phone || element.tags['contact:phone'] || 'Contact information not available',
          distance: this.calculateDistance(parseFloat(lat), parseFloat(lon), element.lat, element.lon),
          rating: 4.0 + (Math.random() * 1.0), // Simulated rating
          specialties: this.getSpecialtiesFromTags(element.tags),
          emergencyServices: element.tags.amenity === 'hospital'
        }));

      return providers;

    } catch (error) {
      console.error('OpenStreetMap fetch failed:', error);
      // Return generic international providers as fallback
      return [
        {
          id: 'generic-1',
          name: `General Hospital - ${location}`,
          type: 'hospital',
          address: `Healthcare District, ${location}`,
          phone: 'Contact local directory',
          distance: 2.5,
          rating: 4.0,
          specialties: ['General Medicine', 'Emergency Care'],
          emergencyServices: true
        },
        {
          id: 'generic-2',
          name: `Medical Center - ${location}`,
          type: 'clinic',
          address: `Medical District, ${location}`,
          phone: 'Contact local directory',
          distance: 1.8,
          rating: 4.2,
          specialties: ['Primary Care', 'Family Medicine'],
          emergencyServices: false
        }
      ];
    }
  }

  private static mapAmenityToType(amenity: string): 'hospital' | 'clinic' | 'urgent_care' | 'pharmacy' {
    switch (amenity) {
      case 'hospital': return 'hospital';
      case 'clinic': return 'clinic';
      case 'pharmacy': return 'pharmacy';
      default: return 'clinic';
    }
  }

  private static formatAddress(tags: any, location: string): string {
    const parts = [];
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (parts.length === 0) parts.push(location);
    return parts.join(', ');
  }

  private static getSpecialtiesFromTags(tags: any): string[] {
    const specialties = ['General Medicine'];
    if (tags.emergency === 'yes') specialties.push('Emergency Care');
    if (tags.healthcare) specialties.push(tags.healthcare);
    return specialties;
  }

  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in kilometers
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  static async getUserLocation(): Promise<{ lat: number; lng: number; city?: string } | null> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocode to get city name
            const response = await fetch(
              `${this.NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            
            resolve({
              lat: latitude,
              lng: longitude,
              city: data.address?.city || data.address?.town || data.address?.village || 'Unknown'
            });
          } catch (error) {
            resolve({
              lat: latitude,
              lng: longitude
            });
          }
        },
        () => {
          resolve(null); // Fallback if location access denied
        },
        { timeout: 10000 }
      );
    });
  }

  static formatProviderList(providers: HealthcareProvider[], location?: string): string {
    if (providers.length === 0) {
      return `I couldn't find any healthcare providers${location ? ` in ${location}` : ' in your area'}. Please try:\n• Searching online for 'hospitals near me'\n• Contacting your insurance provider\n• Using your local healthcare directory\n• In emergencies, call your local emergency number`;
    }

    let result = `Here are healthcare facilities${location ? ` in ${location}` : ' near you'}:\n\n`;
    
    providers.forEach((provider, index) => {
      const typeEmoji = {
        hospital: '🏥',
        clinic: '🏥',
        urgent_care: '🚑',
        pharmacy: '💊'
      };

      result += `${typeEmoji[provider.type]} **${provider.name}**\n`;
      result += `📍 ${provider.address}\n`;
      result += `📞 ${provider.phone}\n`;
      
      if (provider.distance) {
        result += `📏 ${provider.distance.toFixed(1)} km away\n`;
      }
      
      if (provider.rating) {
        result += `⭐ ${provider.rating.toFixed(1)}/5.0 rating\n`;
      }
      
      if (provider.emergencyServices) {
        result += `🚨 Emergency services available\n`;
      }
      
      if (provider.specialties && provider.specialties.length > 0) {
        result += `🩺 Specialties: ${provider.specialties.join(', ')}\n`;
      }
      
      // Add Google Maps link
      const mapsQuery = encodeURIComponent(`${provider.name} ${provider.address}`);
      result += `🗺️ [View on Maps](https://www.google.com/maps/search/${mapsQuery})\n`;
      
      result += '\n';
    });

    result += `💡 **Tip:** Click the Maps links to get directions and more information about each facility.`;

    return result;
  }
}