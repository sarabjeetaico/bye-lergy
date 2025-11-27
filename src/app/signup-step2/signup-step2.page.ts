import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { IonSelect } from '@ionic/angular';

@Component({
  selector: 'app-signup-step2',
  templateUrl: './signup-step2.page.html',
  styleUrls: ['./signup-step2.page.scss'],
  standalone: false
})
export class SignupStep2Page implements OnInit {
  @ViewChild('noseImpactSelect') noseImpactSelect!: IonSelect;

  dustOptions = [
    'Dermatophagoides Pteronyssinus',
    'Dermatophagoides Farinae',
    'Blomia Tropicalis',
    'Other'
  ];

  pollenOptions = [
    'Grass',
    'Weed',
    'Tree',
    'Other'
  ];

  moldOptions = [
    'Aspergillus',
    'Penicillium',
    'Cladosporium',
    'Other'
  ];

  suspectedAllergens: string[] = [];
  suspectedOther: string = '';

  constructor(private router: Router, public signupService: SignupService, private cdr: ChangeDetectorRef) {
    this.initSignupData();
  }

  ngOnInit() {}

  initSignupData() {
    // Initialize data model if not present
    if (!this.signupService.signupData || Object.keys(this.signupService.signupData).length === 0) {
      this.signupService.resetData();
    }
    // Ensure expected array/string fields exist to avoid template errors
    const d: any = this.signupService.signupData;
    if (!d.noseImpact) { d.noseImpact = []; }
    if (!d.noseSymptoms) { d.noseSymptoms = []; }
    if (!d.noseFrequency) { d.noseFrequency = ''; }
    if (!d.suspectedAllergens) { d.suspectedAllergens = []; }
  }

  onTestedChange(value: any) {
    this.signupService.signupData.testedForAllergens = value;
    // Reset all allergen selections when switching choice
    if (this.signupService.signupData.testedForAllergens) {
      this.signupService.signupData.suspectedAllergens = [];
    } else {
      this.signupService.signupData.dustSubtypes = [];
      this.signupService.signupData.pollenSubtypes = [];
      this.signupService.signupData.moldSubtypes = [];
    }
  }

  onSuspectedChange(allergen: string, checked: boolean) {
    if (checked) {
      if (allergen === 'Nothing Above') {
        // If "Nothing Above" is selected, clear all other selections
        this.signupService.signupData.suspectedAllergens = ['Nothing Above'];
        this.suspectedOther = '';
      } else {
        // If another option is selected, remove "Nothing Above" if present
        this.signupService.signupData.suspectedAllergens = this.signupService.signupData.suspectedAllergens.filter(a => a !== 'Nothing Above');
        if (!this.signupService.signupData.suspectedAllergens.includes(allergen)) {
          this.signupService.signupData.suspectedAllergens = [...this.signupService.signupData.suspectedAllergens, allergen];
        }
      }
    } else {
      this.signupService.signupData.suspectedAllergens = this.signupService.signupData.suspectedAllergens.filter(a => a !== allergen);
      if (allergen === 'Other') {
        this.suspectedOther = '';
      }
    }
    this.cdr.detectChanges();
  }

  isNextEnabled(): boolean {
    // Logic for enabling next button
    if (this.signupService.signupData.allergicNose === true) {
      // "Yes" selected: require at least one from each dropdown
      return this.signupService.signupData.noseSymptoms.length > 0 &&
             this.signupService.signupData.noseFrequency !== '' &&
             this.signupService.signupData.noseImpact.length > 0;
    } else if (this.signupService.signupData.allergicNose === false) {
      // "No" selected: require at least one suspected allergen checked
      const suspects = this.signupService.signupData.suspectedAllergens;
      const isOtherSelected = suspects.includes('Other');
      const isOtherValid = isOtherSelected ? this.suspectedOther.trim().length > 0 : true;
      return suspects.length > 0 && isOtherValid;
    }
    // Disable by default if not chosen
    return false;
  }

  next() {
    // You may want to validate/sanitize the data model here again before navigation
    this.router.navigate(['/signup-step3']); // Adjust route as needed
  }



  setAllergicNose(value: boolean) {
    this.signupService.signupData.allergicNose = value;
    if (value === true) {
      // Reset No fields
      this.signupService.signupData.suspectedAllergens = [];
      this.suspectedOther = '';
    } else {
      // Reset Yes fields
      this.signupService.signupData.noseSymptoms = [];
      this.signupService.signupData.noseFrequency = '';
      this.signupService.signupData.noseImpact = [];
      this.signupService.signupData.suspectedAllergens = [];
    }
  }

  onNoseImpactChange(selectedValues: string[] | null | undefined) {
    let updatedValues: string[] = [];

    if (Array.isArray(selectedValues)) {
      // If "Nothing Above" is selected, it should be the only value.
      if (selectedValues.includes('Nothing Above')) {
        updatedValues = ['Nothing Above'];
      } else {
        updatedValues = selectedValues;
      }
    }

    this.signupService.signupData.noseImpact = updatedValues;
    this.cdr.detectChanges();
  }

  get isNothingAboveSelected(): boolean {
    const arr = this.signupService.signupData.noseImpact || [];
    return arr.includes('Nothing Above');
  }

  get isOtherOptionSelected(): boolean {
    const arr = this.signupService.signupData.noseImpact || [];
    return arr.some(item => item !== 'Nothing Above');
  }

  get isSuspectedNothingAboveSelected(): boolean {
    const arr = this.signupService.signupData.suspectedAllergens || [];
    return arr.includes('Nothing Above');
  }

  get isSuspectedOtherSelected(): boolean {
    const arr = this.signupService.signupData.suspectedAllergens || [];
    return arr.some(item => item !== 'Nothing Above');
  }

  back() {
    this.router.navigate(['/signup']);
  }
}
