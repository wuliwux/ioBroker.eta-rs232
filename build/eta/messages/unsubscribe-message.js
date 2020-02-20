"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnsubscribeMessage {
    constructor(messageHelperService) {
        this.messageHelperService = messageHelperService;
    }
    getMessage() {
        return Buffer.concat([
            this.messageHelperService.messageStartTag,
            this.messageHelperService.unsubscribeDataTag,
            new Buffer([0, 0]),
            this.messageHelperService.messageStopTag,
        ]);
    }
}
exports.UnsubscribeMessage = UnsubscribeMessage;
