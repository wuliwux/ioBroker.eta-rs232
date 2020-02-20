/* eslint-disable @typescript-eslint/camelcase */
export enum SetControlParameter {
	Vorlauftemp_bei_minus_10_C = 36,
	Vorlauftemp_bei_plus_10_C = 37,
	/// 0 = Sommer || 1 = Winter
	Sommer_Winter = 90,

	Heizen_bis_Aussentemp_Tagmodus = 27,
	Heizen_bis_Aussentemp_Nachtmodus = 28,
	Setzen_des_Pelletvorats = 107,
}
