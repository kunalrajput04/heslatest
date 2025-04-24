// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  apiUrl: 'http://hesapi.mizopower.com:6005/api/v1',
  apiComUrl: 'http://hesapi.mizopower.com:6005/api/v1',
  apiRenderUrl: 'http://hesapi.mizopower.com:6005/api/v1',
  slaH: 'http://hesapi.mizopower.com:6005',
  slachk: 'http://hesapi.mizopower.com:6005',
  rf: 'http://hesapi.mizopower.com:6005/api',

  // apiUrl: 'https://hesapi.mizopower.com:6005/api/v1',
  // apiComUrl: 'https://hesapi.mizopower.com:6005/api/v1',
  // apiRenderUrl: 'https://hesapi.mizopower.com:6005/api/v1',
  // slaH: 'https://hesapi.mizopower.com:6005',
  // slachk: 'https://hesapi.mizopower.com:6005',
  // rf: 'https://hesapi.mizopower.com:6005/api',

  // apiUrl: 'http://localhost:6004/api/v1',
  // apiComUrl: 'http://localhost:6004/api/v1',
  // apiRenderUrl: 'http://localhost:6004/api/v1',
  // slaH: 'http://localhost:6004',
  // slachk: 'http://localhost:6004',
  // rf: 'http://localhost:6004/api',

  hesVersion: '1.00.00',
  buildDate: new Date(),
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
