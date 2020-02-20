<?
/*
+------------------------+
Joachim Mistlbacher
www.joko.at
+------------------------+
ETA2IPS Cutter
Version 1.000
+------------------------+
21.01.2011
Da der IPS Cutter nicht den Umfang mitbringt die ETA Datensuetze korrekt zu behandeln, musste ein neuer Cutter her.
+------------------------+
*/


require 'SCR_EtaFunctions.ips.php';

// Prueft ob der Datensatz im Buffer vollstaendig ist.
function DatensatzVollstaendig()
{
	//Anzahl der NutzdatenBytes + 6 Bytes fuer Start, Pruefsumme, Endzeichen usw..
	$NutzdatenTemp = (int)(ord(substr(RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer")),3,1)))+6;
	if ($NutzdatenTemp == strlen(RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"))))
	{
		return true;
	}
	 else
 	{
		return false;
	}
}

//Buffer Timeout, Buffer wird geleert.
if($_IPS['SENDER'] == "TimerEvent")
{
	// loesche Buffer
	RegVar_SetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"),"");
	IPS_SetScriptTimer($_IPS['SELF'],0);
	echo "Buffer Timeout";
} else {
	$ETA_ComID = GetObjectID("ETA_COM_Port"); //Instances ID des COM-Ports
	$COM_String = RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_COM_RegisterVariable"));
 	$COM_String .= @$_IPS['VALUE'];
 	//echo "$COM_String";
 	//IPS_LogMessage(" SCR_Cutter1 "," $COM_String ");
	if (strlen(RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"))) == 0)
		{
		   //echo "Puffer leer";
			RegVar_SetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"),$COM_String); //Buffer ist leer, neue Daten einfuegen
		} else { //Ueberpruefung des neuen Daten Blocks
			if (substr(RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer")),0,1) == "{") //Wurde ein StartZeichen gefunden?
			{
			//echo "Startzeichen";
				// Ist der Buffer laenger wie 3 Bytes?
				   if (strlen(RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"))) > 3)
				   {
                  //echo "Pufferlaenge";
						//Wurde der gesamte Datensatz uebertragen?
				      if (DatensatzVollstaendig() == true)
				      {
							//echo "Datensatz vollstaendig";
							// Datensatz vollstaendig
						} else {
						   //echo "Datensatz unvollstaendig";
							// Datensatz unvollstaendig
							RegVar_SetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"),RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer")).$COM_String); //Weitere Daten in Buffer einfuegen
						}
				   } else { // Buffer ist zu kurz fuer gueltigen Datensatz
				      //echo "Puffer zu kurz";
	               RegVar_SetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"),RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer")).$COM_String); //Weitere Daten in Buffer einfuegen
				   }
			} else { //Loesche Buffer = fehlerhafte Daten
				RegVar_SetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"),"");
				//echo "loesche Puffer";
				IPS_LogMessage(" SCR_Cutter "," fehlerhaft = :$ETA_ComID ");
			}
		}
	      if (DatensatzVollstaendig() == true)
	      {
				// Datensatz vollstaendig
				IPS_RunScriptWait(GetObjectID("ETA/Scripts/SCR_ComStringZerlegen"));
				//echo "Run script SCR_ComStringZerlegen";
				// loesche Buffer
				RegVar_SetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"),"");
			} else {
				IPS_SetScriptTimer($_IPS['SELF'],5);
			}
}

?>