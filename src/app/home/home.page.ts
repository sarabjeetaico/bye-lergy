import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { DataService } from '../services/data.service';
import { LoadingController } from '@ionic/angular';
import { Router } from "@angular/router";
import { v4 as uuidv4 } from 'uuid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports :[FooterComponent,IonicModule,CommonModule,FormsModule]
})
export class HomePage implements OnInit {
  @ViewChild('cp') tp!: ElementRef<HTMLElement>;
  form!: FormGroup;
  citydetails: any = {};
  aqiDetails: any = {};
  aqiValue: any;
  aqi_text_image: string = "assets/images/purple-spinner.gif";
  reco_level: any;
  level: any;
  polen_value: any;
  first_recomm: any[] = [];
  recomendations: any;
  allergies: any[] = [];
  icon: string = "assets/images/purple-spinner.gif";
  temp: any;
  tree: any;
  grass: any;
  weed: any;
  wind_deg: any;
  isLoading = false;
  showhide = true;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };
  searchText: string = '';
  loc_stor: any;
  deviceId: string = '';
  col1Color = '#94CB5D';
  col2Color = '#E6FFCE';
  col1fontColor = '#FFF';
  col2fontColor = '#94CB5D';
  cities: any[] = [];
  filtercities: any[] = [];
  showList = false;
signupData: any = {};
selectedCity: string = ''; // <-- Add this line
  constructor(
    private router: Router,
    private getData: DataService,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder
  ) {}

  aqiLoad() {
    this.present();

    // Use signupData lat and long instead of cdetails
    // const cdetails = localStorage.getItem('cdetails');
    // this.citydetails = cdetails ? JSON.parse(cdetails) : {};

    // const allergies = localStorage.getItem('allergies');
    this.allergies = ["Dust Allergy", "Pollen Allergy", "Mold Allergy"];

    // Use lat and long from signupData if available, else fallback to citydetails
    let lat = this.signupData['latitude'] || (this.citydetails ? this.citydetails['Lat'] : null);
    let long = this.signupData['longitude'] || (this.citydetails ? this.citydetails['Long'] : null);
    
    this.getData.getAQI(lat, long).subscribe((res) => {
      console.log("this.res: ", res);
      this.aqiDetails = res['data'];
      this.aqiValue = this.aqiDetails['aqi'];
      this.aqi_text_image = this.aqiDetails['aqi_text_image'];
      this.reco_level = this.aqiDetails['aqi_reco_level'];
      this.level = this.aqiDetails['aqi_text'];
      this.col1Color = this.aqiDetails['col1Color'];
      this.col2Color = this.aqiDetails['col2Color'];
      this.polen_value = this.aqiDetails['pollen_value'];
      this.icon = this.aqiDetails['icon'];
      this.temp = this.aqiDetails['temp'];
      this.wind_deg = this.aqiDetails['wind_deg'];
      this.searchText = this.signupData['city'];
      this.weed = `${this.aqiDetails['pollen_count']['weed_pollen']} ( ${this.aqiDetails['pollen_risk']['weed_pollen']} )`;
      this.grass = `${this.aqiDetails['pollen_count']['grass_pollen']} ( ${this.aqiDetails['pollen_risk']['grass_pollen']} )`;
      this.tree = `${this.aqiDetails['pollen_count']['tree_pollen']} ( ${this.aqiDetails['pollen_risk']['tree_pollen']} )`;

      this.first_recomm = [];
      for (let index = 0; index < this.allergies.length; index++) {
        const allergy = this.allergies[index];
        console.log("this.allergy: ", allergy);
        let heading: any = {};
        if (allergy === "Dust Allergy") {
          heading.heading = allergy;
          heading.image = '../../assets/images/Mq7F.gif';
          heading.text = "Clean your house regularly, using a central vacuum or a vacuum with a HEPA filter. If you are allergic, wear N95 face mask masks as it offers the significant protection against allergens and dust mites. Keep humidity low maintain a relative humidity below 50% in your home.";
        } else if (allergy === "Pollen Allergy") {
          heading.heading = allergy;
          heading.image = 'https://www.ucihealth.org/-/media/images/modules/news/stories/2014/dandelion-pollen-640.gif';
          heading.text = "Eliminate sources of dampness and quickly clean up any spills or leaks to prevent mold from growing. Use dehumidifiers or exhaust fans  - to help reduce moisture and humidity in bathrooms or other rooms in your home.";
        } else if (allergy === "Mold Allergy") {
          heading.heading = allergy;
          heading.image = '../../assets/images/mold-gif.gif';
          heading.text = "Keep the surrounding area clean and the windows and doors closed when the pollen counts are high. Limit your outdoor activities when pollen counts are high. Change and wash clothes worn during outdoor activities. Shower daily before going to bed.";
        }
        this.first_recomm.push(heading);
      }
      this.get_recomendation(this.reco_level);
      this.dismiss();
      console.log("this.first_recomm: ", this.first_recomm);
    });
  }

  get_recomendation(reco_level: any) {
    this.getData.getrecommendations(reco_level).subscribe((res) => {
      this.recomendations = res;
    });
  }

  async openWebpage() {
    window.open(
      'https://www.airnow.gov/sites/default/files/2018-04/aqi_brochure_02_14_0.pdf',
      '_system',
      'location=yes'
    );
  }

  ngOnInit() {
    const deviceId = localStorage.getItem('deviceId');
    if (deviceId) {
      this.deviceId = deviceId;
      console.log(this.deviceId);
    } else {
      this.deviceId = uuidv4();
      localStorage.setItem('deviceId', this.deviceId);
    }

    this.getData.getcity().subscribe(res => {
      this.cities = res;
      this.filtercities = res;
      console.log(res);
    });
    const data = localStorage.getItem('signupData');
    if (data) {
      this.signupData = JSON.parse(data);
      console.log('Signup data:', this.signupData['name']);
    }

    this.form = this.fb.group({
      name: this.fb.array([])
    });
  }

  selectLoc(city: any) {
    this.selectedCity = city.city;
    this.searchText = city.city;
    this.showList = false;
    localStorage.setItem('cdetails', JSON.stringify(city));
    console.log("local data: ", this.searchText);
    this.fetchDataForCity(city.city); // Use your new fetch function
  }

  fetchDataForCity(city: string) {
    // Find the city object from your cities array
    const cityObj = this.cities.find(c => c.city === city);
    if (cityObj) {
      // Update citydetails with the selected city's lat/long
      this.citydetails = cityObj;
      this.signupData['latitude'] = cityObj.Lat;
      this.signupData['longitude'] = cityObj.Long;
      this.signupData['city'] = cityObj.city;
      // Save updated signupData back to localStorage
      localStorage.setItem('signupData', JSON.stringify(this.signupData));
      // Now reload AQI and recommendations
      this.aqiLoad();
    }
  }

  search(event: any) {
    this.searchText = event;
    if (this.searchText == null) {
      this.showList = false;
    } else {
      this.showList = true;
    }
    console.log("searchText: ", this.searchText);
    this.filtercities = this.cities.filter((item: any) => {
      return item.city.toLowerCase().includes(this.searchText.toLowerCase());
    });
  }

  ngAfterViewInit(): void {
    this.aqiLoad()
    // this.triggerFalseClick()
  }

  triggerFalseClick() {
    let el: HTMLElement = this.tp.nativeElement;
    el.click();
  }

  showhide_change() {
    this.showhide = !this.showhide;
  }

  go_back() {
    this.router.navigateByUrl('/mycity', { replaceUrl: true });
  }

  async present() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
}