/*global location*/
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/m/MessageToast",
	"sap/ui/core/routing/Router",
	"sap/m/MessageBox",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider"
], function (BaseController, JSONModel, History, formatter, MessageToast, Router, MessageBox, ValueHelpProvider) {
	"use strict";
	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.TLHeaderDetail", {
		formatter: formatter,
		cycleSeq: [],
		wcSearchResults: undefined,
		wcSelectDialog: undefined,
		ppdtSearchResults: undefined,
		ppdtSelectDialog: undefined,
		wcpdtSearchResults: undefined,
		wcpdtSelectDialog: undefined,
		udtSearchResults: undefined,
		udtSelectDialog: undefined,
		plgpDtSelectDialog: undefined,
		plgpDtSearchResults: undefined,
		sydtSearchResults: undefined,
		sydtSelectDialog: undefined,
		sdtSearchResults: undefined,
		sdtSelectDialog: undefined,

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
			
			var oModel = this._oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);
			
			var vhModel = this._oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");
			
			var vhModel2 = this._oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");

			this.getRouter().getRoute("tlHdrDetail").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
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
			var itDetailview = new sap.ui.model.json.JSONModel();
			var itData = sap.ui.getCore().getModel("tlDetailModel");
			this.status = oEvent.getParameter("arguments").status;
			itDetailview.setData(itData.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));
			this.getView().setModel(itDetailview, "hdrDetailview");
			this.itemPath = oEvent.getParameter("arguments").itemPath;
			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "hdrDetailview"
			});

			var mainPath = oEvent.getParameter("arguments").mainPath;
			this.action = oEvent.getParameter("arguments").action;
			var tlHeaderDetailModel = new sap.ui.model.json.JSONModel();
			var itmDetailPath = decodeURIComponent(mainPath) + decodeURIComponent(this.itemPath);
			this.mode = oEvent.getParameter("arguments").mode;
			if (this.action === "createGTL" || this.action === "approveGTL") {
				var AIWListGTLModel = sap.ui.getCore().getModel("AIWListGTLModel");
				this.headerDetail = AIWListGTLModel.getProperty(itmDetailPath);
				tlHeaderDetailModel.setData(this.headerDetail);
			} else if (this.action === "createETL" || this.action === "approveETL") {
				var AIWListETLModel = sap.ui.getCore().getModel("AIWListETLModel");
				this.headerDetail = AIWListETLModel.getProperty(itmDetailPath);
				tlHeaderDetailModel.setData(this.headerDetail);
			} else if (this.action === "createFTL" || this.action === "approveFTL") {
				var AIWListFTLModel = sap.ui.getCore().getModel("AIWListFTLModel");
				this.headerDetail = AIWListFTLModel.getProperty(itmDetailPath);
				tlHeaderDetailModel.setData(this.headerDetail);
			}

			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "tlHeaderDetailModel"
			});

			// sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");

			var plant = oEvent.getParameter("arguments").pPlant;
			var mainWc = oEvent.getParameter("arguments").mainWc;
			var mainWcPlant = oEvent.getParameter("arguments").mainWcPlant;
			var wcDesc = oEvent.getParameter("arguments").wcDesc;
			var pDesc = oEvent.getParameter("arguments").pPlantDesc;
			if (plant !== "null") {
				// this.getView().byId("planPlantDt").setValue(plant);
				this.headerDetail.Iwerk = plant;
				// this.getView().byId("planPlantDt").setEnabled(false);
				this.headerDetail.pPlantDtEnb = false;
			} else {
				// this.getView().byId("planPlantDt").setEnabled(true);
				this.headerDetail.pPlantDtEnb = true;
			}
			if (pDesc !== "null") {
				// this.getView().byId("planPlantDescDt").setValue(pDesc);
				this.headerDetail.pPlantDesc = pDesc;
			}
			if (mainWc !== "null") {
				// this.getView().byId("wcDt").setValue(mainWc);
				this.headerDetail.KapArbpl = mainWc;
			}
			if (mainWcPlant !== "null") {
				// this.getView().byId("wcPlantDt").setValue(mainWcPlant);
				this.headerDetail.Werks = mainWcPlant;
			}

			// this.getView().setModel(itDetailview, "tlOprDetailview");

			// added : 19/09 - to remove unwanted value state error
			/*var usg = this.getView().byId("usageDt");
			var stau = this.getView().byId("statusDt");
			if (usg.getValue() !== "") {
				usg.setValueState("None");
			}
			if (stau.getValue() !== "") {
				stau.setValueState("None");
			}*/
			if (this.headerDetail.Verwe !== "") {
				this.headerDetail.usgValueState = "None";
			}
			if (this.headerDetail.Statu !== "") {
				this.headerDetail.statusVS = "None";
			}
			if (this.status === true) {
				this.disableFields();
			} else if (this.status === false) {
				this.enableFields();
			}
			//end

			if (this.mode === "display") {
				this.headerDetail.enable = false;
				this.headerDetail.pPlantDtEnb = false;
				this.headerDetail.visible = true;
			} else {
				this.headerDetail.enable = true;
				this.headerDetail.pPlantDtEnb = true;
				this.headerDetail.visible = false;
			}

			tlHeaderDetailModel.setData(this.headerDetail);
			this.getView().setModel(tlHeaderDetailModel, "tlHeaderDetailModel");
		},

		disableFields: function () {
			var obj = {
				hEnable: false
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "hDetail");
		},

		enableFields: function () {
			var obj = {
				hEnable: true
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "hDetail");
		},

		readHdrDefaults: function (sFrom) {
			//var _model = this.getView().getModel();
			// modified model - 21/09
			var g = this;
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			// var tlHeaderDetailData = tlHeaderDetailModel.getData();
			var serviceUrl = this.getView().getModel().sServiceUrl;
			// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
			var _model = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
				json: true,
				useBatch: false,
				defaultCountMode: sap.ui.model.odata.CountMode.None
			});
			var hdrDefaultArr = [];
			var q = "/ProfileDataSet";
			var oFilter = [new sap.ui.model.Filter("Profidnetz", "EQ", '')];
			_model.read(q, {
				filters: oFilter,
				success: function (r) {
					hdrDefaultArr = r.results[0];
					if (hdrDefaultArr) {
						if (sFrom === "planningPlant") {
							g.headerDetail.Verwe = hdrDefaultArr.Verwe;
							g.headerDetail.usageDesc = hdrDefaultArr.Vtext;
							g.headerDetail.Statu = hdrDefaultArr.Statu;
							g.headerDetail.statusDesc = hdrDefaultArr.Sttext;
							/*g.getView().byId("usageDt").setValue(hdrDefaultArr.Verwe);
							g.getView().byId("usageDescDt").setValue(hdrDefaultArr.Vtext);
							g.getView().byId("statusDt").setValue(hdrDefaultArr.Statu);
							g.getView().byId("statusDescDt").setValue(hdrDefaultArr.Sttext);*/
						}
						if (sFrom === "usage") {
							g.headerDetail.Statu = hdrDefaultArr.Statu;
							g.headerDetail.statusDesc = hdrDefaultArr.Sttext;
							/*g.getView().byId("statusDt").setValue(hdrDefaultArr.Statu);
							g.getView().byId("statusDescDt").setValue(hdrDefaultArr.Sttext);*/
						}
						if (sFrom === "status") {
							g.headerDetail.Verwe = hdrDefaultArr.Verwe;
							g.headerDetail.usageDesc = hdrDefaultArr.Vtext;
							/*g.getView().byId("usageDt").setValue(hdrDefaultArr.Verwe);
							g.getView().byId("usageDescDt").setValue(hdrDefaultArr.Vtext);*/
						}
						if (sFrom === "desc") {
							g.headerDetail.Verwe = hdrDefaultArr.Verwe;
							g.headerDetail.usageDesc = hdrDefaultArr.Vtext;
							g.headerDetail.Statu = hdrDefaultArr.Statu;
							g.headerDetail.statusDesc = hdrDefaultArr.Sttext;

							/*this.getView().byId("usageDt").setValue(hdrDefaultArr.Verwe);
							this.getView().byId("usageDescDt").setValue(hdrDefaultArr.Vtext);
							this.getView().byId("statusDt").setValue(hdrDefaultArr.Statu);
							this.getView().byId("statusDescDt").setValue(hdrDefaultArr.Sttext);*/
						}
					}
				},
				error: function (err) {}
			});
			tlHeaderDetailModel.setData(g.headerDetail);
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
			var value = this.getView().getModel("i18n").getProperty("DATA_LOSS");
			var g = this;
			sap.m.MessageBox.show(value, {
				title: "Confirmation",
				icon: sap.m.MessageBox.Icon.QUESTION,
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
				onClose: function (oAction) {
					if (oAction === "YES") {
						var itDetmodel = new sap.ui.model.json.JSONModel();
						var itDetailViewData = g.getView().getModel("itDetailview").getData();
						itDetailViewData = g.displayObject();
						// itDetmodel.setData(itDetailViewData);
						// g.getView().setModel(itDetmodel, "itDetailview");
						window.history.go(-1);
					}
				}
			});
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
						var itDetailViewData = g.getView().getModel("itDetailview").getData();
						itDetailViewData = g.displayObject();
						itDetmodel.setData(itDetailViewData);
						g.getView().setModel(itDetmodel, "itDetailview");
						window.history.go(-1);
					}
				}
			});
		},

		onPplantDtVH: function (oEvent) {
			var g = this;
			// var a;
			// var P = p;
			// a = this.getView().byId(p);
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			// var m = this.getView().byId("planPlantDt");
			// var d = this.getView().byId("planPlantDescDt");

			// if (this.ppdtSearchResults === undefined) {

			var pdtSelectDialog = new sap.m.SelectDialog({
				// id: "txCatDialog",
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
					/*m.setValueState("None");
					m.setValue(E.getParameters().selectedItem.getProperty("title"));
					d.setValue(E.getParameters().selectedItem.getProperty("description"));*/
					g.headerDetail.pPlantValueState = "None";
					g.headerDetail.Iwerk = E.getParameters().selectedItem.getProperty("title");
					g.headerDetail.pPlantDesc = E.getParameters().selectedItem.getProperty("description");
					tlHeaderDetailModel.setData(g.headerDetail);
					g.readHdrDefaults("planningPlant");
				},
				search: function (E) {
					var sValue = E.getParameter("value");
					E.getSource().getBinding("items").filter(!sValue ? [] : [
						new sap.ui.model.Filter(
							[
								new sap.ui.model.Filter("Werks", sap.ui.model.FilterOperator.Contains, sValue),
								new sap.ui.model.Filter("Name1", sap.ui.model.FilterOperator.Contains, sValue)
							],
							false)
					]);
				}
			});
			var q = "/PlanningPlantSet";

			// var serviceUrl = this.getView().getModel().sServiceUrl;
			// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
			/*var M = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
				json: true,
				useBatch: false,
				defaultCountMode: sap.ui.model.odata.CountMode.None
			});*/
			var M = this.getView().getModel("valueHelp");
			M.read(q, {
				success: function (h, E) {
					if (h.results.length > 0) {
						g.ppdtSearchResults = h;
						var I = new sap.m.StandardListItem({
							title: "{Werks}",
							description: "{Name1}"
						});
						var e = new sap.ui.model.json.JSONModel();
						e.setData(h);
						pdtSelectDialog.setModel(e);
						// pdtSelectDialog.setGrowingThreshold(h.results.length);
						pdtSelectDialog.bindAggregation("items", "/results", I);
					} else {
						pdtSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
					}
				}
			});
			pdtSelectDialog.open();

		},

		onUsageDtVH: function (oEvent) {

			var g = this;
			/*var a;
			var P = p;
			a = this.getView().byId(p);*/
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			// var m = this.getView().byId("usageDt");
			// var d = this.getView().byId("usageDescDt");
			var udtSearchResults;
			if (udtSearchResults === undefined) {
				var udtSelectDialog = new sap.m.SelectDialog({
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
						/*	m.setValueState("None");
							m.setValue(E.getParameters().selectedItem.getProperty("title"));
							d.setValue((E.getParameters().selectedItem.getProperty("description")));*/
						g.headerDetail.usgValueState = "None";
						g.headerDetail.usgValueStateTxt = "";
						g.headerDetail.Verwe = E.getParameters().selectedItem.getProperty("title");
						g.headerDetail.usageDesc = E.getParameters().selectedItem.getProperty("description");
						tlHeaderDetailModel.setData(g.headerDetail);
						g.readHdrDefaults("usage");
						/*var defaults = g.readHdrDefaults();
						if (defaults) {
							g.getView().byId("statusDt").setValue(defaults.Statu);
							g.getView().byId("statusDescDt").setValue(defaults.Sttext);
						}*/
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("VERWE", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("TXT", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				var q = "/UsageVHSet";

				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var M = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							udtSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{VERWE}",
								description: "{TXT}"
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							udtSelectDialog.setModel(e);
							// udtSelectDialog.setGrowingThreshold(h.results.length);
							udtSelectDialog.bindAggregation("items", "/results", I);
						} else {
							udtSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(udtSearchResults);
				udtSelectDialog.setModel(e);
				var I = udtSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			udtSelectDialog.open();
		},

		onStrategyVH: function (oEvent) {
			var g = this;
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
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
								text: "{i18n>UINT}"
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
					path: "/StrategySet",
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
					/*m.setValue(E.getParameter("selectedItem").getCells()[0].getText());
					d.setValue(E.getParameter("selectedItem").getCells()[1].getText());*/

					g.headerDetail.Strat = E.getParameter("selectedItem").getCells()[0].getText();
					g.headerDetail.stratDesc = E.getParameter("selectedItem").getCells()[1].getText();
					tlHeaderDetailModel.setData(g.headerDetail);
				}
			};
			var q = "/StrategySet";
			var oFilters = [];
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

			var strSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Strat", "Ktext");
			strSelectDialog.open();
			strSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onPlannerGrpVH: function (oEvent) {
			var g = this;
			/*var a;
			var P = p;*/
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			/*var m = this.getView().byId("plGrpDt");
			var d = this.getView().byId("plGrpDescDt");*/
			var plgpDtSearchResults;
			if (plgpDtSearchResults === undefined) {

				var plgpDtSelectDialog = new sap.m.SelectDialog({

					title: this.getView().getModel("i18n").getProperty("PL_GRP"),
					noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
					items: {
						path: "/PlannerGroupSet",
						template: new sap.m.StandardListItem({
							title: "{FEVOR}",
							description: "{TXT}"
						})
					},

					confirm: function (E) {
						/*m.setValue(E.getParameters().selectedItem.getProperty("title"));
						d.setValue(E.getParameters().selectedItem.getProperty("description"));
						m.setValueState("None");*/

						g.headerDetail.plGrpValueState = "None";
						g.headerDetail.Vagrp = E.getParameters().selectedItem.getProperty("title");
						g.headerDetail.plGrpDesc = E.getParameters().selectedItem.getProperty("description");
						tlHeaderDetailModel.setData(g.headerDetail);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("FEVOR", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("TXT", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				var q = "/PlannerGroupSet";

				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var M = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							plgpDtSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{FEVOR}",
								description: "{TXT}"
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							plgpDtSelectDialog.setModel(e);
							// plgpDtSelectDialog.setGrowingThreshold(h.results.length);
							plgpDtSelectDialog.bindAggregation("items", "/results", I);
						} else {
							plgpDtSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});

			} else {

				var e = new sap.ui.model.json.JSONModel();
				e.setData(plgpDtSearchResults);
				plgpDtSelectDialog.setModel(e);
				var I = plgpDtSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			plgpDtSelectDialog.open();

		},

		onWCDtVH: function (oEvent) {
			var g = this;
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			var settings = {
				title: this.getView().getModel("i18n").getProperty("WC"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>WC_CAT}"
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
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>WORK_CENTER}"
							})
						]
					}),
					new sap.m.Column({
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
								text: "{i18n>LANGUAGE}"
							})
						]
					}),

					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						visible: false,
						header: [
							new sap.m.Text({
								text: "{i18n>CTRL_KEY}"
							})
						]
					})
				],
				items: {
					path: "/WorkCenterVHSet",
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
					g.headerDetail.KapArbpl = E.getParameter("selectedItem").getCells()[2].getText();
					g.headerDetail.Werks = E.getParameter("selectedItem").getCells()[1].getText();
					if (g.headerDetail.wcDtValueState === "Error") {
						g.headerDetail.wcDtValueState = "None";
					}
					tlHeaderDetailModel.setData(g.headerDetail);
				}
			};
			var q = "/WorkCenterVHSet";
			var oFilters = [];
			var M = this.getView().getModel("valueHelp");
			var cells = [
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
				})
			];

			var wcdtSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Ktext", "Arbpl");
			wcdtSelectDialog.open();
			wcdtSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onPlantWcVH: function (oEvent) {
			var g = this;
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			var settings = {
				title: this.getView().getModel("i18n").getProperty("PLANT"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>WC_CAT}"
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
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>WORK_CENTER}"
							})
						]
					}),
					new sap.m.Column({
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
								text: "{i18n>LANGUAGE}"
							})
						]
					})
				],
				items: {
					path: "/WorkCenterVHSet",
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
							})
						]
					})
				},
				confirm: function (E) {
					/*m.setValueState("None");
					m.setValue(E.getParameter("selectedItem").getCells()[1].getText());*/
					g.headerDetail.wcPlantValueState = "None";
					g.headerDetail.Werks = E.getParameter("selectedItem").getCells()[1].getText();
					tlHeaderDetailModel.setData(g.headerDetail);
				}
			};
			var q = "/WorkCenterVHSet";
			var oFilters = [];
			var M = this.getView().getModel("valueHelp");
			var cells = [
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
				})
			];

			var wcpdtSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Werks", "Verwe");
			wcpdtSelectDialog.open();
			wcpdtSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onSysCondDtVH: function (oEvent) {

			var g = this;
			/*var a;
			var P = p;
			a = this.getView().byId(p);*/
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			/*var m = this.getView().byId("sysCondDt");
			var d = this.getView().byId("sysCondDescDt");*/
			var sydtSearchResults;
			if (sydtSearchResults === undefined) {

				var sydtSelectDialog = new sap.m.SelectDialog({

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
						/*m.setValue(E.getParameters().selectedItem.getProperty("title"));
						d.setValue(E.getParameters().selectedItem.getProperty("description"));*/
						g.headerDetail.Anlzu = E.getParameters().selectedItem.getProperty("title");
						g.headerDetail.sysCondDesc = E.getParameters().selectedItem.getProperty("description");
						tlHeaderDetailModel.setData(g.headerDetail);
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("ANLZU", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("ANLZUX", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				var q = "/SystemConditionSet";

				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var M = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							sydtSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{ANLZU}",
								description: "{ANLZUX}"
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							sydtSelectDialog.setModel(e);
							// sydtSelectDialog.setGrowingThreshold(h.results.length);
							sydtSelectDialog.bindAggregation("items", "/results", I);
						} else {
							sydtSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});
			} else {
				var e = new sap.ui.model.json.JSONModel();
				e.setData(sydtSearchResults);
				sydtSelectDialog.setModel(e);
				var I = sydtSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			sydtSelectDialog.open();

		},

		onStatusDtVH: function (oEvent) {

			var g = this;
			/*var a;
			var P = p;
			a = this.getView().byId(p);*/
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			/*var m = this.getView().byId("statusDt");
			var d = this.getView().byId("statusDescDt");*/
			var sdtSearchResults;
			if (sdtSearchResults === undefined) {

				var sdtSelectDialog = new sap.m.SelectDialog({

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
						/*m.setValueState("None");
						m.setValue(E.getParameters().selectedItem.getProperty("title"));
						d.setValue(E.getParameters().selectedItem.getProperty("description"));*/

						g.headerDetail.statusValueState = "None";
						g.headerDetail.Statu = E.getParameters().selectedItem.getProperty("title");
						g.headerDetail.statusDesc = E.getParameters().selectedItem.getProperty("description");
						tlHeaderDetailModel.setData(g.headerDetail);
						g.readHdrDefaults("status");
					},
					search: function (E) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("PLNST", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("TXT", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				});
				var q = "/StatusVHSet";

				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var M = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						if (h.results.length > 0) {
							sdtSearchResults = h;
							var I = new sap.m.StandardListItem({
								title: "{PLNST}",
								description: "{TXT}"
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							sdtSelectDialog.setModel(e);
							// sdtSelectDialog.setGrowingThreshold(h.results.length);
							sdtSelectDialog.bindAggregation("items", "/results", I);
						} else {
							sdtSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});

			} else {

				var e = new sap.ui.model.json.JSONModel();
				e.setData(sdtSearchResults);
				sdtSelectDialog.setModel(e);
				var I = sdtSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			sdtSelectDialog.open();

		},

		onAssemblyVH: function (oEvent) {
			var g = this;
			var tlHeaderDetailModel = this.getView().getModel("tlHeaderDetailModel");
			var settings = {
				title: this.getView().getModel("i18n").getProperty("Assembly"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
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
					/*m.setValue(E.getParameter("selectedItem").getCells()[0].getText());
					d.setValue(E.getParameter("selectedItem").getCells()[1].getText());*/

					g.headerDetail.assmbly = E.getParameter("selectedItem").getCells()[0].getText();
					g.headerDetail.assmblyDesc = E.getParameter("selectedItem").getCells()[2].getText();
					tlHeaderDetailModel.setData(g.headerDetail);
				}
			};
			var q = "/MaterialVH_PRTSet";
			var oFilters = [];
			var M = this.getView().getModel("valueHelp");
			var cells = [
				new sap.m.Text({
					text: "{Maktg}"
				}),
				new sap.m.Text({
					text: "{Spras}"
				}),
				new sap.m.Text({
					text: "{Matnr}"
				})
			];

			var asmblySelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Matnr", "Maktg");
			asmblySelectDialog.open();
			asmblySelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		validateFields: function () {
			var isValid = false;
			/*var grpC = this.getView().byId("grpCounterDt");
			var desc = this.getView().byId("descDt");
			var pPlant = this.getView().byId("planPlantDt");
			var status = this.getView().byId("statusDt");
			var usg = this.getView().byId("usageDt");*/
			var grpC = this.headerDetail.Plnal;
			var desc = this.headerDetail.Ktext;
			var pPlant = this.headerDetail.Iwerk;
			var status = this.headerDetail.Statu;
			var usg = this.headerDetail.Verwe;
			/*if (grpC.getValue() === "" || desc.getValue() === "" || pPlant.getValue() === "" || status.getValue() === "" || usg.getValue() ===
				"") {*/
			if (grpC === "" || desc === "" || pPlant === "" || status === "" || usg === "") {
				isValid = true;
				if (grpC === "") {
					// grpC.setValueState("Error");
					this.headerDetail.grpCntrValueState = "Error";
				}
				if (desc === "") {
					// desc.setValueState("Error");
					this.headerDetail.descDtValueState = "Error";
				}
				if (pPlant === "") {
					// pPlant.setValueState("Error");
					this.headerDetail.pPlantValueState = "Error";
				}
				if (status === "") {
					// status.setValueState("Error");
					this.headerDetail.statusValueState = "Error";
				}
				if (usg === "") {
					// usg.setValueState("Error");
					this.headerDetail.usgValueState = "Error";
				}
				this.getView().getModel("tlHeaderDetailModel").setData(this.headerDetail);
				var msg = this.getView().getModel("i18n").getProperty("MANDMSG");
				sap.m.MessageToast.show(msg, {
					duration: 10000 // default

				});

			}
			return isValid;
		},

		onHdrDonePress: function (e) {
			var valid = this.validateFields();
			// if (valid === true) {
			// 	return;
			// }
			var hdModel = sap.ui.getCore().getModel("tlDetailModel");
			var hdrData = hdModel.getData().header;
			var index = parseInt(this.itemPath.substr(-1));
			hdrData[index].Plnnr = this.headerDetail.Plnnr;
			hdrData[index].Plnal = this.headerDetail.Plnal;
			hdrData[index].Ktext = this.headerDetail.Ktext;
			hdrData[index].Iwerk = this.headerDetail.Iwerk;
			hdrData[index].pPlantDesc = this.headerDetail.pPlantDesc;
			hdrData[index].KapArbpl = this.headerDetail.KapArbpl;
			hdrData[index].Werks = this.headerDetail.Werks;
			hdrData[index].Verwe = this.headerDetail.Verwe;
			hdrData[index].usageDesc = this.headerDetail.usageDesc;
			hdrData[index].Vagrp = this.headerDetail.Vagrp;
			hdrData[index].plGrpDesc = this.headerDetail.plGrpDesc;
			hdrData[index].Statu = this.headerDetail.Statu;
			hdrData[index].statusDesc = this.headerDetail.statusDesc;
			hdrData[index].Anlzu = this.headerDetail.Anlzu;
			hdrData[index].sysCondDesc = this.headerDetail.sysCondDesc;
			hdrData[index].Strat = this.headerDetail.Strat;
			hdrData[index].stratDesc = this.headerDetail.stratDesc;

			var id = this.getView().getParent()._pageStack[0].id;
			id = id + "--taskListHeaderOverview";
			var hModel = new sap.ui.model.json.JSONModel();
			hModel.setData(hdrData);
			//sap.ui.getCore().byId(id).setModel(hModel, "tlDetailModel");
			sap.ui.getCore().setModel(hModel, "tlDetailModel");
			sap.ui.getCore().byId(id).setSelectedItem(sap.ui.getCore().byId(id).getItems()[index], true /*selected*/ ,
				true /*fire event*/ );
			window.history.go(-1);
		},

		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		// On Change
		onChange: function (oEvent) {
			var value = oEvent.getSource().getValue();
			var bindingPath;
			var tInput = oEvent.getSource().mBindingInfos.value.binding;
			if (tInput !== undefined && tInput !== null) {
				bindingPath = tInput.sPath;
			} else {
				bindingPath = oEvent.getSource().mBindingInfos.value.parts[0].path;
			}
			bindingPath = bindingPath.substring(1);
			switch (bindingPath) {
			case "Ktext":
				this._descChange(value, oEvent);
				break;
			case "Iwerk":
				this._planningPlant(value, oEvent);
				break;
			case "KapArbpl":
				this._mainWc(value, oEvent);
				break;
			case "Werks":
				this._mainWcPlnt(value, oEvent);
				break;
			case "Verwe":
				this._usage(value, oEvent);
				break;
			case "Vagrp":
				this._plannerGrp(value, oEvent);
				break;
			case "Statu":
				this._status(value, oEvent);
				break;
			case "Strat":
				this._maintenanceStrat(value, oEvent);
				break;
			case "assmbly":
				this._assmbly(value, oEvent);
				break;
			}
		},

		_descChange: function (f, oEvent) {
			var g = this;
			var tlHeaderDetailModel = g.getView().getModel("tlHeaderDetailModel");
			if (f !== "") {
				g.headerDetail.descDtValueState = "None";
				tlHeaderDetailModel.setData(g.headerDetail);
				g.readHdrDefaults("desc");
			}
		},

		_planningPlant: function (f, oEvent) {
			var g = this;
			var c = f.toUpperCase();
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var c = f.toUpperCase();
			// var cd = this.getView().byId("planPlantDescDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//modified model - 18/9
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/PlanningPlantSet";
				var oFilter = [new sap.ui.model.Filter("WERKS", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.headerDetail.pPlantValueState = "None";
							g.headerDetail.Iwerk = a;
							g.headerDetail.pPlantDesc = d.results[0].NAME1;
							tlDetailModel.setData(g.headerDetail);
							g.readHdrDefaults("planningPlant");
						} else {
							g.headerDetail.pPlantValueState = "Error";
							g.headerDetail.pPlantDesc = "";
							g.headerDetail.pPlantValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						g.headerDetail.pPlantValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.pPlantValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.headerDetail.Iwerk = a;
				tlDetailModel.setData(g.headerDetail);
			}
		},

		_mainWc: function (f, oEvent) {
			var c = f;
			var g = this;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			// var cd = this.getView().byId("wcPlantDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/WorkCenterSet";
				var oFilter = [new sap.ui.model.Filter("Arbpl", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							/*cd.setValue(d.results[0].Werks);
							f.setValue(a);*/
							g.headerDetail.wcDtValueState = "None";
							g.headerDetail.KapArbpl = a;
							g.headerDetail.Werks = d.results[0].Werks;
							tlDetailModel.setData(g.headerDetail);
						} else {
							/*f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");*/
							g.headerDetail.wcDtValueState = "Error";
							g.headerDetail.Werks = "";
							g.headerDetail.wcDtValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.headerDetail.wcDtValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.wcDtValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.headerDetail.KapArbpl = a;
				tlDetailModel.setData(g.headerDetail);
			}
		},

		_mainWcPlnt: function (f, oEvent) {
			var c = f;
			var g = this;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//var q = "/WorkCenterVHSet?$filter=" + jQuery.sap.encodeURL("Werks eq '" + c + "'");
				//	var q = "/WorkCenterSet?$filter=" + jQuery.sap.encodeURL("Werks eq '" + c + "'"); //modified : 19/09 - Entityset name modification.
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/WorkCenterSet";
				var oFilter = [new sap.ui.model.Filter("Werks", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							// f.setValue(a);
							g.headerDetail.wcPlantValueState = "None";
							g.headerDetail.Werks = a;
							tlDetailModel.setData(g.headerDetail);
						} else {
							/*f.setValueState("Error");
							f.setValueStateText("Invalid Entry");*/
							g.headerDetail.wcPlantValueState = "Error";
							g.headerDetail.wcPlantValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.headerDetail.wcPlantValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.wcPlantValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.headerDetail.Werks = a;
				tlDetailModel.setData(g.headerDetail);
			}
		},

		_usage: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			// var cd = this.getView().byId("usageDescDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//var q = "/UsageVHSet?$filter=" + jQuery.sap.encodeURL("VERWE eq '" + c + "'");
				//var m = this.getView().getModel();
				//modified model - 19/09
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/UsageVHSet";
				var oFilter = [new sap.ui.model.Filter("VERWE", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							/*f.setValueState("None");
							cd.setValue(d.results[0].TXT);
							f.setValue(a);*/
							g.headerDetail.usgValueState = "None";
							g.headerDetail.Verwe = a;
							g.headerDetail.usageDesc = d.results[0].TXT;
							tlDetailModel.setData(g.headerDetail);
							g.readHdrDefaults("usage");

						} else {
							/*f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");*/
							g.headerDetail.usgValueState = "Error";
							g.headerDetail.usageDesc = "";
							g.headerDetail.usgValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.headerDetail.usgValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.usgValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
				//end
			} else {
				// f.setValue(a);
				g.headerDetail.Verwe = a;
				tlDetailModel.setData(g.headerDetail);
			}
		},

		_plannerGrp: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			// var cd = this.getView().byId("plGrpDescDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//var q = "/PlannerGrpVHSet?$filter=" + jQuery.sap.encodeURL("FEVOR eq '" + c + "'");
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/PlannerGroupSet";
				var oFilter = [new sap.ui.model.Filter("FEVOR", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							/*f.setValue(a);
							cd.setValue(d.results[0].TXT);*/
							g.headerDetail.plGrpValueState = "None";
							g.headerDetail.Vagrp = a;
							g.headerDetail.plGrpDesc = d.results[0].TXT;
							tlDetailModel.setData(g.headerDetail);
							g.readHdrDefaults("usage");
						} else {
							/*f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");*/
							g.headerDetail.plGrpValueState = "Error";
							g.headerDetail.plGrpDesc = "";
							g.headerDetail.plGrpValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.headerDetail.plGrpValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.plGrpValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.headerDetail.Vagrp = a;
				tlDetailModel.setData(g.headerDetail);
			}
		},

		_status: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			//var cd = this.getView().byId("statusDescDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//var q = "/StatusVHSet?$filter=" + jQuery.sap.encodeURL("PLNST eq '" + c + "'");
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/StatusVHSet";
				var oFilter = [new sap.ui.model.Filter("PLNST", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							/*f.setValueState("None");
							cd.setValue(d.results[0].TXT);
							f.setValue(a);*/
							g.headerDetail.statusValueState = "None";
							g.headerDetail.Statu = a;
							g.headerDetail.statusDesc = d.results[0].TXT;
							tlDetailModel.setData(g.headerDetail);
							g.readHdrDefaults("status");
						} else {
							/*f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");*/
							g.headerDetail.statusValueState = "Error";
							g.headerDetail.statusDesc = "";
							g.headerDetail.statusValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.headerDetail.statusValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.statusValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.headerDetail.Statu = a;
				tlDetailModel.setData(g.headerDetail);
			}
		},

		_systemCondition: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			// var cd = this.getView().byId("sysCondDescDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var q = "/SystemConditionSet?$filter=" + jQuery.sap.encodeURL("ANLZU eq '" + c + "'");
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/SystemConditionSet";
				var oFilter = [new sap.ui.model.Filter("ANLZU", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							/*cd.setValue(d.results[0].ANLZUX);
							f.setValue(a);*/
							g.headerDetail.sysCondValueState = "None";
							g.headerDetail.Anlzu = a;
							g.headerDetail.sysCondDesc = d.results[0].ANLZUX;
							tlDetailModel.setData(g.headerDetail);
						} else {
							/*f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");*/
							g.headerDetail.sysCondValueState = "Error";
							g.headerDetail.sysCondDesc = "";
							g.headerDetail.sysCondValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.headerDetail.sysCondValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.sysCondValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.headerDetail.Anlzu = a;
				tlDetailModel.setData(g.headerDetail);
			}
		},

		_maintenanceStrat: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			// var cd = this.getView().byId("maintStrDescDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//modified model - 19/09
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				//end
				var m = this.getView().getModel("valueHelp");
				var q = "/MaintStratVHSet";
				var oFilter = [new sap.ui.model.Filter("Strat", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							/*cd.setValue(d.results[0].Ktext);
							f.setValue(a);*/
							g.headerDetail.maintStrValueState = "None";
							g.headerDetail.Strat = a;
							g.headerDetail.stratDesc = d.results[0].Ktext;
							tlDetailModel.setData(g.headerDetail);
						} else {
							/*f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");*/
							g.headerDetail.maintStrValueState = "Error";
							g.headerDetail.stratDesc = "";
							g.headerDetail.maintStrValueStateTxt = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.headerDetail.maintStrValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.maintStrValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.headerDetail.Strat = a;
				tlDetailModel.setData(g.headerDetail);
			}
		},

		_assmbly: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlDetailModel = this.getView().getModel("tlDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var m = this.getView().getModel("valueHelp");
				var q = "/MaterialVH_PRTSet";
				var oFilter = [new sap.ui.model.Filter("Strat", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.headerDetail.assemblyValueState = "None";
							g.headerDetail.assmbly = a;
							g.headerDetail.assmblyDesc = d.results[0].Maktg;
							tlDetailModel.setData(g.headerDetail);
						} else {
							g.headerDetail.assemblyValueState = "Error";
							g.headerDetail.stratDesc = "";
							g.headerDetail.assmblyDesc = "Invalid Entry";
							tlDetailModel.setData(g.headerDetail);
						}
					},
					error: function (e) {
						g.headerDetail.assemblyValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.headerDetail.assemblyValueStateTxt = d;
						tlDetailModel.setData(g.headerDetail);
					}
				});
			} else {
				g.headerDetail.assmbly = a;
				tlDetailModel.setData(g.headerDetail);
			}
		}

	});

});