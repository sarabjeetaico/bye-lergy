import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(public http: HttpClient) { 
    const deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      localStorage.setItem('deviceId', uuidv4());
    } 
  }

  headers: any = new HttpHeaders().set(
    'x-api-key',
    '12c8587eb130d5c95e5fae273eaef821a5b711ac5463a841086138405b9a4017'
  );

  getCityFromLatLong(lat: number, lng: number): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsApiKey}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        if (res.status === 'OK') {
          const results = res.results;
          for (const result of results) {
            for (const component of result.address_components) {
              if (component.types.includes('locality')) {
                return component.long_name;
              }
            }
          }
          return null;
        } else {
          return null;
        }
      })
    );
  }

  updateProfile(profileData: any): Observable<any> {
    let data = {
      function: "updateProfile_user",
      deviceId: localStorage.getItem('deviceId'),
      profileData: profileData
    };
    console.log(data)
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status == 200) {
          return res.body;
        } else {
          return [];
        }
      })
    );
  }

  getcity(): Observable<any> {
    let data = {
      function: "getcity"
    }
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        console.log('getcity API response:', res); // <-- log full response
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      }, (err:any) => {
        console.error('getcity API error:', err); // <-- log error
        return [];
      })
    );
  }
  getDr(): Observable<any> {
    let data = {
      function: "get_doctors"
    }
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        console.log('getDr API response:', res); // <-- log full response
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      }, (err:any) => {
        console.error('getDr API error:', err); // <-- log error
        return [];
      })
    );
  }

 

  getrecommendations(aqi_level: any): Observable<any> {
    let data = {
      function: "getrecommendations",
      aqi_level: aqi_level
    }
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      })
    );
  }

  getaqinotification(aqi_level: any, group_type: any): Observable<any> {
    let data = {
      function: "getaqinotification",
      aqi_level: aqi_level,
      group_type: group_type
    }
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      })
    );
  }

  getallergynotification(allergydata: any): Observable<any> {
    let data = {
      function: "getallergynotification",
      allergydata: allergydata
    }
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        console.log(res)
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      })
    );
  }

  getpharm(city: string): Observable<any> {
    let data = {
      function: "getPharmacy",
      city: city
    }
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      })
    );
  }

  insertCode(data: any): Observable<any> {
    data['function'] = "insercode";
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      })
    );
  }

  getAQI(lat: number, long: number): Observable<any> {
    let data = {
      "function": "weather_data",
      "lat": lat,
      "lng": long
    }
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        console.log('getAQI API response:', res); // <-- log full response
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      }, (err:any) => {
        console.error('getAQI API error:', err); // <-- log error
        return [];
      })
    );
  }

  store_data_range(rate: any, type: any, loc: any,signupData:any): Observable<any> {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate()
    let data = {
      function: "store_data_range",
      rate: rate,
      type: type,
      loc: loc,
      deviceId: localStorage.getItem('deviceId'),
      date: currentYear + "-" + currentMonth + "-" + currentDay,
      signupData: signupData
    }
    console.log(data)
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        console.log(res.body)
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      })
    );
  }

  get_grap_data(selectedRange:any): Observable<any> {
    let data = {
      function: "show_graph",
      deviceId: localStorage.getItem('deviceId'),
      selectedRange:selectedRange
    }
    console.log("payload: ",data)
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        console.log(res.body)
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      })
    );
  }
  userSignup(selectedRange:any): Observable<any> {
    
    let data = {
      function: "signup_user",
      deviceId: localStorage.getItem('deviceId'),
      selectedRange:selectedRange
    }
    console.log("payload: ",data)
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        console.log(res.body)
        if (res.status == 200) {
          return res.body
        } else {
          return []
        }
      })
    );
  }

  get_grap_data_for_range(range: { from: string, to: string }): Observable<any> {
    let data = {
      function: "show_graph",
      deviceId: localStorage.getItem('deviceId'),
      from: range.from,
      to: range.to
    };
    console.log('Fetching graph data for range:', data);
    return this.http.post(environment.apiUrl, data, { observe: 'response' }).pipe(
      map((res: HttpResponse<any>) => {
        console.log('from:', data.from, 'to:', data.to); // Log both from and to
        console.log(res.body);
        if (res.status == 200) {
          return res.body;
        } else {
          return [];
        }
      })
    );
  }

  getTemp(lat: number, long: number): Observable<any> {
    return this.http.get(environment.TempURL + "?lat=" + lat + "&lon=" + long + "&key=" + environment.apikey).pipe(
      map((res: any) => {
        return res
      })
    );
  }

  getPollen(lat: number, long: number): Observable<any> {
    let lc = `lat=${lat}&lng=${long}`;
    return this.http
      .get(environment.pollenURL + lc, { headers: this.headers })
      .pipe(
        map((res: any) => {
          console.log('Pollen details here: ');
          console.log(res);
          return res;
        })
      );
  }
  ngOnInit() {
      const deviceId = localStorage.getItem('deviceId');
      if (!deviceId) {
        localStorage.setItem('deviceId', uuidv4());
      } 
    }
}
