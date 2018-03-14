var MiFlora = require('node-mi-flora');

var Service;
var Characteristic;
var HomebridgeAPI;
var inherits = require('util').inherits;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    HomebridgeAPI = homebridge;

    homebridge.registerAccessory("homebridge-mi-flower-care", "mi-flower-care", MiFlowerCarePlugin);
};


function MiFlowerCarePlugin(log, config) {
    var that = this;
    this.log = log;
    this.name = config.name;
    this.deviceId = config.deviceId;

    this.config = config;

    this.setUpServices();

    this.storedData = {};
	
    this.flora = new MiFlora(this.deviceId);
    this.flora.startScanning();

    this.flora.on('data', function (data) {
        if (data.deviceId = that.deviceId) {
            that.log("Lux: %s, Temperature: %s, Moisture: %s, Fertility: %s", data.lux, data.temperature, data.moisture, data.fertility);
            that.storedData.data = data;
        }
    });

    this.flora.on('firmware', function (data) {
        if (data.deviceId = that.deviceId) {
            that.log("Firmware: %s, Battery level: %s", data.firmwareVersion, data.batteryLevel);
            that.storedData.firmware = data;
        }
    });

    setInterval(function () {
        that.flora.startScanning();
    }, this.config.interval * 1000);
}



MiFlowerCarePlugin.prototype.getFirmwareRevision = function(callback) {
    callback(null, this.storedData.firmware ? this.storedData.firmware.firmwareVersion : '0.0.0');
};

MiFlowerCarePlugin.prototype.getBatteryLevel = function(callback) {
    callback(null, this.storedData.firmware ? this.storedData.firmware.batteryLevel : 0);
};

MiFlowerCarePlugin.prototype.getStatusLowBattery = function(callback) {
    if (this.storedData.firmware) {
        callback(null, this.storedData.firmware.batteryLevel <= 20 ? Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW : Characteristic.StatusLowBattery.BATTERY_LEVEL_NORMAL);
    } else {
        callback(null, Characteristic.StatusLowBattery.BATTERY_LEVEL_LOW);
    }
};

MiFlowerCarePlugin.prototype.getCurrentAmbientLightLevel = function(callback) {
    callback(null, this.storedData.data ? this.storedData.data.lux : 0);
};

MiFlowerCarePlugin.prototype.getCurrentTemperature = function(callback) {
    callback(null, this.storedData.data ? this.storedData.data.temperature : 0);
};

MiFlowerCarePlugin.prototype.getCurrentMoisture = function(callback) {
    callback(null, this.storedData.data ? this.storedData.data.moisture : 0);
};

MiFlowerCarePlugin.prototype.getCurrentFertility = function(callback) {
    callback(null, this.storedData.data ? this.storedData.data.fertility : 0);
};



MiFlowerCarePlugin.prototype.setUpServices = function() {
    // info service
    this.informationService = new Service.AccessoryInformation();

    this.informationService
        .setCharacteristic(Characteristic.Manufacturer, this.config.manufacturer || "Xiaomi")
        .setCharacteristic(Characteristic.Model, this.config.model || "Flower Care")
        .setCharacteristic(Characteristic.SerialNumber, this.config.serial || "9597EEC4B3EC");
    this.informationService.getCharacteristic(Characteristic.FirmwareRevision)
        .on('get', this.getFirmwareRevision.bind(this));


    this.batteryService = new Service.BatteryService(this.name);
    this.batteryService.getCharacteristic(Characteristic.BatteryLevel)
        .on('get', this.getBatteryLevel.bind(this));
    this.batteryService.setCharacteristic(Characteristic.ChargingState, Characteristic.ChargingState.NOT_CHARGEABLE);
    this.batteryService.getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.getStatusLowBattery.bind(this));


    this.lightService = new Service.LightSensor(this.name);
    this.lightService.getCharacteristic(Characteristic.CurrentAmbientLightLevel)
        .on('get', this.getCurrentAmbientLightLevel.bind(this));
    this.lightService.getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.getStatusLowBattery.bind(this));

    this.tempService = new Service.TemperatureSensor(this.name);
    this.tempService.getCharacteristic(Characteristic.CurrentTemperature)
        .on('get', this.getCurrentTemperature.bind(this));
    this.tempService.getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.getStatusLowBattery.bind(this));
		
    this.humidityService = new Service.HumiditySensor(this.name);
    this.humidityService.getCharacteristic(Characteristic.CurrentRelativeHumidity)
        .on('get', this.getCurrentMoisture.bind(this));
    this.humidityService.getCharacteristic(Characteristic.StatusLowBattery)
        .on('get', this.getStatusLowBattery.bind(this));


    /*
        own characteristics and services
    */

    // moisture characteristic
    SoilMoisture = function() {
        Characteristic.call(this, 'Soil Moisture', 'C160D589-9510-4432-BAA6-5D9D77957138');
        this.setProps({
            format: Characteristic.Formats.UINT8,
            unit: Characteristic.Units.PERCENTAGE,
            maxValue: 100,
            minValue: 0,
            minStep: 0.1,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };

    inherits(SoilMoisture, Characteristic);

    SoilMoisture.UUID = 'C160D589-9510-4432-BAA6-5D9D77957138';


    // fertility characteristic
    SoilFertility = function() {
        Characteristic.call(this, 'Soil Fertility', '0029260E-B09C-4FD7-9E60-2C60F1250618');
        this.setProps({
            format: Characteristic.Formats.UINT8,
            maxValue: 10000,
            minValue: 0,
            minStep: 1,
            perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY]
        });
        this.value = this.getDefaultValue();
    };

    inherits(SoilFertility, Characteristic);

    SoilFertility.UUID = '0029260E-B09C-4FD7-9E60-2C60F1250618';


    // moisture sensor
    PlantSensor = function(displayName, subtype) {
        Service.call(this, displayName, '3C233958-B5C4-4218-A0CD-60B8B971AA0A', subtype);

        // Required Characteristics
        this.addCharacteristic(SoilMoisture);

        // Optional Characteristics
        this.addOptionalCharacteristic(Characteristic.CurrentTemperature);
        this.addOptionalCharacteristic(SoilFertility);
    };

    inherits(PlantSensor, Service);

    PlantSensor.UUID = '3C233958-B5C4-4218-A0CD-60B8B971AA0A';

    
    this.plantSensorService = new PlantSensor(this.name);
    this.plantSensorService.getCharacteristic(SoilMoisture)
        .on('get', this.getCurrentMoisture.bind(this));
    this.plantSensorService.getCharacteristic(SoilFertility)
        .on('get', this.getCurrentFertility.bind(this));

};


MiFlowerCarePlugin.prototype.getServices = function() {
    return [this.informationService, this.batteryService, this.lightService, this.tempService, this.humidityService, this.plantSensorService];
};
