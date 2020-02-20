<?
/*
+------------------------+
Joachim Mistlbacher
www.joko.at
+------------------------+
ETA2IPS Functions
Version 1.000
+------------------------+
21.01.2011
Alle Funktionen
+------------------------+
*/

//Variablen deklaration

 set_time_limit(80);
   $ETA_MLP='';
	$ETA_MLP_0='';
	$ETA_MLP_1='';
	$ETA_MLP_2='';
	$ETA_MLP_3='';
	$ETA_MLP_4='';
	$ETA_MLP_5='';
   $Intervall='';
	$HighByte='';
	$Anzahl='';
	$ParameterBlockAnzahl='';
     

$BlockIntervallTimer = GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Datenabfrage Intervall")); // Alle X Sekunden wird der Parameter Block rotiert
$Intervall = 200;  // (60)Intervall der ankommenden Daten, nicht ändern da bei dieser Version das anders abgearbeitet wird, 60 sek ist ein optimaler Wert
// Dieser Wert wird an den Ofen gesendet und gibt das Intervall an, wieoft (Zeitabstand) der Ofen die angefoderten Werte schicken soll, nicht ändern!
//$Anzahl =20;  // Anzahl der Auszulesenden Parameter [Wert: 1-20] Bezieht sich immer auf alle Parameter Blöcke
//Parameter als ID !! nachzugucken im XML File (derzeit)
//Die Steuerung erlaubt nur max. 20 Abfragen !!!

//Wieviele MonitorListen Blöcke sind vorhanden? Ein Block hat 20 Parameter
//Max. 6 Blöcke (Durchlaufzeit 60 Sekunden, 10 Sek Pro Block[siehe ->$BlockIntervallTimer])
$HighByte = 0; //normalerweise immer 0 , sollte nicht geändert werden


//Liefert die gesuchte Kategorie ID zurück, Bsp. des Übergabewertes: "ETA/Variablen/Allgemein"

function GetObjectID($ObjectsString)
	{
		$TempParentID = 0;
		$ObjectArray = explode("/", $ObjectsString);
		foreach($ObjectArray as $TempObjectID)
		{
		    $TempParentID = IPS_GetObjectIDByName($TempObjectID,$TempParentID);
		}
	return $TempParentID;
	}

// Liefert alle child ObjectIDs eines parents rekursiv
function GetObjectList($parent) {
    $ids = IPS_GetChildrenIDs($parent);
    foreach($ids as $id)
    {
        $ids = array_merge($ids, GetObjectList($id));
    }
    return $ids;
}


// Einen weiteren Monitor Parameter schicken lassen
function MonitorListe_weiterenParameterHolen($ETA_ComID)
   {
      $MonitorListeWeiter ="{MA";
      
      If (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 0) {
      	$MonitorListeWeiterBytes = chr(02) . chr(02) . chr(01) . chr(01); //Standard
      } else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 1) {
      	$MonitorListeWeiterBytes = chr(02) . chr(03) . chr(01) . chr(02);  //Service
      } else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 2) {
      	$MonitorListeWeiterBytes = chr(02) . chr(04) . chr(01) . chr(03);  //Profi
      } else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 3) {
      	$MonitorListeWeiterBytes = chr(02) . chr(05) . chr(01) . chr(04);  //Expert
		}
		$MonitorListeEndZeichen = "}";
      //Zusammensetzen
		$Daten = $MonitorListeWeiter . $MonitorListeWeiterBytes . $MonitorListeEndZeichen;
      //ComPort_SendText($ETA_ComID, $Daten);
      CSCK_SendText($ETA_ComID, $Daten);
   }
   
