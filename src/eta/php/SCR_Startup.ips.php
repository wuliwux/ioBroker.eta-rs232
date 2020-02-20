<?

//Startup Script, wird nach dem start des IPS Dienst ausgeführt

require 'SCR_EtaFunctions.ips.php';

//COM Schnittstellen auslesen und in Variable eintragen
$ETA_ComID = GetObjectID("ETA_COM_Port");
IPS_DeleteVariableProfile("ETA.Main.COM_Port");
$COMIDS = COMPort_GetDevices($ETA_ComID);
$temp_max_COMID = floatval(substr(end($COMIDS),3,2));
createVariablenProfile("ETA.Main.COM_Port",1,null,null,1,$temp_max_COMID,0,0,"Distance");
//ProfileAssociation anlegen
foreach ($COMIDS as $COMID) {
	$TempCOMID = floatval(substr($COMID,3,2));
	IPS_SetVariableProfileAssociation("ETA.Main.COM_Port",$TempCOMID,$COMID,null,0x0000FF);
	}

	
?>