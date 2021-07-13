/*global location*/
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/core/routing/History",
	"sap/ui/core/routing/Router",
	"sap/m/MessageBox",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"sap/ui/core/message/Message",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
], function (BaseController, JSONModel, formatter, History, Router, MessageBox, ValueHelpProvider, Message, ValueHelpRequest) {
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.TLOperationDetail", {

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

			this.getRouter().getRoute("tlOprDetail").attachPatternMatched(this._onObjectMatched, this);

			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
		},

		showMessage: function (msg) {
			this.createMessagePopover(msg, "Error");
			// sap.m.MessageBox.show(msg, {
			// 	title: "Error",
			// 	icon: sap.m.MessageBox.Icon.ERROR,
			// 	onClose: function (oAction) {
			// 	}
			// });
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {

			var itDetailview = new sap.ui.model.json.JSONModel();
			var itData = sap.ui.getCore().getModel("tlDetailModel");
			itDetailview.setData(itData.getProperty(decodeURIComponent(oEvent.getParameter("arguments").itemPath)));
			this.setModel(itDetailview, "oprDetailView");
			this.itemPath = oEvent.getParameter("arguments").itemPath;

			var mainPath = oEvent.getParameter("arguments").mainPath;
			this.mainPath = decodeURIComponent(mainPath).substr(2, 4);
			var basicPath = oEvent.getParameter("arguments").basicPath;
			this.basicPath = decodeURIComponent(basicPath);
			this.action = oEvent.getParameter("arguments").action;

			var itemPath = decodeURIComponent(this.itemPath);

			var itmDetailPath = this.mainPath + itemPath;
			this.itmDetailPath = itmDetailPath;

			var tlOpDetailModel = new sap.ui.model.json.JSONModel();
			var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
			this.operationDetail = tlDetailModel.getProperty(itemPath);
			tlOpDetailModel.setData(this.operationDetail);
			// if (this.action.indexOf("GTL") > 0) {
			// 	// var AIWListGTLModel = sap.ui.getCore().getModel("AIWListGTLModel");
			// 	var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
			// 	this.operationDetail = tlDetailModel.getProperty(itemPath);
			// 	tlOpDetailModel.setData(this.operationDetail);
			// } else if (this.action.indexOf("ETL") > 0) {
			// 	// var AIWListETLModel = sap.ui.getCore().getModel("AIWListETLModel");
			// 	// this.operationDetail = AIWListETLModel.getProperty(itmDetailPath);
			// 	var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
			// 	this.operationDetail = tlDetailModel.getProperty(itemPath);
			// 	tlOpDetailModel.setData(this.operationDetail);
			// } else if (this.action.indexOf("FTL") > 0) {
			// 	// var AIWListFTLModel = sap.ui.getCore().getModel("AIWListFTLModel");
			// 	// this.operationDetail = AIWListFTLModel.getProperty(itmDetailPath);
			// 	var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
			// 	this.operationDetail = tlDetailModel.getProperty(itemPath);
			// 	tlOpDetailModel.setData(this.operationDetail);
			// }

			// var AIWTLData = tlDetailModel.getData();
			// if (AIWTLData.operation) {
			// 	var oprExistFlag = false;
			// 	for (var z = 0; z < AIWTLData.operation.length; z++) {
			// 		if (AIWTLData.operation[z].Plnal === this.operationDetail.Plnal && AIWTLData.operation[z].Vornr ===
			// 			this.operationDetail.Vornr) {
			// 			AIWTLData.operation[z] = this.operationDetail;
			// 			oprExistFlag = true;
			// 		}
			// 	}
			// 	if (!oprExistFlag) {
			// 		AIWTLData.operation.push(this.operationDetail);
			// 	}
			// } else {
			// 	AIWTLData.operation = [];
			// 	AIWTLData.operation.push(this.operationDetail);
			// }

			this.mode = oEvent.getParameter("arguments").mode;
			if (this.mode === "display") {
				this.operationDetail.enable = false;
				this.operationDetail.WorkEnable=false;
				this.operationDetail.visible = true;
			} else {
				this.operationDetail.enable = true;
				this.operationDetail.visible = false;

				var ctrl = oEvent.getParameter("arguments").ctrlKey;
				var wc = oEvent.getParameter("arguments").wc;
				var wcPlant = oEvent.getParameter("arguments").wcPlant;
				this.operationDetail.Steus = ctrl;
				if (wc !== "null") {
					this.operationDetail.Arbpl = wc;
				}
				if (wcPlant !== "null") {
					this.operationDetail.Werks = wcPlant;
				}
			}

			/*this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "oprDetailView"
			});*/
			this.getView().bindElement({
				path: decodeURIComponent(oEvent.getParameter("arguments").itemPath),
				model: "tlOpDetailModel"
			});

			if (this.operationDetail.Arbpl !== "") {
				this.operationDetail.wcDtValueState = "None";
			}
			if (this.operationDetail.Werks !== "") {
				this.operationDetail.opPlantValueState = "None";
			}
			if (this.operationDetail.Ltxa1 !== "") {
				this.operationDetail.opDescValueState = "None";
			}
			tlOpDetailModel.setData(this.operationDetail);
			this.getView().setModel(tlOpDetailModel, "tlOpDetailModel");
			// sap.ui.getCore().setModel(tlDetailModel, "tlDetailModel");

		},

		// onOpWorkChange:function(oEvent){
		// 	var value = oEvent.getSource().getValue();
		// 	if(value !== ""){
		// 		oEvent.getSource().setValue(value);
		// 		g.onCalculate();
		// 	}
		// },

		disableFields: function () {
			var obj = {
				enable: false
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "tlOpDetailModel");
		},

		enableFields: function () {
			var obj = {
				enable: true
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			this.getView().setModel(oModel, "tlOpDetailModel");
		},

		parseFlag: function (r) {
			if (r === "X") {
				return true;
			} else {
				return false;
			}
		},

		parseQualification: function (d) {
			if (d === "S" || d === "C" || d === "QP") {
				return true;
			} else {
				return false;
			}

		},

		validateFields: function () {
			var g = this;
			var isValid = true;
			var aErrors = [];
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			if (g.operationDetail.Vornr === "" || g.operationDetail.Arbpl === "" || g.operationDetail.Werks === "" || g.operationDetail.Steus ===
				"" || g.operationDetail.Ltxa1 === "") {

				isValid = false;
				if (g.operationDetail.Vornr === "" || g.operationDetail.opNumDtValueState === "Error") {
					g.operationDetail.opNumDtValueState = "Error";
				}
				if (g.operationDetail.Arbpl === "") {
					g.operationDetail.wcDtValueState = "Error";
				}
				if (g.operationDetail.Werks === "") {
					g.operationDetail.opPlantValueState = "Error";
				}
				if (g.operationDetail.Steus === "") {
					g.operationDetail.opCtrlKeyValueState = "Error";
				}
				if (g.operationDetail.Ltxa1 === "") {
					g.operationDetail.opDescValueState = "Error";
				}
			}

			if (!isValid) {
				aErrors.push({
					type: "Error",
					title: g.getView().getModel("i18n").getProperty("MANDMSG"),
					message: g.getView().getModel("i18n").getProperty("MANDMSG")
				});
			}

			if (g.operationDetail.Steus === "PM05") { //g.operationDetail.Steus === "PM01" ||
				if (parseInt(g.operationDetail.Arbei) === 0 || g.operationDetail.Arbei === "") {
					g.operationDetail.ArbeiVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter Work",
						message: "Enter Work"
					});
					isValid = false;
				}
				if (g.operationDetail.Arbeh === "") {
					g.operationDetail.wrkUntValueState = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter Work Unit",
						message: "Enter Work Unit"
					});
					isValid = false;
				}
				if (parseInt(g.operationDetail.Anzzl) === 0 || g.operationDetail.Anzzl === "") {
					g.operationDetail.AnzzlVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter Number",
						message: "Enter Number"
					});
					isValid = false;
				}
				if (parseInt(g.operationDetail.Dauno) === 0 || g.operationDetail.Dauno === "") {
					g.operationDetail.DaunoVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter Duration",
						message: "Enter Duration"
					});
					isValid = false;
				}
				if (g.operationDetail.Daune === "") {
					g.operationDetail.durUntValueState = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter Duration Unit",
						message: "Enter Duration Unit"
					});
					isValid = false;
				}
				if (g.operationDetail.Indet === "") {
					g.operationDetail.calcKeyValueState = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter Calculation Key",
						message: "Enter Calculation Key"
					});
					isValid = false;
				}
				if (g.operationDetail.Larnt === "") {
					g.operationDetail.opActTypValueState = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter Activity Type",
						message: "Enter Activity Type"
					});
					isValid = false;
				}
				if (g.operationDetail.workPerc === "") {
					g.operationDetail.workPercVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter Work Percentage",
						message: "Enter Work Percentage"
					});
					isValid = false;
				}
				if (g.operationDetail.materialGrp === "") {
					g.operationDetail.materialGrpVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter material group",
						message: "Enter material group"
					});
					isValid = false;
				}
			}

			if (g.operationDetail.Steus === "PM02" || g.operationDetail.Steus === "PM03") {
				if (g.operationDetail.orderQty === "") {
					g.operationDetail.orderQtyVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter order quantity",
						message: "Enter order quantity"
					});
					isValid = false;
				}
				if (g.operationDetail.ordQtyUnit === "") {
					g.operationDetail.ordQtyUnitVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter order quantity unit",
						message: "Enter order quantity unit"
					});
					isValid = false;
				}
				if (g.operationDetail.netPrice === "") {
					g.operationDetail.netPriceVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter net price",
						message: "Enter net price"
					});
					isValid = false;
				}
				if (g.operationDetail.currency === "") {
					g.operationDetail.currencyVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter currency",
						message: "Enter currency"
					});
					isValid = false;
				}
				if (g.operationDetail.priceUnit === "") {
					g.operationDetail.priceUnitVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter price unit",
						message: "Enter price unit"
					});
					isValid = false;
				}
				if (g.operationDetail.costElement === "") {
					g.operationDetail.costElementVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter cost element",
						message: "Enter cost element"
					});
					isValid = false;
				}
				if (g.operationDetail.materialGrp === "") {
					g.operationDetail.materialGrpVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter material group",
						message: "Enter material group"
					});
					isValid = false;
				}
				if (g.operationDetail.puchGroup === "") {
					g.operationDetail.puchGroupVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter purchase group",
						message: "Enter purchase group"
					});
					isValid = false;
				}
				if (g.operationDetail.purchOrg === "") {
					g.operationDetail.purchOrgVS = "Error";
					aErrors.push({
						type: "Error",
						title: "Enter purchase org",
						message: "Enter purchase org"
					});
					isValid = false;
				}
			}

			if (!isValid) {
				tlOpDetailModel.setData(g.operationDetail);
				g.getView().setModel(tlOpDetailModel, "tlOpDetailModel");
				g.createMessagePopover(aErrors, "Error");
			}

			return isValid;
		},

		onCalculate: function () {
			/*var c = this.getView().byId("opCalcKeyDt").getValue();
			var p = this.getView().byId("opPlantDt").getValue();
			var w = this.getView().byId("opWcDt").getValue();
			var du = this.getView().byId("opDuratnUnitDt").getValue();
			var wo = this.getView().byId("opWorkDt").getValue();
			var d = this.getView().byId("opDurtnDt").getValue();
			var wu = this.getView().byId("opWorkUnitDt").getValue();
			var n = this.getView().byId("opNumberDt").getValue();*/
			this.operationDetail = this.getView().getModel("tlOpDetailModel").getData();
			var c = this.operationDetail.Indet;
			var p = this.operationDetail.Werks;
			var w = this.operationDetail.Arbpl;
			var du = this.operationDetail.Daune;
			var wo = this.operationDetail.Arbei;
			var d = this.operationDetail.Dauno;
			var wu = this.operationDetail.Arbeh;
			var n = this.operationDetail.Anzzl;
			this.calculate(c, p, w, du, wo, d, wu, n);
		},
		calculate: function (c, p, w, du, wo, d, wu, n) {
			// var isCalculate = false;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			var g = this;
			// var sServiceUrl = this.getView().getModel().sServiceUrl;
			/*var M = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
				json: true,
				useBatch: false,
				defaultCountMode: sap.ui.model.odata.CountMode.None
			});*/
			var M = this.getView().getModel("valueHelp");
			var calcArr = [];
			if (d === "") {
				d = 0 + "m";
				// d = parseInt(d);
			} else {
				d = parseInt(d) + "m";
			}
			if (wo === "") {
				wo = 0 + "m";
				// wo = parseInt(wo);
			} else {
				wo = parseInt(wo) + "m";
			}

			var url = "/Work2DurationSet(Anzzl=" + n + ",Dauno=" + d + ",Indet='" + c + "',Werks='" + p + "',Arbpl='" + w + "',Daune='" + du +
				"',Arbei=" + wo + ",Arbeh='" + wu + "')";
			// var url = "/Work2DurationSet";
			/*var oFilter = [new sap.ui.model.Filter("Anzzl", "EQ", n),
				new sap.ui.model.Filter("Dauno", "EQ", d),
				new sap.ui.model.Filter("Indet", "EQ", c),
				new sap.ui.model.Filter("Werks", "EQ", p),
				new sap.ui.model.Filter("Arbpl", "EQ", w),
				new sap.ui.model.Filter("Daune", "EQ", du),
				new sap.ui.model.Filter("Arbei", "EQ", wo),
				new sap.ui.model.Filter("Arbeh", "EQ", wu)
			];*/

			M.read(url, {
				// filters: oFilter,
				success: function (r) {
					// if (r.results.length > 0) {
					calcArr = r;
					var num = r.Anzzl;
					var dur = r.Dauno;
					var calc = r.Indet;
					var durU = r.Daune;
					var work = r.Arbei;
					var workU = r.Arbeh;
					/*g.getView().byId("opNumberDt").setValue(num);
					g.getView().byId("opDurtnDt").setValue(dur);
					g.getView().byId("opCalcKeyDt").setValue(calc);
					g.getView().byId("opWorkDt").setValue(work);*/

					g.operationDetail.Anzzl = num;
					g.operationDetail.Dauno = dur;
					g.operationDetail.Indet = calc;
					g.operationDetail.Arbei = work;
					tlOpDetailModel.setData(g.operationDetail);
					g.getView().setModel(tlOpDetailModel, "tlOpDetailModel");
				},
				error: function (err) {
					// isCalculate = true;
					// var error = [];
					// if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror
					// 	.errordetails
					// 	.length === 0) {
					// 	error[0] = JSON.parse(err.responseText).error.message.value;
					// } else {
					// 	for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
					// 		error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
					// 	}
					// }
					// var value = error.join("\n");
					// g.showMessage(value);
				}
			});
			// return isCalculate;
		},

		//Value Help
		onCtrlKeyVH: function (oEvent) {
			var g = this;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");

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
					g.operationDetail.Steus = E.getParameters().selectedItem.getProperty("title");
					tlOpDetailModel.setData(g.operationDetail);
				}
			};

			var q = "/ControlKeySet";
			var M = this.getView().getModel("valueHelp");
			var aFilter = [new sap.ui.model.Filter("Steus", "GE", "PM01"),
				new sap.ui.model.Filter("Steus", "LE", "PM05")
			];
			var sySelectDialog = ValueHelpProvider.getSelectDialog(M, q, aFilter, settings, "Steus", "Txt");
			sySelectDialog.open();
		},

		onWCOpVH: function (oEvent) {

			var g = this;
			/*var a;
			var P = p;
			a = this.getView().byId(p);*/
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			/*var m = this.getView().byId("opWcDt");
			var p = this.getView().byId("opPlantDt");*/
			var wcopSearchResults;
			if (wcopSearchResults === undefined) {

				var wcopSelectDialog = new sap.m.TableSelectDialog({
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
						/*	m.setValueState("None");
							m.setValue(E.getParameter("selectedItem").getCells()[2].getText());
							p.setValue(E.getParameter("selectedItem").getCells()[1].getText());

							//Modified:19/09
							if (m.getValueState() === "Error") {
								m.setValueState("None");
							}*/
						//end
						g.operationDetail.wcDtValueState = "None";
						g.operationDetail.Arbpl = E.getParameter("selectedItem").getCells()[2].getText();
						g.operationDetail.Werks = E.getParameter("selectedItem").getCells()[1].getText();
						g.operationDetail.Larnt = E.getParameter("selectedItem").getBindingContext().getObject().Lar01;
						tlOpDetailModel.setData(g.operationDetail);
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
				var q = "/WorkCenterVHSet";

				/*	var serviceUrl = this.getView().getModel().sServiceUrl;
					// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
					var M = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
						json: true,
						useBatch: false,
						defaultCountMode: sap.ui.model.odata.CountMode.None
					});*/
				var M = this.getView().getModel("valueHelp");
				M.read(q, {
					success: function (h, E) {
						var oModelData = sap.ui.getCore().getModel("AIWListWCModel").getData();
						if (oModelData.length > 0) {
							for (var i = 0; i < oModelData.length; i++) {
								if (oModelData[i].wc) {
									var sObj = {
										Verwe: oModelData[i].wcCat,
										Werks: oModelData[i].plant,
										Arbpl: oModelData[i].wc,
										Ktext: oModelData[i].wcDesc,
										Larnt: oModelData[i].Larnt,
										Spras: h.results[0].Spras
									};
									h.results.unshift(sObj);
								}
							}
						}
						if (h.results.length > 0) {
							wcopSearchResults = h;
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
									})
								]
							});
							var e = new sap.ui.model.json.JSONModel();
							e.setData(h);
							wcopSelectDialog.setModel(e);
							// wcopSelectDialog.setGrowingThreshold(h.results.length);
							wcopSelectDialog.bindAggregation("items", "/results", I);
						} else {
							wcopSelectDialog.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
						}
					}
				});

			} else {

				var e = new sap.ui.model.json.JSONModel();
				e.setData(wcopSearchResults);
				wcopSelectDialog.setModel(e);
				var I = wcopSelectDialog.getItems();
				for (var i = 0; i < I.length; i++) {
					I[i].setVisible(true);
				}
			}
			wcopSelectDialog.open();

		},

		onPlantOpVH: function (oEvent) {
			var g = this;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			var settings = {
				title: this.getView().getModel("i18n").getProperty("PLANT"), //modified: 19/09
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
					/*m.setValueState("None");
					m.setValue(E.getParameter("selectedItem").getCells()[0].getText());*/
					//d.setValue(E.getParameter("selectedItem").getCells()[6].getText());
					g.operationDetail.opPlantValueState = "None";
					g.operationDetail.Werks = E.getParameter("selectedItem").getCells()[0].getText();
					tlOpDetailModel.setData(g.operationDetail);
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

			var opPlSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilters, settings, "Plant", "Name");
			opPlSelectDialog.open();
			opPlSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onActivityTypVH: function (oEvent) {
			var g = this;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			var pl = g.operationDetail.Werks;
			var wc = g.operationDetail.Arbpl;
			var settings = {
				title: this.getView().getModel("i18n").getProperty("OP_ACT"), // modified : 19/09
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>ACT_TYP}"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>FISCAL_YR}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>Name1}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "CO Area"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>VALID_TO}"
							})
						]
					})
				],
				items: {
					path: "/ActivityTypeSet?$filter=Werks eq '" + pl + "' and Arbpl eq '" + wc + "'",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Lstar}"
							}),
							new sap.m.Text({
								text: "{Gjahr}"
							}),
							new sap.m.Text({
								text: "{Ktext}"
							}),
							new sap.m.Text({
								text: "{Kokrs}"
							}),
							new sap.m.Text({
								text: "{Datbi}"
							})
						]
					})
				},
				confirm: function (E) {
					/*m.setValueState("None");
					m.setValue(E.getParameter("selectedItem").getCells()[0].getText());
					d.setValue(E.getParameter("selectedItem").getCells()[2].getText());*/

					g.operationDetail.opActTypValueState = "None";
					g.operationDetail.Larnt = E.getParameter("selectedItem").getCells()[0].getText();
					g.operationDetail.actTypDesc = E.getParameter("selectedItem").getCells()[2].getText();
					tlOpDetailModel.setData(g.operationDetail);

				}
			};
			var M = this.getView().getModel("valueHelp");
			var q = "/ActivityTypeSet";
			var oFilter = [new sap.ui.model.Filter("Werks", "EQ", pl),
				new sap.ui.model.Filter("Arbpl", "EQ", wc)
			];
			var cells = [
				new sap.m.Text({
					text: "{Lstar}"
				}),
				new sap.m.Text({
					text: "{Gjahr}"
				}),
				new sap.m.Text({
					text: "{Ktext}"
				}),
				new sap.m.Text({
					text: "{Kokrs}"
				}),
				new sap.m.Text({
					text: "{Datbi}"
				})
			];

			var actSelectDialog = ValueHelpProvider.getValueHelp(M, q, cells, oFilter, settings, "Lstar", "Ktext");
			actSelectDialog.open();
			actSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		onDuratnUOMVH: function (c) {
			var p = c.getSource().mBindingInfos.value.binding.sPath;
			p = p.substring(1);
			// this.workUOMVH("opDuratnUnitDt", c);
			this.workUOMVH(p, c);
		},
		onWorkUOMVH: function (c) {
			var p = c.getSource().mBindingInfos.value.binding.sPath;
			p = p.substring(1);
			this.workUOMVH(p, c);
			// this.workUOMVH("opWorkUnitDt", c);
		},

		workUOMVH: function (p, c) {
			var g = this;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			var m;
			var lbl = this.getView().getModel("i18n").getProperty("OP_CTRL_KEY");
			if (p === "Arbeh") {
				m = g.operationDetail.Arbeh;
				lbl = this.getView().getModel("i18n").getProperty("OP_UWORK");
			} else if (p === "Daune") {
				m = g.operationDetail.Daune;
				lbl = this.getView().getModel("i18n").getProperty("OP_UDURATION");
			}

			var settings = {
				title: lbl,
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/TimeUintSet",
					template: new sap.m.StandardListItem({
						title: "{Msehi}",
						description: "{Msehl}"
					})
				},
				confirm: function (E) {
					if (p === "Arbeh") {
						g.operationDetail.wrkUntValueState = "None";
						g.operationDetail.Arbeh = E.getParameters().selectedItem.getProperty("title");
					} else if (p === "Daune") {
						g.operationDetail.durUntValueState = "None";
						g.operationDetail.Daune = E.getParameters().selectedItem.getProperty("title");
					}
					tlOpDetailModel.setData(g.operationDetail);
					// if (p === "Arbeh" && g.operationDetail.Arbei !== "" && g.operationDetail.Arbeh !== "") {
					g.onCalculate();
					// } else if (p === "Daune" && g.operationDetail.Daune !== "" && g.operationDetail.Dauno !== "") {
					// 	g.onCalculate();
					// }
				}
			};

			var q = "/TimeUintSet";
			var M = this.getView().getModel("valueHelp2");
			var wuSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Msehi", "Msehl");
			wuSelectDialog.open();
		},

		onCalcKeyVH: function (oEvent) {
			var g = this;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");

			var settings = {
				title: this.getView().getModel("i18n").getProperty("OP_CALC_KEY"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/DomFixValSet",
					template: new sap.m.StandardListItem({
						title: "{DomvalueL}",
						description: "{Ddtext}"
					})
				},
				confirm: function (E) {
					g.operationDetail.calcKeyValueState = "None";
					g.operationDetail.Indet = E.getParameters().selectedItem.getProperty("title");
					g.operationDetail.calcKeyDesc = E.getParameters().selectedItem.getProperty("description");
					tlOpDetailModel.setData(g.operationDetail);
					g.onCalculate();
				}
			};

			var q = "/DomFixValSet";
			var oFilter = [new sap.ui.model.Filter("Domname", "EQ", 'INDET')];
			var M = this.getView().getModel("valueHelp");
			var cSelectDialog = ValueHelpProvider.getSelectDialog(M, q, oFilter, settings, "DomvalueL", "Ddtext");
			cSelectDialog.open();
		},

		//On Change
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
			case "Arbpl":
				this._mainWc(value, oEvent);
				break;
			case "Werks":
				this._plant(value, oEvent);
				break;
			case "Steus":
				this._ctrlKey(value, oEvent);
				break;
			case "Arbeh":
				this._wrkUnit(value, oEvent);
				break;
			case "Daune":
				this._durUnit(value, oEvent);
				break;
			case "Indet":
				this._calculationKey(value, oEvent);
				break;
			case "Larnt":
				this._activityType(value, oEvent);
				break;
			}
		},

		_mainWc: function (f) {
			var g = this;
			var c = f;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			// var cd = this.getView().byId("opPlantDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/WorkCenterVHSet";
				var oFilter = [new sap.ui.model.Filter("Arbpl", "EQ", c)];

				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							/*cd.setValue(d.results[0].Werks);
							f.setValue(a);*/
							g.operationDetail.wcDtValueState = "None";
							g.operationDetail.Arbpl = a;
							g.operationDetail.Werks = d.results[0].Werks;
							g.operationDetail.Larnt = d.results[0].Lar01;
							tlOpDetailModel.setData(g.operationDetail);
						} else {
							/*f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");*/
							g.operationDetail.wcDtValueState = "Error";
							g.operationDetail.Werks = "";
							g.operationDetail.Larnt = "";
							g.operationDetail.wcDtValueStateTxt = "Invalid Entry";
							tlOpDetailModel.setData(g.operationDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.operationDetail.wcDtValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.wcDtValueStateTxt = d;
						tlOpDetailModel.setData(g.operationDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.operationDetail.Arbpl = a;
				tlOpDetailModel.setData(g.operationDetail);
			}
		},

		_plant: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			//var cd = this.getView().byId("opPlantDescDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				//var q = "/OperPlantVHSet?$filter=" + jQuery.sap.encodeURL("Werks eq '" + c + "'");
				/*var serviceUrl = this.getView().getModel().sServiceUrl;
				// var serviceUrl = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				var m = new sap.ui.model.odata.v2.ODataModel(serviceUrl, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/PlantVHSet";
				var oFilter = [new sap.ui.model.Filter("Plant", "EQ", c)];

				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							// f.setValue(a);
							g.operationDetail.opPlantValueState = "None";
							g.operationDetail.Werks = a;
							tlOpDetailModel.setData(g.operationDetail);
						} else {
							/*f.setValueState("Error");
							f.setValueStateText("Invalid Entry");*/
							g.operationDetail.opPlantValueState = "Error";
							g.operationDetail.opPlantValueStateTxt = "Invalid Entry";
							tlOpDetailModel.setData(g.operationDetail);
						}
					},
					error: function (e) {
						/*f.setValueState("Error");
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						f.setValueStateText(d);*/
						g.operationDetail.opPlantValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.opPlantValueStateTxt = d;
						tlOpDetailModel.setData(g.operationDetail);
					}
				});
			} else {
				// f.setValue(a);
				g.operationDetail.Werks = a;
				tlOpDetailModel.setData(g.operationDetail);
			}
		},

		_ctrlKey: function (f) {
			var g = this;
			var c = f;
			var c = c.toUpperCase();
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var m = this.getView().getModel("valueHelp");
				var q = "/ControlKeySet";
				var oFilter = [new sap.ui.model.Filter("Steus", "EQ", c),
					new sap.ui.model.Filter("Steus", "GE", "PM01"),
					new sap.ui.model.Filter("Steus", "LE", "PM05")
				];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.operationDetail.opCtrlKeyValueState = "None";
							g.operationDetail.Steus = a;
							tlOpDetailModel.setData(g.operationDetail);
						} else {
							g.operationDetail.opCtrlKeyValueState = "Error";
							g.operationDetail.opCtrlKeyValueStateTxt = "Invalid Entry";
							tlOpDetailModel.setData(g.operationDetail);
						}
					},
					error: function (e) {
						g.operationDetail.opCtrlKeyValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.opCtrlKeyValueStateTxt = d;
						tlOpDetailModel.setData(g.operationDetail);
					}
				});
			} else {
				g.operationDetail.Steus = a;
				tlOpDetailModel.setData(g.operationDetail);
			}
		},

		_wrkUnit: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			c = c.toUpperCase();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				// var url = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				/*var url = this.getOwnerComponent().getModel("NewModel").sServiceUrl;
				var m = new sap.ui.model.odata.v2.ODataModel(url, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp2");
				var q = "/TimeUintSet";
				var oFilter = [new sap.ui.model.Filter("Msehi", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.operationDetail.wrkUntValueState = "None";
							g.operationDetail.Arbeh = a;
							tlOpDetailModel.setData(g.operationDetail);
							// if (g.operationDetail.Arbei !== "" && g.operationDetail.Arbeh !== "") {
							g.onCalculate();
							// }
						} else {
							g.operationDetail.wrkUntValueState = "Error";
							g.operationDetail.wrkUntValueStateTxt = "Invalid Entry";
							tlOpDetailModel.setData(g.operationDetail);
						}
					},
					error: function (e) {
						g.operationDetail.wrkUntValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.wrkUntValueStateTxt = d;
						tlOpDetailModel.setData(g.operationDetail);
					}
				});
			} else {
				g.operationDetail.Arbeh = a;
				tlOpDetailModel.setData(g.operationDetail);
			}
		},

		_durUnit: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			c = c.toUpperCase();
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				// var url = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				/*var url = this.getOwnerComponent().getModel("NewModel").sServiceUrl;
				var m = new sap.ui.model.odata.v2.ODataModel(url, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp2");
				var q = "/TimeUintSet";
				var oFilter = [new sap.ui.model.Filter("Msehi", "EQ", c)];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.operationDetail.durUntValueState = "None";
							g.operationDetail.Daune = a;
							tlOpDetailModel.setData(g.operationDetail);
							// if (g.operationDetail.Daune !== "" && g.operationDetail.Dauno !== "") {
							g.onCalculate();
							// }
						} else {
							g.operationDetail.durUntValueState = "Error";
							g.operationDetail.durUntValueStateTxt = "Invalid Entry";
							tlOpDetailModel.setData(g.operationDetail);
						}
					},
					error: function (e) {
						g.operationDetail.durUntValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.durUntValueStateTxt = d;
						tlOpDetailModel.setData(g.operationDetail);
					}
				});
			} else {
				g.operationDetail.Daune = a;
				tlOpDetailModel.setData(g.operationDetail);
			}
		},

		_calculationKey: function (f, oEvent) {
			var g = this;
			var c = f;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			// var cd = this.getView().byId("opCalcDescDt");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				// var url = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				/*var url = this.getOwnerComponent().getModel("NewModel").sServiceUrl;
				var m = new sap.ui.model.odata.v2.ODataModel(url, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/DomFixValSet";
				var oFilter = [new sap.ui.model.Filter("Domname", "EQ", 'INDET'),
					new sap.ui.model.Filter("DomvalueL", "EQ", c)
				];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.operationDetail.calcKeyValueState = "None";
							g.operationDetail.Indet = a;
							g.operationDetail.calcKeyDesc = d.results[0].Ddtext;
							tlOpDetailModel.setData(g.operationDetail);
							g.onCalculate();
						} else {
							g.operationDetail.calcKeyValueState = "Error";
							g.operationDetail.calcKeyDesc = "";
							g.operationDetail.calcKeyValueStateTxt = "Invalid Entry";
							tlOpDetailModel.setData(g.operationDetail);
						}
					},
					error: function (e) {
						g.operationDetail.calcKeyValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.calcKeyValueStateTxt = d;
						tlOpDetailModel.setData(g.operationDetail);
					}
				});
			} else {
				g.operationDetail.Indet = a;
				tlOpDetailModel.setData(g.operationDetail);
			}
		},

		/*activityTypChange: function(C) {
			var a = this.getView().byId("opWcDt");
			if (a === "") {
				this.getView().byId("opActTypeDescDt").setValue();
			}
			a.setValueState("None");
		},

		onActivityTypChange: function() {
			var t = this.getView().byId("opWcDt");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._activityType(t);
		},*/
		_activityType: function (f) {
			var g = this;
			var c = f;
			var tlOpDetailModel = this.getView().getModel("tlOpDetailModel");
			/*var cd = this.getView().byId("opActTypeDescDt");
			var pl = this.getView().byId("opPlantDt");
			var wc = this.getView().byId("opWcDt");*/
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				// var url = "/sap/opu/odata/ugiod01/MDG_EAM_TASKLIST_SRV/"; // temporary
				/*var url = this.getOwnerComponent().getModel("NewModel").sServiceUrl;
				var m = new sap.ui.model.odata.v2.ODataModel(url, {
					json: true,
					useBatch: false,
					defaultCountMode: sap.ui.model.odata.CountMode.None
				});*/
				var m = this.getView().getModel("valueHelp");
				var q = "/ActivityTypeSet";
				var oFilter = [new sap.ui.model.Filter("Lstar", "EQ", c),
					/*new sap.ui.model.Filter("Werks", "EQ", pl.getValue()),
					new sap.ui.model.Filter("Arbpl", "EQ", wc.getValue())*/
					new sap.ui.model.Filter("Werks", "EQ", g.operationDetail.Werks),
					new sap.ui.model.Filter("Arbpl", "EQ", g.operationDetail.Arbpl)
				];
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							g.operationDetail.opActTypValueState = "None";
							g.operationDetail.Larnt = a;
							g.operationDetail.actTypDesc = d.resutls[0].Ktext;
							tlOpDetailModel.setData(g.operationDetail);
						} else {
							g.operationDetail.opActTypValueState = "Error";
							g.operationDetail.actTypDesc = "";
							g.operationDetail.opActTypValueStateTxt = "Invalid Entry";
							tlOpDetailModel.setData(g.operationDetail);
						}
					},
					error: function (e) {
						g.operationDetail.opActTypValueState = "Error";
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						g.operationDetail.opActTypValueStateTxt = d;
						tlOpDetailModel.setData(g.operationDetail);
					}
				});
			} else {
				g.operationDetail.Larnt = a;
				tlOpDetailModel.setData(g.operationDetail);
			}
		},

		DescChange: function () {
			// this.getView().byId("opDescDt").setValueState("None");
			this.operationDetail.opDescValueState = "None";
			this.getView().getModel("tlOpDetailModel").setData(this.operationDetail);
		},

		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
		},

		onOprDonePress: function (e) {
			if (this.mode !== "display") {
				var sSourceId = e.getSource().getId();
				var valid = this.validateFields();
				if (!valid) {
					return;
				}
				// var c = this.getView().byId("opCalcKeyDt").getValue();
				// var p = this.getView().byId("opPlantDt").getValue();
				// var w = this.getView().byId("opWcDt").getValue();
				// var du = this.getView().byId("opDuratnUnitDt").getValue();
				// var wo = this.getView().byId("opWorkDt").getValue();
				// var d = this.getView().byId("opDurtnDt").getValue();
				// var wu = this.getView().byId("opWorkUnitDt").getValue();
				// var n = this.getView().byId("opNumberDt").getValue();
				// var flag = this.calculate(c, p, w, du, wo, d, wu, n);
				// if (flag) {
				// 	return;
				// }
				// var opModel = sap.ui.getCore().getModel("tlDetailModel");
				// var oprData = opModel.getData().lOperation;
				// var index = parseInt(this.itemPath.substr(-1));
				/*oprData[index].Vornr = this.getView().byId("opNumDt").getValue();
				oprData[index].Arbpl = this.getView().byId("opWcDt").getValue();
				oprData[index].Werks = this.getView().byId("opPlantDt").getValue();
				oprData[index].Steus = this.getView().byId("opCtrlKeyDt").getValue();
				oprData[index].Ltxa1 = this.getView().byId("opDescDt").getValue();
				oprData[index].Arbei = this.getView().byId("opWorkDt").getValue();
				oprData[index].WcZeiwn = this.getView().byId("opWorkUnitDt").getValue();
				oprData[index].Anzzl = this.getView().byId("opNumberDt").getValue();
				oprData[index].Dauno = this.getView().byId("opDurtnDt").getValue();
				oprData[index].Daune = this.getView().byId("opDuratnUnitDt").getValue();
				oprData[index].Indet = this.getView().byId("opCalcKeyDt").getValue();
				oprData[index].calcKeyDesc = this.getView().byId("opCalcDescDt").getValue();
				oprData[index].Lar01 = this.getView().byId("opActTypeDt").getValue();
				oprData[index].actTypDesc = this.getView().byId("opActTypeDescDt").getValue();*/

				// oprData[index].Vornr = this.operationDetail.Vornr;
				// oprData[index].Arbpl = this.operationDetail.Arbpl;
				// oprData[index].Werks = this.operationDetail.Werks;
				// oprData[index].Steus = this.operationDetail.Steus;
				// oprData[index].Ltxa1 = this.operationDetail.Ltxa1;
				// if (this.operationDetail.Arbei === "") {
				// 	oprData[index].Arbei = "0.0";
				// } else {
				// 	oprData[index].Arbei = this.operationDetail.Arbei;
				// }

				// oprData[index].WcZeiwn = this.operationDetail.Arbeh;
				// oprData[index].Anzzl = this.operationDetail.Anzzl;
				// if (this.operationDetail.Dauno === "") {
				// 	oprData[index].Dauno = "0.0";
				// } else {
				// 	oprData[index].Dauno = this.operationDetail.Dauno;
				// }

				this.operationDetail.Arbei === "" ? "0.00" : this.operationDetail.Arbei;
				this.operationDetail.Dauno === "" ? "0.00" : this.operationDetail.Dauno;

				// oprData[index].Daune = this.operationDetail.Daune;
				// oprData[index].Indet = this.operationDetail.Indet;
				// oprData[index].calcKeyDesc = this.operationDetail.calcKeyDesc;
				// oprData[index].Lar01 = this.operationDetail.Larnt;
				// oprData[index].actTypDesc = this.operationDetail.actTypDesc;

				// var id = this.getView().getParent()._pageStack[1].id;
				// id = id + "--operationTab";
				// var pModel = new sap.ui.model.json.JSONModel();
				// pModel.setData(oprData);
				//sap.ui.getCore().byId(id).setModel(pModel, "oprView");
				// sap.ui.getCore().setModel(pModel, "tlDetailModel");

				// var path = this.mainPath + "/operation";
				// var main = this.mainPath.substr(1);
				// var basic = this.basicPath.substr(1);
				// if (this.action.indexOf("GTL") > 0) {
				// 	var AIWListGTLModel = sap.ui.getCore().getModel("AIWListGTLModel");
				// 	var AIWListGTLData = AIWListGTLModel.getData();
				// 	if (AIWListGTLData[basic].operation) {
				// 		var oprExistFlag = false;
				// 		for (var z = 0; z < AIWListGTLData[basic].operation.length; z++) {
				// 			if (AIWListGTLData[basic].operation[z].Plnal === oprData[index].Plnal && AIWListGTLData[basic].operation[z].Vornr ===
				// 				oprData[index].Vornr) {
				// 				AIWListGTLData[basic].operation[z] = oprData[index];
				// 				oprExistFlag = true;
				// 			}
				// 		}
				// 		if (!oprExistFlag) {
				// 			AIWListGTLData[basic].operation.push(oprData[index]);
				// 		}
				// 		// AIWListGTLData[basic].operation[main] = oprData[index];
				// 	} else {
				// 		AIWListGTLData[basic].operation = oprData;
				// 	}
				// 	/*if(AIWListGTLModel.getProperty(path)) {
				// 		AIWListGTLModel.setProperty(this.itmDetailPath,oprData);
				// 	} else {
				// 		// AIWListGTLModel.setProperty(path,pModel.getData());
				// 	}*/
				// } else if (this.action.indexOf("ETL") > 0) {
				// 	var AIWListETLModel = sap.ui.getCore().getModel("AIWListETLModel");
				// 	var AIWListETLData = AIWListETLModel.getData();
				// 	if (AIWListETLData[basic].operation) {
				// 		var oprExistFlag = false;
				// 		for (var z = 0; z < AIWListETLData[basic].operation.length; z++) {
				// 			if (AIWListETLData[basic].operation[z].Plnal === oprData[index].Plnal && AIWListETLData[basic].operation[z].Vornr ===
				// 				oprData[index].Vornr) {
				// 				AIWListETLData[basic].operation[z] = oprData[index];
				// 				oprExistFlag = true;
				// 			}
				// 		}
				// 		if (!oprExistFlag) {
				// 			AIWListETLData[basic].operation.push(oprData[index]);
				// 		}
				// 		// AIWListETLData[basic].operation[main] = oprData[index];
				// 	} else {
				// 		AIWListETLData[basic].operation = oprData;
				// 	}
				// 	/*if (AIWListETLModel.getProperty(path)) {
				// 		AIWListETLModel.setProperty(this.itmDetailPath, oprData);
				// 	} else {
				// 		AIWListETLModel.setProperty(path, pModel.getData());
				// 	}*/
				// } else if (this.action.indexOf("FTL") > 0) {
				// 	var AIWListFTLModel = sap.ui.getCore().getModel("AIWListFTLModel");
				// 	var AIWListFTLData = AIWListFTLModel.getData();
				// 	if (AIWListFTLData[basic].operation) {
				// 		var oprExistFlag = false;
				// 		for (var z = 0; z < AIWListFTLData[basic].operation.length; z++) {
				// 			if (AIWListFTLData[basic].operation[z].Plnal === oprData[index].Plnal && AIWListFTLData[basic].operation[z].Vornr ===
				// 				oprData[index].Vornr) {
				// 				AIWListFTLData[basic].operation[z] = oprData[index];
				// 				oprExistFlag = true;
				// 			}
				// 		}
				// 		if (!oprExistFlag) {
				// 			AIWListFTLData[basic].operation.push(oprData[index]);
				// 		}
				// 		// AIWListFTLData[basic].operation[main] = oprData[index];
				// 	} else {
				// 		AIWListFTLData[basic].operation = oprData;
				// 	}
				// }

				if (this.operationDetail.Uvorn === "") {
					this.operationDetail.UvornEnable = false;
				}

				if (sSourceId.indexOf("idBtnCheck") > -1) {
					this.validateCheck();
					return;
				}
			}

			// sap.ui.getCore().byId(id).setSelectedItem(sap.ui.getCore().byId(id).getItems()[index], true /*selected*/ ,
			// true /*fire event*/ );
			window.history.go(-1);
			// this.oData;
		},

		validateCheck: function (eFlag, fFlag) {
			var g = this;
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWListWCData = sap.ui.getCore().getModel("AIWListWCModel").getData();
			var sAIWData = sap.ui.getCore().getModel("tlDetailModel").getData();
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

			if (this.action.indexOf("GTL") > 0) { //GTL
				if (sAIWData.lHeader.Iwerk !== "") {
					sAIWData.lHeader.Werks = sAIWData.lHeader.Iwerk;
				}
				var gtList = {
					"Werks": sAIWData.lHeader.Werks,
					"Wcplant": sAIWData.lHeader.plant,
					"Statu": sAIWData.lHeader.Statu,
					"Tverwe": sAIWData.lHeader.tlusg,
					"Ktext": sAIWData.lHeader.Ktext,
					"Tarbpl": sAIWData.lHeader.wc,
					"Vagrp": sAIWData.lHeader.Vagrp,
					"Anlzu": sAIWData.lHeader.Anlzu,
					"Tplnal": (sAIWData.lHeader.Plnal).toString(),
					"Tlgnhdr": sAIWData.grp,
					"Strat": sAIWData.lHeader.Strat,
					"Slwbez": sAIWData.lHeader.insPt,
					"Slwbeztxt": sAIWData.lHeader.insPtDesc
				};
				sPayload.GTList.push(gtList);

				if (sAIWData.lOperation && sAIWData.lOperation.length > 0) {
					for (var k = 0; k < sAIWData.lOperation.length; k++) {
						var gtlOpr = {
							"Tlgnhdr": sAIWData.grp,
							"Vornr": sAIWData.lOperation[k].Vornr,
							"TlArbpl": sAIWData.lOperation[k].Arbpl,
							"Werks2gop": sAIWData.lOperation[k].Werks,
							"Steus2gop": sAIWData.lOperation[k].Steus,
							"Ltxa1": sAIWData.lOperation[k].Ltxa1,
							"Arbei": sAIWData.lOperation[k].Arbei,
							"Dauno": sAIWData.lOperation[k].Dauno,
							"Arbeh": sAIWData.lOperation[k].Arbeh,
							"Anzzl": sAIWData.lOperation[k].Anzzl,
							"Daune": sAIWData.lOperation[k].Daune,
							"Indet": sAIWData.lOperation[k].Indet,
							"Tplnal": (sAIWData.lOperation[k].Plnal).toString(),
							"Larnt": sAIWData.lOperation[k].Larnt,
							"Prznt": sAIWData.lOperation[k].workPerc,
							"Bmvrg": sAIWData.lOperation[k].orderQty,
							"Bmeih": sAIWData.lOperation[k].ordQtyUnit,
							"Opreis": sAIWData.lOperation[k].netPrice,
							"Owaers": sAIWData.lOperation[k].currency,
							"Opeinh": sAIWData.lOperation[k].priceUnit,
							"Sakto2gop": sAIWData.lOperation[k].costElement,
							"Omatkl": sAIWData.lOperation[k].materialGrp,
							"Oekgrp": sAIWData.lOperation[k].puchGroup,
							"Ekorg": sAIWData.lOperation[k].purchOrg,
						};
						sPayload.GTOprs.push(gtlOpr);
					}
				}

				if (sAIWData.lComponent && sAIWData.lComponent.length > 0) {
					for (var l = 0; l < sAIWData.lComponent.length; l++) {
						var gtlComp = {
							"Tlgnhdr": sAIWData.grp,
							"Idnrk": sAIWData.lComponent[l].Idnrk,
							"Menge": sAIWData.lComponent[l].Menge,
							"MeinsGcp": sAIWData.lComponent[l].MeinsGcp,
							"Vornr": sAIWData.lComponent[l].Vornr,
							"Postp": sAIWData.lComponent[l].Postp,
							"Tplnal": (sAIWData.lComponent[l].Plnal).toString()
						};
						sPayload.GTComp.push(gtlComp);
					}
				}

				if (sAIWData.Class) {
					for (var m = 0; m < sAIWData.Class.length; m++) {
						if (sAIWData.Class[m].Plnal === sAIWData.lHeader.Plnal) {
							var gtlClass = {
								"Tlgnhdr": sAIWData.grp,
								"Classtype": sAIWData.Class[m].Classtype,
								"Class": sAIWData.Class[m].Class,
								"Clstatus1": sAIWData.Class[m].Clstatus1,
								"Tplnal": (sAIWData.Class[m].Plnal).toString()
							};
							sPayload.GTClass.push(gtlClass);
						}
					}
				}

				if (sAIWData.Char) {
					for (var n = 0; n < sAIWData.Char.length; n++) {
						for (var k = 0; k < sAIWData.Class.length; k++) {
							if (sAIWData.Class[k].Class === sAIWData.Char[n].Class && sAIWData.Class[k].Plnal === sAIWData.lHeader
								.Plnal && !sAIWData.Char[n].Plnal) {
								sAIWData.Char[n].Plnal = sAIWData.Class[k].Plnal;
							}
						}
						if (sAIWData.Char[n].Plnal) {
							var gtlChar = {
								"Tlgnhdr": sAIWData.grp,
								"Atnam": sAIWData.Char[n].Atnam,
								"Textbez": sAIWData.Char[n].Textbez,
								"Atwrt": sAIWData.Char[n].Atwrt,
								"Class": sAIWData.Char[n].Class,
								"Tplnal": (sAIWData.Char[n].Plnal).toString()
							};
							sPayload.GTVal.push(gtlChar);
						}
					}
				}
			} else if (this.action.indexOf("ETL") > 0) { //ETL
				if (sAIWData.lHeader.Iwerk !== "") {
					sAIWData.lHeader.Werks = sAIWData.lHeader.Iwerk;
				}
				var etList = {
					"Werks": sAIWData.lHeader.Werks,
					"Wcplant": sAIWData.lHeader.plant,
					"Statu": sAIWData.lHeader.Statu,
					"Tverwe": sAIWData.lHeader.tlusg,
					"Ktext": sAIWData.lHeader.Ktext,
					"Tarbpl": sAIWData.lHeader.wc,
					"Vagrp": sAIWData.lHeader.Vagrp,
					"Anlzu": sAIWData.lHeader.Anlzu,
					"Tplnal": (sAIWData.lHeader.Plnal).toString(),
					"Tleqhdr": sAIWData.grp,
					"Strat": sAIWData.lHeader.Strat,
					"Eq2tl": sAIWData.lHeader.equipment,
					"Slwbez": sAIWData.lHeader.insPt,
					"Slwbeztxt": sAIWData.lHeader.insPtDesc
				};
				sPayload.ETList.push(etList);

				if (sAIWData.lOperation && sAIWData.lOperation.length > 0) {
					for (var k = 0; k < sAIWData.lOperation.length; k++) {
						var etlOpr = {
							"Tleqhdr": sAIWData.grp,
							"Vornr": sAIWData.lOperation[k].Vornr,
							"TlArbpl": sAIWData.lOperation[k].Arbpl,
							"Werks2eop": sAIWData.lOperation[k].Werks,
							"Steus2eop": sAIWData.lOperation[k].Steus,
							"Ltxa1": sAIWData.lOperation[k].Ltxa1,
							"Arbei": sAIWData.lOperation[k].Arbei,
							"Dauno": sAIWData.lOperation[k].Dauno,
							"Arbeh": sAIWData.lOperation[k].Arbeh,
							"Anzzl": sAIWData.lOperation[k].Anzzl,
							"Daune": sAIWData.lOperation[k].Daune,
							"Indet": sAIWData.lOperation[k].Indet,
							"Tplnal": (sAIWData.lOperation[k].Plnal).toString(),
							"Larnt": sAIWData.lOperation[k].Larnt,
							"Prznt": sAIWData.lOperation[k].workPerc,
							"Bmvrg": sAIWData.lOperation[k].orderQty,
							"Bmeih": sAIWData.lOperation[k].ordQtyUnit,
							"Opreis": sAIWData.lOperation[k].netPrice,
							"Owaers": sAIWData.lOperation[k].currency,
							"Opeinh": sAIWData.lOperation[k].priceUnit,
							"Sakto2eop": sAIWData.lOperation[k].costElement,
							"Omatkl": sAIWData.lOperation[k].materialGrp,
							"Oekgrp": sAIWData.lOperation[k].puchGroup,
							"Ekorg": sAIWData.lOperation[k].purchOrg,
						};
						sPayload.ETOprs.push(etlOpr);
					}
				}

				if (sAIWData.lComponent && sAIWData.lComponent.length > 0) {
					for (var l = 0; l < sAIWData.lComponent.length; l++) {
						var etlComp = {
							"Tleqhdr": sAIWData.grp,
							"Idnrk": sAIWData.lComponent[l].Idnrk,
							"Menge": sAIWData.lComponent[l].Menge,
							"MeinsEcp": sAIWData.lComponent[l].MeinsGcp,
							"Vornr": sAIWData.lComponent[l].Vornr,
							"Postp": sAIWData.lComponent[l].Postp,
							"Tplnal": (sAIWData.lComponent[l].Plnal).toString()
						};
						sPayload.ETComp.push(etlComp);
					}
				}

				if (sAIWData.Class) {
					for (var m = 0; m < sAIWData.Class.length; m++) {
						if (sAIWData.Class[m].Plnal === sAIWData.lHeader.Plnal) {
							var etlClass = {
								"Tleqhdr": sAIWData.grp,
								"Classtype": sAIWData.Class[m].Classtype,
								"Class": sAIWData.Class[m].Class,
								"Clstatus1": sAIWData.Class[m].Clstatus1,
								"Tplnal": (sAIWData.Class[m].Plnal).toString()
							};
							sPayload.ETClass.push(etlClass);
						}
					}
				}

				if (sAIWData.Char) {
					for (var n = 0; n < sAIWData.Char.length; n++) {
						for (var k = 0; k < sAIWData.Class.length; k++) {
							if (sAIWData.Class[k].Class === sAIWData.Char[n].Class && sAIWData.Class[k].Plnal === sAIWData.lHeader
								.Plnal && !sAIWData.Char[n].Plnal) {
								sAIWData.Char[n].Plnal = sAIWData.Class[k].Plnal;
							}
						}
						if (sAIWData.Char[n].Plnal) {
							var etlChar = {
								"Tleqhdr": sAIWData.grp,
								"Atnam": sAIWData.Char[n].Atnam,
								"Textbez": sAIWData.Char[n].Textbez,
								"Atwrt": sAIWData.Char[n].Atwrt,
								"Class": sAIWData.Char[n].Class,
								"Tplnal": (sAIWData.Char[n].Plnal).toString()
							};
							sPayload.ETVal.push(etlChar);
						}
					}
				}
			} else if (this.action.indexOf("FTL") > 0) { //FTL
				if (sAIWData.lHeader.Iwerk !== "") {
					sAIWData.lHeader.Werks = sAIWData.lHeader[j].Iwerk;
				}
				var ftList = {
					"Werks": sAIWData.lHeader.Werks,
					"Wcplant": sAIWData.lHeader.plant,
					"Statu": sAIWData.lHeader.Statu,
					"Tverwe": sAIWData.lHeader.tlusg,
					"Ktext": sAIWData.lHeader.Ktext,
					"Tarbpl": sAIWData.lHeader.wc,
					"Vagrp": sAIWData.lHeader.Vagrp,
					"Anlzu": sAIWData.lHeader.Anlzu,
					"Tplnal": (sAIWData.lHeader.Plnal).toString(),
					"Tlflhdr": sAIWData.grp,
					"Strat": sAIWData.lHeader.Strat,
					"Fl2tl": sAIWData.lHeader.floc,
					"Slwbez": sAIWData.lHeader[j].insPt,
					"Slwbeztxt": sAIWData.lHeader[j].insPtDesc
				};
				sPayload.FTList.push(ftList);

				if (sAIWData.lOperation) {
					for (var k = 0; k < sAIWData.lOperation.length; k++) {
						var ftlOpr = {
							"Tlflhdr": sAIWData.grp,
							"Vornr": sAIWData.lOperation[k].Vornr,
							"TlArbpl": sAIWData.lOperation[k].Arbpl,
							"Werks2fop": sAIWData.lOperation[k].Werks,
							"Steus2fop": sAIWData.lOperation[k].Steus,
							"Ltxa1": sAIWData.lOperation[k].Ltxa1,
							"Arbei": sAIWData.lOperation[k].Arbei,
							"Dauno": sAIWData.lOperation[k].Dauno,
							"Arbeh": sAIWData.lOperation[k].Arbeh,
							"Anzzl": sAIWData.lOperation[k].Anzzl,
							"Daune": sAIWData.lOperation[k].Daune,
							"Indet": sAIWData.lOperation[k].Indet,
							"Tplnal": (sAIWData.lOperation[k].Plnal).toString(),
							"Larnt": sAIWData.lOperation[k].Larnt,
							"Prznt": sAIWData.lOperation[k].workPerc,
							"Bmvrg": sAIWData.lOperation[k].orderQty,
							"Bmeih": sAIWData.lOperation[k].ordQtyUnit,
							"Opreis": sAIWData.lOperation[k].netPrice,
							"Owaers": sAIWData.lOperation[k].currency,
							"Opeinh": sAIWData.lOperation[k].priceUnit,
							"Sakto2fop": sAIWData.lOperation[k].costElement,
							"Omatkl": sAIWData.lOperation[k].materialGrp,
							"Oekgrp": sAIWData.lOperation[k].puchGroup,
							"Ekorg": sAIWData.lOperation[k].purchOrg,
						};
						sPayload.FTOprs.push(ftlOpr);
					}
				}

				if (sAIWData.lComponent) {
					for (var l = 0; l < sAIWData.lComponent.length; l++) {
						var ftlComp = {
							"Tlflhdr": sAIWData.grp,
							"Idnrk": sAIWData.lComponent[l].Idnrk,
							"Menge": sAIWData.lComponent[l].Menge,
							"MeinsFcp": sAIWData.lComponent[l].MeinsGcp,
							"Vornr": sAIWData.lComponent[l].Vornr,
							"Postp": sAIWData.lComponent[l].Postp,
							"Tplnal": (sAIWData.lComponent[l].Plnal).toString()
						};
						sPayload.FTComp.push(ftlComp);
					}
				}

				if (sAIWData.Class) {
					for (var m = 0; m < sAIWData.Class.length; m++) {
						if (sAIWData.Class[m].Plnal === sAIWData.lHeader.Plnal) {
							var ftlClass = {
								"Tlflhdr": sAIWData.grp,
								"Classtype": sAIWData.Class[m].Classtype,
								"Class": sAIWData.Class[m].Class,
								"Clstatus1": sAIWData.Class[m].Clstatus1,
								"Tplnal": (sAIWData.Class[m].Plnal).toString()
							};
							sPayload.FTClass.push(ftlClass);
						}
					}
				}

				if (sAIWData.Char) {
					for (var n = 0; n < sAIWData.Char.length; n++) {
						for (var k = 0; k < sAIWData.Class.length; k++) {
							if (sAIWData.Class[k].Class === sAIWData.Char[n].Class && sAIWData.Class[k].Plnal === sAIWData.lHeader
								.Plnal && !sAIWData.Char[n].Plnal) {
								sAIWData.Char[n].Plnal = sAIWData.Class[k].Plnal;
							}
						}
						if (sAIWData.Char[n].Plnal) {
							var ftlChar = {
								"Tlflhdr": sAIWData.grp,
								"Atnam": sAIWData.Char[n].Atnam,
								"Textbez": sAIWData.Char[n].Textbez,
								"Atwrt": sAIWData.Char[n].Atwrt,
								"Class": sAIWData.Char[n].Class,
								"Tplnal": (sAIWData.Char[n].Plnal).toString()
							};
							sPayload.FTVal.push(ftlChar);
						}
					}
				}
			}

			this.getView().byId("tlOpDetailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("tlOpDetailPage").setBusy(false);
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
					g.getView().byId("tlOpDetailPage").setBusy(false);
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

		onOrdQtyUnitVH: function (oEvent) {
			ValueHelpRequest.UOMVH(oEvent, this);
		},
		onOrdQtyUnitChange: function (oEvent) {
			ValueHelpRequest._UOMchange(oEvent, this);
		},

		onCurrencyVH: function (oEvent) {
			ValueHelpRequest.CurKeyVH(oEvent, this, []);
		},
		onCurrencyChange: function (oEvent) {
			ValueHelpRequest._CurKeychange(oEvent, this, []);
		},

		onCostEleVH: function (oEvent) {
			ValueHelpRequest.CostEleVH(oEvent, this);
		},
		onCostEleChange: function (oEvent) {
			ValueHelpRequest._CostElechange(oEvent, this);
		},

		onMatGrpVH: function (oEvent) {
			ValueHelpRequest.MatGrpVH(oEvent, this);
		},
		onMatGrpChange: function (oEvent) {
			ValueHelpRequest._MatGrpchange(oEvent, this);
		},

		onpuchGroupVH: function (oEvent) {
			ValueHelpRequest.PuchGroupVH(oEvent, this);
		},
		onpuchGroupChange: function (oEvent) {
			ValueHelpRequest._PuchGroupchange(oEvent, this);
		},

		onpurchOrgVH: function (oEvent) {
			ValueHelpRequest.PurchOrgVH(oEvent, this);
		},
		onpurchOrgChange: function (oEvent) {
			ValueHelpRequest._PurchOrgchange(oEvent, this);
		},

		onOprEquiVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp2");
			var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
			var Dialog = new sap.m.SelectDialog({
				title: "{i18n>EQUI_TXT}",
				noDataText: "{i18n>LOAD}" + "...",
				confirm: function (E) {
					g.operationDetail.equi = E.getParameters().selectedItem.getProperty("title");
					g.operationDetail.equiDesc = E.getParameters().selectedItem.getProperty("description");
					g.operationDetail.equiVS = "None";
					tlOpDetailModel.setData(g.operationDetail);
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

		onOprEquiChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var c = value.toUpperCase();
			var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
			var oModelData = sap.ui.getCore().getModel("AIWEQUI").getData();
			if (oModelData.length > 0) {
				for (var i = 0; i < oModelData.length; i++) {
					if (oModelData[i].Equnr === c) {
						g.operationDetail.equi = oModelData[i].Equnr;
						g.operationDetail.equiDesc = oModelData[i].Eqktx;
						g.operationDetail.equiVS = "None";
						tlOpDetailModel.setData(g.operationDetail);
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
						g.operationDetail.equi = d.results[0].Equnr;
						g.operationDetail.equiDesc = d.results[0].Eqktu;
						g.operationDetail.equiVS = "None";
						tlOpDetailModel.setData(g.operationDetail);
					} else {
						g.operationDetail.equiDesc = "";
						g.operationDetail.equiVS = "Error";
						tlOpDetailModel.setData(g.operationDetail);
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
					g.operationDetail.equiDesc = "";
					g.operationDetail.equiVS = "Error";
					tlOpDetailModel.setData(g.operationDetail);
				}
			});
		},

		onOprFlocVH: function (oEvent) {
			var g = this;
			var M = g.getView().getModel("valueHelp");
			var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
			var Dialog = new sap.m.SelectDialog({
				title: "Functional Location",
				noDataText: "{i18n>LOAD}" + "...",
				confirm: function (E) {
					g.operationDetail.floc = E.getParameters().selectedItem.getProperty("title");
					g.operationDetail.flocDesc = E.getParameters().selectedItem.getProperty("description");
					g.operationDetail.flocVS = "None";
					tlOpDetailModel.setData(g.operationDetail);
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
			M.read(q, {
				success: function (h, E) {
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
					if (h.results.length > 0) {
						var I = new sap.m.StandardListItem({
							title: "{Tplnr}",
							description: "{Pltxt}",
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

		onOprFlocChange: function (oEvent) {
			var g = this;
			var value = oEvent.getParameters().newValue;
			var c = value.toUpperCase();
			var tlOpDetailModel = g.getView().getModel("tlOpDetailModel");
			var oModelData = sap.ui.getCore().getModel("AIWFLOC").getData();
			if (oModelData.length > 0) {
				for (var i = 0; i < oModelData.length; i++) {
					if (oModelData[i].Functionallocation === c) {
						g.operationDetail.floc = oModelData[i].Functionallocation;
						g.operationDetail.flocDesc = oModelData[i].Flocdescription;
						g.operationDetail.flocVS = "None";
						tlOpDetailModel.setData(g.operationDetail);
						return;
					}
				}
			}

			var q = "/FunctionLocationSet";
			var oFilter = new sap.ui.model.Filter("Tplnr", "EQ", c);
			var m = this.getView().getModel("valueHelp");
			m.read(q, {
				filters: [oFilter],
				success: function (d) {
					if (d.results.length > 0) {
						g.operationDetail.floc = d.results[0].Tplnr;
						g.operationDetail.flocDesc = d.results[0].Pltxt;
						g.operationDetail.flocVS = "None";
						tlOpDetailModel.setData(g.operationDetail);
					} else {
						g.operationDetail.flocDesc = "";
						g.operationDetail.flocVS = "Error";
						tlOpDetailModel.setData(g.operationDetail);
					}
				},
				error: function (err) {
					var b = JSON.parse(err.responseText);
					var d = b.error.message.value;
					g.operationDetail.flocDesc = "";
					g.operationDetail.flocVS = "Error";
					tlOpDetailModel.setData(g.operationDetail);
				}
			});
		},

		onSubOpChange: function (oEvent) {
			var sSubOpValue = oEvent.getSource().getValue();
			if (sSubOpValue !== "") {
				this.operationDetail.VornrEnable = true;
				this.operationDetail.opNumDtValueState = "Error";
			}

			var msg = "No operation found for the sub-operation " + sSubOpValue;
			this.createMessagePopover(msg, "Error");
		},

		onOprNumChange: function (oEvent) {
			if (this.operationDetail.Uvorn !== "") {
				var currentOpr = this.operationDetail.Vornr;
				var tlDetailModel = sap.ui.getCore().getModel("tlDetailModel");
				var currOprList = tlDetailModel.getData().lOperation;
				var curIndex = this.itmDetailPath.split("/")[3];
				var existFlag = false;
				for (var i = 0; i < currOprList.length; i++) {
					if (i.toString() === curIndex) {
						continue;
					}

					if (currentOpr === currOprList[i].Vornr) {
						existFlag = true;
					}
				}

				if (existFlag) {
					this.operationDetail.opNumDtValueState = "None";
					this.operationDetail.VornrEnable = false;
				} else {
					var msg = "No operation found for the sub-operation " + this.operationDetail.Uvorn;
					this.createMessagePopover(msg, "Error");
				}

			}
		}

	});

});