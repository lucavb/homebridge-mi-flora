# homebridge-mi-flora

This is a homebridge plugin for the Xiaomi Mi Flora plant dongle or whatever you want to call it.

## Installation of other plugins

I assume that this [Guide](https://github.com/nfarina/homebridge/wiki/Running-HomeBridge-on-a-Raspberry-Pi) was followed, so your homebridge config file is under /var/homebridge and you used the systemd version. Create a folder called other_plugins in that hombridge folder and checkout this repository inside that newly created folder.

Now you want to alter the file you placed under /etc/default/homebridge accordingly

```
# Defaults / Configuration options for homebridge
# The following settings tells homebridge where to find the config.json file an$
#HOMEBRIDGE_OPTS=-U /var/homebridge
HOMEBRIDGE_OPTS=-U /var/homebridge -P /var/homebridge/other_plugins -D

# If you uncomment the following line, homebridge will log more
# You can display this via systemd's journalctl: journalctl -f -u homebridge
#DEBUG=*
```

You might need to run a systemctl command to update the config file. The system should inform you about the specific comand if you enter ``sudo service hombridge stop``. After you have executed the suggested command you'll want to enter ``sudo service hombridge restart``. Homebridge should now be aware of any additional plugins within the /var/hombridge/other_plugins folder.

Now run the following code to install the dependencies.

```
cd /var/hombridge/other_plugins/homebridge-mi-flora
npm i
```

You can now add the configuration to your config.json


## Example Config

```
    {
      "accessory": "mi-flora",
      "name": "Heisenberg",
      "deviceId": "FF:33:D3:CD:18:81",
      "interval": 300
    }
``` 


| Key           | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| accessory     | Required. Has to be "mi-flora"                                             |
| name          | Required. The name of this accessory. This will appear in your homekit app         |
| deviceId      | Required. The MAC address of your device. Please refer to my other project over [here](https://github.com/lucavb/homebridge-magic-blue-bulb) for finding the MAC adress of devices  |
| interval      | Required. Interval of how often you want this to be refreshed. The unit is seconds. |

## Issues

This software comes with no warranty. It works for me and it might for you. Keep in mind that homebridge is going to require root because of the bluetooth access. 

