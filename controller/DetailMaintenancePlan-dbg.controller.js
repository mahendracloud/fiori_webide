/*global location history */
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"sap/ui/core/message/Message"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, ValueHelpRequest, ValueHelpProvider, Message) {
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailMaintenancePlan", {

		formatter: formatter,
		detailFlag: true,
		index: -1,
		oAttach: [],
		colItems: "",
		colItemsT: "",
		maintCycle: "",
		oFileUpload: "",
		maintItems: "",
		counter: "",
		spSelectDialog: undefined,
		fSelectDialog: undefined,
		ntSelectDialog: undefined,
		otSelectDialog: undefined,
		cuSelectDialog: undefined,
		coSelectDialog: undefined,
		plpSelectDialog: undefined,
		plgpSelectDialog: undefined,
		wcSelectDialog: undefined,
		wcpSelectDialog: undefined,
		strSearchResults: undefined,
		strSelectDialog: undefined,
		csSelectDialog: undefined,
		csSearchResults: undefined,
		mItemSelectDialog: undefined,
		mItemResults: undefined,
		counterUnit: "",
		cycleUnit: "",
		stratUnit: "",
		system: "",
		classType: "",
		_class: "",
		defaultCharArr: [],
		charValueArr: [],
		lArray: [],
		singleVal: "",
		charValue: "",
		cPath: "",
		sPath: "",
		resultArr: [],
		charFlag: "",

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ugiaiwui.mdg.aiw.request.view.DetailMaintenancePlan
		 */
		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			this.getRouter().getRoute("detailMpmi").attachPatternMatched(this._onRouteMatched, this);
			// var serviceUrl = this._oComponent.getModel().sServiceUrl;
			// var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	loadMetadataAsync: true,
			// 	refreshAfterChange: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// var vhServiceUrl = this._oComponent.getModel("NewModel").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	loadMetadataAsync: true,
			// 	refreshAfterChange: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(oModel);
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

			this.oAttach = [];
			this.oModelUpdateFlag = false;
			this.oModelName = "AIWMPMI";

			this.getView().setModel(new JSONModel([]), this.oModelName);
			this.getModel(this.oModelName).setProperty("/itemModel", []);
			this.readMaintPlanCat();

			var sObj = {
				titleName: this.getOwnerComponent().getModel("i18n").getProperty("createMpmiTitle"),
				visible: false,
				enabled: true
			};
			var sApproveData = {
				createVisible: true,
				approveVisible: false,
				tlGroupVisible: true,
				tlGroupEnabled: true,
				objLstItmTableMode: "MultiSelect"
			};
			this.getView().setModel(new JSONModel(sObj), "mainView");
			this.getView().setModel(new JSONModel(sApproveData), "ApproveModel");
			sap.ui.getCore().setModel(new JSONModel(sObj), "mainView");
			sap.ui.getCore().setModel(new JSONModel(sApproveData), "ApproveModel");

			var sItemStatus = {
				itemStatus: false,
				oModelUpdateFlag: false
			};
			sap.ui.getCore().setModel(new JSONModel(sItemStatus), "AIWMPMIStatus");
			// this.obj = this._oComponent.getComponentData().startupParameters.OBJ[0];
			// this.cReqType = this._oComponent.getComponentData().startupParameters.USMD_CREQ_TYPE[0];
			// this._initializeAttachments();

			var classFragmentId = this.getView().createId("clsFrag");
			var itemFragmentId = this.getView().createId("charFrag");
			var lamFragmentId = this.getView().createId("lamFrag");
			this.class = sap.ui.core.Fragment.byId(classFragmentId, "assignmentTab");
			this.char = sap.ui.core.Fragment.byId(itemFragmentId, "characteristicsTab");

			this.getClassType(this);

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
		},

		/*
		 * Function to handle 'attachPatternMatched' of DetailBOM controller
		 * @param {sap.ui.base.Event} oEvent
		 * @public
		 */
		_onRouteMatched: function (oEvent) {
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "detailMpmi") {
				var sItemStatus = sap.ui.getCore().getModel("AIWMPMIStatus").getData().itemStatus;

				if (sItemStatus) {
					var sModelUpdateFlag = sap.ui.getCore().getModel("AIWMPMIStatus").getData().oModelUpdateFlag;
					var sItemData = sap.ui.getCore().getModel("AIWMPMIDetail").getProperty("/itemModel");
					this.oModelUpdateFlag = sModelUpdateFlag;
					this.getView().getModel(this.oModelName).setProperty("/itemModel", sItemData);
					sap.ui.getCore().getModel("AIWMPMI").getProperty(this.rowIndex).itemModel = sItemData;
					sap.ui.getCore().setModel(new JSONModel({
						itemStatus: false,
						oModelUpdateFlag: false
					}), "AIWMPMIStatus");
				} else {
					this.rowIndex = decodeURIComponent(oEvent.getParameter("arguments").Path);
					this.viewName = oEvent.getParameter("arguments").ViewName;
					this.oModelUpdateFlag = false;

					var oMainViewModel = this.getView().getModel("mainView");
					var sApproveModel = this.getView().getModel("ApproveModel");
					var oMainViewData = oMainViewModel.getData();
					var sApproveData = sApproveModel.getData();
					var oJsonModel = new JSONModel();
					oMainViewData.enabled = true;
					this.getView().byId("idBtnCheck").setVisible(true);

					if (sap.ui.getCore().getModel("refreshModel") !== undefined) {
						var refreshModel = sap.ui.getCore().getModel("refreshModel");
						refreshModel.setProperty("/refreshSearch", false);
					}

					var oAttachModel = sap.ui.getCore().getModel("ClassAttachRequest");
					var oAttachData = oAttachModel.getData();
					if (oAttachData.attachMpmiFlag) {
						this.attachRequest();
						oAttachData.attachMpmiFlag = false;
						oAttachModel.setData(oAttachData);
					}

					var sClassData = [],
						sCharData = [],
						sCharNewButton;
					var sClassNewButton = true;

					if (this.viewName === "CreateMpmi") {
						oJsonModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex));
						this.CrStatus = false;
						this.stratUnit = oJsonModel.getData().Unitc;
						this.backUpCycleType = oJsonModel.getData().cycleType;
						this.backUpStich = oJsonModel.getData().Stich;
						this.backUpMehrfach = oJsonModel.getData().Mehrfach;
						this.getView().setModel(oJsonModel, this.oModelName);

						if (oJsonModel.getData().viewParameter === "change") {
							if (oJsonModel.getData().Strat === "" || oJsonModel.getData().Strat === undefined) {
								oJsonModel.getData().StratEnabled = true;
							} else {
								oJsonModel.getData().StratEnabled = false;
							}
							if (oJsonModel.getData().Mehrfach === "" || oJsonModel.getData().Mehrfach === undefined) {
								oJsonModel.getData().MehrfachEnabled = true;
							} else {
								oJsonModel.getData().MehrfachEnabled = false;
							}
							if (oJsonModel.getData().Wset === "" || oJsonModel.getData().Wset === undefined) {
								oJsonModel.getData().WsetEnabled = true;
							} else {
								oJsonModel.getData().WsetEnabled = false;
							}
							oJsonModel.getData().WarplEnabled = false;
							oJsonModel.getData().MptypEnabled = false;
							oJsonModel.getData().HorizVisible = false;
							oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("changeMpmi");
						} else {
							oJsonModel.getData().WarplEnabled = true;
							oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("createMpmi");
						}
						var sLength = this.getView().getModel(this.oModelName).getProperty("/itemModel").length;
						if (sLength <= 0) {
							this.maintenanceItems();
						}

						sClassData = oJsonModel.getData().classItems;
						this.chData = oJsonModel.getData().characteristics;
						if (this.chData.length > 0) {
							if (sClassData.length > 0) {
								for (var j = 0; j < this.chData.length; j++) {
									if (sClassData[0].Class === this.chData[j].Class) {
										sCharData.push(this.chData[j]);
									}
								}
							}
						}
						sCharNewButton = oJsonModel.getData().charNewButton;
					}

					if (this.viewName === "ChangeMpmi") {
						this.CrStatus = oEvent.getParameter("arguments").CrStatus;
						var sMplan = oEvent.getParameter("arguments").Mplan;
						oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("changeMpmi");

						if (this.CrStatus === "true") {
							oMainViewData.enabled = false;
							sClassNewButton = false;
							sCharNewButton = false;
						}

						this.sExistFlag = false;
						var oMatchItem;
						var oModelData = sap.ui.getCore().getModel(this.oModelName).getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].Warpl === sMplan) {
									oMatchItem = i;
									this.sExistFlag = true;
									break;
								}
							}
						}

						if (this.sExistFlag) {
							var sCycleLengthA = oModelData[oMatchItem].cycleModel.lenth;
							for (var c1 = 0; c1 < sCycleLengthA; c1++) {
								oModelData[oMatchItem].cycleModel[c1].Zykl1Enabled = false;
								oModelData[oMatchItem].cycleModel[c1].ZeiehEnabled = false;
								oModelData[oMatchItem].cycleModel[c1].PakTextEnabled = false;
								oModelData[oMatchItem].cycleModel[c1].OffsetEnabled = false;
								oModelData[oMatchItem].cycleModel[c1].PointEnabled = false;
								oModelData[oMatchItem].cycleModel[c1].CycleseqiEnabled = false;
							}

							oModelData[oMatchItem].HorizVisible = false;
							oModelData[oMatchItem].FabklEnabled = false;
							oModelData[oMatchItem].WarplEnabled = false;
							oModelData[oMatchItem].MptypEnabled = false;
							oModelData[oMatchItem].StratEnabled = false;
							oModelData[oMatchItem].WsetEnabled = false;
							oModelData[oMatchItem].MehrfachEnabled = false;
							this.stratUnit = oModelData[oMatchItem].Unitc;
							this.getView().setModel(new JSONModel(oModelData[oMatchItem]), this.oModelName);

							sClassData = oModelData[oMatchItem].classItems;
							// sCharData = oModelData[oMatchItem].characteristics;
							this.chData = oModelData[oMatchItem].characteristics;
							if (this.chData.length > 0) {
								if (sClassData.length > 0) {
									for (var j = 0; j < this.chData.length; j++) {
										if (sClassData[0].Class === this.chData[j].Class) {
											sCharData.push(this.chData[j]);
										}
									}
								}
							}
							sCharNewButton = oModelData[oMatchItem].charNewButton;
						} else {
							this.readMaintenancePlanData(sMplan, this.CrStatus);
						}
					}

					if (this.viewName === "Approve") {
						this.getView().byId("idBtnCheck").setVisible(false);
						oJsonModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex));
						var sCycleLengthB = oJsonModel.getData().cycleModel.lenth;
						for (var c2 = 0; c2 < sCycleLengthB; c2++) {
							oJsonModel.getData().cycleModel[c2].Zykl1Enabled = false;
							oJsonModel.getData().cycleModel[c2].ZeiehEnabled = false;
							oJsonModel.getData().cycleModel[c2].PakTextEnabled = false;
							oJsonModel.getData().cycleModel[c2].OffsetEnabled = false;
							oJsonModel.getData().cycleModel[c2].PointEnabled = false;
							oJsonModel.getData().cycleModel[c2].CycleseqiEnabled = false;
						}

						oJsonModel.getData().WarplEnabled = false;
						oJsonModel.getData().FabklEnabled = false;
						oJsonModel.getData().MptypEnabled = false;
						oJsonModel.getData().StratEnabled = false;
						oJsonModel.getData().WsetEnabled = false;
						oJsonModel.getData().MehrfachEnabled = false;

						if (oJsonModel.getData().Mehrfach === true || (oJsonModel.getData().Wset !== "" || oJsonModel.getData() !== undefined)) {
							oJsonModel.getData().HorizVisible = false;
						} else {
							oJsonModel.getData().HorizVisible = true;
						}

						this.getView().setModel(oJsonModel, this.oModelName);
						this.CrStatus = false;

						var AIWAPPROVE = new JSONModel();
						var pApproveData = sap.ui.getCore().getModel("AIWAPPROVE").getProperty("/AIWMPMI" + this.rowIndex);
						AIWAPPROVE.setData(pApproveData);
						this.getView().setModel(AIWAPPROVE, "AIWAPPROVE");

						oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("approveMpmi");
						oMainViewData.enabled = false;
						sApproveData.createVisible = false;
						sApproveData.approveVisible = true;
						sApproveData.tlGroupEnabled = false;
					}

					var classFragmentId = this.getView().createId("clsFrag");
					var newHeaderBtn = sap.ui.core.Fragment.byId(classFragmentId, "newHeader");
					newHeaderBtn.setEnabled(sClassNewButton);
					this.class.setModel(new JSONModel(sClassData));
					this.char.setModel(new JSONModel(sCharData));
					this.class.setVisible(sApproveData.createVisible);
					this.char.setVisible(sApproveData.createVisible);

					this.readSystem();
					oMainViewModel.setData(oMainViewData);
					sApproveModel.setData(sApproveData);
				}
			} else {
				return;
			}
		},

		/*
		 * Method to validate Time key
		 * @param {array} cycleData
		 * @param {string} index
		 * @param {object} headerData
		 */
		ValidateTimeKey: function (cycleData, index, headerData) {
			var g = this;
			var sSingleCycle = headerData.cycleIndSingle;
			var sMultiCounter = headerData.cycleIndMultCntr;
			var sTimeKeyDate = headerData.ScheIndRbTimeKeyDate;
			var aMaintCycle = cycleData;
			var i18n = this.getView().getModel("i18n");

			if ((sSingleCycle || sMultiCounter) && sTimeKeyDate) {
				for (var i = 0; i < aMaintCycle.length; i++) {
					var sCycle = aMaintCycle[i].Zykl1;
					var sCycleUnit = (aMaintCycle[i].Zeieh).toUpperCase();
					if ((sCycleUnit === "DAY" || sCycleUnit === "D") && parseInt(sCycle) % 30 !== 0) {
						aMaintCycle[i].Zykl1VS = "Error";
						this.invokeMessage(i18n.getProperty("KEY_SCH_NOT_POSSIBLE") + sCycle);
					} else if ((sCycleUnit === "H" || sCycleUnit === "HR") && parseInt(sCycle) % 720 !== 0) {
						aMaintCycle[i].Zykl1VS = "Error";
						this.invokeMessage(i18n.getProperty("KEY_SCH_NOT_POSSIBLE") + sCycle);
					} else if (sCycleUnit === "MIN" && parseInt(sCycle) % 43200 !== 0) {
						aMaintCycle[i].Zykl1VS = "Error";
						this.invokeMessage(i18n.getProperty("KEY_SCH_NOT_POSSIBLE") + sCycle);
					} else {
						aMaintCycle[i].Zykl1VS = "None";
					}
				}
			}
		},

		/*
		 * Method to read Counter
		 * @param {string} Point
		 * @param {string} Zeieh
		 */
		readCounterReading: function (Point, Zeieh) {
			var g = this;
			var m = g.getView().getModel("valueHelp");
			var oModel = g.getView().getModel("AIWMPMI");
			var oData = oModel.getData();
			m.read("/StCounterReadSet(Counter='" + Point + "',Unit='" + Zeieh + "')", {
				success: function (r) {
					if (oData.Szaeh === "") {
						oData.Szaeh = r.StCounter;
						oModel.setData(oData);
					}
				}
			});
		},

		/*
		 * Function to handle 'select' event of Inactive
		 * @param {sap.ui.base.Event} oEvent
		 */
		onInactiveSelect: function (oEvent) {
			var p = oEvent.getSource().getModel(this.oModelName).getData();
			p.Deact = oEvent.getSource().getSelected();
			//this.readStatusProf(p.EquipmentCatogory, this);
		},

		/*
		 * Function to handle 'change' event of Offset
		 * @param {sap.ui.base.Event} oEvent
		 */
		onOffsetChange: function (oEvent) {
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
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
		 * Method to read Maintainence Plant Category
		 */
		readMaintPlanCat: function () {
			var g = this;
			var sPath = "/MPLANItemCatgSet";
			var oModel = g.getView().getModel("valueHelp");
			var fnSuccess = function (d) {
				if (d.results.length > 0) {
					var sArray = [];
					for (var i = 0; i < d.results.length; i++) {
						sArray.push(d.results[i]);
					}
					var oJson = new JSONModel([]);
					oJson.setData(sArray);
					g.getView().setModel(oJson, "MainPlanCatModel");
				}
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		/*
		 * Method to read Temporary Key and creation of Maintainence Items
		 */
		maintenanceItems: function () {
			var g = this;
			var sPath = "/TempKeySet";
			var oFilters = [new Filter("CRType", "EQ", "MPITEM"), new Filter("ObjNo", "EQ", 1)];
			var oModel = g.getView().getModel("valueHelp");
			var oMainModel = g.getView().getModel("mainView");
			var oMainData = oMainModel.getData();

			oMainData.viewBusy = true;
			oMainModel.setData(oMainData);
			var fnSuccess = function (d) {
				var oJsonData = g.getView().getModel(g.oModelName).getData();
				var maintItemData = [{
					Mitemnumb: d.results[0].Key,
					Pstxt: oJsonData.Wptxt, // maint item desc
					Cycleseq: "",
					Tplnr: "", // floc
					Pltxt: "", // floc desc
					Equnr: "", // equip
					Eqktx: "", // equip desc
					AsmblyOb: "", // assembly
					Assemblydesc: "",
					Werks: "", // planning plant
					Planningplantdes: "", // planning plant desc
					Auart: "", // order type 
					oTypeTxt: "", // order type desc
					Qmart: "", // notif type
					nTypeTxt: "", // notif type desc
					ArbpMi: "", // main wc
					WergwMi: "", // main wc desc
					Ingrp: "", // planner grp
					Innam: "", // planner grp desc

					Zeieh: "",
					Priok: "",
					ItmPriotxt: "",
					GsberMi: "",
					Gtext: "",
					TaskDet: false,
					Ilart: "",
					Ilatx: "",
					PlntyMi: "",
					ApfktMi: "",
					PlnnrMi: "",
					PlnalMi: "",
					Gpcounterdesc: "",
					AnlzuMi: "",
					Anlzux: "",
					SwerkMil: "",
					Name1: "",
					StortMil: "",
					Locationdesc: "",
					MsgrpIl: "",
					BeberMil: "",
					Fing: "",
					Tele: "",
					ArbplIl: "",
					Workcenterdesc: "",
					AbckzIl: "",
					Abctx: "",
					EqfnrIl: "",
					BukrsMil: "",
					Butxt: "",
					City: "",
					Anln1Mil: "",
					Anln2Mil: "",
					Txt50: "",
					GsberIl: "",
					KostlMil: "",
					Contareaname: "",
					KokrsMil: "",
					Posid: "",
					Post1: "",
					AufnrIl: "",
					SettleOrdDesc: "",

					QmartLBL: true,
					QmartVis: true,
					nTypetxtVis: true,
					AuartLBL: true,
					AuartVis: true,
					oTypeTxtVis: true,
					CycleseqLBL: false,
					CycleseqVis: false,

					AsmblyObMaxLength: 40,
					maintItemE: false,
					cycleSetE: false,
					TplnrEnabled: false,
					equiE: false,
					assemblyE: false,

					CycleseqVS: "None",
					CycleseqVST: "",
					TplnrVS: "None",
					TplnrVST: "",
					EqunrVS: "None",
					EqunrVST: "",
					AsmblyObVS: "None",
					AsmblyObVST: "",
					WerksVS: "None",
					WerksVST: "",
					AuartVS: "None",
					AuartVST: "",
					QmartVS: "None",
					QmartVST: "",
					ArbpMiVS: "None",
					ArbpMiVST: "",
					WergwMiVS: "None",
					WergwMiVST: "",
					IngrpVS: "None",
					IngrpVST: "",
					ZeiehVS: "None",
					ZeiehVST: "",
					LDVisible: false,
					lam: {
						Mitemnumb: d.results[0].Key, // maint item
						Lrpid: "",
						LrpidDesc: "",
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
					}
				}];

				g.getModel(g.oModelName).setProperty("/itemModel", maintItemData);
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);
			};
			var fnError = function () {
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);
			};
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
		},

		/*
		 * Method to read System details
		 */
		readSystem: function () {
			var g = this;
			var sPath = "/SystemTypeSet";
			var oModel = g.getView().getModel("valueHelp");
			var oItemViewData = g.getView().getModel(g.oModelName).getProperty("/itemModel");
			var fnSuccess = function (r) {
				g.system = r.results[0].System;
				if (oItemViewData.length > 0) {
					if (g.system === true) {
						oItemViewData[0].AsmblyObMaxLength = 40;
					} else {
						oItemViewData[0].AsmblyObMaxLength = 18;
					}
				}
				g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemViewData);
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		/*
		 * Common function to handle 'valueHelpRequest' event
		 * @param {sap.ui.base.Event} oEvent
		 */
		valueHelpFunSelect: function (oEvent) {
			var sPath = oEvent.getSource().getBindingInfo("value").binding.sPath;

			if (sPath.indexOf("/Strat") !== -1) {
				ValueHelpRequest.valueHelpFunMaintStrategy(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Wset") !== -1) {
				ValueHelpRequest.valueHelpFunCycleSet(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Hunit") !== -1) {
				ValueHelpRequest.valueHelpFunSchedulePeriod(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Fabkl") !== -1) {
				ValueHelpRequest.valueHelpFunFactoryCalendar(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Mpcycleno") !== -1) {
				ValueHelpRequest.valueHelpFunCounter("Mpcycleno", oEvent, oEvent.getSource().getModel(this.oModelName).getData(), this);
			}
		},
		
		onSchedulePeriodUnitChange:function(oEvent){
			ValueHelpRequest.SchedulePeriodUnitChange(oEvent, oEvent.getSource().getModel(this.oModelName).getData(), this);
		},

		/*
		 * Function to handle 'change' event Maintainence Plan Category
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMaintPlanCatChange: function (oEvent) {
			var g = this;
			var oModelData = oEvent.getSource().getModel(g.oModelName).getData();

			oEvent.getSource().setValueState("None");
			oModelData.Mptyp = oEvent.getSource().getProperty("selectedKey");
			oModelData.Txt = oEvent.getSource().getSelectedItem().getText(); //oEvent.getSource().getProperty("value");
		},

		/*
		 * Function to handle 'select' event of Cycle Indicator
		 * @param {sap.ui.base.Event} oEvent
		 */
		cycleIndicatorSelected: function (oEvent) {
			var g = this;
			var sAIWModel = oEvent.getSource().getModel(g.oModelName);
			var sAIWData = sAIWModel.getData();
			var sSelectedIndex = oEvent.getSource().getProperty("selectedIndex");
			sAIWData.cycleIndSingle = false;
			sAIWData.cycleIndStrategy = false;
			sAIWData.cycleIndMultCntr = false;
			sAIWData.StratEnabled = false;
			sAIWData.MehrfachEnabled = false;
			sAIWData.WsetEnabled = false;

			switch (sSelectedIndex) {
			case 0:
				sAIWData.cycleType = 0;
				sAIWData.cycleIndSingle = true;
				sAIWData.cycleIndStrategyEnabled = false;
				sAIWData.cycleIndMultCntrEnabled = false;
				sAIWData.Strat = " ";
				sAIWData.StratDesc = " ";
				sAIWData.StratLBL = false;
				sAIWData.StratVis = false;
				sAIWData.StratDescVis = false;
				sAIWData.Wset = " ";
				sAIWData.Ktext = " ";
				sAIWData.WsetLBL = false;
				sAIWData.WsetVis = false;
				sAIWData.KtextVis = false;
				sAIWData.Mehrfach = false;
				sAIWData.MehrfachLBL = false;
				sAIWData.MehrfachVis = false;
				sAIWData.ButtonNewCycleEnabled = true;

				if (sAIWData.ScheIndRbPerformance === true) {
					sAIWData.SzaehLBL = true;
					sAIWData.SzaehVis = true;
					sAIWData.UnitcVis = true;
					sAIWData.StadtLBL = false;
					sAIWData.StadtVis = false;
				}
				break;
			case 1:
				sAIWData.cycleType = 1;
				sAIWData.cycleIndStrategy = true;
				sAIWData.cycleIndSingleEnabled = false;
				sAIWData.cycleIndMultCntrEnabled = false;
				sAIWData.Strat = " ";
				sAIWData.StratDesc = " ";
				sAIWData.StratLBL = true;
				sAIWData.StratVis = true;
				sAIWData.StratDescVis = true;
				sAIWData.StratEnabled = true;
				sAIWData.Mehrfach = false;
				sAIWData.MehrfachLBL = false;
				sAIWData.MehrfachVis = false;
				sAIWData.Wset = " ";
				sAIWData.Ktext = " ";
				sAIWData.WsetLBL = false;
				sAIWData.WsetVis = false;
				sAIWData.KtextVis = false;
				sAIWData.ButtonNewCycleEnabled = false;
				break;
			case 2:
				sAIWData.cycleType = 2;
				sAIWData.cycleIndMultCntr = true;
				sAIWData.cycleIndStrategyEnabled = false;
				sAIWData.cycleIndSingleEnabled = false;
				sAIWData.Strat = " ";
				sAIWData.StratDesc = " ";
				sAIWData.StratLBL = false;
				sAIWData.StratVis = false;
				sAIWData.StratDescVis = false;
				sAIWData.MehrfachLBL = true;
				sAIWData.MehrfachVis = true;
				sAIWData.MehrfachEnabled = true;
				sAIWData.Wset = "";
				sAIWData.Ktext = "";
				sAIWData.WsetLBL = true;
				sAIWData.WsetVis = true;
				sAIWData.WsetEnabled = true;
				sAIWData.KtextVis = true;
				sAIWData.ButtonNewCycleEnabled = true;
				sAIWData.cycleSetSeqColVis = true;
				break;
			}

			if (sAIWData.menuAction === "copy" || sAIWData.menuAction === "change") {
				if (sAIWData.Mptyp === "" || sAIWData.Mptyp === undefined || sAIWData.Mptyp === " ") {
					sAIWData.MptypEnabled = true;
				} else {
					sAIWData.MptypEnabled = false;
				}
				if (sAIWData.cycleType === 1 && (sAIWData.Strat === "" || sAIWData.Strat === undefined || sAIWData.Strat === " ")) {
					sAIWData.StratEnabled = true;
				} else {
					sAIWData.StratEnabled = false;
				}
				if (sAIWData.cycleType === 2 && (sAIWData.Mehrfach === false || sAIWData.Mehrfach === "" || sAIWData.Mehrfach === undefined ||
						sAIWData.Mehrfach === " ")) {
					sAIWData.MehrfachEnabled = true;
				} else {
					sAIWData.MehrfachEnabled = false;
				}
				if (sAIWData.cycleType === 2 && (sAIWData.Wset === "" || sAIWData.Wset === undefined || sAIWData.Wset === " ")) {
					sAIWData.WsetEnabled = true;
				} else {
					sAIWData.WsetEnabled = false;
				}
			}

			this.backUpCycleType = sAIWData.cycleType;
			sAIWModel.setData(sAIWData);
		},

		/*
		 * Method to read Scheduling
		 * @param {object} f
		 * @param {string} str
		 */
		readScheduling: function (f, str) {
			var g = this;
			var sPath = "/MPSHDParamSet('" + str + "')";
			var oModel = g.getView().getModel();
			var fnSuccess = function (r) {
				f.Fabkl = r.Fabkl;
				f.FabklDesc = r.FabklDesc;
				f.Abrho = r.Abrho;
				var ind = r.Termk;
				if (ind === "1") {
					f.Stich = 1;
					f.ScheIndRbTimeKeyDate = true;
					f.ScheIndRbTimeKeyDateEnabled = true;
					f.ScheIndRbTimeEnabled = true;
					f.ScheIndRbTimeFactCalEnabled = true;
					f.ScheIndRbPerformanceEnabled = false;
				} else if (ind === "2") {
					f.Stich = 2;
					f.ScheIndRbTimeEnabled = true;
					f.ScheIndRbTimeKeyDateEnabled = true;
					f.ScheIndRbPerformanceEnabled = false;
					f.ScheIndRbTimeFactCal = true;
					f.ScheIndRbTimeFactCalEnabled = true;
				} else if (ind === "3") {
					f.Stich = 3;
					f.ScheIndRbTimeEnabled = false;
					f.ScheIndRbTimeKeyDateEnabled = false;
					f.ScheIndRbTimeFactCalEnabled = false;
					f.ScheIndRbPerformance = true;
					f.ScheIndRbPerformanceEnabled = true;
					g.stratUnit = r.Zeieh;
				} else if (ind === "") {
					f.Stich = 0;
					f.ScheIndRbTime = true;
					f.ScheIndRbTimeKeyDateEnabled = true;
					f.ScheIndRbTimeEnabled = true;
					f.ScheIndRbTimeFactCalEnabled = true;
					f.ScheIndRbPerformanceEnabled = false;
				}
				g.getView().getModel(g.oModelName).refresh();
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		onMultiCounterSelect: function (oEvent) {
			var g = this;
			var sModelData = oEvent.getSource().getModel(g.oModelName).getData();
			if (sModelData.Mehrfach) {
				sModelData.ScheIndText = false;
				sModelData.ScheIndTitle = false;
				sModelData.ScheIndLBL = false;
				sModelData.ScheIndRbTimeVis = false;
				sModelData.ScheIndRbTimeKeyDateVis = false;
				sModelData.ScheIndRbTimeFactCalVis = false;
				sModelData.ScheIndRbPerformanceVis = false;
				sModelData.AbrhoLBL = false;
				sModelData.AbrhoVis = false;
				sModelData.HunitVis = false;
				sModelData.FabklLBL = false;
				sModelData.Fabkl = "";
				sModelData.FabklVis = false;
				sModelData.FabklDesc = "";
				sModelData.FabklDescVis = false;
				sModelData.ButtonNewCycleEnabled = true;
				sModelData.CycleSetSeqVis = true;
				sModelData.OPText = true;
				sModelData.OPTitle = true;
				sModelData.OPLBL = true;
				sModelData.OROPVis = true;
				sModelData.AndOPvis = true;
				sModelData.OROP = true;
				sModelData.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_STDATE");
			} else {
				sModelData.ScheIndText = true;
				sModelData.ScheIndTitle = true;
				sModelData.ScheIndLBL = true;
				sModelData.ScheIndRbTimeVis = true;
				sModelData.ScheIndRbTimeKeyDateVis = true;
				sModelData.ScheIndRbTimeFactCalVis = true;
				sModelData.ScheIndRbPerformanceVis = true;
				sModelData.AbrhoLBL = true;
				sModelData.AbrhoVis = true;
				sModelData.HunitVis = true;
				sModelData.FabklLBL = true;
				sModelData.Fabkl = "";
				sModelData.FabklVis = true;
				sModelData.FabklDesc = "";
				sModelData.FabklDescVis = true;
				sModelData.OPText = false;
				sModelData.OPTitle = false;
				sModelData.OPLBL = false;
				sModelData.OROPVis = false;
				sModelData.AndOPvis = false;
				sModelData.OROP = false;
				sModelData.CycleSetSeqVis = false;
			}

			if ((sModelData.cycleIndMultCntr === true && sModelData.Mehrfach === true) || (sModelData.cycleIndMultCntr === true &&
					sModelData.Wset !== "")) {
				sModelData.ButtonNewCycleEnabled = true;
				sModelData.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_STDATE");
			} else {
				sModelData.ButtonNewCycleEnabled = false;
				sModelData.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_START_TXT");
			}

			this.backUpMehrfach = sModelData.Mehrfach;
			g.getView().getModel(g.oModelName).refresh();
		},

		readCycleDetails: function (c) {
			var g = this;
			if (c !== "") {
				var sPath = "/CyclesetSet('" + c + "')/CyclesetToMPCycle";
				var oModel = g.getView().getModel();
				var fnSuccess = function (r) {
					var oCycleData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
					oCycleData = [];
					for (var i = 0; i < r.results.length; i++) {
						oCycleData.push(r.results[i]);
					}
					g.getView().getModel(g.oModelName).setProperty("/cycleModel", oCycleData);
				};
				var fnError = function () {};
				g._readData(sPath, oModel, fnSuccess, fnError);
			}
		},

		cyclicChange: function (oEvent) {
			var sValue = oEvent.getSource().getValue();
			if (sValue === "") {
				oEvent.getSource().setValue(1);
			}
		},

		schPeriodChange: function (oEvent) {
			var sValue = oEvent.getSource().getValue();
			if (sValue === "") {
				oEvent.getSource().setValue("000");
			}
		},

		onStartChange: function (oEvent) {
			var g = this;
			var sModelData = oEvent.getSource().getModel(g.oModelName).getData();

			g.valid = formatter.isValidDate(sModelData.Stadt);
			if (g.valid === false) {
				sModelData.StadtVS = "Error";
				var value = g.getView().getModel("i18n").getProperty("DATE_ERROR");
				g.invokeMessage(value);
			}
			if (g.valid === true) {
				sModelData.StadtVS = "None";
			}
		},

		indicatorSelected: function (oEvent) {
			var g = this;
			var sModelData = oEvent.getSource().getModel(g.oModelName).getData();
			var sSelectedIndex = oEvent.getSource().getProperty("selectedIndex");
			sModelData.ScheIndRbTime = false;
			sModelData.ScheIndRbTimeKeyDate = false;
			sModelData.ScheIndRbTimeFactCal = false;
			sModelData.ScheIndRbPerformance = false;

			if (sSelectedIndex === 0) {
				sModelData.Stich = 0;
				sModelData.ScheIndRbTime = true;
				sModelData.FabklEnabled = false;
				sModelData.Fabkl = "";
				sModelData.FabklDesc = "";
				sModelData.FabklLBLReq = false;
				sModelData.SzaehLBL = false;
				sModelData.SzaehVis = false;
				sModelData.UnitcVis = false;
				sModelData.StadtVis = true;
				sModelData.StadtLBL = true;
				sModelData.AbrhoLBL = true;
				sModelData.AbrhoVis = true;
				sModelData.HunitVis = true;
			}
			if (sSelectedIndex === 1) {
				sModelData.Stich = 1;
				sModelData.ScheIndRbTimeKeyDate = true;
				sModelData.FabklEnabled = true;
				sModelData.FabklLBLReq = true;
				sModelData.SzaehLBL = false;
				sModelData.SzaehVis = false;
				sModelData.UnitcVis = false;
				sModelData.StadtVis = true;
				sModelData.StadtLBL = true;
				sModelData.AbrhoLBL = true;
				sModelData.AbrhoVis = true;
				sModelData.HunitVis = true;
			}
			if (sSelectedIndex === 2) {
				sModelData.Stich = 2;
				sModelData.ScheIndRbTimeFactCal = true;
				sModelData.FabklEnabled = true;
				sModelData.FabklLBLreq = true;
				sModelData.SzaehLBL = false;
				sModelData.SzaehVis = false;
				sModelData.UnitcVis = false;
				sModelData.StadtVis = true;
				sModelData.StadtLBL = true;
				sModelData.AbrhoLBL = true;
				sModelData.AbrhoVis = true;
				sModelData.HunitVis = true;
			}
			if (sSelectedIndex === 3 && sModelData.cycleIndSingle === true) {
				sModelData.Stich = 3;
				sModelData.ScheIndRbPerformance = true;
				sModelData.FabklEnabled = false;
				sModelData.Fabkl = "";
				sModelData.FabklDesc = "";
				sModelData.FabklLBLReq = true;
				sModelData.SzaehLBL = true;
				sModelData.SzaehVis = true;
				sModelData.UnitcVis = true;
				sModelData.StadtVis = false;
				sModelData.StadtLBL = false;
				sModelData.AbrhoLBL = false;
				sModelData.AbrhoVis = false;
				sModelData.HunitVis = false;
			}

			this.backUpStich = sModelData.Stich;
			g.getView().getModel(g.oModelName).refresh();
		},

		readCounterData: function (oModelData, value, flag, sProperty) {
			var g = this;
			var sPath = "/CounterDataSet('" + value + "')";
			var oModel = g.getView().getModel("valueHelp");
			var fnSuccess = function (r) {
				if (flag === "counterUnit") {
					if (g.stratUnit === "" || g.stratUnit === undefined) {
						oModelData.Unitc = r.Unitc;
					}
					if (r.Unitc !== g.stratUnit) {
						var msg = "Unit " + g.stratUnit + " and counter unit " + r.Unitc + " have different dimensions";
						if (sProperty === "Point") {
							oModelData.MpcyclenoVS = "Error";
						}
						g.invokeMessage(msg);
					} else {
						oModelData.MpcyclenoVS = "None";
					}

					g.counterUnit = r.Unitc;
				} else if (flag === "cycleUnit") {
					g.cycleUnit = r.Unitc;
					oModelData.Unitc = r.Unitc;
				}
				g.getView().getModel(g.oModelName).refresh();
				return r.Unitc;
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		readCycleCounterData: function (oModelData, value) {
			var g = this;
			var sPath = "/CounterDataSet('" + value + "')";
			var oModel = g.getView().getModel("valueHelp");
			var fnSuccess = function (r) {
				var sCycleCounterUnit = g.cycleCounterUnit;
				var msg = "Unit " + sCycleCounterUnit + " and counter unit " + r.Unitc + " have different dimensions";
				var sTimeArray = [];

				if (sCycleCounterUnit === "D" || sCycleCounterUnit === "DAY" || sCycleCounterUnit === "WK" || sCycleCounterUnit === "YR" ||
					sCycleCounterUnit === "MON" || sCycleCounterUnit === "HR") {
					sTimeArray = ["D", "H", "YR", "MIN", "MIS", "MON", "MSE", "NS", "PDA", "PS", "S", "HR", "DAY", "001", "WK"];

					var flag = sTimeArray.includes(r.Unitc);
					if (flag === true) {
						oModelData.Unitc = r.Unitc;
						oModelData.MpcyclenoVS = "None";
					} else {
						oModelData.MpcyclenoVS = "Error";
						g.invokeMessage(msg);
					}
				} else {
					oModelData.Unitc = r.Unitc;
					if (r.Unitc !== sCycleCounterUnit) {
						oModelData.MpcyclenoVS = "Error";
						g.invokeMessage(msg);
					} else {
						oModelData.MpcyclenoVS = "None";
					}
				}

				g.getView().getModel(g.oModelName).refresh();
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		addMaintCycleRow: function (oEvent) {
			var g = this;
			var sMessage;
			var sModelData = oEvent.getSource().getModel(g.oModelName).getData();
			sModelData.MptypEnabled = false;

			if (!sModelData.cycleIndStrategy && !sModelData.cycleIndMultCntr && !sModelData.cycleIndSingle) {
				sMessage = g.getView().getModel("i18n").getProperty("");
			}

			if (sModelData.cycleIndStrategy) {
				sModelData.StratEnabled = false;
				sModelData.cycleIndStrategyEnabled = false;
				sModelData.cycleIndMultCntrEnabled = false;
				sModelData.cycleIndSingleEnabled = false;
			}

			if (sModelData.cycleIndMultCntr) {
				if (sModelData.Mehrfach) {
					sModelData.MehrfachEnabled = false;
				}
				sModelData.StratEnabled = false;
				sModelData.WsetEnabled = false;
				sModelData.cycleIndStrategyEnabled = false;
				sModelData.cycleIndMultCntrEnabled = false;
				sModelData.cycleIndSingleEnabled = false;
			}

			var oCycleData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
			if (sModelData.cycleIndSingle) {
				if (oCycleData) {
					if (oCycleData.length === 0) {
						sModelData.ButtonNewCycleEnabled = true;
					} else {
						sModelData.ButtonNewCycleEnabled = false;
						g.getView().getModel(g.oModelName).refresh();
						return;
					}
				}
			}

			var iNumber;
			var iArray = [];
			if (oCycleData === null) {
				iNumber = "1";
			} else {
				iNumber = oCycleData.length + 1;
				iNumber = iNumber.toString();
			}

			iArray = {
				Mpcycleno: iNumber,
				Zykl1: "",
				Zeieh: "",
				PakText: "",
				Offset: "",
				Ofsetunit: "",
				Point: "",
				Psort: "",
				Cycleseqi: "00",
				Zykl1VS: "None",
				ZeiehVS: "None",
				PointVS: "None"
			};

			if (sModelData.menuAction === "create") {
				iArray.Zykl1Enabled = true;
				iArray.ZeiehEnabled = true;
				iArray.PakTextEnabled = true;
				iArray.OffsetEnabled = true;
				iArray.PointEnabled = true;
				iArray.CycleseqiEnabled = true;
			} else {
				iArray.Zykl1Enabled = false;
				iArray.ZeiehEnabled = false;
				iArray.PakTextEnabled = false;
				iArray.OffsetEnabled = false;
				iArray.PointEnabled = false;
				iArray.CycleseqiEnabled = false;
			}

			oCycleData.push(iArray);
			g.getView().getModel(g.oModelName).setProperty("/cycleModel", oCycleData);
			g.getView().getModel(g.oModelName).refresh();
		},

		handleCycleDelete: function (oEvent) {
			var g = this;
			var sPath, sSource, sData, sIndex;
			sSource = oEvent.getSource();
			sPath = oEvent.getParameter("listItem").getBindingContext(g.oModelName).sPath;
			sPath = sPath.substring(sPath.lastIndexOf("/") + 1);
			sIndex = parseInt(sPath.substr(-1), 10);
			sData = sSource.getModel(g.oModelName).getProperty("/cycleModel");
			sData.splice(sIndex, 1);
			sSource.getModel(g.oModelName).setProperty("/cycleModel", sData);
			sSource.getModel(g.oModelName).ButtonNewCycleEnabled = true;
		},

		handleItemDelete: function (oEvent) {
			var g = this;
			var sPath, sSource, sData, sIndex, sOLIData;
			sSource = oEvent.getSource();
			sPath = oEvent.getParameter("listItem").getBindingContext(g.oModelName).sPath;
			sPath = sPath.substring(sPath.lastIndexOf("/") + 1);
			sIndex = parseInt(sPath.substr(-1), 10);
			sData = sSource.getModel(g.oModelName).getProperty("/itemModel");
			sOLIData = sSource.getModel(g.oModelName).getProperty("/ObjListItems");
			if (sOLIData) {
				for (var i = sOLIData.length - 1; i >= 0; i--) {
					if (sOLIData[i].Mitemnumb === sData[sIndex].Mitemnumb) {
						sOLIData.splice(i, 1);
					}
				}
			}
			sData.splice(sIndex, 1);
			sSource.getModel(g.oModelName).setProperty("/itemModel", sData);
			sSource.getModel(g.oModelName).setProperty("/ObjListItems", sOLIData);
		},

		onChangeCycle: function (oEvent) {
			var g = this;
			var sPath = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var sModelData = oEvent.getSource().getModel(g.oModelName).getData();

			// var idMaintCycleColumn = this.getView().byId("maintCyclesTab");
			var oItemCycleData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
			var oSource = oEvent.getSource();

			var row = oSource.getParent().getParent();
			var value = oEvent.getParameters().newValue;
			var index = oEvent.getSource().getId();
			index = index.substr(index.lastIndexOf("-") + 1);

			if (sPath.indexOf("Zeieh") !== -1) {
				if (value !== "") {
					oItemCycleData[index].ZeiehVS = "None";
					g.cycleCounterUnit = value.toUpperCase();
					oItemCycleData[index].Zeieh = value.toUpperCase();
					oItemCycleData[index].Ofsetunit = value.toUpperCase();
					if (value.toUpperCase() === "D" || value.toUpperCase() === "DAY" ||
						value.toUpperCase() === "WK" || value.toUpperCase() === "YR" || value.toUpperCase() === "H" ||
						value.toUpperCase() === "MON" || value.toUpperCase() === "HR" || value.toUpperCase() === "MIN") {
						g.counter = false;

						if (oItemCycleData[index].Zeieh !== "" && oItemCycleData[index].Point !== "") {
							g.readCounterReading(oItemCycleData[index].Point, oItemCycleData[index].Zeieh);
						}
						if (oItemCycleData[index].Point === "") {
							if (sModelData.ScheIndRbPerformance === true) {
								sModelData.Stich = 0;
								sModelData.ScheIndRbTime = true;
								sModelData.ScheIndRbTimeEnabled = true;
								sModelData.ScheIndRbTimeFactCalEnabled = true;
							}
							sModelData.ScheIndRbPerformanceEnabled = false;
							sModelData.SzaehLBL = false;
							sModelData.SzaehVis = false;
							sModelData.UnitcVis = false;
							sModelData.StadtLBL = true;
							sModelData.StadtVis = true;
						} else {
							sModelData.SzaehLBL = true;
							sModelData.SzaehVis = true;
							sModelData.UnitcVis = true;
							sModelData.StadtLBL = false;
							sModelData.StadtVis = false;

							sModelData.Stich = 3;
							sModelData.ScheIndRbPerformance = true;
							sModelData.ScheIndRbPerformanceEnabled = true;
							sModelData.ScheIndRbTimeEnabled = false;
							sModelData.ScheIndRbTimeKeyDateEnabled = false;
							sModelData.ScheIndRbTimeFactCalEnabled = false;
							sModelData.Fabkl = "";
							sModelData.FabklDesc = "";
							sModelData.FabklEnabled = false;
							sModelData.FabklDescLBLReq = false;
						}
						oItemCycleData[index].PointVS = "None";
						g.ValidateTimeKey(oItemCycleData, index, sModelData);
					} else {
						sModelData.SzaehLBL = true;
						sModelData.SzaehVis = true;
						sModelData.UnitcVis = true;
						sModelData.StadtLBL = false;
						sModelData.StadtVis = false;

						sModelData.Stich = 3;
						sModelData.ScheIndRbPerformanceEnabled = true;
						sModelData.ScheIndRbTimeEnabled = false;
						sModelData.ScheIndRbTimeKeyDateEnabled = false;
						sModelData.ScheIndRbTimeFactCalEnabled = false;
						sModelData.Fabkl = "";
						sModelData.FabklDesc = "";
						sModelData.FabklEnabled = false;
						sModelData.FabklDescLBLReq = false;
						if (oItemCycleData[index].Point === "") {
							g.counter = true;
							oItemCycleData[index].PointVS = "Error";
							g.invokeMessage(g.getView().getModel("i18n").getProperty("COUNTER_MANDMSG"));
						} else {
							g.counter = false;
							oItemCycleData[index].PointVS = "None";
						}
					}
				} else {
					oItemCycleData[index].ZeiehVS = "Error";
				}
				g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
				g.getView().getModel(g.oModelName).refresh();
			}
			if (sPath.indexOf("Zykl1") !== -1) {
				if (value !== "") {
					oItemCycleData[index].Zykl1VS = "None";
					oItemCycleData[index].Zykl1 = value;
					g.ValidateTimeKey(oItemCycleData, index, sModelData);
				} else {
					oItemCycleData[index].Zykl1VS = "Error";
				}
				g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
			}
			if (sPath.indexOf("Point") !== -1) {
				if (value !== "") {
					oItemCycleData[index].Point = value.toUpperCase();
					var c = value.toUpperCase();
					var a = c.replace(/^[ ]+|[ ]+$/g, '');
					if (a !== "") {
						var sUrlPath = "/MSCounterSet";
						var oFilters = [new sap.ui.model.Filter("Point", "EQ", c)];
						var oModel = g.getView().getModel("valueHelp");
						var fnSuccess = function (d) {
							if (d.results.length > 0) {
								oItemCycleData[index].PointVS = "None";
								oItemCycleData[index].Point = value.toUpperCase();
								oItemCycleData[index].Psort = d.results[0].Psort;
								g.counter = false;

								sModelData.SzaehLBL = true;
								sModelData.SzaehVis = true;
								sModelData.UnitcVis = true;
								sModelData.StadtLBL = false;
								sModelData.StadtVis = false;
								sModelData.Stich = 3;
								sModelData.ScheIndRbPerformance = true;
								sModelData.ScheIndRbPerformanceEnabled = true;
								sModelData.ScheIndRbTimeEnabled = false;
								sModelData.ScheIndRbTimeKeyDateEnabled = false;
								sModelData.ScheIndRbTimeFactCalEnabled = false;
								sModelData.Fabkl = "";
								sModelData.FabklDesc = "";
								sModelData.FabklEnabled = false;
								sModelData.FabklDescLBLReq = false;
								g.getView().getModel(g.oModelName).refresh();
								// sModelData.Unitc = g.readCounterData(sModelData, c, "cycleUnit");
								g.readCycleCounterData(sModelData, c);

								if (oItemCycleData[index].Zeieh !== "" && oItemCycleData[index].Point !== "") {
									g.readCounterReading(oItemCycleData[index].Point, oItemCycleData[index].Zeieh);
								}
							} else {
								oItemCycleData[index].PointVS = "Error";
							}
							g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
							g.getView().getModel(g.oModelName).refresh();
						};
						var fnError = function () {
							oItemCycleData[index].PointVS = "Error";
							g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
						};
						g._readData(sUrlPath, oModel, fnSuccess, fnError, oFilters);
					} else {
						g.index = row._oItemNavigation.iFocusedIndex;
						var cUnit = oItemCycleData[index].Zeieh;
						if (cUnit === "D" || cUnit === "DAY" ||
							cUnit === "WK" || cUnit === "YR" ||
							cUnit === "MON" || cUnit === "HR") {

							sModelData.Stich = 0;
							sModelData.ScheIndRbPerformanceEnabled = false;
							sModelData.ScheIndRbTimeEnabled = true;
							sModelData.ScheIndRbTimeKeyDateEnabled = true;
							sModelData.ScheIndRbTimeFactCalEnabled = true;
							sModelData.ScheIndRbTime = true;
							sModelData.Fabkl = "";
							sModelData.FabklDesc = "";
							sModelData.FabklEnabled = false;
							sModelData.FabklDescLBLReq = false;
							g.counter = false;
							oItemCycleData[index].PointVS = "None";
						} else {
							g.counter = true;
							oItemCycleData[index].PointVS = "Error";
						}
						g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
					}
				} else {
					sModelData.Unitc = "";
					if (g.backUpCycleType >= 0) {
						sModelData.Strat = " ";
						sModelData.StratDesc = " ";
						sModelData.Wset = " ";
						sModelData.Ktext = " ";
						sModelData.ButtonNewCycleEnabled = true;
						sModelData.cycleIndStrategyEnabled = false;
						sModelData.StratLBL = false;
						sModelData.StratVis = false;
						sModelData.StratDescVis = false;

						switch (g.backUpCycleType) {
						case 0:
							sModelData.cycleType = 0;
							sModelData.cycleIndSingle = true;
							sModelData.cycleIndMultCntrEnabled = false;
							sModelData.WsetLBL = false;
							sModelData.WsetVis = false;
							sModelData.KtextVis = false;
							sModelData.Mehrfach = false;
							sModelData.MehrfachLBL = false;
							sModelData.MehrfachVis = false;

							if (sModelData.ScheIndRbPerformance === true) {
								sModelData.SzaehLBL = true;
								sModelData.SzaehVis = true;
								sModelData.UnitcVis = true;
								sModelData.StadtLBL = false;
								sModelData.StadtVis = false;
							}
							break;
						case 2:
							sModelData.cycleType = 2;
							sModelData.cycleIndMultCntr = true;
							sModelData.cycleIndSingleEnabled = false;
							sModelData.MehrfachLBL = true;
							sModelData.MehrfachVis = true;
							sModelData.MehrfachEnabled = true;
							sModelData.WsetLBL = true;
							sModelData.WsetVis = true;
							sModelData.WsetEnabled = true;
							sModelData.KtextVis = true;
							sModelData.cycleSetSeqColVis = true;
							break;
						}
					}

					if (g.backUpMehrfach) {
						if (sModelData.Mehrfach) {
							sModelData.ScheIndText = false;
							sModelData.ScheIndTitle = false;
							sModelData.ScheIndLBL = false;
							sModelData.ScheIndRbTimeVis = false;
							sModelData.ScheIndRbTimeKeyDateVis = false;
							sModelData.ScheIndRbTimeFactCalVis = false;
							sModelData.ScheIndRbPerformanceVis = false;
							sModelData.AbrhoLBL = false;
							sModelData.AbrhoVis = false;
							sModelData.HunitVis = false;
							sModelData.FabklLBL = false;
							sModelData.Fabkl = "";
							sModelData.FabklVis = false;
							sModelData.FabklDesc = "";
							sModelData.FabklDescVis = false;
							sModelData.ButtonNewCycleEnabled = true;
							sModelData.CycleSetSeqVis = true;
							sModelData.OPText = true;
							sModelData.OPTitle = true;
							sModelData.OPLBL = true;
							sModelData.OROPVis = true;
							sModelData.AndOPvis = true;
							sModelData.StadtLBLText = g.getView().getModel("i18n").getProperty("CYCLE_STDATE");
						} else {
							sModelData.ScheIndText = true;
							sModelData.ScheIndTitle = true;
							sModelData.ScheIndLBL = true;
							sModelData.ScheIndRbTimeVis = true;
							sModelData.ScheIndRbTimeKeyDateVis = true;
							sModelData.ScheIndRbTimeFactCalVis = true;
							sModelData.ScheIndRbPerformanceVis = true;
							sModelData.AbrhoLBL = true;
							sModelData.AbrhoVis = true;
							sModelData.HunitVis = true;
							sModelData.FabklLBL = true;
							sModelData.Fabkl = "";
							sModelData.FabklVis = true;
							sModelData.FabklDesc = "";
							sModelData.FabklDescVis = true;
							sModelData.OPText = false;
							sModelData.OPTitle = false;
							sModelData.OPLBL = false;
							sModelData.OROPVis = false;
							sModelData.AndOPvis = false;
							sModelData.CycleSetSeqVis = false;
						}
					}

					if (g.backUpStich >= 0) {
						sModelData.ScheIndRbTime = false;
						sModelData.ScheIndRbTimeKeyDate = false;
						sModelData.ScheIndRbTimeFactCal = false;
						sModelData.ScheIndRbPerformance = false;
						sModelData.ScheIndRbTimeEnabled = true;
						sModelData.ScheIndRbTimeKeyDateEnabled = true;
						sModelData.ScheIndRbTimeFactCalEnabled = true;
						sModelData.ScheIndRbPerformanceEnabled = true;
						sModelData.AbrhoLBL = true;
						sModelData.AbrhoVis = true;
						sModelData.HunitVis = true;
						sModelData.FabklEnabled = true;
						sModelData.FabklLBLReq = true;
						sModelData.SzaehLBL = false;
						sModelData.SzaehVis = false;
						sModelData.StadtVis = true;
						sModelData.StadtLBL = true;
						sModelData.UnitcVis = false;

						if (g.backUpStich === 0) {
							sModelData.Stich = 0;
							sModelData.ScheIndRbTime = true;
							sModelData.FabklEnabled = false;
							sModelData.Fabkl = "";
							sModelData.FabklDesc = "";
							sModelData.FabklLBLReq = false;
						}
						if (g.backUpStich === 1) {
							sModelData.Stich = 1;
							sModelData.ScheIndRbTimeKeyDate = true;
						}
						if (g.backUpStich === 2) {
							sModelData.Stich = 2;
							sModelData.ScheIndRbTimeFactCal = true;
						}
						if (g.backUpStich === 3 && sModelData.cycleIndSingle === true) {
							sModelData.Stich = 3;
							sModelData.ScheIndRbPerformance = true;
							sModelData.FabklEnabled = false;
							sModelData.Fabkl = "";
							sModelData.FabklDesc = "";
							sModelData.FabklLBLReq = true;
							sModelData.SzaehLBL = true;
							sModelData.SzaehVis = true;
							sModelData.UnitcVis = true;
							sModelData.StadtVis = false;
							sModelData.StadtLBL = false;
							sModelData.AbrhoLBL = false;
							sModelData.AbrhoVis = false;
							sModelData.HunitVis = false;
						}
					}

					oItemCycleData[index].Psort = "";
					g.getView().getModel(g.oModelName).refresh();
					g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
				}
			}
			if (sPath.indexOf("Cycleseqi") !== -1) {
				if (value !== "") {
					oItemCycleData[g.index - 1].CycleseqiVS = "None";
					g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
				}
			}
		},

		cycleChange: function (oEvent) {
			var g = this;
			var oItemCycleData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
			var oSource = oEvent.getSource();

			var row = oSource.getParent().getParent();
			var value = oEvent.getParameters().newValue;
			g.index = row._oItemNavigation.iFocusedIndex;

			if (value === "") {
				oItemCycleData[g.index - 1].Zeieh = "";
				oItemCycleData[g.index - 1].Ofsetunit = "";
			}
			oItemCycleData[g.index - 1].ZeiehVS = "None";
			g.getView().getModel(g.oModelName).setProperty("/cycleModel", oItemCycleData);
		},

		valueItemHelpSelect: function (oEvent) {
			var sPath = oEvent.getSource().getBindingInfo("value").binding.sPath;

			if (sPath.indexOf("Point") !== -1) {
				ValueHelpRequest.valueHelpFunCycleCounter(oEvent, oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("Zeieh") !== -1) {
				ValueHelpRequest.valueHelpFunUnit(oEvent, oEvent.getSource().getModel(this.oModelName).getData(), this);
			}
		},

		addItemRow: function (oEvent) {
			var g = this;
			var sPath = "/TempKeySet";
			var oFilters = [new Filter("CRType", "EQ", "MPITEM"), new Filter("ObjNo", "EQ", 1)];
			var oModel = g.getView().getModel("valueHelp");
			var oMainModel = g.getView().getModel("mainView");
			var oMainData = oMainModel.getData();
			var sModelData = oEvent.getSource().getModel(g.oModelName).getData();

			oMainData.viewBusy = true;
			oMainModel.setData(oMainData);

			var fnSuccess = function (d) {
				if (sModelData.Mptyp) {
					sModelData.MptypEnabled = false;
				}

				if (sModelData.cycleIndStrategy) {
					sModelData.StratEnabled = false;
					sModelData.cycleIndStrategyEnabled = false;
					sModelData.cycleIndSingleEnabled = false;
					sModelData.cycleIndMultCntr = false;
				}
				if (sModelData.cycleIndMultCntr) {
					sModelData.WsetEnabled = false;
					sModelData.MehrfachEnabled = false;
					sModelData.StratEnabled = false;
					sModelData.cycleIndStrategyEnabled = false;
					sModelData.cycleIndSingleEnabled = false;
					sModelData.cycleIndMultCntr = false;

					if ((sModelData.Mehrfach === false && sModelData.Wset === "" && sModelData.Strat === "")) {
						sModelData.cycleIndSingle = true;
					}
				}

				var itemdata = g.getView().getModel(g.oModelName).getProperty("/itemModel");
				var tableArray = {
					Mitemnumb: d.results[0].Key, // maint item 
					Pstxt: sModelData.Wptxt, // maint item desc
					Cycleseq: "",
					Tplnr: "", // floc
					Pltxt: "", // floc desc
					Equnr: "", // equip
					Eqktx: "", // equip desc
					AsmblyOb: "", // assembly
					Assemblydesc: "",
					Werks: "", // planning plant
					Planningplantdes: "", // planning plant desc
					Auart: "", // order type 
					oTypeTxt: "", // order type desc
					Qmart: "", // notif type
					nTypeTxt: "", // notif type desc
					ArbpMi: "", // main wc
					WergwMi: "", // main wc desc
					Ingrp: "", // planner grp
					Innam: "", // planner grp desc

					Zeieh: "",
					Priok: "",
					ItmPriotxt: "",
					GsberMi: "",
					Gtext: "",
					TaskDet: false,
					Ilart: "",
					Ilatx: "",
					PlntyMi: "",
					ApfktMi: "",
					PlnnrMi: "",
					PlnalMi: "",
					Gpcounterdesc: "",
					AnlzuMi: "",
					Anlzux: "",

					SwerkMil: "",
					SwerkMilVS: "None",
					Name1: "",
					StortMil: "",
					Locationdesc: "",
					MsgrpIl: "",
					BeberMil: "",
					Fing: "",
					Tele: "",
					ArbplIl: "",
					Workcenterdesc: "",
					AbckzIl: "",
					Abctx: "",
					EqfnrIl: "",
					enableLoc: true,

					BukrsMil: "",
					Butxt: "",
					City: "",
					Anln1Mil: "",
					Anln2Mil: "",
					Txt50: "",
					GsberIl: "",
					KostlMil: "",
					Contareaname: "",
					KokrsMil: "",
					Posid: "",
					Post1: "",
					AufnrIl: "",
					SettleOrdDesc: "",

					QmartLBL: true,
					QmartVis: true,
					nTypetxtVis: true,
					AuartLBL: true,
					AuartVis: true,
					oTypeTxtVis: true,
					CycleseqLBL: false,
					CycleseqVis: false,

					AsmblyObMaxLength: 40,
					maintItemE: false,
					cycleSetE: false,
					TplnrEnabled: false,
					equiE: false,
					assemblyE: false,

					CycleseqVS: "None",
					CycleseqVST: "",
					TplnrVS: "None",
					TplnrVST: "",
					EqunrVS: "None",
					EqunrVST: "",
					AsmblyObVS: "None",
					AsmblyObVST: "",
					WerksVS: "None",
					WerksVST: "",
					AuartVS: "None",
					AuartVST: "",
					QmartVS: "None",
					QmartVST: "",
					ArbpMiVS: "None",
					ArbpMiVST: "",
					WergwMiVS: "None",
					WergwMiVST: "",
					IngrpVS: "None",
					IngrpVST: "",
					LDVisible: false,
					lam: {
						Mitemnumb: d.results[0].Key, // maint item
						Lrpid: "",
						LrpidDesc: "",
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
					}
				};
				itemdata.push(tableArray);

				g.getView().getModel(g.oModelName).setProperty("/itemModel", itemdata);
				g.getView().getModel(g.oModelName).refresh();

				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);
			};
			var fnError = function () {
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);
			};
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
		},

		onAssignItemPress: function (oEvent) {
			var g = this;
			var sModelData = oEvent.getSource().getModel(g.oModelName).getData();
			var type;
			if (sModelData.Mptyp === null) {
				type = "";
			} else {
				type = sModelData.Mptyp;
			}

			var settings = {
				title: g.getView().getModel("i18n").getProperty("ASSIGN_ITEM"),
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>MAINT_ITEM_TXT}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>MAINT_CAT}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>EQUI}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>LOC_ACC}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>ASSEMBLY}"
							})
						]
					})
				],
				items: {
					path: "/OpenMISet?$filter=Mityp eq '" + type + "'",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Wapos}"
							}),
							new sap.m.Text({
								text: "{Mityp}"
							}),
							new sap.m.Text({
								text: "{Equnr}"
							}),
							new sap.m.Text({
								text: "{Iloan}"
							}),
							new sap.m.Text({
								text: "{Bautl}"
							})
						]
					})

				},
				confirm: function (E) {
					var item = E.getParameter("selectedItem").getCells()[0].getText();
					g.readMplanItem(g, item);
				}
			};

			var sPath = "/OpenMISet";
			var oFilters = [new sap.ui.model.Filter("Mityp", "EQ", type)];
			var oModel = g.getView().getModel("valueHelp2");
			var cells = [
				new sap.m.Text({
					text: "{Wapos}"
				}),
				new sap.m.Text({
					text: "{Mityp}"
				}),
				new sap.m.Text({
					text: "{Equnr}"
				}),
				new sap.m.Text({
					text: "{Iloan}"
				}),
				new sap.m.Text({
					text: "{Bautl}"
				})
			];

			var mItemSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Wapos", "Mityp");
			mItemSelectDialog.open();
			mItemSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			g.getView().getModel(g.oModelName).refresh();
		},

		readMplanItem: function (g, i) {
			var sPath = "/MPItemSet";
			var oModel = g.getView().getModel();
			var oFilters = [new sap.ui.model.Filter("Mitemnumb", "EQ", i)];
			var fnSuccess = function (r) {
				if (r.results.length > 0) {
					var iData = g.getView().getModel(g.oModelName).getProperty("/itemModel");
					if (iData !== null && iData.length > 0) {
						var obj = {
							Mitemnumb: i, // maint item 
							Pstxt: r.results[0].Pstxt, // maint item desc
							Cycleseq: r.results[0].Cycleseq,
							Tplnr: r.results[0].TplnrMi, // floc
							Pltxt: r.results[0].Flocdesc, // floc desc
							Equnr: r.results[0].Equnr, // equip
							Eqktx: r.results[0].Equipdesc, // equip desc
							AsmblyOb: r.results[0].Bautl, // assembly
							// Assemblydesc: r.results[0].Assemblydesc, // assembly
							Werks: r.results[0].PlntMi, // planning plant
							Planningplantdes: r.results[0].Planningplantdes, // planning plant desc
							Auart: r.results[0].Auart, // order type 
							oTypeTxt: r.results[0].Ordertypedesc, // order type desc
							Qmart: r.results[0].Qmart, // notif type
							nTypeTxt: r.results[0].Qmartx, // notif type desc
							ArbpMi: r.results[0].ArbplMi, // main wc
							WergwMi: r.results[0].MainWcPlant, // main wc desc
							Ingrp: r.results[0].IngrpMi, // planner grp
							Innam: r.results[0].Plannergrpdesc, // planner grp desc

							// Approve Fields						
							Zeieh: r.results[0].Zeieh,
							Priok: r.results[0].Priok,
							ItmPriotxt: r.results[0].ItmPriotxt,
							GsberMi: r.results[0].GsberMi,
							Gtext: r.results[0].Gtext,
							TaskDet: r.results[0].TaskDet,
							Ilart: r.results[0].Ilart,
							Ilatx: r.results[0].Ilatx,
							PlntyMi: r.results[0].PlntyMi,
							ApfktMi: r.results[0].ApfktMi,
							PlnnrMi: r.results[0].PlnnrMi,
							PlnalMi: r.results[0].PlnalMi,
							Gpcounterdesc: r.results[0].Gpcounterdesc,
							AnlzuMi: r.results[0].AnlzuMi,
							Anlzux: r.results[0].Anlzux,
							SwerkMil: r.results[0].SwerkMil,
							Name1: r.results[0].Name1,
							StortMil: r.results[0].StortMil,
							Locationdesc: r.results[0].Locationdesc,
							MsgrpIl: r.results[0].MsgrpIl,
							BeberMil: r.results[0].BeberMil,
							Fing: r.results[0].Fing,
							Tele: r.results[0].Tele,
							ArbplIl: r.results[0].ArbplIl,
							Workcenterdesc: r.results[0].Workcenterdesc,
							AbckzIl: r.results[0].AbckzIl,
							Abctx: r.results[0].Abctx,
							EqfnrIl: r.results[0].EqfnrIl,
							BukrsMil: r.results[0].BukrsMil,
							Butxt: r.results[0].Butxt,
							City: r.results[0].City,
							Anln1Mil: r.results[0].Anln1Mil,
							Anln2Mil: r.results[0].Anln2Mil,
							Txt50: r.results[0].Txt50,
							GsberIl: r.results[0].GsberIl,
							KostlMil: r.results[0].KostlMil,
							Contareaname: r.results[0].Contareaname,
							KokrsMil: r.results[0].KokrsMil,
							Posid: r.results[0].Posid,
							Post1: r.results[0].Post1,
							AufnrIl: r.results[0].AufnrIl,
							SettleOrdDesc: r.results[0].SettleOrdDesc,

							QmartLBL: true,
							QmartVis: true,
							nTypetxtVis: true,
							AuartLBL: true,
							AuartVis: true,
							oTypeTxtVis: true,
							CycleseqLBL: false,
							CycleseqVis: false,

							AsmblyObMaxLength: 0,
							maintItemE: false,
							cycleSetE: false,
							TplnrEnabled: false,
							equiE: false,
							assemblyE: false,

							CycleseqVS: "None",
							CycleseqVST: "",
							TplnrVS: "None",
							TplnrVST: "",
							EqunrVS: "None",
							EqunrVST: "",
							AsmblyObVS: "None",
							AsmblyObVST: "",
							WerksVS: "None",
							WerksVST: "",
							AuartVS: "None",
							AuartVST: "",
							QmartVS: "None",
							QmartVST: "",
							ArbpMiVS: "None",
							ArbpMiVST: "",
							WergwMiVS: "None",
							WergwMiVST: "",
							IngrpVS: "None",
							IngrpVST: ""
						};
						iData.push(obj);
						g.getView().getModel(g.oModelName).setProperty("/itemModel", iData);
					} else {
						g.getView().getModel(g.oModelName).setProperty("/itemModel", r.results);
					}
				}
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
		},

		onObjectChange: function (oEvent) {
			var g = this;
			var sPath = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var value = oEvent.getParameters().newValue;
			var index = parseInt(sPath.substr(-1));

			var oItemData = g.getView().getModel(g.oModelName).getProperty("/itemModel");
			var sRegExp, oFilters, sUrlPath, oModel, sObjValue, fnSuccess, fnError;

			if (sPath.indexOf("/Equnr") > 0) {
				if (value !== "") {
					sObjValue = value.toUpperCase();
					sRegExp = sObjValue.replace(/^[ ]+|[ ]+$/g, '');
					if (sRegExp !== "") {
						sUrlPath = "/EquiAssestVHSet";
						oFilters = new sap.ui.model.Filter("Equnr", "EQ", sObjValue);
						oModel = g.getView().getModel("valueHelp");
						fnSuccess = function (d) {
							if (d.results.length > 0) {
								oItemData[index].equiState = "None";
								oItemData[index].Equnr = sObjValue;
								oItemData[index].Eqktx = d.results[0].Eqktu;
							} else {
								oItemData[index].equiState = "Error";
							}
							g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
						};
						fnError = function () {
							oItemData[index].equiState = "Error";
							g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
						};
						g._readData(sUrlPath, oModel, fnSuccess, fnError, oFilters);
					}
				} else {
					oItemData[index].equiState = "Error";
					g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
				}
			}
			if (sPath.indexOf("/Tplnr") > 0) {
				if (value !== "") {
					sObjValue = value.toUpperCase();
					sRegExp = sObjValue.replace(/^[ ]+|[ ]+$/g, '');

					if (sRegExp !== "") {
						sUrlPath = "/FlocAssestVHSet";
						oFilters = new sap.ui.model.Filter("Tplnr", "EQ", sObjValue);
						oModel = g.getView().getModel("valueHelp");
						fnSuccess = function (d) {
							if (d.results.length > 0) {
								oItemData[index].flocState = "None";
								oItemData[index].Tplnr = value.toUpperCase();
								oItemData[index].Pltxt = d.results[0].Pltxt;
							} else {
								oItemData[index].flocState = "Error";
							}
							g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
						};
						fnError = function () {
							oItemData[index].flocState = "Error";
							g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
						};
						g._readData(sUrlPath, oModel, fnSuccess, fnError, oFilters);
					}
				} else {
					oItemData[index].flocState = "Error";
					g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
				}
			}
			if (sPath.indexOf("/AsmblyOb") > 0) {
				if (value !== "") {
					sObjValue = value.toUpperCase();
					sRegExp = sObjValue.replace(/^[ ]+|[ ]+$/g, '');

					if (sRegExp !== "") {
						sUrlPath = "/AssemblyBOMSet";
						oFilters = new sap.ui.model.Filter("MatnrAsmblyOb", "EQ", sObjValue);
						oModel = g.getView().getModel("valueHelp");
						fnSuccess = function (d) {
							if (d.results.length > 0) {
								oItemData[index].aState = "None";
								oItemData[index].AsmblyOb = value.toUpperCase();
							} else {
								oItemData[index].aState = "Error";
							}
							g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
						};
						fnError = function () {
							oItemData[index].aState = "Error";
							g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
						};
						g._readData(sUrlPath, oModel, fnSuccess, fnError, oFilters);
					}
				} else {
					oItemData[index].aState = "Error";
					g.getView().getModel(g.oModelName).setProperty("/itemModel", oItemData);
				}
			}
		},

		onItemPress: function (oEvent) {
			var g = this;
			var sModelData = oEvent.getSource().getModel(g.oModelName).getData();

			sModelData.MptypEnabled = false;
			sModelData.StratEnabled = false;
			if (sModelData.cycleIndMultCntr) {
				sModelData.MehrfachEnabled = false;
				sModelData.WsetEnabled = false;
			}
			g._showObject(oEvent.getSource());
		},

		_showObject: function (oItem) {
			var g = this;
			var sModelData = oItem.getModel(g.oModelName).getData();
			var sPath = oItem.oBindingContexts.AIWMPMI.sPath;
			var oCycleData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
			var cat = " ";
			var rbmc = false;
			var seqArr = [];

			var sUnitC = sModelData.Unitc;
			var sStrat = sModelData.Strat;

			if (sModelData.Unitc === "" || sModelData.Unitc === undefined) {
				sUnitC = "Blank";
			}
			if (sModelData.Strat === "" || sModelData.Strat === undefined) {
				sStrat = "Blank";
			}
			if (sModelData.cycleIndSingle) {
				if (sModelData.ScheIndRbPerformance) {
					var unit = oCycleData[0].Zeieh;
					if (unit !== "" && unit !== undefined) {
						sUnitC = unit;
						sStrat = "singlePerf";
					}
				}
			}
			if ((sModelData.Mehrfach === true || sModelData.Wset !== "") && sModelData.cycleIndMultCntr === true) {
				rbmc = true;
				for (var i = 0; i < oCycleData.length; i++) {
					seqArr.push(oCycleData[i].Cycleseqi);
				}
			}

			g.getView().getModel(g.oModelName).setProperty("/cycleModel", oCycleData);
			if (sModelData.Mptyp) {
				cat = sModelData.Mptyp;
			}

			g.getView().getModel(g.oModelName).refresh();

			if (g.viewName !== "ChangeMpmi") {
				var sItemStatus = {
					itemStatus: true,
					oModelUpdateFlag: false
				};
				sap.ui.getCore().setModel(new JSONModel(sItemStatus), "AIWMPMIStatus");
			}

			sap.ui.getCore().setModel(g.getView().getModel(g.oModelName), "AIWMPMIDetail");
			g.itemDetailNavFlag = true;

			sPath = sPath.substring(sPath.lastIndexOf("/") + 1);
			var rowIndex = g.rowIndex.substring(g.rowIndex.lastIndexOf("/") + 1);
			g.getRouter().navTo("itemMpmi", {
				itemPath: encodeURIComponent(sPath),
				CrStatus: g.CrStatus,
				maintCat: cat,
				multiCycle: rbmc,
				sys: g.system,
				strategy: sStrat,
				cUnit: sUnitC,
				mainRowIndex: encodeURIComponent(rowIndex),
				viewName: g.viewName
					// cycleSeq: seqArr
			});
		},

		onDonePress: function (oEvent) {
			var g = this;
			g.doneFlag = true;
			var sSourceId = oEvent.getSource().getId();
			var oModelData = oEvent.getSource().getModel(g.oModelName).getData();
			var oBundle = g.getView().getModel("i18n").getResourceBundle();
			var oHeaderData = g.getView().getModel(g.oModelName).getData();
			var oItemCycleData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
			var sSingleCycle = oHeaderData.cycleIndSingle;
			var sMultiCounter = oHeaderData.cycleIndMultCntr;
			var sTimeKeyDate = oHeaderData.ScheIndRbTimeKeyDate;
			var i18n = this.getView().getModel("i18n");

			if ((sSingleCycle || sMultiCounter) && sTimeKeyDate) {
				for (var i = 0; i < oItemCycleData.length; i++) {
					if (oItemCycleData[i].Zykl1VS === "Error") {
						this.invokeMessage(i18n.getProperty("KEY_SCH_NOT_POSSIBLE") + oItemCycleData[i].Zykl1);
						return;
					}
				}
			}

			if (g.viewName === "CreateMpmi" || g.oModelUpdateFlag === true) {
				g.handleValueState("Wptxt", "WptxtVS", oEvent);
				g.handleValueState("Mptyp", "MptypVS", oEvent);

				var sMplan = oModelData.Warpl;
				var sCycleType = oModelData.cycleType;
				if (sCycleType === "" || sCycleType === undefined) {
					g.doneFlag = false;
					g.invokeMessage(oBundle.getText("mpmiCycleType", [sMplan]));
					return;
				}
				var sButtonNewCycleEnabled = oModelData.ButtonNewCycleEnabled;
				if (sButtonNewCycleEnabled && sCycleType === 0) {
					var oCycleData = g.getView().getModel(g.oModelName).getProperty("/cycleModel");
					if (oCycleData.length <= 0) {
						g.doneFlag = false;
						g.invokeMessage(oBundle.getText("mpmiCycleMand", [sMplan]));
						return;
					}
				}
				var oItemData = g.getView().getModel(g.oModelName).getProperty("/itemModel");
				if (oItemData.length <= 0) {
					g.doneFlag = false;
					g.invokeMessage(oBundle.getText("mpmiItemMand", [sMplan]));
					return;
				}
			}

			if (g.doneFlag === false) {
				var mandMsg = g.getView().getModel("i18n").getProperty("MANDMSG");
				g.invokeMessage(mandMsg);
				return;
			} else {
				var sAIWModel = g.getView().getModel(g.oModelName);
				var sAIWData = sAIWModel.getData();
				if (g.class.getModel()) {
					var sClassData = g.class.getModel().getData();
					if (sClassData) {
						sAIWData.classItems = [];
						for (var a = 0; a < sClassData.length; a++) {
							sAIWData.classItems.push(sClassData[a]);
						}
						sAIWModel.setData(sAIWData);
					}
				}
				if (this.chData) {
					var sCharData = this.chData;
					if (sCharData !== null && sCharData !== undefined) {
						sAIWData.characteristics = [];
						for (var b = 0; b < sCharData.length; b++) {
							sAIWData.characteristics.push(sCharData[b]);
						}
					}
					sAIWModel.setData(sAIWData);
				}

				if (sSourceId.indexOf("idBtnCheck") > -1) {
					this.validateCheck();
					return;
				}

				if (g.oModelUpdateFlag && !g.sExistFlag) {
					var sJsonModel = sap.ui.getCore().getModel(g.oModelName).getData();
					g.getView().getModel(g.oModelName).getData().viewParameter = "change";
					if (g.itemDetailNavFlag) {
						g.itemDetailNavFlag = false;
						sJsonModel.push(sap.ui.getCore().getModel("AIWMPMIDetail").getData());
					} else {
						sJsonModel.push(g.getView().getModel(g.oModelName).getData());
					}
				}
				sap.ui.getCore().getModel(g.oModelName).refresh();
				g.currentFragment = undefined;
				g.rowIndex = undefined;

				var sPreviousHash = History.getInstance().getPreviousHash();
				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					g.getRouter().navTo("main", {}, true);
				}
			}
		},

		validateCheck: function () {
			var g = this;
			var sAIWData = g.getView().getModel(g.oModelName).getData();
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
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
				"FLAddrI": [],
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"Equipment": [],
				"EqAddr": [],
				"EqAddrI": [],
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
				"ClassMpl":[],
				"ValuaMpl":[],
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
					if (aIntlAddr) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							sPayload.FLAddrI.push(aIntlAddr[z]);
						}
					}

					if (g.AltLblDerv === "2" && AIWFLOCModel[a].altlbl) {
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

					if (AIWFLOCModel[a].Floccategory === "L" && AIWFLOCModel[a].lam) {
						var sFLLAM = {
							"Funcloc": AIWFLOCModel[a].Functionallocation,
							"Lrpid": AIWFLOCModel[a].lam.Lrpid,
							"Strtptatr": AIWFLOCModel[a].lam.Strtptatr,
							"Endptatr": AIWFLOCModel[a].lam.Endptatr,
							"Length": AIWFLOCModel[a].lam.Length,
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

					if (AIWEQUIModel[d].EquipmentCatogory === "L" && AIWEQUIModel[d].lam) {
						var sEqLAM = {
							"Equi": AIWEQUIModel[d].Equnr,
							"Lrpid": AIWEQUIModel[d].lam.Lrpid,
							"Strtptatr": AIWEQUIModel[d].lam.Strtptatr,
							"Endptatr": AIWEQUIModel[d].lam.Endptatr,
							"Length": AIWEQUIModel[d].lam.Length,
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
					if (aIntlAddrItems) {
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

			if (AIWListWCData.length > 0) {
				for (var i = 0; i < AIWListWCData.length; i++) {
					var mHeader = {
						"Werks": AIWListWCData[i].plant,
						"Arbpl": AIWListWCData[i].wc,
						"Txtmi": AIWListWCData[i].wcDesc,
						"Verwe": AIWListWCData[i].wcCat,
						"Crveran": AIWListWCData[i].person,
						"Planv": AIWListWCData[i].usg,
						"Vgwts": AIWListWCData[i].stdVal,
						"Crsteus": AIWListWCData[i].ctrlKey
					};
					if (AIWListWCData[i].hasOwnProperty("Type")) {
						if (AIWListWCData[i].Type === "X") {
							mHeader.Type = "X";
						}
					}
					sPayload.Workcenter.push(mHeader);

					if (AIWListWCData[i].cost) {
						for (var j = 0; j < AIWListWCData[i].cost.length; j++) {
							var mCost = {
								"Werks": AIWListWCData[i].cost[j].CrKokrs,
								"Arbpl": AIWListWCData[i].wc,
								"CrKostl": AIWListWCData[i].cost[j].CrKostl,
								"Costcentxt": AIWListWCData[i].cost[j].Costcentxt,
								"CrLstar": AIWListWCData[i].cost[j].CrLstar,
								"Forn1": AIWListWCData[i].cost[j].Forn1,
								"ActvttypeTxt": AIWListWCData[i].cost[j].ActvttypeTxt,
								"Frmltxt": AIWListWCData[i].cost[j].Frmltxt
							};
							sPayload.WCCost.push(mCost);
						}
					}
				}
			}

			var sMPLAN = {
				"Warpl": sAIWData.Warpl,
				"Abrho": sAIWData.Abrho,
				"Hunit": sAIWData.Hunit,
				"Mptyp": sAIWData.Mptyp,
				"Wptxt": sAIWData.Wptxt,
				"Stich": sAIWData.Stich.toString(),
				"Fabkl": sAIWData.Fabkl,
				"FabklDesc": sAIWData.FabklDesc,
				"Sfakt": sAIWData.Sfakt,
				"Andor": g.parseValue(sAIWData.Andor),
				"Mehrfach": g.parseValue(sAIWData.Mehrfach),
				"Strat": sAIWData.Strat,
				"StratDesc": sAIWData.StratDesc,
				"Wset": sAIWData.Wset,
				"Startdate": g._formatDate(sAIWData.Stadt),
				"Unitc": sAIWData.Unitc,
				"Szaeh": sAIWData.Szaeh,
				"PointStp": sAIWData.Mpcycleno,

				"Vspos": sAIWData.Vspos,
				"Topos": sAIWData.Topos,
				"Vsneg": sAIWData.Vsneg,
				"Toneg": sAIWData.Toneg,
				"Horiz": sAIWData.Horiz,
				"CallConf": sAIWData.CallConf,
				"PlanSort": sAIWData.PlanSort,
				"Begru": sAIWData.Begru,
				"InactMp": sAIWData.Deact
			};
			sPayload.MPLAN.push(sMPLAN);

			var sItem = sAIWData.itemModel;
			if (sItem) {
				for (var l = 0; l < sItem.length; l++) {
					var sMPItem = {
						"Mplan": sAIWData.Warpl,
						"Qmart": sItem[l].Qmart, // notif type
						"Qmartx": sItem[l].nTypeTxt, // notif type desc
						"PlntMi": sItem[l].Werks, // planning plant
						"Planningplantdes": sItem[l].Planningplantdes, // planning plant desc
						"IngrpMi": sItem[l].Ingrp, // planner grp
						"Plannergrpdesc": sItem[l].Innam, // planner grp desc
						"Pstxt": sItem[l].Pstxt, // maint item desc
						"WergwMi": sItem[l].WergwMi, // main wc desc
						"ArbpMi": sItem[l].ArbpMi, // main wc
						"Auart": sItem[l].Auart, // order type 
						"Ordertypedesc": sItem[l].oTypeTxt, // order type desc
						"Bautl": sItem[l].AsmblyOb, // assembly
						"Cycleseq": sItem[l].Cycleseq,
						"Equnr": sItem[l].Equnr, // equip
						"Equipdesc": sItem[l].Eqktx, // equip desc
						"TplnrMi": sItem[l].Tplnr, // floc
						"Flocdesc": sItem[l].Pltxt, // floc desc
						"Mitemnumb": sItem[l].Mitemnumb, // maint item 
						"PlnnrMi": sItem[l].PlnnrMi, // TL Type
						"PlntyMi": sItem[l].PlntyMi, // TL Group
						"PlnalMi": sItem[l].PlnalMi, // TL Counter
						SwerkMil: sItem[l].SwerkMil,
						// Name1 = "",
						StortMil: sItem[l].StortMil,
						// Locationdesc = "",
						MsgrpIl: sItem[l].MsgrpIl,
						BeberMil: sItem[l].BeberMil,
						Fing: sItem[l].Fing,
						ArbplIl: sItem[l].ArbplIl,
						// Workcenterdesc = "",
						AbckzIl: sItem[l].AbckzIl,
						// Abctx = "",
						EqfnrIl: sItem[l].EqfnrIl,
						BukrsMil: sItem[l].BukrsMil,
						Butxt: sItem[l].Butxt,
						City: sItem[l].City,
						Anln1Mil: sItem[l].Anln1Mil,
						// Txt50 = "",
						Anln2Mil: sItem[l].Anln2Mil,
						GsberIl: sItem[l].GsberIl,
						// Gtext = "",
						KostlMil: sItem[l].KostlMil,
						// Contareaname = "",
						KokrsMil: sItem[l].KokrsMil,
						Posid: sItem[l].Posid,
						// Post1 = "",
						AufnrIl: sItem[l].AufnrIl,
						// SettleOrdDesc = "",

					};
					sPayload.MPItem.push(sMPItem);

					if (sItem[l].lam) {
						var sMSLAM = {
							"Mplan": sAIWData.Warpl,
							"Mitemnumb": sItem[l].lam.Mitemnumb,
							"Lrpid": sItem[l].lam.Lrpid,
							"Strtptatr": sItem[l].lam.Strtptatr,
							"Endptatr": sItem[l].lam.Endptatr,
							"Length": sItem[l].lam.Length,
							"LinUnit": sItem[l].lam.LinUnit,
							"Startmrkr": sItem[l].lam.Startmrkr,
							"Endmrkr": sItem[l].lam.Endmrkr,
							"Mrkdisst": sItem[l].lam.Mrkdisst,
							"Mrkdisend": sItem[l].lam.Mrkdisend,
							"MrkrUnit": sItem[l].lam.MrkrUnit
						};
						sPayload.MPLAM.push(sMSLAM);
					}
				}
			}

			var sCycle = sAIWData.cycleModel;
			if (sCycle) {
				for (var m = 0; m < sCycle.length; m++) {
					var sMPCycle = {
						"Mplan": sAIWData.Warpl,
						"Point": sCycle[m].Point,
						"PointTxt": sCycle[m].Psort,
						"Offset": sCycle[m].Offset,
						"Ofsetunit": sCycle[m].Ofsetunit,
						"PakText": sCycle[m].PakText,
						"Zeieh": sCycle[m].Zeieh,
						"Zykl1": sCycle[m].Zykl1,
						"Cycleseqi": sCycle[m].Cycleseqi,
						"Mpcycleno": sCycle[m].Mpcycleno
					};
					sPayload.MPCycle.push(sMPCycle);
				}
			}

			var sObjListItem = sAIWData.ObjListItems;
			if (sItem) {
				for (var z = 0; z < sObjListItem.length; z++) {
					var oOLI = {
						"AsmblyOb": sObjListItem[z].AsmblyOb,
						"EquiObj": sObjListItem[z].EquiObj,
						"FlocObj": sObjListItem[z].FlocObj,
						"MatnrObj": sObjListItem[z].MatnrObj,
						"Mitemnumb": sObjListItem[z].Mitemnumb,
						"Mplan": sObjListItem[z].Warpl
					};
					sPayload.MPOBList.push(oOLI);
				}
			}
			
			var sMsClassList = sAIWData.classItems;
			if (sMsClassList) {
				if (sMsClassList.length > 0) {
					for (var h = 0; h < sMsClassList.length; h++) {
						var sMsClass = {
							"Mplan": sAIWData.Warpl,
							"Classtype": sMsClassList[h].Classtype,
							"Class": sMsClassList[h].Class,
							"Clstatus1": sMsClassList[h].Clstatus1
						};
						sPayload.ClassMpl.push(sMsClass);
					}
				}
			}

			var sMsCharList = sAIWData.characteristics;
			if (sMsCharList) {
				if (sMsCharList.length > 0) {
					for (var i = 0; i < sMsCharList.length; i++) {
						var sMsVal = {
							"Mplan": sAIWData.Warpl,
							"Atnam": sMsCharList[i].Atnam,
							"Textbez": sMsCharList[i].Textbez,
							"Atwrt": sMsCharList[i].Atwrt,
							"Class": sMsCharList[i].Class
						};
						sPayload.ValuaMpl.push(sMsVal);
					}
				}
			}

			if (sPayload.FLAddrI.length > 0) {
				sPayload.FLAddrI = $.map(sPayload.FLAddrI, function (obj) {
					return $.extend(true, {}, obj);
				});
				for (var i = 0; i < sPayload.FLAddrI.length > 0; i++) {
					delete sPayload.FLAddrI[i].AdNationEnable;
					delete sPayload.FLAddrI[i].City1iVS;
					delete sPayload.FLAddrI[i].StreetiVS;
				}
			}
			if (sPayload.EqAddrI.length > 0) {
				sPayload.EqAddrI = $.map(sPayload.EqAddrI, function (obj) {
					return $.extend(true, {}, obj);
				});
				for (var i = 0; i < sPayload.EqAddrI.length > 0; i++) {
					delete sPayload.EqAddrI[i].AdNationEnable;
					delete sPayload.EqAddrI[i].City1iVS;
					delete sPayload.EqAddrI[i].StreetiVS;
				}
			}

			this.getView().byId("maintenancePage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("maintenancePage").setBusy(false);
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
					g.getView().byId("maintenancePage").setBusy(false);
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
	});
});