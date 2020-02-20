// tslint:disable: typedef
import { EtaFurnaceRight } from "../enums/eta-furnace-right.enum";
import { LoadListType } from "../enums/load-list-type.enum";
import { MessageHelperService } from "../services/message-helper.service";

export class LoadListStartMessage implements IGetMessage {
	constructor(
		private messageHelperService: MessageHelperService,
		private etaFurnaceRight: EtaFurnaceRight,
		private loadListType: LoadListType,
	) {}

	public getMessage(): Buffer {
		let loadListType: Buffer;
		if (this.loadListType === LoadListType.Monitor) {
			loadListType = this.messageHelperService.monitorListeTag;
		} else if (this.loadListType === LoadListType.Parameter) {
			loadListType = this.messageHelperService.parameterListeTag;
		} else if (this.loadListType === LoadListType.ParameterIndex) {
			loadListType = this.messageHelperService.parameterIndexListeTag;
		} else {
			loadListType = new Buffer([]);
		}

		let code: Buffer;
		if (this.loadListType === LoadListType.Monitor || this.loadListType === LoadListType.Parameter) {
			if (this.etaFurnaceRight === EtaFurnaceRight.Standard) {
				code = new Buffer([2, 1, 0, 1]);
			} else if (this.etaFurnaceRight === EtaFurnaceRight.Service) {
				code = new Buffer([2, 2, 0, 2]);
			} else if (this.etaFurnaceRight === EtaFurnaceRight.Profi) {
				code = new Buffer([2, 3, 0, 3]);
			} else if (this.etaFurnaceRight === EtaFurnaceRight.Expert) {
				code = new Buffer([2, 4, 0, 4]);
			} else {
				code = new Buffer([]);
			}
		} else if (this.loadListType === LoadListType.ParameterIndex) {
			code = new Buffer([1, 0, 0]);
		} else {
			code = new Buffer([]);
		}
		const x = Buffer.concat([
			this.messageHelperService.messageStartTag,
			loadListType,
			code,
			this.messageHelperService.messageStopTag,
		]);

		return x;
	}
}
