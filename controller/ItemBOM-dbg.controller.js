/*global location*/
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	// "ugiaiwui/mdg/aiw/request/util/common",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/core/routing/Router",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
	"sap/m/BusyDialog",
	"sap/ui/core/message/Message"
], function (BaseController, JSONModel, MessageBox, History, formatter, Router, ValueHelpProvider, ValueHelpRequest, BusyDialog,
	Message) { //common
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.ItemBOM", {
		formatter: formatter,
		lastSubItm: "",

		/**
		 * Called when the DetailBOM controller is instantiated.
		 * @public
		 */
		onInit: function () {
			this.getRouter().getRoute("itmDetail").attachPatternMatched(this._onObjectMatched, this);

			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));

			// var vhServiceUrl = this._oComponent.getModel("NewModel").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(vhModel, "valueHelp");

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

			var VisibleData = {
				ItmDtlTxt: "",
				ItmDtlVisible: false,
				ItmCompVisible: false,
				CoProdVisible: false,
				QtyDataVisible: false,
				AddnlDataVisible: false,
				StrLocVisible: false,
				ProdSuplyVisible: false,
				MrpDataVisible: false,
				PurDataVisible: false,
				ItmTxtVisible: false,
				DocAssgnVisible: false,
				varsizeitmdataVisible: false,

				PurDataApprFieldsVis: false,
				ItmTxtApprFieldsVis: false
			};
			var VisibleModel = new JSONModel(VisibleData);
			this.getView().setModel(VisibleModel, "VisibleModel");

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

			this.BusyDialog = new BusyDialog();
			this.BusyDialog.close();
		},

		/*
		 * Function to handle 'attachPatternMatched' of DetailBOM controller
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		_onObjectMatched: function (oEvent) {
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "itmDetail") {
				var BOMDetailModel = sap.ui.getCore().getModel("BOMDetailModel");
				this.lastSubItm = 0;
				this.sFragmentName = oEvent.getParameter("arguments").sFragmentName;
				this.sCrStatus = oEvent.getParameter("arguments").sCrStatus;
				this.mode = oEvent.getParameter("arguments").mode;
				var itemPath = decodeURIComponent(oEvent.getParameter("arguments").itemPath);
				var index = itemPath.substring(itemPath.lastIndexOf('/') + 1);
				this.currentObj = BOMDetailModel.getData();

				var itemDetailModel = new JSONModel([]);
				var subitemModel = new JSONModel([]);
				var VisibleModel = this.getView().getModel("VisibleModel");
				var VisibleData = VisibleModel.getData();
				var oJsonModel = new JSONModel();
				var sObj = {};
				var BOMModel = new JSONModel(this.currentObj);
				this.getView().setModel(BOMModel, "BOMModel");
				if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "SearchMaterialBom" || this.sFragmentName ===
					"changeMbom") {
					itemDetailModel.setData(this.currentObj.matItem[index]);
					subitemModel.setData(this.currentObj.matSubItem);
					sObj = {
						titleName: this.getView().getModel("i18n").getProperty("MBOM_ITM_DET")
					};
					if (this.sFragmentName === "SearchMaterialBom" || this.sFragmentName === "changeMbom") {
						this.oModelUpdateFlag = sap.ui.getCore().getModel("oModelUpdateFlag").updateFlag;
					}
				}
				if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "SearchEquipmentBom" || this.sFragmentName ===
					"changeEbom") {
					itemDetailModel.setData(this.currentObj.eqItem[index]);
					subitemModel.setData(this.currentObj.eqSubItem);
					sObj = {
						titleName: this.getView().getModel("i18n").getProperty("EBOM_ITM_DET")
					};
					if (this.sFragmentName === "SearchEquipmentBom" || this.sFragmentName === "changeEbom") {
						this.oModelUpdateFlag = sap.ui.getCore().getModel("oModelUpdateFlag").updateFlag;
					}
				}
				if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "SearchFLBom" || this.sFragmentName === "changeFlbom") {
					itemDetailModel.setData(this.currentObj.flItem[index]);
					subitemModel.setData(this.currentObj.flSubItem);
					sObj = {
						titleName: this.getView().getModel("i18n").getProperty("FLBOM_ITM_DET")
					};
					if (this.sFragmentName === "SearchFLBom" || this.sFragmentName === "changeFlbom") {
						this.oModelUpdateFlag = sap.ui.getCore().getModel("oModelUpdateFlag").updateFlag;
					}
				}
				if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "SearchWBSBom" || this.sFragmentName === "changeWbsbom") {
					itemDetailModel.setData(this.currentObj.wbsItem[index]);
					subitemModel.setData(this.currentObj.wbsSubItem);
					sObj = {
						titleName: this.getView().getModel("i18n").getProperty("WBSBOM_ITM_DET")
					};
					if (this.sFragmentName === "SearchWBSBom" || this.sFragmentName === "changeWbsbom") {
						this.oModelUpdateFlag = sap.ui.getCore().getModel("oModelUpdateFlag").updateFlag;
					}
				}
				this.getView().setModel(itemDetailModel, "itemDetailModel");
				this.getView().setModel(subitemModel, "subitemModel");
				this.attachModelEventHandlers(itemDetailModel);
				this.attachModelEventHandlers(subitemModel);
				oJsonModel.setData(sObj);
				this.getView().setModel(oJsonModel, "applicationModel");

				var subItemData = this.getView().getModel("subitemModel").getData();
				/*if (subItemData.length > 0) { //New Code Commented
					this.lastSubItm = subItemData[subItemData.length - 1].Bomsubno;
				}*/
				var itemDetailData = this.getView().getModel("itemDetailModel").getData();
				var tableData = [];
				var tableModel = new JSONModel();

				for (var i = 0; i < subItemData.length; i++) {
					if (subItemData[i].Posnr === itemDetailData.Bomitmpos) {
						var tempObj = {};
						tempObj.Posnr = subItemData[i].Posnr;
						tempObj.Bomitmnod = subItemData[i].Posnr;
						tempObj.Bomsubno = subItemData[i].Bomsubno;
						tempObj.Ebort = subItemData[i].Ebort;
						tempObj.Upmng = subItemData[i].Upmng;
						tempObj.Uptxt = subItemData[i].Uptxt;
						tempObj.subqtyState = subItemData[i].subqtyState;
						tempObj.intPointEnable = subItemData[i].intPointEnable;
						tempObj.subQtyEnable = subItemData[i].subQtyEnable;
						tempObj.subTextEnable = subItemData[i].subTextEnable;
						tableData.push(tempObj);
					}
				}
				tableModel.setData(tableData);
				this.getView().setModel(tableModel, "tableModel");
				this.attachModelEventHandlers(tableModel);

				if (tableData.length > 0) {
					this.lastSubItm = tableData[tableData.length - 1].Bomsubno;
				}

				if (this.mode === "request") {
					VisibleData.ItmDtlTxt = "";
					VisibleData.ItmDtlVisible = false;
					VisibleData.ItmCompVisible = false;
					VisibleData.CoProdVisible = false;
					VisibleData.QtyDataVisible = false;
					VisibleData.AddnlDataVisible = false;
					VisibleData.StrLocVisible = false;
					VisibleData.ProdSuplyVisible = false;
					VisibleData.MrpDataVisible = false;
					VisibleData.PurDataVisible = false;
					VisibleData.ItmTxtVisible = false;
					VisibleData.DocAssgnVisible = false;
					VisibleData.PurDataApprFieldsVis = false;
					VisibleData.ItmTxtApprFieldsVis = false;
					VisibleData.varsizeitmdataVisible = false;

					if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "SearchMaterialBom" || this.sFragmentName ===
						"changeMbom") {
						VisibleData.PurDataVisible = this.currentObj.matItem[index].Itemcat === 'N' ? true : false;
						VisibleData.ItmTxtVisible = this.currentObj.matItem[index].Itemcat === 'N' || this.currentObj.matItem[index].Itemcat === 'T' ?
							true : false;
						VisibleData.DocAssgnVisible = this.currentObj.matItem[index].Itemcat === 'D' ? true : false;
						VisibleData.varsizeitmdataVisible = this.currentObj.matItem[index].Itemcat === 'R' ? true : false;

						if (this.currentObj.matItem[index].Itemcat === 'D' || this.currentObj.matItem[index].Itemcat === 'T') {
							this.getView().byId("idPanelSubItm").setVisible(false);
						} else {
							this.getView().byId("idPanelSubItm").setVisible(true);
						}
					}
					if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "SearchEquipmentBom" || this.sFragmentName ===
						"changeEbom") {
						VisibleData.PurDataVisible = this.currentObj.eqItem[index].Itemcat === 'N' ? true : false;
						VisibleData.ItmTxtVisible = this.currentObj.eqItem[index].Itemcat === 'N' || this.currentObj.eqItem[index].Itemcat === 'T' ?
							true : false;
						VisibleData.DocAssgnVisible = this.currentObj.eqItem[index].Itemcat === 'D' ? true : false;
						VisibleData.varsizeitmdataVisible = this.currentObj.eqItem[index].Itemcat === 'R' ? true : false;

						if (this.currentObj.eqItem[index].Itemcat === 'D' || this.currentObj.eqItem[index].Itemcat === 'T') {
							this.getView().byId("idPanelSubItm").setVisible(false);
						} else {
							this.getView().byId("idPanelSubItm").setVisible(true);
						}
					}
					if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "SearchFLBom" || this.sFragmentName === "changeFlbom") {
						VisibleData.PurDataVisible = this.currentObj.flItem[index].Itemcat === 'N' ? true : false;
						VisibleData.ItmTxtVisible = this.currentObj.flItem[index].Itemcat === 'N' || this.currentObj.flItem[index].Itemcat === 'T' ?
							true : false;
						VisibleData.DocAssgnVisible = this.currentObj.flItem[index].Itemcat === 'D' ? true : false;
						VisibleData.varsizeitmdataVisible = this.currentObj.flItem[index].Itemcat === 'R' ? true : false;

						if (this.currentObj.eqItem[index].Itemcat === 'D' || this.currentObj.flItem[index].Itemcat === 'T') {
							this.getView().byId("idPanelSubItm").setVisible(false);
						} else {
							this.getView().byId("idPanelSubItm").setVisible(true);
						}
					}
					if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "SearchWBSBom" || this.sFragmentName === "changeWbsbom") {
						VisibleData.PurDataVisible = this.currentObj.wbsItem[index].Itemcat === 'N' ? true : false;
						VisibleData.ItmTxtVisible = this.currentObj.wbsItem[index].Itemcat === 'N' || this.currentObj.wbsItem[index].Itemcat === 'T' ?
							true : false;
						VisibleData.DocAssgnVisible = this.currentObj.wbsItem[index].Itemcat === 'D' ? true : false;
						VisibleData.varsizeitmdataVisible = this.currentObj.wbsItem[index].Itemcat === 'R' ? true : false;

						if (this.currentObj.wbsItem[index].Itemcat === 'D' || this.currentObj.wbsItem[index].Itemcat === 'T') {
							this.getView().byId("idPanelSubItm").setVisible(false);
						} else {
							this.getView().byId("idPanelSubItm").setVisible(true);
						}
					}

					if (itemDetailData.Itemcat === "N" && itemDetailData.Itemcomp === "") {
						itemDetailData.PGrpReq = true;
						itemDetailData.PrcReq = true;
						itemDetailData.PrcUnitReq = true;
						itemDetailData.MatGrpReq = true;
						itemDetailData.ItmTxt1Req = true;
					} else if (itemDetailData.Itemcat === "D") {
						itemDetailData.DocReq = true;
					} else if (itemDetailData.Itemcat === "R") {
						itemDetailData.Size1Req = true;
						itemDetailData.NumVarSizReq = true;
					} else if (itemDetailData.Itemcat === "T") {
						itemDetailData.ItmTxt1Req = true;
					}
					this.getView().getModel("itemDetailModel").refresh();
				} else {
					VisibleData.ItmDtlVisible = true;
					VisibleData.ItmCompVisible = true;
					VisibleData.QtyDataVisible = true;
					VisibleData.AddnlDataVisible = true;
					VisibleData.MrpDataVisible = true;
					VisibleData.ItmTxtVisible = true;
					VisibleData.ItmTxtApprFieldsVis = true;

					if (this.sFragmentName === "CreateMaterialBom" || this.sFragmentName === "SearchMaterialBom" || this.sFragmentName ===
						"changeMbom") {
						VisibleData.ItmDtlTxt = this.getResourceBundle().getText("MBOM_ITM_DET");
						VisibleData.RfpntVisible = true;
						VisibleData.PmassmblyVisible = false;
						VisibleData.CoProdVisible = true;
						VisibleData.StrLocVisible = false;
						VisibleData.ProdSuplyVisible = false;
						VisibleData.PurDataVisible = this.currentObj.matItem[index].Itemcat === 'N' ? true : false;
						VisibleData.PurDataApprFieldsVis = this.currentObj.matItem[index].Itemcat === 'N' ? true : false;
						VisibleData.DocAssgnVisible = this.currentObj.matItem[index].Itemcat === 'D' ? true : false;
						VisibleData.varsizeitmdataVisible = this.currentObj.matItem[index].Itemcat === 'R' ? true : false;
					}
					if (this.sFragmentName === "CreateEquipmentBom" || this.sFragmentName === "SearchEquipmentBom" || this.sFragmentName ===
						"changeEbom") {
						VisibleData.ItmDtlTxt = this.getResourceBundle().getText("EBOM_ITM_DET");
						VisibleData.RfpntVisible = false;
						VisibleData.PmassmblyVisible = true;

						VisibleData.CoProdVisible = false;
						VisibleData.StrLocVisible = true;
						VisibleData.ProdSuplyVisible = true;
						VisibleData.PurDataVisible = this.currentObj.eqItem[index].Itemcat === 'N' ? true : false;
						VisibleData.PurDataApprFieldsVis = this.currentObj.eqItem[index].Itemcat === 'N' ? true : false;
						VisibleData.DocAssgnVisible = this.currentObj.eqItem[index].Itemcat === 'D' ? true : false;
						VisibleData.varsizeitmdataVisible = this.currentObj.matItem[index].Itemcat === 'R' ? true : false;
					}
					if (this.sFragmentName === "CreateFLBom" || this.sFragmentName === "SearchFLBom" || this.sFragmentName === "changeFlbom") {
						VisibleData.ItmDtlTxt = this.getResourceBundle().getText("FLBOM_ITM_DET");
						VisibleData.RfpntVisible = false;
						VisibleData.PmassmblyVisible = true;

						VisibleData.CoProdVisible = false;
						VisibleData.StrLocVisible = false;
						VisibleData.ProdSuplyVisible = false;
						VisibleData.PurDataVisible = this.currentObj.flItem[index].Itemcat === 'N' ? true : false;
						VisibleData.PurDataApprFieldsVis = this.currentObj.flItem[index].Itemcat === 'N' ? true : false;
						VisibleData.DocAssgnVisible = this.currentObj.flItem[index].Itemcat === 'D' ? true : false;
						VisibleData.varsizeitmdataVisible = this.currentObj.matItem[index].Itemcat === 'R' ? true : false;
					}
					if (this.sFragmentName === "CreateWBSBom" || this.sFragmentName === "SearchWBSBom" || this.sFragmentName === "changeWbsbom") {
						VisibleData.ItmDtlTxt = this.getResourceBundle().getText("WBSBOM_ITM_DET");
						VisibleData.CoProdVisible = true;
						VisibleData.StrLocVisible = true;
						VisibleData.ProdSuplyVisible = true;
						VisibleData.PurDataVisible = this.currentObj.wbsItem[index].Itemcat === 'N' ? true : false;
						VisibleData.PurDataApprFieldsVis = this.currentObj.flItem[index].Itemcat === 'N' ? true : false;
						VisibleData.DocAssgnVisible = this.currentObj.wbsItem[index].Itemcat === 'D' ? true : false;
						VisibleData.varsizeitmdataVisible = this.currentObj.matItem[index].Itemcat === 'R' ? true : false;
					}
				}
				VisibleModel.setData(VisibleData);

			} else {
				return;
			}
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
		 * Function to handle 'select' of Status checks
		 * @param {sap.ui.base.Event} oEvent
		 */
		onStatusCheck: function (oEvent) {
			var sProperty = oEvent.getSource().getBindingInfo("selected").binding.sPath;
			sProperty = sProperty.split("/")[1];
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			if (sProperty === "Sanfe") {
				itemDetailData.Sanfe = formatter.revSatusSel(oEvent.getSource().getSelected());
			}
			if (sProperty === "Sanin") {
				itemDetailData.Sanin = formatter.revSatusSel(oEvent.getSource().getSelected());
			}
			if (sProperty === "Sanko") {
				itemDetailData.Sanko = formatter.revSatusSel(oEvent.getSource().getSelected());
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Purchase Organization
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onPrchseOrgVH: function (oEvent) {
			ValueHelpRequest.purchaseOrgValueHelp(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Purchase Organization
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onPrchseOrgChange: function (oEvent) {
			ValueHelpRequest.purchaseOrgChange(oEvent, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Purchase Group
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onPrchseGrpVH: function (oEvent) {
			ValueHelpRequest.purchaseGrpValueHelp(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Purchase Group
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onPrchseGrpChange: function (oEvent) {
			ValueHelpRequest.purchaseGrpChange(oEvent, this);
		},

		/*
		 * Simple Function to handle 'change' event
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onChangeSimple: function (oEvent) {
			oEvent.getSource().setValueState("None");

			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			if (itemDetailData.Itemcat === "T" || (itemDetailData.Itemcat === "N" && itemDetailData.Itemcomp === "")) {
				if (oEvent.getSource().getId().indexOf("itemTextLine1") > -1) {
					var sItmTxtVal = oEvent.getSource().getValue();
					if (sItmTxtVal !== "") {
						itemDetailData.Itmcmpdesc = sItmTxtVal;
						itemDetailData.ItmcmpdescEnabled = false;
					} else {
						itemDetailData.Itmcmpdesc = "";
						itemDetailData.ItmcmpdescEnabled = true;
					}
				}
			}
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Currency
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCrncyVH: function (oEvent) {
			ValueHelpRequest.crncyValueHelp(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Currency
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onCrncyChange: function (oEvent) {
			ValueHelpRequest.crncyChange(oEvent, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Material Group
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMatGrpVH: function (oEvent) {
			ValueHelpRequest.matGrpValueHelp(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Material Group
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMatGrpChange: function (oEvent) {
			ValueHelpRequest.matGrpChange(oEvent, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Document
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onDocumentVH: function (oEvent) {
			ValueHelpRequest.documentValueHelp(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Document
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onDocumentChange: function (oEvent) {
			ValueHelpRequest.documentChange(oEvent, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Size Unit
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onSizeUnitVH: function (oEvent) {
			ValueHelpRequest.sizeunitValueHelp(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Size Unit
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onSizeUnitChange: function (oEvent) {
			ValueHelpRequest.sizeunitChange(oEvent, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Formula Key
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onFormaulaKeyVH: function (oEvent) {
			ValueHelpRequest.formulakeyValueHelp(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Formula Key
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onFormaulaKeyChange: function (oEvent) {
			ValueHelpRequest.formulakeyChange(oEvent, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Quantity Var-Size
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onQtyVarUnitVH: function (oEvent) {
			ValueHelpRequest.qtyVarUnitValueHelp(oEvent, this);
		},

		/*
		 * Function to handle 'change' event of Quantity Var-Size
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onQtyVarUnitChange: function (oEvent) {
			ValueHelpRequest.qtyVarUnitChange(oEvent, this);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Spare part indicator
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onSpareVH: function (oEvent) {
			var g = this;

			var settings = {
				title: this.getView().getModel("i18n").getProperty("SPARE_PART"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/bomspidvhSet",
					template: new sap.m.StandardListItem({
						title: "{Erskz}",
						description: "{Etext}"
					})
				},
				confirm: function (E) {
					var itemDetailModel = g.getView().getModel("itemDetailModel");
					var itemDetailData = itemDetailModel.getData();
					itemDetailData.Erskz = E.getParameters().selectedItem.getProperty("title");
					itemDetailData.Etext = E.getParameters().selectedItem.getProperty("description");
					itemDetailModel.setData(itemDetailData);
				}
			};

			var q = "/bomspidvhSet";
			var M = this.getView().getModel("valueHelp");
			var SpareSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Erskz", "Etext");
			SpareSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			SpareSelectDialog.open();
		},

		handleSpareConfirm: function (E) {
			var g = this.getParent().getController();
			var itemDetailModel = g.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			itemDetailData.Erskz = E.getParameters().selectedItem.getProperty("title");
			itemDetailData.Etext = E.getParameters().selectedItem.getProperty("description");
			itemDetailModel.setData(itemDetailData);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Relevancy of costing
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onRelVH: function (oEvent) {
			var g = this;
			var settings = {
				title: this.getView().getModel("i18n").getProperty("REL_COST"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/bomcostrelvhSet",
					template: new sap.m.StandardListItem({
						title: "{SELKZ}",
						description: "{STEXT}"
					})
				},
				confirm: function (E) {
					var itemDetailModel = g.getView().getModel("itemDetailModel");
					var itemDetailData = itemDetailModel.getData();
					itemDetailData.Costgrelv = E.getParameters().selectedItem.getProperty("title");
					itemDetailData.Stext = E.getParameters().selectedItem.getProperty("description");
					itemDetailModel.setData(itemDetailData);
				}
			};

			var q = "/bomcostrelvhSet";
			var M = this.getView().getModel("valueHelp");
			var CostRelSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "SELKZ", "STEXT");
			CostRelSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			CostRelSelectDialog.open();

		},

		handleCostRelConfirm: function (E) {
			var g = this.getParent().getController();
			var itemDetailModel = g.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			itemDetailData.Costgrelv = E.getParameters().selectedItem.getProperty("title");
			itemDetailData.Stext = E.getParameters().selectedItem.getProperty("description");
			itemDetailModel.setData(itemDetailData);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Relevant of sales
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onRelSaleVH: function (oEvent) {
			var g = this;
			var settings = {
				title: this.getView().getModel("i18n").getProperty("REL_SALES"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/bomrelsalesSet",
					template: new sap.m.StandardListItem({
						title: "{RVREL}",
						description: "{BEZEI}"
					})
				},
				confirm: function (E) {
					// var g = this.getParent().getController();
					var itemDetailModel = g.getView().getModel("itemDetailModel");
					var itemDetailData = itemDetailModel.getData();
					itemDetailData.Rvrel = E.getParameters().selectedItem.getProperty("title");
					itemDetailData.Bezei = E.getParameters().selectedItem.getProperty("description");
					itemDetailModel.setData(itemDetailData);
				}
			};

			var q = "/bomrelsalesSet";
			var M = this.getView().getModel("valueHelp");
			var SaleRelSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "RVREL", "BEZEI");
			SaleRelSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			SaleRelSelectDialog.open();
		},

		handleSaleRelConfirm: function (E) {
			var g = this.getParent().getController();
			var itemDetailModel = g.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			itemDetailData.Rvrel = E.getParameters().selectedItem.getProperty("title");
			itemDetailData.Bezei = E.getParameters().selectedItem.getProperty("description");
			itemDetailModel.setData(itemDetailData);
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
		 * Function to handle 'change' event of Spare part indicator, Relevancy of costing & Relevant of sales
		 * @param {sap.ui.base.Event} oEvent
		 */
		onStatusChange: function (oEvent) {
			var sProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			sProperty = sProperty.split("/")[1];

			switch (sProperty) {
			case "Erskz":
				this.handleSpareChange(oEvent);
				break;
			case "Costgrelv":
				this.handleCostRelChange(oEvent);
				break;
			case "Rvrel":
				this.handleSaleRelChange(oEvent);
				break;
			}
		},

		/*
		 * Method to handle Spare part indicator change
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleSpareChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("NewModel");
			var itemDetailModel = g.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			var sourceID = oEvent.getSource().getId();

			if (newValue != "") {
				var c = newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("Erskz", "EQ", c)];
				M.read("/bomspidvhSet", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Erskz = d.results[0].Erskz;
							itemDetailData.Etext = d.results[0].Etext;
							sap.ui.getCore().byId(sourceID).setValueState("None");
						} else {
							itemDetailData.Erskz = "";
							itemDetailData.Etext = "";
							//oEvent.getSource().setValueStateText("Invalid Entry");
							sap.ui.getCore().byId(sourceID).setValueState("Error");
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						sap.ui.getCore().byId(sourceID).setValueStateText(d);
						sap.ui.getCore().byId(sourceID).setValueState("Error");
					}
				});
			}
		},

		/*
		 * Method to handle Relevancy of costing change
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleCostRelChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("NewModel");
			var itemDetailModel = g.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			var sourceID = oEvent.getSource().getId();

			if (newValue != "") {
				var c = (c === "0") ? " " : newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("SELKZ", "EQ", c)];
				M.read("/bomcostrelvhSet", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Costgrelv = d.results[0].SELKZ;
							itemDetailData.Stext = d.results[0].STEXT;
							sap.ui.getCore().byId(sourceID).setValueState("None");
						} else {
							itemDetailData.Costgrelv = "";
							itemDetailData.Stext = "";
							//oEvent.getSource().setValueStateText("Invalid Entry");
							sap.ui.getCore().byId(sourceID).setValueState("Error");
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						sap.ui.getCore().byId(sourceID).setValueStateText(d);
						sap.ui.getCore().byId(sourceID).setValueState("Error");
					}
				});
			}
		},

		/*
		 * Method to handle Relevant of sales change
		 * @param {sap.ui.base.Event} oEvent
		 */
		handleSaleRelChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("NewModel");
			var itemDetailModel = g.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();
			var sourceID = oEvent.getSource().getId();

			if (newValue != "") {
				var c = (c === "0") ? " " : newValue.toUpperCase();
				var oFilter = [new sap.ui.model.Filter("RVREL", "EQ", c)];
				M.read("/bomrelsalesSet", {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							itemDetailData.Rvrel = d.results[0].RVREL;
							itemDetailData.Bezei = d.results[0].BEZEI;
							sap.ui.getCore().byId(sourceID).setValueState("None");
						} else {
							itemDetailData.Rvrel = "";
							itemDetailData.Bezei = "";
							//oEvent.getSource().setValueStateText("Invalid Entry");
							sap.ui.getCore().byId(sourceID).setValueState("Error");
						}
						itemDetailModel.setData(itemDetailData);
					},
					error: function (e) {
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						sap.ui.getCore().byId(sourceID).setValueStateText(d);
						sap.ui.getCore().byId(sourceID).setValueState("Error");
					}
				});
			}
		},

		/*
		 * Method to add new Sub-Item
		 */
		addSubItem: function () {
			var itemDetailModel = this.getView().getModel("itemDetailModel");
			var itemDetailData = itemDetailModel.getData();

			var subitemModel = this.getView().getModel("subitemModel");
			var subitemData = [];
			if (subitemModel !== undefined) {
				subitemData = subitemModel.getData();
			}
			var tableData = [];
			var tableModel = new JSONModel();

			for (var i = 0; i < subitemData.length; i++) {
				if (subitemData[i].Posnr === itemDetailData.Bomitmpos) {
					var tempObj = {};
					tempObj.Posnr = subitemData[i].Posnr;
					tempObj.Bomitmnod = subitemData[i].Posnr;
					tempObj.Bomsubno = subitemData[i].Bomsubno;
					tempObj.Ebort = subitemData[i].Ebort;
					tempObj.Upmng = subitemData[i].Upmng;
					tempObj.Uptxt = subitemData[i].Uptxt;
					tempObj.subqtyState = subitemData[i].subqtyState;
					tableData.push(tempObj);
				}
			}

			if (tableData !== null && tableData.length !== 0) {
				var leng = tableData.length;
				var oldNo = parseInt(tableData[leng - 1].Bomsubno);
				var lastNo = 0;
				if (this.lastSubItm && this.sFragmentName.indexOf("Search") > -1) {
					lastNo = parseInt(this.lastSubItm);
				}
				//var newNo = parseInt(oldNo) + 1;
				var newNo = (oldNo > lastNo) ? oldNo + 1 : lastNo + 1;

				while (newNo.toString().length < 4) {
					newNo = "0" + newNo;
				}
				var sObj = {
					Bomitmnod: itemDetailData.Bomitmpos,
					Posnr: itemDetailData.Bomitmpos,
					Bomsubno: newNo,
					Ebort: "",
					Upmng: "",
					Uptxt: "",
					subqtyState: "None"
				};
				tableData.push(sObj);
				tableModel.setData(tableData);
				subitemData.push(sObj);
				subitemModel.setData(subitemData);
				this.getView().setModel(tableModel, "tableModel");
			} else {
				var sObj = {
					Bomitmnod: itemDetailData.Bomitmpos,
					Posnr: itemDetailData.Bomitmpos,
					Bomsubno: "0001",
					Ebort: "",
					Upmng: "",
					Uptxt: "",
					subqtyState: "None"
				};
				tableData.push(sObj);
				tableModel.setData(tableData);
				subitemData.push(sObj);
				subitemModel.setData(subitemData);
				this.getView().setModel(tableModel, "tableModel");
			}
		},

		/*
		 * Method to handle Sub-Item delete
		 * @param {sap.ui.base.Event} event
		 */
		handleSubItemDlt: function (event) {
			var src = event.getSource();
			var path = event.getParameter('listItem').getBindingContext("tableModel").sPath;
			path = path.substring(path.lastIndexOf('/') + 1);
			var model = src.getModel("tableModel");
			var data = model.getProperty('/');
			var subItm = this.getView().getModel("tableModel").getData();
			var subitemModel = this.getView().getModel("subitemModel");
			var subitemData = [];
			if (subitemModel !== undefined) {
				subitemData = subitemModel.getData();
			}

			for (var i = 0; i < subitemData.length; i++) {
				if (data[parseInt(path)].Posnr === subitemData[i].Posnr && data[parseInt(path)].Bomsubno === subitemData[i].Bomsubno) {
					subitemData.splice(i, 1);
				}
			}
			subitemModel.setData(subitemData);

			for (var i = 0; i < subItm.length; i++) {
				if (data[parseInt(path)].Posnr === subItm[i].Posnr && data[parseInt(path)].Bomsubno === subItm[i].Bomsubno) {
					subItm.splice(i, 1);
				}
			}
			this.getView().getModel("tableModel").setData(subItm);

			//06.08
			if (this.sFragmentName.indexOf("Search") > -1) {
				this.oModelUpdateFlag = true;
				sap.ui.getCore().setModel({
					updateFlag: this.oModelUpdateFlag
				}, "oModelUpdateFlag");
			}
		},

		/*
		 * Function to handle 'change' event of Installation Point, Sub-Item Quantity & Sub-Item Text
		 * @param {sap.ui.base.Event} oEvent
		 */
		onSubItemChange: function (oEvent) {
			var sProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var value = oEvent.getParameters().newValue;
			var sPath = oEvent.getSource().getBindingContext("tableModel").sPath;
			var index = parseInt(sPath.substr(1));
			var subitemdata = this.getView().getModel("subitemModel").getData();
			var tableModel = this.getView().getModel("tableModel");
			var tableData = tableModel.getData();
			if (sProperty === "Upmng") {
				if (value !== "") {
					if (isNaN(value)) {
						tableData[index].Upmng = "";
						tableData[index].subqtyState = "Error";
						tableModel.setData(tableData);
						this.getView().setModel(tableModel, "tableModel");
						for (var i = 0; i < subitemdata.length; i++) {
							if (subitemdata[i].Bomitmnod === tableData[index].Bomitmnod && subitemdata[i].Bomsubno === tableData[index].Bomsubno) {
								subitemdata[i].Upmng = "";
								subitemdata[i].subqtyState = "Error";
							}
						}
					} else {
						tableData[index].Upmng = value;
						tableData[index].subqtyState = "None";
						tableModel.setData(tableData);
						this.getView().setModel(tableModel, "tableModel");
						for (var i = 0; i < subitemdata.length; i++) {
							if (subitemdata[i].Bomitmnod === tableData[index].Bomitmnod && subitemdata[i].Bomsubno === tableData[index].Bomsubno) {
								subitemdata[i].Upmng = value;
								subitemdata[i].subqtyState = "None";
							}
						}
					}
				} else {
					tableData[index].subqtyState = "Error";
					tableModel.setData(tableData);
					this.getView().setModel(tableModel, "tableModel");
					for (var i = 0; i < subitemdata.length; i++) {
						if (subitemdata[i].Bomitmnod === tableData[index].Bomitmnod && subitemdata[i].Bomsubno === tableData[index].Bomsubno) {
							subitemdata[i].Upmng = "";
							subitemdata[i].subqtyState = "Error";
						}
					}
				}
			}

			if (sProperty === "Ebort") {
				if (value !== "") {
					tableData[index].Ebort = value;
					tableModel.setData(tableData);
					this.getView().setModel(tableModel, "tableModel");
					for (var i = 0; i < subitemdata.length; i++) {
						if (subitemdata[i].Bomitmnod === tableData[index].Bomitmnod && subitemdata[i].Bomsubno === tableData[index].Bomsubno) {
							subitemdata[i].Ebort = value;
						}
					}
				}
			}

			if (sProperty === "Uptxt") {
				if (value !== "") {
					tableData[index].Uptxt = value;
					tableModel.setData(tableData);
					this.getView().setModel(tableModel, "tableModel");
					for (var i = 0; i < subitemdata.length; i++) {
						if (subitemdata[i].Bomitmnod === tableData[index].Bomitmnod && subitemdata[i].Bomsubno === tableData[index].Bomsubno) {
							subitemdata[i].Uptxt = value;
						}
					}
				}
			}
			if (this.sFragmentName.indexOf("Search") > -1) {
				this.oModelUpdateFlag = true;
				sap.ui.getCore().setModel({
					updateFlag: this.oModelUpdateFlag
				}, "oModelUpdateFlag");
			}
		},

		/*
		 * Function to handle DONE press
		 * @param {sap.ui.base.Event} oEvent
		 */
		onItmDonePress: function (oEvent) {
			var sSourceId = oEvent.getSource().getId();
			if (this.mode === "request" && this.sCrStatus !== "true") {
				var itemDetailData = this.getView().getModel("itemDetailModel").getData();
				var itFlag = false;

				if (itemDetailData.PGrpReq === true && (itemDetailData.Ekgrp === "" || itemDetailData.PGrpVS === "Error")) {
					itemDetailData.PGrpVS = "Error";
					itFlag = true;
				}
				if (itemDetailData.PrcReq === true) {
					if (itemDetailData.Preis === "" || itemDetailData.PriceVS === "Error") {
						itemDetailData.PriceVS = "Error";
						itFlag = true;
					}
					if (itemDetailData.Waers === "" || itemDetailData.CrncyVS === "Error") {
						itemDetailData.CrncyVS = "Error";
						itFlag = true;
					}
				}
				if (itemDetailData.PrcUnitReq === true && (itemDetailData.Peinh === "" || itemDetailData.PrcUnitVS === "Error")) {
					itemDetailData.PrcUnitVS = "Error";
					itFlag = true;
				}
				if (itemDetailData.MatGrpReq === true && (itemDetailData.Matkl === "" || itemDetailData.MatGrpVS === "Error")) {
					itemDetailData.MatGrpVS = "Error";
					itFlag = true;
				}
				if (itemDetailData.ItmTxt1Req === true && (itemDetailData.Potx1 === "" || itemDetailData.ItmTxt1VS === "Error")) {
					itemDetailData.ItmTxt1VS = "Error";
					itFlag = true;
				}
				if (itemDetailData.DocReq === true && (itemDetailData.Bomdocitm === "" || itemDetailData.DocVS === "Error")) {
					itemDetailData.DocVS = "Error";
					itFlag = true;
				}
				if (itemDetailData.Size1Req === true && (itemDetailData.Roms1 === "" || itemDetailData.Romei === "")) {
					itFlag = true;
				}
				if (itemDetailData.NumVarSizReq === true && itemDetailData.Roanz === "") {
					itFlag = true;
				}

				var tableData = this.getView().getModel("tableModel").getData();
				var totalQty = 0;
				if (tableData !== null && tableData.length !== 0) {
					for (var i = 0; i < tableData.length; i++) {
						totalQty = totalQty + parseInt(tableData[i].Upmng);
					}
				} else {
					totalQty = itemDetailData.Itmqty;
				}

				if (tableData && tableData.length > 0) {
					for (var j = 0; j < tableData.length; j++) {
						if (tableData[j].Upmng === "") {
							tableData[j].subqtyState = "Error";
							itFlag = true;
						}
						if (Number(tableData[j].Upmng) === 0) {
							tableData[j].subqtyState = "Error";
							var smsg = this.getView().getModel("i18n").getProperty("QTY_ERR");
							this.createMessagePopover(smsg, "Error");
							// sap.m.MessageBox.show(smsg, {
							// 	title: "Error",
							// 	icon: sap.m.MessageBox.Icon.ERROR,
							// 	onClose: function (oAction) {
							// 	}
							// });
							return;
						}
					}
				}

				if (itemDetailData.Pmpfe === "+" && itemDetailData.Sanfe === false)
					itFlag = true;
				if (itemDetailData.Pmpin === "+" && itemDetailData.Sanin === false)
					itFlag = true;
				if (itemDetailData.Pmpko === "+" && itemDetailData.Sanko === false)
					itFlag = true;

				if (itFlag) {
					this.getView().getModel("itemDetailModel").refresh();
					var _msg = this.getView().getModel("i18n").getProperty("MANDMSG");
					this.createMessagePopover(_msg, "Error");
					// sap.m.MessageBox.show(_msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function (oAction) {
					// 	}
					// });
					return;
				}
				itemDetailData.Itmqty = totalQty.toString();
				if (itemDetailData.Itmqty === "0") {
					itemDetailData.itmQtyEnable = true;
				} else if (tableData.length === 0) { //08.09
					itemDetailData.itmQtyEnable = true;
					itemDetailData.itmCatEnable = false;
				} else {
					itemDetailData.itmQtyEnable = false;
					itemDetailData.itmCatEnable = false;
				}

				if (sSourceId.indexOf("idBtnCheck") > -1) {
					this.validateCheck();
					return;
				}

				var refreshModel = sap.ui.getCore().getModel("refreshModel");
				refreshModel.setProperty('/refresh', false);

				if (this.sFragmentName === "SearchMaterialBom" || this.sFragmentName === "changeMbom" || this.sFragmentName ===
					"SearchEquipmentBom" || this.sFragmentName === "changeEbom" || this.sFragmentName ===
					"SearchFLBom" || this.sFragmentName === "changeFlbom" || this.sFragmentName === "SearchWBSBom" || this.sFragmentName ===
					"changeWbsbom") {
					sap.ui.getCore().setModel({
						updateFlag: this.oModelUpdateFlag
					}, "oModelUpdateFlag");
				}
			} else {
				if (this.sFragmentName.indexOf("Search") > -1) {
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty('/refresh', false);
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
			var sAIWData = sap.ui.getCore().getModel("BOMDetailModel").getData();
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

				if (sAIWData.matItem) {
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
				}

				if (sAIWData.matSubItem) {
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

				if (sAIWData.eqItem) {
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
						if (sAIWData.bomType === "Change") { //13.08
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
				}

				if (sAIWData.eqSubItem) {
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

				if (sAIWData.flItem) {
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
						if (sAIWData.bomType === "Change") { //13.08
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
				}

				if (sAIWData.flSubItem) {
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

				if (sAIWData.wbsItem) {
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
				}

				if (sAIWData.wbsSubItem) {
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
			}

			// this.getView().byId("detailPage").setBusy(true);
			var oBusyDialog = new BusyDialog();
			oBusyDialog.open();
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					// g.getView().byId("detailPage").setBusy(false);
					oBusyDialog.close();
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
					oBusyDialog.close();
					// g.getView().byId("detailPage").setBusy(false);
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

		onSizeChange: function () {
			this.readSizeDetails();
		},

		readSizeDetails: function () {
			var g = this;
			var q;
			// var itemDetailModel = this.getView().getModel("itemDetailModel");
			var sAIWData = sap.ui.getCore().getModel("BOMDetailModel").getData();
			var itemDetailData = this.getView().getModel("itemDetailModel").getData();
			var M = this.getView().getModel();
			var sStalt = sAIWData.Stalt ? sAIWData.Stalt : '';

			var aFilter = [new sap.ui.model.Filter("Matnr", "EQ", sAIWData.Matnr),
				new sap.ui.model.Filter("Werks", "EQ", sAIWData.Werks),
				new sap.ui.model.Filter("Stlan", "EQ", sAIWData.Stlan),
				new sap.ui.model.Filter("Stalt", "EQ", sStalt),
				new sap.ui.model.Filter("Postp", "EQ", itemDetailData.Itemcat),
				new sap.ui.model.Filter("Component", "EQ", itemDetailData.Itemcomp),
				new sap.ui.model.Filter("Menge", "EQ", itemDetailData.Itmqty),
				new sap.ui.model.Filter("Romei", "EQ", itemDetailData.Romei),
				new sap.ui.model.Filter("Roms1", "EQ", itemDetailData.Roms1),
				new sap.ui.model.Filter("Roms2", "EQ", itemDetailData.Roms2),
				new sap.ui.model.Filter("Roms3", "EQ", itemDetailData.Roms3),
				new sap.ui.model.Filter("Rform", "EQ", itemDetailData.Rform),
				new sap.ui.model.Filter("Roanz", "EQ", itemDetailData.Roanz),
				new sap.ui.model.Filter("Romen", "EQ", itemDetailData.Romen),
				new sap.ui.model.Filter("Rokme", "EQ", itemDetailData.Rokme)
			];

			this.BusyDialog.open();
			M.read("/DeriveBOMITMSet", {
				filters: aFilter,
				success: function (re) {
					g.BusyDialog.close();
					var res = re.results[0];
					itemDetailData.Roms1 = res.Roms1;
					itemDetailData.Romei = res.Romei;
					itemDetailData.Roms2 = res.Roms2;
					itemDetailData.Roms3 = res.Roms3;
					itemDetailData.Rform = res.Rform;
					// itemDetailData.FrmlaKeyDesc = res.Itemcat;
					itemDetailData.Roanz = res.Roanz;
					// itemDetailData.numVarSizeDesc = res.Itemcat;
					itemDetailData.Romen = res.Romen;
					itemDetailData.Rokme = res.Rokme;

					g.getView().getModel("itemDetailModel").refresh();
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
	});
});