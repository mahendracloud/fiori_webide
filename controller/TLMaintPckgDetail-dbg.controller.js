sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/core/routing/Router",
	"sap/m/MessageBox",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"sap/ui/core/message/Message",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
], function (BaseController, JSONModel, formatter, History, Router, MessageBox, ValueHelpProvider, Message, ValueHelpRequest) {
	"use strict";

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.TLMaintPckgDetail", {

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

			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			// var serviceUrl = this._oComponent.getModel().sServiceUrl;
			// var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// var vhServiceUrl = this._oComponent.getModel("NewModel").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(vhModel, "valueHelp");
			// this.getView().setModel(oModel);

			// var vhServiceUrl = this._oComponent.getModel("NewModel2").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	loadMetadataAsync: true,
			// 	refreshAfterChange: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(vhModel, "valueHelp2");
			
			var oModel = this._oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);
			
			var vhModel = this._oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");
			
			var vhModel2 = this._oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");

			this.getRouter().getRoute("tlMaintPckg").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
		},

		showMessage: function (msg) {
			this.createMessagePopover(msg, "Error");
			// sap.m.MessageBox.show(msg, {
			// 	title: "Error",
			// 	icon: sap.m.MessageBox.Icon.ERROR,
			// 	onClose: function (oAction) {
			// 	}
			// });
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sPath = oEvent.getParameter("arguments").itemPath;
			this.mode = oEvent.getParameter("arguments").mode;
			var itData = sap.ui.getCore().getModel("tlDetailModel");
			this.itemPath = "/lMaintPckg/" + sPath;

			var mtlMaintPckg = new JSONModel();
			mtlMaintPckg.setData(itData.getProperty(this.itemPath));
			this.setModel(mtlMaintPckg, "mtlMaintPckg");

			if (this.mode === "display") {
				this.getView().byId("idTblMaintPckgDetail").setMode("None");
				this.getView().byId("idAddMaintPckg").setEnabled(false);
			} else {
				this.getView().byId("idTblMaintPckgDetail").setMode("Delete");
				this.getView().byId("idAddMaintPckg").setEnabled(true);
			}
		},

		onNavBack: function () {
			window.history.go(-1);
		},

		addMaintPckg: function () {
			var g = this;
			var mtlMaintPckg = this.getModel("mtlMaintPckg");
			var otlMaintPckg = mtlMaintPckg.getData();

			var obj = {
				Ktex1: "",
				Ktxhi: "",
				Kzyk1: "",
				Paket: "",
				Plnal: otlMaintPckg.Plnal,
				Strat: otlMaintPckg.Strat,
				Vornr: otlMaintPckg.Vornr,
			};

			otlMaintPckg.MPArr.push(obj);
			this.getModel("mtlMaintPckg").setData(otlMaintPckg);
		},

		deleteMaintPckg: function (event) {
			var src = event.getSource();
			var mtlMaintPckg = this.getModel("mtlMaintPckg");
			var otlMaintPckg = mtlMaintPckg.getData();
			var path = event.getParameter('listItem').getBindingContext("mtlMaintPckg").sPath;
			var sPackage = mtlMaintPckg.getProperty(path).Paket;
			otlMaintPckg[sPackage] = false;

			path = path.split("/")[2];
			otlMaintPckg.MPArr.splice(parseInt(path), 1);
			mtlMaintPckg.setData(otlMaintPckg);
		},

		onCycleShrtTxtVH: function (oEvent) {
			ValueHelpRequest.CycleShrtTxtVH(oEvent, this);
		},

		onCycleShrtTxtChange: function (oEvent) {
			ValueHelpRequest._CycleShrtTxtchange(oEvent, this);
		},

		// _onObjectMatched: function (oEvent) {

		// 	var itDetailview = new sap.ui.model.json.JSONModel();
		// 	var itData = sap.ui.getCore().getModel("tlDetailModel");
		// 	itDetailview.setData(itData.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));
		// 	this.setModel(itDetailview, "oprDetailView");
		// 	this.itemPath = oEvent.getParameter("arguments").itemPath;

		// 	var mainPath = oEvent.getParameter("arguments").mainPath;
		// 	this.mainPath = decodeURIComponent(mainPath).substr(2, 4);
		// 	var basicPath = oEvent.getParameter("arguments").basicPath;
		// 	this.basicPath = decodeURIComponent(basicPath);
		// 	this.action = oEvent.getParameter("arguments").action;

		// 	var itemPath = decodeURIComponent(this.itemPath);

		// 	var itmDetailPath = this.mainPath + itemPath;
		// 	this.itmDetailPath = itmDetailPath;

		// 	var tlOpDetailModel = new sap.ui.model.json.JSONModel();
		// 	var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
		// 	this.operationDetail = tlDetailModel.getProperty(itemPath);
		// 	tlOpDetailModel.setData(this.operationDetail);

		// 	this.mode = oEvent.getParameter("arguments").mode;
		// 	if (this.mode === "display") {
		// 		this.operationDetail.enable = false;
		// 		this.operationDetail.visible = true;
		// 	} else {
		// 		this.operationDetail.enable = true;
		// 		this.operationDetail.visible = false;

		// 		var ctrl = oEvent.getParameter("arguments").ctrlKey;
		// 		var wc = oEvent.getParameter("arguments").wc;
		// 		var wcPlant = oEvent.getParameter("arguments").wcPlant;
		// 		this.operationDetail.Steus = ctrl;
		// 		if (wc !== "null") {
		// 			this.operationDetail.Arbpl = wc;
		// 		}
		// 		if (wcPlant !== "null") {
		// 			this.operationDetail.Werks = wcPlant;
		// 		}
		// 	}

		// 	/*this.getView().bindElement({
		// 		path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
		// 		model: "oprDetailView"
		// 	});*/
		// 	this.getView().bindElement({
		// 		path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
		// 		model: "tlOpDetailModel"
		// 	});

		// 	if (this.operationDetail.Arbpl !== "") {
		// 		this.operationDetail.wcDtValueState = "None";
		// 	}
		// 	if (this.operationDetail.Werks !== "") {
		// 		this.operationDetail.opPlantValueState = "None";
		// 	}
		// 	if (this.operationDetail.Ltxa1 !== "") {
		// 		this.operationDetail.opDescValueState = "None";
		// 	}
		// 	tlOpDetailModel.setData(this.operationDetail);
		// 	this.getView().setModel(tlOpDetailModel, "tlOpDetailModel");
		// 	// sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");

		// },

		disableFields: function () {
			var obj = {
				enable: false
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "tlOpDetailModel");
		},

		enableFields: function () {
			var obj = {
				enable: true
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "tlOpDetailModel");
		},

	});

});