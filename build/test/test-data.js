"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/ban-types */
class TestData {
    constructor(values = {}) {
        this.id = 0;
        this.time = new Date();
        this.buffer = new Buffer([]);
        // tslint:disable-next-line:typedef
        const vals = values;
        if (vals.id) {
            this.id = vals.id;
        }
        else {
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
exports.TestData = TestData;
