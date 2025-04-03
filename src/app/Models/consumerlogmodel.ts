export class Consumerlogmodel {
    billing:Consumerlogdata;
    instant:Consumerlogdata;
    deltaLP:Consumerlogdata;
    dailyLP:Consumerlogdata;
    powerRelatedEvents:Consumerlogdata;
    voltageRelatedEvents:Consumerlogdata;
    currentRelatedEvents:Consumerlogdata;
    otherRelatedEvents:Consumerlogdata;
    controlRelatedEvents:Consumerlogdata;
    transactionRelatedEvents:Consumerlogdata;
}


export class Consumerlogdata {
    IN_PROGRESS:number=0;   
    FAILURE:number=0;
    SUCCESS:number=0;
}
