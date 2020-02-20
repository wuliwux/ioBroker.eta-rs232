// tslint:disable: typedef
import { CommandMessageType } from "../enums/command-message-type.enum";
import { MessageHelperService } from "../services/message-helper.service";

// SMS
export class CommandMessage implements IGetMessage {
	constructor(private messageHelperService: MessageHelperService, private commandMessageType: CommandMessageType) {}

	public getMessage(): Buffer {
		const buffer = new Array<number>();

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
