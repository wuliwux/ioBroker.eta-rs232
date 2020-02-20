/*
 * Created with @iobroker/create-adapter v1.21.1
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
import * as utils from "@iobroker/adapter-core";
import { EtaFurnaceRight } from "./eta/enums/eta-furnace-right.enum";
import { EtaFurnaceTypes } from "./eta/enums/eta-furnace-types.enum";
import { EtaService } from "./eta/eta.service";
import { CommonService } from "./eta/services/common.service";
import { IoBrokerStringService } from "./eta/services/iobroker-string.service";

// Load your modules here, e.g.:
// import * as fs from "fs";

// Augment the adapter.config object with the actual types
// TODO: delete this in the next version
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ioBroker {
		interface AdapterConfig {
			// Define the shape of your options here (recommended)
			portId: string;
			boudRate: number;
			dataBits: number;
			stopBits: number;
			parity: string;
			etaFurnaceType: number;
			// Or use a catch-all approach
			[key: string]: any;
		}
	}
}

class EtaRs232 extends utils.Adapter {
	private etaService: EtaService | undefined;
	private stringService = new IoBrokerStringService();
	private commonService = new CommonService();

	public constructor(options: Partial<ioBroker.AdapterOptions> = {}) {
		super({
			...options,
			name: "eta-rs232",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("objectChange", this.onObjectChange.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	private async onReady(): Promise<void> {
		console.info("onReady");
		if (!this.config.etaFurnaceType) {
			this.config.etaFurnaceType = EtaFurnaceTypes.Scheitholzkessel;
		}
		if (!this.config.etaFurnaceRight) {
			this.config.etaFurnaceRight = EtaFurnaceRight.Standard;
		}
		if (!this.config.valuesInterval) {
			this.config.valuesInterval = 30;
		}
		if (!this.config.enableExtendedLogInfo) {
			this.config.enableExtendedLogInfo = true;
		}

		this.stringService.etaFurnaceType = this.commonService.getNameFromEtaFurnaceType(this.config.etaFurnaceType);

		this.log.info("config x: " + JSON.stringify(this.config));

		this.initIoBrokerObjects();

		this.etaService = new EtaService(this, this.stringService, this.commonService);
		this.etaService.start();

		// in this template all states changes inside the adapters namespace are subscribed
		this.subscribeStates("*");
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 */
	private onUnload(callback: () => void): void {
		try {
			this.log.info("cleaned everything up...");
			if (this.etaService) {
				this.etaService.unload();
			}
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed object changes
	 */
	private onObjectChange(id: string, obj: ioBroker.Object | null | undefined): void {
		this.log.info("objectChange " + id + " " + JSON.stringify(obj));
	}

	/**
	 * Is called if a subscribed state changes
	 */
	private onStateChange(id: string, state: ioBroker.State | null | undefined): void {
		if (state) {
			// The state was changed
			if (this.etaService) {
				this.etaService.handleStateChange(id, state);
			}
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	private initIoBrokerObjects(): void {
		this.setObjectNotExists(this.stringService.etaFurnaceType, {
			type: "device",
			common: {
				name: this.stringService.etaFurnaceType,
			},
			native: {},
		});

		this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.parameter, {
			type: "channel",
			common: {
				name: this.stringService.parameter,
			},
			native: {},
		});
		this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.monitor, {
			type: "channel",
			common: {
				name: this.stringService.monitor,
			},
			native: {},
		});
		this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.parameterIndex, {
			type: "channel",
			common: {
				name: this.stringService.parameterIndex,
			},
			native: {},
		});

		this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.values, {
			type: "channel",
			common: {
				name: this.stringService.values,
			},
			native: {},
		});

		this.setObjectNotExists(this.stringService.lastReceived, {
			type: "state",
			common: {
				name: this.stringService.lastReceived,
				type: "string",
				role: "indicator",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExists(this.stringService.lastSend, {
			type: "state",
			common: {
				name: this.stringService.lastSend,
				type: "string",
				role: "indicator",
				read: true,
				write: false,
			},
			native: {},
		});

		this.setObjectNotExists(this.stringService.connected, {
			type: "state",
			common: {
				name: this.stringService.connected,
				type: "boolean",
				role: "indicator",
				read: true,
				write: false,
			},
			native: {},
		});

		this.setObjectNotExists(this.stringService.dataqueryrun, {
			type: "state",
			common: {
				name: this.stringService.dataqueryrun,
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		this.setObjectNotExists(this.stringService.dataqueryInterval, {
			type: "state",
			common: {
				name: this.stringService.dataqueryInterval,
				type: "number",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		this.setObjectNotExists(this.stringService.loadParameterList, {
			type: "state",
			common: {
				name: this.stringService.loadParameterList,
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});
		this.setObjectNotExists(this.stringService.loadMonitorList, {
			type: "state",
			common: {
				name: this.stringService.loadMonitorList,
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});
		this.setObjectNotExists(this.stringService.loadParameterIndexList, {
			type: "state",
			common: {
				name: this.stringService.loadParameterIndexList,
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		// commands
		this.setObjectNotExists(this.stringService.etaFurnaceType + "." + this.stringService.commands, {
			type: "channel",
			common: {
				name: this.stringService.commands,
			},
			native: {},
		});

		this.setObjectNotExists(
			this.stringService.etaFurnaceType +
				"." +
				this.stringService.commands +
				"." +
				this.stringService.commandBoilerLaden,
			{
				type: "state",

				common: {
					name: this.stringService.commandBoilerLaden,
					type: "boolean",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			},
		);

		this.setObjectNotExists(
			this.stringService.etaFurnaceType +
				"." +
				this.stringService.commands +
				"." +
				this.stringService.commandHeizungAuto,
			{
				type: "state",
				common: {
					name: this.stringService.commandHeizungAuto,
					type: "boolean",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			},
		);

		this.setObjectNotExists(
			this.stringService.etaFurnaceType +
				"." +
				this.stringService.commands +
				"." +
				this.stringService.commandHeizungNacht,
			{
				type: "state",
				common: {
					name: this.stringService.commandHeizungNacht,
					type: "boolean",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			},
		);
		this.setObjectNotExists(
			this.stringService.etaFurnaceType +
				"." +
				this.stringService.commands +
				"." +
				this.stringService.commandHeizungReset,
			{
				type: "state",
				common: {
					name: this.stringService.commandHeizungReset,
					type: "boolean",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			},
		);
		this.setObjectNotExists(
			this.stringService.etaFurnaceType +
				"." +
				this.stringService.commands +
				"." +
				this.stringService.commandHeizungTag,
			{
				type: "state",
				common: {
					name: this.stringService.commandHeizungTag,
					type: "boolean",
					role: "indicator",
					read: true,
					write: true,
				},
				native: {},
			},
		);
	}
}

if (module.parent) {
	// Export the constructor in compact mode
	module.exports = (options: Partial<ioBroker.AdapterOptions> | undefined) => new EtaRs232(options);
} else {
	// otherwise start the instance directly
	(() => new EtaRs232())();
}
