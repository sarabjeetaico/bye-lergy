import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgZone } from '@angular/core';
import { DataService } from '../services/data.service';
import { SignupService } from '../services/signup.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: false
})
export class SignupPage implements OnInit {
  dr_list: any;

  constructor(
    private router: Router, 
    private ngZone: NgZone, 
    public dataService: DataService, 
    public signupService: SignupService
  ) {}

  ngAfterViewInit() {
    const signupData = localStorage.getItem('signupData');
    if (signupData) {
      this.ngZone.run(() => {
        this.router.navigate(['/mycity']);
      });
    }
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
      console.log("Dr List: ", this.dr_list);
    });
  }

  isNextEnabled(): boolean {
    const data = this.signupService.signupData;
    if (data.doctor === 'other') {
      return !!(data.name && data.age && data.doctor && data.other_doctor);
    }
    return !!(data.name && data.age && data.doctor);
  }

  next() {
    if (this.isNextEnabled()) {
      this.router.navigate(['/signup-step2']);
    } else {
      alert('Please fill in all required fields.');
    }
  }
}