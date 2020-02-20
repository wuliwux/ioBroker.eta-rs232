"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SMSMessage {
    constructor(messageHelperService, smsMessageType) {
        this.messageHelperService = messageHelperService;
        this.smsMessageType = smsMessageType;
    }
    getMessage() {
        return Buffer.concat([
            this.messageHelperService.messageStartTag,
            this.messageHelperService.smsControlTag,
            new Buffer([this.smsMessageType, 0]),
        ]);
    }
}
exports.SMSMessage = SMSMessage;