// Einen weiteren Parameter schicken lassen (MF)
function Parameter_Liste_weiterenParameterHolen($ETA_ComID)
   {
         $ParameterListeStart ="{MF";

			If (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 0) {
         	$ParameterListeStartBytes = chr(02) . chr(02) . chr(01) . chr(01); //Standard
	      } else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 1) {
           	$ParameterListeStartBytes = chr(02) . chr(03) . chr(01) . chr(02); //Service
         } else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 2) {
			  	$ParameterListeStartBytes = chr(02) . chr(04) . chr(01) . chr(03); //Profi
         } else if (GetValueInteger(GetObjectID("ETA/Setup/Einstellungen/Berechtigungs Stufe")) == 3) {
  			  	$ParameterListeStartBytes = chr(02) . chr(05) . chr(01) . chr(04); //Expert
			}
           $ParameterListeEndZeichen = "}";
            //Zusammensetzen
            $Daten = $ParameterListeStart . $ParameterListeStartBytes . $ParameterListeEndZeichen;
            //ComPort_SendText($ETA_ComID, $Daten);
            CSCK_SendText($ETA_ComID, $Daten);
   }
   

// Einen weiteren Parameter schicken lassen (Mi)
function Parameter_Index_Liste_weiterenParameterHolen($ETA_ComID)
   {
         $ParameterListeIndexStart ="{MH";
  			$ParameterListeIndexStartBytes = chr(01) . chr(01) . chr(01);
         $ParameterListeIndexEndZeichen = "}";
         //Zusammensetzen
         $Daten = $ParameterListeIndexStart . $ParameterListeIndexStartBytes . $ParameterListeIndexEndZeichen;
         //ComPort_SendText($ETA_ComID, $Daten);
         CSCK_SendText($ETA_ComID, $Daten);
   }

  // End Signal zum Ofen, Keine Parameter Zeile mehr schicken (Monitor List (XML), ParameterList, ParameterIndex)
 function ParameterHolenSTOPP($ETA_ComID)
   {
      $ParameterListeEnde = "{MO";
      $ParameterListeEndeBytes = chr(01) . chr(01);
      $ParameterListeEndZeichen = "}";
      //Zusammensetzen
      $Daten = $ParameterListeEnde . $ParameterListeEndeBytes . $ParameterListeEndZeichen;
      //ComPort_SendText($ETA_ComID, $Daten);
      CSCK_SendText($ETA_ComID, $Daten);
   }

//Ende der Datenaufzeichnung, STOPP für den Ofen
   function Datenanfodern_STOP($ETA_ComID)
      {
      $Daten ="{ME";                //Startzeichen und Servicekennung
      $Daten .= chr(0);             //Anzahl der Nutzdatenbytes
      $Daten .= chr(0);             //Prfsumme
      $Daten .= "}";                //Stoppzeichen
      IPS_Sleep(100);
      //ComPort_SendText($ETA_ComID, $Daten);
      CSCK_SendText($ETA_ComID, $Daten);
      IPS_Sleep(100);
     }

 //START für den Ofen daten zu schicken, abhängig vom derzeitigen Parameter Block
 function Datenanfordern_START($ETA_ComID,$BlockID)
 {
 //Variable Deklatation
   global $ETA_MLP, $ETA_MLP_0, $ETA_MLP_1, $ETA_MLP_2, $ETA_MLP_3, $ETA_MLP_4, $ETA_MLP_5;
   global $Intervall,$HighByte,$Anzahl;
   $TempDaten = '';
   $TempPS = 0;
   $tempBlockName = "ETA_MLP_". $BlockID;
   $Anzahl = count($$tempBlockName);
   //Daten Bauen
   $Daten ="{MC";                  //Startzeichen und Servicekennung
   $Daten .= chr(1+($Anzahl*3));   //Anzahl der Nutzdatenbytes ( RefreshTime + Anzahl * 3 byte)
	$PS = $Intervall;
   $RealBlockNameArray = $$tempBlockName;
   for ($i=0; $i<$Anzahl; $i++)   //Die n Anzahl Parameter
        {
			$TempDaten .= chr((int)MonitorXMLAuslesen(1, $RealBlockNameArray[$i],0,0)) . chr((int)$HighByte) . chr((int)MonitorXMLAuslesen(2, $RealBlockNameArray[$i],0,0));   //...jeweils 3 byte
		  //Pruefsumme
        $TempPS = $TempPS +  MonitorXMLAuslesen(1, $RealBlockNameArray[$i],0,0) + MonitorXMLAuslesen(2, $RealBlockNameArray[$i],0,0);
        }
      $PS = $PS + $TempPS;
      $PS = $PS%256; //Modulo 256
      $Daten .= chr($PS);
      $Daten .= chr($Intervall);
      $Daten .= $TempDaten;
      $Daten .= "}";

		// Cutter Buffer leeren
		RegVar_SetBuffer(GetObjectID("ETA/Variablen/Allgemein/ETA_DatenString_Buffer"),"");

   //Daten an Comport senden
    //ComPort_SendText($ETA_ComID, $Daten);
    CSCK_SendText($ETA_ComID, $Daten);
    echo $Daten;
 }

