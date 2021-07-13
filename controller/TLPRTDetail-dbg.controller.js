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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.TLPRTDetail", {

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

			this.getRouter().getRoute("tlPRT").attachPatternMatched(this._onObjectMatched, this);

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

			var prtModel = new sap.ui.model.json.JSONModel();
			var tlData = sap.ui.getCore().getModel("tlDetailModel");
			prtModel.setData(tlData.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));
			this.setModel(prtModel, "prtModel");

			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "prtModel"
			});
		},

		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		onPRTMaterialVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var prtMatSelectDialog = new sap.m.TableSelectDialog({
				title: "Material",
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
					prtData.PRT = E.getParameter("selectedItem").getCells()[2].getText();
					prtData.PRTDesc = E.getParameter("selectedItem").getCells()[0].getText();
					prtData.Mat = E.getParameter("selectedItem").getCells()[2].getText();
					prtData.MatDesc = E.getParameter("selectedItem").getCells()[0].getText();
					prtData.PRTVS = "None";
					prtModel.refresh();

					g.deriveMatPlant(prtData.PRT);
				},
				liveChange: function (E) {
					var v = E.getParameter("value").toUpperCase();
					v = v.replace(/^[ ]+|[ ]+$/g, '');
					var h = prtMatSelectDialog.getItems();
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
			prtMatSelectDialog.setModel(M);
			prtMatSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			prtMatSelectDialog.open();
		},

		onPRTMaterialChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var m = this.getView().getModel("valueHelp");
			var c = value.toUpperCase();
			var q = "/MaterialVH_PRTSet";
			var oFilter = new sap.ui.model.Filter("Matnr", "EQ", c);
			var m = this.getView().getModel("valueHelp");
			m.read(q, {
				filters: [oFilter],
				success: function (d) {
					if (d.results.length > 0) {
						prtData.PRT = d.results[0].Matnr;
						prtData.PRTDesc = d.results[0].Maktg;
						prtData.Mat = d.results[0].Matnr;
						prtData.MatDesc = d.results[0].Maktg;
						prtData.PRTVS = "None";
						prtModel.refresh();

						g.deriveMatPlant(prtData.Mat);
					} else {
						prtData.PRT = "";
						prtData.PRTDesc = "";
						prtData.MatDesc = "";
						prtData.PRTVS = "Error";
						prtModel.refresh();
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
					prtData.PRTVS = "Error";
					prtModel.refresh();
				}
			});
		},

		deriveMatPlant: function (material) {
			var g = this;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var q = "/MatPlantSet";
			var oFilter = new sap.ui.model.Filter("Matnr", "EQ", material);
			var m = this.getView().getModel("valueHelp2");
			m.read(q, {
				filters: [oFilter],
				success: function (d) {
					if (d.results.length > 0) {
						prtData.Plant = d.results[0].Werks;
						prtData.PlantVS = "None";
						prtModel.refresh();

						g.derivePRTdata();
					} else {
						prtData.PlantVS = "Error";
						prtModel.refresh();
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
					prtData.PlantVS = "Error";
					prtModel.refresh();
				}
			});
		},

		derivePRTdata: function () {
			var g = this;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var q = "/TLPRTDeriveSet";
			var aFilter = [];
			if (prtData.ItmCat === "M") {
				aFilter.push(new sap.ui.model.Filter("Matnr", "EQ", prtData.Mat));
				aFilter.push(new sap.ui.model.Filter("Fhwrk", "EQ", prtData.Plant));
				aFilter.push(new sap.ui.model.Filter("Fhmar", "EQ", prtData.ItmCat));
			} else if (prtData.ItmCat === "D") {
				aFilter.push(new sap.ui.model.Filter("Doknr", "EQ", prtData.Mat));
				aFilter.push(new sap.ui.model.Filter("Dokar", "EQ", prtData.docType));
				aFilter.push(new sap.ui.model.Filter("Dokvr", "EQ", prtData.docPart));
				aFilter.push(new sap.ui.model.Filter("Doktl", "EQ", prtData.docVersion));
				aFilter.push(new sap.ui.model.Filter("Fhmar", "EQ", prtData.ItmCat));
			} else if (prtData.ItmCat === "O") {
				aFilter.push(new sap.ui.model.Filter("Doknr", "EQ", prtData.Mat));
				aFilter.push(new sap.ui.model.Filter("Fhmar", "EQ", "S"));
			}
			var m = this.getView().getModel("valueHelp2");
			m.read(q, {
				filters: aFilter,
				success: function (d) {
					if (d.results.length > 0) {
						prtData.Qty = d.results[0].Mgvgw;
						prtData.UOM = d.results[0].Mgeinh;
						prtData.QtyFrmla = d.results[0].Mgform;
						prtData.PRTCtrl = d.results[0].Steuf;
						prtData.PRTCtrlDesc = d.results[0].Stftxt;
						prtData.QtyVS = "None";
						prtData.UOMVS = "None";
						prtData.QtyFrmlaVS = "None";
						prtData.PRTCtrlVS = "None";
						prtData.StdUsgVal = d.results[0].Ewvgw;
						prtData.StdUsgUOM = d.results[0].Eweinh;
						prtData.UsgValFrmla = d.results[0].Ewform;
						prtData.StdUsgValVS = "None";
						prtData.StdUsgUOMVS = "None";
						prtData.UsgValFrmlaVS = "None";
						prtModel.refresh();
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
				}
			});
		},

		onPRTEquipmentVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var Dialog = new sap.m.SelectDialog({
				title: "{i18n>EQUI_TXT}",
				noDataText: "{i18n>LOAD}" + "...",
				confirm: function (E) {
					prtData.PRT = E.getParameters().selectedItem.getProperty("title");
					prtData.PRTDesc = E.getParameters().selectedItem.getProperty("description");
					prtData.Equi = E.getParameters().selectedItem.getProperty("title");
					prtData.EquiDesc = E.getParameters().selectedItem.getProperty("description");
					prtData.PRTVS = "None";
					prtModel.refresh();
				},
				search: function (E) {
					var sValue = E.getParameter("value");
					E.getSource().getBinding("items").filter(!sValue ? [] : [
						new sap.ui.model.Filter(
							[
								new sap.ui.model.Filter("Equnr", sap.ui.model.FilterOperator.Contains, sValue),
								new sap.ui.model.Filter("Eqktu", sap.ui.model.FilterOperator.Contains, sValue)
							],
							false)
					]);
				}
			});

			var q = "/EquipPRTSet";
			M.read(q, {
				success: function (h, E) {
					var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].Equnr) {
								var sObj = {
									Equnr: oModelData[i].Equnr,
									Eqktu: oModelData[i].Eqktx
								};
								h.results.unshift(sObj);
							}
						}
					}
					if (h.results.length > 0) {
						var I = new sap.m.StandardListItem({
							title: "{Equnr}",
							description: "{Eqktu}",
							active: true
						});
						var e = new sap.ui.model.json.JSONModel();
						e.setData(h);
						e.isSizeLimit = h.results.length;
						e.setSizeLimit(h.results.length);
						Dialog.setModel(e);
						Dialog.setGrowingThreshold(h.results.length);
						Dialog.bindAggregation("items", "/results", I);
					} else {
						Dialog.setNoDataText(Dialog.getModel("i18n").getProperty("NO_DATA"));
					}
				}
			});
			Dialog.open();
		},

		onPRTEquipmentChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var c = value.toUpperCase();
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
			if (oModelData.length > 0) {
				for (var i = 0; i < oModelData.length; i++) {
					if (oModelData[i].Equnr === c) {
						prtData.PRT = oModelData[i].Equnr;
						prtData.PRTDesc = oModelData[i].Eqktx;
						prtData.Equi = oModelData[i].Equnr;
						prtData.EquiDesc = oModelData[i].Eqktx;
						prtData.PRTVS = "None";
						prtModel.refresh();
						return;
					}
				}
			}

			var q = "/EquipPRTSet";
			var oFilter = new sap.ui.model.Filter("Equnr", "EQ", c);
			var m = this.getView().getModel("valueHelp2");
			m.read(q, {
				filters: [oFilter],
				success: function (d) {
					if (d.results.length > 0) {
						prtData.PRT = d.results[0].Equnr;
						prtData.PRTDesc = d.results[0].Eqktu;
						prtData.Equi = d.results[0].Equnr;
						prtData.EquiDesc = d.results[0].Eqktu;
						prtData.PRTVS = "None";
						prtModel.refresh();
					} else {
						prtData.PRT = "";
						prtData.PRTDesc = "";
						prtData.EquiDesc = "";
						prtData.PRTVS = "Error";
						prtModel.refresh();
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
					prtData.PRTVS = "Error";
					prtModel.refresh();
				}
			});
		},

		onPRTDocumentVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var settings = {
				title: g.getView().getModel("i18n").getProperty("DOC"),
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [
					new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>DOC}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>DOC_TYP}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>DOC_PART}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>DOC_VER}"
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
								text: "Doc.Type Desc."
							})
						]
					})
				],
				items: {
					path: "/DocPrtSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Doknr}"
							}),
							new sap.m.Text({
								text: "{Dokar}"
							}),
							new sap.m.Text({
								text: "{Doktl}"
							}),
							new sap.m.Text({
								text: "{Dokvr}"
							}),
							new sap.m.Text({
								text: "{Dktxt}"
							}),
							new sap.m.Text({
								text: "{dartxt}"
							})
						]
					})

				},
				confirm: function (E) {
					prtData.doc = E.getParameter("selectedItem").getCells()[0].getText();
					prtData.docDesc = E.getParameter("selectedItem").getCells()[4].getText();
					prtData.docType = E.getParameter("selectedItem").getCells()[1].getText();
					prtData.docTypeDesc = E.getParameter("selectedItem").getCells()[5].getText();
					prtData.docPart = E.getParameter("selectedItem").getCells()[2].getText();
					prtData.docVersion = E.getParameter("selectedItem").getCells()[3].getText();
					prtData.PRT = prtData.doc + "-" + prtData.docType + "-" + prtData.docPart + "-" + prtData.docVersion;
					prtData.PRTDesc = "";
					prtData.PRTVS = "None";
					prtModel.refresh();
					g.derivePRTdata();
				}
			};

			var sPath = "/DocPrtSet";
			var oFilters = [];
			var oModel = g.getView().getModel("valueHelp2");
			var cells = [
				new sap.m.Text({
					text: "{Doknr}"
				}),
				new sap.m.Text({
					text: "{Dokar}"
				}),
				new sap.m.Text({
					text: "{Doktl}"
				}),
				new sap.m.Text({
					text: "{Dokvr}"
				}),
				new sap.m.Text({
					text: "{Dktxt}"
				}),
				new sap.m.Text({
					text: "{dartxt}"
				})
			];

			var docSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Doknr", "Dktxt");
			docSelectDialog.open();
			docSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onPRTDocumentChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var m = this.getView().getModel("valueHelp2");
			var c = value.toUpperCase();
			var q = "/DocPrtSet";
			var oFilter = new sap.ui.model.Filter("Doknr", "EQ", c);
			var m = this.getView().getModel("valueHelp2");
			m.read(q, {
				filters: [oFilter],
				success: function (d) {
					if (d.results.length > 0) {
						prtData.doc = d.results[0].Matnr;
						prtData.docDesc = d.results[0].Maktg;
						prtData.docType = d.results[0].Dokar;
						prtData.docTypeDesc = d.results[0].dartxt;
						prtData.docPart = d.results[0].Doktl;
						prtData.docVersion = d.results[0].Dokvr;
						prtData.PRT = prtData.doc + "-" + prtData.docType + "-" + prtData.docPart + "-" + prtData.docVersion;
						prtData.PRTVS = "None";
						prtModel.refresh();
						g.derivePRTdata();
					} else {
						prtData.PRT = "";
						prtData.PRTDesc = "";
						prtData.PRTVS = "Error";
						prtData.docType = "";
						prtData.docTypeDesc = "";
						prtData.docPart = "";
						prtData.docVersion = "";
						prtModel.refresh();
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
					prtData.PRT = "";
					prtData.PRTVS = "Error";
					prtData.docType = "";
					prtData.docTypeDesc = "";
					prtData.docPart = "";
					prtData.docVersion = "";
					prtModel.refresh();
				}
			});
		},

		onPRTOthersVH: function (oEvent) {
			var g = this;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var settings = {
				title: "Prod. Resource Tools",
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [
					new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "PRT"
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
								text: "Grouping Key 1"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Grouping Key 2"
							})
						]
					})
				],
				items: {
					path: "/OtherPRTSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Sfhnr}"
							}),
							new sap.m.Text({
								text: "{KtextUp}"
							}),
							new sap.m.Text({
								text: "{Fgru1}"
							}),
							new sap.m.Text({
								text: "{Fgru2}"
							})
						]
					})

				},
				confirm: function (E) {
					prtData.PRT = E.getParameter("selectedItem").getCells()[0].getText();
					prtData.PRTDesc = E.getParameter("selectedItem").getCells()[1].getText();
					prtData.Othr = E.getParameter("selectedItem").getCells()[0].getText();
					prtData.OthrDesc = E.getParameter("selectedItem").getCells()[1].getText();
					prtData.PRTVS = "None";
					prtModel.refresh();
					g.derivePRTdata();
				}
			};

			var sPath = "/OtherPRTSet";
			var oFilters = [];
			var oModel = g.getView().getModel("valueHelp2");
			var cells = [
				new sap.m.Text({
					text: "{Sfhnr}"
				}),
				new sap.m.Text({
					text: "{KtextUp}"
				}),
				new sap.m.Text({
					text: "{Fgru1}"
				}),
				new sap.m.Text({
					text: "{Fgru2}"
				})
			];

			var prtSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Sfhnr", "KtextUp");
			prtSelectDialog.open();
			prtSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onPRTOthersChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var m = this.getView().getModel("valueHelp2");
			var c = value.toUpperCase();
			var q = "/OtherPRTSet";
			var oFilter = new sap.ui.model.Filter("Sfhnr", "EQ", c);
			var m = this.getView().getModel("valueHelp2");
			m.read(q, {
				filters: [oFilter],
				success: function (d) {
					if (d.results.length > 0) {
						prtData.PRT = d.results[0].Sfhnr;
						prtData.PRTDesc = d.results[0].KtextUp;
						prtData.Othr = d.results[0].Sfhnr;
						prtData.OthrDesc = d.results[0].KtextUp;
						prtData.PRTVS = "None";
						prtModel.refresh();
						g.derivePRTdata();
					} else {
						prtData.PRT = "";
						prtData.PRTDesc = "";
						prtData.OthrDesc = "";
						prtData.PRTVS = "Error";
						prtModel.refresh();
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
					prtData.PRTVS = "Error";
					prtModel.refresh();
				}
			});
		},

		onPRTMSPTVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var Dialog = new sap.m.TableSelectDialog({
				title: "Measuring Point",
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [
					new sap.m.Column({
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
								text: "Meas. Description"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Equipment"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Functional Location"
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
					})
				],
				items: {
					path: "/DocPrtSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Point}"
							}),
							new sap.m.Text({
								text: "{Pttxt}"
							}),
							new sap.m.Text({
								text: "{Equnr}"
							}),
							new sap.m.Text({
								text: "{Tplnr}"
							}),
							new sap.m.Text({
								text: "{Descr}"
							})
						]
					})

				},
				confirm: function (E) {
					prtData.PRT = E.getParameter("selectedItem").getCells()[0].getText();
					prtData.PRTDesc = E.getParameter("selectedItem").getCells()[1].getText();
					prtData.Mspt = E.getParameter("selectedItem").getCells()[0].getText();
					prtData.MsptDesc = E.getParameter("selectedItem").getCells()[1].getText();
					prtData.PRTVS = "None";
					prtModel.refresh();
				}
			});

			var oprEqui = "";
			var oprFloc = "";
			var tlData = sap.ui.getCore().getModel("tlDetailModel").getData();
			for (var i in tlData.lOperation) {
				if (tlData.lOperation[i].Vornr === prtData.Vornr) {
					oprEqui = tlData.lOperation[i].equi;
					oprFloc = tlData.lOperation[i].floc;
					break;
				}
			}
			var q = "/MsptPrtVHSet";
			var aFilters = [new sap.ui.model.Filter("Tplnr", "EQ", oprFloc),
				new sap.ui.model.Filter("Equnr", "EQ", oprEqui)
			];
			var oModel = g.getView().getModel("valueHelp2");
			oModel.read(q, {
				filters: aFilters,
				success: function (h, E) {
					var oModelData = sap.ui.getCore().getModel("AIWMSPT").getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].Mspoint) {
								var sObj = {
									Point: oModelData[i].Mspoint,
									Pttxt: oModelData[i].Pttxt
								};
								if (oModelData[i].ObtypMs === "IEQ") {
									sObj.Equnr = oModelData[i].Equnr;
									sObj.Descr = oModelData[i].Eqktx;
									sObj.Tplnr = "";
								} else if (oModelData[i].ObtypMs === "IFL") {
									sObj.Equnr = "";
									sObj.Descr = oModelData[i].Pltxt;
									sObj.Tplnr = oModelData[i].Tplnr;
								}
								h.results.unshift(sObj);
							}
						}
					}
					if (h.results.length > 0) {
						var I = new sap.m.ColumnListItem({
							type: "Active",
							unread: false,
							cells: [
								new sap.m.Text({
									text: "{Point}"
								}),
								new sap.m.Text({
									text: "{Pttxt}"
								}),
								new sap.m.Text({
									text: "{Equnr}"
								}),
								new sap.m.Text({
									text: "{Tplnr}"
								}),
								new sap.m.Text({
									text: "{Descr}"
								})
							]
						});
						var e = new sap.ui.model.json.JSONModel();
						e.setData(h);
						e.isSizeLimit = h.results.length;
						e.setSizeLimit(h.results.length);
						Dialog.setModel(e);
						Dialog.setGrowingThreshold(h.results.length);
						Dialog.bindAggregation("items", "/results", I);
					} else {
						Dialog.setNoDataText(Dialog.getModel("i18n").getProperty("NO_DATA"));
					}
				}
			});
			Dialog.open();
		},

		onPRTMSPTChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var m = this.getView().getModel("valueHelp2");
			var c = value.toUpperCase();

			var oModelData = sap.ui.getCore().getModel("AIWMSPT").getData();
			if (oModelData.length > 0) {
				for (var i = 0; i < oModelData.length; i++) {
					if (oModelData[i].Mspoint === c) {
						prtData.PRT = oModelData[i].Mspoint;
						prtData.PRTDesc = oModelData[i].Pttxt;
						prtData.Mspt = oModelData[i].Mspoint;
						prtData.MsptDesc = oModelData[i].Pttxt;
						prtData.PRTVS = "None";
						prtModel.refresh();
						return;
					}
				}
			}

			var q = "/MsptPrtVHSet";
			// var oFilter = new sap.ui.model.Filter("Point", "EQ", c);
			var aFilters = [new sap.ui.model.Filter("Tplnr", "EQ", oprFloc),
				new sap.ui.model.Filter("Equnr", "EQ", oprEqui),
				new sap.ui.model.Filter("Point", "EQ", c)
			];
			var m = this.getView().getModel("valueHelp2");
			m.read(q, {
				filters: aFilters,
				success: function (d) {
					if (d.results.length > 0) {
						prtData.PRT = d.results[0].Point;
						prtData.PRTDesc = d.results[0].Pttxt;
						prtData.Mspt = d.results[0].Point;
						prtData.MsptDesc = d.results[0].Pttxt;
						prtData.PRTVS = "None";
						prtModel.refresh();
					} else {
						prtData.PRT = "";
						prtData.PRTDesc = "";
						prtData.MsptDesc = "";
						prtData.PRTVS = "Error";
						prtModel.refresh();
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
					prtData.PRTVS = "Error";
					prtModel.refresh();
				}
			});
		},

		onPRTCtrlVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			// var sPath = oEvent.getSource().getParent().getBindingContextPath();

			var settings = {
				title: "Control Key",
				noDataText: "{i18n>LOAD}" + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "PRT Control Profile"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Schedule"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Calculate"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Control"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Print"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Expand"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Ctrl Key Text"
							})
						]
					})
				],
				items: {
					path: "/PrtCtlProfSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Steuf}"
							}),
							new sap.m.Text({
								text: "{path:'Xterm', formatter:'.formatter.truetoX'}"
							}),
							new sap.m.Text({
								text: "{path:'Xkalk', formatter:'.formatter.truetoX'}"
							}),
							new sap.m.Text({
								text: "{path:'Xrueck', formatter:'.formatter.truetoX'}"
							}),
							new sap.m.Text({
								text: "{path:'Xdruck', formatter:'.formatter.truetoX'}"
							}),
							new sap.m.Text({
								text: "{path:'Xexpand', formatter:'.formatter.truetoX'}"
							}),
							new sap.m.Text({
								text: "{Stftxt}"
							})
						]
					})

				},
				confirm: function (E) {
					prtData.PRTCtrl = E.getParameter("selectedItem").getCells()[0].getText();
					prtData.PRTCtrlDesc = E.getParameter("selectedItem").getCells()[6].getText();
					prtData.PRTCtrlVS = "None";
					prtModel.refresh();
				}
			};

			var q = "/PrtCtlProfSet";
			var aFilter = [];
			var cells = [
				new sap.m.Text({
					text: "{Steuf}"
				}),
				new sap.m.Text({
					text: "{path:'Xterm', formatter:'.formatter.truetoX'}"
				}),
				new sap.m.Text({
					text: "{path:'Xkalk', formatter:'.formatter.truetoX'}"
				}),
				new sap.m.Text({
					text: "{path:'Xrueck', formatter:'.formatter.truetoX'}"
				}),
				new sap.m.Text({
					text: "{path:'Xdruck', formatter:'.formatter.truetoX'}"
				}),
				new sap.m.Text({
					text: "{path:'Xexpand', formatter:'.formatter.truetoX'}"
				}),
				new sap.m.Text({
					text: "{Stftxt}"
				})
			];
			var prtCKtSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, aFilter, settings, "Steuf", "Stftxt");
			prtCKtSelectDialog.open();
			prtCKtSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},
		onPRTCtrlChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var m = this.getView().getModel("valueHelp2");
			var c = value.toUpperCase();
			var aFilter = [new sap.ui.model.Filter("Steuf", "EQ", c)];
			m.read("/PrtCtlProfSet", {
				filters: aFilter,
				success: function (r) {
					if (r.results.length > 0) {
						prtData.PRTCtrl = r.results[0].Steuf;
						prtData.PRTCtrlDesc = r.results[0].Stftxt;
						prtData.PRTCtrlVS = "None";
						prtModel.refresh();
					} else {
						prtData.PRTCtrlVS = "Error";
						prtModel.refresh();
					}
				},
				error: function (err) {
					prtData.PRTCtrlVS = "Error";
					prtModel.refresh();
				}
			});
		},

		onPRTQtyChange: function (oEvent) {
			var oSource = oEvent.getSource();
			var sValue = oSource.getValue();
			oSource.setValueState("None");
			if (sValue === "") {
				oSource.setValueState("Error");
			} else if (parseInt(sValue) <= 0) {
				oSource.setValueState("Error");
			}
		},

		onPRTUOMVH: function (oEvent) {
			ValueHelpRequest.UOMVH(oEvent, this);
		},
		onPRTUOMChange: function (oEvent) {
			ValueHelpRequest._UOMchange(oEvent, this);
		},

		onStdUsgUOMVH: function (oEvent) {
			ValueHelpRequest.UOMVH(oEvent, this);
		},
		onStdUsgUOMChange: function (oEvent) {
			ValueHelpRequest._UOMchange(oEvent, this);
		},

		onQtyFrmlaVH: function (oEvent) {
			this.FormulaVH(oEvent, "QtyFrmla", "QtyFrmlaVS");
		},

		onUsgValFrmlaVH: function (oEvent) {
			this.FormulaVH(oEvent, "UsgValFrmla", "UsgValFrmlaVS");
		},

		FormulaVH: function (oEvent, prop, propVS) {
			var g = this;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var settings = {
				title: "Formula",
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/TLPrtFormulaVHSet",
					template: new sap.m.StandardListItem({
						title: "{Ident}",
						description: "{Txt}"
					})
				},
				confirm: function (E) {
					prtData[prop] = E.getParameters().selectedItem.getProperty("title");
					prtData[propVS] = "None";
					prtModel.refresh();
				}
			};

			var q = "/TLPrtFormulaVHSet";
			var M = g.getView().getModel("valueHelp2");
			var frmlaSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Ident", "Txt");
			frmlaSelectDialog.open();
		},

		onQtyFrmlaChange: function (oEvent) {
			this.FormulaChange(oEvent, "QtyFrmla", "QtyFrmlaVS");
		},

		onUsgValFrmlaChange: function (oEvent) {
			this.FormulaChange(oEvent, "UsgValFrmla", "UsgValFrmlaVS");
		},

		FormulaChange: function (oEvent, prop, propVS) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();
			var m = this.getView().getModel("valueHelp2");
			var c = value.toUpperCase();
			var aFilter = [new sap.ui.model.Filter("Ident", "EQ", c)];
			m.read("/TLPrtFormulaVHSet", {
				filters: aFilter,
				success: function (r) {
					if (r.results.length > 0) {
						prtData[prop] = r.results[0].Ident;
						prtData[propVS] = "None";
						prtModel.refresh();
					} else {
						prtData[propVS] = "Error";
						prtModel.refresh();
					}
				},
				error: function (err) {
					prtData[propVS] = "Error";
					prtModel.refresh();
				}
			});
		},

		onPRTDonePress: function () {
			var g = this;
			var prtModel = this.getModel("prtModel");
			var prtData = prtModel.getData();

			if (prtData.PRT === "" || prtData.PRTVS === "Error") {
				var sMsg = "";
				if (prtData.ItmCat === "M") {
					sMsg = "Enter Material";
				} else if (prtData.ItmCat === "E") {
					sMsg = "Enter Equipment";
				} else if (prtData.ItmCat === "P") {
					sMsg = "Enter Measuring Point";
				} else if (prtData.ItmCat === "D") {
					sMsg = "Enter Document";
				} else if (prtData.ItmCat === "O") {
					sMsg = "Enter PRT";
				}
				this.createMessagePopover(sMsg, "Error");
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