# homebridge-mi-flower-care

This is a homebridge plugin for the Xiaomi Mi Flora / Flower Care devices.


## Installation

### Prerequisites

1. Ensure you know the MAC address of your Xiaomi Mi Flora / Flower Care. You can use `hcitool lescan` to scan for devices.

### npm

```
npm install -g homebridge-mi-flower-care
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
| name          | Required. The name of this accessory. This will appear in your HomeKit app         |
| deviceId      | Required. The MAC address of your device. Please use `hcitool lescan` to find the MAC adress of your devices.  |
| interval      | Required. Interval of how often you want this to be refreshed. The unit is seconds. |


## Running

Due to Bluetooth access, Homebridge **must** run with elevated privileges to work correctly i.e. sudo or root.