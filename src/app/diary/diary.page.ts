import { Component, OnInit,ElementRef } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '../footer/footer.component';
import { DataService } from '../services/data.service';
@Component({
  standalone: true,
  selector: 'app-diary',
  templateUrl: './diary.page.html',
  styleUrls: ['./diary.page.scss'],
  imports: [CommonModule, FormsModule, IonicModule,FooterComponent],
})
export class DiaryPage implements OnInit {

  rating_card = true
  constructor(private el: ElementRef,private getData:DataService) {}
  nasalvalue: any= 0;
  occularvalue: any = 0;
  signupData: any = {};
  nasal(event:any){
    this.nasalvalue = parseInt(event.detail.value)
    console.log(this.nasalvalue);
    this.getData.store_data_range(this.nasalvalue, "Nasal", "M",this.signupData).subscribe((res) => { 
      console.log("res",res)
    })
    }
  occular(event:any){
    this.occularvalue = parseInt(event.detail.value)
    console.log(this.occularvalue);
      this.getData.store_data_range(this.occularvalue, "Occular", "M",this.signupData).subscribe((res) => { 
        console.log("res",res)
      })
    }
  go_next(){
    this.rating_card = this.rating_card ? false : true
    console.log(this.rating_card)
  }
  ngOnInit() {
    const data = localStorage.getItem('signupData');
    if (data) {
      this.signupData = JSON.parse(data);
      console.log('Signup data:', this.signupData['name']);
    }
  }

}

