/*global location history */
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	// "ugiaiwui/mdg/aiw/request/util/common",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/BusyDialog",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"sap/ui/core/message/Message",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, BusyDialog, ValueHelpProvider, Message,
	ValueHelpRequest) { //common
	"use strict";

	// var oMessageTemplate = new sap.m.MessageItem({
	// 	type: '{type}',
	// 	title: '{title}'
	// });

	// var oMessagePopover = new sap.m.MessagePopover({
	// 	items: {
	// 		path: '/',
	// 		template: oMessageTemplate
	// 	}
	// });

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailBOM", {
		formatter: formatter,

		/**
		 * Called when the DetailBOM controller is instantiated.
		 * @public
		 */
		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
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

			var FieldsVisible = {
				"WBSVisible": true,
				"MATVisible": true,
				"EQVisible": true,
				"FLVisible": true,
				"RECALLOVisible": true,
				"altbomVisible": false,
				"techtypeVisible": false,
				"delflgVisible": false,
				"authgrpVisible": false,
				"TitleDataVisible": false,
				"TitleDataText": "",
				"plnrgrpVisible": false,
				"constTypVisible": false,
				"laboffVisible": false,
				"sizeDimVisible": false,
				"invNumVisible": false,
				"manufVisible": false,
				"modNoVisible": false,
				"manufSerVisible": false,
				"bomAltTxtVisible": false,
				"bomHdrTxtVisible": false,

				"sopTableVisible": false,
				"tabTableVisible": false
			};
			var FieldsVisibleModel = new JSONModel(FieldsVisible);
			this.getView().setModel(FieldsVisibleModel, "FieldsVisibleModel");

			this.getRouter().getRoute("detail").attachPatternMatched(this._onRouteMatched, this);

			this.BusyDialog = new BusyDialog();
			this.BusyDialog.close();

			this.readSystem();

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

			// this.action = "CREATE";
			// this.getView().byId("detailPage").setBusy(false);
		},

		/*
		 * Function to handle 'attachPatternMatched' of DetailBOM controller
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		_onRouteMatched: function (oEvent) {
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "detail") {
				this.currentObj = undefined;
				this.itemPath = oEvent.getParameter("arguments").itemPath;
				var sPath = decodeURIComponent(oEvent.getParameter("arguments").itemPath);
				this.sBOMModelPath = sPath;
				// if (this._detailFragment) {
				// 	this._detailFragment.destroy();
				// }
				// this._detailFragment = undefined;
				this.sFragmentName = oEvent.getParameter("arguments").FragmentName;
				var e = oEvent.getParameter("arguments").e;
				var p = oEvent.getParameter("arguments").p;
				var u = oEvent.getParameter("arguments").u;
				var w = oEvent.getParameter("arguments").w;
				this.crstatus = oEvent.getParameter("arguments").cr;
				this.mode = oEvent.getParameter("arguments").mode;
				this.fromMat = oEvent.getParameter("arguments").mat;
				this.uid = oEvent.getParameter("arguments").uid;
				this.case = oEvent.getParameter("arguments").case;
				var oJsonModel = new JSONModel();
				var sObj = {};
				this.getView().byId("idBtnCheck").setVisible(true);

				var FieldsVisibleModel = this.getView().getModel("FieldsVisibleModel");
				var FieldsVisibleData = FieldsVisibleModel.getData();

				var refreshModel = sap.ui.getCore().getModel("refreshModel");
				if (refreshModel.getProperty('/refresh') === true) {
					this.itemNo = 0;
					this.getView().byId("idBtnCheck").setEnabled(true);
				}

				if (this.sFragmentName === "CreateMaterialBom") {
					FieldsVisibleData.WBSVisible = false;
					FieldsVisibleData.EQVisible = false;
					FieldsVisibleData.FLVisible = false;
					FieldsVisibleData.MATVisible = true;
					FieldsVisibleData.MATCrtVisible = true;
					FieldsVisibleData.RECALLOVisible = true;

					var BOMDetailModel = new JSONModel();
					var AIWListMatModel = sap.ui.getCore().getModel("AIWListMatModel");
					this.currentObj = AIWListMatModel.getProperty(sPath);

					sObj.headerText = this.getView().getModel("i18n").getProperty("MRO_BOM_TXT");
					sObj.tableHeader = this.getView().getModel("i18n").getProperty("MRO_ITEM_OVR");
					if (this.currentObj.bomType === "Create") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("createMbomTitle");
						this.currentObj.fromDateEnable = true;
						this.currentObj.crtMatHdrEnable = true;
						this.currentObj.crtMatHdrBtnEnable = true;
					} else if (this.currentObj.bomType === "Change") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("changeMbomTitle");
						this.currentObj.fromDateEnable = false;
						this.currentObj.crtMatHdrEnable = false;
						this.currentObj.crtMatHdrBtnEnable = false;
					}

					if (this.currentObj.Matnr !== "" && this.currentObj.Werks !== "" && this.currentObj.Stlan !== "") {
						this.currentObj.crtMatEnable = true;
						this.currentObj.crtMatHdrBtnEnable = false;
					} else {
						this.currentObj.crtMatEnable = false;
						this.currentObj.crtMatHdrBtnEnable = true;
					}

					if (this.mode === "display") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("matBomAppHdr");
						this.currentObj.matEnable = false;
						this.currentObj.plantEnable = false;
						this.currentObj.usageEnable = false;
						this.currentObj.BomstatusEnable = false;
						this.currentObj.BaseQtyEnable = false;
						this.currentObj.LngtxtEnable = false;
						this.currentObj.fromDateEnable = false;
						this.currentObj.addItemEnable = false;
						this.currentObj.crtMatEnable = false;
						this.currentObj.crtMatHdrEnable = false;
						this.currentObj.crtMatHdrBtnEnable = false;
						this.currentObj.modeFlag = "None";
						for (var j = 0; j < this.currentObj.matItem.length; j++) {
							this.currentObj.matItem[j].itmCatEnable = false;
							this.currentObj.matItem[j].itmQtyEnable = false;
							this.currentObj.matItem[j].itmCompEnable = false;
							this.currentObj.matItem[j].itmUomEnable = false;
							this.currentObj.matItem[j].reccrAllowEnable = false;
							this.currentObj.matItem[j].addSubItmEnable = false;
							this.currentObj.matItem[j].Pmper = "-";
							this.currentObj.matItem[j].Pmpka = "-";
							this.currentObj.matItem[j].Pmprv = "-";
							this.currentObj.matItem[j].Pmpfe = "-";
							this.currentObj.matItem[j].Pmpin = "-";
							this.currentObj.matItem[j].Pmpko = "-";
						}
						for (var j = 0; j < this.currentObj.matSubItem.length; j++) {
							this.currentObj.matSubItem[j].intPointEnable = false;
							this.currentObj.matSubItem[j].subQtyEnable = false;
							this.currentObj.matSubItem[j].subTextEnable = false;
						}
					}
					BOMDetailModel.setData(this.currentObj);
					this.getView().setModel(BOMDetailModel, "BOMDetailModel");

					if (this.currentObj.bomType === "Change" && this.currentObj.matItem.length > 0) {
						this.sLastItemNum = this.currentObj.matItem[this.currentObj.matItem.length - 1].Bomitmpos;
						this.currentObj.fromDateEnable = false;
					} else {
						this.sLastItemNum = "0000";
						this.currentObj.fromDateEnable = true;
					}

					var itemDetailModel = new JSONModel();
					itemDetailModel.setData(this.currentObj.matItem);
					this.getView().setModel(itemDetailModel, "itemDetailModel");

					if (this.fromMat && sap.ui.getCore().getModel("MatNavModel") === "X") {
						// this.syncBOMItem(this.uid);
						this.readfrombufferBom(this.uid);
						sap.ui.getCore().setModel(true, "MatNavModel");
					}
				}
				if (this.sFragmentName === "changeMbom") {
					FieldsVisibleData.WBSVisible = false;
					FieldsVisibleData.EQVisible = false;
					FieldsVisibleData.FLVisible = false;
					FieldsVisibleData.MATVisible = true;
					FieldsVisibleData.MATCrtVisible = true;
					FieldsVisibleData.RECALLOVisible = true;

					sObj = {
						titleName: this.getView().getModel("i18n").getProperty("changeMbomTitle"),
						headerText: this.getView().getModel("i18n").getProperty("MRO_BOM_TXT"),
						tableHeader: this.getView().getModel("i18n").getProperty("MRO_ITEM_OVR")
					};

					refreshModel.setProperty('/refreshSearch', false);

					if (this.fromMat && sap.ui.getCore().getModel("MatNavModel") === "X") {
						// this.syncBOMItem(this.uid);
						this.readfrombufferBom(this.uid);
						sap.ui.getCore().setModel(true, "MatNavModel");
						this.oModelUpdateFlag = true;
					} else if (this.uid && sap.ui.getCore().getModel("BOMCHNavModel") === "X") {
						// this.readfrombufferAssembly(this.uid);
						this.readfrombufferBom();
						sap.ui.getCore().setModel(true, "BOMCHNavModel");
						this.oModelUpdateFlag = false;
					} else if (refreshModel.getProperty('/refresh') === true) {
						this.existFlag = false;
						var AIWListMatModel = sap.ui.getCore().getModel("AIWListMatModel");
						var AIWListMatData = AIWListMatModel.getData();
						var BOMDetailModel = new JSONModel();
						for (var i = 0; i < AIWListMatData.length; i++) {
							if (AIWListMatData[i].Matnr === e && AIWListMatData[i].Werks === p && AIWListMatData[i].Stlan === u) {
								this.existFlag = true;
								this.currentObj = AIWListMatData[i];
								BOMDetailModel.setData(this.currentObj);
								this.getView().setModel(BOMDetailModel, "BOMDetailModel");
								this.attachModelEventHandlers(BOMDetailModel);

								var itemDetailModel = new JSONModel();
								itemDetailModel.setData(this.currentObj.matItem);
								this.getView().setModel(itemDetailModel, "itemDetailModel");
								this.attachModelEventHandlers(itemDetailModel);
								break;
							}
						}
						if (!this.existFlag) {
							this.readBomDetails(e, p, u, this.crstatus);
						}
						this.oModelUpdateFlag = false;
					} else {
						this.oModelUpdateFlag = sap.ui.getCore().getModel("oModelUpdateFlag").updateFlag;
						this.getView().getModel("BOMDetailModel").refresh();
						this.getView().getModel("itemDetailModel").refresh();
						this.currentObj = this.getView().getModel("BOMDetailModel").getData();
					}
				}
				if (this.sFragmentName === "CreateEquipmentBom") {
					FieldsVisibleData.WBSVisible = false;
					FieldsVisibleData.EQVisible = true;
					FieldsVisibleData.FLVisible = false;
					FieldsVisibleData.MATVisible = false;
					FieldsVisibleData.MATCrtVisible = false;
					FieldsVisibleData.RECALLOVisible = false;

					var BOMDetailModel = new JSONModel();
					var AIWListEqModel = sap.ui.getCore().getModel("AIWListEqModel");
					this.currentObj = AIWListEqModel.getProperty(sPath);

					sObj.headerText = this.getView().getModel("i18n").getProperty("E_BOM_TXT");
					sObj.tableHeader = this.getView().getModel("i18n").getProperty("E_ITEM_OVR");
					if (this.currentObj.bomType === "Create") { //24/08
						sObj.titleName = this.getView().getModel("i18n").getProperty("createEbomTitle");
						this.currentObj.fromDateEnable = true;
					} else if (this.currentObj.bomType === "Change") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("changeEbomTitle");
						this.currentObj.fromDateEnable = false;
					}

					this.currentObj.crtMatEnable = false;

					if (this.mode === "display") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("equiBomAppHdr"); //24/08
						this.currentObj.equipEnable = false;
						this.currentObj.plantEnable = false;
						this.currentObj.usageEnable = false;
						this.currentObj.BomstatusEnable = false;
						this.currentObj.BaseQtyEnable = false;
						this.currentObj.LngtxtEnable = false;
						this.currentObj.fromDateEnable = false;
						this.currentObj.addItemEnable = false;
						this.currentObj.crtMatEnable = false;
						this.currentObj.modeFlag = "None";
						for (var j = 0; j < this.currentObj.eqItem.length; j++) {
							this.currentObj.eqItem[j].itmCatEnable = false;
							this.currentObj.eqItem[j].itmQtyEnable = false;
							this.currentObj.eqItem[j].itmCompEnable = false;
							this.currentObj.eqItem[j].itmUomEnable = false;
							//this.currentObj.eqItem[j].reccrAllowEnable = false;
							this.currentObj.eqItem[j].addSubItmEnable = false;
							this.currentObj.eqItem[j].Pmper = "-";
							this.currentObj.eqItem[j].Pmpka = "-";
							this.currentObj.eqItem[j].Pmprv = "-";
							this.currentObj.eqItem[j].Pmpfe = "-";
							this.currentObj.eqItem[j].Pmpin = "-";
							this.currentObj.eqItem[j].Pmpko = "-";
						}
						for (var j = 0; j < this.currentObj.eqSubItem.length; j++) {
							this.currentObj.eqSubItem[j].intPointEnable = false;
							this.currentObj.eqSubItem[j].subQtyEnable = false;
							this.currentObj.eqSubItem[j].subTextEnable = false;
						}
					}
					BOMDetailModel.setData(this.currentObj);
					this.getView().setModel(BOMDetailModel, "BOMDetailModel");

					if (this.currentObj.bomType === "Change" && this.currentObj.eqItem.length > 0) { // 31.07
						this.sLastItemNum = this.currentObj.eqItem[this.currentObj.eqItem.length - 1].Bomitmpos;

					} else {
						this.sLastItemNum = "0000";

					}

					var itemDetailModel = new JSONModel();
					itemDetailModel.setData(this.currentObj.eqItem);
					this.getView().setModel(itemDetailModel, "itemDetailModel");
				}
				if (this.sFragmentName === "changeEbom") {
					FieldsVisibleData.WBSVisible = false;
					FieldsVisibleData.EQVisible = true;
					FieldsVisibleData.FLVisible = false;
					FieldsVisibleData.MATVisible = false;
					FieldsVisibleData.MATCrtVisible = false;
					FieldsVisibleData.RECALLOVisible = false;

					sObj = {
						titleName: this.getView().getModel("i18n").getProperty("changeEbomTitle"),
						headerText: this.getView().getModel("i18n").getProperty("E_BOM_TXT"),
						tableHeader: this.getView().getModel("i18n").getProperty("E_ITEM_OVR")
					};

					refreshModel.setProperty('/refreshSearch', false);

					if (this.uid && sap.ui.getCore().getModel("BOMCHNavModel") === "X") {
						// this.readfrombufferAssembly(this.uid);
						this.readfrombufferBom();
						sap.ui.getCore().setModel(true, "BOMCHNavModel");
						this.oModelUpdateFlag = false;
					} else if (refreshModel.getProperty('/refresh') === true) {
						this.existFlag = false;
						var AIWListEqModel = sap.ui.getCore().getModel("AIWListEqModel");
						var AIWListEqData = AIWListEqModel.getData();
						var BOMDetailModel = new JSONModel();
						for (var i = 0; i < AIWListEqData.length; i++) {
							if (AIWListEqData[i].Eqnrbom === e && AIWListEqData[i].Werks === p && AIWListEqData[i].Stlan === u) {
								this.existFlag = true;
								this.currentObj = AIWListEqData[i];
								BOMDetailModel.setData(this.currentObj);
								this.getView().setModel(BOMDetailModel, "BOMDetailModel");
								this.attachModelEventHandlers(BOMDetailModel);

								var itemDetailModel = new JSONModel();
								itemDetailModel.setData(this.currentObj.eqItem);
								this.getView().setModel(itemDetailModel, "itemDetailModel");
								this.attachModelEventHandlers(itemDetailModel);
								break;
							}
						}

						if (!this.existFlag) {
							this.readBomDetails(e, p, u, this.crstatus);
						}
						this.oModelUpdateFlag = false;
					} else {
						this.oModelUpdateFlag = sap.ui.getCore().getModel("oModelUpdateFlag").updateFlag;
						this.getView().getModel("BOMDetailModel").refresh();
						this.getView().getModel("itemDetailModel").refresh();
						this.currentObj = this.getView().getModel("BOMDetailModel").getData(); // 10.08
					}
				}
				if (this.sFragmentName === "CreateFLBom") {
					FieldsVisibleData.WBSVisible = false;
					FieldsVisibleData.EQVisible = false;
					FieldsVisibleData.FLVisible = true;
					FieldsVisibleData.MATVisible = false;
					FieldsVisibleData.MATCrtVisible = false;
					FieldsVisibleData.RECALLOVisible = false;

					var BOMDetailModel = new JSONModel();
					var AIWListFLModel = sap.ui.getCore().getModel("AIWListFLModel");
					this.currentObj = AIWListFLModel.getProperty(sPath);

					sObj.headerText = this.getView().getModel("i18n").getProperty("FLOC_BOM_TXT");
					sObj.tableHeader = this.getView().getModel("i18n").getProperty("FLOC_ITEM_OVR");
					if (this.currentObj.bomType === "Create") { //24/08
						sObj.titleName = this.getView().getModel("i18n").getProperty("createFLbomTitle");
						this.currentObj.fromDateEnable = true;
					} else if (this.currentObj.bomType === "Change") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("changeFLbomTitle");
						this.currentObj.fromDateEnable = false;
					}

					this.currentObj.crtMatEnable = false;

					if (this.mode === "display") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("flocBomAppHdr"); //24/08
						this.currentObj.FLEnable = false;
						this.currentObj.plantEnable = false;
						this.currentObj.usageEnable = false;
						this.currentObj.BomstatusEnable = false;
						this.currentObj.BaseQtyEnable = false;
						this.currentObj.LngtxtEnable = false;
						this.currentObj.fromDateEnable = false;
						this.currentObj.addItemEnable = false;
						this.currentObj.crtMatEnable = false;
						this.currentObj.modeFlag = "None";
						for (var j = 0; j < this.currentObj.flItem.length; j++) {
							this.currentObj.flItem[j].itmCatEnable = false;
							this.currentObj.flItem[j].itmQtyEnable = false;
							this.currentObj.flItem[j].itmCompEnable = false;
							this.currentObj.flItem[j].itmUomEnable = false;
							//this.currentObj.flItem[j].reccrAllowEnable = false;
							this.currentObj.flItem[j].addSubItmEnable = false;
							this.currentObj.flItem[j].Pmper = "-";
							this.currentObj.flItem[j].Pmpka = "-";
							this.currentObj.flItem[j].Pmprv = "-";
							this.currentObj.flItem[j].Pmpfe = "-";
							this.currentObj.flItem[j].Pmpin = "-";
							this.currentObj.flItem[j].Pmpko = "-";
						}
						for (var j = 0; j < this.currentObj.flSubItem.length; j++) {
							this.currentObj.flSubItem[j].intPointEnable = false;
							this.currentObj.flSubItem[j].subQtyEnable = false;
							this.currentObj.flSubItem[j].subTextEnable = false;
						}
					}
					BOMDetailModel.setData(this.currentObj);
					this.getView().setModel(BOMDetailModel, "BOMDetailModel");

					if (this.currentObj.bomType === "Change" && this.currentObj.flItem.length > 0) { // 31.07
						this.sLastItemNum = this.currentObj.flItem[this.currentObj.flItem.length - 1].Bomitmpos;
					} else {
						this.sLastItemNum = "0000";
					}

					var itemDetailModel = new JSONModel();
					itemDetailModel.setData(this.currentObj.flItem);
					this.getView().setModel(itemDetailModel, "itemDetailModel");
				}
				if (this.sFragmentName === "changeFlbom") {
					FieldsVisibleData.WBSVisible = false;
					FieldsVisibleData.EQVisible = false;
					FieldsVisibleData.FLVisible = true;
					FieldsVisibleData.MATVisible = false;
					FieldsVisibleData.MATCrtVisible = false;
					FieldsVisibleData.RECALLOVisible = false;

					sObj = {
						titleName: this.getView().getModel("i18n").getProperty("changeFLbomTitle"),
						headerText: this.getView().getModel("i18n").getProperty("FLOC_BOM_TXT"),
						tableHeader: this.getView().getModel("i18n").getProperty("FLOC_ITEM_OVR")
					};

					refreshModel.setProperty('/refreshSearch', false);

					if (this.uid && sap.ui.getCore().getModel("BOMCHNavModel") === "X") {
						// this.readfrombufferAssembly(this.uid);
						this.readfrombufferBom();
						sap.ui.getCore().setModel(true, "BOMCHNavModel");
						this.oModelUpdateFlag = false;
					} else if (refreshModel.getProperty('/refresh') === true) {
						this.existFlag = false;
						var AIWListFLModel = sap.ui.getCore().getModel("AIWListFLModel");
						var AIWListFLData = AIWListFLModel.getData();
						var BOMDetailModel = new JSONModel();
						for (var i = 0; i < AIWListFLData.length; i++) {
							if (AIWListFLData[i].Tplnrbom === e && AIWListFLData[i].Werks === p && AIWListFLData[i].Stlan === u) {
								this.existFlag = true;
								this.currentObj = AIWListFLData[i];
								BOMDetailModel.setData(this.currentObj);
								this.getView().setModel(BOMDetailModel, "BOMDetailModel");
								this.attachModelEventHandlers(BOMDetailModel);

								var itemDetailModel = new JSONModel();
								itemDetailModel.setData(this.currentObj.flItem);
								this.getView().setModel(itemDetailModel, "itemDetailModel");
								this.attachModelEventHandlers(itemDetailModel);
								break;
							}
						}

						if (!this.existFlag) {
							this.readBomDetails(e, p, u, this.crstatus);
						}
						this.oModelUpdateFlag = false;
					} else {
						this.oModelUpdateFlag = sap.ui.getCore().getModel("oModelUpdateFlag").updateFlag;
						this.getView().getModel("BOMDetailModel").refresh();
						this.getView().getModel("itemDetailModel").refresh();
						this.currentObj = this.getView().getModel("BOMDetailModel").getData(); // 10.08
					}
				}
				if (this.sFragmentName === "CreateWBSBom") {
					FieldsVisibleData.WBSVisible = true;
					FieldsVisibleData.EQVisible = false;
					FieldsVisibleData.FLVisible = false;
					FieldsVisibleData.MATVisible = true;
					FieldsVisibleData.MATCrtVisible = false;
					FieldsVisibleData.RECALLOVisible = true;

					var BOMDetailModel = new JSONModel();
					var AIWListWBSModel = sap.ui.getCore().getModel("AIWListWBSModel");
					this.currentObj = AIWListWBSModel.getProperty(sPath);

					sObj.headerText = this.getView().getModel("i18n").getProperty("WBS_BOM_TXT");
					sObj.tableHeader = this.getView().getModel("i18n").getProperty("WBS_ITEM_OVR");
					if (this.currentObj.bomType === "Create") { //24/08
						sObj.titleName = this.getView().getModel("i18n").getProperty("createWBSbomTitle");
						this.currentObj.fromDateEnable = true;
					} else if (this.currentObj.bomType === "Change") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("changeWBSbomTitle");
						this.currentObj.fromDateEnable = false;
					}

					this.currentObj.crtMatEnable = false;
					this.currentObj.crtMatHdrEnable = false;
					this.currentObj.crtMatHdrBtnEnable = false;

					if (this.mode === "display") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("wbsBomAppHdr"); //24/08
						this.currentObj.wbsEnable = false;
						this.currentObj.matEnable = false;
						this.currentObj.plantEnable = false;
						this.currentObj.usageEnable = false;
						this.currentObj.BomstatusEnable = false;
						this.currentObj.BaseQtyEnable = false;
						this.currentObj.LngtxtEnable = false;
						this.currentObj.fromDateEnable = false;
						this.currentObj.addItemEnable = false;
						this.currentObj.crtMatEnable = false;
						this.currentObj.crtMatHdrEnable = false;
						this.currentObj.crtMatHdrBtnEnable = false;
						this.currentObj.modeFlag = "None";
						for (var j = 0; j < this.currentObj.wbsItem.length; j++) {
							this.currentObj.wbsItem[j].itmCatEnable = false;
							this.currentObj.wbsItem[j].itmQtyEnable = false;
							this.currentObj.wbsItem[j].itmCompEnable = false;
							this.currentObj.wbsItem[j].itmUomEnable = false;
							//this.currentObj.wbsItem[j].reccrAllowEnable = false;
							this.currentObj.wbsItem[j].addSubItmEnable = false;
							this.currentObj.wbsItem[j].Pmper = "-";
							this.currentObj.wbsItem[j].Pmpka = "-";
							this.currentObj.wbsItem[j].Pmprv = "-";
							this.currentObj.wbsItem[j].Pmpfe = "-";
							this.currentObj.wbsItem[j].Pmpin = "-";
							this.currentObj.wbsItem[j].Pmpko = "-";
						}
						for (var j = 0; j < this.currentObj.wbsSubItem.length; j++) {
							this.currentObj.wbsSubItem[j].intPointEnable = false;
							this.currentObj.wbsSubItem[j].subQtyEnable = false;
							this.currentObj.wbsSubItem[j].subTextEnable = false;
						}
					}
					BOMDetailModel.setData(this.currentObj);
					this.getView().setModel(BOMDetailModel, "BOMDetailModel");

					if (this.currentObj.bomType === "Change" && this.currentObj.wbsItem.length > 0) { // 31.07
						this.sLastItemNum = this.currentObj.wbsItem[this.currentObj.wbsItem.length - 1].Bomitmpos;
					} else {
						this.sLastItemNum = "0000";
					}

					var itemDetailModel = new JSONModel();
					itemDetailModel.setData(this.currentObj.wbsItem);
					this.getView().setModel(itemDetailModel, "itemDetailModel");
				}
				if (this.sFragmentName === "changeWbsbom") {
					FieldsVisibleData.WBSVisible = true;
					FieldsVisibleData.EQVisible = false;
					FieldsVisibleData.FLVisible = false;
					FieldsVisibleData.MATVisible = true;
					FieldsVisibleData.MATCrtVisible = false;
					FieldsVisibleData.crtMatHdrEnable = false;
					FieldsVisibleData.RECALLOVisible = true;

					sObj = {
						titleName: this.getView().getModel("i18n").getProperty("changeWBSbomTitle"),
						headerText: this.getView().getModel("i18n").getProperty("WBS_BOM_TXT"),
						tableHeader: this.getView().getModel("i18n").getProperty("WBS_ITEM_OVR")
					};

					refreshModel.setProperty('/refreshSearch', false);
					if (this.uid && sap.ui.getCore().getModel("BOMCHNavModel") === "X") {
						// this.readfrombufferAssembly(this.uid);
						this.readfrombufferBom();
						sap.ui.getCore().setModel(true, "BOMCHNavModel");
						this.oModelUpdateFlag = false;
					} else if (refreshModel.getProperty('/refresh') === true) {
						this.existFlag = false;
						var AIWListWBSModel = sap.ui.getCore().getModel("AIWListWBSModel");
						var AIWListWBSData = AIWListWBSModel.getData();
						var BOMDetailModel = new JSONModel();
						for (var i = 0; i < AIWListWBSData.length; i++) {
							if (AIWListWBSData[i].Matnr === e && AIWListWBSData[i].Werks === p && AIWListWBSData[i].Stlan === u && AIWListWBSData[i].WbsExt ===
								w) {
								this.existFlag = true;
								this.currentObj = AIWListWBSData[i];
								BOMDetailModel.setData(this.currentObj);
								this.getView().setModel(BOMDetailModel, "BOMDetailModel");
								this.attachModelEventHandlers(BOMDetailModel);

								var itemDetailModel = new JSONModel();
								itemDetailModel.setData(this.currentObj.wbsItem);
								this.getView().setModel(itemDetailModel, "itemDetailModel");
								this.attachModelEventHandlers(itemDetailModel);
								break;
							}
						}

						if (!this.existFlag) {
							this.readBomDetails(e, p, u, this.crstatus, w);
						}
						this.oModelUpdateFlag = false;
					} else {
						this.oModelUpdateFlag = sap.ui.getCore().getModel("oModelUpdateFlag").updateFlag;
						this.getView().getModel("BOMDetailModel").refresh();
						this.getView().getModel("itemDetailModel").refresh();
						this.currentObj = this.getView().getModel("BOMDetailModel").getData();
					}
				}
				//-----------------For Approval starts----------------------
				if (this.mode === "request") {
					if (this.sFragmentName === "CreateMaterialBom") {
						FieldsVisibleData.altbomVisible = true;
						FieldsVisibleData.techtypeVisible = true;
						FieldsVisibleData.bomAltTxtVisible = true;
						FieldsVisibleData.bomHdrTxtVisible = false;
						this.getView().byId("idBOMAltTextTitle").setText(this.getView().getModel("i18n").getProperty("BOM_ALT_TEXT"));
					} else {
						FieldsVisibleData.altbomVisible = false;
						FieldsVisibleData.techtypeVisible = false;
						FieldsVisibleData.bomAltTxtVisible = false;
						FieldsVisibleData.bomHdrTxtVisible = false;
						this.getView().byId("idBOMAltTextTitle").setText();
					}
					FieldsVisibleData.delflgVisible = false;
					FieldsVisibleData.authgrpVisible = false;
					FieldsVisibleData.TitleDataVisible = false;
					FieldsVisibleData.TitleDataText = "";
					FieldsVisibleData.plnrgrpVisible = false;
					FieldsVisibleData.constTypVisible = false;
					FieldsVisibleData.laboffVisible = false;
					FieldsVisibleData.sizeDimVisible = false;
					FieldsVisibleData.invNumVisible = false;
					FieldsVisibleData.manufVisible = false;
					FieldsVisibleData.modNoVisible = false;
					FieldsVisibleData.manufSerVisible = false;
					// FieldsVisibleData.bomAltTxtVisible = false;
					FieldsVisibleData.sopTableVisible = true;
					FieldsVisibleData.tabTableVisible = false;
					sObj.modeFlag = "Delete";
				} else {
					this.getView().byId("idBtnCheck").setVisible(false);
					if (this.sFragmentName === "CreateMaterialBom") {
						FieldsVisibleData.altbomVisible = true;
						FieldsVisibleData.techtypeVisible = true;
						FieldsVisibleData.delflgVisible = true;
						FieldsVisibleData.authgrpVisible = true;
						FieldsVisibleData.TitleDataVisible = true;
						FieldsVisibleData.TitleDataText = this.getResourceBundle().getText("APR_MAT_DATA");
						FieldsVisibleData.laboffVisible = true;
						FieldsVisibleData.sizeDimVisible = true;
						FieldsVisibleData.bomAltTxtVisible = true;
						FieldsVisibleData.bomHdrTxtVisible = true;
						this.getView().byId("idBOMAltTextTitle").setText(this.getView().getModel("i18n").getProperty("BOM_ALT_TEXT"));
						FieldsVisibleData.plnrgrpVisible = false;
						FieldsVisibleData.constTypVisible = false;
						FieldsVisibleData.invNumVisible = false;
						FieldsVisibleData.manufVisible = false;
						FieldsVisibleData.modNoVisible = false;
						FieldsVisibleData.manufSerVisible = false;
					}
					if (this.sFragmentName === "CreateEquipmentBom") {
						FieldsVisibleData.delflgVisible = true;
						FieldsVisibleData.authgrpVisible = true;
						FieldsVisibleData.TitleDataVisible = true;
						FieldsVisibleData.TitleDataText = this.getResourceBundle().getText("APR_EQ_DATA");
						FieldsVisibleData.laboffVisible = true;
						FieldsVisibleData.sizeDimVisible = true;
						FieldsVisibleData.bomAltTxtVisible = false;
						FieldsVisibleData.bomHdrTxtVisible = false;
						this.getView().byId("idBOMAltTextTitle").setText();
						FieldsVisibleData.invNumVisible = true;
						FieldsVisibleData.manufVisible = true;
						FieldsVisibleData.modNoVisible = true;
						FieldsVisibleData.manufSerVisible = true;
						FieldsVisibleData.altbomVisible = false;
						FieldsVisibleData.techtypeVisible = false;
						FieldsVisibleData.plnrgrpVisible = false;
						FieldsVisibleData.constTypVisible = false;
					}
					if (this.sFragmentName === "CreateFLBom") {
						FieldsVisibleData.delflgVisible = true;
						FieldsVisibleData.authgrpVisible = true;
						FieldsVisibleData.TitleDataVisible = true;
						FieldsVisibleData.TitleDataText = this.getResourceBundle().getText("APR_FLOC_DATA");
						FieldsVisibleData.plnrgrpVisible = true;
						FieldsVisibleData.constTypVisible = true;
						FieldsVisibleData.laboffVisible = true;
						FieldsVisibleData.altbomVisible = false;
						FieldsVisibleData.techtypeVisible = false;
						FieldsVisibleData.sizeDimVisible = false;
						FieldsVisibleData.bomAltTxtVisible = false;
						FieldsVisibleData.bomHdrTxtVisible = false;
						this.getView().byId("idBOMAltTextTitle").setText();
						FieldsVisibleData.invNumVisible = false;
						FieldsVisibleData.manufVisible = false;
						FieldsVisibleData.modNoVisible = false;
						FieldsVisibleData.manufSerVisible = false;
					}
					if (this.sFragmentName === "CreateWBSBom") {
						FieldsVisibleData.delflgVisible = true;
						FieldsVisibleData.authgrpVisible = true;
						FieldsVisibleData.TitleDataVisible = true;
						FieldsVisibleData.TitleDataText = this.getResourceBundle().getText("APR_WBS_DATA");
						FieldsVisibleData.laboffVisible = true;
						FieldsVisibleData.plnrgrpVisible = false;
						FieldsVisibleData.constTypVisible = false;
						FieldsVisibleData.altbomVisible = false;
						FieldsVisibleData.techtypeVisible = false;
						FieldsVisibleData.sizeDimVisible = false;
						FieldsVisibleData.bomAltTxtVisible = false;
						FieldsVisibleData.bomHdrTxtVisible = false;
						this.getView().byId("idBOMAltTextTitle").setText();
						FieldsVisibleData.invNumVisible = false;
						FieldsVisibleData.manufVisible = false;
						FieldsVisibleData.modNoVisible = false;
						FieldsVisibleData.manufSerVisible = false;
					}
					FieldsVisibleData.sopTableVisible = false;
					FieldsVisibleData.tabTableVisible = true;
					sObj.modeFlag = "None";
				}
				FieldsVisibleModel.setData(FieldsVisibleData);
				//-----------------For Approval ends----------------------
				oJsonModel.setData(sObj);
				//this.getView().addDependent(this._detailFragment);
				//this.getView().byId("detailPage").addContent(this._detailFragment);
				this.getView().setModel(oJsonModel, "applicationModel");
			} else {
				return;
			}
		},

		/*
		 * Method to read System configuration details
		 */
		readSystem: function () {
			var m = this.getView().getModel("valueHelp");
			var g = this;
			var maxLengthModel = new JSONModel();
			var obj;
			m.read("/SystemTypeSet", {
				success: function (r) {
					if (r.results[0].System === true) {
						obj = {
							maxlengthMat: 40,
							maxlengthComp: 40
						};
					} else {
						obj = {
							maxlengthMat: 18,
							maxlengthComp: 10
						};
					}
					maxLengthModel.setData(obj);
					g.getView().setModel(maxLengthModel, "maxLengthModel");
				}
			});
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Material
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMaterialVH: function (oEvent) {
			var g = this;
			var M = this.getView().getModel("valueHelp");
			var inputId = oEvent.getSource().getId();
			if (inputId.indexOf("idTBLItems") > -1) {
				this.componentFlag = true;
				var sPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
				this.sIndex = parseInt(sPath.substr(-1));
			} else {
				this.componentFlag = false;
			}

			var settings = {
				title: this.getView().getModel("i18n").getProperty("MATERIAL_TXT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/MaterialSHSet",
					template: new sap.m.StandardListItem({
						title: "{Matnr}",
						description: "{Maktx}"
					})
				},
				confirm: function (E) {
					// var g = this.getParent().getController();
					if (g.componentFlag) {
						var itemDetailModel = g.getModel("itemDetailModel");
						var itemDetailData = itemDetailModel.getData();
						itemDetailData[g.sIndex].Itemcomp = E.getParameters().selectedItem.getProperty("title");
						itemDetailData[g.sIndex].Itmcmpdesc = E.getParameters().selectedItem.getProperty("description");
						itemDetailData[g.sIndex].itmCompState = "None";

						g.readComponentDetails(g.sIndex, itemDetailData);
					} else {
						//code for material header (MBOM)
						var BOMDetailModel = g.getModel("BOMDetailModel");
						g.currentObj.Matnr = E.getParameters().selectedItem.getProperty("title");
						g.currentObj.MatDesc = E.getParameters().selectedItem.getProperty("description");
						g.currentObj.matValueState = "None";
						BOMDetailModel.setData(g.currentObj);
						if (g.sFragmentName === "CreateMaterialBom") {
							if (g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
								g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
							}
						}
						if (g.sFragmentName === "CreateWBSBom") {
							if (g.currentObj.WbsExt !== "" && g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
								g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
							}
						}
					}
				}
			};

			var q = "/MaterialSHSet";
			var MaterialSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Matnr", "Maktx");
			MaterialSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			MaterialSelectDialog.open();
		},

		handleMaterialConfirm: function (E) {
			var g = this.getParent().getController();
			if (g.componentFlag) {
				var itemDetailModel = g.getModel("itemDetailModel");
				var itemDetailData = itemDetailModel.getData();
				/*if (g.sFragmentName === "CreateMaterialBom" || g.sFragmentName === "SearchMaterialBom") {
					itemDetailData[g.sIndex].Itemcomp = E.getParameters().selectedItem.getProperty("title");
				}
				if (g.sFragmentName === "CreateEquipmentBom" || g.sFragmentName === "SearchEquipmentBom") {
					itemDetailData[g.sIndex].Itemcomp = E.getParameters().selectedItem.getProperty("title");
				}
				if (g.sFragmentName === "CreateFLBom" || g.sFragmentName === "SearchFLBom") {
					itemDetailData[g.sIndex].Itemcomp = E.getParameters().selectedItem.getProperty("title");
				}
				if (g.sFragmentName === "CreateWBSBom" || g.sFragmentName === "SearchWBSBom") {
					itemDetailData[g.sIndex].Itemcomp = E.getParameters().selectedItem.getProperty("title");
				}*/
				itemDetailData[g.sIndex].Itemcomp = E.getParameters().selectedItem.getProperty("title");
				itemDetailData[g.sIndex].Itmcmpdesc = E.getParameters().selectedItem.getProperty("description");
				itemDetailData[g.sIndex].itmCompState = "None";

				g.readComponentDetails(g.sIndex, itemDetailData);
			} else {
				//code for material header (MBOM)
				var BOMDetailModel = g.getModel("BOMDetailModel");
				g.currentObj.Matnr = E.getParameters().selectedItem.getProperty("title");
				g.currentObj.MatDesc = E.getParameters().selectedItem.getProperty("description");
				g.currentObj.matValueState = "None";
				BOMDetailModel.setData(g.currentObj);
				if (g.sFragmentName === "CreateMaterialBom") {
					if (g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
						g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
					}
				}
				if (g.sFragmentName === "CreateWBSBom") {
					if (g.currentObj.WbsExt !== "" && g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
						g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
					}
				}
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Equipment
		 * @param {sap.ui.base.Event} oEvent
		 */
		onEquipmentVH: function (oEvent) {
			var g = this;
			var M = this.getView().getModel("valueHelp");

			var EquipmentSelectDialog = ValueHelpRequest.EquipmentSelectDialog(g); //common.EquipmentSelectDialog(g);
			this.getView().addDependent(EquipmentSelectDialog);
			EquipmentSelectDialog.setModel(M);
			EquipmentSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");

			EquipmentSelectDialog.open();
		},

		handleEquimentConfirm: function (E) {
			var g = this.getParent().getController();
			var BOMDetailModel = g.getModel("BOMDetailModel");
			g.currentObj.Eqnrbom = E.getParameters().selectedItem.getProperty("title");
			g.currentObj.EquiDesc = E.getParameters().selectedItem.getProperty("description");
			g.currentObj.equipValueState = "None";
			BOMDetailModel.setData(g.currentObj);
			if (g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
				g.readBomHdrDetails(g.currentObj.Eqnrbom, g.currentObj.Werks, g.currentObj.Stlan);
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Functional Location
		 * @param {sap.ui.base.Event} oEvent
		 */
		onFLocVH: function (oEvent) {
			var g = this;
			var M = this.getView().getModel("valueHelp");

			var FLocSelectDialog = ValueHelpRequest.FLocSelectDialog(g); //common.FLocSelectDialog(g);
			this.getView().addDependent(FLocSelectDialog);
			FLocSelectDialog.setModel(M);
			FLocSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");

			FLocSelectDialog.open();
		},

		handleFLocConfirm: function (E) {
			var g = this.getParent().getController();
			var BOMDetailModel = g.getModel("BOMDetailModel");
			g.currentObj.Tplnrbom = E.getParameters().selectedItem.getProperty("title");
			g.currentObj.FLDesc = E.getParameters().selectedItem.getProperty("description");
			g.currentObj.FLValueState = "None";
			BOMDetailModel.setData(g.currentObj);
			if (g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
				g.readBomHdrDetails(g.currentObj.Tplnrbom, g.currentObj.Werks, g.currentObj.Stlan);
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of WBS
		 * @param {sap.ui.base.Event} oEvent
		 */
		onWbsVH: function (oEvent) {
			var g = this;
			var M = this.getView().getModel("valueHelp");
			var BOMDetailModel = g.getModel("BOMDetailModel");

			var settings = {
				title: "{i18n>WBS_TXT}",
				noDataText: "{i18n>LOAD}" + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>DESC_TXT}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>WBS_TXT}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>SHORTID}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>PROJDEF}"
							})
						]
					})
				],
				items: {
					path: "/WBSElementSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Post1}"
							}),
							new sap.m.Text({
								text: "{Posid}"
							}),
							new sap.m.Text({
								text: "{Poski}"
							}),
							new sap.m.Text({
								text: "{Objnr}"
							})
						]
					})

				},
				confirm: function (E) {
						g.currentObj.WbsExt = E.getParameter("selectedItem").getCells()[1].getText();
						g.currentObj.WbsDesc = E.getParameter("selectedItem").getCells()[0].getText();
						g.currentObj.wbsValueState = "None";
						BOMDetailModel.setData(g.currentObj);
						if (g.currentObj.Matnr !== "" && g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
							g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
						}
					} //g.handleWbsConfirm,
			};

			var sPath = "/WBSElementSet";
			var oFilter = [];
			var cells = [
				new sap.m.Text({
					text: "{Post1}"
				}),
				new sap.m.Text({
					text: "{Posid}"
				}),
				new sap.m.Text({
					text: "{Poski}"
				}),
				new sap.m.Text({
					text: "{Objnr}"
				})
			];
			var WbsSelectDialog = ValueHelpProvider.getValueHelp(M, sPath, cells, oFilter, settings, "Post1", "Posid");
			WbsSelectDialog.open();
			WbsSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
		},

		handleWbsConfirm: function (E) {
			var g = this.getParent().getController();
			var BOMDetailModel = g.getModel("BOMDetailModel");
			g.currentObj.WbsExt = E.getParameter("selectedItem").getCells()[1].getText();
			g.currentObj.WbsDesc = E.getParameter("selectedItem").getCells()[0].getText();
			g.currentObj.wbsValueState = "None";
			BOMDetailModel.setData(g.currentObj);
			if (g.currentObj.Matnr !== "" && g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
				g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Plant
		 * @param {sap.ui.base.Event} oEvent
		 */
		onPlantVH: function (oEvent) {
			var g = this;

			var settings = {
				title: this.getView().getModel("i18n").getProperty("PLANT_TXT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/PlantNameSet",
					template: new sap.m.StandardListItem({
						title: "{Werks}",
						description: "{Name1}"
					})
				},
				confirm: function (E) {
					//var g = this.getParent().getController();
					var BOMDetailModel = g.getModel("BOMDetailModel");
					g.currentObj.Werks = E.getParameters().selectedItem.getProperty("title");
					g.currentObj.WerksDesc = E.getParameters().selectedItem.getProperty("description");
					g.currentObj.plantValueState = "None";
					BOMDetailModel.setData(g.currentObj);
					if (g.sFragmentName === "CreateMaterialBom" && g.currentObj.Matnr !== "" && g.currentObj.Stlan !== "") {
						g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
					}
					if (g.sFragmentName === "CreateEquipmentBom" && g.currentObj.Eqnrbom !== "" && g.currentObj.Stlan !== "") {
						g.readBomHdrDetails(g.currentObj.Eqnrbom, g.currentObj.Werks, g.currentObj.Stlan);
					}
					if (g.sFragmentName === "CreateFLBom" && g.currentObj.Tplnrbom !== "" && g.currentObj.Stlan !== "") {
						g.readBomHdrDetails(g.currentObj.Tplnrbom, g.currentObj.Werks, g.currentObj.Stlan);
					}
					if (g.sFragmentName === "CreateWBSBom" && g.currentObj.WbsExt !== "" && g.currentObj.Matnr !== "" && g.currentObj.Stlan !== "") {
						g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
					}
				}
			};

			var q = "/PlantNameSet";
			var M = this.getView().getModel("valueHelp");
			var PlantSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Werks", "Name1");
			PlantSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			PlantSelectDialog.open();
		},

		handlePlantConfirm: function (E) {
			var g = this.getParent().getController();
			var BOMDetailModel = g.getModel("BOMDetailModel");
			g.currentObj.Werks = E.getParameters().selectedItem.getProperty("title");
			g.currentObj.WerksDesc = E.getParameters().selectedItem.getProperty("description");
			g.currentObj.plantValueState = "None";
			BOMDetailModel.setData(g.currentObj);
			if (g.sFragmentName === "CreateMaterialBom" && g.currentObj.Matnr !== "" && g.currentObj.Stlan !== "") {
				g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
			}
			if (g.sFragmentName === "CreateEquipmentBom" && g.currentObj.Eqnrbom !== "" && g.currentObj.Stlan !== "") {
				g.readBomHdrDetails(g.currentObj.Eqnrbom, g.currentObj.Werks, g.currentObj.Stlan);
			}
			if (g.sFragmentName === "CreateFLBom" && g.currentObj.Tplnrbom !== "" && g.currentObj.Stlan !== "") {
				g.readBomHdrDetails(g.currentObj.Tplnrbom, g.currentObj.Werks, g.currentObj.Stlan);
			}
			if (g.sFragmentName === "CreateWBSBom" && g.currentObj.WbsExt !== "" && g.currentObj.Matnr !== "" && g.currentObj.Stlan !== "") {
				g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Usage
		 * @param {sap.ui.base.Event} oEvent
		 */
		omBomUsageVH: function (oEvent) {
			var g = this;
			var oFilters = [];
			if (g.sFragmentName === "CreateEquipmentBom" || g.sFragmentName === "CreateFLBom") {
				oFilters = [new sap.ui.model.Filter("EqFl", "EQ", true)];
			}
			var settings = {
				title: this.getView().getModel("i18n").getProperty("BOM_USAGE_TXT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/BOMUsageHelpSet",
					template: new sap.m.StandardListItem({
						title: "{Stlan}",
						description: "{Antxt}"
					})
				},
				confirm: function (E) {
					// var g = this.getParent().getController();
					var BOMDetailModel = g.getModel("BOMDetailModel");
					g.currentObj.Stlan = E.getParameters().selectedItem.getProperty("title");
					g.currentObj.StlanDesc = E.getParameters().selectedItem.getProperty("description");
					g.currentObj.usageValueState = "None";
					BOMDetailModel.setData(g.currentObj);
					if (g.sFragmentName === "CreateMaterialBom" && g.currentObj.Matnr !== "" && g.currentObj.Werks !== "") {
						g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
					}
					if (g.sFragmentName === "CreateEquipmentBom" && g.currentObj.Eqnrbom !== "" && g.currentObj.Werks !== "") {
						g.readBomHdrDetails(g.currentObj.Eqnrbom, g.currentObj.Werks, g.currentObj.Stlan);
					}
					if (g.sFragmentName === "CreateFLBom" && g.currentObj.Tplnrbom !== "" && g.currentObj.Werks !== "") {
						g.readBomHdrDetails(g.currentObj.Tplnrbom, g.currentObj.Werks, g.currentObj.Stlan);
					}
					if (g.sFragmentName === "CreateWBSBom" && g.currentObj.WbsExt !== "" && g.currentObj.Matnr !== "" && g.currentObj.Werks !== "") {
						g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
					}
				}
			};

			var q = "/BOMUsageHelpSet";
			var M = this.getView().getModel("valueHelp");
			var BomUsageSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilters, settings, "Stlan", "Antxt");
			BomUsageSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			BomUsageSelectDialog.open();
		},

		handleBomUsageConfirm: function (E) {
			var g = this.getParent().getController();
			var BOMDetailModel = g.getModel("BOMDetailModel");
			g.currentObj.Stlan = E.getParameter("selectedItem").getCells()[0].getText();
			g.currentObj.StlanDesc = E.getParameter("selectedItem").getCells()[7].getText();
			g.currentObj.usageValueState = "None";
			BOMDetailModel.setData(g.currentObj);
			if (g.sFragmentName === "CreateMaterialBom" && g.currentObj.Matnr !== "" && g.currentObj.Werks !== "") {
				g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
			}
			if (g.sFragmentName === "CreateEquipmentBom" && g.currentObj.Eqnrbom !== "" && g.currentObj.Werks !== "") {
				g.readBomHdrDetails(g.currentObj.Eqnrbom, g.currentObj.Werks, g.currentObj.Stlan);
			}
			if (g.sFragmentName === "CreateFLBom" && g.currentObj.Tplnrbom !== "" && g.currentObj.Werks !== "") {
				g.readBomHdrDetails(g.currentObj.Tplnrbom, g.currentObj.Werks, g.currentObj.Stlan);
			}
			if (g.sFragmentName === "CreateWBSBom" && g.currentObj.WbsExt !== "" && g.currentObj.Matnr !== "" && g.currentObj.Werks !== "") {
				g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Status
		 * @param {sap.ui.base.Event} oEvent
		 */
		onBomStsVH: function () {
			var g = this;

			var settings = {
				title: this.getView().getModel("i18n").getProperty("BOM_STATUS_TXT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/BOMStatusValueHelpSet",
					template: new sap.m.StandardListItem({
						title: "{BOMStatus}",
						description: "{BOMStatusTxt}"
					})
				},
				confirm: function (E) {
					// var g = this.getParent().getController();
					var BOMDetailModel = g.getModel("BOMDetailModel");
					g.currentObj.Bomstatus = E.getParameters().selectedItem.getProperty("title");
					g.currentObj.BomstatusText = E.getParameters().selectedItem.getProperty("description");
					g.currentObj.statusValueState = "None";
					BOMDetailModel.setData(g.currentObj);
				}
			};

			var q = "/BOMStatusValueHelpSet";
			var M = this.getView().getModel("valueHelp");
			var BomStatusSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "BOMStatus", "BOMStatusTxt");
			BomStatusSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			BomStatusSelectDialog.open();
		},

		handleBomStatusConfirm: function (E) {
			var g = this.getParent().getController();
			var BOMDetailModel = g.getModel("BOMDetailModel");
			g.currentObj.Bomstatus = E.getParameters().selectedItem.getProperty("title");
			g.currentObj.BomstatusText = E.getParameters().selectedItem.getProperty("description");
			g.currentObj.statusValueState = "None";
			BOMDetailModel.setData(g.currentObj);
		},

		/*
		 * Function to handle 'change' event of Status
		 * @param {sap.ui.base.Event} oEvent
		 */
		onBOMStsChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("valueHelp");
			var BOMDetailModel = this.getView().getModel("BOMDetailModel");
			if (newValue !== "") {
				var c = newValue.toUpperCase();
				var oFilter = new sap.ui.model.Filter("BOMStatus", "EQ", c);
				var q = "/BOMStatusValueHelpSet";
				M.read(q, {
					filters: [oFilter],
					success: function (r) {
						if (r.results.length > 0) {
							g.currentObj.Bomstatus = r.results[0].BOMStatus;
							g.currentObj.BomstatusText = r.results[0].BOMStatusTxt;
							g.currentObj.statusValueState = "None";
							BOMDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.statusValueState = "Error";
							g.currentObj.BomstatusText = "";
							BOMDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						g.currentObj.statusValueState = "Error";
						g.currentObj.BomstatusText = "";
						BOMDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.statusValueState = "Error";
				g.currentObj.BomstatusText = "";
				BOMDetailModel.setData(g.currentObj);
			}
		},

		/*
		 * Function to handle 'change' event of Base Quantity
		 * @param {sap.ui.base.Event} oEvent
		 */
		onBaseQtyChange: function (oEvent) {
			var g = this;
			var BOMDetailModel = this.getView().getModel("BOMDetailModel");
			if (oEvent.getSource().getValue() === "") {
				g.currentObj.BaseQtyValueState = "Error";
				BOMDetailModel.setData(g.currentObj);
			} else {
				g.currentObj.BaseQtyValueState = "None";
				BOMDetailModel.setData(g.currentObj);
			}
		},

		/*
		 * Function to handle 'change' event of Material
		 * @param {sap.ui.base.Event} oEvent
		 */
		materialChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("valueHelp");
			var BOMDetailModel = g.getModel("BOMDetailModel");
			if (newValue !== "") {
				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Matnr", "EQ", c)];
				g.BusyDialog.open();
				M.read("/MaterialSHSet", {
					filters: oFilter,
					success: function (r) {
						g.BusyDialog.close();
						if (r.results.length > 0) {
							g.currentObj.Matnr = r.results[0].Matnr;
							g.currentObj.MatDesc = r.results[0].Maktx;
							g.currentObj.matValueState = "None";
							BOMDetailModel.setData(g.currentObj);
							if (g.sFragmentName === "CreateMaterialBom") {
								if (g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
									g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
								}
							}
							if (g.sFragmentName === "CreateWBSBom") {
								if (g.currentObj.WbsExt !== "" && g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
									g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
								}
							}

						} else {
							g.currentObj.MatDesc = "";
							g.currentObj.matValueState = "Error";
							BOMDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						g.BusyDialog.close();
						g.currentObj.MatDesc = "";
						g.currentObj.matValueState = "Error";
						BOMDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.MatDesc = "";
				g.currentObj.matValueState = "Error";
				BOMDetailModel.setData(g.currentObj);
			}
		},

		/*
		 * Function to handle 'change' event of Equipment
		 * @param {sap.ui.base.Event} oEvent
		 */
		equipmentChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("valueHelp");
			var BOMDetailModel = g.getModel("BOMDetailModel");
			if (newValue !== "") {
				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Equnr", "EQ", c)];
				g.BusyDialog.open();
				M.read("/EquipmentNumberSet", {
					filters: oFilter,
					success: function (r) {
						g.BusyDialog.close();
						if (r.results.length > 0) {
							g.currentObj.Eqnrbom = r.results[0].Equnr;
							g.currentObj.EquiDesc = r.results[0].Eqktx;
							g.currentObj.equipValueState = "None";
							BOMDetailModel.setData(g.currentObj);
							if (g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
								g.readBomHdrDetails(g.currentObj.Eqnrbom, g.currentObj.Werks, g.currentObj.Stlan);
							}
						} else {
							g.currentObj.EquiDesc = "";
							g.currentObj.equipValueState = "Error";
							BOMDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						g.BusyDialog.close();
						g.currentObj.EquiDesc = "";
						g.currentObj.equipValueState = "Error";
						BOMDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.EquiDesc = "";
				g.currentObj.equipValueState = "Error";
				BOMDetailModel.setData(g.currentObj);
			}
		},

		/*
		 * Function to handle 'change' event of Functional Location
		 * @param {sap.ui.base.Event} oEvent
		 */
		flocChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("valueHelp");
			var BOMDetailModel = this.getView().getModel("BOMDetailModel");
			if (newValue !== "") {
				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Tplnr", "EQ", c)];
				g.BusyDialog.open();
				M.read("/FunctionLocationSet", {
					filters: oFilter,
					success: function (r) {
						g.BusyDialog.close();
						if (r.results.length > 0) {
							g.currentObj.Tplnrbom = r.results[0].Tplnr;
							g.currentObj.FLDesc = r.results[0].Pltxt;
							g.currentObj.FLValueState = "None";
							BOMDetailModel.setData(g.currentObj);
							if (g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
								g.readBomHdrDetails(g.currentObj.Tplnrbom, g.currentObj.Werks, g.currentObj.Stlan);
							}
						} else {
							g.currentObj.FLDesc = "";
							g.currentObj.FLValueState = "Error";
							BOMDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						g.BusyDialog.close();
						g.currentObj.FLDesc = "";
						g.currentObj.FLValueState = "Error";
						BOMDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.FLDesc = "";
				g.currentObj.FLValueState = "Error";
				BOMDetailModel.setData(g.currentObj);
			}
		},

		/*
		 * Function to handle 'change' event of WBS Element
		 * @param {sap.ui.base.Event} oEvent
		 */
		wbsChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("valueHelp");
			var BOMDetailModel = this.getView().getModel("BOMDetailModel");
			if (newValue !== "") {
				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Posid", "EQ", c)];
				g.BusyDialog.open();
				M.read("/WBSElementSet", {
					filters: oFilter,
					success: function (r) {
						g.BusyDialog.close();
						if (r.results.length > 0) {
							g.currentObj.WbsExt = r.results[0].Posid;
							g.currentObj.WbsDesc = r.results[0].Post1;
							g.currentObj.wbsValueState = "None";
							BOMDetailModel.setData(g.currentObj);
							if (g.currentObj.Matnr !== "" && g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
								g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
							}
						} else {
							g.currentObj.wbsValueState = "Error";
							g.currentObj.WbsDesc = "";
							BOMDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						g.BusyDialog.close();
						g.currentObj.wbsValueState = "Error";
						g.currentObj.WbsDesc = "";
						BOMDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.wbsValueState = "Error";
				g.currentObj.WbsDesc = "";
				BOMDetailModel.setData(g.currentObj);
			}
		},

		/*
		 * Function to handle 'change' event of Plant
		 * @param {sap.ui.base.Event} oEvent
		 */
		plantChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("valueHelp");
			var BOMDetailModel = this.getView().getModel("BOMDetailModel");
			if (newValue !== "") {
				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Werks", "EQ", c)];
				this.BusyDialog.open();
				M.read("/PlantNameSet", {
					filters: oFilter,
					success: function (r) {
						g.BusyDialog.close();
						if (r.results.length > 0) {
							g.currentObj.Werks = r.results[0].Werks;
							g.currentObj.WerksDesc = r.results[0].Name1;
							g.currentObj.plantValueState = "None";
							BOMDetailModel.setData(g.currentObj);
							if (g.sFragmentName === "CreateMaterialBom" && g.currentObj.Matnr !== "" && g.currentObj.Stlan !== "") {
								g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
							}
							if (g.sFragmentName === "CreateEquipmentBom" && g.currentObj.Eqnrbom !== "" && g.currentObj.Stlan !== "") {
								g.readBomHdrDetails(g.currentObj.Eqnrbom, g.currentObj.Werks, g.currentObj.Stlan);
							}
							if (g.sFragmentName === "CreateFLBom" && g.currentObj.Tplnrbom !== "" && g.currentObj.Stlan !== "") {
								g.readBomHdrDetails(g.currentObj.Tplnrbom, g.currentObj.Werks, g.currentObj.Stlan);
							}
							if (g.sFragmentName === "CreateWBSBom" && g.currentObj.WbsExt !== "" && g.currentObj.Matnr !== "" && g.currentObj.Stlan !==
								"") {
								g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
							}
						} else {
							g.currentObj.WerksDesc = "";
							g.currentObj.plantValueState = "Error";
							BOMDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						g.BusyDialog.close();
						g.currentObj.WerksDesc = "";
						g.currentObj.plantValueState = "Error";
						BOMDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.WerksDesc = "";
				g.currentObj.plantValueState = "Error";
				BOMDetailModel.setData(g.currentObj);
			}
		},

		/*
		 * Function to handle 'change' event of Usage
		 * @param {sap.ui.base.Event} oEvent
		 */
		bomUsageChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("valueHelp");
			var BOMDetailModel = this.getView().getModel("BOMDetailModel");
			var oFilter = [];
			if (g.sFragmentName === "CreateEquipmentBom" || g.sFragmentName === "CreateFLBom") {
				oFilter.push(new sap.ui.model.Filter("EqFl", "EQ", true));
			}
			if (newValue !== "") {
				var c = newValue.toUpperCase();
				oFilter.push(new sap.ui.model.Filter("Stlan", "EQ", c));
				g.BusyDialog.open();
				M.read("/BOMUsageHelpSet", {
					filters: oFilter,
					success: function (r) {
						g.BusyDialog.close();
						if (r.results.length > 0) {
							g.currentObj.Stlan = r.results[0].Stlan;
							g.currentObj.StlanDesc = r.results[0].Antxt;
							g.currentObj.usageValueState = "None";
							BOMDetailModel.setData(g.currentObj);
							if (g.sFragmentName === "CreateMaterialBom" && g.currentObj.Matnr !== "" && g.currentObj.Werks !== "") {
								g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
							}
							if (g.sFragmentName === "CreateEquipmentBom" && g.currentObj.Eqnrbom !== "" && g.currentObj.Werks !== "") {
								g.readBomHdrDetails(g.currentObj.Eqnrbom, g.currentObj.Werks, g.currentObj.Stlan);
							}
							if (g.sFragmentName === "CreateFLBom" && g.currentObj.Tplnrbom !== "" && g.currentObj.Werks !== "") {
								g.readBomHdrDetails(g.currentObj.Tplnrbom, g.currentObj.Werks, g.currentObj.Stlan);
							}
							if (g.sFragmentName === "CreateWBSBom" && g.currentObj.WbsExt !== "" && g.currentObj.Matnr !== "" && g.currentObj.Werks !==
								"") {
								g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.WbsExt);
							}
						} else {
							g.currentObj.StlanDesc = "";
							g.currentObj.usageValueState = "Error";
							BOMDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						g.BusyDialog.close();
						g.currentObj.StlanDesc = "";
						g.currentObj.usageValueState = "Error";
						BOMDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.StlanDesc = "";
				g.currentObj.usageValueState = "Error";
				BOMDetailModel.setData(g.currentObj);
			}
		},

		/*
		 * Function to handle 'change' event of Alternate BOM
		 * @param {sap.ui.base.Event} oEvent
		 */
		onAltBomChange: function (oEvent) {
			var g = this;
			if (oEvent.getSource().getValue() !== "") {
				// oEvent.getSource().setEnabled(false);
				// oEvent.getSource().setValueState("None");

				if (g.sFragmentName === "CreateMaterialBom" && g.currentObj.Matnr !== "" && g.currentObj.Werks !== "" && g.currentObj.Stlan !== "") {
					g.readBomHdrDetails(g.currentObj.Matnr, g.currentObj.Werks, g.currentObj.Stlan, g.currentObj.Stalt);
				}
			}
		},

		/*
		 * Method to read BOM Header details
		 * @param {string} m - Material
		 * @param {string} p - Plant
		 * @param {string} u - Usage
		 * @param {string} w - WBS Element
		 */
		readBomHdrDetails: function (m, p, u, w) {
			var g = this;
			var M = this.getView().getModel();
			var q;
			var BOMDetailModel = this.getView().getModel("BOMDetailModel");
			if (g.sFragmentName === "CreateMaterialBom") {
				var existCount = 0;
				var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
				for (var j = 0; j < AIWListMatData.length; j++) {
					if (AIWListMatData[j].Matnr === m && AIWListMatData[j].Werks === p && AIWListMatData[j].Stlan === u && AIWListMatData[j].Stalt ===
						w) {
						var msg = "Material BOM " + m + "/" + p + "/" + u + "/" + w + " already locked in this CR";
						existCount = existCount + 1;
						if (existCount > 1) {
							AIWListMatData[j].Matnr = "";
							AIWListMatData[j].Werks = "";
							AIWListMatData[j].Stlan = "";
							AIWListMatData[j].Stalt = "";
							AIWListMatData[j].MatDesc = "";
							AIWListMatData[j].WerksDesc = "";
							AIWListMatData[j].StlanDesc = "";
							break;
						}
					}
				}
				if (existCount <= 1) {
					q = "/DeriveBOMHDRSet(Material='" + m + "',Werks='" + p + "',Stlan='" + u + "',Stlal='" + w + "',Equnr='',Tplnr='',Proid='')";
				} else {
					g.createMessagePopover(msg, "Error");
					// sap.m.MessageBox.show(msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function (oAction) {}
					// });
					sap.ui.getCore().getModel("AIWListMatModel").setData(AIWListMatData);
					this.getView().getModel("BOMDetailModel").refresh();
					return;
				}
			}
			if (g.sFragmentName === "CreateEquipmentBom") {
				var existCount = 0;
				var AIWListEqData = sap.ui.getCore().getModel("AIWListEqModel").getData();
				if (AIWListEqData.length > 0) {
					for (var j = 0; j < AIWListEqData.length; j++) {
						if (AIWListEqData[j].Eqnrbom === m && AIWListEqData[j].Werks === p && AIWListEqData[j].Stlan === u) {
							var msg = "Equipment BOM " + m + "/" + p + "/" + u + " already locked in this CR";
							existCount = existCount + 1;
							if (existCount > 1) {
								AIWListEqData[j].Eqnrbom = "";
								AIWListEqData[j].Werks = "";
								AIWListEqData[j].Stlan = "";
								AIWListEqData[j].EquiDesc = "";
								AIWListEqData[j].WerksDesc = "";
								AIWListEqData[j].StlanDesc = "";
								break;
							}
						}
					}
				}
				if (existCount <= 1) {
					q = "/DeriveBOMHDRSet(Equnr='" + m + "',Werks='" + p + "',Stlan='" + u + "',Stlal='',Material='',Tplnr='',Proid='')";
				} else {
					g.createMessagePopover(msg, "Error");
					// sap.m.MessageBox.show(msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function (oAction) {}
					// });
					sap.ui.getCore().getModel("AIWListEqModel").setData(AIWListEqData);
					this.getView().getModel("BOMDetailModel").refresh();
					return;
				}
			}
			if (g.sFragmentName === "CreateFLBom") {
				var existCount = 0;
				var AiwListFLData = sap.ui.getCore().getModel("AIWListFLModel").getData();
				if (AiwListFLData.length > 0) {
					for (var j = 0; j < AiwListFLData.length; j++) {
						if (AiwListFLData[j].Tplnrbom === m && AiwListFLData[j].Werks === p && AiwListFLData[j].Stlan === u) {
							var msg = "Functional Location BOM " + m + "/" + p + "/" + u + " already locked in this CR";
							existCount = existCount + 1;
							if (existCount > 1) {
								AiwListFLData[j].Tplnrbom = "";
								AiwListFLData[j].Werks = "";
								AiwListFLData[j].Stlan = "";
								AiwListFLData[j].FLDesc = "";
								AiwListFLData[j].WerksDesc = "";
								AiwListFLData[j].StlanDesc = "";
								break;
							}
						}
					}
				}
				if (existCount <= 1) {
					q = "/DeriveBOMHDRSet(Tplnr='" + m + "',Werks='" + p + "',Stlan='" + u + "',Stlal='',Material='',Equnr='',Proid='')";
				} else {
					g.createMessagePopover(msg, "Error");
					// sap.m.MessageBox.show(msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function (oAction) {}
					// });
					sap.ui.getCore().getModel("AIWListFLModel").setData(AiwListFLData);
					this.getView().getModel("BOMDetailModel").refresh();
					return;
				}
			}
			if (g.sFragmentName === "CreateWBSBom") {
				var existCount = 0;
				var AIWListWBSData = sap.ui.getCore().getModel("AIWListWBSModel").getData();
				if (AIWListWBSData.length > 0) {
					for (var j = 0; j < AIWListWBSData.length; j++) {
						if (AIWListWBSData[j].WbsExt === w && AIWListWBSData[j].Matnr === m && AIWListWBSData[j].Werks === p && AIWListWBSData[j].Stlan ===
							u) {
							var msg = "WBS BOM " + w + "/" + m + "/" + p + "/" + u + " already locked in this CR";
							existCount = existCount + 1;
							if (existCount > 1) {
								AIWListWBSData[j].WbsExt = "";
								AIWListWBSData[j].Matnr = "";
								AIWListWBSData[j].Werks = "";
								AIWListWBSData[j].Stlan = "";
								AIWListWBSData[j].WbsDesc = "";
								AIWListWBSData[j].MatDesc = "";
								AIWListWBSData[j].WerksDesc = "";
								AIWListWBSData[j].StlanDesc = "";
								break;
							}
						}
					}
				}
				if (existCount <= 1) {
					q = "/DeriveBOMHDRSet(Material='" + m + "',Werks='" + p + "',Stlan='" + u + "',Stlal='',Tplnr='',Equnr='',Proid='" + w + "')";
				} else {
					g.createMessagePopover(msg, "Error");
					// sap.m.MessageBox.show(msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function (oAction) {}
					// });
					sap.ui.getCore().getModel("AIWListWBSModel").setData(AIWListWBSData);
					this.getView().getModel("AIWListWBSModel").setData(AIWListWBSData);
					return;
				}
			}
			//this.BusyDialog.open();
			this.getView().byId("idSFBomHeader").setBusy(true);
			M.read(q, {
				success: function (r) {
					g.getView().byId("idSFBomHeader").setBusy(false);
					if (r.Message !== "") {
						g.createMessagePopover(r.Message, "Error");
						g.currentObj.plantEnable = true;
						g.currentObj.usageEnable = true;
						if (g.sFragmentName === "CreateMaterialBom") {
							g.currentObj.matEnable = true;
							g.currentObj.altbomEnable = true;
						}
						if (g.sFragmentName === "CreateEquipmentBom") {
							g.currentObj.equipEnable = true;
						}
						if (g.sFragmentName === "CreateFLBom") {
							g.currentObj.FLEnable = true;
						}
						if (g.sFragmentName === "CreateWBSBom") {
							g.currentObj.wbsEnable = true;
							g.currentObj.matEnable = true;
						}
						// sap.m.MessageBox.show(r.Message, {
						// 	title: "Error",
						// 	icon: sap.m.MessageBox.Icon.ERROR,
						// 	onClose: function (oAction) {}
						// });
						return;
					}
					g.currentObj.BaseQty = r.Bmeng;
					g.currentObj.BaseUom = r.Bmein;
					g.currentObj.Bomstatus = r.Stlst;
					g.currentObj.BomstatusText = r.Sttxt;
					g.currentObj.Validfrom = g.getDateFormat(r.Validfrom);
					g.currentObj.Validtoda = g.getDateFormat(r.Validto);

					g.currentObj.plantEnable = false;
					g.currentObj.usageEnable = false;
					g.currentObj.addItemEnable = true;
					g.currentObj.modeFlag = "Delete";
					if (g.sFragmentName === "CreateMaterialBom") {
						g.currentObj.Stalt = r.Stlal;
						g.currentObj.Pmbomtech = r.Pmbomtech;
						g.currentObj.PmbomtechTxt = r.PmbomtechTxt;
						g.currentObj.matValueState = "None";
						g.currentObj.matEnable = false;
						g.currentObj.altbomValueState = "None";
						g.currentObj.crtMatEnable = true;
						g.currentObj.crtMatHdrBtnEnable = false;
						if (w && w !== "" && g.currentObj.Stalt !== "") {
							g.currentObj.altbomEnable = false;
						}
					}
					if (g.sFragmentName === "CreateEquipmentBom") {
						g.currentObj.equipValueState = "None";
						g.currentObj.equipEnable = false;
					}
					if (g.sFragmentName === "CreateFLBom") {
						g.currentObj.FLValueState = "None";
						g.currentObj.FLEnable = false;
					}
					if (g.sFragmentName === "CreateWBSBom") {
						g.currentObj.wbsValueState = "None";
						g.currentObj.matValueState = "None";
						g.currentObj.wbsEnable = false;
						g.currentObj.matEnable = false;
					}
					g.currentObj.plantValueState = "None";
					g.currentObj.usageValueState = "None";
					g.currentObj.BaseQtyValueState = "None";
					g.currentObj.statusValueState = "None";
					BOMDetailModel.setData(g.currentObj);
					//g.BusyDialog.close();
				},
				error: function (err) {
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
					sap.m.MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function (oAction) {}
					});
					//g.BusyDialog.close();
					g.getView().byId("idSFBomHeader").setBusy(false); //03.08
				}
			});
		},

		/*
		 * Method to get Date in MM/DD/YYYY format
		 * @param {string} _date
		 */
		// getDateFormat: function (_date) {
		// 	if (_date !== "" && _date !== null) {
		// 		var formatDate = "";
		// 		var date = new Date(_date);
		// 		var yyyy = date.getFullYear();
		// 		var mm = date.getMonth();
		// 		if (mm < 10) {
		// 			mm = mm + 1;
		// 			if (mm.length === 1) {
		// 				mm = "0" + mm;
		// 			}
		// 		} else {
		// 			mm = mm + 1;
		// 		}
		// 		var dd = date.getDate();
		// 		if (dd < 10) {
		// 			dd = "0" + dd;
		// 		}
		// 		var hh = date.getHours();
		// 		if (hh < 10) {
		// 			hh = "0" + hh;
		// 		}
		// 		var min = date.getMinutes();
		// 		if (min < 10) {
		// 			min = "0" + min;
		// 		}
		// 		var ss = date.getSeconds();
		// 		if (ss < 10) {
		// 			ss = "0" + ss;
		// 		}
		// 		formatDate = mm + "/" + dd + "/" + yyyy;
		// 		return formatDate;
		// 	} else if (_date === null) {
		// 		return "";
		// 	}
		// },

		getDateFormat: function (e) {
			if (e !== "" && e !== null && e !== undefined) {
				var result;
				if (e instanceof Date) {
					var t = "";
					// var a = new Date(e);
					var s = e.getFullYear();
					var i = e.getMonth();
					if (i < 10) {
						i = i + 1;
						if (i.length === 1) {
							i = "0" + i;
						}
					} else {
						i = i + 1;
					}
					var r = e.getDate();
					if (r < 10) {
						r = "0" + r;
					}
					var l = e.getHours();
					if (l < 10) {
						l = "0" + l;
					}
					var o = e.getMinutes();
					if (o < 10) {
						o = "0" + o;
					}
					var n = e.getSeconds();
					if (n < 10) {
						n = "0" + n;
					}
					result = i + "/" + r + "/" + s;

				} else {
					var nowDate = new Date(parseInt(e.substr(6)));
					var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
						pattern: "MM/dd/yyyy"
					});
					result = dateFormat.format(nowDate);
				}

				return result;
			} else if (e === null) {
				return "";
			}
		},

		/*
		 * Common function to handle 'liveChange' event
		 * @param {sap.ui.base.Event} oEvent
		 */
		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Method to read Item Number 
		 */
		readItemNumber: function () {
			var g = this;
			var tempFlag = true;
			if (g.itemNo === 0 || g.itemNo === undefined) {
				tempFlag = false;
				var m = this.getView().getModel();
				var q = "/BOMUserProfileSet";
				this.getView().byId("idTBLItems").setBusy(true); //03.08
				m.read(q, {
					success: function (r) {
						if (r.results.length > 0) {
							g.itemNo = r.results[0].Psinc;
							g.addItem(g.itemNo);
						}
						g.getView().byId("idTBLItems").setBusy(false); //03.08
					},
					error: function (err) {
						g.getView().byId("idTBLItems").setBusy(false); //03.08
					}
				});
			}
			if (tempFlag === true) {
				g.addItem(g.itemNo);
			}
		},

		/*
		 * Method to add new Item
		 * @param {string} itNo
		 */
		addItem: function (itNo) {
			var g = this;
			var oItem;
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();

			if (itemDetailData !== undefined && itemDetailData !== null && itemDetailData.length !== 0) {
				var leng = itemDetailData.length;
				var oldNo = parseInt(itemDetailData[leng - 1].Bomitmpos);
				var lastNo = 0;
				if (this.sLastItemNum) {
					lastNo = parseInt(this.sLastItemNum);
				}
				var newNo = (oldNo > lastNo) ? oldNo + parseInt(itNo) : lastNo + parseInt(itNo);

				while (newNo.toString().length < 4) {
					newNo = "0" + newNo;
				}
				oItem = {
					Bomitmpos: newNo,
					Itemcat: "",
					Itemcomp: "",
					Itmcmpdesc: "",
					Itmqty: "",
					Itmuom: "",
					Recurallo: false,

					itmCatState: "None",
					itmCompState: "None",
					itmQtyState: "None",
					itmUOMState: "None",
					itmCatEnable: true,
					itmQtyEnable: true,
					reccrAllowEnable: true,
					ItmcmpdescEnabled: false,
					SparePartVis: true,
					RelCostVis: true,
					RelSalesVis: true,
				};
				if (g.sFragmentName === "CreateMaterialBom") {
					oItem.ItmcmpdescEnabled = true;
				}
				/*if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "SearchMaterialBom") {
					oItem.Itemcat = "";
					oItem.Itemcomp = "";
				}
				if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "SearchEquipmentBom") {
					oItem.Itemcat = "";
					oItem.Itemcomp = "";
				}
				if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "SearchFLBom") {
					oItem.Itemcat = "";
					oItem.Itemcomp = "";
				}
				if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "SearchWBSBom") {
					oItem.Itemcat = "";
					oItem.Itemcomp = "";
				}*/

				itemDetailData.push(oItem);
				itemDetailModel.setData(itemDetailData);
				this.getView().setModel(itemDetailModel, "itemDetailModel");
			} else {
				if (this.sLastItemNum !== "0000") {
					itNo = parseInt(this.sLastItemNum) + parseInt(itNo);
					while (itNo.toString().length < 4) {
						itNo = "0" + itNo;
					}
				}
				oItem = {
					Bomitmpos: itNo,
					Itemcat: "",
					Itemcomp: "",
					Itmcmpdesc: "",
					Itmqty: "",
					Itmuom: "",
					Recurallo: false,

					itmCatState: "None",
					itmCompState: "None",
					itmQtyState: "None",
					itmUOMState: "None",
					itmCatEnable: true,
					itmQtyEnable: true,
					ItmcmpdescEnabled: false
				};

				if (g.sFragmentName === "CreateMaterialBom") {
					oItem.ItmcmpdescEnabled = true;
				}
				/*if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "SearchMaterialBom") {
					oItem.Itemcat = "";
					oItem.Itemcomp = "";
				}
				if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "SearchEquipmentBom") {
					oItem.Itemcat = "";
					oItem.Itemcomp = "";
				}
				if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "SearchFLBom") {
					oItem.Itemcat = "";
					oItem.Itemcomp = "";
				}
				if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "SearchWBSBom") {
					oItem.Itemcat = "";
					oItem.Itemcomp = "";
				}*/
				itemDetailData.push(oItem);
				itemDetailModel.setData(itemDetailData);
				this.getView().setModel(itemDetailModel, "itemDetailModel");
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Item Category
		 * @param {sap.ui.base.Event} oEvent
		 */
		onItemCatVH: function (oEvent) {
			var g = this;
			var sPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
			var oFilter = [];
			this.sIndex = parseInt(sPath.substr(-1));

			if (this.sFragmentName.indexOf("MaterialBom") > -1) {
				oFilter = [new sap.ui.model.Filter("Stlty", "EQ", "M")];
			} else if (this.sFragmentName.indexOf("EquipmentBom") > -1) {
				oFilter = [new sap.ui.model.Filter("Stlty", "EQ", "E")];
			} else if (this.sFragmentName.indexOf("FLBom") > -1) {
				oFilter = [new sap.ui.model.Filter("Stlty", "EQ", "T")];
			} else if (this.sFragmentName.indexOf("WBSBom") > -1) {
				oFilter = [new sap.ui.model.Filter("Stlty", "EQ", "P")];
			}

			var settings = {
				title: this.getView().getModel("i18n").getProperty("IT_CAT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/bomitmcatvhSet",
					template: new sap.m.StandardListItem({
						title: "{Postp}",
						description: "{Ptext}"
					})
				},
				confirm: function (E) {
					// var g = this.getParent().getController();
					var itemDetailModel = g.getModel("itemDetailModel");
					var itemDetailData = itemDetailModel.getData();
					itemDetailData[g.sIndex].Itemcat = E.getParameters().selectedItem.getProperty("title");
					itemDetailData[g.sIndex].itmCatState = "None";
					if (itemDetailData[g.sIndex].Itemcat !== "" && itemDetailData[g.sIndex].itmCatState !== "Error") {
						itemDetailData[g.sIndex].itmCatEnable = false;
					}

					if (itemDetailData[g.sIndex].Itemcat === "D" || itemDetailData[g.sIndex].Itemcat === "T") {
						itemDetailData[g.sIndex].itmCompEnable = false;
						itemDetailData[g.sIndex].reccrAllowEnable = false;
						itemDetailData[g.sIndex].Recurallo = false;
						if (itemDetailData[g.sIndex].Itemcat === "D") {
							itemDetailData[g.sIndex].SparePartVis = false;
							itemDetailData[g.sIndex].RelCostVis = false;
							itemDetailData[g.sIndex].RelSalesVis = false;
						}
						if (itemDetailData[g.sIndex].Itemcat === "T") {
							itemDetailData[g.sIndex].SparePartVis = false;
							itemDetailData[g.sIndex].RelCostVis = false;
						}
					} else {
						itemDetailData[g.sIndex].itmCompEnable = true;
						itemDetailData[g.sIndex].reccrAllowEnable = true;
					}

					var selContext = E.getParameter("selectedItem").getBindingContext();
					var selPath = selContext.getPath();
					var selQtyFlag = selContext.getModel().getProperty(selPath).Mngvz;
					itemDetailData[g.sIndex].qtyFlag = selQtyFlag;

					itemDetailModel.setData(itemDetailData);
					g.initializeCategorySpecificFields(g.sIndex);
					g.readComponentDetails(g.sIndex, itemDetailData);
				}
			};

			var q = "/bomitmcatvhSet";
			var M = this.getView().getModel("valueHelp2");
			var ItemCatSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "Postp", "Ptext");
			ItemCatSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			ItemCatSelectDialog.open();
		},

		handleItemCatConfirm: function (E) {
			var g = this.getParent().getController();
			var itemDetailModel = g.getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			itemDetailData[g.sIndex].Itemcat = E.getParameters().selectedItem.getProperty("title");
			itemDetailData[g.sIndex].itmCatState = "None";
			if (itemDetailData[g.sIndex].Itemcat !== "" && itemDetailData[g.sIndex].itmCatState !== "Error") { //23/08
				itemDetailData[g.sIndex].itmCatEnable = false;
			}
			itemDetailModel.setData(itemDetailData);
			// g.readComponentDetails(g.sIndex, itemDetailData);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Item Quantity UOM
		 * @param {sap.ui.base.Event} oEvent
		 */
		onUOMQtyVH: function (oEvent) {
			var gt = this;
			var M = this.getView().getModel("valueHelp2");
			var selPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
			this.sIndex = parseInt(selPath.substr(-1));
			var itemDetailModel = gt.getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();

			var settings = {
				title: "{i18n>UOM_QTY}",
				noDataText: "{i18n>LOAD}" + "...",
				columns: [
					new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>COMMERCIAL}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>INTMEASUNIT}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>UNITTXT}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>DIMSNTXT}"
							})
						]
					})
				],
				items: {
					path: "/QuantityUOMSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Mseh3}"
							}),
							new sap.m.Text({
								text: "{Msehi}"
							}),
							new sap.m.Text({
								text: "{Msehl}"
							}),
							new sap.m.Text({
								text: "{Txdim}"
							})
						]
					})
				},
				confirm: function (E) { //g.handleUomQtyConfirm
					itemDetailData[gt.sIndex].Itmuom = E.getParameter("selectedItem").getCells()[0].getText();
					itemDetailData[gt.sIndex].itmUOMState = "None";

					itemDetailModel.setData(itemDetailData);
					gt.getView().setModel(itemDetailModel, "itemDetailModel");
				}
			};
			var sPath = "/QuantityUOMSet";
			var oFilter = [];
			var cells = [
				new sap.m.Text({
					text: "{Mseh3}"
				}),
				new sap.m.Text({
					text: "{Msehi}"
				}),
				new sap.m.Text({
					text: "{Msehl}"
				}),
				new sap.m.Text({
					text: "{Txdim}"
				})
			];
			var UomQtySelectDialog = ValueHelpProvider.getValueHelp(M, sPath, cells, oFilter, settings, "Msehi", "Msehl");
			UomQtySelectDialog.open();
			UomQtySelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
		},

		handleUomQtyConfirm: function (E) {
			var g = this.getParent().getController();
			var itemDetailModel = g.getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();

			itemDetailData[g.sIndex].Itmuom = E.getParameter("selectedItem").getCells()[0].getText();
			itemDetailData[g.sIndex].itmUOMState = "None";

			itemDetailModel.setData(itemDetailData);
			g.getView().setModel(itemDetailModel, "itemDetailModel");
		},

		/*
		 * Function to handle 'change' event of Item Category, Component, Quantity & UOM
		 * @param {sap.ui.base.Event} oEvent
		 */
		onItemChange: function (oEvent) {
			var sProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			switch (sProperty) {
			case "Itemcat":
				this.handleItemCatChange(oEvent);
				break;
			case "Itemcomp":
				this.handleComponentChange(oEvent);
				break;
			case "Itmqty":
				this.handleItemQtyChange(oEvent);
				break;
			case "Itmuom":
				this.handleItemUOMChange(oEvent);
				break;
			}
		},

		/*
		 * Method to handle Item Category change
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleItemCatChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var sPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
			var index = parseInt(sPath.substr(1));
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemdata = itemDetailModel.getData();
			var M = this.getView().getModel("valueHelp2");
			var oFilter = [];

			if (newValue !== "") {
				var c = newValue.toUpperCase();
				if (this.sFragmentName.indexOf("MaterialBom") > -1) {
					oFilter = [new sap.ui.model.Filter("Stlty", "EQ", "M")];
				} else if (this.sFragmentName.indexOf("EquipmentBom") > -1) {
					oFilter = [new sap.ui.model.Filter("Stlty", "EQ", "E")];
				} else if (this.sFragmentName.indexOf("FLBom") > -1) {
					oFilter = [new sap.ui.model.Filter("Stlty", "EQ", "T")];
				} else if (this.sFragmentName.indexOf("WBSBom") > -1) {
					oFilter = [new sap.ui.model.Filter("Stlty", "EQ", "P")];
				}
				oFilter.push(new sap.ui.model.Filter("Postp", "EQ", c));

				this.getView().byId("idTBLItems").setBusy(true);
				M.read("/bomitmcatvhSet", {
					filters: oFilter,
					success: function (r) {
						g.getView().byId("idTBLItems").setBusy(false);
						if (r.results.length > 0) {
							itemdata[index].Itemcat = r.results[0].Postp;
							itemdata[index].itmCatState = "None";
							if (itemdata[index].Itemcat !== "" && itemdata[index].itmCatState !== "Error") {
								itemdata[index].itmCatEnable = false;
							}

							itemdata[index].qtyFlag = r.results[0].Mngvz;
							if (itemdata[index].Itemcat === "D" || itemdata[index].Itemcat === "T") {
								itemdata[index].itmCompEnable = false;
								itemdata[index].reccrAllowEnable = false;
								itemdata[index].Recurallo = false;
								if (itemdata[index].Itemcat === "D") {
									itemdata[index].SparePartVis = false;
									itemdata[index].RelCostVis = false;
									itemdata[index].RelSalesVis = false;
								}
								if (itemdata[index].Itemcat === "T") {
									itemdata[index].SparePartVis = false;
									itemdata[index].RelCostVis = false;
								}
							} else {
								itemdata[index].itmCompEnable = true;
								itemdata[index].reccrAllowEnable = true;
							}

							itemDetailModel.setData(itemdata);
							g.initializeCategorySpecificFields(index);
							g.readComponentDetails(index, itemdata);
						} else {
							itemdata[index].itmCatState = "Error";
							itemDetailModel.setData(itemdata);
						}
					},
					error: function (err) {
						g.getView().byId("idTBLItems").setBusy(false);
						itemdata[index].itmCatState = "Error";
						itemDetailModel.setData(itemdata);
						g.getView().byId("idTBLItems").setBusy(false);
					}
				});
			} else {
				itemdata[index].itmCatState = "Error";
				itemDetailModel.setData(itemdata);
			}
		},

		/*
		 * Method to handle Component change
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleComponentChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var sPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
			var index = parseInt(sPath.substr(1));
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemdata = itemDetailModel.getData();
			var M = this.getView().getModel("valueHelp");

			if (newValue !== "") {
				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Matnr", "EQ", c)];
				this.getView().byId("idTBLItems").setBusy(true);
				M.read("/MaterialSHSet", {
					filters: oFilter,
					success: function (r) {
						g.getView().byId("idTBLItems").setBusy(false);
						if (r.results.length > 0) {
							itemdata[index].Itemcomp = r.results[0].Matnr;
							itemdata[index].Itmcmpdesc = r.results[0].Maktx;
							itemdata[index].itmCompState = "None";
							if (itemdata[index].Itemcat !== "" && itemdata[index].itmCatState !== "Error") {
								itemdata[index].itmCatEnable = false;
							}
							itemDetailModel.setData(itemdata);
							g.readComponentDetails(index, itemdata);
						} else {
							itemdata[index].itmCompState = "None"; // "Error";
							itemDetailModel.setData(itemdata);
							g.readComponentDetails(index, itemdata);
						}
					},
					error: function (err) {
						g.getView().byId("idTBLItems").setBusy(false);
						itemdata[index].itmCompState = "Error";
						itemDetailModel.setData(itemdata);
					}
				});
			} else {
				itemdata[index].itmCompState = "Error";
				itemDetailModel.setData(itemdata);
			}
		},

		/*
		 * Method to handle Item Quantity change
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleItemQtyChange: function (oEvent) {
			var newValue = oEvent.getParameters().newValue;
			if (newValue !== "") {
				oEvent.getSource().setValueState("None");
			} else {
				oEvent.getSource().setValueState("Error");
				return;
			}

			var selRow = oEvent.getSource().getParent().getBindingContext("itemDetailModel").getPath();
			var itemDetailModel = this.getModel("itemDetailModel");
			// var itemDetailData = itemDetailModel.getData();
			var sQtyFlag = itemDetailModel.getProperty(selRow).qtyFlag;
			var sQty = itemDetailModel.getProperty(selRow).Itmqty;
			var sItemNum = itemDetailModel.getProperty(selRow).Bomitmpos;
			var sItemCtgry = itemDetailModel.getProperty(selRow).Itemcat;

			if (parseFloat(sQty) === 0) {
				itemDetailModel.getProperty(selRow).itmQtyState = "Error";
				this.createMessagePopover(sItemNum + " : Item Quantity cannot be zero", "Error");
			} else if (sQtyFlag === "+" && parseFloat(sQty) < 0) {
				itemDetailModel.getProperty(selRow).itmQtyState = "Error";
				this.createMessagePopover(sItemNum + " : Item Quantity cannot be negative for the category " + sItemCtgry, "Error");
			} else if (sQtyFlag === "-" && parseFloat(sQty) > 0) {
				itemDetailModel.getProperty(selRow).itmQtyState = "Error";
				this.createMessagePopover(sItemNum + " : Item Quantity cannot be positive for the category " + sItemCtgry, "Error");
			}
		},

		/*
		 * Method to handle Item UOM change
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleItemUOMChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var sPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
			var index = parseInt(sPath.substr(1));
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemdata = itemDetailModel.getData();
			var M = this.getView().getModel("valueHelp2");

			if (newValue !== "") {
				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Mseh3", "EQ", c)];
				M.read("/QuantityUOMSet", {
					filters: oFilter,
					success: function (r) {
						if (r.results.length > 0) {
							itemdata[index].Itmuom = r.results[0].Mseh3;
							itemdata[index].itmUOMState = "None";
							itemDetailModel.setData(itemdata);
							// g.readComponentDetails(index, itemdata);
						} else {
							itemdata[index].itmUOMState = "Error";
							itemDetailModel.setData(itemdata);
						}
					},
					error: function (err) {
						itemdata[index].itmUOMState = "Error";
						itemDetailModel.setData(itemdata);
					}
				});
			} else {
				itemdata[index].itmUOMState = "Error";
				itemDetailModel.setData(itemdata);
			}
		},

		/*
		 * Function to handle 'liveChange' event of Item Quantity
		 * @param {sap.ui.base.Event} oEvent
		 */
		onQtyLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") { //isNaN(oEvent.getSource().getValue()) ||
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Common function to handle 'liveChange' event of Component
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCompLiveChange: function (oEvent) {
			var sPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
			var index = parseInt(sPath.substr(1));
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemdata = itemDetailModel.getData();
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			if (oEvent.getSource().getValue() === "") {
				itemdata[index].Itmcmpdesc = "";
				itemDetailModel.setData(itemdata);
			}
			oEvent.getSource().setValueState("None");
		},

		/*
		 * Method to read Component Details
		 * @param {string} sIndex
		 * @param {array} itemDetailData
		 */
		readComponentDetails: function (sIndex, itemDetailData) {
			var g = this;
			var q;
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var M = this.getView().getModel();
			var sStalt = this.currentObj.Stalt ? this.currentObj.Stalt : '';
			if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "changeMbom") {
				q = "/DeriveBOMITMSet(Matnr='" + this.currentObj.Matnr + "',Werks='" + this.currentObj.Werks + "',Stlan='" + this.currentObj
					.Stlan + "',Postp='" + itemDetailData[sIndex].Itemcat + "',Component='" + itemDetailData[sIndex].Itemcomp +
					"',Equnr='',Tplnr='',Stalt='" + sStalt + "')";
			}
			if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "changeEbom") {
				q = "/DeriveBOMITMSet(Equnr='" + this.currentObj.Eqnrbom + "',Werks='" + this.currentObj.Werks + "',Stlan='" + this.currentObj
					.Stlan + "',Postp='" + itemDetailData[sIndex].Itemcat + "',Component='" + itemDetailData[sIndex].Itemcomp +
					"',Matnr='',Tplnr='',Stalt='" + sStalt + "')";
			}
			if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "changeFlbom") {
				q = "/DeriveBOMITMSet(Tplnr='" + this.currentObj.Tplnrbom + "',Werks='" + this.currentObj.Werks + "',Stlan='" + this.currentObj
					.Stlan + "',Postp='" + itemDetailData[sIndex].Itemcat + "',Component='" + itemDetailData[sIndex].Itemcomp +
					"',Matnr='',Equnr='',Stalt='" + sStalt + "')";
			}
			if (g.sFragmentName === "CreateWBSBom" || g.sFragmentName === "changeWbsbom") {
				q = "/DeriveBOMITMSet(Matnr='" + this.currentObj.Matnr + "',Werks='" + this.currentObj.Werks + "',Stlan='" + this.currentObj
					.Stlan + "',Postp='" + itemDetailData[sIndex].Itemcat + "',Component='" + itemDetailData[sIndex].Itemcomp +
					"',Tplnr='',Equnr='',Stalt='" + sStalt + "')";
			}
			this.BusyDialog.open();
			M.read(q, {
				success: function (re) {
					g.BusyDialog.close();
					if (re.Message === "") {
						itemDetailData[sIndex].itmCompState = "None";
						if (itemDetailData[sIndex].Itmqty === "" || parseInt(itemDetailData[sIndex].Itmqty) === 0) {
							itemDetailData[sIndex].Itmqty = re.Menge;
							itemDetailData[sIndex].itmQtyState = "None";
						}
						// if (itemDetailData[sIndex].Itemcomp !== "") { //if (itemDetailData[sIndex].Itmuom === "") {
						itemDetailData[sIndex].Itmuom = re.Meins;
						itemDetailData[sIndex].itmUOMState = "None";
						// } //}

						// for item status
						if (itemDetailData[sIndex].Erskz === "" || itemDetailData[sIndex].Erskz === undefined) {
							itemDetailData[sIndex].Erskz = re.Erskz;
							itemDetailData[sIndex].Etext = re.Etext;
						}
						if (itemDetailData[sIndex].Sanka === "" || itemDetailData[sIndex].Sanka === undefined) {
							itemDetailData[sIndex].Costgrelv = re.Sanka;
							itemDetailData[sIndex].Stext = re.Stext;
						}
						if (itemDetailData[sIndex].Rvrel === "" || itemDetailData[sIndex].Rvrel === undefined) {
							itemDetailData[sIndex].Rvrel = re.Rvrel;
							itemDetailData[sIndex].Bezei = re.Bezei;
						}
						itemDetailData[sIndex].Pmper = re.Pmper;
						itemDetailData[sIndex].Pmpka = re.Pmpka;
						itemDetailData[sIndex].Pmprv = re.Pmprv;
						itemDetailData[sIndex].Pmpfe = re.Pmpfe;
						itemDetailData[sIndex].Pmpin = re.Pmpin;
						itemDetailData[sIndex].Pmpko = re.Pmpko;
						itemDetailData[sIndex].Sanfe = re.Sanfe;
						itemDetailData[sIndex].Sanin = re.Sanin;
						itemDetailData[sIndex].Sanko = re.Sanko;

						itemDetailData[sIndex].Itmassind = re.Itmassind;
						itemDetailData[sIndex].IsNavPossible = re.IsNavPossible;
						itemDetailData[sIndex].Itmcmpdesc = re.Txtmi;

						itemDetailData[sIndex].Ekorg = re.Ekorg;
						itemDetailData[sIndex].Ekgrp = re.Ekgrp;
						itemDetailData[sIndex].Matkl = re.Matkl;
						itemDetailData[sIndex].Ekotx = re.Ekotx;
						itemDetailData[sIndex].Eknam = re.Eknam;
						itemDetailData[sIndex].Preis = re.Preis;
						itemDetailData[sIndex].Waers = re.Waers;
						itemDetailData[sIndex].Peinh = re.Peinh;
						// itemDetailData[sIndex].Potx1 = re.Potx1;
						// itemDetailData[sIndex].Potx2 = re.Potx2;

						itemDetailData[sIndex].Roms1 = re.Roms1;
						itemDetailData[sIndex].Romei = re.Romei;
						itemDetailData[sIndex].Roms2 = re.Roms2;
						itemDetailData[sIndex].Roms3 = re.Roms3;
						itemDetailData[sIndex].Rform = re.Rform;
						// itemDetailData[sIndex].FrmlaKeyDesc = re.Itemcat;
						itemDetailData[sIndex].Roanz = re.Roanz;
						// itemDetailData[sIndex].numVarSizeDesc = re.Itemcat;
						itemDetailData[sIndex].Romen = re.Romen;
						itemDetailData[sIndex].Rokme = re.Rokme;

						itemDetailData[sIndex].addSubItmEnable = re.Subitmflag;

						itemDetailModel.setData(itemDetailData);
						g.getView().setModel(itemDetailModel, "itemDetailModel");

						if (itemDetailData[sIndex].Postp === "R") {
							g.readSizeDetails(sIndex, itemDetailData);
						}
					} else {
						itemDetailData[sIndex].Itmcmpdesc = re.Txtmi;
						itemDetailData[sIndex].itmCompState = "Error";
						itemDetailModel.setData(itemDetailData);
						g.createMessagePopover(re.Message, "Error");
					}
				},
				error: function (err) {
					g.BusyDialog.close();
					var error = [],
						oMessageList = [];
					if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
						.errordetails.length === 0) {
						error[0] = JSON.parse(err.responseText).error.message.value;
					} else {
						for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
							error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
						}
					}

					var value = error.join("\n");
					g.createMessagePopover(value, "Error");
				}
			});
		},

		readSizeDetails: function (sIndex, itemDetailData) {
			var g = this;
			var q;
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var M = this.getView().getModel();
			var sStalt = this.currentObj.Stalt ? this.currentObj.Stalt : '';

			var aFilter = [new sap.ui.model.Filter("Matnr", "EQ", this.currentObj.Matnr),
				new sap.ui.model.Filter("Werks", "EQ", this.currentObj.Werks),
				new sap.ui.model.Filter("Stlan", "EQ", this.currentObj.Stlan),
				new sap.ui.model.Filter("Stalt", "EQ", sStalt),
				new sap.ui.model.Filter("Postp", "EQ", itemDetailData[sIndex].Itemcat),
				new sap.ui.model.Filter("Component", "EQ", itemDetailData[sIndex].Itemcomp),
				new sap.ui.model.Filter("Menge", "EQ", itemDetailData[sIndex].Itmqty),
				new sap.ui.model.Filter("Romei", "EQ", itemDetailData[sIndex].Romei),
				new sap.ui.model.Filter("Roms1", "EQ", itemDetailData[sIndex].Roms1),
				new sap.ui.model.Filter("Roms2", "EQ", itemDetailData[sIndex].Roms2),
				new sap.ui.model.Filter("Roms3", "EQ", itemDetailData[sIndex].Roms3),
				new sap.ui.model.Filter("Rform", "EQ", itemDetailData[sIndex].Rform),
				new sap.ui.model.Filter("Roanz", "EQ", itemDetailData[sIndex].Roanz),
				new sap.ui.model.Filter("Romen", "EQ", itemDetailData[sIndex].Romen),
				new sap.ui.model.Filter("Rokme", "EQ", itemDetailData[sIndex].Rokme)
			];

			this.BusyDialog.open();
			M.read("/DeriveBOMITMSet", {
				filters: aFilter,
				success: function (re) {
					g.BusyDialog.close();
					var res = re.results[0];
					itemDetailData[sIndex].Roms1 = res.Roms1;
					itemDetailData[sIndex].Romei = res.Romei;
					itemDetailData[sIndex].Roms2 = res.Roms2;
					itemDetailData[sIndex].Roms3 = res.Roms3;
					itemDetailData[sIndex].Rform = res.Rform;
					// itemDetailData[sIndex].FrmlaKeyDesc = res.Itemcat;
					itemDetailData[sIndex].Roanz = res.Roanz;
					// itemDetailData[sIndex].numVarSizeDesc = res.Itemcat;
					itemDetailData[sIndex].Romen = res.Romen;
					itemDetailData[sIndex].Rokme = res.Rokme;
				},
				error: function (err) {
					g.BusyDialog.close();
					var error = [],
						oMessageList = [];
					if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
						.errordetails.length === 0) {
						error[0] = JSON.parse(err.responseText).error.message.value;
					} else {
						for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
							error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
						}
					}

					var value = error.join("\n");
					g.createMessagePopover(value, "Error");
				}
			});
		},

		/*
		 * Method to read BOM Details
		 * @param {string} e - Material/Equipment/Functional Location
		 * @param {string} p - Plant
		 * @param {string} u - Usage
		 * @param {string} crstatus - CR Status
		 * @param {string} w - WBS Element
		 */
		readBomDetails: function (e, p, u, crstatus, w, alt) {
			var g = this;
			if (e === " " || e === undefined) {
				return;
			}
			var m = this.getView().getModel();
			var url = "/ChangeRequestSet";
			var oFilter;
			var oExpand;
			var BOMDetailModel = new JSONModel();
			var itemDetailModel = new JSONModel();
			// if (check === "assemblyCheck") {
			// 	if (alt === "") {
			// 		alt = "1";
			// 	}
			// 	oFilter = [new sap.ui.model.Filter("Matnr", "EQ", e),
			// 		new sap.ui.model.Filter("Werks", "EQ", p),
			// 		new sap.ui.model.Filter("Stlan", "EQ", u),
			// 		new sap.ui.model.Filter("Stalt", "EQ", alt)
			// 	];
			// 	oExpand = ["MRBHeader", "MRBItem", "MRBSBIT"];
			// } else {
			if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "changeMbom") {
				if (alt === "" || alt === undefined) {
					alt = "1";
				}
				oFilter = [new sap.ui.model.Filter("Matnr", "EQ", e),
					new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Stlan", "EQ", u),
					new sap.ui.model.Filter("Stalt", "EQ", alt)
				];
				oExpand = ["MRBHeader", "MRBItem", "MRBSBIT"];
			}
			if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "changeEbom") {
				oFilter = [new sap.ui.model.Filter("Eqnrbom", "EQ", e),
					new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Stlan", "EQ", u),
					new sap.ui.model.Filter("Stalt", "EQ", "")
				];
				oExpand = ["EBHeader", "EBItem", "EBSBIT"];
			}
			if (this.sFragmentName === "changeFlbom") {
				oFilter = [new sap.ui.model.Filter("Tplnrbom", "EQ", e),
					new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Stlan", "EQ", u),
					new sap.ui.model.Filter("Stalt", "EQ", "")
				];
				oExpand = ["FBHeader", "FBItem", "FBSBIT"];
			}
			if (this.sFragmentName === "changeWbsbom") {
				oFilter = [new sap.ui.model.Filter("Proid", "EQ", w),
					new sap.ui.model.Filter("Matnr", "EQ", e),
					new sap.ui.model.Filter("Werks", "EQ", p),
					new sap.ui.model.Filter("Stlan", "EQ", u),
					new sap.ui.model.Filter("Stalt", "EQ", "")
				];
				oExpand = ["WBHeader", "WBItem", "WBSBIT"];
			}
			// }
			this.BusyDialog.open();
			m.read(url, {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					g.BusyDialog.close();
					if (r.results[0].Message && r.results[0].Message !== "") {
						g.createMessagePopover(r.results[0].Message, "Information");
						// sap.m.MessageToast.show(r.results[0].Message, {
						// 	duration: 15000,
						// 	animationDuration: 15000
						// });
					}

					if (g.sFragmentName === "CreateMaterialBom" || g.sFragmentName === "changeMbom") {
						var h = r.results[0].MRBHeader.results[0];
						var i = r.results[0].MRBItem.results;
						var s = r.results[0].MRBSBIT.results;
						g.currentObj = {
							Matnr: h.Matnr,
							Werks: h.Werks,
							Stlan: h.Stlan,
							Stalt: h.Stalt,
							Pmbomtech: h.Pmbomtech,
							PmbomtechTxt: h.PmbomtechTxt,
							Bomstatus: h.Bomstatus,
							Lngtxt: h.Txtmi,
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
							fromDateEnable: true,
							addItemEnable: true,
							crtMatHdrEnable: true,
							crtMatHdrBtnEnable: false,
							modeFlag: "Delete",
							matValueState: "None",
							plantValueState: "None",
							usageValueState: "None",
							statusValueState: "None",
							BaseQtyValueState: "None",
							altbomValueState: "None",

							bomType: "Change",

							matItem: [],
							matSubItem: []
						};
						if (g.sFragmentName === "changeMbom") {
							g.currentObj.fromDateEnable = false;
							g.currentObj.crtMatHdrEnable = false;
							g.currentObj.crtMatHdrBtnEnable = false;
						}
						if (i && i.length > 0) {
							g.currentObj.matItem = i;
							for (var j = 0; j < g.currentObj.matItem.length; j++) {
								g.currentObj.matItem[j].itmCatState = "None";
								g.currentObj.matItem[j].itmCompState = "None";
								g.currentObj.matItem[j].itmQtyState = "None";
								g.currentObj.matItem[j].itmUOMState = "None";
								g.currentObj.matItem[j].itmCatEnable = false;
								g.currentObj.matItem[j].itmQtyEnable = true;
								g.currentObj.matItem[j].ItmcmpdescEnabled = true;
								if (g.currentObj.matItem[j].Itemcat === "D" || g.currentObj.matItem[j].Itemcat === "T") {
									g.currentObj.matItem[j].reccrAllowEnable = false;
									g.currentObj.matItem[j].itmCompEnable = false;
									if (g.currentObj.matItem[j].Itemcat === "D") {
										g.currentObj.matItem[j].SparePartVis = false;
										g.currentObj.matItem[j].RelCostVis = false;
										g.currentObj.matItem[j].RelSalesVis = false;
									}
									if (g.currentObj.matItem[j].Itemcat === "T") {
										g.currentObj.matItem[j].SparePartVis = false;
										g.currentObj.matItem[j].RelCostVis = false;
									}
								}
							}
							g.sLastItemNum = i.length;
						} else
							g.currentObj.matItem = [];

						if (s && s.length > 0)
							g.currentObj.matSubItem = s;
						else
							g.currentObj.matSubItem = [];

						g.currentObj.crtMatEnable = true;

						if (crstatus === "true") {
							g.getView().byId("idBtnCheck").setEnabled(false);
							g.currentObj.altbomEnable = false;
							g.currentObj.BomstatusEnable = false;
							g.currentObj.BaseQtyEnable = false;
							g.currentObj.LngtxtEnable = false;
							g.currentObj.fromDateEnable = false;
							g.currentObj.addItemEnable = false;
							g.currentObj.crtMatEnable = false;
							g.currentObj.modeFlag = "None";
							for (var j = 0; j < g.currentObj.matItem.length; j++) {
								g.currentObj.matItem[j].itmQtyEnable = false;
								g.currentObj.matItem[j].itmCompEnable = false;
								g.currentObj.matItem[j].itmUomEnable = false;
								g.currentObj.matItem[j].reccrAllowEnable = false;
								g.currentObj.matItem[j].ItmcmpdescEnabled = false;
								g.currentObj.matItem[j].Pmper = "-";
								g.currentObj.matItem[j].Pmper = "-";
								g.currentObj.matItem[j].Pmpka = "-";
								g.currentObj.matItem[j].Pmprv = "-";
								g.currentObj.matItem[j].Pmpfe = "-";
								g.currentObj.matItem[j].Pmpin = "-";
								g.currentObj.matItem[j].Pmpko = "-";
							}
							for (var j = 0; j < g.currentObj.matSubItem.length; j++) {
								g.currentObj.matSubItem[j].intPointEnable = false;
								g.currentObj.matSubItem[j].subQtyEnable = false;
								g.currentObj.matSubItem[j].subTextEnable = false;
							}
						}
						BOMDetailModel.setData(g.currentObj);
						itemDetailModel.setData(g.currentObj.matItem);
					}
					if (g.sFragmentName === "CreateEquipmentBom" || g.sFragmentName === "changeEbom") {
						var h = r.results[0].EBHeader.results[0];
						var i = r.results[0].EBItem.results;
						var s = r.results[0].EBSBIT.results;
						g.currentObj = {
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
							fromDateEnable: true,
							addItemEnable: true,
							modeFlag: "Delete",
							equipValueState: "None",
							plantValueState: "None",
							usageValueState: "None",
							statusValueState: "None",
							BaseQtyValueState: "None",

							bomType: "Change",

							eqItem: [],
							eqSubItem: []
						};
						if (g.sFragmentName === "changeEbom") {
							g.currentObj.fromDateEnable = false;
						}
						if (i && i.length > 0) {
							g.currentObj.eqItem = i;
							for (var j = 0; j < g.currentObj.eqItem.length; j++) {
								g.currentObj.eqItem[j].itmCatState = "None";
								g.currentObj.eqItem[j].itmCompState = "None";
								g.currentObj.eqItem[j].itmQtyState = "None";
								g.currentObj.eqItem[j].itmUOMState = "None";
								g.currentObj.eqItem[j].itmCatEnable = false;
								g.currentObj.eqItem[j].itmQtyEnable = true;
								g.currentObj.eqItem[j].ItmcmpdescEnabled = false;
								if (g.currentObj.eqItem[j].Itemcat === "D" || g.currentObj.eqItem[j].Itemcat === "T") {
									g.currentObj.eqItem[j].itmCompEnable = false;
									if (g.currentObj.eqItem[j].Itemcat === "D") {
										g.currentObj.eqItem[j].SparePartVis = false;
										g.currentObj.eqItem[j].RelCostVis = false;
										g.currentObj.eqItem[j].RelSalesVis = false;
									}
									if (g.currentObj.eqItem[j].Itemcat === "T") {
										g.currentObj.eqItem[j].SparePartVis = false;
										g.currentObj.eqItem[j].RelCostVis = false;
									}
								}
							}
							g.sLastItemNum = i.length;
						} else
							g.currentObj.eqItem = [];

						if (s && s.length > 0) {
							g.currentObj.eqSubItem = s;
						} else
							g.currentObj.eqSubItem = [];

						g.currentObj.crtMatEnable = false;

						if (crstatus === "true") {
							g.getView().byId("idBtnCheck").setEnabled(false);
							g.currentObj.BomstatusEnable = false;
							g.currentObj.BaseQtyEnable = false;
							g.currentObj.LngtxtEnable = false;
							g.currentObj.fromDateEnable = false;
							g.currentObj.addItemEnable = false;
							g.currentObj.modeFlag = "None";
							for (var j = 0; j < g.currentObj.eqItem.length; j++) {
								g.currentObj.eqItem[j].itmQtyEnable = false;
								g.currentObj.eqItem[j].itmCompEnable = false;
								g.currentObj.eqItem[j].itmUomEnable = false;
								g.currentObj.eqItem[j].addSubItmEnable = false;
								g.currentObj.eqItem[j].Pmper = "-";
								g.currentObj.eqItem[j].Pmpka = "-";
								g.currentObj.eqItem[j].Pmprv = "-";
								g.currentObj.eqItem[j].Pmpfe = "-";
								g.currentObj.eqItem[j].Pmpin = "-";
								g.currentObj.eqItem[j].Pmpko = "-";
							}
							for (var j = 0; j < g.currentObj.eqSubItem.length; j++) {
								g.currentObj.eqSubItem[j].intPointEnable = false;
								g.currentObj.eqSubItem[j].subQtyEnable = false;
								g.currentObj.eqSubItem[j].subTextEnable = false;
							}
						}
						BOMDetailModel.setData(g.currentObj);
						itemDetailModel.setData(g.currentObj.eqItem);
					}
					if (g.sFragmentName === "changeFlbom") {
						var h = r.results[0].FBHeader.results[0];
						var i = r.results[0].FBItem.results;
						var s = r.results[0].FBSBIT.results;
						g.currentObj = {
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
							fromDateEnable: true,
							addItemEnable: true,
							modeFlag: "Delete",
							FLValueState: "None",
							plantValueState: "None",
							usageValueState: "None",
							statusValueState: "None",
							BaseQtyValueState: "None",

							bomType: "Change", //New code

							flItem: [],
							flSubItem: []
						};
						if (g.sFragmentName === "changeFlbom") {
							g.currentObj.fromDateEnable = false;
						}
						if (i && i.length > 0) {
							g.currentObj.flItem = i;
							for (var j = 0; j < g.currentObj.flItem.length; j++) {
								g.currentObj.flItem[j].itmCatState = "None";
								g.currentObj.flItem[j].itmCompState = "None";
								g.currentObj.flItem[j].itmQtyState = "None";
								g.currentObj.flItem[j].itmUOMState = "None";
								g.currentObj.flItem[j].itmCatEnable = false;
								g.currentObj.flItem[j].itmQtyEnable = true;
								g.currentObj.flItem[j].ItmcmpdescEnabled = false;
								if (g.currentObj.flItem[j].Itemcat === "D" || g.currentObj.flItem[j].Itemcat === "T") {
									g.currentObj.flItem[j].itmCompEnable = false;
									if (g.currentObj.flItem[j].Itemcat === "D") {
										g.currentObj.flItem[j].SparePartVis = false;
										g.currentObj.flItem[j].RelCostVis = false;
										g.currentObj.flItem[j].RelSalesVis = false;
									}
									if (g.currentObj.flItem[j].Itemcat === "T") {
										g.currentObj.flItem[j].SparePartVis = false;
										g.currentObj.flItem[j].RelCostVis = false;
									}
								}
							}
							g.sLastItemNum = i.length;
						} else
							g.currentObj.flItem = [];

						if (s && s.length > 0)
							g.currentObj.flSubItem = s;
						else
							g.currentObj.flSubItem = [];

						g.currentObj.crtMatEnable = false;

						if (crstatus === "true") {
							g.getView().byId("idBtnCheck").setEnabled(false);
							g.currentObj.BomstatusEnable = false;
							g.currentObj.BaseQtyEnable = false;
							g.currentObj.LngtxtEnable = false;
							g.currentObj.fromDateEnable = false;
							g.currentObj.addItemEnable = false;
							g.currentObj.modeFlag = "None";
							for (var j = 0; j < g.currentObj.flItem.length; j++) {
								g.currentObj.flItem[j].itmQtyEnable = false;
								g.currentObj.flItem[j].itmCompEnable = false;
								g.currentObj.flItem[j].itmUomEnable = false;
								g.currentObj.flItem[j].addSubItmEnable = false;
								g.currentObj.flItem[j].Pmper = "-";
								g.currentObj.flItem[j].Pmpka = "-";
								g.currentObj.flItem[j].Pmprv = "-";
								g.currentObj.flItem[j].Pmpfe = "-";
								g.currentObj.flItem[j].Pmpin = "-";
								g.currentObj.flItem[j].Pmpko = "-";
							}
							for (var j = 0; j < g.currentObj.flSubItem.length; j++) {
								g.currentObj.flSubItem[j].intPointEnable = false;
								g.currentObj.flSubItem[j].subQtyEnable = false;
								g.currentObj.flSubItem[j].subTextEnable = false;
							}
						}
						BOMDetailModel.setData(g.currentObj);
						itemDetailModel.setData(g.currentObj.flItem);
					}
					if (g.sFragmentName === "changeWbsbom") {
						var h = r.results[0].WBHeader.results[0];
						var i = r.results[0].WBItem.results;
						var s = r.results[0].WBSBIT.results;
						g.currentObj = {
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
							fromDateEnable: true,
							addItemEnable: true,
							modeFlag: "Delete",
							wbsValueState: "None",
							matValueState: "None",
							plantValueState: "None",
							usageValueState: "None",
							statusValueState: "None",
							BaseQtyValueState: "None",

							bomType: "Change", //New code

							wbsItem: [],
							wbsSubItem: []
						};
						if (g.sFragmentName === "changeWbsbom") {
							g.currentObj.fromDateEnable = false;
						}
						if (i && i.length > 0) {
							g.currentObj.wbsItem = i;
							for (var j = 0; j < g.currentObj.wbsItem.length; j++) {
								g.currentObj.wbsItem[j].itmCatState = "None";
								g.currentObj.wbsItem[j].itmCompState = "None";
								g.currentObj.wbsItem[j].itmQtyState = "None";
								g.currentObj.wbsItem[j].itmUOMState = "None";
								g.currentObj.wbsItem[j].itmCatEnable = false;
								g.currentObj.wbsItem[j].itmQtyEnable = true;
								g.currentObj.wbsItem[j].ItmcmpdescEnabled = false;
								if (g.currentObj.wbsItem[j].Itemcat === "D" || g.currentObj.wbsItem[j].Itemcat === "T") {
									g.currentObj.wbsItem[j].reccrAllowEnable = false;
									g.currentObj.wbsItem[j].itmCompEnable = false;
									if (g.currentObj.wbsItem[j].Itemcat === "D") {
										g.currentObj.wbsItem[j].SparePartVis = false;
										g.currentObj.wbsItem[j].RelCostVis = false;
										g.currentObj.wbsItem[j].RelSalesVis = false;
									}
									if (g.currentObj.wbsItem[j].Itemcat === "T") {
										g.currentObj.wbsItem[j].SparePartVis = false;
										g.currentObj.wbsItem[j].RelCostVis = false;
									}
								}
							}
							g.sLastItemNum = i.length;
						} else
							g.currentObj.wbsItem = [];

						if (s && s.length > 0)
							g.currentObj.wbsSubItem = s;
						else
							g.currentObj.wbsSubItem = [];

						g.currentObj.crtMatEnable = false;

						if (crstatus === "true") {
							g.getView().byId("idBtnCheck").setEnabled(false);
							g.currentObj.BomstatusEnable = false;
							g.currentObj.BaseQtyEnable = false;
							g.currentObj.LngtxtEnable = false;
							g.currentObj.fromDateEnable = false;
							g.currentObj.addItemEnable = false;
							g.currentObj.modeFlag = "None";
							for (var j = 0; j < g.currentObj.wbsItem.length; j++) {
								g.currentObj.wbsItem[j].itmQtyEnable = false;
								g.currentObj.wbsItem[j].itmCompEnable = false;
								g.currentObj.wbsItem[j].itmUomEnable = false;
								g.currentObj.wbsItem[j].reccrAllowEnable = false;
								g.currentObj.wbsItem[j].addSubItmEnable = false;
								g.currentObj.wbsItem[j].Pmper = "-";
								g.currentObj.wbsItem[j].Pmpka = "-";
								g.currentObj.wbsItem[j].Pmprv = "-";
								g.currentObj.wbsItem[j].Pmpfe = "-";
								g.currentObj.wbsItem[j].Pmpin = "-";
								g.currentObj.wbsItem[j].Pmpko = "-";
							}
							for (var j = 0; j < g.currentObj.wbsSubItem.length; j++) {
								g.currentObj.wbsSubItem[j].intPointEnable = false;
								g.currentObj.wbsSubItem[j].subQtyEnable = false;
								g.currentObj.wbsSubItem[j].subTextEnable = false;
							}
						}
						BOMDetailModel.setData(g.currentObj);
						itemDetailModel.setData(g.currentObj.wbsItem);
					}
					// }

					g.getView().setModel(BOMDetailModel, "BOMDetailModel");
					g.getView().setModel(itemDetailModel, "itemDetailModel");
					g.attachModelEventHandlers(BOMDetailModel);
					g.attachModelEventHandlers(itemDetailModel);

				},
				error: function (err) {
					g.BusyDialog.close();
				}
			});
		},

		/*
		 * Method to attach model event handlers
		 * @param  oModel
		 */
		attachModelEventHandlers: function (oModel) {
			oModel.attachPropertyChange(this.handlePropertyChanged, this);
		},

		/*
		 * Method to handle model property changed
		 */
		handlePropertyChanged: function () {
			this.oModelUpdateFlag = true;
		},

		/*
		 * Method to handle Item delete
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleItemDelete: function (oEvent) {
			var path = oEvent.getParameter('listItem').getBindingContext("itemDetailModel").sPath;
			path = path.substring(path.lastIndexOf('/') + 1);

			var oModel = oEvent.getSource().getModel("itemDetailModel");
			var data = oModel.getProperty('/');

			var itmNumber = data[parseInt(path)].Bomitmpos;
			if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "changeMbom") {
				var len = this.currentObj.matSubItem.length;
				for (var i = len - 1; i >= 0; i--) {
					if (this.currentObj.matSubItem[i].Posnr === itmNumber) {
						this.currentObj.matSubItem.splice(i, 1);
					}
				}
			}
			if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "changeEbom") {
				var len = this.currentObj.eqSubItem.length;
				for (var i = len - 1; i >= 0; i--) {
					if (this.currentObj.eqSubItem[i].Posnr === itmNumber) {
						this.currentObj.eqSubItem.splice(i, 1);
					}
				}
			}
			if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "changeFlbom") {
				var len = this.currentObj.flSubItem.length;
				for (var i = len - 1; i >= 0; i--) {
					if (this.currentObj.flSubItem[i].Posnr === itmNumber) {
						this.currentObj.flSubItem.splice(i, 1);
					}
				}
			}
			if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "changeWbsbom") {
				var len = this.currentObj.wbsSubItem.length;
				for (var i = len - 1; i >= 0; i--) {
					if (this.currentObj.wbsSubItem[i].Posnr === itmNumber) {
						this.currentObj.wbsSubItem.splice(i, 1);
					}
				}
			}
			data.splice(parseInt(path), 1); //09.08
			oModel.setProperty('/', data);
			//06/08
			if (this.sFragmentName.indexOf("Search") > -1) {
				this.oModelUpdateFlag = true;
			}
		},

		/*
		 * Method to handle Item press
		 * @param {sap.ui.base.Event} oEvent
		 */
		onItemPress: function (oEvent) {
			var g = this;
			var path = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
			var index = parseInt(path.substr(1));
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemdata = itemDetailModel.getData();

			if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "changeMbom") {
				if (itemdata[index].Itemcat === "" || itemdata[index].itmCatState === "Error") {
					itemdata[index].itmCatState = "Error";
					itemDetailModel.setData(itemdata);
					return;
				}
				if (this.sFragmentName === "changeMbom") {
					sap.ui.getCore().setModel({
						updateFlag: this.oModelUpdateFlag
					}, "oModelUpdateFlag");
				}
			}
			if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "changeEbom") {
				if (itemdata[index].Itemcat === "" || itemdata[index].itmCatState === "Error") {
					itemdata[index].itmCatState = "Error";
					itemDetailModel.setData(itemdata);
					return;
				}
				if (this.sFragmentName === "changeEbom") {
					sap.ui.getCore().setModel({
						updateFlag: this.oModelUpdateFlag
					}, "oModelUpdateFlag");
				}
			}
			if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "changeFlbom") {
				if (itemdata[index].Itemcat === "" || itemdata[index].itmCatState === "Error") {
					itemdata[index].itmCatState = "Error";
					itemDetailModel.setData(itemdata);
					return;
				}
				if (this.sFragmentName === "changeFlbom") {
					sap.ui.getCore().setModel({
						updateFlag: this.oModelUpdateFlag
					}, "oModelUpdateFlag");
				}
			}
			if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "changeWbsbom") {
				if (itemdata[index].Itemcat === "" || itemdata[index].itmCatState === "Error") {
					itemdata[index].itmCatState = "Error";
					itemDetailModel.setData(itemdata);
					return;
				}
				if (this.sFragmentName === "changeWbsbom") {
					sap.ui.getCore().setModel({
						updateFlag: this.oModelUpdateFlag
					}, "oModelUpdateFlag");
				}
			}
			var BOMDetailModel = this.getView().getModel("BOMDetailModel");
			sap.ui.getCore().setModel(BOMDetailModel, "BOMDetailModel");
			this.getRouter().navTo("itmDetail", {
				sFragmentName: g.sFragmentName,
				sCrStatus: g.crstatus,
				itemPath: encodeURIComponent(path),
				mode: this.mode
			});
		},

		/*
		 * Function to handle DONE press
		 * @param {sap.ui.base.Event} oEvent
		 */
		onDonePress: function (oEvent) {
			var sSourceId = oEvent.getSource().getId();
			if (this.mode === "request" && this.crstatus !== "true") {
				var g = this;
				var doneFlag = true;
				var BOMDetailModel = this.getView().getModel("BOMDetailModel");
				this.currentObj = BOMDetailModel.getData();
				var itemDetailModel = this.getView().getModel("itemDetailModel");
				if (itemDetailModel) {
					var itemDetailData = itemDetailModel.getData();
				}
				if (this.sFragmentName === "CreateMaterialBom" && this.currentObj.Matnr === "") {
					doneFlag = false;
					this.currentObj.matValueState = "Error";
				}
				if (this.sFragmentName === "CreateMaterialBom" && this.currentObj.Stalt === "") {
					doneFlag = false;
					this.currentObj.altbomValueState = "Error";
				}
				if (this.sFragmentName === "CreateEquipmentBom" && this.currentObj.Eqnrbom === "") {
					doneFlag = false;
					this.currentObj.equipValueState = "Error";
				}
				if (this.sFragmentName === "CreateFLBom" && this.currentObj.Tplnrbom === "") {
					doneFlag = false;
					this.currentObj.FLValueState = "Error";
				}
				if (this.sFragmentName === "CreateWBSBom") {
					if (this.currentObj.Matnr === "") {
						doneFlag = false;
						this.currentObj.matValueState = "Error";
					}
					if (this.currentObj.WbsExt === "") {
						doneFlag = false;
						this.currentObj.wbsValueState = "Error";
					}
				}
				if (this.currentObj.Werks === "") {
					doneFlag = false;
					this.currentObj.plantValueState = "Error";
				}
				if (this.currentObj.Stlan === "") {
					doneFlag = false;
					this.currentObj.usageValueState = "Error";
				}
				if (this.currentObj.BaseQty === "") {
					doneFlag = false;
					this.currentObj.BaseQtyValueState = "Error";
				}
				if (this.currentObj.statusValueState === "Error") {
					doneFlag = false;
				}

				if (itemDetailData !== undefined && itemDetailData.length > 0) {
					for (var i = 0; i < itemDetailData.length; i++) {
						if (itemDetailData[i].Itemcat === "" || itemDetailData[i].itmCatState === "Error") {
							doneFlag = false;
							itemDetailData[i].itmCatState = "Error";
						}
						if (itemDetailData[i].Itemcat !== "N" && itemDetailData[i].Itemcat !== "D" && itemDetailData[i].Itemcat !== "T" && (
								itemDetailData[i].Itemcomp === "" || itemDetailData[i].itmCompState === "Error")) {
							doneFlag = false;
							itemDetailData[i].itmCompState = "Error";
						}
						if (itemDetailData[i].Itmqty === "" || parseInt(itemDetailData[i].Itmqty) === 0 || itemDetailData[i].itmQtyState === "Error") {
							doneFlag = false;
							itemDetailData[i].itmQtyState = "Error";
						}
						if (itemDetailData[i].Itmuom === "" || itemDetailData[i].itmUOMState === "Error") {
							doneFlag = false;
							itemDetailData[i].itmUOMState = "Error";
						}
					}
					itemDetailModel.setData(itemDetailData);
				}

				if (!doneFlag && BOMDetailModel !== undefined) {
					g.createMessagePopover(this.getResourceBundle().getText("MANDMSG"), "Error");
					// sap.m.MessageToast.show(this.getResourceBundle().getText("MANDMSG"), {
					// 	duration: 15000,
					// 	animationDuration: 15000
					// });
					BOMDetailModel.setData(this.currentObj);
					return;
				}

				var itemErrArr = [];
				var itmMsg = "";
				if (itemDetailData !== undefined && itemDetailData.length > 0) {
					for (var i = 0; i < itemDetailData.length; i++) {
						if (itemDetailData[i].Itemcat === "N" && itemDetailData[i].Itemcomp === "") {
							if (itemDetailData[i].Ekgrp === "" || itemDetailData[i].Preis === "" || itemDetailData[i].Waers === "" ||
								itemDetailData[i].Peinh === "" || itemDetailData[i].Matkl === "") {
								itmMsg = "Purchasing data is mandatory for item position " + itemDetailData[i].Bomitmpos;
								itemErrArr.push({
									type: "Error",
									title: itmMsg,
									message: itmMsg
								});
								doneFlag = false;
							}
							if (itemDetailData[i].Potx1 === "") {
								itmMsg = "Item Text is mandatory for item position " + itemDetailData[i].Bomitmpos;
								itemErrArr.push({
									type: "Error",
									title: itmMsg,
									message: itmMsg
								});
								doneFlag = false;
							}
						}
						if (itemDetailData[i].Itemcat === "D" && itemDetailData[i].Bomdocitm === "") {
							itmMsg = "Document Assignment is mandatory for item position " + itemDetailData[i].Bomitmpos;
							itemErrArr.push({
								type: "Error",
								title: itmMsg,
								message: itmMsg
							});
							doneFlag = false;
						}
						if (itemDetailData[i].Itemcat === "R") {
							if (itemDetailData[i].Roms1 === "" || itemDetailData[i].Romei === "" || itemDetailData[i].Roanz === "") {
								itmMsg = "Variable-Size Item Data is mandatory for item position " + itemDetailData[i].Bomitmpos;
								itemErrArr.push({
									type: "Error",
									title: itmMsg,
									message: itmMsg
								});
								doneFlag = false;
							}
						}
						if (itemDetailData[i].Itemcat === "T" && itemDetailData[i].Potx1 === "") {
							itmMsg = "Item Text is mandatory for item position " + itemDetailData[i].Bomitmpos;
							itemErrArr.push({
								type: "Error",
								title: itmMsg,
								message: itmMsg
							});
							doneFlag = false;
						}
					}
				}

				if (!doneFlag) {
					g.createMessagePopover(itemErrArr, "Error");
					return;
				}

				if (this.currentObj.Stalt !== "") {
					this.currentObj.altbomEnable = false;
				}

				if (sSourceId.indexOf("idBtnCheck") > -1) {
					this.validateCheck();
					return;
				}

				if (this.sFragmentName === "CreateMaterialBom") {
					var sBomPath = decodeURIComponent(this.itemPath);
					sap.ui.getCore().getModel("AIWListMatModel").setProperty(sBomPath, g.getView().getModel("BOMDetailModel").getData());
				} else if (this.sFragmentName === "CreateEquipmentBom") {
					var sBomPath = decodeURIComponent(this.itemPath);
					sap.ui.getCore().getModel("AIWListEqModel").setProperty(sBomPath, g.getView().getModel("BOMDetailModel").getData());
				} else if (this.sFragmentName === "CreateFLBom") {
					var sBomPath = decodeURIComponent(this.itemPath);
					sap.ui.getCore().getModel("AIWListFLModel").setProperty(sBomPath, g.getView().getModel("BOMDetailModel").getData());
				} else if (this.sFragmentName === "CreateWBSBom") {
					var sBomPath = decodeURIComponent(this.itemPath);
					sap.ui.getCore().getModel("AIWListWBSModel").setProperty(sBomPath, g.getView().getModel("BOMDetailModel").getData());
				}

				if (this.sFragmentName === "changeMbom") {
					/*if (this.crstatus !== "true") {
						var mObj = BOMDetailModel.getData();
						var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
						AIWListMatData.push(mObj);
						sap.ui.getCore().getModel("AIWListMatModel").setData(AIWListMatData);
					}*/
					if (this.oModelUpdateFlag === true) {
						var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
						if (!this.existFlag) {
							var BOMDetailModel = g.getView().getModel("BOMDetailModel");
							BOMDetailModel.getData().bomType = "Change";
							AIWListMatData.push(BOMDetailModel.getData());
						}
						sap.ui.getCore().getModel("AIWListMatModel").refresh();
					}
					//Do not refresh/empty search table data(set FALSE)
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty('/refreshSearch', false);
					refreshModel.setProperty('/refresh', true);
				}
				if (this.sFragmentName === "changeEbom") {
					/*if (this.crstatus !== "true") {
						var eObj = BOMDetailModel.getData();
						var AIWListEqData = sap.ui.getCore().getModel("AIWListEqModel").getData();
						AIWListEqData.push(eObj);
						sap.ui.getCore().getModel("AIWListEqModel").setData(AIWListEqData);
					}*/
					if (this.oModelUpdateFlag === true) {
						var AIWListEqData = sap.ui.getCore().getModel("AIWListEqModel").getData();
						if (!this.existFlag) {
							var BOMDetailModel = g.getView().getModel("BOMDetailModel");
							BOMDetailModel.getData().bomType = "Change";
							AIWListEqData.push(BOMDetailModel.getData());
						}
						sap.ui.getCore().getModel("AIWListEqModel").refresh();
					}
					//Do not refresh/empty search table data(set FALSE)
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty('/refreshSearch', false);
					refreshModel.setProperty('/refresh', true);
				}
				if (this.sFragmentName === "changeFlbom") {
					/*if (this.crstatus !== "true") {
						var flObj = BOMDetailModel.getData();
						var AIWListFLData = sap.ui.getCore().getModel("AIWListFLModel").getData();
						AIWListFLData.push(flObj);
						sap.ui.getCore().getModel("AIWListFLModel").setData(AIWListFLData);
					}*/
					if (this.oModelUpdateFlag === true) {
						var AIWListFLData = sap.ui.getCore().getModel("AIWListFLModel").getData();
						if (!this.existFlag) {
							var BOMDetailModel = g.getView().getModel("BOMDetailModel");
							BOMDetailModel.getData().bomType = "Change";
							AIWListFLData.push(BOMDetailModel.getData());
						}
						sap.ui.getCore().getModel("AIWListFLModel").refresh();
					}
					//Do not refresh/empty search table data(set FALSE)
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty('/refreshSearch', false);
					refreshModel.setProperty('/refresh', true);
				}
				if (this.sFragmentName === "changeWbsbom") {
					/*if (this.crstatus !== "true") {
						var wbsObj = BOMDetailModel.getData();
						var AIWListWBSData = sap.ui.getCore().getModel("AIWListWBSModel").getData();
						AIWListWBSData.push(wbsObj);
						sap.ui.getCore().getModel("AIWListWBSModel").setData(AIWListWBSData);
					}*/
					if (this.oModelUpdateFlag === true) {
						var AIWListWBSData = sap.ui.getCore().getModel("AIWListWBSModel").getData();
						if (!this.existFlag) {
							var BOMDetailModel = g.getView().getModel("BOMDetailModel");
							BOMDetailModel.getData().bomType = "Change";
							AIWListWBSData.push(BOMDetailModel.getData());
						}
						sap.ui.getCore().getModel("AIWListWBSModel").refresh();
					}
					//Do not refresh/empty search table data(set FALSE)
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty('/refreshSearch', false);
					refreshModel.setProperty('/refresh', true);
				}
			} else {
				if (this.sFragmentName.indexOf("Search") > -1) {
					//Do not refresh/empty search table data(set FALSE)
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty('/refreshSearch', false);
					refreshModel.setProperty('/refresh', true);
				}
			}

			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			}
		},

		/*
		 * Function to handle CHECK press
		 */
		validateCheck: function () {
			var g = this;
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var sAIWData = g.getView().getModel("BOMDetailModel").getData();
			var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
			var sPayload = {
				"ChangeRequestType": oCrType.crtype,
				"CrDescription": oCrType.desc,
				"IsDraft": "C",
				"Messages": [],
				// "Reason": this.getView().byId("reasonForRequest").getSelectedKey(),
				// "Guids": this.oAttach,
				"FuncLoc": [],
				"FLAddr": [],
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"Equipment": [],
				"EqAddr": [],
				"EqPRT": [],
				"EqLAM": [],
				"EqClass": [],
				"EqVal": [],
				"MSPoint": [],
				"MSLAM": [],
				"MSClass": [],
				"MSVal": [],
				"MPLAN": [],
				"MPItem": [],
				"MPLAM": [],
				"MPOBList": [],
				"MPCycle": [],
				"MRBHeader": [],
				"MRBItem": [],
				"MRBSBIT": [],
				"EBHeader": [],
				"EBItem": [],
				"EBSBIT": [],
				"FBHeader": [],
				"FBItem": [],
				"FBSBIT": [],
				"WBHeader": [],
				"WBItem": [],
				"WBSBIT": [],
				"ONetwork": [],
				"ONLAM": [],
				"Workcenter": [],
				"WCCost": [],
				"GTList": [],
				"GTOprs": [],
				"GTComp": [],
				"GTClass": [],
				"GTVal": [],
				"ETList": [],
				"ETOprs": [],
				"ETComp": [],
				"ETClass": [],
				"ETVal": [],
				"FTList": [],
				"FTOprs": [],
				"FTComp": [],
				"FTClass": [],
				"FTVal": [],
				"Olink": [],
				"OLClass": [],
				"OLVal": []
			};

			if (AIWFLOCModel.length > 0) {
				for (var a = 0; a < AIWFLOCModel.length; a++) {
					var sFuncLoc = {
						"Tplnr": AIWFLOCModel[a].Functionallocation,
						"Txtmi": AIWFLOCModel[a].Flocdescription, // Floc Description
						"TplkzFlc": AIWFLOCModel[a].Strucindicator,
						"Tplxt": AIWFLOCModel[a].StrucIndicatorDesc,
						"EditMask": AIWFLOCModel[a].EditMask,
						"Hierarchy": AIWFLOCModel[a].Hierarchy,
						"Fltyp": AIWFLOCModel[a].Floccategory,
						"Flttx": AIWFLOCModel[a].FlocCategoryDesc,
						"Swerk": AIWFLOCModel[a].Maintplant,
						"Plantname": AIWFLOCModel[a].MaintplantDesc,
						"StorFloc": AIWFLOCModel[a].Location, // Location
						"Locationdesc": AIWFLOCModel[a].Locationdesc, // Location Description
						"Abckzfloc": AIWFLOCModel[a].Abckz,
						"Abctx": AIWFLOCModel[a].Abctx,
						"Bukrsfloc": AIWFLOCModel[a].Bukrs,
						"Butxt": AIWFLOCModel[a].Butxt,
						"City": AIWFLOCModel[a].City,
						"KostFloc": AIWFLOCModel[a].Kostl, // Cost Center
						"KokrFloc": AIWFLOCModel[a].Kokrs, // ccPart1
						"Contareaname": AIWFLOCModel[a].Mctxt, // Name
						"PlntFloc": AIWFLOCModel[a].Werks, // Planning Plant
						"Planningplantdes": AIWFLOCModel[a].Planningplantdes, // Planning Plant Description
						"Ingrp": AIWFLOCModel[a].Ingrp, // Planner Group
						"Plannergrpdesc": AIWFLOCModel[a].Innam, // Planner Group Description
						"Arbplfloc": AIWFLOCModel[a].Arbpl, // Work Center
						// "Workcenterdesc" : AIWFLOCModel[a].Ktext, // Plant Work Center
						"Wergwfloc": AIWFLOCModel[a].WcWerks, // Name
						"Gewrkfloc": AIWFLOCModel[a].MainArbpl, // Main Work Center
						// "MainWcDesc" : AIWFLOCModel[a].MainKtext, // Work center Plant
						"MainWcPlant": AIWFLOCModel[a].MainWerks, // Work Center Description
						"Tplma": AIWFLOCModel[a].SupFunctionallocation, // Sup FuncLoc
						"Supflocdesc": AIWFLOCModel[a].SupFlocdescription, // Sup FlocDescription
						"BeberFl": AIWFLOCModel[a].BeberFl, // Plant Section
						"Fing": AIWFLOCModel[a].Fing, // Person responsible
						"Tele": AIWFLOCModel[a].Tele, // Phone
						"Submtiflo": AIWFLOCModel[a].ConstrType, // Construction Type
						"Constdesc": AIWFLOCModel[a].ConstructionDesc, // Construction Description
						"Eqart": AIWFLOCModel[a].TechnicalObjectTyp, // TechnicalObjectTyp
						"Eartx": AIWFLOCModel[a].Description, // TechnicalObjectTyp Description
						"Stattext": AIWFLOCModel[a].Stattext, // System Status
						"StsmFloc": AIWFLOCModel[a].StsmEqui, // Status Profile
						"Statproftxt": AIWFLOCModel[a].StsmEquiDesc, // Status Profile Description
						"UstwFloc": AIWFLOCModel[a].UstwEqui, // Status with Status Number
						"UswoFloc": AIWFLOCModel[a].UswoEqui, // Status without Status Number
						"UstaFloc": AIWFLOCModel[a].UstaEqui, // User Status
						"Adrnri": AIWFLOCModel[a].Adrnri,
						"Deact": AIWFLOCModel[a].Deact
					};
					sPayload.FuncLoc.push(sFuncLoc);

					var sFLAddr = {
						"Funcloc": AIWFLOCModel[a].Functionallocation,
						"Title": AIWFLOCModel[a].TitleCode,
						"Name1": AIWFLOCModel[a].Name1,
						"Name2": AIWFLOCModel[a].Name2,
						"Name3": AIWFLOCModel[a].Name3,
						"Name4": AIWFLOCModel[a].Name4,
						"Sort1": AIWFLOCModel[a].Sort1,
						"Sort2": AIWFLOCModel[a].Sort2,
						"NameCo": AIWFLOCModel[a].NameCo,
						"PostCod1": AIWFLOCModel[a].PostCod1,
						"City1": AIWFLOCModel[a].City1,
						"Building": AIWFLOCModel[a].Building,
						"Floor": AIWFLOCModel[a].Floor,
						"Roomnum": AIWFLOCModel[a].Roomnum,
						"Strsuppl1": AIWFLOCModel[a].Strsuppl1,
						"Strsuppl2": AIWFLOCModel[a].Strsuppl2,
						"Strsuppl3": AIWFLOCModel[a].Strsuppl3,
						"Location": AIWFLOCModel[a].AddrLocation,
						"RPostafl": AIWFLOCModel[a].RefPosta,
						"Landx": AIWFLOCModel[a].Landx,
						"TimeZone": AIWFLOCModel[a].TimeZone,
						"RPostFl": AIWFLOCModel[a].Region,
						"Regiotxt": AIWFLOCModel[a].RegionDesc
					};
					sPayload.FLAddr.push(sFLAddr);

					var aIntlAddr = AIWFLOCModel[a].intlAddr;
					if (aIntlAddr.length > 0) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							sPayload.FLAddrI.push(aIntlAddr[z]);
						}
					}

					if (g.AltLblDerv === "2" && AIWFLOCModel[a].altlbl.length > 0) {
						for (var y = 0; y < AIWFLOCModel[a].altlbl.length; y++) {
							var oAltLbl = {
								"Funcloc": AIWFLOCModel[a].Functionallocation,
								"AltAlkey": AIWFLOCModel[a].altlbl[y].AltAlkey,
								"AltStrno": AIWFLOCModel[a].altlbl[y].AltStrno,
								"AltTplkz": AIWFLOCModel[a].altlbl[y].AltTplkz
							};
							sPayload.FLALTLBEL.push(oAltLbl);
						}
					}

					if (AIWFLOCModel[a].Floccategory === "L") {
						var sFLLAM = {
							"Funcloc": AIWFLOCModel[a].Functionallocation,
							"Lrpid": AIWFLOCModel[a].lam.Lrpid,
							"Strtptatr": AIWFLOCModel[a].lam.Strtptatr,
							"Endptatr": AIWFLOCModel[a].lam.Endptatr,
							"Length": (AIWFLOCModel[a].lam.Length).toString(),
							"LinUnit": AIWFLOCModel[a].lam.LinUnit,
							"Startmrkr": AIWFLOCModel[a].lam.Startmrkr,
							"Endmrkr": AIWFLOCModel[a].lam.Endmrkr,
							"Mrkdisst": AIWFLOCModel[a].lam.Mrkdisst,
							"Mrkdisend": AIWFLOCModel[a].lam.Mrkdisend,
							"MrkrUnit": AIWFLOCModel[a].lam.MrkrUnit
						};
						sPayload.FLLAM.push(sFLLAM);
					}

					var sFLClassList = AIWFLOCModel[a].classItems;
					if (sFLClassList) {
						if (sFLClassList.length > 0) {
							for (var b = 0; b < sFLClassList.length; b++) {
								var sFLClass = {
									"Funcloc": AIWFLOCModel[a].Functionallocation,
									"Classtype": sFLClassList[b].Classtype,
									"Class": sFLClassList[b].Class,
									"Clstatus1": sFLClassList[b].Clstatus1
								};
								sPayload.FLClass.push(sFLClass);
							}
						}
					}

					var sFLCharList = AIWFLOCModel[a].characteristics;
					if (sFLCharList) {
						if (sFLCharList.length > 0) {
							for (var c = 0; c < sFLCharList.length; c++) {
								var sFLVal = {
									"Funcloc": AIWFLOCModel[a].Functionallocation,
									"Atnam": sFLCharList[c].Atnam,
									"Textbez": sFLCharList[c].Textbez,
									"Atwrt": sFLCharList[c].Atwrt,
									"Class": sFLCharList[c].Class
								};
								sPayload.FLVal.push(sFLVal);
							}
						}
					}
				}
			}

			if (AIWEQUIModel.length > 0) {
				for (var d = 0; d < AIWEQUIModel.length; d++) {
					var sEquipment = {
						"Herst": AIWEQUIModel[d].Herst, // Manufacturer
						"Equnr": AIWEQUIModel[d].Equnr,
						"Txtmi": AIWEQUIModel[d].Eqktx,
						//"Eqktx" : AIWEQUIModel[d].Eqktx,
						"Swerk": AIWEQUIModel[d].Maintplant,
						"Name1": AIWEQUIModel[d].MaintplantDesc,
						"TplnEilo": AIWEQUIModel[d].Tplnr,
						"Flocdescription": AIWEQUIModel[d].Pltxt,
						"Eqtyp": AIWEQUIModel[d].EquipmentCatogory,
						"Etytx": AIWEQUIModel[d].EquipCatgDescription,
						"Eqart": AIWEQUIModel[d].TechnicalObjectTyp, // TechnicalObjectTyp
						"Eartx": AIWEQUIModel[d].Description, // TechnicalObjectTyp Description
						"Typbz": AIWEQUIModel[d].Typbz, // Model Number
						"SubmEeqz": AIWEQUIModel[d].ConstrType, // Construction Type
						"Constdesc": AIWEQUIModel[d].ConstructionDesc, // Construction Description
						"BukrEilo": AIWEQUIModel[d].Bukrs,
						"Butxt": AIWEQUIModel[d].Butxt,
						"HequEeqz": AIWEQUIModel[d].SuperordinateEquip, // Superord. Equipment
						"SuperordEqDes": AIWEQUIModel[d].SuperordinateEquipDesc, // Superord. Equipment Description
						"TidnEeqz": AIWEQUIModel[d].TechIdNum, // techIndNo
						"KostEilo": AIWEQUIModel[d].Kostl, // Cost Center
						"KokrEilo": AIWEQUIModel[d].Kokrs, // ccPart1
						"Contareaname": AIWEQUIModel[d].Mctxt, // Name
						"StorEilo": AIWEQUIModel[d].Location,
						"Locationdesc": AIWEQUIModel[d].Locationdesc,
						"AbckEilo": AIWEQUIModel[d].Abckz,
						"Abctx": AIWEQUIModel[d].Abctx,
						"PplaEeqz": AIWEQUIModel[d].Werks, // Planning Plant
						"Planningplantdes": AIWEQUIModel[d].Planningplantdes, // Planning Plant Description
						"IngrEeqz": AIWEQUIModel[d].Ingrp, // Planner Group
						"Plannergrpdesc": AIWEQUIModel[d].Innam, // Planner Group Description
						"Serge": AIWEQUIModel[d].Serge, // manfSerNo
						"MapaEeqz": AIWEQUIModel[d].MapaEeqz, // partNum
						"Stattext": AIWEQUIModel[d].Stattext, // System Status
						"StsmEqui": AIWEQUIModel[d].StsmEqui, // Status Profile
						"Statproftxt": AIWEQUIModel[d].StsmEquiDesc, // Status Profile Description
						"UstwEqui": AIWEQUIModel[d].UstwEqui, // Status with Status Number
						"UswoEqui": AIWEQUIModel[d].UswoEqui, // Status without Status Number
						"UstaEqui": AIWEQUIModel[d].UstaEqui, // User Status
						"Deact": AIWEQUIModel[d].Deact,
						"Answt": AIWEQUIModel[d].Answt,
						"Ansdt": g._formatDate(AIWEQUIModel[d].Ansdt),
						"Waers": AIWEQUIModel[d].Waers, // Currency

						"ArbpEilo": AIWEQUIModel[d].Arbpl, // Work Center
						// "Workcenterdesc" : AIWEQUIModel[d].Ktext, // Plant Work Center
						"WorkCenterPlant": AIWEQUIModel[d].WcWerks, // Name
						"ArbpEeqz": AIWEQUIModel[d].MainArbpl, // Main Work Center
						// "MainWcDesc" : AIWEQUIModel[d].MainKtext, // Work Center Description
						"MainWcPlant": AIWEQUIModel[d].MainWerks, // Work center Plant

						"BebeEilo": AIWEQUIModel[d].BeberFl, // Plant Section
						"Fing": AIWEQUIModel[d].Fing, // Plant Section
						"Tele": AIWEQUIModel[d].Tele, // Plant Section
						"HeqnEeqz": AIWEQUIModel[d].EquipPosition, // Position
						"Adrnri": AIWEQUIModel[d].Adrnri,

						"Funcid": AIWEQUIModel[d].Funcid, // Config Control data
						"Frcfit": AIWEQUIModel[d].Frcfit,
						"Frcrmv": AIWEQUIModel[d].Frcrmv
					};
					sPayload.Equipment.push(sEquipment);

					var sEqPRT = {
						"Equi": AIWEQUIModel[d].Equnr,
						"PlanvPrt": AIWEQUIModel[d].PlanvPrt,
						"SteufPrt": AIWEQUIModel[d].SteufPrt,
						"KtschPrt": AIWEQUIModel[d].KtschPrt,
						"Ewformprt": AIWEQUIModel[d].Ewformprt,
						"SteufRef": AIWEQUIModel[d].SteufRef,
						"KtschRef": AIWEQUIModel[d].KtschRef,
						"EwformRef": AIWEQUIModel[d].EwformRef
					};
					sPayload.EqPRT.push(sEqPRT);

					if (AIWEQUIModel[d].EquipmentCatogory === "L") {
						var sEqLAM = {
							"Equi": AIWEQUIModel[d].Equnr,
							"Lrpid": AIWEQUIModel[d].lam.Lrpid,
							"Strtptatr": AIWEQUIModel[d].lam.Strtptatr,
							"Endptatr": AIWEQUIModel[d].lam.Endptatr,
							"Length": (AIWEQUIModel[d].lam.Length).toString(),
							"LinUnit": AIWEQUIModel[d].lam.LinUnit,
							"Startmrkr": AIWEQUIModel[d].lam.Startmrkr,
							"Endmrkr": AIWEQUIModel[d].lam.Endmrkr,
							"Mrkdisst": AIWEQUIModel[d].lam.Mrkdisst,
							"Mrkdisend": AIWEQUIModel[d].lam.Mrkdisend,
							"MrkrUnit": AIWEQUIModel[d].lam.MrkrUnit
						};
						sPayload.EqLAM.push(sEqLAM);
					}

					var sEqAddr = {
						"Equi": AIWEQUIModel[d].Equnr,
						"Title": AIWEQUIModel[d].TitleCode,
						"Name1": AIWEQUIModel[d].Name1,
						"Name2": AIWEQUIModel[d].Name2,
						"Name3": AIWEQUIModel[d].Name3,
						"Name4": AIWEQUIModel[d].Name4,
						"Sort1": AIWEQUIModel[d].Sort1,
						"Sort2": AIWEQUIModel[d].Sort2,
						"NameCo": AIWEQUIModel[d].NameCo,
						"PostCod1": AIWEQUIModel[d].PostCod1,
						"City1": AIWEQUIModel[d].City1,
						"Building": AIWEQUIModel[d].Building,
						"Floor": AIWEQUIModel[d].Floor,
						"Roomnum": AIWEQUIModel[d].Roomnum,
						"Strsuppl1": AIWEQUIModel[d].Strsuppl1,
						"Strsuppl2": AIWEQUIModel[d].Strsuppl2,
						"Strsuppl3": AIWEQUIModel[d].Strsuppl3,
						"Location": AIWEQUIModel[d].AddrLocation,
						"RefPosta": AIWEQUIModel[d].RefPosta,
						"Landx": AIWEQUIModel[d].Landx,
						"TimeZone": AIWEQUIModel[d].TimeZone,
						"RfePost": AIWEQUIModel[d].Region,
						"Regiotxt": AIWEQUIModel[d].RegionDesc
					};
					sPayload.EqAddr.push(sEqAddr);

					var aIntlAddrItems = AIWEQUIModel[d].intlAddr;
					if (aIntlAddrItems.length > 0) {
						for (var z = 0; z < aIntlAddrItems.length; z++) {
							sPayload.EqAddrI.push(aIntlAddrItems[z]);
						}
					}

					var sEqClassList = AIWEQUIModel[d].classItems;
					if (sEqClassList) {
						if (sEqClassList.length > 0) {
							for (var e = 0; e < sEqClassList.length; e++) {
								var sEqClass = {
									"Equi": AIWEQUIModel[d].Equnr,
									"Classtype": sEqClassList[e].Classtype,
									"Class": sEqClassList[e].Class,
									"Clstatus1": sEqClassList[e].Clstatus1
								};
								sPayload.EqClass.push(sEqClass);
							}
						}
					}

					var sEqCharList = AIWEQUIModel[d].characteristics;
					if (sEqCharList) {
						if (sEqCharList.length > 0) {
							for (var f = 0; f < sEqCharList.length; f++) {
								var sEqVal = {
									"Equi": AIWEQUIModel[d].Equnr,
									"Atnam": sEqCharList[f].Atnam,
									"Textbez": sEqCharList[f].Textbez,
									"Atwrt": sEqCharList[f].Atwrt,
									"Class": sEqCharList[f].Class
								};
								sPayload.EqVal.push(sEqVal);
							}
						}
					}
				}
			}

			if (this.sFragmentName.indexOf("MaterialBom") > -1) {
				var mHeader = {
					"Matnr": sAIWData.Matnr,
					"Stalt": sAIWData.Stalt,
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Pmbomtech": sAIWData.Pmbomtech ? sAIWData.Pmbomtech : "",
					"PmbomtechTxt": sAIWData.PmbomtechTxt ? sAIWData.PmbomtechTxt : "",
					"Bomstatus": sAIWData.Bomstatus,
					"Lngtxt": sAIWData.Lngtxt,
					"Txtmi": sAIWData.Lngtxt,
					"Validfrom": this._formatDate(sAIWData.Validfrom),
					"Baseqty": sAIWData.BaseQty,
					"Baseuom": sAIWData.BaseUom,
					"Validtoda": this._formatDate(sAIWData.Validtoda)
				};
				sPayload.MRBHeader.push(mHeader);

				for (var j = 0; j < sAIWData.matItem.length; j++) {
					var mItem = {
						"Matnr": sAIWData.Matnr,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						//"Bomitmnod": sAIWData.Bomitmnod, //13.08
						"Bomitmpos": sAIWData.matItem[j].Bomitmpos,
						"Itemcat": sAIWData.matItem[j].Itemcat,
						"Itemcomp": sAIWData.matItem[j].Itemcomp,
						"Compdesc": "",
						"Itmqty": sAIWData.matItem[j].Itmqty,
						"Itmuom": sAIWData.matItem[j].Itmuom,
						"Recurallo": sAIWData.matItem[j].Recurallo,
						"Erskz": sAIWData.matItem[j].Erskz,
						"Rvrel": sAIWData.matItem[j].Rvrel === "0" ? "" : sAIWData.matItem[j].Rvrel,
						"Sanfe": sAIWData.matItem[j].Sanfe,
						"Sanin": sAIWData.matItem[j].Sanin,
						"Sanko": sAIWData.matItem[j].Sanko,
						"Itmcmpdesc": sAIWData.matItem[j].Itmcmpdesc,
						"Costgrelv": sAIWData.matItem[j].Costgrelv === "0" ? "" : sAIWData.matItem[j].Costgrelv
					};
					if (sAIWData.bomType === "Change") {
						mItem.Bomitmnod = sAIWData.matItem[j].Bomitmnod;
					}
					if (sAIWData.matItem[j].Itemcat === "N") {
						mItem.Ekorg = sAIWData.matItem[j].Ekorg;
						mItem.Ekotx = sAIWData.matItem[j].Ekotx;
						mItem.Ekgrp = sAIWData.matItem[j].Ekgrp;
						mItem.Eknam = sAIWData.matItem[j].Eknam;
						mItem.Preis = sAIWData.matItem[j].Preis;
						mItem.Waers = sAIWData.matItem[j].Waers;
						mItem.Peinh = sAIWData.matItem[j].Peinh;
						mItem.Matkl = sAIWData.matItem[j].Matkl;
						mItem.Wgbez = sAIWData.matItem[j].Wgbez;
						mItem.Potx1 = sAIWData.matItem[j].Potx1;
					} else if (sAIWData.matItem[j].Itemcat === "D") {
						mItem.Bomdocitm = sAIWData.matItem[j].Bomdocitm;
						mItem.Bomitmdkr = sAIWData.matItem[j].Bomitmdkr;
						mItem.BomitmdkrTxt = sAIWData.matItem[j].BomitmdkrTxt;
						mItem.Bomitmdtl = sAIWData.matItem[j].Bomitmdtl;
						mItem.Bomitmdvr = sAIWData.matItem[j].Bomitmdvr;
					} else if (sAIWData.matItem[j].Itemcat === "R") {
						mItem.Roms1 = sAIWData.matItem[j].Roms1;
						mItem.Romei = sAIWData.matItem[j].Romei;
						mItem.Roms2 = sAIWData.matItem[j].Roms2;
						mItem.Roms3 = sAIWData.matItem[j].Roms3;
						mItem.Rform = sAIWData.matItem[j].Rform;
						// mItem.FrmlaKeyDesc = sAIWData.matItem[j].Itemcat;
						mItem.Roanz = sAIWData.matItem[j].Roanz;
						// mItem.numVarSizeDesc = sAIWData.matItem[j].Itemcat;
						mItem.Romen = sAIWData.matItem[j].Romen;
						mItem.Rokme = sAIWData.matItem[j].Rokme;
					} else if (sAIWData.matItem[j].Itemcat === "T") {
						mItem.Potx1 = sAIWData.matItem[j].Potx1;
					}
					sPayload.MRBItem.push(mItem);
				}

				for (var k = 0; k < sAIWData.matSubItem.length; k++) {
					var mSubItem = {
						"Matnr": sAIWData.Matnr,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Posnr": sAIWData.matSubItem[k].Posnr,
						"Bomitmnod": sAIWData.matSubItem[k].Bomitmnod,
						"Bomsubno": sAIWData.matSubItem[k].Bomsubno,
						"Ebort": sAIWData.matSubItem[k].Ebort,
						"Upmng": sAIWData.matSubItem[k].Upmng,
						"Uptxt": sAIWData.matSubItem[k].Uptxt
					};
					sPayload.MRBSBIT.push(mSubItem);
				}
			} else if (this.sFragmentName.indexOf("EquipmentBom") > -1) {
				var eHeader = {
					"Eqnrbom": sAIWData.Eqnrbom,
					//"Stalt": "",
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Bomstatus": sAIWData.Bomstatus,
					"Lngtxt": sAIWData.Lngtxt,
					"Txtmi": sAIWData.Lngtxt,
					"Validfrom": this._formatDate(sAIWData.Validfrom),
					"Baseqty": sAIWData.BaseQty,
					"Baseuom": sAIWData.BaseUom,
					"Validtoda": this._formatDate(sAIWData.Validtoda)
				};
				sPayload.EBHeader.push(eHeader);

				for (var j = 0; j < sAIWData.eqItem.length; j++) {
					var eItem = {
						"Eqnrbom": sAIWData.Eqnrbom,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Bomitmpos": sAIWData.eqItem[j].Bomitmpos,
						"Itemcat": sAIWData.eqItem[j].Itemcat,
						"Itemcomp": sAIWData.eqItem[j].Itemcomp,
						"Compdesc": "",
						"Itmqty": sAIWData.eqItem[j].Itmqty,
						"Itmuom": sAIWData.eqItem[j].Itmuom,
						"Recurallo": sAIWData.eqItem[j].Recurallo,
						"Erskz": sAIWData.eqItem[j].Erskz,
						"Rvrel": sAIWData.eqItem[j].Rvrel === "0" ? "" : sAIWData.eqItem[j].Rvrel,
						"Sanfe": sAIWData.eqItem[j].Sanfe,
						"Sanin": sAIWData.eqItem[j].Sanin,
						"Sanko": sAIWData.eqItem[j].Sanko,
						"Itmcmpdesc": sAIWData.eqItem[j].Itmcmpdesc,
						"Costgrelv": sAIWData.eqItem[j].Costgrelv === "0" ? "" : sAIWData.eqItem[j].Costgrelv
					};
					if (sAIWData.bomType === "Change") {
						eItem.Bomitmnod = sAIWData.eqItem[j].Bomitmnod;
					}
					if (sAIWData.eqItem[j].Itemcat === "N") {
						eItem.Ekorg = sAIWData.eqItem[j].Ekorg;
						eItem.Ekotx = sAIWData.eqItem[j].Ekotx;
						eItem.Ekgrp = sAIWData.eqItem[j].Ekgrp;
						eItem.Eknam = sAIWData.eqItem[j].Eknam;
						eItem.Preis = sAIWData.eqItem[j].Preis;
						eItem.Waers = sAIWData.eqItem[j].Waers;
						eItem.Peinh = sAIWData.eqItem[j].Peinh;
						eItem.Matkl = sAIWData.eqItem[j].Matkl;
						eItem.Wgbez = sAIWData.eqItem[j].Wgbez;
						eItem.Potx1 = sAIWData.eqItem[j].Potx1;
					} else if (sAIWData.eqItem[j].Itemcat === "D") {
						eItem.Bomdocitm = sAIWData.eqItem[j].Bomdocitm;
						eItem.Bomitmdkr = sAIWData.eqItem[j].Bomitmdkr;
						eItem.BomitmdkrTxt = sAIWData.eqItem[j].BomitmdkrTxt;
						eItem.Bomitmdtl = sAIWData.eqItem[j].Bomitmdtl;
						eItem.Bomitmdvr = sAIWData.eqItem[j].Bomitmdvr;
					} else if (sAIWData.eqItem[j].Itemcat === "R") {
						eItem.Roms1 = sAIWData.eqItem[j].Roms1;
						eItem.Romei = sAIWData.eqItem[j].Romei;
						eItem.Roms2 = sAIWData.eqItem[j].Roms2;
						eItem.Roms3 = sAIWData.eqItem[j].Roms3;
						eItem.Rform = sAIWData.eqItem[j].Rform;
						// eItem.FrmlaKeyDesc = sAIWData.eqItem[j].Itemcat;
						eItem.Roanz = sAIWData.eqItem[j].Roanz;
						// eItem.numVarSizeDesc = sAIWData.eqItem[j].Itemcat;
						eItem.Romen = sAIWData.eqItem[j].Romen;
						eItem.Rokme = sAIWData.eqItem[j].Rokme;
					} else if (sAIWData.eqItem[j].Itemcat === "T") {
						eItem.Potx1 = sAIWData.eqItem[j].Potx1;
					}
					sPayload.EBItem.push(eItem);
				}

				for (var k = 0; k < sAIWData.eqSubItem.length; k++) {
					var eSubItem = {
						"Eqnrbom": sAIWData.Eqnrbom,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Posnr": sAIWData.eqSubItem[k].Posnr,
						"Bomitmnod": sAIWData.eqSubItem[k].Bomitmnod,
						"Bomsubno": sAIWData.eqSubItem[k].Bomsubno,
						"Ebort": sAIWData.eqSubItem[k].Ebort,
						"Upmng": sAIWData.eqSubItem[k].Upmng,
						"Uptxt": sAIWData.eqSubItem[k].Uptxt
					};
					sPayload.EBSBIT.push(eSubItem);
				}
			} else if (this.sFragmentName.indexOf("FLBom") > -1) {
				var flHeader = {
					"Tplnrbom": sAIWData.Tplnrbom,
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Bomstatus": sAIWData.Bomstatus,
					"Lngtxt": sAIWData.Lngtxt,
					"Txtmi": sAIWData.Lngtxt,
					"Validfrom": this._formatDate(sAIWData.Validfrom),
					"Baseqty": sAIWData.BaseQty,
					"Baseuom": sAIWData.BaseUom,
					"Validtoda": this._formatDate(sAIWData.Validtoda)
						//"Stalt": ""
				};
				sPayload.FBHeader.push(flHeader);

				for (var j = 0; j < sAIWData.flItem.length; j++) {
					var flItem = {
						"Tplnrbom": sAIWData.Tplnrbom,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Bomitmpos": sAIWData.flItem[j].Bomitmpos,
						"Itemcat": sAIWData.flItem[j].Itemcat,
						"Itemcomp": sAIWData.flItem[j].Itemcomp,
						"Compdesc": "",
						"Itmqty": sAIWData.flItem[j].Itmqty,
						"Itmuom": sAIWData.flItem[j].Itmuom,
						"Recurallo": sAIWData.flItem[j].Recurallo,
						"Erskz": sAIWData.flItem[j].Erskz,
						"Rvrel": sAIWData.flItem[j].Rvrel === "0" ? "" : sAIWData.flItem[j].Rvrel,
						"Sanfe": sAIWData.flItem[j].Sanfe,
						"Sanin": sAIWData.flItem[j].Sanin,
						"Sanko": sAIWData.flItem[j].Sanko,
						"Itmcmpdesc": sAIWData.flItem[j].Itmcmpdesc,
						"Costgrelv": sAIWData.flItem[j].Costgrelv === "0" ? "" : sAIWData.flItem[j].Costgrelv
					};
					if (sAIWData.bomType === "Change") {
						flItem.Bomitmnod = sAIWData.flItem[j].Bomitmnod;
					}
					if (sAIWData.flItem[j].Itemcat === "N") {
						flItem.Ekorg = sAIWData.flItem[j].Ekorg;
						flItem.Ekotx = sAIWData.flItem[j].Ekotx;
						flItem.Ekgrp = sAIWData.flItem[j].Ekgrp;
						flItem.Eknam = sAIWData.flItem[j].Eknam;
						flItem.Preis = sAIWData.flItem[j].Preis;
						flItem.Waers = sAIWData.flItem[j].Waers;
						flItem.Peinh = sAIWData.flItem[j].Peinh;
						flItem.Matkl = sAIWData.flItem[j].Matkl;
						flItem.Wgbez = sAIWData.flItem[j].Wgbez;
						flItem.Potx1 = sAIWData.flItem[j].Potx1;
					} else if (sAIWData.flItem[j].Itemcat === "D") {
						flItem.Bomdocitm = sAIWData.flItem[j].Bomdocitm;
						flItem.Bomitmdkr = sAIWData.flItem[j].Bomitmdkr;
						flItem.BomitmdkrTxt = sAIWData.flItem[j].BomitmdkrTxt;
						flItem.Bomitmdtl = sAIWData.flItem[j].Bomitmdtl;
						flItem.Bomitmdvr = sAIWData.flItem[j].Bomitmdvr;
					} else if (sAIWData.flItem[j].Itemcat === "R") {
						flItem.Roms1 = sAIWData.flItem[j].Roms1;
						flItem.Romei = sAIWData.flItem[j].Romei;
						flItem.Roms2 = sAIWData.flItem[j].Roms2;
						flItem.Roms3 = sAIWData.flItem[j].Roms3;
						flItem.Rform = sAIWData.flItem[j].Rform;
						// flItem.FrmlaKeyDesc = sAIWData.flItem[j].Itemcat;
						flItem.Roanz = sAIWData.flItem[j].Roanz;
						// flItem.numVarSizeDesc = sAIWData.flItem[j].Itemcat;
						flItem.Romen = sAIWData.flItem[j].Romen;
						flItem.Rokme = sAIWData.flItem[j].Rokme;
					} else if (sAIWData.flItem[j].Itemcat === "T") {
						flItem.Potx1 = sAIWData.flItem[j].Potx1;
					}
					sPayload.FBItem.push(flItem);
				}

				for (var k = 0; k < sAIWData.flSubItem.length; k++) {
					var flSubItem = {
						"Tplnrbom": sAIWData.Tplnrbom,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Posnr": sAIWData.flSubItem[k].Posnr,
						"Bomitmnod": sAIWData.flSubItem[k].Bomitmnod,
						"Bomsubno": sAIWData.flSubItem[k].Bomsubno,
						"Ebort": sAIWData.flSubItem[k].Ebort,
						"Upmng": sAIWData.flSubItem[k].Upmng,
						"Uptxt": sAIWData.flSubItem[k].Uptxt
					};
					sPayload.FBSBIT.push(flSubItem);
				}
			} else if (this.sFragmentName.indexOf("WBSBom") > -1) {
				var wbsHeader = {
					"WbsExt": sAIWData.WbsExt,
					"MatnrWbs": sAIWData.Matnr,
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Bomstatus": sAIWData.Bomstatus,
					"Lngtxt": sAIWData.Lngtxt,
					"Txtmi": sAIWData.Lngtxt,
					"Validfrom": this._formatDate(sAIWData.Validfrom),
					"Baseqty": sAIWData.BaseQty,
					"Baseuom": sAIWData.BaseUom,
					"Validtoda": this._formatDate(sAIWData.Validtoda)
						//"Stalt": ""
				};
				sPayload.WBHeader.push(wbsHeader);

				for (var j = 0; j < sAIWData.wbsItem.length; j++) {
					var wbsItem = {
						"WbsExt": sAIWData.WbsExt,
						"MatnrWbs": sAIWData.Matnr,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Bomitmpos": sAIWData.wbsItem[j].Bomitmpos,
						"Itemcat": sAIWData.wbsItem[j].Itemcat,
						"Itemcomp": sAIWData.wbsItem[j].Itemcomp,
						"Compdesc": "",
						"Itmqty": sAIWData.wbsItem[j].Itmqty,
						"Itmuom": sAIWData.wbsItem[j].Itmuom,
						"Recurallo": sAIWData.wbsItem[j].Recurallo,
						"Erskz": sAIWData.wbsItem[j].Erskz,
						"Rvrel": sAIWData.wbsItem[j].Rvrel === "0" ? "" : sAIWData.wbsItem[j].Rvrel,
						"Sanfe": sAIWData.wbsItem[j].Sanfe,
						"Sanin": sAIWData.wbsItem[j].Sanin,
						"Sanko": sAIWData.wbsItem[j].Sanko,
						"Itmcmpdesc": sAIWData.wbsItem[j].Itmcmpdesc,
						"Costgrelv": sAIWData.wbsItem[j].Costgrelv === "0" ? "" : sAIWData.wbsItem[j].Costgrelv
					};
					if (sAIWData.bomType === "Change") { //13.08
						wbsItem.Bomitmnod = sAIWData.wbsItem[j].Bomitmnod;
					}
					if (sAIWData.wbsItem[j].Itemcat === "N") {
						wbsItem.Ekorg = sAIWData.wbsItem[j].Ekorg;
						wbsItem.Ekotx = sAIWData.wbsItem[j].Ekotx;
						wbsItem.Ekgrp = sAIWData.wbsItem[j].Ekgrp;
						wbsItem.Eknam = sAIWData.wbsItem[j].Eknam;
						wbsItem.Preis = sAIWData.wbsItem[j].Preis;
						wbsItem.Waers = sAIWData.wbsItem[j].Waers;
						wbsItem.Peinh = sAIWData.wbsItem[j].Peinh;
						wbsItem.Matkl = sAIWData.wbsItem[j].Matkl;
						wbsItem.Wgbez = sAIWData.wbsItem[j].Wgbez;
						wbsItem.Potx1 = sAIWData.wbsItem[j].Potx1;
					} else if (sAIWData.wbsItem[j].Itemcat === "D") {
						wbsItem.Bomdocitm = sAIWData.wbsItem[j].Bomdocitm;
						wbsItem.Bomitmdkr = sAIWData.wbsItem[j].Bomitmdkr;
						wbsItem.BomitmdkrTxt = sAIWData.wbsItem[j].BomitmdkrTxt;
						wbsItem.Bomitmdtl = sAIWData.wbsItem[j].Bomitmdtl;
						wbsItem.Bomitmdvr = sAIWData.wbsItem[j].Bomitmdvr;
					} else if (sAIWData.wbsItem[j].Itemcat === "R") {
						wbsItem.Roms1 = sAIWData.wbsItem[j].Roms1;
						wbsItem.Romei = sAIWData.wbsItem[j].Romei;
						wbsItem.Roms2 = sAIWData.wbsItem[j].Roms2;
						wbsItem.Roms3 = sAIWData.wbsItem[j].Roms3;
						wbsItem.Rform = sAIWData.wbsItem[j].Rform;
						// wbsItem.FrmlaKeyDesc = sAIWData.wbsItem[j].Itemcat;
						wbsItem.Roanz = sAIWData.wbsItem[j].Roanz;
						// wbsItem.numVarSizeDesc = sAIWData.wbsItem[j].Itemcat;
						wbsItem.Romen = sAIWData.wbsItem[j].Romen;
						wbsItem.Rokme = sAIWData.wbsItem[j].Rokme;
					} else if (sAIWData.wbsItem[j].Itemcat === "T") {
						wbsItem.Potx1 = sAIWData.wbsItem[j].Potx1;
					}
					sPayload.WBItem.push(wbsItem);
				}

				for (var k = 0; k < sAIWData.wbsSubItem.length; k++) {
					var wbsSubItem = {
						"WbsExt": sAIWData.WbsExt,
						"MatnrWbs": sAIWData.Matnr,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Posnr": sAIWData.wbsSubItem[k].Posnr,
						"Bomitmnod": sAIWData.wbsSubItem[k].Bomitmnod,
						"Bomsubno": sAIWData.wbsSubItem[k].Bomsubno,
						"Ebort": sAIWData.wbsSubItem[k].Ebort,
						"Upmng": sAIWData.wbsSubItem[k].Upmng,
						"Uptxt": sAIWData.wbsSubItem[k].Uptxt
					};
					sPayload.WBSBIT.push(wbsSubItem);
				}
			}

			this.getView().byId("detailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("detailPage").setBusy(false);
					var cr = r;
					var oMessageList = [];
					for (var e = 0; e < cr.Messages.results.length; e++) {
						oMessageList.push({
							type: formatter.getMessageType(cr.Messages.results[e].Type),
							title: cr.Messages.results[e].Message
						});
					}
					g.createMessagePopover(oMessageList, "");
				},
				error: function (err) {
					// g.BusyDialog.close();
					g.getView().byId("detailPage").setBusy(false);
					var error = [],
						oMessageList = [];
					if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
						.errordetails
						.length === 0) {
						error[0] = JSON.parse(err.responseText).error.message.value;
					} else {
						for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
							error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
						}
					}

					var value = error.join("\n");
					sap.m.MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {}
					});
				}
			});
		},

		/*
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
		 * @param msg
		 * @param type
		 */
		createMessagePopover: function (msg, type) {
			// var sJsonModel = new JSONModel();
			// sJsonModel.setData(oMessageList);
			// oMessagePopover.setModel(sJsonModel);
			// oMessagePopover.toggle(this.getView().byId("idMessagePopover"));
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

		/*
		 * Function to Initialize Category Specific Fields
		 * @param index
		 */
		initializeCategorySpecificFields: function (index) {
			var g = this;
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemdata = itemDetailModel.getData();

			if (itemdata[index].Itemcat === "N") {
				itemdata[index].Ekorg = "";
				itemdata[index].Ekotx = "";
				itemdata[index].Ekgrp = "";
				itemdata[index].Eknam = "";
				itemdata[index].Preis = "";
				itemdata[index].Waers = "";
				itemdata[index].Peinh = "";
				itemdata[index].Matkl = "";
				itemdata[index].Wgbez = "";
				itemdata[index].Potx1 = "";
				itemdata[index].PGrpReq = false;
				itemdata[index].PrcReq = false;
				itemdata[index].PrcUnitReq = false;
				itemdata[index].MatGrpReq = false;
				itemdata[index].ItmTxt1Req = false;
			} else if (itemdata[index].Itemcat === "D") {
				itemdata[index].Bomdocitm = "";
				itemdata[index].Bomitmdkr = "";
				itemdata[index].BomitmdkrTxt = "";
				itemdata[index].Bomitmdtl = "";
				itemdata[index].Bomitmdvr = "";
				itemdata[index].DocReq = false;
			} else if (itemdata[index].Itemcat === "R") {
				itemdata[index].Roms1 = "";
				itemdata[index].Romei = "";
				itemdata[index].Roms2 = "";
				itemdata[index].Roms3 = "";
				itemdata[index].Rform = "";
				itemdata[index].FrmlaKeyDesc = "";
				itemdata[index].Roanz = "";
				itemdata[index].numVarSizeDesc = "";
				itemdata[index].Romen = "";
				itemdata[index].Rokme = "";
				itemdata[index].Size1Req = false;
				itemdata[index].NumVarSizReq = false;
			} else if (itemdata[index].Itemcat === "T") {
				itemdata[index].Potx1 = "";
				itemdata[index].ItmTxt1Req = false;
			}
			itemDetailModel.setData(itemdata);
			itemDetailModel.refresh();
		},

		/**
		 * @desc Triggered when material is clicked
		 * @method handleMaterialPress
		 * @param {}
		 * @return
		 */

		handleMaterialPress: function (oEvent) {
			var sId = oEvent.getSource().getId();
			if (sId.indexOf("create") > -1) {
				this.pushToBuffer("Comp", "create");
			} else if (sId.indexOf("addMaterial") > -1) {
				this.pushToBuffer("Comp", "change");
			}
		},

		/**
		 * @desc Triggered to push the data to buffer
		 * @method pushToBuffer
		 * @param {}
		 * @return
		 */

		pushToBuffer: function (caller, type, material) {
			var g = this;
			var sAIWData = g.getView().getModel("BOMDetailModel").getData();
			// var itemDetailModel = this.getView().getModel("itemDetailModel");
			// var itemdata = itemDetailModel.getData();

			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var atempFL = $.map(AIWFLOCModel, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempFL), "AIWFLOCBackup");
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var atempEQ = $.map(AIWEQUIModel, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempEQ), "AIWEQUIBackup");
			var AIWMSPTModel = sap.ui.getCore().getModel("AIWMSPT").getData();
			var atempMS = $.map(AIWMSPTModel, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempMS), "AIWMSPTBackup");
			var AIWMPMIModel = sap.ui.getCore().getModel("AIWMPMI").getData();
			var atempMP = $.map(AIWMPMIModel, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempMP), "AIWMPMIBackup");
			var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
			var atempMB = $.map(AIWListMatData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempMB), "AIWListMatModelBackup");
			var AIWListEqData = sap.ui.getCore().getModel("AIWListEqModel").getData();
			var atempEB = $.map(AIWListEqData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempEB), "AIWListEqModelBackup");
			var AIWListFLData = sap.ui.getCore().getModel("AIWListFLModel").getData();
			var atempFB = $.map(AIWListFLData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempFB), "AIWListFLModelBackup");
			var AIWListWBSData = sap.ui.getCore().getModel("AIWListWBSModel").getData();
			var atempWB = $.map(AIWListWBSData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempWB), "AIWListWBSModelBackup");
			var AIWListONData = sap.ui.getCore().getModel("AIWListONModel").getData();
			var atempON = $.map(AIWListONData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempON), "AIWListONModelBackup");
			var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
			var atempWC = $.map(AIWListWCData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempWC), "AIWListWCModelBackup");
			var AIWListGTLData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
			var atempGTL = $.map(AIWListGTLData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempGTL), "AIWListGTLModelBackup");
			var AIWListETLData = sap.ui.getCore().getModel("AIWListETLModel").getData();
			var atempETL = $.map(AIWListGTLData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempETL), "AIWListETLModelBackup");
			var AIWListFTLData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
			var atempFTL = $.map(AIWListFTLData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempFTL), "AIWListFTLModelBackup");
			var AIWListOLData = sap.ui.getCore().getModel("AIWListOLModel").getData();
			var atempOL = $.map(AIWListFTLData, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempOL), "AIWListOLModelBackup");
			var dataOriginMOPdata = [];
			dataOriginMOPdata.push(sap.ui.getCore().getModel("dataOriginMOP").getData());
			var atempDOI = $.map(dataOriginMOPdata, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempDOI), "dataOriginMOPBackup");
			var EnableModeldata = [];
			EnableModeldata.push(sap.ui.getCore().getModel("EnableModel").getData());
			var atempEnableModel = $.map(EnableModeldata, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempEnableModel), "EnableModelBackup");
			var AIWModeldata = [];
			AIWModeldata.push(sap.ui.getCore().getModel("AIWModel").getData());
			var atempAIWModel = $.map(AIWModeldata, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempAIWModel), "AIWModelBackup");
			var ainMOPdata = sap.ui.getCore().getModel("ainMOP").getData();
			var atempainMOP = $.map(ainMOPdata, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempainMOP), "ainMOPBackup");
			var aCrDetails = [sap.ui.getCore().getModel("tempCrTypeModel").getData()];
			var atempCrDetails = $.map(aCrDetails, function (obj) {
				return $.extend(true, {}, obj);
			});
			sap.ui.getCore().setModel(new JSONModel(atempCrDetails), "tempCrTypeModelBackup");

			var sAIWData = g.getView().getModel("BOMDetailModel").getData();
			var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
			var sPayload = {
				"ChangeRequestType": oCrType.crtype,
				"CrDescription": oCrType.desc,
				"MbomBuffer": true,
				"IsDraft": "C",
				"Messages": [],
				// "Reason": this.getView().byId("reasonForRequest").getSelectedKey(),
				// "Guids": this.oAttach,
				"FuncLoc": [],
				"FLAddr": [],
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"Equipment": [],
				"EqAddr": [],
				"EqPRT": [],
				"EqLAM": [],
				"EqClass": [],
				"EqVal": [],
				"MSPoint": [],
				"MSLAM": [],
				"MSClass": [],
				"MSVal": [],
				"MPLAN": [],
				"MPItem": [],
				"MPLAM": [],
				"MPOBList": [],
				"MPCycle": [],
				"MRBHeader": [],
				"MRBItem": [],
				"MRBSBIT": [],
				"EBHeader": [],
				"EBItem": [],
				"EBSBIT": [],
				"FBHeader": [],
				"FBItem": [],
				"FBSBIT": [],
				"WBHeader": [],
				"WBItem": [],
				"WBSBIT": [],
				"ONetwork": [],
				"ONLAM": [],
				"Workcenter": [],
				"WCCost": [],
				"GTList": [],
				"GTOprs": [],
				"GTComp": [],
				"GTClass": [],
				"GTVal": [],
				"ETList": [],
				"ETOprs": [],
				"ETComp": [],
				"ETClass": [],
				"ETVal": [],
				"FTList": [],
				"FTOprs": [],
				"FTComp": [],
				"FTClass": [],
				"FTVal": [],
				"Olink": [],
				"OLClass": [],
				"OLVal": []
			};

			if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "changeMbom") {
				var mHeader = {
					"Matnr": sAIWData.Matnr,
					"Stalt": sAIWData.Stalt,
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Pmbomtech": sAIWData.Pmbomtech ? sAIWData.Pmbomtech : "",
					"PmbomtechTxt": sAIWData.PmbomtechTxt ? sAIWData.PmbomtechTxt : "",
					"Bomstatus": sAIWData.Bomstatus,
					"Lngtxt": sAIWData.Lngtxt,
					"Stktx": sAIWData.Stktx,
					"Txtmi": sAIWData.Lngtxt,
					"Validfrom": sAIWData.Validfrom !== "" ? this._formatDate(sAIWData.Validfrom) : "2020-08-10T00:00:00",
					"Baseqty": sAIWData.BaseQty !== "" ? sAIWData.BaseQty : "0",
					"Baseuom": sAIWData.BaseUom,
					"Validtoda": sAIWData.Validtoda !== "" ? this._formatDate(sAIWData.Validtoda) : "9999-12-31T00:00:00",
					Maktx: sAIWData.MatDesc,
					Plantname: sAIWData.WerksDesc,
					Bomusagetxt: sAIWData.StlanDesc,
					BomstatusText: sAIWData.Bomstatustxt,
				};
				sPayload.MRBHeader.push(mHeader);

				for (var j = 0; j < sAIWData.matItem.length; j++) {
					var mItem = {
						"Matnr": sAIWData.Matnr,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						//"Bomitmnod": sAIWData.Bomitmnod, //13.08
						"Bomitmpos": sAIWData.matItem[j].Bomitmpos,
						"Itemcat": sAIWData.matItem[j].Itemcat,
						"Itemcomp": sAIWData.matItem[j].Itemcomp,
						"Compdesc": "",
						"Itmqty": sAIWData.matItem[j].Itmqty,
						"Itmuom": sAIWData.matItem[j].Itmuom,
						"Recurallo": sAIWData.matItem[j].Recurallo,
						"Erskz": sAIWData.matItem[j].Erskz,
						"Rvrel": sAIWData.matItem[j].Rvrel === "0" ? "" : sAIWData.matItem[j].Rvrel,
						"Sanfe": sAIWData.matItem[j].Sanfe,
						"Sanin": sAIWData.matItem[j].Sanin,
						"Sanko": sAIWData.matItem[j].Sanko,
						"Itmcmpdesc": sAIWData.matItem[j].Itmcmpdesc,
						"Costgrelv": sAIWData.matItem[j].Costgrelv === "0" ? "" : sAIWData.matItem[j].Costgrelv,
						Itmassind: sAIWData.matItem[j].Itmassind,
						IsNavPossible: sAIWData.matItem[j].IsNavPossible
					};
					if (sAIWData.bomType === "Change") {
						mItem.Bomitmnod = sAIWData.matItem[j].Bomitmnod;
					}
					if (sAIWData.matItem[j].Itemcat === "N") {
						mItem.Ekorg = sAIWData.matItem[j].Ekorg;
						mItem.Ekotx = sAIWData.matItem[j].Ekotx;
						mItem.Ekgrp = sAIWData.matItem[j].Ekgrp;
						mItem.Eknam = sAIWData.matItem[j].Eknam;
						mItem.Preis = sAIWData.matItem[j].Preis;
						mItem.Waers = sAIWData.matItem[j].Waers;
						mItem.Peinh = sAIWData.matItem[j].Peinh;
						mItem.Matkl = sAIWData.matItem[j].Matkl;
						mItem.Wgbez = sAIWData.matItem[j].Wgbez;
						mItem.Potx1 = sAIWData.matItem[j].Potx1;
					} else if (sAIWData.matItem[j].Itemcat === "D") {
						mItem.Bomdocitm = sAIWData.matItem[j].Bomdocitm;
						mItem.Bomitmdkr = sAIWData.matItem[j].Bomitmdkr;
						mItem.BomitmdkrTxt = sAIWData.matItem[j].BomitmdkrTxt;
						mItem.Bomitmdtl = sAIWData.matItem[j].Bomitmdtl;
						mItem.Bomitmdvr = sAIWData.matItem[j].Bomitmdvr;
					} else if (sAIWData.matItem[j].Itemcat === "R") {
						mItem.Roms1 = sAIWData.matItem[j].Roms1;
						mItem.Romei = sAIWData.matItem[j].Romei;
						mItem.Roms2 = sAIWData.matItem[j].Roms2;
						mItem.Roms3 = sAIWData.matItem[j].Roms3;
						mItem.Rform = sAIWData.matItem[j].Rform;
						// mItem.FrmlaKeyDesc = sAIWData.matItem[j].Itemcat;
						mItem.Roanz = sAIWData.matItem[j].Roanz;
						// mItem.numVarSizeDesc = sAIWData.matItem[j].Itemcat;
						mItem.Romen = sAIWData.matItem[j].Romen;
						mItem.Rokme = sAIWData.matItem[j].Rokme;
					} else if (sAIWData.matItem[j].Itemcat === "T") {
						mItem.Potx1 = sAIWData.matItem[j].Potx1;
					}
					sPayload.MRBItem.push(mItem);
				}

				for (var k = 0; k < sAIWData.matSubItem.length; k++) {
					var mSubItem = {
						"Matnr": sAIWData.Matnr,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Posnr": sAIWData.matSubItem[k].Posnr,
						"Bomitmnod": sAIWData.matSubItem[k].Bomitmnod,
						"Bomsubno": sAIWData.matSubItem[k].Bomsubno,
						"Ebort": sAIWData.matSubItem[k].Ebort,
						"Upmng": sAIWData.matSubItem[k].Upmng,
						"Uptxt": sAIWData.matSubItem[k].Uptxt
					};
					sPayload.MRBSBIT.push(mSubItem);
				}
			} else if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "changeEbom") {
				var eHeader = {
					"Eqnrbom": sAIWData.Eqnrbom,
					//"Stalt": "",
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Bomstatus": sAIWData.Bomstatus,
					"Lngtxt": sAIWData.Lngtxt,
					"Txtmi": sAIWData.Lngtxt,
					"Validfrom": this._formatDate(sAIWData.Validfrom),
					"Baseqty": sAIWData.BaseQty,
					"Baseuom": sAIWData.BaseUom,
					"Validtoda": this._formatDate(sAIWData.Validtoda),
					Eqktx: sAIWData.EquiDesc,
					Plantname: sAIWData.WerksDesc,
					Bomusagetxt: sAIWData.StlanDesc,
					BomstatusText: sAIWData.Bomstatustxt,
				};
				sPayload.EBHeader.push(eHeader);

				for (var j = 0; j < sAIWData.eqItem.length; j++) {
					var eItem = {
						"Eqnrbom": sAIWData.Eqnrbom,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Bomitmpos": sAIWData.eqItem[j].Bomitmpos,
						"Itemcat": sAIWData.eqItem[j].Itemcat,
						"Itemcomp": sAIWData.eqItem[j].Itemcomp,
						"Compdesc": "",
						"Itmqty": sAIWData.eqItem[j].Itmqty,
						"Itmuom": sAIWData.eqItem[j].Itmuom,
						"Recurallo": sAIWData.eqItem[j].Recurallo,
						"Erskz": sAIWData.eqItem[j].Erskz,
						"Rvrel": sAIWData.eqItem[j].Rvrel === "0" ? "" : sAIWData.eqItem[j].Rvrel,
						"Sanfe": sAIWData.eqItem[j].Sanfe,
						"Sanin": sAIWData.eqItem[j].Sanin,
						"Sanko": sAIWData.eqItem[j].Sanko,
						"Itmcmpdesc": sAIWData.eqItem[j].Itmcmpdesc,
						"Costgrelv": sAIWData.eqItem[j].Costgrelv === "0" ? "" : sAIWData.eqItem[j].Costgrelv,
						Itmassind: sAIWData.eqItem[j].Itmassind,
						IsNavPossible: sAIWData.eqItem[j].IsNavPossible
					};
					if (sAIWData.bomType === "Change") {
						eItem.Bomitmnod = sAIWData.eqItem[j].Bomitmnod;
					}
					if (sAIWData.eqItem[j].Itemcat === "N") {
						eItem.Ekorg = sAIWData.eqItem[j].Ekorg;
						eItem.Ekotx = sAIWData.eqItem[j].Ekotx;
						eItem.Ekgrp = sAIWData.eqItem[j].Ekgrp;
						eItem.Eknam = sAIWData.eqItem[j].Eknam;
						eItem.Preis = sAIWData.eqItem[j].Preis;
						eItem.Waers = sAIWData.eqItem[j].Waers;
						eItem.Peinh = sAIWData.eqItem[j].Peinh;
						eItem.Matkl = sAIWData.eqItem[j].Matkl;
						eItem.Wgbez = sAIWData.eqItem[j].Wgbez;
						eItem.Potx1 = sAIWData.eqItem[j].Potx1;
					} else if (sAIWData.eqItem[j].Itemcat === "D") {
						eItem.Bomdocitm = sAIWData.eqItem[j].Bomdocitm;
						eItem.Bomitmdkr = sAIWData.eqItem[j].Bomitmdkr;
						eItem.BomitmdkrTxt = sAIWData.eqItem[j].BomitmdkrTxt;
						eItem.Bomitmdtl = sAIWData.eqItem[j].Bomitmdtl;
						eItem.Bomitmdvr = sAIWData.eqItem[j].Bomitmdvr;
					} else if (sAIWData.eqItem[j].Itemcat === "R") {
						eItem.Roms1 = sAIWData.eqItem[j].Roms1;
						eItem.Romei = sAIWData.eqItem[j].Romei;
						eItem.Roms2 = sAIWData.eqItem[j].Roms2;
						eItem.Roms3 = sAIWData.eqItem[j].Roms3;
						eItem.Rform = sAIWData.eqItem[j].Rform;
						// eItem.FrmlaKeyDesc = sAIWData.eqItem[j].Itemcat;
						eItem.Roanz = sAIWData.eqItem[j].Roanz;
						// eItem.numVarSizeDesc = sAIWData.eqItem[j].Itemcat;
						eItem.Romen = sAIWData.eqItem[j].Romen;
						eItem.Rokme = sAIWData.eqItem[j].Rokme;
					} else if (sAIWData.eqItem[j].Itemcat === "T") {
						eItem.Potx1 = sAIWData.eqItem[j].Potx1;
					}
					sPayload.EBItem.push(eItem);
				}

				for (var k = 0; k < sAIWData.eqSubItem.length; k++) {
					var eSubItem = {
						"Eqnrbom": sAIWData.Eqnrbom,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Posnr": sAIWData.eqSubItem[k].Posnr,
						"Bomitmnod": sAIWData.eqSubItem[k].Bomitmnod,
						"Bomsubno": sAIWData.eqSubItem[k].Bomsubno,
						"Ebort": sAIWData.eqSubItem[k].Ebort,
						"Upmng": sAIWData.eqSubItem[k].Upmng,
						"Uptxt": sAIWData.eqSubItem[k].Uptxt
					};
					sPayload.EBSBIT.push(eSubItem);
				}
			} else if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "changeFlbom") {
				var flHeader = {
					"Tplnrbom": sAIWData.Tplnrbom,
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Bomstatus": sAIWData.Bomstatus,
					"Lngtxt": sAIWData.Lngtxt,
					"Txtmi": sAIWData.Lngtxt,
					"Validfrom": this._formatDate(sAIWData.Validfrom),
					"Baseqty": sAIWData.BaseQty,
					"Baseuom": sAIWData.BaseUom,
					"Validtoda": this._formatDate(sAIWData.Validtoda),
					Pltxt: sAIWData.FLDesc,
					Plantname: sAIWData.WerksDesc,
					Bomusagetxt: sAIWData.StlanDesc,
					BomstatusText: sAIWData.Bomstatustxt,
					//"Stalt": ""
				};
				sPayload.FBHeader.push(flHeader);

				for (var j = 0; j < sAIWData.flItem.length; j++) {
					var flItem = {
						"Tplnrbom": sAIWData.Tplnrbom,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Bomitmpos": sAIWData.flItem[j].Bomitmpos,
						"Itemcat": sAIWData.flItem[j].Itemcat,
						"Itemcomp": sAIWData.flItem[j].Itemcomp,
						"Compdesc": "",
						"Itmqty": sAIWData.flItem[j].Itmqty,
						"Itmuom": sAIWData.flItem[j].Itmuom,
						"Recurallo": sAIWData.flItem[j].Recurallo,
						"Erskz": sAIWData.flItem[j].Erskz,
						"Rvrel": sAIWData.flItem[j].Rvrel === "0" ? "" : sAIWData.flItem[j].Rvrel,
						"Sanfe": sAIWData.flItem[j].Sanfe,
						"Sanin": sAIWData.flItem[j].Sanin,
						"Sanko": sAIWData.flItem[j].Sanko,
						"Itmcmpdesc": sAIWData.flItem[j].Itmcmpdesc,
						"Costgrelv": sAIWData.flItem[j].Costgrelv === "0" ? "" : sAIWData.flItem[j].Costgrelv,
						Itmassind: sAIWData.flItem[j].Itmassind,
						IsNavPossible: sAIWData.flItem[j].IsNavPossible
					};
					if (sAIWData.bomType === "Change") {
						flItem.Bomitmnod = sAIWData.flItem[j].Bomitmnod;
					}
					if (sAIWData.flItem[j].Itemcat === "N") {
						flItem.Ekorg = sAIWData.flItem[j].Ekorg;
						flItem.Ekotx = sAIWData.flItem[j].Ekotx;
						flItem.Ekgrp = sAIWData.flItem[j].Ekgrp;
						flItem.Eknam = sAIWData.flItem[j].Eknam;
						flItem.Preis = sAIWData.flItem[j].Preis;
						flItem.Waers = sAIWData.flItem[j].Waers;
						flItem.Peinh = sAIWData.flItem[j].Peinh;
						flItem.Matkl = sAIWData.flItem[j].Matkl;
						flItem.Wgbez = sAIWData.flItem[j].Wgbez;
						flItem.Potx1 = sAIWData.flItem[j].Potx1;
					} else if (sAIWData.flItem[j].Itemcat === "D") {
						flItem.Bomdocitm = sAIWData.flItem[j].Bomdocitm;
						flItem.Bomitmdkr = sAIWData.flItem[j].Bomitmdkr;
						flItem.BomitmdkrTxt = sAIWData.flItem[j].BomitmdkrTxt;
						flItem.Bomitmdtl = sAIWData.flItem[j].Bomitmdtl;
						flItem.Bomitmdvr = sAIWData.flItem[j].Bomitmdvr;
					} else if (sAIWData.flItem[j].Itemcat === "R") {
						flItem.Roms1 = sAIWData.flItem[j].Roms1;
						flItem.Romei = sAIWData.flItem[j].Romei;
						flItem.Roms2 = sAIWData.flItem[j].Roms2;
						flItem.Roms3 = sAIWData.flItem[j].Roms3;
						flItem.Rform = sAIWData.flItem[j].Rform;
						// flItem.FrmlaKeyDesc = sAIWData.flItem[j].Itemcat;
						flItem.Roanz = sAIWData.flItem[j].Roanz;
						// flItem.numVarSizeDesc = sAIWData.flItem[j].Itemcat;
						flItem.Romen = sAIWData.flItem[j].Romen;
						flItem.Rokme = sAIWData.flItem[j].Rokme;
					} else if (sAIWData.flItem[j].Itemcat === "T") {
						flItem.Potx1 = sAIWData.flItem[j].Potx1;
					}
					sPayload.FBItem.push(flItem);
				}

				for (var k = 0; k < sAIWData.flSubItem.length; k++) {
					var flSubItem = {
						"Tplnrbom": sAIWData.Tplnrbom,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Posnr": sAIWData.flSubItem[k].Posnr,
						"Bomitmnod": sAIWData.flSubItem[k].Bomitmnod,
						"Bomsubno": sAIWData.flSubItem[k].Bomsubno,
						"Ebort": sAIWData.flSubItem[k].Ebort,
						"Upmng": sAIWData.flSubItem[k].Upmng,
						"Uptxt": sAIWData.flSubItem[k].Uptxt
					};
					sPayload.FBSBIT.push(flSubItem);
				}
			} else if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "changeWbsbom") {
				var wbsHeader = {
					"WbsExt": sAIWData.WbsExt,
					"MatnrWbs": sAIWData.Matnr,
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Bomstatus": sAIWData.Bomstatus,
					"Lngtxt": sAIWData.Lngtxt,
					"Txtmi": sAIWData.Lngtxt,
					"Validfrom": this._formatDate(sAIWData.Validfrom),
					"Baseqty": sAIWData.BaseQty,
					"Baseuom": sAIWData.BaseUom,
					"Validtoda": this._formatDate(sAIWData.Validtoda),
					Post1: sAIWData.WbsDesc,
					Maktx: sAIWData.MatDesc,
					Plantname: sAIWData.WerksDesc,
					Bomusagetxt: sAIWData.StlanDesc,
					BomstatusText: sAIWData.Bomstatustxt,
					//"Stalt": ""
				};
				sPayload.WBHeader.push(wbsHeader);

				for (var j = 0; j < sAIWData.wbsItem.length; j++) {
					var wbsItem = {
						"WbsExt": sAIWData.WbsExt,
						"MatnrWbs": sAIWData.Matnr,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Bomitmpos": sAIWData.wbsItem[j].Bomitmpos,
						"Itemcat": sAIWData.wbsItem[j].Itemcat,
						"Itemcomp": sAIWData.wbsItem[j].Itemcomp,
						"Compdesc": "",
						"Itmqty": sAIWData.wbsItem[j].Itmqty,
						"Itmuom": sAIWData.wbsItem[j].Itmuom,
						"Recurallo": sAIWData.wbsItem[j].Recurallo,
						"Erskz": sAIWData.wbsItem[j].Erskz,
						"Rvrel": sAIWData.wbsItem[j].Rvrel === "0" ? "" : sAIWData.wbsItem[j].Rvrel,
						"Sanfe": sAIWData.wbsItem[j].Sanfe,
						"Sanin": sAIWData.wbsItem[j].Sanin,
						"Sanko": sAIWData.wbsItem[j].Sanko,
						"Itmcmpdesc": sAIWData.wbsItem[j].Itmcmpdesc,
						"Costgrelv": sAIWData.wbsItem[j].Costgrelv === "0" ? "" : sAIWData.wbsItem[j].Costgrelv,
						Itmassind: sAIWData.wbsItem[j].Itmassind,
						IsNavPossible: sAIWData.wbsItem[j].IsNavPossible
					};
					if (sAIWData.bomType === "Change") {
						wbsItem.Bomitmnod = sAIWData.wbsItem[j].Bomitmnod;
					}
					if (sAIWData.wbsItem[j].Itemcat === "N") {
						wbsItem.Ekorg = sAIWData.wbsItem[j].Ekorg;
						wbsItem.Ekotx = sAIWData.wbsItem[j].Ekotx;
						wbsItem.Ekgrp = sAIWData.wbsItem[j].Ekgrp;
						wbsItem.Eknam = sAIWData.wbsItem[j].Eknam;
						wbsItem.Preis = sAIWData.wbsItem[j].Preis;
						wbsItem.Waers = sAIWData.wbsItem[j].Waers;
						wbsItem.Peinh = sAIWData.wbsItem[j].Peinh;
						wbsItem.Matkl = sAIWData.wbsItem[j].Matkl;
						wbsItem.Wgbez = sAIWData.wbsItem[j].Wgbez;
						wbsItem.Potx1 = sAIWData.wbsItem[j].Potx1;
					} else if (sAIWData.wbsItem[j].Itemcat === "D") {
						wbsItem.Bomdocitm = sAIWData.wbsItem[j].Bomdocitm;
						wbsItem.Bomitmdkr = sAIWData.wbsItem[j].Bomitmdkr;
						wbsItem.BomitmdkrTxt = sAIWData.wbsItem[j].BomitmdkrTxt;
						wbsItem.Bomitmdtl = sAIWData.wbsItem[j].Bomitmdtl;
						wbsItem.Bomitmdvr = sAIWData.wbsItem[j].Bomitmdvr;
					} else if (sAIWData.wbsItem[j].Itemcat === "R") {
						wbsItem.Roms1 = sAIWData.wbsItem[j].Roms1;
						wbsItem.Romei = sAIWData.wbsItem[j].Romei;
						wbsItem.Roms2 = sAIWData.wbsItem[j].Roms2;
						wbsItem.Roms3 = sAIWData.wbsItem[j].Roms3;
						wbsItem.Rform = sAIWData.wbsItem[j].Rform;
						// wbsItem.FrmlaKeyDesc = sAIWData.wbsItem[j].Itemcat;
						wbsItem.Roanz = sAIWData.wbsItem[j].Roanz;
						// wbsItem.numVarSizeDesc = sAIWData.wbsItem[j].Itemcat;
						wbsItem.Romen = sAIWData.wbsItem[j].Romen;
						wbsItem.Rokme = sAIWData.wbsItem[j].Rokme;
					} else if (sAIWData.wbsItem[j].Itemcat === "T") {
						wbsItem.Potx1 = sAIWData.wbsItem[j].Potx1;
					}
					sPayload.WBItem.push(wbsItem);
				}

				for (var k = 0; k < sAIWData.wbsSubItem.length; k++) {
					var wbsSubItem = {
						"WbsExt": sAIWData.WbsExt,
						"MatnrWbs": sAIWData.Matnr,
						"Stlan": sAIWData.Stlan,
						"Werks": sAIWData.Werks,
						"Posnr": sAIWData.wbsSubItem[k].Posnr,
						"Bomitmnod": sAIWData.wbsSubItem[k].Bomitmnod,
						"Bomsubno": sAIWData.wbsSubItem[k].Bomsubno,
						"Ebort": sAIWData.wbsSubItem[k].Ebort,
						"Upmng": sAIWData.wbsSubItem[k].Upmng,
						"Uptxt": sAIWData.wbsSubItem[k].Uptxt
					};
					sPayload.WBSBIT.push(wbsSubItem);
				}
			}

			// var mHeader = {
			// 	"Matnr": sAIWData.Matnr,
			// 	"Stalt": sAIWData.Stalt,
			// 	"Stlan": sAIWData.Stlan,
			// 	"Werks": sAIWData.Werks,
			// 	"Bomstatus": sAIWData.Bomstatus,
			// 	"Lngtxt": sAIWData.Lngtxt,
			// 	"Txtmi": sAIWData.Lngtxt,
			// 	"Validfrom": this._formatDate(sAIWData.Validfrom),
			// 	"Baseqty": sAIWData.BaseQty,
			// 	"Baseuom": sAIWData.BaseUom,
			// 	"Validtoda": this._formatDate(sAIWData.Validtoda)
			// };
			// sPayload.MRBHeader.push(mHeader);

			// for (var j = 0; j < sAIWData.matItem.length; j++) {
			// 	var mItem = {
			// 		"Matnr": sAIWData.Matnr,
			// 		"Stlan": sAIWData.Stlan,
			// 		"Werks": sAIWData.Werks,
			// 		//"Bomitmnod": sAIWData.Bomitmnod, //13.08
			// 		"Bomitmpos": sAIWData.matItem[j].Bomitmpos,
			// 		"Itemcat": sAIWData.matItem[j].Itemcat,
			// 		"Itemcomp": sAIWData.matItem[j].Itemcomp,
			// 		"Compdesc": "",
			// 		"Itmqty": sAIWData.matItem[j].Itmqty,
			// 		"Itmuom": sAIWData.matItem[j].Itmuom,
			// 		"Recurallo": sAIWData.matItem[j].Recurallo,
			// 		"Erskz": sAIWData.matItem[j].Erskz,
			// 		"Rvrel": sAIWData.matItem[j].Rvrel === "0" ? "" : sAIWData.matItem[j].Rvrel,
			// 		"Sanfe": sAIWData.matItem[j].Sanfe,
			// 		"Sanin": sAIWData.matItem[j].Sanin,
			// 		"Sanko": sAIWData.matItem[j].Sanko,
			// 		"Itmcmpdesc": sAIWData.matItem[j].Itmcmpdesc,
			// 		"Costgrelv": sAIWData.matItem[j].Costgrelv === "0" ? "" : sAIWData.matItem[j].Costgrelv
			// 	};
			// 	if (sAIWData.bomType === "Change") {
			// 		mItem.Bomitmnod = sAIWData.matItem[j].Bomitmnod;
			// 	}
			// 	if (sAIWData.matItem[j].Itemcat === "N") {
			// 		mItem.Ekorg = sAIWData.matItem[j].Ekorg;
			// 		mItem.Ekotx = sAIWData.matItem[j].Ekotx;
			// 		mItem.Ekgrp = sAIWData.matItem[j].Ekgrp;
			// 		mItem.Eknam = sAIWData.matItem[j].Eknam;
			// 		mItem.Preis = sAIWData.matItem[j].Preis;
			// 		mItem.Waers = sAIWData.matItem[j].Waers;
			// 		mItem.Peinh = sAIWData.matItem[j].Peinh;
			// 		mItem.Matkl = sAIWData.matItem[j].Matkl;
			// 		mItem.Wgbez = sAIWData.matItem[j].Wgbez;
			// 		mItem.Potx1 = sAIWData.matItem[j].Potx1;
			// 	} else if (sAIWData.matItem[j].Itemcat === "D") {
			// 		mItem.Bomdocitm = sAIWData.matItem[j].Bomdocitm;
			// 		mItem.Bomitmdkr = sAIWData.matItem[j].Bomitmdkr;
			// 		mItem.BomitmdkrTxt = sAIWData.matItem[j].BomitmdkrTxt;
			// 		mItem.Bomitmdtl = sAIWData.matItem[j].Bomitmdtl;
			// 		mItem.Bomitmdvr = sAIWData.matItem[j].Bomitmdvr;
			// 	} else if (sAIWData.matItem[j].Itemcat === "R") {
			// 		mItem.Roms1 = sAIWData.matItem[j].Roms1;
			// 		mItem.Romei = sAIWData.matItem[j].Romei;
			// 		mItem.Roms2 = sAIWData.matItem[j].Roms2;
			// 		mItem.Roms3 = sAIWData.matItem[j].Roms3;
			// 		mItem.Rform = sAIWData.matItem[j].Rform;
			// 		// mItem.FrmlaKeyDesc = sAIWData.matItem[j].Itemcat;
			// 		mItem.Roanz = sAIWData.matItem[j].Roanz;
			// 		// mItem.numVarSizeDesc = sAIWData.matItem[j].Itemcat;
			// 		mItem.Romen = sAIWData.matItem[j].Romen;
			// 		mItem.Rokme = sAIWData.matItem[j].Rokme;
			// 	} else if (sAIWData.matItem[j].Itemcat === "T") {
			// 		mItem.Potx1 = sAIWData.matItem[j].Potx1;
			// 	}
			// 	sPayload.MRBItem.push(mItem);
			// }

			// for (var k = 0; k < sAIWData.matSubItem.length; k++) {
			// 	var mSubItem = {
			// 		"Matnr": sAIWData.Matnr,
			// 		"Stlan": sAIWData.Stlan,
			// 		"Werks": sAIWData.Werks,
			// 		"Posnr": sAIWData.matSubItem[k].Posnr,
			// 		"Bomitmnod": sAIWData.matSubItem[k].Bomitmnod,
			// 		"Bomsubno": sAIWData.matSubItem[k].Bomsubno,
			// 		"Ebort": sAIWData.matSubItem[k].Ebort,
			// 		"Upmng": sAIWData.matSubItem[k].Upmng,
			// 		"Uptxt": sAIWData.matSubItem[k].Uptxt
			// 	};
			// 	sPayload.MRBSBIT.push(mSubItem);
			// }

			if (!this.uid) {
				this.uid = g.generateUUID();
			}

			var callerType = "component";
			if (caller === "Hdr") {
				callerType = "header";
			} else if (type === "View") {
				callerType = "link";
			} else if (type === "change") {
				callerType = "add";
			}

			this.getView().byId("detailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					// g.getView().byId("detailPage").setBusy(false);
					if (caller === "Assembly") {
						var sAltBom = sAIWData.Stalt ? sAIWData.Stalt : "1";
						g._crossAppNavigation("MatBillOfMaterial", "changeMROBOM", {
							IT_CAT: "L",
							OBJ: "M",
							m: material,
							plant: sAIWData.Werks !== "" ? sAIWData.Werks : "null",
							usage: sAIWData.Stlan,
							altBom: sAltBom,
							status: sAIWData.Bomstatus,
							p: g.itemPath + "-" + g.sFragmentName,
							uid: g.uid, //asmbly_uid,
							assInd: "false",
							caller: "AIW"
						});
						sap.ui.getCore().setModel(false, "BOMCHNavModel");

					} else if (caller === "Hdr" || caller === "Comp") {
						if (type === "create") {
							g._crossAppNavigation("UtopiaMaterial", "create", {
								OBJ: "MARA",
								plant: sAIWData.Werks !== "" ? sAIWData.Werks : "null",
								id: g.uid,
								mode: "AIWcreate",
								case: callerType,
								m: sAIWData.Matnr, //g.getView().byId("Material").getValue(),
								usage: sAIWData.Stlan, //d.getValue(),
								status: sAIWData.Bomstatus, //u.getValue(),
								altBom: sAIWData.Stalt, //g.getView().byId("altBom").getValue()
								p: g.itemPath + "-" + g.sFragmentName,
								assInd: ""
							});
							sap.ui.getCore().setModel(false, "MatNavModel");

						} else if (type === "change") {
							g._crossAppNavigation("UtopiaMaterial", "change", {
								OBJ: "MARA",
								plant: sAIWData.Werks !== "" ? sAIWData.Werks : "null",
								id: g.uid,
								mode: "AIWcreate",
								case: callerType,
								m: sAIWData.Matnr, //g.getView().byId("Material").getValue(),
								usage: sAIWData.Stlan, //d.getValue(),
								status: sAIWData.Bomstatus, //u.getValue(),
								altBom: sAIWData.Stalt, //g.getView().byId("altBom").getValue()
								p: g.itemPath + "-" + g.sFragmentName,
								assInd: ""
							});
							sap.ui.getCore().setModel(false, "MatNavModel");
						} else if (type === "View") {
							g._crossAppNavigation("UtopiaMaterial", "change", {
								OBJ: "MARA",
								mode: "AIWcreate",
								case: callerType,
								assInd: "",
								status: sAIWData.Bomstatus,
								id: g.uid,
								mat: material,
								p: g.itemPath + "-" + g.sFragmentName,
							});
							// g._crossAppNavigation("UtopiaMaterial", "change", {
							// 	OBJ: "MARA",
							// 	plant: sAIWData.Werks,
							// 	id: g.uid,
							// 	mode: "AIWcreate",
							// 	case: callerType,
							// 	m: sAIWData.Matnr, //g.getView().byId("Material").getValue(),
							// 	usage: sAIWData.Stlan, //d.getValue(),
							// 	status: sAIWData.Bomstatus, //u.getValue(),
							// 	altBom: sAIWData.Stalt, //g.getView().byId("altBom").getValue()
							// 	p: g.itemPath,
							// 	assInd: ""
							// });
							sap.ui.getCore().setModel(false, "MatNavModel");
						}
					}
				},
				error: function (err) {
					// g.BusyDialog.close();
					g.getView().byId("detailPage").setBusy(false);
					var error = [],
						oMessageList = [];
					if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
						.errordetails
						.length === 0) {
						error[0] = JSON.parse(err.responseText).error.message.value;
					} else {
						for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
							error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
						}
					}

					var value = error.join("\n");
					sap.m.MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {}
					});
				}
			});
		},

		/**
		 * Description&nbsp;
		 * @method _crossAppNavigation
		 * @param {}
		 * @return
		 */
		_crossAppNavigation: function (sSemanticObject, sAction, aParams) {
			// obtain cross app navigation interface
			if (sap.ushell) {
				var navigationService = sap.ushell.Container.getService('CrossApplicationNavigation');
				navigationService.toExternal({
					target: {
						semanticObject: sSemanticObject,
						action: sAction
					},
					params: aParams
				});
			}
			// else {}
		},

		/** @desc Triggered to generate unique ID
		 * @public
		 **/

		generateUUID: function () {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
					v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});

		},

		/* Triggered on press event of Assembly indicator link
		 * Navigates to Change BOM app for the component material.
		 */
		handleAssemblyIndPress: function (oEvent) {
			var g = this;
			var sPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
			var index = parseInt(sPath.substr(1), 10);
			var mItem = this.getView().getModel("itemDetailModel");
			var aItem = mItem.getData();
			var mHeader = this.getView().getModel("BOMDetailModel");
			var oHeader = mHeader.getData();
			var mat = aItem[index].Itemcomp;
			var usg = oHeader.Stlan;
			var plant = oHeader.Werks;
			var altBom = oHeader.Stalt;
			// this.readBomDetails(d, undefined, mat, plant.getValue(), altBom.getValue(), "assemblyCheck");
			// this.readBomDetails(mat, plant, usg, this.crstatus, w, altBom, "assemblyCheck");
			var sMbomExistFlag = false;
			var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
			for (var i in AIWListMatData) {
				if (AIWListMatData[i].Matnr === mat && AIWListMatData[i].Werks === plant && AIWListMatData[i].Stlan === usg && AIWListMatData[i].Stalt ===
					altBom) {
					sMbomExistFlag = true;
					break;
				}
			}

			if (sMbomExistFlag) {
				var sMsg = "BOM exists in same CR";
				g.createMessagePopover(sMsg, "Information");
			} else {
				// this.pushToBufferForAssembly(mat);
				this.pushToBuffer("Assembly", "", mat);
			}
		},

		readfrombufferBom: function (uid) {
			var g = this;
			var m = this.getView().getModel();
			var url = "/ChangeRequestSet";
			var oFilter;
			var oExpand;
			var BOMDetailModel = new JSONModel();
			var itemDetailModel = new JSONModel();
			oFilter = [new sap.ui.model.Filter("MbomBuffer", "EQ", true)];
			oExpand = ["MRBHeader", "MRBItem", "MRBSBIT"];
			this.getView().byId("detailPage").setBusy(true);
			m.read(url, {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					g.getView().byId("detailPage").setBusy(false);
					var crstatus = false;
					if (g.sFragmentName === "CreateMaterialBom" || g.sFragmentName === "changeMbom") {
						var h = r.results[0].MRBHeader.results[0];
						var i = r.results[0].MRBItem.results;
						var s = r.results[0].MRBSBIT.results;
						g.currentObj = {
							Matnr: h.Matnr,
							Werks: h.Werks,
							Stlan: h.Stlan,
							Stalt: h.Stalt,
							Pmbomtech: h.Pmbomtech,
							PmbomtechTxt: h.PmbomtechTxt,
							Bomstatus: h.Bomstatus,
							Lngtxt: h.Txtmi,
							Stktx: h.Stktx,
							Validfrom: g.getDateFormat(h.Validfrom),
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
							crtMatHdrBtnEnable: false,
							fromDateEnable: true,
							addItemEnable: true,
							modeFlag: "Delete",
							matValueState: "None",
							plantValueState: "None",
							usageValueState: "None",
							statusValueState: "None",
							BaseQtyValueState: "None",
							altbomValueState: "None",

							matItem: [],
							matSubItem: []
						};

						if (i && i.length > 0) {
							g.currentObj.matItem = i;
							for (var j = 0; j < g.currentObj.matItem.length; j++) {
								g.currentObj.matItem[j].itmCatState = "None";
								g.currentObj.matItem[j].itmCompState = "None";
								g.currentObj.matItem[j].itmQtyState = "None";
								g.currentObj.matItem[j].itmUOMState = "None";
								g.currentObj.matItem[j].itmCatEnable = false;
								g.currentObj.matItem[j].itmQtyEnable = true;
								if (g.currentObj.matItem[j].Itemcat === "D" || g.currentObj.matItem[j].Itemcat === "T") {
									g.currentObj.matItem[j].reccrAllowEnable = false;
								}
							}
							g.sLastItemNum = i.length;
						} else
							g.currentObj.matItem = [];

						if (s && s.length > 0)
							g.currentObj.matSubItem = s;
						else
							g.currentObj.matSubItem = [];

						g.currentObj.crtMatEnable = true;

						if (g.sFragmentName === "changeMbom") {
							g.currentObj.fromDateEnable = false;
							g.currentObj.bomType = "Change";

							if (crstatus === "true") {
								g.getView().byId("idBtnCheck").setEnabled(false);
								g.currentObj.altbomEnable = false;
								g.currentObj.BomstatusEnable = false;
								g.currentObj.BaseQtyEnable = false;
								g.currentObj.LngtxtEnable = false;
								g.currentObj.fromDateEnable = false;
								g.currentObj.addItemEnable = false;
								g.currentObj.crtMatEnable = false;
								g.currentObj.modeFlag = "None";
								for (var j = 0; j < g.currentObj.matItem.length; j++) {
									g.currentObj.matItem[j].itmQtyEnable = false;
									g.currentObj.matItem[j].itmCompEnable = false;
									g.currentObj.matItem[j].itmUomEnable = false;
									g.currentObj.matItem[j].reccrAllowEnable = false;
									g.currentObj.matItem[j].Pmper = "-";
									g.currentObj.matItem[j].Pmper = "-";
									g.currentObj.matItem[j].Pmpka = "-";
									g.currentObj.matItem[j].Pmprv = "-";
									g.currentObj.matItem[j].Pmpfe = "-";
									g.currentObj.matItem[j].Pmpin = "-";
									g.currentObj.matItem[j].Pmpko = "-";
								}
								for (var j = 0; j < g.currentObj.matSubItem.length; j++) {
									g.currentObj.matSubItem[j].intPointEnable = false;
									g.currentObj.matSubItem[j].subQtyEnable = false;
									g.currentObj.matSubItem[j].subTextEnable = false;
								}
							}
						}

						if (g.case === "header") {
							g.currentObj.matEnable = true;
							g.currentObj.plantEnable = true;
							g.currentObj.usageEnable = true;
							g.currentObj.altbomEnable = true;
						}

						BOMDetailModel.setData(g.currentObj);
						itemDetailModel.setData(g.currentObj.matItem);
					}
					if (g.sFragmentName === "CreateEquipmentBom" || g.sFragmentName === "changeEbom") {
						var h = r.results[0].EBHeader.results[0];
						var i = r.results[0].EBItem.results;
						var s = r.results[0].EBSBIT.results;
						g.currentObj = {
							Eqnrbom: h.Eqnrbom,
							Werks: h.Werks,
							Stlan: h.Stlan,
							Bomstatus: h.Bomstatus,
							Lngtxt: h.Txtmi,
							Validfrom: g.getDateFormat(h.Validfrom),
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
							fromDateEnable: true,
							addItemEnable: true,
							modeFlag: "Delete",
							equipValueState: "None",
							plantValueState: "None",
							usageValueState: "None",
							statusValueState: "None",
							BaseQtyValueState: "None",

							eqItem: [],
							eqSubItem: []
						};

						if (i && i.length > 0) {
							g.currentObj.eqItem = i;
							for (var j = 0; j < g.currentObj.eqItem.length; j++) {
								g.currentObj.eqItem[j].itmCatState = "None";
								g.currentObj.eqItem[j].itmCompState = "None";
								g.currentObj.eqItem[j].itmQtyState = "None";
								g.currentObj.eqItem[j].itmUOMState = "None";
								g.currentObj.eqItem[j].itmCatEnable = false;
								g.currentObj.eqItem[j].itmQtyEnable = true;
							}
							g.sLastItemNum = i.length;
						} else
							g.currentObj.eqItem = [];

						if (s && s.length > 0) {
							g.currentObj.eqSubItem = s;
						} else
							g.currentObj.eqSubItem = [];

						g.currentObj.crtMatEnable = false;

						if (g.sFragmentName === "changeEbom") {
							g.currentObj.fromDateEnable = false;
							g.currentObj.bomType = "Change";

							if (crstatus === "true") {
								g.getView().byId("idBtnCheck").setEnabled(false);
								g.currentObj.BomstatusEnable = false;
								g.currentObj.BaseQtyEnable = false;
								g.currentObj.LngtxtEnable = false;
								g.currentObj.fromDateEnable = false;
								g.currentObj.addItemEnable = false;
								g.currentObj.modeFlag = "None";
								for (var j = 0; j < g.currentObj.eqItem.length; j++) {
									g.currentObj.eqItem[j].itmQtyEnable = false;
									g.currentObj.eqItem[j].itmCompEnable = false;
									g.currentObj.eqItem[j].itmUomEnable = false;
									g.currentObj.eqItem[j].addSubItmEnable = false;
									g.currentObj.eqItem[j].Pmper = "-";
									g.currentObj.eqItem[j].Pmpka = "-";
									g.currentObj.eqItem[j].Pmprv = "-";
									g.currentObj.eqItem[j].Pmpfe = "-";
									g.currentObj.eqItem[j].Pmpin = "-";
									g.currentObj.eqItem[j].Pmpko = "-";
								}
								for (var j = 0; j < g.currentObj.eqSubItem.length; j++) {
									g.currentObj.eqSubItem[j].intPointEnable = false;
									g.currentObj.eqSubItem[j].subQtyEnable = false;
									g.currentObj.eqSubItem[j].subTextEnable = false;
								}
							}
						}

						BOMDetailModel.setData(g.currentObj);
						itemDetailModel.setData(g.currentObj.eqItem);
					}
					if (g.sFragmentName === "CreateFLBom" || g.sFragmentName === "changeFlbom") {
						var h = r.results[0].FBHeader.results[0];
						var i = r.results[0].FBItem.results;
						var s = r.results[0].FBSBIT.results;
						g.currentObj = {
							Tplnrbom: h.Tplnrbom,
							Werks: h.Werks,
							Stlan: h.Stlan,
							Bomstatus: h.Bomstatus,
							Lngtxt: h.Txtmi,
							Validfrom: g.getDateFormat(h.Validfrom),
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
							fromDateEnable: true,
							addItemEnable: true,
							modeFlag: "Delete",
							FLValueState: "None",
							plantValueState: "None",
							usageValueState: "None",
							statusValueState: "None",
							BaseQtyValueState: "None",

							flItem: [],
							flSubItem: []
						};

						if (i && i.length > 0) {
							g.currentObj.flItem = i;
							for (var j = 0; j < g.currentObj.flItem.length; j++) {
								g.currentObj.flItem[j].itmCatState = "None";
								g.currentObj.flItem[j].itmCompState = "None";
								g.currentObj.flItem[j].itmQtyState = "None";
								g.currentObj.flItem[j].itmUOMState = "None";
								g.currentObj.flItem[j].itmCatEnable = false;
								g.currentObj.flItem[j].itmQtyEnable = true;
							}
							g.sLastItemNum = i.length;
						} else
							g.currentObj.flItem = [];

						if (s && s.length > 0)
							g.currentObj.flSubItem = s;
						else
							g.currentObj.flSubItem = [];

						g.currentObj.crtMatEnable = false;

						if (g.sFragmentName === "changeFlbom") {
							g.currentObj.fromDateEnable = false;
							g.currentObj.bomType = "Change";

							if (crstatus === "true") {
								g.getView().byId("idBtnCheck").setEnabled(false);
								g.currentObj.BomstatusEnable = false;
								g.currentObj.BaseQtyEnable = false;
								g.currentObj.LngtxtEnable = false;
								g.currentObj.fromDateEnable = false;
								g.currentObj.addItemEnable = false;
								g.currentObj.modeFlag = "None";
								for (var j = 0; j < g.currentObj.flItem.length; j++) {
									g.currentObj.flItem[j].itmQtyEnable = false;
									g.currentObj.flItem[j].itmCompEnable = false;
									g.currentObj.flItem[j].itmUomEnable = false;
									g.currentObj.flItem[j].addSubItmEnable = false;
									g.currentObj.flItem[j].Pmper = "-";
									g.currentObj.flItem[j].Pmpka = "-";
									g.currentObj.flItem[j].Pmprv = "-";
									g.currentObj.flItem[j].Pmpfe = "-";
									g.currentObj.flItem[j].Pmpin = "-";
									g.currentObj.flItem[j].Pmpko = "-";
								}
								for (var j = 0; j < g.currentObj.flSubItem.length; j++) {
									g.currentObj.flSubItem[j].intPointEnable = false;
									g.currentObj.flSubItem[j].subQtyEnable = false;
									g.currentObj.flSubItem[j].subTextEnable = false;
								}
							}
						}

						BOMDetailModel.setData(g.currentObj);
						itemDetailModel.setData(g.currentObj.flItem);
					}
					if (g.sFragmentName === "CreateWBSBom" || g.sFragmentName === "changeWbsbom") {
						var h = r.results[0].WBHeader.results[0];
						var i = r.results[0].WBItem.results;
						var s = r.results[0].WBSBIT.results;
						g.currentObj = {
							WbsExt: h.WbsExt,
							Matnr: h.MatnrWbs,
							Werks: h.Werks,
							Stlan: h.Stlan,
							Bomstatus: h.Bomstatus,
							Lngtxt: h.Txtmi,
							Validfrom: g.getDateFormat(h.Validfrom),
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
							fromDateEnable: true,
							addItemEnable: true,
							modeFlag: "Delete",
							wbsValueState: "None",
							matValueState: "None",
							plantValueState: "None",
							usageValueState: "None",
							statusValueState: "None",
							BaseQtyValueState: "None",

							wbsItem: [],
							wbsSubItem: []
						};

						if (i && i.length > 0) {
							g.currentObj.wbsItem = i;
							for (var j = 0; j < g.currentObj.wbsItem.length; j++) {
								g.currentObj.wbsItem[j].itmCatState = "None";
								g.currentObj.wbsItem[j].itmCompState = "None";
								g.currentObj.wbsItem[j].itmQtyState = "None";
								g.currentObj.wbsItem[j].itmUOMState = "None";
								g.currentObj.wbsItem[j].itmCatEnable = false;
								g.currentObj.wbsItem[j].itmQtyEnable = true;
								g.currentObj.wbsItem[j].Matnr = g.currentObj.wbsItem[j].MatnrWbs;
								if (g.currentObj.wbsItem[j].Itemcat === "D" || g.currentObj.wbsItem[j].Itemcat === "T") {
									g.currentObj.wbsItem[j].reccrAllowEnable = false;
								}
							}
							g.sLastItemNum = i.length;
						} else
							g.currentObj.wbsItem = [];

						if (s && s.length > 0)
							g.currentObj.wbsSubItem = s;
						else
							g.currentObj.wbsSubItem = [];

						g.currentObj.crtMatEnable = false;

						if (g.sFragmentName === "changeWbsbom") {
							g.currentObj.fromDateEnable = false;
							g.currentObj.bomType = "Change";

							if (crstatus === "true") {
								g.getView().byId("idBtnCheck").setEnabled(false);
								g.currentObj.BomstatusEnable = false;
								g.currentObj.BaseQtyEnable = false;
								g.currentObj.LngtxtEnable = false;
								g.currentObj.fromDateEnable = false;
								g.currentObj.addItemEnable = false;
								g.currentObj.modeFlag = "None";
								for (var j = 0; j < g.currentObj.wbsItem.length; j++) {
									g.currentObj.wbsItem[j].itmQtyEnable = false;
									g.currentObj.wbsItem[j].itmCompEnable = false;
									g.currentObj.wbsItem[j].itmUomEnable = false;
									g.currentObj.wbsItem[j].reccrAllowEnable = false;
									g.currentObj.wbsItem[j].addSubItmEnable = false;
									g.currentObj.wbsItem[j].Pmper = "-";
									g.currentObj.wbsItem[j].Pmpka = "-";
									g.currentObj.wbsItem[j].Pmprv = "-";
									g.currentObj.wbsItem[j].Pmpfe = "-";
									g.currentObj.wbsItem[j].Pmpin = "-";
									g.currentObj.wbsItem[j].Pmpko = "-";
								}
								for (var j = 0; j < g.currentObj.wbsSubItem.length; j++) {
									g.currentObj.wbsSubItem[j].intPointEnable = false;
									g.currentObj.wbsSubItem[j].subQtyEnable = false;
									g.currentObj.wbsSubItem[j].subTextEnable = false;
								}
							}
						}

						BOMDetailModel.setData(g.currentObj);
						itemDetailModel.setData(g.currentObj.wbsItem);
					}

					g.getView().setModel(BOMDetailModel, "BOMDetailModel");
					g.getView().setModel(itemDetailModel, "itemDetailModel");
					g.attachModelEventHandlers(BOMDetailModel);
					g.attachModelEventHandlers(itemDetailModel);

					if (uid) {
						g.syncBOMItem(uid);
					}
				},
				error: function (err) {
					g.BusyDialog.close();
				}
			});
		},

		syncBOMItem: function (uid) {
			var g = this;
			var sAIWData = g.getView().getModel("BOMDetailModel").getData();
			var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
			var sPayload = {
				"ChangeRequestType": oCrType.crtype,
				"CrDescription": oCrType.desc,
				"IsDraft": "C",
				"ShmmInstance": uid,
				// "SyncMbom": true,
				// "BomNavRead": true,
				"Messages": [],
				// "Reason": this.getView().byId("reasonForRequest").getSelectedKey(),
				// "Guids": this.oAttach,
				"FuncLoc": [],
				"FLAddr": [],
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"Equipment": [],
				"EqAddr": [],
				"EqPRT": [],
				"EqLAM": [],
				"EqClass": [],
				"EqVal": [],
				"MSPoint": [],
				"MSLAM": [],
				"MSClass": [],
				"MSVal": [],
				"MPLAN": [],
				"MPItem": [],
				"MPLAM": [],
				"MPOBList": [],
				"MPCycle": [],
				"MRBHeader": [],
				"MRBItem": [],
				"MRBSBIT": [],
				"EBHeader": [],
				"EBItem": [],
				"EBSBIT": [],
				"FBHeader": [],
				"FBItem": [],
				"FBSBIT": [],
				"WBHeader": [],
				"WBItem": [],
				"WBSBIT": [],
				"ONetwork": [],
				"ONLAM": [],
				"Workcenter": [],
				"WCCost": [],
				"GTList": [],
				"GTOprs": [],
				"GTComp": [],
				"GTClass": [],
				"GTVal": [],
				"ETList": [],
				"ETOprs": [],
				"ETComp": [],
				"ETClass": [],
				"ETVal": [],
				"FTList": [],
				"FTOprs": [],
				"FTComp": [],
				"FTClass": [],
				"FTVal": [],
				"Olink": [],
				"OLClass": [],
				"OLVal": []
			};

			if (g.case === "header") {
				sPayload.SyncHeadData = true;
			} else if (g.case === "component" || g.case === "link") {
				sPayload.SyncMbom = true;
			} else if (g.case === "add") {
				sPayload.SyncSearchData = true;
			}

			var mHeader = {
				"Matnr": sAIWData.Matnr,
				"Stalt": sAIWData.Stalt,
				"Stlan": sAIWData.Stlan,
				"Werks": sAIWData.Werks,
				"Pmbomtech": sAIWData.Pmbomtech ? sAIWData.Pmbomtech : "",
				"PmbomtechTxt": sAIWData.PmbomtechTxt ? sAIWData.PmbomtechTxt : "",
				"Bomstatus": sAIWData.Bomstatus,
				"Lngtxt": sAIWData.Lngtxt,
				"Txtmi": sAIWData.Lngtxt,
				"Stktx": sAIWData.Stktx,
				"Validfrom": this._formatDate(sAIWData.Validfrom),
				"Baseqty": sAIWData.BaseQty,
				"Baseuom": sAIWData.BaseUom,
				"Validtoda": this._formatDate(sAIWData.Validtoda)
			};
			sPayload.MRBHeader.push(mHeader);

			for (var j = 0; j < sAIWData.matItem.length; j++) {
				var mItem = {
					"Matnr": sAIWData.Matnr,
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Bomitmpos": sAIWData.matItem[j].Bomitmpos,
					"Itemcat": sAIWData.matItem[j].Itemcat,
					"Itemcomp": sAIWData.matItem[j].Itemcomp,
					"Compdesc": "",
					"Itmqty": sAIWData.matItem[j].Itmqty,
					"Itmuom": sAIWData.matItem[j].Itmuom,
					"Recurallo": sAIWData.matItem[j].Recurallo,
					"Erskz": sAIWData.matItem[j].Erskz,
					"Rvrel": sAIWData.matItem[j].Rvrel === "0" ? "" : sAIWData.matItem[j].Rvrel,
					"Sanfe": sAIWData.matItem[j].Sanfe,
					"Sanin": sAIWData.matItem[j].Sanin,
					"Sanko": sAIWData.matItem[j].Sanko,
					"Itmcmpdesc": sAIWData.matItem[j].Itmcmpdesc,
					"Costgrelv": sAIWData.matItem[j].Costgrelv === "0" ? "" : sAIWData.matItem[j].Costgrelv,
					"IsNavPossible": sAIWData.matItem[j].IsNavPossible,
					"Itmassind": sAIWData.matItem[j].Itmassind
						// "ItmcmpdescEnabled": false
				};
				if (sAIWData.bomType === "Change") {
					mItem.Bomitmnod = sAIWData.matItem[j].Bomitmnod;
				}
				if (sAIWData.matItem[j].Itemcat === "N") {
					mItem.Ekorg = sAIWData.matItem[j].Ekorg;
					mItem.Ekotx = sAIWData.matItem[j].Ekotx;
					mItem.Ekgrp = sAIWData.matItem[j].Ekgrp;
					mItem.Eknam = sAIWData.matItem[j].Eknam;
					mItem.Preis = sAIWData.matItem[j].Preis;
					mItem.Waers = sAIWData.matItem[j].Waers;
					mItem.Peinh = sAIWData.matItem[j].Peinh;
					mItem.Matkl = sAIWData.matItem[j].Matkl;
					mItem.Wgbez = sAIWData.matItem[j].Wgbez;
					mItem.Potx1 = sAIWData.matItem[j].Potx1;
				} else if (sAIWData.matItem[j].Itemcat === "D") {
					mItem.Bomdocitm = sAIWData.matItem[j].Bomdocitm;
					mItem.Bomitmdkr = sAIWData.matItem[j].Bomitmdkr;
					mItem.BomitmdkrTxt = sAIWData.matItem[j].BomitmdkrTxt;
					mItem.Bomitmdtl = sAIWData.matItem[j].Bomitmdtl;
					mItem.Bomitmdvr = sAIWData.matItem[j].Bomitmdvr;
				} else if (sAIWData.matItem[j].Itemcat === "R") {
					mItem.Roms1 = sAIWData.matItem[j].Roms1;
					mItem.Romei = sAIWData.matItem[j].Romei;
					mItem.Roms2 = sAIWData.matItem[j].Roms2;
					mItem.Roms3 = sAIWData.matItem[j].Roms3;
					mItem.Rform = sAIWData.matItem[j].Rform;
					// mItem.FrmlaKeyDesc = sAIWData.matItem[j].Itemcat;
					mItem.Roanz = sAIWData.matItem[j].Roanz;
					// mItem.numVarSizeDesc = sAIWData.matItem[j].Itemcat;
					mItem.Romen = sAIWData.matItem[j].Romen;
					mItem.Rokme = sAIWData.matItem[j].Rokme;
				} else if (sAIWData.matItem[j].Itemcat === "T") {
					mItem.Potx1 = sAIWData.matItem[j].Potx1;
				}
				sPayload.MRBItem.push(mItem);
			}

			for (var k = 0; k < sAIWData.matSubItem.length; k++) {
				var mSubItem = {
					"Matnr": sAIWData.Matnr,
					"Stlan": sAIWData.Stlan,
					"Werks": sAIWData.Werks,
					"Posnr": sAIWData.matSubItem[k].Posnr,
					"Bomitmnod": sAIWData.matSubItem[k].Bomitmnod,
					"Bomsubno": sAIWData.matSubItem[k].Bomsubno,
					"Ebort": sAIWData.matSubItem[k].Ebort,
					"Upmng": sAIWData.matSubItem[k].Upmng,
					"Uptxt": sAIWData.matSubItem[k].Uptxt
				};
				sPayload.MRBSBIT.push(mSubItem);
			}

			this.getView().byId("detailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("detailPage").setBusy(false);
					// if (g.sFragmentName === "CreateMaterialBom") {
					if (g.case === "header") {
						sAIWData.Matnr = r.MRBHeader.results[0].Matnr;
						sAIWData.MatDesc = r.MRBHeader.results[0].Maktx;
						g.getView().getModel("BOMDetailModel").refresh();
						sap.ui.getCore().getModel("AIWListMatModel").setProperty(g.sBOMModelPath, sAIWData);
						// sap.ui.getCore().getModel("AIWListMatModel").getProperty(g.sBOMModelPath).Matnr = sAIWData.Matnr;
						// sap.ui.getCore().getModel("AIWListMatModel").getProperty(g.sBOMModelPath).MatDesc = sAIWData.MatDesc;

						if (g.sFragmentName === "CreateMaterialBom" && sAIWData.Matnr !== "" && sAIWData.Werks !== "" && sAIWData.Stlan !== "") {
							g.readBomHdrDetails(sAIWData.Matnr, sAIWData.Werks, sAIWData.Stlan, sAIWData.Stalt);
						}
					} else if (g.case === "component" || g.case === "add") {
						var mbomItems = r.MRBItem.results;
						sAIWData.matItem = [];
						for (var i = 0; i < mbomItems.length; i++) {
							mbomItems[i].Matnr = sAIWData.Matnr;
							mbomItems[i].Stlan = sAIWData.Stlan;
							mbomItems[i].Werks = sAIWData.Werks;
							mbomItems[i].Costgrelv = mbomItems[i].Costgrelv === "" ? "0" : mbomItems[i].Costgrelv;
							mbomItems[i].Rvrel = mbomItems[i].Rvrel === "" ? "0" : mbomItems[i].Rvrel;
							mbomItems[i].ItmcmpdescEnabled = true;
							sAIWData.matItem.push(mbomItems[i]);
						}
						g.getView().getModel("BOMDetailModel").refresh();
						var itemDetailModel = new JSONModel();
						itemDetailModel.setData(sAIWData.matItem);
						g.getView().setModel(itemDetailModel, "itemDetailModel");
						sap.ui.getCore().getModel("AIWListMatModel").setProperty(g.sBOMModelPath, sAIWData);
						// sap.ui.getCore().getModel("AIWListMatModel").refresh();
						// sap.ui.getCore().getModel("AIWListMatModel").getProperty(g.sBOMModelPath).matItem = sAIWData.matItem;
					} else if (g.case === "link") {
						if (g.sFragmentName === "CreateMaterialBom") {
							if (sAIWData.Matnr === "" || sAIWData.Werks === "" || sAIWData.Stlan === "") {
								sAIWData.Matnr = r.MRBHeader.results[0].Matnr;
								sAIWData.MatDesc = r.MRBHeader.results[0].Maktx;
								sAIWData.Werks = r.MRBHeader.results[0].Werks;
								sAIWData.WerksDesc = r.MRBHeader.results[0].Plantname;
								sAIWData.Stlan = r.MRBHeader.results[0].Stlan;
								sAIWData.StlanDesc = r.MRBHeader.results[0].Stktx;
								sAIWData.matEnable = true;
								sAIWData.plantEnable = true;
								sAIWData.usageEnable = true;
								sAIWData.altbomVisible = true;
								g.getView().getModel("BOMDetailModel").refresh();
								sap.ui.getCore().getModel("AIWListMatModel").setProperty(g.sBOMModelPath, sAIWData);
							} else if (sAIWData.Matnr !== "" && sAIWData.Werks !== "" && sAIWData.Stlan !== "") {
								// g.readBomHdrDetails(sAIWData.Matnr, sAIWData.Werks, sAIWData.Stlan, sAIWData.Stalt);
								var mbomItems = r.MRBItem.results;
								sAIWData.matItem = [];
								for (var i = 0; i < mbomItems.length; i++) {
									mbomItems[i].Matnr = sAIWData.Matnr;
									mbomItems[i].Stlan = sAIWData.Stlan;
									mbomItems[i].Werks = sAIWData.Werks;
									mbomItems[i].Costgrelv = mbomItems[i].Costgrelv === "" ? "0" : mbomItems[i].Costgrelv;
									mbomItems[i].Rvrel = mbomItems[i].Rvrel === "" ? "0" : mbomItems[i].Rvrel;
									mbomItems[i].ItmcmpdescEnabled = true;
									sAIWData.matItem.push(mbomItems[i]);
								}
								g.getView().getModel("BOMDetailModel").refresh();
								var itemDetailModel = new JSONModel();
								itemDetailModel.setData(sAIWData.matItem);
								g.getView().setModel(itemDetailModel, "itemDetailModel");
								sap.ui.getCore().getModel("AIWListMatModel").setProperty(g.sBOMModelPath, sAIWData);
							}
						}
					}
					// } else if (g.sFragmentName === "changeMbom") {
					// 	var crstatus = false;
					// 	var BOMDetailModel = new JSONModel();
					// 	var itemDetailModel = new JSONModel();
					// 	var h = r.MRBHeader.results[0];
					// 	var i = r.MRBItem.results;
					// 	var s = r.MRBSBIT.results;
					// 	g.currentObj = {
					// 		Matnr: h.Matnr,
					// 		Werks: h.Werks,
					// 		Stlan: h.Stlan,
					// 		Bomstatus: h.Bomstatus,
					// 		Lngtxt: h.Txtmi,
					// 		Validfrom: g.getDateFormat(h.Dvalidfrm),
					// 		BaseQty: h.Baseqty,
					// 		BaseUom: h.Baseuom,
					// 		Validtoda: g.getDateFormat(h.Validtoda),

					// 		MatDesc: h.Maktx,
					// 		WerksDesc: h.Plantname,
					// 		StlanDesc: h.Bomusagetxt,
					// 		BomstatusText: h.Bomstatustxt,
					// 		matEnable: false,
					// 		plantEnable: false,
					// 		usageEnable: false,
					// 		fromDateEnable: true,
					// 		addItemEnable: true,
					// 		modeFlag: "Delete",
					// 		matValueState: "None",
					// 		plantValueState: "None",
					// 		usageValueState: "None",
					// 		statusValueState: "None",
					// 		BaseQtyValueState: "None",
					// 		altbomValueState: "None",

					// 		bomType: "Change",

					// 		matItem: [],
					// 		matSubItem: []
					// 	};
					// 	if (g.sFragmentName === "changeMbom") {
					// 		g.currentObj.fromDateEnable = false;
					// 	}
					// 	if (i && i.length > 0) {
					// 		g.currentObj.matItem = i;
					// 		for (var j = 0; j < g.currentObj.matItem.length; j++) {
					// 			g.currentObj.matItem[j].itmCatState = "None";
					// 			g.currentObj.matItem[j].itmCompState = "None";
					// 			g.currentObj.matItem[j].itmQtyState = "None";
					// 			g.currentObj.matItem[j].itmUOMState = "None";
					// 			g.currentObj.matItem[j].itmCatEnable = false;
					// 			g.currentObj.matItem[j].itmQtyEnable = true;
					// 			g.currentObj.matItem[j].Costgrelv = g.currentObj.matItem[j].Costgrelv === "" ? "0" : g.currentObj.matItem[j].Costgrelv;
					// 			g.currentObj.matItem[j].Rvrel = g.currentObj.matItem[j].Rvrel === "" ? "0" : g.currentObj.matItem[j].Rvrel;
					// 			g.currentObj.matItem[j].ItmcmpdescEnabled = false;
					// 		}
					// 		g.sLastItemNum = i.length;
					// 	} else
					// 		g.currentObj.matItem = [];

					// 	if (s && s.length > 0)
					// 		g.currentObj.matSubItem = s;
					// 	else
					// 		g.currentObj.matSubItem = [];

					// 	g.currentObj.crtMatEnable = true;

					// 	if (crstatus === "true") {
					// 		g.getView().byId("idBtnCheck").setEnabled(false);
					// 		g.currentObj.altbomEnable = false;
					// 		g.currentObj.BomstatusEnable = false;
					// 		g.currentObj.BaseQtyEnable = false;
					// 		g.currentObj.LngtxtEnable = false;
					// 		g.currentObj.fromDateEnable = false;
					// 		g.currentObj.addItemEnable = false;
					// 		g.currentObj.crtMatEnable = false;
					// 		g.currentObj.modeFlag = "None";
					// 		for (var j = 0; j < g.currentObj.matItem.length; j++) {
					// 			g.currentObj.matItem[j].itmQtyEnable = false;
					// 			g.currentObj.matItem[j].itmCompEnable = false;
					// 			g.currentObj.matItem[j].itmUomEnable = false;
					// 			g.currentObj.matItem[j].reccrAllowEnable = false;
					// 			g.currentObj.matItem[j].Pmper = "-";
					// 			g.currentObj.matItem[j].Pmper = "-";
					// 			g.currentObj.matItem[j].Pmpka = "-";
					// 			g.currentObj.matItem[j].Pmprv = "-";
					// 			g.currentObj.matItem[j].Pmpfe = "-";
					// 			g.currentObj.matItem[j].Pmpin = "-";
					// 			g.currentObj.matItem[j].Pmpko = "-";
					// 		}
					// 		for (var j = 0; j < g.currentObj.matSubItem.length; j++) {
					// 			g.currentObj.matSubItem[j].intPointEnable = false;
					// 			g.currentObj.matSubItem[j].subQtyEnable = false;
					// 			g.currentObj.matSubItem[j].subTextEnable = false;
					// 		}
					// 	}
					// 	BOMDetailModel.setData(g.currentObj);
					// 	itemDetailModel.setData(g.currentObj.matItem);
					// }
				},
				error: function (err) {
					g.getView().byId("detailPage").setBusy(false);
					var error = [],
						oMessageList = [];
					if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
						.errordetails
						.length === 0) {
						error[0] = JSON.parse(err.responseText).error.message.value;
					} else {
						for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
							error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
						}
					}

					var value = error.join("\n");
					sap.m.MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {}
					});
				}
			});
		},

		handleHdrMatCrtPress: function () {
			var g = this;
			var sAIWData = g.getView().getModel("BOMDetailModel").getData();

			// if (sAIWData.Werks === "") { //Commented code as Plant is not mandatory
			// 	var sMsg = "Enter Plant";
			// 	sAIWData.plantValueState = "Error";
			// 	g.getView().getModel("BOMDetailModel").refresh();
			// 	g.createMessagePopover(sMsg, "Error");
			// } else {
			this.pushToBuffer("Hdr", "create");
			// }
		},

		/**
		 * @desc Triggered when Created material's Hyperlink in header Data is clicked
		 * @method pushToBuffer
		 * @param {}
		 * @return
		 */
		handleMaterialCompPress: function (oEvent) {
			this.pushToBuffer("Comp", "View");
		},

		handleMaterialLinkPress: function (oEvent) {
			var g = this;
			var sMaterial;
			if (oEvent.getSource().getBindingContext("itemDetailModel")) {
				var sPath = oEvent.getSource().getBindingContext("itemDetailModel").sPath;
				var index = parseInt(sPath.substr(1), 10);
				var mItem = this.getView().getModel("itemDetailModel");
				var aItem = mItem.getData();
				sMaterial = aItem[index].Itemcomp;
			} else {
				var sAIWData = g.getView().getModel("BOMDetailModel").getData();
				sMaterial = sAIWData.Matnr;
			}

			this.pushToBuffer("Comp", "View", sMaterial);
		},

		/**
		 * @desc Triggered when display buttton is clicked
		 * @method handleDisplay
		 * @param {}
		 * @return
		 */

		handleDisplay: function () {
			var g = this;
			var sAIWData = g.getView().getModel("BOMDetailModel").getData();
			var itemArr = [];
			if (sAIWData.Matnr.indexOf("$") > -1) {
				var h = {};
				h.Matnr = sAIWData.Matnr;
				itemArr.push(h);
			}
			if (sAIWData.matItem.length > 0) {
				var itemData = sAIWData.matItem;
				for (var it = 0; it < itemData.length; it++) {
					var r = {};
					// if (itemData[it].ItemFlag) {
					r.Matnr = itemData[it].Itemcomp;
					itemArr.push(r);
					// }
				}
			}
			var payload = {
				"ChangeRequestId": "",
				"DisplayMATCR": itemArr
			};
			var C = this.getView().getModel();
			var h = {
				"X-Requested-With": "xmlHTTPrequest"
			};
			this.BusyDialog = new sap.m.BusyDialog();
			this.BusyDialog.open();
			C.setHeaders(h);
			C.create("/ChangeRequestSet", payload, {
				success: function (data) {
					g.BusyDialog.close();
					var results = data.DisplayMATCR.results;
					var l = new sap.m.List({
						mode: "SingleSelectMaster"
					});
					g.displayMat = new sap.m.Dialog({
						title: "Display Change Request",
						content: [l],
						leftButton: new sap.m.Button({
							text: "OK",
							// type: sap.m.ButtonType.Up,
							press: function () {
								g.displayMat.close();
							}
						})
					});
					var I = new sap.m.StandardListItem({
						title: "{Matnr}",
						description: "{ChangeRequest}",
						icon: "sap-icon://request",
						// type: "Active"
					});
					var e = new sap.ui.model.json.JSONModel();
					e.setData(results);
					l.setModel(e);
					l.bindAggregation("items", "/", I);
					g.displayMat.open();
				},
				error: function (err) {
					g.BusyDialog.close();
					var scssFlag = false;
					var error = [];
					if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
						.errordetails
						.length === 0) {
						error[0] = JSON.parse(err.responseText).error.message.value;
					} else {
						for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
							error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
						}
					}
					var value = error.join("\n");
					// g.submitBtn = false;
					sap.m.MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function (oAction) {}
					});
				}
			});

		},

		/**
		 * @desc Triggered to push the data to buffer
		 * @method pushToBufferForAssembly
		 * @param {}
		 * @return
		 */
		// pushToBufferForAssembly: function (material) {
		// 	var g = this;
		// 	var sAIWData = this.getView().getModel("BOMDetailModel").getData();

		// 	var asmbly_uid = this.generateUUID();

		// 	var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
		// 	var atempFL = $.map(AIWFLOCModel, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempFL), "AIWFLOCBackup");
		// 	var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
		// 	var atempEQ = $.map(AIWEQUIModel, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempEQ), "AIWEQUIBackup");
		// 	var AIWMSPTModel = sap.ui.getCore().getModel("AIWMSPT").getData();
		// 	var atempMS = $.map(AIWMSPTModel, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempMS), "AIWMSPTBackup");
		// 	var AIWMPMIModel = sap.ui.getCore().getModel("AIWMPMI").getData();
		// 	var atempMP = $.map(AIWMPMIModel, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempMP), "AIWMPMIBackup");
		// 	var AIWListMatData = sap.ui.getCore().getModel("AIWListMatModel").getData();
		// 	var atempMB = $.map(AIWListMatData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempMB), "AIWListMatModelBackup");
		// 	var AIWListEqData = sap.ui.getCore().getModel("AIWListEqModel").getData();
		// 	var atempEB = $.map(AIWListEqData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempEB), "AIWListEqModelBackup");
		// 	var AIWListFLData = sap.ui.getCore().getModel("AIWListFLModel").getData();
		// 	var atempFB = $.map(AIWListFLData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempFB), "AIWListFLModelBackup");
		// 	var AIWListWBSData = sap.ui.getCore().getModel("AIWListWBSModel").getData();
		// 	var atempWB = $.map(AIWListWBSData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempWB), "AIWListWBSModelBackup");
		// 	var AIWListONData = sap.ui.getCore().getModel("AIWListONModel").getData();
		// 	var atempON = $.map(AIWListONData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempON), "AIWListONModelBackup");
		// 	var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
		// 	var atempWC = $.map(AIWListWCData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempWC), "AIWListWCModelBackup");
		// 	var AIWListGTLData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
		// 	var atempGTL = $.map(AIWListGTLData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempGTL), "AIWListGTLModelBackup");
		// 	var AIWListETLData = sap.ui.getCore().getModel("AIWListETLModel").getData();
		// 	var atempETL = $.map(AIWListGTLData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempETL), "AIWListETLModelBackup");
		// 	var AIWListFTLData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
		// 	var atempFTL = $.map(AIWListFTLData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempFTL), "AIWListFTLModelBackup");
		// 	var AIWListOLData = sap.ui.getCore().getModel("AIWListOLModel").getData();
		// 	var atempOL = $.map(AIWListFTLData, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempOL), "AIWListOLModelBackup");
		// 	var dataOriginMOPdata = [];
		// 	dataOriginMOPdata.push(sap.ui.getCore().getModel("dataOriginMOP").getData());
		// 	var atempDOI = $.map(dataOriginMOPdata, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempDOI), "dataOriginMOPBackup");
		// 	var EnableModeldata = [];
		// 	EnableModeldata.push(sap.ui.getCore().getModel("EnableModel").getData());
		// 	var atempEnableModel = $.map(EnableModeldata, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempEnableModel), "EnableModelBackup");
		// 	var AIWModeldata = [];
		// 	AIWModeldata.push(sap.ui.getCore().getModel("AIWModel").getData());
		// 	var atempAIWModel = $.map(AIWModeldata, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempAIWModel), "AIWModelBackup");
		// 	var ainMOPdata = sap.ui.getCore().getModel("ainMOP").getData();
		// 	var atempainMOP = $.map(ainMOPdata, function (obj) {
		// 		return $.extend(true, {}, obj);
		// 	});
		// 	sap.ui.getCore().setModel(new JSONModel(atempainMOP), "ainMOPBackup");

		// 	var sAIWData = g.getView().getModel("BOMDetailModel").getData();
		// 	var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
		// 	var sPayload = {
		// 		"ChangeRequestType": oCrType.crtype,
		// 		"CrDescription": oCrType.desc,
		// 		"MbomBuffer": true,
		// 		"ShmmInstance": asmbly_uid,
		// 		"IsDraft": "C",
		// 		"Messages": [],
		// 		// "Reason": this.getView().byId("reasonForRequest").getSelectedKey(),
		// 		// "Guids": this.oAttach,
		// 		"FuncLoc": [],
		// 		"FLAddr": [],
		// 		"FLLAM": [],
		// 		"FLClass": [],
		// 		"FLVal": [],
		// 		"Equipment": [],
		// 		"EqAddr": [],
		// 		"EqPRT": [],
		// 		"EqLAM": [],
		// 		"EqClass": [],
		// 		"EqVal": [],
		// 		"MSPoint": [],
		// 		"MSLAM": [],
		// 		"MSClass": [],
		// 		"MSVal": [],
		// 		"MPLAN": [],
		// 		"MPItem": [],
		// 		"MPLAM": [],
		// 		"MPOBList": [],
		// 		"MPCycle": [],
		// 		"MRBHeader": [],
		// 		"MRBItem": [],
		// 		"MRBSBIT": [],
		// 		"EBHeader": [],
		// 		"EBItem": [],
		// 		"EBSBIT": [],
		// 		"FBHeader": [],
		// 		"FBItem": [],
		// 		"FBSBIT": [],
		// 		"WBHeader": [],
		// 		"WBItem": [],
		// 		"WBSBIT": [],
		// 		"ONetwork": [],
		// 		"ONLAM": [],
		// 		"Workcenter": [],
		// 		"WCCost": [],
		// 		"GTList": [],
		// 		"GTOprs": [],
		// 		"GTComp": [],
		// 		"GTClass": [],
		// 		"GTVal": [],
		// 		"ETList": [],
		// 		"ETOprs": [],
		// 		"ETComp": [],
		// 		"ETClass": [],
		// 		"ETVal": [],
		// 		"FTList": [],
		// 		"FTOprs": [],
		// 		"FTComp": [],
		// 		"FTClass": [],
		// 		"FTVal": [],
		// 		"Olink": [],
		// 		"OLClass": [],
		// 		"OLVal": []
		// 	};

		// 	if (AIWFLOCModel.length > 0) {
		// 		for (var a = 0; a < AIWFLOCModel.length; a++) {
		// 			var sFuncLoc = {
		// 				"Tplnr": AIWFLOCModel[a].Functionallocation,
		// 				"Txtmi": AIWFLOCModel[a].Flocdescription, // Floc Description
		// 				"TplkzFlc": AIWFLOCModel[a].Strucindicator,
		// 				"Tplxt": AIWFLOCModel[a].StrucIndicatorDesc,
		// 				"EditMask": AIWFLOCModel[a].EditMask,
		// 				"Hierarchy": AIWFLOCModel[a].Hierarchy,
		// 				"Fltyp": AIWFLOCModel[a].Floccategory,
		// 				"Flttx": AIWFLOCModel[a].FlocCategoryDesc,
		// 				"Swerk": AIWFLOCModel[a].Maintplant,
		// 				"Plantname": AIWFLOCModel[a].MaintplantDesc,
		// 				"StorFloc": AIWFLOCModel[a].Location, // Location
		// 				"Locationdesc": AIWFLOCModel[a].Locationdesc, // Location Description
		// 				"Abckzfloc": AIWFLOCModel[a].Abckz,
		// 				"Abctx": AIWFLOCModel[a].Abctx,
		// 				"Bukrsfloc": AIWFLOCModel[a].Bukrs,
		// 				"Butxt": AIWFLOCModel[a].Butxt,
		// 				"City": AIWFLOCModel[a].City,
		// 				"KostFloc": AIWFLOCModel[a].Kostl, // Cost Center
		// 				"KokrFloc": AIWFLOCModel[a].Kokrs, // ccPart1
		// 				"Contareaname": AIWFLOCModel[a].Mctxt, // Name
		// 				"PlntFloc": AIWFLOCModel[a].Werks, // Planning Plant
		// 				"Planningplantdes": AIWFLOCModel[a].Planningplantdes, // Planning Plant Description
		// 				"Ingrp": AIWFLOCModel[a].Ingrp, // Planner Group
		// 				"Plannergrpdesc": AIWFLOCModel[a].Innam, // Planner Group Description
		// 				"Arbplfloc": AIWFLOCModel[a].Arbpl, // Work Center
		// 				// "Workcenterdesc" : AIWFLOCModel[a].Ktext, // Plant Work Center
		// 				"Wergwfloc": AIWFLOCModel[a].WcWerks, // Name
		// 				"Gewrkfloc": AIWFLOCModel[a].MainArbpl, // Main Work Center
		// 				// "MainWcDesc" : AIWFLOCModel[a].MainKtext, // Work center Plant
		// 				"MainWcPlant": AIWFLOCModel[a].MainWerks, // Work Center Description
		// 				"Tplma": AIWFLOCModel[a].SupFunctionallocation, // Sup FuncLoc
		// 				"Supflocdesc": AIWFLOCModel[a].SupFlocdescription, // Sup FlocDescription
		// 				"BeberFl": AIWFLOCModel[a].BeberFl, // Plant Section
		// 				"Fing": AIWFLOCModel[a].Fing, // Person responsible
		// 				"Tele": AIWFLOCModel[a].Tele, // Phone
		// 				"Submtiflo": AIWFLOCModel[a].ConstrType, // Construction Type
		// 				"Constdesc": AIWFLOCModel[a].ConstructionDesc, // Construction Description
		// 				"Eqart": AIWFLOCModel[a].TechnicalObjectTyp, // TechnicalObjectTyp
		// 				"Eartx": AIWFLOCModel[a].Description, // TechnicalObjectTyp Description
		// 				"Stattext": AIWFLOCModel[a].Stattext, // System Status
		// 				"StsmFloc": AIWFLOCModel[a].StsmEqui, // Status Profile
		// 				"Statproftxt": AIWFLOCModel[a].StsmEquiDesc, // Status Profile Description
		// 				"UstwFloc": AIWFLOCModel[a].UstwEqui, // Status with Status Number
		// 				"UswoFloc": AIWFLOCModel[a].UswoEqui, // Status without Status Number
		// 				"UstaFloc": AIWFLOCModel[a].UstaEqui, // User Status
		// 				"Adrnri": AIWFLOCModel[a].Adrnri,
		// 				"Deact": AIWFLOCModel[a].Deact
		// 			};
		// 			sPayload.FuncLoc.push(sFuncLoc);

		// 			var sFLAddr = {
		// 				"Funcloc": AIWFLOCModel[a].Functionallocation,
		// 				"Title": AIWFLOCModel[a].TitleCode,
		// 				"Name1": AIWFLOCModel[a].Name1,
		// 				"Name2": AIWFLOCModel[a].Name2,
		// 				"Name3": AIWFLOCModel[a].Name3,
		// 				"Name4": AIWFLOCModel[a].Name4,
		// 				"Sort1": AIWFLOCModel[a].Sort1,
		// 				"Sort2": AIWFLOCModel[a].Sort2,
		// 				"NameCo": AIWFLOCModel[a].NameCo,
		// 				"PostCod1": AIWFLOCModel[a].PostCod1,
		// 				"City1": AIWFLOCModel[a].City1,
		// 				"Building": AIWFLOCModel[a].Building,
		// 				"Floor": AIWFLOCModel[a].Floor,
		// 				"Roomnum": AIWFLOCModel[a].Roomnum,
		// 				"Strsuppl1": AIWFLOCModel[a].Strsuppl1,
		// 				"Strsuppl2": AIWFLOCModel[a].Strsuppl2,
		// 				"Strsuppl3": AIWFLOCModel[a].Strsuppl3,
		// 				"Location": AIWFLOCModel[a].AddrLocation,
		// 				"RPostafl": AIWFLOCModel[a].RefPosta,
		// 				"Landx": AIWFLOCModel[a].Landx,
		// 				"TimeZone": AIWFLOCModel[a].TimeZone,
		// 				"RPostFl": AIWFLOCModel[a].Region,
		// 				"Regiotxt": AIWFLOCModel[a].RegionDesc
		// 			};
		// 			sPayload.FLAddr.push(sFLAddr);

		// 			var aIntlAddr = AIWFLOCModel[a].intlAddr;
		// 			if (aIntlAddr.length > 0) {
		// 				for (var z = 0; z < aIntlAddr.length; z++) {
		// 					sPayload.FLAddrI.push(aIntlAddr[z]);
		// 				}
		// 			}

		// 			if (g.AltLblDerv === "2" && AIWFLOCModel[a].altlbl.length > 0) {
		// 				for (var y = 0; y < AIWFLOCModel[a].altlbl.length; y++) {
		// 					var oAltLbl = {
		// 						"Funcloc": AIWFLOCModel[a].Functionallocation,
		// 						"AltAlkey": AIWFLOCModel[a].altlbl[y].AltAlkey,
		// 						"AltStrno": AIWFLOCModel[a].altlbl[y].AltStrno,
		// 						"AltTplkz": AIWFLOCModel[a].altlbl[y].AltTplkz
		// 					};
		// 					sPayload.FLALTLBEL.push(oAltLbl);
		// 				}
		// 			}

		// 			if (AIWFLOCModel[a].Floccategory === "L") {
		// 				var sFLLAM = {
		// 					"Funcloc": AIWFLOCModel[a].Functionallocation,
		// 					"Lrpid": AIWFLOCModel[a].lam.Lrpid,
		// 					"Strtptatr": AIWFLOCModel[a].lam.Strtptatr,
		// 					"Endptatr": AIWFLOCModel[a].lam.Endptatr,
		// 					"Length": (AIWFLOCModel[a].lam.Length).toString(),
		// 					"LinUnit": AIWFLOCModel[a].lam.LinUnit,
		// 					"Startmrkr": AIWFLOCModel[a].lam.Startmrkr,
		// 					"Endmrkr": AIWFLOCModel[a].lam.Endmrkr,
		// 					"Mrkdisst": AIWFLOCModel[a].lam.Mrkdisst,
		// 					"Mrkdisend": AIWFLOCModel[a].lam.Mrkdisend,
		// 					"MrkrUnit": AIWFLOCModel[a].lam.MrkrUnit
		// 				};
		// 				sPayload.FLLAM.push(sFLLAM);
		// 			}

		// 			var sFLClassList = AIWFLOCModel[a].classItems;
		// 			if (sFLClassList) {
		// 				if (sFLClassList.length > 0) {
		// 					for (var b = 0; b < sFLClassList.length; b++) {
		// 						var sFLClass = {
		// 							"Funcloc": AIWFLOCModel[a].Functionallocation,
		// 							"Classtype": sFLClassList[b].Classtype,
		// 							"Class": sFLClassList[b].Class,
		// 							"Clstatus1": sFLClassList[b].Clstatus1
		// 						};
		// 						sPayload.FLClass.push(sFLClass);
		// 					}
		// 				}
		// 			}

		// 			var sFLCharList = AIWFLOCModel[a].characteristics;
		// 			if (sFLCharList) {
		// 				if (sFLCharList.length > 0) {
		// 					for (var c = 0; c < sFLCharList.length; c++) {
		// 						var sFLVal = {
		// 							"Funcloc": AIWFLOCModel[a].Functionallocation,
		// 							"Atnam": sFLCharList[c].Atnam,
		// 							"Textbez": sFLCharList[c].Textbez,
		// 							"Atwrt": sFLCharList[c].Atwrt,
		// 							"Class": sFLCharList[c].Class
		// 						};
		// 						sPayload.FLVal.push(sFLVal);
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}

		// 	if (AIWEQUIModel.length > 0) {
		// 		for (var d = 0; d < AIWEQUIModel.length; d++) {
		// 			var sEquipment = {
		// 				"Herst": AIWEQUIModel[d].Herst, // Manufacturer
		// 				"Equnr": AIWEQUIModel[d].Equnr,
		// 				"Txtmi": AIWEQUIModel[d].Eqktx,
		// 				//"Eqktx" : AIWEQUIModel[d].Eqktx,
		// 				"Swerk": AIWEQUIModel[d].Maintplant,
		// 				"Name1": AIWEQUIModel[d].MaintplantDesc,
		// 				"TplnEilo": AIWEQUIModel[d].Tplnr,
		// 				"Flocdescription": AIWEQUIModel[d].Pltxt,
		// 				"Eqtyp": AIWEQUIModel[d].EquipmentCatogory,
		// 				"Etytx": AIWEQUIModel[d].EquipCatgDescription,
		// 				"Eqart": AIWEQUIModel[d].TechnicalObjectTyp, // TechnicalObjectTyp
		// 				"Eartx": AIWEQUIModel[d].Description, // TechnicalObjectTyp Description
		// 				"Typbz": AIWEQUIModel[d].Typbz, // Model Number
		// 				"SubmEeqz": AIWEQUIModel[d].ConstrType, // Construction Type
		// 				"Constdesc": AIWEQUIModel[d].ConstructionDesc, // Construction Description
		// 				"BukrEilo": AIWEQUIModel[d].Bukrs,
		// 				"Butxt": AIWEQUIModel[d].Butxt,
		// 				"HequEeqz": AIWEQUIModel[d].SuperordinateEquip, // Superord. Equipment
		// 				"SuperordEqDes": AIWEQUIModel[d].SuperordinateEquipDesc, // Superord. Equipment Description
		// 				"TidnEeqz": AIWEQUIModel[d].TechIdNum, // techIndNo
		// 				"KostEilo": AIWEQUIModel[d].Kostl, // Cost Center
		// 				"KokrEilo": AIWEQUIModel[d].Kokrs, // ccPart1
		// 				"Contareaname": AIWEQUIModel[d].Mctxt, // Name
		// 				"StorEilo": AIWEQUIModel[d].Location,
		// 				"Locationdesc": AIWEQUIModel[d].Locationdesc,
		// 				"AbckEilo": AIWEQUIModel[d].Abckz,
		// 				"Abctx": AIWEQUIModel[d].Abctx,
		// 				"PplaEeqz": AIWEQUIModel[d].Werks, // Planning Plant
		// 				"Planningplantdes": AIWEQUIModel[d].Planningplantdes, // Planning Plant Description
		// 				"IngrEeqz": AIWEQUIModel[d].Ingrp, // Planner Group
		// 				"Plannergrpdesc": AIWEQUIModel[d].Innam, // Planner Group Description
		// 				"Serge": AIWEQUIModel[d].Serge, // manfSerNo
		// 				"MapaEeqz": AIWEQUIModel[d].MapaEeqz, // partNum
		// 				"Stattext": AIWEQUIModel[d].Stattext, // System Status
		// 				"StsmEqui": AIWEQUIModel[d].StsmEqui, // Status Profile
		// 				"Statproftxt": AIWEQUIModel[d].StsmEquiDesc, // Status Profile Description
		// 				"UstwEqui": AIWEQUIModel[d].UstwEqui, // Status with Status Number
		// 				"UswoEqui": AIWEQUIModel[d].UswoEqui, // Status without Status Number
		// 				"UstaEqui": AIWEQUIModel[d].UstaEqui, // User Status
		// 				"Deact": AIWEQUIModel[d].Deact,
		// 				"Answt": AIWEQUIModel[d].Answt,
		// 				"Ansdt": g._formatDate(AIWEQUIModel[d].Ansdt),
		// 				"Waers": AIWEQUIModel[d].Waers, // Currency

		// 				"ArbpEilo": AIWEQUIModel[d].Arbpl, // Work Center
		// 				// "Workcenterdesc" : AIWEQUIModel[d].Ktext, // Plant Work Center
		// 				"WorkCenterPlant": AIWEQUIModel[d].WcWerks, // Name
		// 				"ArbpEeqz": AIWEQUIModel[d].MainArbpl, // Main Work Center
		// 				// "MainWcDesc" : AIWEQUIModel[d].MainKtext, // Work Center Description
		// 				"MainWcPlant": AIWEQUIModel[d].MainWerks, // Work center Plant

		// 				"BebeEilo": AIWEQUIModel[d].BeberFl, // Plant Section
		// 				"Fing": AIWEQUIModel[d].Fing, // Plant Section
		// 				"Tele": AIWEQUIModel[d].Tele, // Plant Section
		// 				"HeqnEeqz": AIWEQUIModel[d].EquipPosition, // Position
		// 				"Adrnri": AIWEQUIModel[d].Adrnri,

		// 				"Funcid": AIWEQUIModel[d].Funcid, // Config Control data
		// 				"Frcfit": AIWEQUIModel[d].Frcfit,
		// 				"Frcrmv": AIWEQUIModel[d].Frcrmv
		// 			};
		// 			sPayload.Equipment.push(sEquipment);

		// 			var sEqPRT = {
		// 				"Equi": AIWEQUIModel[d].Equnr,
		// 				"PlanvPrt": AIWEQUIModel[d].PlanvPrt,
		// 				"SteufPrt": AIWEQUIModel[d].SteufPrt,
		// 				"KtschPrt": AIWEQUIModel[d].KtschPrt,
		// 				"Ewformprt": AIWEQUIModel[d].Ewformprt,
		// 				"SteufRef": AIWEQUIModel[d].SteufRef,
		// 				"KtschRef": AIWEQUIModel[d].KtschRef,
		// 				"EwformRef": AIWEQUIModel[d].EwformRef
		// 			};
		// 			sPayload.EqPRT.push(sEqPRT);

		// 			if (AIWEQUIModel[d].EquipmentCatogory === "L") {
		// 				var sEqLAM = {
		// 					"Equi": AIWEQUIModel[d].Equnr,
		// 					"Lrpid": AIWEQUIModel[d].lam.Lrpid,
		// 					"Strtptatr": AIWEQUIModel[d].lam.Strtptatr,
		// 					"Endptatr": AIWEQUIModel[d].lam.Endptatr,
		// 					"Length": (AIWEQUIModel[d].lam.Length).toString(),
		// 					"LinUnit": AIWEQUIModel[d].lam.LinUnit,
		// 					"Startmrkr": AIWEQUIModel[d].lam.Startmrkr,
		// 					"Endmrkr": AIWEQUIModel[d].lam.Endmrkr,
		// 					"Mrkdisst": AIWEQUIModel[d].lam.Mrkdisst,
		// 					"Mrkdisend": AIWEQUIModel[d].lam.Mrkdisend,
		// 					"MrkrUnit": AIWEQUIModel[d].lam.MrkrUnit
		// 				};
		// 				sPayload.EqLAM.push(sEqLAM);
		// 			}

		// 			var sEqAddr = {
		// 				"Equi": AIWEQUIModel[d].Equnr,
		// 				"Title": AIWEQUIModel[d].TitleCode,
		// 				"Name1": AIWEQUIModel[d].Name1,
		// 				"Name2": AIWEQUIModel[d].Name2,
		// 				"Name3": AIWEQUIModel[d].Name3,
		// 				"Name4": AIWEQUIModel[d].Name4,
		// 				"Sort1": AIWEQUIModel[d].Sort1,
		// 				"Sort2": AIWEQUIModel[d].Sort2,
		// 				"NameCo": AIWEQUIModel[d].NameCo,
		// 				"PostCod1": AIWEQUIModel[d].PostCod1,
		// 				"City1": AIWEQUIModel[d].City1,
		// 				"Building": AIWEQUIModel[d].Building,
		// 				"Floor": AIWEQUIModel[d].Floor,
		// 				"Roomnum": AIWEQUIModel[d].Roomnum,
		// 				"Strsuppl1": AIWEQUIModel[d].Strsuppl1,
		// 				"Strsuppl2": AIWEQUIModel[d].Strsuppl2,
		// 				"Strsuppl3": AIWEQUIModel[d].Strsuppl3,
		// 				"Location": AIWEQUIModel[d].AddrLocation,
		// 				"RefPosta": AIWEQUIModel[d].RefPosta,
		// 				"Landx": AIWEQUIModel[d].Landx,
		// 				"TimeZone": AIWEQUIModel[d].TimeZone,
		// 				"RfePost": AIWEQUIModel[d].Region,
		// 				"Regiotxt": AIWEQUIModel[d].RegionDesc
		// 			};
		// 			sPayload.EqAddr.push(sEqAddr);

		// 			var aIntlAddrItems = AIWEQUIModel[d].intlAddr;
		// 			if (aIntlAddrItems.length > 0) {
		// 				for (var z = 0; z < aIntlAddrItems.length; z++) {
		// 					sPayload.EqAddrI.push(aIntlAddrItems[z]);
		// 				}
		// 			}

		// 			var sEqClassList = AIWEQUIModel[d].classItems;
		// 			if (sEqClassList) {
		// 				if (sEqClassList.length > 0) {
		// 					for (var e = 0; e < sEqClassList.length; e++) {
		// 						var sEqClass = {
		// 							"Equi": AIWEQUIModel[d].Equnr,
		// 							"Classtype": sEqClassList[e].Classtype,
		// 							"Class": sEqClassList[e].Class,
		// 							"Clstatus1": sEqClassList[e].Clstatus1
		// 						};
		// 						sPayload.EqClass.push(sEqClass);
		// 					}
		// 				}
		// 			}

		// 			var sEqCharList = AIWEQUIModel[d].characteristics;
		// 			if (sEqCharList) {
		// 				if (sEqCharList.length > 0) {
		// 					for (var f = 0; f < sEqCharList.length; f++) {
		// 						var sEqVal = {
		// 							"Equi": AIWEQUIModel[d].Equnr,
		// 							"Atnam": sEqCharList[f].Atnam,
		// 							"Textbez": sEqCharList[f].Textbez,
		// 							"Atwrt": sEqCharList[f].Atwrt,
		// 							"Class": sEqCharList[f].Class
		// 						};
		// 						sPayload.EqVal.push(sEqVal);
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}

		// 	// if (AIWListMatData.length > 0) {
		// 	// 	for (var i = 0; i < AIWListMatData.length; i++) {
		// 	// 		var mHeader = {
		// 	// 			"Matnr": AIWListMatData[i].Matnr,
		// 	// 			"Stalt": AIWListMatData[i].Stalt,
		// 	// 			"Stlan": AIWListMatData[i].Stlan,
		// 	// 			"Werks": AIWListMatData[i].Werks,
		// 	// 			"Bomstatus": AIWListMatData[i].Bomstatus,
		// 	// 			"Lngtxt": AIWListMatData[i].Lngtxt,
		// 	// 			"Txtmi": AIWListMatData[i].Lngtxt,
		// 	// 			"Validfrom": this._formatDate(AIWListMatData[i].Validfrom),
		// 	// 			"Baseqty": AIWListMatData[i].BaseQty,
		// 	// 			"Baseuom": AIWListMatData[i].BaseUom,
		// 	// 			"Validtoda": this._formatDate(AIWListMatData[i].Validtoda)
		// 	// 		};
		// 	// 		sPayload.MRBHeader.push(mHeader);

		// 	// 		if (AIWListMatData[i].matItem) {
		// 	// 			for (var j = 0; j < AIWListMatData[i].matItem.length; j++) {
		// 	// 				var mItem = {
		// 	// 					"Matnr": AIWListMatData[i].Matnr,
		// 	// 					"Stlan": AIWListMatData[i].Stlan,
		// 	// 					"Werks": AIWListMatData[i].Werks,
		// 	// 					"Bomitmpos": AIWListMatData[i].matItem[j].Bomitmpos,
		// 	// 					"Itemcat": AIWListMatData[i].matItem[j].Itemcat,
		// 	// 					"Itemcomp": AIWListMatData[i].matItem[j].Itemcomp,
		// 	// 					"Compdesc": "",
		// 	// 					"Itmqty": AIWListMatData[i].matItem[j].Itmqty,
		// 	// 					"Itmuom": AIWListMatData[i].matItem[j].Itmuom,
		// 	// 					"Recurallo": AIWListMatData[i].matItem[j].Recurallo,
		// 	// 					"Erskz": AIWListMatData[i].matItem[j].Erskz,
		// 	// 					"Rvrel": AIWListMatData[i].matItem[j].Rvrel === "0" ? "" : AIWListMatData[i].matItem[j].Rvrel,
		// 	// 					"Sanfe": AIWListMatData[i].matItem[j].Sanfe,
		// 	// 					"Sanin": AIWListMatData[i].matItem[j].Sanin,
		// 	// 					"Sanko": AIWListMatData[i].matItem[j].Sanko,
		// 	// 					"Itmcmpdesc": AIWListMatData[i].matItem[j].Itmcmpdesc,
		// 	// 					"Costgrelv": AIWListMatData[i].matItem[j].Costgrelv === "0" ? "" : AIWListMatData[i].matItem[j].Costgrelv,
		// 	// 				};
		// 	// 				if (AIWListMatData[i].bomType === "Change") {
		// 	// 					mItem.Bomitmnod = AIWListMatData[i].matItem[j].Bomitmnod;
		// 	// 				}
		// 	// 				if (AIWListMatData[i].matItem[j].Itemcat === "N") {
		// 	// 					mItem.Ekorg = AIWListMatData[i].matItem[j].Ekorg;
		// 	// 					mItem.Ekotx = AIWListMatData[i].matItem[j].Ekotx;
		// 	// 					mItem.Ekgrp = AIWListMatData[i].matItem[j].Ekgrp;
		// 	// 					mItem.Eknam = AIWListMatData[i].matItem[j].Eknam;
		// 	// 					mItem.Preis = AIWListMatData[i].matItem[j].Preis;
		// 	// 					mItem.Waers = AIWListMatData[i].matItem[j].Waers;
		// 	// 					mItem.Peinh = AIWListMatData[i].matItem[j].Peinh;
		// 	// 					mItem.Matkl = AIWListMatData[i].matItem[j].Matkl;
		// 	// 					mItem.Wgbez = AIWListMatData[i].matItem[j].Wgbez;
		// 	// 					mItem.Potx1 = AIWListMatData[i].matItem[j].Potx1;
		// 	// 				} else if (AIWListMatData[i].matItem[j].Itemcat === "D") {
		// 	// 					mItem.Bomdocitm = AIWListMatData[i].matItem[j].Bomdocitm;
		// 	// 					mItem.Bomitmdkr = AIWListMatData[i].matItem[j].Bomitmdkr;
		// 	// 					mItem.BomitmdkrTxt = AIWListMatData[i].matItem[j].BomitmdkrTxt;
		// 	// 					mItem.Bomitmdtl = AIWListMatData[i].matItem[j].Bomitmdtl;
		// 	// 					mItem.Bomitmdvr = AIWListMatData[i].matItem[j].Bomitmdvr;
		// 	// 				} else if (AIWListMatData[i].matItem[j].Itemcat === "R") {
		// 	// 					mItem.Roms1 = AIWListMatData[i].matItem[j].Roms1;
		// 	// 					mItem.Romei = AIWListMatData[i].matItem[j].Romei;
		// 	// 					mItem.Roms2 = AIWListMatData[i].matItem[j].Roms2;
		// 	// 					mItem.Roms3 = AIWListMatData[i].matItem[j].Roms3;
		// 	// 					mItem.Rform = AIWListMatData[i].matItem[j].Rform;
		// 	// 					// mItem.FrmlaKeyDesc = AIWListMatData[i].matItem[j].Itemcat;
		// 	// 					mItem.Roanz = AIWListMatData[i].matItem[j].Roanz;
		// 	// 					// mItem.numVarSizeDesc = AIWListMatData[i].matItem[j].Itemcat;
		// 	// 					mItem.Romen = AIWListMatData[i].matItem[j].Romen;
		// 	// 					mItem.Rokme = AIWListMatData[i].matItem[j].Rokme;
		// 	// 				} else if (AIWListMatData[i].matItem[j].Itemcat === "T") {
		// 	// 					mItem.Potx1 = AIWListMatData[i].matItem[j].Potx1;
		// 	// 				}
		// 	// 				sPayload.MRBItem.push(mItem);
		// 	// 			}
		// 	// 		}

		// 	// 		if (AIWListMatData[i].matSubItem) {
		// 	// 			for (var k = 0; k < AIWListMatData[i].matSubItem.length; k++) {
		// 	// 				var mSubItem = {
		// 	// 					"Matnr": AIWListMatData[i].Matnr,
		// 	// 					"Stlan": AIWListMatData[i].Stlan,
		// 	// 					"Werks": AIWListMatData[i].Werks,
		// 	// 					"Posnr": AIWListMatData[i].matSubItem[k].Posnr,
		// 	// 					"Bomitmnod": AIWListMatData[i].matSubItem[k].Bomitmnod,
		// 	// 					"Bomsubno": AIWListMatData[i].matSubItem[k].Bomsubno,
		// 	// 					"Ebort": AIWListMatData[i].matSubItem[k].Ebort,
		// 	// 					"Upmng": AIWListMatData[i].matSubItem[k].Upmng,
		// 	// 					"Uptxt": AIWListMatData[i].matSubItem[k].Uptxt
		// 	// 				};
		// 	// 				sPayload.MRBSBIT.push(mSubItem);
		// 	// 			}
		// 	// 		}
		// 	// 	}
		// 	// }

		// 	// if (AIWListEqData.length > 0) {
		// 	// 	for (var i = 0; i < AIWListEqData.length; i++) {
		// 	// 		var eHeader = {
		// 	// 			"Eqnrbom": AIWListEqData[i].Eqnrbom,
		// 	// 			//"Stalt": "",
		// 	// 			"Stlan": AIWListEqData[i].Stlan,
		// 	// 			"Werks": AIWListEqData[i].Werks,
		// 	// 			"Bomstatus": AIWListEqData[i].Bomstatus,
		// 	// 			"Lngtxt": AIWListEqData[i].Lngtxt,
		// 	// 			"Txtmi": AIWListEqData[i].Lngtxt,
		// 	// 			"Validfrom": this._formatDate(AIWListEqData[i].Validfrom),
		// 	// 			"Baseqty": AIWListEqData[i].BaseQty,
		// 	// 			"Baseuom": AIWListEqData[i].BaseUom,
		// 	// 			"Validtoda": this._formatDate(AIWListEqData[i].Validtoda)
		// 	// 		};
		// 	// 		sPayload.EBHeader.push(eHeader);

		// 	// 		if (AIWListEqData[i].eqItem) {
		// 	// 			for (var j = 0; j < AIWListEqData[i].eqItem.length; j++) {
		// 	// 				var eItem = {
		// 	// 					"Eqnrbom": AIWListEqData[i].Eqnrbom,
		// 	// 					"Stlan": AIWListEqData[i].Stlan,
		// 	// 					"Werks": AIWListEqData[i].Werks,
		// 	// 					"Bomitmpos": AIWListEqData[i].eqItem[j].Bomitmpos,
		// 	// 					"Itemcat": AIWListEqData[i].eqItem[j].Itemcat,
		// 	// 					"Itemcomp": AIWListEqData[i].eqItem[j].Itemcomp,
		// 	// 					"Compdesc": "",
		// 	// 					"Itmqty": AIWListEqData[i].eqItem[j].Itmqty,
		// 	// 					"Itmuom": AIWListEqData[i].eqItem[j].Itmuom,
		// 	// 					"Recurallo": AIWListEqData[i].eqItem[j].Recurallo,
		// 	// 					"Erskz": AIWListEqData[i].eqItem[j].Erskz,
		// 	// 					"Rvrel": AIWListEqData[i].eqItem[j].Rvrel === "0" ? "" : AIWListEqData[i].eqItem[j].Rvrel,
		// 	// 					"Sanfe": AIWListEqData[i].eqItem[j].Sanfe,
		// 	// 					"Sanin": AIWListEqData[i].eqItem[j].Sanin,
		// 	// 					"Sanko": AIWListEqData[i].eqItem[j].Sanko,
		// 	// 					"Itmcmpdesc": AIWListEqData[i].eqItem[j].Itmcmpdesc,
		// 	// 					"Costgrelv": AIWListEqData[i].eqItem[j].Costgrelv === "0" ? "" : AIWListEqData[i].eqItem[j].Costgrelv
		// 	// 				};
		// 	// 				if (AIWListEqData[i].bomType === "Change") {
		// 	// 					eItem.Bomitmnod = AIWListEqData[i].eqItem[j].Bomitmnod;
		// 	// 				}
		// 	// 				if (AIWListEqData[i].eqItem[j].Itemcat === "N") {
		// 	// 					eItem.Ekorg = AIWListEqData[i].eqItem[j].Ekorg;
		// 	// 					eItem.Ekotx = AIWListEqData[i].eqItem[j].Ekotx;
		// 	// 					eItem.Ekgrp = AIWListEqData[i].eqItem[j].Ekgrp;
		// 	// 					eItem.Eknam = AIWListEqData[i].eqItem[j].Eknam;
		// 	// 					eItem.Preis = AIWListEqData[i].eqItem[j].Preis;
		// 	// 					eItem.Waers = AIWListEqData[i].eqItem[j].Waers;
		// 	// 					eItem.Peinh = AIWListEqData[i].eqItem[j].Peinh;
		// 	// 					eItem.Matkl = AIWListEqData[i].eqItem[j].Matkl;
		// 	// 					eItem.Wgbez = AIWListEqData[i].eqItem[j].Wgbez;
		// 	// 					eItem.Potx1 = AIWListEqData[i].eqItem[j].Potx1;
		// 	// 				} else if (AIWListEqData[i].eqItem[j].Itemcat === "D") {
		// 	// 					eItem.Bomdocitm = AIWListEqData[i].eqItem[j].Bomdocitm;
		// 	// 					eItem.Bomitmdkr = AIWListEqData[i].eqItem[j].Bomitmdkr;
		// 	// 					eItem.BomitmdkrTxt = AIWListEqData[i].eqItem[j].BomitmdkrTxt;
		// 	// 					eItem.Bomitmdtl = AIWListEqData[i].eqItem[j].Bomitmdtl;
		// 	// 					eItem.Bomitmdvr = AIWListEqData[i].eqItem[j].Bomitmdvr;
		// 	// 				} else if (AIWListEqData[i].eqItem[j].Itemcat === "R") {
		// 	// 					eItem.Roms1 = AIWListEqData[i].eqItem[j].Roms1;
		// 	// 					eItem.Romei = AIWListEqData[i].eqItem[j].Romei;
		// 	// 					eItem.Roms2 = AIWListEqData[i].eqItem[j].Roms2;
		// 	// 					eItem.Roms3 = AIWListEqData[i].eqItem[j].Roms3;
		// 	// 					eItem.Rform = AIWListEqData[i].eqItem[j].Rform;
		// 	// 					// eItem.FrmlaKeyDesc = AIWListEqData[i].eqItem[j].Itemcat;
		// 	// 					eItem.Roanz = AIWListEqData[i].eqItem[j].Roanz;
		// 	// 					// eItem.numVarSizeDesc = AIWListEqData[i].eqItem[j].Itemcat;
		// 	// 					eItem.Romen = AIWListEqData[i].eqItem[j].Romen;
		// 	// 					eItem.Rokme = AIWListEqData[i].eqItem[j].Rokme;
		// 	// 				} else if (AIWListEqData[i].eqItem[j].Itemcat === "T") {
		// 	// 					eItem.Potx1 = AIWListEqData[i].eqItem[j].Potx1;
		// 	// 				}
		// 	// 				sPayload.EBItem.push(eItem);
		// 	// 			}
		// 	// 		}

		// 	// 		if (AIWListEqData[i].eqSubItem) {
		// 	// 			for (var k = 0; k < AIWListEqData[i].eqSubItem.length; k++) {
		// 	// 				var eSubItem = {
		// 	// 					"Eqnrbom": AIWListEqData[i].Eqnrbom,
		// 	// 					"Stlan": AIWListEqData[i].Stlan,
		// 	// 					"Werks": AIWListEqData[i].Werks,
		// 	// 					"Posnr": AIWListEqData[i].eqSubItem[k].Posnr,
		// 	// 					"Bomitmnod": AIWListEqData[i].eqSubItem[k].Bomitmnod,
		// 	// 					"Bomsubno": AIWListEqData[i].eqSubItem[k].Bomsubno,
		// 	// 					"Ebort": AIWListEqData[i].eqSubItem[k].Ebort,
		// 	// 					"Upmng": AIWListEqData[i].eqSubItem[k].Upmng,
		// 	// 					"Uptxt": AIWListEqData[i].eqSubItem[k].Uptxt
		// 	// 				};
		// 	// 				sPayload.EBSBIT.push(eSubItem);
		// 	// 			}
		// 	// 		}
		// 	// 	}
		// 	// }

		// 	// if (AIWListFLData.length > 0) {
		// 	// 	for (var i = 0; i < AIWListFLData.length; i++) {
		// 	// 		var flHeader = {
		// 	// 			"Tplnrbom": AIWListFLData[i].Tplnrbom,
		// 	// 			"Stlan": AIWListFLData[i].Stlan,
		// 	// 			"Werks": AIWListFLData[i].Werks,
		// 	// 			"Bomstatus": AIWListFLData[i].Bomstatus,
		// 	// 			"Lngtxt": AIWListFLData[i].Lngtxt,
		// 	// 			"Txtmi": AIWListFLData[i].Lngtxt,
		// 	// 			"Validfrom": this._formatDate(AIWListFLData[i].Validfrom),
		// 	// 			"Baseqty": AIWListFLData[i].BaseQty,
		// 	// 			"Baseuom": AIWListFLData[i].BaseUom,
		// 	// 			"Validtoda": this._formatDate(AIWListFLData[i].Validtoda)
		// 	// 				//"Stalt": ""
		// 	// 		};
		// 	// 		sPayload.FBHeader.push(flHeader);

		// 	// 		if (AIWListFLData[i].flItem) {
		// 	// 			for (var j = 0; j < AIWListFLData[i].flItem.length; j++) {
		// 	// 				var flItem = {
		// 	// 					"Tplnrbom": AIWListFLData[i].Tplnrbom,
		// 	// 					"Stlan": AIWListFLData[i].Stlan,
		// 	// 					"Werks": AIWListFLData[i].Werks,
		// 	// 					"Bomitmpos": AIWListFLData[i].flItem[j].Bomitmpos,
		// 	// 					"Itemcat": AIWListFLData[i].flItem[j].Itemcat,
		// 	// 					"Itemcomp": AIWListFLData[i].flItem[j].Itemcomp,
		// 	// 					"Compdesc": "",
		// 	// 					"Itmqty": AIWListFLData[i].flItem[j].Itmqty,
		// 	// 					"Itmuom": AIWListFLData[i].flItem[j].Itmuom,
		// 	// 					"Recurallo": AIWListFLData[i].flItem[j].Recurallo,
		// 	// 					"Erskz": AIWListFLData[i].flItem[j].Erskz,
		// 	// 					"Rvrel": AIWListFLData[i].flItem[j].Rvrel === "0" ? "" : AIWListFLData[i].flItem[j].Rvrel,
		// 	// 					"Sanfe": AIWListFLData[i].flItem[j].Sanfe,
		// 	// 					"Sanin": AIWListFLData[i].flItem[j].Sanin,
		// 	// 					"Sanko": AIWListFLData[i].flItem[j].Sanko,
		// 	// 					"Itmcmpdesc": AIWListFLData[i].flItem[j].Itmcmpdesc,
		// 	// 					"Costgrelv": AIWListFLData[i].flItem[j].Costgrelv === "0" ? "" : AIWListFLData[i].flItem[j].Costgrelv
		// 	// 				};
		// 	// 				if (AIWListFLData[i].bomType === "Change") { //13.08
		// 	// 					flItem.Bomitmnod = AIWListFLData[i].flItem[j].Bomitmnod;
		// 	// 				}
		// 	// 				if (AIWListFLData[i].flItem[j].Itemcat === "N") {
		// 	// 					flItem.Ekorg = AIWListFLData[i].flItem[j].Ekorg;
		// 	// 					flItem.Ekotx = AIWListFLData[i].flItem[j].Ekotx;
		// 	// 					flItem.Ekgrp = AIWListFLData[i].flItem[j].Ekgrp;
		// 	// 					flItem.Eknam = AIWListFLData[i].flItem[j].Eknam;
		// 	// 					flItem.Preis = AIWListFLData[i].flItem[j].Preis;
		// 	// 					flItem.Waers = AIWListFLData[i].flItem[j].Waers;
		// 	// 					flItem.Peinh = AIWListFLData[i].flItem[j].Peinh;
		// 	// 					flItem.Matkl = AIWListFLData[i].flItem[j].Matkl;
		// 	// 					flItem.Wgbez = AIWListFLData[i].flItem[j].Wgbez;
		// 	// 					flItem.Potx1 = AIWListFLData[i].flItem[j].Potx1;
		// 	// 				} else if (AIWListFLData[i].flItem[j].Itemcat === "D") {
		// 	// 					flItem.Bomdocitm = AIWListFLData[i].flItem[j].Bomdocitm;
		// 	// 					flItem.Bomitmdkr = AIWListFLData[i].flItem[j].Bomitmdkr;
		// 	// 					flItem.BomitmdkrTxt = AIWListFLData[i].flItem[j].BomitmdkrTxt;
		// 	// 					flItem.Bomitmdtl = AIWListFLData[i].flItem[j].Bomitmdtl;
		// 	// 					flItem.Bomitmdvr = AIWListFLData[i].flItem[j].Bomitmdvr;
		// 	// 				} else if (AIWListFLData[i].flItem[j].Itemcat === "R") {
		// 	// 					flItem.Roms1 = AIWListFLData[i].flItem[j].Roms1;
		// 	// 					flItem.Romei = AIWListFLData[i].flItem[j].Romei;
		// 	// 					flItem.Roms2 = AIWListFLData[i].flItem[j].Roms2;
		// 	// 					flItem.Roms3 = AIWListFLData[i].flItem[j].Roms3;
		// 	// 					flItem.Rform = AIWListFLData[i].flItem[j].Rform;
		// 	// 					// flItem.FrmlaKeyDesc = AIWListFLData[i].flItem[j].Itemcat;
		// 	// 					flItem.Roanz = AIWListFLData[i].flItem[j].Roanz;
		// 	// 					// flItem.numVarSizeDesc = AIWListFLData[i].flItem[j].Itemcat;
		// 	// 					flItem.Romen = AIWListFLData[i].flItem[j].Romen;
		// 	// 					flItem.Rokme = AIWListFLData[i].flItem[j].Rokme;
		// 	// 				} else if (AIWListFLData[i].flItem[j].Itemcat === "T") {
		// 	// 					flItem.Potx1 = AIWListFLData[i].flItem[j].Potx1;
		// 	// 				}
		// 	// 				sPayload.FBItem.push(flItem);
		// 	// 			}
		// 	// 		}

		// 	// 		if (AIWListFLData[i].flSubItem) {
		// 	// 			for (var k = 0; k < AIWListFLData[i].flSubItem.length; k++) {
		// 	// 				var flSubItem = {
		// 	// 					"Tplnrbom": AIWListFLData[i].Tplnrbom,
		// 	// 					"Stlan": AIWListFLData[i].Stlan,
		// 	// 					"Werks": AIWListFLData[i].Werks,
		// 	// 					"Posnr": AIWListFLData[i].flSubItem[k].Posnr,
		// 	// 					"Bomitmnod": AIWListFLData[i].flSubItem[k].Bomitmnod,
		// 	// 					"Bomsubno": AIWListFLData[i].flSubItem[k].Bomsubno,
		// 	// 					"Ebort": AIWListFLData[i].flSubItem[k].Ebort,
		// 	// 					"Upmng": AIWListFLData[i].flSubItem[k].Upmng,
		// 	// 					"Uptxt": AIWListFLData[i].flSubItem[k].Uptxt
		// 	// 				};
		// 	// 				sPayload.FBSBIT.push(flSubItem);
		// 	// 			}
		// 	// 		}
		// 	// 	}
		// 	// }

		// 	// if (AIWListWBSData.length > 0) {
		// 	// 	for (var i = 0; i < AIWListWBSData.length; i++) {
		// 	// 		var wbsHeader = {
		// 	// 			"WbsExt": AIWListWBSData[i].WbsExt,
		// 	// 			"MatnrWbs": AIWListWBSData[i].Matnr,
		// 	// 			"Stlan": AIWListWBSData[i].Stlan,
		// 	// 			"Werks": AIWListWBSData[i].Werks,
		// 	// 			"Bomstatus": AIWListWBSData[i].Bomstatus,
		// 	// 			"Lngtxt": AIWListWBSData[i].Lngtxt,
		// 	// 			"Txtmi": AIWListWBSData[i].Lngtxt,
		// 	// 			"Validfrom": this._formatDate(AIWListWBSData[i].Validfrom),
		// 	// 			"Baseqty": AIWListWBSData[i].BaseQty,
		// 	// 			"Baseuom": AIWListWBSData[i].BaseUom,
		// 	// 			"Validtoda": this._formatDate(AIWListWBSData[i].Validtoda)
		// 	// 				//"Stalt": ""
		// 	// 		};
		// 	// 		sPayload.WBHeader.push(wbsHeader);

		// 	// 		if (AIWListWBSData[i].wbsItem) {
		// 	// 			for (var j = 0; j < AIWListWBSData[i].wbsItem.length; j++) {
		// 	// 				var wbsItem = {
		// 	// 					"WbsExt": AIWListWBSData[i].WbsExt,
		// 	// 					"MatnrWbs": AIWListWBSData[i].Matnr,
		// 	// 					"Stlan": AIWListWBSData[i].Stlan,
		// 	// 					"Werks": AIWListWBSData[i].Werks,
		// 	// 					"Bomitmpos": AIWListWBSData[i].wbsItem[j].Bomitmpos,
		// 	// 					"Itemcat": AIWListWBSData[i].wbsItem[j].Itemcat,
		// 	// 					"Itemcomp": AIWListWBSData[i].wbsItem[j].Itemcomp,
		// 	// 					"Compdesc": "",
		// 	// 					"Itmqty": AIWListWBSData[i].wbsItem[j].Itmqty,
		// 	// 					"Itmuom": AIWListWBSData[i].wbsItem[j].Itmuom,
		// 	// 					"Recurallo": AIWListWBSData[i].wbsItem[j].Recurallo,
		// 	// 					"Erskz": AIWListWBSData[i].wbsItem[j].Erskz,
		// 	// 					"Rvrel": AIWListWBSData[i].wbsItem[j].Rvrel === "0" ? "" : AIWListWBSData[i].wbsItem[j].Rvrel,
		// 	// 					"Sanfe": AIWListWBSData[i].wbsItem[j].Sanfe,
		// 	// 					"Sanin": AIWListWBSData[i].wbsItem[j].Sanin,
		// 	// 					"Sanko": AIWListWBSData[i].wbsItem[j].Sanko,
		// 	// 					"Itmcmpdesc": AIWListWBSData[i].wbsItem[j].Itmcmpdesc,
		// 	// 					"Costgrelv": AIWListWBSData[i].wbsItem[j].Costgrelv === "0" ? "" : AIWListWBSData[i].wbsItem[j].Costgrelv
		// 	// 				};
		// 	// 				if (AIWListWBSData[i].bomType === "Change") { //13.08
		// 	// 					wbsItem.Bomitmnod = AIWListWBSData[i].wbsItem[j].Bomitmnod;
		// 	// 				}
		// 	// 				if (AIWListWBSData[i].wbsItem[j].Itemcat === "N") {
		// 	// 					wbsItem.Ekorg = AIWListWBSData[i].wbsItem[j].Ekorg;
		// 	// 					wbsItem.Ekotx = AIWListWBSData[i].wbsItem[j].Ekotx;
		// 	// 					wbsItem.Ekgrp = AIWListWBSData[i].wbsItem[j].Ekgrp;
		// 	// 					wbsItem.Eknam = AIWListWBSData[i].wbsItem[j].Eknam;
		// 	// 					wbsItem.Preis = AIWListWBSData[i].wbsItem[j].Preis;
		// 	// 					wbsItem.Waers = AIWListWBSData[i].wbsItem[j].Waers;
		// 	// 					wbsItem.Peinh = AIWListWBSData[i].wbsItem[j].Peinh;
		// 	// 					wbsItem.Matkl = AIWListWBSData[i].wbsItem[j].Matkl;
		// 	// 					wbsItem.Wgbez = AIWListWBSData[i].wbsItem[j].Wgbez;
		// 	// 					wbsItem.Potx1 = AIWListWBSData[i].wbsItem[j].Potx1;
		// 	// 				} else if (AIWListWBSData[i].wbsItem[j].Itemcat === "D") {
		// 	// 					wbsItem.Bomdocitm = AIWListWBSData[i].wbsItem[j].Bomdocitm;
		// 	// 					wbsItem.Bomitmdkr = AIWListWBSData[i].wbsItem[j].Bomitmdkr;
		// 	// 					wbsItem.BomitmdkrTxt = AIWListWBSData[i].wbsItem[j].BomitmdkrTxt;
		// 	// 					wbsItem.Bomitmdtl = AIWListWBSData[i].wbsItem[j].Bomitmdtl;
		// 	// 					wbsItem.Bomitmdvr = AIWListWBSData[i].wbsItem[j].Bomitmdvr;
		// 	// 				} else if (AIWListWBSData[i].wbsItem[j].Itemcat === "R") {
		// 	// 					wbsItem.Roms1 = AIWListWBSData[i].wbsItem[j].Roms1;
		// 	// 					wbsItem.Romei = AIWListWBSData[i].wbsItem[j].Romei;
		// 	// 					wbsItem.Roms2 = AIWListWBSData[i].wbsItem[j].Roms2;
		// 	// 					wbsItem.Roms3 = AIWListWBSData[i].wbsItem[j].Roms3;
		// 	// 					wbsItem.Rform = AIWListWBSData[i].wbsItem[j].Rform;
		// 	// 					// wbsItem.FrmlaKeyDesc = AIWListWBSData[i].wbsItem[j].Itemcat;
		// 	// 					wbsItem.Roanz = AIWListWBSData[i].wbsItem[j].Roanz;
		// 	// 					// wbsItem.numVarSizeDesc = AIWListWBSData[i].wbsItem[j].Itemcat;
		// 	// 					wbsItem.Romen = AIWListWBSData[i].wbsItem[j].Romen;
		// 	// 					wbsItem.Rokme = AIWListWBSData[i].wbsItem[j].Rokme;
		// 	// 				} else if (AIWListWBSData[i].wbsItem[j].Itemcat === "T") {
		// 	// 					wbsItem.Potx1 = AIWListWBSData[i].wbsItem[j].Potx1;
		// 	// 				}
		// 	// 				sPayload.WBItem.push(wbsItem);
		// 	// 			}
		// 	// 		}

		// 	// 		if (AIWListWBSData[i].wbsSubItem) {
		// 	// 			for (var k = 0; k < AIWListWBSData[i].wbsSubItem.length; k++) {
		// 	// 				var wbsSubItem = {
		// 	// 					"WbsExt": AIWListWBSData[i].WbsExt,
		// 	// 					"MatnrWbs": AIWListWBSData[i].Matnr,
		// 	// 					"Stlan": AIWListWBSData[i].Stlan,
		// 	// 					"Werks": AIWListWBSData[i].Werks,
		// 	// 					"Posnr": AIWListWBSData[i].wbsSubItem[k].Posnr,
		// 	// 					"Bomitmnod": AIWListWBSData[i].wbsSubItem[k].Bomitmnod,
		// 	// 					"Bomsubno": AIWListWBSData[i].wbsSubItem[k].Bomsubno,
		// 	// 					"Ebort": AIWListWBSData[i].wbsSubItem[k].Ebort,
		// 	// 					"Upmng": AIWListWBSData[i].wbsSubItem[k].Upmng,
		// 	// 					"Uptxt": AIWListWBSData[i].wbsSubItem[k].Uptxt
		// 	// 				};
		// 	// 				sPayload.WBSBIT.push(wbsSubItem);
		// 	// 			}
		// 	// 		}
		// 	// 	}
		// 	// }

		// 	// var mHeader = {
		// 	// 	"Matnr": sAIWData.Matnr,
		// 	// 	"Stalt": sAIWData.Stalt,
		// 	// 	"Stlan": sAIWData.Stlan,
		// 	// 	"Werks": sAIWData.Werks,
		// 	// 	"Bomstatus": sAIWData.Bomstatus,
		// 	// 	"Lngtxt": sAIWData.Lngtxt,
		// 	// 	"Txtmi": sAIWData.Lngtxt,
		// 	// 	"Validfrom": this._formatDate(sAIWData.Validfrom),
		// 	// 	"Baseqty": sAIWData.BaseQty,
		// 	// 	"Baseuom": sAIWData.BaseUom,
		// 	// 	"Validtoda": this._formatDate(sAIWData.Validtoda)
		// 	// };
		// 	// sPayload.MRBHeader.push(mHeader);

		// 	// for (var j = 0; j < sAIWData.matItem.length; j++) {
		// 	// 	var mItem = {
		// 	// 		"Matnr": sAIWData.Matnr,
		// 	// 		"Stlan": sAIWData.Stlan,
		// 	// 		"Werks": sAIWData.Werks,
		// 	// 		//"Bomitmnod": sAIWData.Bomitmnod, //13.08
		// 	// 		"Bomitmpos": sAIWData.matItem[j].Bomitmpos,
		// 	// 		"Itemcat": sAIWData.matItem[j].Itemcat,
		// 	// 		"Itemcomp": sAIWData.matItem[j].Itemcomp,
		// 	// 		"Compdesc": "",
		// 	// 		"Itmqty": sAIWData.matItem[j].Itmqty,
		// 	// 		"Itmuom": sAIWData.matItem[j].Itmuom,
		// 	// 		"Recurallo": sAIWData.matItem[j].Recurallo,
		// 	// 		"Erskz": sAIWData.matItem[j].Erskz,
		// 	// 		"Rvrel": sAIWData.matItem[j].Rvrel === "0" ? "" : sAIWData.matItem[j].Rvrel,
		// 	// 		"Sanfe": sAIWData.matItem[j].Sanfe,
		// 	// 		"Sanin": sAIWData.matItem[j].Sanin,
		// 	// 		"Sanko": sAIWData.matItem[j].Sanko,
		// 	// 		"Itmcmpdesc": sAIWData.matItem[j].Itmcmpdesc,
		// 	// 		"Costgrelv": sAIWData.matItem[j].Costgrelv === "0" ? "" : sAIWData.matItem[j].Costgrelv
		// 	// 	};
		// 	// 	if (sAIWData.bomType === "Change") {
		// 	// 		mItem.Bomitmnod = sAIWData.matItem[j].Bomitmnod;
		// 	// 	}
		// 	// 	if (sAIWData.matItem[j].Itemcat === "N") {
		// 	// 		mItem.Ekorg = sAIWData.matItem[j].Ekorg;
		// 	// 		mItem.Ekotx = sAIWData.matItem[j].Ekotx;
		// 	// 		mItem.Ekgrp = sAIWData.matItem[j].Ekgrp;
		// 	// 		mItem.Eknam = sAIWData.matItem[j].Eknam;
		// 	// 		mItem.Preis = sAIWData.matItem[j].Preis;
		// 	// 		mItem.Waers = sAIWData.matItem[j].Waers;
		// 	// 		mItem.Peinh = sAIWData.matItem[j].Peinh;
		// 	// 		mItem.Matkl = sAIWData.matItem[j].Matkl;
		// 	// 		mItem.Wgbez = sAIWData.matItem[j].Wgbez;
		// 	// 		mItem.Potx1 = sAIWData.matItem[j].Potx1;
		// 	// 	} else if (sAIWData.matItem[j].Itemcat === "D") {
		// 	// 		mItem.Bomdocitm = sAIWData.matItem[j].Bomdocitm;
		// 	// 		mItem.Bomitmdkr = sAIWData.matItem[j].Bomitmdkr;
		// 	// 		mItem.BomitmdkrTxt = sAIWData.matItem[j].BomitmdkrTxt;
		// 	// 		mItem.Bomitmdtl = sAIWData.matItem[j].Bomitmdtl;
		// 	// 		mItem.Bomitmdvr = sAIWData.matItem[j].Bomitmdvr;
		// 	// 	} else if (sAIWData.matItem[j].Itemcat === "R") {
		// 	// 		mItem.Roms1 = sAIWData.matItem[j].Roms1;
		// 	// 		mItem.Romei = sAIWData.matItem[j].Romei;
		// 	// 		mItem.Roms2 = sAIWData.matItem[j].Roms2;
		// 	// 		mItem.Roms3 = sAIWData.matItem[j].Roms3;
		// 	// 		mItem.Rform = sAIWData.matItem[j].Rform;
		// 	// 		// mItem.FrmlaKeyDesc = sAIWData.matItem[j].Itemcat;
		// 	// 		mItem.Roanz = sAIWData.matItem[j].Roanz;
		// 	// 		// mItem.numVarSizeDesc = sAIWData.matItem[j].Itemcat;
		// 	// 		mItem.Romen = sAIWData.matItem[j].Romen;
		// 	// 		mItem.Rokme = sAIWData.matItem[j].Rokme;
		// 	// 	} else if (sAIWData.matItem[j].Itemcat === "T") {
		// 	// 		mItem.Potx1 = sAIWData.matItem[j].Potx1;
		// 	// 	}
		// 	// 	sPayload.MRBItem.push(mItem);
		// 	// }

		// 	// for (var k = 0; k < sAIWData.matSubItem.length; k++) {
		// 	// 	var mSubItem = {
		// 	// 		"Matnr": sAIWData.Matnr,
		// 	// 		"Stlan": sAIWData.Stlan,
		// 	// 		"Werks": sAIWData.Werks,
		// 	// 		"Posnr": sAIWData.matSubItem[k].Posnr,
		// 	// 		"Bomitmnod": sAIWData.matSubItem[k].Bomitmnod,
		// 	// 		"Bomsubno": sAIWData.matSubItem[k].Bomsubno,
		// 	// 		"Ebort": sAIWData.matSubItem[k].Ebort,
		// 	// 		"Upmng": sAIWData.matSubItem[k].Upmng,
		// 	// 		"Uptxt": sAIWData.matSubItem[k].Uptxt
		// 	// 	};
		// 	// 	sPayload.MRBSBIT.push(mSubItem);
		// 	// }

		// 	if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "changeMbom") {
		// 		var mHeader = {
		// 			"Matnr": sAIWData.Matnr,
		// 			"Stalt": sAIWData.Stalt,
		// 			"Stlan": sAIWData.Stlan,
		// 			"Werks": sAIWData.Werks,
		// 			"Bomstatus": sAIWData.Bomstatus,
		// 			"Lngtxt": sAIWData.Lngtxt,
		// 			"Txtmi": sAIWData.Lngtxt,
		// 			"Validfrom": this._formatDate(sAIWData.Validfrom),
		// 			"Baseqty": sAIWData.BaseQty,
		// 			"Baseuom": sAIWData.BaseUom,
		// 			"Validtoda": this._formatDate(sAIWData.Validtoda)
		// 		};
		// 		sPayload.MRBHeader.push(mHeader);

		// 		for (var j = 0; j < sAIWData.matItem.length; j++) {
		// 			var mItem = {
		// 				"Matnr": sAIWData.Matnr,
		// 				"Stlan": sAIWData.Stlan,
		// 				"Werks": sAIWData.Werks,
		// 				//"Bomitmnod": sAIWData.Bomitmnod, //13.08
		// 				"Bomitmpos": sAIWData.matItem[j].Bomitmpos,
		// 				"Itemcat": sAIWData.matItem[j].Itemcat,
		// 				"Itemcomp": sAIWData.matItem[j].Itemcomp,
		// 				"Compdesc": "",
		// 				"Itmqty": sAIWData.matItem[j].Itmqty,
		// 				"Itmuom": sAIWData.matItem[j].Itmuom,
		// 				"Recurallo": sAIWData.matItem[j].Recurallo,
		// 				"Erskz": sAIWData.matItem[j].Erskz,
		// 				"Rvrel": sAIWData.matItem[j].Rvrel === "0" ? "" : sAIWData.matItem[j].Rvrel,
		// 				"Sanfe": sAIWData.matItem[j].Sanfe,
		// 				"Sanin": sAIWData.matItem[j].Sanin,
		// 				"Sanko": sAIWData.matItem[j].Sanko,
		// 				"Itmcmpdesc": sAIWData.matItem[j].Itmcmpdesc,
		// 				"Costgrelv": sAIWData.matItem[j].Costgrelv === "0" ? "" : sAIWData.matItem[j].Costgrelv
		// 			};
		// 			if (sAIWData.bomType === "Change") {
		// 				mItem.Bomitmnod = sAIWData.matItem[j].Bomitmnod;
		// 			}
		// 			if (sAIWData.matItem[j].Itemcat === "N") {
		// 				mItem.Ekorg = sAIWData.matItem[j].Ekorg;
		// 				mItem.Ekotx = sAIWData.matItem[j].Ekotx;
		// 				mItem.Ekgrp = sAIWData.matItem[j].Ekgrp;
		// 				mItem.Eknam = sAIWData.matItem[j].Eknam;
		// 				mItem.Preis = sAIWData.matItem[j].Preis;
		// 				mItem.Waers = sAIWData.matItem[j].Waers;
		// 				mItem.Peinh = sAIWData.matItem[j].Peinh;
		// 				mItem.Matkl = sAIWData.matItem[j].Matkl;
		// 				mItem.Wgbez = sAIWData.matItem[j].Wgbez;
		// 				mItem.Potx1 = sAIWData.matItem[j].Potx1;
		// 			} else if (sAIWData.matItem[j].Itemcat === "D") {
		// 				mItem.Bomdocitm = sAIWData.matItem[j].Bomdocitm;
		// 				mItem.Bomitmdkr = sAIWData.matItem[j].Bomitmdkr;
		// 				mItem.BomitmdkrTxt = sAIWData.matItem[j].BomitmdkrTxt;
		// 				mItem.Bomitmdtl = sAIWData.matItem[j].Bomitmdtl;
		// 				mItem.Bomitmdvr = sAIWData.matItem[j].Bomitmdvr;
		// 			} else if (sAIWData.matItem[j].Itemcat === "R") {
		// 				mItem.Roms1 = sAIWData.matItem[j].Roms1;
		// 				mItem.Romei = sAIWData.matItem[j].Romei;
		// 				mItem.Roms2 = sAIWData.matItem[j].Roms2;
		// 				mItem.Roms3 = sAIWData.matItem[j].Roms3;
		// 				mItem.Rform = sAIWData.matItem[j].Rform;
		// 				// mItem.FrmlaKeyDesc = sAIWData.matItem[j].Itemcat;
		// 				mItem.Roanz = sAIWData.matItem[j].Roanz;
		// 				// mItem.numVarSizeDesc = sAIWData.matItem[j].Itemcat;
		// 				mItem.Romen = sAIWData.matItem[j].Romen;
		// 				mItem.Rokme = sAIWData.matItem[j].Rokme;
		// 			} else if (sAIWData.matItem[j].Itemcat === "T") {
		// 				mItem.Potx1 = sAIWData.matItem[j].Potx1;
		// 			}
		// 			sPayload.MRBItem.push(mItem);
		// 		}

		// 		for (var k = 0; k < sAIWData.matSubItem.length; k++) {
		// 			var mSubItem = {
		// 				"Matnr": sAIWData.Matnr,
		// 				"Stlan": sAIWData.Stlan,
		// 				"Werks": sAIWData.Werks,
		// 				"Posnr": sAIWData.matSubItem[k].Posnr,
		// 				"Bomitmnod": sAIWData.matSubItem[k].Bomitmnod,
		// 				"Bomsubno": sAIWData.matSubItem[k].Bomsubno,
		// 				"Ebort": sAIWData.matSubItem[k].Ebort,
		// 				"Upmng": sAIWData.matSubItem[k].Upmng,
		// 				"Uptxt": sAIWData.matSubItem[k].Uptxt
		// 			};
		// 			sPayload.MRBSBIT.push(mSubItem);
		// 		}
		// 	} else if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "changeEbom") {
		// 		var eHeader = {
		// 			"Eqnrbom": sAIWData.Eqnrbom,
		// 			//"Stalt": "",
		// 			"Stlan": sAIWData.Stlan,
		// 			"Werks": sAIWData.Werks,
		// 			"Bomstatus": sAIWData.Bomstatus,
		// 			"Lngtxt": sAIWData.Lngtxt,
		// 			"Txtmi": sAIWData.Lngtxt,
		// 			"Validfrom": this._formatDate(sAIWData.Validfrom),
		// 			"Baseqty": sAIWData.BaseQty,
		// 			"Baseuom": sAIWData.BaseUom,
		// 			"Validtoda": this._formatDate(sAIWData.Validtoda)
		// 		};
		// 		sPayload.EBHeader.push(eHeader);

		// 		for (var j = 0; j < sAIWData.eqItem.length; j++) {
		// 			var eItem = {
		// 				"Eqnrbom": sAIWData.Eqnrbom,
		// 				"Stlan": sAIWData.Stlan,
		// 				"Werks": sAIWData.Werks,
		// 				"Bomitmpos": sAIWData.eqItem[j].Bomitmpos,
		// 				"Itemcat": sAIWData.eqItem[j].Itemcat,
		// 				"Itemcomp": sAIWData.eqItem[j].Itemcomp,
		// 				"Compdesc": "",
		// 				"Itmqty": sAIWData.eqItem[j].Itmqty,
		// 				"Itmuom": sAIWData.eqItem[j].Itmuom,
		// 				"Recurallo": sAIWData.eqItem[j].Recurallo,
		// 				"Erskz": sAIWData.eqItem[j].Erskz,
		// 				"Rvrel": sAIWData.eqItem[j].Rvrel === "0" ? "" : sAIWData.eqItem[j].Rvrel,
		// 				"Sanfe": sAIWData.eqItem[j].Sanfe,
		// 				"Sanin": sAIWData.eqItem[j].Sanin,
		// 				"Sanko": sAIWData.eqItem[j].Sanko,
		// 				"Itmcmpdesc": sAIWData.eqItem[j].Itmcmpdesc,
		// 				"Costgrelv": sAIWData.eqItem[j].Costgrelv === "0" ? "" : sAIWData.eqItem[j].Costgrelv
		// 			};
		// 			if (sAIWData.bomType === "Change") {
		// 				eItem.Bomitmnod = sAIWData.eqItem[j].Bomitmnod;
		// 			}
		// 			if (sAIWData.eqItem[j].Itemcat === "N") {
		// 				eItem.Ekorg = sAIWData.eqItem[j].Ekorg;
		// 				eItem.Ekotx = sAIWData.eqItem[j].Ekotx;
		// 				eItem.Ekgrp = sAIWData.eqItem[j].Ekgrp;
		// 				eItem.Eknam = sAIWData.eqItem[j].Eknam;
		// 				eItem.Preis = sAIWData.eqItem[j].Preis;
		// 				eItem.Waers = sAIWData.eqItem[j].Waers;
		// 				eItem.Peinh = sAIWData.eqItem[j].Peinh;
		// 				eItem.Matkl = sAIWData.eqItem[j].Matkl;
		// 				eItem.Wgbez = sAIWData.eqItem[j].Wgbez;
		// 				eItem.Potx1 = sAIWData.eqItem[j].Potx1;
		// 			} else if (sAIWData.eqItem[j].Itemcat === "D") {
		// 				eItem.Bomdocitm = sAIWData.eqItem[j].Bomdocitm;
		// 				eItem.Bomitmdkr = sAIWData.eqItem[j].Bomitmdkr;
		// 				eItem.BomitmdkrTxt = sAIWData.eqItem[j].BomitmdkrTxt;
		// 				eItem.Bomitmdtl = sAIWData.eqItem[j].Bomitmdtl;
		// 				eItem.Bomitmdvr = sAIWData.eqItem[j].Bomitmdvr;
		// 			} else if (sAIWData.eqItem[j].Itemcat === "R") {
		// 				eItem.Roms1 = sAIWData.eqItem[j].Roms1;
		// 				eItem.Romei = sAIWData.eqItem[j].Romei;
		// 				eItem.Roms2 = sAIWData.eqItem[j].Roms2;
		// 				eItem.Roms3 = sAIWData.eqItem[j].Roms3;
		// 				eItem.Rform = sAIWData.eqItem[j].Rform;
		// 				// eItem.FrmlaKeyDesc = sAIWData.eqItem[j].Itemcat;
		// 				eItem.Roanz = sAIWData.eqItem[j].Roanz;
		// 				// eItem.numVarSizeDesc = sAIWData.eqItem[j].Itemcat;
		// 				eItem.Romen = sAIWData.eqItem[j].Romen;
		// 				eItem.Rokme = sAIWData.eqItem[j].Rokme;
		// 			} else if (sAIWData.eqItem[j].Itemcat === "T") {
		// 				eItem.Potx1 = sAIWData.eqItem[j].Potx1;
		// 			}
		// 			sPayload.EBItem.push(eItem);
		// 		}

		// 		for (var k = 0; k < sAIWData.eqSubItem.length; k++) {
		// 			var eSubItem = {
		// 				"Eqnrbom": sAIWData.Eqnrbom,
		// 				"Stlan": sAIWData.Stlan,
		// 				"Werks": sAIWData.Werks,
		// 				"Posnr": sAIWData.eqSubItem[k].Posnr,
		// 				"Bomitmnod": sAIWData.eqSubItem[k].Bomitmnod,
		// 				"Bomsubno": sAIWData.eqSubItem[k].Bomsubno,
		// 				"Ebort": sAIWData.eqSubItem[k].Ebort,
		// 				"Upmng": sAIWData.eqSubItem[k].Upmng,
		// 				"Uptxt": sAIWData.eqSubItem[k].Uptxt
		// 			};
		// 			sPayload.EBSBIT.push(eSubItem);
		// 		}
		// 	} else if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "changeFlbom") {
		// 		var flHeader = {
		// 			"Tplnrbom": sAIWData.Tplnrbom,
		// 			"Stlan": sAIWData.Stlan,
		// 			"Werks": sAIWData.Werks,
		// 			"Bomstatus": sAIWData.Bomstatus,
		// 			"Lngtxt": sAIWData.Lngtxt,
		// 			"Txtmi": sAIWData.Lngtxt,
		// 			"Validfrom": this._formatDate(sAIWData.Validfrom),
		// 			"Baseqty": sAIWData.BaseQty,
		// 			"Baseuom": sAIWData.BaseUom,
		// 			"Validtoda": this._formatDate(sAIWData.Validtoda)
		// 				//"Stalt": ""
		// 		};
		// 		sPayload.FBHeader.push(flHeader);

		// 		for (var j = 0; j < sAIWData.flItem.length; j++) {
		// 			var flItem = {
		// 				"Tplnrbom": sAIWData.Tplnrbom,
		// 				"Stlan": sAIWData.Stlan,
		// 				"Werks": sAIWData.Werks,
		// 				"Bomitmpos": sAIWData.flItem[j].Bomitmpos,
		// 				"Itemcat": sAIWData.flItem[j].Itemcat,
		// 				"Itemcomp": sAIWData.flItem[j].Itemcomp,
		// 				"Compdesc": "",
		// 				"Itmqty": sAIWData.flItem[j].Itmqty,
		// 				"Itmuom": sAIWData.flItem[j].Itmuom,
		// 				"Recurallo": sAIWData.flItem[j].Recurallo,
		// 				"Erskz": sAIWData.flItem[j].Erskz,
		// 				"Rvrel": sAIWData.flItem[j].Rvrel === "0" ? "" : sAIWData.flItem[j].Rvrel,
		// 				"Sanfe": sAIWData.flItem[j].Sanfe,
		// 				"Sanin": sAIWData.flItem[j].Sanin,
		// 				"Sanko": sAIWData.flItem[j].Sanko,
		// 				"Itmcmpdesc": sAIWData.flItem[j].Itmcmpdesc,
		// 				"Costgrelv": sAIWData.flItem[j].Costgrelv === "0" ? "" : sAIWData.flItem[j].Costgrelv
		// 			};
		// 			if (sAIWData.bomType === "Change") {
		// 				flItem.Bomitmnod = sAIWData.flItem[j].Bomitmnod;
		// 			}
		// 			if (sAIWData.flItem[j].Itemcat === "N") {
		// 				flItem.Ekorg = sAIWData.flItem[j].Ekorg;
		// 				flItem.Ekotx = sAIWData.flItem[j].Ekotx;
		// 				flItem.Ekgrp = sAIWData.flItem[j].Ekgrp;
		// 				flItem.Eknam = sAIWData.flItem[j].Eknam;
		// 				flItem.Preis = sAIWData.flItem[j].Preis;
		// 				flItem.Waers = sAIWData.flItem[j].Waers;
		// 				flItem.Peinh = sAIWData.flItem[j].Peinh;
		// 				flItem.Matkl = sAIWData.flItem[j].Matkl;
		// 				flItem.Wgbez = sAIWData.flItem[j].Wgbez;
		// 				flItem.Potx1 = sAIWData.flItem[j].Potx1;
		// 			} else if (sAIWData.flItem[j].Itemcat === "D") {
		// 				flItem.Bomdocitm = sAIWData.flItem[j].Bomdocitm;
		// 				flItem.Bomitmdkr = sAIWData.flItem[j].Bomitmdkr;
		// 				flItem.BomitmdkrTxt = sAIWData.flItem[j].BomitmdkrTxt;
		// 				flItem.Bomitmdtl = sAIWData.flItem[j].Bomitmdtl;
		// 				flItem.Bomitmdvr = sAIWData.flItem[j].Bomitmdvr;
		// 			} else if (sAIWData.flItem[j].Itemcat === "R") {
		// 				flItem.Roms1 = sAIWData.flItem[j].Roms1;
		// 				flItem.Romei = sAIWData.flItem[j].Romei;
		// 				flItem.Roms2 = sAIWData.flItem[j].Roms2;
		// 				flItem.Roms3 = sAIWData.flItem[j].Roms3;
		// 				flItem.Rform = sAIWData.flItem[j].Rform;
		// 				// flItem.FrmlaKeyDesc = sAIWData.flItem[j].Itemcat;
		// 				flItem.Roanz = sAIWData.flItem[j].Roanz;
		// 				// flItem.numVarSizeDesc = sAIWData.flItem[j].Itemcat;
		// 				flItem.Romen = sAIWData.flItem[j].Romen;
		// 				flItem.Rokme = sAIWData.flItem[j].Rokme;
		// 			} else if (sAIWData.flItem[j].Itemcat === "T") {
		// 				flItem.Potx1 = sAIWData.flItem[j].Potx1;
		// 			}
		// 			sPayload.FBItem.push(flItem);
		// 		}

		// 		for (var k = 0; k < sAIWData.flSubItem.length; k++) {
		// 			var flSubItem = {
		// 				"Tplnrbom": sAIWData.Tplnrbom,
		// 				"Stlan": sAIWData.Stlan,
		// 				"Werks": sAIWData.Werks,
		// 				"Posnr": sAIWData.flSubItem[k].Posnr,
		// 				"Bomitmnod": sAIWData.flSubItem[k].Bomitmnod,
		// 				"Bomsubno": sAIWData.flSubItem[k].Bomsubno,
		// 				"Ebort": sAIWData.flSubItem[k].Ebort,
		// 				"Upmng": sAIWData.flSubItem[k].Upmng,
		// 				"Uptxt": sAIWData.flSubItem[k].Uptxt
		// 			};
		// 			sPayload.FBSBIT.push(flSubItem);
		// 		}
		// 	} else if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "changeWbsbom") {
		// 		var wbsHeader = {
		// 			"WbsExt": sAIWData.WbsExt,
		// 			"MatnrWbs": sAIWData.Matnr,
		// 			"Stlan": sAIWData.Stlan,
		// 			"Werks": sAIWData.Werks,
		// 			"Bomstatus": sAIWData.Bomstatus,
		// 			"Lngtxt": sAIWData.Lngtxt,
		// 			"Txtmi": sAIWData.Lngtxt,
		// 			"Validfrom": this._formatDate(sAIWData.Validfrom),
		// 			"Baseqty": sAIWData.BaseQty,
		// 			"Baseuom": sAIWData.BaseUom,
		// 			"Validtoda": this._formatDate(sAIWData.Validtoda)
		// 				//"Stalt": ""
		// 		};
		// 		sPayload.WBHeader.push(wbsHeader);

		// 		for (var j = 0; j < sAIWData.wbsItem.length; j++) {
		// 			var wbsItem = {
		// 				"WbsExt": sAIWData.WbsExt,
		// 				"MatnrWbs": sAIWData.Matnr,
		// 				"Stlan": sAIWData.Stlan,
		// 				"Werks": sAIWData.Werks,
		// 				"Bomitmpos": sAIWData.wbsItem[j].Bomitmpos,
		// 				"Itemcat": sAIWData.wbsItem[j].Itemcat,
		// 				"Itemcomp": sAIWData.wbsItem[j].Itemcomp,
		// 				"Compdesc": "",
		// 				"Itmqty": sAIWData.wbsItem[j].Itmqty,
		// 				"Itmuom": sAIWData.wbsItem[j].Itmuom,
		// 				"Recurallo": sAIWData.wbsItem[j].Recurallo,
		// 				"Erskz": sAIWData.wbsItem[j].Erskz,
		// 				"Rvrel": sAIWData.wbsItem[j].Rvrel === "0" ? "" : sAIWData.wbsItem[j].Rvrel,
		// 				"Sanfe": sAIWData.wbsItem[j].Sanfe,
		// 				"Sanin": sAIWData.wbsItem[j].Sanin,
		// 				"Sanko": sAIWData.wbsItem[j].Sanko,
		// 				"Itmcmpdesc": sAIWData.wbsItem[j].Itmcmpdesc,
		// 				"Costgrelv": sAIWData.wbsItem[j].Costgrelv === "0" ? "" : sAIWData.wbsItem[j].Costgrelv
		// 			};
		// 			if (sAIWData.bomType === "Change") { //13.08
		// 				wbsItem.Bomitmnod = sAIWData.wbsItem[j].Bomitmnod;
		// 			}
		// 			if (sAIWData.wbsItem[j].Itemcat === "N") {
		// 				wbsItem.Ekorg = sAIWData.wbsItem[j].Ekorg;
		// 				wbsItem.Ekotx = sAIWData.wbsItem[j].Ekotx;
		// 				wbsItem.Ekgrp = sAIWData.wbsItem[j].Ekgrp;
		// 				wbsItem.Eknam = sAIWData.wbsItem[j].Eknam;
		// 				wbsItem.Preis = sAIWData.wbsItem[j].Preis;
		// 				wbsItem.Waers = sAIWData.wbsItem[j].Waers;
		// 				wbsItem.Peinh = sAIWData.wbsItem[j].Peinh;
		// 				wbsItem.Matkl = sAIWData.wbsItem[j].Matkl;
		// 				wbsItem.Wgbez = sAIWData.wbsItem[j].Wgbez;
		// 				wbsItem.Potx1 = sAIWData.wbsItem[j].Potx1;
		// 			} else if (sAIWData.wbsItem[j].Itemcat === "D") {
		// 				wbsItem.Bomdocitm = sAIWData.wbsItem[j].Bomdocitm;
		// 				wbsItem.Bomitmdkr = sAIWData.wbsItem[j].Bomitmdkr;
		// 				wbsItem.BomitmdkrTxt = sAIWData.wbsItem[j].BomitmdkrTxt;
		// 				wbsItem.Bomitmdtl = sAIWData.wbsItem[j].Bomitmdtl;
		// 				wbsItem.Bomitmdvr = sAIWData.wbsItem[j].Bomitmdvr;
		// 			} else if (sAIWData.wbsItem[j].Itemcat === "R") {
		// 				wbsItem.Roms1 = sAIWData.wbsItem[j].Roms1;
		// 				wbsItem.Romei = sAIWData.wbsItem[j].Romei;
		// 				wbsItem.Roms2 = sAIWData.wbsItem[j].Roms2;
		// 				wbsItem.Roms3 = sAIWData.wbsItem[j].Roms3;
		// 				wbsItem.Rform = sAIWData.wbsItem[j].Rform;
		// 				// wbsItem.FrmlaKeyDesc = sAIWData.wbsItem[j].Itemcat;
		// 				wbsItem.Roanz = sAIWData.wbsItem[j].Roanz;
		// 				// wbsItem.numVarSizeDesc = sAIWData.wbsItem[j].Itemcat;
		// 				wbsItem.Romen = sAIWData.wbsItem[j].Romen;
		// 				wbsItem.Rokme = sAIWData.wbsItem[j].Rokme;
		// 			} else if (sAIWData.wbsItem[j].Itemcat === "T") {
		// 				wbsItem.Potx1 = sAIWData.wbsItem[j].Potx1;
		// 			}
		// 			sPayload.WBItem.push(wbsItem);
		// 		}

		// 		for (var k = 0; k < sAIWData.wbsSubItem.length; k++) {
		// 			var wbsSubItem = {
		// 				"WbsExt": sAIWData.WbsExt,
		// 				"MatnrWbs": sAIWData.Matnr,
		// 				"Stlan": sAIWData.Stlan,
		// 				"Werks": sAIWData.Werks,
		// 				"Posnr": sAIWData.wbsSubItem[k].Posnr,
		// 				"Bomitmnod": sAIWData.wbsSubItem[k].Bomitmnod,
		// 				"Bomsubno": sAIWData.wbsSubItem[k].Bomsubno,
		// 				"Ebort": sAIWData.wbsSubItem[k].Ebort,
		// 				"Upmng": sAIWData.wbsSubItem[k].Upmng,
		// 				"Uptxt": sAIWData.wbsSubItem[k].Uptxt
		// 			};
		// 			sPayload.WBSBIT.push(wbsSubItem);
		// 		}
		// 	}

		// 	g.getView().byId("detailPage").setBusy(true);
		// 	var oModel = this.getView().getModel();
		// 	oModel.create("/ChangeRequestSet", sPayload, {
		// 		success: function (r) {
		// 			// g.getView().byId("detailPage").setBusy(false);
		// 			// if (!sap.ui.getCore().getModel("mShmmInstance")) {
		// 			// 	var aShmmInstance = [];
		// 			// 	aShmmInstance.push(asmbly_uid);
		// 			// 	sap.ui.getCore().setModel(new JSONModel(aShmmInstance), "mShmmInstance");
		// 			// } else {
		// 			// 	var aShmmInstance = sap.ui.getCore().getModel("mShmmInstance").getData();
		// 			// 	aShmmInstance.push(asmbly_uid);
		// 			// 	sap.ui.getCore().setModel(aShmmInstance, "mShmmInstance");
		// 			// }
		// 			// // g.getRouter().navTo("BOMdetailSOP", {
		// 			// // 	e: material,
		// 			// // 	p: sAIWData.Werks,
		// 			// // 	u: sAIWData.Stlan,
		// 			// // 	a: sAIWData.Stalt,
		// 			// // });

		// 			// g.getRouter().navTo("BOMdetailSOP", {
		// 			// 	FragmentName: g.sFragmentName,
		// 			// 	itemPath: g.itemPath,
		// 			// 	e: material,
		// 			// 	p: sAIWData.Werks,
		// 			// 	u: sAIWData.Stlan,
		// 			// 	cr: g.crstatus,
		// 			// 	w: " ",
		// 			// 	mode: g.mode,
		// 			// 	a: sAIWData.Stalt,
		// 			// 	HMat:sAIWData.Matnr,
		// 			// });
		// 			//-- -- -- -- -- -- -- -- -- -- -- -- --
		// 			// g.BusyDialog.open();
		// 			var sAltBom = sAIWData.Stalt ? sAIWData.Stalt : "1";
		// 			g._crossAppNavigation("MatBillOfMaterial", "changeMROBOM", {
		// 				IT_CAT: "L",
		// 				OBJ: "M",
		// 				m: material,
		// 				plant: sAIWData.Werks,
		// 				usage: sAIWData.Stlan,
		// 				altBom: sAltBom,
		// 				status: sAIWData.Bomstatus,
		// 				p: g.itemPath + "-" + g.sFragmentName,
		// 				uid: asmbly_uid,
		// 				assInd: "false",
		// 				caller: "AIW"
		// 					// hdr:""
		// 			});

		// 			sap.ui.getCore().setModel(false, "BOMCHNavModel");
		// 		},
		// 		error: function (err) {
		// 			g.getView().byId("detailPage").setBusy(false);
		// 			var error = [],
		// 				oMessageList = [];
		// 			if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
		// 				.errordetails
		// 				.length === 0) {
		// 				error[0] = JSON.parse(err.responseText).error.message.value;
		// 			} else {
		// 				for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
		// 					error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
		// 				}
		// 			}

		// 			var value = error.join("\n");
		// 			sap.m.MessageBox.show(value, {
		// 				title: "Error",
		// 				icon: sap.m.MessageBox.Icon.ERROR,
		// 				onClose: function () {}
		// 			});
		// 		}
		// 	});
		// },

		// readfrombufferAssembly: function (uid) {
		// 	var g = this;
		// 	// var sAIWData = g.getView().getModel("BOMDetailModel").getData();
		// 	var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
		// 	var sPayload = {
		// 		"ChangeRequestType": oCrType.crtype,
		// 		"CrDescription": oCrType.desc,
		// 		"SyncMbom": true, //"MbomBuffer": true,
		// 		"BomNavRead": true,
		// 		"ShmmInstance": uid,
		// 		"IsDraft": "C",
		// 		"Messages": [],
		// 		// "Reason": this.getView().byId("reasonForRequest").getSelectedKey(),
		// 		// "Guids": this.oAttach,
		// 		"FuncLoc": [],
		// 		"FLAddr": [],
		// 		"FLLAM": [],
		// 		"FLClass": [],
		// 		"FLVal": [],
		// 		"Equipment": [],
		// 		"EqAddr": [],
		// 		"EqPRT": [],
		// 		"EqLAM": [],
		// 		"EqClass": [],
		// 		"EqVal": [],
		// 		"MSPoint": [],
		// 		"MSLAM": [],
		// 		"MSClass": [],
		// 		"MSVal": [],
		// 		"MPLAN": [],
		// 		"MPItem": [],
		// 		"MPLAM": [],
		// 		"MPOBList": [],
		// 		"MPCycle": [],
		// 		"MRBHeader": [],
		// 		"MRBItem": [],
		// 		"MRBSBIT": [],
		// 		"EBHeader": [],
		// 		"EBItem": [],
		// 		"EBSBIT": [],
		// 		"FBHeader": [],
		// 		"FBItem": [],
		// 		"FBSBIT": [],
		// 		"WBHeader": [],
		// 		"WBItem": [],
		// 		"WBSBIT": [],
		// 		"ONetwork": [],
		// 		"ONLAM": [],
		// 		"Workcenter": [],
		// 		"WCCost": [],
		// 		"GTList": [],
		// 		"GTOprs": [],
		// 		"GTComp": [],
		// 		"GTClass": [],
		// 		"GTVal": [],
		// 		"ETList": [],
		// 		"ETOprs": [],
		// 		"ETComp": [],
		// 		"ETClass": [],
		// 		"ETVal": [],
		// 		"FTList": [],
		// 		"FTOprs": [],
		// 		"FTComp": [],
		// 		"FTClass": [],
		// 		"FTVal": [],
		// 		"Olink": [],
		// 		"OLClass": [],
		// 		"OLVal": []
		// 	};

		// 	g.getView().byId("detailPage").setBusy(true);
		// 	var oModel = this.getView().getModel();
		// 	oModel.create("/ChangeRequestSet", sPayload, {
		// 		success: function (r) {
		// 			g.getView().byId("detailPage").setBusy(false);
		// 			var crstatus = false;
		// 			var BOMDetailModel = new JSONModel();
		// 			var itemDetailModel = new JSONModel();
		// 			if (g.sFragmentName === "changeMbom") {
		// 				var h = r.MRBHeader.results[0];
		// 				var i = r.MRBItem.results;
		// 				var s = r.MRBSBIT.results;
		// 				g.currentObj = {
		// 					Matnr: h.Matnr,
		// 					Werks: h.Werks,
		// 					Stlan: h.Stlan,
		// 					Bomstatus: h.Bomstatus,
		// 					Lngtxt: h.Txtmi,
		// 					Validfrom: g.getDateFormat(h.Dvalidfrm),
		// 					BaseQty: h.Baseqty,
		// 					BaseUom: h.Baseuom,
		// 					Validtoda: g.getDateFormat(h.Validtoda),

		// 					MatDesc: h.Maktx,
		// 					WerksDesc: h.Plantname,
		// 					StlanDesc: h.Bomusagetxt,
		// 					BomstatusText: h.Bomstatustxt,
		// 					matEnable: false,
		// 					plantEnable: false,
		// 					usageEnable: false,
		// 					fromDateEnable: true,
		// 					addItemEnable: true,
		// 					modeFlag: "Delete",
		// 					matValueState: "None",
		// 					plantValueState: "None",
		// 					usageValueState: "None",
		// 					statusValueState: "None",
		// 					BaseQtyValueState: "None",
		// 					altbomValueState: "None",

		// 					bomType: "Change",

		// 					matItem: [],
		// 					matSubItem: []
		// 				};
		// 				if (g.sFragmentName === "changeMbom") {
		// 					g.currentObj.fromDateEnable = false;
		// 				}
		// 				if (i && i.length > 0) {
		// 					g.currentObj.matItem = i;
		// 					for (var j = 0; j < g.currentObj.matItem.length; j++) {
		// 						g.currentObj.matItem[j].itmCatState = "None";
		// 						g.currentObj.matItem[j].itmCompState = "None";
		// 						g.currentObj.matItem[j].itmQtyState = "None";
		// 						g.currentObj.matItem[j].itmUOMState = "None";
		// 						g.currentObj.matItem[j].itmCatEnable = false;
		// 						g.currentObj.matItem[j].itmQtyEnable = true;
		// 					}
		// 					g.sLastItemNum = i.length;
		// 				} else
		// 					g.currentObj.matItem = [];

		// 				if (s && s.length > 0)
		// 					g.currentObj.matSubItem = s;
		// 				else
		// 					g.currentObj.matSubItem = [];

		// 				g.currentObj.crtMatEnable = true;

		// 				if (crstatus === "true") {
		// 					g.getView().byId("idBtnCheck").setEnabled(false);
		// 					g.currentObj.altbomEnable = false;
		// 					g.currentObj.BomstatusEnable = false;
		// 					g.currentObj.BaseQtyEnable = false;
		// 					g.currentObj.LngtxtEnable = false;
		// 					g.currentObj.fromDateEnable = false;
		// 					g.currentObj.addItemEnable = false;
		// 					g.currentObj.crtMatEnable = false;
		// 					g.currentObj.modeFlag = "None";
		// 					for (var j = 0; j < g.currentObj.matItem.length; j++) {
		// 						g.currentObj.matItem[j].itmQtyEnable = false;
		// 						g.currentObj.matItem[j].itmCompEnable = false;
		// 						g.currentObj.matItem[j].itmUomEnable = false;
		// 						g.currentObj.matItem[j].reccrAllowEnable = false;
		// 						g.currentObj.matItem[j].Pmper = "-";
		// 						g.currentObj.matItem[j].Pmper = "-";
		// 						g.currentObj.matItem[j].Pmpka = "-";
		// 						g.currentObj.matItem[j].Pmprv = "-";
		// 						g.currentObj.matItem[j].Pmpfe = "-";
		// 						g.currentObj.matItem[j].Pmpin = "-";
		// 						g.currentObj.matItem[j].Pmpko = "-";
		// 					}
		// 					for (var j = 0; j < g.currentObj.matSubItem.length; j++) {
		// 						g.currentObj.matSubItem[j].intPointEnable = false;
		// 						g.currentObj.matSubItem[j].subQtyEnable = false;
		// 						g.currentObj.matSubItem[j].subTextEnable = false;
		// 					}
		// 				}
		// 				BOMDetailModel.setData(g.currentObj);
		// 				itemDetailModel.setData(g.currentObj.matItem);
		// 			}
		// 			if (g.sFragmentName === "changeEbom") {
		// 				var h = r.EBHeader.results[0];
		// 				var i = r.EBItem.results;
		// 				var s = r.EBSBIT.results;
		// 				g.currentObj = {
		// 					Eqnrbom: h.Eqnrbom,
		// 					Werks: h.Werks,
		// 					Stlan: h.Stlan,
		// 					Bomstatus: h.Bomstatus,
		// 					Lngtxt: h.Txtmi,
		// 					Validfrom: g.getDateFormat(h.Dvalidfrm),
		// 					BaseQty: h.Baseqty,
		// 					BaseUom: h.Baseuom,
		// 					Validtoda: g.getDateFormat(h.Validtoda),

		// 					EquiDesc: h.Eqktx,
		// 					WerksDesc: h.Plantname,
		// 					StlanDesc: h.Bomusagetxt,
		// 					BomstatusText: h.Bomstatustxt,
		// 					equipEnable: false,
		// 					plantEnable: false,
		// 					usageEnable: false,
		// 					fromDateEnable: true,
		// 					addItemEnable: true,
		// 					modeFlag: "Delete",
		// 					equipValueState: "None",
		// 					plantValueState: "None",
		// 					usageValueState: "None",
		// 					statusValueState: "None",
		// 					BaseQtyValueState: "None",

		// 					bomType: "Change",

		// 					eqItem: [],
		// 					eqSubItem: []
		// 				};
		// 				if (g.sFragmentName === "changeEbom") {
		// 					g.currentObj.fromDateEnable = false;
		// 				}
		// 				if (i && i.length > 0) {
		// 					g.currentObj.eqItem = i;
		// 					for (var j = 0; j < g.currentObj.eqItem.length; j++) {
		// 						g.currentObj.eqItem[j].itmCatState = "None";
		// 						g.currentObj.eqItem[j].itmCompState = "None";
		// 						g.currentObj.eqItem[j].itmQtyState = "None";
		// 						g.currentObj.eqItem[j].itmUOMState = "None";
		// 						g.currentObj.eqItem[j].itmCatEnable = false;
		// 						g.currentObj.eqItem[j].itmQtyEnable = true;
		// 					}
		// 					g.sLastItemNum = i.length;
		// 				} else
		// 					g.currentObj.eqItem = [];

		// 				if (s && s.length > 0) {
		// 					g.currentObj.eqSubItem = s;
		// 				} else
		// 					g.currentObj.eqSubItem = [];

		// 				g.currentObj.crtMatEnable = false;

		// 				if (crstatus === "true") {
		// 					g.getView().byId("idBtnCheck").setEnabled(false);
		// 					g.currentObj.BomstatusEnable = false;
		// 					g.currentObj.BaseQtyEnable = false;
		// 					g.currentObj.LngtxtEnable = false;
		// 					g.currentObj.fromDateEnable = false;
		// 					g.currentObj.addItemEnable = false;
		// 					g.currentObj.modeFlag = "None";
		// 					for (var j = 0; j < g.currentObj.eqItem.length; j++) {
		// 						g.currentObj.eqItem[j].itmQtyEnable = false;
		// 						g.currentObj.eqItem[j].itmCompEnable = false;
		// 						g.currentObj.eqItem[j].itmUomEnable = false;
		// 						g.currentObj.eqItem[j].addSubItmEnable = false;
		// 						g.currentObj.eqItem[j].Pmper = "-";
		// 						g.currentObj.eqItem[j].Pmpka = "-";
		// 						g.currentObj.eqItem[j].Pmprv = "-";
		// 						g.currentObj.eqItem[j].Pmpfe = "-";
		// 						g.currentObj.eqItem[j].Pmpin = "-";
		// 						g.currentObj.eqItem[j].Pmpko = "-";
		// 					}
		// 					for (var j = 0; j < g.currentObj.eqSubItem.length; j++) {
		// 						g.currentObj.eqSubItem[j].intPointEnable = false;
		// 						g.currentObj.eqSubItem[j].subQtyEnable = false;
		// 						g.currentObj.eqSubItem[j].subTextEnable = false;
		// 					}
		// 				}
		// 				BOMDetailModel.setData(g.currentObj);
		// 				itemDetailModel.setData(g.currentObj.eqItem);
		// 			}
		// 			if (g.sFragmentName === "changeFlbom") {
		// 				var h = r.FBHeader.results[0];
		// 				var i = r.FBItem.results;
		// 				var s = r.FBSBIT.results;
		// 				g.currentObj = {
		// 					Tplnrbom: h.Tplnrbom,
		// 					Werks: h.Werks,
		// 					Stlan: h.Stlan,
		// 					Bomstatus: h.Bomstatus,
		// 					Lngtxt: h.Txtmi,
		// 					Validfrom: g.getDateFormat(h.Dvalidfrm),
		// 					BaseQty: h.Baseqty,
		// 					BaseUom: h.Baseuom,
		// 					Validtoda: g.getDateFormat(h.Validtoda),

		// 					FLDesc: h.Pltxt,
		// 					WerksDesc: h.Plantname,
		// 					StlanDesc: h.Bomusagetxt,
		// 					BomstatusText: h.Bomstatustxt,
		// 					FLEnable: false,
		// 					plantEnable: false,
		// 					usageEnable: false,
		// 					fromDateEnable: true,
		// 					addItemEnable: true,
		// 					modeFlag: "Delete",
		// 					FLValueState: "None",
		// 					plantValueState: "None",
		// 					usageValueState: "None",
		// 					statusValueState: "None",
		// 					BaseQtyValueState: "None",

		// 					bomType: "Change", //New code

		// 					flItem: [],
		// 					flSubItem: []
		// 				};
		// 				if (g.sFragmentName === "changeFlbom") {
		// 					g.currentObj.fromDateEnable = false;
		// 				}
		// 				if (i && i.length > 0) {
		// 					g.currentObj.flItem = i;
		// 					for (var j = 0; j < g.currentObj.flItem.length; j++) {
		// 						g.currentObj.flItem[j].itmCatState = "None";
		// 						g.currentObj.flItem[j].itmCompState = "None";
		// 						g.currentObj.flItem[j].itmQtyState = "None";
		// 						g.currentObj.flItem[j].itmUOMState = "None";
		// 						g.currentObj.flItem[j].itmCatEnable = false;
		// 						g.currentObj.flItem[j].itmQtyEnable = true;
		// 					}
		// 					g.sLastItemNum = i.length;
		// 				} else
		// 					g.currentObj.flItem = [];

		// 				if (s && s.length > 0)
		// 					g.currentObj.flSubItem = s;
		// 				else
		// 					g.currentObj.flSubItem = [];

		// 				g.currentObj.crtMatEnable = false;

		// 				if (crstatus === "true") {
		// 					g.getView().byId("idBtnCheck").setEnabled(false);
		// 					g.currentObj.BomstatusEnable = false;
		// 					g.currentObj.BaseQtyEnable = false;
		// 					g.currentObj.LngtxtEnable = false;
		// 					g.currentObj.fromDateEnable = false;
		// 					g.currentObj.addItemEnable = false;
		// 					g.currentObj.modeFlag = "None";
		// 					for (var j = 0; j < g.currentObj.flItem.length; j++) {
		// 						g.currentObj.flItem[j].itmQtyEnable = false;
		// 						g.currentObj.flItem[j].itmCompEnable = false;
		// 						g.currentObj.flItem[j].itmUomEnable = false;
		// 						g.currentObj.flItem[j].addSubItmEnable = false;
		// 						g.currentObj.flItem[j].Pmper = "-";
		// 						g.currentObj.flItem[j].Pmpka = "-";
		// 						g.currentObj.flItem[j].Pmprv = "-";
		// 						g.currentObj.flItem[j].Pmpfe = "-";
		// 						g.currentObj.flItem[j].Pmpin = "-";
		// 						g.currentObj.flItem[j].Pmpko = "-";
		// 					}
		// 					for (var j = 0; j < g.currentObj.flSubItem.length; j++) {
		// 						g.currentObj.flSubItem[j].intPointEnable = false;
		// 						g.currentObj.flSubItem[j].subQtyEnable = false;
		// 						g.currentObj.flSubItem[j].subTextEnable = false;
		// 					}
		// 				}
		// 				BOMDetailModel.setData(g.currentObj);
		// 				itemDetailModel.setData(g.currentObj.flItem);
		// 			}
		// 			if (g.sFragmentName === "changeWbsbom") {
		// 				var h = r.WBHeader.results[0];
		// 				var i = r.WBItem.results;
		// 				var s = r.WBSBIT.results;
		// 				g.currentObj = {
		// 					WbsExt: h.WbsExt,
		// 					Matnr: h.MatnrWbs,
		// 					Werks: h.Werks,
		// 					Stlan: h.Stlan,
		// 					Bomstatus: h.Bomstatus,
		// 					Lngtxt: h.Txtmi,
		// 					Validfrom: g.getDateFormat(h.Dvalidfrm),
		// 					BaseQty: h.Baseqty,
		// 					BaseUom: h.Baseuom,
		// 					Validtoda: g.getDateFormat(h.Validtoda),

		// 					WbsDesc: h.Post1,
		// 					MatDesc: h.Maktx,
		// 					WerksDesc: h.Plantname,
		// 					StlanDesc: h.Bomusagetxt,
		// 					BomstatusText: h.Bomstatustxt,
		// 					wbsEnable: false,
		// 					matEnable: false,
		// 					plantEnable: false,
		// 					usageEnable: false,
		// 					fromDateEnable: true,
		// 					addItemEnable: true,
		// 					modeFlag: "Delete",
		// 					wbsValueState: "None",
		// 					matValueState: "None",
		// 					plantValueState: "None",
		// 					usageValueState: "None",
		// 					statusValueState: "None",
		// 					BaseQtyValueState: "None",

		// 					bomType: "Change", //New code

		// 					wbsItem: [],
		// 					wbsSubItem: []
		// 				};
		// 				if (g.sFragmentName === "changeWbsbom") {
		// 					g.currentObj.fromDateEnable = false;
		// 				}
		// 				if (i && i.length > 0) {
		// 					g.currentObj.wbsItem = i;
		// 					for (var j = 0; j < g.currentObj.wbsItem.length; j++) {
		// 						g.currentObj.wbsItem[j].itmCatState = "None";
		// 						g.currentObj.wbsItem[j].itmCompState = "None";
		// 						g.currentObj.wbsItem[j].itmQtyState = "None";
		// 						g.currentObj.wbsItem[j].itmUOMState = "None";
		// 						g.currentObj.wbsItem[j].itmCatEnable = false;
		// 						g.currentObj.wbsItem[j].itmQtyEnable = true;
		// 					}
		// 					g.sLastItemNum = i.length;
		// 				} else
		// 					g.currentObj.wbsItem = [];

		// 				if (s && s.length > 0)
		// 					g.currentObj.wbsSubItem = s;
		// 				else
		// 					g.currentObj.wbsSubItem = [];

		// 				g.currentObj.crtMatEnable = false;

		// 				if (crstatus === "true") {
		// 					g.getView().byId("idBtnCheck").setEnabled(false);
		// 					g.currentObj.BomstatusEnable = false;
		// 					g.currentObj.BaseQtyEnable = false;
		// 					g.currentObj.LngtxtEnable = false;
		// 					g.currentObj.fromDateEnable = false;
		// 					g.currentObj.addItemEnable = false;
		// 					g.currentObj.modeFlag = "None";
		// 					for (var j = 0; j < g.currentObj.wbsItem.length; j++) {
		// 						g.currentObj.wbsItem[j].itmQtyEnable = false;
		// 						g.currentObj.wbsItem[j].itmCompEnable = false;
		// 						g.currentObj.wbsItem[j].itmUomEnable = false;
		// 						g.currentObj.wbsItem[j].reccrAllowEnable = false;
		// 						g.currentObj.wbsItem[j].addSubItmEnable = false;
		// 						g.currentObj.wbsItem[j].Pmper = "-";
		// 						g.currentObj.wbsItem[j].Pmpka = "-";
		// 						g.currentObj.wbsItem[j].Pmprv = "-";
		// 						g.currentObj.wbsItem[j].Pmpfe = "-";
		// 						g.currentObj.wbsItem[j].Pmpin = "-";
		// 						g.currentObj.wbsItem[j].Pmpko = "-";
		// 					}
		// 					for (var j = 0; j < g.currentObj.wbsSubItem.length; j++) {
		// 						g.currentObj.wbsSubItem[j].intPointEnable = false;
		// 						g.currentObj.wbsSubItem[j].subQtyEnable = false;
		// 						g.currentObj.wbsSubItem[j].subTextEnable = false;
		// 					}
		// 				}
		// 				BOMDetailModel.setData(g.currentObj);
		// 				itemDetailModel.setData(g.currentObj.wbsItem);
		// 			}

		// 			g.getView().setModel(BOMDetailModel, "BOMDetailModel");
		// 			g.getView().setModel(itemDetailModel, "itemDetailModel");
		// 			g.attachModelEventHandlers(BOMDetailModel);
		// 			g.attachModelEventHandlers(itemDetailModel);
		// 		},
		// 		error: function (err) {
		// 			g.getView().byId("detailPage").setBusy(false);
		// 			var error = [],
		// 				oMessageList = [];
		// 			if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
		// 				.errordetails
		// 				.length === 0) {
		// 				error[0] = JSON.parse(err.responseText).error.message.value;
		// 			} else {
		// 				for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
		// 					error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
		// 				}
		// 			}

		// 			var value = error.join("\n");
		// 			sap.m.MessageBox.show(value, {
		// 				title: "Error",
		// 				icon: sap.m.MessageBox.Icon.ERROR,
		// 				onClose: function () {}
		// 			});
		// 		}
		// 	});
		// },

	});
});