import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-signup-step2',
  templateUrl: './signup-step2.page.html',
  styleUrls: ['./signup-step2.page.scss'],
  standalone: false
})
export class SignupStep2Page implements OnInit {
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

  constructor(private router: Router, public signupService: SignupService, private cdr: ChangeDetectorRef, private modalController: ModalController) {
    this.initSignupData();
  }

  ngOnInit() { }

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

  async openNoseImpactModal() {
    const modal = await this.modalController.create({
      component: ImpactSelectionModal,
      componentProps: {
        currentSelections: [...(this.signupService.signupData.noseImpact || [])]
      },
      cssClass: 'impact-selection-modal'
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data && data.selections !== undefined) {
      this.signupService.signupData.noseImpact = data.selections;
      this.cdr.detectChanges();
    }
  }

  getSelectedImpactText(): string {
    const selected = this.signupService.signupData.noseImpact || [];
    if (selected.length === 0) return '';
    if (selected.length === 1) return selected[0];
    return `${selected.length} selected`;
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

// Inline Modal Component for Impact Selection
@Component({
  selector: 'app-impact-selection-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Select Impact</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="cancel()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-checkbox [(ngModel)]="selections.sleepDisturbances" (ionChange)="onCheckboxChange('sleep')">
            Sleep Disturbances
          </ion-checkbox>
        </ion-item>
        <ion-item>
          <ion-checkbox [(ngModel)]="selections.affectingWork" (ionChange)="onCheckboxChange('work')">
            Affecting Work/school/Daily Activities
          </ion-checkbox>
        </ion-item>
        <ion-item>
          <ion-checkbox [(ngModel)]="selections.troublesome" (ionChange)="onCheckboxChange('troublesome')">
            Troublesome
          </ion-checkbox>
        </ion-item>
        <ion-item>
          <ion-checkbox [(ngModel)]="selections.nothingAbove" (ionChange)="onCheckboxChange('nothing')">
            Nothing Above
          </ion-checkbox>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-button expand="block" (click)="confirm()">OK</ion-button>
      </ion-toolbar>
    </ion-footer>
  `,
  standalone: false
})
export class ImpactSelectionModal {
  selections = {
    sleepDisturbances: false,
    affectingWork: false,
    troublesome: false,
    nothingAbove: false
  };

  currentSelections: string[] = [];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    // Initialize selections based on current values
    this.selections.sleepDisturbances = this.currentSelections.includes('Sleep Disturbances');
    this.selections.affectingWork = this.currentSelections.includes('Affecting Work/School/Daily Activities');
    this.selections.troublesome = this.currentSelections.includes('Troublesome');
    this.selections.nothingAbove = this.currentSelections.includes('Nothing Above');
  }

  onCheckboxChange(type: string) {
    if (type === 'nothing' && this.selections.nothingAbove) {
      // "Nothing Above" was checked, uncheck all others
      this.selections.sleepDisturbances = false;
      this.selections.affectingWork = false;
      this.selections.troublesome = false;
    } else if (type !== 'nothing' && this.selections.nothingAbove) {
      // Another option was checked while "Nothing Above" was checked
      this.selections.nothingAbove = false;
    }
  }

  cancel() {
    this.modalCtrl.dismiss();
  }

  confirm() {
    const result: string[] = [];
    if (this.selections.sleepDisturbances) result.push('Sleep Disturbances');
    if (this.selections.affectingWork) result.push('Affecting Work/School/Daily Activities');
    if (this.selections.troublesome) result.push('Troublesome');
    if (this.selections.nothingAbove) result.push('Nothing Above');

    this.modalCtrl.dismiss({ selections: result });
  }
}

