/*global location*/
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/core/routing/History"
], function (BaseController, JSONModel, formatter, History) {
	"use strict";

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.TLComponentDetail", {

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

			this.getRouter().getRoute("tlComponent").attachPatternMatched(this._onObjectMatched, this);

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
			
			var oModel = oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);
			
			var vhModel = oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");
			
			var vhModel2 = oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");
		},

		typeCheck: function (v) {
			if (v) {
				var temp = "";
				if (typeof v === "boolean") {
					return v;
				} else if (typeof v === "string") {

					if (v.indexOf("false") > -1) {
						temp = false;
					} else if (v.indexOf("true") > -1) {
						temp = true;
					} else if (v.indexOf("X") > -1) {
						temp = true;
					} else {
						temp = false;
					}

					return temp;
				}
			} else {
				return false;
			}
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
			window.history.go(-1);
		},

		parseQualification: function (d) {
			if (d === "S" || d === "C" || d === "QP") {
				return true;
			} else {
				return false;
			}

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

			var operOverview = new sap.ui.model.json.JSONModel();
			var operData = sap.ui.getCore().getModel("tlDetailModel");
			operOverview.setData(operData.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));
			this.setModel(operOverview, "tlComp");

			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "operOverview"
			});

		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				parameters: {
					expand: "ToSupplier"
				},
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
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.ProductID,
				sObjectName = oObject.ProductID;

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		/* 
		 * Component Valuehelp
		 * param {object} oEvent
		 */
		onComponentVH: function (oEvent) {
			var g = this;
			var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel"); //this.getModel("tlDetailModel");
			var compModel = this.getModel("tlComp");
			var compData = compModel.getData();

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
					compData.matState = "None";
					compData.Idnrk = E.getParameter("selectedItem").getCells()[2].getText();
					compData.matDesc = E.getParameter("selectedItem").getCells()[0].getText();
					var mat = E.getParameter("selectedItem").getCells()[2].getText();
					var plant = tlDetailModel.getData().lHeader.Iwerk;
					g.deriveMatDetails(mat, plant);
					compModel.setData(compData);
					g.setModel(compModel, "tlComp");
				}
			});
			var M = this.getView().getModel("valueHelp");
			matSelectDialog.setModel(M);
			matSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
			matSelectDialog.open();
		},

		deriveMatDetails: function (m, p) {
			var g = this;
			var detailArr = [];
			var q = "/MaterialDataSet";
			var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel"); //this.getModel("tlDetailModel");
			var compModel = this.getModel("tlComp");
			var compData = compModel.getData();
			var oFilter = [new sap.ui.model.Filter("Matnr", "EQ", m),
				new sap.ui.model.Filter("Werks", "EQ", p)
			];
			var M = this.getView().getModel();
			M.read(q, {
				filters: oFilter,
				success: function (r) {
					if (r.results.length > 0) {
						detailArr = r.results;
						if (detailArr.length > 0) {
							compData.Menge = detailArr[0].Menge;
							compData.MeinsGcp = detailArr[0].Meins;
							compData.Postp = detailArr[0].Postp;
						}
						compModel.setData(compData);
						g.setModel(compModel, "tlComp");
						// g.getView().byId("components").getModel("tlDetailModel").refresh();
					}
				},
				error: function (err) {}
			});
		},

		onComponentChange: function (oEvent) {
			var g = this;
			var sProperty = oEvent.getSource().getBindingInfo("value").binding.sPath;
			var value = oEvent.getParameters().newValue;

			var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel"); //this.getModel("tlDetailModel");
			var compModel = this.getModel("tlComp");
			var compData = compModel.getData();
			var m = this.getView().getModel("valueHelp");
			var c;
			if (sProperty === "/Idnrk") {
				c = value.toUpperCase();
				var q = "/MaterialVH_PRTSet";
				var oFilter = [new sap.ui.model.Filter("Matnr", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (r) {
						if (r.results.length > 0) {
							compData.Idnrk = c;
							compData.matDesc = r.results[0].Maktg;
							compData.matState = "None";
							var mat = r.results[0].Matnr;
							var plant = tlDetailModel.getData().lHeader.Iwerk; //cData.lHeader.Iwerk; //headerData[hLength - 1].Iwerk;
							g.deriveMatDetails(mat, plant);
							compModel.setData(compData);
							g.setModel(compModel, "tlComp");
						} else {
							compData.matState = "Error";
							compModel.setData(compData);
							g.setModel(compModel, "tlComp");
						}
					},
					error: function (err) {
						compData.matState = "Error";
						compModel.setData(compData);
						g.setModel(compModel, "tlComp");
					}
				});
			}
			if (sProperty === "/Menge") {
				if (value !== "") {
					compData.qtyState = "None";
					compData.Menge = value;
					compModel.setData(compData);
					g.setModel(compModel, "tlComp");
				} else {
					compData.qtyState = "Error";
					compModel.setData(compData);
					g.setModel(compModel, "tlComp");
				}
			}
			if (sProperty === "/MeinsGcp") {
				c = value.toUpperCase();
				var M = this.getView().getModel("valueHelp");
				//M.read("/QuantityUOMSet?$filter=Matnr eq '" + c + "'", null, null, false, function(r) {
				var q = "/QuantityUOMSet";
				var oFilter = [new sap.ui.model.Filter("Mseh3", "EQ", c)];
				M.read(q, {
					filters: oFilter,
					success: function (r) {
						if (r.results.length > 0) {
							compData.MeinsGcp = c;
							compData.qtyUnitState = "None";
							compModel.setData(compData);
							g.setModel(compModel, "tlComp");
						} else {
							compData.qtyUnitState = "Error";
							compModel.setData(compData);
							g.setModel(compModel, "tlComp");
						}
					},
					error: function (err) {
						compData.qtyUnitState = "Error";
						compModel.setData(compData);
						g.setModel(compModel, "tlComp");
					}
				});
			}
		},

	});

});