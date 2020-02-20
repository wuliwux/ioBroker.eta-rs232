/* eslint-disable @typescript-eslint/camelcase */
// tslint:disable:typedef
// tslint:disable: no-bitwise

import { Subject } from "rxjs";
import { AECParameters } from "./enums/aecparameters.enum";
import { AELKParameters } from "./enums/aelkparameters.enum";
import { AELParameters } from "./enums/aelparameters.enum";
import { EtaFurnaceTypes } from "./enums/eta-furnace-types.enum";
import { LoadListType } from "./enums/load-list-type.enum";
import { LoadListStopMessage } from "./messages/load-list-stop-message";
import { DebugMessage } from "./models/debug-message";
import { DeviceMessage } from "./models/device-message";
import { DeviceMessageResponse } from "./models/device-message-response";
import { ErrorMessage } from "./models/error-message";
import { MonitorListeRowMessage } from "./models/monitor-liste-row-message";
import { ParameterIndexListeRowMessage } from "./models/parameter-index-liste-row-message";
import { ParameterListeRowMessage } from "./models/parameter-liste-row-message";
import { ParameterChanged } from "./models/ParameterChanged";
import { IoBrokerStringService } from "./services/iobroker-string.service";
import { MessageHelperService } from "./services/message-helper.service";

// tslint:disable-next-line
export class MessageBroker {
	public deviceMessageReceived: Subject<DeviceMessageResponse> = new Subject<DeviceMessageResponse>();

	public errorMessageReceived: Subject<ErrorMessage> = new Subject<ErrorMessage>();

	public monitorListeRowReceived: Subject<MonitorListeRowMessage> = new Subject<MonitorListeRowMessage>();

	public parameterListeRowReceived: Subject<ParameterListeRowMessage> = new Subject<ParameterListeRowMessage>();

	public parameterIndexListeRowReceived: Subject<ParameterIndexListeRowMessage> = new Subject<
		ParameterIndexListeRowMessage
	>();

	public loadListStopMessageReceived: Subject<LoadListStopMessage> = new Subject<LoadListStopMessage>();

	public parameterChangedReceived: Subject<ParameterChanged> = new Subject<ParameterChanged>();

	constructor(
		private log: (text: string) => any,
		private error: (text: string) => any,
		private messageHelperService: MessageHelperService,
		private stringService: IoBrokerStringService,
		private adapter: ioBroker.Adapter,
	) {}

	public decode(
		data: Buffer,
	):
		| DebugMessage
		| ErrorMessage
		| DeviceMessageResponse
		| MonitorListeRowMessage
		| LoadListStopMessage
		| ParameterListeRowMessage
		| ParameterIndexListeRowMessage
		| ParameterChanged
		| undefined {
		if (data[0] === 123 && data[data.length - 1] === 125) {
			const code = data.slice(1, 3).toString();
			const dataCount = data[3];
			const checkSum = data[4];

			this.log(
				"decode: " +
					data.length +
					" / code: " +
					code +
					" / " +
					data.toString("ASCII") +
					" dataCount: " +
					dataCount +
					" - checkSum" +
					checkSum,
			);

			if (code === this.messageHelperService.deviceMessageTagString) {
				const devMessage = data.slice(5, data.length - 1);
				return this.decodeDeviceMessage(devMessage, checkSum);
			} else if (code === this.messageHelperService.monitorListeReceiveTagString) {
				return this.decodeMonitorListeRow(data.slice(3, data.length - 1), dataCount, checkSum);
			} else if (code === this.messageHelperService.parameterListeReceiveTagString) {
				return this.decodeParameterListeRow(data.slice(3, data.length - 1), dataCount, checkSum);
			} else if (data.slice(1, 2)[0] === 8 && data.slice(2, 3)[0] === 0) {
				// todo: kommt bei auslesen der parameter liste und als einfach mal so als beim heizen... mit unterschiedlicher codierung!!!{
				if (this.adapter) {
					this.adapter.getState(this.stringService.loadParameterList, (err, obj) => {
						if (!err) {
							if (obj) {
								if (obj.val === true) {
									return this.decodeParameterListeRow(
										data.slice(3, data.length - 1),
										dataCount,
										checkSum,
									);
								} else {
									this.error("decode spezial message loadParameterList");
								}
							}
						} else {
							this.log("decode loadParameterList: " + err);
						}
					});
				}
			} else if (
				code === this.messageHelperService.parameterIndexReceiveTagString
				// ||
				// (data.slice(1, 2)[0] === 32 && data.slice(2, 3)[0] === 0) ||
				// (data.slice(1, 2)[0] === 0 && data.slice(2, 3)[0] === 0)
			) {
				return this.decodeParameterIndexListeRow(data.slice(3, data.length - 1), dataCount, checkSum);
			} else if (code === this.messageHelperService.parameterChangedTagString) {
				return this.decodeparameterChangedRow(data.slice(3, data.length - 1), dataCount, checkSum);
			} else if (code === this.messageHelperService.errorTagString) {
				return this.decodeErrorMessage(data.slice(3, data.length - 1), checkSum);
			} else {
				this.error(
					data.slice(1, 2)[0] +
						"|" +
						data.slice(2, 3)[0] +
						"  unknown message decode: ParameterIndex test: " +
						data.length +
						" / code:" +
						code +
						" / " +
						data.toString("ASCII") +
						" dataCount: " +
						dataCount +
						" - checkSum" +
						checkSum,
				);
			}
		}
		//return null;
	}

