// import { createPipeType } from '@angular/compiler/src/render3/r3_pipe_compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { Plugins } from '@capacitor/core';
import { DataService } from '../services/data.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
// import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
// const { Geolocation } = Plugins;

export interface Allergylist {
  id: number;
  name: string;
  image: string;

}

@Component({
  standalone: true,
  selector: 'app-mycity',
  templateUrl: './mycity.page.html',
  styleUrls: ['./mycity.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  
})
export class MycityPage implements OnInit {
  form!: FormGroup;
  allergyData: Allergylist[] = [
    { id: 0, name: 'Dust Allergy',image : '../../assets/images/Mq7F.gif'},
    { id: 1, name: 'Pollen Allergy',image:'https://www.ucihealth.org/-/media/images/modules/news/stories/2014/dandelion-pollen-640.gif'},
    { id: 2, name: 'Mold Allergy',image:'../../assets/images/mold-gif.gif' },
    // { id: 3, name: 'other',image:''}
  ];
  

  inputDiv = true;
latitude: number | null = null;
longitude: number | null = null;
cities: any[] = [];
filtercities: any[] = [];
searchText: string = '';
showList = false;
Dust: string = '';
Cockroaches: string = '';
Mites: string = '';
Pollen: string = '';
Mold: string = '';
Animal: string = '';
signupData: any = {};
  constructor(private fb: FormBuilder,
    private getData:DataService,
    private router:Router
  ) {
    // this.getLocation();
    
  }
  validateCity(){
    console.log("filtercities : ",this.searchText)

    this.inputDiv = (typeof this.searchText === "undefined" || this.searchText === "") ? true : false;
    this.submit()
  }
  onChange(name: string, isChecked: boolean) {
    const allergies = (this.form.controls['name'] as FormArray);
    if (isChecked) {
      for (let index = 0; index < allergies.value.length; index++) {
        if(allergies.value[index] === name){
          console.log("allergies.value[index] : ",allergies.value[index])
          allergies.clear()
          break;
        } 
      }
      
      allergies.push(new FormControl(name));
      // console.log("allergies.value : ",allergies.value)
      
    } else {
      const index = allergies.controls.findIndex(x => x.value === name);
      allergies.removeAt(index);
      // console.log("allergies.value : ",allergies.value)
    }
    
  }

  ngOnInit(){
    const data = localStorage.getItem('signupData');
    if (data) {
      this.signupData = JSON.parse(data);
      console.log('Signup data:', this.signupData['name']);
    }

    this.getData.getcity().subscribe(res => {
      this.cities = res;
      this.filtercities = res;
      console.log(res);

      // If lat and long are available in signupData, get city name from Google API and set as default
      if (this.signupData.latitude && this.signupData.longitude) {
        console.log('Lat and Long from signupData:', this.signupData.latitude, this.signupData.longitude);
        this.getData.getCityFromLatLong(this.signupData.latitude, this.signupData.longitude).subscribe(cityName => {
          console.log('City name from Google API:', cityName);
          if (cityName) {
            this.searchText = cityName;
            const matchedCity = this.cities.find(c => c.city.toLowerCase() === cityName.toLowerCase());
            if (matchedCity) {
              this.selectLoc(matchedCity);
            }
          }
        });
      }

      // Set default city to first in the list if available
      // if (this.cities.length > 0) {
      //   this.searchText = this.cities[0].city;
      //   this.selectLoc(this.cities[0]);
      // }
    });
    
    this.form = this.fb.group({
      name: this.fb.array([])
    });
  }

  submit() {
    
    localStorage.setItem("allergies", JSON.stringify(this.form.value.name))
    // console.log("allergies",this.form.value.name);
    console.log("filtercities : ",this.filtercities)
    this.router.navigateByUrl('/home', { replaceUrl: true });

  }

  search(event:any){
    
    this.searchText = event
    if(this.searchText == null){
      this.showList = false 
    }else{

      this.showList = true 
    }
  
    console.log("searchText: ",this.searchText)
    this.filtercities = this.cities.filter((item) => {
      return item.city.toLowerCase().includes(this.searchText.toLowerCase());
    });
      // return city.city.toLowerCase().includes(this.searchText.toLowerCase());
  }

  selectLoc(city:any){
    this.searchText = city.city
    
    this.showList = false 
    localStorage.setItem('cdetails',JSON.stringify(city))

    // Save to signupData immediately
    this.signupData['latitude'] = city.Lat;
    this.signupData['longitude'] = city.Long;
    this.signupData['city'] = city.city;
    localStorage.setItem('signupData', JSON.stringify(this.signupData));
  }
  selectLocByName(cityName: string) {
    const city = this.cities.find(c => c.city === cityName);
    if (city) {
      this.selectLoc(city);
    }
  }

}