//Auslesen des MonitorXML Files
   function MonitorXMLAuslesen($SuchType, $ML_ID, $Knoten, $LByte)
   {
    //SuchType
    // 1 = ID->Knoten
    // 2 = ID->Index(LByte)
    // 3 = Knoten und Index->Teiler
    // 4 = Knoten und Index->ID
    // 5 = Knoten und Index->Name
    // 6 = ID->Name
    // 7 = ID->Ueberschrift
    // 8 = ID->Datentype
    // 9 = ID->IndexEbene
      $xml = simplexml_load_file('Monitorliste.xml');
		if ($xml == false)
		{
  			WFC_SendNotification(GetObjectID("WebFront Configurator"),"Fehler","Monitor XML Datei wurde nicht gefunden!","Error",5);
		}else{
			if ($SuchType == 1) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->ID == $ML_ID) {
	               return utf8_decode($Row->Knoten);
	            }
	         }
	       } else if ($SuchType == 2) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->ID == $ML_ID) {
	               return utf8_decode($Row->LByte);
	            }
	         }
	       } else if ($SuchType == 3) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->Knoten == $Knoten and $Row->LByte == $LByte) {
	               return utf8_decode($Row->Teiler);
	            }
	         }
	       } else if ($SuchType == 4) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->Knoten == $Knoten and $Row->LByte == $LByte) {
	               return utf8_decode($Row->ID);
	            }
	         }
	       } else if ($SuchType == 5) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->Knoten == $Knoten and $Row->LByte == $LByte) {
	               return utf8_decode($Row->Name);
	            }
	         }
	       } else if ($SuchType == 6) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->ID == $ML_ID) {
	               return utf8_decode($Row->Name);
	            }
	         }
	       } else if ($SuchType == 7) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->ID == $ML_ID) {
	               return utf8_decode($Row->Ueberschrift);
	            }
	         }
	       } else if ($SuchType == 8) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->ID == $ML_ID) {
	               return utf8_decode($Row->Datentype);
	            }
	         }
	       } else if ($SuchType == 9) {
	         foreach ($xml->xpath('MonitorRow') as $Row) {
	            If ($Row->ID == $ML_ID) {
	               return utf8_decode($Row->IndexEbene);
	            }
	         }
	      }
	 	}
   }

  //Diese Funktion überprüft die Auswahl der Monitor Parameter und schreibt sie in die Arrays
  function ETA_ParameterAuswahlAnalyse()
  {
 
  global $ParameterBlockAnzahl;
  global $ETA_MLP, $ETA_MLP_0, $ETA_MLP_1, $ETA_MLP_2, $ETA_MLP_3, $ETA_MLP_4, $ETA_MLP_5;
   $AnalyseFehler = false;
	$vars = GetObjectList(GetObjectID("ETA/Variablen/Monitor Liste"));
//	print_r($vars);    //nummer der Variablen ausgeben
  	$ETA_MLP = array();
 //	print_r ($ETA_MLP);

	// Alle Objekte die aktiviert sind in ein Array schreiben
  foreach($vars as $var)
//  print_r($var);
  {
   $GetvarName = IPS_GetObject($var);

   if ($GetvarName['ObjectType'] == 2) //Nur ausführen wenn ObjectType eine Variable ist
	{
		$GetvarType = IPS_GetVariable($var);
//		print_r ($GetvarType);
	
		if (($GetvarType['VariableValue'] == 1) AND (substr($GetvarName['ObjectInfo'],0,8) == 'ETA_MLP_'))
	//	if (($GetvarType['VariableValue']['ValueType'] == 1) AND (substr($GetvarName['ObjectInfo'],0,8) == 'ETA_MLP_') AND ($GetvarType['VariableValue']['ValueInteger'] == 1))

		 {
			//$IDTemp = substr($GetvarName['ObjectName'],8,3);
    		$IDTemp = substr($GetvarName['ObjectInfo'],8,3);

		 	//nullen vorne entfernen
    		if ((substr($IDTemp,0,1) == 0))
			{
      		$IDTemp = substr($IDTemp,1,2);
         	if ((substr($IDTemp,0,1) == 0))
				{
            	$IDTemp = substr($IDTemp,1,1);
         	}
    		}
   // 		$array[] = $x;
		$ETA_MLP[] = $IDTemp;
	//		print_r ($ETA_MLP);
   //		array_push($ETA_MLP,$IDTemp);       //original  		$array[] = $x;
		}
	}
  }
  
    //grösse überprüfen
    if (count($ETA_MLP) == 0) {
         write_error("WARNUNG: Mindestens einen Monitor Parameter auswaehlen!", 1);
    		 $AnalyseFehler = true;
        
		  } elseif (count($ETA_MLP) > 120)  {
    	write_error("Warnung: Maximal 120 Monitor Parameter auswählen! Derzeit sind ".count($ETA_MLP)." ausgewaehlt", 1);
      $AnalyseFehler = true;
    } else {

    // Auf doppelte einträge prüfen
      $tempArray = array();
      foreach($ETA_MLP as $ETA_MLP_tempID)
      {
        $tempArray[$ETA_MLP_tempID] = MonitorXMLAuslesen(1,$ETA_MLP_tempID, 0, 0).MonitorXMLAuslesen(2,$ETA_MLP_tempID, 0, 0);
      }

      $DoppelteIDs = array_not_unique($tempArray);

      if (!count($DoppelteIDs) == 0)
      {
      //Doppelte Einträge vorhanden
       $AnalyseFehler = true;
	     write_error("Error: Abfrage kann nicht gestartet werden!",1); // 2= General 1= ETA Alarm
	     write_error("Folgende ausgewaehlte Monitor Parameter haben gleiche Zieldaten (Knoten/Index): ",1); // 2= General 1= ETA Alarm
		  SetValueBoolean(GetObjectID("ETA/Meldungen/ETA Status"),false);
         foreach (array_keys($DoppelteIDs) as $DoppelteID)
         {
	     write_error("ID: ".$DoppelteID." Name: ".MonitorXMLAuslesen(6,$DoppelteID, 0, 0),1); // 2= General 1= ETA Alarm
         }
      } else {
      //keine doppelte Einträge vorhanden
       $AnalyseFehler = false;
 //Bloecke Arrays befüllen
     $ETA_MLP_0 = array();
      //Block1 Array befüllen
         for($count = 1; ($count <= count($ETA_MLP)) and ($count <= 20); $count++)
            {
               array_push($ETA_MLP_0,$ETA_MLP[$count-1]);
            }
      //Block2 Array befüllen
       if (count($ETA_MLP) > 20) {
       $ETA_MLP_1 = array();
       $ParameterBlockAnzahl = $ParameterBlockAnzahl +1;
         for($count = 21; ($count <= count($ETA_MLP)) and ($count <= 40); $count++)
            {
               array_push($ETA_MLP_1,$ETA_MLP[$count-1]);
            }
      }
     //Block3 Array befüllen
       if (count($ETA_MLP) > 40) {
       $ParameterBlockAnzahl = $ParameterBlockAnzahl +1;
       $ETA_MLP_2 = array();
         for($count = 41; ($count <= count($ETA_MLP)) and ($count <= 60); $count++)
            {
               array_push($ETA_MLP_2,$ETA_MLP[$count-1]);
            }
      }
     //Block4 Array befüllen
       if (count($ETA_MLP) > 60) {
       $ParameterBlockAnzahl = $ParameterBlockAnzahl +1;
       $ETA_MLP_3 = array();
         for($count = 61; ($count <= count($ETA_MLP)) and ($count <= 80); $count++)
            {
               array_push($ETA_MLP_3,$ETA_MLP[$count-1]);
            }
      }
     //Block5 Array befüllen
       if (count($ETA_MLP) > 80) {
       $ParameterBlockAnzahl = $ParameterBlockAnzahl +1;
       $ETA_MLP_4 = array();
         for($count = 81; ($count <= count($ETA_MLP)) and ($count <= 100); $count++)
            {
               array_push($ETA_MLP_4,$ETA_MLP[$count-1]);
            }
      }
     //Block6 Array befüllen
       if (count($ETA_MLP) > 100) {
       $ParameterBlockAnzahl = $ParameterBlockAnzahl +1;
       $ETA_MLP_5 = array();
         for($count = 101; ($count <= count($ETA_MLP)) and ($count <= 120); $count++)
            {
               array_push($ETA_MLP_5,$ETA_MLP[$count-1]);
            }
       }
    }
    }
    return $AnalyseFehler;
  //  print $AnalyseFehler;
  }



