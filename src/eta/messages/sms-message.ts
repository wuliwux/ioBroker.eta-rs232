import { SMSMessageType } from "../enums/smsmessage-type.enum";
import { MessageHelperService } from "../services/message-helper.service";

export class SMSMessage implements IGetMessage {
	constructor(private messageHelperService: MessageHelperService, private smsMessageType: SMSMessageType) {}

	public getMessage(): Buffer {
		return Buffer.concat([
			this.messageHelperService.messageStartTag,
			this.messageHelperService.smsControlTag,
			new Buffer([this.smsMessageType, 0]),
		]);
	}
}
