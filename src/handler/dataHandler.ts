import {MiFloraEventHandler} from './MiFloraEventHandler';
import {
    CurrentAmbientLightLevel,
    CurrentRelativeHumidity,
    CurrentTemperature,
    StatusActive,
} from 'hap-nodejs/dist/lib/gen/HomeKit';
import {MiFloraDataEvent, MiFloraFirmwareEvent} from 'ts-mi-flora/dist/types';

export class DataHandler extends MiFloraEventHandler {
    handleData(data: MiFloraDataEvent) {
        this.services.lightService.getCharacteristic(CurrentAmbientLightLevel)
            .updateValue(data.lux);
        this.services.lightService.getCharacteristic(StatusActive)
            .updateValue(true);

        this.services.tempService.getCharacteristic(CurrentTemperature)
            .updateValue(data.temperature);
        this.services.tempService.getCharacteristic(StatusActive)
            .updateValue(true);

        this.services.humidityService.getCharacteristic(CurrentRelativeHumidity)
            .updateValue(data.moisture);
        this.services.humidityService.getCharacteristic(StatusActive)
            .updateValue(true);
    }

    handleFirmware(firmware: MiFloraFirmwareEvent) {
    }
}
