"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aecparameters_enum_1 = require("../enums/aecparameters.enum");
const aelkparameters_enum_1 = require("../enums/aelkparameters.enum");
const aelparameters_enum_1 = require("../enums/aelparameters.enum");
const eta_furnace_types_enum_1 = require("../enums/eta-furnace-types.enum");
class CommonService {
    getParameterName(etaFurnaceType, parameter) {
        switch (etaFurnaceType) {
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Scheitholzkessel:
                return aecparameters_enum_1.AECParameters[parameter];
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Pelletskessel_bis_30kW:
                return aelparameters_enum_1.AELParameters[parameter];
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Pelletskessel_ab_35kW:
                return aelparameters_enum_1.AELParameters[parameter];
            default:
                return "";
        }
    }
    getNameFromEtaFurnaceType(etaFurnaceType) {
        return eta_furnace_types_enum_1.EtaFurnaceTypes[etaFurnaceType];
    }
    getParametersByEtaFurnaceType(etaFurnaceType) {
        // tslint:disable-next-line: typedef
        const parameters = new Array();
        switch (etaFurnaceType) {
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Scheitholzkessel:
                parameters.push(aecparameters_enum_1.AECParameters.Kessel);
                parameters.push(aecparameters_enum_1.AECParameters.Abgas);
                parameters.push(aecparameters_enum_1.AECParameters.Boiler);
                parameters.push(aecparameters_enum_1.AECParameters.Pufferladezst);
                parameters.push(aecparameters_enum_1.AECParameters.Puffer_oben);
                parameters.push(aecparameters_enum_1.AECParameters.Puffer_mitte);
                parameters.push(aecparameters_enum_1.AECParameters.Puffer_unten);
                parameters.push(aecparameters_enum_1.AECParameters.Kesselruecklauf);
                parameters.push(aecparameters_enum_1.AECParameters.Brenner);
                parameters.push(aecparameters_enum_1.AECParameters.Boiler_oben_Sol);
                parameters.push(aecparameters_enum_1.AECParameters.Boiler_unten_Sol);
                parameters.push(aecparameters_enum_1.AECParameters.Aussentemp);
                parameters.push(aecparameters_enum_1.AECParameters.Vorlauf_MK_1);
                parameters.push(aecparameters_enum_1.AECParameters.Raum_MK_1);
                parameters.push(aecparameters_enum_1.AECParameters.Vorlauf_MK_2);
                parameters.push(aecparameters_enum_1.AECParameters.Raum_MK_2);
                parameters.push(aecparameters_enum_1.AECParameters.Vorlauf_MK_3);
                parameters.push(aecparameters_enum_1.AECParameters.Raum_MK_3);
                parameters.push(aecparameters_enum_1.AECParameters.Vorlauf_MK_4);
                parameters.push(aecparameters_enum_1.AECParameters.Raum_MK_4);
                break;
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Pelletskessel_bis_30kW:
                parameters.push(aelparameters_enum_1.AELParameters.Kessel);
                parameters.push(aelparameters_enum_1.AELParameters.Kesselvorlauf);
                parameters.push(aelparameters_enum_1.AELParameters.Fremdwaerme);
                parameters.push(aelparameters_enum_1.AELParameters.Abgas);
                parameters.push(aelparameters_enum_1.AELParameters.Puffer_oben);
                parameters.push(aelparameters_enum_1.AELParameters.Puffer_unten);
                parameters.push(aelparameters_enum_1.AELParameters.Boiler);
                parameters.push(aelparameters_enum_1.AELParameters.Boiler_unten);
                parameters.push(aelparameters_enum_1.AELParameters.Aussen);
                parameters.push(aelparameters_enum_1.AELParameters.Vorlauf_DK);
                parameters.push(aelparameters_enum_1.AELParameters.Raum_DK);
                parameters.push(aelparameters_enum_1.AELParameters.Vorlauf_MK_0);
                parameters.push(aelparameters_enum_1.AELParameters.Raum_MK_0);
                parameters.push(aelparameters_enum_1.AELParameters.ThermostatHeiss);
                parameters.push(aelparameters_enum_1.AELParameters.Pelletsvorrat);
                break;
            case eta_furnace_types_enum_1.EtaFurnaceTypes.Pelletskessel_ab_35kW:
                parameters.push(aelkparameters_enum_1.AELKParameters.Kessel);
                parameters.push(aelkparameters_enum_1.AELKParameters.Kesselruecklauf);
                parameters.push(aelkparameters_enum_1.AELKParameters.Fremdwaerme);
                parameters.push(aelkparameters_enum_1.AELKParameters.Abgas);
                parameters.push(aelkparameters_enum_1.AELKParameters.Puffer_oben);
                parameters.push(aelkparameters_enum_1.AELKParameters.Puffer_unten);
                parameters.push(aelkparameters_enum_1.AELKParameters.Boiler);
                parameters.push(aelkparameters_enum_1.AELKParameters.Boiler_unten);
                parameters.push(aelkparameters_enum_1.AELKParameters.Aussen);
                parameters.push(aelkparameters_enum_1.AELKParameters.Vorlauf_MK_0);
                parameters.push(aelkparameters_enum_1.AELKParameters.Raum_MK_0);
                parameters.push(aelkparameters_enum_1.AELKParameters.Pelletsvorrat);
                break;
            default:
        }
        return parameters;
    }
}
exports.CommonService = CommonService;
