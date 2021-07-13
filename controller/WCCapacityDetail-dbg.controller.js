/*global location*/
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, History, formatter, MessageToast) {
	"use strict";

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.WCCapacityDetail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("wccapacity").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		typeCheck: function (v) {
			if (v) {
				var temp = "";
				if (typeof v === "boolean") {
					return v;
				} else if (typeof v === "string") {

					if (v.indexOf("false") > -1) {
						temp = false;
					} else if (v.indexOf("true") > -1) {
						temp = true;
					}

					return temp;
				}
			} else {
				return false;
			}
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler  for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function () {
			window.history.go(-1);

		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			// var sObjectId =  oEvent.getParameter("arguments").ChangeRequestID;
			// this.getModel().metadataLoaded().then( function() {
			// 	var sObjectPath = this.getModel().createKey("ChangeRequestCollection", {
			// 		ChangeRequestID :  sObjectId
			// 	});
			var operOverview = new sap.ui.model.json.JSONModel();
			var operData = sap.ui.getCore().getModel("wcDetailModel");
			operOverview.setData(operData.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));
			this.setModel(operOverview, "wcCapacity");

			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "wcCapacity"
			});

		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: "ToSupplier"
				},
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.ProductID,
				sObjectName = oObject.ProductID;

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		// added formatter to convert time from "PThhHmmMssS" to "hh:mm:ss"
		formatTime: function (t) {
			if (t.ms !== 0) { //added to check if t is initial
				var hr = t.substr(2, 2);
				var mt = t.substr(5, 2);
				var sd = t.substr(8, 2);

				return hr + ":" + mt + ":" + sd;
			} else {
				return "";
			}

		}

	});

});