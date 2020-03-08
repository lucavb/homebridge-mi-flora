import {MiFloraDataEvent, MiFloraFirmwareEvent, NodeMiFloraEvents} from "ts-mi-flora/dist/types";
import {MiFloraServices} from "./types";

export abstract class MiFloraEventHandler {

    constructor(protected readonly services: MiFloraServices) {
    }

    handle(eventType: NodeMiFloraEvents, data: MiFloraDataEvent | MiFloraFirmwareEvent) {
        if (eventType === NodeMiFloraEvents.FIRMWARE) {
            this.handleFirmware(data as MiFloraFirmwareEvent);
        } else if (eventType === NodeMiFloraEvents.DATA) {
            this.handleData(data as MiFloraDataEvent);
        }
    }

    abstract handleData(data: MiFloraDataEvent);

    abstract handleFirmware(firmware: MiFloraFirmwareEvent);

}