	private decodeparameterChangedRow(tmp: Buffer, dataCount: number, checkSum: number): ParameterChanged | undefined {
		if (this.adapter && this.adapter.config.enableExtendedLogInfo) {
			this.log(
				"decodeparameterChangedRow: " +
					tmp.length +
					" / " +
					" dataCount: " +
					dataCount +
					" - checkSum" +
					checkSum +
					tmp.toString("ASCII"),
			);
		}
		const row = new ParameterChanged();
		row.knoten = tmp[2];
		row.index = (tmp[3] << 8) | tmp[4];
		row.value = (tmp[5] << 8) | tmp[6];

		if (this.adapter && this.adapter.config.enableExtendedLogInfo) {
			this.log("decodeparameterChangedRow: " + JSON.stringify(row));
		}
		if (row.knoten > 0 || row.index > 0) {
			this.parameterChangedReceived.next(row);
			return row;
		}
	}

	private decodeBedienpultTagRow(tmp: Buffer, dataCount: number, checkSum: number) {
		const node = tmp[2];
		const index = (tmp[3] << 8) | tmp[4];
		const value = (tmp[5] << 8) | tmp[6];

		this.log("decodeBedienpult: node: " + node + " index: " + index + " value: " + value);
	}

	private decodeParameterIndexListeRow(
		tmp: Buffer,
		dataCount: number,
		checkSum: number,
	): ParameterIndexListeRowMessage | LoadListStopMessage {
		if (dataCount === 0 && checkSum === 0) {
			const message = new LoadListStopMessage(this.messageHelperService, LoadListType.ParameterIndex);
			this.loadListStopMessageReceived.next(message);
			return message;
		} else {
			const row = new ParameterIndexListeRowMessage();
			row.knoten = tmp[2];

			// tslint:disable-next-line: no-bitwise
			row.index = (tmp[3] << 8) | tmp[4];
			const name = tmp
				.slice(5)
				.toString("ASCII")
				.trim();

			row.key =
				this.messageHelperService.padl(row.knoten.toString(), 3) +
				"_" +
				this.messageHelperService.padl(row.index.toString(), 3);
			const key = this.getKey(name);
			if (key.length > 0) {
				row.key += "_" + key;
			}
			row.name = name;

			this.parameterIndexListeRowReceived.next(row);
			return row;
		}
	}

	private decodeParameterListeRow(
		tmp: Buffer,
		dataCount: number,
		checkSum: number,
	): ParameterListeRowMessage | LoadListStopMessage {
		this.log(
			"code: Parameter test: " +
				tmp.length +
				" / " +
				tmp.toString("ASCII") +
				" dataCount: " +
				dataCount +
				" - checkSum" +
				checkSum,
		);
		if (dataCount === 0 && checkSum === 0) {
			const message = new LoadListStopMessage(this.messageHelperService, LoadListType.Parameter);
			this.loadListStopMessageReceived.next(message);
			return message;
		} else {
			const row = new ParameterListeRowMessage();
			row.knoten = tmp[2];

			row.index = (tmp[3] << 8) | tmp[4];

			row.datenType = tmp[5];
			row.einheit = tmp[6];
			row.unknown9 = tmp[7];
			row.unknown10 = tmp[8];
			row.teiler = tmp[9];

			row.min_wert = (tmp[10] << 8) | tmp[11];
			if (!row.min_wert) {
				row.min_wert = 0;
			}

			row.max_wert = (tmp[12] << 8) | tmp[13];
			if (!row.max_wert) {
				row.max_wert = 0;
			}

			row.std_wert = (tmp[14] << 8) | tmp[15];
			if (!row.std_wert) {
				row.std_wert = 0;
			}

			row.akt_wert = ((tmp[16] << 8) | tmp[17]) / row.teiler;
			if (!row.akt_wert) {
				row.akt_wert = 0;
			}

			row.ebene = tmp[18];

			const name = tmp
				.slice(19)
				.toString("ASCII")
				.trim();

			if (row.knoten && row.index) {
				row.key =
					this.messageHelperService.padl(row.knoten.toString(), 3) +
					"_" +
					this.messageHelperService.padl(row.index.toString(), 3);
				//if (row.knoten === 0 && row.index === 0) {
				const key = this.getKey(name);
				if (key.length > 0) {
					row.key += "_" + key;
				}
				//}
				row.name = name;
			} else {
				row.name = name;
				row.key = "000_000_" + this.getKey(name);
			}

			this.parameterListeRowReceived.next(row);

			return row;
			// row.key = row.knoten.toString() + "_" + row.index.toString();
			// if (row.knoten === 0 && row.index === 0) {
			// 	let key = this.getKey(name);
			// 	if (key.length > 0) row.key += "_" + key;
			// }
			// row.name = name;
			// this.parameterListeRowReceived.next(row);
		}
	}

