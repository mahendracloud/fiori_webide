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
	"sap/m/BusyDialog",
	"ugieamui/mdg/eam/lib/util/Utilities",
	"sap/ui/core/message/Message"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, ValueHelpRequest, ValueHelpProvider, BusyDialog,
	Utilities, Message) {
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailEquipment", {

		formatter: formatter,
		detailFlag: true,
		oAttach: [],
		inputId: null,
		_oCatalog: null,
		_oResourceBundle: null,
		oFileUpload: "",
		eqCatSelectDialog: undefined,
		techObjSelectDialog: undefined,
		mPlantSelectDialog: undefined,
		ccSelectDialog: undefined,
		flSelectDialog: undefined,
		ctSelectDialog: undefined,
		contTypSelectDialog: undefined, //
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
		submitBtn: false,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ugiaiwui.mdg.aiw.request.view.Equipment
		 */
		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			this.getRouter().getRoute("detailEqui").attachPatternMatched(this._onRouteMatched, this);
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
			var aServiceUrl = this._oComponent.getManifestEntry("sap.app").dataSources.MDG_EAM_EQUIPMENT_SRV.uri; //this._oComponent.getModel("ainModel").sServiceUrl;
			var aModel = new sap.ui.model.odata.v2.ODataModel(aServiceUrl, {
				json: true,
				useBatch: false,
				loadMetadataAsync: true,
				refreshAfterChange: false,
				defaultCountMode: sap.ui.model.odata.CountMode.None
			});
			this.getView().setModel(aModel, "ainModel");

			var oModel = this._oComponent.getModel();
			oModel.setDefaultCountMode(sap.ui.model.odata.CountMode.None);
			this.getView().setModel(oModel);

			var vhModel = this._oComponent.getModel("NewModel");
			this.getView().setModel(vhModel, "valueHelp");

			var vhModel2 = this._oComponent.getModel("NewModel2");
			this.getView().setModel(vhModel2, "valueHelp2");

			this.oAttach = [];
			this.resultArr = []; //p2
			this.oModelUpdateFlag = false;
			this.oModelName = "AIWEQUI";

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
				titleName: this.getOwnerComponent().getModel("i18n").getProperty("createEquiTitle"),
				visible: false,
				enabled: true
			};
			var sApproveData = {
				createVisible: true,
				approveVisible: false,
				approveVisibleLin: false
			};
			this.getView().setModel(new JSONModel({
				enabled: true
			}), "equiAddressView");
			this.getView().setModel(new JSONModel(sObj), "mainView");
			this.getView().setModel(new JSONModel(sApproveData), "ApproveModel");
			this.readAddressTitle();
			var PRTVisibleEnableModel = sap.ui.getCore().getModel("PRTVisibleEnableModel");
			this.getView().setModel(PRTVisibleEnableModel, "PRTVisibleEnableModel");

			this.isLam();
			this.readAddressVersion(this);
			this.BusyDialog = new BusyDialog();
			this.readDOIList();
			var rModel = new sap.ui.model.json.JSONModel();
			rModel.setData([]);
			this.getView().setModel(rModel, "dataOrigin");

			this.getClassType(this);

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
		},

		readDOIList: function () {
			var oModel = this.getView().getModel("valueHelp2");
			var g = this;
			var oFilter = [new sap.ui.model.Filter("Entity", "EQ", "EQUI")];
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
					g.DOIarrayEQ = arr;
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

		_superOrdEquiDesc: function (src, flag) {
			var g = this;
			var sSupEq = src.getValue();
			var currentData = this.getView().getModel(this.oModelName).getData();
			var oFilter = new sap.ui.model.Filter("Equnr", "EQ", sSupEq);
			var m = this.getView().getModel("valueHelp");
			m.read("/EquipmentNumberSet", {
				filters: [oFilter],
				success: function (d, e) {
					currentData.SuperordinateEquipDesc = d.results[0].Eqktx;
					currentData.SuperordinateEquipVS = "None";
					g.getView().getModel(g.oModelName).setData(currentData);
				},
				error: function (e) {
					currentData.SuperordinateEquipDesc = "";
					currentData.SuperordinateEquipVS = "Error";
					g.getView().getModel(g.oModelName).setData(currentData);
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
			var parent = e.getSource().getParent().getContent()[0].getContent()[0].getText();
			if (text !== "Dismantle") {
				if (parent.indexOf("Superior Equipment") > -1) {
					if (this.isInstall) {
						this.getView().byId("superOrdEq").setValue(this.prevValue);
						if (this.prevValue) {
							this._superOrdEquiDesc(this.getView().byId("superOrdEq"), "prev");
						}
						// objSOP.SuperordinateEquip = this.superiorEquipment;
						// objSOP.SuperordinateEquipDesc = this.superiorEqDesc;
						// objSOP.Tplnr = this.functionalLocation;
						// objSOP.Pltxt = this.functionalLocDesc;
					} else {
						objSOP.SuperordinateEquip = "";
						objSOP.SuperordinateEquipDesc = "";
						objSOP.Tplnr = "";
						objSOP.Pltxt = "";
					}
				} else {
					if (this.isInstall) {
						objSOP.Tplnr = this.functionalLocation;
						objSOP.Pltxt = this.functionalLocDesc;
					} else {
						objSOP.Tplnr = "";
						objSOP.Pltxt = "";
					}
				}
				objSOP.TplnrEnabled = true; //false;
				objSOP.TplnrVS = "None";
				objSOP.SuperordinateEquipVS = "None";
				objSOP.SuperordinateEquipEnabled = true; //false;

				if (objSOP.SuperordinateEquip === "") {
					objSOP.SuperordinateEquipDesc = "";
					this.superiorEquipment = "";
					this.superiorEqDesc = "";
				} else if (objSOP.Tplnr === "") {
					objSOP.Pltxt = "";
					this.functionalLocation = "";
					this.functionalLocDesc = "";
				}
			} else {
				var btnText = e.getSource().getText();
				if (parent.indexOf("Superior Equipment") > -1) {
					if (btnText === "Cancel") {
						objSOP.SuperordinateEquip = this.superiorEquipment;
						objSOP.SuperordinateEquipDesc = this.superiorEqDesc;
						objSOP.Tplnr = this.functionalLocation;
						objSOP.Pltxt = this.functionalLocDesc;
					} else {
						objSOP.SuperordinateEquip = "";
						objSOP.SuperordinateEquipDesc = "";
						objSOP.Tplnr = "";
						objSOP.Pltxt = "";
					}
				} else {
					if (btnText === "Cancel") {
						objSOP.Tplnr = this.functionalLocation;
						objSOP.Pltxt = this.functionalLocDesc;
					} else {
						objSOP.Tplnr = "";
						objSOP.Pltxt = "";
					}
				}
			}
			this.getView().getModel(this.oModelName).setData(objSOP);
			e.getSource().getParent().close();
		},

		// onDOICancelPress: function (e) {
		// 	var objSOP = this.getView().getModel(this.oModelName).getData();
		// 	var dModel = this.getView().getModel("doi").getData();
		// 	if (dModel.install === true) {
		// 		if (this.superiorEquipment !== "") {
		// 			this.superiorEquipment = "";
		// 			this.superiorEqDesc = "";
		// 			objSOP.SuperordinateEquip = ""; //this.getView().byId("superOrdEq").setValue();
		// 			objSOP.SuperordinateEquipDesc = ""; //this.getView().byId("superOrdEqDesc").setValue();
		// 		} else if (this.functionalLocation !== "") {
		// 			this.functionalLocation = "";
		// 			this.functionalLocDesc = "";
		// 			objSOP.Tplnr = ""; //this.getView().byId("FunctionalLocation").setValue();
		// 			objSOP.Pltxt = ""; //this.getView().byId("FunctionalLocationidDesc").setValue();
		// 		}
		// 	} else if (dModel.dismantle === true) {
		// 		if (this.superiorEquipment !== "") {
		// 			objSOP.SuperordinateEquip = this.superiorEquipment; //this.getView().byId("superOrdEq").setValue();
		// 			objSOP.SuperordinateEquipDesc = this.superiorEqDesc; //this.getView().byId("superOrdEqDesc").setValue();
		// 		} else if (this.functionalLocation !== "") {
		// 			objSOP.Tplnr = this.functionalLocation; //this.getView().byId("FunctionalLocation").setValue();
		// 			objSOP.Pltxt = this.functionalLocDesc; //this.getView().byId("FunctionalLocationidDesc").setValue();
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
			} else if (text === "EQ") {
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
					} else if (mLocalModel.getData().EquipmentCatogory === "L" && g.lamSwitch === "X") {
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

		_onRouteMatched: function (oEvent) {
			var g = this;
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "detailEqui") {
				var oAttachModel = sap.ui.getCore().getModel("ClassAttachRequest");
				var oAttachData = oAttachModel.getData();
				if (oAttachData.attachEquiFlag) {
					this.attachRequest();
					oAttachData.attachEquiFlag = false;
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
				var mAddressModel = sap.ui.getCore().getModel("equiAddressView");
				var mAddressData = mAddressModel.getData();
				var oAddressViewModel = this.getView().getModel("equiAddressView");
				var oMainViewModel = this.getView().getModel("mainView");
				var sApproveModel = this.getView().getModel("ApproveModel");
				var oMainViewData = oMainViewModel.getData();
				var oAddressViewData = oAddressViewModel.getData();
				var sApproveData = sApproveModel.getData();
				var oJsonModel = new JSONModel();
				var sUstaEqui;
				oMainViewData.enabled = true;
				oMainViewData.visible = false;
				var PRTVisibleEnableModel = this.getView().getModel("PRTVisibleEnableModel");
				var PRTVisibleEnableData = PRTVisibleEnableModel.getData();
				var mDataOriginMOP = sap.ui.getCore().getModel("dataOriginMOP");
				var aDataOriginMOP = mDataOriginMOP.getData();
				var mAinMOP = sap.ui.getCore().getModel("ainMOP");
				var aAinMOP = mAinMOP.getData();
				var ainSectionId = this.getView().createId("ainSection");
				// this.getView().byId("idBtnCheck").setVisible(true);

				if (sap.ui.getCore().getModel("refreshModel") !== undefined) {
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty("/refreshSearch", false);
				}

				this.sCrStatus = oEvent.getParameter("arguments").CrStatus;
				if (this.viewName === "CreateEqui") {
					oJsonModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex));
					this.getView().setModel(oJsonModel, this.oModelName);

					if (oJsonModel.getData().Maintplant !== "" && oJsonModel.getData().MaintplantVS !== "Error") {
						this.SOPMaintPlant = oJsonModel.getData().Maintplant;
					} else {
						this.SOPMaintPlant = "";
					}

					for (var z = 0; z < aDataOriginMOP.EQ.length; z++) {
						if (oJsonModel.getData().Equnr === aDataOriginMOP.EQ[z].key) {
							var rModel = new sap.ui.model.json.JSONModel();
							rModel.setData(aDataOriginMOP.EQ[z].DOI);
							g.getView().setModel(rModel, "dataOrigin");

							this.superiorEquipment = oJsonModel.getData().SuperordinateEquip;
							this.superiorEqDesc = oJsonModel.getData().SuperordinateEquipDesc;
							this.functionalLocation = oJsonModel.getData().Tplnr;
							this.functionalLocDesc = oJsonModel.getData().Pltxt;
							break;
						}
					}

					var ainExist = false;
					for (var z = 0; z < aAinMOP.length; z++) {
						if (oJsonModel.getData().Equnr === aAinMOP[z].key) {
							var rModel = new sap.ui.model.json.JSONModel();
							rModel.setData(aAinMOP[z].AIN);
							g.getView().setModel(rModel, "ain");
							ainExist = true;
							break;
						}
					}
					if (!ainExist) {
						this.setAinInitialData();
					}

					sap.ui.core.Fragment.byId(ainSectionId, "idAINSectionForm").setVisible(true);

					if (oJsonModel.getData().viewParameter === "change") {
						if (oJsonModel.getData().EquipmentCatogory === "" || oJsonModel.getData().EquipmentCatogory === undefined) {
							oJsonModel.getData().EquipCatEnabled = true;
						} else {
							oJsonModel.getData().EquipCatEnabled = false;
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
						if (oJsonModel.getData().Tplnr === "" || oJsonModel.getData().Tplnr === undefined) {
							oJsonModel.getData().TplnrEnabled = true;
						} else {
							oJsonModel.getData().TplnrEnabled = false;
						}

						oJsonModel.getData().EqunrEnabled = false;
						oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("changeEqui");
					} else {
						oJsonModel.getData().EqunrEnabled = true;
						oJsonModel.getData().EquipCatEnabled = true;
						oJsonModel.getData().MaintplantEnabled = true;
						oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("createEqui");
					}
					if (oJsonModel.getData().Fhmkz) {
						PRTVisibleEnableData.PRTVisible = true;
						PRTVisibleEnableData.PRTEnable = true;
					} else {
						PRTVisibleEnableData.PRTVisible = false;
						PRTVisibleEnableData.PRTEnable = false;
					}
					PRTVisibleEnableModel.setData(PRTVisibleEnableData);

					if (oJsonModel.getData().EquipmentCatogory === "L" && g.lamSwitch === "X") {
						this.lam.setVisible(true);
						this.lam.setModel(oJsonModel, "AIWLAM");
					} else {
						this.lam.setVisible(false);
					}

					sClassData = oJsonModel.getData().classItems;
					// sCharData = oJsonModel.getData().characteristics;
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
					if ((oJsonModel.getData().SuperordinateEquip !== "" && oJsonModel.getData().SuperordinateEquip !== undefined) || (oJsonModel.getData()
							.Tplnr !== "" && oJsonModel.getData().Tplnr !== undefined)) {
						oJsonModel.getData().MaintplantEnabled = false;
					} else {
						oJsonModel.getData().MaintplantEnabled = true;
					}

					oAddressViewData.enabled = true;
					if (mAddressData.length > 0) {
						for (var as = 0; as < mAddressData.length; as++) {
							if (oJsonModel.getData().Equnr === mAddressData[as].Equnr) {
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

					var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
					if (mSupEquiModel.getData() && mSupEquiModel.getData().length > 0) {
						var mSupEquiIndex;
						for (var b = 0; b < mSupEquiModel.getData().length; b++) {
							if (oJsonModel.getData().Equnr === mSupEquiModel.getData()[b].Equnr) {
								mSupEquiIndex = "/" + b;
								break;
							}
						}
						var sCopyArray = [mSupEquiModel.getProperty(mSupEquiIndex)];
						var sSupEquiData = $.map(sCopyArray, function (obj) {
							return $.extend(true, {}, obj);
						});
						var sSupEquiModel = new JSONModel();
						sSupEquiModel.setData(sSupEquiData);
						this.getView().setModel(sSupEquiModel, "SUP_EQUI_DATA");
					} else {
						this.getView().setModel(new JSONModel(), "SUP_EQUI_DATA");
					}

					if (oJsonModel.getData().Ppeguid !== "" && oJsonModel.getData().Ppeguid !== null) {
						g.getIPPEConfig(oJsonModel.getData().Ppeguid);
					}
				}
				if (this.viewName === "ChangeEqui") {
					var sCrStatus = oEvent.getParameter("arguments").CrStatus;
					var sEqunr = oEvent.getParameter("arguments").Equi;
					oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("changeEqui");

					if (sCrStatus === "true") {
						sClassNewButton = false;
						sCharNewButton = false;
						sLinCharNewButton = false;
						oMainViewData.enabled = false;
						oAddressViewData.enabled = false;
					}

					this.readSystemStatus(this);
					this.sExistFlag = false;
					var oMatchItem;
					var oModelData = sap.ui.getCore().getModel(this.oModelName).getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].Equnr === sEqunr) {
								oMatchItem = i;
								this.sExistFlag = true;
								break;
							}
						}
					}

					if (this.sExistFlag) {
						if (mAddressData.length > 0) {
							for (var ae = 0; ae < mAddressData.length; ae++) {
								if (oModelData[oMatchItem].Equnr === mAddressData[ae].Equnr) {
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

						oModelData[oMatchItem].EqunrEnabled = false; //*
						oModelData[oMatchItem].EquipCatEnabled = false; //*
						oModelData[oMatchItem].MaintplantEnabled = false;
						oModelData[oMatchItem].BukrsEnabled = false;
						oModelData[oMatchItem].TplnrEnabled = false;
						oModelData[oMatchItem].SuperordinateEquipEnabled = false;
						this.getView().setModel(new JSONModel(oModelData[oMatchItem]), this.oModelName);
						this.setObjectAddress(this.oModelName);
						this.readSystem(this);

						if (oModelData[oMatchItem].Fhmkz && sCrStatus === "true") {
							PRTVisibleEnableData.PRTVisible = true;
							PRTVisibleEnableData.PRTEnable = false;
						} else if (oModelData[oMatchItem].Fhmkz && sCrStatus === "false") {
							PRTVisibleEnableData.PRTVisible = true;
							PRTVisibleEnableData.PRTEnable = true;
						} else {
							PRTVisibleEnableData.PRTVisible = false;
							PRTVisibleEnableData.PRTEnable = false;
						}
						PRTVisibleEnableModel.setData(PRTVisibleEnableData);

						if (oModelData[oMatchItem].EquipmentCatogory === "L" && g.lamSwitch === "X") {
							this.lam.setVisible(true);
							this.lam.setModel(new JSONModel(oModelData[oMatchItem]), "AIWLAM");
						} else {
							this.lam.setVisible(false);
						}

						var aDOIEQ = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
						for (var z = 0; z < aDOIEQ.length; z++) {
							if (aDOIEQ[z].key === oModelData[oMatchItem].Equnr) {
								this.getView().getModel("dataOrigin").setData(aDOIEQ[z].DOI);
								this.superiorEquipment = oModelData[oMatchItem].SuperordinateEquip;
								this.superiorEqDesc = oModelData[oMatchItem].SuperordinateEquipDesc;
								this.functionalLocation = oModelData[oMatchItem].Tplnr;
								this.functionalLocDesc = oModelData[oMatchItem].Pltxt;
							}
						}

						var ainExist = false;
						for (var z = 0; z < aAinMOP.length; z++) {
							if (oModelData[oMatchItem].Equnr === aAinMOP[z].key) {
								var rModel = new sap.ui.model.json.JSONModel();
								rModel.setData(aAinMOP[z].AIN);
								g.getView().setModel(rModel, "ain");
								ainExist = true;
								break;
							}
						}
						if (!ainExist) {
							this.setAinInitialData();
						}

						if (oModelData[oMatchItem].Maintplant !== "" && oModelData[oMatchItem].MaintplantVS !== "Error") {
							this.SOPMaintPlant = oModelData[oMatchItem].Maintplant;
						} else {
							this.SOPMaintPlant = "";
						}
					} else {
						this.readEquipmentData(sEqunr, sCrStatus);
					}

					sap.ui.core.Fragment.byId(ainSectionId, "idAINSectionForm").setVisible(true);
				}
				if (this.viewName === "Approve") {
					// this.getView().byId("idBtnCheck").setVisible(false);
					oJsonModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex));
					oJsonModel.getData().EqunrEnabled = false; //*
					oJsonModel.getData().EquipCatEnabled = false;
					oJsonModel.getData().MaintplantEnabled = false;
					oJsonModel.getData().BukrsEnabled = false;
					oJsonModel.getData().TplnrEnabled = false;
					oJsonModel.getData().SuperordinateEquipEnabled = false;
					sUstaEqui = oJsonModel.getData().UstaEqui;
					this.getView().setModel(oJsonModel, this.oModelName);
					if (oJsonModel.getData().Ppeguid !== "" && oJsonModel.getData().Ppeguid !== null) {
						g.getIPPEConfig(oJsonModel.getData().Ppeguid);
					}

					var ainExist = false;
					for (var z = 0; z < aAinMOP.length; z++) {
						if (oJsonModel.getData().Equnr === aAinMOP[z].key) {
							var rModel = new sap.ui.model.json.JSONModel();
							rModel.setData(aAinMOP[z].AIN);
							g.getView().setModel(rModel, "ain");
							ainExist = true;
							break;
						}
					}
					if (!ainExist) {
						var obj = {
							moreInfo: false,
							linkVisible: false,
							deLinkVisible: false
						};
						var oModel = new sap.ui.model.json.JSONModel(obj);
						this.getView().setModel(oModel, "ain");
						sap.ui.getCore().setModel(oModel, "ain");
					}
					sap.ui.core.Fragment.byId(ainSectionId, "idAINSectionForm").setVisible(false);

					var AIWAPPROVE = new JSONModel();
					var pApproveData = sap.ui.getCore().getModel("AIWAPPROVE").getProperty("/AIWEQUI" + this.rowIndex);
					AIWAPPROVE.setData(pApproveData);
					this.getView().setModel(AIWAPPROVE, "AIWAPPROVE");

					oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("approveEqui");
					oMainViewData.enabled = false;
					oAddressViewData.enabled = false;
					sApproveData.createVisible = false;
					sApproveData.approveVisible = true;
					sApproveData.approveVisibleLin = false;
					this.readSystem(this);
					if (oJsonModel.getData().Fhmkz) {
						PRTVisibleEnableData.PRTVisible = true;
						PRTVisibleEnableData.PRTEnable = false;
					} else {
						PRTVisibleEnableData.PRTVisible = false;
						PRTVisibleEnableData.PRTEnable = false;
					}
					PRTVisibleEnableModel.setData(PRTVisibleEnableData);

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

				if (oJsonModel.getData().EquipmentCatogory === "L" && this.lamSwitch === "X" && this.viewName !== "Approve") {
					this.linearChar.setVisible(true);
				} else {
					this.linearChar.setVisible(false);
				}

				if (this.viewName === "Approve") {
					this.getView().byId("idPanelDFPS").setVisible(false);

					var lamAprvFragID = this.getView().createId("lamAprvFrag");
					var lamAprvFragPanel = sap.ui.core.Fragment.byId(lamAprvFragID, "idPanelLinDataAprv");
					if (this.lamSwitch === "X") {
						lamAprvFragPanel.setVisible(true);
						sApproveData.approveVisibleLin = true;
					} else {
						lamAprvFragPanel.setVisible(false);
						sApproveData.approveVisibleLin = false;
					}
				} else {
					this.getView().byId("idPanelDFPS").setVisible(true);
				}

				oAddressViewModel.setData(oAddressViewData);
				oMainViewModel.setData(oMainViewData);
				sApproveModel.setData(sApproveData);
			} else {
				return;
			}
		},

		onInactiveSelect: function (oEvent) {
			var p = oEvent.getSource().getModel(this.oModelName).getData();
			p.Deact = oEvent.getSource().getSelected();
			this.readStatusProf(p.EquipmentCatogory, this);
		},

		oAcqnDateChange: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
			} else {
				var oModel = this.getView().getModel("AIWEQUI");
				var oModelData = oModel.getData();
				oModelData.Ansdt = sValue;
				oModel.setData(oModelData);
				oEvent.getSource().setValue(sValue);
			}
		},

		onAcquisitionChange: function (oEvent) {
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("0.000");
			} else {
				if (sValue.indexOf(".") > -1) {
					var sInteger = sValue.substr(0, sValue.indexOf(".") + 1);
					var sDecimal = sValue.substr(sValue.indexOf(".") + 1);
					if (sDecimal.length >= 4) {
						sDecimal = sDecimal.substr(0, 3);
					} else {
						while (sDecimal.length < 3) {
							sDecimal = sDecimal.concat("0");
						}
					}
					oEvent.getSource().setValue(sInteger.concat(sDecimal));
				} else {
					sValue = sValue + ".000";
					oEvent.getSource().setValue(sValue);
				}
			}
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
					if (this.id.indexOf("superOrdEq") > -1) {
						g.prevValue = $(this).data('val');
						g.currentValue = $(this).val();
					} else if (this.id.indexOf("FunctionalLocation") > -1) {
						g.prevFlocValue = $(this).data('val');
						g.currentFlocValue = $(this).val();
					}
				});
			}
		},

		onEquiPermitSelect: function (event) {
			var g = this;
			var path = event.getParameter("listItem").getBindingContext(g.oModelName).getPath();
			path = parseInt(path.substring(path.lastIndexOf("/") + 1));
			var fpModel = this.getView().getModel(g.oModelName);
			if (fpModel !== undefined) {
				var fpData = fpModel.getData();
				for (var i = 0; i < fpData.Permits.length; i++) {
					if (path === i) {
						fpData.PmtLtext = fpData.Permits[i].PmtLtext;
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

		readClassCharacteristics: function () {
			var classModel = new JSONModel();
			classModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex).classItems);
			this.getView().setModel(classModel, "classItems");
			// this.getView().setModel(classModel, "equiClassModel");
		},

		valueHelpFunSelect: function (oEvent) {
			var sPath = oEvent.getSource().getBindingInfo("value").binding.sPath;

			if (sPath.indexOf("/Equnr") !== -1) {
				ValueHelpRequest.valueHelpFunEquipment(oEvent, this);
			} else if (sPath.indexOf("/EquipmentCatogory") !== -1) {
				ValueHelpRequest.valueHelpFunEquipCat(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Waers") !== -1) {
				ValueHelpRequest.valueHelpFunCurrency(oEvent.getSource().getModel(this.oModelName).getData(), this);
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
				ValueHelpRequest.valueHelpFunLocation(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/Abckz") !== -1) {
				ValueHelpRequest.valueHelpFunAbcInd(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/Arbpl") !== -1) {
				ValueHelpRequest.valueHelpFunWc(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/Bukrs") !== -1) {
				ValueHelpRequest.valueHelpFunCompCode(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Kostl") !== -1) {
				ValueHelpRequest.valueHelpFunCostCenter(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/Werks") !== -1) {
				ValueHelpRequest.valueHelpFunPlanPlant(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/Ingrp") !== -1) {
				ValueHelpRequest.valueHelpFunPlGrp(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/MainArbpl") !== -1) {
				ValueHelpRequest.valueHelpFunMainWc(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/Tplnr") !== -1) {
				ValueHelpRequest.valueHelpFunFloc(oEvent, this);
			} else if (sPath.indexOf("/SuperordinateEquip") !== -1) {
				ValueHelpRequest.valueHelpFunSuperOrdEq(oEvent, this);
			} else if (sPath.indexOf("/ConstrType") !== -1) {
				ValueHelpRequest.valueHelpFunConstType(this);
			} else if (sPath.indexOf("/RefPosta") !== -1) {
				ValueHelpRequest.valueHelpFunCntry(oEvent, this);
			} else if (sPath.indexOf("/Langucode") !== -1) {
				ValueHelpRequest.valueHelpFunLang(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/BeberFl") !== -1) {
				ValueHelpRequest.valueHelpFunPlantSec(oEvent.getSource().getModel(this.oModelName).getData(), this, oEvent);
			} else if (sPath.indexOf("/Title") !== -1) {
				ValueHelpRequest.valueHelpFunTitle(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/TimeZone") !== -1) {
				ValueHelpRequest.valueHelpFunTimeZone(oEvent, this);
			} else if (sPath.indexOf("/Region") !== -1) {
				ValueHelpRequest.valueHelpFunRegion(oEvent, this);
			} else if (sPath.indexOf("/PlanvPrt") !== -1) { // Task List Usage
				ValueHelpRequest.onTaskListUsageVH(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/KtschPrt") !== -1) { // Standard Text Key
				ValueHelpRequest.onStdTextKeyVH(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Ewformprt") !== -1) { // Usage Value Formula
				ValueHelpRequest.onUsgValFormulaVH(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/SteufPrt") !== -1) { // Control Key
				ValueHelpRequest.onControlKeyVH(oEvent.getSource().getModel(this.oModelName).getData(), this);
			}
		},

		onTLUSGChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().PlanvPrt = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeTLUSG(oEvent, g);
			}
		},

		onStdTxtKeyChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().KtschPrt = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeStdTxtKey(oEvent, g);
			}
		},

		onUsgValFormulaChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().Ewformprt = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeUsgValFormula(oEvent, g);
			}
		},

		onControlKeyChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().SteufPrt = "";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());
				ValueHelpRequest._changeControlKey(oEvent, g);
			}

		},

		equipCatChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().EquipmentCatogory;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().EquipmentCatogory = "";
				oEvent.getSource().getModel(g.oModelName).getData().EquipCatgDescription = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onCurrencyChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Waers;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Waers = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().Waers = sValue.toUpperCase();
				ValueHelpRequest._changeCurrency(oEvent.getSource().getModel(g.oModelName).getData(), g);
			}
		},

		superOrdEqChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().SuperordinateEquip;

			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().SuperordinateEquip = "";
				oEvent.getSource().getModel(g.oModelName).getData().SuperordinateEquipDesc = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Location = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Locationdesc = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Abckz = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Abctx = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Kostl = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Kokrs = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Mctxt = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Werks = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Planningplantdes = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Ingrp = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Innam = "";
				// oEvent.getSource().getModel(g.oModelName).getData().MainArbpl = "";
				// oEvent.getSource().getModel(g.oModelName).getData().MainKtext = "";
				// oEvent.getSource().getModel(g.oModelName).getData().MainWerks = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Maintplant = "";
				// oEvent.getSource().getModel(g.oModelName).getData().MaintplantDesc = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Arbpl = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Ktext = "";
				// oEvent.getSource().getModel(g.oModelName).getData().WcWerks = "";
				// oEvent.getSource().getModel(g.oModelName).getData().BeberFl = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Bukrs = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Butxt = "";
				// oEvent.getSource().getModel(g.oModelName).getData().BukrsEnabled = true;
				g.readSystemStatus(g);
			}
			oEvent.getSource().setValueState("None");
		},

		onSuperOrdEqChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getValue();

			if (sValue === "" || sValue === undefined) {
				// if (g.getView().getModel("SUP_EQUI_DATA")) {
				// 	var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
				// 	var mSupEquiData = mSupEquiModel.getData();
				// 	var mSupEquiIndex;
				// 	for (var a = 0; a < mSupEquiData.length; a++) {
				// 		if (oEvent.getSource().getModel(g.oModelName).getData().Equnr === mSupEquiData[a].Equnr) {
				// 			mSupEquiIndex = a;
				// 			break;
				// 		}
				// 	}
				// 	var localModel = g.getView().getModel(g.oModelName);
				// 	var localData = localModel.getData();
				// 	var sSupEquiData = g.getView().getModel("SUP_EQUI_DATA").getData()[0];
				// 	if (sSupEquiData) {
				// 		localData.Tplnr = localData.Tplnr === sSupEquiData.Tplnr ? "" : localData.Tplnr;
				// 		localData.Pltxt = localData.Pltxt === sSupEquiData.Pltxt ? "" : localData.Pltxt;
				// 		localData.BeberFl = localData.BeberFl === sSupEquiData.BeberFl ? "" : localData.BeberFl;
				// 		localData.Fing = localData.Fing === sSupEquiData.Fing ? "" : localData.Fing;
				// 		localData.Tele = localData.Tele === sSupEquiData.Tele ? "" : localData.Tele;
				// 		localData.Location = localData.Location === sSupEquiData.Location ? "" : localData.Location;
				// 		localData.Locationdesc = localData.Locationdesc === sSupEquiData.Locationdesc ? "" : localData.Locationdesc;
				// 		localData.Arbpl = localData.Arbpl === sSupEquiData.Arbpl ? "" : localData.Arbpl;
				// 		localData.Ktext = localData.Ktext === sSupEquiData.Ktext ? "" : localData.Ktext;
				// 		localData.WcWerks = localData.WcWerks === sSupEquiData.WcWerks ? "" : localData.WcWerks;
				// 		localData.Abckz = localData.Abckz === sSupEquiData.Abckz ? "" : localData.Abckz;
				// 		localData.Abctx = localData.Abctx === sSupEquiData.Abctx ? "" : localData.Abctx;
				// 		localData.MainArbpl = localData.MainArbpl === sSupEquiData.MainArbpl ? "" : localData.MainArbpl;
				// 		localData.MainKtext = localData.MainKtext === sSupEquiData.MainKtext ? "" : localData.MainKtext;
				// 		localData.MainWerks = localData.MainWerks === sSupEquiData.MainWerks ? "" : localData.MainWerks;
				// 		localData.Kostl = localData.Kostl === sSupEquiData.Kostl ? "" : localData.Kostl;
				// 		localData.Mctxt = localData.Mctxt === sSupEquiData.Mctxt ? "" : localData.Mctxt;
				// 		localData.Ingrp = localData.Ingrp === sSupEquiData.Ingrp ? "" : localData.Ingrp;
				// 		localData.Innam = localData.Innam === sSupEquiData.Innam ? "" : localData.Innam;

				// 		if (localData.Maintplant !== "") {
				// 			localData.TplnrEnabled = true;
				// 			localData.MaintplantEnabled = true;
				// 			localData.BukrsEnabled = false;
				// 			localData.Bukrs = localData.Bukrs;
				// 			localData.Butxt = localData.Butxt;
				// 			localData.Kokrs = localData.Kokrs;
				// 			localData.Werks = localData.Werks;
				// 			localData.Planningplantdes = localData.Planningplantdes;
				// 		} else {
				// 			localData.BukrsEnabled = true;
				// 			localData.Bukrs = localData.Bukrs === sSupEquiData.Bukrs ? "" : localData.Bukrs;
				// 			localData.Butxt = localData.Butxt === sSupEquiData.Butxt ? "" : localData.Butxt;
				// 			localData.Kokrs = localData.Kokrs === sSupEquiData.Kokrs ? "" : localData.Kokrs;
				// 			localData.Werks = localData.Werks === sSupEquiData.Werks ? "" : localData.Werks;
				// 			localData.Planningplantdes = localData.Planningplantdes === sSupEquiData.Planningplantdes ? "" : localData.Planningplantdes;
				// 		}
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

				// 		var mAddressModel = sap.ui.getCore().getModel("equiAddressView");
				// 		var mAddressData = mAddressModel.getData();
				// 		for (var as = 0; as < mAddressData.length; as++) {
				// 			if (oEvent.getSource().getModel(g.oModelName).getData().Equnr === mAddressData[as].Equnr) {
				// 				mAddressData.splice(as, 1);
				// 				mAddressModel.setData(mAddressData);
				// 				break;
				// 			}
				// 		}

				// 		var sAddressModel = g.getView().getModel("equiAddressView");
				// 		var sAddressData = sAddressModel.getData();
				// 		sAddressData.enabled = true;
				// 		sAddressModel.setData(sAddressData);

				// 		mSupEquiData.splice(mSupEquiIndex, 1);
				// 		mSupEquiModel.setData(mSupEquiData);
				// 	}
				// }

				this.openDoiView(sValue);
				oEvent.getSource().setValue("");
				oEvent.getSource().getModel(g.oModelName).getData().SuperordinateEquipDesc = "";
				oEvent.getSource().getModel(g.oModelName).getData().Stattext = "AVLB";
			} else {
				oEvent.getSource().setValue(sValue.toUpperCase());

				var sExistFlag = false;
				var sSuperordinateEquip = sValue.toUpperCase();
				var AIWModel = sap.ui.getCore().getModel(g.oModelName);
				var oAIWData = AIWModel.getData();

				for (var i = 0; i < oAIWData.length; i++) {
					if (sSuperordinateEquip === oAIWData[i].Equnr) {
						oEvent.getSource().getModel(g.oModelName).getData().SuperordinateEquipDesc = oAIWData[i].Eqktx;
						sExistFlag = true;
						break;
					}
				}

				if (sExistFlag) {
					g.fetchData("AIWEQUI");
				} else {
					ValueHelpRequest._changeSuperOrdEqui(oEvent, g);
				}
			}
		},

		fetchSupFlocEquiData: function (imValue, imObject, imDesc, imFlag) {
			var g = this;
			// var objSOP = this.getView().getModel(this.oModelName).getData();
			var sPath = "/ChangeRequestSet";
			var oModel = g.getView().getModel();
			var sArray = [];
			var sObject = {};
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
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"FLALTLBEL": [],
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
				"Equi_DOI": [],
				"FLDOI": [],
				"FLLAMCH": [],
				"EqLAMCH": [],
				"EqDFPS": []
			};
			var oAIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC");
			var oAIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI");
			var oLocalModel = g.getView().getModel(g.oModelName);
			var sLocalVar;

			if (g.oModelName === "AIWEQUI") {
				sLocalVar = oLocalModel.getData().Equnr;
			}

			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();

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

					if (AIWFLOCModel[a].lam !== undefined) {
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
						"Workcenterdesc": AIWEQUIModel[d].Ktext, // Plant Work Center
						"WorkCenterPlant": AIWEQUIModel[d].WcWerks, // Name
						"ArbpEeqz": AIWEQUIModel[d].MainArbpl, // Main Work Center
						"MainWcDesc": AIWEQUIModel[d].MainKtext, // Work Center Description
						"MainWcPlant": AIWEQUIModel[d].MainWerks, // Work center Plant
						"BebeEilo": AIWEQUIModel[d].BeberFl, // Plant Section
						"Fing": AIWEQUIModel[d].Fing, // Plant Section
						"Tele": AIWEQUIModel[d].Tele, // Plant Section
						"HeqnEeqz": AIWEQUIModel[d].EquipPosition, // Position
						"IsMenu": AIWEQUIModel[d].menuAction,
						"Adrnr": AIWEQUIModel[d].Adrnr,
						"Adrnri": AIWEQUIModel[d].Adrnri,
						Fhmkz: AIWEQUIModel[d].Fhmkz, // PRT fields visible
						Funcid: AIWEQUIModel[d].Funcid, //Config control data
						Frcfit: AIWEQUIModel[d].Frcfit,
						Frcrmv: AIWEQUIModel[d].Frcrmv,
					};

					if (AIWEQUIModel[d].Equnr === sLocalVar) { //For DOI
						currentHeader = AIWEQUIModel[d];
					}

					var aEQDOI = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
					if (aEQDOI && aEQDOI.length > 0) {
						var aDOIFields = aEQDOI[d].DOI;
						// sEquipment.Begrui = aDOIFields[0].instLoc ? "R" : "D";
						sEquipment.Swerki = aDOIFields[0].instLoc ? "R" : (aDOIFields[0].maintenance ? "D" : "");
						sEquipment.Storti = aDOIFields[1].instLoc ? "R" : (aDOIFields[1].maintenance ? "D" : "");
						// sEquipment.Msgrpi = aDOIFields[3].instLoc ? "R" : "D";
						sEquipment.Beberi = aDOIFields[2].instLoc ? "R" : (aDOIFields[2].maintenance ? "D" : "");
						sEquipment.Ppsidi = aDOIFields[3].instLoc ? "R" : (aDOIFields[3].maintenance ? "D" : "");
						sEquipment.Abckzi = aDOIFields[4].instLoc ? "R" : (aDOIFields[4].maintenance ? "D" : "");
						// sEquipment.Eqfnri = aDOIFields[7].instLoc ? "R" : "D";
						// sEquipment.Gsberi = aDOIFields[8].instLoc ? "R" : "D";
						sEquipment.Kostli = aDOIFields[5].instLoc ? "R" : (aDOIFields[5].maintenance ? "D" : "");
						// sEquipment.Proidi = aDOIFields[10].instLoc ? "R" : "D";
						// sEquipment.Daufni = aDOIFields[11].instLoc ? "R" : "D";
						// sEquipment.Aufnri = aDOIFields[12].instLoc ? "R" : "D";
						// sEquipment.Ppsidi = aDOIFields[13].instLoc ? "R" : "D";
						sEquipment.Iwerki = aDOIFields[6].instLoc ? "R" : (aDOIFields[6].maintenance ? "D" : "");
						sEquipment.Ingrpi = aDOIFields[7].instLoc ? "R" : (aDOIFields[7].maintenance ? "D" : "");
						sEquipment.Gewrki = aDOIFields[8].instLoc ? "R" : (aDOIFields[8].maintenance ? "D" : "");
						// sEquipment.Gewrki = aDOIFields[16].instLoc ? "R" : "D";
						// sEquipment.RbnrI = aDOIFields[17].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[18].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[19].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[20].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[21].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[22].instLoc ? "R" : "D";
						sEquipment.Adrnri = aDOIFields[10].instLoc ? "R" : (aDOIFields[10].maintenance ? "D" : "");
					}

					if (AIWEQUIModel[d].Equnr === sLocalVar) { // Identify current Equi data for DOI
						sEquipment.IsDOI = true;
						var aDOIFields = this.getView().getModel("dataOrigin").getData();
						if (aDOIFields && aDOIFields.length > 0) {
							// sEquipment.Begrui = aDOIFields[0].instLoc ? "R" : "D";
							sEquipment.Swerki = aDOIFields[0].instLoc ? "R" : (aDOIFields[0].maintenance ? "D" : "");
							sEquipment.Storti = aDOIFields[1].instLoc ? "R" : (aDOIFields[1].maintenance ? "D" : "");
							// sEquipment.Msgrpi = aDOIFields[3].instLoc ? "R" : "D";
							sEquipment.Beberi = aDOIFields[2].instLoc ? "R" : (aDOIFields[2].maintenance ? "D" : "");
							sEquipment.Ppsidi = aDOIFields[3].instLoc ? "R" : (aDOIFields[3].maintenance ? "D" : "");
							sEquipment.Abckzi = aDOIFields[4].instLoc ? "R" : (aDOIFields[4].maintenance ? "D" : "");
							// sEquipment.Eqfnri = aDOIFields[7].instLoc ? "R" : "D";
							// sEquipment.Gsberi = aDOIFields[8].instLoc ? "R" : "D";
							sEquipment.Kostli = aDOIFields[5].instLoc ? "R" : (aDOIFields[5].maintenance ? "D" : "");
							// sEquipment.Proidi = aDOIFields[10].instLoc ? "R" : "D";
							// sEquipment.Daufni = aDOIFields[11].instLoc ? "R" : "D";
							// sEquipment.Aufnri = aDOIFields[12].instLoc ? "R" : "D";
							// sEquipment.Ppsidi = aDOIFields[13].instLoc ? "R" : "D";
							sEquipment.Iwerki = aDOIFields[6].instLoc ? "R" : (aDOIFields[6].maintenance ? "D" : "");
							sEquipment.Ingrpi = aDOIFields[7].instLoc ? "R" : (aDOIFields[7].maintenance ? "D" : "");
							sEquipment.Gewrki = aDOIFields[8].instLoc ? "R" : (aDOIFields[8].maintenance ? "D" : "");
							// sEquipment.Gewrki = aDOIFields[16].instLoc ? "R" : "D";
							// sEquipment.RbnrI = aDOIFields[17].instLoc ? "R" : "D";
							// sEquipment.Vkorgi = aDOIFields[18].instLoc ? "R" : "D";
							// sEquipment.Vkorgi = aDOIFields[19].instLoc ? "R" : "D";
							// sEquipment.Vkorgi = aDOIFields[20].instLoc ? "R" : "D";
							// sEquipment.Vkorgi = aDOIFields[21].instLoc ? "R" : "D";
							// sEquipment.Vkorgi = aDOIFields[22].instLoc ? "R" : "D";
							sEquipment.Adrnri = aDOIFields[10].instLoc ? "R" : (aDOIFields[10].maintenance ? "D" : "");
						}
					}

					if (AIWEQUIModel[d].viewParameter === "create") {
						sEquipment.Type = true;
					}
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

						if (AIWEQUIModel[d].Equnr === sLocalVar) { //For DOI
							currentAddr = sEqAddr;
						}
					}

					var aIntlAddr = AIWEQUIModel[d].intlAddr;
					if (aIntlAddr.length > 0) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							sPayload.EqAddrI.push(aIntlAddr[z]);
						}

						if (AIWEQUIModel[d].Equnr === sLocalVar) { //For DOI
							currentIntlAddr = sPayload.EqAddrI;
						}
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

					if (AIWEQUIModel[d].lam !== undefined) {
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
							"MrkrUnit": AIWEQUIModel[d].lam.MrkrUnit,
							"LamDer": AIWEQUIModel[d].lam.LamDer
						};

						if (AIWEQUIModel[d].Equnr === sLocalVar && g.lamSwitch === "X") { //For DOI
							currentLAM = sEqLAM;
							sEqLAM.LamDer = "D";
						}
						sPayload.EqLAM.push(sEqLAM);
					}

					if (AIWEQUIModel[d].dfps) {
						var oEqDFPS = {
							Equi: AIWEQUIModel[d].Equnr,
							DeviceId: AIWEQUIModel[d].dfps.Tailno,
							Topsiteid: AIWEQUIModel[d].dfps.Area,
							Topsitede: AIWEQUIModel[d].dfps.AreaDesc,
							AreaPro: AIWEQUIModel[d].dfps.AreaPrfl,
							SiteId: AIWEQUIModel[d].dfps.Site,
							SiteDesc: AIWEQUIModel[d].dfps.SiteDesc,
							SitePro: AIWEQUIModel[d].dfps.SitePrfl,
							MpoId: AIWEQUIModel[d].dfps.MPO,
							MpoDescr: AIWEQUIModel[d].dfps.MPODesc,
							RicId: AIWEQUIModel[d].dfps.RIC,
							RicDescr: AIWEQUIModel[d].dfps.RICDesc,
							ModelId: AIWEQUIModel[d].dfps.ModelId,
							ModelDes: AIWEQUIModel[d].dfps.ModelIdDesc,
							Foreignob: formatter.truetoX(AIWEQUIModel[d].dfps.ForeignEq),
							TecState: AIWEQUIModel[d].dfps.TechSts,
							DepState: AIWEQUIModel[d].dfps.OperSts,
							DfpsRmrk: AIWEQUIModel[d].dfps.Remark
						};
						sPayload.EqDFPS.push(oEqDFPS);
					}

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

					var aFLLinChar = AIWEQUIModel[d].linearChar;
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Equi = AIWEQUIModel[d].Equnr;
								sPayload.EqLAMCH.push(alinearChar[c]);
							}
						}
					}
				}
			}

			var oMainViewModel = g.getView().getModel("mainView");
			var oMainViewData = oMainViewModel.getData();
			oMainViewData.tableBusy = true;
			oMainViewModel.setData(oMainViewData);

			var fnSuccess = function (r) {
				g.BusyDialog.close();
				if (r.Messages.results.length > 0) {
					var oMessageList = [];
					for (var e = 0; e < r.Messages.results.length; e++) {
						oMessageList.push({
							type: formatter.getMessageType(r.Messages.results[e].Type),
							title: r.Messages.results[e].Message
						});
					}
					g.createMessagePopover(oMessageList, "");
					oMainViewData.tableBusy = false;
					oMainViewModel.setData(oMainViewData);

					if (g.getView().getModel(g.oModelName).getData().Maintplant === "") {
						g.getView().getModel(g.oModelName).getData().Tplnr = "";
						g.getView().getModel(g.oModelName).getData().Pltxt = "";
						g.getView().getModel(g.oModelName).getData().SuperordinateEquip = "";
						g.getView().getModel(g.oModelName).getData().SuperordinateEquipDesc = "";
						g.getView().getModel(g.oModelName).refresh();
					} else {
						if (g.isInstall && oLocalModel.getData().SuperordinateEquip !== "") {
							g.getView().getModel(g.oModelName).getData().SuperordinateEquip = g.superiorEquipment;
							g.getView().getModel(g.oModelName).getData().SuperordinateEquipDesc = g.superiorEqDesc;
							g.getView().getModel(g.oModelName).getData().Tplnr = g.functionalLocation;
							g.getView().getModel(g.oModelName).getData().Pltxt = g.functionalLocDesc;
						} else {
							g.getView().getModel(g.oModelName).getData().SuperordinateEquip = "";
							g.getView().getModel(g.oModelName).getData().SuperordinateEquipDesc = "";
							g.getView().getModel(g.oModelName).getData().Tplnr = "";
							g.getView().getModel(g.oModelName).getData().Pltxt = "";
						}
						if (g.isInstall && oLocalModel.getData().Tplnr !== "") {
							g.getView().getModel(g.oModelName).getData().Tplnr = this.functionalLocation;
							g.getView().getModel(g.oModelName).getData().Pltxt = this.functionalLocDesc;
						} else {
							g.getView().getModel(g.oModelName).getData().Tplnr = "";
							g.getView().getModel(g.oModelName).getData().Pltxt = "";
						}
					}
					return;
				}
				if (r.FuncLoc) {
					if (r.FuncLoc.results.length > 0) {
						sArray = [];
						if (r.FuncLoc.results.length > 0) {
							for (var ifl = 0; ifl < r.FuncLoc.results.length; ifl++) {
								var h = r.FuncLoc.results[ifl];
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
								sModelData.ConstructionDesc = h.Constdes; // Construction Description
								sModelData.menuAction = h.IsMenu;
								sModelData.Adrnr = h.Adrnr;
								sModelData.Adrnri = h.Adrnri;
								sModelData.Modeldesc = h.Modeldesc;
								sModelData.Modelref = h.Modelref;
								sModelData.Modelrver = h.Modelrver;
								sModelData.Modelext = h.Modelext;
								sModelData.Modelname = h.Modelname;
								sModelData.Modelver = h.Modelver;

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
									sModelData.MaintplantEnabled = false;
									sModelData.BukrsEnabled = false;
								} else {
									sModelData.MaintplantEnabled = true;
									sModelData.BukrsEnabled = true;
								}

								if (r.FLLAM.results.length > 0) {
									var aFlLam = r.FLLAM.results;
									for (var x = 0; x < aFlLam.length; x++) {
										if (aFlLam[x].Funcloc === sModelData.Functionallocation) {
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
												"MrkrUnit": aFlLam[x].MrkrUnit,
												"LamDer": aFlLam[x].LamDer
											};
											sModelData.lam = oFLLAM;
											break;
										}
									}
								}

								if (r.FLAddr) {
									if (r.FLAddr.results) {
										var sAddress = r.FLAddr.results;
										if (sAddress) {
											if (sAddress.length > 0) {
												for (var jfl = 0; jfl < sAddress.length; jfl++) {
													if (sModelData.Functionallocation === sAddress[jfl].Funcloc) {
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
																IsEditable: sAddress[jfl].IsEditable
															};
															oAddressData.push(sObj);
															oAddressModel.setData(oAddressData);
														}
														if (!mCountFlag && sModelData.SupFunctionallocation !== "" && sModelData.SupFunctionallocation !== undefined) {
															oAddressData[sMatchIndex].Functionallocation = sModelData.Functionallocation;
															oAddressData[sMatchIndex].IsEditable = sAddress[jfl].IsEditable; //sModelData.IsEditable;
															oAddressModel.setData(oAddressData);
														}

														sModelData.Title = sAddress[jfl].Titletxt ? sAddress[jfl].Titletxt : "";
														sModelData.TitleCode = sAddress[jfl].Title ? sAddress[jfl].Title : "";
														sModelData.Name1 = sAddress[jfl].Name1 ? sAddress[jfl].Name1 : "";
														sModelData.Name2 = sAddress[jfl].Name2 ? sAddress[jfl].Name2 : "";
														sModelData.Name3 = sAddress[jfl].Name3 ? sAddress[jfl].Name3 : "";
														sModelData.Name4 = sAddress[jfl].Name4 ? sAddress[jfl].Name4 : "";
														sModelData.Sort1 = sAddress[jfl].Sort1 ? sAddress[jfl].Sort1 : "";
														sModelData.Sort2 = sAddress[jfl].Sort2 ? sAddress[jfl].Sort2 : "";
														sModelData.NameCo = sAddress[jfl].NameCo ? sAddress[jfl].NameCo : "";
														sModelData.PostCod1 = sAddress[jfl].PostCod1 ? sAddress[jfl].PostCod1 : "";
														sModelData.City1 = sAddress[jfl].City1 ? sAddress[jfl].City1 : "";
														sModelData.Building = sAddress[jfl].Building ? sAddress[jfl].Building : "";
														sModelData.Floor = sAddress[jfl].Floor ? sAddress[jfl].Floor : "";
														sModelData.Roomnum = sAddress[jfl].Roomnum ? sAddress[jfl].Roomnum : "";
														sModelData.Strsuppl1 = sAddress[jfl].Strsuppl1 ? sAddress[jfl].Strsuppl1 : "";
														sModelData.Strsuppl2 = sAddress[jfl].Strsuppl2 ? sAddress[jfl].Strsuppl2 : "";
														sModelData.Strsuppl3 = sAddress[jfl].Strsuppl3 ? sAddress[jfl].Strsuppl3 : "";
														sModelData.AddrLocation = sAddress[jfl].Location ? sAddress[jfl].Location : "";
														sModelData.RefPosta = sAddress[jfl].RPostafl ? sAddress[jfl].RPostafl : "";
														sModelData.Landx = sAddress[jfl].Landx ? sAddress[jfl].Landx : "";
														sModelData.TimeZone = sAddress[jfl].TimeZone ? sAddress[jfl].TimeZone : "";
														sModelData.Region = sAddress[jfl].RPostFl ? sAddress[jfl].RPostFl : "";
														sModelData.ReigonDesc = sAddress[jfl].Regiotxt ? sAddress[jfl].Regiotxt : "";
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

								var aAltLbl = r.FLALTLBEL.results;
								if (aAltLbl.length > 0) {
									for (var y = 0; y < aAltLbl.length; y++) {
										if (aAltLbl[y].Funcloc === sModelData.Functionallocation) {
											var oAltLbl = {
												"Funcloc": sTplnr,
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
											for (var afl = 0; afl < sClassList.length; afl++) {
												if (sModelData.Functionallocation === sClassList[afl].Funcloc) {
													sClassList[afl].ctEnable = false;
													sClassList[afl].classEnable = false;
													sClassList[afl].ClassTypeDesc = sClassList[afl].Artxt;
													delete sClassList[afl].Artxt;
													delete sClassList[afl].Changerequestid;
													delete sClassList[afl].Clint;
													delete sClassList[afl].Service;
													sModelData.classItems.push(sClassList[afl]);
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
											for (var jfv = 0; jfv < sCharList.length; jfv++) {
												if (sModelData.Functionallocation === sCharList[jfv].Funcloc) {
													sCharList[jfv].cNameEnable = false;
													sCharList[jfv].Textbz = sCharList[jfv].Atwtb;
													delete sCharList[jfv].Ataut;
													delete sCharList[jfv].Ataw1;
													delete sCharList[jfv].Atawe;
													delete sCharList[jfv].Atcod;
													delete sCharList[jfv].Atflb;
													delete sCharList[jfv].Atflv;
													delete sCharList[jfv].Atimb;
													delete sCharList[jfv].Atsrt;
													delete sCharList[jfv].Atvglart;
													delete sCharList[jfv].Atzis;
													delete sCharList[jfv].Changerequestid;
													delete sCharList[jfv].CharName;
													delete sCharList[jfv].Charid;
													delete sCharList[jfv].Classtype;
													delete sCharList[jfv].Service;
													delete sCharList[jfv].Valcnt;
													sCharList[jfv].slNo = jfv + 1; // ()
													sCharList[jfv].flag = sCharList[jfv].Class + "-" + sCharList[jfv].slNo; // ()
													sModelData.characteristics.push(sCharList[jfv]);
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
											// if (g.linearChar && g.linearChar.getId().includes("detailFloc") === true) {
											// 	g.linearChar.setModel(new JSONModel(sModelData.linearChar));
											// }
										}
									}
								}

								if (sModelData.UstaEqui) {
									oMainViewData.visible = true;
								} else {
									oMainViewData.visible = false;
								}
								oMainViewModel.setData(oMainViewModel);
								sArray.push(sModelData);
							}
							oAIWFLOCModel.setData(sArray);
						}
					}
				}

				if (r.Equipment.results.length > 0) {
					sArray = [];
					for (var ieq = 0; ieq < r.Equipment.results.length; ieq++) {
						var sModelData = r.Equipment.results[ieq];
						var sObject = {
							intlAddr: [],
							classItems: [],
							characteristics: [],
							linearChar: [],
							charNewButton: false,
							attachmentCount: "0", // Attachment Count
							Guids: "", // Attachment
							EqunrEnabled: true,
							EquipCatEnabled: true,
							MaintplantEnabled: true,
							BukrsEnabled: true,
							EqunrVS: "None",
							EqunrVST: "",
							EqktxVS: "None",
							EqktxVST: "",
							EquipmentCatogoryVS: "None",
							EquipmentCatogoryVST: "",
							MaintplantVS: "None",
							MaintplantVST: "",
							TplnrVS: "None",
							TplnrVST: "",
							SuperordinateEquipVS: "None",
							SuperordinateEquipVST: "",
							StsmEquiVS: "None",
							StsmEquiVST: "",
							UstwEquiVS: "None",
							UstwEquiVST: "",
							UswoEquiVS: "None",
							UswoEquiVST: "",
							TechnicalObjectTypVS: "None",
							TechnicalObjectTypVST: "",
							LocationVS: "None",
							LocationVSTL: "",
							AbckzVS: "None",
							AbckzVST: "",
							ArbplVS: "None",
							ArbplVST: "",
							BukrsVS: "None",
							BukrsVST: "",
							KostlVS: "None",
							KostlVST: "",
							WerksVS: "None",
							WerksVST: "",
							IngrpVS: "None",
							IngrpVST: "",
							ConstrTypeVS: "None",
							ConstrTypeVST: "",
							RefPostaVS: "None",
							RefPostaVST: "",
							MainArbplVS: "None",
							MainArbplVST: "",
							LangucodeVS: "None",
							LangucodeVST: "",
							TimeZoneVS: "None",
							TimeZoneVST: "",
							ConstrTypeMaxL: 0,
							charValueMaxL: 0,

							dfps: {
								Tailno: "",
								TailnoVS: "None",
								Area: "",
								AreaDesc: "",
								AreaPrfl: "",
								Site: "",
								SiteDesc: "",
								SiteVS: "None",
								SitePrfl: "",
								MPO: "",
								MPODesc: "",
								RIC: "",
								RICDesc: "",
								ModelId: "",
								ModelIdDesc: "",
								ModelIdVS: "None",
								ForeignEq: false,
								TechSts: "",
								OperSts: "0001",
								Remark: "",
								dfpsCrtEnabled: true,
								dfpsDltEnabled: false,
								dfpsEnabled: false,
								TailnoReq: false,
							}
						};
						sObject.Equnr = sModelData.Equnr;
						sObject.Eqktx = sModelData.Txtmi;
						// sObject.Eqktx = sModelData.Eqktx;
						sObject.EquipmentCatogory = sModelData.Eqtyp;
						sObject.EquipCatgDescription = sModelData.Etytx;
						sObject.Maintplant = sModelData.Swerk;
						sObject.MaintplantDesc = sModelData.Name1;

						sObject.SuperordinateEquip = sModelData.HequEeqz; // Superord. Equipment
						sObject.SuperordinateEquipDesc = sModelData.SuperordEqDes; // Superord. Equipment Description
						sObject.Bukrs = sModelData.BukrEilo;
						sObject.Butxt = sModelData.Butxt;
						sObject.Location = sModelData.StorEilo; // Location
						sObject.Locationdesc = sModelData.Locationdesc; // Location Description
						sObject.Abckz = sModelData.AbckEilo;
						sObject.Abctx = sModelData.Abctx;
						sObject.Kostl = sModelData.KostEilo; // Cost Center
						sObject.Kokrs = sModelData.KokrEilo; // ccPart1
						sObject.Mctxt = sModelData.Contareaname; // Name
						sObject.Answt = sModelData.Answt;
						sObject.Ansdt = formatter.getDateFormat(sModelData.Ansdt);
						sObject.Waers = sModelData.Waers; // Currency
						sObject.Werks = sModelData.PplaEeqz; // Planning Plant
						sObject.Planningplantdes = sModelData.Planningplantdes; // Planning Plant Description
						sObject.Ingrp = sModelData.IngrEeqz; // Planner Group
						sObject.Innam = sModelData.Plannergrpdesc; // Planner Group Description
						sObject.Arbpl = sModelData.ArbpEilo; // Work Center
						sObject.Ktext = sModelData.Workcenterdesc; // Work Center Description
						sObject.WcWerks = sModelData.WorkCenterPlant; // Work center Plant
						sObject.MainArbpl = sModelData.ArbpEeqz; // Main Work Center
						sObject.MainKtext = sModelData.MainWcDesc; // Plant Work Center
						sObject.MainWerks = sModelData.MainWcPlant; // Name
						sObject.BeberFl = sModelData.BebeEilo; // Plant Section
						sObject.Fing = sModelData.Fing; // Plant Section
						sObject.Tele = sModelData.Tele; // Plant Section
						sObject.Herst = sModelData.Herst; // Manufacturer
						sObject.TechnicalObjectTyp = sModelData.Eqart; // TechnicalObjectTyp
						sObject.Description = sModelData.Eartx; // TechnicalObjectTyp Description
						sObject.Typbz = sModelData.Typbz; // Model Number
						sObject.ConstrType = sModelData.SubmEeqz; // Construction Type
						sObject.ConstructionDesc = sModelData.Constdesc; // Construction Description
						sObject.TechIdNum = sModelData.TidnEeqz; // techIndNo
						sObject.Serge = sModelData.Serge; // manfSerNo
						sObject.MapaEeqz = sModelData.MapaEeqz; // partNum
						sObject.EquipPosition = sModelData.HeqnEeqz; // Position

						sObject.Stattext = sModelData.Stattext; // System Status
						sObject.StsmEqui = sModelData.StsmEqui; // Status Profile
						sObject.StsmEquiDesc = sModelData.Statproftxt; // Status Profile Description
						sObject.UstwEqui = sModelData.UstwEqui; // Status with Status Number
						sObject.UswoEqui = sModelData.UswoEqui; // Status without Status Number
						sObject.UstaEqui = sModelData.UstaEqui; // User Status
						sObject.menuAction = sModelData.IsMenu;
						sObject.Adrnr = sModelData.Adrnr;
						sObject.Adrnri = sModelData.Adrnri;
						sObject.Fhmkz = sModelData.Fhmkz; // PRT fields visible
						sObject.Funcid = sModelData.Funcid; //Config control data
						sObject.Frcfit = sModelData.Frcfit;
						sObject.Frcrmv = sModelData.Frcrmv;

						if (sObject.Equnr === sLocalVar) { //For DOI
							g.equiHeader = r.Equipment.results[ieq];
							sObject.Maintplant = currentHeader.Maintplant;
							sObject.MaintplantDesc = currentHeader.MaintplantDesc;
							sObject.Bukrs = currentHeader.Bukrs;
							sObject.Butxt = currentHeader.Butxt;
							sObject.Location = currentHeader.Location; // Location
							sObject.Locationdesc = currentHeader.Locationdesc; // Location Description
							sObject.Abckz = currentHeader.Abckz;
							sObject.Abctx = currentHeader.Abctx;
							sObject.Kostl = currentHeader.Kostl; // Cost Center
							sObject.Kokrs = currentHeader.Kokrs; // ccPart1
							sObject.Mctxt = currentHeader.Mctxt; // Name
							sObject.Werks = currentHeader.Werks; // Planning Plant
							sObject.Planningplantdes = currentHeader.Planningplantdes; // Planning Plant Description
							sObject.Ingrp = currentHeader.Ingrp; // Planner Group
							sObject.Innam = currentHeader.Innam; // Planner Group Description
							sObject.MainArbpl = currentHeader.MainArbpl; // Main Work Center
							sObject.MainKtext = currentHeader.MainKtext; // Plant Work Center
							sObject.MainWerks = currentHeader.MainWerks; // Name
							sObject.BeberFl = currentHeader.BeberFl; // Plant Section
							sObject.Fing = currentHeader.Fing; // Plant Section
							sObject.Tele = currentHeader.Tele; // Plant Section
							sObject.Stattext = currentHeader.Stattext;
						}

						if (r.EqPRT) {
							var sPRT = r.EqPRT.results[ieq];
							if (sPRT) {
								sObject.PlanvPrt = sPRT.PlanvPrt;
								sObject.SteufPrt = sPRT.SteufPrt;
								sObject.KtschPrt = sPRT.KtschPrt;
								sObject.Ewformprt = sPRT.Ewformprt;
								sObject.PlanvPrtText = AIWEQUIModel[ieq].PlanvPrtText;
								sObject.SteufPrtText = AIWEQUIModel[ieq].SteufPrtText;
								sObject.KtschPrtText = AIWEQUIModel[ieq].KtschPrtText;
								sObject.EwformprtText = AIWEQUIModel[ieq].EwformprtText;
								sObject.SteufRef = sPRT.SteufRef;
								sObject.KtschRef = sPRT.KtschRef;
								sObject.EwformRef = sPRT.EwformRef;
							} else {
								sObject.PlanvPrt = "";
								sObject.SteufPrt = "";
								sObject.KtschPrt = "";
								sObject.Ewformprt = "";
								sObject.PlanvPrtText = "";
								sObject.SteufPrtText = "";
								sObject.KtschPrtText = "";
								sObject.EwformprtText = "";
								sObject.SteufRef = false;
								sObject.KtschRef = false;
								sObject.EwformRef = false;
							}
						}

						if (r.EqLAM.results.length > 0) {
							var aEqLAM = r.EqLAM.results;
							for (var x = 0; x < aEqLAM.length; x++) {
								if (aEqLAM[x].Equi === sModelData.Equnr) {
									////////////// Superior FLOC/EQUI has LAM data - start /////////////////////
									// if (sObject.Equnr === sLocalVar && sObject.EquipmentCatogory === "L" && g.lamSwitch === "X") {
									// 	sObject.lam = currentLAM;
									// 	var tempIndex = x;
									// 	var sMsg = "Superior object has been changed. Do you want to copy linear data from superior object?";
									// 	sap.m.MessageBox.confirm(sMsg, {
									// 		title: "Confirmation",
									// 		onClose: function (oAction) {
									// 			if (oAction === "OK") {
									// 				var oEqLAM = {
									// 					"Equi": aEqLAM[tempIndex].Equi,
									// 					"Lrpid": aEqLAM[tempIndex].Lrpid,
									// 					"LrpidDesc": aEqLAM[tempIndex].LrpDescr,
									// 					"Strtptatr": aEqLAM[tempIndex].Strtptatr,
									// 					"Endptatr": aEqLAM[tempIndex].Endptatr,
									// 					"Length": parseInt(aEqLAM[tempIndex].Length !== "" ? aEqLAM[tempIndex].Length : "0"),
									// 					"LinUnit": aEqLAM[tempIndex].LinUnit,
									// 					"LinUnitDesc": aEqLAM[tempIndex].Uomtext,
									// 					"Startmrkr": aEqLAM[tempIndex].Startmrkr,
									// 					"Endmrkr": aEqLAM[tempIndex].Endmrkr,
									// 					"Mrkdisst": aEqLAM[tempIndex].Mrkdisst,
									// 					"Mrkdisend": aEqLAM[tempIndex].Mrkdisend,
									// 					"MrkrUnit": aEqLAM[tempIndex].MrkrUnit,
									// 					"LamDer": aEqLAM[tempIndex].LamDer
									// 				};
									// 				var mLocalModel = g.getView().getModel(g.oModelName);
									// 				var sMdlData = mLocalModel.getData();
									// 				sMdlData.lam = oEqLAM;
									// 				mLocalModel.setData(sMdlData);
									// 				g.lam.setModel(mLocalModel, "AIWLAM");
									// 			}
									// 		}
									// 	});
									// 	break;
									// }
									////////////// Superior FLOC/EQUI has LAM data - end /////////////////////
									var oEqLAM = {
										"Equi": aEqLAM[x].Equi,
										"Lrpid": aEqLAM[x].Lrpid,
										"LrpidDesc": aEqLAM[x].LrpDescr,
										"Strtptatr": aEqLAM[x].Strtptatr,
										"Endptatr": aEqLAM[x].Endptatr,
										"Length": aEqLAM[x].Length,
										"LinUnit": aEqLAM[x].LinUnit,
										"LinUnitDesc": aEqLAM[x].Uomtext,
										"Startmrkr": aEqLAM[x].Startmrkr,
										"Endmrkr": aEqLAM[x].Endmrkr,
										"Mrkdisst": aEqLAM[x].Mrkdisst,
										"Mrkdisend": aEqLAM[x].Mrkdisend,
										"MrkrUnit": aEqLAM[x].MrkrUnit
									};
									sObject.lam = oEqLAM;
									break;
								}
							}
						}

						if (sObject.Equnr === sLocalVar && sObject.EquipmentCatogory === "L" && g.lamSwitch === "X") {
							sObject.lam = currentLAM;

							if (r.EqLAM.results.length > 0) {
								g.equiLAM = r.EqLAM.results;
							}
						}

						if (sModelData.Type === true) {
							sObject.viewParameter = "create";
						}

						if (sModelData.Type === false) {
							sObject.viewParameter = "change";
							sObject.EqunrEnabled = false;

							if (sObject.EquipmentCatogory === "" || sObject.EquipmentCatogory === undefined) {
								sObject.EquipCatEnabled = true;
							} else {
								sObject.EquipCatEnabled = false;
							}
							if (sObject.Maintplant === "" || sObject.Maintplant === undefined) {
								sObject.MaintplantEnabled = true;
							} else {
								sObject.MaintplantEnabled = false;
							}
							if (sObject.Tplnr === "" || sObject.Tplnr === undefined) {
								sObject.TplnrEnabled = true;
							} else {
								sObject.TplnrEnabled = false;
							}
						}

						if (sModelData.Swerk !== "") {
							sObject.BukrsEnabled = false;
						} else {
							sObject.BukrsEnabled = true;
						}

						if (sModelData.Eqtyp !== "P") {
							sObject.Tplnr = sModelData.TplnEilo; // Functional Location
							sObject.Pltxt = sModelData.Flocdescription; // Functional Location Description
							sObject.TplnrEnabled = true;
						} else {
							sObject.Tplnr = "";
							sObject.Pltxt = "";
							sObject.TplnrEnabled = false;
						}
						if (sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) {
							sObject.TplnrEnabled = false;
							sObject.SuperordinateEquipEnabled = true;
						} else if (sObject.Tplnr !== "" && sObject.Tplnr !== undefined) {
							sObject.TplnrEnabled = true;
							sObject.SuperordinateEquipEnabled = false;
						}
						if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) || (sObject.Tplnr !== "" && sObject.Tplnr !==
								undefined)) {
							sObject.MaintplantEnabled = true; //false;
						} else {
							sObject.MaintplantEnabled = true;
						}

						if (r.EqAddr) {
							if (r.EqAddr.results) {
								var sAddress = r.EqAddr.results;
								if (sAddress) {
									if (sAddress.length > 0) {
										for (var jeq = 0; jeq < sAddress.length; jeq++) {
											if (sObject.Equnr === sAddress[jeq].Equi) {
												var oAddressEquiModel = sap.ui.getCore().getModel("equiAddressView");
												var oAddressEquiData = oAddressEquiModel.getData();
												var mCountEquiFlag = true;
												var sEquiObj, sEquiMatchIndex;
												if (oAddressEquiData.length > 0) {
													for (var sfa = 0; sfa < oAddressEquiData.length; sfa++) {
														if (sModelData.Equnr === oAddressEquiData[sfa].Equnr) {
															mCountEquiFlag = false;
															sEquiMatchIndex = sfa;
															break;
														}
													}
												}
												if (mCountEquiFlag === true) {
													if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
														(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
														sEquiObj = {
															Equnr: sModelData.Equnr,
															Tplnr: sObject.Tplnr,
															IsEditable: sAddress[jeq].IsEditable
														};
														oAddressEquiData.push(sEquiObj);
														oAddressEquiModel.setData(oAddressEquiData);
													}
												}
												if (mCountEquiFlag === false) {
													if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
														(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
														oAddressEquiData[sEquiMatchIndex].Equnr = sModelData.Equnr;
														oAddressEquiData[sEquiMatchIndex].Tplnr = sModelData.Tplnr;
														oAddressEquiData[sEquiMatchIndex].IsEditable = sAddress[jeq].IsEditable; //sModelData.IsEditable;
														oAddressEquiModel.setData(oAddressEquiData);
													}
												}

												sObject.IsEditable = sAddress[jeq].IsEditable;
												sObject.Title = sAddress[jeq].Titletxt ? sAddress[jeq].Titletxt : "";
												sObject.TitleCode = sAddress[jeq].Title ? sAddress[jeq].Title : "";
												sObject.Name1 = sAddress[jeq].Name1 ? sAddress[jeq].Name1 : "";
												sObject.Name2 = sAddress[jeq].Name2 ? sAddress[jeq].Name2 : "";
												sObject.Name3 = sAddress[jeq].Name3 ? sAddress[jeq].Name3 : "";
												sObject.Name4 = sAddress[jeq].Name4 ? sAddress[jeq].Name4 : "";
												sObject.Sort1 = sAddress[jeq].Sort1 ? sAddress[jeq].Sort1 : "";
												sObject.Sort2 = sAddress[jeq].Sort2 ? sAddress[jeq].Sort2 : "";
												sObject.NameCo = sAddress[jeq].NameCo ? sAddress[jeq].NameCo : "";
												sObject.PostCod1 = sAddress[jeq].PostCod1 ? sAddress[jeq].PostCod1 : "";
												sObject.City1 = sAddress[jeq].City1 ? sAddress[jeq].City1 : "";
												sObject.Building = sAddress[jeq].Building ? sAddress[jeq].Building : "";
												sObject.Floor = sAddress[jeq].Floor ? sAddress[jeq].Floor : "";
												sObject.Roomnum = sAddress[jeq].Roomnum ? sAddress[jeq].Roomnum : "";
												sObject.AddrLocation = sAddress[jeq].Location ? sAddress[jeq].Location : "";
												sObject.Strsuppl1 = sAddress[jeq].Strsuppl1 ? sAddress[jeq].Strsuppl1 : "";
												sObject.Strsuppl2 = sAddress[jeq].Strsuppl2 ? sAddress[jeq].Strsuppl2 : "";
												sObject.Strsuppl3 = sAddress[jeq].Strsuppl3 ? sAddress[jeq].Strsuppl3 : "";
												sObject.RefPosta = sAddress[jeq].RefPosta ? sAddress[jeq].RefPosta : "";
												sObject.Landx = sAddress[jeq].Landx ? sAddress[jeq].Landx : "";
												sObject.TimeZone = sAddress[jeq].TimeZone ? sAddress[jeq].TimeZone : "";
												sObject.Region = sAddress[jeq].RfePost ? sAddress[jeq].RfePost : "";
												sObject.RegionDesc = sAddress[jeq].Regiotxt ? sAddress[jeq].Regiotxt : "";
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
								}
							}
						}

						if (sObject.Equnr === sLocalVar) {
							var oAddressEquiModel = sap.ui.getCore().getModel("equiAddressView");
							var oAddressEquiData = oAddressEquiModel.getData();
							var mCountEquiFlag = true;
							var sEquiObj, sEquiMatchIndex;
							if (oAddressEquiData.length > 0) {
								for (var sfa = 0; sfa < oAddressEquiData.length; sfa++) {
									if (sObject.Equnr === oAddressEquiData[sfa].Equnr) {
										mCountEquiFlag = false;
										sEquiMatchIndex = sfa;
										break;
									}
								}
							}
							if (mCountEquiFlag === true) {
								if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
									(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
									sEquiObj = {
										Equnr: sObject.Equnr,
										Tplnr: sObject.Tplnr,
										IsEditable: currentAddr.IsEditable
									};
									oAddressEquiData.push(sEquiObj);
									oAddressEquiModel.setData(oAddressEquiData);
								}
							}
							if (mCountEquiFlag === false) {
								if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
									(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
									oAddressEquiData[sEquiMatchIndex].Equnr = sObject.Equnr;
									oAddressEquiData[sEquiMatchIndex].Tplnr = sObject.Tplnr;
									oAddressEquiData[sEquiMatchIndex].IsEditable = sObject.IsEditable;
									oAddressEquiModel.setData(oAddressEquiData);
								}
							}

							sObject.IsEditable = currentAddr.IsEditable;
							sObject.Title = currentAddr.Titletxt ? currentAddr.Titletxt : "";
							sObject.TitleCode = currentAddr.Title ? currentAddr.Title : "";
							sObject.Name1 = currentAddr.Name1 ? currentAddr.Name1 : "";
							sObject.Name2 = currentAddr.Name2 ? currentAddr.Name2 : "";
							sObject.Name3 = currentAddr.Name3 ? currentAddr.Name3 : "";
							sObject.Name4 = currentAddr.Name4 ? currentAddr.Name4 : "";
							sObject.Sort1 = currentAddr.Sort1 ? currentAddr.Sort1 : "";
							sObject.Sort2 = currentAddr.Sort2 ? currentAddr.Sort2 : "";
							sObject.NameCo = currentAddr.NameCo ? currentAddr.NameCo : "";
							sObject.PostCod1 = currentAddr.PostCod1 ? currentAddr.PostCod1 : "";
							sObject.City1 = currentAddr.City1 ? currentAddr.City1 : "";
							sObject.Building = currentAddr.Building ? currentAddr.Building : "";
							sObject.Floor = currentAddr.Floor ? currentAddr.Floor : "";
							sObject.Roomnum = currentAddr.Roomnum ? currentAddr.Roomnum : "";
							sObject.AddrLocation = currentAddr.Location ? currentAddr.Location : "";
							sObject.Strsuppl1 = currentAddr.Strsuppl1 ? currentAddr.Strsuppl1 : "";
							sObject.Strsuppl2 = currentAddr.Strsuppl2 ? currentAddr.Strsuppl2 : "";
							sObject.Strsuppl3 = currentAddr.Strsuppl3 ? currentAddr.Strsuppl3 : "";
							sObject.RefPosta = currentAddr.RefPosta ? currentAddr.RefPosta : "";
							sObject.Landx = currentAddr.Landx ? currentAddr.Landx : "";
							sObject.TimeZone = currentAddr.TimeZone ? currentAddr.TimeZone : "";
							sObject.Region = currentAddr.RfePost ? currentAddr.RfePost : "";
							sObject.RegionDesc = currentAddr.Regiotxt ? currentAddr.Regiotxt : "";

							if (r.EqAddr.results) {
								g.equiAddr = r.EqAddr.results;
							}
						}

						var aIntlAddr = r.EqAddrI.results;
						if (aIntlAddr.length > 0) {
							for (var z = 0; z < aIntlAddr.length; z++) {
								if (aIntlAddr[z].Equi === sObject.Equnr) {
									aIntlAddr[z].AdNationEnable = false;
									aIntlAddr[z].City1iVS = "None";
									aIntlAddr[z].StreetiVS = "None";
									sObject.intlAddr.push(aIntlAddr[z]);
								}
							}
						}

						if (sObject.Equnr === sLocalVar && sObject.intlAddr.length > 0) { //For DOI
							g.equiIntlAddr = sObject.intlAddr;
							sObject.intlAddr = currentIntlAddr;
						} else {
							g.equiIntlAddr = [];
						}

						if (r.EqDFPS) {
							if (r.EqDFPS.results) {
								var sDpfs = r.EqDFPS.results;
								if (sDpfs) {
									if (sDpfs.length > 0) {
										for (var ud = 0; ud < sDpfs.length; ud++) {
											if (sObject.Equnr === sDpfs[ud].Equi) {
												sObject.dfps.Equnr = sDpfs[ud].Equi;
												sObject.dfps.MeOwner = sDpfs[ud].MeOwner;
												sObject.dfps.MeUser = sDpfs[ud].MeUser;
												sObject.dfps.Tailno = sDpfs[ud].DeviceId;
												sObject.dfps.Area = sDpfs[ud].Topsiteid;
												sObject.dfps.AreaDesc = sDpfs[ud].Topsitede;
												sObject.dfps.AreaPrfl = sDpfs[ud].AreaPro;
												sObject.dfps.Site = sDpfs[ud].SiteId;
												sObject.dfps.SiteDesc = sDpfs[ud].SiteDesc;
												sObject.dfps.SitePrfl = sDpfs[ud].SitePro;
												sObject.dfps.MPO = sDpfs[ud].MpoId;
												sObject.dfps.MPODesc = sDpfs[ud].MpoDescr;
												sObject.dfps.RIC = sDpfs[ud].RicId;
												sObject.dfps.RICDesc = sDpfs[ud].RicDescr;
												sObject.dfps.ModelId = sDpfs[ud].ModelId;
												sObject.dfps.ModelIdDesc = sDpfs[ud].ModelDes;
												sObject.dfps.ForeignEq = formatter.XtoTrue(sDpfs[ud].Foreignob);
												sObject.dfps.TechSts = sDpfs[ud].TecState;
												sObject.dfps.OperSts = sDpfs[ud].DepState;
												sObject.dfps.Remark = sDpfs[ud].DfpsRmrk;
												if (sDpfs[ud].DeviceId !== "") {
													sObject.dfps.dfpsCrtEnabled = false;
													sObject.dfps.dfpsDltEnabled = true;
													sObject.dfps.dfpsEnabled = true;
													sObject.dfps.TailnoReq = true;
												}
											}
										}
									}
								}
							}
						}

						if (r.EqClass) {
							var sClassList = r.EqClass.results;
							if (sClassList) {
								if (sClassList.length > 0) {
									for (var aeq = 0; aeq < sClassList.length; aeq++) {
										if (sObject.Equnr === sClassList[aeq].Equi) {
											sClassList[aeq].ctEnable = false;
											sClassList[aeq].classEnable = false;
											sClassList[aeq].ClassTypeDesc = sClassList[aeq].Artxt;
											delete sClassList[aeq].Artxt;
											delete sClassList[aeq].Changerequestid;
											delete sClassList[aeq].Clint;
											delete sClassList[aeq].Service;
											sObject.classItems.push(sClassList[aeq]);
										}
									}
									sObject.charNewButton = true;
									if (g.class && g.class.getId().includes("detailEqui") === true) {
										// var itemFragmentId = g.getView().createId("charFrag");
										// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
										// newCharBtn.setEnabled(true);
										g.class.setModel(new JSONModel(sObject.classItems));
									}
								}
							}
						}

						if (r.EqVal) {
							var sCharList = r.EqVal.results;
							if (sCharList) {
								if (sCharList.length > 0) {
									for (var jev = 0; jev < sCharList.length; jev++) {
										if (sObject.Equnr === sCharList[jev].Equi) {
											sCharList[jev].cNameEnable = false;
											sCharList[jev].Textbz = sCharList[jev].Atwtb;
											delete sCharList[jev].Ataut;
											delete sCharList[jev].Ataw1;
											delete sCharList[jev].Atawe;
											delete sCharList[jev].Atcod;
											delete sCharList[jev].Atflb;
											delete sCharList[jev].Atflv;
											delete sCharList[jev].Atimb;
											delete sCharList[jev].Atsrt;
											delete sCharList[jev].Atvglart;
											delete sCharList[jev].Atzis;
											delete sCharList[jev].Changerequestid;
											delete sCharList[jev].CharName;
											delete sCharList[jev].Charid;
											delete sCharList[jev].Classtype;
											delete sCharList[jev].Service;
											delete sCharList[jev].Valcnt;
											sCharList[jev].slNo = jev + 1; // ()
											sCharList[jev].flag = sCharList[jev].Class + "-" + sCharList[jev].slNo; // ()
											sObject.characteristics.push(sCharList[jev]);
										}
									}
									if (g.char && g.char.getId().includes("detailEqui") === true) {
										g.char.setModel(new JSONModel(sObject.characteristics));
									}
								}
							}
						}

						if (r.EqLAMCH) {
							var alinearChar = r.EqLAMCH.results;
							if (alinearChar) {
								if (alinearChar.length > 0) {
									for (var j = 0; j < alinearChar.length; j++) {
										if (sObject.Equnr === alinearChar[j].Equi) {
											alinearChar[j].linCharEnable = true;
											sObject.linearChar.push(alinearChar[j]);
										}
									}
									// if (g.linearChar && g.linearChar.getId().includes("detailFloc") === true) {
									// 	g.linearChar.setModel(new JSONModel(sModelData.linearChar));
									// }
								}
							}
						}

						if (sObject.UstaEqui) {
							oMainViewData.visible = true;
						} else {
							oMainViewData.visible = false;
						}
						oMainViewModel.setData(oMainViewData);
						sArray.push(sObject);
					}
					oAIWEQUIModel.setData(sArray);

					for (var leq = 0; leq < oAIWEQUIModel.getData().length; leq++) {
						if (sLocalVar === oAIWEQUIModel.getData()[leq].Equnr) {
							g.rowIndex = "/" + leq;
							var oJsonModel = new JSONModel();
							var sCurrentObject = oAIWEQUIModel.getProperty(g.rowIndex);

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

								var sAddressModel = g.getView().getModel("equiAddressView");
								var sAddressData = sAddressModel.getData();
								sAddressData.enabled = sCurrentObject.IsEditable;
								sAddressModel.setData(sAddressData);
							}
							oJsonModel.setData(sCurrentObject);
							g.getView().setModel(oJsonModel, g.oModelName);
							g.lam.setModel(oJsonModel, "AIWLAM");

							var sCopyArray = [oJsonModel.getData()];
							var sSupEquiData = $.map(sCopyArray, function (obj) {
								return $.extend(true, {}, obj);
							});
							var sSupEquiModel = new JSONModel();
							sSupEquiModel.setData(sSupEquiData);
							g.getView().setModel(sSupEquiModel, "SUP_EQUI_DATA");

							var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
							var mSupEquiData = mSupEquiModel.getData();
							var mCountCEquiFlag = true;
							for (var se = 0; se < mSupEquiData.length; se++) {
								if (sCurrentObject.Equnr === mSupEquiData[se].Equnr) {
									mCountCEquiFlag = false;
								}
							}
							if (mCountCEquiFlag === true) {
								if ((sCurrentObject.SuperordinateEquip !== "" && sCurrentObject.SuperordinateEquip !== undefined) ||
									(sCurrentObject.Tplnr !== "" && sCurrentObject.Tplnr !== undefined)) {
									mSupEquiData.push(sSupEquiData[0]);
									mSupEquiModel.setData(mSupEquiData);
								}
							}

							oMainViewData.tableBusy = false;
							oMainViewModel.setData(oMainViewData);
							//return;
							break;
						}
					}

					var aEQDOIdata = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
					for (var i = 0; i < r.Equipment.results.length; i++) {
						var h = r.Equipment.results[i];
						for (var z = 0; z < aEQDOIdata.length; z++) {
							if (h.Equnr === aEQDOIdata[z].key) {
								var aDOIFields = aEQDOIdata[z].DOI;
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
									aDOIFields[1].currentVal = h.StorEilo;
									aDOIFields[1].targetVal = h.StorEilo;
								} else {
									aDOIFields[1].maintenance = false;
									aDOIFields[1].instLoc = true;
									aDOIFields[1].SupFlVal = h.StorEilo;
									aDOIFields[1].currentVal = "";
									aDOIFields[1].targetVal = h.StorEilo;
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
									aDOIFields[2].currentVal = h.BebeEilo;
									aDOIFields[2].targetVal = h.BebeEilo;
								} else {
									aDOIFields[2].maintenance = false;
									aDOIFields[2].instLoc = true;
									aDOIFields[2].SupFlVal = h.BebeEilo;
									aDOIFields[2].currentVal = "";
									aDOIFields[2].targetVal = h.BebeEilo;
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
									aDOIFields[3].currentVal = h.ArbpEilo;
									aDOIFields[3].targetVal = h.ArbpEilo;
								} else {
									aDOIFields[3].maintenance = false;
									aDOIFields[3].instLoc = true;
									aDOIFields[3].SupFlVal = h.ArbpEilo;
									aDOIFields[3].currentVal = "";
									aDOIFields[3].targetVal = h.ArbpEilo;
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
									aDOIFields[4].currentVal = h.AbckEilo;
									aDOIFields[4].targetVal = h.AbckEilo;
								} else {
									aDOIFields[4].maintenance = false;
									aDOIFields[4].instLoc = true;
									aDOIFields[4].SupFlVal = h.AbckEilo;
									aDOIFields[4].currentVal = "";
									aDOIFields[4].targetVal = h.AbckEilo;
								}

								if (h.Kostli === "") {
									aDOIFields[5].maintenance = false;
									aDOIFields[5].instLoc = false;
									aDOIFields[5].SupFlVal = "";
									aDOIFields[5].currentVal = "";
									aDOIFields[5].targetVal = "";
								} else if (h.Kostli === "D") {
									aDOIFields[5].maintenance = true;
									aDOIFields[5].instLoc = false;
									aDOIFields[5].SupFlVal = "";
									aDOIFields[5].currentVal = h.KostEilo;
									aDOIFields[5].targetVal = h.KostEilo;
								} else {
									aDOIFields[5].maintenance = false;
									aDOIFields[5].instLoc = true;
									aDOIFields[5].SupFlVal = h.KostEilo;
									aDOIFields[5].currentVal = "";
									aDOIFields[5].targetVal = h.KostEilo;
								}

								if (h.Iwerki === "") {
									aDOIFields[6].maintenance = false;
									aDOIFields[6].instLoc = false;
									aDOIFields[6].SupFlVal = "";
									aDOIFields[6].currentVal = "";
									aDOIFields[6].targetVal = "";
								} else if (h.Iwerki === "D") {
									aDOIFields[6].maintenance = true;
									aDOIFields[6].instLoc = false;
									aDOIFields[6].SupFlVal = "";
									aDOIFields[6].currentVal = h.PplaEeqz;
									aDOIFields[6].targetVal = h.PplaEeqz;
								} else {
									aDOIFields[6].maintenance = false;
									aDOIFields[6].instLoc = true;
									aDOIFields[6].SupFlVal = h.PplaEeqz;
									aDOIFields[6].currentVal = "";
									aDOIFields[6].targetVal = h.PplaEeqz;
								}

								if (h.Ingrpi === "") {
									aDOIFields[7].maintenance = false;
									aDOIFields[7].instLoc = false;
									aDOIFields[7].SupFlVal = "";
									aDOIFields[7].currentVal = "";
									aDOIFields[7].targetVal = "";
								} else if (h.Ingrpi === "D") {
									aDOIFields[7].maintenance = true;
									aDOIFields[7].instLoc = false;
									aDOIFields[7].SupFlVal = "";
									aDOIFields[7].currentVal = h.IngrEeqz;
									aDOIFields[7].targetVal = h.IngrEeqz;
								} else {
									aDOIFields[7].maintenance = false;
									aDOIFields[7].instLoc = true;
									aDOIFields[7].SupFlVal = h.IngrEeqz;
									aDOIFields[7].currentVal = "";
									aDOIFields[7].targetVal = h.IngrEeqz;
								}

								if (h.Gewrki === "") {
									aDOIFields[8].maintenance = false;
									aDOIFields[8].instLoc = false;
									aDOIFields[8].SupFlVal = "";
									aDOIFields[8].currentVal = "";
									aDOIFields[8].targetVal = "";
								} else if (h.Gewrki === "D") {
									aDOIFields[8].maintenance = true;
									aDOIFields[8].instLoc = false;
									aDOIFields[8].SupFlVal = "";
									aDOIFields[8].currentVal = h.ArbpEeqz;
									aDOIFields[8].targetVal = h.ArbpEeqz;
								} else {
									aDOIFields[8].maintenance = false;
									aDOIFields[8].instLoc = true;
									aDOIFields[8].SupFlVal = h.ArbpEeqz;
									aDOIFields[8].currentVal = "";
									aDOIFields[8].targetVal = h.ArbpEeqz;
								}

								if (h.Adrnri === "") {
									aDOIFields[10].maintenance = false;
									aDOIFields[10].instLoc = false;
									aDOIFields[10].SupFlVal = "";
									aDOIFields[10].currentVal = "";
									aDOIFields[10].targetVal = "";
								} else if (h.Adrnri === "D") {
									aDOIFields[10].maintenance = true;
									aDOIFields[10].instLoc = false;
									aDOIFields[10].SupFlVal = "";
									aDOIFields[10].currentVal = h.Adrnr;
									aDOIFields[10].targetVal = h.Adrnr;
								} else {
									aDOIFields[10].maintenance = false;
									aDOIFields[10].instLoc = true;
									aDOIFields[10].SupFlVal = h.Adrnr;
									aDOIFields[10].currentVal = "";
									aDOIFields[10].targetVal = h.Adrnr;
								}
							}
						}
					}

					for (var z = 0; z < aEQDOIdata.length; z++) {
						if (aEQDOIdata[z].key === sLocalVar) {
							g.getView().getModel("dataOrigin").setData(aEQDOIdata[z].DOI)
						}
					}
				}
				oMainViewData.tableBusy = false;
				oMainViewModel.setData(oMainViewData);

				if (imValue !== "" && imObject === "EQ") {
					g.superiorEquipment = imValue;
					g.superiorEqDesc = imDesc; //g.getView().byId("superOrdEqDesc").getValue();
				} else if (imValue !== "" && imObject === "FL") {
					g.functionalLocation = imValue;
					g.functionalLocDesc = imDesc; //g.getView().byId("FunctionalLocationidDesc").getValue();
				}
				g.getView().getModel("dataOrigin").setProperty("/originDerive", r);
				g.openDoiView(undefined, r);
			};
			var fnError = function (err) {
				g.BusyDialog.close();
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
				oMainViewData.tableBusy = false;
				oMainViewModel.setData(oMainViewData);
				// g.invokeMessage(value);
				MessageBox.show(value, {
					title: "Error",
					icon: sap.m.MessageBox.Icon.ERROR,
					onClose: function () {}
				});
			};

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
			g.BusyDialog.open();
			oModel.create(sPath, sPayload, {
				success: fnSuccess,
				error: fnError
			});

		},

		fetchSupFlocEquiDataChange: function (imValue, imObject, imDesc, imFlag) {
			var g = this;
			var sPath = "/ChangeRequestSet";
			var oModel = g.getView().getModel();
			var sArray = [];
			var sObject = {};
			var currentHeader = {};
			var currentLAM = {};
			var currentAddr = {};
			var currentIntlAddr = [];
			var currentPRT = {};
			var sPayload = {
				"ChangeRequestType": "AIWEAM0P",
				"CrDescription": "",
				"Reason": "01",
				"DeriveData": true,
				"FuncLoc": [],
				"FLAddr": [],
				"FLAddrI": [],
				"FLLAM": [],
				"FLClass": [],
				"FLVal": [],
				"FLALTLBEL": [],
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
				"Equi_DOI": [],
				"FLDOI": [],
				"FLLAMCH": [],
				"EqLAMCH": [],
				"EqDFPS": []
			};
			var oAIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC");
			var oAIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI");
			var oLocalModel = g.getView().getModel(g.oModelName);
			var sLocalVar;

			if (g.oModelName === "AIWEQUI") {
				sLocalVar = oLocalModel.getData().Equnr;
			}

			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();

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
						"Adrnri": AIWFLOCModel[a].Adrnri
					};

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
					sPayload.FLLAM.push(sFLLAM);

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
						"Workcenterdesc": AIWEQUIModel[d].Ktext, // Plant Work Center
						"WorkCenterPlant": AIWEQUIModel[d].WcWerks, // Name
						"ArbpEeqz": AIWEQUIModel[d].MainArbpl, // Main Work Center
						"MainWcDesc": AIWEQUIModel[d].MainKtext, // Work Center Description
						"MainWcPlant": AIWEQUIModel[d].MainWerks, // Work center Plant
						"BebeEilo": AIWEQUIModel[d].BeberFl, // Plant Section
						"Fing": AIWEQUIModel[d].Fing, // Plant Section
						"Tele": AIWEQUIModel[d].Tele, // Plant Section
						"HeqnEeqz": AIWEQUIModel[d].EquipPosition, // Position
						"IsMenu": AIWEQUIModel[d].menuAction,
						"Adrnr": AIWEQUIModel[d].Adrnr,
						"Adrnri": AIWEQUIModel[d].Adrnri,
						Fhmkz: AIWEQUIModel[d].Fhmkz, // PRT fields visible
						Funcid: AIWEQUIModel[d].Funcid, //Config control data
						Frcfit: AIWEQUIModel[d].Frcfit,
						Frcrmv: AIWEQUIModel[d].Frcrmv,
					};

					var aEQDOI = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
					if (aEQDOI && aEQDOI.length > 0) {
						var aDOIFields = aEQDOI[d].DOI;
						// sEquipment.Begrui = aDOIFields[0].instLoc ? "R" : "D";
						sEquipment.Swerki = aDOIFields[0].instLoc ? "R" : (aDOIFields[0].maintenance ? "D" : "");
						sEquipment.Storti = aDOIFields[1].instLoc ? "R" : (aDOIFields[1].maintenance ? "D" : "");
						// sEquipment.Msgrpi = aDOIFields[3].instLoc ? "R" : "D";
						sEquipment.Beberi = aDOIFields[2].instLoc ? "R" : (aDOIFields[2].maintenance ? "D" : "");
						sEquipment.Ppsidi = aDOIFields[3].instLoc ? "R" : (aDOIFields[3].maintenance ? "D" : "");
						sEquipment.Abckzi = aDOIFields[4].instLoc ? "R" : (aDOIFields[4].maintenance ? "D" : "");
						// sEquipment.Eqfnri = aDOIFields[7].instLoc ? "R" : "D";
						// sEquipment.Gsberi = aDOIFields[8].instLoc ? "R" : "D";
						sEquipment.Kostli = aDOIFields[5].instLoc ? "R" : (aDOIFields[5].maintenance ? "D" : "");
						// sEquipment.Proidi = aDOIFields[10].instLoc ? "R" : "D";
						// sEquipment.Daufni = aDOIFields[11].instLoc ? "R" : "D";
						// sEquipment.Aufnri = aDOIFields[12].instLoc ? "R" : "D";
						// sEquipment.Ppsidi = aDOIFields[13].instLoc ? "R" : "D";
						sEquipment.Iwerki = aDOIFields[6].instLoc ? "R" : (aDOIFields[6].maintenance ? "D" : "");
						sEquipment.Ingrpi = aDOIFields[7].instLoc ? "R" : (aDOIFields[7].maintenance ? "D" : "");
						sEquipment.Gewrki = aDOIFields[8].instLoc ? "R" : (aDOIFields[8].maintenance ? "D" : "");
						// sEquipment.Gewrki = aDOIFields[16].instLoc ? "R" : "D";
						// sEquipment.RbnrI = aDOIFields[17].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[18].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[19].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[20].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[21].instLoc ? "R" : "D";
						// sEquipment.Vkorgi = aDOIFields[22].instLoc ? "R" : "D";
						sEquipment.Adrnri = aDOIFields[10].instLoc ? "R" : (aDOIFields[10].maintenance ? "D" : "");
					}

					if (AIWEQUIModel[d].viewParameter === "create") {
						sEquipment.Type = true;
					}
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

					var aIntlAddr = AIWEQUIModel[d].intlAddr;
					if (aIntlAddr.length > 0) {
						for (var z = 0; z < aIntlAddr.length; z++) {
							sPayload.EqAddrI.push(aIntlAddr[z]);
						}
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
						"MrkrUnit": AIWEQUIModel[d].lam.MrkrUnit,
						"LamDer": AIWEQUIModel[d].lam.LamDer
					};
					sPayload.EqLAM.push(sEqLAM);

					if (AIWEQUIModel[d].dfps) {
						var oEqDFPS = {
							Equi: AIWEQUIModel[d].Equnr,
							DeviceId: AIWEQUIModel[d].dfps.Tailno,
							Topsiteid: AIWEQUIModel[d].dfps.Area,
							Topsitede: AIWEQUIModel[d].dfps.AreaDesc,
							AreaPro: AIWEQUIModel[d].dfps.AreaPrfl,
							SiteId: AIWEQUIModel[d].dfps.Site,
							SiteDesc: AIWEQUIModel[d].dfps.SiteDesc,
							SitePro: AIWEQUIModel[d].dfps.SitePrfl,
							MpoId: AIWEQUIModel[d].dfps.MPO,
							MpoDescr: AIWEQUIModel[d].dfps.MPODesc,
							RicId: AIWEQUIModel[d].dfps.RIC,
							RicDescr: AIWEQUIModel[d].dfps.RICDesc,
							ModelId: AIWEQUIModel[d].dfps.ModelId,
							ModelDes: AIWEQUIModel[d].dfps.ModelIdDesc,
							Foreignob: formatter.truetoX(AIWEQUIModel[d].dfps.ForeignEq),
							TecState: AIWEQUIModel[d].dfps.TechSts,
							DepState: AIWEQUIModel[d].dfps.OperSts,
							DfpsRmrk: AIWEQUIModel[d].dfps.Remark
						};
						sPayload.EqDFPS.push(oEqDFPS);
					}

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

					var aFLLinChar = AIWEQUIModel[d].linearChar;
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Equi = AIWEQUIModel[d].Equnr;
								sPayload.EqLAMCH.push(alinearChar[c]);
							}
						}
					}
				}
			}

			var sAIWData = g.getView().getModel(g.oModelName).getData();
			var sEquipment = {
				"Herst": sAIWData.Herst, // Manufacturer
				"Equnr": sAIWData.Equnr,
				"Txtmi": sAIWData.Eqktx,
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
				"Answt": sAIWData.Answt,
				"Ansdt": g._formatDate(sAIWData.Ansdt),
				"Waers": sAIWData.Waers, // Currency
				"ArbpEilo": sAIWData.Arbpl, // Work Center
				"Workcenterdesc": sAIWData.Ktext, // Plant Work Center
				"WorkCenterPlant": sAIWData.WcWerks, // Name
				"ArbpEeqz": sAIWData.MainArbpl, // Main Work Center
				"MainWcDesc": sAIWData.MainKtext, // Work Center Description
				"MainWcPlant": sAIWData.MainWerks, // Work center Plant
				"BebeEilo": sAIWData.BeberFl, // Plant Section
				"Fing": sAIWData.Fing, // Plant Section
				"Tele": sAIWData.Tele, // Plant Section
				"HeqnEeqz": sAIWData.EquipPosition, // Position
				"IsMenu": sAIWData.menuAction,
				"Adrnr": sAIWData.Adrnr,
				"Adrnri": sAIWData.Adrnri,
				Fhmkz: sAIWData.Fhmkz, // PRT fields visible
				Funcid: sAIWData.Funcid, //Config control data
				Frcfit: sAIWData.Frcfit,
				Frcrmv: sAIWData.Frcrmv,
			};

			var aDOIFields = this.getView().getModel("dataOrigin").getData();
			if (aDOIFields && aDOIFields.length > 0) {
				// sEquipment.Begrui = aDOIFields[0].instLoc ? "R" : "D";
				sEquipment.Swerki = aDOIFields[0].instLoc ? "R" : (aDOIFields[0].maintenance ? "D" : "");
				sEquipment.Storti = aDOIFields[1].instLoc ? "R" : (aDOIFields[1].maintenance ? "D" : "");
				// sEquipment.Msgrpi = aDOIFields[3].instLoc ? "R" : "D";
				sEquipment.Beberi = aDOIFields[2].instLoc ? "R" : (aDOIFields[2].maintenance ? "D" : "");
				sEquipment.Ppsidi = aDOIFields[3].instLoc ? "R" : (aDOIFields[3].maintenance ? "D" : "");
				sEquipment.Abckzi = aDOIFields[4].instLoc ? "R" : (aDOIFields[4].maintenance ? "D" : "");
				// sEquipment.Eqfnri = aDOIFields[7].instLoc ? "R" : "D";
				// sEquipment.Gsberi = aDOIFields[8].instLoc ? "R" : "D";
				sEquipment.Kostli = aDOIFields[5].instLoc ? "R" : (aDOIFields[5].maintenance ? "D" : "");
				// sEquipment.Proidi = aDOIFields[10].instLoc ? "R" : "D";
				// sEquipment.Daufni = aDOIFields[11].instLoc ? "R" : "D";
				// sEquipment.Aufnri = aDOIFields[12].instLoc ? "R" : "D";
				// sEquipment.Ppsidi = aDOIFields[13].instLoc ? "R" : "D";
				sEquipment.Iwerki = aDOIFields[6].instLoc ? "R" : (aDOIFields[6].maintenance ? "D" : "");
				sEquipment.Ingrpi = aDOIFields[7].instLoc ? "R" : (aDOIFields[7].maintenance ? "D" : "");
				sEquipment.Gewrki = aDOIFields[8].instLoc ? "R" : (aDOIFields[8].maintenance ? "D" : "");
				// sEquipment.Gewrki = aDOIFields[16].instLoc ? "R" : "D";
				// sEquipment.RbnrI = aDOIFields[17].instLoc ? "R" : "D";
				// sEquipment.Vkorgi = aDOIFields[18].instLoc ? "R" : "D";
				// sEquipment.Vkorgi = aDOIFields[19].instLoc ? "R" : "D";
				// sEquipment.Vkorgi = aDOIFields[20].instLoc ? "R" : "D";
				// sEquipment.Vkorgi = aDOIFields[21].instLoc ? "R" : "D";
				// sEquipment.Vkorgi = aDOIFields[22].instLoc ? "R" : "D";
				sEquipment.Adrnri = aDOIFields[10].instLoc ? "R" : (aDOIFields[10].maintenance ? "D" : "");
			}
			if (sAIWData.viewParameter === "create") {
				sEquipment.Type = true;
			}
			sPayload.Equipment.push(sEquipment);

			currentHeader = sEquipment;
			sEquipment.IsDOI = true;

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

			currentAddr = sEqAddr;

			var aIntlAddr = sAIWData.intlAddr;
			if (aIntlAddr.length > 0) {
				for (var z = 0; z < aIntlAddr.length; z++) {
					sPayload.EqAddrI.push(aIntlAddr[z]);
				}
			}

			currentIntlAddr = aIntlAddr;

			if (sAIWData.Floccategory === "L") {
				var sEqLAM = {
					"Equi": sAIWData.Equnr,
					"Lrpid": sAIWData.lam.Lrpid,
					"Strtptatr": sAIWData.lam.Strtptatr,
					"Endptatr": sAIWData.lam.Endptatr,
					"Length": sAIWData.lam.Length,
					"LinUnit": sAIWData.lam.LinUnit,
					"Startmrkr": sAIWData.lam.Startmrkr,
					"Endmrkr": sAIWData.lam.Endmrkr,
					"Mrkdisst": sAIWData.lam.Mrkdisst,
					"Mrkdisend": sAIWData.lam.Mrkdisend,
					"MrkrUnit": sAIWData.lam.MrkrUnit,
					"LamDer": sAIWData.lam.LamDer
				};
				currentLAM = sEqLAM;
				sEqLAM.LamDer = "D";
				sPayload.FLLAM.push(sEqLAM);
			}

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
			currentPRT = sEqPRT;

			if (sAIWData.dfps) {
				var oEqDFPS = {
					Equi: sAIWData.Equnr,
					DeviceId: sAIWData.dfps.Tailno,
					Topsiteid: sAIWData.dfps.Area,
					Topsitede: sAIWData.dfps.AreaDesc,
					AreaPro: sAIWData.dfps.AreaPrfl,
					SiteId: sAIWData.dfps.Site,
					SiteDesc: sAIWData.dfps.SiteDesc,
					SitePro: sAIWData.dfps.SitePrfl,
					MpoId: sAIWData.dfps.MPO,
					MpoDescr: sAIWData.dfps.MPODesc,
					RicId: sAIWData.dfps.RIC,
					RicDescr: sAIWData.dfps.RICDesc,
					ModelId: sAIWData.dfps.ModelId,
					ModelDes: sAIWData.dfps.ModelIdDesc,
					Foreignob: formatter.truetoX(sAIWData.dfps.ForeignEq),
					TecState: sAIWData.dfps.TechSts,
					DepState: sAIWData.dfps.OperSts,
					DfpsRmrk: sAIWData.dfps.Remark
				};
				sPayload.EqDFPS.push(oEqDFPS);
			}

			var sEqClassList = sAIWData.classItems;
			if (sEqClassList) {
				if (sEqClassList.length > 0) {
					for (var e = 0; e < sEqClassList.length; e++) {
						var sEqClass = {
							"Equi": sAIWData.Equnr,
							"Classtype": sEqClassList[e].Classtype,
							"Class": sEqClassList[e].Class,
							"Clstatus1": sEqClassList[e].Clstatus1,
							"Artxt": sEqClassList[e].ClassTypeDesc
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

			var aFLLinChar = sAIWData.characteristics;
			if (aFLLinChar) {
				if (aFLLinChar.length > 0) {
					var alinearChar = $.map(aFLLinChar, function (obj) {
						return $.extend(true, {}, obj);
					});
					for (var c = 0; c < alinearChar.length; c++) {
						delete alinearChar[c].linCharEnable;
						alinearChar[c].Equi = AIWEQUIModel[d].Equnr;
						sPayload.EqLAMCH.push(alinearChar[c]);
					}
				}
			}

			var oMainViewModel = g.getView().getModel("mainView");
			var oMainViewData = oMainViewModel.getData();
			oMainViewData.tableBusy = true;
			oMainViewModel.setData(oMainViewData);

			var fnSuccess = function (r) {
				g.BusyDialog.close();
				if (r.Equipment.results.length > 0) {
					sArray = [];
					for (var ieq = 0; ieq < r.Equipment.results.length; ieq++) {
						if (r.Equipment.results[ieq].Equnr === sLocalVar) {
							var sModelData = r.Equipment.results[ieq];
							var sObject = {
								intlAddr: [],
								classItems: [],
								characteristics: [],
								linearChar: [],
								charNewButton: false,
								attachmentCount: "0", // Attachment Count
								Guids: "", // Attachment
								EqunrEnabled: true,
								EquipCatEnabled: true,
								MaintplantEnabled: true,
								BukrsEnabled: true,
								EqunrVS: "None",
								EqunrVST: "",
								EqktxVS: "None",
								EqktxVST: "",
								EquipmentCatogoryVS: "None",
								EquipmentCatogoryVST: "",
								MaintplantVS: "None",
								MaintplantVST: "",
								TplnrVS: "None",
								TplnrVST: "",
								SuperordinateEquipVS: "None",
								SuperordinateEquipVST: "",
								StsmEquiVS: "None",
								StsmEquiVST: "",
								UstwEquiVS: "None",
								UstwEquiVST: "",
								UswoEquiVS: "None",
								UswoEquiVST: "",
								TechnicalObjectTypVS: "None",
								TechnicalObjectTypVST: "",
								LocationVS: "None",
								LocationVSTL: "",
								AbckzVS: "None",
								AbckzVST: "",
								ArbplVS: "None",
								ArbplVST: "",
								BukrsVS: "None",
								BukrsVST: "",
								KostlVS: "None",
								KostlVST: "",
								WerksVS: "None",
								WerksVST: "",
								IngrpVS: "None",
								IngrpVST: "",
								ConstrTypeVS: "None",
								ConstrTypeVST: "",
								RefPostaVS: "None",
								RefPostaVST: "",
								MainArbplVS: "None",
								MainArbplVST: "",
								LangucodeVS: "None",
								LangucodeVST: "",
								TimeZoneVS: "None",
								TimeZoneVST: "",
								ConstrTypeMaxL: 0,
								charValueMaxL: 0,
								dfps: {
									Tailno: "",
									TailnoVS: "None",
									Area: "",
									AreaDesc: "",
									AreaPrfl: "",
									Site: "",
									SiteDesc: "",
									SiteVS: "None",
									SitePrfl: "",
									MPO: "",
									MPODesc: "",
									RIC: "",
									RICDesc: "",
									ModelId: "",
									ModelIdDesc: "",
									ModelIdVS: "None",
									ForeignEq: false,
									TechSts: "",
									OperSts: "0001",
									Remark: "",
									dfpsCrtEnabled: true,
									dfpsDltEnabled: false,
									dfpsEnabled: false,
									TailnoReq: false,
								}
							};
							sObject.Equnr = sModelData.Equnr;
							sObject.Eqktx = sModelData.Txtmi;
							// sObject.Eqktx = sModelData.Eqktx;
							sObject.EquipmentCatogory = sModelData.Eqtyp;
							sObject.EquipCatgDescription = sModelData.Etytx;
							sObject.Maintplant = sModelData.Swerk;
							sObject.MaintplantDesc = sModelData.Name1;

							sObject.SuperordinateEquip = sModelData.HequEeqz; // Superord. Equipment
							sObject.SuperordinateEquipDesc = sModelData.SuperordEqDes; // Superord. Equipment Description
							sObject.Bukrs = sModelData.BukrEilo;
							sObject.Butxt = sModelData.Butxt;
							sObject.Location = sModelData.StorEilo; // Location
							sObject.Locationdesc = sModelData.Locationdesc; // Location Description
							sObject.Abckz = sModelData.AbckEilo;
							sObject.Abctx = sModelData.Abctx;
							sObject.Kostl = sModelData.KostEilo; // Cost Center
							sObject.Kokrs = sModelData.KokrEilo; // ccPart1
							sObject.Mctxt = sModelData.Contareaname; // Name
							sObject.Answt = sModelData.Answt;
							sObject.Ansdt = formatter.getDateFormat(sModelData.Ansdt);
							sObject.Waers = sModelData.Waers; // Currency
							sObject.Werks = sModelData.PplaEeqz; // Planning Plant
							sObject.Planningplantdes = sModelData.Planningplantdes; // Planning Plant Description
							sObject.Ingrp = sModelData.IngrEeqz; // Planner Group
							sObject.Innam = sModelData.Plannergrpdesc; // Planner Group Description
							sObject.Arbpl = sModelData.ArbpEilo; // Work Center
							sObject.Ktext = sModelData.Workcenterdesc; // Work Center Description
							sObject.WcWerks = sModelData.WorkCenterPlant; // Work center Plant
							sObject.MainArbpl = sModelData.ArbpEeqz; // Main Work Center
							sObject.MainKtext = sModelData.MainWcDesc; // Plant Work Center
							sObject.MainWerks = sModelData.MainWcPlant; // Name
							sObject.BeberFl = sModelData.BebeEilo; // Plant Section
							sObject.Fing = sModelData.Fing; // Plant Section
							sObject.Tele = sModelData.Tele; // Plant Section
							sObject.Herst = sModelData.Herst; // Manufacturer
							sObject.TechnicalObjectTyp = sModelData.Eqart; // TechnicalObjectTyp
							sObject.Description = sModelData.Eartx; // TechnicalObjectTyp Description
							sObject.Typbz = sModelData.Typbz; // Model Number
							sObject.ConstrType = sModelData.SubmEeqz; // Construction Type
							sObject.ConstructionDesc = sModelData.Constdesc; // Construction Description
							sObject.TechIdNum = sModelData.TidnEeqz; // techIndNo
							sObject.Serge = sModelData.Serge; // manfSerNo
							sObject.MapaEeqz = sModelData.MapaEeqz; // partNum
							sObject.EquipPosition = sModelData.HeqnEeqz; // Position

							sObject.Stattext = sModelData.Stattext; // System Status
							sObject.StsmEqui = sModelData.StsmEqui; // Status Profile
							sObject.StsmEquiDesc = sModelData.Statproftxt; // Status Profile Description
							sObject.UstwEqui = sModelData.UstwEqui; // Status with Status Number
							sObject.UswoEqui = sModelData.UswoEqui; // Status without Status Number
							sObject.UstaEqui = sModelData.UstaEqui; // User Status
							sObject.menuAction = sModelData.IsMenu;
							sObject.Adrnr = sModelData.Adrnr;
							sObject.Adrnri = sModelData.Adrnri;
							sObject.Fhmkz = sModelData.Fhmkz; // PRT fields visible
							sObject.Funcid = sModelData.Funcid; //Config control data
							sObject.Frcfit = sModelData.Frcfit;
							sObject.Frcrmv = sModelData.Frcrmv;

							if (sObject.Equnr === sLocalVar) { //For DOI
								g.equiHeader = r.Equipment.results[ieq];
								sObject.Maintplant = currentHeader.Maintplant;
								sObject.MaintplantDesc = currentHeader.MaintplantDesc;
								sObject.Bukrs = currentHeader.Bukrs;
								sObject.Butxt = currentHeader.Butxt;
								sObject.Location = currentHeader.Location; // Location
								sObject.Locationdesc = currentHeader.Locationdesc; // Location Description
								sObject.Abckz = currentHeader.Abckz;
								sObject.Abctx = currentHeader.Abctx;
								sObject.Kostl = currentHeader.Kostl; // Cost Center
								sObject.Kokrs = currentHeader.Kokrs; // ccPart1
								sObject.Mctxt = currentHeader.Mctxt; // Name
								sObject.Werks = currentHeader.Werks; // Planning Plant
								sObject.Planningplantdes = currentHeader.Planningplantdes; // Planning Plant Description
								sObject.Ingrp = currentHeader.Ingrp; // Planner Group
								sObject.Innam = currentHeader.Innam; // Planner Group Description
								sObject.MainArbpl = currentHeader.MainArbpl; // Main Work Center
								sObject.MainKtext = currentHeader.MainKtext; // Plant Work Center
								sObject.MainWerks = currentHeader.MainWerks; // Name
								sObject.BeberFl = currentHeader.BeberFl; // Plant Section
								sObject.Fing = currentHeader.Fing; // Plant Section
								sObject.Tele = currentHeader.Tele; // Plant Section
								sObject.Stattext = currentHeader.Stattext;
							}

							if (r.EqPRT) {
								var sPRT = r.EqPRT.results[ieq];
								if (sPRT) {
									sObject.PlanvPrt = sPRT.PlanvPrt;
									sObject.SteufPrt = sPRT.SteufPrt;
									sObject.KtschPrt = sPRT.KtschPrt;
									sObject.Ewformprt = sPRT.Ewformprt;
									sObject.PlanvPrtText = sPRT.Ewformprt !== undefined ? sPRT.Ewformprt : ""; //AIWEQUIModel[ieq].PlanvPrtText;
									sObject.SteufPrtText = sPRT.SteufPrtText !== undefined ? sPRT.SteufPrtText : ""; //AIWEQUIModel[ieq].SteufPrtText;
									sObject.KtschPrtText = sPRT.KtschPrtText !== undefined ? sPRT.KtschPrtText : ""; //AIWEQUIModel[ieq].KtschPrtText;
									sObject.EwformprtText = sPRT.EwformprtText !== undefined ? sPRT.EwformprtText : ""; //AIWEQUIModel[ieq].EwformprtText;
									sObject.SteufRef = sPRT.SteufRef;
									sObject.KtschRef = sPRT.KtschRef;
									sObject.EwformRef = sPRT.EwformRef;
								} else {
									sObject.PlanvPrt = "";
									sObject.SteufPrt = "";
									sObject.KtschPrt = "";
									sObject.Ewformprt = "";
									sObject.PlanvPrtText = "";
									sObject.SteufPrtText = "";
									sObject.KtschPrtText = "";
									sObject.EwformprtText = "";
									sObject.SteufRef = false;
									sObject.KtschRef = false;
									sObject.EwformRef = false;
								}
							}

							if (r.EqLAM.results.length > 0) {
								var aEqLAM = r.EqLAM.results;
								for (var x = 0; x < aEqLAM.length; x++) {
									if (aEqLAM[x].Equi === sModelData.Equnr) {
										var oEqLAM = {
											"Equi": aEqLAM[x].Equi,
											"Lrpid": aEqLAM[x].Lrpid,
											"LrpidDesc": aEqLAM[x].LrpDescr,
											"Strtptatr": aEqLAM[x].Strtptatr,
											"Endptatr": aEqLAM[x].Endptatr,
											"Length": aEqLAM[x].Length,
											"LinUnit": aEqLAM[x].LinUnit,
											"LinUnitDesc": aEqLAM[x].Uomtext,
											"Startmrkr": aEqLAM[x].Startmrkr,
											"Endmrkr": aEqLAM[x].Endmrkr,
											"Mrkdisst": aEqLAM[x].Mrkdisst,
											"Mrkdisend": aEqLAM[x].Mrkdisend,
											"MrkrUnit": aEqLAM[x].MrkrUnit
										};
										sObject.lam = oEqLAM;
										break;
									}
								}
							}

							if (sObject.Equnr === sLocalVar && sObject.EquipmentCatogory === "L" && g.lamSwitch === "X") {
								sObject.lam = currentLAM;

								if (r.EqLAM.results.length > 0) {
									g.equiLAM = r.EqLAM.results;
								}
							}

							if (sModelData.Type === true) {
								sObject.viewParameter = "create";
							}

							if (sModelData.Type === false) {
								sObject.viewParameter = "change";
								sObject.EqunrEnabled = false;

								if (sObject.EquipmentCatogory === "" || sObject.EquipmentCatogory === undefined) {
									sObject.EquipCatEnabled = true;
								} else {
									sObject.EquipCatEnabled = false;
								}
								if (sObject.Maintplant === "" || sObject.Maintplant === undefined) {
									sObject.MaintplantEnabled = true;
								} else {
									sObject.MaintplantEnabled = false;
								}
								if (sObject.Tplnr === "" || sObject.Tplnr === undefined) {
									sObject.TplnrEnabled = true;
								} else {
									sObject.TplnrEnabled = false;
								}
							}

							if (sModelData.Swerk !== "") {
								sObject.BukrsEnabled = false;
							} else {
								sObject.BukrsEnabled = true;
							}

							if (sModelData.Eqtyp !== "P") {
								sObject.Tplnr = sModelData.TplnEilo; // Functional Location
								sObject.Pltxt = sModelData.Flocdescription; // Functional Location Description
								sObject.TplnrEnabled = true;
							} else {
								sObject.Tplnr = "";
								sObject.Pltxt = "";
								sObject.TplnrEnabled = false;
							}
							if (sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) {
								sObject.TplnrEnabled = false;
								sObject.SuperordinateEquipEnabled = true;
							}
							if (sObject.Tplnr !== "" && sObject.Tplnr !== undefined) {
								sObject.TplnrEnabled = true;
								sObject.SuperordinateEquipEnabled = false;
							}
							if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) || (sObject.Tplnr !== "" && sObject.Tplnr !==
									undefined)) {
								sObject.MaintplantEnabled = false;
							} else {
								sObject.MaintplantEnabled = true;
							}

							// if (r.EqAddr) {
							// 	if (r.EqAddr.results) {
							// 		var sAddress = r.EqAddr.results;
							// 		if (sAddress) {
							// 			if (sAddress.length > 0) {
							// 				for (var jeq = 0; jeq < sAddress.length; jeq++) {
							// 					if (sObject.Equnr === sAddress[jeq].Equi) {
							// 						var oAddressEquiModel = sap.ui.getCore().getModel("equiAddressView");
							// 						var oAddressEquiData = oAddressEquiModel.getData();
							// 						var mCountEquiFlag = true;
							// 						var sEquiObj, sEquiMatchIndex;
							// 						if (oAddressEquiData.length > 0) {
							// 							for (var sfa = 0; sfa < oAddressEquiData.length; sfa++) {
							// 								if (sModelData.Equnr === oAddressEquiData[sfa].Equnr) {
							// 									mCountEquiFlag = false;
							// 									sEquiMatchIndex = sfa;
							// 									break;
							// 								}
							// 							}
							// 						}
							// 						if (mCountEquiFlag === true) {
							// 							if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
							// 								(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
							// 								sEquiObj = {
							// 									Equnr: sModelData.Equnr,
							// 									Tplnr: sObject.Tplnr,
							// 									IsEditable: sAddress[jeq].IsEditable
							// 								};
							// 								oAddressEquiData.push(sEquiObj);
							// 								oAddressEquiModel.setData(oAddressEquiData);
							// 							}
							// 						}
							// 						if (mCountEquiFlag === false) {
							// 							if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
							// 								(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
							// 								oAddressEquiData[sEquiMatchIndex].Equnr = sModelData.Equnr;
							// 								oAddressEquiData[sEquiMatchIndex].Tplnr = sModelData.Tplnr;
							// 								oAddressEquiData[sEquiMatchIndex].IsEditable = sAddress[jeq].IsEditable; //sModelData.IsEditable;
							// 								oAddressEquiModel.setData(oAddressEquiData);
							// 							}
							// 						}

							// 						sObject.IsEditable = sAddress[jeq].IsEditable;
							// 						sObject.Title = sAddress[jeq].Titletxt ? sAddress[jeq].Titletxt : "";
							// 						sObject.TitleCode = sAddress[jeq].Title ? sAddress[jeq].Title : "";
							// 						sObject.Name1 = sAddress[jeq].Name1 ? sAddress[jeq].Name1 : "";
							// 						sObject.Name2 = sAddress[jeq].Name2 ? sAddress[jeq].Name2 : "";
							// 						sObject.Name3 = sAddress[jeq].Name3 ? sAddress[jeq].Name3 : "";
							// 						sObject.Name4 = sAddress[jeq].Name4 ? sAddress[jeq].Name4 : "";
							// 						sObject.Sort1 = sAddress[jeq].Sort1 ? sAddress[jeq].Sort1 : "";
							// 						sObject.Sort2 = sAddress[jeq].Sort2 ? sAddress[jeq].Sort2 : "";
							// 						sObject.NameCo = sAddress[jeq].NameCo ? sAddress[jeq].NameCo : "";
							// 						sObject.PostCod1 = sAddress[jeq].PostCod1 ? sAddress[jeq].PostCod1 : "";
							// 						sObject.City1 = sAddress[jeq].City1 ? sAddress[jeq].City1 : "";
							// 						sObject.Building = sAddress[jeq].Building ? sAddress[jeq].Building : "";
							// 						sObject.Floor = sAddress[jeq].Floor ? sAddress[jeq].Floor : "";
							// 						sObject.Roomnum = sAddress[jeq].Roomnum ? sAddress[jeq].Roomnum : "";
							// 						sObject.AddrLocation = sAddress[jeq].Location ? sAddress[jeq].Location : "";
							// 						sObject.Strsuppl1 = sAddress[jeq].Strsuppl1 ? sAddress[jeq].Strsuppl1 : "";
							// 						sObject.Strsuppl2 = sAddress[jeq].Strsuppl2 ? sAddress[jeq].Strsuppl2 : "";
							// 						sObject.Strsuppl3 = sAddress[jeq].Strsuppl3 ? sAddress[jeq].Strsuppl3 : "";
							// 						sObject.RefPosta = sAddress[jeq].RefPosta ? sAddress[jeq].RefPosta : "";
							// 						sObject.Landx = sAddress[jeq].Landx ? sAddress[jeq].Landx : "";
							// 						sObject.TimeZone = sAddress[jeq].TimeZone ? sAddress[jeq].TimeZone : "";
							// 						sObject.Region = sAddress[jeq].RfePost ? sAddress[jeq].RfePost : "";
							// 						sObject.RegionDesc = sAddress[jeq].Regiotxt ? sAddress[jeq].Regiotxt : "";
							// 					}
							// 				}
							// 			} else {
							// 				sObject.Title = sObject.Title ? sObject.Title : "";
							// 				sObject.TitleCode = sObject.TitleCode ? sObject.TitleCode : "";
							// 				sObject.Name1 = sObject.Name1 ? sObject.Name1 : "";
							// 				sObject.Name2 = sObject.Name2 ? sObject.Name2 : "";
							// 				sObject.Name3 = sObject.Name3 ? sObject.Name3 : "";
							// 				sObject.Name4 = sObject.Name4 ? sObject.Name4 : "";
							// 				sObject.Sort1 = sObject.Sort1 ? sObject.Sort1 : "";
							// 				sObject.Sort2 = sObject.Sort2 ? sObject.Sort2 : "";
							// 				sObject.NameCo = sObject.NameCo ? sObject.NameCo : "";
							// 				sObject.PostCod1 = sObject.PostCod1 ? sObject.PostCod1 : "";
							// 				sObject.City1 = sObject.City1 ? sObject.City1 : "";
							// 				sObject.Building = sObject.Building ? sObject.Building : "";
							// 				sObject.Floor = sObject.Floor ? sObject.Floor : "";
							// 				sObject.Roomnum = sObject.Roomnum ? sObject.Roomnum : "";
							// 				sObject.Strsuppl1 = sObject.Strsuppl1 ? sObject.Strsuppl1 : "";
							// 				sObject.Strsuppl2 = sObject.Strsuppl2 ? sObject.Strsuppl2 : "";
							// 				sObject.Strsuppl3 = sObject.Strsuppl3 ? sObject.Strsuppl3 : "";
							// 				sObject.AddrLocation = sObject.AddrLocation ? sObject.AddrLocation : "";
							// 				sObject.RefPosta = sObject.RefPosta ? sObject.RefPosta : "";
							// 				sObject.Landx = sObject.Landx ? sObject.Landx : "";
							// 				sObject.TimeZone = sObject.TimeZone ? sObject.TimeZone : "";
							// 				sObject.Region = sObject.Region ? sObject.Region : "";
							// 				sObject.RegionDesc = sObject.RegionDesc ? sObject.RegionDesc : "";
							// 			}
							// 		}
							// 	}
							// }

							if (sObject.Equnr === sLocalVar) {
								var oAddressEquiModel = sap.ui.getCore().getModel("equiAddressView");
								var oAddressEquiData = oAddressEquiModel.getData();
								var mCountEquiFlag = true;
								var sEquiObj, sEquiMatchIndex;
								if (oAddressEquiData.length > 0) {
									for (var sfa = 0; sfa < oAddressEquiData.length; sfa++) {
										if (sObject.Equnr === oAddressEquiData[sfa].Equnr) {
											mCountEquiFlag = false;
											sEquiMatchIndex = sfa;
											break;
										}
									}
								}
								if (mCountEquiFlag === true) {
									if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
										(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
										sEquiObj = {
											Equnr: sObject.Equnr,
											Tplnr: sObject.Tplnr,
											IsEditable: currentAddr.IsEditable
										};
										oAddressEquiData.push(sEquiObj);
										oAddressEquiModel.setData(oAddressEquiData);
									}
								}
								if (mCountEquiFlag === false) {
									if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
										(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
										oAddressEquiData[sEquiMatchIndex].Equnr = sObject.Equnr;
										oAddressEquiData[sEquiMatchIndex].Tplnr = sObject.Tplnr;
										oAddressEquiData[sEquiMatchIndex].IsEditable = sObject.IsEditable;
										oAddressEquiModel.setData(oAddressEquiData);
									}
								}

								sObject.IsEditable = currentAddr.IsEditable;
								sObject.Title = currentAddr.Titletxt ? currentAddr.Titletxt : "";
								sObject.TitleCode = currentAddr.Title ? currentAddr.Title : "";
								sObject.Name1 = currentAddr.Name1 ? currentAddr.Name1 : "";
								sObject.Name2 = currentAddr.Name2 ? currentAddr.Name2 : "";
								sObject.Name3 = currentAddr.Name3 ? currentAddr.Name3 : "";
								sObject.Name4 = currentAddr.Name4 ? currentAddr.Name4 : "";
								sObject.Sort1 = currentAddr.Sort1 ? currentAddr.Sort1 : "";
								sObject.Sort2 = currentAddr.Sort2 ? currentAddr.Sort2 : "";
								sObject.NameCo = currentAddr.NameCo ? currentAddr.NameCo : "";
								sObject.PostCod1 = currentAddr.PostCod1 ? currentAddr.PostCod1 : "";
								sObject.City1 = currentAddr.City1 ? currentAddr.City1 : "";
								sObject.Building = currentAddr.Building ? currentAddr.Building : "";
								sObject.Floor = currentAddr.Floor ? currentAddr.Floor : "";
								sObject.Roomnum = currentAddr.Roomnum ? currentAddr.Roomnum : "";
								sObject.AddrLocation = currentAddr.Location ? currentAddr.Location : "";
								sObject.Strsuppl1 = currentAddr.Strsuppl1 ? currentAddr.Strsuppl1 : "";
								sObject.Strsuppl2 = currentAddr.Strsuppl2 ? currentAddr.Strsuppl2 : "";
								sObject.Strsuppl3 = currentAddr.Strsuppl3 ? currentAddr.Strsuppl3 : "";
								sObject.RefPosta = currentAddr.RefPosta ? currentAddr.RefPosta : "";
								sObject.Landx = currentAddr.Landx ? currentAddr.Landx : "";
								sObject.TimeZone = currentAddr.TimeZone ? currentAddr.TimeZone : "";
								sObject.Region = currentAddr.RfePost ? currentAddr.RfePost : "";
								sObject.RegionDesc = currentAddr.Regiotxt ? currentAddr.Regiotxt : "";

								if (r.EqAddr.results) {
									g.equiAddr = r.EqAddr.results;
								}
							}

							var aIntlAddr = r.EqAddrI.results;
							if (aIntlAddr.length > 0) {
								for (var z = 0; z < aIntlAddr.length; z++) {
									if (aIntlAddr[z].Equi === sObject.Equnr) {
										aIntlAddr[z].AdNationEnable = false;
										aIntlAddr[z].City1iVS = "None";
										aIntlAddr[z].StreetiVS = "None";
										sObject.intlAddr.push(aIntlAddr[z]);
									}
								}
							}

							if (sObject.Equnr === sLocalVar && sObject.intlAddr.length > 0) { //For DOI
								g.equiIntlAddr = sObject.intlAddr;
								sObject.intlAddr = currentIntlAddr;
							} else {
								g.equiIntlAddr = [];
							}

							if (r.EqDFPS) {
								if (r.EqDFPS.results) {
									var sDpfs = r.EqDFPS.results;
									if (sDpfs) {
										if (sDpfs.length > 0) {
											for (var ud = 0; ud < sDpfs.length; ud++) {
												if (sObject.Equnr === sDpfs[ud].Equi) {
													sObject.dfps.Equnr = sDpfs[ud].Equi;
													sObject.dfps.MeOwner = sDpfs[ud].MeOwner;
													sObject.dfps.MeUser = sDpfs[ud].MeUser;
													sObject.dfps.Tailno = sDpfs[ud].DeviceId;
													sObject.dfps.Area = sDpfs[ud].Topsiteid;
													sObject.dfps.AreaDesc = sDpfs[ud].Topsitede;
													sObject.dfps.AreaPrfl = sDpfs[ud].AreaPro;
													sObject.dfps.Site = sDpfs[ud].SiteId;
													sObject.dfps.SiteDesc = sDpfs[ud].SiteDesc;
													sObject.dfps.SitePrfl = sDpfs[ud].SitePro;
													sObject.dfps.MPO = sDpfs[ud].MpoId;
													sObject.dfps.MPODesc = sDpfs[ud].MpoDescr;
													sObject.dfps.RIC = sDpfs[ud].RicId;
													sObject.dfps.RICDesc = sDpfs[ud].RicDescr;
													sObject.dfps.ModelId = sDpfs[ud].ModelId;
													sObject.dfps.ModelIdDesc = sDpfs[ud].ModelDes;
													sObject.dfps.ForeignEq = formatter.XtoTrue(sDpfs[ud].Foreignob);
													sObject.dfps.TechSts = sDpfs[ud].TecState;
													sObject.dfps.OperSts = sDpfs[ud].DepState;
													sObject.dfps.Remark = sDpfs[ud].DfpsRmrk;
													if (sDpfs[ud].DeviceId !== "") {
														sObject.dfps.dfpsCrtEnabled = false;
														sObject.dfps.dfpsDltEnabled = true;
														sObject.dfps.dfpsEnabled = true;
														sObject.dfps.TailnoReq = true;
													}
												}
											}
										}
									}
								}
							}

							if (r.EqClass) {
								var sClassList = r.EqClass.results;
								if (sClassList) {
									if (sClassList.length > 0) {
										for (var aeq = 0; aeq < sClassList.length; aeq++) {
											if (sObject.Equnr === sClassList[aeq].Equi) {
												sClassList[aeq].ctEnable = false;
												sClassList[aeq].classEnable = false;
												sClassList[aeq].ClassTypeDesc = sClassList[aeq].Artxt;
												delete sClassList[aeq].Artxt;
												delete sClassList[aeq].Changerequestid;
												delete sClassList[aeq].Clint;
												delete sClassList[aeq].Service;
												sObject.classItems.push(sClassList[aeq]);
											}
										}
										sObject.charNewButton = true;
										if (g.class && g.class.getId().includes("detailEqui") === true) {
											// var itemFragmentId = g.getView().createId("charFrag");
											// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
											// newCharBtn.setEnabled(true);
											g.class.setModel(new JSONModel(sObject.classItems));
										}
									}
								}
							}

							if (r.EqVal) {
								var sCharList = r.EqVal.results;
								if (sCharList) {
									if (sCharList.length > 0) {
										for (var jev = 0; jev < sCharList.length; jev++) {
											if (sObject.Equnr === sCharList[jev].Equi) {
												sCharList[jev].cNameEnable = false;
												sCharList[jev].Textbz = sCharList[jev].Atwtb;
												delete sCharList[jev].Ataut;
												delete sCharList[jev].Ataw1;
												delete sCharList[jev].Atawe;
												delete sCharList[jev].Atcod;
												delete sCharList[jev].Atflb;
												delete sCharList[jev].Atflv;
												delete sCharList[jev].Atimb;
												delete sCharList[jev].Atsrt;
												delete sCharList[jev].Atvglart;
												delete sCharList[jev].Atzis;
												delete sCharList[jev].Changerequestid;
												delete sCharList[jev].CharName;
												delete sCharList[jev].Charid;
												delete sCharList[jev].Classtype;
												delete sCharList[jev].Service;
												delete sCharList[jev].Valcnt;
												sCharList[jev].slNo = jev + 1; // ()
												sCharList[jev].flag = sCharList[jev].Class + "-" + sCharList[jev].slNo; // ()
												sObject.characteristics.push(sCharList[jev]);
											}
										}
										if (g.char && g.char.getId().includes("detailEqui") === true) {
											g.char.setModel(new JSONModel(sObject.characteristics));
										}
									}
								}
							}

							if (r.EqLAMCH) {
								var alinearChar = r.EqLAMCH.results;
								if (alinearChar) {
									if (alinearChar.length > 0) {
										for (var j = 0; j < alinearChar.length; j++) {
											if (sObject.Equnr === alinearChar[j].Equi) {
												alinearChar[j].linCharEnable = true;
												sObject.linearChar.push(alinearChar[j]);
											}
										}
										// if (g.linearChar && g.linearChar.getId().includes("detailFloc") === true) {
										// 	g.linearChar.setModel(new JSONModel(sModelData.linearChar));
										// }
									}
								}
							}

							if (sObject.UstaEqui) {
								oMainViewData.visible = true;
							} else {
								oMainViewData.visible = false;
							}
							oMainViewModel.setData(oMainViewData);
							g.getView().getModel(g.oModelName).setData(sObject);

							var oJsonModel = new JSONModel();
							var sCurrentObject = sObject;

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

								var sAddressModel = g.getView().getModel("equiAddressView");
								var sAddressData = sAddressModel.getData();
								sAddressData.enabled = sCurrentObject.IsEditable;
								sAddressModel.setData(sAddressData);
							}
							oJsonModel.setData(sCurrentObject);
							g.getView().setModel(oJsonModel, g.oModelName);
							g.lam.setModel(oJsonModel, "AIWLAM");

							var sCopyArray = [oJsonModel.getData()];
							var sSupEquiData = $.map(sCopyArray, function (obj) {
								return $.extend(true, {}, obj);
							});
							var sSupEquiModel = new JSONModel();
							sSupEquiModel.setData(sSupEquiData);
							g.getView().setModel(sSupEquiModel, "SUP_EQUI_DATA");

							var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
							var mSupEquiData = mSupEquiModel.getData();
							var mCountCEquiFlag = true;
							for (var se = 0; se < mSupEquiData.length; se++) {
								if (sCurrentObject.Equnr === mSupEquiData[se].Equnr) {
									mCountCEquiFlag = false;
								}
							}
							if (mCountCEquiFlag === true) {
								if ((sCurrentObject.SuperordinateEquip !== "" && sCurrentObject.SuperordinateEquip !== undefined) ||
									(sCurrentObject.Tplnr !== "" && sCurrentObject.Tplnr !== undefined)) {
									mSupEquiData.push(sSupEquiData[0]);
									mSupEquiModel.setData(mSupEquiData);
								}
							}
						}
					}
				}
				oMainViewData.tableBusy = false;
				oMainViewModel.setData(oMainViewData);

				if (imValue !== "" && imObject === "EQ") {
					g.superiorEquipment = imValue;
					g.superiorEqDesc = imDesc;
				} else if (imValue !== "" && imObject === "FL") {
					g.functionalLocation = imValue;
					g.functionalLocDesc = imDesc;
				}
				g.getView().getModel("dataOrigin").setProperty("/originDerive", r);
				g.openDoiView(undefined, r);
			};
			var fnError = function (err) {
				g.BusyDialog.close();
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
				oMainViewData.tableBusy = false;
				oMainViewModel.setData(oMainViewData);
				g.invokeMessage(value);
			};

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
			g.BusyDialog.open();
			oModel.create(sPath, sPayload, {
				success: fnSuccess,
				error: fnError
			});

		},

		onDOIDisplayPress: function () {
			// var results = {
			// 	Equi_DOI: {
			// 		results: this.getView().getModel("dataOrigin").getData()
			// 	}
			// };
			// this.openDoiView(undefined, results);
			this.doiDisplayFlag = true;
			var objSOP = this.getView().getModel(this.oModelName).getData();
			if (!this.doiView) {
				this.doiView = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.doi.DataOrigin", this);
			}

			var dModel = new sap.ui.model.json.JSONModel(),
				text;
			var equi = this.superiorEquipment,
				equiDesc = this.superiorEqDesc,
				floc = this.functionalLocation,
				flocDesc = this.functionalLocDesc;
			var dObj = {},
				hdrText, fieldText;

			dObj.install = true;
			dObj.dismantle = false;
			dObj.parent = (equi === "") ? floc : equi;
			dObj.parentDesc = (equiDesc === "") ? flocDesc : equiDesc;
			dObj.currentObj = objSOP.Equnr; //this.getView().byId("Equipment").getValue();
			dObj.currObjDesc = objSOP.Eqktx; //this.getView().byId("equipmentDesc").getValue();
			text = this.getView().getModel("i18n").getProperty("doi");
			this.doiView.getAggregation("beginButton").setText("OK").setEnabled(true);
			this.doiView.setTitle(text);
			this.doiView.getContent()[1].getColumns()[5].getAggregation("header").setText(this.getView().getModel("i18n").getProperty(
				"indMaintEQ"));

			if (equi !== "") {
				fieldText = this.getView().getModel("i18n").getProperty("instlFieldEqText");
				hdrText = this.getView().getModel("i18n").getProperty("instlHdrEqText");
				this.doiView.getContent()[0].getContent()[0].setText(fieldText);
				this.doiView.getContent()[1].getColumns()[1].getAggregation("header").setText(hdrText);
			} else if (floc !== "") {
				fieldText = this.getView().getModel("i18n").getProperty("instlFieldFlText");
				hdrText = this.getView().getModel("i18n").getProperty("instlHdrFlText");
				this.doiView.getContent()[0].getContent()[0].setText(fieldText);
				this.doiView.getContent()[1].getColumns()[1].getAggregation("header").setText(hdrText);
			}

			dModel.setData(dObj);
			this.getView().setModel(dModel, "doi");
			this.doiView.setModel(dModel, "doi");

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
			oTable.getColumns()[3].getAggregation("header").setEnabled(false); // no need to disable
			oTable.getColumns()[5].getAggregation("header").setEnabled(false);
			// tempcurrentDoiData.forEach(function (d) {
			// 	d.instLoc = false;
			// });
			// var tempData = $.map(data, function (obj) {
			// 	return $.extend(true, {}, obj);
			// });
			// tempData.splice(1, 1);
			// tempData.splice(12, 1);
			tempcurrentDoiData.forEach(function (d) { // no need to disable
				// d.instLoc = false;
				d.locEnable = false;
				d.maintEnable = false;
			});
			// oTable.getModel().setData(tempcurrentDoiData);
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

			var dModel = new sap.ui.model.json.JSONModel(),
				text;
			var equi = this.superiorEquipment,
				equiDesc = this.superiorEqDesc,
				floc = this.functionalLocation,
				flocDesc = this.functionalLocDesc;
			var dObj = {},
				hdrText, fieldText;
			if (v === "") {
				dObj.install = false;
				dObj.dismantle = true;
				dObj.parent = (equi === "") ? floc : equi;
				dObj.parentDesc = (equiDesc === "") ? flocDesc : equiDesc;
				dObj.currentObj = objSOP.Equnr; //this.getView().byId("Equipment").getValue();
				dObj.currObjDesc = objSOP.Eqktx; //this.getView().byId("equipmentDesc").getValue();
				this.doiView.getAggregation("beginButton").setText("Dismantle").setEnabled(true);
				text = this.getView().getModel("i18n").getProperty("doiDismantle");
				this.doiView.setTitle(text);
			} else {
				dObj.install = true;
				dObj.dismantle = false;
				dObj.parent = (equi === "") ? floc : equi;
				dObj.parentDesc = (equiDesc === "") ? flocDesc : equiDesc;
				dObj.currentObj = objSOP.Equnr; //this.getView().byId("Equipment").getValue();
				dObj.currObjDesc = objSOP.Eqktx; //this.getView().byId("equipmentDesc").getValue();
				text = this.getView().getModel("i18n").getProperty("doi");
				this.doiView.getAggregation("beginButton").setText("Install").setEnabled(true);
				this.doiView.setTitle(text);
				this.doiView.getContent()[1].getColumns()[5].getAggregation("header").setText(this.getView().getModel("i18n").getProperty(
					"indMaintEQ"));
			}
			if (equi !== "") {
				fieldText = this.getView().getModel("i18n").getProperty("instlFieldEqText");
				hdrText = this.getView().getModel("i18n").getProperty("instlHdrEqText");
				this.doiView.getContent()[0].getContent()[0].setText(fieldText);
				this.doiView.getContent()[1].getColumns()[1].getAggregation("header").setText(hdrText);

				var eqCurrValTitle = this.getView().getModel("i18n").getProperty("doiEQCurrVal");
				var eqTarValTitle = this.getView().getModel("i18n").getProperty("doiEQTarVal");
				this.doiView.mAggregations.content[1].mAggregations.columns[6].mAggregations.header.setText(eqCurrValTitle);
				this.doiView.mAggregations.content[1].mAggregations.columns[7].mAggregations.header.setText(eqTarValTitle);

			} else if (floc !== "") {
				fieldText = this.getView().getModel("i18n").getProperty("instlFieldFlText");
				hdrText = this.getView().getModel("i18n").getProperty("instlHdrFlText");
				this.doiView.getContent()[0].getContent()[0].setText(fieldText);
				this.doiView.getContent()[1].getColumns()[1].getAggregation("header").setText(hdrText);

				var flCurrValTitle = this.getView().getModel("i18n").getProperty("doiFlCurrVal");
				var flTarValTitle = this.getView().getModel("i18n").getProperty("doiFlTarVal");
				this.doiView.mAggregations.content[1].mAggregations.columns[6].mAggregations.header.setText(flCurrValTitle);
				this.doiView.mAggregations.content[1].mAggregations.columns[7].mAggregations.header.setText(flTarValTitle);
			}
			dModel.setData(dObj);
			this.getView().setModel(dModel, "doi");
			this.doiView.setModel(dModel, "doi");
			if (objSOP.SuperordinateEquip === "") { //this.getView().byId("superOrdEq").getValue() === "") {
				objSOP.SuperordinateEquipDesc = ""; //this.getView().byId("superOrdEqDesc").setValue();
				// this.superiorEquipment = "";
				// this.superiorEqDesc = "";
			} else if (objSOP.Tplnr === "") { //this.getView().byId("FunctionalLocation").getValue() === "") {
				objSOP.Pltxt = ""; //this.getView().byId("FunctionalLocationidDesc").setValue();
				// this.functionalLocation = "";
				// this.functionalLocDesc = "";
			}

			var oTable = this.doiView.getContent()[1];
			var dData = this.getView().getModel("dataOrigin").getData();
			if (results) {
				var fields = results.Equi_DOI.results;
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
					}
					if (fields[f].Property === "Maintplant" || fields[f].Property === "PplaEeqz") {
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

					fields[10].maintenance = true;
					fields[10].instLoc = false;
					fields[10].targetVal = objSOP.Equnr; //this.getView().byId("Equipment").getValue();
					fields[10].currentVal = objSOP.Eqktx; //this.getView().byId("Equipment").getValue();
				}

				oTable.setModel(new sap.ui.model.json.JSONModel(fields));
			} else {
				// if (oTable.getModel() === undefined) {
				var currentDoiData = this.getView().getModel("dataOrigin").getData();
				var tempcurrentDoiData = $.map(currentDoiData, function (obj) {
					return $.extend(true, {}, obj);
				});
				oTable.setModel(new JSONModel(tempcurrentDoiData));
				// }
				var data = oTable.getModel().getData();
				oTable.getColumns()[3].getAggregation("header").setSelected(false);
				data.forEach(function (d) {
					d.instLoc = false;
				});
				var tempData = $.map(data, function (obj) {
					return $.extend(true, {}, obj);
				});
				tempData.splice(6, 1);
				tempData.splice(0, 1);
				tempData.forEach(function (d) {
					d.instLoc = false;
				});
				oTable.getModel().setData(tempData);
				// data.splice(1, 1);
				// data.splice(12, 1);
				// data.forEach(function (d) {
				// 	d.instLoc = false;
				// });
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
		// 	aItems[10].setVisible(false);
		// 	aItems[11].setVisible(false);
		// 	aItems[12].setVisible(false);
		// 	aItems[14].setVisible(false);
		// 	aItems[17].setVisible(false);
		// 	aItems[18].setVisible(false);
		// 	aItems[19].setVisible(false);
		// 	aItems[20].setVisible(false);
		// 	aItems[21].setVisible(false);
		// 	aItems[22].setVisible(false);

		// 	if(!results){
		// 		aItems[1].setVisible(false); // Maintainence Plant
		// 		aItems[13].setVisible(false); // Planning Plant
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
			if (g.viewName === "ChangeEqui") {
				g.onDOIActionPressChange(oEvent);
				return;
			}
			var type = oEvent.getSource().getText();
			var oAIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI");
			var aAIWEQUI = oAIWEQUIModel.getData();
			var oLocalModel = g.getView().getModel(g.oModelName);
			var localData = oLocalModel.getData();
			var sLocalVar = g.getView().getModel(g.oModelName).getData().Equnr;
			var tData = oEvent.getSource().getParent().getContent()[1].getModel().getData();
			var sObject = {};
			var aiwIndex = "";

			for (var i = 0; i < aAIWEQUI.length; i++) {
				if (aAIWEQUI[i].Equnr === sLocalVar) {
					sObject = aAIWEQUI[i];
					aiwIndex = i;
				}
			}

			if (type === "Install") {
				this.isInstall = true;
				var equiHeader = g.equiHeader;
				if (!tData[1].maintenance) {
					sObject.Location = equiHeader.StorEilo;
					sObject.Locationdesc = equiHeader.Locationdesc;
				}
				if (!tData[2].maintenance) {
					sObject.BeberFl = equiHeader.BebeEilo;
					sObject.Fing = equiHeader.Fing;
					sObject.Tele = equiHeader.Tele;
				}
				if (!tData[3].maintenance) {
					sObject.Arbpl = equiHeader.ArbpEilo;
					sObject.Ktext = equiHeader.Workcenterdesc;
				}
				if (!tData[4].maintenance) {
					sObject.Abctx = equiHeader.Abctx;
					sObject.Abckz = equiHeader.AbckEilo;
				}
				if (!tData[5].maintenance) {
					sObject.Kostl = equiHeader.KostEilo;
					sObject.Mctxt = equiHeader.Contareaname;
				}
				if (!tData[7].maintenance) {
					sObject.Ingrp = equiHeader.IngrEeqz;
					sObject.Innam = equiHeader.Plannergrpdesc;
				}
				if (!tData[8].maintenance) {
					sObject.MainArbpl = equiHeader.ArbpEeqz;
					sObject.MainKtext = equiHeader.MainWcDesc;
					sObject.MainWerks = equiHeader.MainWcPlant;
				}
				if (tData[0].instLoc && equiHeader.Swerk !== "") {
					sObject.Maintplant = equiHeader.Swerk;
					sObject.MaintplantDesc = equiHeader.Name1;
					sObject.MaintplantEnabled = false;
					sObject.Bukrs = equiHeader.BukrEilo;
					sObject.Butxt = equiHeader.Butxt;
					sObject.BukrsEnabled = false;
					sObject.Werks = equiHeader.PplaEeqz;
					sObject.Planningplantdes = equiHeader.Planningplantdes;
					sObject.Kokrs = equiHeader.KokrEilo;
				}
				sObject.MaintplantEnabled = true;
				sObject.Stattext = equiHeader.Stattext;
				sObject.Tplnr = equiHeader.TplnEilo; //g.equiHeader.FlocRef;
				sObject.Pltxt = equiHeader.Flocdescription; //g.equiHeader.Flocdescription;

				if (tData.length < 11) {
					var aDoiData = this.getView().getModel("dataOrigin").getData();
					tData.splice(0, 0, aDoiData[0]); //Maintainence plant DOI data
					tData.splice(6, 0, aDoiData[6]); //Planning plant DOI data
					this.getView().getModel("dataOrigin").setData(tData);
				}

				if (!tData[10].maintenance) {
					var sAddress = g.equiAddr;
					if (sAddress) {
						if (sAddress.length > 0) {
							for (var jeq = 0; jeq < sAddress.length; jeq++) {
								if (sObject.Equnr === sAddress[jeq].Equi) {
									var oAddressEquiModel = sap.ui.getCore().getModel("equiAddressView");
									var oAddressEquiData = oAddressEquiModel.getData();
									var mCountEquiFlag = true;
									var sEquiObj, sEquiMatchIndex;
									if (oAddressEquiData.length > 0) {
										for (var sfa = 0; sfa < oAddressEquiData.length; sfa++) {
											if (sObject.Equnr === oAddressEquiData[sfa].Equnr) {
												mCountEquiFlag = false;
												sEquiMatchIndex = sfa;
												break;
											}
										}
									}
									if (mCountEquiFlag === true) {
										if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
											(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
											sEquiObj = {
												Equnr: sObject.Equnr,
												Tplnr: sObject.Tplnr,
												IsEditable: sAddress[jeq].IsEditable
											};
											oAddressEquiData.push(sEquiObj);
											oAddressEquiModel.setData(oAddressEquiData);
										}
									}
									if (mCountEquiFlag === false) {
										if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
											(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
											oAddressEquiData[sEquiMatchIndex].Equnr = sObject.Equnr;
											oAddressEquiData[sEquiMatchIndex].Tplnr = sObject.Tplnr;
											oAddressEquiData[sEquiMatchIndex].IsEditable = sObject.IsEditable;
											oAddressEquiModel.setData(oAddressEquiData);
										}
									}

									sObject.IsEditable = sAddress[jeq].IsEditable;
									sObject.Title = sAddress[jeq].Titletxt ? sAddress[jeq].Titletxt : "";
									sObject.TitleCode = sAddress[jeq].Title ? sAddress[jeq].Title : "";
									sObject.Name1 = sAddress[jeq].Name1 ? sAddress[jeq].Name1 : "";
									sObject.Name2 = sAddress[jeq].Name2 ? sAddress[jeq].Name2 : "";
									sObject.Name3 = sAddress[jeq].Name3 ? sAddress[jeq].Name3 : "";
									sObject.Name4 = sAddress[jeq].Name4 ? sAddress[jeq].Name4 : "";
									sObject.Sort1 = sAddress[jeq].Sort1 ? sAddress[jeq].Sort1 : "";
									sObject.Sort2 = sAddress[jeq].Sort2 ? sAddress[jeq].Sort2 : "";
									sObject.NameCo = sAddress[jeq].NameCo ? sAddress[jeq].NameCo : "";
									sObject.PostCod1 = sAddress[jeq].PostCod1 ? sAddress[jeq].PostCod1 : "";
									sObject.City1 = sAddress[jeq].City1 ? sAddress[jeq].City1 : "";
									sObject.Building = sAddress[jeq].Building ? sAddress[jeq].Building : "";
									sObject.Floor = sAddress[jeq].Floor ? sAddress[jeq].Floor : "";
									sObject.Roomnum = sAddress[jeq].Roomnum ? sAddress[jeq].Roomnum : "";
									sObject.AddrLocation = sAddress[jeq].Location ? sAddress[jeq].Location : "";
									sObject.Strsuppl1 = sAddress[jeq].Strsuppl1 ? sAddress[jeq].Strsuppl1 : "";
									sObject.Strsuppl2 = sAddress[jeq].Strsuppl2 ? sAddress[jeq].Strsuppl2 : "";
									sObject.Strsuppl3 = sAddress[jeq].Strsuppl3 ? sAddress[jeq].Strsuppl3 : "";
									sObject.RefPosta = sAddress[jeq].RefPosta ? sAddress[jeq].RefPosta : "";
									sObject.Landx = sAddress[jeq].Landx ? sAddress[jeq].Landx : "";
									sObject.TimeZone = sAddress[jeq].TimeZone ? sAddress[jeq].TimeZone : "";
									sObject.Region = sAddress[jeq].RfePost ? sAddress[jeq].RfePost : "";
									sObject.RegionDesc = sAddress[jeq].Regiotxt ? sAddress[jeq].Regiotxt : "";
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

						sObject.intlAddr = g.equiIntlAddr;
					}
				}

				var aEqLAM = g.equiLAM;
				if (aEqLAM) {
					for (var x = 0; x < aEqLAM.length; x++) {
						if (aEqLAM[x].Equi === sObject.Equnr) {
							////////////// Superior FLOC/EQUI has LAM data - start /////////////////////
							if (sObject.Equnr === sLocalVar && sObject.EquipmentCatogory === "L" && g.lamSwitch === "X") {
								// sObject.lam = currentLAM;
								var tempIndex = x;
								var sMsg = "Superior object has been changed. Do you want to copy linear data from superior object?";
								sap.m.MessageBox.confirm(sMsg, {
									title: "Confirmation",
									onClose: function (oAction) {
										if (oAction === "OK") {
											var oEqLAM = {
												"Equi": aEqLAM[tempIndex].Equi,
												"Lrpid": aEqLAM[tempIndex].Lrpid,
												"LrpidDesc": aEqLAM[tempIndex].LrpDescr,
												"Strtptatr": aEqLAM[tempIndex].Strtptatr,
												"Endptatr": aEqLAM[tempIndex].Endptatr,
												"Length": aEqLAM[tempIndex].Length,
												"LinUnit": aEqLAM[tempIndex].LinUnit,
												"LinUnitDesc": aEqLAM[tempIndex].Uomtext,
												"Startmrkr": aEqLAM[tempIndex].Startmrkr,
												"Endmrkr": aEqLAM[tempIndex].Endmrkr,
												"Mrkdisst": aEqLAM[tempIndex].Mrkdisst,
												"Mrkdisend": aEqLAM[tempIndex].Mrkdisend,
												"MrkrUnit": aEqLAM[tempIndex].MrkrUnit,
												"LamDer": aEqLAM[tempIndex].LamDer
											};
											var mLocalModel = g.getView().getModel(g.oModelName);
											var sMdlData = mLocalModel.getData();
											sMdlData.lam = oEqLAM;
											mLocalModel.setData(sMdlData);
											g.lam.setModel(mLocalModel, "AIWLAM");
											aAIWEQUI[aiwIndex].lam = oEqLAM;
											oAIWEQUIModel.setData(aAIWEQUI);
										}
									}
								});
								break;
							}
							////////////// Superior FLOC/EQUI has LAM data - end /////////////////////
						}
					}
				}

				aAIWEQUI[aiwIndex] = sObject;
				oAIWEQUIModel.setData(aAIWEQUI);

			} else {
				this.isInstall = false;
				this.superiorEquipment = "";
				this.superiorEqDesc = "";
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
						sObject.WcWerks = "";
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
						if (g.getView().getModel("SUP_EQUI_DATA")) {
							var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
							var mSupEquiData = mSupEquiModel.getData();
							var mSupEquiIndex;
							for (var a = 0; a < mSupEquiData.length; a++) {
								if (oEvent.getSource().getModel(g.oModelName).getData().Equnr === mSupEquiData[a].Equnr) {
									mSupEquiIndex = a;
									break;
								}
							}
							var localModel = g.getView().getModel(g.oModelName);
							var localData = localModel.getData();
							var sSupEquiData = g.getView().getModel("SUP_EQUI_DATA").getData()[0];
							if (sSupEquiData) {
								localData.Tplnr = localData.Tplnr === sSupEquiData.Tplnr ? "" : localData.Tplnr;
								localData.Pltxt = localData.Pltxt === sSupEquiData.Pltxt ? "" : localData.Pltxt;
								localData.BeberFl = localData.BeberFl === sSupEquiData.BeberFl ? "" : localData.BeberFl;
								localData.Fing = localData.Fing === sSupEquiData.Fing ? "" : localData.Fing;
								localData.Tele = localData.Tele === sSupEquiData.Tele ? "" : localData.Tele;
								localData.Location = localData.Location === sSupEquiData.Location ? "" : localData.Location;
								localData.Locationdesc = localData.Locationdesc === sSupEquiData.Locationdesc ? "" : localData.Locationdesc;
								localData.Arbpl = localData.Arbpl === sSupEquiData.Arbpl ? "" : localData.Arbpl;
								localData.Ktext = localData.Ktext === sSupEquiData.Ktext ? "" : localData.Ktext;
								localData.WcWerks = localData.WcWerks === sSupEquiData.WcWerks ? "" : localData.WcWerks;
								localData.Abckz = localData.Abckz === sSupEquiData.Abckz ? "" : localData.Abckz;
								localData.Abctx = localData.Abctx === sSupEquiData.Abctx ? "" : localData.Abctx;
								localData.MainArbpl = localData.MainArbpl === sSupEquiData.MainArbpl ? "" : localData.MainArbpl;
								localData.MainKtext = localData.MainKtext === sSupEquiData.MainKtext ? "" : localData.MainKtext;
								localData.MainWerks = localData.MainWerks === sSupEquiData.MainWerks ? "" : localData.MainWerks;
								localData.Kostl = localData.Kostl === sSupEquiData.Kostl ? "" : localData.Kostl;
								localData.Mctxt = localData.Mctxt === sSupEquiData.Mctxt ? "" : localData.Mctxt;
								localData.Ingrp = localData.Ingrp === sSupEquiData.Ingrp ? "" : localData.Ingrp;
								localData.Innam = localData.Innam === sSupEquiData.Innam ? "" : localData.Innam;

								if (localData.Maintplant !== "") {
									localData.TplnrEnabled = true;
									localData.MaintplantEnabled = true;
									localData.BukrsEnabled = false;
									localData.Bukrs = localData.Bukrs;
									localData.Butxt = localData.Butxt;
									localData.Kokrs = localData.Kokrs;
									localData.Werks = localData.Werks;
									localData.Planningplantdes = localData.Planningplantdes;
								} else {
									localData.BukrsEnabled = true;
									localData.Bukrs = localData.Bukrs === sSupEquiData.Bukrs ? "" : localData.Bukrs;
									localData.Butxt = localData.Butxt === sSupEquiData.Butxt ? "" : localData.Butxt;
									localData.Kokrs = localData.Kokrs === sSupEquiData.Kokrs ? "" : localData.Kokrs;
									localData.Werks = localData.Werks === sSupEquiData.Werks ? "" : localData.Werks;
									localData.Planningplantdes = localData.Planningplantdes === sSupEquiData.Planningplantdes ? "" : localData.Planningplantdes;
								}
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

								var mAddressModel = sap.ui.getCore().getModel("equiAddressView");
								var mAddressData = mAddressModel.getData();
								for (var as = 0; as < mAddressData.length; as++) {
									if (oEvent.getSource().getModel(g.oModelName).getData().Equnr === mAddressData[as].Equnr) {
										mAddressData.splice(as, 1);
										mAddressModel.setData(mAddressData);
										break;
									}
								}

								var sAddressModel = g.getView().getModel("equiAddressView");
								var sAddressData = sAddressModel.getData();
								sAddressData.enabled = true;
								sAddressModel.setData(sAddressData);

								mSupEquiData.splice(mSupEquiIndex, 1);
								mSupEquiModel.setData(mSupEquiData);
							}
						}

						sObject.intlAddr = [];
					}
				}

				if (tData[8].Property === "Adrnr" && tData[8].instLoc === true) {
					var sAddressModel = g.getView().getModel("equiAddressView");
					var sAddressData = sAddressModel.getData();
					sAddressData.enabled = true;
					sAddressModel.setData(sAddressData);

					sap.ui.getCore().getModel("equiAddressView").getData().forEach(function (item) {
						if (item.Equnr === sObject.Equnr) {
							item.IsEditable = true;
						}
					});
				}

				sObject.MaintplantEnabled = true; // mPlant.setEnabled(true);
				sObject.Tplnr = ""; // fl.setValue();
				sObject.Pltxt = ""; // fDesc.setValue();
				sObject.TplnrEnabled = true;
				sObject.SuperordinateEquipEnabled = true;
				aAIWEQUI[aiwIndex] = sObject;
				oAIWEQUIModel.setData(aAIWEQUI);
				this.readSystemStatus(g);
			}

			if (tData.length < 11) {
				var aDoiData = this.getView().getModel("dataOrigin").getData();
				tData.splice(0, 0, aDoiData[0]); //Maintainence plant DOI data
				tData.splice(6, 0, aDoiData[6]); //Planning plant DOI data
				this.getView().getModel("dataOrigin").setData(tData);
			}
			this.getView().getModel("dataOrigin").setData(tData); // new line of code

			for (var w = 0; w < sap.ui.getCore().getModel("dataOriginMOP").getData().EQ.length; w++) {
				if (sap.ui.getCore().getModel("dataOriginMOP").getData().EQ[w].key === sLocalVar) {
					sap.ui.getCore().getModel("dataOriginMOP").getData().EQ[w].DOI = tData;
				}
			}

			for (var leq = 0; leq < oAIWEQUIModel.getData().length; leq++) {
				if (sLocalVar === oAIWEQUIModel.getData()[leq].Equnr) {
					g.rowIndex = "/" + leq;
					var oJsonModel = new JSONModel();
					var sCurrentObject = oAIWEQUIModel.getProperty(g.rowIndex);

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

						var sAddressModel = g.getView().getModel("equiAddressView");
						var sAddressData = sAddressModel.getData();
						sAddressData.enabled = sCurrentObject.IsEditable;
						if (type !== "Install" && tData[10].Property === "Adrnr" && tData[10].instLoc === true) {
							sAddressData.enabled = true;
						}
						sAddressModel.setData(sAddressData);
					}
					oJsonModel.setData(sCurrentObject);
					g.getView().setModel(oJsonModel, g.oModelName);
					g.getView().getModel(g.oModelName).refresh();
					g.lam.setModel(oJsonModel, "AIWLAM");

					var sCopyArray = [oJsonModel.getData()];
					var sSupEquiData = $.map(sCopyArray, function (obj) {
						return $.extend(true, {}, obj);
					});
					var sSupEquiModel = new JSONModel();
					sSupEquiModel.setData(sSupEquiData);
					g.getView().setModel(sSupEquiModel, "SUP_EQUI_DATA");

					var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
					var mSupEquiData = mSupEquiModel.getData();
					var mCountCEquiFlag = true;
					for (var se = 0; se < mSupEquiData.length; se++) {
						if (sCurrentObject.Equnr === mSupEquiData[se].Equnr) {
							mCountCEquiFlag = false;
						}
					}
					if (mCountCEquiFlag === true) {
						if ((sCurrentObject.SuperordinateEquip !== "" && sCurrentObject.SuperordinateEquip !== undefined) ||
							(sCurrentObject.Tplnr !== "" && sCurrentObject.Tplnr !== undefined)) {
							mSupEquiData.push(sSupEquiData[0]);
							mSupEquiModel.setData(mSupEquiData);
						}
					}

					// oMainViewData.tableBusy = false;
					// oMainViewModel.setData(oMainViewData);
					//return;
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
			var sLocalVar = g.getView().getModel(g.oModelName).getData().Equnr;
			var tData = oEvent.getSource().getParent().getContent()[1].getModel().getData();

			var sObject = localData;

			if (type === "Install") {
				this.isInstall = true;
				var equiHeader = g.equiHeader;
				if (!tData[1].maintenance) {
					sObject.Location = equiHeader.StorEilo;
					sObject.Locationdesc = equiHeader.Locationdesc;
				}
				if (!tData[2].maintenance) {
					sObject.BeberFl = equiHeader.BebeEilo;
					sObject.Fing = equiHeader.Fing;
					sObject.Tele = equiHeader.Tele;
				}
				if (!tData[4].maintenance) {
					sObject.Abctx = equiHeader.Abctx;
					sObject.Abckz = equiHeader.AbckEilo;
				}
				if (!tData[5].maintenance) {
					sObject.Kostl = equiHeader.KostEilo;
					sObject.Mctxt = equiHeader.Contareaname;
				}
				if (!tData[7].maintenance) {
					sObject.Ingrp = equiHeader.IngrEeqz;
					sObject.Innam = equiHeader.Plannergrpdesc;
				}
				if (!tData[8].maintenance) {
					sObject.MainArbpl = equiHeader.ArbpEeqz;
					sObject.MainKtext = equiHeader.MainWcDesc;
					sObject.MainWerks = equiHeader.MainWcPlant;
				}
				if (tData[0].instLoc && equiHeader.Swerk !== "") {
					sObject.Maintplant = equiHeader.Swerk;
					sObject.MaintplantDesc = equiHeader.Name1;
					sObject.MaintplantEnabled = false;
					sObject.Bukrs = equiHeader.BukrEilo;
					sObject.Butxt = equiHeader.Butxt;
					sObject.BukrsEnabled = false;
					sObject.Werks = equiHeader.PplaEeqz;
					sObject.Planningplantdes = equiHeader.Planningplantdes;
					sObject.Kokrs = equiHeader.KokrEilo;
				}
				sObject.MaintplantEnabled = true;
				sObject.Stattext = equiHeader.Stattext;
				sObject.Tplnr = equiHeader.TplnEilo; //g.equiHeader.FlocRef;
				sObject.Pltxt = equiHeader.Flocdescription; //g.equiHeader.Flocdescription;

				if (tData.length < 11) {
					var aDoiData = this.getView().getModel("dataOrigin").getData();
					tData.splice(0, 0, aDoiData[0]); //Maintainence plant DOI data
					tData.splice(6, 0, aDoiData[6]); //Planning plant DOI data
					this.getView().getModel("dataOrigin").setData(tData);
				}

				if (!tData[10].maintenance) {
					var sAddress = g.equiAddr;
					if (sAddress) {
						if (sAddress.length > 0) {
							for (var jeq = 0; jeq < sAddress.length; jeq++) {
								if (sObject.Equnr === sAddress[jeq].Equi) {
									var oAddressEquiModel = sap.ui.getCore().getModel("equiAddressView");
									var oAddressEquiData = oAddressEquiModel.getData();
									var mCountEquiFlag = true;
									var sEquiObj, sEquiMatchIndex;
									if (oAddressEquiData.length > 0) {
										for (var sfa = 0; sfa < oAddressEquiData.length; sfa++) {
											if (sObject.Equnr === oAddressEquiData[sfa].Equnr) {
												mCountEquiFlag = false;
												sEquiMatchIndex = sfa;
												break;
											}
										}
									}
									if (mCountEquiFlag === true) {
										if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
											(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
											sEquiObj = {
												Equnr: sObject.Equnr,
												Tplnr: sObject.Tplnr,
												IsEditable: sAddress[jeq].IsEditable
											};
											oAddressEquiData.push(sEquiObj);
											oAddressEquiModel.setData(oAddressEquiData);
										}
									}
									if (mCountEquiFlag === false) {
										if ((sObject.SuperordinateEquip !== "" && sObject.SuperordinateEquip !== undefined) ||
											(sObject.Tplnr !== "" && sObject.Tplnr !== undefined)) {
											oAddressEquiData[sEquiMatchIndex].Equnr = sObject.Equnr;
											oAddressEquiData[sEquiMatchIndex].Tplnr = sObject.Tplnr;
											oAddressEquiData[sEquiMatchIndex].IsEditable = sObject.IsEditable;
											oAddressEquiModel.setData(oAddressEquiData);
										}
									}

									sObject.IsEditable = sAddress[jeq].IsEditable;
									sObject.Title = sAddress[jeq].Titletxt ? sAddress[jeq].Titletxt : "";
									sObject.TitleCode = sAddress[jeq].Title ? sAddress[jeq].Title : "";
									sObject.Name1 = sAddress[jeq].Name1 ? sAddress[jeq].Name1 : "";
									sObject.Name2 = sAddress[jeq].Name2 ? sAddress[jeq].Name2 : "";
									sObject.Name3 = sAddress[jeq].Name3 ? sAddress[jeq].Name3 : "";
									sObject.Name4 = sAddress[jeq].Name4 ? sAddress[jeq].Name4 : "";
									sObject.Sort1 = sAddress[jeq].Sort1 ? sAddress[jeq].Sort1 : "";
									sObject.Sort2 = sAddress[jeq].Sort2 ? sAddress[jeq].Sort2 : "";
									sObject.NameCo = sAddress[jeq].NameCo ? sAddress[jeq].NameCo : "";
									sObject.PostCod1 = sAddress[jeq].PostCod1 ? sAddress[jeq].PostCod1 : "";
									sObject.City1 = sAddress[jeq].City1 ? sAddress[jeq].City1 : "";
									sObject.Building = sAddress[jeq].Building ? sAddress[jeq].Building : "";
									sObject.Floor = sAddress[jeq].Floor ? sAddress[jeq].Floor : "";
									sObject.Roomnum = sAddress[jeq].Roomnum ? sAddress[jeq].Roomnum : "";
									sObject.AddrLocation = sAddress[jeq].Location ? sAddress[jeq].Location : "";
									sObject.Strsuppl1 = sAddress[jeq].Strsuppl1 ? sAddress[jeq].Strsuppl1 : "";
									sObject.Strsuppl2 = sAddress[jeq].Strsuppl2 ? sAddress[jeq].Strsuppl2 : "";
									sObject.Strsuppl3 = sAddress[jeq].Strsuppl3 ? sAddress[jeq].Strsuppl3 : "";
									sObject.RefPosta = sAddress[jeq].RefPosta ? sAddress[jeq].RefPosta : "";
									sObject.Landx = sAddress[jeq].Landx ? sAddress[jeq].Landx : "";
									sObject.TimeZone = sAddress[jeq].TimeZone ? sAddress[jeq].TimeZone : "";
									sObject.Region = sAddress[jeq].RfePost ? sAddress[jeq].RfePost : "";
									sObject.RegionDesc = sAddress[jeq].Regiotxt ? sAddress[jeq].Regiotxt : "";
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

						sObject.intlAddr = g.equiIntlAddr;
					}
				}

				var aEqLAM = g.equiLAM;
				if (aEqLAM) {
					for (var x = 0; x < aEqLAM.length; x++) {
						if (aEqLAM[x].Equi === sObject.Equnr) {
							////////////// Superior FLOC/EQUI has LAM data - start /////////////////////
							if (sObject.Equnr === sLocalVar && sObject.EquipmentCatogory === "L" && g.lamSwitch === "X") {
								// sObject.lam = currentLAM;
								var tempIndex = x;
								var sMsg = "Superior object has been changed. Do you want to copy linear data from superior object?";
								sap.m.MessageBox.confirm(sMsg, {
									title: "Confirmation",
									onClose: function (oAction) {
										if (oAction === "OK") {
											var oEqLAM = {
												"Equi": aEqLAM[tempIndex].Equi,
												"Lrpid": aEqLAM[tempIndex].Lrpid,
												"LrpidDesc": aEqLAM[tempIndex].LrpDescr,
												"Strtptatr": aEqLAM[tempIndex].Strtptatr,
												"Endptatr": aEqLAM[tempIndex].Endptatr,
												"Length": aEqLAM[tempIndex].Length,
												"LinUnit": aEqLAM[tempIndex].LinUnit,
												"LinUnitDesc": aEqLAM[tempIndex].Uomtext,
												"Startmrkr": aEqLAM[tempIndex].Startmrkr,
												"Endmrkr": aEqLAM[tempIndex].Endmrkr,
												"Mrkdisst": aEqLAM[tempIndex].Mrkdisst,
												"Mrkdisend": aEqLAM[tempIndex].Mrkdisend,
												"MrkrUnit": aEqLAM[tempIndex].MrkrUnit,
												"LamDer": aEqLAM[tempIndex].LamDer
											};
											var mLocalModel = g.getView().getModel(g.oModelName);
											var sMdlData = mLocalModel.getData();
											sMdlData.lam = oEqLAM;
											mLocalModel.setData(sMdlData);
											g.lam.setModel(mLocalModel, "AIWLAM");
											// aAIWEQUI[aiwIndex].lam = oEqLAM;
											// oAIWEQUIModel.setData(aAIWEQUI);
										}
									}
								});
								break;
							}
							////////////// Superior FLOC/EQUI has LAM data - end /////////////////////
						}
					}
				}

				g.getView().getModel(g.oModelName).setData(sObject);

			} else {
				this.isInstall = false;
				this.superiorEquipment = "";
				this.superiorEqDesc = "";
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
						sObject.WcWerks = "";
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
						if (g.getView().getModel("SUP_EQUI_DATA")) {
							var mSupEquiModel = sap.ui.getCore().getModel("SUP_EQUI_DATA");
							var mSupEquiData = mSupEquiModel.getData();
							var mSupEquiIndex;
							for (var a = 0; a < mSupEquiData.length; a++) {
								if (oEvent.getSource().getModel(g.oModelName).getData().Equnr === mSupEquiData[a].Equnr) {
									mSupEquiIndex = a;
									break;
								}
							}
							var localModel = g.getView().getModel(g.oModelName);
							var localData = localModel.getData();
							var sSupEquiData = g.getView().getModel("SUP_EQUI_DATA").getData()[0];
							if (sSupEquiData) {
								localData.Tplnr = localData.Tplnr === sSupEquiData.Tplnr ? "" : localData.Tplnr;
								localData.Pltxt = localData.Pltxt === sSupEquiData.Pltxt ? "" : localData.Pltxt;
								localData.BeberFl = localData.BeberFl === sSupEquiData.BeberFl ? "" : localData.BeberFl;
								localData.Fing = localData.Fing === sSupEquiData.Fing ? "" : localData.Fing;
								localData.Tele = localData.Tele === sSupEquiData.Tele ? "" : localData.Tele;
								localData.Location = localData.Location === sSupEquiData.Location ? "" : localData.Location;
								localData.Locationdesc = localData.Locationdesc === sSupEquiData.Locationdesc ? "" : localData.Locationdesc;
								localData.Arbpl = localData.Arbpl === sSupEquiData.Arbpl ? "" : localData.Arbpl;
								localData.Ktext = localData.Ktext === sSupEquiData.Ktext ? "" : localData.Ktext;
								localData.WcWerks = localData.WcWerks === sSupEquiData.WcWerks ? "" : localData.WcWerks;
								localData.Abckz = localData.Abckz === sSupEquiData.Abckz ? "" : localData.Abckz;
								localData.Abctx = localData.Abctx === sSupEquiData.Abctx ? "" : localData.Abctx;
								localData.MainArbpl = localData.MainArbpl === sSupEquiData.MainArbpl ? "" : localData.MainArbpl;
								localData.MainKtext = localData.MainKtext === sSupEquiData.MainKtext ? "" : localData.MainKtext;
								localData.MainWerks = localData.MainWerks === sSupEquiData.MainWerks ? "" : localData.MainWerks;
								localData.Kostl = localData.Kostl === sSupEquiData.Kostl ? "" : localData.Kostl;
								localData.Mctxt = localData.Mctxt === sSupEquiData.Mctxt ? "" : localData.Mctxt;
								localData.Ingrp = localData.Ingrp === sSupEquiData.Ingrp ? "" : localData.Ingrp;
								localData.Innam = localData.Innam === sSupEquiData.Innam ? "" : localData.Innam;

								if (localData.Maintplant !== "") {
									localData.TplnrEnabled = true;
									localData.MaintplantEnabled = true;
									localData.BukrsEnabled = false;
									localData.Bukrs = localData.Bukrs;
									localData.Butxt = localData.Butxt;
									localData.Kokrs = localData.Kokrs;
									localData.Werks = localData.Werks;
									localData.Planningplantdes = localData.Planningplantdes;
								} else {
									localData.BukrsEnabled = true;
									localData.Bukrs = localData.Bukrs === sSupEquiData.Bukrs ? "" : localData.Bukrs;
									localData.Butxt = localData.Butxt === sSupEquiData.Butxt ? "" : localData.Butxt;
									localData.Kokrs = localData.Kokrs === sSupEquiData.Kokrs ? "" : localData.Kokrs;
									localData.Werks = localData.Werks === sSupEquiData.Werks ? "" : localData.Werks;
									localData.Planningplantdes = localData.Planningplantdes === sSupEquiData.Planningplantdes ? "" : localData.Planningplantdes;
								}
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

								var mAddressModel = sap.ui.getCore().getModel("equiAddressView");
								var mAddressData = mAddressModel.getData();
								for (var as = 0; as < mAddressData.length; as++) {
									if (oEvent.getSource().getModel(g.oModelName).getData().Equnr === mAddressData[as].Equnr) {
										mAddressData.splice(as, 1);
										mAddressModel.setData(mAddressData);
										break;
									}
								}

								var sAddressModel = g.getView().getModel("equiAddressView");
								var sAddressData = sAddressModel.getData();
								sAddressData.enabled = true;
								sAddressModel.setData(sAddressData);

								mSupEquiData.splice(mSupEquiIndex, 1);
								mSupEquiModel.setData(mSupEquiData);
							}
						}

						sObject.intlAddr = [];
					}
				}

				if (tData[8].Property === "Adrnr" && tData[8].instLoc === true) {
					var sAddressModel = g.getView().getModel("equiAddressView");
					var sAddressData = sAddressModel.getData();
					sAddressData.enabled = true;
					sAddressModel.setData(sAddressData);

					sap.ui.getCore().getModel("equiAddressView").getData().forEach(function (item) {
						if (item.Equnr === sObject.Equnr) {
							item.IsEditable = true;
						}
					});
				}

				sObject.MaintplantEnabled = true; // mPlant.setEnabled(true);
				sObject.Tplnr = ""; // fl.setValue();
				sObject.Pltxt = ""; // fDesc.setValue();
				sObject.TplnrEnabled = true;
				g.getView().getModel(g.oModelName).setData(sObject);
				g.getView().getModel(g.oModelName).refresh();
				this.readSystemStatus(g);
			}

			if (tData.length < 11) {
				var aDoiData = this.getView().getModel("dataOrigin").getData();
				tData.splice(0, 0, aDoiData[0]); //Maintainence plant DOI data
				tData.splice(6, 0, aDoiData[6]); //Planning plant DOI data
				this.getView().getModel("dataOrigin").setData(tData);
			}

			oEvent.getSource().getParent().close();

			if (this.doiDisplayFlag) {
				this.doiDisplayFlag = false;
			}
		},

		// fetchData: function(equipNo, plant, supEqui, floc, flag) {
		// 	var g = this;
		// 	var f = g.getModel(g.oModelName).getData();
		// 	var isValid = true;
		// 	var oFilter = [new sap.ui.model.Filter("Equnr", "EQ", equipNo),
		// 		// new sap.ui.model.Filter("Swerk", "EQ", plant),
		// 		// new sap.ui.model.Filter("Tplnr", "EQ", floc),
		// 		new sap.ui.model.Filter("Werks", "EQ", ""),
		// 		new sap.ui.model.Filter("HequEeqz", "EQ", supEqui)
		// 	];
		// 	// var oExpand = ["Equi_Permt", "Equi_Stock", "Equi_PTNR", "Equi_PRT", "EqValua", "EqClass", "Eq_Mltxt", "Equi_LAM"];
		// 	var oExpand = ["Equipment"];
		// 	// var oExpand = ["EqPermt", "EqStock", "EqPRTNR", "EqPRT", "EqVal", "EqClass", "EqMltxt", "EqLAM"];
		// 	var M = g.getView().getModel();
		// 	M.read("/ChangeRequestSet", {
		// 		filters: oFilter,
		// 		urlParameters: {
		// 			"$expand": oExpand
		// 		},
		// 		success: function(data) {
		// 			if (data.results.length > 0) {
		// 				if (flag !== "submit") {
		// 					f.Location = data.results[0].StorEilo;
		// 					f.Locationdesc = data.results[0].Locationdesc;
		// 					f.Abckz = data.results[0].AbckEilo;
		// 					f.Abctx = data.results[0].Abctx;
		// 					f.Kostl = data.results[0].Kostl;
		// 					f.Mctxt = data.results[0].Mctxt;
		// 					f.Kokrs = data.results[0].Kokrs;
		// 					f.Werks = data.results[0].Werks;
		// 					f.Planningplantdes = data.results[0].Planningplantdes;
		// 					f.Ingrp = data.results[0].Ingrp;
		// 					f.Innam = data.results[0].Innam;
		// 					// f.MainArbpl = data.results[0].Arbpl;
		// 					// f.MainKtext = data.results[0].Ktext;
		// 					// f.MainWerks = data.results[0].Werks;
		// 					// f.Arbpl = data.results[0].Arbpl;
		// 					// f.Ktext = data.results[0].Ktext;
		// 					// f.WcWerks = data.results[0].Werks; //WcWerks OR MainArbpl
		// 					f.MainArbpl = data.results[0].ArbpEeqz;
		// 					f.MainKtext = data.results[0].MainWcDesc;
		// 					f.MainWerks = data.results[0].MainWcPlant;
		// 					f.Arbpl = data.results[0].ArbpEilo;
		// 					f.Ktext = data.results[0].Workcenterdesc;
		// 					f.WcWerks = data.results[0].WorkCenterPlant; //WcWerks OR MainArbpl
		// 					f.Maintplant = data.results[0].Swerk;
		// 					f.MaintplantDesc = data.results[0].Name1;
		// 					f.BeberFl = data.results[0].BebeEilo;
		// 					f.Bukrs = data.results[0].BukrEilo;
		// 					f.Butxt = data.results[0].Butxt;
		// 					f.BukrsEnabled = false;
		// 					f.Tplnr = data.results[0].Tplnr;
		// 					f.Pltxt = data.results[0].Pltxt;
		// 					f.Stattext = data.results[0].Stattext;
		// 					g.getModel(g.oModelName).refresh();
		// 				}
		// 			} else {
		// 				if (flag !== "submit") {
		// 					f.Location = "";
		// 					f.Locationdesc = "";
		// 					f.Abckz = "";
		// 					f.Abctx = "";
		// 					f.Kostl = "";
		// 					f.KolrEilo = "";
		// 					f.Mctxt = "";
		// 					f.Werks = "";
		// 					f.Planningplantdes = "";
		// 					f.Ingrp = "";
		// 					f.Innam = "";
		// 					f.MainArbpl = "";
		// 					f.MainKtext = "";
		// 					f.MainWerks = "";
		// 					f.Maintplant = "";
		// 					f.MaintplantDesc = "";
		// 					f.Arbpl = "";
		// 					f.Ktext = "";
		// 					f.WcWerks = "";
		// 					f.BeberFl = "";
		// 					f.Bukrs = "";
		// 					f.Butxt = "";
		// 					f.BukrsEnabled = true;
		// 					f.Tplnr = "";
		// 					f.Pltxt = "";
		// 					g.readSystemStatus(g);
		// 					// g.getModel(g.oModelName).refresh();
		// 				}
		// 			}
		// 			//test
		// 			if (g.submitBtn === true) {
		// 				g.onSubmit();
		// 			}
		// 			return isValid;
		// 		},
		// 		error: function(err) {
		// 			isValid = false;
		// 			var error = [];
		// 			if (JSON.parse(err.responseText).error.innererror.errordetails === undefined || JSON.parse(err.responseText).error.innererror.errordetails
		// 				.length === 0) {
		// 				error[0] = JSON.parse(err.responseText).error.message.value;
		// 			} else {
		// 				for (var n = 0; n < JSON.parse(err.responseText).error.innererror.errordetails.length; n++) {
		// 					error[n] = JSON.parse(err.responseText).error.innererror.errordetails[n].message;
		// 				}
		// 			}
		// 			var value = error.join("\n");
		// 			sap.m.MessageBox.show(value, {
		// 				title: "Error",
		// 				icon: sap.m.MessageBox.Icon.ERROR,
		// 				onClose: function() {}
		// 			});
		// 			return isValid;
		// 		}
		// 	});
		// 	return isValid;
		// },

		onDonePress: function (oEvent) {
			var g = this;
			g.doneFlag = true;
			var stateErrFlag, cityErrFlag;
			var sSourceId = oEvent.getSource().getId();

			if (g.viewName === "CreateEqui" || g.oModelUpdateFlag === true) {
				g.handleValueState("Equnr", "EqunrVS", oEvent);
				g.handleValueState("Eqktx", "EqktxVS", oEvent);
				g.handleValueState("EquipmentCatogory", "EquipmentCatogoryVS", oEvent);

				var oAIWModel = g.getView().getModel(g.oModelName);
				var oAIWData = oAIWModel.getData();
				if (oAIWData.Fhmkz) {
					g.handleValueState("PlanvPrt", "PlanvPrtVS", oEvent);
				}

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

				if (oAIWData.dfps && oAIWData.dfps.dfpsEnabled === true && oAIWData.dfps.Tailno === "") {
					oAIWData.dfps.TailnoVS = "Error";
					oAIWModel.refresh();
					g.doneFlag = false;
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

				if (g.oModelUpdateFlag && !g.sExistFlag) {
					var sJsonModel = sap.ui.getCore().getModel(g.oModelName).getData();
					g.getView().getModel(g.oModelName).getData().viewParameter = "change";
					sJsonModel.push(g.getView().getModel(g.oModelName).getData());

					sap.ui.getCore().getModel("dataOriginMOP").getData().EQ.push({
						key: g.getView().getModel(g.oModelName).getData().Equnr,
						DOI: g.getView().getModel("dataOrigin").getData()
					});
				}
				sap.ui.getCore().getModel(g.oModelName).refresh();
				g.currentFragment = undefined;

				var mCurrentAin = this.getView().getModel("ain");
				if (mCurrentAin) {
					var aindata = mCurrentAin.getData();
					var ainMop = sap.ui.getCore().getModel("ainMOP").getData();
					var ainExistFlag = false;
					for (var x = 0; x < ainMop.length; x++) {
						if (ainMop[x].key === g.getView().getModel(g.oModelName).getData().Equnr) {
							ainMop[x].AIN = aindata;
							ainExistFlag = true;
							break;
						}
					}
					if (!ainExistFlag) {
						sap.ui.getCore().getModel("ainMOP").getData().push({
							key: g.getView().getModel(g.oModelName).getData().Equnr,
							AIN: aindata
						});
					}
					this.getView().setModel(undefined, "ain");
				}

				if (g.viewName === "CreateEqui") {
					var sDOIexistFlag = false;
					var aDOIFL = sap.ui.getCore().getModel("dataOriginMOP").getData().EQ;
					for (var x = 0; x < aDOIFL.length; x++) {
						if (aDOIFL[x].key === g.getView().getModel(g.oModelName).getData().Equnr) {
							sap.ui.getCore().getModel("dataOriginMOP").getData().EQ[x].DOI = g.getView().getModel("dataOrigin").getData();
							sDOIexistFlag = true;
							break;
						}
					}

					if (!sDOIexistFlag) {
						var currentIndex = this.rowIndex.split("/")[1];
						sap.ui.getCore().getModel("dataOriginMOP").getData().EQ[currentIndex] = {
							key: g.getView().getModel(g.oModelName).getData().Equnr,
							DOI: g.getView().getModel("dataOrigin").getData()
						};
						// sap.ui.getCore().getModel("dataOriginMOP").getData().EQ.push({
						// 	key: g.getView().getModel(g.oModelName).getData().Equnr,
						// 	DOI: g.getView().getModel("dataOrigin").getData()
						// });
					}
					this.dataDerivationFlow();
					var deriveFlag = true;
				}

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
				"EqDFPS": [],
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
				"EqLAMCH": []
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
						"Adrnr": AIWEQUIModel[d].Adrnr,
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

					if (AIWEQUIModel[d].dfps) {
						var oEqDFPS = {
							Equi: AIWEQUIModel[d].Equnr,
							DeviceId: AIWEQUIModel[d].dfps.Tailno,
							Topsiteid: AIWEQUIModel[d].dfps.Area,
							Topsitede: AIWEQUIModel[d].dfps.AreaDesc,
							AreaPro: AIWEQUIModel[d].dfps.AreaPrfl,
							SiteId: AIWEQUIModel[d].dfps.Site,
							SiteDesc: AIWEQUIModel[d].dfps.SiteDesc,
							SitePro: AIWEQUIModel[d].dfps.SitePrfl,
							MpoId: AIWEQUIModel[d].dfps.MPO,
							MpoDescr: AIWEQUIModel[d].dfps.MPODesc,
							RicId: AIWEQUIModel[d].dfps.RIC,
							RicDescr: AIWEQUIModel[d].dfps.RICDesc,
							ModelId: AIWEQUIModel[d].dfps.ModelId,
							ModelDes: AIWEQUIModel[d].dfps.ModelIdDesc,
							Foreignob: formatter.truetoX(AIWEQUIModel[d].dfps.ForeignEq),
							TecState: AIWEQUIModel[d].dfps.TechSts,
							DepState: AIWEQUIModel[d].dfps.OperSts,
							DfpsRmrk: AIWEQUIModel[d].dfps.Remark
						};
						sPayload.EqDFPS.push(oEqDFPS);
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

					var aFLLinChar = AIWEQUIModel[d].linearChar;
					if (aFLLinChar) {
						if (aFLLinChar.length > 0) {
							var alinearChar = $.map(aFLLinChar, function (obj) {
								return $.extend(true, {}, obj);
							});
							for (var c = 0; c < alinearChar.length; c++) {
								delete alinearChar[c].linCharEnable;
								alinearChar[c].Equi = AIWEQUIModel[d].Equnr;
								sPayload.EqLAMCH.push(alinearChar[c]);
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

			// var sEquipment = {
			// 	"Herst": sAIWData.Herst, // Manufacturer
			// 	"Equnr": sAIWData.Equnr,
			// 	"Txtmi": sAIWData.Eqktx,
			// 	//"Eqktx" : sAIWData.Eqktx,
			// 	"Swerk": sAIWData.Maintplant,
			// 	"Name1": sAIWData.MaintplantDesc,
			// 	"TplnEilo": sAIWData.Tplnr,
			// 	"Flocdescription": sAIWData.Pltxt,
			// 	"Eqtyp": sAIWData.EquipmentCatogory,
			// 	"Etytx": sAIWData.EquipCatgDescription,
			// 	"Eqart": sAIWData.TechnicalObjectTyp, // TechnicalObjectTyp
			// 	"Eartx": sAIWData.Description, // TechnicalObjectTyp Description
			// 	"Typbz": sAIWData.Typbz, // Model Number
			// 	"SubmEeqz": sAIWData.ConstrType, // Construction Type
			// 	"Constdesc": sAIWData.ConstructionDesc, // Construction Description
			// 	"BukrEilo": sAIWData.Bukrs,
			// 	"Butxt": sAIWData.Butxt,
			// 	"HequEeqz": sAIWData.SuperordinateEquip, // Superord. Equipment
			// 	"SuperordEqDes": sAIWData.SuperordinateEquipDesc, // Superord. Equipment Description
			// 	"TidnEeqz": sAIWData.TechIdNum, // techIndNo
			// 	"KostEilo": sAIWData.Kostl, // Cost Center
			// 	"KokrEilo": sAIWData.Kokrs, // ccPart1
			// 	"Contareaname": sAIWData.Mctxt, // Name
			// 	"StorEilo": sAIWData.Location,
			// 	"Locationdesc": sAIWData.Locationdesc,
			// 	"AbckEilo": sAIWData.Abckz,
			// 	"Abctx": sAIWData.Abctx,
			// 	"PplaEeqz": sAIWData.Werks, // Planning Plant
			// 	"Planningplantdes": sAIWData.Planningplantdes, // Planning Plant Description
			// 	"IngrEeqz": sAIWData.Ingrp, // Planner Group
			// 	"Plannergrpdesc": sAIWData.Innam, // Planner Group Description
			// 	"Serge": sAIWData.Serge, // manfSerNo
			// 	"MapaEeqz": sAIWData.MapaEeqz, // partNum
			// 	"Stattext": sAIWData.Stattext, // System Status
			// 	"StsmEqui": sAIWData.StsmEqui, // Status Profile
			// 	"Statproftxt": sAIWData.StsmEquiDesc, // Status Profile Description
			// 	"UstwEqui": sAIWData.UstwEqui, // Status with Status Number
			// 	"UswoEqui": sAIWData.UswoEqui, // Status without Status Number
			// 	"UstaEqui": sAIWData.UstaEqui, // User Status
			// 	"Deact": sAIWData.Deact,
			// 	"Answt": sAIWData.Answt,
			// 	"Ansdt": g._formatDate(sAIWData.Ansdt),
			// 	"Waers": sAIWData.Waers, // Currency

			// 	"ArbpEilo": sAIWData.Arbpl, // Work Center
			// 	// "Workcenterdesc" : sAIWData.Ktext, // Plant Work Center
			// 	"WorkCenterPlant": sAIWData.WcWerks, // Name
			// 	"ArbpEeqz": sAIWData.MainArbpl, // Main Work Center
			// 	// "MainWcDesc" : sAIWData.MainKtext, // Work Center Description
			// 	"MainWcPlant": sAIWData.MainWerks, // Work center Plant

			// 	"BebeEilo": sAIWData.BeberFl, // Plant Section
			// 	"Fing": sAIWData.Fing, // Plant Section
			// 	"Tele": sAIWData.Tele, // Plant Section
			// 	"HeqnEeqz": sAIWData.EquipPosition, // Position
			// 	"Adrnri": sAIWData.Adrnri,

			// 	"Funcid": sAIWData.Funcid, // Config Control data
			// 	"Frcfit": sAIWData.Frcfit,
			// 	"Frcrmv": sAIWData.Frcrmv
			// };
			// sPayload.Equipment.push(sEquipment);

			// var sEqPRT = {
			// 	"Equi": sAIWData.Equnr,
			// 	"PlanvPrt": sAIWData.PlanvPrt,
			// 	"SteufPrt": sAIWData.SteufPrt,
			// 	"KtschPrt": sAIWData.KtschPrt,
			// 	"Ewformprt": sAIWData.Ewformprt,
			// 	"SteufRef": sAIWData.SteufRef,
			// 	"KtschRef": sAIWData.KtschRef,
			// 	"EwformRef": sAIWData.EwformRef
			// };
			// sPayload.EqPRT.push(sEqPRT);

			// if (sAIWData.EquipmentCatogory === "L") {
			// 	var sEqLAM = {
			// 		"Equi": sAIWData.Equnr,
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
			// 	sPayload.EqLAM.push(sEqLAM);
			// }

			// var sEqAddr = {
			// 	"Equi": sAIWData.Equnr,
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
			// 	"RefPosta": sAIWData.RefPosta,
			// 	"Landx": sAIWData.Landx,
			// 	"TimeZone": sAIWData.TimeZone,
			// 	"RfePost": sAIWData.Region,
			// 	"Regiotxt": sAIWData.RegionDesc
			// };
			// sPayload.EqAddr.push(sEqAddr);

			// var aIntlAddr = sAIWData.intlAddr;
			// if (aIntlAddr.length > 0) {
			// 	for (var z = 0; z < aIntlAddr.length; z++) {
			// 		sPayload.EqAddrI.push(aIntlAddr[z]);
			// 	}
			// }

			// var sEqClassList = sAIWData.classItems;
			// if (sEqClassList) {
			// 	if (sEqClassList.length > 0) {
			// 		for (var e = 0; e < sEqClassList.length; e++) {
			// 			var sEqClass = {
			// 				"Equi": sAIWData.Equnr,
			// 				"Classtype": sEqClassList[e].Classtype,
			// 				"Class": sEqClassList[e].Class,
			// 				"Clstatus1": sEqClassList[e].Clstatus1
			// 			};
			// 			sPayload.EqClass.push(sEqClass);
			// 		}
			// 	}
			// }

			// var sEqCharList = sAIWData.characteristics;
			// if (sEqCharList) {
			// 	if (sEqCharList.length > 0) {
			// 		for (var f = 0; f < sEqCharList.length; f++) {
			// 			var sEqVal = {
			// 				"Equi": sAIWData.Equnr,
			// 				"Atnam": sEqCharList[f].Atnam,
			// 				"Textbez": sEqCharList[f].Textbez,
			// 				"Atwrt": sEqCharList[f].Atwrt,
			// 				"Class": sEqCharList[f].Class
			// 			};
			// 			sPayload.EqVal.push(sEqVal);
			// 		}
			// 	}
			// }

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
			this.getView().byId("equipmentPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("equipmentPage").setBusy(false);
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
					g.getView().byId("equipmentPage").setBusy(false);
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

		onForceInstDismantSelect: function (e) {
			var sBindProperty = e.getSource().getBindingInfo("selected").binding.sPath;
			var sData = e.getSource().getModel(this.oModelName).getData();
			if (sBindProperty === "/Frcfit" && e.getSource().getSelected() === true) {
				sData.Frcfit = "X";
				sData.Frcrmv = "";
			} else if (sBindProperty === "/Frcrmv" && e.getSource().getSelected() === true) {
				sData.Frcrmv = "X";
				sData.Frcfit = "";
			}
			this.getView().getModel(this.oModelName).refresh();
		},

		/////////////////////// AIN ////////////////////
		onLinkAinPress: function (event) {
			var aModel = this.getView().getModel("AIWEQUI");
			var m = this.getView().getModel("ainModel");
			var aData = aModel.getData();
			var model = aData.Typbz,
				manf = aData.Herst;
			this.getView().byId("equipmentPage").setBusy(true);
			var g = this;
			jQuery.sap.delayedCall(30, this, function () {
				Utilities.searchPress(event, this, model, manf, m);
				g.getView().byId("equipmentPage").setBusy(false);
			});

		},

		onRowSelect: function (e) {
			var path = e.getParameter('listItem').oBindingContexts.results.sPath;
			this.sPath = path;
		},

		onAINMoreInfoClose: function (e) {
			e.getSource().getParent().close();
		},

		onDeLlinkAinPress: function (e) {
			var g = this;
			sap.m.MessageBox.confirm("Link from Equipment to AIN Model will be Removed. Do you want to continue?", {
				title: "Confirm", // default
				onClose: function (oAction) {
					if (oAction === "OK") {
						var data = g.getView().getModel("ain").getData();
						data.linkVisible = true;
						data.moreInfo = false;
						data.equiCreate = false;
						data.Name = "";
						data.Modelid = "";
						data.Description = "";
						data.Manufacturer = "";
						data.Modeltemplate = "";
						g.getView().getModel("ain").setData(data);
						sap.ui.getCore().getModel("ain").setData(data);
					}

				}, // default
				styleClass: "", // default
				initialFocus: null, // default
				textDirection: sap.ui.core.TextDirection.Inherit // default
			});
		},

		handleMoreInfoPress: function (e) {
			var g = this;
			var model = this.getView().getModel("ainModel");
			var modelId = this.getView().getModel("ain").getProperty("/Modelid");
			var oFilters = [new sap.ui.model.Filter("Modelid", "EQ", modelId)];
			var bd = new sap.m.BusyDialog();
			bd.open();
			var oExpand = ["AINHeaderinfo", "AINAnnounce", "AINAttachments",
				"AINCharacteristics"
			];
			model.read("/Equipment_DetailsSet", {
				filters: oFilters,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					var oModel = new JSONModel();
					oModel.setData(r.results[0]);
					g.getView().setModel(oModel, "detail");
					sap.ui.getCore().setModel(oModel, "detail");
					if (!g.moreInfoDialog) {
						g.moreInfoDialog = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.ain.AINMoreInfo", g);
						g.getView().addDependent(g.moreInfoDialog);
					}
					var imgId = g.getView().getModel("detail").getProperty("/AINHeaderinfo/results/0/Image");
					var u = model.sServiceUrl + "/DownloadattachmentSet(AttachmentID='" + imgId + "_image_png" + "')/$value";
					sap.ui.getCore().byId("imgDisplay").setSrc(u);
					g.moreInfoDialog.setModel(oModel);
					g.moreInfoDialog.open();
					bd.close();
				},
				error: function (err) {

				}
			});
		},

		setAinInitialData: function () {
			var obj = {
				moreInfo: false,
				linkVisible: true,
				deLinkVisible: false
			};
			var oModel = new sap.ui.model.json.JSONModel(obj);
			this.getView().setModel(oModel, "ain");
			sap.ui.getCore().setModel(oModel, "ain");
		},

		linkModel: function (event) {
			var data = sap.ui.getCore().byId("searchResults").getModel("results").getProperty(this.sPath);
			this.getView().byId("equipmentPage").setBusy(true);
			this.pressDialog.close();
			this.pressDialog.destroy();
			
			jQuery.sap.delayedCall(10, this, function () {
				// var results = this.readDetail(data);
				var model = new sap.ui.model.json.JSONModel();
				data.moreInfo = true;
				data.equiCreate = true;
				data.linkVisible = false;
				model.setData(data);
				this.getView().setModel(model, "ain");
				sap.ui.getCore().setModel(model, "ain");

				this.getView().getModel("AIWEQUI").setProperty("/Herst", data.Manufacturer);
				this.getView().getModel("AIWEQUI").setProperty("/Typbz", data.Name);
				this.readAinDefaultClass(data.Modelid);
				this.getView().byId("equipmentPage").setBusy(false);
			});

		},

		readAinDefaultClass: function (sSelModelId) {
			var model = this.getView().getModel("ainModel");
			var g = this;
			var aFilter = [];
			if (sSelModelId) {
				aFilter.push(new sap.ui.model.Filter("ClassDesc", "EQ", sSelModelId));
			}
			model.read("/ClassEquiSet", {
				filters: aFilter,
				urlParameters: {
					"$expand": "EqValua"
				},
				success: function (r) {
					var data = r;
					var classList = data.results[0];
					// if (classList) {
					// 	if (classList.length > 0) {
					// 		for (var i = 0; i < classList.length; i++) {
					classList.ctEnable = false;
					classList.classEnable = false;
					classList.ClassTypeDesc = classList.Artxt;
					delete classList.Artxt;
					delete classList.Changerequestid;
					delete classList.Clint;
					delete classList.Desc_class;

					var cModel = new sap.ui.model.json.JSONModel();
					cModel.setData([classList]);
					g.class.setModel(cModel);
					// g.getView().byId("newChar").setEnabled(true);
					// }
					// }

					var charList = data.results[0].EqValua.results;
					if (charList) {
						if (charList.length > 0) {
							for (var j = 0; j < charList.length; j++) {
								charList[j].cNameEnable = false;
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
								charList[j].slNo = j + 1; // ()
								charList[j].flag = charList[j].Class + "-" + charList[j].slNo; // ()

							}

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

							var _cModel = new sap.ui.model.json.JSONModel();
							_cModel.setData(charList);
							g.char.setModel(_cModel);
							g.chData = charList; // ()
						}
					}
				},
				error: function (err) {

				}

			});
		},

		onSearch: function (event) {
			var model = "";
			var manf = "";
			Utilities.onSearch(model, manf, "main", this);
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

			if (aData.SuperordinateEquip !== "") {
				oDoiElement.flocVisible = false;
				oDoiElement.equiVisible = true;
			} else if (aData.SuperordinateEquip === "" && aData.Tplnr !== "") {
				oDoiElement.flocVisible = true;
				oDoiElement.equiVisible = false;
			}

			var oSource = oEvent.getSource(),
				dataOriginInput,
				dataOrgFlocInp = this.dataOriginFrag.getContent()[0].getContent()[1],
				dataOrgFlocCheck = this.dataOriginFrag.getContent()[0].getContent()[2],
				dataOrgEquiInp = this.dataOriginFrag.getContent()[0].getContent()[4],
				dataOrgEquiCheck = this.dataOriginFrag.getContent()[0].getContent()[5],
				dataOrgIndvInp = this.dataOriginFrag.getContent()[0].getContent()[7],
				dataOrgIndvCheck = this.dataOriginFrag.getContent()[0].getContent()[8];

			dataOrgFlocCheck.setText("Functional Location");

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

				oDoiElement.parent = aDOIdata[5].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[5].Txtmi;
				oDoiElement.DOIindex = 5;
				if (aDOIdata[5].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[5].instLoc === true) {
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

				oDoiElement.parent = aDOIdata[7].SupFlVal;
				oDoiElement.parentDesc = aDOIdata[7].Txtmi;
				oDoiElement.DOIindex = 7;
				if (aDOIdata[7].maintenance === true) {
					oDoiElement.parentSelected = false;
					oDoiElement.IndvSelected = true;
				} else if (aDOIdata[7].instLoc === true) {
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
			if (oDoiElement.DOIindex === 5) { //Cost Center
				aData.Kostl = sValue;
				aData.Kokrs = sDesc;
				aData.Mctxt = sDesc2;
			}
			if (oDoiElement.DOIindex === 6) { // Planning Plant
				aData.Werks = sValue;
				aData.Planningplantdes = sDesc;
			}
			if (oDoiElement.DOIindex === 7) { // Planner Group
				aData.Ingrp = sValue;
				aData.Innam = sDesc;
			}
			if (oDoiElement.DOIindex === 8) { // Main Work Center
				aData.MainArbpl = sValue;
				aData.MainKtext = sDesc;
				aData.MainWerks = sDesc2;
			}

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

		////////////////////////////////// DFPS ////////////////////////////////////////
		onTailNoVH: function (oEvent) {
			ValueHelpRequest.TailNoVH(oEvent, this);
		},

		onTailNoChange: function (oEvent) {
			ValueHelpRequest.TailNoChange(oEvent, this);
		},

		onDFPSSiteVH: function (oEvent) {
			ValueHelpRequest.DFPSSiteVH(oEvent, this);
		},

		onDFPSSiteChange: function (oEvent) {
			ValueHelpRequest.DFPSSiteChange(oEvent, this);
		},

		onDFPSAreaVH: function (oEvent) {
			ValueHelpRequest.DFPSAreaVH(oEvent, this);
		},

		onDFPSAreaChange: function (oEvent) {
			ValueHelpRequest.DFPSAreaChange(oEvent, this);
		},

		onDFPSSiteProVH: function (oEvent) {
			ValueHelpRequest.DFPSSiteProVH(oEvent, this);
		},

		onDFPSSiteProChange: function (oEvent) {
			ValueHelpRequest.DFPSSiteProChange(oEvent, this);
		},

		onDFPSAreaProVH: function (oEvent) {
			ValueHelpRequest.DFPSAreaProVH(oEvent, this);
		},

		onDFPSAreaProChange: function (oEvent) {
			ValueHelpRequest.DFPSAreaProChange(oEvent, this);
		},

		onModelIdWsVH: function (oEvent) {
			ValueHelpRequest.ModelIdWsVH(oEvent, this);
		},

		onModelIdWsChange: function (oEvent) {
			ValueHelpRequest.ModelIdWsChange(oEvent, this);
		},

		deriveDFPSdata: function () {
			var g = this;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var oModel = g.getView().getModel();
			var q = "/EqDFPSSet";

			var aFilter = [new sap.ui.model.Filter("Equi", "EQ", oJsonData.Equnr),
				new sap.ui.model.Filter("Eqtyp", "EQ", oJsonData.EquipmentCatogory),
				new sap.ui.model.Filter("SiteId", "EQ", oJsonData.dfps.Site),
				new sap.ui.model.Filter("ModelId", "EQ", oJsonData.dfps.ModelId),
				new sap.ui.model.Filter("MatEqu", "EQ", '')
			];
			g.BusyDialog.open();
			oModel.read(q, {
				filters: aFilter,
				success: function (r) {
					g.BusyDialog.close();
					if (r.results.length > 0) {
						oJsonData.dfps.Area = r.results[0].Topsiteid;
						oJsonData.dfps.AreaDesc = r.results[0].Topsitede;
						oJsonData.dfps.AreaPrfl = r.results[0].AreaPro;
						oJsonData.dfps.SitePrfl = r.results[0].SitePro;
						oJsonData.dfps.MPO = r.results[0].MpoId;
						oJsonData.dfps.MPODesc = r.results[0].MpoDescr;
						oJsonData.dfps.RIC = r.results[0].RicId;
						oJsonData.dfps.RICDesc = r.results[0].RicDescr;
						oJsonData.dfps.ModelId = r.results[0].ModelId;
						oJsonData.dfps.ModelIdDesc = r.results[0].ModelDes;
						oJsonData.dfps.ForeignEq = formatter.XtoTrue(r.results[0].Foreignob);
						oJsonData.dfps.TechSts = r.results[0].TecState;
						oJsonData.dfps.OperSts = r.results[0].DepState;
						oJsonData.dfps.Remark = r.results[0].DfpsRmrk;
						oJsonModel.setData(oJsonData);
					}
				},
				error: function (err) {}
			});

		},

		onOperStatusEditpress: function () {
			if (!this.oprStsFrag) {
				this.oprStsFrag = sap.ui.xmlfragment("ugiaiwui.mdg.aiw.request.Fragments.EQUI.OperStatus", this);
				// this.getView().addDependent(this.oprStsFrag);
			}

			var g = this;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var sOprSts = oJsonData.dfps.OperSts;
			var aOprSts = sOprSts.split(" ");
			var aOprStsWO = aOprSts.slice(1);
			var oTable1ID = g.oprStsFrag.getAggregation("content")[0].getId();
			var oTable2ID = g.oprStsFrag.getAggregation("content")[1].getId();
			var oTable1 = sap.ui.getCore().byId(oTable1ID);
			var oTable2 = sap.ui.getCore().byId(oTable2ID);

			var m = this.getView().getModel("valueHelp2");
			var aFilters = [];

			m.read("/DfpsStatusPop1Set", {
				success: function (r) {
					if (r.results.length > 0) {
						var oModel = new JSONModel();
						oModel.setData(r.results);
						g.oprStsFrag.setModel(oModel, "mStsWitNum");
						g.oprStsFrag.setModel(g.getView().getModel("i18n"), "i18n");

						for (var i in r.results) {
							if (aOprSts[0] === r.results[i].Txt04Dfps) {
								oTable1.setSelectedItem(oTable1.getItems()[i], true /*selected*/ , true /*fire event*/ );
							}
						}
					}
					m.read("/DfpsStatusPop2Set", {
						success: function (r) {
							if (r.results.length > 0) {
								var oModel = new JSONModel();
								oModel.setData(r.results);
								g.oprStsFrag.setModel(oModel, "mStsWitoutNum");

								for (var i in aOprStsWO) {
									for (var j in r.results) {
										if (aOprStsWO[i] === r.results[j].Txt04Dfps) {
											oTable2.setSelectedItem(oTable2.getItems()[j], true /*selected*/ , true /*fire event*/ );
										}
									}
								}
								g.oprStsFrag.open();
							}
						},
						error: function (err) {}
					});
				},
				error: function (err) {}
			});
		},

		onOperStatusEditOKpress: function () {
			var g = this;
			var oJsonModel = g.getView().getModel(g.oModelName);
			var oJsonData = oJsonModel.getData();
			var oTable1ID = g.oprStsFrag.getAggregation("content")[0].getId();
			var oTable2ID = g.oprStsFrag.getAggregation("content")[1].getId();
			var oTable1 = sap.ui.getCore().byId(oTable1ID);
			var oTable2 = sap.ui.getCore().byId(oTable2ID);

			var mStsWitNum = g.oprStsFrag.getModel("mStsWitNum");
			var mStsWitoutNum = g.oprStsFrag.getModel("mStsWitoutNum");

			var sStsWPath = oTable1.getSelectedItem().getBindingContext("mStsWitNum").getPath();
			var sOprSts = mStsWitNum.getProperty(sStsWPath).Txt04Dfps;

			for (var i in oTable2.getSelectedItems()) {
				var temp = oTable2.getSelectedItems()[i];
				var sStsWOPath = temp.getBindingContext("mStsWitoutNum").getPath();
				sOprSts = sOprSts + " " + temp.getBindingContext("mStsWitoutNum").getProperty(sStsWOPath).Txt04Dfps;
			}

			oJsonData.dfps.OperSts = sOprSts;
			oJsonModel.setData(oJsonData);
			this.oprStsFrag.close();
		},

		onOperStatusEditCancelclose: function () {
			this.oprStsFrag.close();
		},

		//////////////////////////////////// IPPE /////////////////////////////
		onIppeAccessRecPress: function () {
			var g = this;
			var eqData = this.getView().getModel(this.oModelName).getData();

			if (eqData.ConstrType === "" || eqData.ConstrTypeVS === "Error") {
				return;
			}

			var settings = {
				title: g.getView().getModel("i18n").getProperty("IPPE_SELECTION"),
				noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
				columns: [new sap.m.Column({
						header: [
							new sap.m.Text({
								text: "{i18n>MAT}"
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
								text: "{i18n>USAGE}"
							})
						]
					}),
					new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "{i18n>desc}"
							})
						]
					})
				],
				items: {
					path: "/IppeSelectionSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Matnr}"
							}),
							new sap.m.Text({
								text: "{Plant}"
							}),
							new sap.m.Text({
								text: "{Usage}"
							}),
							new sap.m.Text({
								text: "{Description}"
							})
						]
					})
				},
				confirm: function (E) {
					var selPath = E.getParameter("selectedItem").getBindingContext().getPath();
					var selGuid = E.getParameter("selectedItem").getBindingContext().getModel().getProperty(selPath).Ppeguid;
					g.getIPPEConfig(selGuid);
				}
			};
			var sPath = "/IppeSelectionSet";
			var oFilters = [new sap.ui.model.Filter("Kmatn", "EQ", ""),
				new sap.ui.model.Filter("MatEqu", "EQ", ""),
				new sap.ui.model.Filter("SubmEeqz", "EQ", eqData.ConstrType)
			];
			var oModel = g.getView().getModel();
			var cells = [
				new sap.m.Text({
					text: "{Matnr}"
				}),
				new sap.m.Text({
					text: "{Plant}"
				}),
				new sap.m.Text({
					text: "{Usage}"
				}),
				new sap.m.Text({
					text: "{Description}"
				})
			];

			var stWSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Matnr", "Plant");
			stWSelectDialog.open();
			stWSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		},

		getIPPEConfig: function (sGuid) {
			var g = this;
			if (sGuid) {
				var mEqpmnt = this.getView().getModel(this.oModelName);
				var aEqpmnt = mEqpmnt.getData();
				var oModel = this.getView().getModel();
				var oFilter = [new sap.ui.model.Filter("Ppeguid", "EQ", sGuid)];
				oModel.read("/IppeAccessSet", {
					filters: oFilter,
					success: function (r) {
						if (r.results && r.results.length > 0) {
							var oIppeConfig = r.results[0];
							aEqpmnt.AcsnodeIppe = oIppeConfig.Pname;
							aEqpmnt.DescIppe = oIppeConfig.Pntext;
							aEqpmnt.VariantIppe = oIppeConfig.Pvname;
							aEqpmnt.AltIppe = oIppeConfig.Altnum;
							aEqpmnt.Ppeguid = oIppeConfig.Ppeguid;
							mEqpmnt.setData(aEqpmnt);
							mEqpmnt.refresh();
						}
					},
					error: function (err) {}
				});
			}
		},

		onIppeDeletePress: function () {
			var g = this;
			var mEqpmnt = this.getView().getModel(this.oModelName);
			var aEqpmnt = mEqpmnt.getData();

			if (aEqpmnt.Ppeguid === "") {
				return;
			}

			aEqpmnt.AcsnodeIppe = "";
			aEqpmnt.DescIppe = "";
			aEqpmnt.VariantIppe = "";
			aEqpmnt.AltIppe = "";
			aEqpmnt.Ppeguid = "";
			mEqpmnt.setData(aEqpmnt);
			mEqpmnt.refresh();
		},

		handleLinearCharRowAdd: function () {
			this.addLinearChar(this.oModelName);
		},

		handleLinearCharRowDelete: function (oEvent) {
			this.deleteLinearChar(oEvent, this.oModelName);
		},

		// /**
		//  * Triggered on press event of Area/Site Button
		//  * On Selection, the DFPSAreaSite Fragment is opened to fill in the site/area details.
		//  * @function
		//  * @public
		//  * @param {sap.ui.base.Event} oEvent Button Press event
		//  */

		onCreateAssignSiteAreaPress: function (oEvent) {
			var currentData = this.getView().getModel(this.oModelName).getData();
			var oDFPS = currentData.dfps;
			// var tailId = this.getView().byId("tailNo").getValue();
			if (oDFPS.Tailno === "") {
				var msg = this.getView().getModel("i18n").getProperty("MANDMSG");
				this.invokeMessage(msg);
				oDFPS.TailnoVS = "Error";
				this.getView().getModel(this.oModelName).refresh();
				return;
			}
			if (!this.dfpsSiteArea) {
				this.dfpsSiteArea = sap.ui.xmlfragment(
					"ugiaiwui.mdg.aiw.request.Fragments.EQUI.DFPSAreaSite", this
				);
				this.getView().addDependent(this.dfpsSiteArea);
			}
			// var model = new JSONModel(currentData); //this.getView().getModel("dfpsModel");
			// this.dfpsSiteArea.setModel(model, "dfpsModel");
			this.dfpsSiteArea.open();
		},

		/**
		 * Triggered on press event of OK Button in DFPSAreaSite Fragment
		 * On Selection, the fragment is closed and pass the data entered in the form to Main view
		 * @function
		 * @public
		 * @param {sap.ui.base.Event} oEvent Button Press event
		 */
		onCloseSiteArea: function () {
			this.dfpsSiteArea.close();
			// var oDFPS = this.dfpsSiteArea.getModel("dfpsModel").getData();
			// var currentData = this.getView().getModel(this.oModelName).getData();
			// currentData.dfps = oDFPS;
			this.getView().getModel(this.oModelName).refesh();
		},

		/**
		 * Triggered on press event of Clear Button in DFPSAreaSite Fragment
		 * On Selection, the fragment is closed and clears the data entered in the form 
		 * @function
		 * @public
		 * @param {sap.ui.base.Event} oEvent Button Press event
		 */

		onClearSiteArea: function () {
			// var oModelData = [];
			// var dfpsModel = new sap.ui.model.json.JSONModel();
			// dfpsModel.setData(oModelData);
			// this.getView().setModel(dfpsModel, "dfpsModel");
		},

		/**
		 * Triggered on press of Create Button in DFPS
		 * @function
		 * @public
		 * @param {sap.ui.base.Event} oEvent Press event
		 */
		onDFPScreate: function (oEvent) {
			var currentData = this.getView().getModel(this.oModelName).getData();
			var oDFPS = currentData.dfps;
			oDFPS.dfpsCrtEnabled = false;
			oDFPS.dfpsDltEnabled = true;
			oDFPS.TailnoReq = true;
			oDFPS.dfpsEnabled = true;
			this.getView().getModel(this.oModelName).refresh();
		},

		/**
		 * Triggered on press of Delete Button in DFPS
		 * @function
		 * @public
		 */
		onDFPSdelete: function () {
			var currentData = this.getView().getModel(this.oModelName).getData();
			var oDFPS = currentData.dfps;
			oDFPS.Tailno = "";
			oDFPS.TailnoVS = "None";
			oDFPS.Area = "";
			oDFPS.AreaDesc = "";
			oDFPS.AreaPrfl = "";
			oDFPS.Site = "";
			oDFPS.SiteDesc = "";
			oDFPS.SiteVS = "None";
			oDFPS.SitePrfl = "";
			oDFPS.MPO = "";
			oDFPS.MPODesc = "";
			oDFPS.RIC = "";
			oDFPS.RICDesc = "";
			oDFPS.ModelId = "";
			oDFPS.ModelIdDesc = "";
			oDFPS.ModelIdVS = "None";
			oDFPS.ForeignEq = false;
			oDFPS.TechSts = "";
			oDFPS.OperSts = "0001";
			oDFPS.Remark = "";
			oDFPS.dfpsCrtEnabled = true;
			oDFPS.dfpsDltEnabled = false;
			oDFPS.dfpsEnabled = false;
			oDFPS.TailnoReq = false;
			this.getView().getModel(this.oModelName).refresh();
		},

		onClassSelect: function (event) {
			var path = event.getParameter("listItem").getBindingContext().getPath();
			path = path.substring(path.lastIndexOf("/") + 1);
			this.classIndex = path;
			var classData = this.class.getModel().getData();
			this.clValue = classData[this.classIndex].Class;
			this._class = classData[this.classIndex].Class; // added
			this.classType = classData[this.classIndex].Classtype;
			var eve = event.getParameter("listItem");
			var z;
			if (event.getSource().getSelectedItems().length === classData.length) {
				for (z = 0; z < classData.length; z++) {
					classData[z].checked = true;
				}
			} else if (event.getSource().getSelectedItems().length === 0) {
				for (z = 0; z < classData.length; z++) {
					classData[z].checked = false;
				}
			} else {
				for (z = 0; z < classData.length; z++) {
					if (eve.getSelected() === true) {
						if (classData[z].Class === classData[this.classIndex].Class) {
							classData[z].checked = true;
						}
					} else {
						if (classData[z].Class === classData[this.classIndex].Class) {
							classData[z].checked = false;
						}
					}
				}
			}
			var charModel = this.char.getModel();
			if (charModel !== undefined && charModel !== null) {
				var charData = charModel.getData();
				if (charData !== null) {
					for (var ch = 0; ch < charData.length; ch++) {
						if (!charData[ch].hasOwnProperty("flag")) {
							charData[ch].flag = this.clValue + "-" + charData[ch].slNo;
						}
					}
				}
				var temp = [];
				if (this.chData === undefined) {
					if (charData !== null) {
						this.chData = charData;
					}

				} else if (this.chData instanceof Array) {
					if (this.chData.length === 0) {
						this.chData = charData;
					}

				} else {
					if (charData !== null && this.chData !== undefined) {
						for (var g = 0; g < charData.length; g++) {
							for (var k = 0; k < this.chData.length; k++) {
								if (this.chData[k].Class !== charData[g].Class) {
									var v = charData;
									temp.push(v[g]);
								}
							}
						}
					}
					if (this.chData !== null && this.chData !== undefined) {
						Array.prototype.push.apply(this.chData, temp);
						var dups = [];
						this.chData = this.chData.filter(function (el) {
							// If it is not a duplicate, return true
							if (dups.indexOf(el.Atnam + el.Atwrt) === -1) {
								dups.push(el.Atnam + el.Atwrt);
								return true;
							}
							return false;
						});

					}
				}

				var singleArr = [];
				for (var h = 0; h < this.chData.length; h++) {
					if (this.chData[h].SingleVal === true) {
						singleArr.push(this.chData[h]);
					}
				}
				var sDup = [];
				var arr = [];
				singleArr = singleArr.filter(function (el) {
					if (sDup.indexOf(el.Atnam) === -1) {
						sDup.push(el.Atnam);
						return true;
					}
					arr.push(el);
					return false;
				});

				var _temp = [];
				if (this.chData !== null && this.chData !== undefined) {
					for (var cls = 0; cls < classData.length; cls++) {
						if (classData[cls].checked === true) {
							for (var j = 0; j < this.chData.length; j++) {
								var str = this.chData[j].flag;
								str = str.split("-");
								if (classData[cls].Class === this.chData[j].Class) {
									_temp.push(this.chData[j]);
								}
							}
						} else {
							for (var j = 0; j < _temp.length; j++) {
								var str = this.chData[j].flag;
								str = str.split("-");
								if (classData[cls].Class === _temp[j].Class) {
									_temp.pop(this.chData[j]);
								}
							}
						}
					}
				}
				// var cdup = [];
				// _temp = _temp.filter(function (el) {
				//  // If it is not a duplicate, return true
				//  if (cdup.indexOf(el.Atnam + el.Atwrt) ===  -1) {
				//   cdup.push(el.Atnam + el.Atwrt);
				//   return true;
				//  }
				//  return false;
				// });

				for (var p = 0; p < _temp.length; p++) {
					var cc = 0;
					for (var k = 0; k < _temp.length; k++) {
						if (_temp[k].Atnam === _temp[p].Atnam) {
							cc++;
						}
					}
					if (cc === 1 && _temp[p].Aterf === "X") {
						_temp[p].charDltEnable = false;
					}
				}

				if (event.getSource().getSelectedItems().length === classData.length) {
					for (var ar = 0; ar < arr.length; ar++) {
						var repeatCount = 0;
						for (var te = 0; te < _temp.length; te++) {
							var str1 = arr[ar].Atnam; // + arr[ar].Atwrt;
							var str2 = _temp[te].Atnam; // + _temp[te].Atwrt;
							if (str1 === str2) {
								if (repeatCount === 0) {
									repeatCount++;
									continue;
								} else {
									_temp.splice(te, 1);
								}
							}
						}
					}
				}

				var cdup = [];
				_temp = _temp.filter(function (el) {
					// If it is not a duplicate, return true
					if (cdup.indexOf(el.Atnam + el.Atwrt) === -1) {
						cdup.push(el.Atnam + el.Atwrt);
						return true;
					}
					return false;
				});

				var oMod = new sap.ui.model.json.JSONModel();
				oMod.setData(_temp);
				this.char.setModel(oMod);

			}
		},

	});
});