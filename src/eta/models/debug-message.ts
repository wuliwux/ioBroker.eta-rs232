/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ParameterChanged } from "./ParameterChanged";

export class DebugMessage {
	public message: string = "";

	public parameterChangeds: Array<ParameterChanged> = new Array<ParameterChanged>();
}
