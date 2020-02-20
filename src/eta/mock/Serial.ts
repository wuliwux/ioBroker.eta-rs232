/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
// tslint:disable: no-empty

// enable serial on raspi
// add package.json -> "raspi-serial": "^5.0.0",

// in eta.service.ts
// comment:
// import { Serial } from "./mock/Serial";
// uncomment:
// import { Serial } from "raspi-serial";

export class Serial {
	constructor(config: any) {
		console.log(config);
	}

	public open(cb?: any): void {}

	public close(cb?: any): void {}

	public write(data: Buffer | string, cb?: any): void {}

	public flush(cb?: any): void {}

	public on(x: string, cd?: any): void {}
}
