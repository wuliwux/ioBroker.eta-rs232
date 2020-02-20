"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//SMS Message Type
var SMSMessageType;
(function (SMSMessageType) {
    SMSMessageType[SMSMessageType["HeizungReset"] = 1] = "HeizungReset";
    SMSMessageType[SMSMessageType["HeizungAuto"] = 2] = "HeizungAuto";
    SMSMessageType[SMSMessageType["HeizungTag"] = 4] = "HeizungTag";
    SMSMessageType[SMSMessageType["HeizungNacht"] = 8] = "HeizungNacht";
    SMSMessageType[SMSMessageType["KesselEin"] = 16] = "KesselEin";
    SMSMessageType[SMSMessageType["KesselAus"] = 32] = "KesselAus";
    SMSMessageType[SMSMessageType["BoilerLaden"] = 64] = "BoilerLaden";
})(SMSMessageType = exports.SMSMessageType || (exports.SMSMessageType = {}));
