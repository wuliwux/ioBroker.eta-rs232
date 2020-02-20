  <?
/*
+------------------------+
Joachim Mistlbacher
www.joko.at
+------------------------+
ETA2IPS Setup Script
Version 1.01
+------------------------+
19.02.2012
Diese Script installiert ETA2IPS

!!! ACHTUNG DAS IST EINE BETA VERSION !!!!
+------------------------+
*/

$rootID = 0; //Ab welcher ParentID sollen die Kategorien erstellt werden? 0=IP-Symcon
define('ETA2IPS_MAJOR_Ver',1);
define('ETA2IPS_MINOR_Ver',00);

set_time_limit(550);

function GetObjectID($ObjectsString)
{
$TempParentID = 0;
$ObjectArray = explode("/", $ObjectsString);
foreach($ObjectArray as $TempObjectID){
    $TempParentID = IPS_GetObjectIDByName($TempObjectID,$TempParentID);
	}
return $TempParentID;
}

function KategorieErstellen($KategorieName,$ParentID)
{
	$CatID = IPS_CreateCategory();       // Kategorie anlegen
	IPS_SetName ($CatID, $KategorieName); //Name festlegen
	IPS_SetParent($CatID,$ParentID); // in parent ID verschieben
	return $CatID;
}

function ScriptImportieren($ScriptName,$ParentID,$ObjectHidden)
{
	$ScriptID = IPS_CreateScript(0);
	//Verknuepfen
	IPS_SetScriptFile($ScriptID, $ScriptName.".ips.php");
	IPS_SetName($ScriptID, $ScriptName);
	IPS_SetParent($ScriptID,$ParentID); // in parent ID verschieben
   IPS_SetHidden($ScriptID, $ObjectHidden); //Objekt verstecken
   return $ScriptID;
}
function CreateObject($IPSVarName,$IPSVarType,$ParentID,$ProfileName,$ObjectHidden)
{
		$newVar = 0;
      $newVar = IPS_CreateVariable($IPSVarType);
      IPS_SetName($newVar, $IPSVarName);
      IPS_SetParent($newVar, $ParentID);
      	if ($ProfileName == "0") {
      	} else {
				IPS_SetVariableCustomProfile($newVar, $ProfileName);
			}
      return $newVar;
}

function createVariablenProfile($VarProfileName,$VarProfileType,$Profilename_Prefix,$Profilename_Suffix,$PMin,$PMax,$PSchritt,$PNachkommastellen,$PIcon)
{
IPS_CreateVariableProfile($VarProfileName,$VarProfileType);
IPS_SetVariableProfileText($VarProfileName,$Profilename_Prefix,$Profilename_Suffix);
IPS_SetVariableProfileValues($VarProfileName,$PMin,$PMax,$PSchritt);
IPS_SetVariableProfileDigits($VarProfileName,$PNachkommastellen);
IPS_SetVariableProfileIcon($VarProfileName,$PIcon);
}


