"use strict";
/* eslint-disable @typescript-eslint/camelcase */
// tslint:disable:typedef
// tslint:disable: no-bitwise
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const eta_furnace_types_enum_1 = require("./enums/eta-furnace-types.enum");
const load_list_type_enum_1 = require("./enums/load-list-type.enum");
const load_list_stop_message_1 = require("./messages/load-list-stop-message");
const device_message_1 = require("./models/device-message");
const device_message_response_1 = require("./models/device-message-response");
const error_message_1 = require("./models/error-message");
const monitor_liste_row_message_1 = require("./models/monitor-liste-row-message");
const parameter_index_liste_row_message_1 = require("./models/parameter-index-liste-row-message");
const parameter_liste_row_message_1 = require("./models/parameter-liste-row-message");
const ParameterChanged_1 = require("./models/ParameterChanged");
// tslint:disable-next-line
class MessageBroker {
    constructor(log, error, messageHelperService, stringService, adapter) {
        this.log = log;
        this.error = error;
        this.messageHelperService = messageHelperService;
        this.stringService = stringService;
        this.adapter = adapter;
        this.deviceMessageReceived = new rxjs_1.Subject();
        this.errorMessageReceived = new rxjs_1.Subject();
        this.monitorListeRowReceived = new rxjs_1.Subject();
        this.parameterListeRowReceived = new rxjs_1.Subject();
        this.parameterIndexListeRowReceived = new rxjs_1.Subject();
        this.loadListStopMessageReceived = new rxjs_1.Subject();
        this.parameterChangedReceived = new rxjs_1.Subject();
    }
    decode(data) {
        if (data[0] === 123 && data[data.length - 1] === 125) {
            const code = data.slice(1, 3).toString();
            const dataCount = data[3];
            const checkSum = data[4];
            this.log("decode: " +
                data.length +
                " / code: " +
                code +
                " / " +
                data.toString("ASCII") +
                " dataCount: " +
                dataCount +
                " - checkSum" +
                checkSum);
            if (code === this.messageHelperService.deviceMessageTagString) {
                const devMessage = data.slice(5, data.length - 1);
                return this.decodeDeviceMessage(devMessage, checkSum);
            }
            else if (code === this.messageHelperService.monitorListeReceiveTagString) {
                return this.decodeMonitorListeRow(data.slice(3, data.length - 1), dataCount, checkSum);
            }
            else if (code === this.messageHelperService.parameterListeReceiveTagString) {
                return this.decodeParameterListeRow(data.slice(3, data.length - 1), dataCount, checkSum);
            }
            else if (data.slice(1, 2)[0] === 8 && data.slice(2, 3)[0] === 0) {
                // todo: kommt bei auslesen der parameter liste und als einfach mal so als beim heizen... mit unterschiedlicher codierung!!!{
                if (this.adapter) {
                    this.adapter.getState(this.stringService.loadParameterList, (err, obj) => {
                        if (!err) {
                            if (obj) {
                                if (obj.val === true) {
                                    return this.decodeParameterListeRow(data.slice(3, data.length - 1), dataCount, checkSum);
                                }
                                else {
                                    this.error("decode spezial message loadParameterList");
                                }
                            }
                        }
                        else {
                            this.log("decode loadParameterList: " + err);
                        }
                    });
                }
            }
            else if (code === this.messageHelperService.parameterIndexReceiveTagString
            // ||
            // (data.slice(1, 2)[0] === 32 && data.slice(2, 3)[0] === 0) ||
            // (data.slice(1, 2)[0] === 0 && data.slice(2, 3)[0] === 0)
            ) {
                return this.decodeParameterIndexListeRow(data.slice(3, data.length - 1), dataCount, checkSum);
            }
            else if (code === this.messageHelperService.parameterChangedTagString) {
                return this.decodeparameterChangedRow(data.slice(3, data.length - 1), dataCount, checkSum);
            }
            else if (code === this.messageHelperService.errorTagString) {
                return this.decodeErrorMessage(data.slice(3, data.length - 1), checkSum);
            }
            else {
                this.error(data.slice(1, 2)[0] +
                    "|" +
                    data.slice(2, 3)[0] +
                    "  unknown message decode: ParameterIndex test: " +
                    data.length +
                    " / code:" +
                    code +
                    " / " +
                    data.toString("ASCII") +
                    " dataCount: " +
                    dataCount +
                    " - checkSum" +
                    checkSum);
            }
        }
        //return null;
    }
    decodeparameterChangedRow(tmp, dataCount, checkSum) {
        if (this.adapter && this.adapter.config.enableExtendedLogInfo) {
            this.log("decodeparameterChangedRow: " +
                tmp.length +
                " / " +
                " dataCount: " +
                dataCount +
                " - checkSum" +
                checkSum +
                tmp.toString("ASCII"));
        }
        const row = new ParameterChanged_1.ParameterChanged();
        row.knoten = tmp[2];
        row.index = (tmp[3] << 8) | tmp[4];
        row.value = (tmp[5] << 8) | tmp[6];
        if (this.adapter && this.adapter.config.enableExtendedLogInfo) {
            this.log("decodeparameterChangedRow: " + JSON.stringify(row));
        }
        if (row.knoten > 0 || row.index > 0) {
            this.parameterChangedReceived.next(row);
            return row;
        }
    }
    decodeBedienpultTagRow(tmp, dataCount, checkSum) {
        const node = tmp[2];
        const index = (tmp[3] << 8) | tmp[4];
        const value = (tmp[5] << 8) | tmp[6];
        this.log("decodeBedienpult: node: " + node + " index: " + index + " value: " + value);
    }
    decodeParameterIndexListeRow(tmp, dataCount, checkSum) {
        if (dataCount === 0 && checkSum === 0) {
            const message = new load_list_stop_message_1.LoadListStopMessage(this.messageHelperService, load_list_type_enum_1.LoadListType.ParameterIndex);
            this.loadListStopMessageReceived.next(message);
            return message;
        }
        else {
            const row = new parameter_index_liste_row_message_1.ParameterIndexListeRowMessage();
            row.knoten = tmp[2];
            // tslint:disable-next-line: no-bitwise
            row.index = (tmp[3] << 8) | tmp[4];
            const name = tmp
                .slice(5)
                .toString("ASCII")
                .trim();
            row.key =
                this.messageHelperService.padl(row.knoten.toString(), 3) +
                    "_" +
                    this.messageHelperService.padl(row.index.toString(), 3);
            const key = this.getKey(name);
            if (key.length > 0) {
                row.key += "_" + key;
            }
            row.name = name;
            this.parameterIndexListeRowReceived.next(row);
            return row;
        }
    }
    decodeParameterListeRow(tmp, dataCount, checkSum) {
        this.log("code: Parameter test: " +
            tmp.length +
            " / " +
            tmp.toString("ASCII") +
            " dataCount: " +
            dataCount +
            " - checkSum" +
            checkSum);
        if (dataCount === 0 && checkSum === 0) {
            const message = new load_list_stop_message_1.LoadListStopMessage(this.messageHelperService, load_list_type_enum_1.LoadListType.Parameter);
            this.loadListStopMessageReceived.next(message);
            return message;
        }
        else {
            const row = new parameter_liste_row_message_1.ParameterListeRowMessage();
            row.knoten = tmp[2];
            row.index = (tmp[3] << 8) | tmp[4];
            row.datenType = tmp[5];
            row.einheit = tmp[6];
            row.unknown9 = tmp[7];
            row.unknown10 = tmp[8];
            row.teiler = tmp[9];
            row.min_wert = (tmp[10] << 8) | tmp[11];
            if (!row.min_wert) {
                row.min_wert = 0;
            }
            row.max_wert = (tmp[12] << 8) | tmp[13];
            if (!row.max_wert) {
                row.max_wert = 0;
            }
            row.std_wert = (tmp[14] << 8) | tmp[15];
            if (!row.std_wert) {
                row.std_wert = 0;
            }
            row.akt_wert = ((tmp[16] << 8) | tmp[17]) / row.teiler;
            if (!row.akt_wert) {
                row.akt_wert = 0;
            }
            row.ebene = tmp[18];
            const name = tmp
                .slice(19)
                .toString("ASCII")
                .trim();
            if (row.knoten && row.index) {
                row.key =
                    this.messageHelperService.padl(row.knoten.toString(), 3) +
                        "_" +
                        this.messageHelperService.padl(row.index.toString(), 3);
                //if (row.knoten === 0 && row.index === 0) {
                const key = this.getKey(name);
                if (key.length > 0) {
                    row.key += "_" + key;
                }
                //}
                row.name = name;
            }
            else {
                row.name = name;
                row.key = "000_000_" + this.getKey(name);
            }
            this.parameterListeRowReceived.next(row);
            return row;
            // row.key = row.knoten.toString() + "_" + row.index.toString();
            // if (row.knoten === 0 && row.index === 0) {
            // 	let key = this.getKey(name);
            // 	if (key.length > 0) row.key += "_" + key;
            // }
            // row.name = name;
            // this.parameterListeRowReceived.next(row);
        }
    }
    decodeMonitorListeRow(tmp, dataCount, checkSum) {
        //this.adapter.log.info("code: Mb test: " + tmp.length + " / " + tmp.toString("ASCII") + " dataCount: " + dataCount + " - checkSum" + checkSum);
        if (dataCount === 0 && checkSum === 0) {
            const message = new load_list_stop_message_1.LoadListStopMessage(this.messageHelperService, load_list_type_enum_1.LoadListType.Monitor);
            this.loadListStopMessageReceived.next(message);
            return message;
        }
        else {
            const row = new monitor_liste_row_message_1.MonitorListeRowMessage();
            row.knoten = tmp[2];
            row.value = ((tmp[3] << 8) | tmp[4]) / tmp[9];
            row.ueberschrift = tmp[5];
            row.datenType = tmp[6];
            row.Unknown1 = tmp[7];
            row.Unknown2 = tmp[8];
            row.teiler = tmp[9];
            row.indexEbene = tmp[10];
            const name = tmp
                .slice(11)
                .toString("ASCII")
                .trim();
            row.key =
                this.messageHelperService.padl(row.knoten.toString(), 3) +
                    "_" +
                    this.messageHelperService.padl(row.indexEbene.toString(), 3);
            const key = this.getKey(name);
            if (key.length > 0) {
                row.key += "_" + key;
            }
            row.name = name;
            //if (row.value )
            this.monitorListeRowReceived.next(row);
            return row;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    decodeErrorMessage(tmp, checkSum) {
        //hier wird sms empfang als status übermittelt!
        const error = new error_message_1.ErrorMessage();
        error.error = tmp.toString("ASCII").trim();
        this.errorMessageReceived.next(error);
        return error;
    }
    decodeDeviceMessage(tmp, checkSum) {
        let calcCheckSum = 0;
        const raws = new Array();
        raws.push({});
        let rawsCount = 0;
        let packageCount = 0;
        for (let index = 0; index < tmp.length; index++) {
            const value = tmp[index];
            if (packageCount === 0) {
                raws[rawsCount].place = value;
            }
            else if (packageCount === 1) {
                raws[rawsCount].device0 = value;
            }
            else if (packageCount === 2) {
                raws[rawsCount].device1 = value;
            }
            else if (packageCount === 3) {
                raws[rawsCount].value0 = value;
            }
            else if (packageCount === 4) {
                raws[rawsCount].value1 = value;
            }
            else {
                packageCount = 0;
                raws.push({});
                rawsCount++;
                raws[rawsCount].place = value;
            }
            packageCount++;
            calcCheckSum += value;
        }
        calcCheckSum = calcCheckSum % 256;
        if (calcCheckSum !== checkSum) {
            this.error("eta -> Checksum Error: " + calcCheckSum + " rec: " + checkSum);
        }
        else {
            const receivedMessageResponse = new device_message_response_1.DeviceMessageResponse();
            // eslint-disable-next-line prefer-const
            for (let raw of raws) {
                const temperatureData = new device_message_1.DeviceMessage();
                temperatureData.place = raw.place;
                const device = raw.device0 * 256 + raw.device1;
                if (temperatureData.place === eta_furnace_types_enum_1.EtaFurnaceTypes.Scheitholzkessel) {
                    temperatureData.parameter = device;
                }
                else if (temperatureData.place === eta_furnace_types_enum_1.EtaFurnaceTypes.Pelletskessel_bis_30kW) {
                    temperatureData.parameter = device;
                }
                if (temperatureData.place === eta_furnace_types_enum_1.EtaFurnaceTypes.Pelletskessel_ab_35kW) {
                    temperatureData.parameter = device;
                }
                temperatureData.value = (raw.value0 << 8) | raw.value1;
                if (temperatureData.value >= 30000) {
                    //Temperatur unter 0 C ?
                    temperatureData.value = temperatureData.value - 65536;
                }
                temperatureData.value = temperatureData.value / 10;
                receivedMessageResponse.deviceMessages.push(temperatureData);
            }
            if (receivedMessageResponse.deviceMessages.length > 0) {
                this.deviceMessageReceived.next(receivedMessageResponse);
            }
            return receivedMessageResponse;
        }
    }
    dec2bin(dec) {
        return (dec >>> 0).toString(2);
    }
    getKey(key) {
        let val = key
            .trim()
            .replace(/\./g, "_")
            .replace(/ /g, "_")
            .replace(/__/g, "_")
            .replace(/__/g, "_")
            .replace(/__/g, "_");
        if (val.substr(0, 1) === "_") {
            val = val.substring(1);
        }
        if (val.substr(val.length - 1, 1) === "_") {
            val = val.substring(0, val.length - 1);
        }
        if (val.substr(val.length - 1, 1) === "_") {
            val = val.substring(0, val.length - 1);
        }
        return val;
    }
}
exports.MessageBroker = MessageBroker;