//Überprüft ein array auf doppelte Einträge und gibt ein array zurück
function array_not_unique($raw_array) {
    $dupes = array();
    natcasesort($raw_array);
    reset ($raw_array);

    $old_key    = NULL;
    $old_value    = NULL;
    foreach ($raw_array as $key => $value) {
        if ($value === NULL) { continue; }
        if ($old_value == $value) {
            $dupes[$old_key]    = $old_value;
            $dupes[$key]        = $value;
        }
        $old_value    = $value;
        $old_key    = $key;
    }
return $dupes;
}
//Diese Function schreibt die Error logs für das Webfrontend
function write_error($Meldung, $Type)
{
   if ($Type == 1) { // ETA Alarm
       SetValueString(GetObjectID("ETA/Meldungen/ETA Alarmmeldungen"),GetValueString(GetObjectID("ETA/Meldungen/ETA Alarmmeldungen")) .date("Y.m.d, H:i:s"). " " .$Meldung ."</BR>");
       SetValueBoolean(GetObjectID("ETA/Meldungen/ETA Status"),false);
	   	IPS_SetHidden(GetObjectID("ETA/Meldungen/ETA Alarmmeldungen"), false); //Objekt verstecken
//	   	WFC_Reload(GetObjectID("WebFront Configurator"));
       }
   if ($Type == 2) { //General Alarm
       SetValueString(GetObjectID("Allgemein/Variablen/IPS Alarm"),GetValueString(GetObjectID("Allgemein/Variablen/IPS Alarm")) .date("Y.m.d, H:i:s"). " " .$Meldung ."</BR>");
         SetValueBoolean(GetObjectID("Allgemein/Variablen/IPS_Alarm_Bool"),true);
      }
   if ($Type == 3) { //Setup Log
		 SetValueString(GetObjectID("ETA/Setup/Setup_log"),GetValueString(GetObjectID("ETA/Setup/Setup_log")) .date("Y.m.d, H:i:s"). " " . $Meldung ."</BR>");
      }
}