//Überprüfen ob ETA2IPS bereits installiert wurde. Abfrage ob eine Kategorie "ETA" existiert
$AllIDs = IPS_GetObjectList();
foreach ($AllIDs as $ObjectID){
	if (IPS_GetName($ObjectID) == "ETA") {
		$ETAinstalled = true;
		break;
	} else {
		$ETAinstalled = false;
	}
}
if ($ETAinstalled == true) {
	echo "ETA2IPS ist bereits installiert!";
}else {
   echo "ETA2IPS wird in der Version ".ETA2IPS_MAJOR_Ver.".".ETA2IPS_MINOR_Ver." installiert...</BR>";
	//Kategorien im Objektbau erstellen
	//===========|Allgemein
	$newCATID_Allgemein = KategorieErstellen("Allgemein",$rootID);
	//===============|Variablen
	$newCATID_Allgemein_Variablen = KategorieErstellen("Variablen",$newCATID_Allgemein);

	//===============|Scripts
	$newCATID_Allgemein_Scripts = KategorieErstellen("Scripts",$newCATID_Allgemein);
	//Script Objekte anlegen und verknüpfen
	ScriptImportieren("SCR_WebInterfaceUebergabe_Allgemein",$newCATID_Allgemein_Scripts,true);
	ScriptImportieren("SCR_Startup",$newCATID_Allgemein_Scripts,true);


	//===========|ETA
	$newCATID_ETA = KategorieErstellen("ETA",$rootID);
	//===============|Übersicht Dummy Modul
	$ETA_Uebersicht_DummyModulID = IPS_CreateInstance("{485D0419-BE97-4548-AA9C-C083EB82E61E}");
	IPS_SetName($ETA_Uebersicht_DummyModulID,"Uebersicht");
	IPS_SetParent($ETA_Uebersicht_DummyModulID, $newCATID_ETA);
	IPS_ApplyChanges($ETA_Uebersicht_DummyModulID);
	IPS_SetPosition($ETA_Uebersicht_DummyModulID, 0);

	//	==============|Meldungen
	$newCATID_ETA_Meldungen = KategorieErstellen("Meldungen",$newCATID_ETA);

	//===============|Setup
	$newCATID_ETA_Setup = KategorieErstellen("Setup",$newCATID_ETA);

	//===============|Scripts
	$newCATID_ETA_Scripts = KategorieErstellen("Scripts",$newCATID_ETA);
	ScriptImportieren("SCR_ComStringZerlegen",$newCATID_ETA_Scripts,true);
	ScriptImportieren("SCR_Datenanforderung",$newCATID_ETA_Scripts,true);
	ScriptImportieren("SCR_EtaFunctions",$newCATID_ETA_Scripts,true);
	ScriptImportieren("SCR_WebInterfaceUebergabe_ETA",$newCATID_ETA_Scripts,true);
	$newSCR_CutterID = ScriptImportieren("SCR_Cutter",$newCATID_ETA_Scripts,true);
	ScriptImportieren("SCR_Grunddaten",$newCATID_ETA_Scripts,true);
	//===============|Variablen
	$newCATID_ETA_Variablen = KategorieErstellen("Variablen",$newCATID_ETA);
	//====================|Allgemein
	$newCATID_ETA_Variablen_Allgemein = KategorieErstellen("Allgemein",$newCATID_ETA_Variablen);

	//====================|MonitorListe
	KategorieErstellen("Monitor Liste",$newCATID_ETA_Variablen);
	//====================|Einstellwerte
	//KategorieErstellen("Parameter Liste",$newCATID_ETA_Variablen);
	//Wird derzeit nicht verwendet
	//====================|Werte
	KategorieErstellen("Aktuelle Werte",$newCATID_ETA_Variablen);

	//Module anlegen

	// COM Port anlegen
	$newComPortID = IPS_CreateInstance("{6DC3D946-0D31-450F-A8C6-C42DB8D7D4F1}");
	IPS_SetName($newComPortID,"ETA_COM_Port");
//	COMPort_SetBaudRate($newComPortID,"19200");
//	COMPort_SetStopBits($newComPortID,"1");
//	COMPort_SetDataBits($newComPortID,"8");
//	COMPort_SetPort($newComPortID,"COM1");
//	COMPort_SetOpen($newComPortID,true);
	IPS_SetProperty($newComPortID,StopBits, "1");
	IPS_SetProperty($newComPortID,BaudRate, "19200");
	IPS_SetProperty($newComPortID,Parity, "none");
	IPS_SetProperty($newComPortID,DataBits, "8");
	IPS_SetProperty($newComPortID,Port, "tty.serial2");
	IPS_SetProperty($newComPortID,Open, true);
	IPS_ApplyChanges($newComPortID);


	// Register Variablen anlegen
	$newRegisterVariableID = IPS_CreateInstance("{F3855B3C-7CD6-47CA-97AB-E66D346C037F}");
	IPS_SetName($newRegisterVariableID,"ETA_COM_RegisterVariable");
	IPS_ConnectInstance($newRegisterVariableID, $newComPortID);
//	RegVar_SetRXObjectID($newRegisterVariableID,$newSCR_CutterID);
	IPS_SetProperty($newRegisterVariableID, 'RXObjectID' , $newSCR_CutterID);  //Anpassung
	IPS_ApplyChanges($newRegisterVariableID);
	IPS_SetParent($newRegisterVariableID,$newCATID_ETA_Variablen_Allgemein); //verschieben
	IPS_SetHidden($newRegisterVariableID, true); //Objekt verstecken

	$newRegisterVariableID = IPS_CreateInstance("{F3855B3C-7CD6-47CA-97AB-E66D346C037F}");
	IPS_SetName($newRegisterVariableID,"ETA_DatenString_Buffer");
	IPS_ApplyChanges($newRegisterVariableID);
	IPS_SetParent($newRegisterVariableID,$newCATID_ETA_Variablen_Allgemein); //verschieben
	IPS_SetHidden($newRegisterVariableID, true); //Objekt verstecken


	// Webserver anlegen

	$newWebserverID = IPS_CreateInstance("{D83E9CCF-9869-420F-8306-2B043E9BA180}");
	IPS_SetName($newWebserverID,"WebServer");
//	WI_SetPort($newWebserverID,3777);
//	WI_SetHomeDir($newWebserverID,"webfront");
//	WI_SetActive($newWebserverID,true);
   IPS_SetProperty($newWebserverID, "Port", "3777");
	IPS_SetProperty($newWebserverID, "HomeDir", "webfront");
	IPS_SetProperty($newWebserverID, "Active", true);
	IPS_ApplyChanges($newWebserverID);


	//Variablen Profile anlegen
	//$VarProfileName,$VarProfileType,$Profilename_Prefix,$Profilename_Suffix,$PMin,$PMax,$PSchritt,$PNachkommastellen,$PIcon

//Boolean
	createVariablenProfile("ETA.Main.ETA_Status",0,null,null,0,1,0,0,null);
	IPS_SetVariableProfileAssociation("ETA.Main.ETA_Status",0,"Alarm",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.ETA_Status",1,"OK",null,0x0000FF);

	createVariablenProfile("ETA.Main.Grunddaten",0,null,null,0,1,0,0,null);
	IPS_SetVariableProfileAssociation("ETA.Main.Grunddaten",0,"laden",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Grunddaten",1,"zuruecksetzen",null,0x0000FF);

//Integer
	createVariablenProfile("ETA.Main.Daten_Intervall",1,null," Sekunden",0,120,10,0,"Gauge");
	createVariablenProfile("ETA.Main.COM_Port",1,null,null,1,1,1,0,"Distance");
	createVariablenProfile("ETA.Main.Pruefsummenfehler",1,null,null,0,0,0,0,"Information");

	createVariablenProfile("ETA.Main.Monitorliste",1,null,null,0,1,0,0,"Power");
	IPS_SetVariableProfileAssociation("ETA.Main.Monitorliste",0,"Abfrage Aus",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Monitorliste",1,"Abfrage Ein",null,0x0000FF);
	
	createVariablenProfile("ETA.Main.Berechtigung_Stufe",1,null,null,0,3,0,0,null);
	IPS_SetVariableProfileAssociation("ETA.Main.Berechtigung_Stufe",0,"Standard",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Berechtigung_Stufe",1,"Service",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Berechtigung_Stufe",2,"Profi",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Berechtigung_Stufe",3,"Experte",null,0x0000FF);
	
	createVariablenProfile("ETA.Main.Grunddaten_Status",1,null,null,0,5,0,0,null);
	IPS_SetVariableProfileAssociation("ETA.Main.Grunddaten_Status",0,"nicht geladen",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Grunddaten_Status",1,"geladen",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Grunddaten_Status",2,"Error",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Grunddaten_Status",3,"Parameter XML",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Grunddaten_Status",4,"Parameter Index XML",null,0x0000FF);
	IPS_SetVariableProfileAssociation("ETA.Main.Grunddaten_Status",5,"Monitor Variablen",null,0x0000FF);

//Float
	createVariablenProfile("ETA.Main.Temperature.Abgas",2,null," °C",0,300,1,0,"Temperature");
	createVariablenProfile("ETA.Main.Temperature.10bis100",2,null," °C",10,100,1,0,"Temperature");
	createVariablenProfile("ETA.Main.Drehzahl",2,null," upm",0,4000,1,0,"Gauge");
	createVariablenProfile("ETA.Main.Prozent",2,null," %",0,100,0,1,"Intensity");
	createVariablenProfile("ETA.Main.Tonnen",2,null," t",0,10,0,3,"Gauge");
	createVariablenProfile("ETA.Main.kg",2,null," kg",0,50,0,2,"Gauge");
	createVariablenProfile("ETA.Main.Restsauerstoff.Prozent",2,null," %",0,100,0,2,"Intensity");
	createVariablenProfile("ETA.Main.Zahl",2,null,null,0,0,0,0,"Distance");
	createVariablenProfile("ETA.Main.Strom",2,null," Ampere",0,0,0,0,"Gauge");
	createVariablenProfile("ETA.Main.Spannung",2,null," Volt",0,0,0,0,"Gauge");
	createVariablenProfile("ETA.Main.Stunden",2,null," Stunden",0,0,0,0,"Shuffle");
	createVariablenProfile("ETA.Main.Minuten",2,null," Minuten",0,0,0,0,"Shuffle");
	createVariablenProfile("ETA.Main.Sekunden",2,null," Sekunden",0,0,0,0,"Shuffle");


	//Variablen anlegen


//ETA/Variablen/Allgemein

	$MAJOR_Ver_VarID = CreateObject("ETA2IPS_MAJOR_Ver",1,$newCATID_ETA_Variablen_Allgemein,0,true);
	SetValueInteger($MAJOR_Ver_VarID,ETA2IPS_MAJOR_Ver);
	$MINOR_Ver_VarID = CreateObject("ETA2IPS_MINOR_Ver",1,$newCATID_ETA_Variablen_Allgemein,0,true);
	SetValueInteger($MINOR_Ver_VarID,ETA2IPS_MINOR_Ver);
	CreateObject("MonitorListeID",1,$newCATID_ETA_Variablen_Allgemein,0,true);
	CreateObject("ParameterListeID",1,$newCATID_ETA_Variablen_Allgemein,0,true);
	CreateObject("ParameterIndexListeID",1,$newCATID_ETA_Variablen_Allgemein,0,true);
	CreateObject("liveview_int",1,$newCATID_ETA_Variablen_Allgemein,0,true);
	CreateObject("ETA_AllowChangeSettings",0,$newCATID_ETA_Variablen_Allgemein,"0",true);
	CreateObject("ETA_Cutter_Lenght",1,$newCATID_ETA_Variablen_Allgemein,0,true);
	CreateObject("MonitorList_ParameterBlockZaehler",1,$newCATID_ETA_Variablen_Allgemein,"0",true);

	//ETA Setup
	
	$Setup_Einstellungen_DummyModulID = IPS_CreateInstance("{485D0419-BE97-4548-AA9C-C083EB82E61E}");
	IPS_SetName($Setup_Einstellungen_DummyModulID,"Einstellungen");
	IPS_SetParent($Setup_Einstellungen_DummyModulID, $newCATID_ETA_Setup);
	IPS_ApplyChanges($Setup_Einstellungen_DummyModulID);
	IPS_SetPosition($Setup_Einstellungen_DummyModulID, 0);

	$COMVariableID = CreateObject("Serial Port",1,$Setup_Einstellungen_DummyModulID,"ETA.Main.COM_Port",false);
	IPS_SetVariableCustomAction($COMVariableID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
	IPS_SetPosition($COMVariableID, 0);

	$ETA_Setup_BerechtigungsstufeID = CreateObject("Berechtigungs Stufe",1,$Setup_Einstellungen_DummyModulID,"ETA.Main.Berechtigung_Stufe",true);
	IPS_SetVariableCustomAction($ETA_Setup_BerechtigungsstufeID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
	IPS_SetPosition($ETA_Setup_BerechtigungsstufeID, 1);

	$Daten_IntervallID = CreateObject("Datenabfrage Intervall",1,$Setup_Einstellungen_DummyModulID,"ETA.Main.Daten_Intervall",false);
	IPS_SetVariableCustomAction($Daten_IntervallID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
	SetValueInteger($Daten_IntervallID,60);
	IPS_SetPosition($Daten_IntervallID, 2);

	$Grunddaten_DummyModulID = IPS_CreateInstance("{485D0419-BE97-4548-AA9C-C083EB82E61E}");
	IPS_SetName($Grunddaten_DummyModulID,"Grunddaten laden oder zuruecksetzen");
	IPS_SetParent($Grunddaten_DummyModulID, $newCATID_ETA_Setup);
	IPS_ApplyChanges($Grunddaten_DummyModulID);
	IPS_SetPosition($Grunddaten_DummyModulID, 1);

	$Grunddaten_StatusID = CreateObject("Grunddaten Status",1,$Grunddaten_DummyModulID,"ETA.Main.Grunddaten_Status",false);
	IPS_SetPosition($Grunddaten_StatusID, 0);

	$GrunddatenID = CreateObject("Grunddaten",0,$Grunddaten_DummyModulID,"ETA.Main.Grunddaten",false);
	IPS_SetVariableCustomAction($GrunddatenID,GetObjectID("ETA/Scripts/SCR_Grunddaten"));
	IPS_SetPosition($GrunddatenID, 1);
	
	$DatenabfrageID = CreateObject("Datenabfrage",0,$newCATID_ETA_Setup,"~Switch",false);
	IPS_SetVariableCustomAction($DatenabfrageID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));
	IPS_SetPosition($DatenabfrageID, 2);

	$ETA_Setup_LOG_ID = CreateObject("Setup_log",3,$newCATID_ETA_Setup,"~HTMLBox",true);
	IPS_SetPosition($ETA_Setup_LOG_ID, 3);


//ETA/Meldungen
	CreateObject("ETA Alarmmeldungen",3,$newCATID_ETA_Meldungen,"~HTMLBox",true);

	$ETA_StatusID = CreateObject("ETA Status",0,$newCATID_ETA_Meldungen,"ETA.Main.ETA_Status",true);
	IPS_SetVariableCustomAction($ETA_StatusID,GetObjectID("ETA/Scripts/SCR_WebInterfaceUebergabe_ETA"));

	CreateObject("Prüfsummenfehler",1,$newCATID_ETA_Meldungen,null,false);
	CreateObject("Live Daten",3,$newCATID_ETA_Meldungen,"~HTMLBox",false);


//IPS/Allgemein/Variablen

	CreateObject("IPS Alarm",3,$newCATID_Allgemein_Variablen,"~String",true);
	CreateObject("IPS_Alarm_Bool",0,$newCATID_Allgemein_Variablen,"0",true);

//WFC anpassen, Funktioniert nicht, warum? WFC wird erst später von IPS erzeugt...einbau in startup script
	//WFC_AddItem(GetObjectID("WebFront Configurator"),'ETA_Main','webfront.modules.ips','{"baseID":'.GetObjectID("ETA").'}','{"title":"ETA","name":"ETA_Main"}','');
	//IPS_ApplyChanges(GetObjectID("WebFront Configurator"));
	
	//Startup Script festlegen
	EC_SetStartupScript(GetObjectID("Events"),GetObjectID("Allgemein/Scripts/SCR_Startup"));
	IPS_ApplyChanges(GetObjectID("Events"));

	//Install Script verstecken
	   IPS_SetHidden(GetObjectID("SCR_ETA_install"), true);
	//Installations Meldung ausgeben

	echo "ETA2IPS wurde installiert. </BR></BR>!!! WICHTIG !!! Warte ein paar Minuten bis IPS alle Variablen angelegt hat und dann starte den IPS Dienst neu. !!!";
}
?>