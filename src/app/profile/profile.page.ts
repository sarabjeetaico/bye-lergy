import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  standalone: true,
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule,FooterComponent],
})
export class ProfilePage implements OnInit {
  signupData: any = {
    name: '',
    age: null,
    dustSubtypes: [] as string[],
    pollenSubtypes: [] as string[],
    doctor: ''
  };
  notificationToggle = false;
  locationToggle = false;
  showContainer = false;
  editMode = {
    name: false,
    age: false,
    doctor: false,
    dustSubtypes: false,
    pollenSubtypes: false,
    moldSubtypes: false
  };
  inputChanged = {
    name: false,
    age: false,
    doctor: false,
    dustSubtypes: false,
    pollenSubtypes: false,
    moldSubtypes: false
  };
  dr_list:any;
  dustOptions = ['Common household dust', 'Dust mites', 'Volcanic ash'];
  pollenOptions = ['Grass', 'Trees', 'Weeds'];
  moldOptions = ['Type1', 'Type2', 'Type3'];
  constructor(private alertController: AlertController, private router: Router, private dataService: DataService) {}
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
  }
  onCheckboxChange(event: any) {
    const value = event.target.value;
    const isChecked = event.detail.checked;

    const dustOptions = ['Common household dust', 'Dust mites', 'Volcanic ash'];
    const pollenOptions = ['Grass', 'Trees', 'Weeds'];

    if (dustOptions.includes(value)) {
      this.updateSubtypeArray(this.signupData.dustSubtypes, value, isChecked);
    }

    if (pollenOptions.includes(value)) {
      this.updateSubtypeArray(this.signupData.pollenSubtypes, value, isChecked);
    }

    // Update localStorage whenever a checkbox changes
    localStorage.setItem('signupData', JSON.stringify(this.signupData));

    console.log('Dust Subtypes:', this.signupData.dustSubtypes);
    console.log('Pollen Subtypes:', this.signupData.pollenSubtypes);
  }
  updateSubtypeArray(array: string[], value: string, isChecked: boolean) {
    const index = array.indexOf(value);
    if (isChecked && index === -1) {
      array.push(value);
    } else if (!isChecked && index > -1) {
      array.splice(index, 1);
    }
  }
  onEditOrUpdate(field: 'name' | 'age' | 'doctor' | 'dustSubtypes' | 'pollenSubtypes' | 'moldSubtypes') {
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

  onInputChange(field: 'name' | 'age' | 'doctor' | 'dustSubtypes' | 'pollenSubtypes' | 'moldSubtypes') {
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