//Erstellt Variablen Profile
function createVariablenProfile($VarProfileName,$VarProfileType,$Profilename_Prefix,$Profilename_Suffix,$PMin,$PMax,$PSchritt,$PNachkommastellen,$PIcon)
{
IPS_CreateVariableProfile($VarProfileName,$VarProfileType);
IPS_SetVariableProfileText($VarProfileName,$Profilename_Prefix,$Profilename_Suffix);
IPS_SetVariableProfileValues($VarProfileName,$PMin,$PMax,$PSchritt);
IPS_SetVariableProfileDigits($VarProfileName,$PNachkommastellen);
IPS_SetVariableProfileIcon($VarProfileName,$PIcon);
return $VarProfileName;
}

function createVariablenProfileParameterListe($VarProfileName,$VarProfileType,$Profilename_Prefix,$Profilename_Suffix,$PMin,$PMax,$PSchritt,$PNachkommastellen,$PIcon)
{

IPS_CreateVariableProfile($VarProfileName,$VarProfileType);
IPS_SetVariableProfileText($VarProfileName,$Profilename_Prefix,$Profilename_Suffix);
IPS_SetVariableProfileValues($VarProfileName,$PMin,$PMax,$PSchritt);
IPS_SetVariableProfileDigits($VarProfileName,$PNachkommastellen);
IPS_SetVariableProfileIcon($VarProfileName,$PIcon);
}

