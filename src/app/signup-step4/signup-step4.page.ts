import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { DataService } from '../services/data.service';
import { ModalController, IonicModule } from '@ionic/angular';
// ...removed ConcernPopupComponent import...
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup-step4',
  templateUrl: './signup-step4.page.html',
  styleUrls: ['./signup-step4.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  // ...removed ConcernPopupComponent from imports...
  ]
})
export class SignupStep4Page implements OnInit {
  treatmentOptions = [
    'Oral Antihistamine Tablet',
    'Corticosteroids Nasal Spray',
    'Corticosteroids Nasal Spray + Oral Antihistamine Tablet',
    'Corticosteroids Nasal Spray + Antihistamine Nasal Spray',
    'Others'
  ];

  satisfactionOptions = [
    'I Am Satisfied With Medication',
    'I Don\'t Need My Medications',
    'I Need More Or Better Medications'
  ];

  treatmentOther: string = '';

  constructor(
    private router: Router,
    public signupService: SignupService,
    private dataService: DataService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}

  onMedicationChange() {
    if (!this.signupService.signupData.medicationOptions.includes('Others')) {
      this.treatmentOther = '';
    }
  }

  isSignUpEnabled(): boolean {
    const medicationOptions = this.signupService.signupData.medicationOptions;
    const isOtherSelected = medicationOptions.includes('Others');
    const isOtherValid = isOtherSelected ? this.treatmentOther.trim().length > 0 : true;

    return medicationOptions.length > 0 && this.signupService.signupData.satisfaction !== '' && this.signupService.signupData.agreeTerms && isOtherValid;
  }

  isCheckboxEnabled(): boolean {
    return this.signupService.signupData.medicationOptions.length > 0 && this.signupService.signupData.satisfaction !== '';
  }

  showConsentModal = false;

  onTermsChange(event: any) {
    if (event.detail.checked) {
      this.showConsentModal = true;
    } else {
      this.signupService.signupData.agreeTerms = false;
    }
  }

  closeConsentModal(agreed: boolean) {
    // Close modal first
    this.showConsentModal = false;
    this.signupService.signupData.agreeTerms = agreed;

    // If user agreed and the form is complete, proceed to next step after modal close animation
    if (agreed) {
      if (this.isSignUpEnabled()) {
        // Wait a small amount to allow the modal to close visually before navigating
        setTimeout(() => {
          this.onSignup();
        }, 250);
      } else {
        // Keep the checkbox checked so user can complete remaining fields
        console.log('Consent given but form incomplete; awaiting remaining fields.');
      }
    }
  }

  onSignup() {
    if (!this.isSignUpEnabled()) {
      alert('Please select at least one medication option and agree to terms.');
      return;
    }

    // Store in localStorage and proceed to next step
    console.log('Storing signupData to localStorage in step 4:', this.signupService.signupData);
    localStorage.setItem('signupData', JSON.stringify(this.signupService.signupData));
    this.router.navigate(['/signup-step5']);
  }

  back() {
    this.router.navigate(['/signup-step3']);
  }
}
