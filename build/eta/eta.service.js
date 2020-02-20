"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_message_type_enum_1 = require("./enums/command-message-type.enum");
const eta_furnace_types_enum_1 = require("./enums/eta-furnace-types.enum");
const load_list_type_enum_1 = require("./enums/load-list-type.enum");
const message_broker_1 = require("./message-broker");
const command_message_1 = require("./messages/command-message");
const load_list_next_message_1 = require("./messages/load-list-next-message");
const load_list_start_message_1 = require("./messages/load-list-start-message");
const set_control_parameter_message_1 = require("./messages/set-control-parameter-message");
const subscribe_message_1 = require("./messages/subscribe-message");
const unsubscribe_message_1 = require("./messages/unsubscribe-message");
const default_common_objects_repository_1 = require("./services/default-common-objects.repository");
const message_helper_service_1 = require("./services/message-helper.service");
// https://serialport.io/docs/api-stream
// https://www.instructables.com/id/Read-and-write-from-serial-port-with-Raspberry-Pi/
class EtaService {
    constructor(adapter, stringService, commonService) {
        this.adapter = adapter;
        this.stringService = stringService;
        this.commonService = commonService;
        this.messageHelperService = new message_helper_service_1.MessageHelperService();
        this.buffer = new Buffer("", "ASCII");
        this.messageBroker = new message_broker_1.MessageBroker(this.log, this.error, this.messageHelperService, stringService, adapter);
        this.defaultCommonObjectsRepository = new default_common_objects_repository_1.DefaultCommonObjectsRepository(commonService);
        this.etaFurnaceRight = adapter.config.etaFurnaceRight;
    }
    log(log) {
        if (this.adapter.config.enableExtendedLogInfo) {
            this.adapter.log.info(log);
        }
    }
    error(log) {
        this.adapter.log.error(log);
    }
    // todo: Subscribe check ob daten kommen... sonst nochmals Subscribe versuchen!!! abfragezeit * 3  last received!
    Subscribe() {
        // todo check this!
        let etaFurnaceType = eta_furnace_types_enum_1.EtaFurnaceTypes.Scheitholzkessel;
        if (this.adapter.config.etaFurnaceType) {
            etaFurnaceType = this.adapter.config.etaFurnaceType;
        }
        let intervall = 30;
        if (this.adapter.config.valuesInterval) {
            intervall = parseInt(this.adapter.config.valuesInterval);
        }
        this.adapter.log.info("Subscribe: etaFurnaceType[" + etaFurnaceType + "] intervall:[" + intervall + "]");
        this.send(new subscribe_message_1.SubscribeMessage(this.messageHelperService, this.commonService, etaFurnaceType, intervall), 
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (message) => {
            this.adapter.setState(this.stringService.dataqueryrun, true, true);
        });
    }
    Unsubscribe() {
        this.adapter.log.info("Unsubscribe");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.send(new unsubscribe_message_1.UnsubscribeMessage(this.messageHelperService), (message) => {
            this.adapter.setState(this.stringService.dataqueryrun, false, true);
        });
    }
    start() {
        this.adapter.log.info("start 5");
        this.adapter.setState(this.stringService.loadMonitorList, false, true);
        this.adapter.setState(this.stringService.loadParameterList, false, true);
        this.adapter.setState(this.stringService.loadParameterIndexList, false, true);
        this.adapter.setState(this.stringService.connected, false, true);
        this.adapter.setState(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandBoilerLaden, false, true);
        this.adapter.setState(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandHeizungAuto, false, true);
        this.adapter.setState(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandHeizungNacht, false, true);
        this.adapter.setState(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandHeizungReset, false, true);
        this.adapter.setState(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandHeizungTag, false, true);
        // tslint:disable-next-line:no-shadowed-variable
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const SerialPort = require("serialport");
        const options = {
            autoOpen: false,
            lock: false,
            baudRate: 19200,
            dataBits: 8,
            stopBits: 1,
            parity: "none",
            rtscts: false,
            xon: false,
            xoff: false,
            xany: false,
            bufferSize: 2,
            flowControl: false,
        };
        this.serial = new SerialPort(this.adapter.config.portId, options);
        if (this.serial) {
            this.serial.on("open", err => {
                if (err) {
                    this.adapter.log.error("rs232 - open: " + err);
                }
                else {
                    this.adapter.log.info("rs232 - open");
                }
            });
            this.serial.on("close", err => {
                if (err) {
                    this.adapter.log.error("rs232 - close: " + err);
                }
                else {
                    this.adapter.log.info("rs232 - close");
                }
            });
            this.serial.on("error", err => {
                if (err) {
                    this.adapter.log.error("rs232 - error: " + err);
                }
                else {
                    this.adapter.log.info("rs232 - error");
                }
            });
            this.serial.on("data", (data) => {
                // build and check tokens
                this.buffer = Buffer.concat([this.buffer, data]);
                const tokens = new Array();
                let start = -1;
                let end = -1;
                do {
                    start = this.buffer.indexOf(123);
                    end = this.buffer.indexOf(125, start);
                    if (start >= 0 && end >= 0) {
                        let token = this.buffer.slice(start, end + 1);
                        // check ob nicht ungeschlossene nachrichten vorhanden sind und ggf. diese entfernen
                        let tmpStart = -1;
                        do {
                            tmpStart = token.indexOf(123, 1);
                            if (tmpStart >= 0) {
                                token = token.slice(tmpStart, end + 1);
                                start = tmpStart;
                            }
                        } while (tmpStart >= 0);
                        if (token.length > 0) {
                            tokens.push(token);
                        }
                        this.buffer = this.buffer.slice(end + 1);
                    }
                    else if (start < 0 && end >= 0) {
                        this.buffer = new Buffer("");
                    }
                } while (end >= 0);
                if (tokens.length > 0) {
                    for (const token of tokens) {
                        if (this.adapter.config.enableExtendedLogInfo) {
                            this.adapter.log.info("data Token: " + this.messageHelperService.debug(token));
                        }
                        this.messageBroker.decode(token);
                    }
                }
                this.adapter.setState(this.stringService.lastReceived, new Date().toLocaleString("de-AT"), true);
            });
            this.serial.open(() => {
                this.adapter.setState(this.stringService.connected, true, true);
                this.Subscribe();
            });
        }
        this.parameterChangedReceivedSubscription = this.messageBroker.parameterChangedReceived.subscribe((o) => {
            const stateKey = this.adapter.namespace +
                "." +
                this.stringService.etaFurnaceType +
                "." +
                this.stringService.parameter +
                "." +
                this.messageHelperService.padl(o.knoten.toString(), 3) +
                "_" +
                this.messageHelperService.padl(o.index.toString(), 3);
            if (this.adapter.config.enableExtendedLogInfo) {
                this.adapter.log.info("parameterChangedReceivedSubscription [" + stateKey + "]: " + JSON.stringify(o));
            }
            // todo
            this.adapter.getObject(stateKey, (err, obj) => {
                if (!err) {
                    if (obj) {
                        let value = o.value;
                        if (obj.native.teiler) {
                            value = value / obj.native.teiler;
                        }
                        if (this.adapter.config.enableExtendedLogInfo) {
                            this.adapter.log.info("parameterChangedReceivedSubscription setState [" + stateKey + "]: value: " + value);
                        }
                        this.adapter.setState(stateKey, value, true);
                    }
                }
                else {
                    this.adapter.log.error("parameterChangedReceivedSubscription: " + err);
                }
            });
        });
        // eta deviceMessage received
        this.deviceMessageReceivedSubscription = this.messageBroker.deviceMessageReceived.subscribe((o) => {
            for (const message of o.deviceMessages) {
                if (message && message.place > 0 && message.parameter > 0) {
                    const parameterName = this.commonService.getParameterName(message.place, message.parameter);
                    const name = this.stringService.etaFurnaceType + "." + this.stringService.values + "." + parameterName;
                    let value = message.value;
                    if (parameterName === "Pufferladezst") {
                        value = value * 10;
                    }
                    const ioObject = this.defaultCommonObjectsRepository.GetIoObjectByDeviceMessage(message);
                    this.internalSetState(name, parameterName, value, ioObject);
                }
            }
        });
        // eta error received
        this.errorMessageReceivedSubscription = this.messageBroker.errorMessageReceived.subscribe((o) => {
            this.adapter.log.error(JSON.stringify(o));
        });
        // list entries received
        this.monitorListeRowReceivedSubscription = this.messageBroker.monitorListeRowReceived.subscribe((message) => {
            //this.adapter.log.info(JSON.stringify(message));
            const name = this.stringService.etaFurnaceType + "." + this.stringService.monitor + "." + message.key;
            const ioObject = this.defaultCommonObjectsRepository.GetIoObjectByMonitorListeRowMessage(message);
            this.internalSetState(name, message.name, message.value, ioObject);
            this.send(new load_list_next_message_1.LoadListNextMessage(this.messageHelperService, this.etaFurnaceRight, load_list_type_enum_1.LoadListType.Monitor), 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (loadListNextMessage) => { });
        });
        this.parameterListeRowReceivedSubscription = this.messageBroker.parameterListeRowReceived.subscribe((message) => {
            this.adapter.log.info(JSON.stringify(message));
            const name = this.stringService.etaFurnaceType + "." + this.stringService.parameter + "." + message.key;
            const ioObject = this.defaultCommonObjectsRepository.GetIoObjectByParameterListeRowMessage(message);
            //let value = (message.akt_wert_hbyte * 256 + message.akt_wert_hbyte) / 10;
            this.internalSetState(name, message.name, message.akt_wert, ioObject);
            this.send(new load_list_next_message_1.LoadListNextMessage(this.messageHelperService, this.etaFurnaceRight, load_list_type_enum_1.LoadListType.Parameter), 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // tslint:disable-next-line: no-empty
            (loadListNextMessage) => { });
        });
        this.parameterIndexListeRowReceivedSubscription = this.messageBroker.parameterIndexListeRowReceived.subscribe((message) => {
            this.adapter.log.info(JSON.stringify(message));
            const name = this.stringService.etaFurnaceType + "." + this.stringService.parameterIndex + "." + message.key;
            const ioObject = this.defaultCommonObjectsRepository.GetIoObjectByParameterIndexListeRowMessage(message);
            this.internalSetState(name, message.name, message.index, ioObject);
            this.send(new load_list_next_message_1.LoadListNextMessage(this.messageHelperService, this.etaFurnaceRight, load_list_type_enum_1.LoadListType.ParameterIndex), 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            // tslint:disable-next-line: no-empty
            (loadListNextMessage) => { });
        });
        // load stop message received
        this.loadListStopMessageReceivedSubscription = this.messageBroker.loadListStopMessageReceived.subscribe((o) => {
            this.adapter.log.info(JSON.stringify(o));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.send(o, (message) => {
                if (o.loadListType === load_list_type_enum_1.LoadListType.Monitor) {
                    this.adapter.setState(this.stringService.loadMonitorList, false, true);
                }
                else if (o.loadListType === load_list_type_enum_1.LoadListType.Parameter) {
                    this.adapter.setState(this.stringService.loadParameterList, false, true);
                }
                else if (o.loadListType === load_list_type_enum_1.LoadListType.ParameterIndex) {
                    this.adapter.setState(this.stringService.loadParameterIndexList, false, true);
                }
            });
        });
    }
    handleStateChange(id, state) {
        if (this.adapter.config.enableExtendedLogInfo) {
            this.adapter.log.info("handleStateChange [" + id + "]: " + JSON.stringify(state));
        }
        // you can use the ack flag to detect if it is status (true) or command (false)
        if (state && !state.ack) {
            if (id === this.adapter.namespace + "." + this.stringService.loadParameterIndexList) {
                {
                    if (this.adapter.config.enableExtendedLogInfo)
                        this.adapter.log.info("loadParameterIndexList...");
                    {
                        this.loadParameterIndexList();
                    }
                }
            }
            else if (id === this.adapter.namespace + "." + this.stringService.loadParameterList) {
                if (this.adapter.config.enableExtendedLogInfo) {
                    this.adapter.log.info("loadParameterList... this.etaFurnaceRight: " + this.etaFurnaceRight);
                }
                this.loadParameterList();
            }
            else if (id === this.adapter.namespace + "." + this.stringService.loadMonitorList) {
                if (this.adapter.config.enableExtendedLogInfo) {
                    this.adapter.log.info("loadMonitorList...");
                }
                this.loadMonitorList();
            }
            else if (id === this.adapter.namespace + "." + this.stringService.dataqueryrun) {
                if (state.val) {
                    if (this.adapter.config.enableExtendedLogInfo) {
                        this.adapter.log.info("Subscribe...");
                    }
                    this.Subscribe();
                }
                else {
                    this.Unsubscribe();
                    if (this.adapter.config.enableExtendedLogInfo) {
                        this.adapter.log.info("Subscribe...");
                    }
                }
            }
            else if (id.startsWith(this.adapter.namespace +
                "." +
                this.stringService.etaFurnaceType +
                "." +
                this.stringService.parameter +
                ".")) {
                if (this.adapter.config.enableExtendedLogInfo) {
                    this.adapter.log.info("setParameter...");
                }
                this.setParameter(id, state);
            }
            else if (id.startsWith(this.adapter.namespace +
                "." +
                this.stringService.etaFurnaceType +
                "." +
                this.stringService.commands +
                ".")) {
                if (this.adapter.config.enableExtendedLogInfo) {
                    this.adapter.log.info("commandReceived...");
                }
                this.commandReceived(id, state);
            }
        }
    }
    setParameter(id, o) {
        this.adapter.getObject(id, (err, q) => {
            const obj = q; // <ioBroker.StateObject>q;
            if (!err) {
                if (obj) {
                    let value = o.val;
                    if ((obj.native.teiler && obj.native.teiler === 1) || obj.native.teiler === 10) {
                        if (obj.common) {
                            if (obj.common.min && obj.common.max) {
                                if (value >= obj.common.min && value <= obj.common.max) {
                                    value = value / obj.native.teiler;
                                    const message = new set_control_parameter_message_1.SetControlParameterMessage(this.messageHelperService, this.adapter.config.etaFurnaceType, obj.native.index, o.val);
                                    this.send(message, (x) => {
                                        this.adapter.log.info("send: " + x.toString());
                                    });
                                    if (this.adapter.config.enableExtendedLogInfo) {
                                        this.adapter.log.info("obj: [" + err + "] [" + id + "] " + JSON.stringify(obj));
                                    }
                                }
                                else {
                                    this.adapter.log.error("setParameter: value not in scope: [" +
                                        value +
                                        "] min: [" +
                                        obj.common.min +
                                        "] max: [" +
                                        obj.common.max +
                                        "]  ");
                                }
                            }
                            else {
                                this.adapter.log.error("setParameter:  obj.common.min || obj.common.max undefined ");
                            }
                        }
                        else {
                            this.adapter.log.error("setParameter:  obj.common == undefined ");
                        }
                    }
                    else {
                        this.adapter.log.error("setParameter: teiler <> 1 && teiler <> 10: " + obj.native.teiler);
                    }
                }
            }
            else {
                this.adapter.log.error("setParameter: " + err);
            }
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    commandReceived(id, state) {
        this.adapter.log.info("commandReceived: " + id);
        // parameter ioBroker Changed -> send to heating
        if (id.endsWith(this.stringService.commandBoilerLaden)) {
            this.send(new command_message_1.CommandMessage(this.messageHelperService, command_message_type_enum_1.CommandMessageType.BoilerLaden), (o) => {
                this.adapter.log.info(o.toString());
                this.adapter.setState(id, false, true);
            });
        }
        else if (id.endsWith(this.stringService.commandHeizungAuto)) {
            this.send(new command_message_1.CommandMessage(this.messageHelperService, command_message_type_enum_1.CommandMessageType.HeizungAuto), (o) => {
                this.adapter.log.info(o.toString());
                this.adapter.setState(id, false, true);
            });
        }
        else if (id.endsWith(this.stringService.commandHeizungNacht)) {
            this.send(new command_message_1.CommandMessage(this.messageHelperService, command_message_type_enum_1.CommandMessageType.HeizungNacht), (o) => {
                this.adapter.log.info(o.toString());
                this.adapter.setState(id, false, true);
            });
        }
        else if (id.endsWith(this.stringService.commandHeizungReset)) {
            this.send(new command_message_1.CommandMessage(this.messageHelperService, command_message_type_enum_1.CommandMessageType.HeizungReset), (o) => {
                this.adapter.log.info(o.toString());
                this.adapter.setState(id, false, true);
            });
        }
        else if (id.endsWith(this.stringService.commandHeizungTag)) {
            this.send(new command_message_1.CommandMessage(this.messageHelperService, command_message_type_enum_1.CommandMessageType.HeizungTag), (o) => {
                this.adapter.log.info(o.toString());
                this.adapter.setState(id, false, true);
            });
        }
    }
    parameterChanged(id, state) {
        this.adapter.log.info("parameterChanged: " + id + " -> " + JSON.stringify(state));
    }
    loadMonitorList() {
        // unsubscribe and start get Monitor List, re-subscribe when ready
        const message = new load_list_start_message_1.LoadListStartMessage(this.messageHelperService, this.etaFurnaceRight, load_list_type_enum_1.LoadListType.Monitor);
        this.messageHelperService.debug(message.getMessage());
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.send(message, (loadListStartMessage) => {
            this.adapter.setState(this.stringService.loadMonitorList, true, true);
        });
    }
    loadParameterList() {
        // unsubscribe and start get Parameter List, re-subscribe when ready
        this.send(new load_list_start_message_1.LoadListStartMessage(this.messageHelperService, this.etaFurnaceRight, load_list_type_enum_1.LoadListType.Parameter), (loadListStartMessage) => {
            this.adapter.setState(this.stringService.loadParameterList, true, true);
        });
    }
    loadParameterIndexList() {
        // unsubscribe and start get ParameterIndex, re-subscribe when ready
        this.send(new load_list_start_message_1.LoadListStartMessage(this.messageHelperService, this.etaFurnaceRight, load_list_type_enum_1.LoadListType.ParameterIndex), (loadListStartMessage) => {
            this.adapter.setState(this.stringService.loadParameterIndexList, true, true);
        });
    }
    unload() {
        this.send(new unsubscribe_message_1.UnsubscribeMessage(this.messageHelperService), (unsubscribeMessage) => {
            if (this.serial) {
                this.serial.close();
            }
            this.adapter.log.info("unload -> serial closed");
        });
        if (this.deviceMessageReceivedSubscription) {
            this.deviceMessageReceivedSubscription.unsubscribe();
        }
        if (this.errorMessageReceivedSubscription) {
            this.errorMessageReceivedSubscription.unsubscribe();
        }
        if (this.monitorListeRowReceivedSubscription) {
            this.monitorListeRowReceivedSubscription.unsubscribe();
        }
        if (this.parameterListeRowReceivedSubscription) {
            this.parameterListeRowReceivedSubscription.unsubscribe();
        }
        if (this.parameterIndexListeRowReceivedSubscription) {
            this.parameterIndexListeRowReceivedSubscription.unsubscribe();
        }
        if (this.loadListStopMessageReceivedSubscription) {
            this.loadListStopMessageReceivedSubscription.unsubscribe();
        }
        this.adapter.log.info("unload");
    }
    send(data, callback) {
        const message = data.getMessage();
        if (this.adapter.config.enableExtendedLogInfo) {
            this.adapter.log.info("send Token: " + this.messageHelperService.debug(message));
        }
        //this.adapter.log.info("serial.write [BIN]: " + this.messageHelperService.debug(message));
        if (this.serial) {
            this.serial.write(message, () => {
                this.adapter.setState(this.stringService.lastSend, new Date().toLocaleString("de-AT"), true);
                if (callback) {
                    callback(message);
                }
            });
        }
    }
    internalSetState(key, name, value, ioObject) {
        this.adapter.log.info("internalSetState: " + key + " | " + name + " | " + value);
        this.adapter.setObjectNotExists(key, ioObject, (err, obj) => {
            this.adapter.setState(key, value, true);
        });
    }
}
exports.EtaService = EtaService;
