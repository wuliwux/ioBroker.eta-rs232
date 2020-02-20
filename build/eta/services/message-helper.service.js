"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: comment-format
class MessageHelperService {
    constructor() {
        this.messageStartTag = new Buffer([123]); // {
        this.messageStopTag = new Buffer([125]); // }
        this.subscribeDataTag = new Buffer([77, 67]); // MC
        this.unsubscribeDataTag = new Buffer([77, 69]); // ME
        this.deviceMessageTag = new Buffer([77, 68]); // MD
        this.deviceMessageTagString = this.deviceMessageTag.toString("ASCII");
        this.monitorListeReceiveTag = new Buffer([77, 98]); // Mb
        this.monitorListeReceiveTagString = this.monitorListeReceiveTag.toString("ASCII");
        this.parameterListeReceiveTag = new Buffer([77, 103]); // Mg
        this.parameterListeReceiveTagString = this.parameterListeReceiveTag.toString("ASCII");
        this.parameterListeReceiveTag2 = new Buffer([8, 0]); // unknown
        this.parameterListeReceiveTagString2 = this.parameterListeReceiveTag.toString("ASCII");
        this.parameterIndexReceiveTag = new Buffer([77, 105]); // Mi
        this.parameterIndexReceiveTagString = this.parameterIndexReceiveTag.toString("ASCII");
        this.heizungsParameterSetzenTag = new Buffer([77, 74]); // MJ
        this.errorTag = new Buffer([73, 77]); // IM
        this.errorTagString = this.errorTag.toString("ASCII");
        this.smsControlTag = new Buffer([73, 72]); // IH
        this.parameterChangedTag = new Buffer([77, 75]); // MK
        this.parameterChangedTagString = this.parameterChangedTag.toString("ASCII");
        this.monitorListeTag = new Buffer([77, 65]); // MA
        this.parameterListeTag = new Buffer([77, 70]); // MF
        this.parameterIndexListeTag = new Buffer([77, 72]); // MH
        this.loadListStopTag = new Buffer([77, 79]); // MO
    }
    debug(message) {
        // tslint:disable-next-line: typedef
        let log = "";
        // tslint:disable-next-line: typedef
        for (let index = 0; index < message.length; index++) {
            // tslint:disable-next-line: typedef
            const element = message[index];
            log += element.toString() + ", ";
        }
        //console.log(tmp);
        return log;
    }
    padl(input, length) {
        return (Array(length + 1).join("0") + input).slice(-length);
    }
}
exports.MessageHelperService = MessageHelperService;
