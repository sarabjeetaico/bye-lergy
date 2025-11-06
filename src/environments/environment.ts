// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
<<<<<<< HEAD
  production: false
=======
  production: false,
  apiUrl:"https://multiplierai.co/glenmark_malaysia_api/",
  AQIURL:"http://api.airvisual.com/v2/nearest_city",
  apikey:"2fd7bb50-a971-4ea2-bc98-d46d26879d5e",
  // apikey:"dd0dabd5451d4502b3e121235211712",
  TempURL:"http://api.weatherapi.com/v1/current.json",
  // pollenURL:"https://api.tomorrow.io/v4/timelines?fields=treeIndex,weedIndex,grassIndex&timesteps=current&apikey=rC4oqYopmmYyPvujHWwtPYLXl4ocgAMu&"
  pollenURL: 'https://api.ambeedata.com/latest/pollen/by-lat-lng?',
  newApi : "https://api.ambeedata.com/latest/by-lat-lng?",
  newApiKey : "12c8587eb130d5c95e5fae273eaef821a5b711ac5463a841086138405b9a4017",
  googleMapsApiKey: "AIzaSyDHkCXE0t68ZiKdIPcXwe3YrHDibX_0MsI"
>>>>>>> 1216593 (Add updates to dev branch)
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
