import {MiFloraEventHandler} from "./MiFloraEventHandler";
import {Characteristic} from "hap-nodejs";
import {MiFloraDataEvent, MiFloraFirmwareEvent} from "ts-mi-flora/dist/types";

export class DataHandler extends MiFloraEventHandler {

    handleData(data: MiFloraDataEvent) {

        this.services.lightService.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
            .updateValue(data.lux);
        this.services.lightService.getCharacteristic(Characteristic.StatusActive)
            .updateValue(true);

        this.services.tempService.getCharacteristic(Characteristic.CurrentTemperature)
            .updateValue(data.temperature);
        this.services.tempService.getCharacteristic(Characteristic.StatusActive)
            .updateValue(true);

        this.services.humidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity)
            .updateValue(data.moisture);
        this.services.humidityService.getCharacteristic(Characteristic.StatusActive)
            .updateValue(true);
    }

    handleFirmware(firmware: MiFloraFirmwareEvent) {
    }

}
