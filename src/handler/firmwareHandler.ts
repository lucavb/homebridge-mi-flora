import {MiFloraEventHandler} from './MiFloraEventHandler';
import {BatteryLevel, FirmwareRevision, StatusLowBattery} from 'hap-nodejs/dist/lib/gen/HomeKit';
import {MiFloraDataEvent, MiFloraFirmwareEvent} from 'ts-mi-flora/dist/types';

const lowBattery = (level: number): number => {
    return level <= 10 ? StatusLowBattery.BATTERY_LEVEL_LOW :
        StatusLowBattery.BATTERY_LEVEL_NORMAL;
};

export class FirmwareHandler extends MiFloraEventHandler {
    handleData(data: MiFloraDataEvent) {
    }

    handleFirmware(firmware: MiFloraFirmwareEvent) {
        // Update values
        this.services.informationService.getCharacteristic(FirmwareRevision)
            .updateValue(firmware.firmwareVersion);

        this.services.batteryService.getCharacteristic(BatteryLevel)
            .updateValue(firmware.batteryLevel);
        this.services.batteryService.getCharacteristic(StatusLowBattery)
            .updateValue(lowBattery(firmware.batteryLevel));

        this.services.lightService.getCharacteristic(StatusLowBattery)
            .updateValue(lowBattery(firmware.batteryLevel));

        this.services.tempService.getCharacteristic(StatusLowBattery)
            .updateValue(lowBattery(firmware.batteryLevel));

        this.services.humidityService.getCharacteristic(StatusLowBattery)
            .updateValue(lowBattery(firmware.batteryLevel));
    }
}
