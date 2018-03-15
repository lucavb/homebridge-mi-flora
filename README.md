# homebridge-mi-flower-care


[![NPM version](https://badge.fury.io/js/homebridge-mi-flower-care.svg)](https://npmjs.org/package/homebridge-mi-flower-care)
[![Dependency Status](https://david-dm.org/honkmaster/homebridge-mi-flower-care.svg)](https://david-dm.org/honkmaster/homebridge-mi-flower-care) 
![License](https://img.shields.io/badge/license-ISC-lightgrey.svg)
[![Downloads](https://img.shields.io/npm/dm/homebridge-mi-flower-care.svg)](https://npmjs.org/package/homebridge-mi-flower-care)

This is a [Homebridge](https://github.com/nfarina/homebridge) plugin for the Xiaomi Mi Flora / Flower Care devices. Historical display of temperature / moisture data is available via HomeKit apps thats support graphing (e.g. Elgato Eve).

<img src=https://github.com/honkmaster/homebridge-mi-flower-care/blob/master/images/flower_care.jpg />


## Installation

### Prerequisites

Ensure you know the MAC address of your Xiaomi Mi Flora / Flower Care. You can use `hcitool lescan` to scan for devices. The device will appear as `AA:BB:CC:DD:EE:FF Flower care` in the list.

### npm

```
(sudo) npm install -g homebridge-mi-flower-care
```

## Example Config

```
{
  "accessory": "mi-flower-care",
  "name": "Golden cane palm",
  "deviceId": "AA:BB:CC:DD:EE:FF",
  "interval": 300
}
``` 

| Key           | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| accessory     | Required. Has to be "mi-flower-care"                                               |
| name          | Required. The name of this accessory. This will appear in your HomeKit app.        |
| deviceId      | Required. The MAC address of your device. Please use `hcitool lescan` to find the MAC adress of your devices.  |
| interval      | Required. Interval of how often you want this to be refreshed. The unit is seconds. Should be lower than 600, due to FakeGato history support. |


## Running

Due to Bluetooth access, Homebridge **must** run with elevated privileges to work correctly i.e. sudo or root.

## Credits

* lucavb - homebridge-mi-flora
* simont77 - fakegato-history
