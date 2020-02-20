import { MessageHelperService } from "../services/message-helper.service";

export class UnsubscribeMessage implements IGetMessage {
	constructor(private messageHelperService: MessageHelperService) {}

	public getMessage() {
		return Buffer.concat([
			this.messageHelperService.messageStartTag,
			this.messageHelperService.unsubscribeDataTag,
			new Buffer([0, 0]),
			this.messageHelperService.messageStopTag,
		]);
	}
}
