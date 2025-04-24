export class Dcu {
    user_id: string = '';
    dcu_serial_number: string = '';
    simSerialNo: string = '';
    battery_voltage: string = '';
    cpu_temperature: string = '';
    latitude: string = '';
    longitude: string = '';
    signalStrength: string = '';
    simIp: string = '';
    simOperator: string = '';
    timestamp: string = '';
}

export class DcuOutage {
    user_id: string = '';
    dcu_serial_number: string = '';
    timestamp: string = '';
    outage: string = '';
}

export class Config {
    user_id: string = '';
    Category: string = '';
    Rate: string = '';
}
