"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// SMS
class CommandMessage {
    constructor(messageHelperService, commandMessageType) {
        this.messageHelperService = messageHelperService;
        this.commandMessageType = commandMessageType;
    }
    getMessage() {
        const buffer = new Array();
        buffer.push(this.commandMessageType);
        buffer.push(0);
        let checksum = 0;
        // eslint-disable-next-line prefer-const
        for (let x of buffer) {
            checksum += x;
        }
        const retrun = Buffer.concat([
            this.messageHelperService.messageStartTag,
            this.messageHelperService.smsControlTag,
            new Buffer([buffer.length, checksum % 256]),
            new Buffer(buffer),
            this.messageHelperService.messageStopTag,
        ]);
        return retrun;
    }
}
exports.CommandMessage = CommandMessage;
