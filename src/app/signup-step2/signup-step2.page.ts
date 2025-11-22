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

  constructor(private router: Router, public signupService: SignupService, private cdr: ChangeDetectorRef) {
    this.initSignupData();
  }

  ngOnInit() {}

  initSignupData() {
    // Initialize data model if not present
    if (!this.signupService.signupData || Object.keys(this.signupService.signupData).length === 0) {
      this.signupService.resetData();
    }
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
      if (!this.signupService.signupData.suspectedAllergens.includes(allergen)) {
        this.signupService.signupData.suspectedAllergens = [...this.signupService.signupData.suspectedAllergens, allergen];
      }
    } else {
      this.signupService.signupData.suspectedAllergens = this.signupService.signupData.suspectedAllergens.filter(a => a !== allergen);
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
      return this.signupService.signupData.suspectedAllergens.length > 0;
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
    } else {
      // Reset Yes fields
      this.signupService.signupData.noseSymptoms = [];
      this.signupService.signupData.noseFrequency = '';
      this.signupService.signupData.noseImpact = [];
      this.signupService.signupData.suspectedAllergens = [];
    }
  }

  onNoseImpactChange(selectedValues: string[]) {
    let updatedValues: string[] = [];

    // If "Nothing Above" is selected
    if (selectedValues.includes('Nothing Above')) {
      // Keep only "Nothing Above"
      updatedValues = ['Nothing Above'];
    } 
    // If other options are selected (and "Nothing Above" is not)
    else if (selectedValues.length > 0) {
      // Remove "Nothing Above" if it exists and keep the other selections
      updatedValues = selectedValues.filter(item => item !== 'Nothing Above');
    }
    else {
      updatedValues = selectedValues;
    }

    // Update the service data
    this.signupService.signupData.noseImpact = updatedValues;
    
    // Update the select component value
    if (this.noseImpactSelect) {
      this.noseImpactSelect.value = updatedValues;
    }
    
    this.cdr.detectChanges();
  }

  get isNothingAboveSelected(): boolean {
    return this.signupService.signupData.noseImpact.includes('Nothing Above');
  }

  get isOtherOptionSelected(): boolean {
    return this.signupService.signupData.noseImpact.some(item => item !== 'Nothing Above');
  }

  back() {
    this.router.navigate(['/signup']);
  }
}
