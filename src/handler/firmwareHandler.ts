import {MiFloraEventHandler} from "./MiFloraEventHandler";
import {MiFloraDataEvent, MiFloraFirmwareEvent} from "ts-mi-flora/dist/types";
import {Characteristic} from "hap-nodejs";

const lowBattery = (level: number) => {
    return level <= 10 ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW
        : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL;
};

export class FirmwareHandler extends MiFloraEventHandler {

    handleData(data: MiFloraDataEvent) {
    }

    handleFirmware(firmware: MiFloraFirmwareEvent) {

        // Update values
        this.services.informationService.getCharacteristic(Characteristic.FirmwareRevision)
            .updateValue(firmware.firmwareVersion);

        this.services.batteryService.getCharacteristic(Characteristic.BatteryLevel)
            .updateValue(firmware.batteryLevel);
        this.services.batteryService.getCharacteristic(Characteristic.StatusLowBattery)
            .updateValue(lowBattery(firmware.batteryLevel));

        this.services.lightService.getCharacteristic(Characteristic.StatusLowBattery)
            .updateValue(lowBattery(firmware.batteryLevel));

        this.services.tempService.getCharacteristic(Characteristic.StatusLowBattery)
            .updateValue(lowBattery(firmware.batteryLevel));

        this.services.humidityService.getCharacteristic(Characteristic.StatusLowBattery)
            .updateValue(lowBattery(firmware.batteryLevel));

    }

}
