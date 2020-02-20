"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-this-alias */
// tslint:disable:typedef
const test_data_1 = require("./test-data");
class TestDataRepository {
    constructor() {
        this.testDatas = new Array();
        this.fs = require("fs");
        this.loadTestDataToFile();
    }
    writeTestDataToFile() {
        const json = JSON.stringify(this.testDatas);
        this.fs.writeFile("..\\testDatas.json", json, "utf8", function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }
    loadTestDataToFile() {
        const that = this;
        this.testDatas.splice(0, this.testDatas.length);
        //let json = JSON.stringify(this.testDataRepository.testDatas);
        const json = this.fs.readFileSync("..\\testDatas.json", "utf8");
        const items = JSON.parse(json);
        for (const item of items) {
            const testData = new test_data_1.TestData();
            testData.id = item.id;
            testData.time = item.time;
            testData.buffer = new Buffer(item.buffer.data);
            that.testDatas.push(testData);
        }
    }
}
exports.TestDataRepository = TestDataRepository;
