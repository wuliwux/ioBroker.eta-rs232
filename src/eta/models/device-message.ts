/* eslint-disable @typescript-eslint/no-inferrable-types */
import { AECParameters } from "../enums/aecparameters.enum";
import { AELKParameters } from "../enums/aelkparameters.enum";
import { AELParameters } from "../enums/aelparameters.enum";
import { EtaFurnaceTypes } from "../enums/eta-furnace-types.enum";

export class DeviceMessage {
	public place: EtaFurnaceTypes = EtaFurnaceTypes.None;

	public parameter: AECParameters | AELParameters | AELKParameters = AECParameters.None;

	public value: number = 0;
}
