<?
/*
+------------------------+
Joachim Mistlbacher
www.joko.at
+------------------------+
ETA2IPS Webinterface Übergabe
Version 1.000
+------------------------+
21.01.2011
Trigger Script vom Webinterface
+------------------------+
*/
include'SCR_EtaFunctions.ips.php';
$ETA_ComID = GetObjectID("ETA_COM_Port",""); //Instances ID des COM-Ports

if ($_IPS['SENDER'] == "WebFront") {
// Object einlesen
	$WebObjectArray = IPS_GetObject($_IPS['VARIABLE']);
	$StatusDerDatenabfrage = GetValueBoolean(GetObjectID("ETA/Setup/Datenabfrage"));
	//Ist die Datenabfrage deaktiviert? und die übergabe kommt von einer Monitorlist Variable, Ausnahme Logging (de)aktivieren soll immer gehen
	if (($StatusDerDatenabfrage == false) or (IPS_GetName($_IPS['VARIABLE']) == 'Graph') or (IPS_GetName($_IPS['VARIABLE']) == 'ETA Status'))
	{
	//Übergabe von Monitorliste Auswahl *** Beginn der Abfrage der einzelnen Buttons
		if (substr($WebObjectArray['ObjectInfo'],0,8) == 'ETA_MLP_')
		{
			if ($_IPS['VALUE'] == 0)
			{ //Monitor Wert Abfrage ausschalten
	      	IPS_SetScriptTimer(GetObjectID("ETA/Scripts/SCR_Datenanforderung"),0);
				SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
			//	WFC_SendNotification(GetObjectID("WebFront Original"),"Uebernahme","Befehl wurde uebernommen","Info",1);
			WFC_SendNotification(GetObjectID("WebFront Configurator"),"Uebernahme","Befehl wurde uebernommen","Info",1);
			} elseif ($_IPS['VALUE'] == 1) { //Monitor Wert Abfrage einschalten
				SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
				WFC_SendNotification(22801,'Uebernahme','Befehl wurde uebernommen','Info',0);
			}
		} elseif (IPS_GetName($_IPS['VARIABLE']) == 'Graph')
		{
			if ($_IPS['VALUE'] == 0)
			{ //Graph abschalten
				$GraphParentID = IPS_GetParent($_IPS['VARIABLE']);
				$DMName = substr(IPS_GetName($GraphParentID),0,strlen(IPS_GetName($GraphParentID))-5);
				$WertID = IPS_GetVariableIDByName($DMName,$GraphParentID);
				$DBLogStatus = enableDisableDBLogging(0,$WertID);
  				SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
				WFC_SendNotification(22801,"Uebernahme","Befehl wurde uebernommen","Information",3);
			} else { //Graph einschalten
				$GraphParentID = IPS_GetParent($_IPS['VARIABLE']);
				//$DMName = IPS_GetName($GraphParentID);
				$DMName = substr(IPS_GetName($GraphParentID),0,strlen(IPS_GetName($GraphParentID))-5);
				$WertID = IPS_GetVariableIDByName($DMName,$GraphParentID);
				$DBLogStatus = enableDisableDBLogging(1,$WertID);
  				SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
				WFC_SendNotification(22801,"Uebernahme","Befehl wurde uebernommen","Information",3);
			}
		//Datenabfrage einschalten
	 	} elseif ($_IPS['VARIABLE'] == GetObjectID("ETA/Setup/Datenabfrage"))
		{
         SetValueInteger(GetObjectID("ETA/Meldungen/Pruefsummenfehler"),0);
			IPS_RunScript(GetObjectID("ETA/Scripts/SCR_Datenanforderung"));
			WerteVerstecken();
   			//Status zurücksetzen
		} elseif ($_IPS['VARIABLE'] == GetObjectID("ETA/Setup/Einstellungen/Datenabfrage Intervall"))
		{
			SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
			//COM Port wechseln
		} elseif ($_IPS['VARIABLE'] == GetObjectID("ETA/Setup/Einstellungen/Serial Port"))
		{
      	//COMPort_SetOpen(GetObjectID("ETA_COM_Port"),false);
			//COMPort_SetPort(GetObjectID("ETA_COM_Port"),"COM".$_IPS['VALUE']);
			//COMPort_SetOpen(GetObjectID("ETA_COM_Port"),true);
			IPS_ApplyChanges(GetObjectID("ETA_COM_Port"));
			SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
		} elseif ($_IPS['VARIABLE'] == GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe"))
		{
			SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
			//Grunddaten laden
		} elseif ($_IPS['VARIABLE'] == GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten"))
		{
			IPS_RunScript(GetObjectID("ETA/Scripts/SCR_Grunddaten"));
		//ETA Alarm zurücksetzen
		} elseif ($_IPS['VARIABLE'] == GetObjectID("ETA/Meldungen/ETA Status"))
		{
			$ETA_Alarm_Bool_ID = GetObjectID("ETA/Meldungen/ETA Status");
			if (GetValueBoolean($ETA_Alarm_Bool_ID) == false) {
	      	SetValueString(GetObjectID("ETA/Meldungen/ETA Alarmmeldungen"),'');
	      	IPS_SetHidden(GetObjectID("ETA/Meldungen/ETA Alarmmeldungen"), true); //Objekt verstecken
	      	WFC_Reload(GetObjectID("WebFront Configurator"));
				SetValue($_IPS['VARIABLE'], $_IPS['VALUE']);
			}
				WFC_SendNotification(22801,"Uebernahme","Befehl wurde uebernommen","Info",5);
		} else {
			WFC_SendNotification(22801,"Info","Keine Zuordnung!","Info",3);
		}
	//Datenabfrage ist aktiv
	} else{
		//Datenabfrage ausschalten
		if ($_IPS['VARIABLE'] == GetObjectID("ETA/Setup/Datenabfrage")) {
			Datenanfodern_STOP($ETA_ComID);
			IPS_SetScriptTimer(GetObjectID("ETA/Scripts/SCR_Datenanforderung"), 0);  //daktiviert Timer
			SetValueBoolean(GetObjectID("ETA/Setup/Datenabfrage"), false);
			SetValueBoolean(GetObjectID("ETA/Variablen/Allgemein/ETA_AllowChangeSettings"), true);
		} else {
  			WFC_SendNotification(22801,"Fehler","Datenabfrage ist noch aktiv!</BR></BR>Vor dem bearbeiten der Monitorliste die Datenabfrage beenden","Error",10);
		}
	}
}
?>