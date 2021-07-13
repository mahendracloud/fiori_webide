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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.ItemMaintenancePlan", {

		formatter: formatter,
		oAttach: [],

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ugiaiwui.mdg.aiw.request.view.DetailMaintenancePlan
		 */
		onInit: function () {
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			this.getRouter().getRoute("itemMpmi").attachPatternMatched(this._onObjectMatched, this);
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

			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});
			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
			this.oModelName = "itemDetailView";

			// this.oModelUpdateFlag = false;
			var lamFragmentId = this.getView().createId("lamFrag");
			this.lam = sap.ui.core.Fragment.byId(lamFragmentId, "lamSimpleForm");
			var lamAprv = this.getView().createId("lamAprvFrag");
			this.lamAprvSF = sap.ui.core.Fragment.byId(lamAprv, "lamSimpleForm");

			this.isLam();

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

		},

		isLam: function () {
			var g = this;
			var m = this.getView().getModel("valueHelp");

			m.read("/LAM_switchSet('')", {
				success: function (r, a) {
					g.lamSwitch = r.lam_switch;
				},
				error: function (err) {}
			});
		},

		attachModelEventHandlers: function (oModel) {
			oModel.attachPropertyChange(this.handlePropertyChanged, this);
		},

		handlePropertyChanged: function () {
			this.oModelUpdateFlag = true;
		},

		_onObjectMatched: function (oEvent) {
			this.mainRowIndex = decodeURIComponent(oEvent.getParameter("arguments").mainRowIndex);
			this.itemPath = decodeURIComponent(oEvent.getParameter("arguments").itemPath);

			var sIndex = this.itemPath;
			var iItemDetailModel = sap.ui.getCore().getModel("AIWMPMIDetail").getData();
			var itemDetailView = new sap.ui.model.json.JSONModel();
			itemDetailView.setData(iItemDetailModel.itemModel[sIndex]);

			var oItemData = itemDetailView.getData();
			this.getView().setModel(itemDetailView, this.oModelName);
			this.lam.setModel(itemDetailView, "AIWLAM");
			this.lam.setVisible(oItemData.LDVisible);
			this.lamAprvSF.setVisible(false);

			var aObjListitem = iItemDetailModel.ObjListItems;
			this.getView().setModel(new JSONModel(aObjListitem), "ObjListItemModel");
			var oFilter = [new sap.ui.model.Filter("Mitemnumb", "EQ", iItemDetailModel.itemModel[sIndex].Mitemnumb),
				new sap.ui.model.Filter("Warpl", "EQ", iItemDetailModel.Warpl)
			];
			var oTable = this.getView().byId("idObjectListItem");
			oTable.getBinding("items").filter(oFilter);

			// var alam = iItemDetailModel.lam;
			// var tempLam = {};
			// for(var i=0;i<alam.length;i++){
			// 	if(alam[i].Mitemnumb === iItemDetailModel.itemModel[sIndex].Mitemnumb){
			// 		tempLam = alam[i];
			// 	}
			// }
			// this.getView().setModel(new JSONModel(tempLam), "LamModel");

			this.strategy = oEvent.getParameter("arguments").strategy;
			this.cUnit = oEvent.getParameter("arguments").cUnit;
			this.getView().bindElement({
				path: sIndex,
				model: this.oModelName
			});

			this.viewName = oEvent.getParameter("arguments").viewName;

			if (this.viewName === "ChangeMpmi") {
				this.attachModelEventHandlers(itemDetailView);
			}

			if (this.viewName === "Approve") {
				this.lam.setVisible(false);
				this.lamAprvSF.setVisible(true);
				this.lamAprvSF.setModel(itemDetailView, "AIWLAM");
			}

			var oMainViewModel = new JSONModel();
			oMainViewModel.setData(sap.ui.getCore().getModel("mainView").getData());
			this.getView().setModel(oMainViewModel, "mainView");

			var sMplan = iItemDetailModel.Warpl;
			var sMPCat = iItemDetailModel.Mptyp;
			this.configMPITemFields(sMplan, sMPCat);

			var oApproveModel = new JSONModel([]);
			oApproveModel.setData(sap.ui.getCore().getModel("ApproveModel").getData());
			this.getView().setModel(oApproveModel, "ApproveModel");

			// if (this.viewName === "ChangeMpmi") {
			// 	var sCrStatus = oEvent.getParameter("arguments").CrStatus;
			// 	if(sCrStatus === "true") {
			// 		sObj.enabled = false;
			// 	} else {
			// 		sObj.enabled = true;
			// 	}
			// 	oMainViewModel.setData(sObj);
			// 	this.getView().setModel(oMainViewModel, "mainView");
			// }
			// if (this.viewName === "Approve") {
			// }

			this.category = oEvent.getParameter("arguments").maintCat;
			if (this.category === "EA" || this.category === "PM") {
				oItemData.QmartLBL = false;
				oItemData.QmartVis = false;
				oItemData.nTypetxtVis = false;
			} else if (this.category === "NO") {
				oItemData.AuartLBL = false;
				oItemData.AuartVis = false;
				oItemData.oTypeTxtVis = false;
			}

			var multiCycle = oEvent.getParameter("arguments").multiCycle;
			if (multiCycle === "true") {
				oItemData.CycleseqLBL = true;
				oItemData.CycleseqVis = true;
			}

			this.system = oEvent.getParameter("arguments").sys;
			if (this.system === "true") {
				oItemData.AsmblyObMaxLength = 40;
			} else {
				oItemData.AsmblyObMaxLength = 18;
			}

			var cData = iItemDetailModel.cycleModel;
			var cycSetArr = [];
			if (cData && cData.length > 0) {
				for (var i = 0; i < cData.length; i++) {
					var obj = {};
					if (cData[i].Cycleseqi !== "") {
						obj.Cycleseqi = cData[i].Cycleseqi;
						cycSetArr.push(obj);
					}
				}
			}
			this.cycleSeq = cycSetArr;

			if (oItemData.Cycleseq === "") {
				oItemData.Cycleseq = "00";
			}
			itemDetailView.setData(oItemData);

			// this.attachModelEventHandlers(itemDetailView);
		},

		configMPITemFields: function (mplan, mpcat) {
			var g = this;
			var configModel = new JSONModel();
			var configData = {};
			var M = this.getView().getModel();
			var oFilter = [
				new sap.ui.model.Filter("Mitemnumb", "EQ", mplan),
				new sap.ui.model.Filter("MaintCategory", "EQ", mpcat)
			];
			M.read("/MpFieldConfigSet", {
				filters: oFilter,
				success: function (d) {
					var data = d.results[0];
					data.Funcloc === "H" ? configData.visFloc = false : configData.visFloc = true;
					data.Equipment === "H" ? configData.visEqui = false : configData.visEqui = true;
					data.Assembly === "H" ? configData.visAsbly = false : configData.visAsbly = true;
					data.Serialnr === "H" ? configData.visSerNum = false : configData.visSerNum = true;
					data.Sermaterial === "H" ? configData.visMat = false : configData.visMat = true;
					data.Deviceid === "H" ? configData.visDevData = false : configData.visDevData = true;
					configModel.setData(configData);
					g.getView().setModel(configModel, "configModel");
				},
				error: function (err) {}
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
		onNavBack: function () {
			var g = this;
			var value = g.getView().getModel("i18n").getProperty("DATA_LOSS");
			sap.m.MessageBox.show(value, {
				title: "Confirmation",
				icon: sap.m.MessageBox.Icon.QUESTION,
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === "YES") {
						var itDetmodel = new sap.ui.model.json.JSONModel();
						var itDetailViewData = g.getView().getModel(g.oModelName).getData();
						itDetailViewData = g.displayObject();
						itDetmodel.setData(itDetailViewData);
						// g.getView().setModel(itDetmodel, "itemDetailView");
						window.history.go(-1);
					}
				}
			});
		},

		displayObject: function () {
			return {
				Mitemnumb: "", // maint item 
				Pstxt: "", // maint item desc
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

				// Approve fields				
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
				lam: {
					Mitemnumb: "", // maint item
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
		},

		onCancelPress: function () {
			var value = this.getView().getModel("i18n").getProperty("DATA_LOSS");
			var g = this;
			sap.m.MessageBox.show(value, {
				title: "Confirmation",
				icon: sap.m.MessageBox.Icon.QUESTION,
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === "YES") {
						var itDetmodel = new sap.ui.model.json.JSONModel();
						var itDetailViewData = g.getView().getModel(g.oModelName).getData();
						itDetailViewData = g.displayObject();
						itDetmodel.setData(itDetailViewData);
						// g.getView().setModel(itDetmodel, "itemDetailView");
						window.history.go(-1);
					}
				}
			});
		},

		// onAfterRendering: function() {
		// 	if (sap.m.ComboBox.prototype.onAfterRendering) {
		// 		$("#" + this.byId("cycleSetSeqIt").sId + "-inner").prop("readOnly", true);
		// 	}
		// },

		valueHelpFunSelect: function (oEvent) {
			var sPath = oEvent.getSource().getBindingInfo("value").binding.sPath;

			if (sPath.indexOf("/Ingrp") !== -1) {
				ValueHelpRequest.valueHelpFunPlGrp(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Cycleseq") !== -1) {
				ValueHelpRequest.valueHelpCycleSetSeq(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/AsmblyOb") !== -1) {
				ValueHelpRequest.valueHelpAssembly(oEvent, this);
			} else if (sPath.indexOf("/Werks") !== -1) {
				ValueHelpRequest.valueHelpFunPlanPlant(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Auart") !== -1) {
				ValueHelpRequest.valueHelpFunOrderType(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Qmart") !== -1) {
				ValueHelpRequest.valueHelpFunNotifType(oEvent, this);
			} else if (sPath.indexOf("/ArbpMi") !== -1) {
				ValueHelpRequest.valueHelpFunMpmiMainWc(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/WergwMi") !== -1) {
				ValueHelpRequest.valueHelpFunMpmiMainWcPlnt(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Tplnr") !== -1) {
				ValueHelpRequest.valueHelpFunFloc(oEvent, this);
			} else if (sPath.indexOf("/Equnr") !== -1) {
				ValueHelpRequest.valueHelpFunEquipment(oEvent, this);
			} else if (sPath.indexOf("/PlntyMi") !== -1) {
				ValueHelpRequest.TLTypeVH(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/PlnnrMi") !== -1) {
				ValueHelpRequest.TLGroupVH(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/PlnalMi") !== -1) {
				ValueHelpRequest.TLCounterVH(oEvent.getSource().getModel(this.oModelName).getData(), this);
			}
		},

		readCounter: function (f, g) {
			var sPath = "/DeriveMsptSet";
			var oModel = g.getView().getModel();
			var oFilters = [];

			if (f.Equnr !== "" && f.Tplnr === "") {
				oFilters = [new sap.ui.model.Filter("Equnr", "EQ", f.Equnr), new sap.ui.model.Filter("Unit", "EQ", g.cUnit)];
			} else if (f.Equnr === "" && f.Tplnr !== "") {
				oFilters = [new sap.ui.model.Filter("Floc", "EQ", f.Tplnr), new sap.ui.model.Filter("Unit", "EQ", g.cUnit)];
			} else if (f.Equnr !== "" && f.Tplnr !== "") {
				oFilters = [new sap.ui.model.Filter("Equnr", "EQ", f.Equnr), new sap.ui.model.Filter("Unit", "EQ", g.cUnit)];
			}

			// var settings = {
			// 	title: g.getView().getModel("i18n").getProperty("MP_CTR"),
			// 	noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
			// 	columns: [new sap.m.Column({
			// 			header: [
			// 				new sap.m.Text({
			// 					text: "{i18n>MEASPOINT_TXT}"
			// 				})
			// 			]
			// 		}), new sap.m.Column({
			// 			demandPopin: true,
			// 			minScreenWidth: "Tablet",
			// 			header: [
			// 				new sap.m.Text({
			// 					text: "{i18n>DESCRIPTION}"
			// 				})
			// 			]
			// 		}),
			// 		new sap.m.Column({
			// 			demandPopin: true,
			// 			minScreenWidth: "Tablet",
			// 			header: [
			// 				new sap.m.Text({
			// 					text: "{i18n>MSPT_UNIT}"
			// 				})
			// 			]
			// 		}),
			// 		new sap.m.Column({
			// 			demandPopin: true,
			// 			minScreenWidth: "Tablet",
			// 			visible: false,
			// 			header: [
			// 				new sap.m.Text({
			// 					text: "{i18n>COUNT_READ}"
			// 				})
			// 			]
			// 		})
			// 	],
			// 	items: {
			// 		path: "/",
			// 		template: new sap.m.ColumnListItem({
			// 			type: "Active",
			// 			unread: false,
			// 			cells: [
			// 				new sap.m.Text({
			// 					text: "{Point}"
			// 				}),
			// 				new sap.m.Text({
			// 					text: "{Description}"
			// 				}),
			// 				new sap.m.Text({
			// 					text: "{Unit}"
			// 				}),
			// 				new sap.m.Text({
			// 					text: "{Reading}"
			// 				})
			// 			]
			// 		})
			// 	},
			// 	confirm: function (E) {
			// 		g.refCounter = E.getParameter("selectedItem").getCells()[0].getText();
			// 		g.refUnit = E.getParameter("selectedItem").getCells()[2].getText();
			// 		g.reading = E.getParameter("selectedItem").getCells()[3].getText();
			// 	}
			// };

			// var cells = [
			// 	new sap.m.Text({
			// 		text: "{Point}"
			// 	}),
			// 	new sap.m.Text({
			// 		text: "{Description}"
			// 	}),
			// 	new sap.m.Text({
			// 		text: "{Unit}"
			// 	}),
			// 	new sap.m.Text({
			// 		text: "{Reading}"
			// 	})
			// ];

			// var crSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Point", "Description");
			// crSelectDialog.open();
			// crSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");

			var fnSuccess = function (r) {
				if (r.results.length > 0) {
					g.displayCounter(r.results, g);
				}
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters);
		},

		displayCounter: function (d, g) {
			var countrResults;
			if (countrResults === undefined) {
				var crSelectDialog = new sap.m.TableSelectDialog({
					title: g.getView().getModel("i18n").getProperty("MP_CTR"),
					noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
					columns: [new sap.m.Column({
							header: [
								new sap.m.Text({
									text: "Measuring Point"
								})
							]
						}), new sap.m.Column({
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
									text: "Measuring Point Unit"
								})
							]
						}),
						new sap.m.Column({
							demandPopin: true,
							minScreenWidth: "Tablet",
							visible: false,
							header: [
								new sap.m.Text({
									text: "Counter Reading"
								})
							]
						})
					],
					items: {
						path: "/",
						template: new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Point}"
								}),
								new sap.m.Text({
									text: "{Description}"
								}),
								new sap.m.Text({
									text: "{Unit}"
								}),
								new sap.m.Text({
									text: "{Reading}"

								})
							]
						})
					},
					confirm: function (E) {
						g.refCounter = E.getParameter("selectedItem").getCells()[0].getText();
						g.refUnit = E.getParameter("selectedItem").getCells()[2].getText();
						g.reading = E.getParameter("selectedItem").getCells()[3].getText();
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Point", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});

				var e = new sap.ui.model.json.JSONModel();
				e.setData(d);
				crSelectDialog.setModel(e);
				var I = crSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			crSelectDialog.open();
		},

		readPlantData: function (f, g) {
			var oModel = g.getView().getModel();
			var sPath = "/MPItemSet";
			var oFilters;
			if (f.Equnr !== "" && f.Tplnr === "") {
				oFilters = [new sap.ui.model.Filter("Equnr", "EQ", f.Equnr)];
			} else if (f.Equnr !== "" && f.Tplnr !== "") {
				oFilters = [new sap.ui.model.Filter("Equnr", "EQ", f.Equnr)];
			} else if (f.Equnr === "" && f.Tplnr !== "") {
				oFilters = [new sap.ui.model.Filter("TplnrMi", "EQ", f.Tplnr)];
			}

			var urlParameters = {
				"$expand": "MPItemToPlanningData"
			};
			var fnSuccess = function (r) {
				if (r.results.length > 0) {
					var res = r.results[0].MPItemToPlanningData.results[0];
					f.Werks = res.PlntMi;
					f.Planningplantdes = res.Planningplantdes;
					f.Ingrp = res.IngrpMi;
					f.Innam = res.Plannergrpdesc;
					f.ArbpMi = res.ArbpMi;
					f.WergwMi = res.WergwMi;
					g.getView().getModel(g.oModelName).refresh();
				}
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError, oFilters, urlParameters);
		},

		readRefObject: function (f, g) {
			var sPath = "/MPRefObjSet('" + f.Equnr + "')";
			var oModel = g.getView().getModel();
			var fnSuccess = function (d) {
				f.Tplnr = d.Tplnrmi;
				f.Pltxt = d.Flocdesc;
				g.getView().getModel(g.oModelName).refresh();

				if (f.Equnr !== "" && f.Tplnr === "") {
					g.readPlantData(f, g);
				} else if (f.Equnr !== "" && f.Tplnr !== "") {
					g.readPlantData(f, g);
				} else if (f.Equnr === "" && f.Tplnr !== "") {
					g.readPlantData(f, g);
				}
				if (g.strategy === "PERF" || g.strategy === "singlePerf") {
					g.readCounter(f, g);
				}
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError);
		},

		handleClose: function (oEvent) {
			var g = this;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var f = oEvent.getSource().getModel(g.oModelName).getData();
			if (oSelectedItem) {
				if (g.inputId.indexOf("Item_FunctionalLoc") !== -1) {
					f.TplnrVS = "None";
					f.TplnrVST = "";
					f.Tplnr = oEvent.getParameter("selectedItem").getProperty("title");
					f.Pltxt = oEvent.getParameter("selectedItem").getProperty("description");
					oEvent.getSource().getBinding("items").filter([]);
					g.getView().getModel(g.oModelName).refresh();

					if (f.Equnr !== "" && f.Tplnr === "") {
						g.readPlantData(f, g);
					} else if (f.Equnr !== "" && f.Tplnr !== "") {
						g.readPlantData(f, g);
					} else if (f.Equnr === "" && f.Tplnr !== "") {
						g.readPlantData(f, g);
					}

					if (g.strategy === "PERF" || g.strategy === "singlePerf") {
						g.readCounter(f, g);
					}
				}
				if (g.inputId.indexOf("Item_Equipment") !== -1) {
					f.Equnr = oEvent.getParameter("selectedItem").getProperty("title");
					f.Eqktx = oEvent.getParameter("selectedItem").getProperty("description");
					f.EqunrVS = "None";
					f.EqunrVST = "";
					g.getView().getModel(g.oModelName).refresh();

					g.readRefObject(f, g);
					oEvent.getSource().getBinding("items").filter([]);
				}
			}
		},

		onFlocChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Tplnr;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Tplnr = "";
				oEvent.getSource().getModel(g.oModelName).getData().Pltxt = "";

				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				oItem.enableLoc = true;
				oItem.SwerkMil = "";
				oItem.SwerkMilVS = "None";
				oItem.Name1 = "";
				oItem.StortMil = "";
				oItem.StortMilVS = "None";
				oItem.Locationdesc = "";
				oItem.MsgrpIl = "";
				oItem.MsgrpIlVS = "None";
				oItem.BeberMil = "";
				oItem.BeberMillVS = "None";
				oItem.Fing = "";
				oItem.ArbplIl = "";
				oItem.ArbplIlVS = "None";
				oItem.Workcenterdesc = "";
				oItem.AbckzIl = "";
				oItem.AbckzIlVS = "None";
				oItem.Abctx = "";
				oItem.EqfnrIl = "";
				oItem.EqfnrIlVS = "None";
				oItem.BukrsMil = "";
				oItem.Butxt = "";
				oItem.City = "";
				oItem.BukrsMilVS = "None";
				oItem.Anln1Mil = "";
				oItem.Txt50 = "";
				oItem.Anln1MilVS = "None";
				oItem.Anln2Mil = "";
				oItem.Anln2MilVS = "None";
				oItem.GsberIl = "";
				oItem.Gtext = "";
				oItem.GsberIlVS = "None";
				oItem.KostlMil = "";
				oItem.Contareaname = "";
				oItem.KostlMilVS = "None";
				oItem.KokrsMil = "";
				oItem.Posid = "";
				oItem.Post1 = "";
				oItem.PosidVS = "None";
				oItem.AufnrIl = "";
				oItem.SettleOrdDesc = "";
				oItem.AufnrIlVS = "None";
				itemModel.setData(oItem);
			} else {
				var sExistFlag = false;
				var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						if (oModelData[i].Functionallocation === sValue.toUpperCase()) {
							oEvent.getSource().setValue(sValue.toUpperCase());
							oEvent.getSource().getModel(g.oModelName).getData().Pltxt = oModelData[i].Flocdescription;
							sExistFlag = true;
							break;
						}
					}
				}
				var sEqunr = oEvent.getSource().getModel(g.oModelName).getData().Equnr;
				if (sEqunr !== "" || sEqunr !== undefined) {
					oEvent.getSource().getModel(g.oModelName).getData().Equnr = "";
					oEvent.getSource().getModel(g.oModelName).getData().Eqktx = "";
				}
				if (sExistFlag) {
					g._itemViewData();
					g.fetchData(g.oModelName, parseInt(g.mainRowIndex), parseInt(g.itemPath));
				} else {
					ValueHelpRequest._changeFunctionalLocation(oEvent, g);
				}
			}
		},

		orderTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Auart;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Auart = "";
				oEvent.getSource().getModel(g.oModelName).getData().oTypeTxt = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onOrderTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Auart;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Auart = "";
				oEvent.getSource().getModel(g.oModelName).getData().oTypeTxt = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().Auart = sValue.toUpperCase();
				ValueHelpRequest._changeOrderType(oEvent.getSource().getModel(g.oModelName).getData(), g);
			}
		},

		notifTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Qmart;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Qmart = "";
				oEvent.getSource().getModel(g.oModelName).getData().nTypeTxt = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onNotifTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Qmart;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Qmart = "";
				oEvent.getSource().getModel(g.oModelName).getData().nTypeTxt = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().Qmart = sValue.toUpperCase();
				ValueHelpRequest._changeNotifType(oEvent, g);
			}
		},

		mainWcChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().ArbpMi;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().ArbpMi = "";
				oEvent.getSource().getModel(g.oModelName).getData().WergwMi = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onMainWcChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().ArbpMi;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().ArbpMi = "";
				oEvent.getSource().getModel(g.oModelName).getData().WergwMi = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				var lData = false;
				if (sap.ui.getCore().getModel("AIWListWCModel")) {
					var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].wc.toUpperCase() === sValue.toUpperCase()) {
								oEvent.getSource().setValue(sValue.toUpperCase());
								// oEvent.getSource().getModel(g.oModelName).getData().Ktext = oModelData[i].wcDesc;
								oEvent.getSource().getModel(g.oModelName).getData().WergwMi = oModelData[i].plant;
								lData = true;
							}
						}
					}
				}

				if (lData === true) {
					g.getView().getModel(g.oModelName).refresh();
					return;
				} else {
					ValueHelpRequest._changeMpmiMainWc(oEvent.getSource().getModel(g.oModelName).getData(), g);
				}
			}
		},

		onMainWcPlntChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().WergwMi;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().WergwMi = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().WergwMi = sValue.toUpperCase();
				ValueHelpRequest._changeMpmiMainWcPlnt(oEvent.getSource().getModel(g.oModelName).getData(), g);
			}
		},

		equipmentChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Equnr;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Equnr = "";
				oEvent.getSource().getModel(g.oModelName).getData().Eqktx = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onEquipmentChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Equnr;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Equnr = "";
				oEvent.getSource().getModel(g.oModelName).getData().Eqktx = "";

				var itemModel = g.getView().getModel(g.oModelName);
				var oItem = itemModel.getData();
				oItem.enableLoc = true;
				oItem.SwerkMil = "";
				oItem.SwerkMilVS = "None";
				oItem.Name1 = "";
				oItem.StortMil = "";
				oItem.StortMilVS = "None";
				oItem.Locationdesc = "";
				oItem.BeberMil = "";
				oItem.BeberMillVS = "None";
				oItem.MsgrpIl = "";
				oItem.MsgrpIlVS = "None";
				oItem.Fing = "";
				oItem.ArbplIl = "";
				oItem.ArbplIlVS = "None";
				oItem.Workcenterdesc = "";
				oItem.AbckzIl = "";
				oItem.AbckzIlVS = "None";
				oItem.Abctx = "";
				oItem.EqfnrIl = "";
				oItem.EqfnrIlVS = "None";
				oItem.BukrsMil = "";
				oItem.Butxt = "";
				oItem.City = "";
				oItem.BukrsMilVS = "None";
				oItem.Anln1Mil = "";
				oItem.Txt50 = "";
				oItem.Anln1MilVS = "None";
				oItem.Anln2Mil = "";
				oItem.Anln2MilVS = "None";
				oItem.GsberIl = "";
				oItem.Gtext = "";
				oItem.GsberIlVS = "None";
				oItem.KostlMil = "";
				oItem.Contareaname = "";
				oItem.KostlMilVS = "None";
				oItem.KokrsMil = "";
				oItem.Posid = "";
				oItem.Post1 = "";
				oItem.PosidVS = "None";
				oItem.AufnrIl = "";
				oItem.SettleOrdDesc = "";
				oItem.AufnrIlVS = "None";
				itemModel.setData(oItem);
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				var lData = false;
				if (sap.ui.getCore().getModel("AIWEQUI")) {
					var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].Equnr === sValue.toUpperCase()) {
								oEvent.getSource().setValue(sValue.toUpperCase());
								oEvent.getSource().getModel(g.oModelName).getData().Eqktx = oModelData[i].Eqktx;
								lData = true;
							}
						}
					}
				}

				var sTplnr = oEvent.getSource().getModel(g.oModelName).getData().Tplnr;
				if (sTplnr !== "" || sTplnr !== undefined) {
					oEvent.getSource().getModel(g.oModelName).getData().Tplnr = "";
					oEvent.getSource().getModel(g.oModelName).getData().Pltxt = "";
				}
				if (lData === true) {
					g._itemViewData();
					g.fetchData(g.oModelName, parseInt(g.mainRowIndex), parseInt(g.itemPath));
					return;
				} else {
					ValueHelpRequest._changeEquiment(oEvent, g);
				}
			}
		},

		_itemViewData: function () {
			var g = this;
			var oItemModel = sap.ui.getCore().getModel("AIWMPMIDetail").getData();
			var oItemData = oItemModel.itemModel;
			var index = parseInt(g.itemPath.substr(-1));
			var iItemViewData = g.getView().getModel(g.oModelName).getData();

			oItemData[index].Mitemnumb = iItemViewData.Mitemnumb; // maint item 
			oItemData[index].Pstxt = iItemViewData.Pstxt; // maint item desc
			oItemData[index].Cycleseq = iItemViewData.Cycleseq;
			oItemData[index].Tplnr = iItemViewData.Tplnr; // floc
			oItemData[index].Pltxt = iItemViewData.Pltxt; // floc desc
			oItemData[index].Equnr = iItemViewData.Equnr; // equip
			oItemData[index].Eqktx = iItemViewData.Eqktx; // equip desc
			oItemData[index].AsmblyOb = iItemViewData.AsmblyOb; // assembly
			// oItemData[index].Assemblydesc = iItemViewData.Assemblydesc; // assembly
			oItemData[index].Werks = iItemViewData.Werks; // planning plant
			oItemData[index].Planningplantdes = iItemViewData.Planningplantdes; // planning plant desc
			oItemData[index].Auart = iItemViewData.Auart; // order type 
			oItemData[index].oTypeTxt = iItemViewData.oTypeTxt; // order type desc
			oItemData[index].Qmart = iItemViewData.Qmart; // notif type
			oItemData[index].nTypeTxt = iItemViewData.nTypeTxt; // notif type desc
			oItemData[index].ArbpMi = iItemViewData.ArbpMi; // main wc
			oItemData[index].WergwMi = iItemViewData.WergwMi; // main wc desc
			oItemData[index].Ingrp = iItemViewData.Ingrp; // planner grp
			oItemData[index].Innam = iItemViewData.Innam; // planner grp desc

			if (g.strategy === "PERF") {
				oItemModel.Mpcycleno = g.refCounter;
				if (oItemModel.Szaeh === "") {
					oItemModel.Szaeh = g.reading;
				}

				var mId = g.getView().getParent()._pageStack[0].id;
				sap.ui.getCore().byId(mId).oController.counterUnit = g.refUnit;
			} else if (g.strategy === "singlePerf") {
				// oItemModel.cycleModel[0].Point = g.refCounter;
				// oItemModel.cycleModel[0].PointVS = "None";

				if (oItemModel.Szaeh === "") {
					oItemModel.Szaeh = g.reading;
				}
			}

			sap.ui.getCore().getModel("AIWMPMIDetail").setProperty("/itemModel", oItemData);
			sap.ui.getCore().getModel("AIWMPMI").getProperty("/" + index).itemModel = oItemData;
		},

		_changeEquiment: function (f, g) {
			var c = f.Equnr;
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//var q = "/EquiAssestVHSet?$filter=" + jQuery.sap.encodeURL("Equnr eq '" + c + "'");
				var sPath = "/RefObjSet('" + c + "')";
				var oModel = g.getView().getModel();
				var fnSuccess = function (d) {
					if (d) {
						f.Equnr = a;
						f.Eqktx = d.Equipdesc;
						f.Tplnr = d.Tplnrmi;
						f.Pltxt = d.Flocdesc;
						if (c !== "" && f.Tplnr === "") {
							g.readPlantData(f, g);
						} else if (c !== "" && f.Tplnr !== "") {
							g.readPlantData(f, g);
						} else if (c === "" && f.Tplnr !== "") {
							g.readPlantData(f, g);
						}
						if (g.strategy === "PERF" || g.strategy === "singlePerf") {
							g.readCounter(f, g);
						}
					} else {
						f.Equnr = "";
						f.Eqktx = "";
						f.EqunrVS = "Error";
						f.EqunrVST = "Invalid Entry";
						g.getView().getModel(g.oModelName).refresh();
					}
				};
				var fnError = function (e) {
					var b = JSON.parse(e.response.body);
					var d = b.error.message.value;
					f.EqunrVS = "Error";
					f.EqunrVST = d;
					g.getView().getModel(g.oModelName).refresh();
				};
				g._readData(sPath, oModel, fnSuccess, fnError);
			} else {
				f.Equnr = a;
				g.getView().getModel(g.oModelName).refresh();
			}
		},

		onAssemblyChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue !== "" || sValue !== undefined) {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeAssembly(oEvent, g);
			}
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel(this.oModelName),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,

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
				oViewModel = this.getModel(this.oModelName),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
		},

		onDonePress: function (oEvent) {
			var sSourceId = oEvent.getSource().getId();
			if (this.viewName !== "Approve") {
				if (this.oModelUpdateFlag) {
					sap.ui.getCore().getModel("AIWMPMIStatus").getData().oModelUpdateFlag = true;
				}
				var oItemModel = sap.ui.getCore().getModel("AIWMPMIDetail").getData();
				var oItemData = oItemModel.itemModel;
				var index = parseInt(this.itemPath.substr(-1));
				var iItemViewData = this.getView().getModel(this.oModelName).getData();

				oItemData[index].Mitemnumb = iItemViewData.Mitemnumb; // maint item 
				oItemData[index].Pstxt = iItemViewData.Pstxt; // maint item desc
				oItemData[index].Cycleseq = iItemViewData.Cycleseq;
				oItemData[index].Tplnr = iItemViewData.Tplnr; // floc
				oItemData[index].Pltxt = iItemViewData.Pltxt; // floc desc
				oItemData[index].Equnr = iItemViewData.Equnr; // equip
				oItemData[index].Eqktx = iItemViewData.Eqktx; // equip desc
				oItemData[index].AsmblyOb = iItemViewData.AsmblyOb; // assembly
				// oItemData[index].Assemblydesc = iItemViewData.Assemblydesc; // assembly
				oItemData[index].Werks = iItemViewData.Werks; // planning plant
				oItemData[index].Planningplantdes = iItemViewData.Planningplantdes; // planning plant desc
				oItemData[index].Auart = iItemViewData.Auart; // order type 
				oItemData[index].oTypeTxt = iItemViewData.oTypeTxt; // order type desc
				oItemData[index].Qmart = iItemViewData.Qmart; // notif type
				oItemData[index].nTypeTxt = iItemViewData.nTypeTxt; // notif type desc
				oItemData[index].ArbpMi = iItemViewData.ArbpMi; // main wc
				oItemData[index].WergwMi = iItemViewData.WergwMi; // main wc desc
				oItemData[index].Ingrp = iItemViewData.Ingrp; // planner grp
				oItemData[index].Innam = iItemViewData.Innam; // planner grp desc
				oItemData[index].PlntyMi = iItemViewData.PlntyMi; // TL Type
				oItemData[index].PlnnrMi = iItemViewData.PlnnrMi; // TL Group
				oItemData[index].PlnalMi = iItemViewData.PlnalMi; // TL Counter
				oItemData[index].LDVisible = this.lam.getVisible();

				if (this.strategy === "PERF") {
					oItemModel.Mpcycleno = this.refCounter;
					if (oItemModel.Szaeh === "") {
						oItemModel.Szaeh = this.reading;
					}

					var mId = this.getView().getParent()._pageStack[0].id;
					sap.ui.getCore().byId(mId).oController.counterUnit = this.refUnit;
				} else if (this.strategy === "singlePerf") {
					// oItemModel.cycleModel[0].Point = this.refCounter;
					// oItemModel.cycleModel[0].PointVS = "None";

					if (oItemModel.Szaeh === "") {
						oItemModel.Szaeh = this.reading;
					}
				}

				sap.ui.getCore().getModel("AIWMPMIDetail").setProperty("/itemModel", oItemData);

				var mObjListItem = this.getView().getModel("ObjListItemModel");
				if (mObjListItem) {
					var aObjListItem = mObjListItem.getData();
					var PLIFlag = true;
					for (var i = 0; i < aObjListItem.length; i++) {
						if (aObjListItem[i].Warpl === oItemModel.Warpl && aObjListItem[i].Mitemnumb === oItemData[index].Mitemnumb && (aObjListItem[i].MatnrObjState ===
								"Error" || aObjListItem[i].EquiObjState ===
								"Error" || aObjListItem[i].FlocObjState === "Error" || aObjListItem[i].AsmblyObState === "Error")) {
							PLIFlag = false;
							break;
						}
					}

					if (!PLIFlag) {
						this.invokeMessage(this.OLIMessage);
						return;
					}

					sap.ui.getCore().getModel("AIWMPMIDetail").setProperty("/ObjListItems", aObjListItem);
				}

				if (sSourceId.indexOf("idBtnCheck") > -1) {
					this.validateCheck();
					return;
				}
			}
			window.history.go(-1);
		},

		validateCheck: function () {
			var g = this;
			var sAIWData = sap.ui.getCore().getModel("AIWMPMIDetail").getData();
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

			this.getView().byId("itemDetailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("itemDetailPage").setBusy(false);
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
					g.getView().byId("itemDetailPage").setBusy(false);
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

		onObjListItmRowSelect: function (oEvent) {
			var g = this;
			var selectedRows = oEvent.getSource().getSelectedItems().length;
			if (selectedRows > 0) {
				this.getView().byId("idObjListItmDelete").setEnabled(true);
			} else {
				this.getView().byId("idObjListItmDelete").setEnabled(false);
			}
		},

		onTLTypeChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			oEvent.getSource().setValue(sValue.toUpperCase());
			ValueHelpRequest._changeTLType(oEvent, g);
		},

		onTLGroupChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			oEvent.getSource().setValue(sValue.toUpperCase());
			ValueHelpRequest._changeTLGroup(oEvent, g);
		},

		onTLCounterChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			oEvent.getSource().setValue(sValue.toUpperCase());
			ValueHelpRequest._changeTLCounter(oEvent, g);
		},

		addObjListItmRow: function () {
			var a = sap.ui.getCore().getModel("AIWMPMIDetail").getData();
			var oItemData = this.getView().getModel(this.oModelName).getData();
			var oListItem = {
				Mitemnumb: oItemData.Mitemnumb,
				Warpl: a.Warpl,
				UiiObj: "",
				SernrObj: "",
				MatnrObj: "",
				Matnrtxt: "",
				EquiObj: "",
				Equnrtxt: "",
				FlocObj: "",
				Tplnrtxt: "",
				AsmblyOb: "",
				Bautltxt: "",
				Enable: true
			};
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var oObjListItemData = mObjListItem.getData();
			oObjListItemData.push(oListItem);
			mObjListItem.setData(oObjListItemData);
		},

		onOLIMaterialVH: function (oEvent) {
			var g = this;
			var oView = this.getView();
			// var sBindingProperty = oEvent.getSource().mBindingInfos.value.binding.sPath;
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			sPath = parseInt(sPath.split("/")[1]);
			var bindProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var aObjListItem = mObjListItem.getData();

			var settings = {
				title: this.getView().getModel("i18n").getProperty("MATERIAL"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/MaterialSHSet",
					template: new sap.m.StandardListItem({
						title: "{Matnr}",
						description: "{Maktx}"
					})
				},
				confirm: function (E) {
					if (bindProperty === "MatnrObj") {
						aObjListItem[sPath].MatnrObj = E.getParameters().selectedItem.getProperty("title");
						aObjListItem[sPath].Matnrtxt = E.getParameters().selectedItem.getProperty("description");
						aObjListItem[sPath].MatnrObjState = "None";
						aObjListItem[sPath].Enable = false;
						mObjListItem.setData(aObjListItem);
						//g.deriveObjectListData(sPath, bindProperty);
					} else if (bindProperty === "AsmblyOb") {
						aObjListItem[sPath].AsmblyOb = E.getParameters().selectedItem.getProperty("title");
						aObjListItem[sPath].Bautltxt = E.getParameters().selectedItem.getProperty("description");
						aObjListItem[sPath].AsmblyObState = "None";
						aObjListItem[sPath].Enable = false;
						mObjListItem.setData(aObjListItem);
						g.validateOLI(sPath, bindProperty);
					}
				}
			};

			var q = "/MaterialSHSet";
			var M = this.getView().getModel("valueHelp");
			var matSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Matnr", "Maktx");
			matSelectDialog.open();
			matSelectDialog.setModel(oView.getModel("i18n"), "i18n");
		},

		onOLIEquipmentVH: function (oEvent) {
			var g = this;
			var oView = this.getView();
			var sBindingProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			sPath = parseInt(sPath.split("/")[1]);
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var aObjListItem = mObjListItem.getData();

			var eqSelectDialog = new sap.m.SelectDialog({
				title: this.getView().getModel("i18n").getProperty("EQUI"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/EquipmentNumberSet",
					template: new sap.m.StandardListItem({
						title: "{Equnr}",
						description: "{Eqktx}"
					})
				},
				confirm: function (E) {
					aObjListItem[sPath].EquiObj = E.getParameters().selectedItem.getProperty("title");
					aObjListItem[sPath].Equnrtxt = E.getParameters().selectedItem.getProperty("description");
					aObjListItem[sPath].EquiObjState = "None";
					aObjListItem[sPath].Enable = false;
					mObjListItem.setData(aObjListItem);

					var aAIWEQUI = sap.ui.getCore().getModel("AIWEQUI").getData();
					var sStagingFlag = false;
					for (var i = 0; i < aAIWEQUI.length; i++) {
						if (aAIWEQUI[i].Equnr === aObjListItem[sPath].EquiObj) {
							sStagingFlag = true;
							break;
						}
					}
					if (sStagingFlag) {
						g.fetchStagingData(sPath, sBindingProperty);
					} else {
						g.deriveObjectListData(sPath, sBindingProperty);
					}
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
			var fnSuccess = function (h) {
				var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						var sObj = {
							Equnr: oModelData[i].Equnr,
							Eqktx: oModelData[i].Eqktx
						};
						h.results.unshift(sObj);
					}
				}
				if (h.results.length > 0) {
					var I = new sap.m.StandardListItem({
						title: "{Equnr}",
						description: "{Eqktx}",
						active: true
					});
					var e = new sap.ui.model.json.JSONModel();
					e.setData(h);

					eqSelectDialog.setModel(e);
					eqSelectDialog.bindAggregation("items", "/results", I);
				} else {
					eqSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
				}
			};
			var fnError = function () {};
			M.read(q, {
				success: fnSuccess,
				error: fnError
			});
			eqSelectDialog.open();
			eqSelectDialog.setModel(oView.getModel("i18n"), "i18n");
		},

		onOLIFlocVH: function (oEvent) {
			var g = this;
			var oView = this.getView();
			var sBindingProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			sPath = parseInt(sPath.split("/")[1]);
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var aObjListItem = mObjListItem.getData();

			var eqSelectDialog = new sap.m.SelectDialog({
				title: this.getView().getModel("i18n").getProperty("FLOC_TXT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/FunctionLocationSet",
					template: new sap.m.StandardListItem({
						title: "{Tplnr}",
						description: "{Pltxt}"
					})
				},
				confirm: function (E) {
					aObjListItem[sPath].FlocObj = E.getParameters().selectedItem.getProperty("title");
					aObjListItem[sPath].Tplnrtxt = E.getParameters().selectedItem.getProperty("description");
					aObjListItem[sPath].FlocObjState = "None";
					aObjListItem[sPath].Enable = false;
					mObjListItem.setData(aObjListItem);

					var aAIWFLOC = sap.ui.getCore().getModel("AIWFLOC").getData();
					var sStagingFlag = false;
					for (var i = 0; i < aAIWFLOC.length; i++) {
						if (aAIWFLOC[i].Functionallocation === aObjListItem[sPath].FlocObj) {
							sStagingFlag = true;
							break;
						}
					}
					if (sStagingFlag) {
						g.fetchStagingData(sPath, sBindingProperty);
					} else {
						g.deriveObjectListData(sPath, sBindingProperty);
					}
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

			var q = "/FunctionLocationSet";
			var M = this.getView().getModel("valueHelp");
			var fnSuccess = function (h) {
				var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
				if (oModelData.length > 0) {
					for (var i = 0; i < oModelData.length; i++) {
						var sObj = {
							Tplnr: oModelData[i].Functionallocation,
							Pltxt: oModelData[i].Flocdescription
						};
						h.results.unshift(sObj);
					}
				}
				if (h.results.length > 0) {
					var I = new sap.m.StandardListItem({
						title: "{Tplnr}",
						description: "{Pltxt}",
						active: true
					});
					var e = new sap.ui.model.json.JSONModel();
					e.setData(h);

					eqSelectDialog.setModel(e);
					eqSelectDialog.bindAggregation("items", "/results", I);
				} else {
					eqSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
				}
			};
			var fnError = function () {};
			M.read(q, {
				success: fnSuccess,
				error: fnError
			});
			eqSelectDialog.open();
			eqSelectDialog.setModel(oView.getModel("i18n"), "i18n");
		},

		onOLIUIIVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			sPath = parseInt(sPath.split("/")[1]);
			var sBindingProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var aObjListItem = mObjListItem.getData();

			var settings = {
				title: "UII",
				noDataText: "{i18n>LOAD}" + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "UII"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Material"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Serial Number"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Equipement"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Equi. Desc."
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "UII Plant"
							})
						]
					})
				],
				items: {
					path: "/UIIVHSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Uii}"
							}),
							new sap.m.Text({
								text: "{Matnr}"
							}),
							new sap.m.Text({
								text: "{Sernr}"
							}),
							new sap.m.Text({
								text: "{Equnr}"
							}),
							new sap.m.Text({
								text: "{Eqktu}"
							}),
							new sap.m.Text({
								text: "{UiiPlant}"
							})
						]
					})

				},
				confirm: function (E) {
					aObjListItem[sPath].UiiObj = E.getParameter("selectedItem").getCells()[0].getText();
					aObjListItem[sPath].UiiObjState = "None";
					aObjListItem[sPath].Enable = false;
					mObjListItem.setData(aObjListItem);
					g.deriveObjectListData(sPath, sBindingProperty);
				}
			};

			var q = "/UIIVHSet";
			var oFilter = [];
			var cells = [
				new sap.m.Text({
					text: "{Uii}"
				}),
				new sap.m.Text({
					text: "{Matnr}"
				}),
				new sap.m.Text({
					text: "{Sernr}"
				}),
				new sap.m.Text({
					text: "{Equnr}"
				}),
				new sap.m.Text({
					text: "{Eqktu}"
				}),
				new sap.m.Text({
					text: "{UiiPlant}"
				})
			];
			var uiiSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilter, settings, "Uii", "Matnr");
			uiiSelectDialog.open();
			uiiSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onOLISerNumVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var sPath = oEvent.getSource().getParent().getBindingContextPath();
			sPath = parseInt(sPath.split("/")[1]);
			var sBindingProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var aObjListItem = mObjListItem.getData();

			var settings = {
				title: "Serial Number",
				noDataText: "{i18n>LOAD}" + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "Serial Number"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Material"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "UII"
							})
						]
					})
				],
				items: {
					path: "/EqsnsSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Sernr}"
							}),
							new sap.m.Text({
								text: "{Matnr}"
							}),
							new sap.m.Text({
								text: "{Uii}"
							})
						]
					})

				},
				confirm: function (E) {
					aObjListItem[sPath].SernrObj = E.getParameter("selectedItem").getCells()[0].getText();
					aObjListItem[sPath].SernrObjState = "None";
					aObjListItem[sPath].Enable = false;
					mObjListItem.setData(aObjListItem);
					g.deriveObjectListData(sPath, sBindingProperty);
				}
			};

			var q = "/EqsnsSet";
			var oFilter = [];
			var cells = [
				new sap.m.Text({
					text: "{Sernr}"
				}),
				new sap.m.Text({
					text: "{Matnr}"
				}),
				new sap.m.Text({
					text: "{Uii}"
				})
			];
			var snSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilter, settings, "Sernr", "Matnr");
			snSelectDialog.open();
			snSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onObjListItmChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var sBindingProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var sBindingPath = oEvent.getSource().getParent().getBindingContextPath();
			var sSelectedRow = parseInt(sBindingPath.split("/")[1]);
			switch (sBindingProperty) {
			case 'MatnrObj':
				g.onOLIMaterialChange(sSelectedRow, value, sBindingProperty);
				break;
			case "EquiObj":
				g.onOLIEquipmentChange(sSelectedRow, value, sBindingProperty);
				break;
			case "FlocObj":
				g.onOLIFlocChange(sSelectedRow, value, sBindingProperty);
				break;
			case "AsmblyOb":
				g.onOLIMaterialChange(sSelectedRow, value, sBindingProperty);
				break;
			case "UiiObj":
				g.onOLIUIIChange(sSelectedRow, value, sBindingProperty);
				break;
			case "SernrObj":
				g.onOLISerNumChange(sSelectedRow, value, sBindingProperty);
				break;
			}
		},

		onOLIMaterialChange: function (index, value, prop) {
			var g = this;
			var q = "/MaterialSHSet";
			var c = value.toUpperCase();
			var oFilter = new sap.ui.model.Filter("Matnr", "EQ", c);
			var m = this.getView().getModel("valueHelp");
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var oObjListItemData = mObjListItem.getData();
			m.read(q, {
				filters: [oFilter],
				success: function (d, e) {
					if (d.results.length > 0) {
						if (prop === "MatnrObj") {
							oObjListItemData[index].MatnrObjState = "None";
							oObjListItemData[index].MatnrObj = c;
							oObjListItemData[index].Matnrtxt = d.results[0].Maktx;
							oObjListItemData[index].Enable = false;
							g.deriveObjectListData(index, prop);
						} else if (prop === "AsmblyOb") {
							oObjListItemData[index].AsmblyObState = "None";
							oObjListItemData[index].AsmblyOb = c;
							oObjListItemData[index].Bautltxt = d.results[0].Maktx;
							oObjListItemData[index].Enable = false;
							g.validateOLI(index, prop);
						}
						mObjListItem.setData(oObjListItemData);
					} else {
						if (prop === "MatnrObj") {
							oObjListItemData[index].MatnrObjState = "Error";
						} else if (prop === "AsmblyOb") {
							oObjListItemData[index].AsmblyObState = "Error";
						}
						mObjListItem.setData(oObjListItemData);
					}
				},
				error: function () {
					if (prop === "MatnrObj") {
						oObjListItemData[index].MatnrObjState = "Error";
					} else if (prop === "AsmblyOb") {
						oObjListItemData[index].AsmblyObState = "Error";
					}
					mObjListItem.setData(oObjListItemData);
				}
			});
		},

		onOLIEquipmentChange: function (index, value, prop) {
			var g = this;
			var c = value.toUpperCase();
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var oObjListItemData = mObjListItem.getData();
			var aAIWEQUI = sap.ui.getCore().getModel("AIWEQUI").getData();
			var sStagingFlag = false;
			for (var i = 0; i < aAIWEQUI.length; i++) {
				if (aAIWEQUI[i].Equnr === c) {
					sStagingFlag = true;
					break;
				}
			}
			if (sStagingFlag) {
				g.fetchStagingData(index, prop);
			} else {
				var q = "/EquipmentNumberSet";
				var oFilter = new sap.ui.model.Filter("Equnr", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d, e) {
						if (d.results.length > 0) {
							oObjListItemData[index].EquiObjState = "None";
							oObjListItemData[index].EquiObj = c;
							oObjListItemData[index].Equnrtxt = d.results[0].Eqktx;
							oObjListItemData[index].Enable = false;
							mObjListItem.setData(oObjListItemData);
							g.deriveObjectListData(index, prop);
						} else {
							oObjListItemData[index].EquiObjState = "Error";
							mObjListItem.setData(oObjListItemData);
						}
					},
					error: function () {
						oObjListItemData[index].EquiObjState = "Error";
						mObjListItem.setData(oObjListItemData);
					}
				});
			}
		},

		onOLIFlocChange: function (index, value, prop) {
			var g = this;
			var c = value.toUpperCase();
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var oObjListItemData = mObjListItem.getData();
			var aAIWFLOC = sap.ui.getCore().getModel("AIWFLOC").getData();
			var sStagingFlag = false;
			for (var i = 0; i < aAIWFLOC.length; i++) {
				if (aAIWFLOC[i].Functionallocation === c) {
					sStagingFlag = true;
					break;
				}
			}
			if (sStagingFlag) {
				g.fetchStagingData(index, prop);
			} else {
				var q = "/FunctionLocationSet";
				var oFilter = new sap.ui.model.Filter("Tplnr", "EQ", c);
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: [oFilter],
					success: function (d, e) {
						if (d.results.length > 0) {
							oObjListItemData[index].FlocObjState = "None";
							oObjListItemData[index].FlocObj = c;
							oObjListItemData[index].Tplnrtxt = d.results[0].Pltxt;
							oObjListItemData[index].Enable = false;
							mObjListItem.setData(oObjListItemData);
							g.deriveObjectListData(index, prop);
						} else {
							oObjListItemData[index].FlocObjState = "Error";
							mObjListItem.setData(oObjListItemData);
						}
					},
					error: function () {
						oObjListItemData[index].FlocObjState = "Error";
						mObjListItem.setData(oObjListItemData);
					}
				});
			}
		},

		onOLIUIIChange: function (index, value, prop) {
			var g = this;
			var c = value.toUpperCase();
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var oObjListItemData = mObjListItem.getData();

			var q = "/UIIVHSet";
			var oFilter = new sap.ui.model.Filter("Uii", "EQ", c);
			var m = this.getView().getModel("valueHelp2");
			m.read(q, {
				filters: [oFilter],
				success: function (d, e) {
					if (d.results.length > 0) {
						oObjListItemData[index].UiiObj = d.results[0].Uii;
						oObjListItemData[index].UiiObjState = "None";
						oObjListItemData[index].Enable = false;
						mObjListItem.setData(oObjListItemData);
						g.deriveObjectListData(index, prop);
					} else {
						oObjListItemData[index].UiiObjState = "Error";
						mObjListItem.setData(oObjListItemData);
					}
				},
				error: function () {
					oObjListItemData[index].UiiObjState = "Error";
					mObjListItem.setData(oObjListItemData);
				}
			});
		},

		onOLISerNumChange: function (index, value, prop) {
			var g = this;
			var c = value.toUpperCase();
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var oObjListItemData = mObjListItem.getData();

			var q = "/EqsnsSet";
			var oFilter = new sap.ui.model.Filter("Sernr", "EQ", c);
			var m = this.getView().getModel("valueHelp2");
			m.read(q, {
				filters: [oFilter],
				success: function (d, e) {
					if (d.results.length > 0) {
						oObjListItemData[index].SernrObj = d.results[0].Sernr;
						oObjListItemData[index].SernrObjState = "None";
						oObjListItemData[index].Enable = false;
						mObjListItem.setData(oObjListItemData);
						g.deriveObjectListData(index, prop);
					} else {
						oObjListItemData[index].SernrObjState = "Error";
						mObjListItem.setData(oObjListItemData);
					}
				},
				error: function () {
					oObjListItemData[index].SernrObjState = "Error";
					mObjListItem.setData(oObjListItemData);
				}
			});
		},

		deriveObjectListData: function (index, prop) {
			var g = this;
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var aObjListItem = mObjListItem.getData();
			var q = "/MPOBListSet(EquiObj='" + aObjListItem[index].EquiObj + "',FlocObj='" + aObjListItem[index].FlocObj + "',MatnrObj='" +
				aObjListItem[index].MatnrObj + "',SernrObj='" + aObjListItem[index].SernrObj + "',UiiObj='" + aObjListItem[index].UiiObj +
				"',AsmblyOb='" + aObjListItem[index].AsmblyOb + "')";
			var M = this.getView().getModel();
			M.read(q, {
				success: function (h, E) {
					aObjListItem[index].UiiObj = h.UiiObj;
					aObjListItem[index].SernrObj = h.SernrObj;
					aObjListItem[index].EquiObj = h.EquiObj;
					aObjListItem[index].FlocObj = h.FlocObj;
					aObjListItem[index].MatnrObj = h.MatnrObj;
					aObjListItem[index].AsmblyOb = h.AsmblyOb;
					aObjListItem[index].Equnrtxt = h.Equnrtxt;
					aObjListItem[index].Matnrtxt = h.Matnrtxt;
					aObjListItem[index].Tplnrtxt = h.Tplnrtxt;
					mObjListItem.setData(aObjListItem);
					g.validateOLI(index, prop);
				},
				error: function (err) {

				}
			});
		},

		validateOLI: function (index, prop) {
			var g = this;
			var mObjListItem = this.getView().getModel("ObjListItemModel");
			var aObjListItem = mObjListItem.getData();
			for (var i = 0; i < aObjListItem.length; i++) {
				if (i !== index && aObjListItem[i].Mitemnumb === aObjListItem[index].Mitemnumb) {
					if (aObjListItem[i].MatnrObj === aObjListItem[index].MatnrObj && aObjListItem[i].EquiObj === aObjListItem[index].EquiObj &&
						aObjListItem[i].FlocObj === aObjListItem[index].FlocObj && aObjListItem[i].AsmblyOb === aObjListItem[index].AsmblyOb) {
						if (prop === 'MatnrObj') {
							aObjListItem[index].MatnrObjState = "Error";
							g.OLIMessage = "Material " + aObjListItem[index].MatnrObj + " is already in Object List";
							g.invokeMessage("Material " + aObjListItem[index].MatnrObj + " is already in Object List");
							break;
						} else if (prop === 'EquiObj') {
							aObjListItem[index].EquiObjState = "Error";
							g.OLIMessage = "Equipment " + aObjListItem[index].EquiObj + " is already in Object List";
							g.invokeMessage("Equipment " + aObjListItem[index].EquiObj + " is already in Object List");
							break;
						} else if (prop === 'FlocObj') {
							aObjListItem[index].FlocObjState = "Error";
							g.OLIMessage = "Functional Location " + aObjListItem[index].FlocObj + " is already in Object List";
							g.invokeMessage("Functional Location " + aObjListItem[index].FlocObj + " is already in Object List");
							break;
						} else if (prop === 'AsmblyOb') {
							aObjListItem[index].AsmblyObState = "Error";
							g.OLIMessage = "Assembly " + aObjListItem[index].AsmblyOb + " is already in Object List";
							g.invokeMessage("Assembly " + aObjListItem[index].AsmblyOb + " is already in Object List");
							break;
						} else if (prop === 'UiiObj') {
							aObjListItem[index].UiiObjState = "Error";
							g.OLIMessage = "UII " + aObjListItem[index].UiiObj + " is already in Object List";
							g.invokeMessage("UII " + aObjListItem[index].UiiObj + " is already in Object List");
							break;
						} else if (prop === 'SernrObj') {
							aObjListItem[index].SernrObjState = "Error";
							g.OLIMessage = "Serial Number " + aObjListItem[index].SernrObj + " is already in Object List";
							g.invokeMessage("Serial Number " + aObjListItem[index].SernrObj + " is already in Object List");
							break;
						}
					}
				}
			}
			mObjListItem.setData(aObjListItem);
		},

		deleteObjListItmRow: function () {
			var sTable = this.getView().byId("idObjectListItem");
			var mTableModel = sTable.getModel("ObjListItemModel");
			var sTableData = mTableModel.getData();
			var aSelectedRows = sTable.getSelectedContextPaths();
			var aSelectedRowsIndices = [];
			for (var i = 0; i < aSelectedRows.length; i++) {
				aSelectedRowsIndices.push(parseInt(aSelectedRows[i].split("/")[1]));
			}
			aSelectedRowsIndices.sort();
			var index;
			for (var j = aSelectedRowsIndices.length - 1; j >= 0; j--) {
				index = aSelectedRowsIndices[j];
				sTableData.splice(index, 1);
			}
			sTable.removeSelections();
			mTableModel.setData(sTableData);
			this.getView().byId("idObjListItmDelete").setEnabled(false);
		},

		fetchStagingData: function (index, prop) {
			var g = this;
			var sPath = "/ChangeRequestSet";
			var oModel = g.getView().getModel();
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
				"EqPRT": [],
				"EqAddr": [],
				"EqClass": [],
				"EqVal": [],
				"MSPoint": [],
				"MSClass": [],
				"MSVal": [],
				"MPLAN": [],
				"MPItem": [],
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

			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWMPMIModel;
			if (g.viewName === "ChangeMpmi") {
				AIWMPMIModel = [sap.ui.getCore().getModel("AIWMPMIDetail").getData()];
			} else {
				AIWMPMIModel = sap.ui.getCore().getModel("AIWMPMI").getData();
			}

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
						"Wergwfloc": AIWFLOCModel[a].WcWerks, // Name
						"Gewrkfloc": AIWFLOCModel[a].MainArbpl, // Main Work Center
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
						"IsMenu": AIWFLOCModel[a].menuAction,
						"Adrnri": AIWFLOCModel[a].Adrnri
					};

					// if (AIWFLOCModel[a].viewParameter === "create") {
					// 	sFuncLoc.Type = true;
					// }
					sFuncLoc.Type = true;
					sPayload.FuncLoc.push(sFuncLoc);

					if ((AIWFLOCModel[a].Title !== "" && AIWFLOCModel[a].Title !== undefined) || (AIWFLOCModel[a].TitleCode !== "" && AIWFLOCModel[a]
							.TitleCode !== undefined) || (AIWFLOCModel[a].Name1 !== "" && AIWFLOCModel[a].Name1 !== undefined) || (AIWFLOCModel[a].Name2 !==
							"" && AIWFLOCModel[a].Name2 !== undefined) || (AIWFLOCModel[a].Name3 !== "" && AIWFLOCModel[a].Name3 !== undefined) ||
						(AIWFLOCModel[a].Name4 !== "" && AIWFLOCModel[a].Name4 !== undefined) ||
						(AIWFLOCModel[a].Sort1 !== "" && AIWFLOCModel[a].Sort1 !== undefined) || (AIWFLOCModel[a].Sort2 !== "" && AIWFLOCModel[a].Sort2 !==
							undefined) || (AIWFLOCModel[a].NameCo !== "" && AIWFLOCModel[a].NameCo !== undefined) || (AIWFLOCModel[a].PostCod1 !== "" &&
							AIWFLOCModel[a].PostCod1 !== undefined) || (AIWFLOCModel[a].City1 !== "" && AIWFLOCModel[a].City1 !== undefined) || (
							AIWFLOCModel[a].Building !== "" && AIWFLOCModel[a].Building !==
							undefined) || (AIWFLOCModel[a].Floor !== "" && AIWFLOCModel[a].Floor !== undefined) || (AIWFLOCModel[a].Roomnum !== "" &&
							AIWFLOCModel[a].Roomnum !== undefined) || (AIWFLOCModel[a].AddrLocation !== "" && AIWFLOCModel[a].AddrLocation !== undefined) ||
						(AIWFLOCModel[a].Strsuppl1 !== "" && AIWFLOCModel[a].Strsuppl1 !== undefined) || (AIWFLOCModel[a].Strsuppl2 !== "" &&
							AIWFLOCModel[a].Strsuppl2 !== undefined) || (AIWFLOCModel[a].Strsuppl3 !== "" && AIWFLOCModel[a].Strsuppl3 !== undefined) || (
							AIWFLOCModel[a].TimeZone !== "" && AIWFLOCModel[a].TimeZone !== undefined) || (AIWFLOCModel[a].RefPosta !== "" && AIWFLOCModel[
							a].RefPosta !== undefined) || (AIWFLOCModel[a].Region !== "" && AIWFLOCModel[a].Region !== undefined)) {
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
					}

					var sFLClassList = AIWFLOCModel[a].classItems;
					if (sFLClassList) {
						if (sFLClassList.length > 0) {
							for (var b = 0; b < sFLClassList.length; b++) {
								var sFLClass = {
									"Funcloc": AIWFLOCModel[a].Functionallocation,
									"Classtype": sFLClassList[b].Classtype,
									"Class": sFLClassList[b].Class,
									"Clstatus1": sFLClassList[b].Clstatus1,
									"Artxt": sFLClassList[b].ClassTypeDesc
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
						"WorkCenterPlant": AIWEQUIModel[d].WcWerks, // Name
						"ArbpEeqz": AIWEQUIModel[d].MainArbpl, // Main Work Center
						"MainWcPlant": AIWEQUIModel[d].MainWerks, // Work center Plant

						"BebeEilo": AIWEQUIModel[d].BeberFl, // Plant Section
						"Fing": AIWEQUIModel[d].Fing, // Plant Section
						"Tele": AIWEQUIModel[d].Tele, // Plant Section
						"HeqnEeqz": AIWEQUIModel[d].EquipPosition, // Position
						"IsMenu": AIWEQUIModel[d].menuAction,
						"Adrnri": AIWEQUIModel[d].Adrnri
					};

					// if (AIWEQUIModel[d].viewParameter === "create") {
					// 	sEquipment.Type = true;
					// }
					sEquipment.Type = true;
					sPayload.Equipment.push(sEquipment);

					if ((AIWEQUIModel[d].Title !== "" && AIWEQUIModel[d].Title !== undefined) || (AIWEQUIModel[d].TitleCode !== "" && AIWEQUIModel[d]
							.TitleCode !== undefined) || (AIWEQUIModel[d].Name1 !== "" && AIWEQUIModel[d].Name1 !== undefined) || (AIWEQUIModel[d].Name2 !==
							"" && AIWEQUIModel[d].Name2 !== undefined) || (AIWEQUIModel[d].Name3 !== "" && AIWEQUIModel[d].Name3 !== undefined) ||
						(AIWEQUIModel[d].Name4 !== "" && AIWEQUIModel[d].Name4 !== undefined) ||
						(AIWEQUIModel[d].Sort1 !== "" && AIWEQUIModel[d].Sort1 !== undefined) || (AIWEQUIModel[d].Sort2 !== "" && AIWEQUIModel[d].Sort2 !==
							undefined) || (AIWEQUIModel[d].NameCo !== "" && AIWEQUIModel[d].NameCo !== undefined) || (AIWEQUIModel[d].PostCod1 !== "" &&
							AIWEQUIModel[d].PostCod1 !== undefined) || (AIWEQUIModel[d].City1 !== "" && AIWEQUIModel[d].City1 !== undefined) ||
						(AIWEQUIModel[d].Building !== "" && AIWEQUIModel[d].Building !== undefined) ||
						(AIWEQUIModel[d].Floor !== "" && AIWEQUIModel[d].Floor !== undefined) || (AIWEQUIModel[d].Roomnum !== "" && AIWEQUIModel[d].Roomnum !==
							undefined) || (AIWEQUIModel[d].AddrLocation !== "" && AIWEQUIModel[d].AddrLocation !== undefined) || (AIWEQUIModel[d].Strsuppl1 !==
							"" && AIWEQUIModel[d].Strsuppl1 !== undefined) || (AIWEQUIModel[d].Strsuppl2 !== "" && AIWEQUIModel[d].Strsuppl2 !== undefined) ||
						(AIWEQUIModel[d].Strsuppl3 !== "" && AIWEQUIModel[d].Strsuppl3 !== undefined) || (AIWEQUIModel[d].TimeZone !== "" &&
							AIWEQUIModel[d].TimeZone !== undefined) || (AIWEQUIModel[d].RefPosta !== "" && AIWEQUIModel[d].RefPosta !== undefined) || (
							AIWEQUIModel[d].Region !== "" && AIWEQUIModel[d].Region !== undefined)) {
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
					}

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

					var sEqClassList = AIWEQUIModel[d].classItems;
					if (sEqClassList) {
						if (sEqClassList.length > 0) {
							for (var e = 0; e < sEqClassList.length; e++) {
								var sEqClass = {
									"Equi": AIWEQUIModel[d].Equnr,
									"Classtype": sEqClassList[e].Classtype,
									"Class": sEqClassList[e].Class,
									"Clstatus1": sEqClassList[e].Clstatus1,
									"Artxt": sEqClassList[e].ClassTypeDesc
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
			if (AIWMPMIModel.length > 0) {
				for (var k = 0; k < AIWMPMIModel.length; k++) {
					var sMPLAN = {
						"Warpl": AIWMPMIModel[k].Warpl,
						"Abrho": AIWMPMIModel[k].Abrho,
						"Hunit": AIWMPMIModel[k].Hunit,
						"Mptyp": AIWMPMIModel[k].Mptyp,
						"Wptxt": AIWMPMIModel[k].Wptxt,
						"Stich": AIWMPMIModel[k].Stich.toString(),
						"Fabkl": AIWMPMIModel[k].Fabkl,
						"FabklDesc": AIWMPMIModel[k].FabklDesc,
						"Sfakt": AIWMPMIModel[k].Sfakt,
						"Andor": g.parseValue(AIWMPMIModel[k].Andor),
						"Mehrfach": g.parseValue(AIWMPMIModel[k].Mehrfach),
						"Strat": AIWMPMIModel[k].Strat,
						"StratDesc": AIWMPMIModel[k].StratDesc,
						"Wset": AIWMPMIModel[k].Wset,
						"Startdate": g._formatDate(AIWMPMIModel[k].Stadt),
						"Unitc": AIWMPMIModel[k].Unitc,
						"Szaeh": AIWMPMIModel[k].Szaeh,
						"PointStp": AIWMPMIModel[k].Mpcycleno,

						"Vspos": AIWMPMIModel[k].Vspos,
						"Topos": AIWMPMIModel[k].Topos,
						"Vsneg": AIWMPMIModel[k].Vsneg,
						"Toneg": AIWMPMIModel[k].Toneg,
						"Horiz": AIWMPMIModel[k].Horiz,
						"CallConf": AIWMPMIModel[k].CallConf,
						"PlanSort": AIWMPMIModel[k].PlanSort,
						"Begru": AIWMPMIModel[k].Begru,
						"IsMenu": AIWMPMIModel[k].menuAction
					};

					// if (AIWMPMIModel[k].viewParameter === "create") {
					// 	sMPLAN.Type = true;
					// }
					sMPLAN.Type = true;
					sPayload.MPLAN.push(sMPLAN);

					var sItem = AIWMPMIModel[k].itemModel;
					if (sItem) {
						for (var l = 0; l < sItem.length; l++) {
							var sMPItem = {
								"Mplan": AIWMPMIModel[k].Warpl,
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
								"PlnnrMi": sItem[l].PlnnrMi,
								"PlntyMi": sItem[l].PlntyMi,
								"PlnalMi": sItem[l].PlnalMi,
							};

							// if (AIWMPMIModel[l].viewParameter === "create") {
							// 	sMPItem.Type = true;
							// }
							sMPItem.Type = true;
							sPayload.MPItem.push(sMPItem);
						}
					}

					var sObjListItem = this.getView().getModel("ObjListItemModel").getData();
					if (sObjListItem) {
						for (var z = 0; z < sObjListItem.length; z++) {
							if (sObjListItem[z].Warpl === AIWMPMIModel[k].Warpl) {
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
					}

					var sCycle = AIWMPMIModel[k].cycleModel;
					if (sCycle) {
						for (var m = 0; m < sCycle.length; m++) {
							var sMPCycle = {
								"Mplan": AIWMPMIModel[k].Warpl,
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
				}
			}

			var fnSuccess = function (r) {
				var sObj = {
					ObjListItems: []
				};
				if (r.MPOBList) {
					var aObjListItems = r.MPOBList.results;
					if (aObjListItems) {
						var temp2 = [];
						for (var i = 0; i < aObjListItems.length; i++) {
							var obj = {};
							obj.Warpl = aObjListItems[i].Mplan;
							obj.Mitemnumb = aObjListItems[i].Mitemnumb;
							obj.MatnrObj = aObjListItems[i].MatnrObj;
							obj.FlocObj = aObjListItems[i].FlocObj;
							obj.EquiObj = aObjListItems[i].EquiObj;
							obj.AsmblyOb = aObjListItems[i].AsmblyOb;
							obj.Matnrtxt = aObjListItems[i].Matnrtxt;
							obj.Equnrtxt = aObjListItems[i].Equnrtxt;
							obj.Tplnrtxt = aObjListItems[i].Tplnrtxt;
							obj.Bautltxt = aObjListItems[i].Bautltxt;
							obj.Enable = false;
							temp2.push(obj);
						}
						sObj.ObjListItems = temp2;
					}
				}
				g.getView().getModel("ObjListItemModel").setData(sObj.ObjListItems);
				g.validateOLI(index, prop);
			};
			var fnError = function (err) {
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
				g.invokeMessage(value);
			};

			oModel.create(sPath, sPayload, {
				success: fnSuccess,
				error: fnError
			});
		},

		invokeMessage: function (msg) {
			this.createMessagePopover(msg, "Error");
			// sap.m.MessageBox.show(msg, {
			// 	title: "Error",
			// 	icon: sap.m.MessageBox.Icon.ERROR,
			// 	onClose: function (oAction) {
			// 	}
			// });
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

		onMaintPlantVH: function (oEvent) {
			ValueHelpRequest.maintPlantIPVH(oEvent, this);
		},
		onMaintPlantChange: function (oEvent) {
			ValueHelpRequest.maintPlantIPchange(oEvent, this);
		},

		onLocationVH: function (oEvent) {
			ValueHelpRequest.LocationIPVH(oEvent, this);
		},
		onLocationChange: function (oEvent) {
			ValueHelpRequest.LocationIPchange(oEvent, this);
		},

		onPlntSecVH: function (oEvent) {
			ValueHelpRequest.PlntSecIPVH(oEvent, this);
		},
		onPlntSecChange: function (oEvent) {
			ValueHelpRequest.PlntSecIPchange(oEvent, this);
		},

		onWrkCtrVH: function (oEvent) {
			ValueHelpRequest.WrkCtrIPVH(oEvent, this);
		},
		onWrkCtrChange: function (oEvent) {
			ValueHelpRequest.WrkCtrIPchange(oEvent, this);
		},

		onAbcIndVH: function (oEvent) {
			ValueHelpRequest.AbcIndIPVH(oEvent, this);
		},
		onAbcIndChange: function (oEvent) {
			ValueHelpRequest.AbcIndIPchange(oEvent, this);
		},

		onCompCodeVH: function (oEvent) {
			ValueHelpRequest.CompCodeIPVH(oEvent, this);
		},
		onCompCodeChange: function (oEvent) {
			ValueHelpRequest.CompCodeIPchange(oEvent, this);
		},

		onAssetVH: function (oEvent) {
			ValueHelpRequest.AssetIPVH(oEvent, this);
		},
		onAssetChange: function (oEvent) {
			ValueHelpRequest.AssetIPchange(oEvent, this);
		},

		onSubVH: function (oEvent) {
			ValueHelpRequest.SubIPVH(oEvent, this);
		},
		onSubChange: function (oEvent) {
			ValueHelpRequest.SubIPchange(oEvent, this);
		},

		onITBusinessVH: function (oEvent) {
			ValueHelpRequest.ITBusinessIPVH(oEvent, this);
		},
		onITBusinessChange: function (oEvent) {
			ValueHelpRequest.ITBusinessIPchange(oEvent, this);
		},

		onCostCenterVH: function (oEvent) {
			ValueHelpRequest.CostCenterIPVH(oEvent, this);
		},
		onCostCenterChange: function (oEvent) {
			ValueHelpRequest.CostCenterIPchange(oEvent, this);
		},

		onWBSEleVH: function (oEvent) {
			ValueHelpRequest.WBSEleIPVH(oEvent, this);
		},
		onWBSEleChange: function (oEvent) {
			ValueHelpRequest.WBSEleIPchange(oEvent, this);
		},

		onSetlOrdVH: function (oEvent) {
			ValueHelpRequest.SetlOrdIPVH(oEvent, this);
		},
		onSetlOrdChange: function (oEvent) {
			ValueHelpRequest.SetlOrdIPchange(oEvent, this);
		},

		onSerialNumVH: function (oEvent) {
			ValueHelpRequest.SerialNumVH(oEvent, this);
		},
		onSerialNumChange: function (oEvent) {
			ValueHelpRequest.SerialNumChange(oEvent, this);
		},

		onUIIVH: function (oEvent) {
			ValueHelpRequest.UIIVH(oEvent, this);
		},
		onUIIChange: function (oEvent) {
			ValueHelpRequest.UIIChange(oEvent, this);
		}

	});
});