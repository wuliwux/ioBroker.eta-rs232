"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SubscribeMessage {
    constructor(messageHelperService, commonService, etaFurnaceType, interval) {
        this.messageHelperService = messageHelperService;
        this.etaFurnaceType = etaFurnaceType;
        this.interval = interval;
        this.parameters = new Array();
        this.parameters = commonService.getParametersByEtaFurnaceType(etaFurnaceType);
    }
    getMessage() {
        const buffer = new Array();
        buffer.push(this.interval);
        // eslint-disable-next-line prefer-const
        for (let parameter of this.parameters) {
            buffer.push(this.etaFurnaceType);
            // set high / low byte
            buffer.push(parameter >> 8);
            buffer.push(parameter & 0x00ff);
        }
        let checksum = 0;
        for (let x of buffer) {
            checksum += x;
        }
        const parmaCount = 1 + this.parameters.length * 3;
        const retrun = Buffer.concat([
            this.messageHelperService.messageStartTag,
            this.messageHelperService.subscribeDataTag,
            new Buffer([parmaCount, checksum % 256]),
            new Buffer(buffer),
            this.messageHelperService.messageStopTag,
        ]);
        return retrun;
    }
}
exports.SubscribeMessage = SubscribeMessage;
