"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-inferrable-types */
const aecparameters_enum_1 = require("../enums/aecparameters.enum");
const eta_furnace_types_enum_1 = require("../enums/eta-furnace-types.enum");
class DeviceMessage {
    constructor() {
        this.place = eta_furnace_types_enum_1.EtaFurnaceTypes.None;
        this.parameter = aecparameters_enum_1.AECParameters.None;
        this.value = 0;
    }
}
exports.DeviceMessage = DeviceMessage;
