import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone:false
})
export class SignupPage implements OnInit  {
  dustOptions = ['Common household dust', 'Dust mites', 'Volcanic ash'];
  pollenOptions = ['Grass', 'Trees', 'Weeds'];
  moldOptions = ['Type1', 'Type2', 'Type3'];

  signupData = {
    name: '',
    age: null as number | null,
    allergy: '',
    city: '',
    dustAllergy: '',
    doctor: '',
    agreeTerms: false,
    latitude: null as number | null,
    longitude: null as number | null,
    dustSubtypes: [] as string[],
    pollenSubtypes: [] as string[],
    moldSubtypes: [] as string[],
  };
  dr_list: any;
showContainer = false;
  showForm = true;
  constructor(private router: Router, private ngZone: NgZone,public dataService: DataService) {} // ✅ Inject NgZone
  ngAfterViewInit() {
    const signupData = localStorage.getItem('signupData');
    if (signupData) {
      this.ngZone.run(() => {
        this.router.navigate(['/mycity']);
      });
    }
  }
  onSignup() {
   
    if (!this.signupData.agreeTerms) {
      alert('Please agree to the Terms of Services.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
    
    (position) => {
      this.signupData.latitude = position.coords.latitude;
      this.signupData.longitude = position.coords.longitude;

      // console.log('Collected Data with Location:', this.signupData);

      if (this.signupData.latitude && this.signupData.longitude) {
        console.log('Lat and Long from signupData:', this.signupData.latitude, this.signupData.longitude);
        this.dataService.getCityFromLatLong(this.signupData.latitude, this.signupData.longitude).subscribe(cityName => {
          console.log('City name from Google API:', cityName);
          if (cityName) {
            this.signupData.city = cityName;
            

            // Proceed with API call or logic
            // this.apiService.submitSignup(this.signupData).subscribe(...);
            this.dataService.userSignup(this.signupData).subscribe((res) => { 
              localStorage.setItem('signupData', JSON.stringify(this.signupData));
            console.log('Collected Data with Location:', this.signupData);
            this.router.navigate(['/mycity']);
          });
          
          }
        });
      }

      
      
    },
    (error) => {
      console.error('Location access denied:', error);
      alert('Please allow location access to proceed.');
    }
  );
    
}
ngOnInit() {
  const safeTop = getComputedStyle(document.documentElement)
    .getPropertyValue('--ion-safe-area-top');
  document.querySelector('ion-header')?.setAttribute(
    'style',
    `padding-top: ${safeTop};`
  );
   
this.dataService.getDr().subscribe(res => {
      this.dr_list = res;
    
    console.log("Dr List: ",this.dr_list)
    
    });


  }
  onSubmit() {
    this.showContainer = !this.showContainer;
    this.showForm = !this.showForm;
    console.log('Signup Form Submitted:', this.signupData);
  }
  // onCheckboxChange(){
  //   this.signupData.agreeTerms = !this.signupData.agreeTerms;
  // }
  onCheckboxChange1(event: any) {
    if (!this.signupData.name || !this.signupData.age || !this.signupData.doctor) {
      alert('Please fill in all required fields.');
      this.signupData.agreeTerms = false;
      return;
    }
  console.log('Checked:', event.detail.checked); // true or false
  this.showContainer = !this.showContainer;
    this.showForm = !this.showForm;
}

  // onCheckboxChange(event: any) {
  //   const value = event.target.value;
  //   const isChecked = event.detail.checked;

  //   const dustOptions = ['Common household dust', 'Dust mites', 'Volcanic ash'];
  //   const pollenOptions = ['Grass', 'Trees', 'Weeds'];

  //   if (dustOptions.includes(value)) {
  //     this.updateSubtypeArray(this.signupData.dustSubtypes, value, isChecked);
  //   }

  //   if (pollenOptions.includes(value)) {
  //     this.updateSubtypeArray(this.signupData.pollenSubtypes, value, isChecked);
  //   }

  //   console.log('Dust Subtypes:', this.signupData.dustSubtypes);
  //   console.log('Pollen Subtypes:', this.signupData.pollenSubtypes);
  // }

  updateSubtypeArray(array: string[], value: string, isChecked: boolean) {
    const index = array.indexOf(value);
    if (isChecked && index === -1) {
      array.push(value);
    } else if (!isChecked && index > -1) {
      array.splice(index, 1);
    }
  }
}
