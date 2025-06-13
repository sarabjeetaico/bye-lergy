import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: false
})
export class SigninPage{
signupData = {
  name: '',
  doctor: '',
  latitude: null as number | null,
  longitude: null as number | null,
};


  constructor(private router: Router) {}

  onSignup() {
 

  navigator.geolocation.getCurrentPosition(
    
    (position) => {
      this.signupData.latitude = position.coords.latitude;
      this.signupData.longitude = position.coords.longitude;

      console.log('Collected Data with Location:', this.signupData);
      this.router.navigate(['/mycity']);
      // Proceed with API call or logic
      // this.apiService.submitSignup(this.signupData).subscribe(...);
    },
    (error) => {
      console.error('Location access denied:', error);
      alert('Please allow location access to proceed.');
    }
  );
}


}
