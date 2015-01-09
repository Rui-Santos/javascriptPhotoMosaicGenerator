/**

     * Author: Onur Sahin
     * Date: 26. September 2014
     * Version: 1.0.0
	 
	 Versionierungs-Verlauf
	 * 1.0.0 Start-Version (26. September 2014)
	 * * * * Bisher kein Vermerk
	 
*/

// Erst muss der DOM vollständig geladen werden damit wir Zugriff auf das Canvas-Element haben
window.onload = function() {

	// Die ID des Canvas-Tags welches Sie exportieren möchten 
	var canvasID = "canvasGeneratedMosaic"; 

	// ExportCanvas-Objekt erzeugen um Zugriff auf die export-Methode zu ermöglichen
	var exportCanvas = new ExportCanvas();

	// Die Configdatei & Sprachdatei laden (Zwingend erforderlich)
	exportCanvas.loadConfigFile("js/export-canvas-1.6.5/core/config/config.js");
	exportCanvas.loadLanguageFile("js/export-canvas-1.6.5/core/language/en.js");

	// Browserspezifische Export-Möglichkeiten als Liste erzeugen (Export-DropDown-Menü)
	var actualMimeTypeList = exportCanvas.getBrowserSpecificMimeTypeWhiteList();
	var exportList = document.getElementById("exportList");
	for(var i = 0; i < actualMimeTypeList.length; i++) {
	
		var li = document.createElement("li");
		li.id = actualMimeTypeList[i];
		var a = document.createElement("a");
		a.innerHTML = exportCanvas.getExtensionOfMimeType(actualMimeTypeList[i]);
		a.href = "#exportAs" + firstCharUppercase(exportCanvas.getExtensionOfMimeType(actualMimeTypeList[i]));
		li.appendChild(a);
		exportList.appendChild(li);
		
		// OnClick-Event für die jeweiligen MimeType-Optionen vom Frontend setzen
		li.onclick = function() {
		
			// Ausgewählten MimeType setzen
			exportCanvas.setMimeType(this.id);
			
			// Export starten
			exportCanvas.export(canvasID, function() {
				
				// Hier kommt der manuelle Code nachdem der Download erfolgreich gestartet hat
				// Erstmal nur ein "alert" wird später durch eine "Toast-Message" ersetzt							
				$('.top-right').notify({
					type: 'info',
					message: { text: DOWNLOAD_HAS_STARTED }
				}).show(); 
				
			}, function(getLastReport) {
			
				// Hier kommt der manuelle Code nachdem der Download gescheitert ist
				// Die Parameterübergabe "getLastReport" der ErrorCallback-Funktion liefert den Grund dazu
				// Erstmal nur ein "alert" wird später durch eine "Toast-Message" ersetzt
				$('.top-right').notify({
					type: 'danger',
					message: { text: getLastReport }
				}).show(); 
			
			});
		}
		
	}
	
}

// Hilfsfunktion
function firstCharUppercase(str) {
    return str.substring(0, 1).toUpperCase() + str.substring(1).toLowerCase();
}
