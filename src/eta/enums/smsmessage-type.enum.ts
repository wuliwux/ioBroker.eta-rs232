//SMS Message Type
export enum SMSMessageType {
	HeizungReset = 0x01,
	HeizungAuto = 0x02,
	HeizungTag = 0x04,
	HeizungNacht = 0x08,
	KesselEin = 0x10,
	KesselAus = 0x20,
	BoilerLaden = 0x40,
}
