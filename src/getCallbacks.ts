import {Characteristic, CharacteristicGetCallback} from "hap-nodejs";
import {IStoredData} from "./types";
import {StatusLowBattery} from "hap-nodejs/dist/lib/gen/HomeKit";

const BATTERY_THRESHOLD = 20;

export const getterFirmware = (storedData: IStoredData, key: string, _default?: string) => {
    return (callback: CharacteristicGetCallback): void => {
        callback(null, storedData.firmware[key] ?? _default);
    };
};

export const getterData = (storedData: IStoredData, key: string, _default?: string | number) => {
    return (callback: CharacteristicGetCallback): void => {
        callback(null, this.storedData.data[key] ?? _default);
    };
};

export const getStatusLowBattery = (storedData: IStoredData) => {
    return (callback: CharacteristicGetCallback): void => {
        callback(null, storedData.firmware.batteryLevel < BATTERY_THRESHOLD ? StatusLowBattery.BATTERY_LEVEL_LOW
            : StatusLowBattery.BATTERY_LEVEL_NORMAL);
    }
};

export const getStatusActive = (storedData: IStoredData) => {
    return (callback: CharacteristicGetCallback): void => {
        callback(null, !!storedData.data.temperature);
    }
};
