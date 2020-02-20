"use strict";
/*
 * Created with @iobroker/create-adapter v1.21.1
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const eta_furnace_right_enum_1 = require("./eta/enums/eta-furnace-right.enum");
const eta_furnace_types_enum_1 = require("./eta/enums/eta-furnace-types.enum");
const eta_service_1 = require("./eta/eta.service");
const common_service_1 = require("./eta/services/common.service");
const iobroker_string_service_1 = require("./eta/services/iobroker-string.service");
class EtaRs232 extends utils.Adapter {
    constructor(options = {}) {
        super(Object.assign(Object.assign({}, options), { name: "eta-rs232" }));
        this.stringService = new iobroker_string_service_1.IoBrokerStringService();
        this.commonService = new common_service_1.CommonService();
        this.on("ready", this.onReady.bind(this));
        this.on("objectChange", this.onObjectChange.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.on("unload", this.onUnload.bind(this));
    }
    /**
     * Is called when databases are connected and adapter received configuration.
     */
    onReady() {
        return __awaiter(this, void 0, void 0, function* () {
            console.info("onReady");
            if (!this.config.etaFurnaceType) {
                this.config.etaFurnaceType = eta_furnace_types_enum_1.EtaFurnaceTypes.Scheitholzkessel;
            }
            if (!this.config.etaFurnaceRight) {
                this.config.etaFurnaceRight = eta_furnace_right_enum_1.EtaFurnaceRight.Standard;
            }
            if (!this.config.valuesInterval) {
                this.config.valuesInterval = 30;
            }
            if (!this.config.enableExtendedLogInfo) {
                this.config.enableExtendedLogInfo = true;
            }
            this.stringService.etaFurnaceType = this.commonService.getNameFromEtaFurnaceType(this.config.etaFurnaceType);
            this.log.info("config x: " + JSON.stringify(this.config));
            this.initIoBrokerObjects();
            this.etaService = new eta_service_1.EtaService(this, this.stringService, this.commonService);
            this.etaService.start();
            // in this template all states changes inside the adapters namespace are subscribed
            this.subscribeStates("*");
        });
    }
    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     */
    onUnload(callback) {
        try {
            this.log.info("cleaned everything up...");
            if (this.etaService) {
                this.etaService.unload();
            }
            callback();
        }
        catch (e) {
            callback();
        }
    }
    /**
     * Is called if a subscribed object changes
     */
    onObjectChange(id, obj) {
        this.log.info("objectChange " + id + " " + JSON.stringify(obj));
    }
    /**
     * Is called if a subscribed state changes
     */
    onStateChange(id, state) {
        if (state) {
            // The state was changed
            if (this.etaService) {
                this.etaService.handleStateChange(id, state);
            }
        }
        else {
            // The state was deleted
            this.log.info(`state ${id} deleted`);
        }
    }
    initIoBrokerObjects() {
        this.setObjectNotExists(this.stringService.etaFurnaceType, {
            type: "device",
            common: {
                name: this.stringService.etaFurnaceType,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.parameter, {
            type: "channel",
            common: {
                name: this.stringService.parameter,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.monitor, {
            type: "channel",
            common: {
                name: this.stringService.monitor,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.parameterIndex, {
            type: "channel",
            common: {
                name: this.stringService.parameterIndex,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.values, {
            type: "channel",
            common: {
                name: this.stringService.values,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.lastReceived, {
            type: "state",
            common: {
                name: this.stringService.lastReceived,
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.lastSend, {
            type: "state",
            common: {
                name: this.stringService.lastSend,
                type: "string",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.connected, {
            type: "state",
            common: {
                name: this.stringService.connected,
                type: "boolean",
                role: "indicator",
                read: true,
                write: false,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.dataqueryrun, {
            type: "state",
            common: {
                name: this.stringService.dataqueryrun,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.dataqueryInterval, {
            type: "state",
            common: {
                name: this.stringService.dataqueryInterval,
                type: "number",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.loadParameterList, {
            type: "state",
            common: {
                name: this.stringService.loadParameterList,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.loadMonitorList, {
            type: "state",
            common: {
                name: this.stringService.loadMonitorList,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.loadParameterIndexList, {
            type: "state",
            common: {
                name: this.stringService.loadParameterIndexList,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        // commands
        this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.commands, {
            type: "channel",
            common: {
                name: this.stringService.commands,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandBoilerLaden, {
            type: "state",
            common: {
                name: this.stringService.commandBoilerLaden,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandHeizungAuto, {
            type: "state",
            common: {
                name: this.stringService.commandHeizungAuto,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandHeizungNacht, {
            type: "state",
            common: {
                name: this.stringService.commandHeizungNacht,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandHeizungReset, {
            type: "state",
            common: {
                name: this.stringService.commandHeizungReset,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
        this.setObjectNotExists(this.stringService.etaFurnaceType +
            "." +
            this.stringService.commands +
            "." +
            this.stringService.commandHeizungTag, {
            type: "state",
            common: {
                name: this.stringService.commandHeizungTag,
                type: "boolean",
                role: "indicator",
                read: true,
                write: true,
            },
            native: {},
        });
    }
}
if (module.parent) {
    // Export the constructor in compact mode
    module.exports = (options) => new EtaRs232(options);
}
else {
    // otherwise start the instance directly
    (() => new EtaRs232())();
}
