// tslint:disable: typedef
// tslint:disable: no-bitwise
import { AECParameters } from "../enums/aecparameters.enum";
import { AELKParameters } from "../enums/aelkparameters.enum";
import { AELParameters } from "../enums/aelparameters.enum";
import { EtaFurnaceTypes } from "../enums/eta-furnace-types.enum";
import { CommonService } from "../services/common.service";
import { MessageHelperService } from "../services/message-helper.service";

export class SubscribeMessage implements IGetMessage {
	private parameters = new Array<AECParameters | AELParameters | AELKParameters>();

	constructor(
		private messageHelperService: MessageHelperService,
		commonService: CommonService,
		private etaFurnaceType: EtaFurnaceTypes,
		private interval: number,
	) {
		this.parameters = commonService.getParametersByEtaFurnaceType(etaFurnaceType);
	}

	public getMessage(): Buffer {
		const buffer = new Array<number>();

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
