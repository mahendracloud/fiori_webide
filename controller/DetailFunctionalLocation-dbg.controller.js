/*global location history */
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
	"ugiaiwui/mdg/aiw/library/js/ClassUtils",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"sap/m/BusyDialog",
	"sap/ui/core/message/Message"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, ValueHelpRequest, ClassUtils, ValueHelpProvider,
	BusyDialog, Message) {
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailFunctionalLocation", {

		formatter: formatter,
		detailFlag: true,
		oAttach: [],
		_oCatalog: null,
		_oResourceBundle: null,
		oFileUpload: "",
		flCatSelectDialog: undefined,
		stSelectDialog: undefined,
		otCatSelectDialog: undefined,
		mpCatSelectDialog: undefined,
		cntrySelectDialog: undefined,
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

		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			this.getRouter().getRoute("detailFloc").attachPatternMatched(this._onRouteMatched, this);
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
			this.resultArr = [];
			this.oModelUpdateFlag = false;
			this.oModelName = "AIWFLOC";

			var classFragmentId = this.getView().createId("clsFrag");
			var itemFragmentId = this.getView().createId("charFrag");
			var linearCharFragmentId = this.getView().createId("linearcharFrag");
			var lamFragmentId = this.getView().createId("lamFrag");
			this.class = sap.ui.core.Fragment.byId(classFragmentId, "assignmentTab");
			this.char = sap.ui.core.Fragment.byId(itemFragmentId, "characteristicsTab");
			this.linearChar = sap.ui.core.Fragment.byId(linearCharFragmentId, "idTblLinearChar");
			this.lam = sap.ui.core.Fragment.byId(lamFragmentId, "lamSimpleForm");
			var lamAprv = this.getView().createId("lamAprvFrag");
			this.lamAprvSF = sap.ui.core.Fragment.byId(lamAprv, "lamSimpleForm");

			var sObj = {
				titleName: this.getOwnerComponent().getModel("i18n").getProperty("createFlocTitle"),
				visible: false,
				enabled: true,
				AltLblVisible: true
			};
			var sApproveData = {
				createVisible: true,
				approveVisible: false,
				approveVisibleLin: false
			};
			this.getView().setModel(new JSONModel({
				enabled: true
			}), "flocAddressView");
			this.getView().setModel(new JSONModel(), "SUP_FLOC_DATA");
			this.getView().setModel(new JSONModel(sObj), "mainView");
			this.getView().setModel(new JSONModel(sApproveData), "ApproveModel");
			this.readAddressTitle();
			this.isLam();
			this.readAddressVersion(this);
			this.AltKeyDerivation();
			this.BusyDialog = new BusyDialog();
			this.getClassType(this);

			this.readDOIList();
			var rModel = new sap.ui.model.json.JSONModel();
			rModel.setData([]);
			this.getView().setModel(rModel, "dataOrigin");

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

			// this.AltLblDerv = "2";

			// this.obj = this._oComponent.getComponentData().startupParameters.OBJ[0];
			// this.cReqType = this._oComponent.getComponentData().startupParameters.USMD_CREQ_TYPE[0];
			// this._initializeAttachments();
		},

		readDOIList: function () {
			var oModel = this.getView().getModel("valueHelp2");
			var g = this;
			var oFilter = [new sap.ui.model.Filter("Entity", "EQ", "FUNCLOC")];
			oModel.read("/DOIListSet", {
				filters: oFilter,
				success: function (r) {
					var rModel = new sap.ui.model.json.JSONModel();
					var results = r.results;
					var arr = [];
					for (var s = 0; s < results.length; s++) {
						var obj = new Object();
						var value = r.results[s].Property;
						obj["SupFlVal"] = "";
						obj["instLoc"] = false;
						obj["maintenance"] = false;
						obj["Label"] = r.results[s].Label;
						obj["property"] = r.results[s].Property;
						obj["currentVal"] = "";
						obj["doiIcon"] = true;
						obj[r.results[s].Property] = "";
						if (r.results[s].Property === "Maintplant") {
							obj["locEnable"] = false;
							obj["maintEnable"] = false;
						} else {
							obj["locEnable"] = true;
							obj["maintEnable"] = true;
						}
						arr.push(obj);
					}
					g.DOIarrayFL = arr;
					// rModel.setData(arr);
					// g.getView().setModel(rModel, "dataOrigin");
				},
				error: function (err) {

				}
			});
		},

		// onDoiPress: function (e) {
		// 	if (!this.doiView) {
		// 		this.doiView = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DataOrigin", this);
		// 	}
		// 	var value = e.getSource().getValue();
		// 	var dModel = new sap.ui.model.json.JSONModel();
		// 	var dObj = {};
		// 	if (value === "") {
		// 		dObj.install = false;
		// 		dObj.dismantle = true;
		// 	} else {
		// 		dObj.install = true;
		// 		dObj.dismantle = false;
		// 	}
		// 	dModel.setData(dObj);
		// 	this.doiView.setModel(dModel);
		// 	var oTable = this.doiView.getContent()[1];
		// 	oTable.setModel(this.getView().getModel("dataOrigin"));
		// 	var colItems = sap.ui.getCore().byId("idColItems");
		// 	oTable.bindItems("/", colItems);
		// 	this.doiView.open();
		// },

		_superFlocDesc: function (src, flag) {
			var g = this;
			var sPath = "/FunctionLocationSet";
			var currentData = this.getView().getModel(this.oModelName).getData();
			var oFilters = [new sap.ui.model.Filter("Tplnr", "EQ", src.getValue())];
			var oModel = g.getView().getModel("valueHelp");
			oModel.read(sPath, {
				filters: oFilters,
				success: function (d, e) {
					currentData.SupFlocdescription = d.results[0].Pltxt;
					currentData.SupFunctionallocationVS = "None";
					g.getView().getModel(this.oModelName).setData(currentData);
				},
				error: function (e) {
					currentData.SupFlocdescription = "";
					currentData.SupFunctionallocationVS = "Error";
					g.getView().getModel(this.oModelName).setData(currentData);
				}
			});
		},

		onDOICancelPress: function (e) {
			if (this.doiDisplayFlag) {
				e.getSource().getParent().close();
				this.doiDisplayFlag = false;
				return;
			}

			var objSOP = this.getView().getModel(this.oModelName).getData();
			var text = e.getSource().getParent().getBeginButton().getText();
			if (text !== "Dismantle") {
				if (this.isInstall) {
					this.getView().byId("superFloc").setValue(this.prevFlocValue);
					if (this.prevFlocValue) {
						this._superFlocDesc(this.getView().byId("superFloc"), "prev");
					}
					// objSOP.SupFunctionallocation = this.functionalLocation;
					// objSOP.SupFlocdescription = this.functionalLocDesc;
					// objSOP.SupFunctionallocationVS = "None";
					// this.functionalLocation = "";
					// this.functionalLocDesc = "";
				} else {
					objSOP.SupFunctionallocation = "";
					objSOP.SupFlocdescription = "";
					objSOP.SupFunctionallocationVS = "None";
					this.functionalLocation = "";
					this.functionalLocDesc = "";
				}
			} else {
				objSOP.SupFunctionallocation = "";
				objSOP.SupFlocdescription = "";
			}
			this.getView().getModel(this.oModelName).setData(objSOP);
			e.getSource().getParent().close();
		},

		// onDOICancelPress: function (e) {
		// 	var objSOP = this.getView().getModel(this.oModelName).getData();
		// 	var dModel = this.getView().getModel("doi").getData();
		// 	if (dModel.install === true) {
		// 		if (this.functionalLocation !== "") {
		// 			this.functionalLocation = "";
		// 			this.functionalLocDesc = "";
		// 			objSOP.SupFunctionallocation = ""; //this.getView().byId("FunctionalLocation").setValue();
		// 			objSOP.SupFlocdescription = ""; //this.getView().byId("FunctionalLocationidDesc").setValue();
		// 		}
		// 	} else if (dModel.dismantle === true) {
		// 		if (this.functionalLocation !== "") {
		// 			objSOP.SupFunctionallocation = this.functionalLocation; //this.getView().byId("FunctionalLocation").setValue();
		// 			objSOP.SupFlocdescription = this.functionalLocDesc; //this.getView().byId("FunctionalLocationidDesc").setValue();
		// 		}
		// 	}
		// 	this.getView().getModel(this.oModelName).setData(objSOP);
		// 	e.getSource().getParent().close();
		// },

		onObjectSelect: function (e) {
			var text = e.getSource().getText();
			var nextCB = "";
			var bSelected = e.getParameter('selected'),
				nextSelected;
			var oTable = e.getSource().getParent().getParent();
			var items = oTable.getItems();
			var actionType = e.getSource().getParent().getParent().getParent().getBeginButton().getText();
			if (text === "IL") {
				nextCB = e.getSource().getParent().getParent().getColumns()[5].getAggregation("header");
				nextSelected = nextCB.getSelected();
				if (bSelected) {
					nextCB.setSelected(false);
				}
				items.forEach(function (item) { // loop over all the items in the table
					var oCheckBoxCell = item.getCells()[3]; //fetch the cell which holds the checkbox for that row.
					var oNextCheckBoxCell = item.getCells()[5];
					var bObject = item.getBindingContext().getObject();
					if (bSelected) {
						if (actionType === "Dismantle") {
							oCheckBoxCell.setSelected(bSelected);
							bObject.finalDismantle = bObject.SupFlVal;
						} else {
							oCheckBoxCell.setSelected(bSelected);
							oNextCheckBoxCell.setSelected(false);
							bObject.targetVal = bObject.SupFlVal;
						}

					} else {
						if (actionType === "Dismantle") {
							oCheckBoxCell.setSelected(bSelected);
							bObject.finalDismantle = "";
						}
					}
				});
			} else if (text === "FL") {
				nextCB = e.getSource().getParent().getParent().getColumns()[3].getAggregation("header");
				nextSelected = nextCB.getSelected();
				if (bSelected) {
					nextCB.setSelected(false);
				}
				items.forEach(function (item) { // loop over all the items in the table
					var oCheckBoxCell = item.getCells()[5]; //fetch the cell which holds the checkbox for that row.
					var oNextCheckBoxCell = item.getCells()[3];
					var bObject = item.getBindingContext().getObject();
					if (bSelected) {
						oCheckBoxCell.setSelected(bSelected);
						oNextCheckBoxCell.setSelected(false);
						bObject.targetVal = "";
					}
				});
			}
		},

		AltKeyDerivation: function () {
			var sPath = "/DefaultValueSet";
			var g = this;
			var M = this.getView().getModel("valueHelp");
			M.read(sPath, {
				success: function (h, E) {
					var mainObj = g.getView().getModel("mainView").getData();
					mainObj.AltLblVisible = h.results[0].AltLabel === "2" ? true : false;
					g.getView().getModel("mainView").setData(mainObj);
					g.AltLblDerv = h.results[0].AltLabel;
				}
			});
		},

		_onRouteMatched: function (oEvent) {
			var g = this;
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "detailFloc") {
				var oAttachModel = sap.ui.getCore().getModel("ClassAttachRequest");
				var oAttachData = oAttachModel.getData();
				if (oAttachData.attachFlocFlag) {
					this.attachRequest();
					oAttachData.attachFlocFlag = false;
					oAttachModel.setData(oAttachData);
				}

				this.rowIndex = decodeURIComponent(oEvent.getParameter("arguments").Path);
				this.viewName = oEvent.getParameter("arguments").ViewName;
				this.oModelUpdateFlag = false;

				var sClassData = [],
					sCharData = [],
					aLinCharData = [],
					sCharNewButton;
				var sClassNewButton = true;
				var sLinCharNewButton = false;
				var mAddressModel = sap.ui.getCore().getModel("flocAddressView");
				var mAddressData = mAddressModel.getData();
				var oAddressViewModel = this.getView().getModel("flocAddressView");
				var oMainViewModel = this.getView().getModel("mainView");
				var sApproveModel = this.getView().getModel("ApproveModel");
				var oAddressViewData = oAddressViewModel.getData();
				var oMainViewData = oMainViewModel.getData();
				var sApproveData = sApproveModel.getData();
				var oJsonModel = new JSONModel();
				var sUstaEqui;
				oMainViewData.enabled = true;
				oMainViewData.visible = false;
				var mDataOriginMOP = sap.ui.getCore().getModel("dataOriginMOP");
				var aDataOriginMOP = mDataOriginMOP.getData();
				// this.getView().byId("idBtnCheck").setVisible(true);

				if (sap.ui.getCore().getModel("refreshModel") !== undefined) {
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty("/refreshSearch", false);
				}

				this.getView().byId("idTBLAltLbl").setMode("Delete");
				this.getView().byId("idTBLIntlAddr").setMode("Delete");
				this.getView().byId("idBTNnewIntlAddr").setEnabled(true);
				this.getView().byId("idAddAltLbl").setEnabled(true);
				this.sCrStatus = oEvent.getParameter("arguments").CrStatus;
				if (this.viewName === "CreateFloc") {
					oJsonModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex));
					this.getView().setModel(oJsonModel, this.oModelName);

					if (oJsonModel.getData().Maintplant !== "" && oJsonModel.getData().MaintplantVS !== "Error") {
						this.SOPMaintPlant = oJsonModel.getData().Maintplant;
					} else {
						this.SOPMaintPlant = "";
					}

					var doiExistFlag = false;
					for (var z = 0; z < aDataOriginMOP.FL.length; z++) {
						if (oJsonModel.getData().Functionallocation === aDataOriginMOP.FL[z].key) {
							var rModel = new sap.ui.model.json.JSONModel();
							rModel.setData(aDataOriginMOP.FL[z].DOI);
							g.getView().setModel(rModel, "dataOrigin");

							this.functionalLocation = oJsonModel.getData().SupFunctionallocation;
							this.functionalLocDesc = oJsonModel.getData().SupFlocdescription;
							doiExistFlag = true;
							// this.functionalLocation = oJsonModel.getData().Tplnr;
							// this.functionalLocDesc = oJsonModel.getData().Pltxt;
							break;
						}
					}
					if (!doiExistFlag) {
						if (this.DOIarrayFL) {
							var rModel = new sap.ui.model.json.JSONModel();
							rModel.setData(this.DOIarrayFL);
							g.getView().setModel(rModel, "dataOrigin");
							this.functionalLocation = "";
							this.functionalLocDesc = "";
						} else { //first time load
							jQuery.sap.delayedCall(10, g, function () {
								var rModel = new sap.ui.model.json.JSONModel();
								rModel.setData(this.DOIarrayFL);
								g.getView().setModel(rModel, "dataOrigin");
								this.functionalLocation = "";
								this.functionalLocDesc = "";
							});
						}
					}

					if (oJsonModel.getData().viewParameter === "change") {
						oJsonModel.getData().FunctionalLocEnabled = false;
						if (oJsonModel.getData().Floccategory === "" || oJsonModel.getData().Floccategory === undefined) {
							oJsonModel.getData().FlocCatEnabled = true;
						} else {
							oJsonModel.getData().FlocCatEnabled = false;
						}
						if (oJsonModel.getData().Strucindicator === "" || oJsonModel.getData().Strucindicator === undefined) {
							oJsonModel.getData().StrucIndEnabled = true;
						} else {
							oJsonModel.getData().StrucIndEnabled = false;
						}
						if (oJsonModel.getData().Maintplant === "" || oJsonModel.getData().Maintplant === undefined) {
							oJsonModel.getData().MaintplantEnabled = true;
						} else {
							oJsonModel.getData().MaintplantEnabled = false;
						}
						if (oJsonModel.getData().Bukrs === "" || oJsonModel.getData().Bukrs === undefined) {
							oJsonModel.getData().BukrsEnabled = true;
						} else {
							oJsonModel.getData().BukrsEnabled = false;
						}
						oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("changeFloc");
					} else {
						oJsonModel.getData().FunctionalLocEnabled = true;
						oJsonModel.getData().FlocCatEnabled = true;
						oJsonModel.getData().StrucIndEnabled = true;
						oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("createFloc");
					}

					if (oJsonModel.getData().Floccategory === "L" && g.lamSwitch === "X") {
						this.lam.setVisible(true);
						this.lam.setModel(oJsonModel, "AIWLAM");
					} else {
						this.lam.setVisible(false);
					}

					sClassData = oJsonModel.getData().classItems;
					// sCharData = oJsonModel.getData().characteristics;
					this.chData = oJsonModel.getData().characteristics;
					if (this.chData) {
						if (sClassData) {
							for (var j = 0; j < this.chData.length; j++) {
								if (sClassData[0].Class === this.chData[j].Class) {
									sCharData.push(this.chData[j]);
								}
							}
						}
					}
					// this.lnrChData = oJsonModel.getData().linearChar;
					this.lnrChData = $.map(oJsonModel.getData().linearChar, function (obj) {
						return $.extend(true, {}, obj);
					});
					if (this.lnrChData.length > 0) {
						for (var k = 0; k < this.lnrChData.length; k++) {
							if (sCharData[0].Atnam === this.lnrChData[k].Charid) { //sCharData[0].Class === this.lnrChData[k].Class &&
								aLinCharData.push(this.lnrChData[k]);
							}
						}
					}
					sCharNewButton = oJsonModel.getData().charNewButton;
					sLinCharNewButton = oJsonModel.getData().linearCharAddEnable;
					sUstaEqui = oJsonModel.getData().UstaEqui;
					this.setObjectAddress(this.oModelName);
					this.readSystemStatus(this);

					oAddressViewData.enabled = true;
					if (mAddressData.length > 0) {
						for (var as = 0; as < mAddressData.length; as++) {
							if (oJsonModel.getData().Functionallocation === mAddressData[as].Functionallocation) {
								oAddressViewData.enabled = mAddressData[as].IsEditable;
								break;
							}
						}
					}

					if (oAddressViewData.enabled === false) {
						this.getView().byId("idTBLIntlAddr").setMode("None");
					} else {
						this.getView().byId("idTBLIntlAddr").setMode("Delete");
					}

					var mSupFlocModel = sap.ui.getCore().getModel("SUP_FLOC_DATA");
					if (mSupFlocModel.getData() && mSupFlocModel.getData().length > 0) {
						var mSupFlocIndex;
						for (var b = 0; b < mSupFlocModel.getData().length; b++) {
							if (oJsonModel.getData().Functionallocation === mSupFlocModel.getData()[b].Functionallocation) {
								mSupFlocIndex = "/" + b;
								break;
							}
						}
						var sCopyArray = [mSupFlocModel.getProperty(mSupFlocIndex)];
						var sSupFlocData = $.map(sCopyArray, function (obj) {
							return $.extend(true, {}, obj);
						});
						var sSupFlocModel = new JSONModel();
						sSupFlocModel.setData(sSupFlocData);
						this.getView().setModel(sSupFlocModel, "SUP_FLOC_DATA");
					} else {
						this.getView().setModel(new JSONModel(), "SUP_FLOC_DATA");
					}
				}
				if (this.viewName === "ChangeFloc") {
					var sCrStatus = oEvent.getParameter("arguments").CrStatus;
					var sTplnr = oEvent.getParameter("arguments").Floc;
					oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("changeFloc");

					if (sCrStatus === "true") {
						sClassNewButton = false;
						sCharNewButton = false;
						sLinCharNewButton = false;
						oMainViewData.enabled = false;
						oAddressViewData.enabled = false;
						this.getView().byId("idTBLAltLbl").setMode("None");
						this.getView().byId("idTBLIntlAddr").setMode("None");
						this.getView().byId("idBTNnewIntlAddr").setEnabled(false);
						this.getView().byId("idAddAltLbl").setEnabled(false);
					}

					this.readSystemStatus(this);
					this.sExistFlag = false;
					var oMatchItem;
					var oModelData = sap.ui.getCore().getModel(this.oModelName).getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].Functionallocation === sTplnr) {
								oMatchItem = i;
								this.sExistFlag = true;
								break;
							}
						}
					}

					if (this.sExistFlag) {
						if (mAddressData.length > 0) {
							for (var ae = 0; ae < mAddressData.length; ae++) {
								if (oModelData[oMatchItem].Functionallocation === mAddressData[ae].Functionallocation) {
									oAddressViewData.enabled = mAddressData[ae].IsEditable;
									break;
								}
							}
						}
						if (oAddressViewData.enabled === false) {
							this.getView().byId("idTBLIntlAddr").setMode("None");
						} else {
							this.getView().byId("idTBLIntlAddr").setMode("Delete");
						}
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
						// this.lnrChData = oJsonModel.getData().linearChar;
						this.lnrChData = $.map(oJsonModel.getData().linearChar, function (obj) {
							return $.extend(true, {}, obj);
						});
						if (this.lnrChData.length > 0) {
							for (var k = 0; k < this.lnrChData.length; k++) {
								if (sCharData[0].Atnam === this.lnrChData[k].Charid) { //sCharData[0].Class === this.lnrChData[k].Class &&
									aLinCharData.push(this.lnrChData[k]);
								}
							}
						}
						sCharNewButton = oModelData[oMatchItem].charNewButton;
						sUstaEqui = oModelData[oMatchItem].UstaEqui;

						oModelData[oMatchItem].FunctionalLocEnabled = false;
						oModelData[oMatchItem].FlocCatEnabled = false;
						oModelData[oMatchItem].StrucIndEnabled = false;
						oModelData[oMatchItem].MaintplantEnabled = false;
						oModelData[oMatchItem].BukrsEnabled = false;
						this.getView().setModel(new JSONModel(oModelData[oMatchItem]), this.oModelName);
						this.setObjectAddress(this.oModelName);

						if (oModelData[oMatchItem].Floccategory === "L" && g.lamSwitch === "X") {
							this.lam.setVisible(true);
							this.lam.setModel(new JSONModel(oModelData[oMatchItem]), "AIWLAM");
						} else {
							this.lam.setVisible(false);
						}

						var aDOIFL = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
						for (var z = 0; z < aDOIFL.length; z++) {
							if (aDOIFL[z].key === oModelData[oMatchItem].Functionallocation) {
								this.getView().getModel("dataOrigin").setData(aDOIFL[z].DOI);
								this.functionalLocation = oModelData[oMatchItem].SupFunctionallocation;
								this.functionalLocDesc = oModelData[oMatchItem].SupFlocdescription;
							}
						}

						if (oModelData[oMatchItem].Maintplant !== "" && oModelData[oMatchItem].MaintplantVS !== "Error") {
							this.SOPMaintPlant = oModelData[oMatchItem].Maintplant;
						} else {
							this.SOPMaintPlant = "";
						}
					} else {
						this.readFunctionalLocData(sTplnr, sCrStatus);
					}
				}
				if (this.viewName === "Approve") {
					// this.getView().byId("idBtnCheck").setVisible(false);
					oJsonModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex));
					oJsonModel.getData().FunctionalLocEnabled = false;
					oJsonModel.getData().FlocCatEnabled = false;
					oJsonModel.getData().StrucIndEnabled = false;
					oJsonModel.getData().MaintplantEnabled = false;
					oJsonModel.getData().BukrsEnabled = false;
					sUstaEqui = oJsonModel.getData().UstaEqui;
					this.getView().setModel(oJsonModel, this.oModelName);

					var AIWAPPROVE = new JSONModel();
					var pApproveData = sap.ui.getCore().getModel("AIWAPPROVE").getProperty("/AIWFLOC" + this.rowIndex);
					AIWAPPROVE.setData(pApproveData);
					this.getView().setModel(AIWAPPROVE, "AIWAPPROVE");

					oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("approveFloc");
					oMainViewData.enabled = false;
					oAddressViewData.enabled = false;
					sApproveData.createVisible = false;
					sApproveData.approveVisible = true;
					sApproveData.approveVisibleLin = false;

					this.getView().byId("idTBLAltLbl").setMode("None");
					this.getView().byId("idTBLIntlAddr").setMode("None");
					this.getView().byId("idBTNnewIntlAddr").setEnabled(false);
					this.getView().byId("idAddAltLbl").setEnabled(false);

					this.lam.setVisible(sApproveData.createVisible);
					this.lamAprvSF.setModel(oJsonModel, "AIWLAM");
				}

				if (sUstaEqui) {
					oMainViewData.visible = true;
				}

				var classFragmentId = this.getView().createId("clsFrag");
				var newHeaderBtn = sap.ui.core.Fragment.byId(classFragmentId, "newHeader");
				newHeaderBtn.setEnabled(sClassNewButton);
				var linearCharFragmentId = this.getView().createId("linearcharFrag");
				var sBtnAddLinChar = sap.ui.core.Fragment.byId(linearCharFragmentId, "idBtnAddLinChar");
				sBtnAddLinChar.setEnabled(sLinCharNewButton);
				// var itemFragmentId = this.getView().createId("charFrag");
				// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
				// newCharBtn.setEnabled(sCharNewButton);
				this.class.setModel(new JSONModel(sClassData));
				this.char.setModel(new JSONModel(sCharData));
				this.linearChar.setModel(new JSONModel(aLinCharData));
				this.class.setVisible(sApproveData.createVisible);
				this.char.setVisible(sApproveData.createVisible);
				this.linearChar.setVisible(sApproveData.createVisible);

				if (oJsonModel.getData().Floccategory === "L" && this.lamSwitch === "X" && this.viewName !== "Approve") {
					this.linearChar.setVisible(true);
				} else {
					this.linearChar.setVisible(false);
				}

				if (this.viewName === "Approve") {
					var lamAprvFragID = this.getView().createId("lamAprvFrag");
					var lamAprvFragPanel = sap.ui.core.Fragment.byId(lamAprvFragID, "idPanelLinDataAprv");
					if (this.lamSwitch === "X") {
						lamAprvFragPanel.setVisible(true);
						sApproveData.approveVisibleLin = true;
					} else {
						lamAprvFragPanel.setVisible(false);
						sApproveData.approveVisibleLin = false;
					}
				}

				oAddressViewModel.setData(oAddressViewData);
				oMainViewModel.setData(oMainViewData);
				sApproveModel.setData(sApproveData);
			} else {
				return;
			}
		},

		isLam: function () {
			var g = this;
			var m = this.getView().getModel("valueHelp");

			m.read("/LAM_switchSet('')", {
				success: function (r, a) {
					g.lamSwitch = r.lam_switch;
					var mLocalModel = g.getView().getModel(g.oModelName);
					if (g.viewName === "Approve") {
						g.lam.setVisible(false);
						g.lamAprvSF.setModel(mLocalModel, "AIWLAM");
						g.linearChar.setVisible(false);
					} else if (mLocalModel.getData().Floccategory === "L" && g.lamSwitch === "X") {
						g.lam.setVisible(true);
						g.lam.setModel(mLocalModel, "AIWLAM");
						g.linearChar.setVisible(true);
					} else {
						g.lam.setVisible(false);
						g.linearChar.setVisible(false);
					}
				},
				error: function (err) {}
			});
		},

		onInactiveSelect: function (oEvent) {
			var p = oEvent.getSource().getModel(this.oModelName).getData();
			p.Deact = oEvent.getSource().getSelected();
			this.readStatusProf(p.Floccategory, this);
		},

		// onAfterRendering: function() {
		// 	this.attachRequest();
		// },

		onAfterRendering: function () {
			var g = this;
			if (sap.m.Input.prototype.onAfterRendering) {
				$(document).on('focusin', 'input', function () {
					$(this).data('val', $(this).val());
				}).on('change', 'input', function () {
					if (this.id.indexOf("superFloc") > -1) {
						g.prevFlocValue = $(this).data('val');
						g.currentFlocValue = $(this).val();

					}
				});

			}

		},

		onFlocPermitSelect: function (event) {
			var g = this;
			var path = event.getParameter("listItem").getBindingContext(g.oModelName).getPath();
			path = parseInt(path.substring(path.lastIndexOf("/") + 1));
			var fpModel = this.getView().getModel(g.oModelName);
			if (fpModel !== undefined) {
				var fpData = fpModel.getData();
				for (var i = 0; i < fpData.Permits.length; i++) {
					if (path === i) {
						fpData.PermitLt = fpData.Permits[i].PermitLt;
						fpModel.setData(fpData);
						break;
					}
				}
			}
		},
		attachModelEventHandlers: function (oModel) {
			oModel.attachPropertyChange(this.handlePropertyChanged, this);
		},

		handlePropertyChanged: function () {
			this.oModelUpdateFlag = true;
		},

		valueHelpFunSelect: function (oEvent) {
			var sPath = oEvent.getSource().getBindingInfo("value").binding.sPath;

			if (sPath.indexOf("/Floccategory") !== -1) {
				ValueHelpRequest.valueHelpFunFlocCat(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Strucindicator") !== -1) {
				ValueHelpRequest.valueHelpFunStrInd(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/SupFunctionallocation") !== -1) {
				ValueHelpRequest.valueHelpFunSupFloc(oEvent, this);
			} else if (sPath.indexOf("/StsmEqui") !== -1) {
				ValueHelpRequest.valueHelpFunStatProf(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/UstwEqui") !== -1) {
				ValueHelpRequest.valueHelpFunStatus(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/UswoEqui") !== -1) {
				ValueHelpRequest.valueHelpFunStatusWO(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/TechnicalObjectTyp") !== -1) {
				ValueHelpRequest.valueHelpFunTechObj(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Maintplant") !== -1) {
				ValueHelpRequest.valueHelpFunMaintPlant(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/Location") !== -1) {
				ValueHelpRequest.valueHelpFunLocation(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Abckz") !== -1) {
				ValueHelpRequest.valueHelpFunAbcInd(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Arbpl") !== -1) {
				ValueHelpRequest.valueHelpFunWc(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/BeberFl") !== -1) {
				ValueHelpRequest.valueHelpFunPlantSec(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Bukrs") !== -1) {
				ValueHelpRequest.valueHelpFunCompCode(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Kostl") !== -1) {
				ValueHelpRequest.valueHelpFunCostCenter(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Werks") !== -1) {
				ValueHelpRequest.valueHelpFunPlanPlant(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Ingrp") !== -1) {
				ValueHelpRequest.valueHelpFunPlGrp(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/MainArbpl") !== -1) {
				ValueHelpRequest.valueHelpFunMainWc(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/ConstrType") !== -1) {
				ValueHelpRequest.ConstrTypeVH(this, oEvent); //valueHelpFunConstType(this);
			} else if (sPath.indexOf("/RefPosta") !== -1) {
				ValueHelpRequest.valueHelpFunCntry(oEvent, this);
			} else if (sPath.indexOf("/Langucode") !== -1) {
				ValueHelpRequest.valueHelpFunLang(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Title") !== -1) {
				ValueHelpRequest.valueHelpFunTitle(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/TimeZone") !== -1) {
				ValueHelpRequest.valueHelpFunTimeZone(oEvent, this);
			} else if (sPath.indexOf("/Region") !== -1) {
				ValueHelpRequest.valueHelpFunRegion(oEvent, this);
			}
		},

		flocCatChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().FlocCategoryDesc = "";
			}
			oEvent.getSource().setValueState("None");
		},

		StructureIndicatorChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Strucindicator = "";
				oEvent.getSource().getModel(g.oModelName).getData().StrucIndicatorDesc = "";
				oEvent.getSource().getModel(g.oModelName).getData().EditMask = "";
				oEvent.getSource().getModel(g.oModelName).getData().Hierarchy = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Maintplant = "";
				// oEvent.getSource().getModel(g.oModelName).getData().MaintplantDesc = "";
				oEvent.getSource().getModel(g.oModelName).getData().Location = "";
				oEvent.getSource().getModel(g.oModelName).getData().Locationdesc = "";
				oEvent.getSource().getModel(g.oModelName).getData().Abckz = "";
				oEvent.getSource().getModel(g.oModelName).getData().Abctx = "";
				oEvent.getSource().getModel(g.oModelName).getData().Bukrs = "";
				oEvent.getSource().getModel(g.oModelName).getData().Butxt = "";
				oEvent.getSource().getModel(g.oModelName).getData().City = "";
				oEvent.getSource().getModel(g.oModelName).getData().Kostl = "";
				oEvent.getSource().getModel(g.oModelName).getData().Mctxt = "";
				oEvent.getSource().getModel(g.oModelName).getData().Kokrs = "";
				oEvent.getSource().getModel(g.oModelName).getData().Werks = "";
				oEvent.getSource().getModel(g.oModelName).getData().Planningplantdes = "";
				oEvent.getSource().getModel(g.oModelName).getData().Ingrp = "";
				oEvent.getSource().getModel(g.oModelName).getData().Innam = "";
				oEvent.getSource().getModel(g.oModelName).getData().MainArbpl = "";
				oEvent.getSource().getModel(g.oModelName).getData().MainKtext = "";
				oEvent.getSource().getModel(g.oModelName).getData().MainWerks = "";
				// oEvent.getSource().getModel(g.oModelName).getData().SupFunctionallocation = "";
				// oEvent.getSource().getModel(g.oModelName).getData().SupFlocdescription = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onStrChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
			} else {
				var sFunctionalLocation = oEvent.getSource().getModel(g.oModelName).getData().Functionallocation;
				if (sFunctionalLocation === "" || sFunctionalLocation === undefined) {
					oEvent.getSource().setValue("");
					this.invokeMessage(this.getResourceBundle().getText("functionalLocationMand"));
				} else {
					oEvent.getSource().setValue(sValue.toUpperCase());
					ValueHelpRequest._changeStrIndicator(oEvent.getSource().getModel(g.oModelName).getData(), g);
				}
			}
		},

		SupflocChange: function (oEvent) {
			oEvent.getSource().setValueState("None");
		},

		onSupFlocChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				// if (g.getView().getModel("SUP_FLOC_DATA")) {
				// 	var mSupFlocModel = sap.ui.getCore().getModel("SUP_FLOC_DATA");
				// 	var mSupFlocData = mSupFlocModel.getData();
				// 	var mSupFlocIndex;
				// 	for (var a = 0; a < mSupFlocData.length; a++) {
				// 		if (oEvent.getSource().getModel(g.oModelName).getData().Functionallocation === mSupFlocData[a].Functionallocation) {
				// 			mSupFlocIndex = a;
				// 			break;
				// 		}
				// 	}
				// 	var localModel = g.getView().getModel(g.oModelName);
				// 	var localData = localModel.getData();
				// 	var sSupFlocData = g.getView().getModel("SUP_FLOC_DATA").getData()[0];
				// 	if (sSupFlocData) {
				// 		// localData.Maintplant = localData.Maintplant === sSupFlocData.Maintplant ? "" : localData.Maintplant;
				// 		// localData.MaintplantDesc = localData.MaintplantDesc === sSupFlocData.MaintplantDesc ? "" : localData.MaintplantDesc;
				// 		// localData.Location = localData.Location === sSupFlocData.Location ? "" : localData.Location;
				// 		// localData.Locationdesc = localData.Locationdesc === sSupFlocData.Locationdesc ? "" : localData.Locationdesc;
				// 		// localData.BeberFl = localData.BeberFl === sSupFlocData.BeberFl ? "" : localData.BeberFl;
				// 		// localData.Fing = localData.Fing === sSupFlocData.Fing ? "" : localData.Fing;
				// 		// localData.Tele = localData.Tele === sSupFlocData.Tele ? "" : localData.Tele;
				// 		// localData.Arbpl = localData.Arbpl === sSupFlocData.Arbpl ? "" : localData.Arbpl;
				// 		// localData.Ktext = localData.Ktext === sSupFlocData.Ktext ? "" : localData.Ktext;
				// 		// localData.WcWerks = localData.WcWerks === sSupFlocData.WcWerks ? "" : localData.WcWerks;
				// 		// localData.Abckz = localData.Abckz === sSupFlocData.Abckz ? "" : localData.Abckz;
				// 		// localData.Abctx = localData.Abctx === sSupFlocData.Abctx ? "" : localData.Abctx;
				// 		// localData.Bukrs = localData.Bukrs === sSupFlocData.Bukrs ? "" : localData.Bukrs;
				// 		// localData.Butxt = localData.Butxt === sSupFlocData.Butxt ? "" : localData.Butxt;
				// 		// localData.City = localData.City === sSupFlocData.City ? "" : localData.City;
				// 		// localData.Kostl = localData.Kostl === sSupFlocData.Kostl ? "" : localData.Kostl;
				// 		// localData.Kokrs = localData.Kokrs === sSupFlocData.Kokrs ? "" : localData.Kokrs;
				// 		// localData.Mctxt = localData.Mctxt === sSupFlocData.Mctxt ? "" : localData.Mctxt;
				// 		// localData.Werks = localData.Werks === sSupFlocData.Werks ? "" : localData.Werks;
				// 		// localData.Planningplantdes = localData.Planningplantdes === sSupFlocData.Planningplantdes ? "" : localData.Planningplantdes;
				// 		// localData.Ingrp = localData.Ingrp === sSupFlocData.Ingrp ? "" : localData.Ingrp;
				// 		// localData.Innam = localData.Innam === sSupFlocData.Innam ? "" : localData.Innam;
				// 		// localData.MainArbpl = localData.MainArbpl === sSupFlocData.MainArbpl ? "" : localData.MainArbpl;
				// 		// localData.MainKtext = localData.MainKtext === sSupFlocData.MainKtext ? "" : localData.MainKtext;
				// 		// localData.MainWerks = localData.MainWerks === sSupFlocData.MainWerks ? "" : localData.MainWerks;

				// 		// if (localData.Maintplant === "") {
				// 		// 	localData.MaintplantEnabled = true;
				// 		// }
				// 		// if (localData.Bukrs === "") {
				// 		// 	localData.BukrsEnabled = true;
				// 		// }

				// 		localData.Title = "";
				// 		localData.TitleCode = "";
				// 		localData.Name1 = "";
				// 		localData.Name2 = "";
				// 		localData.Name3 = "";
				// 		localData.Name4 = "";
				// 		localData.Sort1 = "";
				// 		localData.Sort2 = "";
				// 		localData.NameCo = "";
				// 		localData.PostCod1 = "";
				// 		localData.City1 = "";
				// 		localData.Building = "";
				// 		localData.Floor = "";
				// 		localData.Roomnum = "";
				// 		localData.Strsuppl1 = "";
				// 		localData.Strsuppl2 = "";
				// 		localData.Strsuppl3 = "";
				// 		localData.AddrLocation = "";
				// 		localData.RefPosta = "";
				// 		localData.Landx = "";
				// 		localData.TimeZone = "";
				// 		localData.Region = "";
				// 		localData.RegionDesc = "";
				// 		localData.RefPostaLblReq = false;

				// 		var mAddressModel = sap.ui.getCore().getModel("flocAddressView");
				// 		var mAddressData = mAddressModel.getData();
				// 		for (var as = 0; as < mAddressData.length; as++) {
				// 			if (oEvent.getSource().getModel(g.oModelName).getData().Functionallocation === mAddressData[as].Functionallocation) {
				// 				mAddressData.splice(as, 1);
				// 				mAddressModel.setData(mAddressData);
				// 				break;
				// 			}
				// 		}

				// 		var sAddressModel = g.getView().getModel("flocAddressView");
				// 		var sAddressData = sAddressModel.getData();
				// 		sAddressData.enabled = true;
				// 		sAddressModel.setData(sAddressData);

				// 		mSupFlocData.splice(mSupFlocIndex, 1);
				// 		mSupFlocModel.setData(mSupFlocData);
				// 	}
				// }

				this.openDoiView(sValue);
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().SupFlocdescription = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());

				var sExistFlag = false;
				var sSupFunctionallocation = sValue.toUpperCase();
				var sStrucindicator = oEvent.getSource().getModel(g.oModelName).getData().Strucindicator;
				var AIWModel = sap.ui.getCore().getModel(g.oModelName);
				var oAIWData = AIWModel.getData();

				for (var i = 0; i < oAIWData.length; i++) {
					if (sSupFunctionallocation === oAIWData[i].Functionallocation) {
						oEvent.getSource().getModel(g.oModelName).getData().SupFlocdescription = oAIWData[i].Flocdescription;
						sExistFlag = true;
						break;
					}
				}

				if (sExistFlag && sStrucindicator) {
					var supFlocDesc = oEvent.getSource().getModel(g.oModelName).getData().SupFlocdescription;
					this.readSupFlocDetails(sSupFunctionallocation, "SUP", supFlocDesc);
				} else {
					ValueHelpRequest._changeSupFunctionalLocation(oEvent.getSource().getModel(g.oModelName).getData(), g);
				}
			}
		},

		readSupFlocDetails: function (pFunctionallocation, supflag, supFlocDesc) {
			var g = this;
			var sPath = "/ChangeRequestSet";
			var oModel = g.getView().getModel();
			var oMainModel = g.getView().getModel("mainView");
			var oMainData = oMainModel.getData();
			var oAIWModel = sap.ui.getCore().getModel(g.oModelName);
			var oLocalModel = g.getView().getModel(g.oModelName);
			var sFunctionalLocation = oLocalModel.getData().Functionallocation;
			var sArray = [];
			var currentHeader = {};
			var currentLAM = {};
			var currentAddr = {};
			var currentIntlAddr = [];

			var sPayload = {
				"ChangeRequestType": "AIWEAM0P",
				"CrDescription": "",
				"Reason": "01",
				"DeriveData": true,
				"FuncLoc": [],
				"FLAddr": [],
				"FLAddrI": [],
				"FLALTLBEL": [],
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
				"OLVal": [],
				"Messages": [],
				"FLDOI": [],
				"FLLAMCH": []
			};

			var AIWFLOCModel = sap.ui.getCore().getModel(g.oModelName).getData();
			if (AIWFLOCModel.length > 0) {
				for (var a = 0; a < AIWFLOCModel.length; a++) {
					if (AIWFLOCModel[a].Functionallocation === "" || AIWFLOCModel[a].Functionallocation === undefined) {
						return;
					}
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
						"Workcenterdesc": AIWFLOCModel[a].Ktext, // Plant Work Center
						"Wergwfloc": AIWFLOCModel[a].WcWerks, // Name
						"Gewrkfloc": AIWFLOCModel[a].MainArbpl, // Main Work Center
						"MainWcDesc": AIWFLOCModel[a].MainKtext, // Work center Plant
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
						"Adrnr": AIWFLOCModel[a].Adrnr,
						"Adrnri": AIWFLOCModel[a].Adrnri,
						"Deact": AIWFLOCModel[a].Deact,
						"Alkey": AIWFLOCModel[a].Alkey,
						Modeldesc: AIWFLOCModel[a].Modeldesc,
						Modelref: AIWFLOCModel[a].Modelref,
						Modelrver: AIWFLOCModel[a].Modelrver,
						Modelext: AIWFLOCModel[a].Modelext,
						Modelname: AIWFLOCModel[a].Modelname,
						Modelver: AIWFLOCModel[a].Modelver,
					};

					if (supflag && sFunctionalLocation === AIWFLOCModel[a].Functionallocation) { // DOI
						currentHeader = AIWFLOCModel[a];
						sFuncLoc.IsDOI = true;
					} else if (sFunctionalLocation === AIWFLOCModel[a].Functionallocation && sFunctionalLocation.indexOf("-") > -1) {
						currentHeader = AIWFLOCModel[a];
						sFuncLoc.IsDOI = true;
						supflag = "SUP";
						var tempI = sFunctionalLocation.lastIndexOf("-");
						var tempSupFL = sFunctionalLocation.substring(0, tempI)
						sFuncLoc.Tplma = tempSupFL;
					}

					var aFLDOI = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
					if (aFLDOI && aFLDOI.length > 0) {
						var aDOIFields = aFLDOI[a].DOI;
						// sFuncLoc.Begrui = aDOIFields[0].instLoc ? "H" : "D";
						sFuncLoc.Swerki = aDOIFields[0].instLoc ? "H" : (aDOIFields[0].maintenance ? "D" : "");
						sFuncLoc.Storti = aDOIFields[1].instLoc ? "H" : (aDOIFields[1].maintenance ? "D" : "");
						// sFuncLoc.Msgrpi = aDOIFields[3].instLoc ? "H" : "D";
						sFuncLoc.Beberi = aDOIFields[2].instLoc ? "H" : (aDOIFields[2].maintenance ? "D" : "");
						sFuncLoc.Ppsidi = aDOIFields[3].instLoc ? "H" : (aDOIFields[3].maintenance ? "D" : "");
						sFuncLoc.Abckzi = aDOIFields[4].instLoc ? "H" : (aDOIFields[4].maintenance ? "D" : "");
						sFuncLoc.Bukrsi = aDOIFields[5].instLoc ? "H" : (aDOIFields[5].maintenance ? "D" : "");
						// sFuncLoc.Gsberi = aDOIFields[8].instLoc ? "H" : "D";
						// sFuncLoc.Anlnri = aDOIFields[9].instLoc ? "H" : "D";
						// sFuncLoc.Anlnri = aDOIFields[10].instLoc ? "H" : "D";
						sFuncLoc.Kostli = aDOIFields[6].instLoc ? "H" : (aDOIFields[6].maintenance ? "D" : "");
						sFuncLoc.Kokrsi = aDOIFields[7].instLoc ? "H" : (aDOIFields[7].maintenance ? "D" : "");
						// sFuncLoc.Proidi = aDOIFields[13].instLoc ? "H" : "D";
						// sFuncLoc.Daufni = aDOIFields[14].instLoc ? "H" : "D";
						// sFuncLoc.Aufnri = aDOIFields[15].instLoc ? "H" : "D";
						sFuncLoc.Iwerki = aDOIFields[8].instLoc ? "H" : (aDOIFields[8].maintenance ? "D" : "");
						sFuncLoc.Ingrpi = aDOIFields[9].instLoc ? "H" : (aDOIFields[9].maintenance ? "D" : "");
						sFuncLoc.Lgwidi = aDOIFields[10].instLoc ? "H" : (aDOIFields[10].maintenance ? "D" : "");
						// sFuncLoc.Swerki = aDOIFields[19].instLoc ? "H" : "D";
						// sFuncLoc.RbnrI = aDOIFields[20].instLoc ? "H" : "D";
						// sFuncLoc.Submti = aDOIFields[21].instLoc ? "H" : "D";
						// sFuncLoc.Einzli = aDOIFields[22].instLoc ? "H" : "D";
						// sFuncLoc.Iequii = aDOIFields[23].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[24].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[25].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[26].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[27].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[28].instLoc ? "H" : "D";
						sFuncLoc.Adrnri = aDOIFields[12].instLoc ? "H" : (aDOIFields[12].maintenance ? "D" : "");
					}

					if (AIWFLOCModel[a].viewParameter === "create") {
						sFuncLoc.Type = true;
					}
					sPayload.FuncLoc.push(sFuncLoc);

					if ((AIWFLOCModel[a].Title !== "" && AIWFLOCModel[a].Title !== undefined) || (AIWFLOCModel[a].TitleCode !== "" && AIWFLOCModel[a]
							.TitleCode !== undefined) || (AIWFLOCModel[a].Name1 !== "" && AIWFLOCModel[a].Name1 !== undefined) || (AIWFLOCModel[a].Name2 !==
							"" && AIWFLOCModel[a].Name2 !== undefined) || (AIWFLOCModel[a].Name3 !== "" && AIWFLOCModel[a].Name3 !== undefined) ||
						(AIWFLOCModel[a].Name4 !== "" && AIWFLOCModel[a].Name4 !== undefined) || (AIWFLOCModel[a].Sort1 !== "" && AIWFLOCModel[a].Sort1 !==
							undefined) || (AIWFLOCModel[a].Sort2 !== "" && AIWFLOCModel[a].Sort2 !== undefined) || (AIWFLOCModel[a].NameCo !== "" &&
							AIWFLOCModel[a].NameCo !== undefined) || (AIWFLOCModel[a].PostCod1 !== "" &&
							AIWFLOCModel[a].PostCod1 !== undefined) || (AIWFLOCModel[a].City1 !== "" && AIWFLOCModel[a].City1 !== undefined) ||
						(AIWFLOCModel[a].Building !== "" && AIWFLOCModel[a].Building !== undefined) ||
						(AIWFLOCModel[a].Floor !== "" && AIWFLOCModel[a].Floor !== undefined) || (AIWFLOCModel[a].Roomnum !== "" && AIWFLOCModel[a].Roomnum !==
							undefined) || (AIWFLOCModel[a].AddrLocation !== "" && AIWFLOCModel[a].AddrLocation !== undefined) || (AIWFLOCModel[a].Strsuppl1 !==
							"" && AIWFLOCModel[a].Strsuppl1 !== undefined) || (AIWFLOCModel[a].Strsuppl2 !== "" && AIWFLOCModel[a].Strsuppl2 !== undefined) ||
						(AIWFLOCModel[a].Strsuppl3 !== "" && AIWFLOCModel[a].Strsuppl3 !== undefined) || (AIWFLOCModel[a].TimeZone !== "" &&
							AIWFLOCModel[a].TimeZone !== undefined) || (AIWFLOCModel[a].RefPosta !== "" && AIWFLOCModel[a].RefPosta !== undefined) || (
							AIWFLOCModel[a].Region !== "" && AIWFLOCModel[a].Region !== undefined)) {
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

						if (supflag && AIWFLOCModel[a].Functionallocation === sFunctionalLocation) { //For DOI
							currentAddr = sFLAddr;
						}
					}

					var aIntlAddr = AIWFLOCModel[a].intlAddr;
					if (aIntlAddr.length > 0) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							aIntlAddr[z].Funcloc = AIWFLOCModel[a].Functionallocation;
							sPayload.FLAddrI.push(aIntlAddr[z]);
						}

						if (supflag && AIWFLOCModel[a].Functionallocation === sFunctionalLocation) { //For DOI
							currentIntlAddr = sPayload.FLAddrI;
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

					if (AIWFLOCModel[a].lam) {
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
							"MrkrUnit": AIWFLOCModel[a].lam.MrkrUnit,
							"LamDer": AIWFLOCModel[a].lam.LamDer
						};
					}

					if (sFLLAM) {
						if (pFunctionallocation && AIWFLOCModel[a].Functionallocation === sFunctionalLocation) {
							currentLAM = sFLLAM;
							sFLLAM.LamDer = "D";
						}
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

					var aFLLinChar = AIWFLOCModel[a].linearChar;
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Funcloc = AIWFLOCModel[a].Functionallocation;
								sPayload.FLLAMCH.push(alinearChar[c]);
							}
						}
					}

				}
			}

			var fnSuccess = function (r) {
				if (r.Messages.results.length > 0) {
					var oMessageList = [];
					for (var e = 0; e < r.Messages.results.length; e++) {
						oMessageList.push({
							type: formatter.getMessageType(r.Messages.results[e].Type),
							title: r.Messages.results[e].Message
						});
					}
					g.createMessagePopover(oMessageList, "");
					oMainData.viewBusy = false;
					oMainModel.setData(oMainData);
					return;
				}
				if (r.FuncLoc.results.length > 0) {
					for (var i = 0; i < r.FuncLoc.results.length; i++) {
						var h = r.FuncLoc.results[i];
						var sModelData = {
							intlAddr: [],
							altlbl: [],
							classItems: [],
							characteristics: [],
							linearChar: [],
							FunctionallocationVS: "None",
							FunctionallocationVST: "",
							FlocdescriptionVS: "None",
							FlocdescriptionVST: "",
							StrucindicatorVS: "None",
							StrucindicatorVST: "",
							FloccategoryVS: "None",
							FloccategoryVST: "",
							SupFunctionallocationVS: "None",
							SupFunctionallocationVST: "",
							MaintplantVS: "None",
							MaintplantVST: "",
							StsmEquiVS: "None",
							StsmEquiVST: "",
							UstwEquiVS: "None",
							UstwEquiVST: "",
							UswoEquiVS: "None",
							UswoEquiVST: "",
							TechnicalObjectTypVS: "None",
							TechnicalObjectTypVST: "",
							LocationVS: "None",
							LocationVST: "",
							AbckzVS: "None",
							AbckzVST: "",
							MainArbplVS: "None",
							MainArbplVST: "",
							BeberFlVS: "None",
							BeberFlVST: "",
							BukrsVS: "None",
							BukrsVST: "",
							KostlVS: "None",
							KostlVST: "",
							WerksVS: "None",
							WerksVST: "",
							IngrpVS: "None",
							IngrpVST: "",
							ArbplVS: "None",
							ArbplVST: "",
							ConstrTypeVS: "None",
							ConstrTypeVST: "",
							RefPostaVS: "None",
							RefPostaVST: "",
							LangucodeVS: "None",
							LangucodeVST: "",
							TimeZoneVS: "None",
							TimeZoneVST: "",

							TplnrEnabled: true,
							FunctionalLocEnabled: true,
							FlocCatEnabled: true,
							StrucIndEnabled: true,
							MaintplantEnabled: true,
							BukrsEnabled: true
						};
						sModelData.Functionallocation = h.Tplnr;
						sModelData.Flocdescription = h.Txtmi;
						sModelData.EditMask = h.EditMask;
						sModelData.Hierarchy = h.Hierarchy;
						sModelData.Floccategory = h.Fltyp;
						sModelData.FlocCategoryDesc = h.Flttx;
						sModelData.Strucindicator = h.TplkzFlc;
						sModelData.StrucIndicatorDesc = h.Tplxt;
						sModelData.SupFunctionallocation = h.Tplma; // Sup FuncLoc
						sModelData.SupFlocdescription = h.Supflocdesc; // Sup FlocDescription
						sModelData.Stattext = h.Stattext; // System Status
						sModelData.StsmEqui = h.StsmFloc; // Status Profile
						sModelData.StsmEquiDesc = h.Statproftxt; // Status Profile Description
						sModelData.UstwEqui = h.UstwFloc; // Status with Status Number
						sModelData.UswoEqui = h.UswoFloc; // Status without Status Number
						sModelData.UstaEqui = h.UstaFloc; // User Status
						sModelData.TechnicalObjectTyp = h.Eqart; // TechnicalObjectTyp
						sModelData.Description = h.Eartx; // TechnicalObjectTyp Description
						sModelData.Maintplant = h.Swerk;
						sModelData.MaintplantDesc = h.Plantname;
						sModelData.Location = h.StorFloc; // Location
						sModelData.Locationdesc = h.Locationdesc; // Location Description
						sModelData.BeberFl = h.BeberFl; // Plant Section
						sModelData.Fing = h.Fing; // Person responsible
						sModelData.Tele = h.Tele; // Phone
						sModelData.Arbpl = h.Arbplfloc; // Work Center
						sModelData.Ktext = h.Workcenterdesc; // Work Center Description
						sModelData.WcWerks = h.Wergwfloc; // Work center Plant
						sModelData.MainArbpl = h.Gewrkfloc; // Main Work Center
						sModelData.MainKtext = h.MainWcDesc; // Plant Work Center
						sModelData.MainWerks = h.MainWcPlant; // Name
						sModelData.Abckz = h.Abckzfloc;
						sModelData.Abctx = h.Abctx;
						sModelData.Bukrs = h.Bukrsfloc;
						sModelData.Butxt = h.Butxt;
						sModelData.City = h.City;
						sModelData.Kostl = h.KostFloc; // Cost Center
						sModelData.Kokrs = h.KokrFloc; // ccPart1
						sModelData.Mctxt = h.Contareaname; // Name
						sModelData.Werks = h.PlntFloc; // Planning Plant
						sModelData.Planningplantdes = h.Planningplantdes; // Planning Plant Description
						sModelData.Ingrp = h.Ingrp; // Planner Group
						sModelData.Innam = h.Plannergrpdesc; // Planner Group Description
						sModelData.ConstrType = h.Submtiflo; // Construction Type
						sModelData.ConstructionDesc = h.Constdesc; // Construction Description
						sModelData.menuAction = h.IsMenu;
						sModelData.Adrnr = h.Adrnr;
						sModelData.Adrnri = h.Adrnri;
						sModelData.Deact = h.Deact;
						sModelData.Alkey = h.Alkey;
						sModelData.Altxt = h.Altxt;
						sModelData.Modeldesc = h.Modeldesc;
						sModelData.Modelref = h.Modelref;
						sModelData.Modelrver = h.Modelrver;
						sModelData.Modelext = h.Modelext;
						sModelData.Modelname = h.Modelname;
						sModelData.Modelver = h.Modelver;

						if (supflag && sModelData.Functionallocation === sFunctionalLocation) { //For DOI
							g.flHeader = r.FuncLoc.results[i];
							sModelData.Maintplant = currentHeader.Maintplant;
							sModelData.MaintplantDesc = currentHeader.MaintplantDesc;
							sModelData.Bukrs = currentHeader.Bukrs;
							sModelData.Butxt = currentHeader.Butxt;
							sModelData.Location = currentHeader.Location; // Location
							sModelData.Locationdesc = currentHeader.Locationdesc; // Location Description
							sModelData.Abckz = currentHeader.Abckz;
							sModelData.Abctx = currentHeader.Abctx;
							sModelData.Kostl = currentHeader.Kostl; // Cost Center
							sModelData.Kokrs = currentHeader.Kokrs; // ccPart1
							sModelData.Mctxt = currentHeader.Mctxt; // Name
							sModelData.Werks = currentHeader.Werks; // Planning Plant
							sModelData.Planningplantdes = currentHeader.Planningplantdes; // Planning Plant Description
							sModelData.Ingrp = currentHeader.Ingrp; // Planner Group
							sModelData.Innam = currentHeader.Innam; // Planner Group Description
							sModelData.MainArbpl = currentHeader.MainArbpl; // Main Work Center
							sModelData.MainKtext = currentHeader.MainKtext; // Plant Work Center
							sModelData.MainWerks = currentHeader.MainWerks; // Name
							sModelData.BeberFl = currentHeader.BeberFl; // Plant Section
							sModelData.Fing = currentHeader.Fing; // Plant Section
							sModelData.Tele = currentHeader.Tele; // Plant Section
							sModelData.Stattext = currentHeader.Stattext;
						}

						if (h.Type === true) {
							sModelData.viewParameter = "create";
						}
						if (h.Type === false) {
							sModelData.viewParameter = "change";
							if (sModelData.Floccategory === "" || sModelData.Floccategory === undefined) {
								sModelData.FlocCatEnabled = true;
							} else {
								sModelData.FlocCatEnabled = false;
							}
							if (sModelData.Strucindicator === "" || sModelData.Strucindicator === undefined) {
								sModelData.StrucIndEnabled = true;
							} else {
								sModelData.StrucIndEnabled = false;
							}
							sModelData.FunctionalLocEnabled = false;
						}

						if (h.Swerk !== "") {
							// sModelData.MaintplantEnabled = false;
							sModelData.BukrsEnabled = false;
						} else {
							sModelData.MaintplantEnabled = true;
							sModelData.BukrsEnabled = true;
						}

						if (r.FLLAM.results.length > 0) {
							var aFlLam = r.FLLAM.results;
							for (var x = 0; x < aFlLam.length; x++) {
								if (aFlLam[x].Funcloc === sModelData.Functionallocation) {
									////////////// Superior FLOC has LAM data - start /////////////////////
									// if (pFunctionallocation && sModelData.Functionallocation === sFunctionalLocation && sModelData.Floccategory === "L" && g.lamSwitch ===
									// 	"X") {
									// 	sModelData.lam = currentLAM;
									// 	var tempIndex = x;
									// 	var sMsg = "Superior object has been changed. Do you want to copy linear data from superior object?";
									// 	sap.m.MessageBox.confirm(sMsg, {
									// 		title: "Confirmation",
									// 		onClose: function (oAction) {
									// 			if (oAction === "OK") {
									// 				var oFLLAM = {
									// 					"Funcloc": aFlLam[tempIndex].Funcloc,
									// 					"Lrpid": aFlLam[tempIndex].Lrpid,
									// 					"LrpidDesc": aFlLam[tempIndex].LrpDescr,
									// 					"Strtptatr": aFlLam[tempIndex].Strtptatr,
									// 					"Endptatr": aFlLam[tempIndex].Endptatr,
									// 					"Length": parseInt(aFlLam[tempIndex].Length !== "" ? aFlLam[tempIndex].Length : "0"),
									// 					"LinUnit": aFlLam[tempIndex].LinUnit,
									// 					"LinUnitDesc": aFlLam[tempIndex].Uomtext,
									// 					"Startmrkr": aFlLam[tempIndex].Startmrkr,
									// 					"Endmrkr": aFlLam[tempIndex].Endmrkr,
									// 					"Mrkdisst": aFlLam[tempIndex].Mrkdisst,
									// 					"Mrkdisend": aFlLam[tempIndex].Mrkdisend,
									// 					"MrkrUnit": aFlLam[tempIndex].MrkrUnit,
									// 					"LamDer": aFlLam[tempIndex].LamDer
									// 				};
									// 				var mLocalModel = g.getView().getModel(g.oModelName);
									// 				var sMdlData = mLocalModel.getData();
									// 				sMdlData.lam = oFLLAM;
									// 				mLocalModel.setData(sMdlData);
									// 				g.lam.setModel(mLocalModel, "AIWLAM");
									// 			}
									// 		}
									// 	});
									// 	break;
									// }
									////////////// Superior FLOC has LAM data - end /////////////////////
									var oFLLAM = {
										"Funcloc": aFlLam[x].Funcloc,
										"Lrpid": aFlLam[x].Lrpid,
										"LrpidDesc": aFlLam[x].LrpDescr,
										"Strtptatr": aFlLam[x].Strtptatr,
										"Endptatr": aFlLam[x].Endptatr,
										"Length": aFlLam[x].Length,
										"LinUnit": aFlLam[x].LinUnit,
										"LinUnitDesc": aFlLam[x].Uomtext,
										"Startmrkr": aFlLam[x].Startmrkr,
										"Endmrkr": aFlLam[x].Endmrkr,
										"Mrkdisst": aFlLam[x].Mrkdisst,
										"Mrkdisend": aFlLam[x].Mrkdisend,
										"MrkrUnit": aFlLam[x].MrkrUnit
									};
									sModelData.lam = oFLLAM;
									break;
								}
							}
						}

						if (supflag && sModelData.Functionallocation === sFunctionalLocation && sModelData.Floccategory === "L") {
							sModelData.lam = currentLAM;

							if (r.FLLAM.results.length > 0) {
								g.flLAM = r.FLLAM.results;
							}
						}

						if (r.FLAddr) {
							if (r.FLAddr.results) {
								var sAddress = r.FLAddr.results;
								if (sAddress) {
									if (sAddress.length > 0) {
										for (var j = 0; j < sAddress.length; j++) {
											if (sModelData.Functionallocation === sAddress[j].Funcloc) {
												var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
												var oAddressData = oAddressModel.getData();
												var mCountFlag = true;
												var sObj, sMatchIndex;
												if (oAddressData.length > 0) {
													for (var sa = 0; sa < oAddressData.length; sa++) {
														if (sModelData.Functionallocation === oAddressData[sa].Functionallocation) {
															mCountFlag = false;
															sMatchIndex = sa;
															break;
														}
													}
												}
												if (mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
													sObj = {
														Functionallocation: sModelData.Functionallocation,
														IsEditable: sAddress[j].IsEditable
													};
													oAddressData.push(sObj);
													oAddressModel.setData(oAddressData);
												}
												if (!mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
													oAddressData[sMatchIndex].Functionallocation = sModelData.Functionallocation;
													oAddressData[sMatchIndex].IsEditable = sAddress[j].IsEditable; //sModelData.IsEditable;
													oAddressModel.setData(oAddressData);
												}

												sModelData.IsEditable = sAddress[j].IsEditable;
												sModelData.Title = sAddress[j].Titletxt ? sAddress[j].Titletxt : "";
												sModelData.TitleCode = sAddress[j].Title ? sAddress[j].Title : "";
												sModelData.Name1 = sAddress[j].Name1 ? sAddress[j].Name1 : "";
												sModelData.Name2 = sAddress[j].Name2 ? sAddress[j].Name2 : "";
												sModelData.Name3 = sAddress[j].Name3 ? sAddress[j].Name3 : "";
												sModelData.Name4 = sAddress[j].Name4 ? sAddress[j].Name4 : "";
												sModelData.Sort1 = sAddress[j].Sort1 ? sAddress[j].Sort1 : "";
												sModelData.Sort2 = sAddress[j].Sort2 ? sAddress[j].Sort2 : "";
												sModelData.NameCo = sAddress[j].NameCo ? sAddress[j].NameCo : "";
												sModelData.PostCod1 = sAddress[j].PostCod1 ? sAddress[j].PostCod1 : "";
												sModelData.City1 = sAddress[j].City1 ? sAddress[j].City1 : "";
												sModelData.Building = sAddress[j].Building ? sAddress[j].Building : "";
												sModelData.Floor = sAddress[j].Floor ? sAddress[j].Floor : "";
												sModelData.Roomnum = sAddress[j].Roomnum ? sAddress[j].Roomnum : "";
												sModelData.Strsuppl1 = sAddress[j].Strsuppl1 ? sAddress[j].Strsuppl1 : "";
												sModelData.Strsuppl2 = sAddress[j].Strsuppl2 ? sAddress[j].Strsuppl2 : "";
												sModelData.Strsuppl3 = sAddress[j].Strsuppl3 ? sAddress[j].Strsuppl3 : "";
												sModelData.AddrLocation = sAddress[j].Location ? sAddress[j].Location : "";
												sModelData.RefPosta = sAddress[j].RPostafl ? sAddress[j].RPostafl : "";
												sModelData.Landx = sAddress[j].Landx ? sAddress[j].Landx : "";
												sModelData.TimeZone = sAddress[j].TimeZone ? sAddress[j].TimeZone : "";
												sModelData.Region = sAddress[j].RPostFl ? sAddress[j].RPostFl : "";
												sModelData.RegionDesc = sAddress[j].Regiotxt ? sAddress[j].Regiotxt : "";
											}
										}
									} else {
										sModelData.Title = sModelData.Title ? sModelData.Title : "";
										sModelData.TitleCode = sModelData.TitleCode ? sModelData.TitleCode : "";
										sModelData.Name1 = sModelData.Name1 ? sModelData.Name1 : "";
										sModelData.Name2 = sModelData.Name2 ? sModelData.Name2 : "";
										sModelData.Name3 = sModelData.Name3 ? sModelData.Name3 : "";
										sModelData.Name4 = sModelData.Name4 ? sModelData.Name4 : "";
										sModelData.Sort1 = sModelData.Sort1 ? sModelData.Sort1 : "";
										sModelData.Sort2 = sModelData.Sort2 ? sModelData.Sort2 : "";
										sModelData.NameCo = sModelData.NameCo ? sModelData.NameCo : "";
										sModelData.PostCod1 = sModelData.PostCod1 ? sModelData.PostCod1 : "";
										sModelData.City1 = sModelData.City1 ? sModelData.City1 : "";
										sModelData.Building = sModelData.Building ? sModelData.Building : "";
										sModelData.Floor = sModelData.Floor ? sModelData.Floor : "";
										sModelData.Roomnum = sModelData.Roomnum ? sModelData.Roomnum : "";
										sModelData.Strsuppl1 = sModelData.Strsuppl1 ? sModelData.Strsuppl1 : "";
										sModelData.Strsuppl2 = sModelData.Strsuppl2 ? sModelData.Strsuppl2 : "";
										sModelData.Strsuppl3 = sModelData.Strsuppl3 ? sModelData.Strsuppl3 : "";
										sModelData.AddrLocation = sModelData.AddrLocation ? sModelData.AddrLocation : "";
										sModelData.RefPosta = sModelData.RefPosta ? sModelData.RefPosta : "";
										sModelData.Landx = sModelData.Landx ? sModelData.Landx : "";
										sModelData.TimeZone = sModelData.TimeZone ? sModelData.TimeZone : "";
										sModelData.Region = sModelData.Region ? sModelData.Region : "";
										sModelData.RegionDesc = sModelData.RegionDesc ? sModelData.RegionDesc : "";
									}
								}
							}
						}

						if (supflag && sModelData.Functionallocation === sFunctionalLocation) {
							var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
							var oAddressData = oAddressModel.getData();
							var mCountFlag = true;
							var sObj, sMatchIndex;
							if (oAddressData.length > 0) {
								for (var sa = 0; sa < oAddressData.length; sa++) {
									if (sModelData.Functionallocation === oAddressData[sa].Functionallocation) {
										mCountFlag = false;
										sMatchIndex = sa;
										break;
									}
								}
							}
							if (mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
								sObj = {
									Functionallocation: sModelData.Functionallocation,
									IsEditable: currentAddr.IsEditable
								};
								oAddressData.push(sObj);
								oAddressModel.setData(oAddressData);
							}
							if (!mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
								oAddressData[sMatchIndex].Functionallocation = sModelData.Functionallocation;
								oAddressData[sMatchIndex].IsEditable = sModelData.IsEditable;
								oAddressModel.setData(oAddressData);
							}

							sModelData.IsEditable = currentAddr.IsEditable;
							sModelData.Title = currentAddr.Titletxt ? currentAddr.Titletxt : "";
							sModelData.TitleCode = currentAddr.Title ? currentAddr.Title : "";
							sModelData.Name1 = currentAddr.Name1 ? currentAddr.Name1 : "";
							sModelData.Name2 = currentAddr.Name2 ? currentAddr.Name2 : "";
							sModelData.Name3 = currentAddr.Name3 ? currentAddr.Name3 : "";
							sModelData.Name4 = currentAddr.Name4 ? currentAddr.Name4 : "";
							sModelData.Sort1 = currentAddr.Sort1 ? currentAddr.Sort1 : "";
							sModelData.Sort2 = currentAddr.Sort2 ? currentAddr.Sort2 : "";
							sModelData.NameCo = currentAddr.NameCo ? currentAddr.NameCo : "";
							sModelData.PostCod1 = currentAddr.PostCod1 ? currentAddr.PostCod1 : "";
							sModelData.City1 = currentAddr.City1 ? currentAddr.City1 : "";
							sModelData.Building = currentAddr.Building ? currentAddr.Building : "";
							sModelData.Floor = currentAddr.Floor ? currentAddr.Floor : "";
							sModelData.Roomnum = currentAddr.Roomnum ? currentAddr.Roomnum : "";
							sModelData.Strsuppl1 = currentAddr.Strsuppl1 ? currentAddr.Strsuppl1 : "";
							sModelData.Strsuppl2 = currentAddr.Strsuppl2 ? currentAddr.Strsuppl2 : "";
							sModelData.Strsuppl3 = currentAddr.Strsuppl3 ? currentAddr.Strsuppl3 : "";
							sModelData.AddrLocation = currentAddr.Location ? currentAddr.Location : "";
							sModelData.RefPosta = currentAddr.RPostafl ? currentAddr.RPostafl : "";
							sModelData.Landx = currentAddr.Landx ? currentAddr.Landx : "";
							sModelData.TimeZone = currentAddr.TimeZone ? currentAddr.TimeZone : "";
							sModelData.Region = currentAddr.RPostFl ? currentAddr.RPostFl : "";
							sModelData.RegionDesc = currentAddr.Regiotxt ? currentAddr.Regiotxt : "";

							if (r.FLAddr.results) {
								g.flAddr = r.FLAddr.results;
							}
						}

						var aIntlAddr = r.FLAddrI.results;
						if (aIntlAddr.length > 0) {
							for (var z = 0; z < aIntlAddr.length; z++) {
								if (aIntlAddr[z].Funcloc === sModelData.Functionallocation) {
									aIntlAddr[z].AdNationEnable = false;
									aIntlAddr[z].City1iVS = "None";
									aIntlAddr[z].StreetiVS = "None";
									sModelData.intlAddr.push(aIntlAddr[z]);
								}
							}
						}

						if (supflag && sModelData.Functionallocation === sFunctionalLocation && sModelData.intlAddr.length > 0) {
							g.flIntlAddr = sModelData.intlAddr;
							sModelData.intlAddr = currentIntlAddr;
						} else {
							g.flIntlAddr = [];
						}

						var aAltLbl = r.FLALTLBEL.results;
						if (aAltLbl.length > 0) {
							for (var y = 0; y < aAltLbl.length; y++) {
								if (aAltLbl[y].Funcloc === sModelData.Functionallocation) {
									var oAltLbl = {
										"Funcloc": h.Tplnr,
										"AltAlkey": aAltLbl[y].AltAlkey, // Labeling system
										"Altxt": aAltLbl[y].Altxt, // Labeling system descr
										"AltStrno": aAltLbl[y].AltStrno, // Alternative Label
										"AltTplkz": aAltLbl[y].AltTplkz, // Strycture Indicator
										"Tplxt": aAltLbl[y].Tplxt, // Structure Indicator Descr
										"Name1i": aAltLbl[y].Editm, // Edit Mask
										"Actvs": aAltLbl[y].Actvs, // Active
										"AltPrkey": aAltLbl[y].AltPrkey, // Primary
										"AltReuse": aAltLbl[y].AltReuse, // Reusable

										"enableLblSys": false,
										"enableAltLbl": true,
										"enableStrInd": true,

										"LblSysVS": "None",
										"AltLblVS": "None",
										"StrIndVS": "None"
									};
									sModelData.altlbl.push(oAltLbl);
								}
							}
						}

						if (r.FLClass) {
							var sClassList = r.FLClass.results;
							if (sClassList) {
								if (sClassList.length > 0) {
									for (var a = 0; a < sClassList.length; a++) {
										if (sModelData.Functionallocation === sClassList[a].Funcloc) {
											sClassList[a].ctEnable = false;
											sClassList[a].classEnable = false;
											sClassList[a].ClassTypeDesc = sClassList[a].Artxt;
											delete sClassList[a].Artxt;
											sClassList[a].ClassDesc = sClassList[a].Kltxt;
											delete sClassList[a].Kltxt;
											delete sClassList[a].Changerequestid;
											delete sClassList[a].Clint;
											delete sClassList[a].Service;
											sModelData.classItems.push(sClassList[a]);
										}
									}
									if (sModelData.Functionallocation === "") {
										var dups = [];
										sModelData.classItems = sModelData.classItems.filter(function (el) {
											// If it is not a duplicate, return true
											if (dups.indexOf(el.Classtype + el.Class + el.Funcloc) === -1) {
												dups.push(el.Classtype + el.Class + el.Funcloc);
												return true;
											}
											return false;
										});
									}
									sModelData.charNewButton = true;
									if (g.class && g.class.getId().includes("detailFloc") === true) {
										// var itemFragmentId = g.getView().createId("charFrag");
										// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
										// newCharBtn.setEnabled(true);
										g.class.setModel(new JSONModel(sModelData.classItems));
									}
								}
							}
						}

						if (r.FLVal) {
							var sCharList = r.FLVal.results;
							if (sCharList) {
								if (sCharList.length > 0) {
									for (var j = 0; j < sCharList.length; j++) {
										if (sModelData.Functionallocation === sCharList[j].Funcloc) {
											sCharList[j].cNameEnable = false;
											sCharList[j].Textbz = sCharList[j].Atwtb;
											delete sCharList[j].Ataut;
											delete sCharList[j].Ataw1;
											delete sCharList[j].Atawe;
											delete sCharList[j].Atcod;
											delete sCharList[j].Atflb;
											delete sCharList[j].Atflv;
											delete sCharList[j].Atimb;
											delete sCharList[j].Atsrt;
											delete sCharList[j].Atvglart;
											delete sCharList[j].Atzis;
											delete sCharList[j].Changerequestid;
											delete sCharList[j].CharName;
											delete sCharList[j].Charid;
											delete sCharList[j].Classtype;
											delete sCharList[j].Service;
											delete sCharList[j].Valcnt;
											sCharList[j].slNo = j + 1; // ()
											sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
											sModelData.characteristics.push(sCharList[j]);
										}
									}
									if (sModelData.Functionallocation === "") {
										var dups = [];
										sModelData.characteristics = sModelData.characteristics.filter(function (el) {
											// If it is not a duplicate, return true
											if (dups.indexOf(el.Class + el.Atnam + el.Atwrt) === -1) {
												dups.push(el.Class + el.Atnam + el.Atwrt);
												return true;
											}
											return false;
										});
									}
									for (var z = 0; z < sModelData.characteristics.length; z++) {
										var count = 1;
										for (var y = 0; y < sModelData.characteristics.length; y++) {
											if (z === y) {
												continue;
											}
											if (sModelData.characteristics[y].Atnam === sModelData.characteristics[z].Atnam && sModelData.characteristics[y].Class ===
												sModelData.characteristics[z].Class) {
												count++;
											}
										}
										if (count > 1) {
											sModelData.characteristics[z].charDltEnable = true;
										} else {
											sModelData.characteristics[z].charDltEnable = false;
										}

										if (sModelData.characteristics[z].Atein === true) {
											sModelData.characteristics[z].charAddEnable = false;
										}
									}
									if (g.char && g.char.getId().includes("detailFloc") === true) {
										g.char.setModel(new JSONModel(sModelData.characteristics));
									}
								}
							}
						}

						if (r.FLLAMCH) {
							var alinearChar = r.FLLAMCH.results;
							if (alinearChar) {
								if (alinearChar.length > 0) {
									for (var j = 0; j < alinearChar.length; j++) {
										if (sModelData.Functionallocation === alinearChar[j].Funcloc) {
											alinearChar[j].linCharEnable = true;
											sModelData.linearChar.push(alinearChar[j]);
										}
									}
									if (sModelData.Functionallocation === "") {
										var dups = [];
										sModelData.linearChar = sModelData.linearChar.filter(function (el) {
											// If it is not a duplicate, return true
											if (dups.indexOf(el.Charid + el.Atwrt) === -1) {
												dups.push(el.Charid + el.Atwrt);
												return true;
											}
											return false;
										});
									}
									// if (g.linearChar && g.linearChar.getId().includes("detailFloc") === true) {
									// 	g.linearChar.setModel(new JSONModel(sModelData.linearChar));
									// }
								}
							}
						}

						if (sModelData.UstaEqui) {
							oMainData.visible = true;
						} else {
							oMainData.visible = false;
						}
						oMainModel.setData(oMainData);
						sArray.push(sModelData);
					}
					oAIWModel.setData(sArray);

					for (var l = 0; l < oAIWModel.getData().length; l++) {
						if (sFunctionalLocation === oAIWModel.getData()[l].Functionallocation) {
							g.rowIndex = "/" + l;
							var oJsonModel = new JSONModel();
							var sCurrentObject = oAIWModel.getProperty(g.rowIndex);

							sCurrentObject.Title = sCurrentObject.Title ? sCurrentObject.Title : "";
							sCurrentObject.TitleCode = sCurrentObject.TitleCode ? sCurrentObject.TitleCode : "";
							sCurrentObject.Name1 = sCurrentObject.Name1 ? sCurrentObject.Name1 : "";
							sCurrentObject.Name2 = sCurrentObject.Name2 ? sCurrentObject.Name2 : "";
							sCurrentObject.Name3 = sCurrentObject.Name3 ? sCurrentObject.Name3 : "";
							sCurrentObject.Name4 = sCurrentObject.Name4 ? sCurrentObject.Name4 : "";
							sCurrentObject.Sort1 = sCurrentObject.Sort1 ? sCurrentObject.Sort1 : "";
							sCurrentObject.Sort2 = sCurrentObject.Sort2 ? sCurrentObject.Sort2 : "";
							sCurrentObject.NameCo = sCurrentObject.NameCo ? sCurrentObject.NameCo : "";
							sCurrentObject.PostCod1 = sCurrentObject.PostCod1 ? sCurrentObject.PostCod1 : "";
							sCurrentObject.City1 = sCurrentObject.City1 ? sCurrentObject.City1 : "";
							sCurrentObject.Building = sCurrentObject.Building ? sCurrentObject.Building : "";
							sCurrentObject.Floor = sCurrentObject.Floor ? sCurrentObject.Floor : "";
							sCurrentObject.Roomnum = sCurrentObject.Roomnum ? sCurrentObject.Roomnum : "";
							sCurrentObject.Strsuppl1 = sCurrentObject.Strsuppl1 ? sCurrentObject.Strsuppl1 : "";
							sCurrentObject.Strsuppl2 = sCurrentObject.Strsuppl2 ? sCurrentObject.Strsuppl2 : "";
							sCurrentObject.Strsuppl3 = sCurrentObject.Strsuppl3 ? sCurrentObject.Strsuppl3 : "";
							sCurrentObject.AddrLocation = sCurrentObject.AddrLocation ? sCurrentObject.AddrLocation : "";
							sCurrentObject.RefPosta = sCurrentObject.RefPosta ? sCurrentObject.RefPosta : "";
							sCurrentObject.Landx = sCurrentObject.Landx ? sCurrentObject.Landx : "";
							sCurrentObject.TimeZone = sCurrentObject.TimeZone ? sCurrentObject.TimeZone : "";
							sCurrentObject.Region = sCurrentObject.Region ? sCurrentObject.Region : "";
							sCurrentObject.RegionDesc = sCurrentObject.RegionDesc ? sCurrentObject.RegionDesc : "";

							if ((sCurrentObject.Title !== "" && sCurrentObject.Title !== undefined) || (sCurrentObject.TitleCode !== "" && sCurrentObject
									.TitleCode !== undefined) || (sCurrentObject.Name1 !== "" && sCurrentObject.Name1 !== undefined) || (sCurrentObject.Name2 !==
									"" && sCurrentObject.Name2 !== undefined) || (sCurrentObject.Name3 !== "" && sCurrentObject.Name3 !== undefined) ||
								(sCurrentObject.Name4 !== "" && sCurrentObject.Name4 !== undefined) ||
								(sCurrentObject.Sort1 !== "" && sCurrentObject.Sort1 !== undefined) || (sCurrentObject.Sort2 !== "" && sCurrentObject.Sort2 !==
									undefined) || (sCurrentObject.NameCo !== "" && sCurrentObject.NameCo !== undefined) || (sCurrentObject.PostCod1 !== "" &&
									sCurrentObject.PostCod1 !== undefined) || (sCurrentObject.City1 !== "" && sCurrentObject.City1 !== undefined) ||
								(sCurrentObject.Building !== "" && sCurrentObject.Building !== undefined) ||
								(sCurrentObject.Floor !== "" && sCurrentObject.Floor !== undefined) || (sCurrentObject.Roomnum !== "" && sCurrentObject.Roomnum !==
									undefined) || (sCurrentObject.AddrLocation !== "" && sCurrentObject.AddrLocation !== undefined) || (sCurrentObject.Strsuppl1 !==
									"" && sCurrentObject.Strsuppl1 !== undefined) || (sCurrentObject.Strsuppl2 !== "" && sCurrentObject.Strsuppl2 !== undefined) ||
								(sCurrentObject.Strsuppl3 !== "" && sCurrentObject.Strsuppl3 !== undefined) || (sCurrentObject.TimeZone !== "" &&
									sCurrentObject.TimeZone !== undefined) || (sCurrentObject.RefPosta !== "" && sCurrentObject.RefPosta !== undefined) || (
									sCurrentObject.Region !== "" && sCurrentObject.Region !== undefined)) {
								sCurrentObject.RefPostaLblReq = true;

								var sAddressModel = g.getView().getModel("flocAddressView");
								var sAddressData = sAddressModel.getData();
								sAddressData.enabled = sCurrentObject.IsEditable;
								sAddressModel.setData(sAddressData);
							}
							oJsonModel.setData(sCurrentObject);
							g.getView().setModel(oJsonModel, g.oModelName);
							g.lam.setModel(oJsonModel, "AIWLAM");

							var sCopyArray = [oJsonModel.getData()];
							var sSupFlocData = $.map(sCopyArray, function (obj) {
								return $.extend(true, {}, obj);
							});
							var sSupFlocModel = new JSONModel();
							sSupFlocModel.setData(sSupFlocData);
							g.getView().setModel(sSupFlocModel, "SUP_FLOC_DATA");

							var mSupFlocModel = sap.ui.getCore().getModel("SUP_FLOC_DATA");
							var mSupFlocData = mSupFlocModel.getData();
							var mCountFlocFlag = true;
							for (var se = 0; se < mSupFlocData.length; se++) {
								if (sCurrentObject.Functionallocation === mSupFlocData[se].Functionallocation) {
									mCountFlocFlag = false;
								}
							}
							if (mCountFlocFlag && sCurrentObject.SupFunctionallocation !== "" && sCurrentObject.SupFunctionallocation !== undefined) {
								mSupFlocData.push(sSupFlocData[0]);
								mSupFlocModel.setData(mSupFlocData);
							}

							oMainData.viewBusy = false;
							oMainModel.setData(oMainData);
							// return;
							break;
						}
					}
				}
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);

				if (supflag) {
					g.functionalLocation = pFunctionallocation;
					g.functionalLocDesc = supFlocDesc; //g.getView().byId("FunctionalLocationidDesc").getValue();
					g.getView().getModel("dataOrigin").setProperty("/originDerive", r);
					g.openDoiView(undefined, r);
				} else {
					var aFLDOIdata = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
					for (var i = 0; i < r.FuncLoc.results.length; i++) {
						var h = r.FuncLoc.results[i];
						for (var z = 0; z < aFLDOIdata.length; z++) {
							if (h.Tplnr === aFLDOIdata[z].key) {
								var aDOIFields = aFLDOIdata[z].DOI;
								if (h.Swerki === "") {
									aDOIFields[0].maintenance = false;
									aDOIFields[0].instLoc = false;
									aDOIFields[0].SupFlVal = "";
									aDOIFields[0].currentVal = "";
									aDOIFields[0].targetVal = "";
								} else if (h.Swerki === "D") {
									aDOIFields[0].maintenance = true;
									aDOIFields[0].instLoc = false;
									aDOIFields[0].SupFlVal = "";
									aDOIFields[0].currentVal = h.Swerk;
									aDOIFields[0].targetVal = h.Swerk;
								} else {
									aDOIFields[0].maintenance = false;
									aDOIFields[0].instLoc = true;
									aDOIFields[0].SupFlVal = h.Swerk;
									aDOIFields[0].currentVal = "";
									aDOIFields[0].targetVal = h.Swerk;
								}

								if (h.Storti === "") {
									aDOIFields[1].maintenance = false;
									aDOIFields[1].instLoc = false;
									aDOIFields[1].SupFlVal = "";
									aDOIFields[1].currentVal = "";
									aDOIFields[1].targetVal = "";
								} else if (h.Storti === "D") {
									aDOIFields[1].maintenance = true;
									aDOIFields[1].instLoc = false;
									aDOIFields[1].SupFlVal = "";
									aDOIFields[1].currentVal = h.StorFloc;
									aDOIFields[1].targetVal = h.StorFloc;
								} else {
									aDOIFields[1].maintenance = false;
									aDOIFields[1].instLoc = true;
									aDOIFields[1].SupFlVal = h.StorFloc;
									aDOIFields[1].currentVal = "";
									aDOIFields[1].targetVal = h.StorFloc;
								}

								if (h.Beberi === "") {
									aDOIFields[2].maintenance = false;
									aDOIFields[2].instLoc = false;
									aDOIFields[2].SupFlVal = "";
									aDOIFields[2].currentVal = "";
									aDOIFields[2].targetVal = "";
								} else if (h.Beberi === "D") {
									aDOIFields[2].maintenance = true;
									aDOIFields[2].instLoc = false;
									aDOIFields[2].SupFlVal = "";
									aDOIFields[2].currentVal = h.BeberFl;
									aDOIFields[2].targetVal = h.BeberFl;
								} else {
									aDOIFields[2].maintenance = false;
									aDOIFields[2].instLoc = true;
									aDOIFields[2].SupFlVal = h.BeberFl;
									aDOIFields[2].currentVal = "";
									aDOIFields[2].targetVal = h.BeberFl;
								}

								if (h.Ppsidi === "") {
									aDOIFields[3].maintenance = false;
									aDOIFields[3].instLoc = false;
									aDOIFields[3].SupFlVal = "";
									aDOIFields[3].currentVal = "";
									aDOIFields[3].targetVal = "";
								} else if (h.Ppsidi === "D") {
									aDOIFields[3].maintenance = true;
									aDOIFields[3].instLoc = false;
									aDOIFields[3].SupFlVal = "";
									aDOIFields[3].currentVal = h.Arbplfloc;
									aDOIFields[3].targetVal = h.Arbplfloc;
								} else {
									aDOIFields[3].maintenance = false;
									aDOIFields[3].instLoc = true;
									aDOIFields[3].SupFlVal = h.Arbplfloc;
									aDOIFields[3].currentVal = "";
									aDOIFields[3].targetVal = h.Arbplfloc;
								}

								if (h.Abckzi === "") {
									aDOIFields[4].maintenance = false;
									aDOIFields[4].instLoc = false;
									aDOIFields[4].SupFlVal = "";
									aDOIFields[4].currentVal = "";
									aDOIFields[4].targetVal = "";
								} else if (h.Abckzi === "D") {
									aDOIFields[4].maintenance = true;
									aDOIFields[4].instLoc = false;
									aDOIFields[4].SupFlVal = "";
									aDOIFields[4].currentVal = h.Abckzfloc;
									aDOIFields[4].targetVal = h.Abckzfloc;
								} else {
									aDOIFields[4].maintenance = false;
									aDOIFields[4].instLoc = true;
									aDOIFields[4].SupFlVal = h.Abckzfloc;
									aDOIFields[4].currentVal = "";
									aDOIFields[4].targetVal = h.Abckzfloc;
								}

								if (h.Bukrsi === "") {
									aDOIFields[5].maintenance = false;
									aDOIFields[5].instLoc = false;
									aDOIFields[5].SupFlVal = "";
									aDOIFields[5].currentVal = "";
									aDOIFields[5].targetVal = "";
								} else if (h.Bukrsi === "D") {
									aDOIFields[5].maintenance = true;
									aDOIFields[5].instLoc = false;
									aDOIFields[5].SupFlVal = "";
									aDOIFields[5].currentVal = h.Bukrsfloc;
									aDOIFields[5].targetVal = h.Bukrsfloc;
								} else {
									aDOIFields[5].maintenance = false;
									aDOIFields[5].instLoc = true;
									aDOIFields[5].SupFlVal = h.Bukrsfloc;
									aDOIFields[5].currentVal = "";
									aDOIFields[5].targetVal = h.Bukrsfloc;
								}

								if (h.Kostli === "") {
									aDOIFields[6].maintenance = false;
									aDOIFields[6].instLoc = false;
									aDOIFields[6].SupFlVal = "";
									aDOIFields[6].currentVal = "";
									aDOIFields[6].targetVal = "";
								} else if (h.Kostli === "D") {
									aDOIFields[6].maintenance = true;
									aDOIFields[6].instLoc = false;
									aDOIFields[6].SupFlVal = "";
									aDOIFields[6].currentVal = h.KostFloc;
									aDOIFields[6].targetVal = h.KostFloc;
								} else {
									aDOIFields[6].maintenance = false;
									aDOIFields[6].instLoc = true;
									aDOIFields[6].SupFlVal = h.KostFloc;
									aDOIFields[6].currentVal = "";
									aDOIFields[6].targetVal = h.KostFloc;
								}

								if (h.Kokrsi === "") {
									aDOIFields[7].maintenance = false;
									aDOIFields[7].instLoc = false;
									aDOIFields[7].SupFlVal = "";
									aDOIFields[7].currentVal = "";
									aDOIFields[7].targetVal = "";
								} else if (h.Kokrsi === "D") {
									aDOIFields[7].maintenance = true;
									aDOIFields[7].instLoc = false;
									aDOIFields[7].SupFlVal = "";
									aDOIFields[7].currentVal = h.KokrFloc;
									aDOIFields[7].targetVal = h.KokrFloc;
								} else {
									aDOIFields[7].maintenance = false;
									aDOIFields[7].instLoc = true;
									aDOIFields[7].SupFlVal = h.KokrFloc;
									aDOIFields[7].currentVal = "";
									aDOIFields[7].targetVal = h.KokrFloc;
								}

								if (h.Iwerki === "") {
									aDOIFields[8].maintenance = false;
									aDOIFields[8].instLoc = false;
									aDOIFields[8].SupFlVal = "";
									aDOIFields[8].currentVal = "";
									aDOIFields[8].targetVal = "";
								} else if (h.Iwerki === "D") {
									aDOIFields[8].maintenance = true;
									aDOIFields[8].instLoc = false;
									aDOIFields[8].SupFlVal = "";
									aDOIFields[8].currentVal = h.PlntFloc;
									aDOIFields[8].targetVal = h.PlntFloc;
								} else {
									aDOIFields[8].maintenance = false;
									aDOIFields[8].instLoc = true;
									aDOIFields[8].SupFlVal = h.PlntFloc;
									aDOIFields[8].currentVal = "";
									aDOIFields[8].targetVal = h.PlntFloc;
								}

								if (h.Ingrpi === "") {
									aDOIFields[9].maintenance = false;
									aDOIFields[9].instLoc = false;
									aDOIFields[9].SupFlVal = "";
									aDOIFields[9].currentVal = "";
									aDOIFields[9].targetVal = "";
								} else if (h.Ingrpi === "D") {
									aDOIFields[9].maintenance = true;
									aDOIFields[9].instLoc = false;
									aDOIFields[9].SupFlVal = "";
									aDOIFields[9].currentVal = h.Ingrp;
									aDOIFields[9].targetVal = h.Ingrp;
								} else {
									aDOIFields[9].maintenance = false;
									aDOIFields[9].instLoc = true;
									aDOIFields[9].SupFlVal = h.Ingrp;
									aDOIFields[9].currentVal = "";
									aDOIFields[9].targetVal = h.Ingrp;
								}

								if (h.Lgwidi === "") {
									aDOIFields[10].maintenance = false;
									aDOIFields[10].instLoc = false;
									aDOIFields[10].SupFlVal = "";
									aDOIFields[10].currentVal = "";
									aDOIFields[10].targetVal = "";
								} else if (h.Lgwidi === "D") {
									aDOIFields[10].maintenance = true;
									aDOIFields[10].instLoc = false;
									aDOIFields[10].SupFlVal = "";
									aDOIFields[10].currentVal = h.Gewrkfloc;
									aDOIFields[10].targetVal = h.Gewrkfloc;
								} else {
									aDOIFields[10].maintenance = false;
									aDOIFields[10].instLoc = true;
									aDOIFields[10].SupFlVal = h.Gewrkfloc;
									aDOIFields[10].currentVal = "";
									aDOIFields[10].targetVal = h.Gewrkfloc;
								}

								if (h.Adrnri === "") {
									aDOIFields[12].maintenance = false;
									aDOIFields[12].instLoc = false;
									aDOIFields[12].SupFlVal = "";
									aDOIFields[12].currentVal = "";
									aDOIFields[12].targetVal = "";
								} else if (h.Adrnri === "D") {
									aDOIFields[12].maintenance = true;
									aDOIFields[12].instLoc = false;
									aDOIFields[12].SupFlVal = "";
									aDOIFields[12].currentVal = h.Adrnr;
									aDOIFields[12].targetVal = h.Adrnr;
								} else {
									aDOIFields[12].maintenance = false;
									aDOIFields[12].instLoc = true;
									aDOIFields[12].SupFlVal = h.Adrnr;
									aDOIFields[12].currentVal = "";
									aDOIFields[12].targetVal = h.Adrnr;
								}
							}
						}
					}
				}
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
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);
				g.invokeMessage(value);
			};

			oMainData.viewBusy = true;
			oMainModel.setData(oMainData);

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
			oModel.create(sPath, sPayload, {
				success: fnSuccess,
				error: fnError
			});
		},

		readSupFlocDetailsChange: function (pFunctionallocation, supflag, supFlocDesc) {
			var g = this;
			var sPath = "/ChangeRequestSet";
			var oModel = g.getView().getModel();
			var oMainModel = g.getView().getModel("mainView");
			var oMainData = oMainModel.getData();
			// var oAIWModel = sap.ui.getCore().getModel(g.oModelName);
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var oLocalModel = g.getView().getModel(g.oModelName);
			var sFunctionalLocation = oLocalModel.getData().Functionallocation;
			var sArray = [];
			var currentHeader = {};
			var currentLAM = {};
			var currentAddr = {};
			var currentIntlAddr = [];

			var sPayload = {
				"ChangeRequestType": "AIWEAM0P",
				"CrDescription": "",
				"Reason": "01",
				"DeriveData": true,
				"FuncLoc": [],
				"FLAddr": [],
				"FLAddrI": [],
				"FLALTLBEL": [],
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
				"OLVal": [],
				"Messages": [],
				"FLDOI": []
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
						"Adrnr": AIWFLOCModel[a].Adrnr,
						"Adrnri": AIWFLOCModel[a].Adrnri,
						"Deact": AIWFLOCModel[a].Deact,
						"Alkey": AIWFLOCModel[a].Alkey,
						Modeldesc: AIWFLOCModel[a].Modeldesc,
						Modelref: AIWFLOCModel[a].Modelref,
						Modelrver: AIWFLOCModel[a].Modelrver,
						Modelext: AIWFLOCModel[a].Modelext,
						Modelname: AIWFLOCModel[a].Modelname,
						Modelver: AIWFLOCModel[a].Modelver,
					};

					var aFLDOI = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
					if (aFLDOI && aFLDOI.length > 0) {
						var aDOIFields = aFLDOI[a].DOI;
						// sFuncLoc.Begrui = aDOIFields[0].instLoc ? "H" : "D";
						sFuncLoc.Swerki = aDOIFields[0].instLoc ? "H" : "D";
						sFuncLoc.Storti = aDOIFields[1].instLoc ? "H" : "D";
						// sFuncLoc.Msgrpi = aDOIFields[3].instLoc ? "H" : "D";
						sFuncLoc.Beberi = aDOIFields[2].instLoc ? "H" : "D";
						sFuncLoc.Ppsidi = aDOIFields[3].instLoc ? "H" : "D";
						sFuncLoc.Abckzi = aDOIFields[4].instLoc ? "H" : "D";
						sFuncLoc.Bukrsi = aDOIFields[5].instLoc ? "H" : "D";
						// sFuncLoc.Gsberi = aDOIFields[8].instLoc ? "H" : "D";
						// sFuncLoc.Anlnri = aDOIFields[9].instLoc ? "H" : "D";
						// sFuncLoc.Anlnri = aDOIFields[10].instLoc ? "H" : "D";
						sFuncLoc.Kostli = aDOIFields[6].instLoc ? "H" : "D";
						sFuncLoc.Kokrsi = aDOIFields[7].instLoc ? "H" : "D";
						// sFuncLoc.Proidi = aDOIFields[13].instLoc ? "H" : "D";
						// sFuncLoc.Daufni = aDOIFields[14].instLoc ? "H" : "D";
						// sFuncLoc.Aufnri = aDOIFields[15].instLoc ? "H" : "D";
						sFuncLoc.Iwerki = aDOIFields[8].instLoc ? "H" : "D";
						sFuncLoc.Ingrpi = aDOIFields[9].instLoc ? "H" : "D";
						sFuncLoc.Lgwidi = aDOIFields[10].instLoc ? "H" : "D";
						// sFuncLoc.Swerki = aDOIFields[19].instLoc ? "H" : "D";
						// sFuncLoc.RbnrI = aDOIFields[20].instLoc ? "H" : "D";
						// sFuncLoc.Submti = aDOIFields[21].instLoc ? "H" : "D";
						// sFuncLoc.Einzli = aDOIFields[22].instLoc ? "H" : "D";
						// sFuncLoc.Iequii = aDOIFields[23].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[24].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[25].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[26].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[27].instLoc ? "H" : "D";
						// sFuncLoc.Vkorgi = aDOIFields[28].instLoc ? "H" : "D";
						sFuncLoc.Adrnri = aDOIFields[12].instLoc ? "H" : "D";
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

			var sAIWData = g.getView().getModel(g.oModelName).getData();
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
				"Adrnr": sAIWData.Adrnr,
				"Adrnri": sAIWData.Adrnri,
				"Deact": sAIWData.Deact,
				"Alkey": sAIWData.Alkey,
			};

			var aFLDOI = this.getView().getModel("dataOrigin").getData();
			if (aFLDOI) {
				var aDOIFields = aFLDOI;
				// sFuncLoc.Begrui = aDOIFields[0].instLoc ? "H" : "D";
				sFuncLoc.Swerki = aDOIFields[0].instLoc ? "H" : "D";
				sFuncLoc.Storti = aDOIFields[1].instLoc ? "H" : "D";
				// sFuncLoc.Msgrpi = aDOIFields[3].instLoc ? "H" : "D";
				sFuncLoc.Beberi = aDOIFields[2].instLoc ? "H" : "D";
				sFuncLoc.Ppsidi = aDOIFields[3].instLoc ? "H" : "D";
				sFuncLoc.Abckzi = aDOIFields[4].instLoc ? "H" : "D";
				sFuncLoc.Bukrsi = aDOIFields[5].instLoc ? "H" : "D";
				// sFuncLoc.Gsberi = aDOIFields[8].instLoc ? "H" : "D";
				// sFuncLoc.Anlnri = aDOIFields[9].instLoc ? "H" : "D";
				// sFuncLoc.Anlnri = aDOIFields[10].instLoc ? "H" : "D";
				sFuncLoc.Kostli = aDOIFields[6].instLoc ? "H" : "D";
				sFuncLoc.Kokrsi = aDOIFields[7].instLoc ? "H" : "D";
				// sFuncLoc.Proidi = aDOIFields[13].instLoc ? "H" : "D";
				// sFuncLoc.Daufni = aDOIFields[14].instLoc ? "H" : "D";
				// sFuncLoc.Aufnri = aDOIFields[15].instLoc ? "H" : "D";
				sFuncLoc.Iwerki = aDOIFields[8].instLoc ? "H" : "D";
				sFuncLoc.Ingrpi = aDOIFields[9].instLoc ? "H" : "D";
				sFuncLoc.Lgwidi = aDOIFields[10].instLoc ? "H" : "D";
				// sFuncLoc.Swerki = aDOIFields[19].instLoc ? "H" : "D";
				// sFuncLoc.RbnrI = aDOIFields[20].instLoc ? "H" : "D";
				// sFuncLoc.Submti = aDOIFields[21].instLoc ? "H" : "D";
				// sFuncLoc.Einzli = aDOIFields[22].instLoc ? "H" : "D";
				// sFuncLoc.Iequii = aDOIFields[23].instLoc ? "H" : "D";
				// sFuncLoc.Vkorgi = aDOIFields[24].instLoc ? "H" : "D";
				// sFuncLoc.Vkorgi = aDOIFields[25].instLoc ? "H" : "D";
				// sFuncLoc.Vkorgi = aDOIFields[26].instLoc ? "H" : "D";
				// sFuncLoc.Vkorgi = aDOIFields[27].instLoc ? "H" : "D";
				// sFuncLoc.Vkorgi = aDOIFields[28].instLoc ? "H" : "D";
				sFuncLoc.Adrnri = aDOIFields[12].instLoc ? "H" : "D";
			}
			sPayload.FuncLoc.push(sFuncLoc);

			currentHeader = sFuncLoc;
			sFuncLoc.IsDOI = true;

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

			currentAddr = sFLAddr;

			var aIntlAddr = sAIWData.intlAddr;
			if (aIntlAddr.length > 0) {
				for (var z = 0; z < aIntlAddr.length; z++) {
					sPayload.FLAddrI.push(aIntlAddr[z]);
				}
			}

			currentIntlAddr = aIntlAddr;

			if (g.AltLblDerv === "2" && sAIWData.altlbl.length > 0) {
				for (var y = 0; y < sAIWData.altlbl.length; y++) {
					var oAltLbl = {
						"Funcloc": sAIWData.Functionallocation,
						"AltAlkey": sAIWData.altlbl[y].AltAlkey,
						"AltStrno": sAIWData.altlbl[y].AltStrno,
						"AltTplkz": sAIWData.altlbl[y].AltTplkz
					};
					sPayload.FLALTLBEL.push(oAltLbl);
				}
			}

			if (sAIWData.Floccategory === "L") {
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
				currentLAM = sFLLAM;
				sFLLAM.LamDer = "D";
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
							"Funcloc": sAIWData.Functionallocation,
							"Atnam": sFLCharList[c].Atnam,
							"Textbez": sFLCharList[c].Textbez,
							"Atwrt": sFLCharList[c].Atwrt,
							"Class": sFLCharList[c].Class
						};
						sPayload.FLVal.push(sFLVal);
					}
				}
			}

			var fnSuccess = function (r) {
				if (r.FuncLoc.results.length > 0) {
					for (var i = 0; i < r.FuncLoc.results.length; i++) {
						if (r.FuncLoc.results[i].Tplnr === sFunctionalLocation) {
							var h = r.FuncLoc.results[i];
							var sModelData = {
								intlAddr: [],
								altlbl: [],
								classItems: [],
								characteristics: [],
								FunctionallocationVS: "None",
								FunctionallocationVST: "",
								FlocdescriptionVS: "None",
								FlocdescriptionVST: "",
								StrucindicatorVS: "None",
								StrucindicatorVST: "",
								FloccategoryVS: "None",
								FloccategoryVST: "",
								SupFunctionallocationVS: "None",
								SupFunctionallocationVST: "",
								MaintplantVS: "None",
								MaintplantVST: "",
								StsmEquiVS: "None",
								StsmEquiVST: "",
								UstwEquiVS: "None",
								UstwEquiVST: "",
								UswoEquiVS: "None",
								UswoEquiVST: "",
								TechnicalObjectTypVS: "None",
								TechnicalObjectTypVST: "",
								LocationVS: "None",
								LocationVST: "",
								AbckzVS: "None",
								AbckzVST: "",
								MainArbplVS: "None",
								MainArbplVST: "",
								BeberFlVS: "None",
								BeberFlVST: "",
								BukrsVS: "None",
								BukrsVST: "",
								KostlVS: "None",
								KostlVST: "",
								WerksVS: "None",
								WerksVST: "",
								IngrpVS: "None",
								IngrpVST: "",
								ArbplVS: "None",
								ArbplVST: "",
								ConstrTypeVS: "None",
								ConstrTypeVST: "",
								RefPostaVS: "None",
								RefPostaVST: "",
								LangucodeVS: "None",
								LangucodeVST: "",
								TimeZoneVS: "None",
								TimeZoneVST: "",

								TplnrEnabled: true,
								FunctionalLocEnabled: true,
								FlocCatEnabled: true,
								StrucIndEnabled: true,
								MaintplantEnabled: true,
								BukrsEnabled: true
							};
							sModelData.Functionallocation = h.Tplnr;
							sModelData.Flocdescription = h.Txtmi;
							sModelData.EditMask = h.EditMask;
							sModelData.Hierarchy = h.Hierarchy;
							sModelData.Floccategory = h.Fltyp;
							sModelData.FlocCategoryDesc = h.Flttx;
							sModelData.Strucindicator = h.TplkzFlc;
							sModelData.StrucIndicatorDesc = h.Tplxt;
							sModelData.SupFunctionallocation = h.Tplma; // Sup FuncLoc
							sModelData.SupFlocdescription = h.Supflocdesc; // Sup FlocDescription
							sModelData.Stattext = h.Stattext; // System Status
							sModelData.StsmEqui = h.StsmFloc; // Status Profile
							sModelData.StsmEquiDesc = h.Statproftxt; // Status Profile Description
							sModelData.UstwEqui = h.UstwFloc; // Status with Status Number
							sModelData.UswoEqui = h.UswoFloc; // Status without Status Number
							sModelData.UstaEqui = h.UstaFloc; // User Status
							sModelData.TechnicalObjectTyp = h.Eqart; // TechnicalObjectTyp
							sModelData.Description = h.Eartx; // TechnicalObjectTyp Description
							sModelData.Maintplant = h.Swerk;
							sModelData.MaintplantDesc = h.Plantname;
							sModelData.Location = h.StorFloc; // Location
							sModelData.Locationdesc = h.Locationdesc; // Location Description
							sModelData.BeberFl = h.BeberFl; // Plant Section
							sModelData.Fing = h.Fing; // Person responsible
							sModelData.Tele = h.Tele; // Phone
							sModelData.Arbpl = h.Arbplfloc; // Work Center
							sModelData.Ktext = h.Workcenterdesc; // Work Center Description
							sModelData.WcWerks = h.Wergwfloc; // Work center Plant
							sModelData.MainArbpl = h.Gewrkfloc; // Main Work Center
							sModelData.MainKtext = h.MainWcDesc; // Plant Work Center
							sModelData.MainWerks = h.MainWcPlant; // Name
							sModelData.Abckz = h.Abckzfloc;
							sModelData.Abctx = h.Abctx;
							sModelData.Bukrs = h.Bukrsfloc;
							sModelData.Butxt = h.Butxt;
							sModelData.City = h.City;
							sModelData.Kostl = h.KostFloc; // Cost Center
							sModelData.Kokrs = h.KokrFloc; // ccPart1
							sModelData.Mctxt = h.Contareaname; // Name
							sModelData.Werks = h.PlntFloc; // Planning Plant
							sModelData.Planningplantdes = h.Planningplantdes; // Planning Plant Description
							sModelData.Ingrp = h.Ingrp; // Planner Group
							sModelData.Innam = h.Plannergrpdesc; // Planner Group Description
							sModelData.ConstrType = h.Submtiflo; // Construction Type
							sModelData.ConstructionDesc = h.Constdesc; // Construction Description
							sModelData.menuAction = h.IsMenu;
							sModelData.Adrnr = h.Adrnr;
							sModelData.Adrnri = h.Adrnri;
							sModelData.Deact = h.Deact;
							sModelData.Alkey = h.Alkey;
							sModelData.Altxt = h.Altxt;
							sModelData.Modeldesc = h.Modeldesc;
							sModelData.Modelref = h.Modelref;
							sModelData.Modelrver = h.Modelrver;
							sModelData.Modelext = h.Modelext;
							sModelData.Modelname = h.Modelname;
							sModelData.Modelver = h.Modelver;

							if (supflag && sModelData.Functionallocation === sFunctionalLocation) { //For DOI
								g.flHeader = r.FuncLoc.results[i];
								sModelData.Maintplant = currentHeader.Swerk;
								sModelData.MaintplantDesc = currentHeader.Name1;
								sModelData.Bukrs = currentHeader.Bukrsfloc;
								sModelData.Butxt = currentHeader.Butxt;
								sModelData.Location = currentHeader.StorFloc; // Location
								sModelData.Locationdesc = currentHeader.Locationdesc; // Location Description
								sModelData.Abckz = currentHeader.Abckzfloc;
								sModelData.Abctx = currentHeader.Abctx;
								sModelData.Kostl = currentHeader.KostFloc; // Cost Center
								sModelData.Kokrs = currentHeader.KokrFloc; // ccPart1
								sModelData.Mctxt = currentHeader.Contareaname; // Name
								sModelData.Werks = currentHeader.PlntFloc; // Planning Plant
								sModelData.Planningplantdes = currentHeader.Planningplantdes; // Planning Plant Description
								sModelData.Ingrp = currentHeader.Ingrp; // Planner Group
								sModelData.Innam = currentHeader.Innam; // Planner Group Description
								sModelData.MainArbpl = currentHeader.Gewrkfloc; // Main Work Center
								sModelData.MainKtext = currentHeader.MainKtext; // Plant Work Center
								sModelData.MainWerks = currentHeader.MainWerks; // Name
								sModelData.BeberFl = currentHeader.BeberFl; // Plant Section
								sModelData.Fing = currentHeader.Fing; // Plant Section
								sModelData.Tele = currentHeader.Tele; // Plant Section
								sModelData.Stattext = currentHeader.Stattext;
							}

							if (h.Type === true) {
								sModelData.viewParameter = "create";
							}
							if (h.Type === false) {
								sModelData.viewParameter = "change";
								if (sModelData.Floccategory === "" || sModelData.Floccategory === undefined) {
									sModelData.FlocCatEnabled = true;
								} else {
									sModelData.FlocCatEnabled = false;
								}
								if (sModelData.Strucindicator === "" || sModelData.Strucindicator === undefined) {
									sModelData.StrucIndEnabled = true;
								} else {
									sModelData.StrucIndEnabled = false;
								}
								sModelData.FunctionalLocEnabled = false;
							}

							if (h.Swerk !== "") {
								// sModelData.MaintplantEnabled = false;
								sModelData.BukrsEnabled = false;
							} else {
								sModelData.MaintplantEnabled = true;
								sModelData.BukrsEnabled = true;
							}

							// if (r.FLLAM.results.length > 0) {
							// 	var aFlLam = r.FLLAM.results;
							// 	for (var x = 0; x < aFlLam.length; x++) {
							// 		if (aFlLam[x].Funcloc === sModelData.Functionallocation) {
							// 			var oFLLAM = {
							// 				"Funcloc": aFlLam[x].Funcloc,
							// 				"Lrpid": aFlLam[x].Lrpid,
							// 				"LrpidDesc": aFlLam[x].LrpDescr,
							// 				"Strtptatr": aFlLam[x].Strtptatr,
							// 				"Endptatr": aFlLam[x].Endptatr,
							// 				"Length": aFlLam[x].Length,
							// 				"LinUnit": aFlLam[x].LinUnit,
							// 				"LinUnitDesc": aFlLam[x].Uomtext,
							// 				"Startmrkr": aFlLam[x].Startmrkr,
							// 				"Endmrkr": aFlLam[x].Endmrkr,
							// 				"Mrkdisst": aFlLam[x].Mrkdisst,
							// 				"Mrkdisend": aFlLam[x].Mrkdisend,
							// 				"MrkrUnit": aFlLam[x].MrkrUnit
							// 			};
							// 			sModelData.lam = oFLLAM;
							// 			break;
							// 		}
							// 	}
							// }

							if (supflag && sModelData.Functionallocation === sFunctionalLocation && sModelData.Floccategory === "L") {
								sModelData.lam = currentLAM;

								if (r.FLLAM.results.length > 0) {
									g.flLAM = r.FLLAM.results;
								}
							}

							// if (r.FLAddr) {
							// 	if (r.FLAddr.results) {
							// 		var sAddress = r.FLAddr.results;
							// 		if (sAddress) {
							// 			if (sAddress.length > 0) {
							// 				for (var j = 0; j < sAddress.length; j++) {
							// 					if (sModelData.Functionallocation === sAddress[j].Funcloc) {
							// 						var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
							// 						var oAddressData = oAddressModel.getData();
							// 						var mCountFlag = true;
							// 						var sObj, sMatchIndex;
							// 						if (oAddressData.length > 0) {
							// 							for (var sa = 0; sa < oAddressData.length; sa++) {
							// 								if (sModelData.Functionallocation === oAddressData[sa].Functionallocation) {
							// 									mCountFlag = false;
							// 									sMatchIndex = sa;
							// 									break;
							// 								}
							// 							}
							// 						}
							// 						if (mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
							// 							sObj = {
							// 								Functionallocation: sModelData.Functionallocation,
							// 								IsEditable: sAddress[j].IsEditable
							// 							};
							// 							oAddressData.push(sObj);
							// 							oAddressModel.setData(oAddressData);
							// 						}
							// 						if (!mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
							// 							oAddressData[sMatchIndex].Functionallocation = sModelData.Functionallocation;
							// 							oAddressData[sMatchIndex].IsEditable = sModelData.IsEditable;
							// 							oAddressModel.setData(oAddressData);
							// 						}

							// 						sModelData.IsEditable = sAddress[j].IsEditable;
							// 						sModelData.Title = sAddress[j].Titletxt ? sAddress[j].Titletxt : "";
							// 						sModelData.TitleCode = sAddress[j].Title ? sAddress[j].Title : "";
							// 						sModelData.Name1 = sAddress[j].Name1 ? sAddress[j].Name1 : "";
							// 						sModelData.Name2 = sAddress[j].Name2 ? sAddress[j].Name2 : "";
							// 						sModelData.Name3 = sAddress[j].Name3 ? sAddress[j].Name3 : "";
							// 						sModelData.Name4 = sAddress[j].Name4 ? sAddress[j].Name4 : "";
							// 						sModelData.Sort1 = sAddress[j].Sort1 ? sAddress[j].Sort1 : "";
							// 						sModelData.Sort2 = sAddress[j].Sort2 ? sAddress[j].Sort2 : "";
							// 						sModelData.NameCo = sAddress[j].NameCo ? sAddress[j].NameCo : "";
							// 						sModelData.PostCod1 = sAddress[j].PostCod1 ? sAddress[j].PostCod1 : "";
							// 						sModelData.City1 = sAddress[j].City1 ? sAddress[j].City1 : "";
							// 						sModelData.Building = sAddress[j].Building ? sAddress[j].Building : "";
							// 						sModelData.Floor = sAddress[j].Floor ? sAddress[j].Floor : "";
							// 						sModelData.Roomnum = sAddress[j].Roomnum ? sAddress[j].Roomnum : "";
							// 						sModelData.Strsuppl1 = sAddress[j].Strsuppl1 ? sAddress[j].Strsuppl1 : "";
							// 						sModelData.Strsuppl2 = sAddress[j].Strsuppl2 ? sAddress[j].Strsuppl2 : "";
							// 						sModelData.Strsuppl3 = sAddress[j].Strsuppl3 ? sAddress[j].Strsuppl3 : "";
							// 						sModelData.AddrLocation = sAddress[j].Location ? sAddress[j].Location : "";
							// 						sModelData.RefPosta = sAddress[j].RPostafl ? sAddress[j].RPostafl : "";
							// 						sModelData.Landx = sAddress[j].Landx ? sAddress[j].Landx : "";
							// 						sModelData.TimeZone = sAddress[j].TimeZone ? sAddress[j].TimeZone : "";
							// 						sModelData.Region = sAddress[j].RPostFl ? sAddress[j].RPostFl : "";
							// 						sModelData.RegionDesc = sAddress[j].Regiotxt ? sAddress[j].Regiotxt : "";
							// 					}
							// 				}
							// 			} else {
							// 				sModelData.Title = sModelData.Title ? sModelData.Title : "";
							// 				sModelData.TitleCode = sModelData.TitleCode ? sModelData.TitleCode : "";
							// 				sModelData.Name1 = sModelData.Name1 ? sModelData.Name1 : "";
							// 				sModelData.Name2 = sModelData.Name2 ? sModelData.Name2 : "";
							// 				sModelData.Name3 = sModelData.Name3 ? sModelData.Name3 : "";
							// 				sModelData.Name4 = sModelData.Name4 ? sModelData.Name4 : "";
							// 				sModelData.Sort1 = sModelData.Sort1 ? sModelData.Sort1 : "";
							// 				sModelData.Sort2 = sModelData.Sort2 ? sModelData.Sort2 : "";
							// 				sModelData.NameCo = sModelData.NameCo ? sModelData.NameCo : "";
							// 				sModelData.PostCod1 = sModelData.PostCod1 ? sModelData.PostCod1 : "";
							// 				sModelData.City1 = sModelData.City1 ? sModelData.City1 : "";
							// 				sModelData.Building = sModelData.Building ? sModelData.Building : "";
							// 				sModelData.Floor = sModelData.Floor ? sModelData.Floor : "";
							// 				sModelData.Roomnum = sModelData.Roomnum ? sModelData.Roomnum : "";
							// 				sModelData.Strsuppl1 = sModelData.Strsuppl1 ? sModelData.Strsuppl1 : "";
							// 				sModelData.Strsuppl2 = sModelData.Strsuppl2 ? sModelData.Strsuppl2 : "";
							// 				sModelData.Strsuppl3 = sModelData.Strsuppl3 ? sModelData.Strsuppl3 : "";
							// 				sModelData.AddrLocation = sModelData.AddrLocation ? sModelData.AddrLocation : "";
							// 				sModelData.RefPosta = sModelData.RefPosta ? sModelData.RefPosta : "";
							// 				sModelData.Landx = sModelData.Landx ? sModelData.Landx : "";
							// 				sModelData.TimeZone = sModelData.TimeZone ? sModelData.TimeZone : "";
							// 				sModelData.Region = sModelData.Region ? sModelData.Region : "";
							// 				sModelData.RegionDesc = sModelData.RegionDesc ? sModelData.RegionDesc : "";
							// 			}
							// 		}
							// 	}
							// }

							if (supflag && sModelData.Functionallocation === sFunctionalLocation) {
								var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
								var oAddressData = oAddressModel.getData();
								var mCountFlag = true;
								var sObj, sMatchIndex;
								if (oAddressData.length > 0) {
									for (var sa = 0; sa < oAddressData.length; sa++) {
										if (sModelData.Functionallocation === oAddressData[sa].Functionallocation) {
											mCountFlag = false;
											sMatchIndex = sa;
											break;
										}
									}
								}
								if (mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
									sObj = {
										Functionallocation: sModelData.Functionallocation,
										IsEditable: currentAddr.IsEditable
									};
									oAddressData.push(sObj);
									oAddressModel.setData(oAddressData);
								}
								if (!mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
									oAddressData[sMatchIndex].Functionallocation = sModelData.Functionallocation;
									oAddressData[sMatchIndex].IsEditable = sModelData.IsEditable;
									oAddressModel.setData(oAddressData);
								}

								sModelData.IsEditable = currentAddr.IsEditable;
								sModelData.Title = currentAddr.Titletxt ? currentAddr.Titletxt : "";
								sModelData.TitleCode = currentAddr.Title ? currentAddr.Title : "";
								sModelData.Name1 = currentAddr.Name1 ? currentAddr.Name1 : "";
								sModelData.Name2 = currentAddr.Name2 ? currentAddr.Name2 : "";
								sModelData.Name3 = currentAddr.Name3 ? currentAddr.Name3 : "";
								sModelData.Name4 = currentAddr.Name4 ? currentAddr.Name4 : "";
								sModelData.Sort1 = currentAddr.Sort1 ? currentAddr.Sort1 : "";
								sModelData.Sort2 = currentAddr.Sort2 ? currentAddr.Sort2 : "";
								sModelData.NameCo = currentAddr.NameCo ? currentAddr.NameCo : "";
								sModelData.PostCod1 = currentAddr.PostCod1 ? currentAddr.PostCod1 : "";
								sModelData.City1 = currentAddr.City1 ? currentAddr.City1 : "";
								sModelData.Building = currentAddr.Building ? currentAddr.Building : "";
								sModelData.Floor = currentAddr.Floor ? currentAddr.Floor : "";
								sModelData.Roomnum = currentAddr.Roomnum ? currentAddr.Roomnum : "";
								sModelData.Strsuppl1 = currentAddr.Strsuppl1 ? currentAddr.Strsuppl1 : "";
								sModelData.Strsuppl2 = currentAddr.Strsuppl2 ? currentAddr.Strsuppl2 : "";
								sModelData.Strsuppl3 = currentAddr.Strsuppl3 ? currentAddr.Strsuppl3 : "";
								sModelData.AddrLocation = currentAddr.Location ? currentAddr.Location : "";
								sModelData.RefPosta = currentAddr.RPostafl ? currentAddr.RPostafl : "";
								sModelData.Landx = currentAddr.Landx ? currentAddr.Landx : "";
								sModelData.TimeZone = currentAddr.TimeZone ? currentAddr.TimeZone : "";
								sModelData.Region = currentAddr.RPostFl ? currentAddr.RPostFl : "";
								sModelData.RegionDesc = currentAddr.Regiotxt ? currentAddr.Regiotxt : "";

								if (r.FLAddr.results) {
									g.flAddr = r.FLAddr.results;
								}
							}

							var aIntlAddr = r.FLAddrI.results;
							if (aIntlAddr.length > 0) {
								for (var z = 0; z < aIntlAddr.length; z++) {
									if (aIntlAddr[z].Funcloc === sModelData.Functionallocation) {
										aIntlAddr[z].AdNationEnable = false;
										aIntlAddr[z].City1iVS = "None";
										aIntlAddr[z].StreetiVS = "None";
										sModelData.intlAddr.push(aIntlAddr[z]);
									}
								}
							}

							if (supflag && sModelData.Functionallocation === sFunctionalLocation && sModelData.intlAddr.length > 0) {
								g.flIntlAddr = sModelData.intlAddr;
								sModelData.intlAddr = currentIntlAddr;
							} else {
								g.flIntlAddr = [];
							}

							var aAltLbl = r.FLALTLBEL.results;
							if (aAltLbl.length > 0) {
								for (var y = 0; y < aAltLbl.length; y++) {
									if (aAltLbl[y].Funcloc === sModelData.Functionallocation) {
										var oAltLbl = {
											"Funcloc": h.Tplnr,
											"AltAlkey": aAltLbl[y].AltAlkey, // Labeling system
											"Altxt": aAltLbl[y].Altxt, // Labeling system descr
											"AltStrno": aAltLbl[y].AltStrno, // Alternative Label
											"AltTplkz": aAltLbl[y].AltTplkz, // Strycture Indicator
											"Tplxt": aAltLbl[y].Tplxt, // Structure Indicator Descr
											"Name1i": aAltLbl[y].Editm, // Edit Mask
											"Actvs": aAltLbl[y].Actvs, // Active
											"AltPrkey": aAltLbl[y].AltPrkey, // Primary
											"AltReuse": aAltLbl[y].AltReuse, // Reusable

											"enableLblSys": false,
											"enableAltLbl": true,
											"enableStrInd": true,

											"LblSysVS": "None",
											"AltLblVS": "None",
											"StrIndVS": "None"
										};
										sModelData.altlbl.push(oAltLbl);
									}
								}
							}

							if (r.FLClass) {
								var sClassList = r.FLClass.results;
								if (sClassList) {
									if (sClassList.length > 0) {
										for (var a = 0; a < sClassList.length; a++) {
											if (sModelData.Functionallocation === sClassList[a].Funcloc) {
												sClassList[a].ctEnable = false;
												sClassList[a].classEnable = false;
												sClassList[a].ClassTypeDesc = sClassList[a].Artxt;
												delete sClassList[a].Artxt;
												delete sClassList[a].Changerequestid;
												delete sClassList[a].Clint;
												delete sClassList[a].Service;
												sModelData.classItems.push(sClassList[a]);
											}
										}
										sModelData.charNewButton = true;
										if (g.class && g.class.getId().includes("detailFloc") === true) {
											// var itemFragmentId = g.getView().createId("charFrag");
											// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
											// newCharBtn.setEnabled(true);
											g.class.setModel(new JSONModel(sModelData.classItems));
										}
									}
								}
							}

							if (r.FLVal) {
								var sCharList = r.FLVal.results;
								if (sCharList) {
									if (sCharList.length > 0) {
										for (var j = 0; j < sCharList.length; j++) {
											if (sModelData.Functionallocation === sCharList[j].Funcloc) {
												sCharList[j].cNameEnable = false;
												sCharList[j].Textbz = sCharList[j].Atwtb;
												delete sCharList[j].Ataut;
												delete sCharList[j].Ataw1;
												delete sCharList[j].Atawe;
												delete sCharList[j].Atcod;
												delete sCharList[j].Atflb;
												delete sCharList[j].Atflv;
												delete sCharList[j].Atimb;
												delete sCharList[j].Atsrt;
												delete sCharList[j].Atvglart;
												delete sCharList[j].Atzis;
												delete sCharList[j].Changerequestid;
												delete sCharList[j].CharName;
												delete sCharList[j].Charid;
												delete sCharList[j].Classtype;
												delete sCharList[j].Service;
												delete sCharList[j].Valcnt;
												sCharList[j].slNo = j + 1; // ()
												sCharList[j].flag = sCharList[j].Class + "-" + sCharList[j].slNo; // ()
												sModelData.characteristics.push(sCharList[j]);
											}
										}
										if (g.char && g.char.getId().includes("detailFloc") === true) {
											g.char.setModel(new JSONModel(sModelData.characteristics));
										}
									}
								}
							}

							if (sModelData.UstaEqui) {
								oMainData.visible = true;
							} else {
								oMainData.visible = false;
							}
							oMainModel.setData(oMainData);
							g.getView().getModel(g.oModelName).setData(sModelData);

							var oJsonModel = new JSONModel();
							var sCurrentObject = sModelData;

							sCurrentObject.Title = sCurrentObject.Title ? sCurrentObject.Title : "";
							sCurrentObject.TitleCode = sCurrentObject.TitleCode ? sCurrentObject.TitleCode : "";
							sCurrentObject.Name1 = sCurrentObject.Name1 ? sCurrentObject.Name1 : "";
							sCurrentObject.Name2 = sCurrentObject.Name2 ? sCurrentObject.Name2 : "";
							sCurrentObject.Name3 = sCurrentObject.Name3 ? sCurrentObject.Name3 : "";
							sCurrentObject.Name4 = sCurrentObject.Name4 ? sCurrentObject.Name4 : "";
							sCurrentObject.Sort1 = sCurrentObject.Sort1 ? sCurrentObject.Sort1 : "";
							sCurrentObject.Sort2 = sCurrentObject.Sort2 ? sCurrentObject.Sort2 : "";
							sCurrentObject.NameCo = sCurrentObject.NameCo ? sCurrentObject.NameCo : "";
							sCurrentObject.PostCod1 = sCurrentObject.PostCod1 ? sCurrentObject.PostCod1 : "";
							sCurrentObject.City1 = sCurrentObject.City1 ? sCurrentObject.City1 : "";
							sCurrentObject.Building = sCurrentObject.Building ? sCurrentObject.Building : "";
							sCurrentObject.Floor = sCurrentObject.Floor ? sCurrentObject.Floor : "";
							sCurrentObject.Roomnum = sCurrentObject.Roomnum ? sCurrentObject.Roomnum : "";
							sCurrentObject.Strsuppl1 = sCurrentObject.Strsuppl1 ? sCurrentObject.Strsuppl1 : "";
							sCurrentObject.Strsuppl2 = sCurrentObject.Strsuppl2 ? sCurrentObject.Strsuppl2 : "";
							sCurrentObject.Strsuppl3 = sCurrentObject.Strsuppl3 ? sCurrentObject.Strsuppl3 : "";
							sCurrentObject.AddrLocation = sCurrentObject.AddrLocation ? sCurrentObject.AddrLocation : "";
							sCurrentObject.RefPosta = sCurrentObject.RefPosta ? sCurrentObject.RefPosta : "";
							sCurrentObject.Landx = sCurrentObject.Landx ? sCurrentObject.Landx : "";
							sCurrentObject.TimeZone = sCurrentObject.TimeZone ? sCurrentObject.TimeZone : "";
							sCurrentObject.Region = sCurrentObject.Region ? sCurrentObject.Region : "";
							sCurrentObject.RegionDesc = sCurrentObject.RegionDesc ? sCurrentObject.RegionDesc : "";

							if ((sCurrentObject.Title !== "" && sCurrentObject.Title !== undefined) || (sCurrentObject.TitleCode !== "" && sCurrentObject
									.TitleCode !== undefined) || (sCurrentObject.Name1 !== "" && sCurrentObject.Name1 !== undefined) || (sCurrentObject.Name2 !==
									"" && sCurrentObject.Name2 !== undefined) || (sCurrentObject.Name3 !== "" && sCurrentObject.Name3 !== undefined) ||
								(sCurrentObject.Name4 !== "" && sCurrentObject.Name4 !== undefined) ||
								(sCurrentObject.Sort1 !== "" && sCurrentObject.Sort1 !== undefined) || (sCurrentObject.Sort2 !== "" && sCurrentObject.Sort2 !==
									undefined) || (sCurrentObject.NameCo !== "" && sCurrentObject.NameCo !== undefined) || (sCurrentObject.PostCod1 !== "" &&
									sCurrentObject.PostCod1 !== undefined) || (sCurrentObject.City1 !== "" && sCurrentObject.City1 !== undefined) ||
								(sCurrentObject.Building !== "" && sCurrentObject.Building !== undefined) ||
								(sCurrentObject.Floor !== "" && sCurrentObject.Floor !== undefined) || (sCurrentObject.Roomnum !== "" && sCurrentObject.Roomnum !==
									undefined) || (sCurrentObject.AddrLocation !== "" && sCurrentObject.AddrLocation !== undefined) || (sCurrentObject.Strsuppl1 !==
									"" && sCurrentObject.Strsuppl1 !== undefined) || (sCurrentObject.Strsuppl2 !== "" && sCurrentObject.Strsuppl2 !== undefined) ||
								(sCurrentObject.Strsuppl3 !== "" && sCurrentObject.Strsuppl3 !== undefined) || (sCurrentObject.TimeZone !== "" &&
									sCurrentObject.TimeZone !== undefined) || (sCurrentObject.RefPosta !== "" && sCurrentObject.RefPosta !== undefined) || (
									sCurrentObject.Region !== "" && sCurrentObject.Region !== undefined)) {
								sCurrentObject.RefPostaLblReq = true;

								var sAddressModel = g.getView().getModel("flocAddressView");
								var sAddressData = sAddressModel.getData();
								sAddressData.enabled = sCurrentObject.IsEditable;
								sAddressModel.setData(sAddressData);
							}
							oJsonModel.setData(sCurrentObject);
							g.getView().setModel(oJsonModel, g.oModelName);
							g.lam.setModel(oJsonModel, "AIWLAM");

							var sCopyArray = [oJsonModel.getData()];
							var sSupFlocData = $.map(sCopyArray, function (obj) {
								return $.extend(true, {}, obj);
							});
							var sSupFlocModel = new JSONModel();
							sSupFlocModel.setData(sSupFlocData);
							g.getView().setModel(sSupFlocModel, "SUP_FLOC_DATA");

							var mSupFlocModel = sap.ui.getCore().getModel("SUP_FLOC_DATA");
							var mSupFlocData = mSupFlocModel.getData();
							var mCountFlocFlag = true;
							for (var se = 0; se < mSupFlocData.length; se++) {
								if (sCurrentObject.Functionallocation === mSupFlocData[se].Functionallocation) {
									mCountFlocFlag = false;
								}
							}
							if (mCountFlocFlag && sCurrentObject.SupFunctionallocation !== "" && sCurrentObject.SupFunctionallocation !== undefined) {
								mSupFlocData.push(sSupFlocData[0]);
								mSupFlocModel.setData(mSupFlocData);
							}
						}
					}
				}
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);

				if (supflag) {
					g.functionalLocation = pFunctionallocation;
					g.functionalLocDesc = supFlocDesc; //g.getView().byId("FunctionalLocationidDesc").getValue();
					g.getView().getModel("dataOrigin").setProperty("/originDerive", r);
					g.openDoiView(undefined, r);
				}
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
				oMainData.viewBusy = false;
				oMainModel.setData(oMainData);
				g.invokeMessage(value);
			};

			oMainData.viewBusy = true;
			oMainModel.setData(oMainData);

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
			oModel.create(sPath, sPayload, {
				success: fnSuccess,
				error: fnError
			});
		},

		onDOIDisplayPress: function () {
			// var results = {
			// 	FLDOI: {
			// 		results: this.getView().getModel("dataOrigin").getData()
			// 	}
			// };
			// this.openDoiView(undefined, results);
			// var g = this;
			// var currentData = this.getView().getModel(this.oModelName).getData();
			// if (g.viewName && g.viewName === "ChangeFloc") {
			// 	g.readSupFlocDetailsChange(currentData.SupFunctionallocation, "SUP", currentData.SupFlocdescription);
			// } else {
			// 	g.readSupFlocDetails(currentData.SupFunctionallocation, "SUP", currentData.SupFlocdescription);
			// }
			this.doiDisplayFlag = true;
			var objSOP = this.getView().getModel(this.oModelName).getData();
			if (!this.doiView) {
				this.doiView = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DataOrigin", this);
			}

			var dModel = new sap.ui.model.json.JSONModel(),
				text;
			var floc = this.functionalLocation,
				flocDesc = this.functionalLocDesc;
			var dObj = {},
				hdrText, fieldText;

			dObj.install = true;
			dObj.dismantle = false;
			dObj.parent = floc;
			dObj.parentDesc = flocDesc;
			dObj.currentObj = objSOP.Functionallocation;
			dObj.currObjDesc = objSOP.Flocdescription;
			text = this.getView().getModel("i18n").getProperty("doi");
			this.doiView.setTitle(text);
			this.doiView.getAggregation("beginButton").setText("OK").setEnabled(true);
			sap.ui.getCore().byId("currObjLbl").setText(this.getView().getModel("i18n").getProperty("FUNLOC"));
			fieldText = this.getView().getModel("i18n").getProperty("instlFieldFlText");
			hdrText = this.getView().getModel("i18n").getProperty("instlHdrFlText");
			this.doiView.getContent()[0].getContent()[0].setText(fieldText);
			this.doiView.getContent()[1].getColumns()[1].getAggregation("header").setText(hdrText);
			this.doiView.getContent()[1].getColumns()[5].getAggregation("header").setText(this.getView().getModel("i18n").getProperty(
				"indMaintFL"));

			dModel.setData(dObj);
			this.getView().setModel(dModel, "doi");
			this.doiView.setModel(dModel, "doi");
			if (objSOP.SupFunctionallocation === "") {
				objSOP.SupFlocdescription = "";
			}

			var oTable = this.doiView.getContent()[1];
			var dData = this.getView().getModel("dataOrigin").getData();

			// if (oTable.getModel() === undefined) {
			var currentDoiData = this.getView().getModel("dataOrigin").getData();
			var tempcurrentDoiData = $.map(currentDoiData, function (obj) {
				return $.extend(true, {}, obj);
			});
			// oTable.setModel(new JSONModel(tempcurrentDoiData));
			// }
			// var data = oTable.getModel().getData();
			oTable.getColumns()[3].getAggregation("header").setEnabled(false);
			oTable.getColumns()[5].getAggregation("header").setEnabled(false);
			// tempcurrentDoiData.forEach(function (d) {
			// 	d.instLoc = false;
			// });
			// var tempData = $.map(data, function (obj) {
			// 	return $.extend(true, {}, obj);
			// });
			// tempData.splice(1, 1);
			// tempData.splice(12, 1);
			tempcurrentDoiData.forEach(function (d) {
				// d.instLoc = false;
				d.locEnable = false;
				d.maintEnable = false;
			});
			if (oTable.getModel()) {
				oTable.getModel().setData(tempcurrentDoiData);
			} else {
				var oTempModel = new JSONModel(tempcurrentDoiData);
				oTable.setModel(oTempModel);
			}

			var colItems = sap.ui.getCore().byId("idColItems");
			oTable.bindItems("/", colItems);
			this.doiView.open();
		},

		openDoiView: function (v, results) {
			var objSOP = this.getView().getModel(this.oModelName).getData();
			if (!this.doiView) {
				this.doiView = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DataOrigin", this); //ValueHelpRequest.getDoiFragment(this);
			}

			// this.doiView = this.getDOIMainFrag();

			var flCurrValTitle = this.getView().getModel("i18n").getProperty("doiFlCurrVal");
			var flTarValTitle = this.getView().getModel("i18n").getProperty("doiFlTarVal");

			this.doiView.mAggregations.content[1].mAggregations.columns[6].mAggregations.header.setText(flCurrValTitle);
			this.doiView.mAggregations.content[1].mAggregations.columns[7].mAggregations.header.setText(flTarValTitle);

			var dModel = new sap.ui.model.json.JSONModel(),
				text,
				floc = this.functionalLocation,
				flocDesc = this.functionalLocDesc;
			var dObj = {},
				hdrText, fieldText;
			if (v === "") {
				dObj.install = false;
				dObj.dismantle = true;
				dObj.parent = floc;
				dObj.parentDesc = flocDesc;
				dObj.currentObj = objSOP.Functionallocation; //this.getView().byId("FuncLoc").getValue();
				dObj.currObjDesc = objSOP.Flocdescription; //this.getView().byId("FlocDescription").getValue();
				this.doiView.getAggregation("beginButton").setText("Dismantle").setEnabled(true);
				text = this.getView().getModel("i18n").getProperty("doiDismantle");
				this.doiView.getContent()[1].getColumns()[2].getAggregation("header").setText(this.getView().getModel("i18n").getProperty(
					"locationDisAft"));
				this.doiView.getContent()[1].getColumns()[4].getAggregation("header").setText(this.getView().getModel("i18n").getProperty(
					"locationDisBfr"));
				this.doiView.setTitle(text);
				sap.ui.getCore().byId("currObjLbl").setText(this.getView().getModel("i18n").getProperty("FUNLOC"));
				fieldText = this.getView().getModel("i18n").getProperty("instlFieldFlText");
				hdrText = this.getView().getModel("i18n").getProperty("instlHdrFlText");
				this.doiView.getContent()[1].getColumns()[1].getAggregation("header").setText(hdrText);
			} else {
				dObj.install = true;
				dObj.dismantle = false;
				dObj.parent = floc;
				dObj.parentDesc = flocDesc;
				dObj.currentObj = objSOP.Functionallocation; //this.getView().byId("FuncLoc").getValue();
				dObj.currObjDesc = objSOP.Flocdescription; //this.getView().byId("FlocDescription").getValue();
				text = this.getView().getModel("i18n").getProperty("doi");
				this.doiView.getAggregation("beginButton").setText("Install").setEnabled(true);
				this.doiView.setTitle(text);
				sap.ui.getCore().byId("currObjLbl").setText(this.getView().getModel("i18n").getProperty("FUNLOC"));
				fieldText = this.getView().getModel("i18n").getProperty("instlFieldFlText");
				hdrText = this.getView().getModel("i18n").getProperty("instlHdrFlText"); //instlHdrEqText
				this.doiView.getContent()[0].getContent()[0].setText(fieldText);
				this.doiView.getContent()[1].getColumns()[1].getAggregation("header").setText(hdrText);
				this.doiView.getContent()[1].getColumns()[5].getAggregation("header").setText(this.getView().getModel("i18n").getProperty(
					"indMaintFL"));
			}
			dModel.setData(dObj);
			this.getView().setModel(dModel, "doi");
			this.doiView.setModel(dModel, "doi");
			if (objSOP.SupFunctionallocation === "") {
				objSOP.SupFlocdescription = "";
				// this.functionalLocation = "";
				// this.functionalLocDesc = "";
			}
			var oTable = this.doiView.getContent()[1];
			var dData = this.getView().getModel("dataOrigin").getData();
			if (results) {
				var fields = results.FLDOI.results;
				for (var f = 0; f < fields.length; f++) {
					fields[f].instLoc = true;
					if (fields[f].hasOwnProperty("maintenance")) {
						if (!fields[f].maintenance) {
							fields[f].targetVal = fields[f].SupFlVal;
						}
					} else {
						fields[f].maintenance = dData[f].maintenance;
						if (fields[f].maintenance) {
							fields[f].instLoc = false;
						} else {
							fields[f].instLoc = true;
						}

						fields[f].currentVal = dData[f].currentVal;
						// fields[f].currentValDesc = dData[f].currentValDesc;
					}
					if (fields[f].Property === "Maintplant" || fields[f].Property === "PlntFloc") {
						fields[f].locEnable = false;
						fields[f].maintEnable = false;
					} else {
						fields[f].locEnable = true;
						fields[f].maintEnable = true;
					}
					fields[f].targetVal = fields[f].SupFlVal;
				}

				if ((objSOP.Title !== "" && objSOP.Title !== undefined) || (objSOP.TitleCode !== "" && objSOP
						.TitleCode !== undefined) || (objSOP.Name1 !== "" && objSOP.Name1 !== undefined) || (objSOP.Name2 !==
						"" && objSOP.Name2 !== undefined) || (objSOP.Name3 !== "" && objSOP.Name3 !== undefined) ||
					(objSOP.Name4 !== "" && objSOP.Name4 !== undefined) || (objSOP.Sort1 !== "" && objSOP.Sort1 !==
						undefined) || (objSOP.Sort2 !== "" && objSOP.Sort2 !== undefined) || (objSOP.NameCo !== "" &&
						objSOP.NameCo !== undefined) || (objSOP.PostCod1 !== "" &&
						objSOP.PostCod1 !== undefined) || (objSOP.City1 !== "" && objSOP.City1 !== undefined) ||
					(objSOP.Building !== "" && objSOP.Building !== undefined) ||
					(objSOP.Floor !== "" && objSOP.Floor !== undefined) || (objSOP.Roomnum !== "" && objSOP.Roomnum !==
						undefined) || (objSOP.AddrLocation !== "" && objSOP.AddrLocation !== undefined) || (objSOP.Strsuppl1 !==
						"" && objSOP.Strsuppl1 !== undefined) || (objSOP.Strsuppl2 !== "" && objSOP.Strsuppl2 !== undefined) ||
					(objSOP.Strsuppl3 !== "" && objSOP.Strsuppl3 !== undefined) || (objSOP.TimeZone !== "" &&
						objSOP.TimeZone !== undefined) || (objSOP.RefPosta !== "" && objSOP.RefPosta !== undefined) || (
						objSOP.Region !== "" && objSOP.Region !== undefined)) {

					fields[12].maintenance = true; //fields[23].maintenance = true;
					fields[12].instLoc = false; //fields[23].instLoc = false;
					fields[12].targetVal = objSOP.Functionallocation; //fields[23].targetVal = objSOP.Functionallocation; //this.getView().byId("Equipment").getValue();
					fields[12].currentVal = objSOP.Functionallocation; //fields[23].currentVal = objSOP.Functionallocation; //this.getView().byId("Equipment").getValue();
					// fields[12].currentValDesc = objSOP.Flocdescription;
				}

				oTable.setModel(new sap.ui.model.json.JSONModel(fields));
			} else {
				// if (oTable.getModel() === undefined) {
				var currentDoiData = this.getView().getModel("dataOrigin").getData();
				var tempcurrentDoiData = $.map(currentDoiData, function (obj) {
					return $.extend(true, {}, obj);
				});
				oTable.setModel(new JSONModel(tempcurrentDoiData));
				// oTable.setModel(this.getView().getModel("dataOrigin"));
				// }
				var data = oTable.getModel().getData();
				oTable.getColumns()[3].getAggregation("header").setSelected(false);
				// data.splice(1, 1);
				// data.splice(12, 1);
				data.forEach(function (d) {
					d.instLoc = false;
				});
				var tempData = $.map(data, function (obj) {
					return $.extend(true, {}, obj);
				});
				tempData.splice(8, 1); // PlanPlnt
				tempData.splice(0, 1); // MaintPlnt
				tempData.forEach(function (d) {
					d.instLoc = false;
				});
				oTable.getModel().setData(tempData);
				// oTable.setModel(this.getView().getModel("dataOrigin"));
			}

			oTable.getColumns()[3].getAggregation("header").setEnabled(true);
			oTable.getColumns()[5].getAggregation("header").setEnabled(true);

			var colItems = sap.ui.getCore().byId("idColItems");
			oTable.bindItems("/", colItems);
			// this.DOITableDataFilter(oTable, results);
			this.doiView.open();
			this.getView().getModel("dataOrigin").refresh()
		},

		// DOITableDataFilter:function(oTable, results){
		// 	var aItems = oTable.getItems();
		// 	aItems[0].setVisible(false);
		// 	aItems[3].setVisible(false);
		// 	aItems[7].setVisible(false);
		// 	aItems[8].setVisible(false);
		// 	aItems[9].setVisible(false);
		// 	aItems[10].setVisible(false);
		// 	aItems[13].setVisible(false);
		// 	aItems[14].setVisible(false);
		// 	aItems[15].setVisible(false);
		// 	aItems[17].setVisible(false);
		// 	aItems[20].setVisible(false);
		// 	aItems[21].setVisible(false);
		// 	aItems[22].setVisible(false);
		// 	aItems[23].setVisible(false);
		// 	aItems[24].setVisible(false);
		// 	aItems[25].setVisible(false);
		// 	aItems[26].setVisible(false);
		// 	aItems[27].setVisible(false);
		// 	aItems[28].setVisible(false);

		// 	if(!results){
		// 		aItems[1].setVisible(false); // Maintainence Plant
		// 		aItems[16].setVisible(false); // Planning Plant
		// 	}
		// },

		onObjectItemSelect: function (oEvent) {
			var oSource = oEvent.getSource();
			var oSelected = oEvent.getSource().getSelected();
			var sObject = oSource.getBindingContext().getObject();
			var actionType = oEvent.getSource().getParent().getParent().getParent().getBeginButton().getText();
			var sId = oSource.getId();
			if (sId.indexOf("eq") > -1) {
				sObject.instLoc = false;
				sObject.targetVal = "";
			} else if (sId.indexOf("il") > -1) {
				if (oSelected) {
					if (actionType === "Dismantle") {
						sObject.maintenance = false;
						sObject.finalDismantle = sObject.SupFlVal;
					} else {
						sObject.maintenance = false;
						sObject.targetVal = sObject.SupFlVal;
					}
				} else {
					if (actionType === "Dismantle") {
						sObject.maintenance = false;
						sObject.finalDismantle = "";
					}
				}

			}
		},

		onDOIActionPress: function (oEvent) {
			var g = this;
			if (this.doiDisplayFlag) {
				oEvent.getSource().getParent().close();
				this.doiDisplayFlag = false;
				return;
			}
			if (g.viewName === "ChangeFloc") {
				g.onDOIActionPressChange(oEvent);
				return;
			}
			var type = oEvent.getSource().getText();
			var oAIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC");
			var aAIWFLOC = oAIWFLOCModel.getData();
			var oLocalModel = g.getView().getModel(g.oModelName);
			var localData = oLocalModel.getData();
			var sLocalVar = g.getView().getModel(g.oModelName).getData().Functionallocation;
			var tData = oEvent.getSource().getParent().getContent()[1].getModel().getData();
			var sObject = {};
			var aiwIndex = "";

			for (var i = 0; i < aAIWFLOC.length; i++) {
				if (aAIWFLOC[i].Functionallocation === sLocalVar) {
					sObject = aAIWFLOC[i];
					aiwIndex = i;
				}
			}

			// if (this.doiDisplayFlag) {
			// 	if (!tData[1].maintenance) {
			// 		sObject.Location = tData[1].SupFlVal;
			// 		sObject.Locationdesc = tData[1].Txtmi;
			// 	}else{
			// 		sObject.Location = tData[1].currentVal;
			// 		sObject.Locationdesc = tData[1].currentValDesc;
			// 	}
			// 	if (!tData[2].maintenance) {
			// 		sObject.BeberFl = tData[2].targetVal;
			// 		sObject.Fing = tData[2].Txtmi;
			// 		sObject.Tele = "";
			// 	}else{
			// 		sObject.BeberFl = tData[2].currentVal;
			// 		sObject.Fing = tData[2].currentValDesc;
			// 		sObject.Tele = "";
			// 	}
			// 	if (!tData[3].maintenance) {
			// 		sObject.Arbpl = tData[3].targetVal;
			// 		sObject.Ktext = tData[3].Txtmi;
			// 	}else{
			// 		sObject.Arbpl = tData[3].currentVal;
			// 		sObject.Ktext = tData[3].currentValDesc;
			// 	}
			// 	if (!tData[4].maintenance) {
			// 		sObject.Abckz = tData[4].targetVal;
			// 		sObject.Abctx = tData[4].Txtmi;
			// 	}else{
			// 		sObject.Abckz = tData[4].currentVal;
			// 		sObject.Abctx = tData[4].currentValDesc;
			// 	}
			// 	if (!tData[6].maintenance) { //if (!tData[9].maintenance) {
			// 		sObject.Kostl = tData[6].targetVal;
			// 		sObject.Mctxt = tData[6].Txtmi;
			// 	}else{
			// 		sObject.Kostl = tData[6].currentVal;
			// 		sObject.Mctxt = tData[6].currentValDesc;
			// 	}
			// 	if (!tData[9].maintenance) { //if (!tData[14].maintenance) {
			// 		sObject.Ingrp = tData[9].targetVal;
			// 		sObject.Innam = tData[9].Txtmi;
			// 	}else{
			// 		sObject.Ingrp = tData[9].currentVal;
			// 		sObject.Innam = tData[9].currentValDesc;
			// 	}
			// 	if (!tData[10].maintenance) { //if (!tData[15].maintenance) {
			// 		sObject.MainArbpl = tData[10].targetVal;
			// 		sObject.MainKtext = tData[10].Txtmi;
			// 		sObject.MainWerks = tData[0].currentVal;
			// 	}else{
			// 		sObject.MainArbpl = tData[10].currentVal;
			// 		sObject.MainKtext = tData[10].currentValDesc;
			// 		sObject.MainWerks = tData[0].currentVal;
			// 	}
			// 	// if (tData[0].instLoc && currentHeader.Swerk !== "") {
			// 	// 	sObject.Maintplant = tData[0].targetVal;
			// 	// 	sObject.MaintplantDesc = tData[0].Txtmi;
			// 	// 	// sObject.MaintplantEnabled = false;
			// 	// 	sObject.Bukrs = currentHeader.Bukrsfloc;
			// 	// 	sObject.Butxt = currentHeader.Butxt;
			// 	// 	sObject.BukrsEnabled = false;
			// 	// 	sObject.Werks = currentHeader.PlntFloc; // Planning Plant
			// 	// 	sObject.Planningplantdes = currentHeader.Planningplantdes; // Planning Plant Description
			// 	// 	sObject.Kokrs = currentHeader.KokrFloc; // ccPart1
			// 	// }
			// } else {
			if (type === "Install") {
				this.isInstall = true;
				var currentHeader = g.flHeader;
				if (!tData[1].maintenance) {
					sObject.Location = currentHeader.StorFloc; // Location
					sObject.Locationdesc = currentHeader.Locationdesc; // Location Description
				}
				if (!tData[2].maintenance) {
					sObject.BeberFl = currentHeader.BeberFl; // Plant Section
					sObject.Fing = currentHeader.Fing; // Plant Section
					sObject.Tele = currentHeader.Tele; // Plant Section
				}
				if (!tData[3].maintenance) {
					sObject.Arbpl = currentHeader.Arbplfloc;
					sObject.Ktext = currentHeader.Workcenterdesc;
				}
				if (!tData[4].maintenance) {
					sObject.Abckz = currentHeader.Abckzfloc;
					sObject.Abctx = currentHeader.Abctx;
				}
				if (!tData[6].maintenance) { //if (!tData[9].maintenance) {
					sObject.Kostl = currentHeader.KostFloc; // Cost Center
					sObject.Mctxt = currentHeader.Contareaname; // Name
				}
				if (!tData[9].maintenance) { //if (!tData[14].maintenance) {
					sObject.Ingrp = currentHeader.Ingrp; // Planner Group
					sObject.Innam = currentHeader.Plannergrpdesc; // Planner Group Description
				}
				if (!tData[10].maintenance) { //if (!tData[15].maintenance) {
					sObject.MainArbpl = currentHeader.Gewrkfloc; // Main Work Center
					sObject.MainKtext = currentHeader.MainWcDesc; // Plant Work Center
					sObject.MainWerks = currentHeader.MainWcPlant; // Name
				}
				if (tData[0].instLoc && currentHeader.Swerk !== "") {
					sObject.Maintplant = currentHeader.Swerk;
					sObject.MaintplantDesc = currentHeader.Name1;
					// sObject.MaintplantEnabled = false;
					sObject.Bukrs = currentHeader.Bukrsfloc;
					sObject.Butxt = currentHeader.Butxt;
					sObject.BukrsEnabled = false;
					sObject.Werks = currentHeader.PlntFloc; // Planning Plant
					sObject.Planningplantdes = currentHeader.Planningplantdes; // Planning Plant Description
					sObject.Kokrs = currentHeader.KokrFloc; // ccPart1
				}
				sObject.MaintplantEnabled = true;
				sObject.Stattext = currentHeader.Stattext;

				if (tData.length < 13) {
					var aDoiData = this.getView().getModel("dataOrigin").getData();
					tData.splice(0, 0, aDoiData[0]); //Maintainence plant DOI data
					tData.splice(8, 0, aDoiData[8]); //tData.splice(13, 0, aDoiData[13]); //Planning plant DOI data
					this.getView().getModel("dataOrigin").setData(tData);
				}

				if (!tData[12].maintenance) {
					var sAddress = g.flAddr;
					if (sAddress) {
						if (sAddress.length > 0) {
							for (var j = 0; j < sAddress.length; j++) {
								if (sObject.Functionallocation === sAddress[j].Funcloc) {
									var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
									var oAddressData = oAddressModel.getData();
									var mCountFlag = true;
									var sObj, sMatchIndex;
									if (oAddressData.length > 0) {
										for (var sa = 0; sa < oAddressData.length; sa++) {
											if (sObject.Functionallocation === oAddressData[sa].Functionallocation) {
												mCountFlag = false;
												sMatchIndex = sa;
												break;
											}
										}
									}
									if (mCountFlag && sObject.SupFunctionallocation !== "" && sObject.SupFunctionallocation !== undefined) {
										sObj = {
											Functionallocation: sObject.Functionallocation,
											IsEditable: sAddress[j].IsEditable
										};
										oAddressData.push(sObj);
										oAddressModel.setData(oAddressData);
									}
									if (!mCountFlag && sObject.SupFunctionallocation !== "" && sObject.SupFunctionallocation !== undefined) {
										oAddressData[sMatchIndex].Functionallocation = sObject.Functionallocation;
										oAddressData[sMatchIndex].IsEditable = sObject.IsEditable;
										oAddressModel.setData(oAddressData);
									}

									sObject.IsEditable = sAddress[j].IsEditable;
									sObject.Title = sAddress[j].Titletxt ? sAddress[j].Titletxt : "";
									sObject.TitleCode = sAddress[j].Title ? sAddress[j].Title : "";
									sObject.Name1 = sAddress[j].Name1 ? sAddress[j].Name1 : "";
									sObject.Name2 = sAddress[j].Name2 ? sAddress[j].Name2 : "";
									sObject.Name3 = sAddress[j].Name3 ? sAddress[j].Name3 : "";
									sObject.Name4 = sAddress[j].Name4 ? sAddress[j].Name4 : "";
									sObject.Sort1 = sAddress[j].Sort1 ? sAddress[j].Sort1 : "";
									sObject.Sort2 = sAddress[j].Sort2 ? sAddress[j].Sort2 : "";
									sObject.NameCo = sAddress[j].NameCo ? sAddress[j].NameCo : "";
									sObject.PostCod1 = sAddress[j].PostCod1 ? sAddress[j].PostCod1 : "";
									sObject.City1 = sAddress[j].City1 ? sAddress[j].City1 : "";
									sObject.Building = sAddress[j].Building ? sAddress[j].Building : "";
									sObject.Floor = sAddress[j].Floor ? sAddress[j].Floor : "";
									sObject.Roomnum = sAddress[j].Roomnum ? sAddress[j].Roomnum : "";
									sObject.Strsuppl1 = sAddress[j].Strsuppl1 ? sAddress[j].Strsuppl1 : "";
									sObject.Strsuppl2 = sAddress[j].Strsuppl2 ? sAddress[j].Strsuppl2 : "";
									sObject.Strsuppl3 = sAddress[j].Strsuppl3 ? sAddress[j].Strsuppl3 : "";
									sObject.AddrLocation = sAddress[j].Location ? sAddress[j].Location : "";
									sObject.RefPosta = sAddress[j].RPostafl ? sAddress[j].RPostafl : "";
									sObject.Landx = sAddress[j].Landx ? sAddress[j].Landx : "";
									sObject.TimeZone = sAddress[j].TimeZone ? sAddress[j].TimeZone : "";
									sObject.Region = sAddress[j].RPostFl ? sAddress[j].RPostFl : "";
									sObject.RegionDesc = sAddress[j].Regiotxt ? sAddress[j].Regiotxt : "";
								}
							}
						} else {
							sObject.Title = sObject.Title ? sObject.Title : "";
							sObject.TitleCode = sObject.TitleCode ? sObject.TitleCode : "";
							sObject.Name1 = sObject.Name1 ? sObject.Name1 : "";
							sObject.Name2 = sObject.Name2 ? sObject.Name2 : "";
							sObject.Name3 = sObject.Name3 ? sObject.Name3 : "";
							sObject.Name4 = sObject.Name4 ? sObject.Name4 : "";
							sObject.Sort1 = sObject.Sort1 ? sObject.Sort1 : "";
							sObject.Sort2 = sObject.Sort2 ? sObject.Sort2 : "";
							sObject.NameCo = sObject.NameCo ? sObject.NameCo : "";
							sObject.PostCod1 = sObject.PostCod1 ? sObject.PostCod1 : "";
							sObject.City1 = sObject.City1 ? sObject.City1 : "";
							sObject.Building = sObject.Building ? sObject.Building : "";
							sObject.Floor = sObject.Floor ? sObject.Floor : "";
							sObject.Roomnum = sObject.Roomnum ? sObject.Roomnum : "";
							sObject.Strsuppl1 = sObject.Strsuppl1 ? sObject.Strsuppl1 : "";
							sObject.Strsuppl2 = sObject.Strsuppl2 ? sObject.Strsuppl2 : "";
							sObject.Strsuppl3 = sObject.Strsuppl3 ? sObject.Strsuppl3 : "";
							sObject.AddrLocation = sObject.AddrLocation ? sObject.AddrLocation : "";
							sObject.RefPosta = sObject.RefPosta ? sObject.RefPosta : "";
							sObject.Landx = sObject.Landx ? sObject.Landx : "";
							sObject.TimeZone = sObject.TimeZone ? sObject.TimeZone : "";
							sObject.Region = sObject.Region ? sObject.Region : "";
							sObject.RegionDesc = sObject.RegionDesc ? sObject.RegionDesc : "";
						}

						sObject.intlAddr = g.flIntlAddr;
					}
				}

				var aFlLam = g.flLAM;
				if (aFlLam) {
					for (var x = 0; x < aFlLam.length; x++) {
						if (aFlLam[x].Funcloc === sObject.Functionallocation) {
							////////////// Superior FLOC has LAM data - start /////////////////////
							if (sObject.Functionallocation === sLocalVar && sObject.Floccategory === "L" && g.lamSwitch ===
								"X") {
								// sObject.lam = currentLAM;
								var tempIndex = x;
								var sMsg = "Superior object has been changed. Do you want to copy linear data from superior object?";
								sap.m.MessageBox.confirm(sMsg, {
									title: "Confirmation",
									onClose: function (oAction) {
										if (oAction === "OK") {
											var oFLLAM = {
												"Funcloc": aFlLam[tempIndex].Funcloc,
												"Lrpid": aFlLam[tempIndex].Lrpid,
												"LrpidDesc": aFlLam[tempIndex].LrpDescr,
												"Strtptatr": aFlLam[tempIndex].Strtptatr,
												"Endptatr": aFlLam[tempIndex].Endptatr,
												"Length": aFlLam[tempIndex].Length,
												"LinUnit": aFlLam[tempIndex].LinUnit,
												"LinUnitDesc": aFlLam[tempIndex].Uomtext,
												"Startmrkr": aFlLam[tempIndex].Startmrkr,
												"Endmrkr": aFlLam[tempIndex].Endmrkr,
												"Mrkdisst": aFlLam[tempIndex].Mrkdisst,
												"Mrkdisend": aFlLam[tempIndex].Mrkdisend,
												"MrkrUnit": aFlLam[tempIndex].MrkrUnit,
												"LamDer": aFlLam[tempIndex].LamDer
											};
											var mLocalModel = g.getView().getModel(g.oModelName);
											var sMdlData = mLocalModel.getData();
											sMdlData.lam = oFLLAM;
											mLocalModel.setData(sMdlData);
											g.lam.setModel(mLocalModel, "AIWLAM");
										}
									}
								});
								break;
							}
							////////////// Superior FLOC has LAM data - end /////////////////////
						}
					}
				}

				aAIWFLOC[aiwIndex] = sObject;
				oAIWFLOCModel.setData(aAIWFLOC);
			} else {
				this.isInstall = false;
				this.functionalLocation = "";
				this.functionalLocDesc = "";
				var sNamelocation = this.getView().byId("idLocation").getName();
				var sNameAbc = this.getView().byId("idAbcInd").getName();
				var sNamePlSec = this.getView().byId("idPlntSec").getName();
				var sNameWorkCen = this.getView().byId("idWorkCen").getName();
				var sNameCC = this.getView().byId("idCostCtr").getName();
				var sNamePlrGrp = this.getView().byId("idPlnGrp").getName();
				var sNameMWC = this.getView().byId("idMainWC").getName();
				for (var t = 0; t < tData.length; t++) {
					if (tData[t].Property === sNamelocation && !tData[t].instLoc) {
						sObject.Location = ""; //loc.setValue();
						sObject.Locationdesc = ""; //locDesc.setValue();
					} else if (tData[t].Property === sNameAbc && !tData[t].instLoc) {
						sObject.Abckz = ""; //abc.setValue();
						sObject.Abctx = ""; //abcDesc.setValue();
					} else if (tData[t].Property === sNamePlSec && !tData[t].instLoc) {
						sObject.BeberFl = "";
						sObject.Fing = "";
						sObject.Tele = "";
					} else if (tData[t].Property === sNameWorkCen && !tData[t].instLoc) {
						sObject.Arbpl = "";
						sObject.Ktext = "";
					} else if (tData[t].Property === sNameCC && !tData[t].instLoc) {
						sObject.Kostl = ""; //cost.setValue();
						sObject.Kokrs = ""; //costDesc.setValue();
					} else if (tData[t].Property === sNamePlrGrp && !tData[t].instLoc) {
						sObject.Ingrp = ""; //plGrp.setValue();
						sObject.Innam = ""; //plGrpDesc.setValue();
					} else if (tData[t].Property === sNameMWC && !tData[t].instLoc) {
						sObject.MainArbpl = ""; //mWc.setValue();
						sObject.MainWerks = ""; //wcPlant.setValue();
						sObject.MainKtext = ""; //wcDesc.setValue();
					} else if (tData[t].Property === "Adrnr") { // && !tData[t].instLoc
						if (g.getView().getModel("SUP_FLOC_DATA")) {
							var mSupFlocModel = sap.ui.getCore().getModel("SUP_FLOC_DATA");
							var mSupFlocData = mSupFlocModel.getData();
							var mSupFlocIndex;
							for (var a = 0; a < mSupFlocData.length; a++) {
								if (oEvent.getSource().getModel(g.oModelName).getData().Functionallocation === mSupFlocData[a].Functionallocation) {
									mSupFlocIndex = a;
									break;
								}
							}
							var localModel = g.getView().getModel(g.oModelName);
							var localData = localModel.getData();
							var sSupFlocData = g.getView().getModel("SUP_FLOC_DATA").getData()[0];
							if (sSupFlocData) {
								localData.Title = "";
								localData.TitleCode = "";
								localData.Name1 = "";
								localData.Name2 = "";
								localData.Name3 = "";
								localData.Name4 = "";
								localData.Sort1 = "";
								localData.Sort2 = "";
								localData.NameCo = "";
								localData.PostCod1 = "";
								localData.City1 = "";
								localData.Building = "";
								localData.Floor = "";
								localData.Roomnum = "";
								localData.Strsuppl1 = "";
								localData.Strsuppl2 = "";
								localData.Strsuppl3 = "";
								localData.AddrLocation = "";
								localData.RefPosta = "";
								localData.Landx = "";
								localData.TimeZone = "";
								localData.Region = "";
								localData.RegionDesc = "";
								localData.RefPostaLblReq = false;

								var mAddressModel = sap.ui.getCore().getModel("flocAddressView");
								var mAddressData = mAddressModel.getData();
								for (var as = 0; as < mAddressData.length; as++) {
									if (oEvent.getSource().getModel(g.oModelName).getData().Functionallocation === mAddressData[as].Functionallocation) {
										mAddressData.splice(as, 1);
										mAddressModel.setData(mAddressData);
										break;
									}
								}

								var sAddressModel = g.getView().getModel("flocAddressView");
								var sAddressData = sAddressModel.getData();
								sAddressData.enabled = true;
								sAddressModel.setData(sAddressData);

								mSupFlocData.splice(mSupFlocIndex, 1);
								mSupFlocModel.setData(mSupFlocData);
							}
						}

						sObject.intlAddr = [];
					}
				}

				if (tData[10].Property === "Adrnr" && tData[10].instLoc === true) { //if (tData[23].Property === "Adrnr" && tData[23].instLoc === true) {
					var sAddressModel = g.getView().getModel("flocAddressView");
					var sAddressData = sAddressModel.getData();
					sAddressData.enabled = true;
					sAddressModel.setData(sAddressData);

					sap.ui.getCore().getModel("flocAddressView").getData().forEach(function (item) {
						if (item.Functionallocation === sObject.Functionallocation) {
							item.IsEditable = true;
						}
					});
				}

				sObject.MaintplantEnabled = true; // mPlant.setEnabled(true);
				aAIWFLOC[aiwIndex] = sObject;
				oAIWFLOCModel.setData(aAIWFLOC);
				this.readSystemStatus(g);
			}
			// }

			if (tData.length < 13) {
				var aDoiData = this.getView().getModel("dataOrigin").getData();
				tData.splice(0, 0, aDoiData[0]); //Maintainence plant DOI data
				tData.splice(8, 0, aDoiData[8]); //tData.splice(13, 0, aDoiData[13]); //Planning plant DOI data
				this.getView().getModel("dataOrigin").setData(tData);
			}
			this.getView().getModel("dataOrigin").setData(tData);

			for (var w = 0; w < sap.ui.getCore().getModel("dataOriginMOP").getData().FL.length; w++) {
				if (sap.ui.getCore().getModel("dataOriginMOP").getData().FL[w].key === sLocalVar) {
					sap.ui.getCore().getModel("dataOriginMOP").getData().FL[w].DOI = tData;
				}
			}

			for (var l = 0; l < oAIWFLOCModel.getData().length; l++) {
				if (sLocalVar === oAIWFLOCModel.getData()[l].Functionallocation) {
					g.rowIndex = "/" + l;
					var oJsonModel = new JSONModel();
					var sCurrentObject = oAIWFLOCModel.getProperty(g.rowIndex);

					sCurrentObject.Title = sCurrentObject.Title ? sCurrentObject.Title : "";
					sCurrentObject.TitleCode = sCurrentObject.TitleCode ? sCurrentObject.TitleCode : "";
					sCurrentObject.Name1 = sCurrentObject.Name1 ? sCurrentObject.Name1 : "";
					sCurrentObject.Name2 = sCurrentObject.Name2 ? sCurrentObject.Name2 : "";
					sCurrentObject.Name3 = sCurrentObject.Name3 ? sCurrentObject.Name3 : "";
					sCurrentObject.Name4 = sCurrentObject.Name4 ? sCurrentObject.Name4 : "";
					sCurrentObject.Sort1 = sCurrentObject.Sort1 ? sCurrentObject.Sort1 : "";
					sCurrentObject.Sort2 = sCurrentObject.Sort2 ? sCurrentObject.Sort2 : "";
					sCurrentObject.NameCo = sCurrentObject.NameCo ? sCurrentObject.NameCo : "";
					sCurrentObject.PostCod1 = sCurrentObject.PostCod1 ? sCurrentObject.PostCod1 : "";
					sCurrentObject.City1 = sCurrentObject.City1 ? sCurrentObject.City1 : "";
					sCurrentObject.Building = sCurrentObject.Building ? sCurrentObject.Building : "";
					sCurrentObject.Floor = sCurrentObject.Floor ? sCurrentObject.Floor : "";
					sCurrentObject.Roomnum = sCurrentObject.Roomnum ? sCurrentObject.Roomnum : "";
					sCurrentObject.Strsuppl1 = sCurrentObject.Strsuppl1 ? sCurrentObject.Strsuppl1 : "";
					sCurrentObject.Strsuppl2 = sCurrentObject.Strsuppl2 ? sCurrentObject.Strsuppl2 : "";
					sCurrentObject.Strsuppl3 = sCurrentObject.Strsuppl3 ? sCurrentObject.Strsuppl3 : "";
					sCurrentObject.AddrLocation = sCurrentObject.AddrLocation ? sCurrentObject.AddrLocation : "";
					sCurrentObject.RefPosta = sCurrentObject.RefPosta ? sCurrentObject.RefPosta : "";
					sCurrentObject.Landx = sCurrentObject.Landx ? sCurrentObject.Landx : "";
					sCurrentObject.TimeZone = sCurrentObject.TimeZone ? sCurrentObject.TimeZone : "";
					sCurrentObject.Region = sCurrentObject.Region ? sCurrentObject.Region : "";
					sCurrentObject.RegionDesc = sCurrentObject.RegionDesc ? sCurrentObject.RegionDesc : "";

					if ((sCurrentObject.Title !== "" && sCurrentObject.Title !== undefined) || (sCurrentObject.TitleCode !== "" && sCurrentObject
							.TitleCode !== undefined) || (sCurrentObject.Name1 !== "" && sCurrentObject.Name1 !== undefined) || (sCurrentObject.Name2 !==
							"" && sCurrentObject.Name2 !== undefined) || (sCurrentObject.Name3 !== "" && sCurrentObject.Name3 !== undefined) ||
						(sCurrentObject.Name4 !== "" && sCurrentObject.Name4 !== undefined) ||
						(sCurrentObject.Sort1 !== "" && sCurrentObject.Sort1 !== undefined) || (sCurrentObject.Sort2 !== "" && sCurrentObject.Sort2 !==
							undefined) || (sCurrentObject.NameCo !== "" && sCurrentObject.NameCo !== undefined) || (sCurrentObject.PostCod1 !== "" &&
							sCurrentObject.PostCod1 !== undefined) || (sCurrentObject.City1 !== "" && sCurrentObject.City1 !== undefined) ||
						(sCurrentObject.Building !== "" && sCurrentObject.Building !== undefined) ||
						(sCurrentObject.Floor !== "" && sCurrentObject.Floor !== undefined) || (sCurrentObject.Roomnum !== "" && sCurrentObject.Roomnum !==
							undefined) || (sCurrentObject.AddrLocation !== "" && sCurrentObject.AddrLocation !== undefined) || (sCurrentObject.Strsuppl1 !==
							"" && sCurrentObject.Strsuppl1 !== undefined) || (sCurrentObject.Strsuppl2 !== "" && sCurrentObject.Strsuppl2 !== undefined) ||
						(sCurrentObject.Strsuppl3 !== "" && sCurrentObject.Strsuppl3 !== undefined) || (sCurrentObject.TimeZone !== "" &&
							sCurrentObject.TimeZone !== undefined) || (sCurrentObject.RefPosta !== "" && sCurrentObject.RefPosta !== undefined) || (
							sCurrentObject.Region !== "" && sCurrentObject.Region !== undefined)) {
						sCurrentObject.RefPostaLblReq = true;

						var sAddressModel = g.getView().getModel("flocAddressView");
						var sAddressData = sAddressModel.getData();
						sAddressData.enabled = sCurrentObject.IsEditable;
						if (type !== "Install" && tData[12].Property === "Adrnr" && tData[12].instLoc === true) {
							sAddressData.enabled = true;
						}
						sAddressModel.setData(sAddressData);
					}
					oJsonModel.setData(sCurrentObject);
					g.getView().setModel(oJsonModel, g.oModelName);
					g.getView().getModel(g.oModelName).refresh();
					g.lam.setModel(oJsonModel, "AIWLAM");

					var sCopyArray = [oJsonModel.getData()];
					var sSupFlocData = $.map(sCopyArray, function (obj) {
						return $.extend(true, {}, obj);
					});
					var sSupFlocModel = new JSONModel();
					sSupFlocModel.setData(sSupFlocData);
					g.getView().setModel(sSupFlocModel, "SUP_FLOC_DATA");

					var mSupFlocModel = sap.ui.getCore().getModel("SUP_FLOC_DATA");
					var mSupFlocData = mSupFlocModel.getData();
					var mCountFlocFlag = true;
					for (var se = 0; se < mSupFlocData.length; se++) {
						if (sCurrentObject.Functionallocation === mSupFlocData[se].Functionallocation) {
							mCountFlocFlag = false;
						}
					}
					if (mCountFlocFlag && sCurrentObject.SupFunctionallocation !== "" && sCurrentObject.SupFunctionallocation !== undefined) {
						mSupFlocData.push(sSupFlocData[0]);
						mSupFlocModel.setData(mSupFlocData);
					}

					// oMainData.viewBusy = false;
					// oMainModel.setData(oMainData);
					// return;
					break;
				}
			}

			oEvent.getSource().getParent().close();
			if (this.doiDisplayFlag) {
				this.doiDisplayFlag = false;
			}
		},

		onDOIActionPressChange: function (oEvent) {
			var g = this;
			var type = oEvent.getSource().getText();
			var oLocalModel = g.getView().getModel(g.oModelName);
			var localData = oLocalModel.getData();
			var sLocalVar = g.getView().getModel(g.oModelName).getData().Functionallocation;
			var tData = oEvent.getSource().getParent().getContent()[1].getModel().getData();
			var sObject = {};

			sObject = localData;

			if (type === "Install") {
				var currentHeader = g.flHeader;
				if (!tData[1].maintenance) {
					sObject.Location = currentHeader.StorFloc; // Location
					sObject.Locationdesc = currentHeader.Locationdesc; // Location Description
				}
				if (!tData[4].maintenance) {
					sObject.Abckz = currentHeader.Abckzfloc;
					sObject.Abctx = currentHeader.Abctx;
				}
				if (!tData[6].maintenance) { //if (!tData[9].maintenance) {
					sObject.Kostl = currentHeader.KostFloc; // Cost Center
					sObject.Mctxt = currentHeader.Contareaname; // Name
				}
				if (!tData[9].maintenance) { //if (!tData[14].maintenance) {
					sObject.Ingrp = currentHeader.Ingrp; // Planner Group
					sObject.Innam = currentHeader.Plannergrpdesc; // Planner Group Description
				}
				if (!tData[10].maintenance) { //if (!tData[15].maintenance) {
					sObject.MainArbpl = currentHeader.Gewrkfloc; // Main Work Center
					sObject.MainKtext = currentHeader.MainWcDesc; // Plant Work Center
					sObject.MainWerks = currentHeader.MainWcPlant; // Name
				}
				if (!tData[2].maintenance) {
					sObject.BeberFl = currentHeader.BeberFl; // Plant Section
					sObject.Fing = currentHeader.Fing; // Plant Section
					sObject.Tele = currentHeader.Tele; // Plant Section
				}
				if (tData[0].instLoc && currentHeader.Swerk !== "") {
					sObject.Maintplant = currentHeader.Swerk;
					sObject.MaintplantDesc = currentHeader.Name1;
					// sObject.MaintplantEnabled = false;
					sObject.Bukrs = currentHeader.Bukrsfloc;
					sObject.Butxt = currentHeader.Butxt;
					sObject.BukrsEnabled = false;
					sObject.Werks = currentHeader.PlntFloc; // Planning Plant
					sObject.Planningplantdes = currentHeader.Planningplantdes; // Planning Plant Description
					sObject.Kokrs = currentHeader.KokrFloc; // ccPart1
				}
				sObject.MaintplantEnabled = true;
				sObject.Stattext = currentHeader.Stattext;

				if (tData.length < 13) {
					var aDoiData = this.getView().getModel("dataOrigin").getData();
					tData.splice(0, 0, aDoiData[0]); //Maintainence plant DOI data
					tData.splice(8, 0, aDoiData[8]); //tData.splice(13, 0, aDoiData[13]); //Planning plant DOI data
					this.getView().getModel("dataOrigin").setData(tData);
				}

				if (!tData[12].maintenance) { //if (!tData[23].maintenance) {
					var sAddress = g.flAddr;
					if (sAddress) {
						if (sAddress.length > 0) {
							for (var j = 0; j < sAddress.length; j++) {
								if (sObject.Functionallocation === sAddress[j].Funcloc) {
									var oAddressModel = sap.ui.getCore().getModel("flocAddressView");
									var oAddressData = oAddressModel.getData();
									var mCountFlag = true;
									var sObj, sMatchIndex;
									if (oAddressData.length > 0) {
										for (var sa = 0; sa < oAddressData.length; sa++) {
											if (sObject.Functionallocation === oAddressData[sa].Functionallocation) {
												mCountFlag = false;
												sMatchIndex = sa;
												break;
											}
										}
									}
									if (mCountFlag && sObject.SupFunctionallocation !== "" && sObject.SupFunctionallocation !== undefined) {
										sObj = {
											Functionallocation: sObject.Functionallocation,
											IsEditable: sAddress[j].IsEditable
										};
										oAddressData.push(sObj);
										oAddressModel.setData(oAddressData);
									}
									if (!mCountFlag && sObject.SupFunctionallocation !== "" && sObject.SupFunctionallocation !== undefined) {
										oAddressData[sMatchIndex].Functionallocation = sObject.Functionallocation;
										oAddressData[sMatchIndex].IsEditable = sObject.IsEditable;
										oAddressModel.setData(oAddressData);
									}

									sObject.IsEditable = sAddress[j].IsEditable;
									sObject.Title = sAddress[j].Titletxt ? sAddress[j].Titletxt : "";
									sObject.TitleCode = sAddress[j].Title ? sAddress[j].Title : "";
									sObject.Name1 = sAddress[j].Name1 ? sAddress[j].Name1 : "";
									sObject.Name2 = sAddress[j].Name2 ? sAddress[j].Name2 : "";
									sObject.Name3 = sAddress[j].Name3 ? sAddress[j].Name3 : "";
									sObject.Name4 = sAddress[j].Name4 ? sAddress[j].Name4 : "";
									sObject.Sort1 = sAddress[j].Sort1 ? sAddress[j].Sort1 : "";
									sObject.Sort2 = sAddress[j].Sort2 ? sAddress[j].Sort2 : "";
									sObject.NameCo = sAddress[j].NameCo ? sAddress[j].NameCo : "";
									sObject.PostCod1 = sAddress[j].PostCod1 ? sAddress[j].PostCod1 : "";
									sObject.City1 = sAddress[j].City1 ? sAddress[j].City1 : "";
									sObject.Building = sAddress[j].Building ? sAddress[j].Building : "";
									sObject.Floor = sAddress[j].Floor ? sAddress[j].Floor : "";
									sObject.Roomnum = sAddress[j].Roomnum ? sAddress[j].Roomnum : "";
									sObject.Strsuppl1 = sAddress[j].Strsuppl1 ? sAddress[j].Strsuppl1 : "";
									sObject.Strsuppl2 = sAddress[j].Strsuppl2 ? sAddress[j].Strsuppl2 : "";
									sObject.Strsuppl3 = sAddress[j].Strsuppl3 ? sAddress[j].Strsuppl3 : "";
									sObject.AddrLocation = sAddress[j].Location ? sAddress[j].Location : "";
									sObject.RefPosta = sAddress[j].RPostafl ? sAddress[j].RPostafl : "";
									sObject.Landx = sAddress[j].Landx ? sAddress[j].Landx : "";
									sObject.TimeZone = sAddress[j].TimeZone ? sAddress[j].TimeZone : "";
									sObject.Region = sAddress[j].RPostFl ? sAddress[j].RPostFl : "";
									sObject.RegionDesc = sAddress[j].Regiotxt ? sAddress[j].Regiotxt : "";
								}
							}
						} else {
							sObject.Title = sObject.Title ? sObject.Title : "";
							sObject.TitleCode = sObject.TitleCode ? sObject.TitleCode : "";
							sObject.Name1 = sObject.Name1 ? sObject.Name1 : "";
							sObject.Name2 = sObject.Name2 ? sObject.Name2 : "";
							sObject.Name3 = sObject.Name3 ? sObject.Name3 : "";
							sObject.Name4 = sObject.Name4 ? sObject.Name4 : "";
							sObject.Sort1 = sObject.Sort1 ? sObject.Sort1 : "";
							sObject.Sort2 = sObject.Sort2 ? sObject.Sort2 : "";
							sObject.NameCo = sObject.NameCo ? sObject.NameCo : "";
							sObject.PostCod1 = sObject.PostCod1 ? sObject.PostCod1 : "";
							sObject.City1 = sObject.City1 ? sObject.City1 : "";
							sObject.Building = sObject.Building ? sObject.Building : "";
							sObject.Floor = sObject.Floor ? sObject.Floor : "";
							sObject.Roomnum = sObject.Roomnum ? sObject.Roomnum : "";
							sObject.Strsuppl1 = sObject.Strsuppl1 ? sObject.Strsuppl1 : "";
							sObject.Strsuppl2 = sObject.Strsuppl2 ? sObject.Strsuppl2 : "";
							sObject.Strsuppl3 = sObject.Strsuppl3 ? sObject.Strsuppl3 : "";
							sObject.AddrLocation = sObject.AddrLocation ? sObject.AddrLocation : "";
							sObject.RefPosta = sObject.RefPosta ? sObject.RefPosta : "";
							sObject.Landx = sObject.Landx ? sObject.Landx : "";
							sObject.TimeZone = sObject.TimeZone ? sObject.TimeZone : "";
							sObject.Region = sObject.Region ? sObject.Region : "";
							sObject.RegionDesc = sObject.RegionDesc ? sObject.RegionDesc : "";
						}

						sObject.intlAddr = g.flIntlAddr;
					}
				}

				var aFlLam = g.flLAM;
				if (aFlLam) {
					for (var x = 0; x < aFlLam.length; x++) {
						if (aFlLam[x].Funcloc === sObject.Functionallocation) {
							////////////// Superior FLOC has LAM data - start /////////////////////
							if (sObject.Functionallocation === sLocalVar && sObject.Floccategory === "L" && g.lamSwitch ===
								"X") {
								// sObject.lam = currentLAM;
								var tempIndex = x;
								var sMsg = "Superior object has been changed. Do you want to copy linear data from superior object?";
								sap.m.MessageBox.confirm(sMsg, {
									title: "Confirmation",
									onClose: function (oAction) {
										if (oAction === "OK") {
											var oFLLAM = {
												"Funcloc": aFlLam[tempIndex].Funcloc,
												"Lrpid": aFlLam[tempIndex].Lrpid,
												"LrpidDesc": aFlLam[tempIndex].LrpDescr,
												"Strtptatr": aFlLam[tempIndex].Strtptatr,
												"Endptatr": aFlLam[tempIndex].Endptatr,
												"Length": aFlLam[tempIndex].Length,
												"LinUnit": aFlLam[tempIndex].LinUnit,
												"LinUnitDesc": aFlLam[tempIndex].Uomtext,
												"Startmrkr": aFlLam[tempIndex].Startmrkr,
												"Endmrkr": aFlLam[tempIndex].Endmrkr,
												"Mrkdisst": aFlLam[tempIndex].Mrkdisst,
												"Mrkdisend": aFlLam[tempIndex].Mrkdisend,
												"MrkrUnit": aFlLam[tempIndex].MrkrUnit,
												"LamDer": aFlLam[tempIndex].LamDer
											};
											var mLocalModel = g.getView().getModel(g.oModelName);
											var sMdlData = mLocalModel.getData();
											sMdlData.lam = oFLLAM;
											mLocalModel.setData(sMdlData);
											g.lam.setModel(mLocalModel, "AIWLAM");
										}
									}
								});
								break;
							}
							////////////// Superior FLOC has LAM data - end /////////////////////
						}
					}
				}

				g.getView().getModel(g.oModelName).setData(sObject);
			} else {
				this.functionalLocation = "";
				this.functionalLocDesc = "";
				var sNamelocation = this.getView().byId("idLocation").getName();
				var sNameAbc = this.getView().byId("idAbcInd").getName();
				var sNamePlSec = this.getView().byId("idPlntSec").getName();
				var sNameWorkCen = this.getView().byId("idWorkCen").getName();
				var sNameCC = this.getView().byId("idCostCtr").getName();
				var sNamePlrGrp = this.getView().byId("idPlnGrp").getName();
				var sNameMWC = this.getView().byId("idMainWC").getName();
				for (var t = 0; t < tData.length; t++) {
					if (tData[t].Property === sNamelocation && !tData[t].instLoc) {
						sObject.Location = ""; //loc.setValue();
						sObject.Locationdesc = ""; //locDesc.setValue();
					} else if (tData[t].Property === sNameAbc && !tData[t].instLoc) {
						sObject.Abckz = ""; //abc.setValue();
						sObject.Abctx = ""; //abcDesc.setValue();
					} else if (tData[t].Property === sNamePlSec && !tData[t].instLoc) {
						sObject.BeberFl = "";
						sObject.Fing = "";
						sObject.Tele = "";
					} else if (tData[t].Property === sNameWorkCen && !tData[t].instLoc) {
						sObject.Arbpl = "";
						sObject.Ktext = "";
					} else if (tData[t].Property === sNameCC && !tData[t].instLoc) {
						sObject.Kostl = ""; //cost.setValue();
						sObject.Kokrs = ""; //costDesc.setValue();
					} else if (tData[t].Property === sNamePlrGrp && !tData[t].instLoc) {
						sObject.Ingrp = ""; //plGrp.setValue();
						sObject.Innam = ""; //plGrpDesc.setValue();
					} else if (tData[t].Property === sNameMWC && !tData[t].instLoc) {
						sObject.MainArbpl = ""; //mWc.setValue();
						sObject.MainWerks = ""; //wcPlant.setValue();
						sObject.MainKtext = ""; //wcDesc.setValue();
					} else if (tData[t].Property === "Adrnr") { // && !tData[t].instLoc
						if (g.getView().getModel("SUP_FLOC_DATA")) {
							var mSupFlocModel = sap.ui.getCore().getModel("SUP_FLOC_DATA");
							var mSupFlocData = mSupFlocModel.getData();
							var mSupFlocIndex;
							for (var a = 0; a < mSupFlocData.length; a++) {
								if (oEvent.getSource().getModel(g.oModelName).getData().Functionallocation === mSupFlocData[a].Functionallocation) {
									mSupFlocIndex = a;
									break;
								}
							}
							// var localModel = g.getView().getModel(g.oModelName);
							// var localData = localModel.getData();
							var sSupFlocData = g.getView().getModel("SUP_FLOC_DATA").getData()[0];
							if (sSupFlocData) {
								sObject.Title = "";
								sObject.TitleCode = "";
								sObject.Name1 = "";
								sObject.Name2 = "";
								sObject.Name3 = "";
								sObject.Name4 = "";
								sObject.Sort1 = "";
								sObject.Sort2 = "";
								sObject.NameCo = "";
								sObject.PostCod1 = "";
								sObject.City1 = "";
								sObject.Building = "";
								sObject.Floor = "";
								sObject.Roomnum = "";
								sObject.Strsuppl1 = "";
								sObject.Strsuppl2 = "";
								sObject.Strsuppl3 = "";
								sObject.AddrLocation = "";
								sObject.RefPosta = "";
								sObject.Landx = "";
								sObject.TimeZone = "";
								sObject.Region = "";
								sObject.RegionDesc = "";
								sObject.RefPostaLblReq = false;

								var mAddressModel = sap.ui.getCore().getModel("flocAddressView");
								var mAddressData = mAddressModel.getData();
								for (var as = 0; as < mAddressData.length; as++) {
									if (sObject.Functionallocation === mAddressData[as].Functionallocation) {
										mAddressData.splice(as, 1);
										mAddressModel.setData(mAddressData);
										break;
									}
								}

								var sAddressModel = g.getView().getModel("flocAddressView");
								var sAddressData = sAddressModel.getData();
								sAddressData.enabled = true;
								sAddressModel.setData(sAddressData);

								mSupFlocData.splice(mSupFlocIndex, 1);
								mSupFlocModel.setData(mSupFlocData);
							}
						}

						sObject.intlAddr = [];
					}
				}

				if (tData[10].Property === "Adrnr" && tData[10].instLoc === true) { //if (tData[23].Property === "Adrnr" && tData[23].instLoc === true) {
					var sAddressModel = g.getView().getModel("flocAddressView");
					var sAddressData = sAddressModel.getData();
					sAddressData.enabled = true;
					sAddressModel.setData(sAddressData);

					sap.ui.getCore().getModel("flocAddressView").getData().forEach(function (item) {
						if (item.Functionallocation === sObject.Functionallocation) {
							item.IsEditable = true;
						}
					});
				}

				sObject.MaintplantEnabled = true;
				g.getView().getModel(g.oModelName).setData(sObject);
				g.getView().getModel(g.oModelName).refresh();
				// aAIWFLOC[aiwIndex] = sObject;
				// oAIWFLOCModel.setData(aAIWFLOC);
				this.readSystemStatus(g);
			}

			if (tData.length < 13) {
				var aDoiData = this.getView().getModel("dataOrigin").getData();
				tData.splice(0, 0, aDoiData[0]); //Maintainence plant DOI data
				tData.splice(8, 0, aDoiData[8]); //tData.splice(13, 0, aDoiData[13]); //Planning plant DOI data
				this.getView().getModel("dataOrigin").setData(tData);
			}
			this.getView().getModel("dataOrigin").setData(tData);

			oEvent.getSource().getParent().close();

			if (this.doiDisplayFlag) {
				this.doiDisplayFlag = false;
			}
		},

		onDonePress: function (oEvent) {
			var g = this;
			g.doneFlag = true;
			var stateErrFlag, cityErrFlag;
			var sSourceId = oEvent.getSource().getId();
			if (g.viewName === "CreateFloc" || g.oModelUpdateFlag === true) {
				g.handleValueState("Functionallocation", "FunctionallocationVS", oEvent);
				g.handleValueState("Flocdescription", "FlocdescriptionVS", oEvent);
				g.handleValueState("Floccategory", "FloccategoryVS", oEvent);
				g.handleValueState("Strucindicator", "StrucindicatorVS", oEvent);

				var oAIWModel = g.getView().getModel(g.oModelName);
				var oAIWData = oAIWModel.getData();
				if ((oAIWData.Title !== "" && oAIWData.Title !== undefined) || (oAIWData.TitleCode !== "" && oAIWData.TitleCode !== undefined) ||
					(oAIWData.Name1 !== "" && oAIWData.Name1 !== undefined) || (oAIWData.Name2 !== "" && oAIWData.Name2 !== undefined) || (oAIWData.Name3 !==
						"" && oAIWData.Name3 !== undefined) || (oAIWData.Name4 !== "" && oAIWData.Name4 !== undefined) ||
					(oAIWData.Sort1 !== "" && oAIWData.Sort1 !== undefined) || (oAIWData.Sort2 !== "" && oAIWData.Sort2 !== undefined) || (oAIWData.NameCo !==
						"" && oAIWData.NameCo !== undefined) || (oAIWData.PostCod1 !== "" && oAIWData.PostCod1 !== undefined) || (oAIWData.City1 !== "" &&
						oAIWData.City1 !== undefined) || (oAIWData.Building !== "" && oAIWData.Building !== undefined) ||
					(oAIWData.Floor !== "" && oAIWData.Floor !== undefined) || (oAIWData.Roomnum !== "" && oAIWData.Roomnum !== undefined) || (
						oAIWData.AddrLocation !== "" && oAIWData.AddrLocation !== undefined) || (oAIWData.Strsuppl1 !== "" && oAIWData.Strsuppl1 !==
						undefined) || (oAIWData.Strsuppl2 !== "" && oAIWData.Strsuppl2 !== undefined) ||
					(oAIWData.Strsuppl3 !== "" && oAIWData.Strsuppl3 !== undefined) || (oAIWData.TimeZone !== "" && oAIWData.TimeZone !== undefined) ||
					(oAIWData.RefPosta !== "" && oAIWData.RefPosta !== undefined) || (oAIWData.Region !== "" && oAIWData.Region !== undefined)) {
					g.handleValueState("RefPosta", "RefPostaVS", oEvent);

					var aIntlItems = this.getView().byId("idTBLIntlAddr").getItems();
					for (var z = 0; z < aIntlItems.length; z++) {
						var aItemCells = aIntlItems[z].getCells();
						for (var y = 0; y < aItemCells.length; y++) {
							if (aItemCells[3].getValueState() === "Error") {
								stateErrFlag = true;
							}
							if (aItemCells[4].getValueState() === "Error") {
								cityErrFlag = true;
							}
						}
					}
				}
			}

			if (g.doneFlag === false) {
				var mandMsg = g.getView().getModel("i18n").getProperty("MANDMSG");
				g.invokeMessage(mandMsg);
				return;
			} else if (stateErrFlag || cityErrFlag) {
				var aMsgs = [];
				if (stateErrFlag) {
					aMsgs.push("Enter valid state");
				}
				if (cityErrFlag) {
					aMsgs.push("Enter valid city");
				}
				var sMsg = aMsgs.join("\n");
				g.invokeMessage(sMsg);
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
				if (this.lnrChData) {
					var aFLLinChar = this.lnrChData;
					if (aFLLinChar !== null && aFLLinChar !== undefined && aFLLinChar.length > 0) {
						sAIWData.linearChar = [];
						for (var b = 0; b < aFLLinChar.length; b++) {
							sAIWData.linearChar.push(aFLLinChar[b]);
						}
					}
					sAIWModel.setData(sAIWData);
				}
				// if (g.char.getModel()) {
				// 	var sCharData = g.char.getModel().getData();
				// 	if (sCharData) {
				// 		sAIWData.characteristics = [];
				// 		for (var b = 0; b < sCharData.length; b++) {
				// 			sAIWData.characteristics.push(sCharData[b]);
				// 		}
				// 		sAIWModel.setData(sAIWData);
				// 	}
				// }

				if (sSourceId.indexOf("idBtnCheck") > -1) {
					this.validateCheck();
					return;
				}

				this.chData = [];
				this.lnrChData = [];

				if (g.viewName === "CreateFloc") {
					var sDOIexistFlag = false;
					var aDOIFL = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
					for (var x = 0; x < aDOIFL.length; x++) {
						if (aDOIFL[x].key === g.getView().getModel(g.oModelName).getData().Functionallocation) {
							sap.ui.getCore().getModel("dataOriginMOP").getData().FL[x].DOI = g.getView().getModel("dataOrigin").getData();
							sDOIexistFlag = true;
							break;
						}
					}

					if (!sDOIexistFlag) {
						var currentIndex = this.rowIndex.split("/")[1];
						sap.ui.getCore().getModel("dataOriginMOP").getData().FL[currentIndex] = {
							key: g.getView().getModel(g.oModelName).getData().Functionallocation,
							DOI: g.getView().getModel("dataOrigin").getData()
						};
						// sap.ui.getCore().getModel("dataOriginMOP").getData().FL.push({
						// 	key: g.getView().getModel(g.oModelName).getData().Functionallocation,
						// 	DOI: g.getView().getModel("dataOrigin").getData()
						// });
					}

					this.dataDerivationFlow();
					var deriveFlag = true;
				}

				if (g.oModelUpdateFlag && !g.sExistFlag) {
					var sJsonModel = sap.ui.getCore().getModel(g.oModelName).getData();
					g.getView().getModel(g.oModelName).getData().viewParameter = "change";
					sJsonModel.push(g.getView().getModel(g.oModelName).getData());

					sap.ui.getCore().getModel("dataOriginMOP").getData().FL.push({
						key: g.getView().getModel(g.oModelName).getData().Functionallocation,
						DOI: g.getView().getModel("dataOrigin").getData()
					});
				}
				sap.ui.getCore().getModel(g.oModelName).refresh();
				g.currentFragment = undefined;
				g.rowIndex = undefined;

				if (this.doiView) { // Destroy main DOI fragment instance
					this.doiView.destroy();
					sap.ui.getCore().byId("il").destroy();
					sap.ui.getCore().byId("eq").destroy();
					sap.ui.getCore().byId("currVal").destroy();
					sap.ui.getCore().byId("targetVal").destroy();
					// sap.ui.getCore().byId("installer").destroy();
					// sap.ui.getCore().byId("installerVal").destroy();
					// sap.ui.getCore().byId("installerValDesc").destroy();
					// sap.ui.getCore().byId("currObjLbl").destroy();
					// sap.ui.getCore().byId("currObjVal").destroy();
					// sap.ui.getCore().byId("currObjValDesc").destroy();
					this.doiView = undefined;
				}

				if (this.dataOriginFrag) { // Destroy element DOI fragment instance
					this.dataOriginFrag.destroy();
					this.dataOriginFrag = undefined;
				}

				if (!deriveFlag) {
					var sPreviousHash = History.getInstance().getPreviousHash();
					if (sPreviousHash !== undefined) {
						history.go(-1);
					} else {
						g.getRouter().navTo("main", {}, true);
					}
				} else {
					deriveFlag = false;
				}
			}
		},

		validateCheck: function () {
			var g = this;
			// var sAIWData = g.getView().getModel(g.oModelName).getData();
			var currentFuncLoc = this.getView().getModel("AIWFLOC").getData().Functionallocation;
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
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
				"FLALTLBEL": [],
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
				"OLVal": [],
				"FLLAMCH": [],
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
						"Adrnr": AIWFLOCModel[a].Adrnr,
						"Adrnri": AIWFLOCModel[a].Adrnri,
						"Deact": AIWFLOCModel[a].Deact,
						Modeldesc: AIWFLOCModel[a].Modeldesc,
						Modelref: AIWFLOCModel[a].Modelref,
						Modelrver: AIWFLOCModel[a].Modelrver,
						Modelext: AIWFLOCModel[a].Modelext,
						Modelname: AIWFLOCModel[a].Modelname,
						Modelver: AIWFLOCModel[a].Modelver,

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

					if (AIWFLOCModel[a].altlbl) {
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

					if (AIWFLOCModel[a].Functionallocation === currentFuncLoc) {
						var sFLCharList = this.chData;
					} else {
						var sFLCharList = AIWFLOCModel[a].characteristics;
					}
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

					if (AIWFLOCModel[a].Functionallocation === currentFuncLoc) {
						var aFLLinChar = this.lnrChData;
					} else {
						var aFLLinChar = AIWFLOCModel[a].linearChar;
					}
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Funcloc = AIWFLOCModel[a].Functionallocation;
								sPayload.FLLAMCH.push(alinearChar[c]);
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

			// var sAIWData = g.getView().getModel(g.oModelName).getData();
			// var sFuncLoc = {
			// 	"Tplnr": sAIWData.Functionallocation,
			// 	"Txtmi": sAIWData.Flocdescription, // Floc Description
			// 	"TplkzFlc": sAIWData.Strucindicator,
			// 	"Tplxt": sAIWData.StrucIndicatorDesc,
			// 	"EditMask": sAIWData.EditMask,
			// 	"Hierarchy": sAIWData.Hierarchy,
			// 	"Fltyp": sAIWData.Floccategory,
			// 	"Flttx": sAIWData.FlocCategoryDesc,
			// 	"Swerk": sAIWData.Maintplant,
			// 	"Plantname": sAIWData.MaintplantDesc,
			// 	"StorFloc": sAIWData.Location, // Location
			// 	"Locationdesc": sAIWData.Locationdesc, // Location Description
			// 	"Abckzfloc": sAIWData.Abckz,
			// 	"Abctx": sAIWData.Abctx,
			// 	"Bukrsfloc": sAIWData.Bukrs,
			// 	"Butxt": sAIWData.Butxt,
			// 	"City": sAIWData.City,
			// 	"KostFloc": sAIWData.Kostl, // Cost Center
			// 	"KokrFloc": sAIWData.Kokrs, // ccPart1
			// 	"Contareaname": sAIWData.Mctxt, // Name
			// 	"PlntFloc": sAIWData.Werks, // Planning Plant
			// 	"Planningplantdes": sAIWData.Planningplantdes, // Planning Plant Description
			// 	"Ingrp": sAIWData.Ingrp, // Planner Group
			// 	"Plannergrpdesc": sAIWData.Innam, // Planner Group Description
			// 	"Arbplfloc": sAIWData.Arbpl, // Work Center
			// 	// "Workcenterdesc" : sAIWData.Ktext, // Plant Work Center
			// 	"Wergwfloc": sAIWData.WcWerks, // Name
			// 	"Gewrkfloc": sAIWData.MainArbpl, // Main Work Center
			// 	// "MainWcDesc" : sAIWData.MainKtext, // Work center Plant
			// 	"MainWcPlant": sAIWData.MainWerks, // Work Center Description
			// 	"Tplma": sAIWData.SupFunctionallocation, // Sup FuncLoc
			// 	"Supflocdesc": sAIWData.SupFlocdescription, // Sup FlocDescription
			// 	"BeberFl": sAIWData.BeberFl, // Plant Section
			// 	"Fing": sAIWData.Fing, // Person responsible
			// 	"Tele": sAIWData.Tele, // Phone
			// 	"Submtiflo": sAIWData.ConstrType, // Construction Type
			// 	"Constdesc": sAIWData.ConstructionDesc, // Construction Description
			// 	"Eqart": sAIWData.TechnicalObjectTyp, // TechnicalObjectTyp
			// 	"Eartx": sAIWData.Description, // TechnicalObjectTyp Description
			// 	"Stattext": sAIWData.Stattext, // System Status
			// 	"StsmFloc": sAIWData.StsmEqui, // Status Profile
			// 	"Statproftxt": sAIWData.StsmEquiDesc, // Status Profile Description
			// 	"UstwFloc": sAIWData.UstwEqui, // Status with Status Number
			// 	"UswoFloc": sAIWData.UswoEqui, // Status without Status Number
			// 	"UstaFloc": sAIWData.UstaEqui, // User Status
			// 	"Adrnri": sAIWData.Adrnri,
			// 	"Deact": sAIWData.Deact
			// };
			// sPayload.FuncLoc.push(sFuncLoc);

			// var sFLAddr = {
			// 	"Funcloc": sAIWData.Functionallocation,
			// 	"Title": sAIWData.TitleCode,
			// 	"Name1": sAIWData.Name1,
			// 	"Name2": sAIWData.Name2,
			// 	"Name3": sAIWData.Name3,
			// 	"Name4": sAIWData.Name4,
			// 	"Sort1": sAIWData.Sort1,
			// 	"Sort2": sAIWData.Sort2,
			// 	"NameCo": sAIWData.NameCo,
			// 	"PostCod1": sAIWData.PostCod1,
			// 	"City1": sAIWData.City1,
			// 	"Building": sAIWData.Building,
			// 	"Floor": sAIWData.Floor,
			// 	"Roomnum": sAIWData.Roomnum,
			// 	"Strsuppl1": sAIWData.Strsuppl1,
			// 	"Strsuppl2": sAIWData.Strsuppl2,
			// 	"Strsuppl3": sAIWData.Strsuppl3,
			// 	"Location": sAIWData.AddrLocation,
			// 	"RPostafl": sAIWData.RefPosta,
			// 	"Landx": sAIWData.Landx,
			// 	"TimeZone": sAIWData.TimeZone,
			// 	"RPostFl": sAIWData.Region,
			// 	"Regiotxt": sAIWData.RegionDesc
			// };
			// sPayload.FLAddr.push(sFLAddr);

			// var aIntlAddr = sAIWData.intlAddr;
			// if (aIntlAddr.length > 0) {
			// 	for (var z = 0; z < aIntlAddr.length; z++) {
			// 		sPayload.FLAddrI.push(aIntlAddr[z]);
			// 	}
			// }

			// if (g.AltLblDerv === "2" && sAIWData.altlbl.length > 0) {
			// 	for (var y = 0; y < sAIWData.altlbl.length; y++) {
			// 		var oAltLbl = {
			// 			"Funcloc": sAIWData.Functionallocation,
			// 			"AltAlkey": sAIWData.altlbl[y].AltAlkey,
			// 			"AltStrno": sAIWData.altlbl[y].AltStrno,
			// 			"AltTplkz": sAIWData.altlbl[y].AltTplkz
			// 		};
			// 		sPayload.FLALTLBEL.push(oAltLbl);
			// 	}
			// }

			// if (sAIWData.Floccategory === "L") {
			// 	var sFLLAM = {
			// 		"Funcloc": sAIWData.Functionallocation,
			// 		"Lrpid": sAIWData.lam.Lrpid,
			// 		"Strtptatr": sAIWData.lam.Strtptatr,
			// 		"Endptatr": sAIWData.lam.Endptatr,
			// 		"Length": (sAIWData.lam.Length).toString(),
			// 		"LinUnit": sAIWData.lam.LinUnit,
			// 		"Startmrkr": sAIWData.lam.Startmrkr,
			// 		"Endmrkr": sAIWData.lam.Endmrkr,
			// 		"Mrkdisst": sAIWData.lam.Mrkdisst,
			// 		"Mrkdisend": sAIWData.lam.Mrkdisend,
			// 		"MrkrUnit": sAIWData.lam.MrkrUnit
			// 	};
			// 	sPayload.FLLAM.push(sFLLAM);
			// }

			// var sFLClassList = sAIWData.classItems;
			// if (sFLClassList) {
			// 	if (sFLClassList.length > 0) {
			// 		for (var b = 0; b < sFLClassList.length; b++) {
			// 			var sFLClass = {
			// 				"Funcloc": sAIWData.Functionallocation,
			// 				"Classtype": sFLClassList[b].Classtype,
			// 				"Class": sFLClassList[b].Class,
			// 				"Clstatus1": sFLClassList[b].Clstatus1
			// 			};
			// 			sPayload.FLClass.push(sFLClass);
			// 		}
			// 	}
			// }

			// var sFLCharList = sAIWData.characteristics;
			// if (sFLCharList) {
			// 	if (sFLCharList.length > 0) {
			// 		for (var c = 0; c < sFLCharList.length; c++) {
			// 			var sFLVal = {
			// 				"Funcloc": sAIWData.Functionallocation,
			// 				"Atnam": sFLCharList[c].Atnam,
			// 				"Textbez": sFLCharList[c].Textbez,
			// 				"Atwrt": sFLCharList[c].Atwrt,
			// 				"Class": sFLCharList[c].Class
			// 			};
			// 			sPayload.FLVal.push(sFLVal);
			// 		}
			// 	}
			// }

			this.getView().byId("flocPage").setBusy(true);
			var oModel = this.getView().getModel();
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
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("flocPage").setBusy(false);
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
					g.getView().byId("flocPage").setBusy(false);
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
			} else { //if (Array.isArray(msg))
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

		////////// Alternate Label functions ///////////////
		handleAltLblAdd: function () {
			var data = this.getView().getModel(this.oModelName).getData();
			if (this.oModelName === "AIWFLOC") {
				var oAltLbl = {
					"Funcloc": data.Functionallocation,
					"AltAlkey": "", // Labeling system
					"Altxt": "", // Labeling system descr
					"AltStrno": "", // Alternative Label
					"AltTplkz": "", // Strycture Indicator
					"Tplxt": "", // Structure Indicator Descr
					"Name1i": "", // Edit Mask
					"Actvs": false, // Active
					"AltPrkey": false, // Primary
					"AltReuse": false, // Reusable

					"enableLblSys": true,
					"enableAltLbl": true,
					"enableStrInd": true,

					"LblSysVS": "None",
					"AltLblVS": "None",
					"StrIndVS": "None"
				};
			}

			data.altlbl.push(oAltLbl);
			this.getView().getModel(this.oModelName).refresh();
		},

		handleAltLblDelete: function (oEvent) {
			var g = this;
			var path = oEvent.getParameter('listItem').getBindingContext(this.oModelName).sPath;
			path = path.substring(path.lastIndexOf('/') + 1);

			var aAltLbl = oEvent.getSource().getModel(this.oModelName).getData().altlbl;
			aAltLbl.splice(path, 1);

			this.getView().getModel(this.oModelName).refresh();
		},

		onLblSysVH: function (oEvent) {
			ValueHelpRequest.LblSysVH(oEvent, this);
		},

		onStrIndAltLblVH: function (oEvent) {
			ValueHelpRequest.StrIndAltLblVH(oEvent, this);
		},

		onLblSysChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue !== "" && sValue !== undefined) {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeLblSys(oEvent, g);
			}
		},

		onStrIndAltLblChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue !== "" && sValue !== undefined) {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeStrIntAltLbl(oEvent, g);
			}
		},

		onAltLblChange: function (oEvent) {
			var g = this;
			var value = oEvent.getSource().getValue();
			var sBindPath = oEvent.getSource().getBindingInfo("value").binding.getContext().sPath;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			if (value !== "") {
				var a = value.toUpperCase();
				oEvent.getSource().setValue(a);
				this.validateAltLabel(sBindPath, oJsonModel);
			} else {
				oJsonModel.getProperty(sBindPath).AltLblVS = "None";
				oJsonModel.setData(oJsonData);
			}
		},

		validateAltLabel: function (sBindPath, oJsonModel) {
			var g = this;
			var that = this;
			var sAltLbl = oJsonModel.getProperty(sBindPath).AltStrno;
			var sStrInd = oJsonModel.getProperty(sBindPath).AltTplkz;
			var sStrIndDesc = oJsonModel.getProperty(sBindPath).Tplxt;
			var sAltAlkey = oJsonModel.getProperty(sBindPath).AltAlkey;
			// var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			if (sAltLbl !== "" && sStrInd !== "") {
				var sPath = "/FLALTLBELSet(AltStrno='" + sAltLbl + "',AltTplkz='" + sStrInd + "')";
				// var oFilters = [new sap.ui.model.Filter("AltStrno", "EQ", sAltLbl), new sap.ui.model.Filter("AltTplkz", "EQ", sStrInd)];
				var oModel = g.getView().getModel();
				oModel.read(sPath, {
					success: function (d) {
						// if (d.results.length > 0) {
						// 	oJsonModel.getProperty(sBindPath).AltTplkz = d.results[0].StrucIndicator;
						// 	oJsonModel.getProperty(sBindPath).Tplxt = d.results[0].StrucIndicatorDesc;
						// 	oJsonModel.getProperty(sBindPath).Name1i = d.results[0].EditMask;
						// 	oJsonModel.getProperty(sBindPath).StrIndVS = "None";
						// } else {
						// 	oJsonModel.getProperty(sBindPath).StrIndVS = "Error";
						// 	oJsonModel.getProperty(sBindPath).Tplxt = "";
						// 	oJsonModel.getProperty(sBindPath).Name1i = "";
						// }
						oJsonModel.getProperty(sBindPath).AltLblVS = "None";

						if (sAltAlkey === "1") { // Alt_Label system 1 should update Floc name
							var aDOIFL = sap.ui.getCore().getModel("dataOriginMOP").getData().FL;
							for (var x = 0; x < aDOIFL.length; x++) {
								if (aDOIFL[x].key === oJsonData.Functionallocation) {
									aDOIFL[x].key = sAltLbl;
									break;
								}
							}
							oJsonData.Functionallocation = sAltLbl;
							oJsonData.Strucindicator = sStrInd;
							oJsonData.StrucIndicatorDesc = sStrIndDesc;
							if (oJsonData.lam) {
								oJsonData.lam.Funcloc = sAltLbl;
							}
							if (oJsonData.altlbl) {
								oJsonData.altlbl.forEach(function (item) {
									item.Funcloc = sAltLbl;
								});
							}
							if (oJsonData.intlAddr) {
								oJsonData.intlAddr.forEach(function (item) {
									item.Funcloc = sAltLbl;
								});
							}
						}
						oJsonModel.refresh();
					},
					error: function (e) {
						var b = JSON.parse(e.responseText);
						var d = b.error.message.value;
						sap.m.MessageBox.show(d, {
							title: "Error",
							icon: sap.m.MessageBox.Icon.ERROR,
							onClose: function () {}
						});
						oJsonModel.getProperty(sBindPath).AltLblVS = "Error";
						oJsonModel.refresh();
					}
				});
			}
		},

		onLblSysLiveChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === " ") {
				oEvent.getSource().setValue("");
			}
			if (sValue === "") {
				var sBindPath = oEvent.getSource().getBindingInfo("value").binding.getContext().sPath;
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				oJsonModel.getProperty(sBindPath).Altxt = "";
				oJsonModel.setData(oJsonData);
			}
			oEvent.getSource().setValueState("None");
		},

		onStrIndAltLblLiveChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === " ") {
				oEvent.getSource().setValue("");
			}
			if (sValue === "") {
				var sBindPath = oEvent.getSource().getBindingInfo("value").binding.getContext().sPath;
				var oJsonModel = g.getView().getModel(g.oModelName);
				var oJsonData = oJsonModel.getData();
				oJsonModel.getProperty(sBindPath).Tplxt = "";
				oJsonModel.getProperty(sBindPath).Name1i = "";
				oJsonModel.setData(oJsonData);
			}
			oEvent.getSource().setValueState("None");
		},

		validateLabelSystem: function (p, data) {
			var g = this;
			var sIntlIndex = parseInt(p.split("/")[2]);
			var existFlag = false;

			var aAltLbl = data.altlbl;
			for (var i = 0; i < aAltLbl.length; i++) {
				if (i === sIntlIndex) {
					continue;
				}

				if (aAltLbl[i].AltAlkey === aAltLbl[sIntlIndex].AltAlkey) {
					existFlag = true;
					sap.m.MessageBox.show("There is already an entry with the same key information", {
						title: "Error",
						icon: sap.m.MessageBox.Icon.ERROR,
						onClose: function () {
							aAltLbl[sIntlIndex].AltAlkey = "";
							aAltLbl[sIntlIndex].Altxt = "";
							aAltLbl[sIntlIndex].LblSysVS = "None";
							g.getView().getModel(g.oModelName).refresh();
						}
					});
					break;
				}
			}

			if (!existFlag) {
				aAltLbl[sIntlIndex].enableLblSys = false;
				aAltLbl[sIntlIndex].LblSysVS = "None";
				g.getView().getModel(g.oModelName).refresh();
			}
		},

		/**
		 * Triggered on press of Data Origin button at element level
		 * @function
		 * @public
		 * @param {sap.ui.base.Event} oEvent the press event
		 */
		onDataOriginPress: function (oEvent) {
			var g = this;

			// this.dataOriginFrag = this.getDOIElementFrag();
			if (!this.dataOriginFrag) {
				this.dataOriginFrag = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DOIElement", this);
			}

			var oDoiElement = {
				flocVisible: true,
				equiVisible: true,
				parent: "",
				parentDesc: "",
				parentSelected: false,
				IndvSelected: false,
				currentObj: "",
				currentObjDesc: "",
				DOIindex: null
			};
			var mDoiElement = new JSONModel(oDoiElement);
			this.dataOriginFrag.setModel(mDoiElement, "doiElement");
			// this.getView().setModel(doiElementModel, "doiElement");

			var aData = this.getView().getModel(this.oModelName).getData();
			var aDOIdata = this.getView().getModel("dataOrigin").getData();

			oDoiElement.flocVisible = true;
			oDoiElement.equiVisible = false;

			var oSource = oEvent.getSource(),
				dataOriginInput,
				dataOrgFlocInp = this.dataOriginFrag.getContent()[0].getContent()[1],
				dataOrgFlocCheck = this.dataOriginFrag.getContent()[0].getContent()[2],
				dataOrgEquiInp = this.dataOriginFrag.getContent()[0].getContent()[4],
				dataOrgEquiCheck = this.dataOriginFrag.getContent()[0].getContent()[5],
				dataOrgIndvInp = this.dataOriginFrag.getContent()[0].getContent()[7],
				dataOrgIndvCheck = this.dataOriginFrag.getContent()[0].getContent()[8];

			dataOrgIndvInp.mEventRegistry.valueHelpRequest = [];
			if (oSource.getId().includes("MaintenancePlant")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("MAINT_PLANT"));
				dataOriginInput = this.getView().byId("idMaintenancePlant").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					this.onMaintPlantVH("idMaintenancePlant", e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[0].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[0].Txtmi;
				oDoiElement.DOIindex = 0;
				if (aDOIdata[0].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[0].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			} else if (oSource.getId().includes("Location")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("LOC"));
				dataOriginInput = this.getView().byId("idLocation").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					ValueHelpRequest.onDOILocationVH(g, e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[1].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[1].Txtmi;
				oDoiElement.DOIindex = 1;
				if (aDOIdata[1].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[1].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			} else if (oSource.getId().includes("abcInd")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("ABC_IND"));
				dataOriginInput = this.getView().byId("idAbcInd").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					ValueHelpRequest.onDOIabcIndVH(g, e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[4].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[4].Txtmi;
				oDoiElement.DOIindex = 4;
				if (aDOIdata[4].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[4].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			} else if (oSource.getId().includes("PlantSec")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("PL_SEC"));
				dataOriginInput = this.getView().byId("idPlntSec").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					ValueHelpRequest.onDOIPlantSecVH(g, e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[2].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[2].Txtmi;
				oDoiElement.DOIindex = 2;
				if (aDOIdata[2].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[2].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			} else if (oSource.getId().includes("WorkCen")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("WC"));
				dataOriginInput = this.getView().byId("idWorkCen").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					ValueHelpRequest.onDOIMainwcVH(g, e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[3].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[3].Txtmi;
				oDoiElement.DOIindex = 3;
				if (aDOIdata[3].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[3].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			} else if (oSource.getId().includes("CostCenter")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("CC"));
				dataOriginInput = this.getView().byId("idCostCtr").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					ValueHelpRequest.onDOICostCenterVH(g, e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[6].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[6].Txtmi;
				oDoiElement.DOIindex = 6;
				if (aDOIdata[6].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[6].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			} else if (oSource.getId().includes("PlanPlant")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("PLAN_PLANT_TXT"));
				dataOriginInput = this.getView().byId("idPlnPlnt").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					ValueHelpRequest.onDOIPlanPlantVH(g, e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[8].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[8].Txtmi;
				oDoiElement.DOIindex = 8;
				if (aDOIdata[8].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[8].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			} else if (oSource.getId().includes("PlanGrp")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("PL_GRP"));
				dataOriginInput = this.getView().byId("idPlnGrp").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					ValueHelpRequest.onDOIPlanrGrpVH(g, e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[9].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[9].Txtmi;
				oDoiElement.DOIindex = 9;
				if (aDOIdata[9].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[9].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			} else if (oSource.getId().includes("MainWC")) {
				this.dataOriginFrag.setTitle("Data Orgin - " + this.getView().getModel("i18n").getProperty("mainWorkCenter"));
				dataOriginInput = this.getView().byId("idMainWC").getValue();
				dataOrgIndvInp.setShowValueHelp(true);
				dataOrgIndvInp.attachValueHelpRequest(function (e) {
					ValueHelpRequest.onDOIMainwcVH(g, e);
				});
				if (dataOriginInput === "") {
					dataOrgFlocInp.setEnabled(false);
					dataOrgFlocCheck.setEnabled(false);
					dataOrgEquiInp.setEnabled(false);
					dataOrgEquiCheck.setEnabled(false);
				}

				oDoiElement.parent = aDOIdata[10].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[10].Txtmi;
				oDoiElement.DOIindex = 10;
				if (aDOIdata[10].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[10].instLoc === true) {
					oDoiElement.parentSelected = true;
					oDoiElement.IndvSelected = false;
				}
			}

			if (oDoiElement.parent === "") {
				dataOrgFlocCheck.setEnabled(false);
				dataOrgEquiCheck.setEnabled(false);
			} else {
				dataOrgFlocCheck.setEnabled(true);
				dataOrgEquiCheck.setEnabled(true);
			}

			oDoiElement.currentObj = dataOriginInput;
			mDoiElement = new JSONModel(oDoiElement);
			this.dataOriginFrag.setModel(mDoiElement, "doiElement");

			this.dataOriginFrag.open();
		},

		/**
		 * 'Select'event handler for Parent/Individual check boxes in DOI Element dialog
		 * @function
		 * @public
		 * @param {sap.ui.base.Event} oEvent the press event
		 */
		onCheckSelect: function (oEvent) {
			var sSourceId = oEvent.getSource().getId();
			var mDoiElement = this.dataOriginFrag.getModel("doiElement");
			var oDoiElement = mDoiElement.getData();

			if (sSourceId.includes("IndvMaint")) {
				oDoiElement.parentSelected = false;
				oDoiElement.IndvSelected = true;
			} else {
				oDoiElement.parentSelected = true;
				oDoiElement.IndvSelected = false;
			}
			this.dataOriginFrag.setModel(mDoiElement, "doiElement");
		},

		/**
		 * Triggered on press of INSTALL in DOI Element dialog
		 * @function
		 * @public
		 * @param {sap.ui.base.Event} oEvent the press event
		 */
		onElementActionPress: function (oEvent) {
			var sValue, sDesc, sDesc2;
			var mDoiElement = this.dataOriginFrag.getModel("doiElement");
			var oDoiElement = mDoiElement.getData();

			var aData = this.getView().getModel(this.oModelName).getData();
			var aDOIdata = this.getView().getModel("dataOrigin").getData();

			if (oDoiElement.IndvSelected) {
				aDOIdata[oDoiElement.DOIindex].instLoc = false;
				aDOIdata[oDoiElement.DOIindex].maintenance = true;
				aDOIdata[oDoiElement.DOIindex].currentVal = oDoiElement.currentObj;
				sValue = oDoiElement.currentObj;
				sDesc = oDoiElement.currentObjDesc;
				sDesc2 = oDoiElement.currentObjDesc2 !== undefined ? oDoiElement.currentObjDesc2 : "";
			} else if (oDoiElement.parentSelected) {
				aDOIdata[oDoiElement.DOIindex].instLoc = true;
				aDOIdata[oDoiElement.DOIindex].maintenance = false;
				aDOIdata[oDoiElement.DOIindex].currentVal = oDoiElement.parent;
				sValue = oDoiElement.parent;
				sDesc = oDoiElement.parentDesc;
				sDesc2 = oDoiElement.currentObjDesc2 !== undefined ? oDoiElement.currentObjDesc2 : "";
			}

			if (oDoiElement.DOIindex === 1) { //Location
				aData.Location = sValue;
				aData.Locationdesc = sDesc;
			}
			if (oDoiElement.DOIindex === 2) { //Plant Section
				aData.BeberFl = sValue;
				aData.Fing = sDesc;
				aData.Tele = sDesc2;
			}
			if (oDoiElement.DOIindex === 3) { //Work center
				aData.Arbpl = sValue;
				aData.Ktext = sDesc;
			}
			if (oDoiElement.DOIindex === 4) { //ABC Indicator
				aData.Abckz = sValue;
				aData.Abctx = sDesc;
			}
			if (oDoiElement.DOIindex === 6) { //Cost Center
				aData.Kostl = sValue;
				aData.Kokrs = sDesc;
				aData.Mctxt = sDesc2;
			}
			if (oDoiElement.DOIindex === 10) { // Main Work Center
				aData.MainArbpl = sValue;
				aData.MainKtext = sDesc;
				aData.MainWerks = sDesc2;
			}
			if (oDoiElement.DOIindex === 9) { // Planner Group
				aData.Ingrp = sValue;
				aData.Innam = sDesc;
			}
			if (oDoiElement.DOIindex === 8) { // Planning Plant
				aData.Werks = sValue;
				aData.Planningplantdes = sDesc;
			}

			this.getView().getModel("dataOrigin").setData(aDOIdata);
			this.getView().getModel("dataOrigin").refresh();
			this.getView().getModel(this.oModelName).refresh();

			oEvent.getSource().getParent().close();
		},

		/**
		 * Triggered on press of CANCEL in DOI Element dialog
		 * @function
		 * @public
		 * @param {sap.ui.base.Event} oEvent the press event
		 */
		onElementCancelPress: function (oEvent) {
			oEvent.getSource().getParent().close();
		},

		onLinkAinPress: function (oEvent) {
			if (!this.doiView) {
				this.doiView = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DataOrigin", this); //ValueHelpRequest.getDoiFragment(this);
			}
			this.doiView.open();
		},

		handleLinearCharRowAdd: function () {
			this.addLinearChar(this.oModelName);
		},

		handleLinearCharRowDelete: function (oEvent) {
			this.deleteLinearChar(oEvent, this.oModelName);
		}
	});
});