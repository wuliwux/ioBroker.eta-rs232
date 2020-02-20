import { LoadListType } from "../enums/load-list-type.enum";
import { MessageHelperService } from "../services/message-helper.service";

export class LoadListStopMessage implements IGetMessage {
	constructor(private messageHelperService: MessageHelperService, public loadListType: LoadListType) {}

	public getMessage(): Buffer {
		return Buffer.concat([
			this.messageHelperService.messageStartTag,
			this.messageHelperService.loadListStopTag,
			new Buffer([1, 1]),
			this.messageHelperService.messageStopTag,
		]);
	}
}