function KategorieErstellen($KategorieName,$ParentID)
{
	$CatID = IPS_CreateCategory();       // Kategorie anlegen
	IPS_SetName ($CatID, $KategorieName); //Name festlegen
	IPS_SetParent($CatID,$ParentID); // in parent ID verschieben
	return $CatID;
}


//Erstellt/löscht DB Logs einer/aller Variablen
//$status 0 = deaktiviert ein Log einer Variable
//$status 1 = erstelt/aktiviert ein Log einer Variable
//VarID = IPSID der Variable
function enableDisableDBLogging($newstatus,$varID)
{
$CurLogStatus = AC_GetLoggingStatus(GetObjectID("Archive"),$varID);
//deaktivieren
	if ($newstatus == 0)
		{
		   if ($CurLogStatus == 1)
		   {
			  AC_SetLoggingStatus(GetObjectID("Archive"),$varID,false);
  			  IPS_ApplyChanges(GetObjectID("Archive"));
			  $LogDBStatus = 0;
			} else {
			$LogDBStatus = 1;
			}
  //aktivieren
	} elseif ($newstatus == 1) {
		   if ($CurLogStatus == 0)
		   {
			  AC_SetLoggingStatus(GetObjectID("Archive"),$varID,true);
			  IPS_ApplyChanges(GetObjectID("Archive"));

			  $LogDBStatus = 0;
			} else {
			$LogDBStatus = 1;
			}
		}
		return $LogDBStatus;
}


//
function WerteVerstecken()
//Alle Dummy Module werden bei Start der Monitorliste Abfrage versteckt.
//Werte die aktuell abgefragt werden, werden beim eintreffen wieder sichtbar geschalten (ComString_zerlegen)
{
 $All_ETA_Werte_DummyModule_IDs = IPS_GetChildrenIDs(GetObjectID("ETA/Variablen/Aktuelle Werte"));
 foreach($All_ETA_Werte_DummyModule_IDs as $All_ETA_Werte_DummyModule_ID)
 {
   IPS_SetHidden($All_ETA_Werte_DummyModule_ID, true);
 }
}

function PruefsummeTesten($AlleDaten)
 {
	 	$SummeDerNutzdaten = 0;
     	$NutzdatenAnzahl =  @ord($AlleDaten{3});
      $EmpfangenePruefsumme = @ord($AlleDaten{4});
      // Summe der Nutzdaten
      for($i=5; $i <= $NutzdatenAnzahl+4; $i++) {
         $SummeDerNutzdaten = $SummeDerNutzdaten + ord($AlleDaten{$i});
      }
      $ErrechnetePruefsumme = $SummeDerNutzdaten%256;
		if($EmpfangenePruefsumme == $ErrechnetePruefsumme) {
			$PS = true;
          return $PS;
		} else {
			$PS = false;
          return $PS;
		}
}
//Wenn prüfsumme ungültig, wert nochmal anfragen
function WertNochmalAnfragen($ETA_ComID)
{
      $StringEnde = "{MR";
      $StringEndeBytes = chr(00) . chr(00);
      $StringEndZeichen = "}";
      //Zusammensetzen
      $Daten = $StringEnde . $StringEndeBytes . $StringEndZeichen;
      write_error("Wert Nochmal angefordert (Pruefsummen Error).",3);
      //ComPort_SendText($ETA_ComID, $Daten);
      CSCK_SendText($ETA_ComID, $Daten);
}




//Löscht nicht mehr vorhandene Variablen aus dem Archive Handler
function deleteOldVarsFromArchiveHandler()
{
	foreach (AC_GetAggregationVariables(GetObjectID("Archive"),false) as $AC_archiv){
		$VarID = $AC_archiv['VariableID'];
		$VarExist = @IPS_GetVariable($VarID);
		if ($VarExist == false)
		{
			AC_DeleteVariableData(GetObjectID("Archive"),$VarID,0,0);
		}
	}
}

