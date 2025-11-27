import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup-step3',
  templateUrl: './signup-step3.page.html',
  styleUrls: ['./signup-step3.page.scss'],
  standalone: false
})
export class SignupStep3Page implements OnInit {

  dustOther: string = '';
  pollenOther: string = '';
  moldOther: string = '';
  suspectedOther: string = '';

  constructor(private router: Router, public signupService: SignupService) {}

  ngOnInit() {}

  onTestedChange(value: boolean) {
    this.signupService.signupData.testedForAllergens = value;
    if (!value) {
      this.signupService.signupData.dustSubtypes = [];
      this.signupService.signupData.pollenSubtypes = [];
      this.signupService.signupData.moldSubtypes = [];
      this.dustOther = '';
      this.pollenOther = '';
      this.moldOther = '';
    } else {
      this.signupService.signupData.suspectedAllergens = [];
    }
  }

  onSuspectedChange(allergen: string, checked: boolean) {
    if (checked) {
      this.signupService.signupData.suspectedAllergens.push(allergen);
    } else {
      const index = this.signupService.signupData.suspectedAllergens.indexOf(allergen);
      if (index > -1) {
        this.signupService.signupData.suspectedAllergens.splice(index, 1);
      }
      if (allergen === 'Other') {
        this.suspectedOther = '';
      }
    }
  }



  isNextEnabled(): boolean {
    if (this.signupService.signupData.testedForAllergens === null) return false;
    if (this.signupService.signupData.testedForAllergens) {
      return this.signupService.signupData.dustSubtypes.length > 0 ||
             this.signupService.signupData.pollenSubtypes.length > 0 ||
             this.signupService.signupData.moldSubtypes.length > 0 ||
             this.dustOther.trim().length > 0 ||
             this.pollenOther.trim().length > 0 ||
             this.moldOther.trim().length > 0;
    } else {
      const suspects: string[] = this.signupService.signupData.suspectedAllergens || [];
      const normalSelected = suspects.some(a => a !== 'Other');
      const otherSelected = suspects.includes('Other');
      return normalSelected || (otherSelected && this.suspectedOther.trim().length > 0);
    }
  }

  next() {
    if (this.isNextEnabled()) {
      this.router.navigate(['/signup-step4']);
    }
  }

  back() {
    this.router.navigate(['/signup-step2']);
  }
}
