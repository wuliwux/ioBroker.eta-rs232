"use strict";
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
// tslint:disable: no-empty
Object.defineProperty(exports, "__esModule", { value: true });
// enable serial on raspi
// add package.json -> "raspi-serial": "^5.0.0",
// in eta.service.ts
// comment:
// import { Serial } from "./mock/Serial";
// uncomment:
// import { Serial } from "raspi-serial";
class Serial {
    constructor(config) {
        console.log(config);
    }
    open(cb) { }
    close(cb) { }
    write(data, cb) { }
    flush(cb) { }
    on(x, cd) { }
}
exports.Serial = Serial;
