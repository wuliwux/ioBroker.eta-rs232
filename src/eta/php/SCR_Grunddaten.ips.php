<?
/*
+------------------------+
Joachim Mistlbacher
www.joko.at
+------------------------+
ETA2IPS Grunddaten
Version 1.000
+------------------------+
21.01.2011
Alle Grunddaten werden vom Ofen eingelesen
+------------------------+
*/
// 												!!! Achtung dieses Script nicht mit "Ausfuehren" starten !!!
//
//
require'SCR_EtaFunctions.ips.php';
$ETA_ComID = GetObjectID("ETA_COM_Port",""); //Instances ID des COM-Ports

$GrunddatenVarStatus = GetValueInteger(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten Status"));
$GrunddatenAction = 2;

if ($_IPS['SENDER'] == "WebFront") {

	if ($GrunddatenVarStatus > 2) //Daten werden gerade geladen
	{
       $GrunddatenAction = 0;
	} else if ($GrunddatenVarStatus == 1)//Grunddaten loeschen
	{
      $GrunddatenAction = 1;

	} else { //Daten laden

      $GrunddatenAction = 2; //laden start
	}
}

//Daten verarbeiten

switch ($GrunddatenAction) {
	case 0: // Daten werden gerade geladen
		WFC_SendNotification(GetObjectID("WebFront Configurator"),"Info","Grunddaten werden gerade geladen. Bitte warten...","Infomation",5);
	break;
	case 1: // Grunddaten loeschen
		WFC_SendNotification(GetObjectID("WebFront Configurator"),"Info","Grunddaten werden geloescht","Infomation",5);
		SetValueString(GetObjectID("ETA/Setup/Setup_log"),"");
		write_error("Grunddaten werden zurueckgesetzt",3);
		write_error("Monitorliste.xml wird geloescht",3);
		unlink('Monitorliste.xml');
		write_error("ParameterListe.xml wird geloescht",3);
		unlink('ParameterListe.xml');
		write_error("ParameterIndexListe.xml wird geloescht",3);
		unlink('ParameterIndexListe.xml');
		write_error("ETA Variablen Profile werden geloescht",3);
		deleteOldVarProfiles(1);
		write_error("Monitor Variablen werden geloescht",3);
		deleteObjectsUnderParentID(GetObjectID("ETA/Variablen/Monitor Liste"),2);
		deleteObjectsUnderParentID(GetObjectID("ETA/Variablen/Monitor Liste"),0);
		write_error("Aktuelle Werte Variablen werden geloescht",3);
		deleteObjectsUnderParentID(GetObjectID("ETA/Variablen/Aktuelle Werte"),2);
		deleteObjectsUnderParentID(GetObjectID("ETA/Variablen/Aktuelle Werte"),1);
		deleteObjectsUnderParentID(GetObjectID("ETA/Variablen/Aktuelle Werte"),0);
		deleteObjectsUnderParentID(GetObjectID("ETA/Uebersicht"),6);
		write_error("Verwaiste Archive werden geloescht",3);
		deleteOldVarsFromArchiveHandler();
		write_error("Grunddaten wurden zurueckgesetzt",3);
		SetValueInteger(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten Status"),0);
		SetValueBoolean(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten"),false);
	break;
	case 2: // Grunddaten laden
		switch ($GrunddatenVarStatus) {
	    case 0: //GD nicht geladen
				SetValueInteger(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten Status"),3);
	       	WFC_SendNotification(GetObjectID("WebFront Configurator"),"Info","Grunddaten werden geldaen","Infomation",5);
	     		SetValueString(GetObjectID("ETA/Setup/Setup_log"),"");
	        if (file_exists('Monitorliste.xml') == false)
				{
					write_error("Monitorliste wird erstellt:",3);
					//Anfoderung an COM Port schicken...
					$ETA_ComID = GetObjectID("ETA_COM_Port",""); //Instances ID des COM-Ports
					SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID"),0);
				//leeres XML File
$xmlstr = <<<XML
<?xml version='1.0' standalone='yes'?>
<MonitorTable>
</MonitorTable>
XML;
				$xml = new SimpleXMLElement($xmlstr);
				$xml->asXML('Monitorliste.xml');
				//Befehl schicken um Monitorliste zu schicken, Achtung ist nicht gleich mit der Funktion "MonitorListe_weiterenParameterHolen()"
				Datenanfodern_STOP($ETA_ComID);
				$MonitorListeStart ="{MA";
				If (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 0)
				{
					$MonitorListeStartBytes = chr(02) . chr(01) . chr(00) . chr(01); //Standard
				} else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 1){
					$MonitorListeStartBytes = chr(02) . chr(02) . chr(00) . chr(02); //Service
				} else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 2) {
					$MonitorListeStartBytes = chr(02) . chr(03) . chr(00) . chr(03); //Profi
				} else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 3) {
					$MonitorListeStartBytes = chr(02) . chr(04) . chr(00) . chr(04); //Expert
				}
				$MonitorListeEndZeichen = "}";
				//Zusammensetzen
				$Daten = $MonitorListeStart . $MonitorListeStartBytes . $MonitorListeEndZeichen;
				$MonitorListeStatus = false;
				//Daten senden
				ComPort_SendText($ETA_ComID, $Daten);
				} else
				{
					WFC_SendNotification(GetObjectID("WebFront Configurator"),"Fehler","Monitorliste ist bereits vorhanden!","Error",5);
				}
				SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
	        break;
	    case 1: //GD geladen
	        //echo "Grunddaten geladen";
	        break;
	    case 2: //GD Error
	        echo "GD Error";
	        break;
	    case 3: // Parameter XML laden
				if (file_exists('ParameterListe.xml') == false)
				{
					write_error("Parameter Liste wird geladen...:",3);
					//Anfoderung an COM Port schicken...
					SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterListeID"),0);
//leeres XML File
$xmlstr = <<<XML
<?xml version='1.0' standalone='yes'?>
<ParameterTable>
</ParameterTable>
XML;
					$xml = new SimpleXMLElement($xmlstr);
					$xml->asXML('ParameterListe.xml');
					//Befehl schicken um ParameterListe zu schicken
					Datenanfodern_STOP($ETA_ComID);
					$ParameterListeStart ="{MF";
					If (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 0) {
						$ParameterListeStartBytes = chr(02) . chr(01) . chr(00) . chr(01); //Standard
					} else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 1) {
						$ParameterListeStartBytes = chr(02) . chr(02) . chr(00) . chr(02); //Service
					} else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 2) {
						$ParameterListeStartBytes = chr(02) . chr(03) . chr(00) . chr(03); //Profi
					} else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 3) {
						$ParameterListeStartBytes = chr(02) . chr(04) . chr(00) . chr(04); //Expert
					}
					$ParameterListeEndZeichen = "}";
					//Zusammensetzen
					$Daten = $ParameterListeStart . $ParameterListeStartBytes . $ParameterListeEndZeichen;
					$ParameterListeStatus = false;
					SetValueInteger(GetObjectID("ETA/Meldungen/Pruefsummenfehler"),0);
					ComPort_SendText($ETA_ComID, $Daten);
				} else {
					//SetValue($_IPS['VARIABLE'], $_IPS{'VALUE']);
					WFC_SendNotification(GetObjectID("WebFront Configurator"),"Fehler","Parameter Liste ist bereits vorhanden!","Error",5);
				}
	        break;
	    case 4:
				// ********** Parameter Index Liste wird geladen
