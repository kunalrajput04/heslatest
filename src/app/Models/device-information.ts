export class DeviceInformation {
  ownerName: string = '';
  subDivisionName: string = '';
  feederName: string = '';
  subStationName: string = '';
  dtName: string = '';
  commissioningStatus: string = '';
  consumerName: string = '';
  consumerNo: string = '';
  phoneNumber: string = '';
  latitude: string = '';
  longitude: string = '';
  deviceType: string = '';
  ipAddressMain: string = '';
  ipPortMain: string = '';
  address: string = '';
  manufacturer: string = '';
  deviceSerialNo: string = '';
  description: string = 'HES';
  meterType: string = '';
}

export class getDevice {
  deviceNo: string = '';
}

export class deleteDevice {
  deviceSerialNo: string = '';
  reason: string = '';
}

// export interface DeviceInfoList {
//   consumerName: string;
//   deviceSerialNo: string;
//   consumerNo: string;
//   meterType: string;
//   subDivisionName: string;
//   feederName: string;
//   subStationName: string;
//   nicMsisdnNo: string;
//   ipAddressMain: string;
//   latitude: string;
//   longitude: string;  
//   network:string;
//   installationDate:string;
//   meterMode:string;
  
// }

export interface DeviceInfoList {
  consumerName: string;
  consumerNo: string;
  address: string;
  phoneNo: string;
  deviceSerialNo: string;
  installationDate: string;
  meterMode: string;  
  billMode: string; 
  meterType: string; 
  network: string;
  nicIPV6: string;  
  subDivisionName: string;  
  subStationName: string;
  feederName: string;
  latitude: string;
  longitude: string;
}

export interface DeviceInfoListDcu {
  consumerName: string;
  deviceSerialNo: string;
  consumerNo: string;
  meterType: string;
  subDivisionName: string;
  feederName: string;
  subStationName: string;
  nicMsisdnNo: string;
  ipAddressMain: string;
  latitude: string;
  longitude: string;  
  network:string;
  installationDate:string;
  meterMode:string;
  
}
