// tslint:disable: comment-format
export class MessageHelperService {
	public messageStartTag: Buffer = new Buffer([123]); // {

	public messageStopTag: Buffer = new Buffer([125]); // }

	public subscribeDataTag: Buffer = new Buffer([77, 67]); // MC

	public unsubscribeDataTag: Buffer = new Buffer([77, 69]); // ME

	public deviceMessageTag: Buffer = new Buffer([77, 68]); // MD

	public deviceMessageTagString = this.deviceMessageTag.toString("ASCII");

	public monitorListeReceiveTag: Buffer = new Buffer([77, 98]); // Mb

	public monitorListeReceiveTagString = this.monitorListeReceiveTag.toString("ASCII");

	public parameterListeReceiveTag: Buffer = new Buffer([77, 103]); // Mg

	public parameterListeReceiveTagString = this.parameterListeReceiveTag.toString("ASCII");

	public parameterListeReceiveTag2: Buffer = new Buffer([8, 0]); // unknown

	public parameterListeReceiveTagString2 = this.parameterListeReceiveTag.toString("ASCII");

	public parameterIndexReceiveTag: Buffer = new Buffer([77, 105]); // Mi

	public parameterIndexReceiveTagString = this.parameterIndexReceiveTag.toString("ASCII");

	public heizungsParameterSetzenTag: Buffer = new Buffer([77, 74]); // MJ

	public errorTag: Buffer = new Buffer([73, 77]); // IM

	public errorTagString = this.errorTag.toString("ASCII");

	public smsControlTag: Buffer = new Buffer([73, 72]); // IH

	public parameterChangedTag: Buffer = new Buffer([77, 75]); // MK

	public parameterChangedTagString: string = this.parameterChangedTag.toString("ASCII");

	public monitorListeTag: Buffer = new Buffer([77, 65]); // MA

	public parameterListeTag: Buffer = new Buffer([77, 70]); // MF

	public parameterIndexListeTag: Buffer = new Buffer([77, 72]); // MH

	public loadListStopTag: Buffer = new Buffer([77, 79]); // MO

	public debug(message: Buffer): string {
		// tslint:disable-next-line: typedef
		let log = "";
		// tslint:disable-next-line: typedef
		for (let index = 0; index < message.length; index++) {
			// tslint:disable-next-line: typedef
			const element = message[index];
			log += element.toString() + ", ";
		}
		//console.log(tmp);
		return log;
	}

	public padl(input: string, length: number): string {
		return (Array(length + 1).join("0") + input).slice(-length);
	}
}
