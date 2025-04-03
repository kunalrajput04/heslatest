// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://meghasmarts.com:8443/dlms/rest',
  apiComUrl: 'http://115.124.119.161:6003',
  //apiComUrl: 'http://localhost:6003',
  //apiUrl: 'http://meghasmarts.com:8081/rec/rest',
  apiRenderUrl: 'http://meghasmarts.com:6002',
  slaH: 'http://115.124.119.161:8069',
  slaUrl2: 'https://meghasmarts.com:8443/sla2/rest/Evit',
  slaiNfoNEW: 'https://meghasmarts.com:8443/dlms1/rest',
  slachk: 'http://115.124.119.161:5065',
  hesVersion: '1.00.00',
  buildDate: new Date(),
  apiBaseUrl: 'https://meghasmarts.com:6003' // Add this property
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
