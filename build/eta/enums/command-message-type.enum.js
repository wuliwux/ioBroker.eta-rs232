"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//SMS Message Type
var CommandMessageType;
(function (CommandMessageType) {
    CommandMessageType[CommandMessageType["HeizungReset"] = 1] = "HeizungReset";
    CommandMessageType[CommandMessageType["HeizungAuto"] = 2] = "HeizungAuto";
    CommandMessageType[CommandMessageType["HeizungTag"] = 4] = "HeizungTag";
    CommandMessageType[CommandMessageType["HeizungNacht"] = 8] = "HeizungNacht";
    // KesselEin = 0x10,
    // KesselAus = 0x20,
    CommandMessageType[CommandMessageType["BoilerLaden"] = 64] = "BoilerLaden";
})(CommandMessageType = exports.CommandMessageType || (exports.CommandMessageType = {}));
