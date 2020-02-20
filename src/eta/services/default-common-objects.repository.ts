/* eslint-disable @typescript-eslint/no-unused-vars */
// tslint:disable: typedef

import { AECParameters } from "../enums/aecparameters.enum";
import { AELKParameters } from "../enums/aelkparameters.enum";
import { AELParameters } from "../enums/aelparameters.enum";
import { EtaFurnaceTypes } from "../enums/eta-furnace-types.enum";
import { DeviceMessage } from "../models/device-message";
import { MonitorListeRowMessage } from "../models/monitor-liste-row-message";
import { ParameterIndexListeRowMessage } from "../models/parameter-index-liste-row-message";
import { ParameterListeRowMessage } from "../models/parameter-liste-row-message";
import { CommonService } from "../services/common.service";

export class DefaultCommonObjectsRepository {
	constructor(private commonService: CommonService) {}

	public GetIoObjectByParameterIndexListeRowMessage(message: ParameterIndexListeRowMessage): ioBroker.Object {
		const common: ioBroker.StateCommon = {
			name: message.name,
			type: "number",
			role: "indicator",
			read: false,
			write: false,
		};

		const obj: ioBroker.Object = {
			_id: "",
			type: "state",
			common: common,
			native: {
				knoten: message.knoten,
			},
		};
		return obj;
	}

	public GetIoObjectByParameterListeRowMessage(message: ParameterListeRowMessage): ioBroker.Object {
		//let value = message.akt_wert_hbyte * 256 + message.akt_wert_hbyte;

		const common: ioBroker.StateCommon = {
			name: message.name,
			type: "number",
			role: "indicator",
			read: false,
			write: false,
			min: message.min_wert,
			max: message.max_wert,
			def: message.std_wert,
		};

		const obj: ioBroker.Object = {
			_id: "",
			type: "state",
			common: common,
			native: {
				ebene: message.ebene,
				knoten: message.knoten,
				teiler: message.teiler,
				unknown9: message.unknown9,
				unknown10: message.unknown10,
				index: message.index,
			},
		};

		switch (message.einheit) {
			case 32:
				common.unit = "";
				break;
			case 37:
				common.unit = "%";
				break;
			case 109: // Zeit
				common.unit = "Minuten";
				break;
			case 115: // Zeit
				common.unit = "Sekunden";
				break;
			case 176: // Zeit
				common.unit = "°C";
				break;
			default:
				break;
		}

		switch (message.datenType) {
			case 0:
				common.type = "number";
				break;
			case 2:
				common.type = "boolean";
				break;
			case 3: // Zeit
			case 5: // Datum
			case 255: // Text
				common.type = "string";
				break;
			default:
				break;
		}

		return obj;
	}

	public GetIoObjectByMonitorListeRowMessage(message: MonitorListeRowMessage): ioBroker.Object {
		const common: ioBroker.StateCommon = {
			name: message.name,
			type: "number",
			role: "indicator",
			read: false,
			write: false,
		};

		const obj: ioBroker.Object = {
			_id: "",
			type: "state",
			common: common,
			native: {
				indexEbene: message.indexEbene,
				knoten: message.knoten,
				teiler: message.teiler,
				ueberschrift: message.ueberschrift,
				Unknown1: message.Unknown1,
				Unknown2: message.Unknown2,
			},
		};

		switch (message.datenType) {
			case 0:
				common.type = "number";
				break;
			case 2:
				common.type = "boolean";
				break;
			case 3: // Zeit
			case 5: // Datum
			case 255: // Text
				common.type = "string";
				break;
			default:
				break;
		}

		return obj;
	}

	public GetIoObjectByDeviceMessage(deviceMessage: DeviceMessage): ioBroker.Object {
		const common: ioBroker.StateCommon = {
			name: this.commonService.getParameterName(deviceMessage.place, deviceMessage.parameter),
			type: "number",
			role: "indicator",
			read: true,
			write: false,
			min: -100,
			max: 300,
			unit: "°C",
		};

		switch (deviceMessage.place) {
			case EtaFurnaceTypes.Scheitholzkessel: {
				const parameter = deviceMessage.parameter as AECParameters;

				switch (parameter) {
					case AECParameters.Pufferladezst:
						common.unit = "%";
						break;
					default:
						break;
				}
				break;
			}
			case EtaFurnaceTypes.Pelletskessel_bis_30kW: {
				const parameter = deviceMessage.parameter as AELParameters;

				break;
			}

			case EtaFurnaceTypes.Pelletskessel_ab_35kW: {
				const parameter = deviceMessage.parameter as AELKParameters;
				switch (parameter) {
					case AELKParameters.Pelletsvorrat:
						common.unit = "%";
						break;
					default:
						break;
				}
				break;
			}
		}

		const obj: ioBroker.Object = {
			_id: "",
			type: "state",
			common: common,
			native: {},
		};

		return obj;
	}
}
