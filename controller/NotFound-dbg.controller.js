sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed: function () {
			window.history.back();
		}

	});

});