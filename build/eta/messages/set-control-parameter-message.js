"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// https://www.symcon.de/forum/threads/4485-Temperaturwerte-aus-einem-Pelletkessel-der-FA-ETA-auslesen/page9
class SetControlParameterMessage {
    constructor(messageHelperService, etaFurnaceType, setControlParameter, value) {
        this.messageHelperService = messageHelperService;
        this.etaFurnaceType = etaFurnaceType;
        this.setControlParameter = setControlParameter;
        this.value = value;
    }
    getMessage() {
        let buffer = new Array();
        /*
$Daten ="{MJ";                     //Startzeichen und Servicekennung
$Daten .= chr(5);                        //Anzahl der Nutzdatenbytes
$Daten .= chr($PS);                   //Pr�fsumme
$Daten .= chr($Node);         //Knoten (Kesslplatine oder Heizerweiterung,24 oder 32 bei mir)
$Daten .= chr(00);                   // Index Highwert "fast" immer Null
$Daten .= chr($Index_LByte);      // Index, Postfach f�r Wert
$Daten .= chr($HighWert);                //oberer Temperaturteilwert in HEX (Wert_HByte)
$Daten .= chr($LowWert);                     //unterer Temperaturteiiwert in HEX (Wert_LByte)
$Daten .= "}";
*/
        buffer.push(this.etaFurnaceType);
        // set high / low byte
        buffer.push(this.setControlParameter >> 8);
        buffer.push(this.setControlParameter & 0x00ff);
        let value = this.value * 10;
        // set high / low byte
        buffer.push(value >> 8);
        buffer.push(value & 0x00ff);
        let checksum = 0;
        for (let x of buffer) {
            checksum += x;
        }
        let retrun = Buffer.concat([
            this.messageHelperService.messageStartTag,
            this.messageHelperService.heizungsParameterSetzenTag,
            new Buffer([buffer.length, checksum % 256]),
            new Buffer(buffer),
            this.messageHelperService.messageStopTag,
        ]);
        return retrun;
    }
}
exports.SetControlParameterMessage = SetControlParameterMessage;
/* PHP
 $Node = 8; // gefundene Knotennummer
$Index_LByte = 36;  // beim PEK50 mit Erweiterung

//Angelegte Variable aus Webfront auslesen
$Wert = 400*10; //Teiler da Zentelgrad!

//Umrechnung f�r Kessel
$HighWert = ((int)($Wert/256));
$LowWert = $Wert % 256;

//Pr�fsummenberrechnung wird als 3tes Byte gesendet
$PS = $Node + $Index_LByte + $HighWert + $LowWert;
$PS = $PS & 255;    // Rest aus Division durch 256
//Pr�fsummenberechnung Ende


//String zusammenbauen
$Daten ="{MJ";                     //Startzeichen und Servicekennung
$Daten .= chr(5);                        //Anzahl der Nutzdatenbytes
$Daten .= chr($PS);                   //Pr�fsumme
$Daten .= chr($Node);         //Knoten (Kesslplatine oder Heizerweiterung,24 oder 32 bei mir)
$Daten .= chr(00);                   // Index Highwert "fast" immer Null
$Daten .= chr($Index_LByte);      // Index, Postfach f�r Wert
$Daten .= chr($HighWert);                //oberer Temperaturteilwert in HEX (Wert_HByte)
$Daten .= chr($LowWert);                     //unterer Temperaturteiiwert in HEX (Wert_LByte)
$Daten .= "}";

echo $Daten;

echo "rn";

$length = strlen($Daten);

for ($i=0; $i<$length; $i++) {
  echo " ";
   echo ord($Daten[$i]);
}
 */
