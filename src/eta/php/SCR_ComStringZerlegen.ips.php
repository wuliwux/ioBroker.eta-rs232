<?
/*
+------------------------+
Joachim Mistlbacher
www.joko.at
+------------------------+
ETA2IPS COMString Zerlegen
Version 1.000
+------------------------+
21.01.2011
Diese Script empfangt die Daten die von Ofen ankommen und verarbeitet diese.
+------------------------+
*/

require 'SCR_EtaFunctions.ips.php';

$ETA_ComID = GetObjectID("ETA_COM_Port"); //Instances ID des COM-Ports
//Pruefsumme der Empfangenen Daten ueberpruefen
$COM_String = RegVar_GetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"));

$PSOK = PruefsummeTesten($COM_String);

//Variable Deklatation
$SummeDerNutzdaten = 0;

if ($PSOK == true)
{
	// ETA Fehlermeldungen
	if(substr($COM_String,0,3) == "{IM")
	{
			$ErrorText = substr($COM_String,5);
			$ErrorText = rtrim($ErrorText,"}");
	      write_error($ErrorText,1); // 2= General 1= ETA Alarm
	}


	// MonitorListe neue Zeile
	if(substr($COM_String,0,3) == "{Mb")
	{
	      //Ende der MonitorListe wurde erreicht
	      if(ord($COM_String{3}) == 0 AND ord($COM_String{4}) == 0) {
	         ParameterHolenSTOPP($ETA_ComID);
	         SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID"), 0);
	      	write_error("Monitorliste wurde erstellt.",3);
				SetValueBoolean(GetObjectID("ETA/Setup/Datenabfrage"),false);
				SetValueInteger(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/ETA_Grunddaten_Status"),3);
				IPS_RunScript(GetObjectID("ETA/Scripts/SCR_Grunddaten"));
	      }  else {
	            SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID"), GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID"))+1);
	            $xml = simplexml_load_file('Monitorliste.xml');
	            $Row = $xml->addChild('MonitorRow');
					//ID erstellen, und nullen vorne anhängen
					if (strlen(GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID"))) == 1) {
	            	$Row->addChild('ID', "00" . GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID")));
	            } else if (strlen(GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID"))) == 2) {
	            	$Row->addChild('ID', "0" . GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID")));
					} else if (strlen(GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID"))) == 3) {
						$Row->addChild('ID', GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID")));
					}
	            $Row->addChild('Knoten', ord($COM_String{5}));
	            $Row->addChild('HByte', ord($COM_String{6}));
	            $Row->addChild('LByte', ord($COM_String{7}));
	            $Row->addChild('Ueberschrift', ord($COM_String{8}));
	            $Row->addChild('Datentype', ord($COM_String{9}));
	            $Row->addChild('Unknown11', ord($COM_String{10}));
	            $Row->addChild('Unknown12', ord($COM_String{11}));
	            $Row->addChild('Teiler', ord($COM_String{12}));
	            $Row->addChild('IndexEbene', ord($COM_String{13}));

	            $RowName = substr($COM_String,14,33);
	            $RowName = rtrim($RowName,"}");
	            $RowName = rtrim($RowName);
	            $RowName = str_replace(" ", "_", $RowName);
	            $Row->addChild('Name', utf8_encode($RowName));
	            $xml->asXML('Monitorliste.xml');
					write_error("Neuer Wert: ID: ".GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorListeID"))." Name: ".$RowName ,3);
	            MonitorListe_weiterenParameterHolen($ETA_ComID);
	      	}
	}


	// ParameterListe XML neue Zeile
	if(substr($COM_String,0,3) == "{Mg")
	{
	      //Ende der ParameterListe wurde erreicht
	      if(ord($COM_String{3}) == 0 AND ord($COM_String{4}) == 0)
			{
	         ParameterHolenSTOPP($ETA_ComID);
	         SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterListeID"), 0);
	      	write_error("Parameter Liste wurde erstellt.",3);
				SetValueBoolean(GetObjectID("ETA/Setup/Datenabfrage"),false);
				SetValueInteger(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten Status"),4);
				IPS_RunScript(GetObjectID("ETA/Scripts/SCR_Grunddaten"));
	      }  else {
	             SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterListeID"), GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterListeID"))+1);
	            $xml = simplexml_load_file('ParameterListe.xml');
	            $Row = $xml->addChild('ParameterListRow');
	            $Row->addChild('ID', GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterListeID")));
	            $Row->addChild('Knoten', ord($COM_String{5}));
	            $Row->addChild('Index_HByte', ord($COM_String{6}));
	            $Row->addChild('Index_LByte', ord($COM_String{7}));
	            $Row->addChild('Datentyp', ord($COM_String{8}));
	            $Row->addChild('Einheit', ord($COM_String{9}));
	            $Row->addChild('UN9', ord($COM_String{10}));
	            $Row->addChild('UN10', ord($COM_String{11}));
	            $Row->addChild('Teiler', ord($COM_String{12}));
	            $Row->addChild('min_Wert_HByte', ord($COM_String{13}));
	            $Row->addChild('min_Wert_LByte', ord($COM_String{14}));
	            $Row->addChild('max_Wert_HByte', ord($COM_String{15}));
	            $Row->addChild('max_Wert_LByte', ord($COM_String{16}));
	            $Row->addChild('std_Wert_HByte', ord($COM_String{17}));
	            $Row->addChild('std_Wert_LByte', ord($COM_String{18}));
	            $Row->addChild('akt_Wert_HByte', ord($COM_String{19}));
	            $Row->addChild('akt_Wert_LByte', ord($COM_String{20}));
	            $Row->addChild('Ebene', ord($COM_String{21}));

	            $RowName = rtrim(substr($COM_String,22,42));
	            $RowName = rtrim($RowName,"}");
	            $RowName = rtrim($RowName);
	            $RowName = str_replace(" ", "_", $RowName);
	            $Row->addChild('Name', utf8_encode($RowName));
	            $xml->asXML('ParameterListe.xml');
	            write_error("Parameter Liste LOG: ".$RowName,3);
	         Parameter_Liste_weiterenParameterHolen($ETA_ComID);
	      }
	}

	// Paramenter Index Liste weiteren Wert holen
	if(substr($COM_String,0,3) == "{Mi") {

	      //Ende der ParamenterListe wurde erreicht
	      if(ord($COM_String{3}) == 0 AND ord($COM_String{4}) == 0) {
	         ParameterHolenSTOPP($ETA_ComID);
	         SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterIndexListeID"),0);
	         write_error("Parameter Index Liste fertig geladen.",3);
  				SetValueInteger(GetObjectID("ETA/Setup/Grunddaten laden oder zuruecksetzen/Grunddaten Status"),5);
				IPS_RunScript(GetObjectID("ETA/Scripts/SCR_Grunddaten"));
	      }  else {
	             SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterIndexListeID"), GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterIndexListeID"))+1);

	            $xml = simplexml_load_file('ParameterIndexListe.xml');
	            $Row = $xml->addChild('ParameterListIndexRow');
	            $Row->addChild('ID', GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/ParameterIndexListeID")));
	            $Row->addChild('Knoten', ord($COM_String{5}));
	            $Row->addChild('HByte', ord($COM_String{6}));
	            $Row->addChild('LByte', ord($COM_String{7}));
	            $RowName = rtrim(substr($COM_String,8,42));
	            $RowName = rtrim($RowName,"}");
	            $RowName = rtrim($RowName);
	            $RowName = str_replace(" ", "_", $RowName);
	            $RowName = ltrim($RowName,"_");
	            $RowName = rtrim($RowName);
	            $Row->addChild('Name', utf8_encode($RowName));
	            $xml->asXML('ParameterIndexListe.xml');
	            write_error("Parameter Index Liste LOG: ".$RowName,3);
	         Parameter_Index_Liste_weiterenParameterHolen($ETA_ComID);
	      }
	}

			 //Aktuelle Werte vom Ofen
			if (GetValueBoolean(GetObjectID("ETA/Setup/Datenabfrage")) == true)

      		if(substr($COM_String,0,3) == "{MK")
				{  //Einstellwerte
               $Node = ord($COM_String{5});
				 	$Index = 256 * ord($COM_String{6}) + ord($COM_String{7});
					$Value = 256 * ord($COM_String{8}) + ord($COM_String{9});
			  		//$Index = sprintf("%03s", $Index); // Auf 3 Stellen auffuellen mit Nullen
				  	IPS_LogMessage("Heizung Knoten Nr.: $Node"," Index = : $Index "." Wert = : $Value ");
				  	//IPS_LogMessage($_IPS['SELF'], "Heizung Setwert Nr.: $Index"." Wert = : $Value ");
     			}


	 {

			if (substr($COM_String,0,3) == "{MD"){
			ETA_ParameterAuswahlAnalyse(); //neu
			   $tempBlockName = "ETA_MLP_". GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorList_ParameterBlockZaehler"));
				$Anzahl = count($$tempBlockName);
			    for ($i=01; $i<=$Anzahl; $i++){
					$Knoten = ord($COM_String{$i*5});
			      $Index = ord($COM_String{$i*5+2}); //LByte
			      $Wert = 256 * ord($COM_String{$i*5+3}) + ord($COM_String{$i*5+4});
			      $VarID = intval(MonitorXMLAuslesen(4, 0,$Knoten,$Index));
					$IPSVar = MonitorXMLAuslesen(5, 0,$Knoten,$Index);   //Bezeichnung der IPS Variable
			      if($Wert >= 30000) {                 //Temperatur unter 0 C ?
			        $Wert = $Wert - 65536;
			      }
			      //->Teiler aus XML File
			      $tempTeiler = MonitorXMLAuslesen(3, 0,$Knoten,$Index);
			      if ((!$tempTeiler == 0) and (!$Wert == 0)) // sonst DIV durch 0 fehler
			      {
			      $Wert = $Wert / $tempTeiler;
			      }
			//Erstellt fuer einen empfangen Wert eine neue Variable
			// Temperatur (176)
					if ((MonitorXMLAuslesen(8,$VarID,0,0) == 176) and (stristr(MonitorXMLAuslesen(6,$VarID,0,0),"Raum") != false)){ //Temperatur Variable, fuer Räume
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"~Temperature",false,true,false,$VarID);
					} elseif ((MonitorXMLAuslesen(8,$VarID,0,0) == 176) and (stristr(MonitorXMLAuslesen(6,$VarID,0,0),"Abgas") != false)){ //Temperatur Variable, Abgas
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Temperature.Abgas",false,true,false,$VarID);
					} elseif ((MonitorXMLAuslesen(8,$VarID,0,0) == 176) and (stristr(MonitorXMLAuslesen(6,$VarID,0,0),"Kessel") != false)){ //Temperatur Variable, 10 ° bis 100°, z.B Kessel
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Temperature.10bis100",false,true,false,$VarID);
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 176){ //Temperatur Variable, Normal
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"~Temperature",false,true,false,$VarID);
			// Prozent (37)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 37){ // % Variable, unterscheidung zw. normal Prozent und Restsauerstoff
						if (MonitorXMLAuslesen(5, 0,$Knoten,$Index) == "Restsauerstoff")
					   {
					      $IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Restsauerstoff.Prozent",false,true,false,$VarID);
					   } else {
							$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Prozent",false,true,false,$VarID);
					   }

			//Tonnen (116)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 116){
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Tonnen",false,true,false,$VarID);
			//Zahl (32)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 32){
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Zahl",false,true,false,$VarID);
			// Dehzahl (85)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 85){
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Drehzahl",false,true,false,$VarID);
			// Strom (65)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 65){
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Strom",false,true,false,$VarID);
			// Spannung (86)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 86){
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Spannung",false,true,false,$VarID);
			// Stunden (104)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 104){
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Stunden",false,true,false,$VarID);
			// Minuten (109)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 109){
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Minuten",false,true,false,$VarID);
			// Sekunden (115)
					} elseif (MonitorXMLAuslesen(8,$VarID,0,0) == 115){
						$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Sekunden",false,true,false,$VarID);
			//TextVariablen erstellen
					} elseif ((MonitorXMLAuslesen(9,$VarID,null,null) == 0) and (MonitorXMLAuslesen(7,$VarID,null,null) != 255)){
						 	$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),0,false,true,true,$VarID);
							//Variablen Profile auf Basis des Monitor List Wertes erstellen. Dort steht der Startwert der IndexListe
	                  $VarProfileName = "ETA.ParIndex_".ParameterIndexXMLAuslesen(1,$Knoten,MonitorXMLAuslesen(8,$VarID,0,0));
							createVariablenProfile($VarProfileName,2,"","",0,10,0,0,"Information");
							IPS_SetVariableCustomProfile($IPSNewVarID,$VarProfileName);
							// Grundwert in das Variablen Profile schreiben
							$IndexName = ParameterIndexXMLAuslesen(2,$Knoten,MonitorXMLAuslesen(8,$VarID,0,0));
							IPS_SetVariableProfileAssociation($VarProfileName,0,$IndexName,"",0x0000FF);
							//Aktuellen Wert in das Variablen Profile schreiben
							$IndexName = ParameterIndexXMLAuslesen(2,$Knoten,MonitorXMLAuslesen(8,$VarID,0,0)+$Wert);
							IPS_SetVariableProfileAssociation($VarProfileName,$Wert,$IndexName,"",0x0000FF);
			// Keine Zuordnung
					} else {
						 	$IPSNewVarID = CheckCreateNewObject($IPSVar,2,2,GetObjectID("ETA/Variablen/Aktuelle Werte"),"ETA.Main.Text",false,true,false,null);
					}

		//uebergabe der Werte an die ensprechende IPS Variable
					//ueberschreiben des Restsauerstoffwertes. Minus Werte sind immer Null
					if (MonitorXMLAuslesen(5, 0,$Knoten,$Index) == "Restsauerstoff")
					{
						If ($Wert < 0) {
							//SetValueFloat($IPSVar, 0);
							SetValueFloat($IPSNewVarID,0);
						} else {
							//SetValueFloat($IPSVar, $Wert);
							SetValueFloat($IPSNewVarID,$Wert);
						}
					//Alle anderen Werte
					} else {
						//SetValueFloat($IPSVar, $Wert);
						SetValueFloat($IPSNewVarID,$Wert);
					}
					//Live view
					if (GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/liveview_int")) >20)
					{
						SetValueString(GetObjectID("ETA/Meldungen/Live Daten"),"");
						SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/liveview_int"),0);
					}
					SetValueString(GetObjectID("ETA/Meldungen/Live Daten"),GetValueString(GetObjectID("ETA/Meldungen/Live Daten")).date("j M Y G:i:s").": ".$IPSVar.": ". $Wert."<BR/>");
					SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/liveview_int"),GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/liveview_int"))+1);
					//Wert Objekt einblenden, nicht aber die uebersichts Variablen
					if ((MonitorXMLAuslesen(9,$VarID,null,null) == 0) and (MonitorXMLAuslesen(7,$VarID,null,null) != 255)){
					} else {
						IPS_SetHidden(GetObjectID("ETA/Variablen/Aktuelle Werte/".$IPSVar." Wert"), false);
					}
			    }
			      Datenanfodern_STOP($ETA_ComID); //StopZeichen Senden -> Block x durchgelaufen
			      if (GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorList_ParameterBlockZaehler")) < $ParameterBlockAnzahl) {
			         SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorList_ParameterBlockZaehler"),GetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorList_ParameterBlockZaehler")) + 1); //Zähler um eins erhöhen
			         //Start Bytes zusammenbauen und an COM uebergeben
			         IPS_SetScriptTimer(GetObjectID("ETA/Scripts/SCR_Datenanforderung"), $BlockIntervallTimer);  //fuert das Datenanforderungs SCript nach x sekunden aus
			       } else {
			         SetValueInteger(GetObjectID("ETA/Variablen/Allgemein/MonitorList_ParameterBlockZaehler"),0); //Zähler auf 0 setzen, damit wird wieder beim Block 1 begonnen
			         IPS_SetScriptTimer(GetObjectID("ETA/Scripts/SCR_Datenanforderung"), $BlockIntervallTimer);  //fuert das Datenanforderungs Script nach x sekunden aus
			       }
			} else {
		//		   write_error("Warning: Empfange Daten vom Ofen, obwohl die Abfrage ausgeschalten ist",1); // 2= General 1= ETA Alarm
		//			SetValueBoolean(GetObjectID("ETA/Meldungen/ETA Status"),false);
			}
	}
} else {
	SetValueInteger(GetObjectID("ETA/Meldungen/Pruefsummenfehler"),GetValueInteger(GetObjectID("ETA/Meldungen/Pruefsummenfehler"))+1);
	SetValueString(GetObjectID("ETA/Meldungen/Live Daten"),GetValueString(GetObjectID("ETA/Meldungen/Live Daten")).date("j M Y G:i:s").": Pruefsummen Fehler!"."<BR/>");
	WertNochmalAnfragen($ETA_ComID);
}




?>
