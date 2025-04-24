import { DataSharedService } from 'src/app/Services/data-shared.service';

export class Common {
  constructor(private datasharedservice: DataSharedService) {}

  // checkDataExists(res: any) {
  //   if(
  //     res != null &&
  //     res.message != 'Key Is Not Valid' &&
  //     res.message != 'Session Is Expired'
  //   ) {
  //     return res;
  //   } else {
      
  //     this.datasharedservice.clearlocalStorageData(true);
  //   }
  // }
  checkDataExists(res: any): any {
    if (
      res?.result === true && 
      res?.message !== 'Key Is Not Valid' && 
      res?.message !== 'Session Is Expired'
    ) {
      return res;
    } else {
      this.datasharedservice.clearlocalStorageData(true);
      return null;
    }
  }
}
