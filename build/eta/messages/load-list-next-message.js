"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable: typedef
const eta_furnace_right_enum_1 = require("../enums/eta-furnace-right.enum");
const load_list_type_enum_1 = require("../enums/load-list-type.enum");
class LoadListNextMessage {
    constructor(messageHelperService, etaFurnaceRight, loadListType) {
        this.messageHelperService = messageHelperService;
        this.etaFurnaceRight = etaFurnaceRight;
        this.loadListType = loadListType;
    }
    getMessage() {
        let loadListType;
        if (this.loadListType === load_list_type_enum_1.LoadListType.Monitor) {
            loadListType = this.messageHelperService.monitorListeTag;
        }
        else if (this.loadListType === load_list_type_enum_1.LoadListType.Parameter) {
            loadListType = this.messageHelperService.parameterListeTag;
        }
        else if (this.loadListType === load_list_type_enum_1.LoadListType.ParameterIndex) {
            loadListType = this.messageHelperService.parameterIndexListeTag;
        }
        else {
            loadListType = new Buffer([]);
        }
        let code;
        if (this.loadListType === load_list_type_enum_1.LoadListType.Monitor || this.loadListType === load_list_type_enum_1.LoadListType.Parameter) {
            if (this.etaFurnaceRight === eta_furnace_right_enum_1.EtaFurnaceRight.Standard) {
                code = new Buffer([2, 2, 1, 1]);
            }
            else if (this.etaFurnaceRight === eta_furnace_right_enum_1.EtaFurnaceRight.Service) {
                code = new Buffer([2, 3, 1, 2]);
            }
            else if (this.etaFurnaceRight === eta_furnace_right_enum_1.EtaFurnaceRight.Profi) {
                code = new Buffer([2, 4, 1, 3]);
            }
            else if (this.etaFurnaceRight === eta_furnace_right_enum_1.EtaFurnaceRight.Expert) {
                code = new Buffer([2, 5, 1, 4]);
            }
            else {
                code = new Buffer([]);
            }
        }
        else if (this.loadListType === load_list_type_enum_1.LoadListType.ParameterIndex) {
            code = new Buffer([1, 1, 1]);
        }
        else {
            code = new Buffer([]);
        }
        const x = Buffer.concat([
            this.messageHelperService.messageStartTag,
            loadListType,
            code,
            this.messageHelperService.messageStopTag,
        ]);
        return x;
    }
}
exports.LoadListNextMessage = LoadListNextMessage;
