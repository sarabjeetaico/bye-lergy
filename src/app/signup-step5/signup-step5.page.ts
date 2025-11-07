import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-signup-step5',
  templateUrl: './signup-step5.page.html',
  styleUrls: ['./signup-step5.page.scss'],
  standalone: false
})
export class SignupStep5Page implements OnInit {
  conclusionMessage: string = '';

  constructor(private router: Router, public signupService: SignupService, private dataService: DataService) {}

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

    this.conclusionMessage = `Your nose allergy is ${type} and ${severity}.`;
  }

  next() {
    // Get location and proceed with final signup
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.signupService.signupData.latitude = position.coords.latitude;
        this.signupService.signupData.longitude = position.coords.longitude;

        this.dataService.getCityFromLatLong(this.signupService.signupData.latitude!, this.signupService.signupData.longitude!).subscribe(cityName => {
          if (cityName) {
            this.signupService.signupData.city = cityName;
            
            // Now perform the final signup with all data
            this.dataService.userSignup({
              ...this.signupService.signupData,
              deviceId: localStorage.getItem('deviceId'),
              signupCompleted: true,
              registrationDate: new Date().toISOString()
            }).subscribe(
              (response) => {
                // Store complete data and proceed
                localStorage.setItem('signupData', JSON.stringify(this.signupService.signupData));
                this.router.navigate(['/mycity']);
              },
              (error) => {
                console.error('Signup failed:', error);
                alert('Failed to complete signup. Please try again.');
              }
            );
          } else {
            alert('Could not determine your city. Please try again.');
          }
        });
      },
      (error) => {
        console.error('Location access denied:', error);
        alert('Please allow location access to proceed with signup.');
      }
    );
  }

  back() {
    this.router.navigate(['/signup-step4']);
  }
}