	private decodeMonitorListeRow(
		tmp: Buffer,
		dataCount: number,
		checkSum: number,
	): MonitorListeRowMessage | LoadListStopMessage {
		//this.adapter.log.info("code: Mb test: " + tmp.length + " / " + tmp.toString("ASCII") + " dataCount: " + dataCount + " - checkSum" + checkSum);

		if (dataCount === 0 && checkSum === 0) {
			const message = new LoadListStopMessage(this.messageHelperService, LoadListType.Monitor);
			this.loadListStopMessageReceived.next(message);
			return message;
		} else {
			const row = new MonitorListeRowMessage();
			row.knoten = tmp[2];

			row.value = ((tmp[3] << 8) | tmp[4]) / tmp[9];
			row.ueberschrift = tmp[5];
			row.datenType = tmp[6];
			row.Unknown1 = tmp[7];
			row.Unknown2 = tmp[8];
			row.teiler = tmp[9];
			row.indexEbene = tmp[10];

			const name = tmp
				.slice(11)
				.toString("ASCII")
				.trim();
			row.key =
				this.messageHelperService.padl(row.knoten.toString(), 3) +
				"_" +
				this.messageHelperService.padl(row.indexEbene.toString(), 3);
			const key = this.getKey(name);
			if (key.length > 0) {
				row.key += "_" + key;
			}
			row.name = name;
			//if (row.value )
			this.monitorListeRowReceived.next(row);
			return row;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private decodeErrorMessage(tmp: Buffer, checkSum: number): ErrorMessage {
		//hier wird sms empfang als status übermittelt!
		const error = new ErrorMessage();
		error.error = tmp.toString("ASCII").trim();
		this.errorMessageReceived.next(error);

		return error;
	}

	private decodeDeviceMessage(tmp: Buffer, checkSum: number): DeviceMessageResponse | undefined {
		let calcCheckSum = 0;
		const raws = new Array<any>();
		raws.push({});
		let rawsCount = 0;
		let packageCount = 0;

		for (let index = 0; index < tmp.length; index++) {
			const value = tmp[index];

			if (packageCount === 0) {
				raws[rawsCount].place = value;
			} else if (packageCount === 1) {
				raws[rawsCount].device0 = value;
			} else if (packageCount === 2) {
				raws[rawsCount].device1 = value;
			} else if (packageCount === 3) {
				raws[rawsCount].value0 = value;
			} else if (packageCount === 4) {
				raws[rawsCount].value1 = value;
			} else {
				packageCount = 0;
				raws.push({});
				rawsCount++;
				raws[rawsCount].place = value;
			}
			packageCount++;
			calcCheckSum += value;
		}
		calcCheckSum = calcCheckSum % 256;

		if (calcCheckSum !== checkSum) {
			this.error("eta -> Checksum Error: " + calcCheckSum + " rec: " + checkSum);
		} else {
			const receivedMessageResponse = new DeviceMessageResponse();
			// eslint-disable-next-line prefer-const
			for (let raw of raws) {
				const temperatureData = new DeviceMessage();
				temperatureData.place = raw.place as EtaFurnaceTypes;
				const device = raw.device0 * 256 + raw.device1;

				if (temperatureData.place === EtaFurnaceTypes.Scheitholzkessel) {
					temperatureData.parameter = device as AECParameters;
				} else if (temperatureData.place === EtaFurnaceTypes.Pelletskessel_bis_30kW) {
					temperatureData.parameter = device as AELParameters;
				}
				if (temperatureData.place === EtaFurnaceTypes.Pelletskessel_ab_35kW) {
					temperatureData.parameter = device as AELKParameters;
				}

				temperatureData.value = (raw.value0 << 8) | raw.value1;
				if (temperatureData.value >= 30000) {
					//Temperatur unter 0 C ?
					temperatureData.value = temperatureData.value - 65536;
				}
				temperatureData.value = temperatureData.value / 10;

				receivedMessageResponse.deviceMessages.push(temperatureData);
			}

			if (receivedMessageResponse.deviceMessages.length > 0) {
				this.deviceMessageReceived.next(receivedMessageResponse);
			}
			return receivedMessageResponse;
		}
	}

	private dec2bin(dec: number): string {
		return (dec >>> 0).toString(2);
	}

	private getKey(key: string): string {
		let val = key
			.trim()
			.replace(/\./g, "_")
			.replace(/ /g, "_")
			.replace(/__/g, "_")
			.replace(/__/g, "_")
			.replace(/__/g, "_");

		if (val.substr(0, 1) === "_") {
			val = val.substring(1);
		}
		if (val.substr(val.length - 1, 1) === "_") {
			val = val.substring(0, val.length - 1);
		}
		if (val.substr(val.length - 1, 1) === "_") {
			val = val.substring(0, val.length - 1);
		}
		return val;
	}
}
