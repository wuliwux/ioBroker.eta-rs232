import { AECParameters } from "../enums/aecparameters.enum";
import { AELKParameters } from "../enums/aelkparameters.enum";
import { AELParameters } from "../enums/aelparameters.enum";
import { EtaFurnaceTypes } from "../enums/eta-furnace-types.enum";

export class CommonService {
	public getParameterName(
		etaFurnaceType: EtaFurnaceTypes,
		parameter: AECParameters | AELParameters | AELKParameters,
	): string {
		switch (etaFurnaceType) {
			case EtaFurnaceTypes.Scheitholzkessel:
				return AECParameters[parameter as AECParameters];
			case EtaFurnaceTypes.Pelletskessel_bis_30kW:
				return AELParameters[parameter as AELParameters];

			case EtaFurnaceTypes.Pelletskessel_ab_35kW:
				return AELParameters[parameter as AELParameters];
			default:
				return "";
		}
	}

	public getNameFromEtaFurnaceType(etaFurnaceType: EtaFurnaceTypes): string {
		return EtaFurnaceTypes[etaFurnaceType];
	}

	public getParametersByEtaFurnaceType(
		etaFurnaceType: EtaFurnaceTypes,
	): Array<AECParameters | AELParameters | AELKParameters> {
		// tslint:disable-next-line: typedef
		const parameters = new Array<AECParameters | AELParameters | AELKParameters>();

		switch (etaFurnaceType) {
			case EtaFurnaceTypes.Scheitholzkessel:
				parameters.push(AECParameters.Kessel);
				parameters.push(AECParameters.Abgas);
				parameters.push(AECParameters.Boiler);
				parameters.push(AECParameters.Pufferladezst);
				parameters.push(AECParameters.Puffer_oben);
				parameters.push(AECParameters.Puffer_mitte);
				parameters.push(AECParameters.Puffer_unten);
				parameters.push(AECParameters.Kesselruecklauf);
				parameters.push(AECParameters.Brenner);
				parameters.push(AECParameters.Boiler_oben_Sol);
				parameters.push(AECParameters.Boiler_unten_Sol);
				parameters.push(AECParameters.Aussentemp);
				parameters.push(AECParameters.Vorlauf_MK_1);
				parameters.push(AECParameters.Raum_MK_1);
				parameters.push(AECParameters.Vorlauf_MK_2);
				parameters.push(AECParameters.Raum_MK_2);
				parameters.push(AECParameters.Vorlauf_MK_3);
				parameters.push(AECParameters.Raum_MK_3);
				parameters.push(AECParameters.Vorlauf_MK_4);
				parameters.push(AECParameters.Raum_MK_4);
				break;
			case EtaFurnaceTypes.Pelletskessel_bis_30kW:
				parameters.push(AELParameters.Kessel);
				parameters.push(AELParameters.Kesselvorlauf);
				parameters.push(AELParameters.Fremdwaerme);
				parameters.push(AELParameters.Abgas);
				parameters.push(AELParameters.Puffer_oben);
				parameters.push(AELParameters.Puffer_unten);
				parameters.push(AELParameters.Boiler);
				parameters.push(AELParameters.Boiler_unten);
				parameters.push(AELParameters.Aussen);
				parameters.push(AELParameters.Vorlauf_DK);
				parameters.push(AELParameters.Raum_DK);
				parameters.push(AELParameters.Vorlauf_MK_0);
				parameters.push(AELParameters.Raum_MK_0);
				parameters.push(AELParameters.ThermostatHeiss);
				parameters.push(AELParameters.Pelletsvorrat);
				break;
			case EtaFurnaceTypes.Pelletskessel_ab_35kW:
				parameters.push(AELKParameters.Kessel);
				parameters.push(AELKParameters.Kesselruecklauf);
				parameters.push(AELKParameters.Fremdwaerme);
				parameters.push(AELKParameters.Abgas);
				parameters.push(AELKParameters.Puffer_oben);
				parameters.push(AELKParameters.Puffer_unten);
				parameters.push(AELKParameters.Boiler);
				parameters.push(AELKParameters.Boiler_unten);
				parameters.push(AELKParameters.Aussen);
				parameters.push(AELKParameters.Vorlauf_MK_0);
				parameters.push(AELKParameters.Raum_MK_0);
				parameters.push(AELKParameters.Pelletsvorrat);
				break;
			default:
		}
		return parameters;
	}
}
