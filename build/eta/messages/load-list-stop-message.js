"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LoadListStopMessage {
    constructor(messageHelperService, loadListType) {
        this.messageHelperService = messageHelperService;
        this.loadListType = loadListType;
    }
    getMessage() {
        return Buffer.concat([
            this.messageHelperService.messageStartTag,
            this.messageHelperService.loadListStopTag,
            new Buffer([1, 1]),
            this.messageHelperService.messageStopTag,
        ]);
    }
}
exports.LoadListStopMessage = LoadListStopMessage;