//leeres XML File
$xmlstr = <<<XML
<?xml version='1.0' standalone='yes'?>
<ParameterIndexListe>
</ParameterIndexListe>
XML;
				//Wenn kein XML File vorhanden dann neues erstellen
				if (file_exists('ParameterIndexListe.xml')) {
				   echo "Parameter Index Liste bereits vorhanden";
				} else {
				   write_error("Parameter Index Liste wird erstellt...",3);
			      $xml = new SimpleXMLElement($xmlstr);
			      $xml->asXML('ParameterIndexListe.xml');
			      //Befehl schicken
	            Datenanfodern_STOP($ETA_ComID);
	           	$ParameterIndexListeStart ="{MH";
	  			  	$ParameterIndexListeStartBytes = chr(01) . chr(00) . chr(00);
	           	$ParameterIndexListeEndZeichen = "}";
	            //Zusammensetzen
	            $Daten = $ParameterIndexListeStart . $ParameterIndexListeStartBytes . $ParameterIndexListeEndZeichen;
	            $MonitorListeStatus = false;
	            ComPort_SendText($ETA_ComID, $Daten);
			 }
	        break;
	    case 5:
			if (file_exists('Monitorliste.xml') == true){
				write_error("Monitorliste Variablen werden erstellt:",3);
				$xml = simplexml_load_file('Monitorliste.xml');
				$i = 0;
				$top = 0;
				$left = 5;
				foreach ($xml->xpath('MonitorRow') as $Row)
				{
					if  (strlen($Row->ID) == 1) {
						$newID = "00" . utf8_decode($Row->ID);
					} elseif (strlen($Row->ID) == 2) {
						$newID = "0" . utf8_decode($Row->ID);
					} else {
						$newID = utf8_decode($Row->ID);
					}
					if (($Row->IndexEbene == 0) and (($Row->Ueberschrift == 255) or ($Row->Ueberschrift == 2)or ($Row->Ueberschrift == 32))) { //HauptGruppen erstellen index 0
						$neueIndexEbene0 = KategorieErstellen(strval(utf8_decode($Row->Name)),GetObjectID("ETA/Variablen/Monitor Liste"));
						//fuer die Uebersichtsseite
						if ($Row->Ueberschrift != 255) {
							$NeueVariablenID = CheckCreateNewObject("Uebersicht_".utf8_decode($Row->Name),2,1,$neueIndexEbene0,"ETA.Main.Monitorliste",false,false,false,null);
							IPS_SetInfo($NeueVariablenID,"ETA_MLP_".$newID);
							write_error("Variable ".utf8_decode($Row->Name). " wurde erstellt",3);
							IPS_SetVariableCustomAction($NeueVariablenID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
						}
					} elseif (($Row->IndexEbene == 1) and ($Row->Ueberschrift == 255)) { //Index Ebene 1
						$neueIndexEbene1 = KategorieErstellen(strval(utf8_decode($Row->Name)),$neueIndexEbene0);
					} elseif (($Row->IndexEbene == 2) and ($Row->Ueberschrift == 255)) { //Index Ebene 2
						$neueIndexEbene2 = KategorieErstellen(strval(utf8_decode($Row->Name)),$neueIndexEbene1);
					} elseif (($Row->IndexEbene == 3) and ($Row->Ueberschrift == 255)) { //Index Ebene 3
						$neueIndexEbene3 = KategorieErstellen(strval(utf8_decode($Row->Name)),$neueIndexEbene2);
					} elseif (($Row->IndexEbene == 1) and ($Row->Ueberschrift != 255)) { //Index Ebene 1 - Variablen
                  $NeueVariablenID = CheckCreateNewObject(utf8_decode($Row->Name),2,1,$neueIndexEbene0,"ETA.Main.Monitorliste",false,false,false,null);
                  IPS_SetInfo($NeueVariablenID,"ETA_MLP_".$newID);
						write_error("Variable ".utf8_decode($Row->Name). " wurde erstellt",3);
						IPS_SetVariableCustomAction($NeueVariablenID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
					} elseif (($Row->IndexEbene == 2) and ($Row->Ueberschrift != 255)) { //Index Ebene 2 - Variablen
						$NeueVariablenID = CheckCreateNewObject(utf8_decode($Row->Name),2,1,$neueIndexEbene1,"ETA.Main.Monitorliste",false,false,false,null);
                  IPS_SetInfo($NeueVariablenID,"ETA_MLP_".$newID);
						write_error("Variable ".utf8_decode($Row->Name). " wurde erstellt",3);
						IPS_SetVariableCustomAction($NeueVariablenID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
					} elseif (($Row->IndexEbene == 3) and ($Row->Ueberschrift != 255)) { //Index Ebene 3 - Variablen
						$NeueVariablenID = CheckCreateNewObject(utf8_decode($Row->Name),2,1,$neueIndexEbene2,"ETA.Main.Monitorliste",false,false,false,null);
                  IPS_SetInfo($NeueVariablenID,"ETA_MLP_".$newID);
						write_error("Variable ".utf8_decode($Row->Name). " wurde erstellt",3);
						IPS_SetVariableCustomAction($NeueVariablenID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
					}
				}
				SetValueInteger(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten Status"),1); //Grunddaten fertig geladen
				SetValueBoolean(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten"),true);
				write_error("Monitorliste Variablen wurden erstellt",3);
			} else {
				WFC_SendPopup(GetObjectID("WebFront Configurator"),"Fehler","Monitorliste Variablen wurden schon erstellt oder Monitorliste.xml Datei fehlt!");
			}
	        break;
	}
	break;
}

?>