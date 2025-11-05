import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup-step5',
  templateUrl: './signup-step5.page.html',
  styleUrls: ['./signup-step5.page.scss'],
  standalone: false
})
export class SignupStep5Page implements OnInit {
  conclusionMessage: string = '';

  constructor(private router: Router, public signupService: SignupService) {}

  ngOnInit() {
    console.log('SignupStep5Page loaded');
    console.log('noseFrequency:', this.signupService.signupData.noseFrequency);
    console.log('noseImpact:', this.signupService.signupData.noseImpact);
    this.computeConclusionMessage();
    console.log('conclusionMessage:', this.conclusionMessage);
  }

  computeConclusionMessage() {
    // Determine intermittent or persistent
    const isIntermittent = this.signupService.signupData.noseFrequency.includes('Less Than 4 Days In A Week');
    const type = isIntermittent ? 'intermittent' : 'persistent';

    // Determine severity
    const impacts = this.signupService.signupData.noseImpact;
    let severity = 'mild';
    if (impacts.includes('Sleep Disturbances') || impacts.includes('Affecting Work/School/Daily Activities') || impacts.includes('Troublesome')) {
      severity = 'severe';
    } else if (impacts.length > 0 && !impacts.includes('Nothing Above')) {
      severity = 'moderate';
    }

    this.conclusionMessage = `Your allergic nose is ${type} and ${severity}.`;
  }

  next() {
    this.router.navigate(['/mycity']);
  }

  back() {
    this.router.navigate(['/signup-step4']);
  }
}
