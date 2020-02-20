<?
//Wird beim anklicken im Webinterface ausgeführt [Allgemein]

include'SCR_EtaFunctions.ips.php';
WFC_SendNotification(GetObjectID("WebFront Configurator"),"Uebernahme","Befehl wurde uebernommen","Info",1);
if ($_IPS['SENDER'] == "WebFront") {

//Derzeit keine Funktion
	}
?>