/* global document */
sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ugiaiwui/mdg/aiw/request/model/models",
	"ugiaiwui/mdg/aiw/request/controller/ErrorHandler",
	"sap/ui/core/routing/HashChanger"
], function (UIComponent, Device, models, ErrorHandler, HashChanger) {
	"use strict";

	return UIComponent.extend("ugiaiwui.mdg.aiw.request.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * In this function, the FLP and device models are set and the router is initialized.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the FLP model
			this.setModel(models.createFLPModel(), "FLP");

			var model = new sap.ui.model.json.JSONModel({
				init: false
			});
			this.setModel(model, "mainModel");

			// create the views based on the url/hash
			this.getRouter().initialize();
			var oHashChanger = HashChanger.getInstance();
			if (this.getComponentData().startupParameters.hasOwnProperty("mode")) {
				var mode = this.getComponentData().startupParameters.mode[0];
				if (mode !== null && mode === "display") {
					oHashChanger.replaceHash('request');
					//Set employee info in title
					var that = this;
					this.getService("ShellUIService").then( // promise is returned
						function (oService) {
							var sTitle = that.getModel("i18n").getResourceBundle().getText("title");
							oService.setTitle(sTitle);
						},
						function (oError) {
							jQuery.sap.log.error("Cannot get ShellUIService", oError, "Title");
						}
					);

				} else {
					oHashChanger.replaceHash('main'); //check if it will work in IE as well
					var that = this;
					this.getService("ShellUIService").then( // promise is returned
						function (oService) {
							var sTitle = that.getModel("i18n").getResourceBundle().getText("title");
							oService.setTitle(sTitle);
						},
						function (oError) {
							jQuery.sap.log.error("Cannot get ShellUIService", oError, "Title");
						}
					);
				}
			} else {
				oHashChanger.replaceHash('main');
				var that = this;
				this.getService("ShellUIService").then( // promise is returned
					function (oService) {
						var sTitle = that.getModel("i18n").getResourceBundle().getText("title");
						oService.setTitle(sTitle);
					},
					function (oError) {
						jQuery.sap.log.error("Cannot get ShellUIService", oError, "Title");
					}
				);
			}
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function () {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}

	});

});