//Löscht Variablen Profile
//0 = löscht alle ETA.Main. Profiles
//1 = löscht alle ETA.ParIndex. Profiles
function deleteOldVarProfiles($ProfileTypeToDelete)
{
	foreach (IPS_GetVariableProfileList() as $VarProfileName){
		if ($ProfileTypeToDelete == 0)
		{
			if (strpos($VarProfileName,"ETA.Main.") !== false)
			{
				IPS_DeleteVariableProfile($VarProfileName);
			}
		} elseif ($ProfileTypeToDelete == 1)
		{
			if (strpos($VarProfileName,"ETA.ParIndex.") !== false)
			{
				IPS_DeleteVariableProfile($VarProfileName);
			}
		}
	}
}

//Auslesen der Parameter Index Datei(XML)
   function ParameterIndexXMLAuslesen($SuchType, $Knoten, $LByte)
   {
    // 1: Konten und LByte->XML_ID
    // 2: Konten und LByte->Text
      $xml = simplexml_load_file('ParameterIndexListe.xml');
      if ($SuchType == 1) {
         foreach ($xml->xpath('ParameterListIndexRow') as $Row) {
            If ($Row->Knoten == $Knoten and $Row->LByte == $LByte) {
               return utf8_decode($Row->ID);
            }
         }
       } else if ($SuchType == 2) {
         foreach ($xml->xpath('ParameterListIndexRow') as $Row) {
            If ($Row->Knoten == $Knoten and $Row->LByte == $LByte) {
               return utf8_decode($Row->Name);
            }
         }
		 }
   }
// löscht Kategorien und Variablen unter der ParentID
// 0 = Kategorien löschen
// 1 = Instanzen löschen
// 2 = Variablen löschen
function deleteObjectsUnderParentID($ParentID, $delType)
{
	$IDsArray = GetObjectList($ParentID);
	$IDsArrayReverse = array_reverse($IDsArray); //Array umdrehen
	foreach ($IDsArrayReverse as $ObjectID)
	{
		$GetvarType = IPS_GetObject($ObjectID);
		if ($delType == 0) //lösche Kategorien
		{
      	if ($GetvarType['ObjectType'] == 0)
      	{
				IPS_DeleteCategory($ObjectID);
      	}
		} else if ($delType == 1) //lösche Instanzen
		{
	   	if ($GetvarType['ObjectType'] == 1)
	   	{
				IPS_DeleteInstance($ObjectID);
			}
		} else if ($delType == 2) //lösche Variablen
		{
	   	if ($GetvarType['ObjectType'] == 2)
	   	{
      	   IPS_DeleteVariable($ObjectID);
			}
		} else if ($delType == 6) //lösche Links
		{
	   	if ($GetvarType['ObjectType'] == 6)
	   	{
      	   IPS_DeleteLink($ObjectID);
			}
		}
	}
}



