/* eslint-disable @typescript-eslint/no-this-alias */
// tslint:disable:typedef
import { TestData } from "./test-data";

export class TestDataRepository {
	public testDatas: Array<TestData> = new Array<TestData>();

	private fs = require("fs");

	constructor() {
		this.loadTestDataToFile();
	}

	public writeTestDataToFile(): void {
		const json = JSON.stringify(this.testDatas);
		this.fs.writeFile("..\\testDatas.json", json, "utf8", function(err: any) {
			if (err) {
				return console.log(err);
			}

			console.log("The file was saved!");
		});
	}

	public loadTestDataToFile(): void {
		const that = this;
		this.testDatas.splice(0, this.testDatas.length);
		//let json = JSON.stringify(this.testDataRepository.testDatas);
		const json = this.fs.readFileSync("..\\testDatas.json", "utf8");

		const items = JSON.parse(json);

		for (const item of items) {
			const testData = new TestData();
			testData.id = item.id;
			testData.time = item.time;
			testData.buffer = new Buffer(item.buffer.data);
			that.testDatas.push(testData);
		}
	}
}
