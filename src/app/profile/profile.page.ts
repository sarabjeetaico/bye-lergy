import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { SignupService } from '../services/signup.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule,FooterComponent],
})
export class ProfilePage implements OnInit {
  signupData: any;
  notificationToggle = false;
  locationToggle = false;
  showContainer = false;
  editMode: { [key: string]: boolean } = {};
  inputChanged: { [key: string]: boolean } = {};

  dr_list:any;
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

  noseSymptomOptions = ['Runny Nose', 'Itchy Eyes', 'Nose Block', 'Sneezing'];
  noseFrequencyOptions = ['Less Than 4 Days In A Week', 'More Than 4 Days In A Week'];
  noseImpactOptions = ['Sleep Disturbances', 'Affecting Work/School/Daily Activities', 'Troublesome', 'Nothing Above'];
  medicationOptionsList = [
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


  constructor(
    private alertController: AlertController,
    private router: Router,
    private dataService: DataService,
    public signupService: SignupService
  ) {
    this.signupData = this.signupService.signupData;
  }

  onSignup(){}
  onClose(){
      this.showContainer = (this.showContainer) ? false : true
    }
  onAgreeTermsChange(){
      this.showContainer = true;
    }
  ngOnInit() {
    const data = localStorage.getItem('signupData');
    if (data) {
      this.signupData = JSON.parse(data);
      console.log("signupData: ",this.signupData)
    }
    this.dataService.getDr().subscribe(res => {
      this.dr_list = res;
    
    console.log("Dr List: ",this.dr_list)
    
    });

    Object.keys(this.signupData).forEach(key => {
      this.editMode[key] = false;
      this.inputChanged[key] = false;
    });
  }

  onEditOrUpdate(field: string) {
    if (this.editMode[field] && this.inputChanged[field]) {
      // Update localStorage
      localStorage.setItem('signupData', JSON.stringify(this.signupData));
      // Call backend update
      this.dataService.updateProfile(this.signupData).subscribe({
        next: (res) => {
          console.log('Profile updated successfully', res);
        },
        error: (err) => {
          console.error('Error updating profile', err);
        }
      });
      this.editMode[field] = false;
      this.inputChanged[field] = false;
    } else {
      this.editMode[field] = true;
    }
  }

  onInputChange(field: string) {
    this.inputChanged[field] = true;
  }

  async onDeleteAccount() {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          handler: () => {
            localStorage.removeItem('signupData');
            // Navigate to signup page (update the route as per your app)
            this.router.navigate(['/signup']);
          }
        }
      ]
    });
    await alert.present();
  }
}
