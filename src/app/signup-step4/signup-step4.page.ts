import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignupService } from '../services/signup.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-signup-step4',
  templateUrl: './signup-step4.page.html',
  styleUrls: ['./signup-step4.page.scss'],
  standalone: false
})
export class SignupStep4Page implements OnInit {
  treatmentOptions = [
    'Oral Antihistamines Tablet',
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

  constructor(private router: Router, public signupService: SignupService, private dataService: DataService) {}

  ngOnInit() {}

  isSignUpEnabled(): boolean {
    return this.signupService.signupData.medicationOptions.length > 0 && this.signupService.signupData.satisfaction !== '' && this.signupService.signupData.agreeTerms;
  }

  onSignup() {
    if (!this.isSignUpEnabled()) {
      alert('Please select at least one medication option and agree to terms.');
      return;
    }

    // Get location and submit
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.signupService.signupData.latitude = position.coords.latitude;
        this.signupService.signupData.longitude = position.coords.longitude;

        this.dataService.getCityFromLatLong(this.signupService.signupData.latitude!, this.signupService.signupData.longitude!).subscribe(cityName => {
          if (cityName) {
            this.signupService.signupData.city = cityName;
        this.dataService.userSignup(this.signupService.signupData).subscribe((res) => {
              localStorage.setItem('signupData', JSON.stringify(this.signupService.signupData));
              this.router.navigate(['/signup-step5']);
            });
          }
        });
      },
      (error) => {
        console.error('Location access denied:', error);
        alert('Please allow location access to proceed.');
      }
    );
  }

  back() {
    this.router.navigate(['/signup-step3']);
  }
}
