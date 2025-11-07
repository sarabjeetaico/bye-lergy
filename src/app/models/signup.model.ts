export interface SignupData {
  name: string;
  age: number;
  doctor: string;
  agreeTerms: boolean;
  latitude?: number;
  longitude?: number;
  city?: string;
  dustSubtypes: string[];
  pollenSubtypes: string[];
  medicationOptions: string[];
  satisfaction: string;
  noseFrequency: string[];
  noseImpact: string[];
}