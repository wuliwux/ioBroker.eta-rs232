"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
// tslint:disable: typedef
Object.defineProperty(exports, "__esModule", { value: true });
const aecparameters_enum_1 = require("../enums/aecparameters.enum");
const aelkparameters_enum_1 = require("../enums/aelkparameters.enum");
const eta_furnace_types_enum_1 = require("../enums/eta-furnace-types.enum");
class DefaultCommonObjectsRepository {
    constructor(commonService) {
        this.commonService = commonService;
    }
    GetIoObjectByParameterIndexListeRowMessage(message) {
        const common = {
            name: message.name,
            type: "number",
            role: "indicator",
            read: false,
            write: false,
        };
        const obj = {
            _id: "",
            type: "state",
            common: common,
            native: {
                knoten: message.knoten,
            },
        };
        return obj;
    }
    GetIoObjectByParameterListeRowMessage(message) {
        //let value = message.akt_wert_hbyte * 256 + message.akt_wert_hbyte;
        const common = {
            name: message.name,
            type: "number",
            role: "indicator",
            read: false,
            write: false,
            min: message.min_wert,
            max: message.max_wert,
            def: message.std_wert,
        };
        const obj = {
            _id: "",
            type: "state",
            common: common,
            native: {
                ebene: message.ebene,
                knoten: message.knoten,
                teiler: message.teiler,
                unknown9: message.unknown9,
                unknown10: message.unknown10,
                index: message.index,
            },
        };
        switch (message.einheit) {
            case 32:
                common.unit = "";
                break;
            case 37:
                common.unit = "%";
                break;
            case 109: // Zeit
                common.unit = "Minuten";
                break;
            case 115: // Zeit
                common.unit = "Sekunden";
                break;
            case 176: // Zeit
                common.unit = "°C";
                break;
            default:
                break;
        }
        switch (message.datenType) {
            case 0:
                common.type = "number";
                break;
            case 2:
                common.type = "boolean";
                break;
            case 3: // Zeit
            case 5: // Datum
            case 255: // Text
                common.type = "string";
                break;
            default:
                break;
        }
        return obj;
    }
    GetIoObjectByMonitorListeRowMessage(message) {
        const common = {
            name: message.name,
            type: "number",
            role: "indicator",
            read: false,
            write: false,
        };
        const obj = {
            _id: "",
            type: "state",
            common: common,
            native: {
                indexEbene: message.indexEbene,
                knoten: message.knoten,
                teiler: message.teiler,
                ueberschrift: message.ueberschrift,
                Unknown1: message.Unknown1,
                Unknown2: message.Unknown2,
            },
        };
        switch (message.datenType) {
            case 0:
                common.type = "number";
                break;
            case 2:
                common.type = "boolean";
                break;
            case 3: // Zeit
            case 5: // Datum
            case 255: // Text
                common.type = "string";
                break;
            default:
                break;
        }
        return obj;
    }
    GetIoObjectByDeviceMessage(deviceMessage) {
        const common = {
            name: this.commonService.getParameterName(deviceMessage.place, deviceMessage.parameter),
            type: "number",
            role: "indicator",
            read: true,
            write: false,
            min: -100,
            max: 300,
            unit: "°C",
        };
        switch (deviceMessage.place) {
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Scheitholzkessel: {
                const parameter = deviceMessage.parameter;
                switch (parameter) {
                    case aecparameters_enum_1.AECParameters.Pufferladezst:
                        common.unit = "%";
                        break;
                    default:
                        break;
                }
                break;
            }
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Pelletskessel_bis_30kW: {
                const parameter = deviceMessage.parameter;
                break;
            }
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Pelletskessel_ab_35kW: {
                const parameter = deviceMessage.parameter;
                switch (parameter) {
                    case aelkparameters_enum_1.AELKParameters.Pelletsvorrat:
                        common.unit = "%";
                        break;
                    default:
                        break;
                }
                break;
            }
        }
        const obj = {
            _id: "",
            type: "state",
            common: common,
            native: {},
        };
        return obj;
    }
}
exports.DefaultCommonObjectsRepository = DefaultCommonObjectsRepository;
