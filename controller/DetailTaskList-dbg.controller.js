/*global location history */
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"ugiaiwui/mdg/aiw/library/js/ClassUtils",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"sap/ui/core/message/Message",
	"sap/m/BusyDialog",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageBox, ClassUtils, ValueHelpProvider, Message,
	BusyDialog, ValueHelpRequest) {
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailTaskList", {

		formatter: formatter,
		colItems: "",
		colItemsT: "",
		taskListH: "",
		index: -1,
		oAttach: [],
		oFileUpload: "",
		cmpData: null,
		cData: null,
		chData: [], //null,
		opData: null, // added */<>/*
		opRowData: null, // added */<>/*
		planPlant: "",
		eSelectDialog: undefined,
		fSelectDialog: undefined,
		ppSelectDialog: undefined,
		pSelectDialog: undefined,
		uSelectDialog: undefined,
		pgSelectDialog: undefined,
		sSelectDialog: undefined,
		sySelectDialog: undefined,
		wcSelectDialog: undefined,
		wctabSelectDialog: undefined,
		wctabSearchResults: undefined,
		wcpSearchResults: undefined,
		wcpSelectDialog: undefined,
		qSelectDialog: undefined,
		qSearchResults: undefined,
		matSearchResults: undefined,
		matSelectDialog: undefined,
		stdSelectDialog: undefined,
		prSelectDialog: undefined,
		isItemPress: "",
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
		system: false,
		ctrlKey: "",
		cReqType: "",
		cReqTypeE: "",
		cReqTypeF: "",
		itemCat: "",
		obj: "",
		oData: null, // modified from undefined to null
		objDetails: undefined,
		charFlag: "",
		codeFlag: "",
		tlType: "",
		group: "",

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ugiaiwui.mdg.aiw.request.view.Detail
		 */
		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
			// var serviceUrl = this._oComponent.getModel().sServiceUrl;
			// // var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
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
			// this.getView().setModel(oModel);
			// this.getView().setModel(vhModel, "valueHelp2");

			var oModel = this._oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);

			var vhModel = this._oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");

			var vhModel2 = this._oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");

			this.system = this.readSystem();

			this.ctrlKey = " ";
			this.itemCat = "L";

			this.getRouter().getRoute("tlDetail").attachPatternMatched(this._onRouteMatched, this);

			var aVisModel = new sap.ui.model.json.JSONModel();
			var aVis = {
				visible: false
			};
			aVisModel.setData(aVis);
			this.getView().setModel(aVisModel, "aVisModel");

			var aEnModel = new sap.ui.model.json.JSONModel();
			var aEnbl = {
				enable: false
			};
			aEnModel.setData(aEnbl);
			this.getView().setModel(aEnModel, "aEnModel");

			jQuery.sap.delayedCall(30, this, function () {
				this.getClassType(this);
			});

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
		},

		getClassType: function (g) {
			var m = g.getView().getModel("valueHelp");
			var sObtab = g.getObTab();
			var oFilter2 = new sap.ui.model.Filter("Obtab", "EQ", sObtab);
			var q = "/ClassTypeSet";
			m.read(q, {
				filters: [oFilter2],
				success: function (d) {
					if (d.results.length > 0) {
						g.Classtype = d.results[0].Klart;
						g.Classtypedesc = d.results[0].Artxt;
					} else {
						g.Classtype = "";
						g.Classtypedesc = "";
					}
				},
				error: function () {
					g.Classtype = "";
					g.Classtypedesc = "";
				}
			});
		},

		WCPPCheckHeader: function () {
			var g = this;
			var q;
			var M = this.getView().getModel();
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var hdData = tlDetailModel.getData();
			q = "/WorkcentrePlantValSet(Werks='" + hdData.lHeader.Iwerk + "',Tarbpl='" + hdData.lHeader.wc + "',Wcplant='" +
				hdData.lHeader.plant + "') ";
			M.read(q, {
				success: function (h) {
					hdData.lHeader.wcValueState = "None";
					tlDetailModel.setData(hdData);
					tlDetailModel.refresh();
				},
				error: function (err) {
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
					MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {}
					});

					hdData.lHeader.wcValueState = "Error";
					tlDetailModel.setData(hdData);
					tlDetailModel.refresh();
				}
			});
		},

		DeriveEquiFlocData: function (e, flag) {
			var g = this;
			var sPath = "/ChangeRequestSet";
			var oModel = g.getView().getModel();
			// var AIWListETLModel = sap.ui.getCore().getModel("AIWListETLModel");
			// var ETLdata = AIWListETLModel.getData();
			var sObject = {};
			var sPayload = {
				"ChangeRequestType": "AIWEAM0P",
				"CrDescription": "",
				"Reason": "01",
				"DeriveData": true,
				"FuncLoc": [],
				"FLAddr": [],
				"FLClass": [],
				"FLVal": [],
				"Equipment": [],
				"EqAddr": [],
				"EqClass": [],
				"EqVal": [],
				"MSPoint": [],
				"MSClass": [],
				"MSVal": [],
				"MPLAN": [],
				"MPItem": [],
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

			// var oAIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC");
			// var oAIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI");

			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();

			if (AIWFLOCModel.length > 0) {
				for (var a = 0; a < AIWFLOCModel.length; a++) {
					var sFuncLoc = {
						// "Type" : true, 
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
						"UstaFloc": AIWFLOCModel[a].UstaEqui // User Status
					};

					if (AIWFLOCModel[a].viewParameter === "create") {
						sFuncLoc.Type = true;
					}
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
						"TimeZone": AIWFLOCModel[a].TimeZone
					};
					sPayload.FLAddr.push(sFLAddr);

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
						// "Type": true, 
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
						"HeqnEeqz": AIWEQUIModel[d].EquipPosition // Position
					};

					if (AIWEQUIModel[d].viewParameter === "create") {
						sEquipment.Type = true;
					}
					sPayload.Equipment.push(sEquipment);

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
						"TimeZone": AIWEQUIModel[d].TimeZone
					};
					sPayload.EqAddr.push(sEqAddr);

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

			if (flag === 'E') {
				var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				if (tlDetailData.lHeader.Iwerk !== "") {
					tlDetailData.lHeader.Werks = tlDetailData.lHeader.Iwerk;
				}
				var etList = {
					"Werks": tlDetailData.lHeader.Werks,
					"Wcplant": tlDetailData.lHeader.plant,
					"Statu": tlDetailData.lHeader.Statu,
					"Tverwe": tlDetailData.lHeader.tlusg,
					"Ktext": tlDetailData.lHeader.Ktext,
					"Tarbpl": tlDetailData.lHeader.wc,
					"Vagrp": tlDetailData.lHeader.Vagrp,
					"Anlzu": tlDetailData.lHeader.Anlzu,
					"Tplnal": (tlDetailData.lHeader.Plnal).toString(),
					"Tleqhdr": tlDetailData.grp,
					"Strat": tlDetailData.lHeader.Strat,
					"Eq2tl": tlDetailData.lHeader.equipment
				};
				sPayload.ETList.push(etList);

				for (var k = 0; k < tlDetailData.lOperation.length; k++) {
					var etlOpr = {
						"Tleqhdr": tlDetailData.grp,
						"Vornr": tlDetailData.lOperation[k].Vornr,
						"TlArbpl": tlDetailData.lOperation[k].Arbpl,
						"Werks2eop": tlDetailData.lOperation[k].Werks,
						"Steus2eop": tlDetailData.lOperation[k].Steus,
						"Ltxa1": tlDetailData.lOperation[k].Ltxa1,
						"Arbei": tlDetailData.lOperation[k].Arbei,
						"Dauno": tlDetailData.lOperation[k].Dauno,
						"Arbeh": tlDetailData.lOperation[k].Arbeh,
						"Anzzl": tlDetailData.lOperation[k].Anzzl,
						"Daune": tlDetailData.lOperation[k].Daune,
						"Indet": tlDetailData.lOperation[k].Indet,
						"Tplnal": (tlDetailData.lOperation[k].Plnal).toString()
					};
					sPayload.ETOprs.push(etlOpr);
				}
			}

			if (flag === "F") {
				var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				if (tlDetailData.lHeader.Iwerk !== "") {
					tlDetailData.lHeader.Werks = tlDetailData.lHeader.Iwerk;
				}
				var ftList = {
					"Werks": tlDetailData.lHeader.Werks,
					"Wcplant": tlDetailData.lHeader.plant,
					"Statu": tlDetailData.lHeader.Statu,
					"Tverwe": tlDetailData.lHeader.tlusg,
					"Ktext": tlDetailData.lHeader.Ktext,
					"Tarbpl": tlDetailData.lHeader.wc,
					"Vagrp": tlDetailData.lHeader.Vagrp,
					"Anlzu": tlDetailData.lHeader.Anlzu,
					"Tplnal": (tlDetailData.lHeader.Plnal).toString(),
					"Tlflhdr": tlDetailData.grp,
					"Strat": tlDetailData.lHeader.Strat,
					"Fl2tl": tlDetailData.lHeader.floc
				};
				sPayload.FTList.push(ftList);

				for (var k = 0; k < tlDetailData.lOperation.length; k++) {
					var ftlOpr = {
						"Tlflhdr": tlDetailData.grp,
						"Vornr": tlDetailData.lOperation[k].Vornr,
						"TlArbpl": tlDetailData.lOperation[k].Arbpl,
						"Werks2fop": tlDetailData.lOperation[k].Werks,
						"Steus2fop": tlDetailData.lOperation[k].Steus,
						"Ltxa1": tlDetailData.lOperation[k].Ltxa1,
						"Arbei": tlDetailData.lOperation[k].Arbei,
						"Dauno": tlDetailData.lOperation[k].Dauno,
						"Arbeh": tlDetailData.lOperation[k].Arbeh,
						"Anzzl": tlDetailData.lOperation[k].Anzzl,
						"Daune": tlDetailData.lOperation[k].Daune,
						"Indet": tlDetailData.lOperation[k].Indet,
						"Tplnal": (tlDetailData.lOperation[k].Plnal).toString()
					};
					sPayload.FTOprs.push(ftlOpr);
				}
			}

			var fnSuccess = function (r) {
				var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
				var tlDetailData = tlDetailModel.getData();
				if (flag === 'E') {
					for (var j = 0; j < r.ETOprs.results.length; j++) {
						tlDetailData.lOperation[j].Arbpl = r.ETOprs.results[j].TlArbpl; // WORK CENTER
						tlDetailData.lOperation[j].Werks = r.ETOprs.results[j].Werks2eop; //WORK CENTER PLANT
						tlDetailData.lOperation[j].Steus = r.ETOprs.results[j].Steus2eop; //CONTROL KEY
						if (r.ETOprs.results[j].Usrvalflg1 === "X") { //CONTROL KEY ENABLE/DISABLE
							tlDetailData.lOperation[j].SteusEnable = false;
						} else {
							tlDetailData.lOperation[j].SteusEnable = true;
						}
					}
					tlDetailModel.setData(tlDetailData);
					sap.ui.getCore().getModel("tlDetailModel").refresh();
				}
				if (flag === 'F') {
					for (var j = 0; j < r.FTOprs.results.length; j++) {
						tlDetailData.lOperation[j].Arbpl = r.FTOprs.results[j].TlArbpl; // WORK CENTER
						tlDetailData.lOperation[j].Werks = r.FTOprs.results[j].Werks2fop; //WORK CENTER PLANT
						tlDetailData.lOperation[j].Steus = r.FTOprs.results[j].Steus2fop; //CONTROL KEY
						if (r.FTOprs.results[j].Usrvalflg1 === "X") { //CONTROL KEY ENABLE/DISABLE
							tlDetailData.lOperation[j].SteusEnable = false;
						} else {
							tlDetailData.lOperation[j].SteusEnable = true;
						}
					}
					tlDetailModel.setData(tlDetailData);
					sap.ui.getCore().getModel("tlDetailModel").refresh();
				}
			};

			//var oModel = g.getView().getModel();
			oModel.create(sPath, sPayload, {
				success: fnSuccess,
				error: {

				}
			});
		},

		_onRouteMatched: function (oEvent) {
			this.currentObj = undefined;
			var sPath = decodeURIComponent(oEvent.getParameter("arguments").itemPath);
			this.basicPath = "/" + sPath.split("/")[1];
			this.headerPath = "/" + sPath.split("/")[2];
			this.mainPath = sPath;
			this.action = oEvent.getParameter("arguments").action;
			this.status = oEvent.getParameter("arguments").status;
			this.mode = oEvent.getParameter("arguments").mode;
			var empty = [];
			var nClass = [];
			var nChar = [];
			var nOperation = [];
			var nComponent = [];
			this.getView().byId("idBtnCheck").setVisible(true);

			var classFragmentId = this.getView().createId("clsFrag");
			this.class = sap.ui.core.Fragment.byId(classFragmentId, "assignmentTab");

			var itemFragmentId = this.getView().createId("charFrag");
			this.char = sap.ui.core.Fragment.byId(itemFragmentId, "characteristicsTab");

			if (sap.ui.getCore().getModel("oOpFlag")) {
				var opDetFlag = sap.ui.getCore().getModel("oOpFlag").opDetFlag;
			}

			var tlDetailModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(tlDetailModel, "tlDetailModel");

			if (this.action.indexOf("GTL") > 0 && this.action !== "changeGTL") {

				var AIWListGTLModel = sap.ui.getCore().getModel("AIWListGTLModel");
				this.currentObj = AIWListGTLModel.getProperty(this.basicPath);
				this.currentObj.lHeader = this.currentObj.header[parseInt(this.headerPath.substr(1))];
				this.currentObj.lHeader.vEquiLbl = false;
				this.currentObj.lHeader.vEqui = false;
				this.currentObj.lHeader.vEquiDesc = false;
				this.currentObj.lHeader.vFlocLbl = false;
				this.currentObj.lHeader.vFloc = false;
				this.currentObj.lHeader.vFlocDesc = false;
				this.currentObj.lHeader.equipment = "";
				this.currentObj.lHeader.equipmentDesc = "";
				this.currentObj.lHeader.floc = "";
				this.currentObj.lHeader.flocDesc = "";
				this.currentObj.lHeader.PPenable = true;

				this.getView().byId("grpDetLbl").setText(this.getView().getModel("i18n").getProperty("GROUP_GEN_TXT"));
			} else if (this.action.indexOf("ETL") > 0 && this.action !== "changeETL") {

				var AIWListETLModel = sap.ui.getCore().getModel("AIWListETLModel");
				this.currentObj = AIWListETLModel.getProperty(this.basicPath);
				this.currentObj.lHeader = this.currentObj.header[parseInt(this.headerPath.substr(1))];
				this.currentObj.lHeader.vEquiLbl = true;
				this.currentObj.lHeader.vEqui = true;
				this.currentObj.lHeader.vEquiDesc = true;
				this.currentObj.lHeader.vFlocLbl = false;
				this.currentObj.lHeader.vFloc = false;
				this.currentObj.lHeader.vFlocDesc = false;
				this.currentObj.lHeader.PPenable = false;
				this.currentObj.lHeader.bAddHeader = false;
				if (this.currentObj.lHeader.equipment !== "" && this.currentObj.lHeader.equipment !== null) {
					this.currentObj.lHeader.bAddHeader = true;
				}

				this.getView().byId("grpDetLbl").setText(this.getView().getModel("i18n").getProperty("GROUP_EQ_TXT"));
			} else if (this.action.indexOf("FTL") > 0 && this.action !== "changeFTL") {

				var AIWListFTLModel = sap.ui.getCore().getModel("AIWListFTLModel");
				this.currentObj = AIWListFTLModel.getProperty(this.basicPath);
				this.currentObj.lHeader = this.currentObj.header[parseInt(this.headerPath.substr(1))];
				this.currentObj.lHeader.vEquiLbl = false;
				this.currentObj.lHeader.vEqui = false;
				this.currentObj.lHeader.vEquiDesc = false;
				this.currentObj.lHeader.vFlocLbl = true;
				this.currentObj.lHeader.vFloc = true;
				this.currentObj.lHeader.vFlocDesc = true;
				this.currentObj.lHeader.PPenable = false;
				this.currentObj.lHeader.bAddHeader = false;
				if (this.currentObj.lHeader.floc !== "" && this.currentObj.lHeader.floc !== null) {
					this.currentObj.lHeader.bAddHeader = true;
				}

				this.getView().byId("grpDetLbl").setText(this.getView().getModel("i18n").getProperty("GROUP_FL_TXT"));
			}

			if (!opDetFlag) {
				this.grpCounter = this.currentObj.lHeader.Plnal;
				this.currentObj.lHeader.bAddOperation = true;
				this.currentObj.lHeader.bAddComponent = false;
				this.currentObj.lHeader.bAddOprRel = false;
				this.currentObj.lHeader.bAddSrvOpOrvw = false;
				this.currentObj.lHeader.bAddPRT = false;
				this.currentObj.lHeader.bAddInspChar = false;
				this.currentObj.lOperation = [];
				this.currentObj.lComponent = [];
				this.currentObj.lOprRel = [];
				this.currentObj.lPRT = [];
				this.currentObj.lInspChar = [];
				if (this.currentObj.operation === undefined || this.currentObj.operation.length === 0) {
					if (this.getView().byId("operationTab").getModel("tlDetailModel")) {
						this.getView().getModel("tlDetailModel").setProperty("/lOperation", empty);
						this.getView().byId("operationTab").setModel(tlDetailModel, "tlDetailModel");
					}
				} else {
					var op = this.currentObj.operation;
					for (var i = 0; i < op.length; i++) {
						if (op[i].Plnal === this.grpCounter) {
							nOperation.push(op[i]);
						}
					}
					this.currentObj.lOperation = nOperation;
					this.getView().getModel("tlDetailModel").setProperty("/lOperation", nOperation);
					this.getView().byId("operationTab").setModel(tlDetailModel, "tlDetailModel");

					if (this.currentObj.lOperation.length > 0) {
						this.getView().byId("operationTab").getItems()[0].setSelected(true);
					}
				}
				if (this.currentObj.component === undefined || this.currentObj.component.length === 0) {
					if (this.getView().byId("components").getModel("tlDetailModel")) {
						this.getView().getModel("tlDetailModel").setProperty("/lComponent", empty);
						this.getView().byId("components").setModel(tlDetailModel, "tlDetailModel");
					}
				} else {
					//this.cmpData = this.currentObj.component;
					if (this.currentObj.lOperation.length > 0) {
						this.cmpData = this.currentObj.component;
						var comp = this.currentObj.component;
						for (var i = 0; i < comp.length; i++) {
							if (comp[i].Plnal === this.grpCounter && comp[i].Vornr === this.currentObj.lOperation[0].Vornr) {
								nComponent.push(comp[i]);
							}
						}
						this.currentObj.lComponent = nComponent;
						this.getView().getModel("tlDetailModel").setProperty("/lComponent", nComponent);
						this.getView().byId("components").setModel(tlDetailModel, "tlDetailModel");
					} else {
						this.currentObj.lComponent = [];
						this.getView().getModel("tlDetailModel").setProperty("/lComponent", nComponent);
						this.getView().byId("components").setModel(tlDetailModel, "tlDetailModel");
					}
				}
				if (this.currentObj.lOperation === undefined || this.currentObj.lOperation.length === 0) {
					this.currentObj.lOprRel = [];
					this.currentObj.lSrvPckgOvrw = [];
					this.currentObj.lMaintPckg = [];
					this.currentObj.lPRT = [];
					this.currentObj.lInspChar = [];
				} else {
					var aOprRel = this.currentObj.lOperation[0].OprRel;
					this.currentObj.lOprRel = aOprRel;

					var aSrvPckgOvrw = this.currentObj.lOperation[0].SrvPckgOvrw;
					this.currentObj.lSrvPckgOvrw = aSrvPckgOvrw;

					var aTLPRT = this.currentObj.lOperation[0].PRT;
					this.currentObj.lPRT = aTLPRT;

					var aInspChar = this.currentObj.lOperation[0].InspChar;
					this.currentObj.lInspChar = aInspChar;

					if (this.currentObj.lOperation[0].Steus === "PM03" || this.currentObj.lOperation[0].Steus === "PM05") {
						this.currentObj.lHeader.bAddSrvOpOrvw = true;
					} else {
						this.currentObj.lHeader.bAddSrvOpOrvw = false;
					}

					if (this.currentObj.lOperation[0].insPt !== "") {
						this.currentObj.lHeader.bAddInspChar = true;
					} else {
						this.currentObj.lHeader.bAddInspChar = false;
					}

					this.currentObj.lMaintPckg = [];
					for (var y in this.currentObj.lOperation) {
						for (var z in this.currentObj.MaintPckg) {
							if (this.currentObj.lOperation[y].Vornr === this.currentObj.MaintPckg[z].Vornr &&
								this.currentObj.lOperation[y].Plnal === this.currentObj.MaintPckg[z].Plnal) {
								this.currentObj.lMaintPckg.push(this.currentObj.MaintPckg[z]);
							}
						}
					}
				}

				if (this.currentObj.lHeader.Strat !== "") {
					this.getView().byId("idTabMaintPckg").setVisible(true);
					tlDetailModel.setData(this.currentObj);
					this.readMaintPckgConfig(this.currentObj.lHeader.Strat, true);
				} else {
					this.getView().byId("idTabMaintPckg").setVisible(false);
					this.getView().byId("idTabMaintPckg").setModel(new JSONModel(this.currentObj.lMaintPckg));
				}
			} else {
				this.currentObj = sap.ui.getCore().getModel("tlDetailModel").getData();

				// if (sap.ui.getCore().getModel("oOpFlag").opIndex) {
				var opIndex = parseInt(sap.ui.getCore().getModel("oOpFlag").opIndex);
				if (this.currentObj.lOperation.length > 0) {
					this.getView().byId("operationTab").getItems()[opIndex].setSelected(true);
					var nComponent = [];
					if (this.cmpData) {
						for (var i = 0; i < this.cmpData.length; i++) {
							if (this.cmpData[i].Plnal === this.grpCounter && this.cmpData[i].Vornr === this.currentObj.lOperation[opIndex].Vornr) {
								nComponent.push(this.cmpData[i]);
							}
						}
					}
					this.currentObj.lComponent = nComponent;
				}

				var aOprRel = this.currentObj.lOperation[opIndex].OprRel;
				this.currentObj.lOprRel = aOprRel;

				var aSrvPckgOvrw = this.currentObj.lOperation[opIndex].SrvPckgOvrw;
				this.currentObj.lSrvPckgOvrw = aSrvPckgOvrw;

				var aTLPRT = this.currentObj.lOperation[opIndex].PRT;
				this.currentObj.lPRT = aTLPRT;

				var aInspChar = this.currentObj.lOperation[opIndex].InspChar;
				this.currentObj.lInspChar = aInspChar;

				if (this.currentObj.lOperation[opIndex].Steus === "PM03" || this.currentObj.lOperation[opIndex].Steus === "PM05") {
					this.currentObj.lHeader.bAddSrvOpOrvw = true;
				} else {
					this.currentObj.lHeader.bAddSrvOpOrvw = false;
				}

				if (this.currentObj.lOperation[0].insPt !== "") {
					this.currentObj.lHeader.bAddInspChar = true;
				} else {
					this.currentObj.lHeader.bAddInspChar = false;
				}

				// this.currentObj.lMaintPckg = [];
				// for (var y in this.currentObj.lOperation) {
				// 	for (var z in this.currentObj.MaintPckg) {
				// 		if (this.currentObj.lOperation[y].Vornr === this.currentObj.MaintPckg[z].Vornr &&
				// 			this.currentObj.lOperation[y].Plnal === this.currentObj.MaintPckg[z].Plnal) {
				// 			this.currentObj.lMaintPckg.push(this.currentObj.MaintPckg[z]);
				// 		}
				// 	}
				// }

				// if (this.currentObj.lHeader.Strat !== "") {
				// 	this.getView().byId("idTabMaintPckg").setVisible(true);
				// } else {
				// 	this.getView().byId("idTabMaintPckg").setVisible(false);
				// }

				var oOpFlag = {
					opDetFlag: false
				}
				sap.ui.getCore().setModel(oOpFlag, "oOpFlag");
			}

			tlDetailModel.setData(this.currentObj);
			this.getView().setModel(tlDetailModel, "tlDetailModel");
			this.getView().getModel("tlDetailModel").refresh();
			sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");
			this.getView().byId("operationTab").getModel("tlDetailModel").refresh();

			if (this.action === "changeGTL" || this.action === "changeETL" || this.action === "changeFTL") {

				this.tlType = oEvent.getParameter("arguments").tlType;
				this.group = oEvent.getParameter("arguments").group;
				// this.getView().byId("idCatRB").setVisible(false);

				this.getView().byId("operationTab").setVisible(true);
				this.getView().byId("components").setVisible(true);
				this.class.setVisible(true);
				this.char.setVisible(true);

				var vis = this.getView().getModel("aVisModel").getData();
				vis.visible = false;
				this.getView().getModel("aVisModel").setData(vis);

				var enbl = this.getView().getModel("aEnModel").getData();
				enbl.enable = true;
				this.getView().getModel("aEnModel").setData(enbl);

				this.readTaskListDetails();
				if (this.action === "changeGTL") {
					var AIWListGTLModel = sap.ui.getCore().getModel("AIWListGTLModel");
					this.currentObj = AIWListGTLModel.getProperty(this.basicPath);
					this.currentObj.modeflag = "Chg";
				} else if (this.action === "changeFTL") {
					var AIWListFTLModel = sap.ui.getCore().getModel("AIWListFTLModel");
					this.currentObj = AIWListFTLModel.getProperty(this.basicPath);
					this.currentObj.modeflag = "Chg";
				} else if (this.action === "changeETL") {
					var AIWListETLModel = sap.ui.getCore().getModel("AIWListETLModel");
					this.currentObj = AIWListETLModel.getProperty(this.basicPath);
					this.currentObj.modeflag = "Chg";
				}
				this.getView().byId("tlDetailPage").setTitle(this.getView().getModel("i18n").getProperty("tlChgMasterTitle"));

				var refreshModel = sap.ui.getCore().getModel("refreshModel");
				refreshModel.setProperty("/refreshSearch", false);
			} else {
				if (this.currentObj.mode === "create") {
					this.getView().byId("tlDetailPage").setTitle(this.getView().getModel("i18n").getProperty("tlMasterTitle"));
				} else {
					this.getView().byId("tlDetailPage").setTitle(this.getView().getModel("i18n").getProperty("tlChgMasterTitle"));
				}
			}

			if (this.mode === "display") {
				this.getView().byId("idBtnCheck").setVisible(false);
				var vis = this.getView().getModel("aVisModel").getData();
				vis.visible = true;
				this.getView().getModel("aVisModel").setData(vis);

				this.getView().byId("idTABFormSections").setVisible(false);
				this.getView().byId("operationTab").setVisible(false);
				this.getView().byId("components").setVisible(false);
				// this.getView().byId("taskListHeaderOverview").setMode("None");
				this.class.setVisible(false);
				this.char.setVisible(false);

				var vis = this.getView().getModel("aVisModel").getData();
				vis.visible = true;
				this.getView().getModel("aVisModel").setData(vis);

				var enbl = this.getView().getModel("aEnModel").getData();
				enbl.enable = false;
				this.getView().getModel("aEnModel").setData(enbl);

				// this.getView().byId("equipment").setEnabled(false);
				// this.getView().byId("floc").setEnabled(false);

				var AIWAPPROVE = new JSONModel([]);
				var AIWAPPROVEData = {
					classItems: [],
					characteristics: []
				};
				if (this.currentObj.Class) {
					var classLength = this.currentObj.Class.length;
					for (var i = 0; i < classLength; i++) {
						if (this.currentObj.lHeader.Plnal === this.currentObj.Class[i].Tplnal) {
							nClass.push(this.currentObj.Class[i]);
						}
					}
				}
				AIWAPPROVEData.classItems = nClass;
				if (this.currentObj.Char) {
					var charLength = this.currentObj.Char.length;
					var classData = AIWAPPROVEData.classItems;
					if (classData.length > 0) {
						for (var i = 0; i < classData.length; i++) {
							for (var j = 0; j < charLength; j++) {
								if (classData[i].Class === this.currentObj.Char[j].Class) {
									nChar.push(this.currentObj.Char[j]);
								}
							}
						}
					}
				}
				AIWAPPROVEData.characteristics = nChar;
				AIWAPPROVE.setData(AIWAPPROVEData);
				this.getView().setModel(AIWAPPROVE, "AIWAPPROVE");

				var titleObj = {};
				titleObj.sTitle = "Task List";
				var titleModelTL = new JSONModel(titleObj);
				this.getView().setModel(titleModelTL, "titleModelTL");

				if (this.currentObj.lHeader.Strat !== "") {
					this.getView().byId("idTabApprMaintPckg").setVisible(true);
					tlDetailModel.setData(this.currentObj);
					this.readMaintPckgConfig(this.currentObj.lHeader.Strat, true, "Appr");
				} else {
					this.getView().byId("idTabApprMaintPckg").setVisible(false);
					this.getView().byId("idTblApprMaintPckg").setModel(new JSONModel(this.currentObj.lMaintPckg));
				}
			} else {
				this.getActivityType(this.currentObj.lHeader.wc);

				this.getView().byId("idTABFormSections").setVisible(true);
				this.getView().byId("operationTab").setVisible(true);
				this.getView().byId("components").setVisible(true);
				if (this.currentObj.Class) {
					var cModel = new sap.ui.model.json.JSONModel();
					var classLength = this.currentObj.Class.length;
					for (var i = 0; i < classLength; i++) {
						if (this.currentObj.Class[i].Plnal === this.currentObj.lHeader.Plnal) {
							nClass.push(this.currentObj.Class[i]);
						}
					}
					cModel.setData(nClass);
					this.class.setModel(cModel);

					if (nClass.length > 0) {
						this.class.getItems()[0].setSelected(true);
					}
				}
				this.chData = [];
				if (this.currentObj.Char) {
					for (var z = 0; z < nClass.length; z++) {
						for (var y = 0; y < this.currentObj.Char.length; y++) {
							if (this.currentObj.Char[y].Class === nClass[z].Class && this.currentObj.Char[y].Plnal === nClass[z].Plnal) {
								this.chData.push(this.currentObj.Char[y]);
							}
						}
					}
				}
				if (this.chData.length > 0) {
					for (var j = 0; j < this.chData.length; j++) {
						if (nClass[0].Class === this.chData[j].Class && nClass[0].Plnal === this.chData[j].Plnal) {
							nChar.push(this.chData[j]);
						}
					}
					this.char.setModel(new JSONModel(nChar));
				} else {
					this.char.setModel(new JSONModel([]));
				}
				this.class.setVisible(true);
				this.char.setVisible(true);

				var vis = this.getView().getModel("aVisModel").getData();
				vis.visible = false;
				this.getView().getModel("aVisModel").setData(vis);

				var enbl = this.getView().getModel("aEnModel").getData();
				enbl.enable = true;
				this.getView().getModel("aEnModel").setData(enbl);

				var titleObj = {};
				if (this.currentObj.modeflag === "Crt" && this.currentObj.typeFlag === "G") {
					titleObj.sTitle = "Create General Task List";
				} else if (this.currentObj.modeflag === "Crt" && this.currentObj.typeFlag === "E") {
					titleObj.sTitle = "Create Equipment Task List";
				} else if (this.currentObj.modeflag === "Crt" && this.currentObj.typeFlag === "F") {
					titleObj.sTitle = "Create Functional Location Task List";
				} else if (this.currentObj.modeflag === "Chg" && this.currentObj.typeFlag === "G") {
					titleObj.sTitle = "Change General Task List";
				} else if (this.currentObj.modeflag === "Chg" && this.currentObj.typeFlag === "E") {
					titleObj.sTitle = "Change Equipment Task List";
				} else if (this.currentObj.modeflag === "Chg" && this.currentObj.typeFlag === "F") {
					titleObj.sTitle = "Change Functional Location Task List";
				}

				var titleModelTL = new JSONModel(titleObj);
				this.getView().setModel(titleModelTL, "titleModelTL");
			}
		},

		getActivityType: function (imWC) {
			var g = this;
			var q = "/WorkCenterVHSet";
			var oFilter = new sap.ui.model.Filter("Arbpl", "EQ", imWC);
			var m = this.getView().getModel("valueHelp");
			var wcExists = false;

			// var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
			// if (oModelData.length > 0) {
			// 	for (var i = 0; i < oModelData.length; i++) {
			// 		if (oModelData[i].wc === c) {
			// 			g.ActivityType = d.results[0].Lar01;
			// 			// g.currentObj.lHeader.wcDesc = oModelData[i].Ktext;
			// 			// g.currentObj.lHeader.wc = a;
			// 			// g.currentObj.lHeader.plant = oModelData[i].plant;
			// 			// tlDetailModel.setData(g.currentObj);
			// 			wcExists = true;
			// 		}
			// 	}
			// }

			if (wcExists === true) {
				return;
			} else {
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.ActivityType = d.results[0].Lar01;
							g.ctrlKey = d.results[0].Steus;
						} else {
							g.ActivityType = "";
							g.ctrlKey = "";
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						// g.currentObj.lHeader.wcValueState = "Error";
						// g.currentObj.lHeader.wcValueStateTxt = d;
						// tlDetailModel.setData(g.currentObj);
						g.ActivityType = "";
						g.ctrlKey = "";
					}
				});
			}
		},

		onAfterRendering: function () {
			this.attachRequest();
		},

		/*onTlDetail: function() {
			var tlDetailModel = this.getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			tlDetailData.lHeader.vEquiLbl = false;
			tlDetailData.lHeader.vEqui = false;
			tlDetailData.lHeader.vEquiDesc = false;
			tlDetailData.lHeader.equipment = "";
			tlDetailData.lHeader.equipmentDesc = "";
			tlDetailData.lHeader.floc = "";
			tlDetailData.lHeader.flocDesc = "";
			tlDetailData.lHeader.vFlocLbl = false;
			tlDetailData.lHeader.vFloc = false;
			tlDetailData.lHeader.vFlocDesc = false;
			// tlDetailData.rbGen = true;
			// tlDetailData.rbEqui = true;
			// tlDetailData.rbFloc = true;
			// tlDetailData.rbGenSel = false;
			// tlDetailData.rbEquiSel = false;
			// tlDetailData.rbFlocSel = false;
			tlDetailModel.setData(tlDetailData);
			this.getView().setModel(tlDetailModel, "tlDetailModel");
			sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");
		},*/

		readSystem: function () {
			var m = this._oView.getModel("valueHelp");
			var g = this;
			// this.system = "";
			var q = "/SystemTypeSet";
			m.read(q, {
				success: function (r) {
					g.system = r.results[0].System;
					if (g.system === true) {
						g._oView.byId("material").setMaxLength(40);
					} else {
						g._oView.byId("material").setMaxLength(18);
					}
					return g.system;
				}
			});
			/*m.read("/SystemTypeSet", null, null, true, function(r) {
			  g.system = r.results[0].System;
			  if (g.system === true) {
			    g._oView.byId("material").setMaxLength(40);
			  } else {
			    g._oView.byId("material").setMaxLength(18);
			  }
			  return g.system;
			});*/
		},

		readTaskListDetails: function () {
			var g = this;
			var m = this.getView().getModel();
			var url;
			var tlDetailModel = this.getModel("tlDetailModel");
			// var tlDetailData = tlDetailModel.getData();
			var url = "/ChangeRequestSet";
			var oFilter = [new sap.ui.model.Filter("Plnnr", "EQ", this.group),
				new sap.ui.model.Filter("Plnty", "EQ", this.tlType)
			];
			if (this.tlType === "A") {
				var oExpand = ["GTClass", "GTComp", "GTInsp", "GTList", "GTMPack", "GTMpackRead", "GTOprs", "GTPRT", "GTRel", "GTSpack", "GTVal"];
			} else if (this.tlType === "E") {
				var oExpand = ["ETClass", "ETComp", "ETInsp", "ETList", "ETMPack", "ETMpackRead", "ETOprs", "ETPRT", "ETRel", "ETSpack", "ETVal"];
			} else if (this.tlType === "T") {
				var oExpand = ["FTClass", "FTComp", "FTInsp", "FTList", "FTMPack", "FTMpackRead", "FTOprs", "FTPRT", "FTRel", "FTSpack", "FTVal"];
			}

			m.read(url, {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					if (r.results.length > 0) {
						var d = r.results[0];
						var message = r.results[0].Message;
						g.lockMsg = "";
						if (message !== "") {
							g.lockMsg = true;
							sap.m.MessageToast.show(message, {
								duration: 15000,
								animationDuration: 15000
							});
						}
						var hPath = parseInt(g.headerPath.substr(1));
						var components, compModel, classList, charList, cModel, _cModel;
						if (g.tlType === "A") {
							if (d.GTList.results.length > 0) {
								var header = d.GTList.results[0];
								g.currentObj = {
									validFrm: formatter.getDateFormat(d.Datuv),
									grp: r.results[0].Plnnr,
									vEquiLbl: false,
									vEqui: false,
									vEquiDesc: false,
									vFlocLbl: false,
									vFloc: false,
									vFlocDesc: false,
									bAddComponent: true,
									mode: "change",
									MaintPckg: [],
									KDenable: false
								};
								tlDetailModel.setData(g.currentObj);
								var headerDetails = d.GTList.results;
								if (headerDetails.length > 0) {
									for (var h = 0; h < headerDetails.length; h++) {
										headerDetails[h].pPlantDesc = headerDetails[h].Iwerktxt;
										headerDetails[h].usageDesc = headerDetails[h].TlUsgTxt;
										headerDetails[h].plGrpDesc = headerDetails[h].Plnnrgrptxt;
										headerDetails[h].statusDesc = headerDetails[h].Statustxt;
										headerDetails[h].sysCondDesc = headerDetails[h].Anlzux;
										headerDetails[h].stratDesc = headerDetails[h].Strattxt;
										headerDetails[h].Plnal = headerDetails[h].Tplnal;
										headerDetails[h].Verwe = headerDetails[h].Tverwe;
										headerDetails[h].plEnable = false;
										headerDetails[h].vEquiLbl = false;
										headerDetails[h].vEqui = false;
										headerDetails[h].vEquiDesc = false;
										headerDetails[h].vFlocLbl = false;
										headerDetails[h].vFloc = false;
										headerDetails[h].vFlocDesc = false;
										headerDetails[h].valueStateT = "None";
										headerDetails[h].valueStatePP = "None";
										headerDetails[h].valueStateU = "None";
										headerDetails[h].valueStateS = "None";
										headerDetails[h].tlusg = headerDetails[h].Tverwe;
										headerDetails[h].Iwerk = headerDetails[h].Werks;
										headerDetails[h].wc = headerDetails[h].Tarbpl;
										headerDetails[h].plant = headerDetails[h].Wcplant;
										headerDetails[h].grp = headerDetails[h].Tlgnhdr;
										headerDetails[h].insPt = headerDetails[h].Slwbez;
										headerDetails[h].insPtDesc = headerDetails[h].Slwbeztxt;
									}
									var oModel = new sap.ui.model.json.JSONModel();
									oModel.setData(headerDetails);
									g.getModel("tlDetailModel").setProperty("/lHeader", headerDetails[hPath]);
								}
								var operationDetails = d.GTOprs.results;
								if (operationDetails.length > 0) {
									var oprRel = d.GTRel.results;
									var SrvPckgOvrw = d.GTSpack.results;
									var maintPckg = d.GTMPack.results;
									var maintPckgDefault = d.GTMpackRead.results;
									var aPrt = d.GTPRT.results;
									var aInsp = d.GTInsp.results;
									for (var o = 0; o < operationDetails.length; o++) {
										operationDetails[o].calcKeyDesc = "";
										operationDetails[o].actTypDesc = "";
										operationDetails[o].flag = operationDetails[o].Plnal + "-" + operationDetails[o].Vornr;
										operationDetails[o].Arbpl = operationDetails[o].TlArbpl;
										operationDetails[o].Plnal = operationDetails[o].Tplnal;
										operationDetails[o].opState = "None";
										operationDetails[o].opDescState = "None";
										operationDetails[o].wcValueState = "None";
										operationDetails[o].plantState = "None";
										operationDetails[o].ctrlKeyState = "None";
										operationDetails[o].Werks = operationDetails[o].Werks2gop;
										operationDetails[o].Steus = operationDetails[o].Steus2gop;
										operationDetails[o].workPerc = operationDetails[o].Prznt.toString();
										operationDetails[o].orderQty = operationDetails[o].Bmvrg;
										operationDetails[o].ordQtyUnit = operationDetails[o].Bmeih;
										operationDetails[o].netPrice = operationDetails[o].Opreis;
										operationDetails[o].currency = operationDetails[o].Owaers;
										operationDetails[o].priceUnit = operationDetails[o].Opeinh;
										operationDetails[o].costElement = operationDetails[o].Sakto2gop;
										operationDetails[o].materialGrp = operationDetails[o].Omatkl;
										operationDetails[o].puchGroup = operationDetails[o].Oekgrp;
										operationDetails[o].purchOrg = operationDetails[o].Ekorg;
										operationDetails[o].Uvorn = operationDetails[o].Uvorn;
										operationDetails[o].equi = operationDetails[o].EqunrGop;
										operationDetails[o].floc = operationDetails[o].TplnrGop;
										operationDetails[o].UvornEnable = false;
										operationDetails[o].OprRel = [];
										operationDetails[o].SrvPckgOvrw = [];
										operationDetails[o].PRT = [];
										operationDetails[o].InspChar = [];

										if (oprRel.length > 0) {
											for (var x in oprRel) {
												if (g.currentObj.grp === oprRel[x].Tlgnhdr && operationDetails[o].Plnal === oprRel[x].Tplnal && operationDetails[o].Vornr ===
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
													operationDetails[o].OprRel.push(objOprRel);
												}
											}
										}

										if (SrvPckgOvrw.length > 0) {
											for (var x in SrvPckgOvrw) {
												if (g.currentObj.grp === SrvPckgOvrw[x].Tlgnhdr && operationDetails[o].Plnal === SrvPckgOvrw[x].Tplnal &&
													operationDetails[o].Vornr === SrvPckgOvrw[x].Vornrr) {
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
													operationDetails[o].SrvPckgOvrw.push(oSPO);
												}
											}
										}

										if (aPrt.length > 0) {
											for (var x in aPrt) {
												if (g.currentObj.grp === aPrt[x].Tlgnhdr && operationDetails[o].Plnal === aPrt[x].Tplnal && operationDetails[o].Vornr ===
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
														objPRT.Plant = operationDetails[o].Werks;
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

													operationDetails[o].PRT.push(objPRT);
												}
											}
										}

										if (aInsp.length > 0) {
											for (var x in aInsp) {
												if (g.currentObj.grp === aInsp[x].Tlgnhdr && operationDetails[o].Plnal === aInsp[x].Tplnal && g.currentObj.operation[
														o].Vornr === aInsp[x].Vornrgins) {
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
														BaseSampQty: aInsp[x].Pruefeinh.toString(),
														CodeGrp: aInsp[x].Auswmenge,

														MastInspCharVS: "None",
														PlantVS: "None",
														VersionVS: "None",
														InspMthdVS: "None",
														InspMthdPlntVS: "None",
														SampProcVS: "None"
													};
													operationDetails[o].InspChar.push(objInsp);
												}
											}
										}

										var currReadMpack = [];
										if (maintPckgDefault.length > 0) {
											for (var w in maintPckgDefault) {
												if (g.currentObj.grp === maintPckgDefault[w].Tlgnhdr && operationDetails[o].Plnal === maintPckgDefault[w].Tplnal) {
													currReadMpack.push(maintPckgDefault[w]);
												}
											}
										}

										var currSelMpack = [];
										if (maintPckg.length > 0) {
											for (var x in maintPckg) {
												if (g.currentObj.grp === maintPckg[x].Tlgnhdr && operationDetails[o].Plnal === maintPckg[x].Tplnal &&
													operationDetails[o].Vornr === maintPckg[x].Vorn2gmpk) {
													currSelMpack.push(maintPckg[x]);
												}
											}
										}

										var oMaintPckg = {};
										if (currReadMpack.length > 0) {
											oMaintPckg = {
												Plnal: currReadMpack[0].Tplnal,
												Vornr: operationDetails[o].Vornr,
												Strat: currReadMpack[0].Startgmpk,
												SOp: "",
												Ltxa1: operationDetails[o].Ltxa1,
												flag: currReadMpack[0].Tplnal + "-" + operationDetails[o].Vornr,
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
												currSelMpack[z].MPEnable = true;

												var currSelObj = currSelMpack[z];
												if (currSelMpack[z].IsSelected === 'X') {
													oMaintPckg[currSelObj.Paketgmpk] = true;
												}
											}
											oMaintPckg.MPArr = currSelMpack;
										}
										g.currentObj.MaintPckg.push(oMaintPckg);
									}
									g.oData = operationDetails;
									var oprModel = new sap.ui.model.json.JSONModel();
									oprModel.setData(operationDetails);
									g.getModel("tlDetailModel").setProperty("/lOperation", operationDetails);
									g.getModel("tlDetailModel").setProperty("/bAddOperation", true);
								}
								components = d.GTComp.results;
								if (components.length > 0) {
									for (var c = 0; c < components.length; c++) {
										components[c].matDesc = components[c].Maktx;
										components[c].slNo = c + 1;
										components[c].flag = components[c].Plnal + "-" + components[c].Vornr + "-" + components[c].slNo;
										components[c].hFlag = components[c].Plnal + "-" + components[c].Vornr;
									}
									g.cmpData = components;
									compModel = new sap.ui.model.json.JSONModel();
									compModel.setData(components);
									g.getModel("tlDetailModel").setProperty("/lComponent", components);
									// g.getView().byId("components").setModel(compModel);
									// g.getView().byId("newComponent").setEnabled(true);
								}
								classList = d.GTClass.results;
								if (classList) {
									if (classList.length > 0) {
										for (var i = 0; i < classList.length; i++) {
											classList[i].ctEnable = false;
											classList[i].classEnable = false;
											classList[i].ClassTypeDesc = classList[i].Artxt;
											delete classList[i].Artxt;
											delete classList[i].Changerequestid;
											delete classList[i].Clint;
											delete classList[i].Service;
											classList[i].classDelEnable = true;
											classList[i].slNo = i + 1;
											classList[i].flag = classList[i].Plnal + "-" + classList[i].slNo;
										}
										if (g.lockMsg === "true") {
											for (var i = 0; i < classList.length; i++) {
												classList[i].classDelEnable = false;
											}
										}
										g.cData = classList;
										cModel = new sap.ui.model.json.JSONModel();
										cModel.setData(classList);
										g.class.setModel(cModel);
										// g.getView().byId("newClass").setEnabled(true); // check
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
											charList[j].flag = charList[j].Plnal + "-" + charList[j].Class + "-" + charList[j].slNo;
										}
										if (g.lockMsg === "true") {
											for (var i = 0; i < charList.length; i++) {
												charList[i].charAddEnable = false;
												charList[i].charClrEnable = false;
												charList[i].charDltEnable = false;
											}
										} else {
											for (var z = 0; z < charList.length; z++) {
												var count = 1;
												for (var y = 0; y < charList.length; y++) {
													if (z === y) {
														continue;
													}
													if (charList[y].Atnam === charList[z].Atnam && charList[y].Class ===
														charList[z].Class) {
														count++;
													}
												}
												if (count > 1) {
													charList[z].charDltEnable = true;
												} else {
													charList[z].charDltEnable = false;
												}

												if (charList[z].Atein === true) {
													charList[z].charAddEnable = false;
												}
											}
										}
										g.chData = charList;
										_cModel = new sap.ui.model.json.JSONModel();
										_cModel.setData(charList);
										g.char.setModel(_cModel);
										// g.getView().byId("newChar").setEnabled(false); //check
									}
								}
							}
						} else if (g.tlType === "E") {
							if (d.ETList.results.length > 0) {
								var header = d.ETList.results[0];
								g.currentObj = {
									validFrm: g.getDateFormat(header.Datuv),
									grp: r.results[0].Plnnr,
									vEquiLbl: true,
									vEqui: true,
									vEquiDesc: true,
									equipment: header.Equnr,
									equipmentDesc: header.Eqktx,
									vFlocLbl: false,
									vFloc: false,
									vFlocDesc: false,
									bAddComponent: true,
									mode: "change",
									MaintPckg: [],
									KDenable: false
								};
								tlDetailModel.setData(g.currentObj);
								var headerDetails = d.ETList.results;
								if (headerDetails.length > 0) {
									for (var h = 0; h < headerDetails.length; h++) {
										headerDetails[h].pPlantDesc = headerDetails[h].Iwerktxt;
										headerDetails[h].usageDesc = headerDetails[h].TlUsgTxt;
										headerDetails[h].plGrpDesc = headerDetails[h].Plnnrgrptxt;
										headerDetails[h].statusDesc = headerDetails[h].Statustxt;
										headerDetails[h].sysCondDesc = headerDetails[h].Anlzux;
										headerDetails[h].stratDesc = headerDetails[h].Strattxt;
										headerDetails[h].Plnal = headerDetails[h].Tplnal;
										headerDetails[h].Verwe = headerDetails[h].Tverwe;
										headerDetails[h].plEnable = false;
										headerDetails[h].equiEnb = false;
										headerDetails[h].vEquiLbl = true;
										headerDetails[h].vEqui = true;
										headerDetails[h].vEquiDesc = true;
										headerDetails[h].equipment = header.Equnr;
										headerDetails[h].equipmentDesc = header.Eqktx;
										headerDetails[h].vFlocLbl = false;
										headerDetails[h].vFloc = false;
										headerDetails[h].vFlocDesc = false;
										headerDetails[h].Ktext = header.Eqktx;
										headerDetails[h].valueStateT = "None";
										headerDetails[h].valueStatePP = "None";
										headerDetails[h].valueStateU = "None";
										headerDetails[h].valueStateS = "None";
										headerDetails[h].tlusg = headerDetails[h].Tverwe;
										headerDetails[h].Iwerk = headerDetails[h].Werks;
										headerDetails[h].wc = headerDetails[h].Tarbpl;
										headerDetails[h].plant = headerDetails[h].Wcplant;
										headerDetails[h].grp = headerDetails[h].Tlgnhdr;
										headerDetails[h].insPt = headerDetails[h].Slwbez;
										headerDetails[h].insPtDesc = headerDetails[h].Slwbeztxt;
									}
									var oModel = new sap.ui.model.json.JSONModel();
									oModel.setData(headerDetails);
									// g.getView().byId("taskListHeaderOverview").setModel(oModel, "tlDetailModel");
									g.getModel("tlDetailModel").setProperty("/lHeader", headerDetails[hPath]);
									// sap.ui.getCore().setModel(oModel, "headerView");
								}
								var operationDetails = d.ETOprs.results;
								if (operationDetails.length > 0) {
									var oprRel = d.ETRel.results;
									var SrvPckgOvrw = d.ETSpack.results;
									var maintPckg = d.ETMPack.results;
									var maintPckgDefault = d.ETMpackRead.results;
									var aPrt = d.ETPRT.results;
									var aInsp = d.ETInsp.results;
									for (var o = 0; o < operationDetails.length; o++) {
										operationDetails[o].calcKeyDesc = "";
										operationDetails[o].actTypDesc = "";
										operationDetails[o].flag = operationDetails[o].Plnal + "-" + operationDetails[o].Vornr;
										operationDetails[o].Arbpl = operationDetails[o].TlArbpl;
										operationDetails[o].Plnal = operationDetails[o].Tplnal;
										operationDetails[o].opState = "None";
										operationDetails[o].opDescState = "None";
										operationDetails[o].wcValueState = "None";
										operationDetails[o].plantState = "None";
										operationDetails[o].ctrlKeyState = "None";
										operationDetails[o].Werks = operationDetails[o].Werks2eop;
										operationDetails[o].Steus = operationDetails[o].Steus2eop;
										operationDetails[o].workPerc = operationDetails[o].Prznt.toString();
										operationDetails[o].orderQty = operationDetails[o].Bmvrg;
										operationDetails[o].ordQtyUnit = operationDetails[o].Bmeih;
										operationDetails[o].netPrice = operationDetails[o].Opreis;
										operationDetails[o].currency = operationDetails[o].Owaers;
										operationDetails[o].priceUnit = operationDetails[o].Opeinh;
										operationDetails[o].costElement = operationDetails[o].Sakto2eop;
										operationDetails[o].materialGrp = operationDetails[o].Omatkl;
										operationDetails[o].puchGroup = operationDetails[o].Oekgrp;
										operationDetails[o].purchOrg = operationDetails[o].Ekorg;
										operationDetails[o].Uvorn = operationDetails[o].Uvorn;
										operationDetails[o].equi = operationDetails[o].EqunrEop;
										operationDetails[o].floc = operationDetails[o].TplnrEop;
										operationDetails[o].UvornEnable = false;
										operationDetails[o].OprRel = [];
										operationDetails[o].SrvPckgOvrw = [];
										operationDetails[o].PRT = [];
										operationDetails[o].InspChar = [];

										if (oprRel.length > 0) {
											for (var x in oprRel) {
												if (g.currentObj.grp === oprRel[x].Tleqhdr && operationDetails[o].Plnal === oprRel[x].Tplnal && etlData.operation[o].Vornr ===
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
													operationDetails[o].OprRel.push(objOprRel);
												}
											}
										}

										if (SrvPckgOvrw.length > 0) {
											for (var x in SrvPckgOvrw) {
												if (g.currentObj.grp === SrvPckgOvrw[x].Tleqhdr && operationDetails[o].Plnal === SrvPckgOvrw[x].Tplnal &&
													operationDetails[o].Vornr === SrvPckgOvrw[x].Vornrr) {
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

														DelIndSPEnabled: false,
														SPEnabled: true,
													};
													operationDetails[o].SrvPckgOvrw.push(oSPO);
												}
											}
										}

										if (aPrt.length > 0) {
											for (var x in aPrt) {
												if (g.currentObj.grp === aPrt[x].Tleqhdr && operationDetails[o].Plnal === aPrt[x].Tplnal && operationDetails[o].Vornr ===
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
														objPRT.Plant = operationDetails[o].Werks;
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
													operationDetails[o].PRT.push(objPRT);
												}
											}
										}

										if (aInsp.length > 0) {
											for (var x in aInsp) {
												if (g.currentObj.grp === aInsp[x].Tleqhdr && operationDetails[o].Plnal === aInsp[x].Tplnal && operationDetails[
														o].Vornr === aInsp[x].Vornreins) {
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
														BaseSampQty: aInsp[x].Pruefeinh.toString(),
														CodeGrp: aInsp[x].Auswmenge,

														MastInspCharVS: "None",
														PlantVS: "None",
														VersionVS: "None",
														InspMthdVS: "None",
														InspMthdPlntVS: "None",
														SampProcVS: "None"
													};
													operationDetails[o].InspChar.push(objInsp);
												}
											}
										}

										var currReadMpack = [];
										if (maintPckgDefault.length > 0) {
											for (var w in maintPckgDefault) {
												if (g.currentObj.grp === maintPckgDefault[w].Tleqhdr && operationDetails[o].Plnal === maintPckgDefault[w].Tplnal) {
													currReadMpack.push(maintPckgDefault[w]);
												}
											}
										}

										var currSelMpack = [];
										if (maintPckg.length > 0) {
											for (var x in maintPckg) {
												if (g.currentObj.grp === maintPckg[x].Tleqhdr && operationDetails[o].Plnal === maintPckg[x].Tplnal &&
													operationDetails[o].Vornr === maintPckg[x].Vorn2empk) {
													currSelMpack.push(maintPckg[x]);
												}
											}
										}

										var oMaintPckg = {};
										if (currReadMpack.length > 0) {
											oMaintPckg = {
												Plnal: currReadMpack[0].Tplnal,
												Vornr: operationDetails[o].Vornr,
												Strat: currReadMpack[0].Startempk,
												SOp: "",
												Ltxa1: operationDetails[o].Ltxa1,
												flag: currReadMpack[0].Tplnal + "-" + operationDetails[o].Vornr,
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
												currSelMpack[z].MPEnable = true;

												var currSelObj = currSelMpack[z];
												if (currSelMpack[z].IsSelected === 'X') {
													oMaintPckg[currSelObj.Paketempk] = true;
												}
											}
											oMaintPckg.MPArr = currSelMpack;
										}
										g.currentObj.MaintPckg.push(oMaintPckg);
									}
									g.oData = operationDetails;
									var oprModel = new sap.ui.model.json.JSONModel();
									oprModel.setData(operationDetails);
									g.getModel("tlDetailModel").setProperty("/lOperation", operationDetails);
									g.getModel("tlDetailModel").setProperty("/bAddOperation", true);
								}
							}
							components = d.ETComp.results;
							if (components.length > 0) {
								for (var e = 0; e < components.length; e++) {
									components[e].matDesc = components[e].Maktx;
									components[e].slNo = e + 1;
									components[e].flag = components[e].Plnal + "-" + components[e].Vornr + "-" + components[e].slNo;
									components[e].hFlag = components[e].Plnal + "-" + components[e].Vornr;
								}
								g.cmpData = components;
								compModel = new sap.ui.model.json.JSONModel();
								compModel.setData(components);
								g.getModel("tlDetailModel").setProperty("/lComponent", components);
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
										classList[i].flag = classList[i].Plnal + "-" + classList[i].slNo;
									}
									if (g.lockMsg === "true") {
										for (var i = 0; i < classList.length; i++) {
											classList[i].classDelEnable = false;
										}
									}
									g.cData = classList;
									cModel = new sap.ui.model.json.JSONModel();
									cModel.setData(classList);
									g.class.setModel(cModel);
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
										charList[j].flag = charList[j].Plnal + "-" + charList[j].Class + "-" + charList[j].slNo;
									}
									if (g.lockMsg === "true") {
										for (var i = 0; i < charList.length; i++) {
											charList[i].charAddEnable = false;
											charList[i].charClrEnable = false;
											charList[i].charDltEnable = false;
										}
									} else {
										for (var z = 0; z < charList.length; z++) {
											var count = 1;
											for (var y = 0; y < charList.length; y++) {
												if (z === y) {
													continue;
												}
												if (charList[y].Atnam === charList[z].Atnam && charList[y].Class ===
													charList[z].Class) {
													count++;
												}
											}
											if (count > 1) {
												charList[z].charDltEnable = true;
											} else {
												charList[z].charDltEnable = false;
											}

											if (charList[z].Atein === true) {
												charList[z].charAddEnable = false;
											}
										}
									}
									g.chData = charList;
									_cModel = new sap.ui.model.json.JSONModel();
									_cModel.setData(charList);
									g.char.setModel(_cModel);
								}
							}

						} else if (g.tlType === "T") {
							if (d.FTList.results.length > 0) {
								var header = d.FTList.results[0];
								g.currentObj = {
									validFrm: g.getDateFormat(header.Datuv),
									grp: r.results[0].Plnnr,
									vEquiLbl: false,
									vEqui: false,
									vEquiDesc: false,
									floc: header.Tplnr,
									flocDesc: header.Pltxt,
									vFlocLbl: true,
									vFloc: true,
									vFlocDesc: true,
									bAddComponent: true,
									mode: "change",
									MaintPckg: [],
									KDenable: false
								};
								tlDetailModel.setData(g.currentObj);
								var headerDetails = d.FTList.results;
								if (headerDetails.length > 0) {
									for (var h = 0; h < headerDetails.length; h++) {
										headerDetails[h].pPlantDesc = headerDetails[h].Iwerktxt;
										headerDetails[h].usageDesc = headerDetails[h].TlUsgTxt;
										headerDetails[h].plGrpDesc = headerDetails[h].Plnnrgrptxt;
										headerDetails[h].statusDesc = headerDetails[h].Statustxt;
										headerDetails[h].sysCondDesc = headerDetails[h].Anlzux;
										headerDetails[h].stratDesc = headerDetails[h].Strattxt;
										headerDetails[h].Plnal = headerDetails[h].Tplnal;
										headerDetails[h].Verwe = headerDetails[h].Tverwe;
										headerDetails[h].plEnable = false;
										headerDetails[h].vEquiLbl = false;
										headerDetails[h].vEqui = false;
										headerDetails[h].vEquiDesc = false;
										headerDetails[h].floc = header.Tplnr;
										headerDetails[h].flocDesc = header.Pltxt;
										headerDetails[h].vFlocLbl = false;
										headerDetails[h].flocEnb = false;
										headerDetails[h].vFloc = false;
										headerDetails[h].vFlocDesc = false;
										headerDetails[h].Ktext = header.Pltxt;
										headerDetails[h].valueStateT = "None";
										headerDetails[h].valueStatePP = "None";
										headerDetails[h].valueStateU = "None";
										headerDetails[h].valueStateS = "None";
										headerDetails[h].tlusg = headerDetails[h].Tverwe;
										headerDetails[h].Iwerk = headerDetails[h].Werks;
										headerDetails[h].wc = headerDetails[h].Tarbpl;
										headerDetails[h].plant = headerDetails[h].Wcplant;
										headerDetails[h].grp = headerDetails[h].Tlgnhdr;
										headerDetails[h].insPt = headerDetails[h].Slwbez;
										headerDetails[h].insPtDesc = headerDetails[h].Slwbeztxt;
									}
									var oModel = new sap.ui.model.json.JSONModel();
									oModel.setData(headerDetails);
									// g.getView().byId("taskListHeaderOverview").setModel(oModel, "tlDetailModel");
									g.getModel("tlDetailModel").setProperty("/lHeader", headerDetails[hPath]);
									// sap.ui.getCore().setModel(oModel, "headerView");
								}
								var operationDetails = d.FTOprs.results;
								if (operationDetails.length > 0) {
									var oprRel = d.FTRel.results;
									var SrvPckgOvrw = d.FTSpack.results;
									var maintPckg = d.FTMPack.results;
									var maintPckgDefault = d.FTMpackRead.results;
									var aPrt = d.FTPRT.results;
									var aInsp = d.FTInsp.results;
									for (var o = 0; o < operationDetails.length; o++) {
										operationDetails[o].calcKeyDesc = "";
										operationDetails[o].actTypDesc = "";
										operationDetails[o].flag = operationDetails[o].Plnal + "-" + operationDetails[o].Vornr;
										operationDetails[o].Arbpl = operationDetails[o].TlArbpl;
										operationDetails[o].Plnal = operationDetails[o].Tplnal;
										operationDetails[o].opState = "None";
										operationDetails[o].opDescState = "None";
										operationDetails[o].wcValueState = "None";
										operationDetails[o].plantState = "None";
										operationDetails[o].ctrlKeyState = "None";
										operationDetails[o].Werks = operationDetails[o].Werks2fop;
										operationDetails[o].Steus = operationDetails[o].Steus2fop;
										operationDetails[o].workPerc = operationDetails[o].Prznt.toString();
										operationDetails[o].orderQty = operationDetails[o].Bmvrg;
										operationDetails[o].ordQtyUnit = operationDetails[o].Bmeih;
										operationDetails[o].netPrice = operationDetails[o].Opreis;
										operationDetails[o].currency = operationDetails[o].Owaers;
										operationDetails[o].priceUnit = operationDetails[o].Opeinh;
										operationDetails[o].costElement = operationDetails[o].Sakto2fop;
										operationDetails[o].materialGrp = operationDetails[o].Omatkl;
										operationDetails[o].puchGroup = operationDetails[o].Oekgrp;
										operationDetails[o].purchOrg = operationDetails[o].Ekorg;
										operationDetails[o].Uvorn = operationDetails[o].Uvorn;
										operationDetails[o].equi = operationDetails[o].EqunrFop;
										operationDetails[o].floc = operationDetails[o].TplnrFop;
										operationDetails[o].UvornEnable = false;
										operationDetails[o].OprRel = [];
										operationDetails[o].SrvPckgOvrw = [];
										operationDetails[o].PRT = [];
										operationDetails[o].InspChar = [];

										if (oprRel.length > 0) {
											for (var x in oprRel) {
												if (g.currentObj.grp === oprRel[x].Tlflhdr && operationDetails[o].Plnal === oprRel[x].Tplnal && operationDetails[o].Vornr ===
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
													operationDetails[o].OprRel.push(objOprRel);
												}
											}
										}

										if (SrvPckgOvrw.length > 0) {
											for (var x in SrvPckgOvrw) {
												if (g.currentObj.grp === SrvPckgOvrw[x].Tlflhdr && operationDetails[o].Plnal === SrvPckgOvrw[x].Tplnal &&
													operationDetails[o].Vornr === SrvPckgOvrw[x].Vornrr) {
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

														DelIndSPEnabled: false,
														SPEnabled: true
													};
													operationDetails[o].SrvPckgOvrw.push(oSPO);
												}
											}
										}

										if (aPrt.length > 0) {
											for (var x in aPrt) {
												if (g.currentObj.grp === aPrt[x].Tlflhdr && operationDetails[o].Plnal === aPrt[x].Tplnal && operationDetails[
														o].Vornr === aPrt[x].Vornrfprt) {
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
														objPRT.Plant = operationDetails[o].Werks;
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
													operationDetails[o].PRT.push(objPRT);
												}
											}
										}

										if (aInsp.length > 0) {
											for (var x in aInsp) {
												if (g.currentObj.grp === aInsp[x].Tlflhdr && operationDetails[o].Plnal === aInsp[x].Tplnal && operationDetails[
														o].Vornr === aInsp[x].Vornrfins) {
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
														BaseSampQty: aInsp[x].Pruefeinh.toString(),
														CodeGrp: aInsp[x].Auswmenge,

														MastInspCharVS: "None",
														PlantVS: "None",
														VersionVS: "None",
														InspMthdVS: "None",
														InspMthdPlntVS: "None",
														SampProcVS: "None"
													};
													operationDetails[o].InspChar.push(objInsp);
												}
											}
										}

										var currReadMpack = [];
										if (maintPckgDefault.length > 0) {
											for (var w in maintPckgDefault) {
												if (g.currentObj.grp === maintPckgDefault[w].Tlflhdr && operationDetails[o].Plnal === maintPckgDefault[w].Tplnal) {
													currReadMpack.push(maintPckgDefault[w]);
												}
											}
										}

										var currSelMpack = [];
										if (maintPckg.length > 0) {
											for (var x in maintPckg) {
												if (g.currentObj.grp === maintPckg[x].Tlflhdr && operationDetails[o].Plnal === maintPckg[x].Tplnal &&
													operationDetails[o].Vornr === maintPckg[x].Vorn2fmpk) {
													currSelMpack.push(maintPckg[x]);
												}
											}
										}

										var oMaintPckg = {};
										if (currReadMpack.length > 0) {
											oMaintPckg = {
												Plnal: currReadMpack[0].Tplnal,
												Vornr: operationDetails[o].Vornr,
												Strat: currReadMpack[0].Startfmpk,
												SOp: "",
												Ltxa1: operationDetails[o].Ltxa1,
												flag: currReadMpack[0].Tplnal + "-" + operationDetails[o].Vornr,
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
												currSelMpack[z].MPEnable = true;

												var currSelObj = currSelMpack[z];
												if (currSelMpack[z].IsSelected === 'X') {
													oMaintPckg[currSelObj.Paketfmpk] = true;
												}
											}
											oMaintPckg.MPArr = currSelMpack;
										}
										g.currentObj.MaintPckg.push(oMaintPckg);
									}
									g.oData = operationDetails;
									var oprModel = new sap.ui.model.json.JSONModel();
									oprModel.setData(operationDetails);
									g.getModel("tlDetailModel").setProperty("/lOperation", operationDetails);
									g.getModel("tlDetailModel").setProperty("/bAddOperation", true);
								}
								components = d.FTComp.results;
								if (components.length > 0) {
									for (var f = 0; f < components.length; f++) {
										components[f].matDesc = components[f].Maktx;
										components[f].slNo = e + 1;
										components[f].flag = components[f].Plnal + "-" + components[f].Vornr + "-" + components[f].slNo;
										components[f].hFlag = components[f].Plnal + "-" + components[f].Vornr;
									}
									g.cmpData = components;
									compModel = new sap.ui.model.json.JSONModel();
									compModel.setData(components);
									g.getModel("tlDetailModel").setProperty("/lComponent", components);
								}
								classList = d.FTClass.results;
								if (classList) {
									if (classList.length > 0) {
										for (var i = 0; i < classList.length; i++) {
											classList[i].ctEnable = false;
											classList[i].classEnable = false;
											classList[i].ClassTypeDesc = classList[i].Artxt;
											delete classList[i].Artxt;
											delete classList[i].Changerequestid;
											delete classList[i].Clint;
											delete classList[i].Service;
											classList[i].classDelEnable = true;
											classList[i].slNo = i + 1;
											classList[i].flag = classList[i].Plnal + "-" + classList[i].slNo;
										}
										if (g.lockMsg === "true") {
											for (var i = 0; i < classList.length; i++) {
												classList[i].classDelEnable = false;
											}
										}
										g.cData = classList;
										cModel = new sap.ui.model.json.JSONModel();
										cModel.setData(classList);
										g.class.setModel(cModel);
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
											charList[j].flag = charList[j].Plnal + "-" + charList[j].Class + "-" + charList[j].slNo;
										}
										if (g.lockMsg === "true") {
											for (var i = 0; i < charList.length; i++) {
												charList[i].charAddEnable = false;
												charList[i].charClrEnable = false;
												charList[i].charDltEnable = false;
											}
										} else {
											for (var z = 0; z < charList.length; z++) {
												var count = 1;
												for (var y = 0; y < charList.length; y++) {
													if (z === y) {
														continue;
													}
													if (charList[y].Atnam === charList[z].Atnam && charList[y].Class ===
														charList[z].Class) {
														count++;
													}
												}
												if (count > 1) {
													charList[z].charDltEnable = true;
												} else {
													charList[z].charDltEnable = false;
												}

												if (charList[z].Atein === true) {
													charList[z].charAddEnable = false;
												}
											}
										}
										g.chData = charList;
										_cModel = new sap.ui.model.json.JSONModel();
										_cModel.setData(charList);
										g.char.setModel(_cModel);
									}
								}
							}
						}
						if (this.status === "true" || this.lockMsg === true) {
							g.disableFields();
						} else {
							g.enableFields();
						}
						g.getView().setModel(tlDetailModel, "tlDetailModel");
					}
				},
				error: function (err) {}
			});
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

		disableFields: function () {
			var obj = {
				enable: false
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "main");
			this.currentObj = {
				bAddHeader: false,
				bAddComponent: false,
				bAddOperation: false,
				bAddOprRel: false,
				bAddSrvOpOrvw: false,
				bAddPRT: false,
				bAddInspChar: false
			};

			this.getView().byId("operationTab").setMode("None");
			this.getView().byId("components").setMode("None");
			this.getModel("tlDetailModel").setData(this.currentObj);
		},

		enableFields: function () {
			var g = this;
			var obj = {
				enable: true
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "main");
			this.getModel("tlDetailModel").setProperty("/bAddHeader", true);
			var op = this.getModel("tlDetailModel").getProperty("/operation");
			if (op !== undefined && op !== null) {
				if (op.length > 0) {
					this.getModel("tlDetailModel").setProperty("/bAddComponent", true);
				}
			} else {
				this.getModel("tlDetailModel").setProperty("/bAddComponent", false);
			}
			this.getModel("tlDetailModel").setProperty("/bAddOperation", true);
			this.getView().byId("operationTab").setMode("SingleSelectLeft");
			this.getView().byId("components").setMode("Delete");
		},

		addOperation: function () {
			var g = this;
			var tlDetailModel = g.getView().getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			var opModel = new sap.ui.model.json.JSONModel();
			var opData = tlDetailModel.getProperty("/lOperation");
			if (opData && opData.length > 0) {
				opModel.setData(opData);
			}
			var headerData = g.getView().getModel("tlDetailModel").getProperty("/lHeader");
			var wc, plant, opData, num;

			if (opModel === undefined || opData === undefined || opData.length === 0) {
				num = "0010";
				var opData = [];
				var opRowData = {
					Vornr: num,
					VornrEnable: false,
					VornrVS: "None",
					Uvorn: "",
					UvornEnable: false,
					UvornVS: "None",
					Ltxa1: "",
					Arbpl: headerData.wc,
					Werks: headerData.plant,
					Steus: this.ctrlKey,
					plantDesc: "",
					ctrlkeyDesc: "",
					Arbei: "0.0",
					WorkEnable:true,
					Arbeh: "",
					WcZeiwn: "",
					Anzzl: 0,
					Dauno: "0.0",
					Daune: "",
					Indet: "",
					calcKeyDesc: "",
					Lar01: g.ActivityType,
					Larnt: g.ActivityType,
					actTypDesc: "",
					Plnal: this.grpCounter,
					opState: "None",
					opDescState: "None",
					wcValueState: "None",
					plantState: "None",
					ctrlKeyState: "None",
					flag: this.grpCounter + "-" + num,

					workPerc: "",
					workPercVS: "None",
					orderQty: "",
					orderQtyVS: "None",
					ordQtyUnit: "",
					orderQtyUnitVS: "None",
					netPrice: "",
					netPriceVS: "None",
					currency: "EUR",
					currencyVS: "None",
					priceUnit: "",
					costElement: "",
					costElementVS: "None",
					materialGrp: "",
					materialGrpVS: "None",
					puchGroup: "",
					puchGroupVS: "None",
					purchOrg: "",
					purchOrgVS: "None",
					equi: "",
					equiDesc: "",
					floc: "",
					flocDesc: "",
					equiVS: "None",
					flocVS: "None",

					OprRel: [],
					SrvPckgOvrw: [],
					PRT: [],
					InspChar: []
				};
				opData.push(opRowData);
				opModel.setData(opData);
				g.getModel("tlDetailModel").setProperty("/lOperation", opData);
				this.getView().byId("operationTab").setSelectedItem(this.getView().byId("operationTab").getItems()[0], true /*selected*/ ,
					true /*fire event*/ );

			} else {
				opData = opModel.getData();
				var length = opData.length - 1;
				wc = headerData.wc;
				plant = headerData.plant;
				var oldNo = opData[length].Vornr;
				var newNo = parseInt(oldNo) + 10;

				while (newNo.toString().length < 4) {
					newNo = "0" + newNo;
				}

				opRowData = {
					Vornr: newNo,
					VornrEnable: false,
					VornrVS: "None",
					Uvorn: "",
					UvornEnable: true,
					UvornVS: "None",
					Ltxa1: "",
					Arbpl: wc,
					Werks: plant,
					Steus: this.ctrlKey,
					plantDesc: "",
					ctrlkeyDesc: "",
					Arbei: "0.0",
					WorkEnable:true,
					WcZeiwn: "",
					Anzzl: 0,
					Dauno: "0.0",
					Arbeh: "",
					Daune: "",
					Indet: "",
					Plnal: this.grpCounter,
					calcKeyDesc: "",
					Lar01: g.ActivityType,
					Larnt: g.ActivityType,
					actTypDesc: "",
					opState: "None",
					opDescState: "None",
					wcValueState: "None",
					plantState: "None",
					ctrlKeyState: "None",
					flag: this.grpCounter + "-" + newNo,

					workPerc: "",
					workPercVS: "None",
					orderQty: "",
					orderQtyVS: "None",
					ordQtyUnit: "",
					orderQtyUnitVS: "None",
					netPrice: "",
					netPriceVS: "None",
					currency: "EUR",
					currencyVS: "None",
					priceUnit: "",
					costElement: "",
					costElementVS: "None",
					materialGrp: "",
					materialGrpVS: "None",
					puchGroup: "",
					puchGroupVS: "None",
					purchOrg: "",
					purchOrgVS: "None",

					OprRel: [],
					SrvPckgOvrw: [],
					PRT: [],
					InspChar: []
				};
				opData.push(opRowData);
				opModel.setData(opData);
				g.getModel("tlDetailModel").setProperty("/lOperation", opData);
				this.getView().byId("operationTab").setSelectedItem(this.getView().byId("operationTab").getItems()[opData.length - 1], true /*selected*/ ,
					true /*fire event*/ );
			}

			if (tlDetailData.lHeader.Strat !== "") {
				this.createMaintPckgData(opRowData);
			}

			tlDetailData.bAddComponent = true;
			tlDetailData.lHeader.bAddOprRel = true;
			tlDetailData.lHeader.bAddSrvOpOrvw = false;
			tlDetailData.lHeader.bAddPRT = true;
			tlDetailData.lHeader.bAddInspChar = false;
			if (tlDetailData.lHeader.insPt !== "") {
				tlDetailData.lHeader.bAddInspChar = true;
			}
			tlDetailModel.setData(tlDetailData);
			this.getView().setModel(tlDetailModel, "tlDetailModel");
			this.getView().byId("operationTab").setModel(tlDetailModel, "tlDetailModel");
			sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");

			if (this.action.indexOf("ETL") > -1) {
				this.DeriveEquiFlocData(tlDetailData.lHeader.equipment, 'E');
			}

			if (this.action.indexOf("FTL") > -1) {
				this.DeriveEquiFlocData(tlDetailData.lHeader.floc, 'F');
			}
		},

		addComponent: function () {
			var g = this;
			var tlDetailModel = g.getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			var coModel = new sap.ui.model.json.JSONModel();
			var coData = g.getModel("tlDetailModel").getProperty("/lComponent");
			if (coData && coData.length > 0) {
				coModel.setData(coData);
			}
			// var m = new sap.ui.model.json.JSONModel();
			var num;
			/*if (this.getView().byId("operationTab").getSelectedItem() === null) {
			  var msg = this.getView().getModel("i18n").getProperty("OP_SELECT_ERR");
			  this.showMessage(msg);
			  return;
			} else {*/
			if (coModel === undefined || coModel === null || coData === undefined || coData.length === 0) {
				num = "1";
				var compRowData = [{
					Idnrk: "",
					matDesc: "",
					Menge: "",
					MeinsGcp: "",
					Postp: this.itemCat,
					Plnal: this.grpCounter,
					Vornr: this.opNum,
					matState: "None",
					qtyState: "None",
					qtyUnitState: "None",
					categoryState: "None",
					slNo: num,
					flag: this.grpCounter + "-" + this.opNum + "-" + num,
					hFlag: this.grpCounter + "-" + this.opNum,

					group: tlDetailData.grp,
					groupCounter: this.grpCounter,
					activity: this.opNum,
					cmpCompEnable: true,
					cmpEnable: true,
					cmpVisible: false
				}];

				coModel.setData(compRowData);
				g.getModel("tlDetailModel").setProperty("/lComponent", compRowData);
				//this.getView().byId("components").setModel(m);
				var tempCp = [];
				if (this.cmpData === null) {
					this.cmpData = compRowData;
				} else if (this.cmpData.length === 0) {
					this.cmpData = compRowData;
				} else {
					if (compRowData !== undefined) {
						if (this.cmpData !== null) {
							for (var c = 0; c < compRowData.length; c++) {
								for (var d = 0; d < this.cmpData.length; d++) {
									if (compRowData[c].hFlag !== this.cmpData[d].hFlag) {
										var C = compRowData;
										C[c].flag = this.grpCounter + "-" + this.opNum + "-" + compRowData[c].Idnrk;
										C[c].hFlag = this.grpCounter + "-" + this.opNum;
										tempCp.push(C[c]);
									}
								}
							}
						}
					}
					if (this.cmpData !== null) {
						Array.prototype.push.apply(this.cmpData, tempCp);
					}
				}
			} else {
				num = coData.length + 1;
				num = num.toString();
				compRowData = {
					Idnrk: "",
					matDesc: "",
					Menge: "",
					MeinsGcp: "",
					Vornr: this.opNum,
					Postp: this.itemCat,
					Plnal: this.grpCounter,
					matState: "None",
					qtyState: "None",
					qtyUnitState: "None",
					categoryState: "None",
					slNo: num,
					flag: this.grpCounter + "-" + this.opNum + "-" + num,
					hFlag: this.grpCounter + "-" + this.opNum,

					group: tlDetailData.grp,
					groupCounter: this.grpCounter,
					activity: this.opNum,
					cmpCompEnable: true,
					cmpEnable: true,
					cmpVisible: false
				};
				coData.push(compRowData);
				coModel.setData(coData);
				var tempCp = [];
				g.getModel("tlDetailModel").setProperty("/lComponent", coData);
				// this.getView().byId("components").setModel(m);
				// this.getView().byId("components").bindItems("/", items);
				if (this.cmpData !== null) {
					var data = coData;
					for (var c = 0; c < data.length; c++) {
						for (var d = 0; d < this.cmpData.length; d++) {
							if (data[c].hFlag !== this.cmpData[d].hFlag) {
								var C = data;
								C[c].flag = this.grpCounter + "-" + this.opNum + "-" + data[c].Idnrk;
								C[c].hFlag = this.grpCounter + "-" + this.opNum;
								tempCp.push(C[c]);
							}
						}
					}
					if (this.cmpData !== null) {
						Array.prototype.push.apply(this.cmpData, tempCp);
					}
				}
			}
			tlDetailModel.setData(tlDetailData);
			this.getView().setModel(tlDetailModel, "tlDetailModel");
			sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");
			this.getView().byId("components").getModel("tlDetailModel").refresh()
		},

		readObjectDetails: function (f, actionFlag, sPath) {
			var g = this;
			var url;
			var tlDetailModel = g.getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			var eq = tlDetailData.lHeader.equipment;
			var floc = tlDetailData.lHeader.floc;
			var details = [];
			var flag = false;
			if (this.action.indexOf("ETL") > 0) {
				//url = "/EQUIP_FLOC_DataSet?$filter=Equnr eq '" + eq + "'";
				url = "/EQUIP_FLOC_DataSet";
				var oFilter = [new sap.ui.model.Filter("Equnr", "EQ", eq)];
			} else if (this.action.indexOf("FTL") > 0) {
				//url = "/EQUIP_FLOC_DataSet?$filter=Tplnr eq '" + floc + "'";
				url = "/EQUIP_FLOC_DataSet";
				var oFilter = [new sap.ui.model.Filter("Tplnr", "EQ", floc)];
			}

			//after v2 changes
			var hdModel = new sap.ui.model.json.JSONModel();
			var model = new sap.ui.model.json.JSONModel();
			//hdModel = this.getView().byId("taskListHeaderOverview").getModel("headerView");
			var hdData = g.getModel("tlDetailModel").getProperty("/header");
			if (hdData) {
				hdModel.setData(hdData);
			}
			var num;
			var pEnable = true;
			var plant = "",
				pPlantDesc = "",
				mainWc = "",
				mainWcPlant = "",
				wcDesc = "",
				tlDesc = "";
			//////////////////////  
			var m = this.getView().getModel();
			m.read(url, {
				filters: oFilter,
				success: function (r) {
					/*details = r.results[0];
					f.setEnabled(false);
					flag = true;*/
					details = r.results[0];
					f.setEnabled(false);
					if (actionFlag === "add") {
						var det = details;
						g.objDetails = det;
						/*if (det[1] === false) {
							return;
						} else {*/
						if (g.objDetails.Iwerk) {
							plant = g.objDetails.Iwerk;
						}
						if (g.objDetails.Iwerktxt) {
							pPlantDesc = g.objDetails.Iwerktxt;
						}
						if (g.objDetails.StArbpl) {
							mainWc = g.objDetails.StArbpl;
						}
						if (g.objDetails.Werks) {
							mainWcPlant = g.objDetails.Werks;
						}
						if (g.objDetails.Wctext) {
							wcDesc = g.objDetails.Wctext;
						}
						if (g.objDetails.Txtmi) {
							tlDesc = g.objDetails.Txtmi;
						}

						if (hdModel === undefined || hdModel.getData().length === 0 || hdModel.getData() === null || hdData === undefined) {
							num = "1";
							var hdRowData = [{
								Plnal: num,
								Iwerk: plant,
								Plnnr: "",
								Werks: mainWcPlant,
								Statu: "",
								statusDesc: "",
								Verwe: "",
								usageDesc: "",
								Ktext: tlDesc,
								KapArbpl: mainWc,
								Vagrp: "",
								plGrpDesc: "",
								Anlzu: "",
								sysCondDesc: "",
								pPlantDesc: pPlantDesc,
								Strat: "",
								stratDesc: "",
								valueStatePP: "None",
								valueStateS: "None",
								valueStateU: "None",
								valueStateT: "None",
								plEnable: pEnable,
								wcDesc: wcDesc
							}];

							/*model.setData(hdRowData);
							g.getView().byId("taskListHeaderOverview").setModel(model, "headerView");

							sap.ui.getCore().setModel(model, "headerView");*/
							hdModel.setData(hdRowData);
							g.getModel("tlDetailModel").setProperty("/header", hdRowData);
							/*	g.getView().byId("taskListHeaderOverview").setSelectedItem(g.getView().byId("taskListHeaderOverview").getItems()[0],
									true,
									true);*/
						} else {
							var heaData = hdModel.getData();
							num = hdModel.length + 1;
							num = num.toString();

							hdRowData = {
								Plnal: num,
								Plnnr: "",
								Iwerk: plant,
								Werks: mainWcPlant,
								Statu: "",
								statusDesc: "",
								Verwe: "",
								usageDesc: "",
								Ktext: tlDesc,
								KapArbpl: mainWc,
								Vagrp: "",
								plGrpDesc: "",
								Anlzu: "",
								sysCondDesc: "",
								pPlantDesc: pPlantDesc,
								Strat: "",
								stratDesc: "",
								valueStatePP: "None",
								valueStateS: "None",
								valueStateU: "None",
								valueStateT: "None",
								plEnable: pEnable,
								wcDesc: wcDesc
							};
							heaData.push(hdRowData);
							hdModel.setData(heaData);
							g.getModel("tlDetailModel").setProperty("/header", heaData);
							// g.getView().byId("taskListHeaderOverview").setModel(model, "headerView");
							// sap.ui.getCore().setModel(model, "headerView");
							/*g.getView().byId("taskListHeaderOverview").setSelectedItem(g.getView().byId("taskListHeaderOverview").getItems()[
									heaData.length -
									1], true,
								true);*/
						}
					} else if (actionFlag === "showDet") {
						g.objDetails = details;
						plant = g.objDetails.Iwerk;
						pPlantDesc = g.objDetails.Iwerktxt;
						mainWc = g.objDetails.StArbpl;
						mainWcPlant = g.objDetails.Werks;
						wcDesc = g.objDetails.Wctext;
						tlDesc = g.objDetails.Txtmi;

						if (plant === "") {
							plant = "null";
						}
						if (pPlantDesc === "") {
							pPlantDesc = "null";
						}
						if (mainWc === "") {
							mainWc = "null";
						}
						if (mainWcPlant === "") {
							mainWcPlant = "null";
						}
						if (wcDesc === "") {
							wcDesc = "null";
						}
						if (tlDesc === "") {
							tlDesc = "null";
						}
						g.getRouter().navTo("tlHdrDetail", {
							action: this.action,
							mainPath: encodeURIComponent(this.mainPath),
							itemPath: encodeURIComponent(sPath),
							pPlant: plant,
							mainWc: mainWc,
							mainWcPlant: mainWcPlant,
							pPlantDesc: pPlantDesc,
							wcDesc: wcDesc,
							mode: this.mode
						});
					}
					tlDetailModel.setData(tlDetailData);
					g.getView().setModel(tlDetailModel, "tlDetailModel");
				},
				error: function (err) {
					f.setValueState("Error");
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
					g.showMessage(value);
					f.setEnabled(true);
				}
			});
			return [details, flag];
		},

		/*_showHeaderDetail: function(oItem) {
			var sPath = oItem.oBindingContexts.tlDetailModel.sPath;
			var plant, mainWc, mainWcPlant, pPlantDesc, wcDesc, tlDesc;
			var f;
			var g = this;
			var tlDetailModel = g.getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			var actionFlag = "showDet";
			if ((tlDetailData.rbEqui === true) || (tlDetailData.rbFloc === true)) {
				if (tlDetailData.rbEqui === true) {
					f = this.getView().byId("equipment");
				} else if (tlDetailData.rbFloc === true) {
					f = this.getView().byId("floc");
				}
				if (this.objDetails === undefined) {
					this.readObjectDetails(f, actionFlag, sPath);
					// this.objDetails = this.readObjectDetails(f);
					// plant = this.objDetails.Iwerk;
					// pPlantDesc = this.objDetails.Iwerktxt;
					// mainWc = this.objDetails.StArbpl;
					// mainWcPlant = this.objDetails.Werks;
					// wcDesc = this.objDetails.Wctext;
					// tlDesc = this.objDetails.Txtmi;

					// if (plant === "") {
					// 	plant = "null";
					// }
					// if (pPlantDesc === "") {
					// 	pPlantDesc = "null";
					// }
					// if (mainWc === "") {
					// 	mainWc = "null";
					// }
					// if (mainWcPlant === "") {
					// 	mainWcPlant = "null";
					// }
					// if (wcDesc === "") {
					// 	wcDesc = "null";
					// }
					// if (tlDesc === "") {
					// 	tlDesc = "null";
					// }
				} else {
					plant = this.objDetails.Iwerk;
					pPlantDesc = this.objDetails.Iwerktxt;
					mainWc = this.objDetails.StArbpl;
					mainWcPlant = this.objDetails.Werks;
					wcDesc = this.objDetails.Wctext;
					tlDesc = this.objDetails.Txtmi;

					if (plant === "") {
						plant = "null";
					}
					if (pPlantDesc === "") {
						pPlantDesc = "null";
					}
					if (mainWc === "") {
						mainWc = "null";
					}
					if (mainWcPlant === "") {
						mainWcPlant = "null";
					}
					if (wcDesc === "") {
						wcDesc = "null";
					}
					if (tlDesc === "") {
						tlDesc = "null";
					}
				}
			} else {
				plant = "null";
				pPlantDesc = "null";
				mainWc = "null";
				mainWcPlant = "null";
				wcDesc = "null";
			}

			this.getRouter().navTo("tlHdrDetail", {
				action: this.action,
				mainPath: encodeURIComponent(this.mainPath),
				itemPath: encodeURIComponent(sPath),
				pPlant: plant,
				mainWc: mainWc,
				mainWcPlant: mainWcPlant,
				pPlantDesc: pPlantDesc,
				wcDesc: wcDesc,
				mode: this.mode
			});
		},*/

		/*onItemPress: function(oEvent) {
			this._showHeaderDetail(oEvent.getSource());
		},*/

		_showOperationDetail: function (oItem) {
			var sPath = oItem.oBindingContexts.tlDetailModel.sPath;
			//var headerData = this.getView().byId("taskListHeaderOverview").getModel("headerView").getData();
			var headerData = this.getModel("tlDetailModel").getProperty("/header");
			var opData = this.getModel("tlDetailModel").getProperty("/lOperation");
			var index = parseInt(sPath.substr(-1));
			var wc, wcPlant;
			if (opData[index] !== undefined) {
				wc = opData[index].Arbpl;
			} else {
				wc = opData[index - 1].Arbpl;
			}
			if (opData[index] !== undefined) {
				wcPlant = opData[index].Werks;
			} else {
				wcPlant = opData[index - 1].Werks;
			}
			if (wc === "" || wc === undefined) {
				wc = "null";
			}
			if (wcPlant === "" || wcPlant === undefined) {
				wcPlant = "null";
			}
			if (opData[index].Steus) {
				this.ctrlKey = opData[index].Steus;
			}
			// if (this.ctrlKey === "" || this.ctrlKey === undefined) {
			// 	this.ctrlKey = " ";
			// }

			//this.opData = this.getModel("tlDetailModel").getProperty("/lOperation");
			var oOpFlag = {
				opDetFlag: true,
				opIndex: index.toString()
			}
			sap.ui.getCore().setModel(oOpFlag, "oOpFlag");

			this.getRouter().navTo("tlOprDetail", {
				action: this.action,
				basicPath: encodeURIComponent(this.basicPath),
				mainPath: encodeURIComponent(this.mainPath),
				itemPath: encodeURIComponent(sPath),
				wc: wc,
				wcPlant: wcPlant,
				ctrlKey: this.ctrlKey,
				mode: this.mode
			});
		},

		onOpItemPress: function (oEvent) {
			this._showOperationDetail(oEvent.getSource());
		},

		/*deleteHeaderItem: function(event) {
			var src = event.getSource();
			var path = src.getBindingContext("tlDetailModel").getPath();
			path = path.substring(path.lastIndexOf('/') + 1);
			var model = src.getModel("tlDetailModel");
			var data = model.getProperty('/header');
			var grpC = data[path].Plnal;
			var tlDetailModel = this.getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			//var opModel = this.getView().byId("operationTab").getModel("oprView");
			var opData = this.getModel("tlDetailModel").getProperty("/operation");
			if (this.class) {
				var clModel = this.class.getModel();
			}
			if (opData !== undefined) {
				//var opData = opModel.getData();
				var oLength = opData.length;
				if (opData !== null) {
					// for (var o = 0; o < opData.length; o++) {
					//   if (grpC === opData[o].Plnal) {
					//     opData.splice(o, 1);
					//   }
					// }
					for (var o = oLength - 1; o >= 0; o--) {
						if (grpC === opData[o].Plnal) {
							opData.pop(o);
						}
					}
					for (var s = 0; s < this.oData.length; s++) {
						if (grpC === this.oData[s].Plnal) {
							this.oData.splice(s, 1);
						}
					}
					var _model = new sap.ui.model.json.JSONModel();
					_model.setData(opData);
					//this.getView().byId("operationTab").setModel(_model, "oprView");
					this.getModel("tlDetailModel").setProperty("/operation", opData);
				}
			}
			//var comModel = this.getView().byId("components").getModel();
			var comData = this.getModel("tlDetailModel").getProperty("/component");
			if (comData !== null && comData !== undefined) {
				//var comData = comModel.getData();
				if (comData !== null && this.cmpData !== null) {
					for (var t = 0; t < comData.length; t++) {
						if (grpC === comData[t].Plnal) {
							comData.splice(t, 1);
						}
					}
					for (var x = 0; x < this.cmpData.length; x++) {
						if (grpC === this.cmpData[x].Plnal) {
							this.cmpData.splice(x, 1);
						}
					}
					var _cModel = new sap.ui.model.json.JSONModel();
					_cModel.setData(comData);
					//this.getView().byId("components").setModel(_cModel);
					this.getModel("tlDetailModel").setProperty("/component", comData);
				}
			}
			if (this.char) {
				var charData = this.char.getModel().getData();
			}
			if (clModel !== null && clModel !== undefined) {
				var clData = clModel.getData();
				var cltemp = [];
				var charTemp = [];
				if (clData !== null && charData.length > 0) {
					for (var l = 0; l < clData.length; l++) {
						if (grpC === clData[l].Plnal) {
							for (var i = charData.length - 1; i >= 0; i--) {
								if (clData[l].Class === charData[i].Class) {
									// charTemp.push(charData(h));
									charData.pop(i);
								}
							}
							cltemp.push(clData[l]);
						}
					}
					// if (cltemp.length > 0) {
					//  for (var cl = 0; cl < cltemp.length; cl++) {
					//    for (var c = 0; c < clData.length; c++) {
					//      if (cltemp[cl].Class === clData[c].Class) {
					//        clData.splice(c, 1);
					//      }
					//    }
					//  }
					// }
					// if(charTemp)
					for (var z = 0; z < this.cData.length; z++) {
						if (grpC === this.cData[z].Plnal) {
							this.cData.splice(z, 1);
						}
					}
					for (var w = 0; w < this.chData.length; w++) {
						if (this.clValue === this.chData[w].Class) {
							this.chData.splice(w, 1);
						}
					}
				} else {
					if (clData !== null) {
						for (var l = 0; l < clData.length; l++) {
							if (grpC === clData[l].Plnal) {
								clData.splice(l, 1);
							}
						}
					}
				}
				var clasModel = new sap.ui.model.json.JSONModel();
				clasModel.setData(clData);
				if (this.class) {
					this.class.setModel(clasModel);
				}

				var charModel = new sap.ui.model.json.JSONModel();
				charModel.setData(charData);
				this.char.setModel(charModel);
			}
			data.splice(parseInt(path), 1);
			model.setProperty('/header', data);
			//this.getView().byId("taskListHeaderOverview").setModel(model, "headerView");
			this.getModel("tlDetailModel").setProperty("/header", data);
			//sap.ui.getCore().setModel(model, "headerView");
			if (data.length === 0) {
				tlDetailData.bAddOperation = false;
				tlDetailData.bAddComponent = false;
				//this.getView().byId("newOperation").setEnabled(false);
				//this.getView().byId("newComponent").setEnabled(false); // added 
			} else {
				tlDetailData.bAddOperation = true;
				tlDetailData.bAddComponent = true;
				// this.getView().byId("newOperation").setEnabled(true);
				// this.getView().byId("newComponent").setEnabled(true); // added 
			}
			this.hIndex = undefined;
			this.grpCounter = "";
			tlDetailModel.setData(tlDetailData);
			this.getView().setModel(tlDetailModel, "tlDetailModel");
			sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");
		},*/

		onOperationSelect: function (event) {
			var path = event.getParameter('listItem').getBindingContext("tlDetailModel").getPath();
			path = path.substring(path.lastIndexOf('/') + 1);
			this.oIndex = path;
			var tlDetailModel = this.getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			// var oData = this.getView().byId("operationTab").getModel("oprView").getData();
			var oData = this.getModel("tlDetailModel").getProperty("/lOperation");
			this.opGrpCounter = oData[this.oIndex].Plnal;
			this.opNum = oData[this.oIndex].Vornr;
			var oModel = this.getModel("tlDetailModel");
			//var Data = this.getModel("tlDetailModel").getProperty("/component");
			if (oModel !== null) {
				var Data = oModel.getProperty("/lComponent");
				if (Data !== undefined) {
					for (var cp = 0; cp < Data.length; cp++) {
						if (!Data[cp].hasOwnProperty("flag")) {
							Data[cp].flag = this.grpCounter + "-" + this.opNum + "-" + Data[cp].Idnrk;
							Data[cp].hFlag = this.grpCounter + "-" + this.opNum;
						}
					}
					var temp = [];
					if (this.cmpData === null) {
						this.cmpData = oModel.getProperty("/lComponent");
					} else {
						if (Data !== null && this.cmpData !== null) {
							for (var g = 0; g < Data.length; g++) {
								for (var k = 0; k < this.cmpData.length; k++) {
									if (Data[g].hFlag !== this.cmpData[k].hFlag) {
										var v = Data;
										// v[g].flag = this.grpCounter + "-" + this.opNum + "-" + Data[g].Idnrk;
										temp.push(v[g]);
									}
								}
							}
						}
						if (this.cmpData !== null) {
							Array.prototype.push.apply(this.cmpData, temp);
							var dups = [];
							this.cmpData = this.cmpData.filter(function (el) {
								// If it is not a duplicate, return true
								if (dups.indexOf(el.flag) == -1) {
									dups.push(el.flag);
									return true;
								}
								return false;
							});
						}
					}
					var _temp = [];

					if (this.cmpData !== null) {
						for (var f = 0; f < this.cmpData.length; f++) {
							var str = this.cmpData[f].flag;
							str = str.split("-");
							if (this.opNum === str[1] && this.grpCounter.toString() === str[0]) {
								_temp.push(this.cmpData[f]);
							}
						}
					}

					var oMod = new sap.ui.model.json.JSONModel();
					oMod.setData(_temp);
					//this.getView().byId("components").setModel(oMod,"tlComponentMpdel");
					this.getModel("tlDetailModel").setProperty("/lComponent", _temp);
				}

				//////////// Operation Relationships //////////
				var alOprRel = tlDetailData.lOperation[path].OprRel;
				tlDetailData.lOprRel = alOprRel;

				//////////// Service Package Overview //////////
				var aSrvPckgOvrw = tlDetailData.lOperation[path].SrvPckgOvrw;
				tlDetailData.lSrvPckgOvrw = aSrvPckgOvrw;

				//////////// PRT //////////
				var aTLPRT = tlDetailData.lOperation[path].PRT;
				tlDetailData.lPRT = aTLPRT;

				///////// Inspection Characteristics ///////////////
				var aInspChar = tlDetailData.lOperation[path].InspChar;
				tlDetailData.lInspChar = aInspChar;

			}
			tlDetailData.lHeader.bAddComponent = true;
			tlDetailData.lHeader.bAddOprRel = true;
			tlDetailData.lHeader.bAddPRT = true;
			if (oData[this.oIndex].Steus === "PM03" || oData[this.oIndex].Steus === "PM05") {
				tlDetailData.lHeader.bAddSrvOpOrvw = true;
			} else {
				tlDetailData.lHeader.bAddSrvOpOrvw = false;
			}

			if (tlDetailData.lHeader.insPt !== "") {
				tlDetailData.lHeader.bAddInspChar = true;
			} else {
				tlDetailData.lHeader.bAddInspChar = false;
			}
			tlDetailModel.setData(tlDetailData);
			this.getView().byId("components").setModel(tlDetailModel, "tlDetailModel");
			this.getView().setModel(tlDetailModel, "tlDetailModel");
			sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");
		},

		deleteOperation: function (event) {
			var src = event.getSource();
			var path = src.getBindingContext("tlDetailModel").getPath();
			path = path.substring(path.lastIndexOf('/') + 1);
			var model = src.getModel("tlDetailModel");
			var opMain = model.getProperty('/operation');
			var data = model.getProperty('/lOperation');
			var grpC = data[path].Plnal;
			var opNum = data[path].Vornr;
			var tlDetailModel = this.getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			//var comModel = this.getView().byId("components").getModel();
			var comModel = this.getModel("tlDetailModel");
			// if (this.oData !== null && this.oData !== undefined) {
			// 	for (var o = 0; o < this.oData.length; o++) {
			// 		if (grpC === this.oData[o].Plnal && opNum === this.oData[o].Vornr) {
			// 			this.oData.splice(o, 1);
			// 		}
			// 	}
			// }
			for (var o = 0; o < data.length; o++) {
				if (grpC === data[o].Plnal && opNum === data[o].Vornr) {
					data.splice(o, 1);
				}
			}
			for (var o = 0; o < opMain.length; o++) {
				if (grpC === opMain[o].Plnal && opNum === opMain[o].Vornr) {
					opMain.splice(o, 1);
				}
			}
			if (comModel !== null) {
				var comData = comModel.getProperty("/lComponent");
				if (comData !== null && comData !== undefined) {
					for (var t = 0; t < comData.length; t++) {
						if (grpC === comData[t].Plnal && opNum === comData[t].Vornr) {
							comData.splice(t, 1);
						}
					}
					if (this.cmpData !== null && this.cmpData !== undefined) {
						for (var m = 0; m < this.cmpData.length; m++) {
							if (grpC === this.cmpData[m].Plnal && opNum === this.cmpData[m].Vornr) {
								this.cmpData.splice(m, 1);
							}
						}
					}
					var _cModel = new sap.ui.model.json.JSONModel();
					_cModel.setData(comData);
					// this.getView().byId("components").setModel(_cModel);
					this.getModel("tlDetailModel").setProperty("/lComponent", comData);
				}
			}
			sap.ui.getCore().setModel(model, "tlDetailModel");
			if (data.length === 0) {
				//this.getView().byId("newComponent").setEnabled(false);
				tlDetailData.lHeader.bAddComponent = false;
			} else {
				//this.getView().byId("newComponent").setEnabled(true);
				tlDetailData.lHeader.bAddComponent = true;
			}
			this.oIndex = undefined;
			this.opGrpCounter = "";
			this.opNum = "";
			//data.splice(parseInt(path), 1);
			model.setProperty('/lOperation', data);

			//this.getView().byId("operationTab").setModel(model, "oprView");
			this.getModel("tlDetailModel").setProperty("/lOperation", data);
		},

		deleteComponent: function (event) {
			var src = event.getSource();
			var path = event.getParameter('listItem').getBindingContext("tlDetailModel").sPath;
			path = path.substring(path.lastIndexOf('/') + 1);
			var model = src.getModel("tlDetailModel");
			var data = model.getProperty('/lComponent');
			data.splice(parseInt(path), 1);
			model.setProperty('/lComponent', data);
			// if (this.cmpData !== null) {
			// 	for (var f = 0; f < this.cmpData.length; f++) {
			// 		var str = this.cmpData[f].hFlag;
			// 		str = str.split("-");
			// 		if (this.grpCounter.toString() === str[0] && this.opNum === str[1]) {
			// 			this.cmpData.splice(f, 1);
			// 		}
			// 	}
			// }
			//this.getView().byId("components").setModel(model);
			this.getModel("tlDetailModel").setProperty("/lComponent", data);
			this.matSelectDialog = undefined;
			this.matSearchResults = undefined;
		},

		readHdrDefaults: function (sFrom, index, hData) {
			var g = this;
			var _model = this.getView().getModel();
			var defaults = [];
			var md = this.getView().getModel("tlDetailModel");
			var q = "/ProfileDataSet";
			var oFilter = [new sap.ui.model.Filter("Profidnetz", "EQ", '')];
			_model.read(q, {
				filters: oFilter,
				success: function (r) {
					defaults = r.results[0];
					if (defaults) {
						if (sFrom === "planningPlant") {
							hData.lHeader.tlusg = defaults.Verwe;
							hData.lHeader.Statu = defaults.Statu;
							hData.lHeader.usageDesc = defaults.Vtext;
							hData.lHeader.statusDesc = defaults.Sttext;
						}
						/*md.setData(hData);
						g.getView().byId("taskListHeaderOverview").setModel(md, "headerView");*/
						if (sFrom === "status") {
							hData.lHeader.tlusg = defaults.Verwe;
							hData.lHeader.usageDesc = defaults.Vtext;
						}
						/*md.setData(hData);
						g.getView().byId("taskListHeaderOverview").setModel(md, "headerView");*/
						if (sFrom === "usage") {
							hData.lHeader.Statu = defaults.Statu;
							hData.lHeader.statusDesc = defaults.Sttext;
						}
						/*md.setData(hData);
						g.getView().byId("taskListHeaderOverview").setModel(md, "headerView");*/
						if (sFrom === "tlDesc") {
							hData.lHeader.tlusg = defaults.Verwe;
							hData.lHeader.Statu = defaults.Statu;
							hData.lHeader.usageDesc = defaults.Vtext;
							hData.lHeader.statusDesc = defaults.Sttext;
						}
						md.setData(hData);
						// g.getView().byId("taskListHeaderOverview").setModel(md, "tlDetailModel");
						g.getView().setModel(md, "tlDetailModel");
					}
				},
				error: function (err) {}
			});
			/*_model.read("/ProfileDataSet?$filter= Profidnetz eq ''", null, null, false, function(r) {
			  hdrDefaultArr = r.results[0];
			}, function(err) {});*/
			//return hdrDefaultArr;
		},

		deriveMatDetails: function (m, p) {
			var M = this.getView().getModel();
			var detailArr = [];
			var q = "/MaterialDataSet";
			var tlDetailModel = this.getModel("tlDetailModel");
			var compData = tlDetailModel.getData();
			var g = this;
			var oFilter = [new sap.ui.model.Filter("Matnr", "EQ", m),
				new sap.ui.model.Filter("Werks", "EQ", p)
			];
			M.read(q, {
				filters: oFilter,
				success: function (r) {
					if (r.results.length > 0) {
						detailArr = r.results;
						if (detailArr.length > 0) {
							compData.lComponent[g.index].Menge = detailArr[0].Menge;
							compData.lComponent[g.index].MeinsGcp = detailArr[0].Meins;
							compData.lComponent[g.index].Postp = detailArr[0].Postp;
						}
						tlDetailModel.setData(compData);
						g.getView().setModel(tlDetailModel, "tlDetailModel");
						g.getView().byId("components").getModel("tlDetailModel").refresh();
					}
				},
				error: function (err) {}
			});
			return detailArr;
		},

		isEmpty: function (headerData, operationData, componentData) {
			var headerFlag = false;
			var oprFlag = false;
			var compFlag = false;
			/*if (headerData) {
				for (var i = 0; i < headerData.length; i++) {
					if ((headerData[i].Iwerk === "") || (headerData[i].Ktext === "") || (headerData[i].tlusg === "") || (headerData[i].Statu === "")) {
						headerFlag = true;
					}
				}
			}*/
			if (headerData) {
				if ((headerData.Iwerk === "") || (headerData.Ktext === "") || (headerData.tlusg === "") || (headerData.Statu === "")) {
					headerFlag = true;
				}
			}
			if (headerData === undefined) {
				headerFlag = true;
			}

			if (operationData && operationData.length > 0) {
				for (var j = 0; j < operationData.length; j++) {
					if (operationData[j].Vornr === "" || operationData[j].Ltxa1 === "" || operationData[j].Arbpl === "" || operationData[j].Werks ===
						"" ||
						operationData[j].Steus === "") {
						oprFlag = true;
					}
				}
			}

			if (componentData && componentData.length > 0) {
				for (var k = 0; k < componentData.length; k++) {
					if (componentData[k].Idnrk === "" || componentData[k].Menge === "" || componentData[k].MeinsGcp ===
						"") {
						compFlag = true;
					}
				}
			}
			return [headerFlag, oprFlag, compFlag];
		},

		onDonePress: function (oEvent) {
			var doneFlag = true;
			var sSourceId = oEvent.getSource().getId();
			var tlDetailModel = this.getView().getModel("tlDetailModel");

			var headerData = tlDetailModel.getProperty("/lHeader");
			var operation = this.getView().byId("operationTab");
			if (operation.getModel("tlDetailModel")) {
				var operationData = operation.getModel("tlDetailModel").getProperty("/lOperation");
				var op = [];
				if (tlDetailModel.getData().operation) {
					op = tlDetailModel.getData().operation;
				}
				for (var i = 0; i < operationData.length; i++) {
					op.push(operationData[i]);
				}
				var b = [];
				op = op.filter(function (el) {
					// If it is not a duplicate, return true
					if (b.indexOf(el.flag) == -1) {
						b.push(el.flag);
						return true;
					}
					return false;
				});
				tlDetailModel.setProperty("/operation", op);
			}
			if (this.cmpData) {
				var c = [];
				this.cmpData = this.cmpData.filter(function (el) {
					// If it is not a duplicate, return true
					if (c.indexOf(el.flag) == -1) {
						c.push(el.flag);
						return true;
					}
					return false;
				});
				var component = this.cmpData;
				if (component.length > 0) {
					// var componentData = component.getModel("tlDetailModel").getProperty("/component");
					this.getView().getModel("tlDetailModel").setProperty("/component", component);
					var componentData = component;
				}
			}
			if (tlDetailModel.getData().lMaintPckg) {
				for (var i = 0; i < tlDetailModel.getData().lMaintPckg.length; i++) {
					tlDetailModel.getData().MaintPckg.push(tlDetailModel.getData().lMaintPckg[i]);
				}
			}
			if (tlDetailModel.getData().MaintPckg) {
				var arr = [];
				tlDetailModel.getData().MaintPckg = tlDetailModel.getData().MaintPckg.filter(function (el) {
					// If it is not a duplicate, return true
					if (arr.indexOf(el.flag) == -1) {
						arr.push(el.flag);
						return true;
					}
					return false;
				});
			}
			var equipment = this.getView().byId("equipment");
			var floc = this.getView().byId("floc");
			var eFlag = false;
			var fFlag = false;
			var values = this.isEmpty(headerData, operationData, componentData);
			// var kd = this.getView().byId("keyDate");
			// var _desc = this.getView().byId("Description");
			var success = false;
			var thisRef = this;

			if ((this.action.indexOf('ETL') > 0) && (equipment.getValue() !== "")) {
				eFlag = true;
			}
			if ((this.action.indexOf('FTL') > 0) && (floc.getValue() !== "")) {
				fFlag = true;
			}

			if ((values[0] === true) || (values[1] === true) || (values[2] === true) || this.currentObj.validFrm === "") { //(eFlag === true) || (fFlag === true) ||
				if (values[0] === true) {
					if (this.currentObj.lHeader.Iwerk === "") {
						this.currentObj.lHeader.planningPlantValueState = "Error";
					}
					if (this.currentObj.lHeader.Ktext === "") {
						this.currentObj.lHeader.descDtValueState = "Error";
					}
					if (this.currentObj.lHeader.tlusg === "") {
						this.currentObj.lHeader.usgValueState = "Error";
					}
					if (this.currentObj.lHeader.Statu === "") {
						this.currentObj.lHeader.statusVS = "Error";
					}
				}
				if (this.currentObj.validFrm === "") {
					this.currentObj.validFrmState = "Error";
				} else {
					this.currentObj.validFrmState = "None";
				}
				if (eFlag === true) {
					if (equipment.getValue() === "") {
						equipment.setValueState("Error");
					}
				}
				if (fFlag === true) {
					if (floc.getValue() === "") {
						floc.setValueState("Error");
					}
				}
				tlDetailModel.setData(this.currentObj);
				var msg = this.getView().getModel("i18n").getProperty("MANDMSG");
				this.showMessage(msg);
				return;
			} else {

				/*if (!doneFlag) {
					tlDetailModel.setData(this.currentObj);
					return;
				}*/

				//Delete CLASS and CHAR for group counter before adding
				var tlDetailData = tlDetailModel.getData();
				if (tlDetailData.Class) {
					for (var i = tlDetailData.Class.length - 1; i >= 0; i--) {
						if (tlDetailData.lHeader.Plnal === tlDetailData.Class[i].Plnal) {
							//Delete Chars of Class
							for (var j = tlDetailData.Char.length - 1; j >= 0; j--) {
								if (tlDetailData.Char[j].Plnal === tlDetailData.Class[i].Plnal && tlDetailData.Char[j].Class === tlDetailData.Class[i].Class) {
									tlDetailData.Char.splice(j, 1);
								}
							}
							//Delete Class
							tlDetailData.Class.splice(i, 1);
						}
					}
				}

				//Add CLASS and CHAR data (modified)
				if (this.class.getModel()) {
					var sClassData = this.class.getModel().getData();
					//tlDetailData.Class = [];
					if (sClassData !== null && sClassData !== undefined) {
						for (var a = 0; a < sClassData.length; a++) {
							// sClassData[a].grp = tlDetailData.grp;
							tlDetailData.Class.push(sClassData[a]);
						}
					}
					tlDetailModel.setData(tlDetailData);
				}
				if (this.chData) {
					var sCharData = this.chData; //this.char.getModel().getData();
					if (sCharData !== null && sCharData !== undefined) {
						//tlDetailData.Char = [];
						for (var b = 0; b < sCharData.length; b++) {
							sCharData[b].Plnal = tlDetailData.lHeader.Plnal;
							// sCharData[b].grp = tlDetailData.grp;
							tlDetailData.Char.push(sCharData[b]);
						}
					}
					tlDetailModel.setData(tlDetailData);
				}

				if (sSourceId.indexOf("idBtnCheck") > -1) {
					this.validateCheck(eFlag, fFlag);
					return;
				}

				this.chData = [];
				// if (this.char.getModel()) {
				// 	var sCharData = this.char.getModel().getData();
				// 	if (sCharData !== null && sCharData !== undefined) {
				// 		//tlDetailData.Char = [];
				// 		for (var b = 0; b < sCharData.length; b++) {
				// 			tlDetailData.Char.push(sCharData[b]);
				// 		}
				// 	}

				// 	tlDetailModel.setData(tlDetailData);
				// }

				if (this.status !== false) {
					if (this.action === "changeGTL") {
						var gtlObj = tlDetailModel.getData();
						var AIWListGTLData = sap.ui.getCore().getModel("AIWListGTLModel").getData();
						AIWListGTLData.push(gtlObj);
						sap.ui.getCore().getModel("AIWListGTLModel").setData(AIWListGTLData);
					} else if (this.action === "changeETL") {
						var etlObj = tlDetailModel.getData();
						var AIWListETLData = sap.ui.getCore().getModel("AIWListETLModel").getData();
						AIWListETLData.push(etlObj);
						sap.ui.getCore().getModel("AIWListETLModel").setData(AIWListETLData);
					} else if (this.action === "changeFTL") {
						var ftlObj = tlDetailModel.getData();
						var AIWListFTLData = sap.ui.getCore().getModel("AIWListFTLModel").getData();
						AIWListFTLData.push(ftlObj);
						sap.ui.getCore().getModel("AIWListFTLModel").setData(AIWListFTLData);
					}
				}

				this.cmpData = [];
				//this.opData = [];

				var sPreviousHash = History.getInstance().getPreviousHash();
				if (sPreviousHash !== undefined) {
					history.go(-1);
				}
			}
		},

		validateCheck: function (eFlag, fFlag) {
			var g = this;
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
			var sAIWData = g.getView().getModel("tlDetailModel").getData();
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
				"GTMPack": [],
				"GTRel": [],
				"GTSpack": [],
				"GTPRT": [],
				"GTInsp": [],
				"GTClass": [],
				"GTVal": [],
				"ETList": [],
				"ETOprs": [],
				"ETMPack": [],
				"ETRel": [],
				"ETSpack": [],
				"ETPRT": [],
				"ETInsp": [],
				"ETComp": [],
				"ETClass": [],
				"ETVal": [],
				"FTList": [],
				"FTOprs": [],
				"FTComp": [],
				"FTMPack": [],
				"FTRel": [],
				"FTSpack": [],
				"FTPRT": [],
				"FTInsp": [],
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

					if (AIWEQUIModel[d].EquipmentCatogory === "L" && AIWEQUIModel[d].lam) {
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

			if (eFlag === false && fFlag === false) { //GTL
				if (this.currentObj.lHeader.Iwerk !== "") {
					this.currentObj.lHeader.Werks = this.currentObj.lHeader.Iwerk;
				}
				var gtList = {
					"Werks": this.currentObj.lHeader.Werks,
					"Wcplant": this.currentObj.lHeader.plant,
					"Statu": this.currentObj.lHeader.Statu,
					"Tverwe": this.currentObj.lHeader.tlusg,
					"Ktext": this.currentObj.lHeader.Ktext,
					"Tarbpl": this.currentObj.lHeader.wc,
					"Vagrp": this.currentObj.lHeader.Vagrp,
					"Anlzu": this.currentObj.lHeader.Anlzu,
					"Tplnal": (this.currentObj.lHeader.Plnal).toString(),
					"Tlgnhdr": this.currentObj.grp,
					"Strat": this.currentObj.lHeader.Strat,
					"Slwbez": this.currentObj.lHeader.insPt,
					"Slwbeztxt": this.currentObj.lHeader.insPtDesc
				};
				sPayload.GTList.push(gtList);

				if (this.currentObj.lOperation && this.currentObj.lOperation.length > 0) {
					for (var k = 0; k < this.currentObj.lOperation.length; k++) {
						var gtlOpr = {
							"Tlgnhdr": this.currentObj.grp,
							"Vornr": this.currentObj.lOperation[k].Vornr,
							"TlArbpl": this.currentObj.lOperation[k].Arbpl,
							"Werks2gop": this.currentObj.lOperation[k].Werks,
							"Steus2gop": this.currentObj.lOperation[k].Steus,
							"Ltxa1": this.currentObj.lOperation[k].Ltxa1,
							"Arbei": this.currentObj.lOperation[k].Arbei,
							"Dauno": this.currentObj.lOperation[k].Dauno,
							"Arbeh": this.currentObj.lOperation[k].Arbeh,
							"Anzzl": this.currentObj.lOperation[k].Anzzl,
							"Daune": this.currentObj.lOperation[k].Daune,
							"Indet": this.currentObj.lOperation[k].Indet,
							"Tplnal": (this.currentObj.lOperation[k].Plnal).toString(),
							"Uvorn": this.currentObj.lOperation[k].Uvorn,
							"Larnt2gop": this.currentObj.lOperation[k].Larnt,
							"Prznt": this.currentObj.lOperation[k].workPerc === "" ? 0 : parseFloat(this.currentObj.lOperation[k].workPerc),
							"Bmvrg": this.currentObj.lOperation[k].orderQty,
							"Bmeih": this.currentObj.lOperation[k].ordQtyUnit,
							"Opreis": this.currentObj.lOperation[k].netPrice === "" ? "0.000" : parseFloat(this.currentObj.lOperation[k].netPrice).toFixed(
								3).toString(),
							"Owaers": this.currentObj.lOperation[k].currency,
							"Opeinh": this.currentObj.lOperation[k].priceUnit === "" ? "0.000" : parseFloat(this.currentObj.lOperation[k].priceUnit).toFixed(
								3).toString(),
							"Sakto2gop": this.currentObj.lOperation[k].costElement,
							"Omatkl": this.currentObj.lOperation[k].materialGrp,
							"Oekgrp": this.currentObj.lOperation[k].puchGroup,
							"Ekorg": this.currentObj.lOperation[k].purchOrg,
							"EqunrGop": this.currentObj.lOperation[k].equi,
							"TplnrGop": this.currentObj.lOperation[k].floc,
						};
						sPayload.GTOprs.push(gtlOpr);

						for (var z = 0; z < this.currentObj.lOperation[k].OprRel.length; z++) {
							var selObj = this.currentObj.lOperation[k].OprRel[z];
							var oOprRel = {
								Tlgnhdr: this.currentObj.grp,
								Tplnal: selObj.Plnal.toString(),
								Vorn2: selObj.Vornr,
								Vornrgrel: selObj.OperationOR,
								Dauer: selObj.Offset,
								Zeinh: selObj.OUn,
								Aobar: selObj.RelType,
								Gprznt: selObj.PO,
								Provg: selObj.OI,
								Gkalid: selObj.ID,
								Arbplgrel: selObj.WrkCtrOR,
								Werksgrel: selObj.PlantOR,
							};
							sPayload.GTRel.push(oOprRel);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].SrvPckgOvrw.length; z++) {
							var selObj = this.currentObj.lOperation[k].SrvPckgOvrw[z];
							var svObj = {
								Tlgnhdr: selObj.group,
								Tplnal: selObj.Plnal.toString(),
								Vornrr: selObj.Vornr,
								SrvLine: selObj.LineNum,
								Del: formatter.truetoX(selObj.DelIndSP),
								Srvpos: selObj.ActNum,
								Ktext1: selObj.ShrtTxt,
								Mengegspk: selObj.Qty,
								Meinsgspk: selObj.BUomSP,
								Tbtwr: selObj.GrossPrc,
								Waersgspk: selObj.CurKey,
								IntWork: selObj.Work,
								Iwein: selObj.UnitOfWork,
							};
							sPayload.GTSpack.push(svObj);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].PRT.length; z++) {
							var selObj = this.currentObj.lOperation[k].PRT[z];
							var prtObj = {
								Tlgnhdr: selObj.grp,
								Tplnal: selObj.Plnal.toString(),
								Vornrgprt: selObj.Vornr,

								Psnfh: selObj.ItmNum,
								Fhmar: selObj.ItmCat,
								// Fhmnr: selObj.PRT,
								Matnrgprt: selObj.Mat,
								EqunrGpt: selObj.Equi,
								Eqpnt: selObj.Mspt,
								Doknrgprt: selObj.doc,
								Dokargprt: selObj.docType,
								Doktlgprt: selObj.docPart,
								Dokvrgprt: selObj.docVersion,
								Fhmnr: selObj.Othr,
								Fhwrk: selObj.Plant,
								Mgvgw: selObj.Qty,
								Mgeinh: selObj.UOM,
								Mgform: selObj.QtyFrmla,
								Steuf: selObj.PRTCtrl,
								Stftxt: selObj.PRTCtrlDesc,
								Ewvgw: selObj.StdUsgVal,
								Eweinh: selObj.StdUsgUOM,
								Ewform: selObj.UsgValFrmla,
							};
							sPayload.GTPRT.push(prtObj);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].InspChar.length; z++) {
							var selObj = this.currentObj.lOperation[k].InspChar[z];
							var inspObj = {
								Tlgnhdr: selObj.group,
								Tplnal: selObj.Plnal.toString(),
								Vornrgins: selObj.Vornr,
								Merknr: selObj.InspChar,
								Vste2gins: selObj.PrstInd,
								Quantitat: formatter.truetoX(selObj.QuanChar),
								QpmkRef: formatter.truetoX(selObj.QualChar),
								Verw2gins: selObj.MastInspChar,
								Uzae2tlgn: selObj.Plant,
								Mkv2tlgni: selObj.Version, //Ver2tlgni
								Kurztext: selObj.ShrtTxt,
								Pmth2gins: selObj.InspMthd,
								Qwe2tlgni: selObj.InspMthdPlnt,
								Toleranzs: selObj.TolKey,
								Ver2tlgni: selObj.VrsnInspMthd, //Pmtversio
								Stichprve: selObj.SampProc,
								Probemgeh: selObj.SampUOM,
								Pruefeinh: selObj.BaseSampQty === "" ? "0.00" : parseFloat(selObj.BaseSampQty).toFixed(2),
								Auswmenge: selObj.CodeGrp,
							};
							sPayload.GTInsp.push(inspObj);
						}
					}
				}

				if (this.currentObj.lMaintPckg && this.currentObj.lMaintPckg.length > 0) {
					for (var z = 0; z < this.currentObj.lMaintPckg.length; z++) {
						if (this.currentObj.lMaintPckg[z].MPArr && this.currentObj.lMaintPckg[z].MPArr.length > 0) {
							for (var y = 0; y < this.currentObj.lMaintPckg[z].MPArr.length; y++) {
								var curObj = this.currentObj.lMaintPckg[z].MPArr[y];
								var moObj = {
									// Gplnkn: curObj.Gplnkn,
									// IsSelected: curObj.IsSelected,
									Ktex1: curObj.Ktex1,
									Ktxhi: curObj.Ktxhi,
									Kzyk1: curObj.Kzyk1,
									// Paket: curObj.IsSelected,
									Paketgmpk: curObj.Paket,
									Startgmpk: curObj.Strat,
									// Strat: curObj.Strat,
									Tlgnhdr: this.currentObj.grp,
									Tplnal: curObj.Plnal.toString(),
									// Uzaehl: curObj.Uzaehl,
									Vorn2gmpk: curObj.Vornr,
									// Vornr: curObj.IsSelected,
								};
							}
							sPayload.GTMPack.push(moObj);
						}
					}
				}

				if (this.currentObj.lComponent && this.currentObj.lComponent.length > 0) {
					for (var l = 0; l < this.currentObj.lComponent.length; l++) {
						var gtlComp = {
							"Tlgnhdr": this.currentObj.grp,
							"Idnrk": this.currentObj.lComponent[l].Idnrk,
							"Menge": this.currentObj.lComponent[l].Menge,
							"MeinsGcp": this.currentObj.lComponent[l].MeinsGcp,
							"Vornr": this.currentObj.lComponent[l].Vornr,
							"Postp": this.currentObj.lComponent[l].Postp,
							"Tplnal": (this.currentObj.lComponent[l].Plnal).toString()
						};
						sPayload.GTComp.push(gtlComp);
					}
				}

				if (this.currentObj.Class) {
					for (var m = 0; m < this.currentObj.Class.length; m++) {
						if (this.currentObj.Class[m].Plnal === this.currentObj.lHeader.Plnal) {
							var gtlClass = {
								"Tlgnhdr": this.currentObj.grp,
								"Classtype": this.currentObj.Class[m].Classtype,
								"Class": this.currentObj.Class[m].Class,
								"Clstatus1": this.currentObj.Class[m].Clstatus1,
								"Tplnal": (this.currentObj.Class[m].Plnal).toString()
							};
							sPayload.GTClass.push(gtlClass);
						}
					}
				}

				if (this.chData) {
					for (var n = 0; n < this.chData.length; n++) {
						for (var k = 0; k < this.currentObj.Class.length; k++) {
							if (this.currentObj.Class[k].Class === this.chData[n].Class && this.currentObj.Class[k].Plnal === this.currentObj.lHeader
								.Plnal && !this.chData[n].Plnal) {
								this.chData[n].Plnal = this.currentObj.Class[k].Plnal;
							}
						}
						if (this.chData[n].Plnal) {
							var gtlChar = {
								"Tlgnhdr": this.currentObj.grp,
								"Atnam": this.chData[n].Atnam,
								"Textbez": this.chData[n].Textbez,
								"Atwrt": this.chData[n].Atwrt,
								"Class": this.chData[n].Class,
								"Tplnal": (this.chData[n].Plnal).toString()
							};
							sPayload.GTVal.push(gtlChar);
						}
					}
				}
				// if (this.currentObj.Char) {
				// 	for (var n = 0; n < this.currentObj.Char.length; n++) {
				// 		for (var k = 0; k < this.currentObj.Class.length; k++) {
				// 			if (this.currentObj.Class[k].Class === this.currentObj.Char[n].Class && this.currentObj.Class[k].Plnal === this.currentObj.lHeader
				// 				.Plnal && !this.currentObj.Char[n].Plnal) {
				// 				this.currentObj.Char[n].Plnal = this.currentObj.Class[k].Plnal;
				// 			}
				// 		}
				// 		if (this.currentObj.Char[n].Plnal) {
				// 			var gtlChar = {
				// 				"Tlgnhdr": this.currentObj.grp,
				// 				"Atnam": this.currentObj.Char[n].Atnam,
				// 				"Textbez": this.currentObj.Char[n].Textbez,
				// 				"Atwrt": this.currentObj.Char[n].Atwrt,
				// 				"Class": this.currentObj.Char[n].Class,
				// 				"Tplnal": (this.currentObj.Char[n].Plnal).toString()
				// 			};
				// 			sPayload.GTVal.push(gtlChar);
				// 		}
				// 	}
				// }
			} else if (eFlag === true && fFlag === false) { //ETL
				if (this.currentObj.lHeader.Iwerk !== "") {
					this.currentObj.lHeader.Werks = this.currentObj.lHeader.Iwerk;
				}
				var etList = {
					"Werks": this.currentObj.lHeader.Werks,
					"Wcplant": this.currentObj.lHeader.plant,
					"Statu": this.currentObj.lHeader.Statu,
					"Tverwe": this.currentObj.lHeader.tlusg,
					"Ktext": this.currentObj.lHeader.Ktext,
					"Tarbpl": this.currentObj.lHeader.wc,
					"Vagrp": this.currentObj.lHeader.Vagrp,
					"Anlzu": this.currentObj.lHeader.Anlzu,
					"Tplnal": (this.currentObj.lHeader.Plnal).toString(),
					"Tleqhdr": this.currentObj.grp,
					"Strat": this.currentObj.lHeader.Strat,
					"Eq2tl": this.currentObj.lHeader.equipment,
					"Slwbez": this.currentObj.lHeader.insPt,
					"Slwbeztxt": this.currentObj.lHeader.insPtDesc
				};
				sPayload.ETList.push(etList);

				if (this.currentObj.lOperation && this.currentObj.lOperation.length > 0) {
					for (var k = 0; k < this.currentObj.lOperation.length; k++) {
						var etlOpr = {
							"Tleqhdr": this.currentObj.grp,
							"Vornr": this.currentObj.lOperation[k].Vornr,
							"TlArbpl": this.currentObj.lOperation[k].Arbpl,
							"Werks2eop": this.currentObj.lOperation[k].Werks,
							"Steus2eop": this.currentObj.lOperation[k].Steus,
							"Ltxa1": this.currentObj.lOperation[k].Ltxa1,
							"Arbei": this.currentObj.lOperation[k].Arbei,
							"Dauno": this.currentObj.lOperation[k].Dauno,
							"Arbeh": this.currentObj.lOperation[k].Arbeh,
							"Anzzl": this.currentObj.lOperation[k].Anzzl,
							"Daune": this.currentObj.lOperation[k].Daune,
							"Indet": this.currentObj.lOperation[k].Indet,
							"Tplnal": (this.currentObj.lOperation[k].Plnal).toString(),
							"Uvorn": this.currentObj.lOperation[k].Uvorn,
							"Larnt2eop": this.currentObj.lOperation[k].Larnt,
							"Prznt": this.currentObj.lOperation[k].workPerc === "" ? 0 : parseFloat(this.currentObj.lOperation[k].workPerc),
							"Bmvrg": this.currentObj.lOperation[k].orderQty,
							"Bmeih": this.currentObj.lOperation[k].ordQtyUnit,
							"Opreis": this.currentObj.lOperation[k].netPrice === "" ? "0.000" : parseFloat(this.currentObj.lOperation[k].netPrice).toFixed(
								3).toString(),
							"Owaers": this.currentObj.lOperation[k].currency,
							"Opeinh": this.currentObj.lOperation[k].priceUnit === "" ? "0.000" : parseFloat(this.currentObj.lOperation[k].priceUnit).toFixed(
								3).toString(),
							"Sakto2eop": this.currentObj.lOperation[k].costElement,
							"Omatkl": this.currentObj.lOperation[k].materialGrp,
							"Oekgrp": this.currentObj.lOperation[k].puchGroup,
							"Ekorg": this.currentObj.lOperation[k].purchOrg,
							"EqunrEop": this.currentObj.lOperation[k].equi,
							"TplnrEop": this.currentObj.lOperation[k].floc,
						};
						sPayload.ETOprs.push(etlOpr);

						for (var z = 0; z < this.currentObj.lOperation[k].OprRel.length; z++) {
							var selObj = this.currentObj.lOperation[k].OprRel[z];
							var oOprRel = {
								Tleqhdr: this.currentObj.grp,
								Tplnal: selObj.Plnal.toString(),
								Vorn2: selObj.Vornr,
								Vornrerel: selObj.OperationOR,
								Dauer: selObj.Offset,
								Zeinh: selObj.OUn,
								Aobar: selObj.RelType,
								Eprznt: selObj.PO,
								Provg: selObj.OI,
								Ekalid: selObj.ID,
								Arbplerel: selObj.WrkCtrOR,
								Werkserel: selObj.PlantOR,
							};
							sPayload.ETRel.push(oOprRel);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].SrvPckgOvrw.length; z++) {
							var selObj = this.currentObj.lOperation[k].SrvPckgOvrw[z];
							var svObj = {
								Tleqhdr: selObj.group,
								Tplnal: selObj.Plnal.toString(),
								Vornrr: selObj.Vornr,
								SrvLine: selObj.LineNum,
								Del: formatter.truetoX(selObj.DelIndSP),
								Srvpos: selObj.ActNum,
								Ktext1: selObj.ShrtTxt,
								Mengeespk: selObj.Qty,
								Meinsespk: selObj.BUomSP,
								Tbtwr: selObj.GrossPrc,
								Waersespk: selObj.CurKey,
								IntWork: selObj.Work,
								Iwein: selObj.UnitOfWork,
							};
							sPayload.ETSpack.push(svObj);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].PRT.length; z++) {
							var selObj = this.currentObj.lOperation[k].PRT[z];
							var prtObj = {
								Tleqhdr: selObj.grp,
								Tplnal: selObj.Plnal.toString(),
								Vornreprt: selObj.Vornr,

								Psnfh: selObj.ItmNum,
								Fhmar: selObj.ItmCat,
								// Fhmnr: selObj.PRT,
								Matnreprt: selObj.Mat,
								EqunrEpt: selObj.Equi,
								Eqpnt: selObj.Mspt,
								Doknreprt: selObj.doc,
								Dokareprt: selObj.docType,
								Doktleprt: selObj.docPart,
								Dokvreprt: selObj.docVersion,
								Fhmnr: selObj.Othr,
								Fhwrk: selObj.Plant,
								Mgvgw: selObj.Qty,
								Mgeinh: selObj.UOM,
								Mgform: selObj.QtyFrmla,
								Steuf: selObj.PRTCtrl,
								Stftxt: selObj.PRTCtrlDesc,
								Ewvgw: selObj.StdUsgVal,
								Eweinh: selObj.StdUsgUOM,
								Ewform: selObj.UsgValFrmla,
							};
							sPayload.ETPRT.push(prtObj);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].InspChar.length; z++) {
							var selObj = this.currentObj.lOperation[k].InspChar[z];
							var inspObj = {
								Tleqhdr: selObj.group,
								Tplnal: selObj.Plnal.toString(),
								Vornreins: selObj.Vornr,
								Merknr: selObj.InspChar,
								Vste2eins: selObj.PrstInd,
								Quantitat: formatter.truetoX(selObj.QuanChar),
								QpmkRef: formatter.truetoX(selObj.QualChar),
								Verw2eins: selObj.MastInspChar,
								Uzae2tlen: selObj.Plant,
								Mkv2tleni: selObj.Version, //Ver2tleqi
								Kurztext: selObj.ShrtTxt,
								Pmth2eins: selObj.InspMthd,
								Qwe2tleqi: selObj.InspMthdPlnt,
								Toleranzs: selObj.TolKey,
								Ver2tleqi: selObj.VrsnInspMthd, //Pmtversio
								Stichprve: selObj.SampProc,
								Probemgeh: selObj.SampUOM,
								Pruefeinh: selObj.BaseSampQty === "" ? "0.00" : parseFloat(selObj.BaseSampQty).toFixed(2),
								Auswmenge: selObj.CodeGrp,
							};
							sPayload.ETInsp.push(inspObj);
						}
					}
				}

				if (this.currentObj.lMaintPckg && this.currentObj.lMaintPckg.length > 0) {
					for (var z = 0; z < this.currentObj.lMaintPckg.length; z++) {
						if (this.currentObj.lMaintPckg[z].MPArr && this.currentObj.lMaintPckg[z].MPArr.length > 0) {
							for (var y = 0; y < this.currentObj.lMaintPckg[z].MPArr.length; y++) {
								var curObj = this.currentObj.lMaintPckg[z].MPArr[y];
								var moObj = {
									// Gplnkn: curObj.Gplnkn,
									// IsSelected: curObj.IsSelected,
									Ktex1: curObj.Ktex1,
									Ktxhi: curObj.Ktxhi,
									Kzyk1: curObj.Kzyk1,
									// Paket: curObj.IsSelected,
									Paketempk: curObj.Paket,
									Startempk: curObj.Strat,
									// Strat: curObj.Strat,
									Tleqhdr: this.currentObj.grp,
									Tplnal: curObj.Plnal.toString(),
									// Uzaehl: curObj.Uzaehl,
									Vorn2empk: curObj.Vornr,
									// Vornr: curObj.IsSelected,
								};
							}
							sPayload.ETMPack.push(moObj);
						}
					}
				}

				if (this.currentObj.lComponent && this.currentObj.lComponent.length > 0) {
					for (var l = 0; l < this.currentObj.lComponent.length; l++) {
						var etlComp = {
							"Tleqhdr": this.currentObj.grp,
							"Idnrk": this.currentObj.lComponent[l].Idnrk,
							"Menge": this.currentObj.lComponent[l].Menge,
							"MeinsEcp": this.currentObj.lComponent[l].MeinsGcp,
							"Vornr": this.currentObj.lComponent[l].Vornr,
							"Postp": this.currentObj.lComponent[l].Postp,
							"Tplnal": (this.currentObj.lComponent[l].Plnal).toString()
						};
						sPayload.ETComp.push(etlComp);
					}
				}

				if (this.currentObj.Class) {
					for (var m = 0; m < this.currentObj.Class.length; m++) {
						if (this.currentObj.Class[m].Plnal === this.currentObj.lHeader.Plnal) {
							var etlClass = {
								"Tleqhdr": this.currentObj.grp,
								"Classtype": this.currentObj.Class[m].Classtype,
								"Class": this.currentObj.Class[m].Class,
								"Clstatus1": this.currentObj.Class[m].Clstatus1,
								"Tplnal": (this.currentObj.Class[m].Plnal).toString()
							};
							sPayload.ETClass.push(etlClass);
						}
					}
				}

				if (this.currentObj.Char) {
					for (var n = 0; n < this.currentObj.Char.length; n++) {
						for (var k = 0; k < this.currentObj.Class.length; k++) {
							if (this.currentObj.Class[k].Class === this.currentObj.Char[n].Class && this.currentObj.Class[k].Plnal === this.currentObj.lHeader
								.Plnal && !this.currentObj.Char[n].Plnal) {
								this.currentObj.Char[n].Plnal = this.currentObj.Class[k].Plnal;
							}
						}
						if (this.currentObj.Char[n].Plnal) {
							var etlChar = {
								"Tleqhdr": this.currentObj.grp,
								"Atnam": this.currentObj.Char[n].Atnam,
								"Textbez": this.currentObj.Char[n].Textbez,
								"Atwrt": this.currentObj.Char[n].Atwrt,
								"Class": this.currentObj.Char[n].Class,
								"Tplnal": (this.currentObj.Char[n].Plnal).toString()
							};
							sPayload.ETVal.push(etlChar);
						}
					}
				}
			} else if (eFlag === false && fFlag === true) {
				if (this.currentObj.lHeader[j].Iwerk !== "") {
					this.currentObj.lHeader[j].Werks = this.currentObj.lHeader[j].Iwerk;
				}
				var ftList = {
					"Werks": this.currentObj.lHeader[j].Werks,
					"Wcplant": this.currentObj.lHeader[j].plant,
					"Statu": this.currentObj.lHeader[j].Statu,
					"Tverwe": this.currentObj.lHeader[j].tlusg,
					"Ktext": this.currentObj.lHeader[j].Ktext,
					"Tarbpl": this.currentObj.lHeader[j].wc,
					"Vagrp": this.currentObj.lHeader[j].Vagrp,
					"Anlzu": this.currentObj.lHeader[j].Anlzu,
					"Tplnal": (this.currentObj.lHeader[j].Plnal).toString(),
					"Tlflhdr": this.currentObj.grp,
					"Strat": this.currentObj.lHeader[j].Strat,
					"Fl2tl": this.currentObj.lHeader[j].floc,
					"Slwbez": this.currentObj.lHeader[j].insPt,
					"Slwbeztxt": this.currentObj.lHeader[j].insPtDesc
				};
				sPayload.FTList.push(ftList);

				if (this.currentObj.lOperation) {
					for (var k = 0; k < this.currentObj.lOperation.length; k++) {
						var ftlOpr = {
							"Tlflhdr": this.currentObj.grp,
							"Vornr": this.currentObj.lOperation[k].Vornr,
							"TlArbpl": this.currentObj.lOperation[k].Arbpl,
							"Werks2fop": this.currentObj.lOperation[k].Werks,
							"Steus2fop": this.currentObj.lOperation[k].Steus,
							"Ltxa1": this.currentObj.lOperation[k].Ltxa1,
							"Arbei": this.currentObj.lOperation[k].Arbei,
							"Dauno": this.currentObj.lOperation[k].Dauno,
							"Arbeh": this.currentObj.lOperation[k].Arbeh,
							"Anzzl": this.currentObj.lOperation[k].Anzzl,
							"Daune": this.currentObj.lOperation[k].Daune,
							"Indet": this.currentObj.lOperation[k].Indet,
							"Tplnal": (this.currentObj.lOperation[k].Plnal).toString(),
							"Uvorn": this.currentObj.lOperation[k].Uvorn,
							"Larnt2fop": this.currentObj.lOperation[k].Larnt,
							"Prznt": this.currentObj.lOperation[k].workPerc === "" ? 0 : parseFloat(this.currentObj.lOperation[k].workPerc),
							"Bmvrg": this.currentObj.lOperation[k].orderQty,
							"Bmeih": this.currentObj.lOperation[k].ordQtyUnit,
							"Opreis": this.currentObj.lOperation[k].netPrice === "" ? "0.000" : parseFloat(this.currentObj.lOperation[k].netPrice).toFixed(
								3).toString(),
							"Owaers": this.currentObj.lOperation[k].currency,
							"Opeinh": this.currentObj.lOperation[k].priceUnit === "" ? "0.000" : parseFloat(this.currentObj.lOperation[k].priceUnit).toFixed(
								3).toString(),
							"Sakto2fop": this.currentObj.lOperation[k].costElement,
							"Omatkl": this.currentObj.lOperation[k].materialGrp,
							"Oekgrp": this.currentObj.lOperation[k].puchGroup,
							"Ekorg": this.currentObj.lOperation[k].purchOrg,
							"EqunrFop": this.currentObj.lOperation[k].equi,
							"TplnrFop": this.currentObj.lOperation[k].floc,
						};
						sPayload.FTOprs.push(ftlOpr);

						for (var z = 0; z < this.currentObj.lOperation[k].OprRel.length; z++) {
							var selObj = this.currentObj.lOperation[k].OprRel[z];
							var oOprRel = {
								Tlflhdr: this.currentObj.grp,
								Tplnal: selObj.Plnal.toString(),
								Vorn2: selObj.Vornr,
								Vornrfrel: selObj.OperationOR,
								Dauer: selObj.Offset,
								Zeinh: selObj.OUn,
								Aobar: selObj.RelType,
								Fprznt: selObj.PO,
								Provg: selObj.OI,
								Fkalid: selObj.ID,
								Arbplfrel: selObj.WrkCtrOR,
								Werksfrel: selObj.PlantOR,
							};
							sPayload.FTRel.push(oOprRel);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].SrvPckgOvrw.length; z++) {
							var selObj = this.currentObj.lOperation[k].SrvPckgOvrw[z];
							var svObj = {
								Tlflhdr: selObj.group,
								Tplnal: selObj.Plnal.toString(),
								Vornrr: selObj.Vornr,
								SrvLine: selObj.LineNum,
								Del: formatter.truetoX(selObj.DelIndSP),
								Srvpos: selObj.ActNum,
								Ktext1: selObj.ShrtTxt,
								Mengefspk: selObj.Qty,
								Meinsfspk: selObj.BUomSP,
								Tbtwr: selObj.GrossPrc,
								Waersfspk: selObj.CurKey,
								IntWork: selObj.Work,
								Iwein: selObj.UnitOfWork,
							};
							sPayload.FTSpack.push(svObj);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].PRT.length; z++) {
							var selObj = this.currentObj.lOperation[k].PRT[z];
							var prtObj = {
								Tlflhdr: selObj.grp,
								Tplnal: selObj.Plnal.toString(),
								Vornrfprt: selObj.Vornr,

								Psnfh: selObj.ItmNum,
								Fhmar: selObj.ItmCat,
								// Fhmnr: selObj.PRT,
								Matnrfprt: selObj.Mat,
								EqunrFpt: selObj.Equi,
								Eqpnt: selObj.Mspt,
								Doknrfprt: selObj.doc,
								Dokarfprt: selObj.docType,
								Doktlfprt: selObj.docPart,
								Dokvrfprt: selObj.docVersion,
								Fhmnr: selObj.Othr,
								Fhwrk: selObj.Plant,
								Mgvgw: selObj.Qty,
								Mgeinh: selObj.UOM,
								Mgform: selObj.QtyFrmla,
								Steuf: selObj.PRTCtrl,
								Stftxt: selObj.PRTCtrlDesc,
								Ewvgw: selObj.StdUsgVal,
								Eweinh: selObj.StdUsgUOM,
								Ewform: selObj.UsgValFrmla,
							};
							sPayload.FTPRT.push(prtObj);
						}

						for (var z = 0; z < this.currentObj.lOperation[k].InspChar.length; z++) {
							var selObj = this.currentObj.lOperation[k].InspChar[z];
							var inspObj = {
								Tlflhdr: selObj.group,
								Tplnal: selObj.Plnal.toString(),
								Vornrfins: selObj.Vornr,
								Merknr: selObj.InspChar,
								Vste2eins: selObj.PrstInd,
								Quantitat: formatter.truetoX(selObj.QuanChar),
								QpmkRef: formatter.truetoX(selObj.QualChar),
								Verw2fins: selObj.MastInspChar,
								Uzae2tlfn: selObj.Plant,
								Mkv2tlfni: selObj.Version, //Ver2tlfli
								Kurztext: selObj.ShrtTxt,
								Pmth2fins: selObj.InspMthd,
								Qwe2tlfli: selObj.InspMthdPlnt,
								Toleranzs: selObj.TolKey,
								Ver2tlfli: selObj.VrsnInspMthd, //Pmtversio
								Stichprve: selObj.SampProc,
								Probemgeh: selObj.SampUOM,
								Pruefeinh: selObj.BaseSampQty === "" ? "0.00" : parseFloat(selObj.BaseSampQty).toFixed(2),
								Auswmenge: selObj.CodeGrp,
							};
							sPayload.FTInsp.push(inspObj);
						}
					}
				}

				if (this.currentObj.lMaintPckg && this.currentObj.lMaintPckg.length > 0) {
					for (var z = 0; z < this.currentObj.lMaintPckg.length; z++) {
						if (this.currentObj.lMaintPckg[z].MPArr && this.currentObj.lMaintPckg[z].MPArr.length > 0) {
							for (var y = 0; y < this.currentObj.lMaintPckg[z].MPArr.length; y++) {
								var curObj = this.currentObj.lMaintPckg[z].MPArr[y];
								var moObj = {
									// Gplnkn: curObj.Gplnkn,
									// IsSelected: curObj.IsSelected,
									Ktex1: curObj.Ktex1,
									Ktxhi: curObj.Ktxhi,
									Kzyk1: curObj.Kzyk1,
									// Paket: curObj.IsSelected,
									Paketfmpk: curObj.Paket,
									Startfmpk: curObj.Strat,
									// Strat: curObj.Strat,
									Tlflhdr: this.currentObj.grp,
									Tplnal: curObj.Plnal.toString(),
									// Uzaehl: curObj.Uzaehl,
									Vorn2fmpk: curObj.Vornr,
									// Vornr: curObj.IsSelected,
								};
							}
							sPayload.FTMPack.push(moObj);
						}
					}
				}

				if (this.currentObj.lComponent) {
					for (var l = 0; l < this.currentObj.lComponent.length; l++) {
						var ftlComp = {
							"Tlflhdr": this.currentObj.grp,
							"Idnrk": this.currentObj.lComponent[l].Idnrk,
							"Menge": this.currentObj.lComponent[l].Menge,
							"MeinsFcp": this.currentObj.lComponent[l].MeinsGcp,
							"Vornr": this.currentObj.lComponent[l].Vornr,
							"Postp": this.currentObj.lComponent[l].Postp,
							"Tplnal": (this.currentObj.lComponent[l].Plnal).toString()
						};
						sPayload.FTComp.push(ftlComp);
					}
				}

				if (this.currentObj.Class) {
					for (var m = 0; m < this.currentObj.Class.length; m++) {
						if (this.currentObj.Class[m].Plnal === this.currentObj.lHeader.Plnal) {
							var ftlClass = {
								"Tlflhdr": this.currentObj.grp,
								"Classtype": this.currentObj.Class[m].Classtype,
								"Class": this.currentObj.Class[m].Class,
								"Clstatus1": this.currentObj.Class[m].Clstatus1,
								"Tplnal": (this.currentObj.Class[m].Plnal).toString()
							};
							sPayload.FTClass.push(ftlClass);
						}
					}
				}

				if (this.currentObj.Char) {
					for (var n = 0; n < this.currentObj.Char.length; n++) {
						for (var k = 0; k < this.currentObj.Class.length; k++) {
							if (this.currentObj.Class[k].Class === this.currentObj.Char[n].Class && this.currentObj.Class[k].Plnal === this.currentObj.lHeader
								.Plnal && !this.currentObj.Char[n].Plnal) {
								this.currentObj.Char[n].Plnal = this.currentObj.Class[k].Plnal;
							}
						}
						if (this.currentObj.Char[n].Plnal) {
							var ftlChar = {
								"Tlflhdr": this.currentObj.grp,
								"Atnam": this.currentObj.Char[n].Atnam,
								"Textbez": this.currentObj.Char[n].Textbez,
								"Atwrt": this.currentObj.Char[n].Atwrt,
								"Class": this.currentObj.Char[n].Class,
								"Tplnal": (this.currentObj.Char[n].Plnal).toString()
							};
							sPayload.FTVal.push(ftlChar);
						}
					}
				}
			}

			this.getView().byId("tlDetailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("tlDetailPage").setBusy(false);
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
					g.getView().byId("tlDetailPage").setBusy(false);
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

		showMessage: function (msg) {
			this.createMessagePopover(msg, "Error");
			// MessageBox.show(msg, {
			// 	title: "Error",
			// 	icon: sap.m.MessageBox.Icon.ERROR,
			// 	onClose: function (oAction) {
			// 	}
			// });
		},

		// Value Help 
		onEquipVH: function (oEvent) {
			var g = this;
			//var a;
			//var P = p;
			var tlDetailModel = this.getModel("tlDetailModel");
			//a = this.getView().byId(p);
			// var m = this.getView().byId("equipment");
			// var d = this.getView().byId("equipmentDesc");
			var eSearchResults;
			if (eSearchResults === undefined) {
				var eSelectDialog = new sap.m.SelectDialog({
					title: this.getView().getModel("i18n").getProperty("EQUIPMENT"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/EquipmentNumberSet",
						template: new sap.m.StandardListItem({
							title: "{Equnr}",
							description: "{Eqktx}"
						})
					},
					confirm: function (E) {
						// m.setEnabled(false);
						g.currentObj.lHeader.equiValueState = "None";
						g.currentObj.lHeader.equiValueStateTxt = "";
						g.currentObj.lHeader.equipmentDesc = E.getParameters().selectedItem.getProperty("description");
						g.currentObj.lHeader.equipment = E.getParameters().selectedItem.getProperty("title");
						g.currentObj.lHeader.bAddHeader = true;
						tlDetailModel.setData(g.currentObj);
						/*m.setValueState("None");
						m.setValueStateText("");
						d.setValue(E.getParameters().selectedItem.getProperty("description"));
						m.setValue(E.getParameters().selectedItem.getProperty("title"));
						// enabling add header row button 
						g.getView().byId("newHeader").setEnabled(true);*/
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Eqktx", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				var q = "/EquipmentNumberSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].Equnr) {
										var sObj = {
											Equnr: oModelData[i].Equnr,
											Eqktx: oModelData[i].Eqktx
										};
										h.results.unshift(sObj);
									}
								}
							}

							eSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Equnr}",
								description: "{Eqktx}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							eSelectDialog.setModel(e);
							// eSelectDialog.setGrowingThreshold(h.results.length);
							eSelectDialog.bindAggregation("items", "/results", I);
						} else {
							eSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(eSearchResults);
				eSelectDialog.setModel(e);
				var I = eSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			eSelectDialog.open();
		},

		onFlocVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getModel("tlDetailModel");
			/*var a;
			var P = p;
			a = this.getView().byId(p);
			var m = this.getView().byId("floc");
			var d = this.getView().byId("flocDesc");*/
			var fSearchResults;
			if (fSearchResults === undefined) {
				var fSelectDialog = new sap.m.SelectDialog({
					title: this.getView().getModel("i18n").getProperty("FLOC"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						// path: "/FunclocSHSet",
						path: "/FunctionLocationSet",
						template: new sap.m.StandardListItem({
							title: "{Tplnr}",
							description: "{Pltxt}"
						})
					},
					confirm: function (E) {
						g.currentObj.lHeader.flocValueState = "None";
						g.currentObj.lHeader.flocValueStateTxt = "";
						g.currentObj.lHeader.flocDesc = E.getParameters().selectedItem.getProperty("description");
						g.currentObj.lHeader.floc = E.getParameters().selectedItem.getProperty("title");
						g.currentObj.lHeader.bAddHeader = true;
						tlDetailModel.setData(g.currentObj);
						/*m.setValueState("None");
						m.setValueStateText("");
						//m.setEnabled(false);
						d.setValue(E.getParameters().selectedItem.getProperty("description"));
						m.setValue(E.getParameters().selectedItem.getProperty("title"));
						g.getView().byId("newHeader").setEnabled(true);*/
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Tplnr", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Pltxt", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				// var q = "/FunclocSHSet";
				var q = "/FunctionLocationSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].Functionallocation) {
										var sObj = {
											Tplnr: oModelData[i].Functionallocation,
											Pltxt: oModelData[i].Flocdescription
										};
										h.results.unshift(sObj);
									}
								}
							}
							fSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Tplnr}",
								description: "{Pltxt}",
								active: true
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							fSelectDialog.setModel(e);
							// fSelectDialog.setGrowingThreshold(h.results.length);
							fSelectDialog.bindAggregation("items", "/results", I);
						} else {
							fSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(fSearchResults);
				fSelectDialog.setModel(e);
				var I = fSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			fSelectDialog.open();
		},

		onPplantVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getModel("tlDetailModel");
			var tData = tlDetailModel.getData();

			var settings = {
				title: this.getView().getModel("i18n").getProperty("PLAN_PLANT_TXT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/PlanningPlantSet",
					template: new sap.m.StandardListItem({
						title: "{Werks}",
						description: "{Name1}"
					})
				},
				confirm: function (E) {
					tData.lHeader.valueStatePP = "None";
					tData.lHeader.Iwerk = E.getParameters().selectedItem.getProperty("title");
					tData.lHeader.pPlantDesc = E.getParameters().selectedItem.getProperty("description");
					tData.lHeader.planningPlantValueState = "None";
					tlDetailModel.setData(tData);
					g.readHdrDefaults("planningPlant", g.index, tData);
				}
			};

			var q = "/PlanningPlantSet";
			var M = this.getView().getModel("valueHelp");
			var ppSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Werks", "Name1");
			ppSelectDialog.open();
		},

		onHWCVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			/*var md = new sap.ui.model.json.JSONModel();
			md = g.getView().byId("operationTab").getModel("tlDetailModel");
			var opData = md.getData();
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			g.index = parseInt(sPath.substr(-1));*/
			// added 
			var hdData = tlDetailModel.getData();
			var pp = hdData.lHeader.Iwerk;
			var hwctabSearchResults;
			if (hwctabSearchResults === undefined) {

				var hwctabSelectDialog = new sap.m.TableSelectDialog({
					// id: "txCatDialog",
					title: this.getView().getModel("i18n").getProperty("WC"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "Work Center Category"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Plant"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Work Center"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Description"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Language"
								})
							]
						}),

						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "Control Key"
								})
							]
						})
					],
					items: {
						path: "/WorkCenterVHSet?$filter= Werks eq '" + pp + "'",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Verwe}"
								}),
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Arbpl}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								}),
								new sap.m.Text({
									text: "{Spras}"
								}),
								new sap.m.Text({
									text: "{Steus}"
								})
							]
						})
					},
					confirm: function (E) {
						hdData.lHeader.wcValueState = "None";
						hdData.lHeader.wc = E.getParameter("selectedItem").getCells()[2].getText();
						hdData.lHeader.Steus = E.getParameter("selectedItem").getCells()[5].getText();
						hdData.lHeader.plant = E.getParameter("selectedItem").getCells()[1].getText();
						hdData.lHeader.wcValueState = "None";
						g.ActivityType = E.getParameter("selectedItem").getBindingContext().getObject().Lar01;
						/*md.setData(opData);
						g.getView().byId("operationTab").setModel(md, "tlDetailModel");*/
						tlDetailModel.setData(hdData);
						g.WCPPCheckHeader();
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				// if (pp === null || pp === "") {
				var q = "/WorkCenterVHSet";
				var oFilter = [];
				// } else {
				// 	//var q = "/WorkCenterSet?$filter= Werks eq '" + pp + "'";
				// 	var q = "/WorkCenterVHSet";
				// 	var oFilter = [new sap.ui.model.Filter("Werks", "EQ", pp)];
				// }
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					filters: oFilter,
					success: function (h, E) {
						if (h.results.length > 0) {
							var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].wc) {
										var sObj = {
											Verwe: oModelData[i].wcCat,
											Werks: oModelData[i].plant,
											Arbpl: oModelData[i].wc,
											Ktext: oModelData[i].wcDesc,
											Spras: h.results[0].Spras
										};
										h.results.unshift(sObj);
									}
								}
							}
							hwctabSearchResults = h;
							var I = new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{Verwe}"
									}),
									new sap.m.Text({
										text: "{Werks}"
									}),
									new sap.m.Text({
										text: "{Arbpl}"
									}),
									new sap.m.Text({
										text: "{Ktext}"
									}),
									new sap.m.Text({
										text: "{Spras}"
									}),
									new sap.m.Text({
										text: "{Steus}"
									})
								]
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							hwctabSelectDialog.setModel(e);
							// hwctabSelectDialog.setGrowingThreshold(h.results.length);
							hwctabSelectDialog.bindAggregation("items", "/results", I);
						} else {
							hwctabSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(hwctabSearchResults);
				hwctabSelectDialog.setModel(e);
				var I = hwctabSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			hwctabSelectDialog.open();
		},

		onPlantWcVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getModel("tlDetailModel");
			var tData = tlDetailModel.getData();
			var settings = {
				title: this.getView().getModel("i18n").getProperty("PLANT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>SEARCHTERM1}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>SEARCHTERM2}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>POST_CODE}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>CITY}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>Name2}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>Name1}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>COMP_NAME}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>ADDR_VERSION}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>PLANT}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>DESCRIPTION}"
							})
						]
					})
				],
				items: {
					path: "/PlantVHSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{SearchTerm1}"
							}),
							new sap.m.Text({
								text: "{SearchTerm2}"
							}),
							new sap.m.Text({
								text: "{PostalCode}"
							}),
							new sap.m.Text({
								text: "{City}"
							}),
							new sap.m.Text({
								text: "{Name2}"
							}),
							new sap.m.Text({
								text: "{Name}"
							}),
							new sap.m.Text({
								text: "{CompanyName}"
							}),
							new sap.m.Text({
								text: "{AddrVersion}"
							}),
							new sap.m.Text({
								text: "{Plant}"
							}),
							new sap.m.Text({
								text: "{PlantName}"
							})
						]
					})

				},
				confirm: function (E) {
					tData.lHeader.plantValueState = "None";
					tData.lHeader.plantValueStateTxt = "";
					tData.lHeader.plant = E.getParameter("selectedItem").getCells()[8].getText();
					tData.lHeader.plantDesc = E.getParameter("selectedItem").getCells()[9].getText();
					tlDetailModel.setData(tData);
				}
			};

			//if (this.wcList === {} || this.wcList === undefined) {
			var q = "/PlantVHSet";
			var oFilters = [];
			var M = this.getView().getModel("valueHelp");
			var cells = [
				new sap.m.Text({
					text: "{SearchTerm1}"
				}),
				new sap.m.Text({
					text: "{SearchTerm2}"
				}),
				new sap.m.Text({
					text: "{PostalCode}"
				}),
				new sap.m.Text({
					text: "{City}"
				}),
				new sap.m.Text({
					text: "{Name2}"
				}),
				new sap.m.Text({
					text: "{Name}"
				}),
				new sap.m.Text({
					text: "{CompanyName}"
				}),
				new sap.m.Text({
					text: "{AddrVersion}"
				}),
				new sap.m.Text({
					text: "{Plant}"
				}),
				new sap.m.Text({
					text: "{PlantName}"
				})
			];

			var pSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Plant", "PlantName");
			pSelectDialog.open();
			pSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");

		},

		onUsageVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var tData = tlDetailModel.getData();

			var settings = {
				title: this.getView().getModel("i18n").getProperty("USAGE"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/UsageVHSet",
					template: new sap.m.StandardListItem({
						title: "{VERWE}",
						description: "{TXT}"
					})
				},
				confirm: function (E) {
					tData.lHeader.tlusg = E.getParameters().selectedItem.getProperty("title");
					tData.lHeader.usageDesc = E.getParameters().selectedItem.getProperty("description");
					tData.lHeader.usgValueState = "None";
					tlDetailModel.setData(tData);
					g.readHdrDefaults("usage", g.index, tData);
				}
			};

			var q = "/UsageVHSet";
			var M = this.getView().getModel("valueHelp");
			var uSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "VERWE", "TXT");
			uSelectDialog.open();
		},

		onPlannerGrpVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var tData = tlDetailModel.getData();
			/*var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			g.index = parseInt(sPath.substr(-1));*/
			var plantVal = tData.lHeader.Iwerk;
			var pGrpVHPath;

			if (plantVal) { // If plant value is not intial , send plant value in query
				//pGrpVHPath = "/PlannerGrpVHSet?$filter= WERKS eq '" + plantVal + "'";
				pGrpVHPath = "/PlannerGroupTLSet";
				var oFilter = [new sap.ui.model.Filter("Iwerk", "EQ", plantVal)];
			} else {
				pGrpVHPath = "/PlannerGroupTLSet";
				var oFilter = [];
			}

			var pgSelectDialog = new sap.m.SelectDialog({
				title: this.getView().getModel("i18n").getProperty("PL_GRP"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: pGrpVHPath,
					template: new sap.m.StandardListItem({
						title: "{Ingrp}",
						description: "{Innam}"
					})
				},
				confirm: function (E) {
					tData.lHeader.Vagrp = E.getParameters().selectedItem.getProperty("title");
					tData.lHeader.plGrpDesc = E.getParameters().selectedItem.getProperty("description");
					tData.lHeader.plGrpValueState = "None";
					// tData[g.index - 1].valueStateU = "None";
					tlDetailModel.setData(tData);
					//g.taskListH.setModel(null, md);
				},
				search: function (E) {
					var v = E.getParameter("value").toUpperCase();
					v = v.replace(/^[ ]+|[ ]+$/g, '');
					var h = pgSelectDialog.getItems();
					for (var i = 0; i < h.length; i++) {
						if (v.length > 0) {
							var s = h[i].getBindingContext().getProperty("Ingrp");
							var j = h[i].getBindingContext().getProperty("Innam");
							if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
								h[i].setVisible(false);
							} else {
								h[i].setVisible(true);
							}
						} else {
							h[i].setVisible(true);
						}
					}
				},
				liveChange: function (E) {
					var v = E.getParameter("value").toUpperCase();
					v = v.replace(/^[ ]+|[ ]+$/g, '');
					var h = pgSelectDialog.getItems();
					for (var i = 0; i < h.length; i++) {
						if (v.length > 0) {
							var s = h[i].getBindingContext().getProperty("Ingrp");
							var j = h[i].getBindingContext().getProperty("Innam");
							if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
								h[i].setVisible(false);
							} else {
								h[i].setVisible(true);
							}
						} else {
							h[i].setVisible(true);
						}
					}
				}
			});

			var q = pGrpVHPath;
			var M = this.getView().getModel("valueHelp");
			M.read(q, {
				filters: oFilter,
				success: function (h, E) {
					if (h.results.length > 0) {
						g.pgSearchResults = h;
						var I = new sap.m.StandardListItem({
							title: "{Ingrp}",
							description: "{Innam}"
						});
						var e = new sap.ui.model.json.JSONModel();
						e.setData(h);
						pgSelectDialog.setModel(e);
						pgSelectDialog.setGrowingThreshold(h.results.length);
						pgSelectDialog.bindAggregation("items", "/results", I);
					} else {
						pgSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
					}
				}
			});
			pgSelectDialog.open();
		},

		onStatusVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getModel("tlDetailModel");
			var tData = tlDetailModel.getData();

			var settings = {
				title: this.getView().getModel("i18n").getProperty("STATUS"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/StatusVHSet",
					template: new sap.m.StandardListItem({
						title: "{PLNST}",
						description: "{TXT}"
					})
				},
				confirm: function (E) {
					tData.lHeader.Statu = E.getParameters().selectedItem.getProperty("title");
					tData.lHeader.statusDesc = E.getParameters().selectedItem.getProperty("description");
					tData.lHeader.statusVS = "None";
					tData.lHeader.statusVST = "";
					tlDetailModel.setData(tData);
					g.readHdrDefaults("status", tData);
				}
			};

			var q = "/StatusVHSet";
			var M = this.getView().getModel("valueHelp");
			var sSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "PLNST", "TXT");
			sSelectDialog.open();
		},

		onSysCondDtVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getView().getModel("tlDetailModel");

			var sySearchResults;
			if (sySearchResults === undefined) {
				var tData = tlDetailModel.getData();
				/*var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
				g.index = parseInt(sPath.substr(-1));*/

				var sySelectDialog = new sap.m.SelectDialog({
					title: this.getView().getModel("i18n").getProperty("SYS_CONDITION"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/SystemConditionSet",
						template: new sap.m.StandardListItem({
							title: "{ANLZU}",
							description: "{ANLZUX}"
						})
					},

					confirm: function (E) {
						tData.lHeader.Anlzu = E.getParameters().selectedItem.getProperty("title");
						tData.lHeader.sysCondDesc = E.getParameters().selectedItem.getProperty("description");
						tData.lHeader.sysCondValueState = "None";
						tlDetailModel.setData(tData);
					},
					search: function (E) {
						var v = E.getParameter("value").toUpperCase();
						v = v.replace(/^[ ]+|[ ]+$/g, '');
						var h = g.sySelectDialog.getItems();
						for (var i = 0; i < h.length; i++) {
							if (v.length > 0) {
								var s = h[i].getBindingContext().getProperty("ANLZU");
								var j = h[i].getBindingContext().getProperty("ANLZUX");
								if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
									h[i].setVisible(false);
								} else {
									h[i].setVisible(true);
								}
							} else {
								h[i].setVisible(true);
							}
						}
					},
					liveChange: function (E) {
						var v = E.getParameter("value").toUpperCase();
						v = v.replace(/^[ ]+|[ ]+$/g, '');
						var h = g.sySelectDialog.getItems();
						for (var i = 0; i < h.length; i++) {
							if (v.length > 0) {
								var s = h[i].getBindingContext().getProperty("ANLZU");
								var j = h[i].getBindingContext().getProperty("ANLZUX");
								if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
									h[i].setVisible(false);
								} else {
									h[i].setVisible(true);
								}
							} else {
								h[i].setVisible(true);
							}
						}
					}
				});
				var q = "/SystemConditionSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							sySearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{ANLZU}",
								description: "{ANLZUX}"

							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							sySelectDialog.setModel(e);
							sySelectDialog.setGrowingThreshold(h.results.length);
							sySelectDialog.bindAggregation("items", "/results", I);
						} else {
							sySelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(sySearchResults);
				sySelectDialog.setModel(e);
				var I = sySelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			sySelectDialog.open();
		},

		onStrategyVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var tData = tlDetailModel.getData();
			var settings = {
				title: this.getView().getModel("i18n").getProperty("STRAT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>STRATEGY}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>DESCRIPTION}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>SCH_IND}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>UNIT}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>FACT_CAL}"
							})
						]
					})
				],
				items: {
					path: "/StrategyVHSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Strat}"
							}),
							new sap.m.Text({
								text: "{Ktext}"
							}),
							new sap.m.Text({
								text: "{Termk}"
							}),
							new sap.m.Text({
								text: "{Zeieh}"
							}),
							new sap.m.Text({
								text: "{Fabkl}"
							})
						]
					})
				},
				confirm: function (E) {
					tData.lHeader.Strat = E.getParameter("selectedItem").getCells()[0].getText();
					tData.lHeader.stratDesc = E.getParameter("selectedItem").getCells()[1].getText();
					tData.lHeader.maintStrValueState = "None";
					tlDetailModel.setData(tData);

					g.getView().byId("idTabMaintPckg").setVisible(true);
					g.readMaintPckgConfig(tData.lHeader.Strat);
				}
			};
			var q = "/StrategyVHSet";
			var oFilter = [];
			var M = this.getView().getModel("valueHelp");
			var cells = [
				new sap.m.Text({
					text: "{Strat}"
				}),
				new sap.m.Text({
					text: "{Ktext}"
				}),
				new sap.m.Text({
					text: "{Termk}"
				}),
				new sap.m.Text({
					text: "{Zeieh}"
				}),
				new sap.m.Text({
					text: "{Fabkl}"
				})
			];

			var strSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilter, settings, "Strat", "Ktext");
			strSelectDialog.open();
			strSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onAssemblyVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getModel("tlDetailModel");
			var tData = tlDetailModel.getData();
			// var compData = tlDetailModel.getData();
			// var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			// g.index = parseInt(sPath.substr(-1));

			var asmblySelectDialog = new sap.m.TableSelectDialog({
				title: this.getView().getModel("i18n").getProperty("Assembly"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				growing: true,
				growingThreshold: 20,
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>DESCRIPTION}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>LANGUAGE}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>MAT}"
							})
						]
					})
				],
				items: {
					path: "/MaterialVH_PRTSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Maktg}"
							}),
							new sap.m.Text({
								text: "{Spras}"
							}),
							new sap.m.Text({
								text: "{Matnr}"
							})
						]
					})

				},

				confirm: function (E) {
					tData.lHeader.assmbly = E.getParameter("selectedItem").getCells()[2].getText();
					tData.lHeader.assmblyDesc = E.getParameter("selectedItem").getCells()[0].getText();
					tData.lHeader.assemblyValueState = "None";
					tlDetailModel.setData(tData);
				},
				liveChange: function (E) {
					var v = E.getParameter("value").toUpperCase();
					v = v.replace(/^[ ]+|[ ]+$/g, '');
					var h = asmblySelectDialog.getItems();
					for (var i = 0; i < h.length; i++) {
						if (v.length > 0) {
							var s = h[i].getBindingContext().getProperty("Maktg");
							var j = h[i].getBindingContext().getProperty("Matnr");
							if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
								h[i].setVisible(false);
							} else {
								h[i].setVisible(true);
							}
						} else {
							h[i].setVisible(true);
						}
					}
				}
			});
			var M = this.getView().getModel("valueHelp");
			asmblySelectDialog.setModel(M);
			asmblySelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			asmblySelectDialog.open();
		},

		// onAssemblyVH: function (oEvent) {
		// 	var g = this;
		// 	var tlDetailModel = this.getView().getModel("tlDetailModel");
		// 	var tData = tlDetailModel.getData();
		// 	var settings = {
		// 		title: this.getView().getModel("i18n").getProperty("Assembly"),
		// 		noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
		// 		growing: true,
		// 		growingThreshold: 20,
		// 		columns: [new sap.m.Column({
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>DESCRIPTION}"
		// 					})
		// 				]
		// 			}), new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>LANGUAGE}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>MAT}"
		// 					})
		// 				]
		// 			})
		// 		],
		// 		items: {
		// 			path: "/MaterialVH_PRTSet",
		// 			template: new sap.m.ColumnListItem({
		// 				type: "Active",
		// 				unread: false,
		// 				cells: [
		// 					new sap.m.Text({
		// 						text: "{Maktg}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Spras}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Matnr}"
		// 					})
		// 				]
		// 			})

		// 		},

		// 		confirm: function (E) {
		// 			tData.lHeader.assmbly = E.getParameter("selectedItem").getCells()[2].getText();
		// 			tData.lHeader.assmblyDesc = E.getParameter("selectedItem").getCells()[0].getText();
		// 			tData.lHeader.assemblyValueState = "None";
		// 			tlDetailModel.setData(tData);
		// 		},
		// 		liveChange: function (E) {
		// 			var v = E.getParameter("value").toUpperCase();
		// 			v = v.replace(/^[ ]+|[ ]+$/g, '');
		// 			var h = asmblySelectDialog.getItems();
		// 			for (var i = 0; i < h.length; i++) {
		// 				if (v.length > 0) {
		// 					var s = h[i].getBindingContext().getProperty("Maktg");
		// 					var j = h[i].getBindingContext().getProperty("Matnr");
		// 					if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
		// 						h[i].setVisible(false);
		// 					} else {
		// 						h[i].setVisible(true);
		// 					}
		// 				} else {
		// 					h[i].setVisible(true);
		// 				}
		// 			}
		// 		}
		// 	};
		// 	var q = "/MaterialVH_PRTSet";
		// 	var oFilters = [];
		// 	var M = this.getView().getModel("valueHelp");
		// 	var cells = [
		// 		new sap.m.Text({
		// 			text: "{Maktg}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Spras}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Matnr}"
		// 		})
		// 	];
		// 	var asmblySelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Matnr", "Maktg");
		// 	asmblySelectDialog.open();
		// 	asmblySelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		// },

		onQtyUnitVH: function (oEvent) {
			var g = this;
			/*var a;
			var P = p;
			a = this.getView().byId(p);*/
			var tlDetailModel = this.getModel("tlDetailModel");
			var md = new sap.ui.model.json.JSONModel();
			md = g.getView().byId("components").getModel("tlDetailModel");
			var compData = md.getData();
			// var compData = md.getProperty("/component");
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			g.index = parseInt(sPath.substr(-1));
			var settings = {
				title: this.getView().getModel("i18n").getProperty("U_QTY"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
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
				confirm: function (E) {
					compData.lComponent[g.index].qtyUnitState = "None";
					compData.lComponent[g.index].MeinsGcp = E.getParameter("selectedItem").getCells()[0].getText();
					//md.setData(compData);
					tlDetailModel.setData(compData);
				}
			};
			var q = "/QuantityUOMSet";
			var oFilters = [];
			var M = this.getView().getModel("valueHelp");
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

			var qSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Msehi", "Msehl");
			qSelectDialog.open();
			qSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onCtrlKeyVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getModel("tlDetailModel");
			var md = new sap.ui.model.json.JSONModel();
			md = g.getView().byId("operationTab").getModel("tlDetailModel");
			var opData = md.getData();
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			g.index = parseInt(sPath.substr(-1));

			var settings = {
				title: this.getView().getModel("i18n").getProperty("OP_CTRL_KEY"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/ControlKeySet",
					template: new sap.m.StandardListItem({
						title: "{Steus}",
						description: "{Txt}"
					})
				},
				confirm: function (E) {
					opData.lOperation[g.index].Steus = E.getParameters().selectedItem.getProperty("title");
					g.ctrlKey = E.getParameters().selectedItem.getProperty("title");
					opData.lOperation[g.index].ctrlKeyState = "None";
					tlDetailModel.setData(opData);

					if (opData.lOperation[g.index].Steus === "PM03" || opData.lOperation[g.index].Steus === "PM05") {
						tlDetailModel.getData().lHeader.bAddSrvOpOrvw = true;
					} else {
						tlDetailModel.getData().lHeader.bAddSrvOpOrvw = false;
					}
				}
			};

			var q = "/ControlKeySet";
			var M = this.getView().getModel("valueHelp");
			var aFilter = [new sap.ui.model.Filter({
				filters: [
					new sap.ui.model.Filter("Steus", "GE", "PM01"),
					new sap.ui.model.Filter("Steus", "LE", "PM05")
				],
				and: true
			})];
			var ctrSelectDialog = ValueHelpProvider.getSelectDialog(M, q, aFilter, settings, "Steus", "Txt");
			ctrSelectDialog.open();
		},

		onOpPlantVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getModel("tlDetailModel");
			var md = new sap.ui.model.json.JSONModel();
			md = g.getView().byId("operationTab").getModel("tlDetailModel");
			var opData = md.getData();
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			g.index = parseInt(sPath.substr(-1));
			var settings = {
				title: this.getView().getModel("i18n").getProperty("PLANT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>PLANT}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>SEARCHTERM2}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>SEARCHTERM1}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>POST_CODE}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>CITY}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>Name2}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>Name}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>ADDRESS}"
							})
						]
					})
				],
				items: {
					path: "/PlantVHSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Plant}"
							}),
							new sap.m.Text({
								text: "{SearchTerm2}"
							}),
							new sap.m.Text({
								text: "{SearchTerm1}"
							}),
							new sap.m.Text({
								text: "{PostalCode}"
							}),
							new sap.m.Text({
								text: "{City}"
							}),
							new sap.m.Text({
								text: "{Name2}"
							}),
							new sap.m.Text({
								text: "{Name}"
							}),
							new sap.m.Text({
								text: "{AddrVersion}"
							})
						]
					})

				},
				confirm: function (E) {
					opData.lOperation[g.index].plantState = "None";
					opData.lOperation[g.index].Werks = E.getParameter("selectedItem").getCells()[0].getText();
					/*md.setData(opData);
					g.getView().byId("operationTab").setModel(md, "tlDetailModel");*/
					tlDetailModel.setData(opData);
				}
			};
			var q = "/PlantVHSet";
			var oFilters = [];
			var M = this.getView().getModel("valueHelp");
			var cells = [
				new sap.m.Text({
					text: "{Plant}"
				}),
				new sap.m.Text({
					text: "{SearchTerm2}"
				}),
				new sap.m.Text({
					text: "{SearchTerm1}"
				}),
				new sap.m.Text({
					text: "{PostalCode}"
				}),
				new sap.m.Text({
					text: "{City}"
				}),
				new sap.m.Text({
					text: "{Name2}"
				}),
				new sap.m.Text({
					text: "{Name}"
				}),
				new sap.m.Text({
					text: "{AddrVersion}"
				})
			];

			var wcpSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Plant", "Name");
			wcpSelectDialog.open();
			wcpSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onWCVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var opData = tlDetailModel.getData();
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			g.index = parseInt(sPath.substr(-1));
			var hdData = tlDetailModel.getData();
			var pp = hdData.lHeader.Iwerk;
			var wctabSearchResults;
			if (wctabSearchResults === undefined) {

				var wctabSelectDialog = new sap.m.TableSelectDialog({
					title: this.getView().getModel("i18n").getProperty("WC"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "Work Center Category"
								})
							]
						}), new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Plant"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Work Center"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Description"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							header: [
								new sap.m.Text({
									text: "Language"
								})
							]
						}),

						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "Control Key"
								})
							]
						})
					],
					items: {
						path: "/WorkCenterVHSet?$filter= Werks eq '" + pp + "'",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Verwe}"
								}),
								new sap.m.Text({
									text: "{Werks}"
								}),
								new sap.m.Text({
									text: "{Arbpl}"
								}),
								new sap.m.Text({
									text: "{Ktext}"
								}),
								new sap.m.Text({
									text: "{Spras}"
								}),
								new sap.m.Text({
									text: "{Steus}"
								})
							]
						})
					},
					confirm: function (E) {
						opData.lOperation[g.index].wcState = "None";
						opData.lOperation[g.index].Arbpl = E.getParameter("selectedItem").getCells()[2].getText();
						opData.lOperation[g.index].Steus = E.getParameter("selectedItem").getCells()[5].getText();
						opData.lOperation[g.index].Larnt = E.getParameter("selectedItem").getBindingContext().getObject().Lar01;
						g.ctrlKey = E.getParameter("selectedItem").getCells()[5].getText();
						tlDetailModel.setData(opData);
						g.getView().byId("operationTab").setModel(tlDetailModel, "tlDetailModel");
						g.WCPPCheck(E.getParameter("selectedItem").getCells()[1].getText());
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Ktext", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				if (pp === null || pp === "") {
					var q = "/WorkCenterVHSet";
					var oFilter = [];
				} else {
					//var q = "/WorkCenterSet?$filter= Werks eq '" + pp + "'";
					var q = "/WorkCenterVHSet";
					var oFilter = [new sap.ui.model.Filter("Werks", "EQ", pp)];
				}
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					filters: oFilter,
					success: function (h, E) {
						if (h.results.length > 0) {
							var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
							if (oModelData.length > 0) {
								for (var i = 0; i < oModelData.length; i++) {
									if (oModelData[i].wc) {
										var sObj = {
											Verwe: oModelData[i].wcCat,
											Werks: oModelData[i].plant,
											Arbpl: oModelData[i].wc,
											Ktext: oModelData[i].wcDesc,
											Spras: h.results[0].Spras
										};
										h.results.unshift(sObj);
									}
								}
							}
							wctabSearchResults = h;
							var I = new sap.m.ColumnListItem({
								type: "Active",
								unread: false,
								cells: [
									new sap.m.Text({
										text: "{Verwe}"
									}),
									new sap.m.Text({
										text: "{Werks}"
									}),
									new sap.m.Text({
										text: "{Arbpl}"
									}),
									new sap.m.Text({
										text: "{Ktext}"
									}),
									new sap.m.Text({
										text: "{Spras}"
									}),
									new sap.m.Text({
										text: "{Steus}"
									})
								]
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							wctabSelectDialog.setModel(e);
							// wctabSelectDialog.setGrowingThreshold(h.results.length);
							wctabSelectDialog.bindAggregation("items", "/results", I);
						} else {
							wctabSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(wctabSearchResults);
				wctabSelectDialog.setModel(e);
				var I = wctabSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			wctabSelectDialog.open();
		},

		onMaterialVH: function (oEvent) {
			var g = this;
			var tlDetailModel = this.getModel("tlDetailModel");
			var compData = tlDetailModel.getData();
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			g.index = parseInt(sPath.substr(-1));

			var matSelectDialog = new sap.m.TableSelectDialog({
				title: this.getView().getModel("i18n").getProperty("COMPO"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [
					new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>DESCRIPTION}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>LANGUAGE}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>MAT}"
							})
						]
					})
				],
				growing: true,
				growingThreshold: 30,
				items: {
					path: "/MaterialVH_PRTSet?$skip=0&$top=30",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Maktg}"
							}),
							new sap.m.Text({
								text: "{Spras}"
							}),
							new sap.m.Text({
								text: "{Matnr}"
							})
						]
					})
				},
				confirm: function (E) {
					compData.lComponent[g.index].matState = "None";
					compData.lComponent[g.index].Idnrk = E.getParameter("selectedItem").getCells()[2].getText();
					compData.lComponent[g.index].matDesc = E.getParameter("selectedItem").getCells()[0].getText();
					var mat = E.getParameter("selectedItem").getCells()[2].getText();
					var plant = compData.lHeader.Iwerk;
					var details = g.deriveMatDetails(mat, plant);
					/*if (details.length > 0) {
						compData.component[g.index].Menge = details[0].Menge;
						compData.component[g.index].MeinsGcp = details[0].Meins;
						compData.component[g.index].Postp = details[0].Postp;
					}*/
					//md.setData(compData);
					tlDetailModel.setData(compData);
					g.getView().setModel(tlDetailModel, "tlDetailModel");
				}
			});
			var M = this.getView().getModel("valueHelp");
			matSelectDialog.setModel(M);
			matSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			matSelectDialog.open();
		},

		// onMaterialVH: function (oEvent) {
		// 	var g = this;
		// 	/*var a;
		// 	var P = p;
		// 	a = this.getView().byId(p);*/
		// 	var tlDetailModel = this.getModel("tlDetailModel");
		// 	/*var md = new sap.ui.model.json.JSONModel();
		// 	md = g.getView().byId("components").getModel("tlDetailModel");*/
		// 	var compData = tlDetailModel.getData();
		// 	var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
		// 	g.index = parseInt(sPath.substr(-1));
		// 	// var headerData = this.getView().getModel("tlDetailModel").getData();
		// 	// var hLength = headerData.header.length;
		// 	var settings = {
		// 		title: this.getView().getModel("i18n").getProperty("COMPO"),
		// 		noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
		// 		columns: [
		// 			new sap.m.Column({
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>DESCRIPTION}"
		// 					})
		// 				]
		// 			}), new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>LANGUAGE}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>MAT}"
		// 					})
		// 				]
		// 			})
		// 		],
		// 		items: {
		// 			path: "/MaterialVH_PRTSet",
		// 			template: new sap.m.ColumnListItem({
		// 				type: "Active",
		// 				unread: false,
		// 				cells: [
		// 					new sap.m.Text({
		// 						text: "{Maktg}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Spras}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Matnr}"
		// 					})
		// 				]
		// 			})
		// 		},
		// 		confirm: function (E) {
		// 			compData.lComponent[g.index].matState = "None";
		// 			compData.lComponent[g.index].Idnrk = E.getParameter("selectedItem").getCells()[2].getText();
		// 			compData.lComponent[g.index].matDesc = E.getParameter("selectedItem").getCells()[0].getText();
		// 			var mat = E.getParameter("selectedItem").getCells()[2].getText();
		// 			var plant = compData.lHeader.Iwerk;
		// 			var details = g.deriveMatDetails(mat, plant);
		// 			/*if (details.length > 0) {
		// 				compData.component[g.index].Menge = details[0].Menge;
		// 				compData.component[g.index].MeinsGcp = details[0].Meins;
		// 				compData.component[g.index].Postp = details[0].Postp;
		// 			}*/
		// 			//md.setData(compData);
		// 			tlDetailModel.setData(compData);
		// 			g.getView().setModel(tlDetailModel, "tlDetailModel");
		// 		}
		// 	};
		// 	var q = "/MaterialVH_PRTSet";
		// 	var oFilters = [];
		// 	var M = this.getView().getModel("valueHelp");
		// 	var cells = [
		// 		new sap.m.Text({
		// 			text: "{Maktg}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Spras}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Matnr}"
		// 		})
		// 	];

		// 	var matSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Matnr", "Maktg");
		// 	matSelectDialog.open();
		// 	matSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		// },

		onItCatVH: function (oEvent) {
			var g = this;
			/*var a;
			var P = p;
			a = this.getView().byId(p);*/
			var tlDetailModel = this.getModel("tlDetailModel");
			var md = new sap.ui.model.json.JSONModel();
			md = g.getView().byId("components").getModel("tlDetailModel");
			var compData = md.getData();
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			g.index = parseInt(sPath.substr(-1));
			var catSearchResults;
			if (catSearchResults === undefined) {

				var catSelectDialog = new sap.m.SelectDialog({
					title: this.getView().getModel("i18n").getProperty("CYCLE_UNIT_TXT"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/BOMItmCatVHSet",
						template: new sap.m.StandardListItem({
							title: "{Postp}",
							description: "{Ptext}"
						})
					},
					confirm: function (E) {
						compData.lComponent[g.index].Postp = E.getParameters().selectedItem.getProperty("title");
						compData.lComponent[g.index].categoryState = "None";
						//md.setData(compData);
						g.maintCycle.setModel(null, md);
						tlDetailModel.setData(compData);
					},
					search: function (E) {
						var v = E.getParameter("value").toUpperCase();
						v = v.replace(/^[ ]+|[ ]+$/g, '');
						var h = catSelectDialog.getItems();
						for (var i = 0; i < h.length; i++) {
							if (v.length > 0) {
								var s = h[i].getBindingContext().getProperty("Postp");
								var j = h[i].getBindingContext().getProperty("Ptext");
								if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
									h[i].setVisible(false);
								} else {
									h[i].setVisible(true);
								}
							} else {
								h[i].setVisible(true);
							}
						}
					},
					liveChange: function (E) {
						var v = E.getParameter("value").toUpperCase();
						v = v.replace(/^[ ]+|[ ]+$/g, '');
						var h = catSelectDialog.getItems();
						for (var i = 0; i < h.length; i++) {
							if (v.length > 0) {
								var s = h[i].getBindingContext().getProperty("Postp");
								var j = h[i].getBindingContext().getProperty("Ptext");
								if (s.toUpperCase().indexOf(v) === -1 && j.toUpperCase().indexOf(v) === -1) {
									h[i].setVisible(false);
								} else {
									h[i].setVisible(true);
								}
							} else {
								h[i].setVisible(true);
							}
						}
					}
				});
				var q = "/BOMItmCatVHSet";

				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							catSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{Postp}",
								description: "{Ptext}"
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							catSelectDialog.setModel(e);
							// catSelectDialog.setGrowingThreshold(h.results.length);
							catSelectDialog.bindAggregation("items", "/results", I);
						} else {
							catSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(catSearchResults);
				catSelectDialog.setModel(e);
				var I = catSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			catSelectDialog.open();
		},

		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		onDateChange: function () {
			var d = this.getView().byId("keyDate");
			if (d.getValue() !== "") {
				d.setValueState("None");
			}
		},

		// On Change
		onTLChange: function (oEvent) {
			var value = oEvent.getSource().getValue();
			var bindingPath;
			var tInput = oEvent.getSource().mBindingInfos.value.binding;
			if (tInput !== undefined && tInput !== null) {
				bindingPath = tInput.sPath;
			} else {
				bindingPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
			}
			var bindingVal = bindingPath.split("/");
			if (bindingVal.length > 1) {
				bindingPath = bindingVal[bindingVal.length - 1];
			}
			// bindingPath = bindingPath.substring(1);
			switch (bindingPath) {
			case "equipment":
				this._equipment(value, oEvent);
				break;
			case "floc":
				this._functionalLocation(value, oEvent);
				break;
			case "Iwerk":
				this._planPlant(value, oEvent);
				break;
			case "wc":
				this._workCenter(value, oEvent);
				break;
			case "plant":
				this._plant(value, oEvent);
				break;
			case "tlusg":
				this._usage(value, oEvent);
				break;
			case "Vagrp":
				this._plannerGrp(value, oEvent);
				break;
			case "Statu":
				this._status(value, oEvent);
				break;
			case "Anlzu":
				this._sysCond(value, oEvent);
				break;
			case "Strat":
				this._maintStrat(value, oEvent);
				break;
			case "assmbly":
				this._assmbly(value, oEvent);
				break;
			}
		},

		_equipment: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//Check for staging data
				var stagingFlag = false;
				var stagingEquipments = [];
				var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						var sObj = {};
						if (oModelData[i].Equnr) {
							sObj = {
								Equnr: oModelData[i].Equnr,
								Eqktx: oModelData[i].Eqktx
							};
							stagingEquipments.push(sObj);
						}
					}

					for (var j = 0; j < stagingEquipments.length; j++) {
						if (a === stagingEquipments[j].Equnr) {
							g.currentObj.lHeader.equipmentDesc = stagingEquipments[j].Eqktx;
							g.currentObj.lHeader.equipment = a;
							g.currentObj.lHeader.bAddHeader = true;
							tlDetailModel.setData(g.currentObj);

							stagingFlag = true;
						}
					}
				}
				//Not found in staging data; Make a read call
				if (!stagingFlag) {
					var m = this.getView().getModel("valueHelp");
					var q = "/EquipmentNumberSet";
					var oFilter = [new sap.ui.model.Filter("Equnr", "EQ", c)];
					m.read(q, {
						filters: oFilter,
						success: function (d, e) {
							if (d.results.length > 0) {
								/*cd.setValue(d.results[0].Eqktx);
								f.setValue(a);*/
								g.currentObj.lHeader.equipmentDesc = d.results[0].Eqktx;
								g.currentObj.lHeader.equipment = a;
								g.currentObj.lHeader.bAddHeader = true;
								tlDetailModel.setData(g.currentObj);
							} else {
								g.currentObj.lHeader.equiValueState = "Error";
								g.currentObj.lHeader.equipmentDesc = "";
								g.currentObj.lHeader.equiValueStateTxt = "Invalid Entry";
								tlDetailModel.setData(g.currentObj);
							}
						},
						error: function (err) {
							// f.setValueState("Error");
							g.currentObj.lHeader.equiValueStateTxt = "Error";
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
							g.showMessage(value);
							g.currentObj.lHeader.equiEnb = "true";
							tlDetailModel.setData(g.currentObj);
						}
					});
				} else {
					g.currentObj.lHeader.equipment = a;
					tlDetailModel.setData(g.currentObj);
				}
			}
		},

		_functionalLocation: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getModel("tlDetailModel");
			// var cd = this.getView().byId("flocDesc");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//Check for staging data
				var stagingFlag = false;
				var stagingFlocs = [];
				var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						var sObj = {};
						if (oModelData[i].Functionallocation) {
							sObj = {
								Tplnr: oModelData[i].Functionallocation,
								Pltxt: oModelData[i].Flocdescription
							};
							stagingFlocs.push(sObj);
						}
					}

					for (var j = 0; j < stagingFlocs.length; j++) {
						if (a === stagingFlocs[j].Tplnr) {
							g.currentObj.lHeader.flocDesc = stagingFlocs[j].Pltxt;
							g.currentObj.lHeader.floc = a;
							g.currentObj.lHeader.bAddHeader = true;
							tlDetailModel.setData(g.currentObj);

							stagingFlag = true;
						}
					}
				}
				//Not found in staging data; Make a read call
				if (!stagingFlag) {
					var m = this.getView().getModel("valueHelp");
					var q = "/FunctionLocationSet";
					var oFilter = [new sap.ui.model.Filter("Tplnr", "EQ", c)];
					m.read(q, {
						filters: oFilter,
						success: function (d, e) {
							if (d.results.length > 0) {
								/*cd.setValue(d.results[0].PLTXT);
								f.setValue(a);
								g.getView().byId("newHeader").setEnabled(true);*/
								g.currentObj.lHeader.flocDesc = d.results[0].Pltxt;
								g.currentObj.lHeader.floc = a;
								g.currentObj.lHeader.bAddHeader = true;
								tlDetailModel.setData(g.currentObj);
							} else {
								/*f.setValueState("Error");
								cd.setValue();
								f.setValueStateText("Invalid Entry");*/
								g.currentObj.lHeader.flocValueState = "Error";
								g.currentObj.lHeader.flocDesc = "";
								g.currentObj.lHeader.flocValueStateTxt = "Invalid Entry";
								tlDetailModel.setData(g.currentObj);
							}
						},
						error: function (err) {
							// f.setValueState("Error");
							g.currentObj.lHeader.flocValueState = "Error";
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
							g.showMessage(value);
							// f.setEnabled(true);
							g.currentObj.lHeader.flocEnb = "true";
							tlDetailModel.setData(g.currentObj);
						}
					});
				} else {
					// f.setValue(a);
					g.currentObj.lHeader.floc = a;
					tlDetailModel.setData(g.currentObj);
				}
			}
		},

		_planPlant: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/PlanningPlantSet";
				var oFilter = new sap.ui.model.Filter("Werks", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.lHeader.pPlantDesc = d.results[0].Name1;
							g.currentObj.lHeader.Iwerk = a;
							tlDetailModel.setData(g.currentObj);
							// g.readHdrDefaults("planningPlant", g.index, g.currentObj);
						} else {
							g.currentObj.lHeader.planningPlantValueState = "Error";
							g.currentObj.lHeader.pPlantDesc = "";
							g.currentObj.lHeader.planningPlantValueStateTxt = "Invalid Entry";
							tlDetailModel.lHeader.setData(g.currentObj);
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						g.currentObj.lHeader.planningPlantValueState = "Error";
						g.currentObj.lHeader.planningPlantValueStateTxt = d;
						tlDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.lHeader.Iwerk = a;
				g.currentObj.lHeader.pPlantDesc = "";
				tlDetailModel.setData(g.currentObj);
			}
		},

		_workCenter: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/WorkCenterVHSet";
				var oFilter = new sap.ui.model.Filter("Arbpl", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				var lData = false;

				var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].wc === c) {
							g.currentObj.lHeader.wcDesc = oModelData[i].Ktext;
							g.currentObj.lHeader.wc = a;
							g.currentObj.lHeader.plant = oModelData[i].plant;
							tlDetailModel.setData(g.currentObj);
							lData = true;
						}
					}
				}

				if (lData === true) {
					return;
				} else {
					m.read(q, {
						filters: [oFilter],
						success: function (d) {
							if (d.results.length > 0) {
								g.currentObj.lHeader.wcDesc = d.results[0].Ktext;
								g.currentObj.lHeader.wc = a;
								g.currentObj.lHeader.plant = d.results[0].Werks;
								tlDetailModel.setData(g.currentObj);
								g.ActivityType = d.results[0].Lar01;
								g.WCPPCheckHeader();
							} else {
								g.currentObj.lHeader.wcValueState = "Error";
								g.currentObj.lHeader.wcDesc = "";
								g.currentObj.lHeader.plant = "";
								g.currentObj.lHeader.wcValueStateTxt = "Invalid Entry";
								g.ActivityType = "";
								tlDetailModel.setData(g.currentObj);
							}
						},
						error: function (err) {
							var b = JSON.parse(err.responseText);
							var d = b.error.message.value;
							g.currentObj.lHeader.wcValueState = "Error";
							g.currentObj.lHeader.wcValueStateTxt = d;
							tlDetailModel.setData(g.currentObj);
							g.ActivityType = "";
						}
					});
				}
			} else {
				g.currentObj.lHeader.wc = a;
				g.currentObj.lHeader.wcDesc = "";
				tlDetailModel.setData(g.currentObj);
				g.ActivityType = "";
			}
		},

		_plant: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/PlantVHSet";
				var oFilter = new sap.ui.model.Filter("Plant", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.lHeader.plantDesc = d.results[0].PlantName;
							g.currentObj.lHeader.plant = a;
							tlDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.lHeader.plantValueState = "Error";
							g.currentObj.lHeader.plantDesc = "";
							g.currentObj.lHeader.plantValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						g.currentObj.lHeader.plantValueState = "Error";
						g.currentObj.lHeader.plantValueStateTxt = d;
						tlDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.lHeader.plant = a;
				g.currentObj.lHeader.plantDesc = "";
				tlDetailModel.setData(g.currentObj);
			}
		},

		_usage: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/UsageVHSet";
				var oFilter = new sap.ui.model.Filter("VERWE", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.lHeader.usageDesc = d.results[0].TXT;
							g.currentObj.lHeader.tlusg = a;
							tlDetailModel.setData(g.currentObj);
							g.readHdrDefaults("usage", g.index, g.currentObj);
						} else {
							g.currentObj.lHeader.usgValueState = "Error";
							g.currentObj.lHeader.usageDesc = "";
							g.currentObj.lHeader.usgValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						g.currentObj.lHeader.usgValueState = "Error";
						g.currentObj.lHeader.usgValueStateTxt = d;
						tlDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.lHeader.tlusg = a;
				g.currentObj.lHeader.usageDesc = "";
				tlDetailModel.setData(g.currentObj);
			}
		},

		_plannerGrp: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var tData = tlDetailModel.getData();
			var plantVal = tData.lHeader.Iwerk;
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/PlannerGroupTLSet";
				var oFilter = [new sap.ui.model.Filter("Ingrp", "EQ", c),
					new sap.ui.model.Filter("Iwerk", "EQ", plantVal)
				];
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.lHeader.plGrpDesc = d.results[0].Innam;
							g.currentObj.lHeader.Vagrp = a;
							tlDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.lHeader.plGrpValueState = "Error";
							g.currentObj.lHeader.plGrpDesc = "";
							g.currentObj.lHeader.plGrpValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						g.currentObj.lHeader.plGrpValueState = "Error";
						g.currentObj.lHeader.plGrpValueStateTxt = d;
						tlDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.lHeader.Vagrp = a;
				g.currentObj.lHeader.plGrpDesc = "";
				tlDetailModel.setData(g.currentObj);
			}
		},

		_status: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/StatusVHSet";
				var oFilter = new sap.ui.model.Filter("PLNST", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.lHeader.statusDesc = d.results[0].TXT;
							g.currentObj.lHeader.Statu = a;
							tlDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.lHeader.statusVS = "Error";
							g.currentObj.lHeader.statusDesc = "";
							g.currentObj.lHeader.statusVST = "Invalid Entry";
							tlDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						g.currentObj.lHeader.statusVS = "Error";
						g.currentObj.lHeader.statusVST = d;
						tlDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.lHeader.Statu = a;
				g.currentObj.lHeader.statusDesc = "";
				tlDetailModel.setData(g.currentObj);
			}
		},

		_sysCond: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/SystemConditionSet";
				var oFilter = new sap.ui.model.Filter("ANLZU", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.lHeader.sysCondDesc = d.results[0].ANLZUX;
							g.currentObj.lHeader.Anlzu = a;
							tlDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.lHeader.sysCondValueState = "Error";
							g.currentObj.lHeader.sysCondDesc = "";
							g.currentObj.lHeader.sysCondValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						g.currentObj.lHeader.sysCondValueState = "Error";
						g.currentObj.lHeader.sysCondValueStateTxt = d;
						tlDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.lHeader.Anlzu = a;
				g.currentObj.lHeader.sysCondDesc = "";
				tlDetailModel.setData(g.currentObj);
			}
		},

		_maintStrat: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/StrategyVHSet";
				var oFilter = new sap.ui.model.Filter("Strat", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.lHeader.stratDesc = d.results[0].Ktext;
							g.currentObj.lHeader.Strat = a;
							tlDetailModel.setData(g.currentObj);

							g.getView().byId("idTabMaintPckg").setVisible(true);
							g.readMaintPckgConfig(g.currentObj.lHeader.Strat);
						} else {
							g.currentObj.lHeader.maintStrValueState = "Error";
							g.currentObj.lHeader.stratDesc = "";
							g.currentObj.lHeader.maintStrValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.currentObj);
							g.getView().byId("idTabMaintPckg").setVisible(false);
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						g.currentObj.lHeader.maintStrValueState = "Error";
						g.currentObj.lHeader.maintStrValueStateTxt = d;
						tlDetailModel.setData(g.currentObj);
						g.getView().byId("idTabMaintPckg").setVisible(false);
					}
				});
			} else {
				g.currentObj.lHeader.Strat = a;
				g.currentObj.lHeader.maintStrValueState = "None";
				g.currentObj.lHeader.stratDesc = "";
				tlDetailModel.setData(g.currentObj);
				g.getView().byId("idTabMaintPckg").setVisible(false);
			}
		},

		_assmbly: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/MaterialVH_PRTSet";
				var oFilter = new sap.ui.model.Filter("Matnr", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d) {
						if (d.results.length > 0) {
							g.currentObj.lHeader.assmblyDesc = d.results[0].Maktg;
							g.currentObj.lHeader.assmbly = a;
							tlDetailModel.setData(g.currentObj);
						} else {
							g.currentObj.lHeader.assemblyValueState = "Error";
							g.currentObj.lHeader.assmblyDesc = "";
							g.currentObj.lHeader.assemblyValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.currentObj);
						}
					},
					error: function (err) {
						var b = JSON.parse(err.responseText);
						var d = b.error.message.value;
						g.currentObj.lHeader.assemblyValueState = "Error";
						g.currentObj.lHeader.assemblyValueStateTxt = d;
						tlDetailModel.setData(g.currentObj);
					}
				});
			} else {
				g.currentObj.lHeader.assmbly = a;
				g.currentObj.lHeader.assmblyDesc = "";
				tlDetailModel.setData(g.currentObj);
			}
		},

		onHeaderChange: function (oEvent) {
			var md = this.getView().getModel("tlDetailModel");
			// var tlDetailModel = this.getModel("tlDetailModel");
			var hData = md.getData();
			// var link = oEvent.getSource();
			// var iD = link.sId;
			var sProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var value = oEvent.getParameters().newValue;
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			var index = parseInt(sPath.substr(-1));
			var g = this;
			var m = this.getView().getModel("valueHelp");
			if (sProperty === "Iwerk") {
				if (value !== "") {
					var c = value.toUpperCase();
					var q = "/PlantVHSet";
					var oFilter = [new sap.ui.model.Filter("WERKS", "EQ", c)];
					m.read(q, {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								hData.header[index].valueStatePP = "None";
								hData.header[index].Iwerk = c;
								hData.header[index].pPlantDesc = r.results[0].NAME1;
								// tlDetailModel.setData(hData);
								g.readHdrDefaults("planningPlant", index, hData);
							} else {
								hData.header[index].valueStatePP = "Error";
								md.setData(hData);
								// tlDetailModel.setData(hData);
								g.getView().setModel(md, "tlDetailModel");
							}
						},
						error: function (err) {
							hData.header[index].valueStatePP = "Error";
							md.setData(hData);
							g.getView().setModel(md, "tlDetailModel");
						}
					});
				} else {
					hData.header[index].valueStatePP = "Error";
					md.setData(hData);
					this.getView().setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "Statu") {
				if (value !== "") {
					c = value.toUpperCase();
					var q = "/StatusVHSet";
					var oFilter = [new sap.ui.model.Filter("PLNST", "EQ", c)];
					m.read(q, {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								hData.header[index].valueStateS = "None";
								hData.header[index].Statu = c;
								hData.header[index].statusDesc = r.results[0].TXT;
								g.readHdrDefaults("status", index, hData);
							} else {
								hData.header[index].valueStateS = "Error";
								md.setData(hData);
								g.getView().setModel(md, "tlDetailModel");
							}
						},
						error: function (err) {
							hData.header[index].valueStateS = "Error";
							md.setData(hData);
							g.getView().setModel(md, "tlDetailModel");
						}
					});
				} else {
					hData.header[index].valueStateS = "Error";
					this.getView().setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "Verwe") {
				if (value !== "") {
					c = value.toUpperCase();
					var q = "/UsageVHSet";
					var oFilter = [new sap.ui.model.Filter("VERWE", "EQ", c)];
					m.read(q, {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								hData.header[index].valueStateU = "None";
								hData.header[index].Verwe = c;
								hData.header[index].usageDesc = r.results[0].TXT;
								g.readHdrDefaults("usage", index, hData);
							} else {
								hData.header[index].valueStateU = "Error";
								md.setData(hData);
								g.getView().setModel(md, "tlDetailModel");
							}
						},
						error: function (err) {
							hData.header[index].valueStateU = "Error";
							md.setData(hData);
							g.getView().setModel(md, "tlDetailModel");
						}
					});
				} else {
					hData.header[index].valueStateU = "Error";
					this.getView().setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "Ktext") {
				if (value !== "") {
					hData.header[index].valueStateT = "None";
					hData.header[index].Ktext = value;
					g.readHdrDefaults("tlDesc", index, hData);
				} else {
					hData.header[index].valueStateT = "Error";
					this.getView().setModel(md, "tlDetailModel");
					// this.getView().byId("taskListHeaderOverview").bindItems("headerView>/", items);
				}
			}
		},

		onOperationChange: function (oEvent) { // var items = this.getView().byId("tasklistTab");
			var md = this.getView().byId("operationTab").getModel("tlDetailModel");
			var opData = md.getData();
			var sProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var value = oEvent.getParameters().newValue;
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			var index = parseInt(sPath.substr(-1));
			var g = this;
			var hdt = g.getView().getModel("tlDetailModel");
			var hdData = hdt.getData();
			var pp = hdData.lHeader.Iwerk;
			var m = this.getView().getModel("valueHelp");
			if (sProperty === "Vornr") {
				if (value !== "") {
					// var c = value.toUpperCase();
					opData.lOperation[index].opState = "None";
					opData.lOperation[index].Vornr = value;
					md.setData(opData);
					g.getView().byId("operationTab").setModel(md, "tlDetailModel");
				} else {
					opData.lOperation[index].opState = "Error";
					md.setData(opData);
					this.getView().byId("operationTab").setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "Ltxa1") {
				if (value !== "") {
					opData.lOperation[index].opDescState = "None";
					opData.lOperation[index].Ltxa1 = value;
					if (opData.lMaintPckg.length > 0) {
						opData.lMaintPckg[index].Ltxa1 = value;
					}
					md.setData(opData);
					g.getView().byId("operationTab").setModel(md, "tlDetailModel");
				} else {
					opData.lOperation[index].opDescState = "Error";
					if (opData.lMaintPckg.length > 0) {
						opData.lMaintPckg[index].Ltxa1 = "";
					}
					md.setData(opData);
					this.getView().byId("operationTab").setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "Arbpl") {
				if (value !== "") {
					var c = value.toUpperCase();
					if (pp === null || pp === "") {
						var q = "/WorkCenterVHSet";
						var oFilter = [new sap.ui.model.Filter("Arbpl", "EQ", c)];
					} else {
						var q = "/WorkCenterVHSet";
						var oFilter = [new sap.ui.model.Filter("Arbpl", "EQ", c),
							new sap.ui.model.Filter("Werks", "EQ", pp)
						];
					}
					var lData = false;
					var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].wc === c) {
								opData.lOperation[index].Arbpl = oModelData[i].wc;
								opData.lOperation[index].Steus = oModelData[i].ctrlKey;
								g.ctrlKey = oModelData[i].ctrlKey;
								opData.lOperation[index].wcState = "None";
								md.setData(opData);
								g.getView().byId("operationTab").setModel(md, "tlDetailModel");
								g.WCPPCheck(oModelData[i].Werks);
								lData = true;
							}
						}
					}

					if (lData === true) {
						return;
					} else {
						m.read(q, {
							filters: oFilter,
							success: function (r) {
								if (r.results.length > 0) {
									opData.lOperation[index].Arbpl = r.results[0].Arbpl;
									opData.lOperation[index].Steus = r.results[0].Steus;
									opData.lOperation[index].Larnt = r.results[0].Lar01;
									g.ctrlKey = r.results[0].Steus;
									opData.lOperation[index].Werks = r.results[0].Werks;
									opData.lOperation[index].wcState = "None";
									md.setData(opData);
									g.getView().byId("operationTab").setModel(md, "tlDetailModel");

									g.WCPPCheck(r.results[0].Werks);
								} else {
									opData.lOperation[index].wcState = "Error";
									md.setData(opData);
									g.getView().byId("operationTab").setModel(md, "tlDetailModel");
								}
							},
							error: function (err) {
								opData.lOperation[index].wcState = "Error";
								md.setData(opData);
								g.getView().byId("operationTab").setModel(md, "tlDetailModel");
								var b = JSON.parse(err.responseText);
								var d = b.error.message.value;
								if (d !== "" && d !== null && d !== undefined) {
									g.showMessage(d);
								}
							}
						});
					}
				} else {
					opData.lOperation[index].wcState = "Error";
					md.setData(opData);
					this.getView().byId("operationTab").setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "Werks") {
				if (value !== "") {
					c = value.toUpperCase();
					var q = "/PlanningPlantSet";
					var oFilter = [new sap.ui.model.Filter("Werks", "EQ", c)];
					m.read(q, {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								opData.lOperation[index].Werks = r.results[0].Werks;
								opData.lOperation[index].plantDesc = r.results[0].Name1;
								opData.lOperation[index].plantState = "None";
								md.setData(opData);
								g.getView().byId("operationTab").setModel(md, "tlDetailModel");
							} else {
								opData.lOperation[index].plantState = "Error";
								md.setData(opData);
								g.getView().byId("operationTab").setModel(md, "tlDetailModel");
							}
						},
						error: function (err) {
							opData.lOperation[index].plantState = "Error";
							md.setData(opData);
							g.getView().byId("operationTab").setModel(md, "tlDetailModel");
						}
					});
				} else {
					opData.lOperation[index].plantState = "Error";
					md.setData(opData);
					this.getView().byId("operationTab").setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "Steus") {
				if (value !== "") {
					c = value.toUpperCase();
					var M = this.getView().getModel("valueHelp");
					var q = "/ControlKeySet";
					var oFilter = [new sap.ui.model.Filter("Steus", "EQ", c)];
					// var oFilter = [new sap.ui.model.Filter({
					// 	filters: [
					// 		new sap.ui.model.Filter("Steus", "GE", "PM01"),
					// 		new sap.ui.model.Filter("Steus", "LE", "PM05"),
					// 		new sap.ui.model.Filter("Steus", "EQ", c)
					// 	],
					// 	and: true
					// })];
					M.read(q, {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								opData.lOperation[index].Steus = r.results[0].Steus;
								opData.lOperation[index].ctrlkeyDesc = r.results[0].Txt;
								opData.lOperation[index].ctrlKeyState = "None";
								g.ctrlKey = r.results[0].Steus;
								md.setData(opData);
								g.getView().byId("operationTab").setModel(md, "tlDetailModel");

								if (opData.lOperation[index].Steus === "PM03" || opData.lOperation[index].Steus === "PM05") {
									hdData.lHeader.bAddSrvOpOrvw = true;
								} else {
									hdData.lHeader.bAddSrvOpOrvw = false;
								}
								hdt.refresh();
							} else {
								opData.lOperation[index].ctrlKeyState = "Error";
								md.setData(opData);
								g.getView().byId("operationTab").setModel(md, "tlDetailModel");
							}
						},
						error: function (err) {
							opData.lOperation[index].ctrlKeyState = "Error";
							md.setData(opData);
							g.getView().byId("operationTab").setModel(md, "tlDetailModel");
						}
					});
				} else {
					opData.lOperation[index].ctrlKeyState = "Error";
					md.setData(opData);
					this.getView().byId("operationTab").setModel(md, "tlDetailModel");
				}
			}
		},

		WCPPCheck: function (WCPlant) {
			var g = this;
			var q;
			var M = this.getView().getModel();
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var opData = tlDetailModel.getData();
			q = "/WorkcentrePlantValSet(Werks='" + opData.lOperation[g.index].Werks + "',Tarbpl='" + opData.lOperation[g.index].Arbpl +
				"',Wcplant='" + WCPlant + "') ";

			M.read(q, {
				success: function (h) {
					opData.lOperation[g.index].wcState = "None";
					tlDetailModel.setData(opData);
					tlDetailModel.refresh();
				},
				error: function (err) {
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
					sap.m.MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {

						}
					});
					opData.lOperation[g.index].wcState = "Error";
					tlDetailModel.setData(opData);
					tlDetailModel.refresh();
				}
			});
		},

		onComponentChange: function (oEvent) {
			var md = this.getView().byId("components").getModel("tlDetailModel");
			var cData = md.getData();
			var sProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var value = oEvent.getParameters().newValue;
			var sPath = oEvent.getSource().getBindingContext("tlDetailModel").sPath;
			var index = parseInt(sPath.substr(-1));
			var g = this;
			var m = this.getView().getModel("valueHelp");
			var headerData = this.getView().getModel("tlDetailModel").getData();
			var hLength = headerData.header.length;
			var c;
			if (sProperty === "Idnrk") {
				if (value !== "") {
					c = value.toUpperCase();
					var q = "/MaterialVH_PRTSet";
					var oFilter = [new sap.ui.model.Filter("Matnr", "EQ", c)];
					m.read(q, {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								cData.lComponent[index].Idnrk = c;
								cData.lComponent[index].matDesc = r.results[0].Maktg;
								cData.lComponent[index].matState = "None";
								var mat = r.results[0].Matnr;
								var plant = cData.lHeader.Iwerk; //headerData[hLength - 1].Iwerk;
								g.index = index;
								var details = g.deriveMatDetails(mat, plant);
								/*if (details.length > 0) {
									cData.lComponent[index].Menge = details[0].Menge;
									cData.lComponent[index].MeinsGcp = details[0].Meins;
									cData.lComponent[index].Postp = details[0].Postp;
								}*/
								md.setData(cData);
								g.getView().byId("components").setModel(md, "tlDetailModel");
							} else {
								cData.lComponent[index].matState = "Error";
								md.setData(cData);
								g.getView().byId("components").setModel(md, "tlDetailModel");
							}
						},
						error: function (err) {
							cData.lComponent[index].matState = "Error";
							md.setData(cData);
							g.getView().byId("components").setModel(md, "tlDetailModel");
						}
					});
				} else {
					cData.lComponent[index].matState = "Error";
					md.setData(cData);
					this.getView().byId("components").setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "Menge") {
				if (value !== "") {
					cData.lComponent[index].qtyState = "None";
					cData.lComponent[index].Menge = value;
					md.setData(cData);
					g.getView().byId("components").setModel(md, "tlDetailModel");
				} else {
					cData.lComponent[index].qtyState = "Error";
					md.setData(cData);
					this.getView().byId("components").setModel(md, "tlDetailModel");
				}
			}
			if (sProperty === "MeinsGcp") {
				if (value !== "") {
					c = value.toUpperCase();
					var M = this.getView().getModel("valueHelp");
					var q = "/QuantityUOMSet";
					var oFilter = [new sap.ui.model.Filter("Mseh3", "EQ", c)];
					M.read(q, {
						filters: oFilter,
						success: function (r) {
							if (r.results.length > 0) {
								cData.lComponent[index].MeinsGcp = c;
								cData.lComponent[index].qtyUnitState = "None";
								md.setData(cData);
								g.getView().byId("components").setModel(md, "tlDetailModel");
							} else {
								cData.lComponent[index].qtyUnitState = "Error";
								md.setData(cData);
								g.getView().byId("components").setModel(md, "tlDetailModel");
							}
						},
						error: function (err) {
							cData.lComponent[index].qtyUnitState = "Error";
							md.setData(cData);
							g.getView().byId("components").setModel(md, "tlDetailModel");
						}
					});
				} else {
					cData.lComponent[index].qtyUnitState = "Error";
					md.setData(cData);
					this.getView().byId("components").setModel(md, "tlDetailModel");
				}
			}
		},

		tlOperationPress: function (oEvent) {
			this._showTlOperationDetail(oEvent.getSource());
		},
		_showTlOperationDetail: function (oItem) {
			var path = oItem.oBindingContexts.tlDetailModel.sPath;
			/*this.getRouter().navTo("tloperation", {
				itemPath: encodeURIComponent(path)
			});*/

			var index = path.split("/")[2];

			var oOpFlag = {
				opDetFlag: true,
				opIndex: index.toString()
			}
			sap.ui.getCore().setModel(oOpFlag, "oOpFlag");

			this.getRouter().navTo("tlOprDetail", {
				action: this.action,
				basicPath: encodeURIComponent(this.basicPath),
				mainPath: encodeURIComponent(this.mainPath),
				itemPath: encodeURIComponent(path),
				wc: " ",
				wcPlant: " ",
				ctrlKey: " ",
				mode: this.mode
			});
		},

		tlComponentPress: function (oEvent) {
			this.showComponentDetail(oEvent.getSource());
		},

		showComponentDetail: function (oItem) {
			var path = oItem.oBindingContexts.tlDetailModel.sPath;
			if (this.mode !== "display") {
				var sOpPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
				var opIndex = sOpPath.split("/")[2];
			} else {
				// var sOpPath = this.basicPath;
				var opIndex = path.split("/")[2];
			}

			var oOpFlag = {
				opDetFlag: true,
				opIndex: opIndex
			}
			sap.ui.getCore().setModel(oOpFlag, "oOpFlag");

			this.getRouter().navTo("tlComponent", {
				itemPath: encodeURIComponent(path),
				mode: this.mode
			});
		},

		// class and charactertistics code
		getObTab: function () {
			// var oJsonModel = sap.ui.getCore().getModel("EAMCRModel");
			var EAMCRModel = sap.ui.getCore().getModel("EAMCRModel");
			var EAMCRdata = EAMCRModel.getData();
			var sObTab = "";
			if (this.action.indexOf("GTL") > 0) {
				for (var a = 0; a < EAMCRdata.length; a++) {
					if (EAMCRdata[a].Obtab === "PLKO" && EAMCRdata[a].ObjLabel.indexOf("General Task List") > -1) {
						// // if (type === "type") {
						// pCRType = EAMCRdata[a].CRType;
						// // } else {
						sObTab = EAMCRdata[a].Obtab;
						// }
						break;
					}
				}
				// sObTab = oJsonModel.getProperty("/2").Obtab;
			} else if (this.action.indexOf("ETL") > 0) {
				for (var a = 0; a < EAMCRdata.length; a++) {
					if (EAMCRdata[a].Obtab === "PLKO" && EAMCRdata[a].ObjLabel.indexOf("Equipment Task List") > -1) {
						// // if (type === "type") {
						// pCRType = EAMCRdata[a].CRType;
						// // } else {
						sObTab = EAMCRdata[a].Obtab;
						// }
						break;
					}
				}
				// sObTab = oJsonModel.getProperty("/4").Obtab;
			} else if (this.action.indexOf("FTL") > 0) {
				for (var a = 0; a < EAMCRdata.length; a++) {
					if (EAMCRdata[a].Obtab === "PLKO" && EAMCRdata[a].ObjLabel.indexOf("Functional Location Task List") > -1) {
						// // if (type === "type") {
						// pCRType = EAMCRdata[a].CRType;
						// // } else {
						sObTab = EAMCRdata[a].Obtab;
						// }
						break;
					}
				}
				// sObTab = oJsonModel.getProperty("/3").Obtab;
			}

			return sObTab;
		},

		// attachRequest: function () {
		// 	var view = this._oView;
		// 	var that = this;
		// 	var classFragmentId = view.createId("clsFrag");
		// 	var type = sap.ui.core.Fragment.byId(classFragmentId, "type");
		// 	var fclass = sap.ui.core.Fragment.byId(classFragmentId, "class");
		// 	var status = sap.ui.core.Fragment.byId(classFragmentId, "status");
		// 	var itemFragmentId = view.createId("charFrag");
		// 	var charName = sap.ui.core.Fragment.byId(itemFragmentId, "charName");
		// 	var charValue = sap.ui.core.Fragment.byId(itemFragmentId, "charValue");
		// 	type.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	type.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	type.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	fclass.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	fclass.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	fclass.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	status.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	status.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	status.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	charName.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});
		// 	charName.attachChange(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	charName.attachSubmit(function (e) {
		// 		that.onChange(e);
		// 	});
		// 	charValue.attachValueHelpRequest(function (e) {
		// 		that.valueHelpSelect(e);
		// 	});

		// },
		attachRequest: function () {
			var classFragmentId = this.getView().createId("clsFrag");
			var itemFragmentId = this.getView().createId("charFrag");

			var vTypeClass = sap.ui.core.Fragment.byId(classFragmentId, "type");
			var vClass = sap.ui.core.Fragment.byId(classFragmentId, "class");
			var vStatus = sap.ui.core.Fragment.byId(classFragmentId, "status");
			var vCharName = sap.ui.core.Fragment.byId(itemFragmentId, "charName");
			var vCharValue = sap.ui.core.Fragment.byId(itemFragmentId, "charValue");
			var vCharAdd = sap.ui.core.Fragment.byId(itemFragmentId, "charValueAdd");
			var vCharClr = sap.ui.core.Fragment.byId(itemFragmentId, "charValueClear");
			var vCharDel = sap.ui.core.Fragment.byId(itemFragmentId, "charValueDelete");

			var that = this;
			// vTypeClass.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
			// vTypeClass.attachChange(function (e) {
			//            that.onChange(e);
			// });
			// vTypeClass.attachSubmit(function (e) {
			//            that.onChange(e);
			// });
			// vClass.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
			// vClass.attachChange(function (e) {
			//            that.onChange(e);
			// });
			// vClass.attachSubmit(function (e) {
			//            that.onChange(e);
			// });
			vCharAdd.attachPress(function (e) {
				ClassUtils.handleSelCharAdd(e);
			});
			vCharClr.attachPress(function (e) {
				ClassUtils.handleCharClear(e);
			});
			vCharDel.attachPress(function (e) {
				ClassUtils.charRowDeletePress(e);
			});
			vCharValue.attachChange(function (e) {
				that.onChange(e);
			});
			// vStatus.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
			// vStatus.attachChange(function (e) {
			//            that.onChange(e);
			// });
			// vStatus.attachSubmit(function (e) {
			//            that.onChange(e);
			// });
			// vCharName.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
			// vCharName.attachChange(function (e) {
			//            that.onChange(e);
			// });
			// vCharName.attachSubmit(function (e) {
			//            that.onChange(e);
			// });
			// vCharValue.attachValueHelpRequest(function (e) {
			//            that.valueHelpSelect(e);
			// });
		},

		valueHelpSelect: function (c) {
			var pObTab = this.getObTab();
			var id = c.getSource().getId().split("tskL--");
			id = id[1];

			if (c.getSource().getId().indexOf("type") > -1) {
				ClassUtils.valueHelpClassSelect("type", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("class") > -1) {
				ClassUtils.valueHelpClassSelect("class", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("status") > -1) {
				ClassUtils.valueHelpClassSelect("status", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charName") > -1) {
				ClassUtils.valueHelpCharSelect("charName", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charValue") > -1) {
				var sPath = c.getSource().getParent().getBindingContext().getPath();
				ClassUtils.valueHelpCharSelect("charValue", this, pObTab, c, sPath);
			}
		},

		onChange: function (c) {
			var pObTab = this.getObTab();
			var id = c.getSource().getId().split("tskL--");
			id = id[1];
			if (c.getSource().getId().indexOf("type") > -1) {
				ClassUtils.onClassChange("type", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("class") > -1) {
				ClassUtils.onClassChange("class", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("status") > -1) {
				ClassUtils.onClassChange("status", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charName") > -1) {
				ClassUtils.onCharChange("charName", this, c);
			} else if (c.getSource().getId().indexOf("charValue") > -1) {
				ClassUtils.onCharChange("charValue", this, c);
			}
		},

		onCharChange: function (c) {
			var pObTab = this.getObTab(this.oModelName);
			var id = c.getSource().getId().split("tskL--");
			id = id[1];
			if (c.getSource().getId().indexOf("charValueAdd") > -1) {
				ClassUtils.handleSelCharAdd("charValueAdd", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charValueClear") > -1) {
				ClassUtils.handleCharClear("charValueClear", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("status") > -1) {
				ClassUtils.onClassChange("status", this, pObTab, c);
			} else if (c.getSource().getId().indexOf("charName") > -1) {
				ClassUtils.onCharChange("charName", this, c);
			}
		},

		// handleClassRowAdd: function () {
		// 	var pObTab = this.getObTab();
		// 	ClassUtils.classRowAddPress(this, pObTab);
		// },
		// handleCharRowAdd: function () {
		// 	ClassUtils.charRowAddPress(this);
		// },
		// handleCharRowDelete: function (e) {
		// 	var pObTab = this.getObTab();
		// 	ClassUtils.bfrCharRowDelete(e, this, pObTab);
		// },
		// handleClassRowDelete: function (e) {
		// 	ClassUtils.classRowDeletePress(e, this);
		// },
		handleClassRowAdd: function () {
			var pObTab = this.getObTab();
			ClassUtils.classRowAddPress(this, pObTab);
		},

		handleCharRowAdd: function () {
			ClassUtils.charRowAddPress(this);
		},

		handleCharRowDelete: function (e) {
			var pObTab = this.getObTab();
			ClassUtils.charRowDeletePress(e, this, pObTab);
		},
		handleClassRowDelete: function (e) {
			ClassUtils.classRowDeletePress(e, this);
		},

		onClassSelect: function (e) {
			ClassUtils.classSelectPress(e, this);
		},
		onSelect: function (e) {
			ClassUtils.selectPress(e, this);
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

		/*
		 * Function to handle Component Hierarchy
		 * @param oEvent
		 */
		onCompSelectionpress: function (oEvent) {
			var g = this;
			if (!this.dlgCompSelection) {
				this.dlgCompSelection = sap.ui.xmlfragment("ugiaiwui.mdg.aiw.request.Fragments.TL.CompSelection", this);
				this.getView().addDependent(this.dlgCompSelection);
			}

			var mTlDetail = this.getView().getModel("tlDetailModel");
			var aTlDetail = mTlDetail.getData();

			if (aTlDetail.lHeader.assmbly && aTlDetail.lHeader.assmbly !== "") {
				var M = this.getView().getModel("valueHelp");
				var sUrl = "/CompHierSet";
				// var sKeyDate = formatter._formatDate(aTlDetail.lHeader.validFrm);
				// var sDate = "datetime'"+sKeyDate+"'";
				var aFilter = [
					new sap.ui.model.Filter("Istru", "EQ", aTlDetail.lHeader.assmbly),
					new sap.ui.model.Filter("Werks", "EQ", aTlDetail.lHeader.Iwerk),
					new sap.ui.model.Filter("Keydate", "EQ", formatter._formatDate(aTlDetail.validFrm)),
				];
				if (this.action.indexOf("ETL") > 0) {
					aFilter.push(new sap.ui.model.Filter("Equnr", "EQ", aTlDetail.equipment));
				} else if (this.action.indexOf("FTL") > 0) {
					aFilter.push(new sap.ui.model.Filter("Tplnr", "EQ", aTlDetail.floc));
				}
				var oBusyDialog = new BusyDialog();
				oBusyDialog.open();
				M.read(sUrl, {
					filters: aFilter,
					success: function (r) {
						oBusyDialog.close();
						var aData = g.getTreeTblData(r.results);
						var model = new JSONModel(aData);
						var CompSelTbl = sap.ui.getCore().byId("idCompSelTbl");
						CompSelTbl.setModel(model);

						g.dlgCompSelection.open();
						g.SelectedComponents = [];
						// g.SelectedIndices = [];
					},
					error: function (err) {
						oBusyDialog.close();
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
						sap.m.MessageBox.show(value, {
							title: "Error",
							icon: sap.m.MessageBox.Icon.ERROR,
							onClose: function () {}
						});
					}
				});
			} else {
				var model = new JSONModel([]);
				var CompSelTbl = sap.ui.getCore().byId("idCompSelTbl");
				CompSelTbl.setModel(model);
				this.dlgCompSelection.open();
			}
		},

		/*
		 * Function to modify response to Tree table data
		 * @param results
		 */
		getTreeTblData: function (results) {
			var aTreeTblData = [];
			var objMap = {};
			if (results) {
				var oTreeObj;
				for (var i = 0; i < results.length; i++) {
					var currentObj = results[i];
					oTreeObj = currentObj;
					oTreeObj.IsSelect = false;
					oTreeObj.children = [];

					if (currentObj.ParentKey && currentObj.ParentKey.length > 0) {
						var oParent = objMap[currentObj.ParentKey];
						if (oParent) {
							oParent.children.push(oTreeObj);
						}
					} else {
						aTreeTblData.push(oTreeObj);
					}

					objMap[oTreeObj.RowKey] = oTreeObj;
				}

				return aTreeTblData;
			}
		},

		/*
		 * Function to handle CHOOSE button press of Component Hierarchy
		 */
		onCompSelChoosePress: function () {
			var CompSelTbl = sap.ui.getCore().byId("idCompSelTbl");
			var mCompSel = CompSelTbl.getModel();

			var mTlDetail = this.getView().getModel("tlDetailModel");
			var aTlDetail = mTlDetail.getData();

			if (this.SelectedComponents.length > 0) {
				for (var i = 0; i < this.SelectedComponents.length; i++) {
					this.SelectedComponents[i].Vornr = this.opNum;
					this.SelectedComponents[i].Plnal = this.grpCounter;
					var num = (aTlDetail.lComponent.length + 1).toString();
					this.SelectedComponents[i].slNo = num;
					this.SelectedComponents[i].flag = this.grpCounter + "-" + this.opNum + "-" + num;
					this.SelectedComponents[i].hFlag = this.grpCounter + "-" + this.opNum;
					this.SelectedComponents[i].group = aTlDetail.grp;
					this.SelectedComponents[i].groupCounter = this.grpCounter;
					this.SelectedComponents[i].activity = this.opNum;
					this.SelectedComponents[i].cmpCompEnable = true;
					this.SelectedComponents[i].cmpEnable = true;
					this.SelectedComponents[i].cmpVisible = false;
					aTlDetail.lComponent.push(this.SelectedComponents[i]);
				}
			}
			mTlDetail.setData(aTlDetail);
			this.getView().byId("components").getModel("tlDetailModel").refresh();

			var tempCp = [];
			if (this.cmpData !== null) {
				var data = this.SelectedComponents;
				for (var c = 0; c < data.length; c++) {
					for (var d = 0; d < this.cmpData.length; d++) {
						if (data[c].hFlag !== this.cmpData[d].hFlag) {
							// var C = data;
							// C[c].flag = this.grpCounter + "-" + this.opNum + "-" + data[c].Idnrk;
							// C[c].hFlag = this.grpCounter + "-" + this.opNum;
							tempCp.push(C[c]);
						}
					}
				}
				if (this.cmpData !== null) {
					Array.prototype.push.apply(this.cmpData, tempCp);
				}
			}

			this.SelectedComponents = [];
			this.dlgCompSelection.close();
		},

		/*
		 * Function to handle CANCEL button press of Component Hierarchy
		 */
		onCompSelCancelPress: function () {
			this.SelectedComponents = [];
			this.dlgCompSelection.close();
		},

		/*
		 * Function to handle row select of Component Hierarchy
		 */
		onCompSelRowSelect: function (oEvent) {
			// var sSelPath = oEvent.getParameters().rowContext.sPath;
			// var mTblModel = sap.ui.getCore().byId("idCompSelTbl").getModel();
			// var oSelData = mTblModel.getProperty(sSelPath);

			// var aCurrentIndices = oEvent.getSource().getSelectedIndices();
			// if (aCurrentIndices.length > this.SelectedIndices.length) {
			// 	for (var i = 0; i < aCurrentIndices.length; i++) {
			// 		var sExistsFlag = false;
			// 		for (var j = 0; j < this.SelectedIndices.length; j++) {
			// 			if (aCurrentIndices[i] === this.SelectedIndices[j].key) {
			// 				sExistsFlag = true;
			// 			}
			// 		}
			// 		if (!sExistsFlag) {

			// 		} else {
			// 			this.SelectedIndices.push({
			// 				key: i,
			// 				Idnrk: oSelData.Idnrk
			// 			});
			// 		}
			// 	}
			// }else{

			// }

			var selected = oEvent.getParameter("selected");
			var selectedObject = oEvent.getSource().getBindingContext().getObject();
			// var sObjectArray = [];
			if (selected) {
				var oComponent = {};
				oComponent.Idnrk = selectedObject.Idnrk;
				oComponent.matDesc = selectedObject.Maktx;
				oComponent.Menge = selectedObject.Kmpmg;
				oComponent.MeinsGcp = selectedObject.Kmpme;
				oComponent.Postp = selectedObject.Postp;
				oComponent.Stltygcmp = selectedObject.Stlty;
				oComponent.Stlnrgcmp = selectedObject.Stlnr;
				oComponent.Stlal = selectedObject.Stlal;
				// this.SelectedComponents.push(oComponent);
				this.SelectedComponents.push(oComponent);
			} else {
				var comp = selectedObject.Idnrk;
				for (var i = 0; i < this.SelectedComponents.length; i++) {
					if (this.SelectedComponents[i].Idnrk === comp) {
						this.SelectedComponents.pop(i);
					}
				}
			}
		},

		//////////// Operation Relationship Overview ///////////////////
		addOprRel: function () {
			var g = this;
			var opPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
			var aOprRel = g.getModel("tlDetailModel").getProperty(opPath + "/OprRel");

			aOprRel.push({
				Plnal: this.grpCounter,
				Vornr: this.opNum,

				OperationOR: "",
				Offset: "",
				OUn: "",
				RelType: "",
				PO: "",
				OI: "",
				ID: "",
				WrkCtrOR: "",
				PlantOR: "",

				OperationORVS: "None",
				OffsetVS: "None",
				OUnVS: "None",
				RelTypeVS: "None",
				POVS: "None",
				OIVS: "None",
				IDVS: "None",
				WrkCtrORVS: "None",
				PlantORVS: "None",
			});

			g.getModel("tlDetailModel").setProperty(opPath + "/OprRel", aOprRel);
			g.getModel("tlDetailModel").setProperty("/lOprRel", aOprRel);
			g.getModel("tlDetailModel").refresh();
		},

		deleteOprRel: function (event) {
			var src = event.getSource();
			var path = event.getParameter('listItem').getBindingContext("tlDetailModel").sPath;
			path = path.substring(path.lastIndexOf('/') + 1);
			var model = src.getModel("tlDetailModel");
			var data = model.getProperty('/lOprRel');
			data.splice(parseInt(path), 1);
			model.setProperty('/lOprRel', data);
			this.getModel("tlDetailModel").setProperty("/lOprRel", data);
		},

		onOffUnitVH: function (oEvent) {
			ValueHelpRequest.UOMVH(oEvent, this);
		},
		onOffUnitChange: function (oEvent) {
			ValueHelpRequest._UOMchange(oEvent, this);
		},

		onRelTypeVH: function (oEvent) {
			ValueHelpRequest.RelTypeVH(oEvent, this);
		},

		onRelTypeChange: function (oEvent) {
			ValueHelpRequest._changeRelType(oEvent, this);
		},

		onOffIntrpVH: function (oEvent) {
			ValueHelpRequest.OffIntrpVH(oEvent, this);
		},

		onOffIntrpChange: function (oEvent) {
			ValueHelpRequest._changeOffIntrp(oEvent, this);
		},

		onFactryIdVH: function (oEvent) {
			ValueHelpRequest.FactryIdVH(oEvent, this);
		},

		onFactryIdChange: function (oEvent) {
			ValueHelpRequest._changeFactryId(oEvent, this);
		},

		onWrkCtrORVH: function (oEvent) {
			ValueHelpRequest.WrkCtrORVH(oEvent, this);
		},

		onWrkCtrORChange: function (oEvent) {
			ValueHelpRequest._changeWrkCtrOR(oEvent, this);
		},

		onPlantORVH: function (oEvent) {
			ValueHelpRequest.PlantORVH(oEvent, this);
		},

		onPlantORChange: function (oEvent) {
			ValueHelpRequest._changePlantOR(oEvent, this);
		},

		onOperationORChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var sValue = oSource.getValue();
			var mTlDetail = this.getView().getModel("tlDetailModel");
			var oTlDetail = mTlDetail.getData();
			var lOperations = oTlDetail.lOperation;
			var sExistsFlag = false;
			oSource.setValueState("None");

			if (sValue === "") {
				return;
			}

			for (var i = 0; i < lOperations.length; i++) {
				if (sValue === lOperations[i].Vornr) {
					sExistsFlag = true;
					break;
				}
			}

			if (sExistsFlag) {
				var currOprPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
				var currOpr = mTlDetail.getProperty(currOprPath).Vornr;
				if (sValue !== currOpr) {
					sExistsFlag = "Valid";
				} else {
					sExistsFlag = "Inalid";
				}
			}

			var aMsg = [];
			if (sExistsFlag === false) {
				aMsg.push({
					type: "Error",
					title: "Operation does not exist"
				});
				this.createMessagePopover(aMsg, "");
				oSource.setValueState("Error");
			} else if (sExistsFlag === "Inalid") {
				aMsg.push({
					type: "Error",
					title: "Cannot create operation relationship for itself"
				});
				this.createMessagePopover(aMsg, "");
				oSource.setValueState("Error");
			} else {
				oSource.setValueState("None");
			}
		},

		//////////////// Service Package Overview ///////////////////
		addSrvPckgOvrw: function (oEvent) {
			var g = this;
			var opPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
			var aSPO = g.getModel("tlDetailModel").getProperty(opPath + "/SrvPckgOvrw");

			var sLineNum = "";
			if (aSPO.length < 1) {
				sLineNum = "10";
			} else {
				var sLastLineNum = aSPO[aSPO.length - 1].LineNum;
				var sLineNum = (parseInt(sLastLineNum) + 10).toString();
			}

			aSPO.push({
				group: this.group,
				Plnal: this.grpCounter,
				Vornr: this.opNum,

				LineNum: sLineNum,
				DelIndSP: false,
				ActNum: "",
				ShrtTxt: "",
				Qty: "",
				BUomSP: "",
				GrossPrc: "",
				CurKey: "",
				Work: "",
				UnitOfWork: "",

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
			});

			g.getModel("tlDetailModel").setProperty(opPath + "/SrvPckgOvrw", aSPO);
			g.getModel("tlDetailModel").setProperty("/lSrvPckgOvrw", aSPO);
			g.getModel("tlDetailModel").refresh();
		},

		deleteSrvPckgOvrw: function (event) {
			var src = event.getSource();
			var path = event.getParameter('listItem').getBindingContext("tlDetailModel").sPath;
			path = path.substring(path.lastIndexOf('/') + 1);
			var model = src.getModel("tlDetailModel");
			var data = model.getProperty('/lSrvPckgOvrw');
			data.splice(parseInt(path), 1);
			model.setProperty('/lSrvPckgOvrw', data);
			this.getModel("tlDetailModel").setProperty("/lSrvPckgOvrw", data);
		},

		tlSrvPckgOvrwDetailPress: function (oEvent) {
			var oSource = oEvent.getSource();
			if (this.mode !== "display") {
				var sOpPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
				var opIndex = sOpPath.split("/")[2];

				var oOpFlag = {
					opDetFlag: true,
					opIndex: opIndex
				};
				sap.ui.getCore().setModel(oOpFlag, "oOpFlag");
			}

			var path = oSource.oBindingContexts.tlDetailModel.sPath;
			this.getRouter().navTo("tlSrvPckge", {
				itemPath: encodeURIComponent(path),
				mode: this.mode
			});
		},

		onActNumVH: function (oEvent) {
			ValueHelpRequest.ActNumVH(oEvent, this);
		},
		onActNumChange: function (oEvent) {
			ValueHelpRequest._ActNumchange(oEvent, this);
		},

		onBUomSPVH: function (oEvent) {
			ValueHelpRequest.UOMVH(oEvent, this);
		},
		onBUomSPChange: function (oEvent) {
			ValueHelpRequest._UOMchange(oEvent, this);
		},

		onQtySPOchange: function (oEvent) {
			ValueHelpRequest.Qtychange(oEvent, this);
		},

		onShrtTxtchange: function (oEvent) {
			ValueHelpRequest.ShrtTxtchange(oEvent, this);
		},

		deriveActQty: function (oSource, Iwein, Meins) {
			// /sap/opu/odata/ugiod01/F4_helps_srv/SpackWrkDrvSet?$filter=Meins eq 'Bqm' and Iwein eq 'D' and Srvpos eq '1000081' and IAmount eq '35'
			var g = this;
			var M = this.getView().getModel("valueHelp2");
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var sBindPath = oSource.getBindingInfo("value").binding.getContext().getPath();
			var oSrvPcg = tlDetailModel.getProperty(sBindPath);
			var hdData = tlDetailModel.getData();

			if (Iwein) {
				oSrvPcg.UnitOfWork = Iwein;
			}
			if (Meins) {
				oSrvPcg.BUomSP = Meins;
			}

			var q = "/SpackWrkDrvSet";
			var aFilter = [new sap.ui.model.Filter("Meins", "EQ", oSrvPcg.BUomSP),
				new sap.ui.model.Filter("Iwein", "EQ", oSrvPcg.UnitOfWork),
				new sap.ui.model.Filter("Srvpos", "EQ", oSrvPcg.ActNum),
				new sap.ui.model.Filter("IAmount", "EQ", oSrvPcg.Qty)
			];
			M.read(q, {
				filters: aFilter,
				success: function (h) {
					if (h.results.length > 0) {
						var res = h.results[0];
						oSrvPcg.BUomSP = res.Meins;
						oSrvPcg.Work = res.OAmount;
						oSrvPcg.ActNum = res.Srvpos;
						oSrvPcg.Qty = res.IAmount;
						oSrvPcg.UnitOfWork = res.Iwein;
						tlDetailModel.refresh();
					}
				},
				error: function (err) {
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
					MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {}
					});
				}
			});
		},

		////////////// TL Header ////////////////
		onInspPointVH: function (oEvent) {
			ValueHelpRequest.InspPointVH(oEvent, this);
		},
		onInspPointChange: function (oEvent) {
			ValueHelpRequest._InspPointchange(oEvent, this);
		},

		//////////////////// Maintainence Package //////////////////
		readMaintPckgConfig: function (strategy, routeFlag, apprFlag) {
			var g = this;
			var M = this.getView().getModel("valueHelp2");
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var hdData = tlDetailModel.getData();
			var q = "/MpackSet";
			var aFilter = [new sap.ui.model.Filter("Strat", "EQ", strategy)]
			M.read(q, {
				filters: aFilter,
				success: function (h) {
					g.maintPckg = h.results;
					sap.ui.getCore().setModel(new JSONModel(g.maintPckg), "maintPckgResults");
					g.maintPckgCols = ["Vornr", "SOp", "Ltxa1"];
					for (var i = 0; i < h.results.length; i++) {
						g.maintPckgCols.push(h.results[i].Paket);
					}

					if (apprFlag === "Appr") {
						var tblMaintPckg = g.getView().byId("idTblApprMaintPckg");
					} else {
						var tblMaintPckg = g.getView().byId("idTblMaintPckge");
					}
					tblMaintPckg.destroyColumns();
					tblMaintPckg.addColumn(new sap.m.Column({
						header: new sap.m.Label({
							text: "Op"
						}),
					}));
					tblMaintPckg.addColumn(new sap.m.Column({
						header: new sap.m.Label({
							text: "SOp"
						}),
					}));
					tblMaintPckg.addColumn(new sap.m.Column({
						header: new sap.m.Label({
							text: "Op Short Text"
						}),
					}));
					for (var i = 0; i < h.results.length; i++) {
						tblMaintPckg.addColumn(new sap.m.Column({
							header: new sap.m.Label({
								text: h.results[i].Paket
							}),
						}));
					}

					// if ((hdData.Operation && hdData.Operation.length > 0) || (hdData.lOperation && hdData.lOperation.length > 0)) {
					// if (hdData.lMaintPckg && hdData.lMaintPckg.length > 0) {
					// if (hdData.lOperation && hdData.lOperation.length > 0) {
					g.defaultCreateMaintPckg(routeFlag, apprFlag);
					// } else {
					// 	tblMaintPckg.setModel(new JSONModel(hdData.lMaintPckg));
					// }
				},
				error: function (err) {
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
					MessageBox.show(value, {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {}
					});
				}
			});
		},

		createMaintPckgData: function (opRowData) {
			var g = this;
			var tlDetailModel = g.getView().getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			var tblMaintPckg = g.getView().byId("idTblMaintPckge");
			var oMaintPckg = {
				Plnal: this.grpCounter,
				Vornr: opRowData.Vornr,
				Strat: tlDetailData.lHeader.Strat,
				SOp: "",
				Ltxa1: opRowData.Ltxa1,
				MPArr: [],
				flag: this.grpCounter + "-" + opRowData.Vornr,
			};

			g.maintPckg.forEach(function (obj) {
				oMaintPckg[obj.Paket] = false;
			});

			if (!tlDetailData.MaintPckg) {
				tlDetailData.MaintPckg = [];
			}

			if (!tlDetailData.lMaintPckg) {
				tlDetailData.lMaintPckg = [];
			}

			tlDetailData.lMaintPckg.push(oMaintPckg);

			var aMaintPckgCells = [];
			for (var z = 0; z < g.maintPckgCols.length; z++) {
				if (z < 3) {
					aMaintPckgCells.push(
						new sap.m.Text({
							text: "{" + g.maintPckgCols[z] + "}"
						}),
					);
				} else {
					aMaintPckgCells.push(
						new sap.m.CheckBox({
							selected: "{" + g.maintPckgCols[z] + "}",
							select: g.maintPckgColSelect
						})
					);
				}
			}
			var I = new sap.m.ColumnListItem({
				type: "Active",
				unread: false,
				cells: aMaintPckgCells
			});
			var e = new sap.ui.model.json.JSONModel();
			e.setData(tlDetailData.lMaintPckg);
			tblMaintPckg.setModel(e);
			tblMaintPckg.bindAggregation("items", "/", I);
		},

		maintPckgColSelect: function (oEvent) {
			var g = this;
			var sSelected = oEvent.getParameter("selected");
			var selObj = oEvent.getSource().getBindingContext().getObject();
			var selCol = oEvent.getSource().getBindingInfo("selected").parts[0].path;
			if (sSelected) {
				// var selCol = this.getBindingInfo("selected").parts[0].path;
				var MPResults = sap.ui.getCore().getModel("maintPckgResults").getData();
				var tempMPResults = $.map(MPResults, function (obj) {
					return $.extend(true, {}, obj);
				});
				var obj = {};
				for (var i in tempMPResults) {
					if (tempMPResults[i].Paket === selCol) {
						obj = tempMPResults[i];
						break;
					}
				}
				obj.Vornr = selObj.Vornr;
				obj.Plnal = selObj.Plnal;
				obj.MPEnable = true;

				selObj.MPArr.push(obj);
				selObj[selCol] = true;
			} else {
				for (var j in selObj.MPArr) {
					if (selObj.MPArr[j].Paket === selCol) {
						selObj.MPArr.splice(j, 1);
						break;
					}
				}
				selObj[selCol] = false;
			}
		},

		defaultCreateMaintPckg: function (routeFlag, apprFlag) {
			var g = this;
			if (apprFlag === "Appr") {
				var tblMaintPckg = g.getView().byId("idTblApprMaintPckg");
				var sCheckBoxEnable = false;
			} else {
				var tblMaintPckg = g.getView().byId("idTblMaintPckge");
				var sCheckBoxEnable = true;
			}
			var tlDetailModel = g.getView().getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			var opArray = [];
			if (tlDetailData.lOperation && tlDetailData.lOperation.length > 0) {
				opArray = tlDetailData.lOperation;
			} else if (tlDetailData.Operation && tlDetailData.Operation.length > 0) {
				opArray = tlDetailData.Operation;
			} else {
				return;
			}

			// tlDetailData.lMaintPckg = [];
			var aMaintPckgCells = [];
			for (var j = 0; j < opArray.length; j++) {
				if (!routeFlag) {
					var oMaintPckg = {
						Plnal: this.grpCounter,
						Vornr: opArray[j].Vornr,
						Strat: tlDetailData.lHeader.Strat,
						SOp: "",
						Ltxa1: opArray[j].Ltxa1,
						MPArr: [],
						flag: this.grpCounter + "-" + opArray[j].Vornr,
					};

					g.maintPckg.forEach(function (obj) {
						oMaintPckg[obj.Paket] = false;
					});
					tlDetailData.lMaintPckg.push(oMaintPckg);
				}

				for (var z = 0; z < g.maintPckgCols.length; z++) {
					if (z < 3) {
						aMaintPckgCells.push(
							new sap.m.Text({
								text: "{" + g.maintPckgCols[z] + "}"
							}),
						);
					} else {
						aMaintPckgCells.push(
							new sap.m.CheckBox({
								selected: "{" + g.maintPckgCols[z] + "}",
								select: g.maintPckgColSelect,
								enabled: sCheckBoxEnable
							})
						);
					}
				}
			}
			var I = new sap.m.ColumnListItem({
				type: "Active",
				unread: false,
				cells: aMaintPckgCells
			});
			var e = new sap.ui.model.json.JSONModel();
			e.setData(tlDetailData.lMaintPckg);
			tblMaintPckg.setModel(e);
			tblMaintPckg.bindAggregation("items", "/", I);
		},

		navMaintPckgeDetail: function () {
			if (this.mode !== "display") {
				var tblMaintPckg = this.getView().byId("idTblMaintPckge");
			} else {
				var tblMaintPckg = this.getView().byId("idTblApprMaintPckg");
			}
			if (tblMaintPckg.getSelectedItem() !== null) {
				var selPath = tblMaintPckg.getSelectedItem().getBindingContext().getPath();
				selPath = selPath.split("/")[1];

				if (this.mode !== "display") {
					var oOpFlag = {
						opDetFlag: true,
						opIndex: selPath
					};
					sap.ui.getCore().setModel(oOpFlag, "oOpFlag");
				}

				// var path = oSource.oBindingContexts.tlDetailModel.sPath;
				this.getRouter().navTo("tlMaintPckg", {
					itemPath: selPath, //encodeURIComponent(path),
					mode: this.mode
				});
			}
		},

		///////////////////////// PRT ///////////////////////////////////
		onPRTMenuAction: function (oEvent) {
			var selectedAction = oEvent.getParameter("item").getKey();

			var sCategory = "";
			switch (selectedAction) {
			case "mat":
				sCategory = "M";
				break;
			case "eq":
				sCategory = "E";
				break;
			case "mspt":
				sCategory = "P";
				break;
			case "doc":
				sCategory = "D";
				break;
			case "oth":
				sCategory = "O";
				break;
			}

			this.addPRT(sCategory);
		},

		addPRT: function (category) {
			var g = this;
			var tlDetailModel = g.getView().getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			if (this.getView().byId("operationTab").getSelectedItem()) {
				var opPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
			} else {
				return;
			}
			var aPRT = g.getModel("tlDetailModel").getProperty(opPath + "/PRT");
			var oOpr = g.getModel("tlDetailModel").getProperty(opPath);

			var sLineNum = "";
			if (aPRT.length < 1) {
				sLineNum = "10";
			} else {
				var sLastLineNum = aPRT[aPRT.length - 1].ItmNum;
				var sLineNum = (parseInt(sLastLineNum) + 10).toString();
			}

			var oPrt = {
				grp: tlDetailData.grp,
				Plnal: tlDetailData.lHeader.Plnal,
				Vornr: g.getModel("tlDetailModel").getProperty(opPath).Vornr,
				Ltxa1: g.getModel("tlDetailModel").getProperty(opPath).Ltxa1,
				// title: formatter.TLPRTtitle(category),

				ItmNum: sLineNum,
				ItmCat: category,
				PRT: "",
				PRTDesc: "",
				Mat: "",
				MatDesc: "",
				Equi: "",
				EquiDesc: "",
				Mspt: "",
				MsptDesc: "",
				doc: "",
				docDesc: "",
				docType: "",
				docTypeDesc: "",
				docPart: "",
				docVersion: "",
				Othr: "",
				OthrDesc: "",
				Qty: "1",
				UOM: "EA",
				QtyFrmla: "",
				PRTCtrl: "1",
				PRTCtrlDesc: "All Functions",
				StdUsgVal: "",
				StdUsgUOM: "",
				UsgValFrmla: "",
				prtEnable: true,

				PRTVS: "None",
				PlantVS: "None",
				QtyVS: "None",
				UOMVS: "None",
				QtyFrmlaVS: "None",
				PRTCtrlVS: "None",
				StdUsgValVS: "None",
				StdUsgUOMVS: "None",
				UsgValFrmlaVS: "None",
			};

			if (category === "M") {
				oPrt.title = "Material";
				oPrt.matEnable = true;
				oPrt.eqEnable = false;
				oPrt.msptEnable = false;
				oPrt.docEnable = false;
				oPrt.othEnable = false;
				oPrt.Plant = oOpr.Werks;
			} else if (category === "E") {
				oPrt.title = "Equipment";
				oPrt.matEnable = false;
				oPrt.eqEnable = true;
				oPrt.msptEnable = false;
				oPrt.docEnable = false;
				oPrt.othEnable = false;
			} else if (category === "P") {
				oPrt.title = "Measuring Point";
				oPrt.matEnable = false;
				oPrt.eqEnable = false;
				oPrt.msptEnable = true;
				oPrt.docEnable = false;
				oPrt.othEnable = false;
			} else if (category === "D") {
				oPrt.title = "Document";
				oPrt.matEnable = false;
				oPrt.eqEnable = false;
				oPrt.msptEnable = false;
				oPrt.docEnable = true;
				oPrt.othEnable = false;
				oPrt.docType = "";
				oPrt.docTypeDesc = "";
				oPrt.docPart = "";
				oPrt.docVersion = "";
			} else if (category === "O") {
				oPrt.title = "Others";
				oPrt.matEnable = false;
				oPrt.eqEnable = false;
				oPrt.msptEnable = false;
				oPrt.docEnable = false;
				oPrt.othEnable = true;
			}

			aPRT.push(oPrt);

			g.getModel("tlDetailModel").setProperty(opPath + "/PRT", aPRT);
			g.getModel("tlDetailModel").setProperty("/lPRT", aPRT);
			g.getModel("tlDetailModel").refresh();
		},

		deleteTLPRT: function (event) {
			var src = event.getSource();
			var path = event.getParameter('listItem').getBindingContext("tlDetailModel").sPath;
			path = path.substring(path.lastIndexOf('/') + 1);
			var model = src.getModel("tlDetailModel");
			var data = model.getProperty('/lPRT');
			data.splice(parseInt(path), 1);
			model.setProperty('/lPRT', data);
			this.getModel("tlDetailModel").setProperty("/lPRT", data);
		},

		onprtCtrlKeyVH: function (oEvent) {
			ValueHelpRequest.prtCtrlKeyVH(oEvent, this);
		},
		onprtCtrlKeyChange: function (oEvent) {
			ValueHelpRequest.prtCtrlKeyChange(oEvent, this);
		},

		onprtQtyChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var sValue = oSource.getValue();
			oSource.setValueState("None");
			if (sValue === "") {
				oSource.setValueState("Error");
			} else if (parseInt(sValue) <= 0) {
				oSource.setValueState("Error");
			}
		},

		onprtUOMVH: function (oEvent) {
			ValueHelpRequest.UOMVH(oEvent, this);
		},
		onprtUOMChange: function (oEvent) {
			ValueHelpRequest._UOMchange(oEvent, this);
		},

		tlPRTPress: function (oEvent) {
			if (this.mode !== "display") {
				var sOpPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
				var opIndex = sOpPath.split("/")[2];

				var oOpFlag = {
					opDetFlag: true,
					opIndex: opIndex
				}
				sap.ui.getCore().setModel(oOpFlag, "oOpFlag");
			}

			var path = oEvent.getSource().oBindingContexts.tlDetailModel.sPath;
			this.getRouter().navTo("tlPRT", {
				itemPath: encodeURIComponent(path),
				mode: this.mode
			});
		},

		/////////////////////////// Inspection Characteristics //////////////////////////////////////////
		addInspChar: function (oEvent) {
			var g = this;
			var opPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
			var aInspChar = g.getModel("tlDetailModel").getProperty(opPath + "/InspChar");
			var tlDetailData = g.getModel("tlDetailModel").getData();

			var sLineNum = "";
			if (aInspChar.length < 1) {
				sLineNum = "10";
			} else {
				var sLastLineNum = aInspChar[aInspChar.length - 1].LineNum;
				var sLineNum = (parseInt(sLastLineNum) + 10).toString();
			}

			aInspChar.push({
				group: tlDetailData.grp,
				Plnal: this.grpCounter,
				Vornr: this.opNum,

				InspChar: sLineNum,
				PrstInd: "",
				QuanChar: false,
				QualChar: false,
				MastInspChar: "",
				// MastInspCharDesc: "",
				Plant: "",
				Version: "",
				ShrtTxt: "",
				InspMthd: "",
				InspMthdPlnt: "",
				TolKey: "",
				VrsnInspMthd: "",
				SampProc: "",
				SampUOM: "",
				BaseSampQty: "",
				CodeGrp: "",

				MastInspCharVS: "None",
				PlantVS: "None",
				VersionVS: "None",
				InspMthdVS: "None",
				InspMthdPlntVS: "None",
				SampProcVS: "None",
				InspEnable: true
			});

			g.getModel("tlDetailModel").setProperty(opPath + "/InspChar", aInspChar);
			g.getModel("tlDetailModel").setProperty("/lInspChar", aInspChar);
			g.getModel("tlDetailModel").refresh();
		},

		deleteInspChar: function (event) {
			var src = event.getSource();
			var path = event.getParameter('listItem').getBindingContext("tlDetailModel").sPath;
			path = path.substring(path.lastIndexOf('/') + 1);
			var model = src.getModel("tlDetailModel");
			var data = model.getProperty('/lInspChar');
			data.splice(parseInt(path), 1);
			model.setProperty('/lInspChar', data);
			this.getModel("tlDetailModel").setProperty("/lInspChar", data);
		},

		onMastInspCharVH: function (oEvent) {
			ValueHelpRequest.MastInspCharVH(oEvent, this);
		},

		onMastInspCharChange: function (oEvent) {
			ValueHelpRequest.MastInspCharChange(oEvent, this);
		},
		
		readInspChar: function (pl, mic, ver, sPath) {
			var g = this;
			var tlDetailModel = g.getView().getModel("tlDetailModel");
			var tlDetailData = tlDetailModel.getData();
			var M = g.getView().getModel("valueHelp2");
			var q = "/TLPresetIndSet(Werks='" + pl + "',Mic='" + mic + "',Version='" + ver + "')";
			M.read(q, {
				success: function (r) {
					tlDetailModel.getProperty(sPath).QualChar = r.Qualitat;
					tlDetailModel.getProperty(sPath).QuanChar = r.Quantitat;
					tlDetailModel.refresh();
				},
				error: function (e) {
					var b = JSON.parse(e.responseText);
					var d = b.error.message.value;
					g.showMessage(d);
				}
			});
		},

		onICPlantChange: function (oEvent) {
			ValueHelpRequest.ICPlantChange(oEvent, this);
		},

		onICVersionChange: function (oEvent) {
			ValueHelpRequest.ICVersionChange(oEvent, this);
		},

		onInspMthdPlntVH: function (oEvent) {
			ValueHelpRequest.InspMthdPlntVH(oEvent, this);
		},

		onInspMthdPlntChange: function (oEvent) {
			ValueHelpRequest.InspMthdPlntChange(oEvent, this);
		},

		onSampProcVH: function (oEvent) {
			ValueHelpRequest.SampProcVH(oEvent, this);
		},

		onSampProcChange: function (oEvent) {
			ValueHelpRequest.SampProcChange(oEvent, this);
		},

		tlInspCharDetailPress: function (oEvent) {
			if (this.mode !== "display") {
				var sOpPath = this.getView().byId("operationTab").getSelectedItem().getBindingContext("tlDetailModel").sPath;
				var opIndex = sOpPath.split("/")[2];

				var oOpFlag = {
					opDetFlag: true,
					opIndex: opIndex
				}
				sap.ui.getCore().setModel(oOpFlag, "oOpFlag");
			}

			var path = oEvent.getSource().oBindingContexts.tlDetailModel.sPath;
			this.getRouter().navTo("tlInspChar", {
				itemPath: encodeURIComponent(path),
				mode: this.mode
			});
		},

	});

});