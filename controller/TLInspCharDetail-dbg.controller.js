sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"sap/ui/core/message/Message",
	"sap/m/BusyDialog",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
], function (BaseController, JSONModel, formatter, History, ValueHelpProvider, Message, BusyDialog, ValueHelpRequest) {
	"use strict";

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.TLInspCharDetail", {

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

			this.getRouter().getRoute("tlInspChar").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			var oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			// var serviceUrl = oComponent.getModel().sServiceUrl;
			// var oModel = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(oModel);

			// var vhServiceUrl = oComponent.getModel("NewModel").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(vhModel, "valueHelp");

			// var vhServiceUrl = oComponent.getModel("NewModel2").sServiceUrl;
			// var vhModel = new sap.ui.model.odata.v2.ODataModel(vhServiceUrl, {
			// 	json: true,
			// 	useBatch: false,
			// 	loadMetadataAsync: true,
			// 	refreshAfterChange: false,
			// 	defaultCountMode: sap.ui.model.odata.CountMode.None
			// });
			// this.getView().setModel(oModel);
			// this.getView().setModel(vhModel, "valueHelp2");
			
			var oModel = oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);
			
			var vhModel = oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");
			
			var vhModel2 = oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");
		},

		// /* =========================================================== */
		// /* event handlers                                              */
		// /* =========================================================== */

		// /**
		//  * Event handler  for navigating back.
		//  * It there is a history entry we go one step back in the browser history
		//  * If not, it will replace the current entry of the browser history with the worklist route.
		//  * @public
		//  */
		onNavBack: function () {
			window.history.go(-1);
		},

		// /* =========================================================== */
		// /* internal methods                                            */
		// /* =========================================================== */

		// /**
		//  * Binds the view to the object path.
		//  * @function
		//  * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		//  * @private
		//  */
		_onObjectMatched: function (oEvent) {

			var icModel = new sap.ui.model.json.JSONModel();
			var tlData = sap.ui.getCore().getModel("tlDetailModel");
			icModel.setData(tlData.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));
			this.setModel(icModel, "icModel");

			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "icModel"
			});
		},

		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		onMastInspCharVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			// var sPath = oEvent.getSource().getParent().getBindingContextPath();

			var settings = {
				title: "Master Insp. Charac.",
				noDataText: "{i18n>LOAD}" + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "Plant"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Mstr Insp. Charac."
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Version"
							})
						]
					})
				],
				items: {
					path: "/TLInspCharVHSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Zaehler}"
							}),
							new sap.m.Text({
								text: "{Mkmnr}"
							}),
							new sap.m.Text({
								text: "{Version}"
							})
						]
					})

				},
				confirm: function (E) {
					icData.MastInspChar = E.getParameter("selectedItem").getCells()[1].getText();
					icData.ShrtTxt = E.getParameter("selectedItem").getCells()[1].getText();
					icData.Plant = E.getParameter("selectedItem").getCells()[0].getText();
					icData.Version = E.getParameter("selectedItem").getCells()[2].getText();
					icData.MastInspCharVS = "None";
					icData.VersionVS = "None";
					icData.InspMthdPlntVS = "None";
					icModel.refresh();
					g.readInspChar(icData.Plant, icData.MastInspChar, icData.Version);
				}
			};

			var q = "/TLInspCharVHSet";
			var aFilter = []
			var cells = [
				new sap.m.Text({
					text: "{Zaehler}"
				}),
				new sap.m.Text({
					text: "{Mkmnr}"
				}),
				new sap.m.Text({
					text: "{Version}"
				})
			];
			var inspSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, aFilter, settings, "Mkmnr", "Zaehler");
			inspSelectDialog.open();
			inspSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},
		
		readInspChar: function (pl, mic, ver) {
			var g = this;
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			var M = g.getView().getModel("valueHelp2");
			var q = "/TLPresetIndSet(Werks='" + pl + "',Mic='" + mic + "',Version='" + ver + "')";
			M.read(q, {
				success: function (r) {
					icData.QualChar = r.Qualitat;
					icData.QuanChar = r.Quantitat;
					icModel.refresh();
				},
				error: function (e) {
					var b = JSON.parse(e.responseText);
					var d = b.error.message.value;
					g.showMessage(d);
				}
			});
		},

		onMastInspCharChange: function (f) {
			var g = this;
			var oSource = f.getSource();
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			// var sPath = oSource.getParent().getBindingContextPath();
			var c = oSource.getValue();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			var M = g.getView().getModel("valueHelp2");
			if (a !== "") {
				a = a.toUpperCase();
				var aFilter = [new sap.ui.model.Filter("Mkmnr", "EQ", a)]
				M.read("/TLInspCharVHSet", {
					filters: aFilter,
					success: function (r) {
						if (r.results.length > 0) {
							icData.MastInspChar = r.results[0].Mkmnr;
							icData.ShrtTxt = r.results[0].Mkmnr;
							icData.MastInspCharVS = "None";
							icModel.refresh();
							g.readInspChar(icData.Plant, icData.MastInspChar, icData.Version);
						} else {
							icData.MastInspCharVS = "Error";
							icModel.refresh();
						}
					},
					error: function (err) {
						icData.MastInspCharVS = "Error";
						icModel.refresh();
					}
				});
			} else {
				icData.MastInspCharVS = "None";
				icModel.refresh();
			}
		},

		onICPlantChange: function (f) {
			var g = this;
			var oSource = f.getSource();
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			// var sPath = oSource.getParent().getBindingContextPath();
			var c = oSource.getValue();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			var M = g.getView().getModel("valueHelp2");
			if (a !== "") {
				a = a.toUpperCase();
				var aFilter = [new sap.ui.model.Filter("Zaehler", "EQ", a)]
				M.read("/TLInspCharVHSet", {
					filters: aFilter,
					success: function (r) {
						if (r.results.length > 0) {
							icData.Plant = r.results[0].Zaehler;
							icData.PlantVS = "None";
							icModel.refresh();
						} else {
							icData.PlantVS = "Error";
							icModel.refresh();
						}
					},
					error: function (err) {
						icData.PlantVS = "Error";
						icModel.refresh();
					}
				});
			} else {
				icData.PlantVS = "None";
				icModel.refresh();
			}
		},

		onICVersionChange: function (f) {
			var g = this;
			var oSource = f.getSource();
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			// var sPath = oSource.getParent().getBindingContextPath();
			var c = oSource.getValue();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			var M = g.getView().getModel("valueHelp2");
			if (a !== "") {
				a = a.toUpperCase();
				var aFilter = [new sap.ui.model.Filter("Version", "EQ", a)]
				M.read("/TLInspCharVHSet", {
					filters: aFilter,
					success: function (r) {
						if (r.results.length > 0) {
							icData.Version = r.results[0].Version;
							icData.VersionVS = "None";
							icModel.refresh();
						} else {
							icData.VersionVS = "Error";
							icModel.refresh();
						}
					},
					error: function (err) {
						icData.VersionVS = "Error";
						icModel.refresh();
					}
				});
			} else {
				icData.VersionVS = "None";
				icModel.refresh();
			}
		},

		onSampProcVH: function (oEvent) {
			var g = this;
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			// var sPath = oEvent.getSource().getParent().getBindingContextPath();
			var settings = {
				title: "Sample Procedure",
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/TLSampPrcVHSet",
					template: new sap.m.StandardListItem({
						title: "{Stichprver}",
						description: "{Kurztext}"
					})
				},
				confirm: function (E) {
					icData.SampProc = E.getParameters().selectedItem.getProperty("title");
					icData.SampProcVS = "None";
					icModel.refresh();
				}
			};

			var q = "/TLSampPrcVHSet";
			var M = g.getView().getModel("valueHelp2");
			var tlUsgSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Stichprver", "Kurztext");
			tlUsgSelectDialog.open();
		},

		onSampProcChange: function (oEvent) {
			var g = this;
			var oSource = f.getSource();
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			var sPath = oSource.getParent().getBindingContextPath();
			var c = oSource.getValue();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			var M = g.getView().getModel("valueHelp2");
			if (a !== "") {
				a = a.toUpperCase();
				var aFilter = [new sap.ui.model.Filter("Stichprver", "EQ", a)]
				M.read("/TLSampPrcVHSet", {
					filters: aFilter,
					success: function (r) {
						if (r.results.length > 0) {
							icData.SampProc = r.results[0].Stichprver;
							icData.SampProcVS = "None";
							icModel.refresh();
						} else {
							icData.SampProcVS = "Error";
							icModel.refresh();
						}
					},
					error: function (err) {
						icData.SampProcVS = "Error";
						icModel.refresh();
					}
				});
			} else {
				icData.SampProcVS = "None";
				icModel.refresh();
			}
		},

		onInspMthdVH: function (oEvent) {
			var g = this;
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			// var sPath = oEvent.getSource().getParent().getBindingContextPath();

			var settings = {
				title: "Inspection Method",
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
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
								text: "Insp. Method"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Version"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Short Text"
							})
						]
					})
				],
				items: {
					path: "/TLInspMethVHSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Werks}"
							}),
							new sap.m.Text({
								text: "{Pmtnr}"
							}),
							new sap.m.Text({
								text: "{Version}"
							}),
							new sap.m.Text({
								text: "{Kurztext}"
							})
						]
					})
				},
				confirm: function (E) {
					icData.InspMthd = E.getParameter("selectedItem").getCells()[1].getText();
					icData.VrsnInspMthd = E.getParameter("selectedItem").getCells()[2].getText();
					icData.InspMthdVS = "None";
					icModel.refresh();
				},
				search: function (E) {
					if (E.getSource().getBinding("items")) {
						var sValue = E.getParameter("value");
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Pmtnr", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Kurztext", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}
				}
			};
			var q = "/TLInspMethVHSet";
			var oFilters = [];
			var oModel = g.getView().getModel("valueHelp2");
			var cells = [
				new sap.m.Text({
					text: "{Werks}"
				}),
				new sap.m.Text({
					text: "{Pmtnr}"
				}),
				new sap.m.Text({
					text: "{Version}"
				}),
				new sap.m.Text({
					text: "{Kurztext}"
				})
			];

			var inspSelectDialog = ValueHelpProvider.getValueHelp(oModel, q, cells, oFilters, settings, "Pmtnr", "Kurztext");
			inspSelectDialog.open();
			inspSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		InspMthdPlntChange: function (oEvent, g) {
			var oSource = f.getSource();
			var g = this;
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();
			// var sPath = oSource.getParent().getBindingContextPath();
			var c = oSource.getValue();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			var M = g.getView().getModel("valueHelp2");
			if (a !== "") {
				a = a.toUpperCase();
				var aFilter = [new sap.ui.model.Filter("Pmtnr", "EQ", a)]
				M.read("/TLInspMethVHSet", {
					filters: aFilter,
					success: function (r) {
						if (r.results.length > 0) {
							icData.InspMthdPlnt = r.results[0].Pmtnr;
							icData.VrsnInspMthd = r.results[0].Version;
							icData.InspMthdPlntVS = "None";
							icModel.refresh();
						} else {
							icData.InspMthdPlntVS = "Error";
							icModel.refresh();
						}
					},
					error: function (err) {
						icData.InspMthdPlntVS = "Error";
						icModel.refresh();
					}
				});
			} else {
				icData.InspMthdPlntVS = "None";
				icModel.refresh();
			}
		},

		onInspCharDonePress: function () {
			var g = this;
			var icModel = this.getModel("icModel");
			var icData = icModel.getData();

			if (icData.MastInspChar === "" || icData.MastInspCharVS === "Error") {
				var sMsg = "Enter Master Inspection Characteristic";
				this.createMessagePopover(aMsg, "Error");
				return;
			}

			window.history.go(-1);
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