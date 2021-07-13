sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	// "ugiaiwui/mdg/aiw/request/util/common",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	'sap/m/MessagePopover',
	'sap/m/MessageItem',
	"sap/m/BusyDialog",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"ugieamui/mdg/eam/lib/util/SearchUtil",
	"ugieamui/mdg/eam/lib/util/PersoService",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
	"sap/ui/core/message/Message",
	"sap/ui/core/library",
], function (BaseController, JSONModel, MessageBox, History, formatter, MessagePopover, MessageItem, BusyDialog,
	ValueHelpProvider, SearchUtil, PersoService, ValueHelpRequest, Message, library) { //common
	"use strict";

	// var oMessageTemplate = new MessageItem({
	// 	type: '{type}',
	// 	title: '{title}'
	// });

	// var oMessagePopover = new MessagePopover({
	// 	items: {
	// 		path: '/',
	// 		template: oMessageTemplate
	// 	}
	// });

	var MessageType = library.MessageType;

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.Search", {
		formatter: formatter,
		oMessageManager: sap.ui.getCore().getMessageManager(),

		onInit: function () {
			this._oView = this.getView();
			this.BusyDialog = new BusyDialog();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			// var serviceUrl = this._oComponent.getModel().sServiceUrl;
			// var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// // var vhServiceUrl = this._oComponent.getModel("NewModel").sServiceUrl;
			// // var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// // 	json: true,
			// // 	useBatch: false,
			// // 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// // });
			// var vhServiceUrl = this._oComponent.getModel("NewModel2").sServiceUrl;
			// var vhModel2 = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// // this.getView().setModel(vhModel2, "valueHelp2");
			// this.getView().setModel(vhModel2, "valueHelp");
			// this.getView().setModel(oModel);

			var oModel = this._oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			oModel.setRefreshAfterChange(false);
			oModel.setUseBatch(false);
			this.getView().setModel(oModel);

			var vhModel = this._oComponent.getModel("NewModel");
			vhModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			vhModel.setRefreshAfterChange(false);
			vhModel.setUseBatch(false);
			this.getView().setModel(vhModel, "valueHelp");

			var vhModel2 = this._oComponent.getModel("NewModel2");
			vhModel2.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			vhModel2.setRefreshAfterChange(false);
			vhModel2.setUseBatch(false);
			this.getView().setModel(vhModel2, "valueHelp2");

			this.getRouter().getRoute("search").attachPatternMatched(this._onRouteMatched, this);

			// Declaring local model for refresh property
			var refreshModel = new sap.ui.model.json.JSONModel({
				"refresh": true,
				"refreshSearch": true
			});
			sap.ui.getCore().setModel(refreshModel, "refreshModel");

			this.getView().byId("deleteBtn").setVisible(false);

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

			this.ObjFlag = "";

			this._oView.setModel(this.oMessageManager.getMessageModel(), "message");
			this.oMessageManager.registerObject(this._oView, true);
			this._getMessagePopover();
			
			this.readDOIList("EQUI");
			this.readDOIList("FUNCLOC");
			// this.getView().byId("idMessagePopover").setText("0");
			// this.getView().byId("idMessagePopover").setEnabled(false);

		},

		_onRouteMatched: function (oEvent) {
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "search") {
				this.getView().byId("idImportMocr").setEnabled(false);
				this.getView().byId("searchResults").setMode("MultiSelect");

				var refreshModel = sap.ui.getCore().getModel("refreshModel");
				if (oEvent.getParameter("arguments").action !== this.action) { //new
					refreshModel.setProperty('/refreshSearch', true);
				}
				this.action = oEvent.getParameter("arguments").action;
				var oJsonModel = new JSONModel();
				var sObj = {};
				// this.BusyDialog.open();
				var refreshModel = sap.ui.getCore().getModel("refreshModel");
				if (refreshModel.getProperty('/refreshSearch') === true) {
					var oControl = this.getView().byId("idPanel");
					var oTable = this.getView().byId("searchResults");
					var items = this.getView().byId("sColListItem");
					oControl.destroyContent();
					oTable.destroyColumns();
					oTable.destroyItems();
					items.destroyCells();
					oTable.setModel();
					if (this._oTPC) {
						this._oTPC.destroyPersoService();
						this._oTPC.destroy();
					}
					this.loadSearchService(); // Load Search Services
				}

				if (this.action === "changeMbom") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "MBOM";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("searchMaterialBomTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_MAT"));
				}
				if (this.action === "changeEbom") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "EBOM";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("searchEquipmentBomTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_EQUI"));
				}
				if (this.action === "changeFlbom") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "FBOM";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("searchFLBomTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_FLOC"));
				}
				if (this.action === "changeWbsbom") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "WBOM";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("searchWBSBomTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_WBS"));
				}
				if (this.action === "changeOL") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "OBJL";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("olSearchTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_OBJL"));
				}
				if (this.action === "changeEqui") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "EQUI";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("searchEquiTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("searchEquiImportTitle"));
				}
				if (this.action === "changeFloc") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "FLOC";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("searchFlocTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("searchFlocImportTitle"));
				}
				if (this.action === "changeMpmi") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "MPMI";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("searchMpmiTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("searchMpmiImportTitle"));
				}
				if (this.action === "changeMspt") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "MSPT";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("searchMsptTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("searchMsptImportTitle"));
				}
				if (this.action === "changeOn") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "OBJN";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("SearchONHeader");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_OBJN"));
				}
				if (this.action === "changeWC") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "WKCT";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("wcSearchTitle");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_WC"));
				}
				if (this.action === "changeGTL") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "GTL";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("SRCH_GTL");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_GTL_MOCR"));
				}
				if (this.action === "changeETL") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "ETL";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("SRCH_ETL");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_ETL_MOCR"));
				}
				if (this.action === "changeFTL") {
					if (refreshModel.getProperty('/refreshSearch') === true) {
						this.selectedIndices = [];
						this.ObjFlag = "FTL";
					}
					sObj.titleName = this.getView().getModel("i18n").getProperty("SRCH_FTL");
					this.getView().byId("idImportMocr").setText(this.getView().getModel("i18n").getProperty("IMP_FTL_MOCR"));
				}

				oJsonModel.setData(sObj);
				this.getView().setModel(oJsonModel, "applicationModel");

				if (refreshModel.getProperty('/refreshSearch') === true) {
					// var sModel = this.getView().getModel("DBSearch");
					// sModel.metadataLoaded().then(function () {
					// 	this.onDbMetadataLoaded("DBSearch", this.ObjFlag);
					// }.bind(this));
					// this.readSearchOperators(sModel, "DBSearchMB");

					var hModel = this.getView().getModel("hanaSearch");
					hModel.metadataLoaded().then(function () {
						this.onHaMetadataLoaded("hanaSearch", this.ObjFlag);
					}.bind(this));
					SearchUtil.setSearchMethod(hModel, this.getView().byId("srchMethod"), "AIW");

					var model = new JSONModel([{
						"text": "",
						"searchId": ""
					}]);
					this.getView().setModel(model, "saveSearch");
					SearchUtil.readAllSavedSearch(hModel, this, this.ObjFlag);
				}

				this.getView().byId("idBtnMsgPopOver").setText(0);
				this.getView().byId("idBtnMsgPopOver").setEnabled(false);
			} else {
				return;
			}
		},

		readSearchOperators: function (modelName, objName, type) {
			this.operators = [];
			var g = this;
			var sModel = this.getView().getModel(modelName);
			// var srchServiceUrl = g._oComponent.getModel(modelName).sServiceUrl;
			// var sModel = new sap.ui.model.odata.v2.ODataModel(srchServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	loadMetadataAsync: true,
			// 	refreshAfterChange: false
			// });
			var fnSuccess = function (r) {
				var aModel = new sap.ui.model.json.JSONModel();
				sap.ui.getCore().setModel(aModel, "searchOperators");
				sap.ui.getCore().getModel("searchOperators").setProperty("/operators", r.results);

				var objFlag;
				if (g.action === "changeGTL") {
					objFlag = "GTL";
				} else if (g.action === "changeETL") {
					objFlag = "ETL";
				} else if (g.action === "changeFTL") {
					objFlag = "FTL";
				}

				if (type === "DB") {
					var mData = g.getView().getModel(modelName).getServiceMetadata();
					var entity = SearchUtil.getEntityTypes(mData, objName);
					var oControl = g.getView().byId("idPanel");
					var rModel = new sap.ui.model.json.JSONModel();
					rModel.setData(mData);
					sap.ui.getCore().setModel(rModel, "dbMetadata");
					sap.ui.getCore().getModel("dbMetadata").setProperty("/entityType", entity);
					var vhModel = g.getView().getModel("valueHelp2");
					var inputs = SearchUtil.getMetadata(entity, oControl, type, vhModel, g, objFlag);
					sap.ui.getCore().getModel("dbMetadata").setProperty("/dbInputs", inputs);
					var oTable = g.getView().byId("searchResults");
					var items = g.getView().byId("sColListItem");
					var rEntity = SearchUtil.getResultEntityTypes(mData, objName);
					sap.ui.getCore().getModel("dbMetadata").setProperty("/resultEntityType", rEntity);
					g._oTPC = SearchUtil.getResultMetadata(rEntity, objName, oTable, items, g);
				} else {
					var mData = g.getView().getModel(modelName).getServiceMetadata();
					var entity = SearchUtil.getEntityTypes(mData, objName);
					var oControl = g.getView().byId("idPanel");
					var rModel = new sap.ui.model.json.JSONModel();
					rModel.setData(mData);
					sap.ui.getCore().setModel(rModel, "haMetadata");
					sap.ui.getCore().getModel("haMetadata").setProperty("/entityType", entity);
					var vhModel = g.getView().getModel("valueHelp2");
					var inputs = SearchUtil.getMetadata(entity, oControl, type, vhModel, g, objFlag);
					sap.ui.getCore().getModel("haMetadata").setProperty("/haInputs", inputs);
					var oTable = g.getView().byId("searchResults");
					var items = g.getView().byId("sColListItem");
					var rEntity = SearchUtil.getResultEntityTypes(mData, objName);
					sap.ui.getCore().getModel("haMetadata").setProperty("/resultEntityType", rEntity);
					g._oTPC = SearchUtil.getResultMetadata(rEntity, objName, oTable, items, g);
				}

				// var mData = g.getView().getModel(modelName).getServiceMetadata();
				// var entity = SearchUtil.getEntityTypes(mData, objName);
				// var oControl = g.getView().byId("idPanel");
				// var rModel = new sap.ui.model.json.JSONModel();
				// rModel.setData(mData);
				// sap.ui.getCore().setModel(rModel, "dbMetadata");
				// sap.ui.getCore().getModel("dbMetadata").setProperty("/entityType", entity);
				// var vhModel = g.getView().getModel("valueHelp");
				// var inputs = SearchUtil.getMetadata(entity, oControl, "DB", vhModel, g, objFlag);
				// sap.ui.getCore().getModel("dbMetadata").setProperty("/dbInputs", inputs);
				// var oTable = g.getView().byId("searchResults");
				// var items = g.getView().byId("sColListItem");
				// var rEntity = SearchUtil.getResultEntityTypes(mData, objName);
				// sap.ui.getCore().getModel("dbMetadata").setProperty("/resultEntityType", rEntity);
				// g._oTPC = SearchUtil.getResultMetadata(rEntity, objName, oTable, items, g);
			};
			var fnError = function (err) {

			};
			sModel.read("/searchoperatorSet", {
				success: fnSuccess,
				error: fnError
			});
			// oModel.attachRequestCompleted(fnSuccess);
			// oModel.attachRequestFailed(fnError);
			// oModel.loadData(sUrl, '', false);
		},

		// readSearchOperators: function (oModel, imSearchModelName) {
		// 	this.operators = [];
		// 	var g = this;
		// 	var srchServiceUrl = this._oComponent.getModel(imSearchModelName).sServiceUrl;
		// 	var sModel = new sap.ui.model.odata.v2.ODataModel(srchServiceUrl, {
		// 		json: true,
		// 		useBatch: false,
		// 		loadMetadataAsync: true,
		// 		refreshAfterChange: false
		// 	});
		// 	var fnSuccess = function (r) {
		// 		// var oModel;
		// 		var aModel = new sap.ui.model.json.JSONModel();
		// 		sap.ui.getCore().setModel(aModel, "searchOperators");
		// 		sap.ui.getCore().getModel("searchOperators").setProperty("/operators", r.results);
		// 		// oModel.fireMetadataLoaded(function () {
		// 		//            g.onDbMetadataLoaded();
		// 		// }.bind(g));
		// 	};
		// 	var fnError = function (err) {

		// 	};
		// 	sModel.read("/searchoperatorSet", {
		// 		success: fnSuccess,
		// 		error: fnError
		// 	});
		// },

		loadSearchService: function () {
			if (this.action === "changeMbom") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.PMBOMHDR_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchMB").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.PMBOMHDR_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchMB").sServiceUrl;
			}
			if (this.action === "changeEbom") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.EQBOMHDR_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchEB").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.EQBOMHDR_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchEB").sServiceUrl;
			}
			if (this.action === "changeFlbom") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.FLBOMHDR_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchFB").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.FLBOMHDR_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchFB").sServiceUrl;
			}
			if (this.action === "changeWbsbom") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.WBSBOMHDR_DB_SEARCH_SRV.uri; //this._oComponent.getModel("DBSearchWB").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.WBSBOMHDR_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchWB").sServiceUrl;
			}
			if (this.action === "changeOL") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.OBJLINK_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchOL").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.OBJLINK_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchOL").sServiceUrl;
			}
			if (this.action === "changeEqui") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.EQUI_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchEQ").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.EQUI_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchEQ").sServiceUrl;
			}
			if (this.action === "changeFloc") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.FUNCLOC_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchFL").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.FUNCLOC_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchFL").sServiceUrl;
			}
			if (this.action === "changeMpmi") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.MPLAN_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchMP").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.MPLAN_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchMP").sServiceUrl;
			}
			if (this.action === "changeMspt") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.MSPOINT_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchMS").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.MSPOINT_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchMS").sServiceUrl;
			}
			if (this.action === "changeOn") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.OBJNETWRK_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchON").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.OBJNETWRK_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchON").sServiceUrl;
			}
			if (this.action === "changeWC") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.WORKCNTR_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchWC").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.WORKCNTR_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchWC").sServiceUrl;
			}
			if (this.action === "changeGTL") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.TLGNHDR_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchGTL").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.TLGNHDR_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchGTL").sServiceUrl;
			}
			if (this.action === "changeETL") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.TLEQHDR_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchETL").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.TLEQHDR_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchETL").sServiceUrl;
			}
			if (this.action === "changeFTL") {
				var srchServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.TLFLHDR_DB_SRCH_SRV.uri; //this._oComponent.getModel("DBSearchFTL").sServiceUrl;
				var hServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.TLFLHDR_HA_SRCH_SRV.uri; //this._oComponent.getModel("hanaSearchFTL").sServiceUrl;
			}

			// var sModel = new sap.ui.model.odata.v2.ODataModel(srchServiceUrl, {
			// 	json: true,
			// 	// useBatch: false,
			// 	loadMetadataAsync: true,
			// 	refreshAfterChange: false
			// });
			// sModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			// this.getView().setModel(sModel, "DBSearch");

			var hModel = new sap.ui.model.odata.v2.ODataModel(hServiceUrl, {
				json: true,
				// useBatch: false,
				loadMetadataAsync: true,
				refreshAfterChange: false
			});
			hModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(hModel, "hanaSearch");
		},

		onDbMetadataLoaded: function (modelName, objName) {
			this.readSearchOperators(modelName, objName, "DB");
			// this.readSearchOperators(modelName, objName);

			// var objFlag;
			// if (this.action === "changeGTL") {
			// 	objFlag = "GTL";
			// } else if (this.action === "changeETL") {
			// 	objFlag = "ETL";
			// } else if (this.action === "changeFTL") {
			// 	objFlag = "FTL";
			// }
			// var mData = this.getView().getModel(modelName).getServiceMetadata();
			// var entity = SearchUtil.getEntityTypes(mData, objName);
			// var oControl = this.getView().byId("idPanel");
			// var rModel = new sap.ui.model.json.JSONModel();
			// rModel.setData(mData);
			// sap.ui.getCore().setModel(rModel, "dbMetadata");
			// sap.ui.getCore().getModel("dbMetadata").setProperty("/entityType", entity);
			// var vhModel = this.getView().getModel("valueHelp");
			// var inputs = SearchUtil.getMetadata(entity, oControl, "DB", vhModel, this, objFlag);
			// sap.ui.getCore().getModel("dbMetadata").setProperty("/dbInputs", inputs);
			// var oTable = this.getView().byId("searchResults");
			// var items = this.getView().byId("sColListItem");
			// var rEntity = SearchUtil.getResultEntityTypes(mData, objName);
			// sap.ui.getCore().getModel("dbMetadata").setProperty("/resultEntityType", rEntity);
			// this._oTPC = SearchUtil.getResultMetadata(rEntity, objName, oTable, items, this);
		},

		onHaMetadataLoaded: function (modelName, objName) {
			// var mData = this.getView().getModel(modelName).getServiceMetadata();
			// var rModel = new sap.ui.model.json.JSONModel();
			// rModel.setData(mData);
			// sap.ui.getCore().setModel(rModel, "haMetadata");
			this.readSearchOperators(modelName, objName, "HA");
		},

		onPersoButtonPressed: function (oEvent) {
			this._oTPC.openDialog();
		},

		onTablePersoRefresh: function () {
			PersoService.resetPersData();
			this._oTPC.refresh();
		},

		handleSelectChange: function (e) {
			var objName;
			if (this.action === "changeMbom") {
				objName = "MBOM";
			} else if (this.action === "changeEbom") {
				objName = "EBOM";
			} else if (this.action === "changeFlbom") {
				objName = "FBOM";
			} else if (this.action === "changeWbsbom") {
				objName = "WBOM";
			} else if (this.action === "changeOL") {
				objName = "OBJL";
			} else if (this.action === "changeEqui") {
				objName = "EQUI";
			} else if (this.action === "changeFloc") {
				objName = "FLOC";
			} else if (this.action === "changeMpmi") {
				objName = "MPMI";
			} else if (this.action === "changeMspt") {
				objName = "MSPT";
			} else if (this.action === "changeOn") {
				objName = "OBJN";
			} else if (this.action === "changeWC") {
				objName = "WKCT";
			} else if (this.action === "changeGTL") {
				objName = "GTL";
			} else if (this.action === "changeETL") {
				objName = "ETL";
			} else if (this.action === "changeFTL") {
				objName = "FTL";
			}

			// var key = e.getSource().getSelectedKey();
			var key = e.getSource().getSelectedItem().getAdditionalText();
			var oControl = this.getView().byId("idPanel");
			// var oTable = this.getView().byId("searchResults");
			// var items = this.getView().byId("sColListItem");
			var vhModel = this.getView().getModel("valueHelp2");
			if (key === "HA") {
				sap.ui.getCore().getModel("searchType").setProperty("/searchType", key);
				oControl.destroyContent();
				var eTypes = SearchUtil.getEntityTypes(sap.ui.getCore().getModel("haMetadata").getData(), objName);
				var inputs = SearchUtil.getMetadata(eTypes, oControl, "HA", vhModel, this, objName);
				sap.ui.getCore().getModel("haMetadata").setProperty("/haInputs", inputs);
				// oTable.destroyColumns();
				// oTable.destroyItems();
				// items.destroyCells();
				// oTable.setModel();
				// if (this._oTPC) {
				// 	this._oTPC.destroyPersoService();
				// 	this._oTPC.destroy();
				// }
				// var rEntity = SearchUtil.getResultEntityTypes(sap.ui.getCore().getModel("haMetadata").getData(), objName);
				// this._oTPC = SearchUtil.getResultMetadata(rEntity, objName, oTable, items, this);
			} else {
				sap.ui.getCore().getModel("searchType").setProperty("/searchType", key);
				oControl.destroyContent();
				var eTypes = SearchUtil.getEntityTypes(sap.ui.getCore().getModel("dbMetadata").getData(), objName);
				var inputs = SearchUtil.getMetadata(eTypes, oControl, "DB", vhModel, this, objName);
				sap.ui.getCore().getModel("dbMetadata").setProperty("/dbInputs", inputs);
				// oTable.destroyColumns();
				// oTable.destroyItems();
				// items.destroyCells();
				// oTable.setModel();
				// if (this._oTPC) {
				// 	this._oTPC.destroyPersoService();
				// 	this._oTPC.destroy();
				// }
				// var rEntity = SearchUtil.getResultEntityTypes(sap.ui.getCore().getModel("dbMetadata").getData(), objName);
				// this._oTPC = SearchUtil.getResultMetadata(rEntity, objName, oTable, items, this);
			}
		},

		onExit: function () {
			this._oTPC.destroyPersoService();
			this._oTPC.destroy();
		},

		onSearchPress: function (evt) {
			var g = this;
			var oPanel = this.getView().byId("idPanel");
			var oTable = this.getView().byId("searchResults");
			var aContents = oPanel.getContent();
			var aFilters = [],
				searchHelpVal = this.getView().byId("srchMethod").getSelectedKey(); //this.getView().byId("srchMethod").getSelectedItem().getAdditionalText();
			for (var a = 0; a < aContents.length; a++) {
				// var items = aContents[a].getItems();
				// aFilters.push(new sap.ui.model.Filter(items[2].getName(), items[1].getSelectedKey(), items[2].getValue()));
				var o;
				if (a < 1) {
					o = aContents[0].getItems();
					aFilters.push(new sap.ui.model.Filter(o[o.length - 1].getName(), "EQ", o[o.length - 1].getValue().toUpperCase()));
				} else {
					o = aContents[a].getItems();
					aFilters.push(new sap.ui.model.Filter(o[2].getName(), o[1].getSelectedKey(), o[2].getValue().toUpperCase()));
				}

			}
			aFilters.push(new sap.ui.model.Filter("SearchHelp", "EQ", searchHelpVal));
			var type = this.getView().byId("srchMethod").getSelectedKey();

			var oModel, sUrl, oExpand;
			if (this.action === "changeMbom") {
				sUrl = "/PMBOMHDRSearchSet";
				if (type === "DB") {
					oExpand = "PMBOMHDRDBSearch";
				} else {
					oExpand = "PMBOMHDRHASearch";
				}
			} else if (this.action === "changeEbom") {
				sUrl = "/EQBOMHDRSearchSet";
				if (type === "DB") {
					oExpand = "EQBOMHDRDBSearch";
				} else {
					oExpand = "EQBOMHDRHASearch";
				}
			} else if (this.action === "changeFlbom") {
				sUrl = "/FLBOMHDRSearchSet";
				if (type === "DB") {
					oExpand = "FLBOMHDRDBSearch";
				} else {
					oExpand = "FLBOMHDRHASearch";
				}
			} else if (this.action === "changeWbsbom") {
				sUrl = "/WBSBOMHDRSearchSet";
				if (type === "DB") {
					oExpand = "WBSBOMHDRDBSearch";
				} else {
					oExpand = "WBSBOMHDRHASearch";
				}
			} else if (this.action === "changeOL") {
				sUrl = "/OBJLINKSearchSet";
				if (type === "DB") {
					oExpand = "OBJLINKDBSearch";
				} else {
					oExpand = "OBJLINKHASearch";
				}
			} else if (this.action === "changeEqui") {
				sUrl = "/EQUISearchSet";
				if (type === "DB") {
					oExpand = "EQUIDBSearch";
				} else {
					oExpand = "EQUIHASearch";
				}
			} else if (this.action === "changeFloc") {
				sUrl = "/FUNCLOCSearchSet";
				if (type === "DB") {
					oExpand = "FUNCLOCDBSearch";
				} else {
					oExpand = "FUNCLOCHASearch";
				}
			} else if (this.action === "changeMpmi") {
				sUrl = "/MPLANSearchSet";
				if (type === "DB") {
					oExpand = "MPLANDBSearch";
				} else {
					oExpand = "MPLANHASearch";
				}
			} else if (this.action === "changeMspt") {
				sUrl = "/MSPOINTSearchSet";
				if (type === "DB") {
					oExpand = "MSPOINTDBSearch";
				} else {
					oExpand = "MSPOINTHASearch";
				}
			} else if (this.action === "changeOn") {
				sUrl = "/OBJNETWRKSearchSet";
				if (type === "DB") {
					oExpand = "OBJNETWRKDBSearch";
				} else {
					oExpand = "OBJNETWRKHASearch";
				}
			} else if (this.action === "changeWC") {
				sUrl = "/WORKCNTRSearchSet";
				if (type === "DB") {
					oExpand = "WORKCNTRDBSearch";
				} else {
					oExpand = "WORKCNTRHASearch";
				}
			} else if (this.action === "changeGTL") {
				sUrl = "/TLGNHDRSearchSet";
				if (type === "DB") {
					oExpand = "TLGNHDRDBSearch";
				} else {
					oExpand = "TLGNHDRHASearch";
				}
			} else if (this.action === "changeETL") {
				sUrl = "/TLEQHDRSearchSet";
				if (type === "DB") {
					oExpand = "TLEQHDRDBSearch";
				} else {
					oExpand = "TLEQHDRHASearch";
				}
			} else if (this.action === "changeFTL") {
				sUrl = "/TLFLHDRSearchSet";
				if (type === "DB") {
					oExpand = "TLFLHDRDBSearch";
				} else {
					oExpand = "TLFLHDRHASearch";
				}
			}

			if (type === "DB") {
				oModel = this.getView().getModel("DBSearch");
			} else {
				oModel = this.getView().getModel("hanaSearch");
			}

			var maxNo = this.getView().byId("maxNo").getValue();
			maxNo = parseInt(maxNo);
			if (maxNo === "" || maxNo === 0 || isNaN(maxNo)) {
				this.getView().byId("maxNo").setValueState("Error");
				var msg = this.getView().getModel("i18n").getProperty("VALUE_ERR");
				this.showMessage(msg);
				return;
			} else {
				this.getView().byId("maxNo").setValueState("None");
			}
			oTable.setBusy(true);
			oModel.read(sUrl, {
				filters: aFilters,
				urlParameters: {
					"$expand": oExpand,
					"$top": maxNo
				},
				success: function (r) {
					oTable.setBusy(false);
					if (r.results.length > 0) {
						var bomResults;
						if (g.action === "changeMbom") {
							if (type === "DB") {
								bomResults = r.results[0].PMBOMHDRDBSearch.results;
							} else {
								bomResults = r.results[0].PMBOMHDRHASearch.results;
							}
							var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
							if (AIWListMatData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListMatData.length; y++) {
										if (bomResults[z].Matnr === AIWListMatData[y].Matnr && bomResults[z].Werks === AIWListMatData[y].Werks && bomResults[z].Stlan ===
											AIWListMatData[y].Stlan) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeEbom") {
							if (type === "DB") {
								bomResults = r.results[0].EQBOMHDRDBSearch.results;
							} else {
								bomResults = r.results[0].EQBOMHDRHASearch.results;
							}
							var AIWListEqData = sap.ui.getCore().getModel("AIWListEqModel").getData();
							if (AIWListEqData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListEqData.length; y++) {
										if (bomResults[z].Eqnrbom === AIWListEqData[y].Eqnrbom && bomResults[z].Werks === AIWListEqData[y].Werks && bomResults[z]
											.Stlan === AIWListEqData[y].Stlan) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeFlbom") {
							if (type === "DB") {
								bomResults = r.results[0].FLBOMHDRDBSearch.results;
							} else {
								bomResults = r.results[0].FLBOMHDRHASearch.results;
							}
							var AIWListFLData = sap.ui.getCore().getModel("AIWListFLModel").getData();
							if (AIWListFLData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListFLData.length; y++) {
										if (bomResults[z].Tplnrbom === AIWListFLData[y].Tplnrbom && bomResults[z].Werks === AIWListFLData[y].Werks && bomResults[
												z].Stlan === AIWListFLData[y].Stlan) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeWbsbom") {
							if (type === "DB") {
								bomResults = r.results[0].WBSBOMHDRDBSearch.results;
							} else {
								bomResults = r.results[0].WBSBOMHDRHASearch.results;
							}
							var AIWListWBSData = sap.ui.getCore().getModel("AIWListWBSModel").getData();
							if (AIWListWBSData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListWBSData.length; y++) {
										if (bomResults[z].Proid === AIWListWBSData[y].WbsExt && bomResults[z].MatnrWbs === AIWListWBSData[y].Matnr && bomResults[
												z].Werks === AIWListWBSData[y].Werks && bomResults[z].Stlan === AIWListWBSData[y].Stlan) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeOL") {
							if (type === "DB") {
								bomResults = r.results[0].OBJLINKDBSearch.results;
							} else {
								bomResults = r.results[0].OBJLINKHASearch.results;
							}
							var AIWListOLData = sap.ui.getCore().getModel("AIWListOLModel").getData();
							if (AIWListOLData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListOLData.length; y++) {
										if (bomResults[z].Objlink === AIWListOLData[y].link) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeEqui") {
							if (type === "DB") {
								bomResults = r.results[0].EQUIDBSearch.results;
							} else {
								bomResults = r.results[0].EQUIHASearch.results;
							}
							var AIWEQUIData = sap.ui.getCore().getModel("AIWEQUI").getData();
							if (AIWEQUIData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWEQUIData.length; y++) {
										if (bomResults[z].Equi === AIWEQUIData[y].Equnr) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeFloc") {
							if (type === "DB") {
								bomResults = r.results[0].FUNCLOCDBSearch.results;
							} else {
								bomResults = r.results[0].FUNCLOCHASearch.results;
							}
							var AIWFLOCData = sap.ui.getCore().getModel("AIWFLOC").getData();
							if (AIWFLOCData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWFLOCData.length; y++) {
										if (bomResults[z].Funcloc === AIWFLOCData[y].Functionallocation) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeMpmi") {
							if (type === "DB") {
								bomResults = r.results[0].MPLANDBSearch.results;
							} else {
								bomResults = r.results[0].MPLANHASearch.results;
							}
							var AIWMPMIData = sap.ui.getCore().getModel("AIWMPMI").getData();
							if (AIWMPMIData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWMPMIData.length; y++) {
										if (bomResults[z].Mplan === AIWMPMIData[y].Warpl) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeMspt") {
							if (type === "DB") {
								bomResults = r.results[0].MSPOINTDBSearch.results;
							} else {
								bomResults = r.results[0].MSPOINTHASearch.results;
							}
							var AIWMSPTData = sap.ui.getCore().getModel("AIWMSPT").getData();
							if (AIWMSPTData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWMSPTData.length; y++) {
										if (bomResults[z].Mspoint === AIWMSPTData[y].Mspoint) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeOn") {
							if (type === "DB") {
								bomResults = r.results[0].OBJNETWRKDBSearch.results;
							} else {
								bomResults = r.results[0].OBJNETWRKHASearch.results;
							}
							var AIWListONData = sap.ui.getCore().getModel("AIWListONModel").getData();
							if (AIWListONData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListONData.length; y++) {
										if (bomResults[z].Objnetwrk === AIWListONData[y].Objnetwrk) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeWC") {
							if (type === "DB") {
								bomResults = r.results[0].WORKCNTRDBSearch.results;
							} else {
								bomResults = r.results[0].WORKCNTRHASearch.results;
							}
							var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
							if (AIWListWCData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListWCData.length; y++) {
										if (bomResults[z].Arbpl === AIWListWCData[y].wc) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeGTL") {
							if (type === "DB") {
								bomResults = r.results[0].TLGNHDRDBSearch.results;
							} else {
								bomResults = r.results[0].TLGNHDRHASearch.results;
							}
							var AIWListGTLData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
							if (AIWListGTLData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListGTLData.length; y++) {
										if (bomResults[z].Tlgnhdr === AIWListGTLData[y].grp) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeETL") {
							if (type === "DB") {
								bomResults = r.results[0].TLEQHDRDBSearch.results;
							} else {
								bomResults = r.results[0].TLEQHDRHASearch.results;
							}
							var AIWListETLData = sap.ui.getCore().getModel("AIWListETLModel").getData();
							if (AIWListETLData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListETLData.length; y++) {
										if (bomResults[z].Tlgnhdr === AIWListETLData[y].grp) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						} else if (g.action === "changeFTL") {
							if (type === "DB") {
								bomResults = r.results[0].TLFLHDRDBSearch.results;
							} else {
								bomResults = r.results[0].TLFLHDRHASearch.results;
							}
							var AIWListFTLData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
							if (AIWListFTLData.length > 0 && bomResults.length > 0) {
								for (var z = 0; z < bomResults.length; z++) {
									for (var y = 0; y < AIWListFTLData.length; y++) {
										if (bomResults[z].Tlgnhdr === AIWListFTLData[y].grp) {
											bomResults[z].UsmdActive = "1";
											break;
										}
									}
								}
							}
						}
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(bomResults);
						oTable.setModel(oModel);

						if (g.action === "changeGTL" || g.action === "changeETL" || g.action === "changeFTL") {
							var aTableItems = oTable.getItems();
							if (aTableItems.length > 0) {
								for (var z = 0; z < aTableItems.length; z++) {
									aTableItems[z].setType("Inactive");
								}
							}
						}
					} else {
						oTable.setModel();
					}
				},
				error: function (err) {

				}
			});
		},

		onUpdateFinished: function (oEvent) {
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");

			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("RESULTS", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("RESULTS", ["0"]);
			}
			this.getView().byId("title").setText(sTitle);
		},

		onPress: function (oEvent) { //onSearchItemPress
			var sPath = oEvent.getSource().getBindingContext().sPath;
			var index = parseInt(sPath.substr(1));
			var results = oEvent.getSource().getBindingContext().getProperty(sPath);

			if (this.action.indexOf("bom") > -1) {
				var w = " ",
					e = " ";
				if (this.action === "changeMbom")
					e = results.Matnr;
				if (this.action === "changeEbom")
					e = results.Eqnrbom;
				if (this.action === "changeFlbom")
					e = results.Tplnrbom;
				if (this.action === "changeWbsbom") {
					w = results.Proid;
					e = results.MatnrWbs;
				}
				var p = results.Werks;
				var u = results.Stlan;
				var Crstatus = results.UsmdActive === "1" ? "true" : "false";

				this.getRouter().navTo("detail", {
					FragmentName: this.action,
					itemPath: encodeURIComponent(sPath),
					e: e,
					p: p,
					u: u,
					cr: Crstatus,
					w: w,
					mode: "request"
				});
			} else if (this.action === "changeOL") {
				var link = results.Objlink;
				var status = results.UsmdActive === "1" ? "true" : "false";
				var mode = "Create";
				this.getRouter().navTo("olDetail", {
					itemPath: encodeURIComponent(sPath),
					action: this.action,
					link: link,
					status: status,
					mode: mode
				});
			} else if (this.action === "changeEqui") {
				var sEqunr = results.Equi;
				var sCrStatus = results.UsmdActive === "1" ? "true" : "false";

				this.getRouter().navTo("detailEqui", {
					Path: encodeURIComponent(index),
					ViewName: "ChangeEqui",
					Equi: sEqunr,
					CrStatus: sCrStatus
				});
			} else if (this.action === "changeFloc") {
				var sTplnr = results.Funcloc;
				var sCrStatus = results.UsmdActive === "1" ? "true" : "false";

				this.getRouter().navTo("detailFloc", {
					Path: encodeURIComponent(index),
					ViewName: "ChangeFloc",
					Floc: sTplnr,
					CrStatus: sCrStatus
				});
			} else if (this.action === "changeMpmi") {
				var sMplan = results.Mplan;
				var sCrStatus = results.UsmdActive === "1" ? "true" : "false";

				this.getRouter().navTo("detailMpmi", {
					Path: encodeURIComponent(index),
					ViewName: "ChangeMpmi",
					Mplan: sMplan,
					CrStatus: sCrStatus
				});
			} else if (this.action === "changeMspt") {
				var sMspoint = results.Mspoint;
				var sCrStatus = results.UsmdActive === "1" ? "true" : "false";

				this.getRouter().navTo("detailMspt", {
					Path: encodeURIComponent(index),
					ViewName: "ChangeMspt",
					Mspt: sMspoint,
					CrStatus: sCrStatus
				});
			} else if (this.action === "changeOn") {
				var netId = results.Objnetwrk;
				var obj = results.Ntobjtyp;
				var status = results.UsmdActive === "1" ? "true" : "false";

				if (obj === "") { //29.08
					obj = " ";
				}
				this.getRouter().navTo("ONdetail", {
					itemPath: encodeURIComponent(sPath),
					action: "Change",
					netId: netId,
					objType: obj,
					status: status,
					mode: "request"
				});
			} else if (this.action === "changeWC") {
				var wc = results.Arbpl;
				var status = results.UsmdActive === "1" ? "true" : "false";
				var plant = results.Werks;
				var mode = "Create";

				this.getRouter().navTo("wcDetail", {
					itemPath: encodeURIComponent(sPath),
					action: this.action,
					wc: wc,
					status: status,
					plant: plant,
					mode: mode
				});
			}
		},

		onSelect: function (oEvent) {
			this.onSearchItemSelect(oEvent);
		},

		onSearchItemSelect: function (oEvent) {
			this.selectedIndices = oEvent.getSource()._aSelectedPaths;
			if (oEvent.getSource()._aSelectedPaths.length > 0) {
				this.getView().byId("idImportMocr").setEnabled(true);
			} else {
				this.getView().byId("idImportMocr").setEnabled(false);
			}
		},

		onImportToMocrPress: function () {
			var g = this;
			var MessageList = [];
			var successCount = 0;
			var searchData = this.getView().byId("searchResults").getModel().getData(); //this.getView().getModel("searchResultModel").getData();
			if (this.selectedIndices.length > 0) {
				for (var i = 0; i < this.selectedIndices.length; i++) {
					var existFlag = false;
					var index = this.selectedIndices[i].split("/")[1];
					index = parseInt(index);
					if (this.action === "changeMbom") {
						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") {
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"BoM is already locked in another CR"
								message: searchData[index].Message
							});
							continue;
						}
						var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
						if (AIWListMatData.length > 0) {
							for (var j = 0; j < AIWListMatData.length; j++) {
								if (AIWListMatData[j].Matnr === searchData[index].Matnr && AIWListMatData[j].Werks === searchData[index].Werks &&
									AIWListMatData[j].Stlan === searchData[index].Stlan && AIWListMatData[j].Stalt === searchData[index].Stalt) {
									var msg = g.getResourceBundle().getText("matBomErr") + searchData[index].Matnr + "/" + searchData[index].Werks + "/" +
										searchData[index].Stlan + "/" + searchData[index].Stalt + " " + g.getResourceBundle().getText("locked");
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readBomDetails(searchData[index].Matnr, searchData[index].Werks, searchData[index].Stlan, searchData[index].Stalt);
						}
					}
					if (this.action === "changeEbom") {
						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") {
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"BoM is already locked in another CR"
								message: searchData[index].Message
							});
							continue;
						}
						var AIWListEqData = sap.ui.getCore().getModel("AIWListEqModel").getData();
						if (AIWListEqData.length > 0) {
							for (var j = 0; j < AIWListEqData.length; j++) {
								if (AIWListEqData[j].Eqnrbom === searchData[index].Eqnrbom && AIWListEqData[j].Werks === searchData[index].Werks &&
									AIWListEqData[j].Stlan === searchData[index].Stlan) {
									var msg = g.getResourceBundle().getText("equiBomErr") + searchData[index].Eqnrbom + "/" + searchData[index].Werks + "/" +
										searchData[index].Stlan + " " + g.getResourceBundle().getText("locked");
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readBomDetails(searchData[index].Eqnrbom, searchData[index].Werks, searchData[index].Stlan);
						}
					}
					if (this.action === "changeFlbom") {
						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") {
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"BoM is already locked in another CR"
								message: searchData[index].Message
							});
							continue;
						}
						var AiwListFLData = sap.ui.getCore().getModel("AIWListFLModel").getData();
						if (AiwListFLData.length > 0) {
							for (var j = 0; j < AiwListFLData.length; j++) {
								if (AiwListFLData[j].Tplnrbom === searchData[index].Tplnrbom && AiwListFLData[j].Werks === searchData[index].Werks &&
									AiwListFLData[j].Stlan === searchData[index].Stlan) {
									var msg = g.getResourceBundle().getText("flocBomErr") + searchData[index].Tplnrbom + "/" + searchData[index].Werks + "/" +
										searchData[index].Stlan + " " + g.getResourceBundle().getText("locked");
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readBomDetails(searchData[index].Tplnrbom, searchData[index].Werks, searchData[index].Stlan);
						}
					}
					if (this.action === "changeWbsbom") {
						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") {
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"BoM is already locked in another CR"
								message: searchData[index].Message
							});
							continue;
						}
						var AiwListWBSData = sap.ui.getCore().getModel("AIWListWBSModel").getData();
						if (AiwListWBSData.length > 0) {
							for (var j = 0; j < AiwListWBSData.length; j++) {
								if (AiwListWBSData[j].WbsExt === searchData[index].Proid && AiwListWBSData[j].Matnr === searchData[index].MatnrWbs &&
									AiwListWBSData[j].Werks === searchData[index].Werks && AiwListWBSData[j].Stlan === searchData[index].Stlan) {
									var msg = g.getResourceBundle().getText("wbsBomErr") + searchData[index].Proid + "/" + searchData[index].MatnrWbs + "/" +
										searchData[index].Werks + "/" + searchData[index].Stlan + " " + g.getResourceBundle().getText("locked");
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readBomDetails(searchData[index].MatnrWbs, searchData[index].Werks, searchData[index].Stlan, searchData[index].Proid);
						}
					}
					if (this.action === "changeOL") {
						if (searchData[index].UsmdActive === "1") {
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"Object Link is already locked in another CR"
								message: searchData[index].Message
							});
							continue;
						}
						var AIWListOLData = sap.ui.getCore().getModel("AIWListOLModel").getData();
						if (AIWListOLData.length > 0) {
							for (var j = 0; j < AIWListOLData.length; j++) {
								if (AIWListOLData[j].link === searchData[index].Objlink && AIWListOLData[j].netId === searchData[index].Netid &&
									AIWListOLData[j].Kantyp === searchData[index].Kantyp) {
									var msg = this.getResourceBundle().getText("OBJ_LINK") + " " + searchData[index].Objlink + "/" + searchData[index].Netid +
										"/" + searchData[index].Kantyp + " " + this.getResourceBundle().getText("locked");
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readLinkData(searchData[index].Objlink);
						}
					}
					if (this.action === "changeEqui") {
						this.oSearchModelName = "AIWEQUI";
						this.oModelName = "AIWEQUISearch";
						ValueHelpRequest.handleImportToMocr(this);
						return;
					}
					if (this.action === "changeFloc") {
						this.oSearchModelName = "AIWFLOC";
						this.oModelName = "AIWFLOCSearch";
						ValueHelpRequest.handleImportToMocr(this);
						return;
					}
					if (this.action === "changeMpmi") {
						this.oSearchModelName = "AIWMPMI";
						this.oModelName = "AIWMPMISearch";
						ValueHelpRequest.handleImportToMocr(this);
						return;
					}
					if (this.action === "changeMspt") {
						this.oSearchModelName = "AIWMSPT";
						this.oModelName = "AIWMSPTSearch";
						ValueHelpRequest.handleImportToMocr(this);
						return;
					}
					if (this.action === "changeOn") {
						if (searchData[index].UsmdActive === "1") {
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"BoM is already locked in anathor CR"
								message: searchData[index].Message
							});
							continue;
						}
						var AIWListONModel = sap.ui.getCore().getModel("AIWListONModel").getData();
						if (AIWListONModel.length > 0) {
							for (var j = 0; j < AIWListONModel.length; j++) {
								if (AIWListONModel[j].Objnetwrk === searchData[index].Objnetwrk) {
									var msg = this.getResourceBundle().getText("objNetErr") + searchData[index].Objnetwrk + " " + this.getResourceBundle().getText(
										"locked");
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readNetworkData(searchData[index].Objnetwrk, searchData[index].Ntobjtyp);
						}
					}
					if (this.action === "changeWC") {
						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") { //searchData[index].CrStatus === true
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"Work Center is already locked in anathor CR" //searchData[index].Message
								message: searchData[index].Message
							});
							continue;
						}
						var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
						if (AIWListWCData.length > 0) {
							for (var j = 0; j < AIWListWCData.length; j++) {
								if (AIWListWCData[j].wc === searchData[index].Arbpl && AIWListWCData[j].plant === searchData[index].Werks) {
									var msg = "Work Center " + searchData[index].Arbpl + "/" + searchData[index].Werks + this.getResourceBundle().getText(
										"locked");
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readWCDetails(searchData[index].Arbpl, searchData[index].Werks);
						}
					}
					if (this.action === "changeGTL") {
						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") { //searchData[index].CrStatus === true
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"TaskList is already locked in anathor CR" //searchData[index].Message
								message: searchData[index].Message
							});
							continue;
						}
						var AIWListGTLData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
						if (AIWListGTLData.length > 0) {
							for (var j = 0; j < AIWListGTLData.length; j++) {
								if (AIWListGTLData[j].grp === searchData[index].Tlgnhdr) {
									var msg = "General Task List " + searchData[index].Tlgnhdr + " already locked in this CR";
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readTaskListDetails(searchData[index].Tlgnhdr, searchData[index].PlntyGn);
						}
					}
					if (this.action === "changeETL") {
						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") { //searchData[index].CrStatus === true
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"TaskList is already locked in anathor CR" //searchData[index].Message
								message: searchData[index].Message
							});
							continue;
						}
						var AIWListETLData = sap.ui.getCore().getModel("AIWListETLModel").getData();
						if (AIWListETLData.length > 0) {
							for (var j = 0; j < AIWListETLData.length; j++) {
								if (AIWListETLData[j].grp === searchData[index].Tleqhdr && AIWListETLData[j].equipment === searchData[index].Equnr2eth) {
									var msg = "Equipment Task List " + searchData[index].Tleqhdr + "/" + searchData[index].Equnr2eth +
										" already locked in this CR";
									MessageList.push({
										type: "Error",
										title: searchData[index].Message, //msg
										message: searchData[index].Message
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readTaskListDetails(searchData[index].Tleqhdr, searchData[index].PlntyEq);
						}
					}
					if (this.action === "changeFTL") {
						if (searchData[index].UsmdActive && searchData[index].UsmdActive === "1") { //searchData[index].CrStatus === true
							MessageList.push({
								type: "Error",
								title: searchData[index].Message, //"TaskList is already locked in anathor CR" //searchData[index].Message
								message: searchData[index].Message
							});
							continue;
						}
						var AIWListFTLData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
						if (AIWListFTLData.length > 0) {
							for (var j = 0; j < AIWListFTLData.length; j++) {
								if (AIWListFTLData[j].grp === searchData[index].Tlflhdr && AIWListFTLData[j].floc === searchData[index].Tplnr2fth) {
									var msg = "Functional Location Task List " + searchData[index].Tlflhdr + "/" + searchData[index].Tplnr2fth +
										" already locked in this CR";
									MessageList.push({
										type: "Error",
										title: msg,
										message: msg
									});
									existFlag = true;
									break;
								}
							}
						}
						if (!existFlag) {
							successCount = successCount + 1;
							this.readTaskListDetails(searchData[index].Tlflhdr, searchData[index].PlntyFl);
						}
					}
				}
				this.createMessagePopover(MessageList, successCount);
			} else {
				//add code for not selecting boms from list
			}
		},

		readBomDetails: function (e, p, u, w) {
			var g = this;
			var m = this.getView().getModel();
			var url = "/ChangeRequestSet";
			var oFilter;
			var oExpand;
			if (this.action === "changeMbom") {
				var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
				oFilter = [new sap.ui.model.Filter("Matnr", "EQ", e),
					new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Stlan", "EQ", u),
					new sap.ui.model.Filter("Stalt", "EQ", w)
				];
				oExpand = ["MRBHeader", "MRBItem", "MRBSBIT"];
			}
			if (this.action === "changeEbom") {
				var AIWListEqData = sap.ui.getCore().getModel("AIWListEqModel").getData();
				oFilter = [new sap.ui.model.Filter("Eqnrbom", "EQ", e),
					new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Stlan", "EQ", u)
				];
				oExpand = ["EBHeader", "EBItem", "EBSBIT"];
			}
			if (this.action === "changeFlbom") {
				var AIWListFLData = sap.ui.getCore().getModel("AIWListFLModel").getData();
				oFilter = [new sap.ui.model.Filter("Tplnrbom", "EQ", e),
					new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Stlan", "EQ", u)
				];
				oExpand = ["FBHeader", "FBItem", "FBSBIT"];
			}
			if (this.action === "changeWbsbom") {
				var AIWListWBSData = sap.ui.getCore().getModel("AIWListWBSModel").getData();
				oFilter = [new sap.ui.model.Filter("Proid", "EQ", w),
					new sap.ui.model.Filter("Matnr", "EQ", e),
					new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Stlan", "EQ", u)
				];
				oExpand = ["WBHeader", "WBItem", "WBSBIT"];
			}

			this.BusyDialog.open();
			m.read(url, {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					g.BusyDialog.close();
					if (r.results[0].Message !== "") {
						// sap.m.MessageToast.show(r.results[0].Message, {
						// 	duration: 5000,
						// 	animationDuration: 5000
						// });
						g.createMessagePopover2(r.results[0].Message, "Information");
						return;
					}
					if (g.action === "changeMbom") {
						var h = r.results[0].MRBHeader.results[0];
						var i = r.results[0].MRBItem.results;
						var s = r.results[0].MRBSBIT.results;
						if (h !== undefined) {
							var mObj = {
								Matnr: h.Matnr,
								Werks: h.Werks,
								Stlan: h.Stlan,
								Stalt: h.Stalt,
								Bomstatus: h.Bomstatus,
								Lngtxt: h.Txtmi,
								Stktx: h.Stktx,
								Validfrom: g.getDateFormat(h.Dvalidfrm),
								BaseQty: h.Baseqty,
								BaseUom: h.Baseuom,
								Validtoda: g.getDateFormat(h.Validtoda),

								MatDesc: h.Maktx,
								WerksDesc: h.Plantname,
								StlanDesc: h.Bomusagetxt,
								BomstatusText: h.Bomstatustxt,
								matEnable: false,
								plantEnable: false,
								usageEnable: false,
								altbomEnable: false,
								crtMatHdrEnable: false,
								crtMatEnable: false,
								addItemEnable: true,
								matValueState: "None",
								plantValueState: "None",
								usageValueState: "None",
								statusValueState: "None",
								BaseQtyValueState: "None",

								bomType: "Change",
								modeFlag: "Delete",

								matItem: [],
								matSubItem: []
							};

							if (i && i.length > 0) {
								mObj.matItem = i;
								for (var j = 0; j < mObj.matItem.length; j++) {
									mObj.matItem[j].itmCatState = "None";
									mObj.matItem[j].itmCompState = "None";
									mObj.matItem[j].itmQtyState = "None";
									mObj.matItem[j].itmUOMState = "None";
									mObj.matItem[j].itmCatEnable = false;
									mObj.matItem[j].itmQtyEnable = true;
									mObj.matItem[j].Costgrelv = mObj.matItem[j].Costgrelv === "" ? "0" : mObj.matItem[j].Costgrelv;
									mObj.matItem[j].Rvrel = mObj.matItem[j].Rvrel === "" ? "0" : mObj.matItem[j].Rvrel;
									mObj.matItem[j].ItmcmpdescEnabled = true;
								}
								g.sLastItemNum = i.length;
							} else {
								mObj.matItem = [];
							}

							if (s && s.length > 0) {
								mObj.matSubItem = s;
							} else {
								mObj.matSubItem = [];
							}

							AIWListMatData.push(mObj);
							sap.ui.getCore().getModel("AIWListMatModel").setSizeLimit(AIWListMatData.length);
							sap.ui.getCore().getModel("AIWListMatModel").refresh();
						}
					}
					if (g.action === "changeEbom") {
						var h = r.results[0].EBHeader.results[0];
						var i = r.results[0].EBItem.results;
						var s = r.results[0].EBSBIT.results;
						if (h !== undefined) {
							var eObj = {
								Eqnrbom: h.Eqnrbom,
								Werks: h.Werks,
								Stlan: h.Stlan,
								Bomstatus: h.Bomstatus,
								Lngtxt: h.Txtmi,
								Validfrom: g.getDateFormat(h.Dvalidfrm),
								BaseQty: h.Baseqty,
								BaseUom: h.Baseuom,
								Validtoda: g.getDateFormat(h.Validtoda),

								EquiDesc: h.Eqktx,
								WerksDesc: h.Plantname,
								StlanDesc: h.Bomusagetxt,
								BomstatusText: h.Bomstatustxt,
								equipEnable: false,
								plantEnable: false,
								usageEnable: false,
								addItemEnable: true,
								equipValueState: "None",
								plantValueState: "None",
								usageValueState: "None",
								statusValueState: "None",
								BaseQtyValueState: "None",

								bomType: "Change", //New code
								modeFlag: "Delete", //New code

								eqItem: [],
								eqSubItem: []
							};

							if (i && i.length > 0) {
								eObj.eqItem = i;
								for (var j = 0; j < eObj.eqItem.length; j++) {
									eObj.eqItem[j].itmCatState = "None";
									eObj.eqItem[j].itmCompState = "None";
									eObj.eqItem[j].itmQtyState = "None";
									eObj.eqItem[j].itmUOMState = "None";
									eObj.eqItem[j].itmCatEnable = false;
									eObj.eqItem[j].itmQtyEnable = true;
									eObj.eqItem[j].Costgrelv = eObj.eqItem[j].Costgrelv === "" ? "0" : eObj.eqItem[j].Costgrelv;
									eObj.eqItem[j].Rvrel = eObj.eqItem[j].Rvrel === "" ? "0" : eObj.eqItem[j].Rvrel;
									eObj.eqItem[j].ItmcmpdescEnabled = false;
								}
							} else {
								eObj.eqItem = [];
							}

							if (s && s.length > 0) {
								eObj.eqSubItem = s;
							} else {
								eObj.eqSubItem = [];
							}

							AIWListEqData.push(eObj);
							sap.ui.getCore().getModel("AIWListEqModel").setSizeLimit(AIWListEqData.length);
							sap.ui.getCore().getModel("AIWListEqModel").refresh();
						}
					}
					if (g.action === "changeFlbom") {
						var h = r.results[0].FBHeader.results[0];
						var i = r.results[0].FBItem.results;
						var s = r.results[0].FBSBIT.results;
						if (h !== undefined) {
							var flObj = {
								Tplnrbom: h.Tplnrbom,
								Werks: h.Werks,
								Stlan: h.Stlan,
								Bomstatus: h.Bomstatus,
								Lngtxt: h.Txtmi,
								Validfrom: g.getDateFormat(h.Dvalidfrm),
								BaseQty: h.Baseqty,
								BaseUom: h.Baseuom,
								Validtoda: g.getDateFormat(h.Validtoda),

								FLDesc: h.Pltxt,
								WerksDesc: h.Plantname,
								StlanDesc: h.Bomusagetxt,
								BomstatusText: h.Bomstatustxt,
								FLEnable: false,
								plantEnable: false,
								usageEnable: false,
								addItemEnable: true,
								FLValueState: "None",
								plantValueState: "None",
								usageValueState: "None",
								statusValueState: "None",
								BaseQtyValueState: "None",

								bomType: "Change", //New code
								modeFlag: "Delete", //New code

								flItem: [],
								flSubItem: []
							};
							if (i && i.length > 0) {
								flObj.flItem = i;
								for (var j = 0; j < flObj.flItem.length; j++) {
									flObj.flItem[j].itmCatState = "None";
									flObj.flItem[j].itmCompState = "None";
									flObj.flItem[j].itmQtyState = "None";
									flObj.flItem[j].itmUOMState = "None";
									flObj.flItem[j].itmCatEnable = false;
									flObj.flItem[j].itmQtyEnable = true;
									flObj.flItem[j].ItmcmpdescEnabled = false;
								}
								g.sLastItemNum = i.length;
							} else {
								flObj.flItem = [];
							}

							if (s && s.length > 0) {
								flObj.flSubItem = s;
							} else {
								flObj.flSubItem = [];
							}

							AIWListFLData.push(flObj);
							sap.ui.getCore().getModel("AIWListFLModel").setSizeLimit(AIWListFLData.length);
							sap.ui.getCore().getModel("AIWListFLModel").refresh();
						}
					}
					if (g.action === "changeWbsbom") {
						var h = r.results[0].WBHeader.results[0];
						var i = r.results[0].WBItem.results;
						var s = r.results[0].WBSBIT.results;
						if (h !== undefined) {
							var wbsObj = {
								WbsExt: h.WbsExt,
								Matnr: h.MatnrWbs,
								Werks: h.Werks,
								Stlan: h.Stlan,
								Bomstatus: h.Bomstatus,
								Lngtxt: h.Txtmi,
								Validfrom: g.getDateFormat(h.Dvalidfrm),
								BaseQty: h.Baseqty,
								BaseUom: h.Baseuom,
								Validtoda: g.getDateFormat(h.Validtoda),

								WbsDesc: h.Post1,
								MatDesc: h.Maktx,
								WerksDesc: h.Plantname,
								StlanDesc: h.Bomusagetxt,
								BomstatusText: h.Bomstatustxt,
								wbsEnable: false,
								matEnable: false,
								plantEnable: false,
								usageEnable: false,
								addItemEnable: true,
								wbsValueState: "None",
								matValueState: "None",
								plantValueState: "None",
								usageValueState: "None",
								statusValueState: "None",
								BaseQtyValueState: "None",
								crtMatHdrEnable: false,

								bomType: "Change",
								modeFlag: "Delete",

								wbsItem: [],
								wbsSubItem: []
							};
							if (i && i.length > 0) {
								wbsObj.wbsItem = i;
								for (var j = 0; j < wbsObj.wbsItem.length; j++) {
									wbsObj.wbsItem[j].itmCatState = "None";
									wbsObj.wbsItem[j].itmCompState = "None";
									wbsObj.wbsItem[j].itmQtyState = "None";
									wbsObj.wbsItem[j].itmUOMState = "None";
									wbsObj.wbsItem[j].itmCatEnable = false;
									wbsObj.wbsItem[j].itmQtyEnable = true;
									wbsObj.wbsItem[j].ItmcmpdescEnabled = false;
								}
								g.sLastItemNum = i.length;
							} else {
								wbsObj.wbsItem = [];
							}

							if (s && s.length > 0) {
								wbsObj.wbsSubItem = s;
							} else {
								wbsObj.wbsSubItem = [];
							}

							AIWListWBSData.push(wbsObj);
							sap.ui.getCore().getModel("AIWListWBSModel").setSizeLimit(AIWListWBSData.length);
							sap.ui.getCore().getModel("AIWListWBSModel").refresh();
						}
					}
				},
				error: function (err) {
					g.BusyDialog.close();
				}
			});
		},

		readLinkData: function (l) {
			var g = this;
			var m = this.getView().getModel();
			var AIWListOLData = sap.ui.getCore().getModel("AIWListOLModel").getData();
			var oFilter = [new sap.ui.model.Filter("Objlink", "EQ", l)];
			var oExpand = ["OLClass", "OLVal", "Olink", "OLLAM"];
			this.tempOLimportArray = [];
			this.tempImportCounter = 0;

			function readStatusProf(d) {
				//var q = "/DeriveOLstatusSet(NETYP='" + d + "',STSMA='')";
				var q = "/DeriveOLstatusSet('" + d + "')";
				m.read(q, {
					success: function (r) {
						if (g.tempImportCounter !== g.successCount) {
							AIWListOLData = sap.ui.getCore().getModel("AIWListOLModel").getData();
							if (r.Statproftxt !== "" && (r.Ustw_oln !== "" || r.Uswo_oln !== "")) {
								g.tempOLimportArray[g.tempImportCounter].usrSts = r.Usta_oln;
								g.tempOLimportArray[g.tempImportCounter].stProfLblV = true;
								g.tempOLimportArray[g.tempImportCounter].stsProf = r.Stsm_oln;
								g.tempOLimportArray[g.tempImportCounter].stsProfV = true;
								g.tempOLimportArray[g.tempImportCounter].stsProfDesc = r.Statproftxt;
								g.tempOLimportArray[g.tempImportCounter].stsProfDescV = true;
								g.tempOLimportArray[g.tempImportCounter].stsObj = r.Ustw_oln;
								g.tempOLimportArray[g.tempImportCounter].stsObjLblV = true;
								g.tempOLimportArray[g.tempImportCounter].stsObjV = true;
								g.tempOLimportArray[g.tempImportCounter].stsWoLblV = true;
								g.tempOLimportArray[g.tempImportCounter].stsWoNoV = true;
								g.tempOLimportArray[g.tempImportCounter].stsWoNo = r.Uswo_oln;
								g.tempOLimportArray[g.tempImportCounter].sysSts = r.Stattext;
							} else {
								g.tempOLimportArray[g.tempImportCounter].stProfLblV = false;
								g.tempOLimportArray[g.tempImportCounter].stsProfV = false;
								g.tempOLimportArray[g.tempImportCounter].stsProfDescV = false;
								g.tempOLimportArray[g.tempImportCounter].stsObjLblV = false;
								g.tempOLimportArray[g.tempImportCounter].stsObjV = false;
								g.tempOLimportArray[g.tempImportCounter].stsWoLblV = false;
								g.tempOLimportArray[g.tempImportCounter].stsWoNoV = false;
								g.tempOLimportArray[g.tempImportCounter].usrSts = "";
								g.tempOLimportArray[g.tempImportCounter].stsProf = "";
								g.tempOLimportArray[g.tempImportCounter].stsProfDesc = "";
								g.tempOLimportArray[g.tempImportCounter].stsObj = "";
								g.tempOLimportArray[g.tempImportCounter].stsWoNo = "";
								g.tempOLimportArray[g.tempImportCounter].sysSts = "";
							}

							AIWListOLData.push(g.tempOLimportArray[g.tempImportCounter]);
							g.tempImportCounter = g.tempImportCounter + 1;
							sap.ui.getCore().getModel("AIWListOLModel").setData(AIWListOLData);
							sap.ui.getCore().getModel("AIWListOLModel").setSizeLimit(AIWListOLData.length);
							sap.ui.getCore().getModel("AIWListOLModel").refresh();
						}
					},
					error: function (err) {}
				});
			}

			g.BusyDialog.open();
			m.read("/ChangeRequestSet", {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					g.BusyDialog.close();
					if (r.results.length > 0) {
						var h = r.results[0];
						var d = h.Olink.results[0];
						if (d !== null) {
							g.linkCat = d.Netyp;
							g.objCat = d.Kantyp;
							g.olData = {
								mode: "change",
								link: d.Objlink,
								Netyp: d.Netyp,
								linkCat: d.Netyp,
								linkCatDesc: d.Netyptxt,
								Kantyp: d.Kantyp,
								objCat: d.Kantyp,
								objCatDesc: d.Kantyptxt,
								linkDesc: d.Txtmi,
								netId: d.Netid,
								netIdDesc: d.Netidtxt,
								linkNum: d.Lfdknr,
								autGrp: d.Begru,
								autGrpDesc: d.Begtx,
								validFrm: formatter.getDateFormat(d.Datva),
								timeFrm: formatter.getTime(d.Zeitva),
								validTo: formatter.getDateFormat(d.Datvb),
								timeTo: formatter.getTime(d.Zeitvb),
								medium: d.Mediu,
								mediumDesc: d.Medkxt,
								linkCatEn: false,
								linkCatVS: "None",
								objCatEn: false,
								objCatVS: "None",
								linkFrmFlEn: true,
								linkToFlEn: true,
								linkObjFlEn: true,
								linkFromEQEn: true,
								linkToEQEn: true,
								linkObjEqEn: true,
								linkFEqLblRQ: true,
								linkToEqLblRQ: true,
								linkFrmEq: "",
								linkFrmEqDesc: "",
								linkToEq: "",
								linkToEqDesc: "",
								linkObjEq: "",
								linkObjEqDesc: "",
								linkFrmflLblV: false,
								linkFrmFlV: false,
								linkFrmFlDescV: false,
								linkToFlLblV: false,
								linkToFlV: false,
								linkToFlDescV: false,
								linkObjFlLblV: false,
								linkObjFlV: false,
								linkObjFlDescV: false,
								linkFrmEqLblV: true,
								linkFrmEqV: true,
								linkFrmEqDescV: true,
								linkToEqLblV: true,
								linkToEQV: true,
								linkToEqDescV: true,
								linkObjEqLblV: true,
								linkObjEqV: true,
								linkObjEqDescV: true,
								usrSts: "",
								stProfLblV: true,
								stsProf: "",
								stsProfV: true,
								stsProfDesc: "",
								stsProfDescV: true,
								stsObj: "",
								stsObjLblV: true,
								stsObjV: true,
								stsWoLblV: true,
								stsWoNoV: true,
								stsWoNo: ""
							};
							if (g.objCat === "E") {
								g.olData.linkCatEn = false;
								g.olData.linkCatVS = "None";
								g.olData.objCatEn = false;
								g.olData.objCatVS = "None";
								g.olData.linkFrmFlEn = false;
								g.olData.linkToFlEn = false;
								g.olData.linkObjFlEn = false;
								g.olData.linkFEqLblRQ = true;
								g.olData.linkToEqLblRQ = true;
								g.olData.linkFrmEq = d.Eqvon;
								g.olData.linkFrmEqDesc = d.Eqtxtf;
								g.olData.linkToEq = d.Eqnach;
								g.olData.linkToEqDesc = d.Eqtxtt;
								g.olData.linkObjEq = d.Eqkant;
								g.olData.linkObjEqDesc = d.Eqtxtl;
								g.olData.linkFrmflLblV = false;
								g.olData.linkFrmFlV = false;
								g.olData.linkFrmFlDescV = false;
								g.olData.linkToFlLblV = false;
								g.olData.linkToFlV = false;
								g.olData.linkToFlDescV = false;
								g.olData.linkObjFlLblV = false;
								g.olData.linkObjFlV = false;
								g.olData.linkObjFlDescV = false;
								g.olData.linkFrmEqLblV = true;
								g.olData.linkFrmEqV = true;
								g.olData.linkFrmEqDescV = true;
								g.olData.linkToEqLblV = true;
								g.olData.linkToEQV = true;
								g.olData.linkToEqDescV = true;
								g.olData.linkObjEqLblV = true;
								g.olData.linkObjEqV = true;
								g.olData.linkObjEqDescV = true;
								/*AIWListOLData.push(g.olData);
								sap.ui.getCore().getModel("AIWListOLModel").setData(AIWListOLData);
								sap.ui.getCore().getModel("AIWListOLModel").refresh();*/
								readStatusProf(g.linkCat);
							} else if (g.objCat === "T") {
								g.olData.linkCatEn = false;
								g.olData.linkCatVS = "None";
								g.olData.objCatEn = false;
								g.olData.objCatVS = "None";
								g.olData.linkFromEQEn = false;
								g.olData.linkToEQEn = false;
								g.olData.linkObjEqEn = false;
								g.olData.linkFrmflLblRQ = true;
								g.olData.linkToFlLblRQ = true;
								g.olData.linkFrmFl = d.Tpvon;
								g.olData.linkFrmFlDesc = d.Fltxtf;
								g.olData.linkToFl = d.Tpnach;
								g.olData.linkToFlDesc = d.Fltxtt;
								g.olData.linkObjFl = d.Tpkant;
								g.olData.linkObjFlDesc = d.Fltxtl;
								g.olData.linkFrmflLblV = true;
								g.olData.linkFrmFlV = true;
								g.olData.linkFrmFlDescV = true;
								g.olData.linkToFlLblV = true;
								g.olData.linkToFlV = true;
								g.olData.linkToFlDescV = true;
								g.olData.linkObjFlLblV = true;
								g.olData.linkObjFlV = true;
								g.olData.linkObjFlDescV = true;
								g.olData.linkFrmEqLblV = false;
								g.olData.linkFrmEqV = false;
								g.olData.linkFrmEqDescV = false;
								g.olData.linkToEqLblV = false;
								g.olData.linkToEQV = false;
								g.olData.linkToEqDescV = false;
								g.olData.linkObjEqLblV = false;
								g.olData.linkObjEqV = false;
								g.olData.linkObjEqDescV = false;
								/*AIWListOLData.push(g.olData);
								sap.ui.getCore().getModel("AIWListOLModel").setData(AIWListOLData);
								sap.ui.getCore().getModel("AIWListOLModel").refresh();*/

								readStatusProf(g.linkCat);
							}

							if (d.Bezarp === "2") {
								// g._oView.byId("twoWayRel").setSelected(true);
								g.olData.twoWayRel = true;
								g.olData.oneWayRel = false;
							} else if (d.Bezarp === "1") {
								// g._oView.byId("oneWayRel").setSelected(true);
								g.olData.oneWayRel = true;
								g.olData.twoWayRel = false;
							}

							if (d.Bezarl === "2") {
								// g._oView.byId("twoWayUsd").setSelected(true);
								g.olData.twoWayUsd = true;
								g.olData.oneWayUsd = false;
								g.olData.relNotUsd = false;
							} else if (d.Bezarl === "1") {
								// g._oView.byId("oneWayUsd").setSelected(true);
								g.olData.oneWayUsd = true;
								g.olData.relNotUsd = false;
								g.olData.twoWayUsd = false;
							} else if (d.Bezarl === "0") {
								// g._oView.byId("relNotUsd").setSelected(true);
								g.olData.relNotUsd = true;
								g.olData.oneWayUsd = false;
								g.olData.twoWayUsd = false;
							}

							var lamData = h.OLLAM.results;
							var lModel = new sap.ui.model.json.JSONModel();
							lModel.setData(lamData);
							g.olData.LAM = lamData;

							var classList = h.OLClass.results;
							if (classList) {
								if (classList.length > 0) {
									for (var i = 0; i < classList.length; i++) {
										classList[i].ctEnable = false;
										classList[i].classEnable = false;
										classList[i].ClassTypeDesc = classList[i].Artxt;
										delete classList[i].Artxt;
										sClassList[i].ClassDesc = sClassList[i].Kltxt;
										delete sClassList[i].Kltxt;
										delete classList[i].Changerequestid;
										delete classList[i].Clint;
										delete classList[i].Service;
										classList[i].classDelEnable = true;
									}
									var cModel = new sap.ui.model.json.JSONModel();
									cModel.setData(classList);
									g.olData.Class = classList;
									// g.class.setModel(cModel);
								}
							}

							var charList = h.OLVal.results;
							if (charList) {
								if (charList.length > 0) {
									for (var j = 0; j < charList.length; j++) {
										charList[j].cNameEnable = false;
										charList[j].Textbz = charList[j].Atwtb;
										delete charList[j].Ataut;
										delete charList[j].Ataw1;
										delete charList[j].Atawe;
										delete charList[j].Atcod;
										delete charList[j].Atflb;
										delete charList[j].Atflv;
										delete charList[j].Atimb;
										delete charList[j].Atsrt;
										delete charList[j].Atvglart;
										delete charList[j].Atzis;
										delete charList[j].Changerequestid;
										delete charList[j].CharName;
										delete charList[j].Charid;
										delete charList[j].Classtype;
										delete charList[j].Service;
										delete charList[j].Valcnt;
										charList[j].slNo = j + 1;
										charList[j].flag = charList[j].Class + "-" + charList[j].slNo;
									}
									var _cModel = new sap.ui.model.json.JSONModel();
									_cModel.setData(charList);
									g.olData.Char = charList;
									// g.char.setModel(_cModel);
									// g.chData = charList;
								}

								for (var z = 0; z < g.olData.Char.length; z++) {
									var count = 1;
									for (var y = 0; y < g.olData.Char.length; y++) {
										if (z === y) {
											continue;
										}
										if (g.olData.Char[y].Atnam === g.olData.Char[z].Atnam) {
											count++;
										}
									}
									if (count > 1) {
										g.olData.Char[z].charDltEnable = true;
									} else {
										g.olData.Char[z].charDltEnable = false;
									}
								}
							}
						}
						g.tempOLimportArray.push(g.olData);
					}
				},
				error: function (err) {
					g.BusyDialog.close();
				}
			});
		},

		readNetworkData: function (n, o, s) {
			var g = this;
			var m = this.getView().getModel();
			var AIWListONData = sap.ui.getCore().getModel("AIWListONModel").getData();
			var oFilter = [new sap.ui.model.Filter("Objnetwrk", "EQ", n), new sap.ui.model.Filter("Kantyp", "EQ", o)];
			//var oExpand = ["ObjNetwork" ,"NetworklAM", "NetworkOL", "NetworkOLLAM", "ObjlinkCLS", "ObjlinkCHAR", "NetworkEVT", "NetworkATTR", "Network_ALAMSet", "nwstextSet"];
			var oExpand = ["ONLAM", "ONText", "ONetwork", "ONWClass", "ONVal", "ONALAM", "ONatevt", "ONattrp", "ONLink", "ONLLAM"];
			var url = "/ChangeRequestSet";
			this.BusyDialog.open();
			m.read(url, {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					g.BusyDialog.close();
					if (r.results.length > 0) {
						g.match = true;
						var d = r.results[0];
						var onObj = {};
						onObj.onType = "Change";
						var objNetwork = d.ONetwork.results;
						if (objNetwork.length > 0) {
							var obj = objNetwork[0];
							onObj.Objnetwrk = obj.Objnetwrk;
							onObj.Netgrp = obj.Netgrp;
							onObj.Netwtyp = obj.Netwtyp;
							onObj.Netxt = obj.Netxt;
							onObj.NetgrpDesc = obj.NetgroupTxt;
							onObj.NetwtypDesc = obj.NettypeTxt;
							onObj.NetgrpValueState = "None";
							onObj.NetwtypValueState = "None";
							onObj.NetIDEnable = false; // news
						}
						if (o === "E") {
							onObj.Ntobjtyp = "EQ";
						} else if (o === "T") {
							onObj.Ntobjtyp = "FL";
						} else {
							onObj.Ntobjtyp = "";
						}

						var networkLam = d.ONLAM.results;
						if (networkLam.length > 0) {
							var lamObj = networkLam[0];
							onObj.lam = {
								Lrpid: lamObj.Lrpid,
								Strtptatr: lamObj.Strtptatr,
								Endptatr: lamObj.Endptatr,
								Length: parseInt(lamObj.Length),
								LinUnit: lamObj.LinUnit,
								LinUnitDesc: lamObj.Uomtext,
								Startmrkr: lamObj.Startmrkr,
								Endmrkr: lamObj.Endmrkr,
								Mrkdisst: lamObj.Mrkdisst,
								Mrkdisend: lamObj.Mrkdisend,
								MrkrUnit: lamObj.MrkrUnit,
								LrpidDesc: lamObj.LrpDescr,
								enableLrp: true,
								enableMarker: true,
								LrpidVS: "None",
								StrtptatrVS: "None",
								EndptatrVS: "None",
								LinUnitVS: "None",
								StartmrkrVS: "None",
								EndmrkrVS: "None",
								MrkdisstVS: "None",
								MrkdisendVS: "None",
								MrkrUnitVS: "None"
							};
						} else {
							onObj.lam = {
								Lrpid: "",
								Strtptatr: "",
								Endptatr: "",
								Length: "",
								LinUnit: "",
								LinUnitDesc: "",
								Startmrkr: "",
								Endmrkr: "",
								Mrkdisst: "",
								Mrkdisend: "",
								MrkrUnit: "",
								LrpidDesc: "",
								enableLrp: true,
								enableMarker: false,
								LrpidVS: "None",
								StrtptatrVS: "None",
								EndptatrVS: "None",
								LinUnitVS: "None",
								StartmrkrVS: "None",
								EndmrkrVS: "None",
								MrkdisstVS: "None",
								MrkdisendVS: "None",
								MrkrUnitVS: "None"
							};
						}

						AIWListONData.push(onObj);
						sap.ui.getCore().getModel("AIWListONModel").setSizeLimit(AIWListONData.length);
						sap.ui.getCore().getModel("AIWListONModel").refresh();
					}
					g.BusyDialog.close();
				},
				error: function (err) {
					g.BusyDialog.close();
				}
			});
		},

		readWCDetails: function (w, p) {
			var g = this;
			var m = this.getView().getModel();
			var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
			var oFilter = new sap.ui.model.Filter("Arbpl", "EQ", w);
			var oFilter2 = new sap.ui.model.Filter("Werks", "EQ", p);
			g.BusyDialog.open();
			m.read("/ChangeRequestSet", {
				filters: [oFilter, oFilter2],
				urlParameters: {
					"$expand": "Workcenter,WCCapa,WCCost,ValueWC,ClassWC"
				},
				success: function (r) {
					g.BusyDialog.close();
					if (r.results.length > 0) {
						var h = r.results[0].Workcenter.results[0];
						var wcData = h;
						if (wcData) {
							wcData.mode = "change";
							wcData.wc = h.Arbpl;
							wcData.wcDesc = h.Txtmi;
							wcData.plant = h.Werks;
							wcData.plantDesc = h.Plantdesc;
							wcData.wcCat = h.Verwe;
							wcData.wcCatDesc = h.Ktext;
							wcData.person = h.Crveran;
							wcData.personDesc = h.Persresptxt;
							wcData.usg = h.Planv;
							wcData.usgDesc = h.UsageTxt;
							wcData.stdVal = h.Vgwts;
							wcData.stdValDesc = h.Vgwtx;
							wcData.ctrlKey = h.Crsteus;
							wcData.ctrlKeyDesc = h.Steutxt;

							wcData.wcValueState = "None";
							wcData.wcDescValueState = "None";
							wcData.plantValueState = "None";
							wcData.wcCatValueState = "None";
							wcData.personResValueState = "None";
							wcData.usgValueState = "None";
							wcData.stdValueState = "None";
							wcData.cntrlKeyValueState = "None";

							wcData.wcValueStateTxt = "";
							wcData.wcDescValueStateTxt = "";
							wcData.plantValueStateTxt = "";
							wcData.wcCatValueStateTxt = "";
							wcData.personResValueStateTxt = "";
							wcData.usgValueStateTxt = "";
							wcData.stdValueStateTxt = "";
							wcData.cntrlKeyValueStateTxt = "";
							wcData.wcEnable = false;
							wcData.plEnable = false;
							wcData.wcatEnable = false;

							wcData.cost = [];
							wcData.capacity = [];
							wcData.classItems = [];
							wcData.characteristics = [];

							var cost = r.results[0].WCCost.results;
							if (cost) {
								if (cost.length > 0) {
									var cModel = new sap.ui.model.json.JSONModel();
									cModel.setData(cost);
									// g.cost.setModel(cModel);
									wcData.cost = cost;
								}
							}

							var capacity = r.results[0].WCCapa.results;
							if (capacity) {
								if (capacity.length > 0) {
									var capModel = new sap.ui.model.json.JSONModel();
									capModel.setData(capacity);
									wcData.capacity = capacity;
								}
							}

							var classList = r.results[0].ClassWC.results;
							if (classList) {
								if (classList.length > 0) {
									for (var i = 0; i < classList.length; i++) {
										classList[i].ctEnable = false;
										classList[i].classEnable = false;
										classList[i].ClassTypeDesc = classList[i].Artxt;
										delete classList[i].Artxt;
										classList[i].ClassDesc = classList[i].Kltxt;
										delete classList[i].Kltxt;
										delete classList[i].Changerequestid;
										delete classList[i].Clint;
										delete classList[i].Service;
										classList[i].classDelEnable = true;
									}
									// var cModel = new sap.ui.model.json.JSONModel();
									// cModel.setData(classList);
									// g.class.setModel(cModel);
									wcData.classItems = classList;
								}
							}

							var charList = r.results[0].ValueWC.results;
							if (charList) {
								if (charList.length > 0) {
									for (var j = 0; j < charList.length; j++) {
										charList[j].cNameEnable = false;
										charList[j].Textbz = charList[j].Atwtb;
										delete charList[j].Ataut;
										delete charList[j].Ataw1;
										delete charList[j].Atawe;
										delete charList[j].Atcod;
										delete charList[j].Atflb;
										delete charList[j].Atflv;
										delete charList[j].Atimb;
										delete charList[j].Atsrt;
										delete charList[j].Atvglart;
										delete charList[j].Atzis;
										delete charList[j].Changerequestid;
										delete charList[j].CharName;
										delete charList[j].Charid;
										delete charList[j].Classtype;
										delete charList[j].Service;
										delete charList[j].Valcnt;
										charList[j].slNo = j + 1;
										charList[j].flag = charList[j].Class + "-" + charList[j].slNo;
									}
									// var _cModel = new sap.ui.model.json.JSONModel();
									// _cModel.setData(charList);
									// g.char.setModel(_cModel);
									// g.chData = charList;
									wcData.characteristics = charList;

									for (var z = 0; z < wcData.characteristics.length; z++) {
										var count = 1;
										for (var y = 0; y < wcData.characteristics.length; y++) {
											if (z === y) {
												continue;
											}
											if (wcData.characteristics[y].Atnam === wcData.characteristics[z].Atnam) {
												count++;
											}
										}
										if (count > 1) {
											wcData.characteristics[z].charDltEnable = true;
										} else {
											wcData.characteristics[z].charDltEnable = false;
										}
									}
								}
							}
						}

						AIWListWCData.push(wcData);
						sap.ui.getCore().getModel("AIWListWCModel").setData(AIWListWCData);
						sap.ui.getCore().getModel("AIWListWCModel").refresh();
					}
				},
				error: function (err) {
					g.BusyDialog.close();
					var error = [];
					if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror.errordetails
						.length === 0) {
						error[0] = JSON.parse(err.responseText).error.message.value;
					} else {
						for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
							error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
						}
					}
					var value = error.join("\n");
					MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {}
					});
				}
			});
		},

		readTaskListDetails: function (Plnnr, Plnty) {
			var g = this;
			var m = this.getView().getModel();
			var url;
			var AIWListGTLData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
			var AIWListETLData = sap.ui.getCore().getModel("AIWListETLModel").getData();
			var AIWListFTLData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
			var url = "/ChangeRequestSet";
			var oFilter = [new sap.ui.model.Filter("Plnnr", "EQ", Plnnr),
				new sap.ui.model.Filter("Plnty", "EQ", Plnty),
				new sap.ui.model.Filter("CopyCreate", "EQ", false)
			];
			if (this.action === "changeGTL") {
				var oExpand = ["GTClass", "GTComp", "GTInsp", "GTList", "GTMPack", "GTMpackRead", "GTOprs", "GTPRT", "GTRel", "GTSpack", "GTVal"];
			} else if (this.action === "changeETL") {
				var oExpand = ["ETClass", "ETComp", "ETInsp", "ETList", "ETMPack", "ETMpackRead", "ETOprs", "ETPRT", "ETRel", "ETSpack", "ETVal"];
			} else if (this.action === "changeFTL") {
				var oExpand = ["FTClass", "FTComp", "FTInsp", "FTList", "FTMPack", "FTMpackRead", "FTOprs", "FTPRT", "FTRel", "FTSpack", "FTVal"];
			}
			g.BusyDialog.open();
			m.read(url, {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					g.BusyDialog.close();
					if (r.results.length > 0) {
						var d = r.results[0];
						var message = r.results[0].Message;
						var components, compModel, classList, charList, cModel, _cModel;
						if (g.action === "changeGTL") {
							if (d.GTList.results.length > 0) {
								var gtlData = {
									mode: "change",
									validFrm: formatter.getDateFormat(d.Datuv),
									grp: r.results[0].Plnnr,
									header: [],
									operation: [],
									component: [],
									Class: [],
									Char: [],
									modeflag: "Chg",
									typeFlag: "G",
									MaintPckg: [],
									KDenable: false
								};
								var header = d.GTList.results;
								if (header.length > 0) {
									gtlData.header = header;
									for (var h = 0; h < header.length; h++) {
										gtlData.header[h].PPenable = false;
										gtlData.header[h].pPlantDesc = header[h].Iwerktxt;
										gtlData.header[h].usageDesc = header[h].TlUsgTxt;
										gtlData.header[h].plGrpDesc = header[h].Plnnrgrptxt;
										gtlData.header[h].statusDesc = header[h].Statustxt;
										gtlData.header[h].sysCondDesc = header[h].Anlzux;
										gtlData.header[h].stratDesc = header[h].Strattxt;
										gtlData.header[h].Plnal = header[h].Tplnal;
										gtlData.header[h].Verwe = header[h].Tverwe;
										gtlData.header[h].plEnable = false;
										gtlData.header[h].valueStateT = "None";
										gtlData.header[h].valueStatePP = "None";
										gtlData.header[h].valueStateU = "None";
										gtlData.header[h].valueStateS = "None";
										gtlData.header[h].tlusg = header[h].Tverwe;
										gtlData.header[h].Iwerk = header[h].Werks;
										gtlData.header[h].wc = header[h].Tarbpl;
										gtlData.header[h].plant = header[h].Wcplant;
										gtlData.header[h].grp = header[h].Tlgnhdr;
										gtlData.header[h].Ktext = header[h].Ktext;
										gtlData.header[h].assmbly = header[h].Istru;
										gtlData.header[h].assmblyDesc = header[h].Istrux;
										gtlData.header[h].insPt = header[h].Slwbez;
										gtlData.header[h].insPtDesc = header[h].Slwbeztxt;

										gtlData.header[h].vEquiLbl = false;
										gtlData.header[h].vEqui = false;
										gtlData.header[h].vEquiDesc = false;
										gtlData.header[h].vFlocLbl = false;
										gtlData.header[h].vFloc = false;
										gtlData.header[h].vFlocDesc = false;
										gtlData.header[h].bAddComponent = true;
									}
									var oModel = new sap.ui.model.json.JSONModel();
									oModel.setData(header);
								}
								var operation = d.GTOprs.results;
								if (operation.length > 0) {
									gtlData.operation = operation;
									var oprRel = d.GTRel.results;
									var SrvPckgOvrw = d.GTSpack.results;
									var maintPckg = d.GTMPack.results;
									var maintPckgDefault = d.GTMpackRead.results;
									var aPrt = d.GTPRT.results;
									var aInsp = d.GTInsp.results;
									for (var o = 0; o < operation.length; o++) {
										gtlData.operation[o].calcKeyDesc = "";
										gtlData.operation[o].actTypDesc = "";
										gtlData.operation[o].flag = operation[o].Tplnal + "-" + operation[o].Vornr;
										gtlData.operation[o].Arbpl = operation[o].TlArbpl;
										gtlData.operation[o].Plnal = operation[o].Tplnal;
										gtlData.operation[o].opState = "None";
										gtlData.operation[o].opDescState = "None";
										gtlData.operation[o].wcState = "None";
										gtlData.operation[o].plantState = "None";
										gtlData.operation[o].ctrlKeyState = "None";
										gtlData.operation[o].Werks = operation[o].Werks2gop;
										gtlData.operation[o].Steus = operation[o].Steus2gop;
										gtlData.operation[o].workPerc = operation[o].Prznt;
										gtlData.operation[o].orderQty = operation[o].Bmvrg;
										gtlData.operation[o].ordQtyUnit = operation[o].Bmeih;
										gtlData.operation[o].netPrice = operation[o].Opreis;
										gtlData.operation[o].currency = operation[o].Owaers;
										gtlData.operation[o].priceUnit = operation[o].Opeinh;
										gtlData.operation[o].costElement = operation[o].Sakto2gop;
										gtlData.operation[o].materialGrp = operation[o].Omatkl;
										gtlData.operation[o].puchGroup = operation[o].Oekgrp;
										gtlData.operation[o].purchOrg = operation[o].Ekorg;
										gtlData.operation[o].Uvorn = operation[o].Uvorn;
										gtlData.operation[o].UvornEnable = false;
										gtlData.operation[o].equi = operation[o].EqunrGop;
										gtlData.operation[o].floc = operation[o].TplnrGop;
										gtlData.operation[o].OprRel = [];
										gtlData.operation[o].SrvPckgOvrw = [];
										gtlData.operation[o].PRT = [];
										gtlData.operation[o].InspChar = [];

										if (oprRel.length > 0) {
											for (var x in oprRel) {
												if (gtlData.grp === oprRel[x].Tlgnhdr && gtlData.operation[o].Plnal === oprRel[x].Tplnal && gtlData.operation[o].Vornr ===
													oprRel[x].Vorn2) {
													var objOprRel = {
														Plnal: oprRel[x].Tplnal,
														Vornr: oprRel[x].Vorn2,
														OperationOR: oprRel[x].Vornrgrel,
														Offset: oprRel[x].Dauer,
														OUn: oprRel[x].Zeinh,
														RelType: oprRel[x].Aobar,
														PO: oprRel[x].Gprznt,
														OI: oprRel[x].Provg,
														ID: oprRel[x].Gkalid,
														WrkCtrOR: oprRel[x].Arbplgrel,
														PlantOR: oprRel[x].Werksgrel,
														OperationORVS: "None",
														OffsetVS: "None",
														OUnVS: "None",
														RelTypeVS: "None",
														POVS: "None",
														OIVS: "None",
														IDVS: "None",
														WrkCtrORVS: "None",
														PlantORVS: "None",
													}
													gtlData.operation[o].OprRel.push(objOprRel);
												}
											}
										}

										if (SrvPckgOvrw.length > 0) {
											for (var x in SrvPckgOvrw) {
												if (gtlData.grp === SrvPckgOvrw[x].Tlgnhdr && gtlData.operation[o].Plnal === SrvPckgOvrw[x].Tplnal && gtlData.operation[
														o].Vornr === SrvPckgOvrw[x].Vornrr) {
													var oSPO = {
														group: SrvPckgOvrw[x].Tlgnhdr,
														Plnal: SrvPckgOvrw[x].Tplnal,
														Vornr: SrvPckgOvrw[x].Vornrr,
														LineNum: SrvPckgOvrw[x].SrvLine,
														DelIndSP: formatter.statusSel(SrvPckgOvrw[x].Del),
														ActNum: SrvPckgOvrw[x].Srvpos,
														ShrtTxt: SrvPckgOvrw[x].Ktext1,
														Qty: SrvPckgOvrw[x].Mengegspk,
														BUomSP: SrvPckgOvrw[x].Meinsgspk,
														GrossPrc: SrvPckgOvrw[x].Tbtwr,
														CurKey: SrvPckgOvrw[x].Waersgspk,
														Work: SrvPckgOvrw[x].IntWork,
														UnitOfWork: SrvPckgOvrw[x].Iwein,
														ActNumVS: "None",
														ShrtTxtVS: "None",
														QtyVS: "None",
														BUomSPVS: "None",
														GrossPrcVS: "None",
														CurKeyVS: "None",
														WorkVS: "None",
														UnitOfWorkVS: "None",
														DelIndSPEnabled: false,
														SPEnabled: true
													};
													gtlData.operation[o].SrvPckgOvrw.push(oSPO);
												}
											}
										}

										if (aPrt.length > 0) {
											for (var x in aPrt) {
												if (gtlData.grp === aPrt[x].Tlgnhdr && gtlData.operation[o].Plnal === aPrt[x].Tplnal && gtlData.operation[o].Vornr ===
													aPrt[x].Vornrgprt) {
													var objPRT = {
														grp: aPrt[x].Tlgnhdr,
														Plnal: aPrt[x].Tplnal,
														Vornr: aPrt[x].Vornrgprt,

														ItmNum: aPrt[x].Psnfh,
														ItmCat: aPrt[x].Fhmar,
														// PRT: aPrt[x].Fhmnr,
														Plant: aPrt[x].Fhwrk, //PRTDesc
														Mat: aPrt[x].Matnrgprt,
														MatDesc: "",
														Equi: aPrt[x].EqunrGpt,
														EquiDesc: "",
														Mspt: aPrt[x].Eqpnt,
														MsptDesc: "",
														doc: aPrt[x].Dokargprt,
														docDesc: "",
														docType: aPrt[x].Doknrgprt,
														docTypeDesc: "",
														docPart: aPrt[x].Doktlgprt,
														docVersion: aPrt[x].Dokvrgprt,
														Othr: aPrt[x].Fhmnr,
														OthrDesc: "",
														Qty: aPrt[x].Mgvgw,
														UOM: aPrt[x].Mgeinh,
														QtyFrmla: aPrt[x].Mgform,
														PRTCtrl: aPrt[x].Steuf,
														PRTCtrlDesc: aPrt[x].Stftxt,
														StdUsgVal: aPrt[x].Ewvgw,
														StdUsgUOM: aPrt[x].Eweinh,
														UsgValFrmla: aPrt[x].Ewform,
														PRTVS: "None",
														PlantVS: "None",
														QtyVS: "None",
														UOMVS: "None",
														QtyFrmlaVS: "None",
														PRTCtrlVS: "None",
														StdUsgValVS: "None",
														StdUsgUOMVS: "None",
														UsgValFrmlaVS: "None",
													}

													if (objPRT.ItmCat === "M") {
														objPRT.PRT = objPRT.Mat;
														objPRT.title = "Material";
														objPRT.matEnable = true;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
														objPRT.Plant = gtlData.operation[o].Werks;
													} else if (objPRT.ItmCat === "E") {
														objPRT.PRT = objPRT.Equi;
														objPRT.title = "Equipment";
														objPRT.matEnable = false;
														objPRT.eqEnable = true;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
													} else if (objPRT.ItmCat === "P") {
														objPRT.PRT = objPRT.Mspt;
														objPRT.title = "Measuring Point";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = true;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
													} else if (objPRT.ItmCat === "D") {
														objPRT.PRT = objPRT.doc + "-" + objPRT.docType + "-" + objPRT.docPart + "-" + objPRT.docVersion;
														objPRT.title = "Document";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = true;
														objPRT.othEnable = false;
														objPRT.docType = "";
														objPRT.docTypeDesc = "";
														objPRT.docPart = "";
														objPRT.docVersion = "";
													} else if (objPRT.ItmCat === "O") {
														objPRT.PRT = objPRT.Othr;
														objPRT.title = "Others";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = true;
													}
													gtlData.operation[o].PRT.push(objPRT);
												}
											}
										}

										if (aInsp.length > 0) {
											for (var x in aInsp) {
												if (gtlData.grp === aInsp[x].Tlgnhdr && gtlData.operation[o].Plnal === aInsp[x].Tplnal && gtlData.operation[o].Vornr ===
													aInsp[x].Vornrgins) {
													var objInsp = {
														group: aInsp[x].Tlgnhdr,
														Plnal: aInsp[x].Tplnal,
														Vornr: aInsp[x].Vornrgins,

														InspChar: aInsp[x].Merknr,
														PrstInd: aInsp[x].Vste2gins,
														QuanChar: formatter.statusSel(aInsp[x].Quantitat),
														QualChar: formatter.statusSel(aInsp[x].QpmkRef),
														MastInspChar: aInsp[x].Verw2gins,
														Plant: aInsp[x].Uzae2tlgn,
														Version: aInsp[x].Ver2tlgni,
														ShrtTxt: aInsp[x].Kurztext,
														InspMthd: aInsp[x].Pmth2gins,
														InspMthdPlnt: aInsp[x].Qwe2tlgni,
														TolKey: aInsp[x].Toleranzs,
														VrsnInspMthd: aInsp[x].Pmtversio,
														SampProc: aInsp[x].Stichprve,
														SampUOM: aInsp[x].Probemgeh,
														BaseSampQty: aInsp[x].Pruefeinh,
														CodeGrp: aInsp[x].Auswmenge,

														MastInspCharVS: "None",
														PlantVS: "None",
														VersionVS: "None",
														InspMthdVS: "None",
														InspMthdPlntVS: "None",
														SampProcVS: "None"
													};

													gtlData.operation[o].InspChar.push(objInsp);
												}
											}
										}

										var currReadMpack = [];
										if (maintPckgDefault.length > 0) {
											for (var w in maintPckgDefault) {
												if (gtlData.grp === maintPckgDefault[w].Tlgnhdr && gtlData.operation[o].Plnal === maintPckgDefault[w].Tplnal) {
													currReadMpack.push(maintPckgDefault[w]);
												}
											}
										}

										var currSelMpack = [];
										if (maintPckg.length > 0) {
											for (var x in maintPckg) {
												if (gtlData.grp === maintPckg[x].Tlgnhdr && gtlData.operation[o].Plnal === maintPckg[x].Tplnal &&
													gtlData.operation[o].Vornr === maintPckg[x].Vorn2gmpk) {
													currSelMpack.push(maintPckg[x]);
												}
											}
										}

										var oMaintPckg = {};
										if (currReadMpack.length > 0) {
											oMaintPckg = {
												Plnal: currReadMpack[0].Tplnal,
												Vornr: gtlData.operation[o].Vornr,
												Strat: currReadMpack[0].Startgmpk,
												SOp: "",
												Ltxa1: gtlData.operation[o].Ltxa1,
												flag: currReadMpack[0].Tplnal + "-" + gtlData.operation[o].Vornr,
												MPArr: [],
											};
											for (var f in currReadMpack) {
												var currReadObj = currReadMpack[f];
												oMaintPckg[currReadObj.Paketgmpk] = false;
											}
										}

										if (currSelMpack.length > 0) {
											for (var z in currSelMpack) {
												currSelMpack[z].Vornr = currSelMpack[z].Vorn2gmpk;
												currSelMpack[z].Strat = currSelMpack[z].Startgmpk;
												currSelMpack[z].Paket = currSelMpack[z].Paketgmpk;

												var currSelObj = currSelMpack[z];
												if (currSelMpack[z].IsSelected === 'X') {
													oMaintPckg[currSelObj.Paketgmpk] = true;
												}
											}
											oMaintPckg.MPArr = currSelMpack;
										}
										gtlData.MaintPckg.push(oMaintPckg);
									}
									var oprModel = new sap.ui.model.json.JSONModel();
									oprModel.setData(operation);
								}
								var component = d.GTComp.results;
								if (component.length > 0) {
									gtlData.component = component;
									for (var c = 0; c < component.length; c++) {
										gtlData.component[c].matDesc = component[c].Maktx;
										gtlData.component[c].slNo = c + 1;
										gtlData.component[c].Plnal = component[c].Tplnal;
										gtlData.component[c].flag = component[c].Tplnal + "-" + component[c].Vornr + "-" + gtlData.component[c].slNo;
										gtlData.component[c].hFlag = component[c].Tplnal + "-" + component[c].Vornr;
										gtlData.component[c].bom = component[c].Stlnrgcmp;
										gtlData.component[c].bomCat = component[c].Stltygcmp;
										gtlData.component[c].bomCatDesc = component[c].Stltygcmptxt;
										gtlData.component[c].altBom = component[c].Stlal;
									}
									g.cmpData = component;
									compModel = new sap.ui.model.json.JSONModel();
									compModel.setData(component);
									// g.getModel("tlDetailModel").setProperty("/component", component);
								}
								classList = d.GTClass.results;
								if (classList) {
									if (classList.length > 0) {
										for (var i = 0; i < classList.length; i++) {
											classList[i].ctEnable = false;
											classList[i].classEnable = false;
											classList[i].ClassTypeDesc = classList[i].Artxt;
											delete classList[i].Artxt;
											sClassList[i].ClassDesc = sClassList[i].Kltxt;
											delete sClassList[i].Kltxt;
											delete classList[i].Changerequestid;
											delete classList[i].Clint;
											delete classList[i].Service;
											classList[i].classDelEnable = true;
											classList[i].slNo = i + 1;
											classList[i].Plnal = classList[i].Tplnal;
											classList[i].flag = classList[i].Tplnal + "-" + classList[i].slNo;
										}
										g.cData = classList;
										cModel = new sap.ui.model.json.JSONModel();
										cModel.setData(classList);
										gtlData.Class = classList;
									}
								}
								charList = d.GTVal.results;
								if (charList) {
									if (charList.length > 0) {
										for (var j = 0; j < charList.length; j++) {
											charList[j].cNameEnable = false;
											charList[j].Textbz = charList[j].Atwtb;
											delete charList[j].Ataut;
											delete charList[j].Ataw1;
											delete charList[j].Atawe;
											delete charList[j].Atcod;
											delete charList[j].Atflb;
											delete charList[j].Atflv;
											delete charList[j].Atimb;
											delete charList[j].Atsrt;
											delete charList[j].Atvglart;
											delete charList[j].Atzis;
											delete charList[j].Changerequestid;
											delete charList[j].CharName;
											delete charList[j].Charid;
											delete charList[j].Classtype;
											delete charList[j].Service;
											delete charList[j].Valcnt;
											charList[j].slNo = j + 1;
											charList[j].Plnal = charList[j].Tplnal;
											charList[j].flag = charList[j].Tplnal + "-" + charList[j].Class + "-" + charList[j].slNo;
										}
										g.chData = charList;
										_cModel = new sap.ui.model.json.JSONModel();
										_cModel.setData(charList);
										gtlData.Char = charList;
									}
									for (var z = 0; z < gtlData.Char.length; z++) {
										var count = 1;
										for (var y = 0; y < gtlData.Char.length; y++) {
											if (z === y) {
												continue;
											}
											if (gtlData.Char[y].Atnam === gtlData.Char[z].Atnam) {
												count++;
											}
										}
										if (count > 1) {
											gtlData.Char[z].charDltEnable = true;
										} else {
											gtlData.Char[z].charDltEnable = false;
										}
									}
								}
								AIWListGTLData.push(gtlData);
								sap.ui.getCore().getModel("AIWListGTLModel").setData(AIWListGTLData);
								sap.ui.getCore().getModel("AIWListGTLModel").setSizeLimit(AIWListGTLData.length);
								sap.ui.getCore().getModel("AIWListGTLModel").refresh();
							}
						} else if (g.action === "changeETL") {
							if (d.ETList.results.length > 0) {
								var header = d.ETList.results[0];
								var etlData = {
									mode: "change",
									validFrm: formatter.getDateFormat(d.Datuv),
									grp: r.results[0].Plnnr,
									equipment: r.results[0].ETList.results[0].Eq2tl,
									equipmentDesc: r.results[0].ETList.results[0].Eqktx,
									modeflag: "Chg",
									typeFlag: "E",
									header: [],
									operation: [],
									component: [],
									MaintPckg: [],
									KDenable: false
								};
								var header = d.ETList.results;
								if (header.length > 0) {
									etlData.header = header;
									for (var h = 0; h < header.length; h++) {
										etlData.header[h].pPlantDesc = header[h].Iwerktxt;
										etlData.header[h].usageDesc = header[h].TlUsgTxt;
										etlData.header[h].plGrpDesc = header[h].Plnnrgrptxt;
										etlData.header[h].statusDesc = header[h].Statustxt;
										etlData.header[h].sysCondDesc = header[h].Anlzux;
										etlData.header[h].stratDesc = header[h].Strattxt;
										etlData.header[h].Plnal = header[h].Tplnal;
										etlData.header[h].Verwe = header[h].Tverwe;
										etlData.header[h].plEnable = false;
										// etlData.header[h].Ktext = header.Eqktx;
										etlData.header[h].valueStateT = "None";
										etlData.header[h].valueStatePP = "None";
										etlData.header[h].valueStateU = "None";
										etlData.header[h].valueStateS = "None";
										etlData.header[h].equipment = header[h].Eq2tl;
										etlData.header[h].equipmentDesc = header[h].Eqktx;
										etlData.header[h].tlusg = header[h].Tverwe;
										etlData.header[h].Iwerk = header[h].Werks;
										etlData.header[h].wc = header[h].Tarbpl;
										etlData.header[h].plant = header[h].Wcplant;
										etlData.header[h].grp = header[h].Tlgnhdr;
										etlData.header[h].Ktext = header[h].Ktext;
										etlData.header[h].assmbly = header[h].Istru;
										etlData.header[h].assmblyDesc = header[h].Istrux;
										etlData.header[h].insPt = header[h].Slwbez;
										etlData.header[h].insPtDesc = header[h].Slwbeztxt;
										etlData.header[h].vEquiLbl = true;
										etlData.header[h].vEqui = true;
										etlData.header[h].vEquiDesc = true;
										etlData.header[h].vFlocLbl = false;
										etlData.header[h].vFloc = false;
										etlData.header[h].vFlocDesc = false;
										etlData.header[h].bAddComponent = true;
									}
									var oModel = new sap.ui.model.json.JSONModel();
									oModel.setData(etlData.header);
								}
								var operation = d.ETOprs.results;
								if (operation.length > 0) {
									etlData.operation = operation;
									var oprRel = d.ETRel.results;
									var SrvPckgOvrw = d.ETSpack.results;
									var maintPckg = d.ETMPack.results;
									var maintPckgDefault = d.ETMpackRead.results;
									var aPrt = d.ETPRT.results;
									var aInsp = d.ETInsp.results;
									for (var o = 0; o < operation.length; o++) {
										etlData.operation[o].calcKeyDesc = "";
										etlData.operation[o].actTypDesc = "";
										etlData.operation[o].flag = operation[o].Tplnal + "-" + operation[o].Vornr;
										etlData.operation[o].Arbpl = operation[o].TlArbpl;
										etlData.operation[o].Plnal = operation[o].Tplnal;
										etlData.operation[o].opState = "None";
										etlData.operation[o].opDescState = "None";
										etlData.operation[o].wcState = "None";
										etlData.operation[o].plantState = "None";
										etlData.operation[o].ctrlKeyState = "None";
										etlData.operation[o].Werks = operation[o].Werks2eop;
										etlData.operation[o].Steus = operation[o].Steus2eop;
										etlData.operation[o].workPerc = operation[o].Prznt;
										etlData.operation[o].orderQty = operation[o].Bmvrg;
										etlData.operation[o].ordQtyUnit = operation[o].Bmeih;
										etlData.operation[o].netPrice = operation[o].Opreis;
										etlData.operation[o].currency = operation[o].Owaers;
										etlData.operation[o].priceUnit = operation[o].Opeinh;
										etlData.operation[o].costElement = operation[o].Sakto2eop;
										etlData.operation[o].materialGrp = operation[o].Omatkl;
										etlData.operation[o].puchGroup = operation[o].Oekgrp;
										etlData.operation[o].purchOrg = operation[o].Ekorg;
										etlData.operation[o].Uvorn = operation[o].Uvorn;
										etlData.operation[o].UvornEnable = false;
										etlData.operation[o].equi = operation[o].EqunrEop;
										etlData.operation[o].floc = operation[o].TplnrEop;
										etlData.operation[o].OprRel = [];
										etlData.operation[o].SrvPckgOvrw = [];
										etlData.operation[o].PRT = [];
										etlData.operation[o].InspChar = [];

										if (oprRel.length > 0) {
											for (var x in oprRel) {
												if (etlData.grp === oprRel[x].Tleqhdr && etlData.operation[o].Plnal === oprRel[x].Tplnal && etlData.operation[o].Vornr ===
													oprRel[x].Vorn2) {
													var objOprRel = {
														Plnal: oprRel[x].Tplnal,
														Vornr: oprRel[x].Vorn2,

														OperationOR: oprRel[x].Vornrerel,
														Offset: oprRel[x].Dauer,
														OUn: oprRel[x].Zeinh,
														RelType: oprRel[x].Aobar,
														PO: oprRel[x].Eprznt,
														OI: oprRel[x].Provg,
														ID: oprRel[x].Ekalid,
														WrkCtrOR: oprRel[x].Arbplerel,
														PlantOR: oprRel[x].Werkserel,

														OperationORVS: "None",
														OffsetVS: "None",
														OUnVS: "None",
														RelTypeVS: "None",
														POVS: "None",
														OIVS: "None",
														IDVS: "None",
														WrkCtrORVS: "None",
														PlantORVS: "None",
													}
													etlData.operation[o].OprRel.push(objOprRel);
												}
											}
										}

										if (SrvPckgOvrw.length > 0) {
											for (var x in SrvPckgOvrw) {
												if (etlData.grp === SrvPckgOvrw[x].Tleqhdr && etlData.operation[o].Plnal === SrvPckgOvrw[x].Tplnal && etlData.operation[
														o].Vornr === SrvPckgOvrw[x].Vornrr) {
													var oSPO = {
														group: SrvPckgOvrw[x].Tleqhdr,
														Plnal: SrvPckgOvrw[x].Tplnal,
														Vornr: SrvPckgOvrw[x].Vornrr,

														LineNum: SrvPckgOvrw[x].SrvLine,
														DelIndSP: formatter.statusSel(SrvPckgOvrw[x].Del),
														ActNum: SrvPckgOvrw[x].Srvpos,
														ShrtTxt: SrvPckgOvrw[x].Ktext1,
														Qty: SrvPckgOvrw[x].Mengeespk,
														BUomSP: SrvPckgOvrw[x].Meinsespk,
														GrossPrc: SrvPckgOvrw[x].Tbtwr,
														CurKey: SrvPckgOvrw[x].Waersespk,
														Work: SrvPckgOvrw[x].IntWork,
														UnitOfWork: SrvPckgOvrw[x].Iwein,

														ActNumVS: "None",
														ShrtTxtVS: "None",
														QtyVS: "None",
														BUomSPVS: "None",
														GrossPrcVS: "None",
														CurKeyVS: "None",
														WorkVS: "None",
														UnitOfWorkVS: "None",

														DelIndSPEnabled: false
													};
													etlData.operation[o].SrvPckgOvrw.push(oSPO);
												}
											}
										}

										if (aPrt.length > 0) {
											for (var x in aPrt) {
												if (etlData.grp === aPrt[x].Tleqhdr && etlData.operation[o].Plnal === aPrt[x].Tplnal && etlData.operation[o].Vornr ===
													aPrt[x].Vornreprt) {
													var objPRT = {
														grp: aPrt[x].Tleqhdr,
														Plnal: aPrt[x].Tplnal,
														Vornr: aPrt[x].Vornreprt,

														ItmNum: aPrt[x].Psnfh,
														ItmCat: aPrt[x].Fhmar,
														// PRT: aPrt[x].Fhmnr,
														Plant: aPrt[x].Fhwrk, //PRTDesc
														Mat: aPrt[x].Matnreprt,
														MatDesc: "",
														Equi: aPrt[x].EqunrEpt,
														EquiDesc: "",
														Mspt: aPrt[x].Eqpnt,
														MsptDesc: "",
														doc: aPrt[x].Dokareprt,
														docDesc: "",
														docType: aPrt[x].Doknreprt,
														docTypeDesc: "",
														docPart: aPrt[x].Doktleprt,
														docVersion: aPrt[x].Dokvreprt,
														Othr: aPrt[x].Fhmnr,
														OthrDesc: "",
														Qty: aPrt[x].Mgvgw,
														UOM: aPrt[x].Mgeinh,
														QtyFrmla: aPrt[x].Mgform,
														PRTCtrl: aPrt[x].Steuf,
														PRTCtrlDesc: aPrt[x].Stftxt,
														StdUsgVal: aPrt[x].Ewvgw,
														StdUsgUOM: aPrt[x].Eweinh,
														UsgValFrmla: aPrt[x].Ewform,

														PRTVS: "None",
														PlantVS: "None",
														QtyVS: "None",
														UOMVS: "None",
														QtyFrmlaVS: "None",
														PRTCtrlVS: "None",
														StdUsgValVS: "None",
														StdUsgUOMVS: "None",
														UsgValFrmlaVS: "None",
													}

													if (objPRT.ItmCat === "M") {
														objPRT.PRT = objPRT.Mat;
														objPRT.title = "Material";
														objPRT.matEnable = true;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
														objPRT.Plant = etlData.operation[o].Werks;
													} else if (objPRT.ItmCat === "E") {
														objPRT.PRT = objPRT.Equi;
														objPRT.title = "Equipment";
														objPRT.matEnable = false;
														objPRT.eqEnable = true;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
													} else if (objPRT.ItmCat === "P") {
														objPRT.PRT = objPRT.Mspt;
														objPRT.title = "Measuring Point";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = true;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
													} else if (objPRT.ItmCat === "D") {
														objPRT.PRT = objPRT.doc + "-" + objPRT.docType + "-" + objPRT.docPart + "-" + objPRT.docVersion;
														objPRT.title = "Document";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = true;
														objPRT.othEnable = false;
														objPRT.docType = "";
														objPRT.docTypeDesc = "";
														objPRT.docPart = "";
														objPRT.docVersion = "";
													} else if (objPRT.ItmCat === "O") {
														objPRT.PRT = objPRT.Othr;
														objPRT.title = "Others";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = true;
													}
													etlData.operation[o].PRT.push(objPRT);
												}
											}
										}

										if (aInsp.length > 0) {
											for (var x in aInsp) {
												if (etlData.grp === aInsp[x].Tleqhdr && etlData.operation[o].Plnal === aInsp[x].Tplnal && etlData.operation[o].Vornr ===
													aInsp[x].Vornreins) {
													var objInsp = {
														group: aInsp[x].Tlgnhdr,
														Plnal: aInsp[x].Tplnal,
														Vornr: aInsp[x].Vornreins,

														InspChar: aInsp[x].Merknr,
														PrstInd: aInsp[x].Vste2eins,
														QuanChar: formatter.statusSel(aInsp[x].Quantitat),
														QualChar: formatter.statusSel(aInsp[x].QpmkRef),
														MastInspChar: aInsp[x].Verw2eins,
														Plant: aInsp[x].Uzae2tlen,
														Version: aInsp[x].Ver2tleqi,
														ShrtTxt: aInsp[x].Kurztext,
														InspMthd: aInsp[x].Pmth2eins,
														InspMthdPlnt: aInsp[x].Qwe2tleqi,
														TolKey: aInsp[x].Toleranzs,
														VrsnInspMthd: aInsp[x].Pmtversio,
														SampProc: aInsp[x].Stichprve,
														SampUOM: aInsp[x].Probemgeh,
														BaseSampQty: aInsp[x].Pruefeinh,
														CodeGrp: aInsp[x].Auswmenge,

														MastInspCharVS: "None",
														PlantVS: "None",
														VersionVS: "None",
														InspMthdVS: "None",
														InspMthdPlntVS: "None",
														SampProcVS: "None"
													};

													etlData.operation[o].InspChar.push(objInsp);
												}
											}
										}

										var currReadMpack = [];
										if (maintPckgDefault.length > 0) {
											for (var w in maintPckgDefault) {
												if (etlData.grp === maintPckgDefault[w].Tleqhdr && etlData.operation[o].Plnal === maintPckgDefault[w].Tplnal) {
													currReadMpack.push(maintPckgDefault[w]);
												}
											}
										}

										var currSelMpack = [];
										if (maintPckg.length > 0) {
											for (var x in maintPckg) {
												if (etlData.grp === maintPckg[x].Tleqhdr && etlData.operation[o].Plnal === maintPckg[x].Tplnal &&
													etlData.operation[o].Vornr === maintPckg[x].Vorn2empk) {
													currSelMpack.push(maintPckg[x]);
												}
											}
										}

										var oMaintPckg = {};
										if (currReadMpack.length > 0) {
											oMaintPckg = {
												Plnal: currReadMpack[0].Tplnal,
												Vornr: etlData.operation[o].Vornr,
												Strat: currReadMpack[0].Startempk,
												SOp: "",
												Ltxa1: etlData.operation[o].Ltxa1,
												flag: currReadMpack[0].Tplnal + "-" + etlData.operation[o].Vornr,
												MPArr: [],
											};
											for (var f in currReadMpack) {
												var currReadObj = currReadMpack[f];
												oMaintPckg[currReadObj.Paketempk] = false;
											}
										}

										if (currSelMpack.length > 0) {
											for (var z in currSelMpack) {
												currSelMpack[z].Vornr = currSelMpack[z].Vorn2empk;
												currSelMpack[z].Strat = currSelMpack[z].Startempk;
												currSelMpack[z].Paket = currSelMpack[z].Paketempk;

												var currSelObj = currSelMpack[z];
												if (currSelMpack[z].IsSelected === 'X') {
													oMaintPckg[currSelObj.Paketempk] = true;
												}
											}
											oMaintPckg.MPArr = currSelMpack;
										}
										etlData.MaintPckg.push(oMaintPckg);
									}
									g.oData = etlData.operation;
									var oprModel = new sap.ui.model.json.JSONModel();
									oprModel.setData(etlData.operation);
								}
							}
							component = d.ETComp.results;
							if (component.length > 0) {
								etlData.component = component;
								for (var e = 0; e < component.length; e++) {
									etlData.component[e].matDesc = component[e].Maktx;
									etlData.component[e].slNo = e + 1;
									etlData.component[e].Plnal = component[e].Tplnal;
									etlData.component[e].flag = component[e].Tplnal + "-" + component[e].Vornr + "-" + etlData.component[e].slNo;
									etlData.component[e].hFlag = component[e].Tplnal + "-" + component[e].Vornr;
									etlData.component[e].bom = component[e].Stlnrecmp;
									etlData.component[e].bomCat = component[e].Stltyecmp;
									etlData.component[e].bomCatDesc = component[e].Stltyecmptxt;
									etlData.component[e].altBom = component[e].Stlal;
								}
								g.cmpData = component;
								compModel = new sap.ui.model.json.JSONModel();
								compModel.setData(component);
							}
							classList = d.ETClass.results;
							if (classList) {
								if (classList.length > 0) {
									for (var i = 0; i < classList.length; i++) {
										classList[i].ctEnable = false;
										classList[i].classEnable = false;
										classList[i].ClassTypeDesc = classList[i].Artxt;
										delete classList[i].Artxt;
										sClassList[i].ClassDesc = sClassList[i].Kltxt;
										delete sClassList[i].Kltxt;
										delete classList[i].Changerequestid;
										delete classList[i].Clint;
										delete classList[i].Service;
										classList[i].classDelEnable = true;
										classList[i].slNo = i + 1;
										classList[i].Plnal = classList[i].Tplnal;
										classList[i].flag = classList[i].Tplnal + "-" + classList[i].slNo;
									}
									g.cData = classList;
									cModel = new sap.ui.model.json.JSONModel();
									cModel.setData(classList);
									etlData.Class = classList;
								}
							}
							charList = d.ETVal.results;
							if (charList) {
								if (charList.length > 0) {
									for (var j = 0; j < charList.length; j++) {
										charList[j].cNameEnable = false;
										charList[j].Textbz = charList[j].Atwtb;
										delete charList[j].Ataut;
										delete charList[j].Ataw1;
										delete charList[j].Atawe;
										delete charList[j].Atcod;
										delete charList[j].Atflb;
										delete charList[j].Atflv;
										delete charList[j].Atimb;
										delete charList[j].Atsrt;
										delete charList[j].Atvglart;
										delete charList[j].Atzis;
										delete charList[j].Changerequestid;
										delete charList[j].CharName;
										delete charList[j].Charid;
										delete charList[j].Classtype;
										delete charList[j].Service;
										delete charList[j].Valcnt;
										charList[j].slNo = j + 1;
										charList[j].Plnal = charList[j].Tplnal;
										charList[j].flag = charList[j].Tplnal + "-" + charList[j].Class + "-" + charList[j].slNo;
									}
									g.chData = charList;
									_cModel = new sap.ui.model.json.JSONModel();
									_cModel.setData(charList);
									etlData.Char = charList;
								}
								for (var z = 0; z < etlData.Char.length; z++) {
									var count = 1;
									for (var y = 0; y < etlData.Char.length; y++) {
										if (z === y) {
											continue;
										}
										if (etlData.Char[y].Atnam === etlData.Char[z].Atnam) {
											count++;
										}
									}
									if (count > 1) {
										etlData.Char[z].charDltEnable = true;
									} else {
										etlData.Char[z].charDltEnable = false;
									}
								}
							}
							AIWListETLData.push(etlData);
							sap.ui.getCore().getModel("AIWListETLModel").setData(AIWListETLData);
							sap.ui.getCore().getModel("AIWListETLModel").setSizeLimit(AIWListETLData.length);
							sap.ui.getCore().getModel("AIWListETLModel").refresh();

						} else if (g.action === "changeFTL") {
							if (d.FTList.results.length > 0) {
								var header = d.FTList.results[0];
								var ftlData = {
									mode: "change",
									validFrm: formatter.getDateFormat(d.Datuv),
									grp: r.results[0].Plnnr,
									floc: r.results[0].FTList.results[0].Fl2tl,
									flocDesc: r.results[0].FTList.results[0].Pltxt,
									modeflag: "Chg",
									typeFlag: "F",
									header: [],
									operation: [],
									component: [],
									MaintPckg: [],
									KDenable: false
								};
								var header = d.FTList.results;
								if (header.length > 0) {
									ftlData.header = header;
									for (var h = 0; h < header.length; h++) {
										ftlData.header[h].pPlantDesc = header[h].Iwerktxt;
										ftlData.header[h].usageDesc = header[h].TlUsgTxt;
										ftlData.header[h].plGrpDesc = header[h].Plnnrgrptxt;
										ftlData.header[h].statusDesc = header[h].Statustxt;
										ftlData.header[h].sysCondDesc = header[h].Anlzux;
										ftlData.header[h].stratDesc = header[h].Strattxt;
										ftlData.header[h].Plnal = header[h].Tplnal;
										ftlData.header[h].Verwe = header[h].Tverwe;
										ftlData.header[h].plEnable = false;
										// ftlData.header[h].Ktext = header.Pltxt;
										ftlData.header[h].valueStateT = "None";
										ftlData.header[h].valueStatePP = "None";
										ftlData.header[h].valueStateU = "None";
										ftlData.header[h].valueStateS = "None";
										ftlData.header[h].floc = header[h].Fl2tl;
										ftlData.header[h].flocDesc = header[h].Pltxt;
										ftlData.header[h].tlusg = header[h].Tverwe;
										ftlData.header[h].Iwerk = header[h].Werks;
										ftlData.header[h].wc = header[h].Tarbpl;
										ftlData.header[h].plant = header[h].Wcplant;
										ftlData.header[h].grp = header[h].Tlgnhdr;
										ftlData.header[h].Ktext = header[h].Ktext;
										ftlData.header[h].assmbly = header[h].Istru;
										ftlData.header[h].assmblyDesc = header[h].Istrux;
										ftlData.header[h].insPt = header[h].Slwbez;
										ftlData.header[h].insPtDesc = header[h].Slwbeztxt;
										ftlData.header[h].vEquiLbl = false;
										ftlData.header[h].vEqui = false;
										ftlData.header[h].vEquiDesc = false;
										ftlData.header[h].vFlocLbl = true;
										ftlData.header[h].vFloc = true;
										ftlData.header[h].vFlocDesc = true;
										ftlData.header[h].bAddComponent = true;
									}
									var oModel = new sap.ui.model.json.JSONModel();
									oModel.setData(ftlData.header);
								}
								var operation = d.FTOprs.results;
								if (operation.length > 0) {
									ftlData.operation = operation;
									var oprRel = d.FTRel.results;
									var SrvPckgOvrw = d.FTSpack.results;
									var maintPckg = d.FTMPack.results;
									var maintPckgDefault = d.FTMpackRead.results;
									var aPrt = d.FTPRT.results;
									var aInsp = d.FTInsp.results;
									for (var o = 0; o < operation.length; o++) {
										ftlData.operation[o].calcKeyDesc = "";
										ftlData.operation[o].actTypDesc = "";
										ftlData.operation[o].flag = operation[o].Tplnal + "-" + operation[o].Vornr;
										ftlData.operation[o].Arbpl = operation[o].TlArbpl;
										ftlData.operation[o].Plnal = operation[o].Tplnal;
										ftlData.operation[o].opState = "None";
										ftlData.operation[o].opDescState = "None";
										ftlData.operation[o].wcState = "None";
										ftlData.operation[o].plantState = "None";
										ftlData.operation[o].ctrlKeyState = "None";
										ftlData.operation[o].Werks = operation[o].Werks2fop;
										ftlData.operation[o].Steus = operation[o].Steus2fop;
										ftlData.operation[o].workPerc = operation[o].Prznt;
										ftlData.operation[o].orderQty = operation[o].Bmvrg;
										ftlData.operation[o].ordQtyUnit = operation[o].Bmeih;
										ftlData.operation[o].netPrice = operation[o].Opreis;
										ftlData.operation[o].currency = operation[o].Owaers;
										ftlData.operation[o].priceUnit = operation[o].Opeinh;
										ftlData.operation[o].costElement = operation[o].Sakto2fop;
										ftlData.operation[o].materialGrp = operation[o].Omatkl;
										ftlData.operation[o].puchGroup = operation[o].Oekgrp;
										ftlData.operation[o].purchOrg = operation[o].Ekorg;
										ftlData.operation[o].Uvorn = operation[o].Uvorn;
										ftlData.operation[o].UvornEnable = false;
										ftlData.operation[o].equi = operation[o].EqunrFop;
										ftlData.operation[o].floc = operation[o].TplnrFop;
										ftlData.operation[o].OprRel = [];
										ftlData.operation[o].SrvPckgOvrw = [];
										ftlData.operation[o].PRT = [];
										ftlData.operation[o].InspChar = [];

										if (oprRel.length > 0) {
											for (var x in oprRel) {
												if (ftlData.grp === oprRel[x].Tlflhdr && ftlData.operation[o].Plnal === oprRel[x].Tplnal && ftlData.operation[o].Vornr ===
													oprRel[x].Vorn2) {
													var objOprRel = {
														Plnal: oprRel[x].Tplnal,
														Vornr: oprRel[x].Vorn2,

														OperationOR: oprRel[x].Vornrfrel,
														Offset: oprRel[x].Dauer,
														OUn: oprRel[x].Zeinh,
														RelType: oprRel[x].Aobar,
														PO: oprRel[x].Fprznt,
														OI: oprRel[x].Provg,
														ID: oprRel[x].Fkalid,
														WrkCtrOR: oprRel[x].Arbplfrel,
														PlantOR: oprRel[x].Werksfrel,

														OperationORVS: "None",
														OffsetVS: "None",
														OUnVS: "None",
														RelTypeVS: "None",
														POVS: "None",
														OIVS: "None",
														IDVS: "None",
														WrkCtrORVS: "None",
														PlantORVS: "None",
													}
													ftlData.operation[o].OprRel.push(objOprRel);
												}
											}
										}

										if (SrvPckgOvrw.length > 0) {
											for (var x in SrvPckgOvrw) {
												if (ftlData.grp === SrvPckgOvrw[x].Tlflhdr && ftlData.operation[o].Plnal === SrvPckgOvrw[x].Tplnal && ftlData.operation[
														o].Vornr === SrvPckgOvrw[x].Vornrr) {
													var oSPO = {
														group: SrvPckgOvrw[x].Tlflhdr,
														Plnal: SrvPckgOvrw[x].Tplnal,
														Vornr: SrvPckgOvrw[x].Vornrr,

														LineNum: SrvPckgOvrw[x].SrvLine,
														DelIndSP: formatter.statusSel(SrvPckgOvrw[x].Del),
														ActNum: SrvPckgOvrw[x].Srvpos,
														ShrtTxt: SrvPckgOvrw[x].Ktext1,
														Qty: SrvPckgOvrw[x].Mengefspk,
														BUomSP: SrvPckgOvrw[x].Meinsfspk,
														GrossPrc: SrvPckgOvrw[x].Tbtwr,
														CurKey: SrvPckgOvrw[x].Waersfspk,
														Work: SrvPckgOvrw[x].IntWork,
														UnitOfWork: SrvPckgOvrw[x].Iwein,

														ActNumVS: "None",
														ShrtTxtVS: "None",
														QtyVS: "None",
														BUomSPVS: "None",
														GrossPrcVS: "None",
														CurKeyVS: "None",
														WorkVS: "None",
														UnitOfWorkVS: "None",

														DelIndSPEnabled: false
													};
													ftlData.operation[o].SrvPckgOvrw.push(oSPO);
												}
											}
										}

										if (aPrt.length > 0) {
											for (var x in aPrt) {
												if (ftlData.grp === aPrt[x].Tlflhdr && ftlData.operation[o].Plnal === aPrt[x].Tplnal && ftlData.operation[o].Vornr ===
													aPrt[x].Vorn2) {
													var objPRT = {
														grp: aPrt[x].Tlflhdr,
														Plnal: aPrt[x].Tplnal,
														Vornr: aPrt[x].Vornrfprt,

														ItmNum: aPrt[x].Psnfh,
														ItmCat: aPrt[x].Fhmar,
														// PRT: aPrt[x].Fhmnr,
														Plant: aPrt[x].Fhwrk, //PRTDesc
														Mat: aPrt[x].Matnrfprt,
														MatDesc: "",
														Equi: aPrt[x].EqunrFpt,
														EquiDesc: "",
														Mspt: aPrt[x].Eqpnt,
														MsptDesc: "",
														doc: aPrt[x].Dokarfprt,
														docDesc: "",
														docType: aPrt[x].Doknrfprt,
														docTypeDesc: "",
														docPart: aPrt[x].Doktlfprt,
														docVersion: aPrt[x].Dokvrfprt,
														Othr: aPrt[x].Fhmnr,
														OthrDesc: "",
														Qty: aPrt[x].Mgvgw,
														UOM: aPrt[x].Mgeinh,
														QtyFrmla: aPrt[x].Mgform,
														PRTCtrl: aPrt[x].Steuf,
														PRTCtrlDesc: aPrt[x].Stftxt,
														StdUsgVal: aPrt[x].Ewvgw,
														StdUsgUOM: aPrt[x].Eweinh,
														UsgValFrmla: aPrt[x].Ewform,

														PRTVS: "None",
														PlantVS: "None",
														QtyVS: "None",
														UOMVS: "None",
														QtyFrmlaVS: "None",
														PRTCtrlVS: "None",
														StdUsgValVS: "None",
														StdUsgUOMVS: "None",
														UsgValFrmlaVS: "None",
													}

													if (objPRT.ItmCat === "M") {
														objPRT.PRT = objPRT.Mat;
														objPRT.title = "Material";
														objPRT.matEnable = true;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
														objPRT.Plant = ftlData.operation[o].Werks;
													} else if (objPRT.ItmCat === "E") {
														objPRT.PRT = objPRT.Equi;
														objPRT.title = "Equipment";
														objPRT.matEnable = false;
														objPRT.eqEnable = true;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
													} else if (objPRT.ItmCat === "P") {
														objPRT.PRT = objPRT.Mspt;
														objPRT.title = "Measuring Point";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = true;
														objPRT.docEnable = false;
														objPRT.othEnable = false;
													} else if (objPRT.ItmCat === "D") {
														objPRT.PRT = objPRT.doc + "-" + objPRT.docType + "-" + objPRT.docPart + "-" + objPRT.docVersion;
														objPRT.title = "Document";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = true;
														objPRT.othEnable = false;
														objPRT.docType = "";
														objPRT.docTypeDesc = "";
														objPRT.docPart = "";
														objPRT.docVersion = "";
													} else if (objPRT.ItmCat === "O") {
														objPRT.PRT = objPRT.Othr;
														objPRT.title = "Others";
														objPRT.matEnable = false;
														objPRT.eqEnable = false;
														objPRT.msptEnable = false;
														objPRT.docEnable = false;
														objPRT.othEnable = true;
													}
													ftlData.operation[o].PRT.push(objPRT);
												}
											}
										}

										if (aInsp.length > 0) {
											for (var x in aInsp) {
												if (ftlData.grp === aInsp[x].Tlflhdr && ftlData.operation[o].Plnal === aInsp[x].Tplnal && ftlData.operation[o].Vornr ===
													aInsp[x].Vornrfins) {
													var objInsp = {
														group: aInsp[x].Tlflhdr,
														Plnal: aInsp[x].Tplnal,
														Vornr: aInsp[x].Vornrfins,

														InspChar: aInsp[x].Merknr,
														PrstInd: aInsp[x].Vste2fins,
														QuanChar: formatter.statusSel(aInsp[x].Quantitat),
														QualChar: formatter.statusSel(aInsp[x].QpmkRef),
														MastInspChar: aInsp[x].Verw2fins,
														Plant: aInsp[x].Uzae2tlfn,
														Version: aInsp[x].Ver2tlfli,
														ShrtTxt: aInsp[x].Kurztext,
														InspMthd: aInsp[x].Pmth2fins,
														InspMthdPlnt: aInsp[x].Qwe2tlfli,
														TolKey: aInsp[x].Toleranzs,
														VrsnInspMthd: aInsp[x].Pmtversio,
														SampProc: aInsp[x].Stichprve,
														SampUOM: aInsp[x].Probemgeh,
														BaseSampQty: aInsp[x].Pruefeinh,
														CodeGrp: aInsp[x].Auswmenge,

														MastInspCharVS: "None",
														PlantVS: "None",
														VersionVS: "None",
														InspMthdVS: "None",
														InspMthdPlntVS: "None",
														SampProcVS: "None"
													};

													ftlData.operation[o].InspChar.push(objInsp);
												}
											}
										}

										var currReadMpack = [];
										if (maintPckgDefault.length > 0) {
											for (var w in maintPckgDefault) {
												if (ftlData.grp === maintPckgDefault[w].Tlflhdr && ftlData.operation[o].Plnal === maintPckgDefault[w].Tplnal) {
													currReadMpack.push(maintPckgDefault[w]);
												}
											}
										}

										var currSelMpack = [];
										if (maintPckg.length > 0) {
											for (var x in maintPckg) {
												if (ftlData.grp === maintPckg[x].Tlflhdr && ftlData.operation[o].Plnal === maintPckg[x].Tplnal &&
													ftlData.operation[o].Vornr === maintPckg[x].Vorn2fmpk) {
													currSelMpack.push(maintPckg[x]);
												}
											}
										}

										var oMaintPckg = {};
										if (currReadMpack.length > 0) {
											oMaintPckg = {
												Plnal: currReadMpack[0].Tplnal,
												Vornr: ftlData.operation[o].Vornr,
												Strat: currReadMpack[0].Startfmpk,
												SOp: "",
												Ltxa1: ftlData.operation[o].Ltxa1,
												flag: currReadMpack[0].Tplnal + "-" + ftlData.operation[o].Vornr,
												MPArr: [],
											};
											for (var f in currReadMpack) {
												var currReadObj = currReadMpack[f];
												oMaintPckg[currReadObj.Paketfmpk] = false;
											}
										}

										if (currSelMpack.length > 0) {
											for (var z in currSelMpack) {
												currSelMpack[z].Vornr = currSelMpack[z].Vorn2fmpk;
												currSelMpack[z].Strat = currSelMpack[z].Startfmpk;
												currSelMpack[z].Paket = currSelMpack[z].Paketfmpk;

												var currSelObj = currSelMpack[z];
												if (currSelMpack[z].IsSelected === 'X') {
													oMaintPckg[currSelObj.Paketfmpk] = true;
												}
											}
											oMaintPckg.MPArr = currSelMpack;
										}
										ftlData.MaintPckg.push(oMaintPckg);
									}
									g.oData = ftlData.operation;
									var oprModel = new sap.ui.model.json.JSONModel();
									oprModel.setData(ftlData.operation);
								}
								component = d.FTComp.results;
								if (component.length > 0) {
									ftlData.component = component;
									for (var f = 0; f < component.length; f++) {
										ftlData.component[f].matDesc = component[f].Maktx;
										ftlData.component[f].slNo = e + 1;
										ftlData.component[f].Plnal = component[f].Tplnal;
										ftlData.component[f].flag = component[f].Tplnal + "-" + component[f].Vornr + "-" + ftlData.component[f].slNo;
										ftlData.component[f].hFlag = component[f].Tplnal + "-" + component[f].Vornr;
										ftlData.component[f].bom = component[f].Stlnrfcmp;
										ftlData.component[f].bomCat = component[f].Stltyfcmp;
										ftlData.component[f].bomCatDesc = component[f].Stltyfcmptxt;
										ftlData.component[f].altBom = component[f].Stlal;
									}
									g.cmpData = component;
									compModel = new sap.ui.model.json.JSONModel();
									compModel.setData(ftlData.component);
								}
								classList = d.FTClass.results;
								if (classList) {
									if (classList.length > 0) {
										for (var i = 0; i < classList.length; i++) {
											classList[i].ctEnable = false;
											classList[i].classEnable = false;
											classList[i].ClassTypeDesc = classList[i].Artxt;
											delete classList[i].Artxt;
											sClassList[i].ClassDesc = sClassList[i].Kltxt;
											delete sClassList[i].Kltxt;
											delete classList[i].Changerequestid;
											delete classList[i].Clint;
											delete classList[i].Service;
											classList[i].classDelEnable = true;
											classList[i].slNo = i + 1;
											classList[i].Plnal = classList[i].Tplnal;
											classList[i].flag = classList[i].Tplnal + "-" + classList[i].slNo;
										}
										g.cData = classList;
										cModel = new sap.ui.model.json.JSONModel();
										cModel.setData(classList);
										ftlData.Class = classList;
									}
								}
								charList = d.FTVal.results;
								if (charList) {
									if (charList.length > 0) {
										for (var j = 0; j < charList.length; j++) {
											charList[j].cNameEnable = false;
											charList[j].Textbz = charList[j].Atwtb;
											delete charList[j].Ataut;
											delete charList[j].Ataw1;
											delete charList[j].Atawe;
											delete charList[j].Atcod;
											delete charList[j].Atflb;
											delete charList[j].Atflv;
											delete charList[j].Atimb;
											delete charList[j].Atsrt;
											delete charList[j].Atvglart;
											delete charList[j].Atzis;
											delete charList[j].Changerequestid;
											delete charList[j].CharName;
											delete charList[j].Charid;
											delete charList[j].Classtype;
											delete charList[j].Service;
											delete charList[j].Valcnt;
											charList[j].slNo = j + 1;
											charList[j].Plnal = charList[j].Tplnal;
											charList[j].flag = charList[j].Tplnal + "-" + charList[j].Class + "-" + charList[j].slNo;
										}
										g.chData = charList;
										_cModel = new sap.ui.model.json.JSONModel();
										_cModel.setData(charList);
										ftlData.Char = charList;
									}
									for (var z = 0; z < ftlData.Char.length; z++) {
										var count = 1;
										for (var y = 0; y < ftlData.Char.length; y++) {
											if (z === y) {
												continue;
											}
											if (ftlData.Char[y].Atnam === ftlData.Char[z].Atnam) {
												count++;
											}
										}
										if (count > 1) {
											ftlData.Char[z].charDltEnable = true;
										} else {
											ftlData.Char[z].charDltEnable = false;
										}
									}
								}
								AIWListFTLData.push(ftlData);
								sap.ui.getCore().getModel("AIWListFTLModel").setData(AIWListFTLData);
								sap.ui.getCore().getModel("AIWListFTLModel").setSizeLimit(AIWListFTLData.length);
								sap.ui.getCore().getModel("AIWListFTLModel").refresh();
							}
						}
					}
				},
				error: function (err) {
					g.BusyDialog.close();
				}
			});
		},

		onDonePress: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			}

			var refreshModel = sap.ui.getCore().getModel("refreshModel");
			refreshModel.setProperty('/refreshSearch', true);

			// var oControl = this.getView().byId("idPanel");
			// var oTable = this.getView().byId("searchResults");
			// var items = this.getView().byId("sColListItem");
			// oControl.destroyContent();
			// oTable.destroyColumns();
			// oTable.destroyItems();
			// items.destroyCells();
			// oTable.setModel();
			// if (this._oTPC) {
			// 	this._oTPC.destroyPersoService();
			// 	this._oTPC.destroy();
			// }

			this.selectedIndices = [];
		},

		getDateFormat: function (_date) {
			if (_date !== "" && _date !== null) {
				var formatDate = "";
				var date = new Date(_date);
				var yyyy = date.getFullYear();
				var mm = date.getMonth();
				if (mm < 10) {
					mm = mm + 1;
					if (mm.length === 1) {
						mm = "0" + mm;
					}
				} else {
					mm = mm + 1;
				}
				var dd = date.getDate();
				if (dd < 10) {
					dd = "0" + dd;
				}
				var hh = date.getHours();
				if (hh < 10) {
					hh = "0" + hh;
				}
				var min = date.getMinutes();
				if (min < 10) {
					min = "0" + min;
				}
				var ss = date.getSeconds();
				if (ss < 10) {
					ss = "0" + ss;
				}
				formatDate = mm + "/" + dd + "/" + yyyy;
				return formatDate;
			} else if (_date === null) {
				return "";
			}
		},

		/**
		 * Called to invoke the MessagePopover
		 * @function
		 * @private
		 */
		_getMessagePopover: function () {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.popover.MessagePopover", this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
		},

		/*
		 * This function is invoked when 'MeassagePopOver' is pressed
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleMessagePopoverPress: function (oEvent) {
			// oMessagePopover.toggle(oEvent.getSource());
			this._getMessagePopover().openBy(oEvent.getSource());
		},

		/*
		 * Function to set MessagePopOver
		 * @param MessageList
		 * @param successCount
		 */
		createMessagePopover: function (MessageList, successCount) {
			var msg = "";
			if (this.action.indexOf("bom") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessBOM");
			} else if (this.action.indexOf("TL") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessTL");
			} else if (this.action.indexOf("OL") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessOL");
			} else if (this.action.indexOf("WC") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessWC");
			} else if (this.action.indexOf("On") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessON");
			} else if (this.action.indexOf("Equi") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessEQ");
			} else if (this.action.indexOf("Floc") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessFL");
			} else if (this.action.indexOf("Mspt") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessMS");
			} else if (this.action.indexOf("Mpmi") > -1) {
				msg = this.getResourceBundle().getText("ImportSuccessMP");
			}

			MessageList.push({
				type: "Success",
				title: msg + " " + successCount,
				message: msg + " " + successCount
			});

			// var oModelP = new JSONModel();
			// oModelP.setData(MessageList);

			// oMessagePopover.setModel(oModelP);
			// oMessagePopover.toggle(this.getView().byId("idBtnMsgPopOver"));
			var oMessage, oMsgPopover = this._getMessagePopover();
			sap.ui.getCore().getMessageManager().removeAllMessages();
			for (var i = 0; i < MessageList.length; i++) {
				oMessage = new Message({
					message: MessageList[i].message,
					type: MessageList[i].type,
					target: "/Dummy",
					processor: this.getView().getModel()
				});
				sap.ui.getCore().getMessageManager().addMessages(oMessage);
			}
			oMsgPopover.toggle(this.getView().byId("idBtnMsgPopOver"));

			this.getView().byId("idBtnMsgPopOver").setText(MessageList.length);
			this.getView().byId("idBtnMsgPopOver").setEnabled(true);
		},

		/*
		 * Function to set MessagePopOver
		 * @param msg
		 * @param type
		 */
		createMessagePopover2: function (msg, type) {
			var oMessageList = [];
			var oMessage, oMsgPopover = this._getMessagePopover();
			if (typeof msg === "string") {
				oMessageList.push({
					type: type,
					title: msg,
					message: msg
				});
			} else if (Array.isArray(msg)) {
				oMessageList = msg;
				for (var i = 0; i < oMessageList.length; i++) {
					oMessageList[i].message = oMessageList[i].title;
				}
			}

			sap.ui.getCore().getMessageManager().removeAllMessages();
			for (var i = 0; i < oMessageList.length; i++) {
				oMessage = new Message({
					message: oMessageList[i].message,
					type: oMessageList[i].type, //MessageType.Error,
					target: "/Dummy",
					processor: this.getView().getModel()
				});
				sap.ui.getCore().getMessageManager().addMessages(oMessage);
			}
			oMsgPopover.toggle(this.getView().byId("idMessagePopover"));

			this.getView().byId("idMessagePopover").setEnabled(true);
			this.getView().byId("idMessagePopover").setText(oMessageList.length + "");
		},

		onDeleteSearchPress: function (event) {
			var sKey = this.getView().byId("savedSearch").getSelectedKey();
			var vDesc = this.getView().byId("saveSearchEAM").getValue();
			var entity = this.ObjFlag; //"WORKCNTR";
			var oModel = this.getView().getModel("hanaSearch");
			var oPanel = this.getView().byId("idPanel");
			var oTable = this.getView().byId("searchResults");
			var items = this.getView().byId("sColListItem");
			SearchUtil.deleteSavedSearch(this.getView().byId("savedSearch"), vDesc, entity, oModel, this, oPanel, oTable, items);
		},
		onSaveAction: function (event) {
			var that = this;
			var selectedAction = event.getParameter("item").getKey();
			var oValue = this.getView().byId("saveSearchEAM").getValue();
			var sMethod = this.getView().byId("srchMethod");
			var oPanel = this.getView().byId("idPanel");
			var sSelect = this.getView().byId("savedSearch");
			var oContent = oPanel.getContent();
			SearchUtil.onFnSavePress(selectedAction, this.ObjFlag, sMethod, oContent, oValue, this.getView().getModel("hanaSearch"), this,
				sSelect);
		},

		onSaveSearchChange: function (event) {
			var sMethod = this.getView().byId("srchMethod");
			var oPanel = this.getView().byId("idPanel");
			var oTable = this.getView().byId("searchResults");
			var items = this.getView().byId("sColListItem");
			if (event.getSource().getSelectedKey() === "") {
				oPanel.destroyContent();
				oTable.destroyColumns();
				oTable.destroyItems();
				items.destroyCells();
				oTable.setModel();
				if (this._oTPC) {
					this._oTPC.destroyPersoService();
					this._oTPC.destroy();
				}
				this.getView().byId("saveSearchEAM").setValue();
				this.readSearchOperators(this.getView().getModel("hanaSearch"), this.getView().byId("srchMethod").getSelectedItem().getAdditionalText());
			} else {
				this.getView().byId("saveSearchEAM").setValue(event.getSource().getSelectedItem().getText());
				SearchUtil.readSavedSearch(this.getView().getModel("hanaSearch"), this, this.ObjFlag, event.getSource().getSelectedKey(), sMethod,
					oPanel);
			}
		},
		
		/*
		 * Function to read DOI list of fields
		 * @param {string} entity - Object name (EQUI/FUNCLOC)
		 * @public
		 */
		readDOIList: function (entity) {
			var oModel = this.getView().getModel("valueHelp2");
			var g = this;
			var oFilter = [new sap.ui.model.Filter("Entity", "EQ", entity)];
			oModel.read("/DOIListSet", {
				filters: oFilter,
				success: function (r) {
					var rModel = new sap.ui.model.json.JSONModel();
					var results = r.results;
					var arr = [];
					for (var s = 0; s < results.length; s++) {
						var obj = new Object();
						var value = r.results[s].Property;
						obj["SupFlVal"] = "";
						obj["instLoc"] = false;
						obj["maintenance"] = false;
						obj["Label"] = r.results[s].Label;
						obj["property"] = r.results[s].Property;
						obj["currentVal"] = "";
						// obj["currentValDesc"] = "";
						obj["doiIcon"] = true;
						obj[r.results[s].Property] = "";
						if (r.results[s].Property === "Maintplant") {
							obj["locEnable"] = false;
							obj["maintEnable"] = false;
						} else {
							obj["locEnable"] = true;
							obj["maintEnable"] = true;
						}
						arr.push(obj);
					}
					if (entity === "EQUI") {
						g.DOIarrayEQ = arr;
					}
					if (entity === "FUNCLOC") {
						g.DOIarrayFL = arr;
					}

					// rModel.setData(arr);
					// g.getView().setModel(rModel, "dataOrigin");
				},
				error: function (err) {

				}
			});
		},

	});

});