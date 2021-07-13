/*global location*/
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, History, formatter, MessageToast) {
	"use strict";

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.ObjectLinkLamDetail", {

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

			this.getRouter().getRoute("linkLamDetail").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
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

		dateFormat: function (d) {
			if (d !== "" && d !== null) {
				var i = new Date(d);

				var j = i.getDate();
				var l = i.getMonth() + 1;
				var y = i.getFullYear();
				if (j < 10) {
					j = '0' + j;
				}
				if (l < 10) {
					l = '0' + l;
				}

				return l + '/' + j + '/' + y;
			} else {
				return "";
			}

		},

		timeFormat: function (d) {

			if (d !== "" && d !== null) {
				var i = new Date(d);

				var h = i.getHours();
				var m = i.getMinutes();
				var s = i.getSeconds();

				return h + ':' + m + ':' + s;
			} else {
				return "";
			}

		},
		onNavBack: function () {
			window.history.go(-1);

		},

		parseRelOne: function (d) {
			if (d === "1") {
				return true;
			} else {
				return false;
			}
		},

		parseRelTwo: function (d) {
			if (d === "2") {
				return true;
			} else {
				return false;
			}
		},
		parseRelUsdNot: function (r) {
			if (r === "0") {
				return true;
			} else {
				return false;
			}
		},

		parseRelUsdOne: function (r) {
			if (r === "1") {
				return true;
			} else {
				return false;
			}
		},

		parseRelUsdTwo: function (r) {
			if (r === "2") {
				return true;
			} else {
				return false;
			}
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
					} else if (v.indexOf("X") > -1) {
						temp = true;
					} else {
						temp = false;
					}

					return temp;
				}
			} else {
				return false;
			}
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

			var itemOverview = new sap.ui.model.json.JSONModel();
			var itemData = sap.ui.getCore().getModel("linkLam");
			itemOverview.setData(itemData.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));

			this.setModel(itemOverview, "lamDetail");

			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "lamDetail"
			});

		},

		onNetLinkLamPress: function (oEvent) {
			this.showLinkLamDetail(oEvent.getSource());
		},
		showLinkLamDetail: function (oItem) {
			var path = oItem.oBindingContexts.ntLinkLam.sPath;
			this.getRouter().navTo("itdetail", {
				itemPath: encodeURIComponent(path)
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
		}

	});

});