//Prüft ob ein Object bereits vorhanden ist, und erstellt ggf. ein neues Object
//**ObjectType
//0=Kategorie
//1=Instance
//2=Variable
//**Variable
//0=Boolean
//1=Integer
//2=Float
//3=String
function CheckCreateNewObject($IPSObjName,$IPSObjType,$IPSVarType,$ParentID,$ProfileName,$ObjectHidden,$DummyModul,$UebersichtVar,$XMLVarID)
{
switch ($IPSObjType)
{
	case 0: //Kategorie erstellen
		$CatID = IPS_CreateCategory();       // Kategorie anlegen
		IPS_SetName ($CatID, $IPSObjName); //Name festlegen
		IPS_SetParent($CatID,$ParentID); // in parent ID verschieben
		return $CatID;
	break;
	case 1: //Instance erstellen
			//Derzeit nicht in Verwendung
	break;
	case 2: //Variable erstellen
      $newVar = 0;
		$newDummyModulID = 0;
		$AktuelleWerteObjectsID = GetObjectList($ParentID);
		foreach ($AktuelleWerteObjectsID as $AktuellerWertObjectID)
		{
			$AktuellerWertObject = IPS_GetObject($AktuellerWertObjectID);
			if ($AktuellerWertObject['ObjectType'] == 2)
			{
				//Ist gefundene Variable gleich der gesuchten?
				if ($AktuellerWertObject['ObjectName'] == $IPSObjName)
				{
				  		$newVar = $AktuellerWertObjectID; //Gefundene Variable zurückgeben
				}
			}
		}
		if ($newVar == 0)
		//Es wurde keine Variable gefunden = neue erstellen
		{
      	if (($DummyModul == true) and ($UebersichtVar == false)) //Aktueller Wert Variable
      	{
				//Dummy Modul erstellen
				$newDummyModulID = IPS_CreateInstance("{485D0419-BE97-4548-AA9C-C083EB82E61E}");
				IPS_SetName($newDummyModulID,$IPSObjName." Wert");
				IPS_SetParent($newDummyModulID, $ParentID);
				IPS_SetPosition($newDummyModulID, $XMLVarID); //ID als Position mitgeben
				IPS_ApplyChanges($newDummyModulID);

				//Graph Variable erstellen
				$newVar = IPS_CreateVariable(0);
	      	IPS_SetName($newVar, "Graph");
	      	IPS_SetParent($newVar, $newDummyModulID);
				IPS_SetVariableCustomProfile($newVar, "~Switch");
				IPS_SetVariableCustomAction($newVar,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
				IPS_SetPosition($newVar, 1);
				IPS_ApplyCHanges($newVar);   //eingefügt

				//Original Variable erstellen
				$newVar = IPS_CreateVariable($IPSVarType);
	      	IPS_SetName($newVar, $IPSObjName);
	      	IPS_SetParent($newVar, $newDummyModulID);
	      	IPS_ApplyCHanges($newVar);       //eingefügt
	      	if ($ProfileName == "0") {
      		} else {
      		print "Profile zuordnung"." ".$newVar." ".$ProfileName;
					IPS_SetVariableCustomProfile($newVar, $ProfileName);
				}
				IPS_SetHidden($newVar, $ObjectHidden); //Objekt verstecken
      	} else if (($DummyModul == true) and ($UebersichtVar == true)) //Aktueller Wert Variable und Übersichtsvariable erstellen
      	{
				//Dummy Modul erstellen
				$newDummyModulID = IPS_CreateInstance("{485D0419-BE97-4548-AA9C-C083EB82E61E}");
				IPS_SetName($newDummyModulID,$IPSObjName." Wert");
				IPS_SetParent($newDummyModulID, $ParentID);
				IPS_ApplyChanges($newDummyModulID);

				//Original Variable erstellen
				$newVar = IPS_CreateVariable($IPSVarType);
	      	IPS_SetName($newVar, $IPSObjName);
	      	IPS_SetParent($newVar, $newDummyModulID);
	      	IPS_ApplyCHanges($newVar);   //eingefügt
	      	
	      	if ($ProfileName == "0") {
      		} else {
					IPS_SetVariableCustomProfile($newVar, $ProfileName);
				}
				IPS_SetHidden($newVar, $ObjectHidden); //Objekt verstecken
				
				//Link in der Übersichtsseite erstellen
				$LinkID = IPS_CreateLink();       //Link anlegen
				IPS_SetName($LinkID, $IPSObjName); //Link benennen
				IPS_SetLinkChildID($LinkID, $newVar);     //Link verknüpfen
	     		IPS_SetParent($LinkID, GetObjectID("ETA/Uebersicht"));
				IPS_SetPosition($LinkID, $XMLVarID); //ID als Position mitgeben
				IPS_ApplyCHanges($LinkID);   //eingefügt

      	} else {
		      $newVar = IPS_CreateVariable($IPSVarType);
	   	   IPS_SetName($newVar, $IPSObjName);
	     		IPS_SetParent($newVar, $ParentID);
	      	if ($ProfileName == "0") {
	      	} else {
	      		echo $newVar;
	      		echo $ProfileName;
					IPS_SetVariableCustomProfile($newVar, $ProfileName);
				}
				IPS_SetHidden($newVar, $ObjectHidden); //Objekt verstecken
      	}
   	}
	break;
	}
  	return $newVar; //Liefert Variablen ID zurück
}

?>