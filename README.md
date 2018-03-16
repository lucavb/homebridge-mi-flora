# homebridge-mi-flower-care


[![NPM version](https://badge.fury.io/js/homebridge-mi-flower-care.svg)](https://npmjs.org/package/homebridge-mi-flower-care)
[![Dependency Status](https://david-dm.org/honkmaster/homebridge-mi-flower-care.svg)](https://david-dm.org/honkmaster/homebridge-mi-flower-care) 
![License](https://img.shields.io/badge/license-ISC-lightgrey.svg)
[![Downloads](https://img.shields.io/npm/dm/homebridge-mi-flower-care.svg)](https://npmjs.org/package/homebridge-mi-flower-care)

This is a [Homebridge](https://github.com/nfarina/homebridge) plugin for the Xiaomi Mi Flora / Flower Care devices. Historical display of temperature / moisture data is available via HomeKit apps that support graphing (e.g. Elgato Eve).

<img src=https://raw.githubusercontent.com/honkmaster/homebridge-mi-flower-care/master/images/flower_care.jpg />


## Installation

### 

This plugin is using [node-mi-flora](https://github.com/demirhanaydin/node-mi-flora) / [noble](https://github.com/noble/noble) in the background with the same package dependencies. You can install these dependencies using `apt-get`, if not already done.

```
(sudo) apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```

### Prerequisites

Ensure you know the MAC address of your Xiaomi Mi Flora / Flower Care. You can use `hcitool lescan` to scan for devices. The device will appear as `AA:BB:CC:DD:EE:FF Flower care` in the list.

### npm

```
(sudo) npm install -g homebridge-mi-flower-care
```

## Example Configuration

```
{
  "accessory": "mi-flower-care",
  "name": "Golden cane palm",
  "deviceId": "AA:BB:CC:DD:EE:FF",
  "interval": 300
}
``` 

| Key           | Description | Optional / Required |
|---------------|-------------|---------------------|
| accessory     | Has to be `mi-flower-care`. | Required |
| name          | The name of this accessory. This will appear in your HomeKit app. | Required |
| deviceId      | The MAC address of your Xiaomi Mi Flora / Flower Care device. | Required |
| interval      | Frequency of data refresh in seconds. Should be lower than 600, due to FakeGato history support. | Required |
| humidityAlert | Optional contact sensor. This sensor will be closed when humidity is below humidityAlertLevel. | Optional | 
| humidityAlertLevel | Humidity level in percent used to trigger the humidityAlert contact sensor. Default value is 20. | Optional |


## Running

Due to Bluetooth access, Homebridge **must** run with elevated privileges to work correctly i.e. sudo or root.

## Note

The plugins is using Bluetooth LE (Low Energy) to connect to the Xiaomi Mi Flora / Flower Care devices. Therefore, the first measured values are only visible after the first broadcast of the sensor. This can (in the worst case) take several minutes. Just have a little patience.

## Credits

* lucavb - homebridge-mi-flora
* demirhanaydin - node-mi-flora
* simont77 - fakegato-history
