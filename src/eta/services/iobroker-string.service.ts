/* eslint-disable @typescript-eslint/no-inferrable-types */
export class IoBrokerStringService {
	public etaFurnaceType = "";

	public loadParameterIndexList = "loadParameterIndexList";
	public loadParameterList = "loadParameterList";
	public loadMonitorList = "loadMonitorList";

	public values = "values";
	public parameter = "parameter";
	public monitor = "monitor";
	public parameterIndex = "parameterIndex";

	public lastSend: string = "lastSend";
	public lastReceived: string = "lastReceived";
	public connected = "connected";
	public dataqueryrun = "dataqueryrun";
	public dataqueryInterval = "dataqueryInterval";

	public commands: string = "commands";

	public commandHeizungReset: string = "heizungReset";
	public commandHeizungAuto: string = "heizungAuto";
	public commandHeizungTag: string = "heizungTag";
	public commandHeizungNacht: string = "heizungNacht";
	public commandBoilerLaden: string = "boilerLaden";
}
