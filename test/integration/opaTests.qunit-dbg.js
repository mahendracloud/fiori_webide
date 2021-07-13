/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"ugiaiwui/mdg/aiw/request/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});