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
	"sap/m/BusyDialog",
	"sap/ui/core/message/Message"
], function (BaseController, JSONModel, MessageBox, History, formatter, Router, ValueHelpProvider, BusyDialog, Message) { //common
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.InternationalAddress", {

		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			this.getRouter().getRoute("intlAddr").attachPatternMatched(this._onRouteMatched, this);
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
			
			var oModel = this._oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);
			
			var vhModel = this._oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");
			
			var vhModel2 = this._oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");

			this.readAddressVersion(this);
			this.readAddressTitle();

			var sObj = {
				enabled: true
			};
			this.getView().setModel(new JSONModel(sObj), "mainView");

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
		},

		_onRouteMatched: function (oEvent) {
			var g = this;
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "intlAddr") {
				var sCrStatus = oEvent.getParameter("arguments").sCrStatus;
				var headerModel = oEvent.getParameter("arguments").modelName;
				var itemPath = decodeURIComponent(oEvent.getParameter("arguments").itemPath);
				this.sIntlPath = parseInt(itemPath.split("/")[2]);
				this.rowIndex = decodeURIComponent(oEvent.getParameter("arguments").rowIndex);
				this.viewName = oEvent.getParameter("arguments").viewName;
				var addrEnable = oEvent.getParameter("arguments").addrEnable;

				this.currentHeader;
				if (this.viewName.indexOf("Approve") > -1) {
					var sAppPath = "/" + headerModel + this.rowIndex;
					this.currentHeader = sap.ui.getCore().getModel("AIWAPPROVE").getProperty(sAppPath);
				} else if (this.viewName.indexOf("Change") > -1) {
					this.currentHeader = sap.ui.getCore().getModel(headerModel).getData();
				} else {
					this.currentHeader = sap.ui.getCore().getModel(headerModel).getProperty(this.rowIndex);
				}
				this.currentObj = this.currentHeader.intlAddr[this.sIntlPath];
				var intlModel = new JSONModel(this.currentObj);
				this.oModelName = "intlAddrModel";
				this.getView().setModel(intlModel, this.oModelName);

				if (this.currentObj.AdNation !== "") {
					this.getView().byId("idSELAddrVrsnIA").setSelectedKey(this.currentObj.AdNation);
				} else {
					this.getView().byId("idSELAddrVrsnIA").setSelectedKey();
				}
				// this.getView().byId("idSELAddrVrsnIA").setEnabled(this.currentObj.AdNationEnable);

				var enableFields = this.getView().getModel("mainView").getData();
				if (sCrStatus === "true" || this.viewName === "Approve" || addrEnable === "false") {
					enableFields.enabled = false;
				} else {
					enableFields.enabled = true;
				}
				this.getView().getModel("mainView").refresh();
			}
		},

		onAddrVersionChange: function (oEvent) {
			var g = this;
			var oSource = oEvent.getSource();
			// var sIntlPath = oEvent.getSource().getParent().getBindingContext("AIWFLOC").getPath();
			var sIntlIndex = this.sIntlPath; //parseInt(sIntlPath.split("/")[2]);
			var sSelectedKey = oEvent.getParameter("selectedItem").getKey();
			var existFlag = false;

			var data = this.currentHeader; //this.getView().getModel("AIWFLOC").getData();
			var aIntlAddr = data.intlAddr;
			for (var i = 0; i < aIntlAddr.length; i++) {
				if (i === sIntlIndex) {
					continue;
				}

				if (aIntlAddr[i].AdNation === sSelectedKey) {
					existFlag = true;
					g.createMessagePopover("Address Version already exists", "Error");
					g.currentObj.AdNation = "";
					oSource.setSelectedKey();
					// sap.m.MessageBox.show("Address Version already exists", {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {
					// 		g.currentObj.AdNation = "";
					// 		oSource.setSelectedKey();
					// 	}
					// });
					break;
				}
			}

			if (!existFlag) {
				g.currentObj.AdNation = oSource.getSelectedKey();
				g.currentObj.AdNationEnable = false;
				this.getView().getModel("intlAddrModel").setData(g.currentObj);
				// oSource.setEnabled(false);
			}
		},

		onItmDonePress: function (oEvent) {
			var sSourceId = oEvent.getSource().getId();

			if (sSourceId.indexOf("idBtnCheck") > -1) {
				this.validateCheck();
				return;
			}

			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			}
		},

		validateCheck: function () {
			var g = this;
			var sAIWData = this.currentHeader; //g.getView().getModel(g.oModelName).getData();
			var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
			var sPayload = {
				"ChangeRequestType": oCrType.crtype,
				"CrDescription": oCrType.desc,
				"IsDraft": "C",
				"Messages": [],
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

			if (this.viewName.indexOf("Floc") > -1) {
				var sFuncLoc = {
					"Tplnr": sAIWData.Functionallocation,
					"Txtmi": sAIWData.Flocdescription, // Floc Description
					"TplkzFlc": sAIWData.Strucindicator,
					"Tplxt": sAIWData.StrucIndicatorDesc,
					"EditMask": sAIWData.EditMask,
					"Hierarchy": sAIWData.Hierarchy,
					"Fltyp": sAIWData.Floccategory,
					"Flttx": sAIWData.FlocCategoryDesc,
					"Swerk": sAIWData.Maintplant,
					"Plantname": sAIWData.MaintplantDesc,
					"StorFloc": sAIWData.Location, // Location
					"Locationdesc": sAIWData.Locationdesc, // Location Description
					"Abckzfloc": sAIWData.Abckz,
					"Abctx": sAIWData.Abctx,
					"Bukrsfloc": sAIWData.Bukrs,
					"Butxt": sAIWData.Butxt,
					"City": sAIWData.City,
					"KostFloc": sAIWData.Kostl, // Cost Center
					"KokrFloc": sAIWData.Kokrs, // ccPart1
					"Contareaname": sAIWData.Mctxt, // Name
					"PlntFloc": sAIWData.Werks, // Planning Plant
					"Planningplantdes": sAIWData.Planningplantdes, // Planning Plant Description
					"Ingrp": sAIWData.Ingrp, // Planner Group
					"Plannergrpdesc": sAIWData.Innam, // Planner Group Description
					"Arbplfloc": sAIWData.Arbpl, // Work Center
					// "Workcenterdesc" : sAIWData.Ktext, // Plant Work Center
					"Wergwfloc": sAIWData.WcWerks, // Name
					"Gewrkfloc": sAIWData.MainArbpl, // Main Work Center
					// "MainWcDesc" : sAIWData.MainKtext, // Work center Plant
					"MainWcPlant": sAIWData.MainWerks, // Work Center Description
					"Tplma": sAIWData.SupFunctionallocation, // Sup FuncLoc
					"Supflocdesc": sAIWData.SupFlocdescription, // Sup FlocDescription
					"BeberFl": sAIWData.BeberFl, // Plant Section
					"Fing": sAIWData.Fing, // Person responsible
					"Tele": sAIWData.Tele, // Phone
					"Submtiflo": sAIWData.ConstrType, // Construction Type
					"Constdesc": sAIWData.ConstructionDesc, // Construction Description
					"Eqart": sAIWData.TechnicalObjectTyp, // TechnicalObjectTyp
					"Eartx": sAIWData.Description, // TechnicalObjectTyp Description
					"Stattext": sAIWData.Stattext, // System Status
					"StsmFloc": sAIWData.StsmEqui, // Status Profile
					"Statproftxt": sAIWData.StsmEquiDesc, // Status Profile Description
					"UstwFloc": sAIWData.UstwEqui, // Status with Status Number
					"UswoFloc": sAIWData.UswoEqui, // Status without Status Number
					"UstaFloc": sAIWData.UstaEqui, // User Status
					"Adrnri": sAIWData.Adrnri,
					"Deact": sAIWData.Deact
				};
				sPayload.FuncLoc.push(sFuncLoc);

				var sFLAddr = {
					"Funcloc": sAIWData.Functionallocation,
					"Title": sAIWData.TitleCode,
					"Name1": sAIWData.Name1,
					"Name2": sAIWData.Name2,
					"Name3": sAIWData.Name3,
					"Name4": sAIWData.Name4,
					"Sort1": sAIWData.Sort1,
					"Sort2": sAIWData.Sort2,
					"NameCo": sAIWData.NameCo,
					"PostCod1": sAIWData.PostCod1,
					"City1": sAIWData.City1,
					"Building": sAIWData.Building,
					"Floor": sAIWData.Floor,
					"Roomnum": sAIWData.Roomnum,
					"Strsuppl1": sAIWData.Strsuppl1,
					"Strsuppl2": sAIWData.Strsuppl2,
					"Strsuppl3": sAIWData.Strsuppl3,
					"Location": sAIWData.AddrLocation,
					"RPostafl": sAIWData.RefPosta,
					"Landx": sAIWData.Landx,
					"TimeZone": sAIWData.TimeZone,
					"RPostFl": sAIWData.Region,
					"Regiotxt": sAIWData.RegionDesc
				};
				sPayload.FLAddr.push(sFLAddr);

				var aIntlAddr = sAIWData.intlAddr;
				if (aIntlAddr) {
					for (var z = 0; z < aIntlAddr.length; z++) {
						sPayload.FLAddrI.push(aIntlAddr[z]);
					}
				}

				if (sAIWData.Floccategory === "L" && sAIWData.lam) {
					var sFLLAM = {
						"Funcloc": sAIWData.Functionallocation,
						"Lrpid": sAIWData.lam.Lrpid,
						"Strtptatr": sAIWData.lam.Strtptatr,
						"Endptatr": sAIWData.lam.Endptatr,
						"Length": (sAIWData.lam.Length).toString(),
						"LinUnit": sAIWData.lam.LinUnit,
						"Startmrkr": sAIWData.lam.Startmrkr,
						"Endmrkr": sAIWData.lam.Endmrkr,
						"Mrkdisst": sAIWData.lam.Mrkdisst,
						"Mrkdisend": sAIWData.lam.Mrkdisend,
						"MrkrUnit": sAIWData.lam.MrkrUnit
					};
					sPayload.FLLAM.push(sFLLAM);
				}

				var sFLClassList = sAIWData.classItems;
				if (sFLClassList) {
					if (sFLClassList.length > 0) {
						for (var b = 0; b < sFLClassList.length; b++) {
							var sFLClass = {
								"Funcloc": sAIWData.Functionallocation,
								"Classtype": sFLClassList[b].Classtype,
								"Class": sFLClassList[b].Class,
								"Clstatus1": sFLClassList[b].Clstatus1
							};
							sPayload.FLClass.push(sFLClass);
						}
					}
				}

				var sFLCharList = sAIWData.characteristics;
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

			if (this.viewName.indexOf("Equi") > -1) {
				var sEquipment = {
					"Herst": sAIWData.Herst, // Manufacturer
					"Equnr": sAIWData.Equnr,
					"Txtmi": sAIWData.Eqktx,
					//"Eqktx" : sAIWData.Eqktx,
					"Swerk": sAIWData.Maintplant,
					"Name1": sAIWData.MaintplantDesc,
					"TplnEilo": sAIWData.Tplnr,
					"Flocdescription": sAIWData.Pltxt,
					"Eqtyp": sAIWData.EquipmentCatogory,
					"Etytx": sAIWData.EquipCatgDescription,
					"Eqart": sAIWData.TechnicalObjectTyp, // TechnicalObjectTyp
					"Eartx": sAIWData.Description, // TechnicalObjectTyp Description
					"Typbz": sAIWData.Typbz, // Model Number
					"SubmEeqz": sAIWData.ConstrType, // Construction Type
					"Constdesc": sAIWData.ConstructionDesc, // Construction Description
					"BukrEilo": sAIWData.Bukrs,
					"Butxt": sAIWData.Butxt,
					"HequEeqz": sAIWData.SuperordinateEquip, // Superord. Equipment
					"SuperordEqDes": sAIWData.SuperordinateEquipDesc, // Superord. Equipment Description
					"TidnEeqz": sAIWData.TechIdNum, // techIndNo
					"KostEilo": sAIWData.Kostl, // Cost Center
					"KokrEilo": sAIWData.Kokrs, // ccPart1
					"Contareaname": sAIWData.Mctxt, // Name
					"StorEilo": sAIWData.Location,
					"Locationdesc": sAIWData.Locationdesc,
					"AbckEilo": sAIWData.Abckz,
					"Abctx": sAIWData.Abctx,
					"PplaEeqz": sAIWData.Werks, // Planning Plant
					"Planningplantdes": sAIWData.Planningplantdes, // Planning Plant Description
					"IngrEeqz": sAIWData.Ingrp, // Planner Group
					"Plannergrpdesc": sAIWData.Innam, // Planner Group Description
					"Serge": sAIWData.Serge, // manfSerNo
					"MapaEeqz": sAIWData.MapaEeqz, // partNum
					"Stattext": sAIWData.Stattext, // System Status
					"StsmEqui": sAIWData.StsmEqui, // Status Profile
					"Statproftxt": sAIWData.StsmEquiDesc, // Status Profile Description
					"UstwEqui": sAIWData.UstwEqui, // Status with Status Number
					"UswoEqui": sAIWData.UswoEqui, // Status without Status Number
					"UstaEqui": sAIWData.UstaEqui, // User Status
					"Deact": sAIWData.Deact,
					"Answt": sAIWData.Answt,
					"Ansdt": g._formatDate(sAIWData.Ansdt),
					"Waers": sAIWData.Waers, // Currency

					"ArbpEilo": sAIWData.Arbpl, // Work Center
					// "Workcenterdesc" : sAIWData.Ktext, // Plant Work Center
					"WorkCenterPlant": sAIWData.WcWerks, // Name
					"ArbpEeqz": sAIWData.MainArbpl, // Main Work Center
					// "MainWcDesc" : sAIWData.MainKtext, // Work Center Description
					"MainWcPlant": sAIWData.MainWerks, // Work center Plant

					"BebeEilo": sAIWData.BeberFl, // Plant Section
					"Fing": sAIWData.Fing, // Plant Section
					"Tele": sAIWData.Tele, // Plant Section
					"HeqnEeqz": sAIWData.EquipPosition, // Position
					"Adrnri": sAIWData.Adrnri,

					"Funcid": sAIWData.Funcid, // Config Control data
					"Frcfit": sAIWData.Frcfit,
					"Frcrmv": sAIWData.Frcrmv
				};
				sPayload.Equipment.push(sEquipment);

				var sEqPRT = {
					"Equi": sAIWData.Equnr,
					"PlanvPrt": sAIWData.PlanvPrt,
					"SteufPrt": sAIWData.SteufPrt,
					"KtschPrt": sAIWData.KtschPrt,
					"Ewformprt": sAIWData.Ewformprt,
					"SteufRef": sAIWData.SteufRef,
					"KtschRef": sAIWData.KtschRef,
					"EwformRef": sAIWData.EwformRef
				};
				sPayload.EqPRT.push(sEqPRT);

				if (sAIWData.EquipmentCatogory === "L" && sAIWData.lam) {
					var sEqLAM = {
						"Equi": sAIWData.Equnr,
						"Lrpid": sAIWData.lam.Lrpid,
						"Strtptatr": sAIWData.lam.Strtptatr,
						"Endptatr": sAIWData.lam.Endptatr,
						"Length": (sAIWData.lam.Length).toString(),
						"LinUnit": sAIWData.lam.LinUnit,
						"Startmrkr": sAIWData.lam.Startmrkr,
						"Endmrkr": sAIWData.lam.Endmrkr,
						"Mrkdisst": sAIWData.lam.Mrkdisst,
						"Mrkdisend": sAIWData.lam.Mrkdisend,
						"MrkrUnit": sAIWData.lam.MrkrUnit
					};
					sPayload.EqLAM.push(sEqLAM);
				}

				var sEqAddr = {
					"Equi": sAIWData.Equnr,
					"Title": sAIWData.TitleCode,
					"Name1": sAIWData.Name1,
					"Name2": sAIWData.Name2,
					"Name3": sAIWData.Name3,
					"Name4": sAIWData.Name4,
					"Sort1": sAIWData.Sort1,
					"Sort2": sAIWData.Sort2,
					"NameCo": sAIWData.NameCo,
					"PostCod1": sAIWData.PostCod1,
					"City1": sAIWData.City1,
					"Building": sAIWData.Building,
					"Floor": sAIWData.Floor,
					"Roomnum": sAIWData.Roomnum,
					"Strsuppl1": sAIWData.Strsuppl1,
					"Strsuppl2": sAIWData.Strsuppl2,
					"Strsuppl3": sAIWData.Strsuppl3,
					"Location": sAIWData.AddrLocation,
					"RefPosta": sAIWData.RefPosta,
					"Landx": sAIWData.Landx,
					"TimeZone": sAIWData.TimeZone,
					"RfePost": sAIWData.Region,
					"Regiotxt": sAIWData.RegionDesc
				};
				sPayload.EqAddr.push(sEqAddr);

				var aIntlAddr = sAIWData.intlAddr;
				if (aIntlAddr) {
					for (var z = 0; z < aIntlAddr.length; z++) {
						sPayload.EqAddrI.push(aIntlAddr[z]);
					}
				}

				var sEqClassList = sAIWData.classItems;
				if (sEqClassList) {
					if (sEqClassList.length > 0) {
						for (var e = 0; e < sEqClassList.length; e++) {
							var sEqClass = {
								"Equi": sAIWData.Equnr,
								"Classtype": sEqClassList[e].Classtype,
								"Class": sEqClassList[e].Class,
								"Clstatus1": sEqClassList[e].Clstatus1
							};
							sPayload.EqClass.push(sEqClass);
						}
					}
				}

				var sEqCharList = sAIWData.characteristics;
				if (sEqCharList) {
					if (sEqCharList.length > 0) {
						for (var f = 0; f < sEqCharList.length; f++) {
							var sEqVal = {
								"Equi": sAIWData.Equnr,
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

			this.getView().byId("idPageIntlAddr").setBusy(true);
			var oModel = this.getView().getModel();
			if (sPayload.FLAddrI.length > 0) {
				sPayload.FLAddrI = $.map(sPayload.FLAddrI, function (obj) {
					return $.extend(true, {}, obj);
				});
				for (var i = 0; i < sPayload.FLAddrI.length > 0; i++) {
					delete sPayload.FLAddrI[i].AdNationEnable;
				}
			}
			if (sPayload.EqAddrI.length > 0) {
				sPayload.EqAddrI = $.map(sPayload.EqAddrI, function (obj) {
					return $.extend(true, {}, obj);
				});
				for (var i = 0; i < sPayload.EqAddrI.length > 0; i++) {
					delete sPayload.EqAddrI[i].AdNationEnable;
				}
			}

			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("idPageIntlAddr").setBusy(false);
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
					g.getView().byId("idPageIntlAddr").setBusy(false);
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

		streetVH: function (oEvent) {
			var g = this;
			var oSource = oEvent.getSource();
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var settings = {
				title: g.getView().getModel("i18n").getProperty("STREET"),
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>STREET}"
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
								text: "{i18n>CITY_EXT}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>RGIN}"
							})
						]
					}),
					new sap.m.Column({
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
								text: "{i18n>CNTRY}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>STREET_NUM}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>STREET}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>CITY_NUM}"
							})
						]
					})
				],
				items: {
					path: "/StrtNameSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Street}"
							}),
							new sap.m.Text({
								text: "{CityName}"
							}),
							new sap.m.Text({
								text: "{CityExt}"
							}),
							new sap.m.Text({
								text: "{Region}"
							}),
							new sap.m.Text({
								text: "{Langu}"
							}),
							new sap.m.Text({
								text: "{Country}"
							}),
							new sap.m.Text({
								text: "{StrtCode}"
							}),
							new sap.m.Text({
								text: "{McStreet}"
							}),
							new sap.m.Text({
								text: "{CityCode}"
							})
						]
					})
				},
				confirm: function (E) {
					oJsonData.Streeti = E.getParameter("selectedItem").getCells()[0].getText();
					oJsonData.StreetiVS = "None";
					oJsonData.City1i = E.getParameter("selectedItem").getCells()[1].getText();
					oJsonData.City1iVS = "None";
					// oSource.setValue(E.getParameter("selectedItem").getCells()[0].getText());
					// oSource.setValueState("None");
					// oSource.setValueStateText("");
					oJsonModel.refresh();
				}
			};

			var sPath = "/StrtNameSet";
			var oFilters = [];
			var oModel = g.getView().getModel("valueHelp");
			var cells = [
				new sap.m.Text({
					text: "{Street}"
				}),
				new sap.m.Text({
					text: "{CityName}"
				}),
				new sap.m.Text({
					text: "{CityExt}"
				}),
				new sap.m.Text({
					text: "{Region}"
				}),
				new sap.m.Text({
					text: "{Langu}"
				}),
				new sap.m.Text({
					text: "{Country}"
				}),
				new sap.m.Text({
					text: "{StrtCode}"
				}),
				new sap.m.Text({
					text: "{McStreet}"
				}),
				new sap.m.Text({
					text: "{CityCode}"
				})
			];

			var strtSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Street", "StrtCode");
			strtSelectDialog.open();
			strtSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		cityVH: function (oEvent) {
			var g = this;
			var oSource = oEvent.getSource();
			// var sBindPath = oSource.getBindingInfo("value").binding.getContext().sPath;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var settings = {
				title: g.getView().getModel("i18n").getProperty("CITY"),
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [
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
								text: "{i18n>CITY_EXT}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>RGIN}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>CNTRY}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>CITY_NUM}"
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
								text: "{i18n>LANGUAGE}"
							})
						]
					})
				],
				items: {
					path: "/CitySet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{CityName}"
							}),
							new sap.m.Text({
								text: "{CityExt}"
							}),
							new sap.m.Text({
								text: "{Region}"
							}),
							new sap.m.Text({
								text: "{Country}"
							}),
							new sap.m.Text({
								text: "{CityCode}"
							}),
							new sap.m.Text({
								text: "{CityName}"
							}),
							new sap.m.Text({
								text: "{Langu}"
							})
						]
					})
				},
				confirm: function (E) {
					oJsonData.City1i = E.getParameter("selectedItem").getCells()[0].getText();
					oJsonData.City1iVS = "None";
					// oSource.setValue(E.getParameter("selectedItem").getCells()[0].getText());
					// oSource.setValueState("None");
					// oSource.setValueStateText("");
					oJsonModel.refresh();
				}
			};

			var sPath = "/CitySet";
			var oFilters = [];
			var oModel = g.getView().getModel("valueHelp");
			var cells = [
				new sap.m.Text({
					text: "{CityName}"
				}),
				new sap.m.Text({
					text: "{CityExt}"
				}),
				new sap.m.Text({
					text: "{Region}"
				}),
				new sap.m.Text({
					text: "{Country}"
				}),
				new sap.m.Text({
					text: "{CityCode}"
				}),
				new sap.m.Text({
					text: "{CityName}"
				}),
				new sap.m.Text({
					text: "{Langu}"
				})
			];

			var citySelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "CityName", "CityCode");
			citySelectDialog.open();
			citySelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		_changeStreetI: function (oEvent) {
			var g = this;
			var oSource = oEvent.getSource();
			// var sBindPath = oSource.getBindingInfo("value").binding.getContext().sPath;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var c = oJsonData.Streeti;
			// var c = oJsonModel.getProperty(sBindPath).Streeti;
			// var c = oSource.getValue();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var sPath = "/StrtNameSet";
				var oFilters = [new sap.ui.model.Filter("Street", "EQ", a)];
				var oModel = g.getView().getModel("valueHelp");
				var fnSuccess = function (d) {
					if (d.results.length > 0) {
						oJsonData.Streeti = d.results[0].Street;
						oJsonData.StreetiVS = "None";
						oJsonData.City1i = d.results[0].CityName;
						oJsonData.City1iVS = "None";
						// oJsonData.Streeti = d.results[0].Street;
						// oJsonData.StreetiVS = "None";
						// oSource.setValue(d.results[0].Street);
						// oSource.setValueState("None");
						// oSource.setValueStateText("");
					} else {
						// oJsonData.Streeti = "";
						oJsonData.StreetiVS = "Error";
						// oJsonData.StreetiVS = "Error";
						// oSource.setValue();
						// oSource.setValueState("Error");
						// oSource.setValueStateText("Invalid Entry");
					}
					oJsonModel.setData(oJsonData);
				};
				var fnError = function (e) {
					var b = JSON.parse(e.responseText);
					var d = b.error.message.value;
					// oJsonData.StreetiVS = "Error";
					oJsonData.StreetiVS = "Error";
					oJsonModel.setData(oJsonData);
					// oSource.setValueState("Error");
					// oSource.setValueStateText(d);
				};
				g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
			}
		},

		_changeCityI: function (oEvent) {
			var g = this;
			var oSource = oEvent.getSource();
			// var sBindPath = oSource.getBindingInfo("value").binding.getContext().sPath;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var c = oJsonData.City1i;
			// var c = oJsonModel.getProperty(sBindPath).City1i;
			// var c = oSource.getValue();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var sPath = "/CitySet";
				var oFilters = [new sap.ui.model.Filter("CityName", "EQ", a)];
				var oModel = g.getView().getModel("valueHelp");
				var fnSuccess = function (d) {
					if (d.results.length > 0) {
						oJsonData.City1i = d.results[0].CityName;
						oJsonData.City1iVS = "None";
						// oJsonData.City1i = d.results[0].CityName;
						// oJsonData.City1iVS = "None";
						// oSource.setValue(d.results[0].CityName);
						// oSource.setValueState("None");
						// oSource.setValueStateText("");
					} else {
						// oJsonData.City1i = "";
						// oJsonData.City1iVS = "Error";
						oJsonData.City1iVS = "Error";
						// oSource.setValue();
						// oSource.setValueState("Error");
						// oSource.setValueStateText("Invalid Entry");
					}
					oJsonModel.setData(oJsonData);
				};
				var fnError = function (e) {
					var b = JSON.parse(e.responseText);
					var d = b.error.message.value;
					// oJsonData.City1iVS = "Error";
					oJsonData.City1iVS = "Error";
					oJsonModel.setData(oJsonData);
					// oSource.setValueState("Error");
					// oSource.setValueStateText(d);
				};
				g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
			}
		},
	});
});