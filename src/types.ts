import {
    AccessoryInformation,
    BatteryService,
    HumiditySensor,
    LightSensor,
    TemperatureSensor,
} from 'hap-nodejs/dist/lib/gen/HomeKit';
import {MiFloraDataEvent, MiFloraFirmwareEvent} from 'ts-mi-flora/dist/types';
import {IAccessoryConfig} from 'homebridge-ts-helper/src/index';

export interface IMiFloraConfig extends IAccessoryConfig {
    deviceId: string;
    interval: number;
}

export interface MiFloraServices {
    informationService: AccessoryInformation;
    batteryService: BatteryService;
    lightService: LightSensor;
    tempService: TemperatureSensor;
    humidityService: HumiditySensor;
}

export interface IStoredData {
    firmware: MiFloraFirmwareEvent;
    data: MiFloraDataEvent;
}

export const EMPTY_STORED_DATA: IStoredData = {
    data: {
        temperature: null,
        deviceId: null,
        fertility: null,
        lux: null,
        moisture: null,
    },
    firmware: {
        batteryLevel: null,
        deviceId: null,
        firmwareVersion: null,
    },
};
