export class Dashboard {
  OWNER: string = '';
  SUBDEVISION: number = 0;
  FEEDER: number = 0;
  SUBSTATION: number = 0;
  DT: number = 0;
  DCU: number = 0;
  DEVICES: number = 0;
}

export interface IDashboardChartComman {
  ownerName: string;
  billingdayfailurecount: number;
  billingdaysuccesscount: number;
  billingmonthfailurecount: number;
  billingmonthsuccesscount: number;
  billingweekfailurecount: number;
  billingweeksuccesscount: number;
  billingyestfailurecount: number;
  billingyestsuccesscount: number;
  commdayfailurecount: number;
  commdaysuccesscount: number;
  commmonthfailurecount: number;
  commmonthsuccesscount: number;
  commweekfailurecount: number;
  commweeksuccesscount: number;
  commyestfailurecount: number;
  commyestsuccesscount: number;
  dailydayfailurecount: number;
  dailydaysuccesscount: number;
  dailymonthfailurecount: number;
  dailymonthsuccesscount: number;
  dailyweekfailurecount: number;
  dailyweeksuccesscount: number;
  dailyyestfailurecount: number;
  dailyyestsuccesscount: number;
  deltadayfailurecount: number;
  deltadaysuccesscount: number;
  deltamonthfailurecount: number;
  deltamonthsuccesscount: number;
  deltaweekfailurecount: number;
  deltaweeksuccesscount: number;
  deltayestfailurecount: number;
  deltayestsuccesscount: number;
  eventdayfailurecount: number;
  eventdaysuccesscount: number;
  eventmonthfailurecount: number;
  eventmonthsuccesscount: number;
  eventweekfailurecount: number;
  eventweeksuccesscount: number;
  eventyestfailurecount: number;
  eventyestsuccesscount: number;
  instantdayfailurecount: number;
  instantdaysuccesscount: number;
  instantmonthfailurecount: number;
  instantmonthsuccesscount: number;
  instantweekfailurecount: number;
  instantweeksuccesscount: number;
  instantyestfailurecount: number;
  instantyestsuccesscount: number;


  dt: number,
  feeder: number,
  subdevision: number,
  substation: number,
  dcu: number,
  lastupdatedtime: string,
  meters: number,
  ctmeters: number,
  htmeters: number,
  singlephasemeters: number,
  threephasemeters: number,
  inactivedev: number,
  activedev: number,
  faultydev: number,

}

export interface IChartTable {
  commandType: string;
  status: string;
  daytype: string;
}
