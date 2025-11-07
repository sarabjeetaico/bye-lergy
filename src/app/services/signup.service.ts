import { Injectable } from '@angular/core';
import { SignupData } from '../models/signup.model';

@Injectable({
  providedIn: 'root'
})
export class SignupService {
  signupData = {
    name: '',
    age: null as number | null,
    doctor: '',
    testedForAllergens: null as boolean | null, // yes/no for tested
    dustSubtypes: [] as string[],
    pollenSubtypes: [] as string[],
    moldSubtypes: [] as string[],
    suspectedAllergens: [] as string[], // for no tested: dust, pollen, mold, other
    allergicNose: null as boolean | null, // yes/no
    noseSymptoms: [] as string[], // runny, itchy, block, sneezing
    noseFrequency: '' as string, // less or more than 4 days
    noseImpact: [] as string[], // sleep, work, troublesome, nothing
    medicationOptions: [] as string[], // treatment options (multiple)
    satisfaction: '', // satisfaction feedback (single)
    agreeTerms: false,
    latitude: null as number | null,
    longitude: null as number | null,
    city: '',
  };

  constructor() { }

  resetData() {
    this.signupData = {
      name: '',
      age: null as number | null,
      doctor: '',
      testedForAllergens: null as boolean | null,
      dustSubtypes: [] as string[],
      pollenSubtypes: [] as string[],
      moldSubtypes: [] as string[],
      suspectedAllergens: [] as string[],
      allergicNose: null as boolean | null,
      noseSymptoms: [] as string[],
      noseFrequency: '' as string,
      noseImpact: [] as string[],
      medicationOptions: [] as string[],
      satisfaction: '',
      agreeTerms: false,
      latitude: null as number | null,
      longitude: null as number | null,
      city: '',
    };
  }
}
