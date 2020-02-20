<?
/*
+------------------------+
Joachim Mistlbacher
www.joko.at
+------------------------+
ETA2IPS Datenanforderung
Version 1.000
+------------------------+
21.01.2011
Startet die Datenanforderung
+------------------------+
*/
require'SCR_EtaFunctions.ips.php';

$ETA_ComID = GetObjectID("ETA_COM_Port",""); //Instances ID des COM-Ports
//echo $ETA_ComID;

//Auswahl des Benutzer auf doppelte Knoten überprüfen.
$AnalyseFehler = ETA_ParameterAuswahlAnalyse();

if ($AnalyseFehler == true)
   {
      SetValueBoolean(GetObjectID("Allgemein/Variablen/IPS_Alarm_Bool"), true);
      SetValueBoolean(GetObjectID("ETA/Variablen/Allgemein/ETA_AllowChangeSettings"), true);
      SetValueBoolean(GetObjectID("ETA/Setup/Datenabfrage"), false);
   } else {
      SetValueBoolean(GetObjectID("ETA/Setup/Datenabfrage"), true);
      SetValueBoolean(GetObjectID("ETA/Variablen/Allgemein/ETA_AllowChangeSettings"), false);
      //Start Bytes zusammenbauen und an COM übergeben
      IPS_SetScriptTimer(GetObjectID("ETA/Scripts/SCR_Datenanforderung"), 0);  //daktiviert Timer
      Datenanfordern_START($ETA_ComID,GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorList_ParameterBlockZaehler")));

   }
?>