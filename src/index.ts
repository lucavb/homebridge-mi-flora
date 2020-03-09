import {HomebridgeAccessory, HomebridgeApi} from 'homebridge-ts-helper';
import {MiFlora} from 'ts-mi-flora/dist';
import * as hap from 'hap-nodejs';
import {CharacteristicEventTypes} from 'hap-nodejs/dist';
import {MiFloraDataEvent, MiFloraFirmwareEvent, NodeMiFloraEvents} from 'ts-mi-flora/dist/types';
import {EMPTY_STORED_DATA, IMiFloraConfig, MiFloraServices} from './types';
import {getStatusActive, getStatusLowBattery, getterData, getterFirmware} from './getCallbacks';
import {MiFloraEventHandler} from './handler/MiFloraEventHandler';
import {FirmwareHandler} from './handler/firmwareHandler';
import {DataHandler} from './handler/dataHandler';

let Service;
let Characteristic;
const os = require('os');
const hostname = os.hostname();

export default (homebridge: HomebridgeApi) => {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory('homebridge-mi-flower-care', 'mi-flower-care', MiFlowerCarePlugin);
};

export class MiFlowerCarePlugin extends HomebridgeAccessory {
    private readonly interval: number;
    private readonly flora: MiFlora;
    private readonly storedData: {
        firmware: MiFloraFirmwareEvent;
        data: MiFloraDataEvent;
    };

    protected servicesObject: MiFloraServices;

    private readonly handlers: MiFloraEventHandler[];

    constructor(protected readonly log, protected readonly config: IMiFloraConfig) {
        super(log, config);
        this.interval = Math.min(Math.max(config.interval, 1), 600);

        this.storedData = JSON.parse(JSON.stringify(EMPTY_STORED_DATA));

        this.setUpServices();

        this.handlers.push(new FirmwareHandler(this.servicesObject));
        this.handlers.push(new DataHandler(this.servicesObject));

        this.flora = new MiFlora(config.deviceId);
        this.flora.on(NodeMiFloraEvents.DATA, (data: MiFloraDataEvent) => {
            this.handlers[0].handleData(data);
        });

        this.flora.on(NodeMiFloraEvents.FIRMWARE, (data: MiFloraFirmwareEvent) => {
            this.handlers[0].handleFirmware(data);
        });

        setInterval(() => {
            // Start scanning for updates, these will arrive in the corresponding callbacks
            this.flora.startScanning();

            // Stop scanning 100ms before we start a new scan
            setTimeout(() => {
                this.flora.stopScanning();
            }, (this.interval - 0.1) * 1000);
        }, this.interval * 1000);
    }

    getServices(): typeof hap.Service[] {
        return Object.values(this.servicesObject);
    }

    private setUpServices() {
        this.servicesObject.informationService = new Service.AccessoryInformation();

        this.servicesObject.informationService
            .setCharacteristic(Characteristic.Manufacturer, this.config.manufacturer || 'Xiaomi')
            .setCharacteristic(Characteristic.Model, this.config.model || 'Flower Care')
            .setCharacteristic(Characteristic.SerialNumber, this.config.serial || hostname + '-' + this.config.name);
        this.servicesObject.informationService.getCharacteristic(Characteristic.FirmwareRevision)
            .on(CharacteristicEventTypes.GET, getterFirmware(this.storedData, 'firmwareVersion', '0.0.0'));

        this.servicesObject.batteryService = new Service.BatteryService(this.config.name);
        this.servicesObject.batteryService.getCharacteristic(Characteristic.BatteryLevel)
            .on(CharacteristicEventTypes.GET, getterFirmware(this.storedData, 'batteryLevel', '0'));
        this.servicesObject.batteryService.setCharacteristic(Characteristic.ChargingState, Characteristic.ChargingState.NOT_CHARGEABLE);
        this.servicesObject.batteryService.getCharacteristic(Characteristic.StatusLowBattery)
            .on(CharacteristicEventTypes.GET, getStatusLowBattery(this.storedData));

        this.servicesObject.lightService = new Service.LightSensor(this.config.name);
        this.servicesObject.lightService.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
            .on(CharacteristicEventTypes.GET, getterData(this.storedData, 'lux', 0));
        this.servicesObject.lightService.getCharacteristic(Characteristic.StatusLowBattery)
            .on(CharacteristicEventTypes.GET, getStatusLowBattery(this.storedData));
        this.servicesObject.lightService.getCharacteristic(Characteristic.StatusActive)
            .on(CharacteristicEventTypes.GET, getStatusActive(this.storedData));

        this.servicesObject.tempService = new Service.TemperatureSensor(this.config.name);
        this.servicesObject.tempService.getCharacteristic(Characteristic.CurrentTemperature)
            .on(CharacteristicEventTypes.GET, getterData(this.storedData, 'temperature', 0));
        this.servicesObject.tempService.getCharacteristic(Characteristic.StatusLowBattery)
            .on(CharacteristicEventTypes.GET, getStatusLowBattery(this.storedData));
        this.servicesObject.tempService.getCharacteristic(Characteristic.StatusActive)
            .on(CharacteristicEventTypes.GET, getStatusActive(this.storedData));

        this.servicesObject.humidityService = new Service.HumiditySensor(this.config.name);
        this.servicesObject.humidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity)
            .on(CharacteristicEventTypes.GET, getterData(this.storedData, 'moisture', 0));
        this.servicesObject.humidityService.getCharacteristic(Characteristic.StatusLowBattery)
            .on(CharacteristicEventTypes.GET, getStatusLowBattery(this.storedData));
        this.servicesObject.humidityService.getCharacteristic(Characteristic.StatusActive)
            .on(CharacteristicEventTypes.GET, getStatusActive(this.storedData));
    }
}
