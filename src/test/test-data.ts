/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/ban-types */
export class TestData {
	public id: number = 0;

	public time: Date = new Date();

	public buffer: Buffer = new Buffer([]);

	constructor(values: Object = {}) {
		// tslint:disable-next-line:typedef
		const vals = values as any;
		if (vals.id) {
			this.id = vals.id;
		} else {
			this.id = 0;
		}

		if (vals.time) {
			this.time = new Date(vals.time);
		}

		if (vals.buffer) {
			this.buffer = vals.buffer;
		}
	}
}
