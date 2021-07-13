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
	"sap/ui/core/message/Message",
	"sap/m/BusyDialog",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, ValueHelpRequest, ValueHelpProvider, Message,
	BusyDialog, Export, ExportTypeCSV) {
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailMeasuringPoint", {

		formatter: formatter,
		detailFlag: true,
		oAttach: [],
		oFileUpload: "",
		charFlag: "",
		codeFlag: "",
		objSelectDialog: undefined,
		eSelectDialog: undefined,
		fSelectDialog: undefined,
		msTypSelectDialog: undefined,
		cSelectDialog: undefined,
		cgSelectDialog: undefined,
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

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ugiaiwui.mdg.aiw.request.view.Equipment
		 */
		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this.getView()));
			this.getRouter().getRoute("detailMspt").attachPatternMatched(this._onRouteMatched, this);
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
			this.oModelName = "AIWMSPT";

			var classFragmentId = this.getView().createId("clsFrag");
			var itemFragmentId = this.getView().createId("charFrag");
			var lamFragmentId = this.getView().createId("lamFrag");
			this.class = sap.ui.core.Fragment.byId(classFragmentId, "assignmentTab");
			this.char = sap.ui.core.Fragment.byId(itemFragmentId, "characteristicsTab");
			this.lam = sap.ui.core.Fragment.byId(lamFragmentId, "lamSimpleForm");

			var lamAprv = this.getView().createId("lamAprvFrag");
			this.lamAprvSF = sap.ui.core.Fragment.byId(lamAprv, "lamSimpleForm");

			var sObj = {
				titleName: this.getOwnerComponent().getModel("i18n").getProperty("createMsptTitle"),
				visible: false,
				enabled: true
			};
			var sApproveData = {
				createVisible: true,
				approveVisible: false,
				approveVisibleLin : false
			};
			this.getView().setModel(new JSONModel(sObj), "mainView");
			this.getView().setModel(new JSONModel(sApproveData), "ApproveModel");

			// this.obj = this._oComponent.getComponentData().startupParameters.OBJ[0];
			// this.cReqType = this._oComponent.getComponentData().startupParameters.USMD_CREQ_TYPE[0];
			// this._initializeAttachments();
			this.isLam();
			this.getClassType(this);

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

			this.BusyDialog = new BusyDialog();
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
					} else if (mLocalModel.getData().Mptyp === "L" && g.lamSwitch === "X") {
						g.lam.setVisible(true);
						g.lam.setModel(mLocalModel, "AIWLAM");
					} else {
						g.lam.setVisible(false);
					}
				},
				error: function (err) {}
			});
		},

		onInactiveSelect: function (oEvent) {
			var p = oEvent.getSource().getModel(this.oModelName).getData();
			p.Deact = oEvent.getSource().getSelected();
			//this.readStatusProf(p.EquipmentCatogory, this);
		},

		_onRouteMatched: function (oEvent) {
			var g = this;
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "detailMspt") {
				var oAttachModel = sap.ui.getCore().getModel("ClassAttachRequest");
				var oAttachData = oAttachModel.getData();
				if (oAttachData.attachMsptFlag) {
					this.attachRequest();
					oAttachData.attachMsptFlag = false;
					oAttachModel.setData(oAttachData);
				}

				this.rowIndex = decodeURIComponent(oEvent.getParameter("arguments").Path);
				this.viewName = oEvent.getParameter("arguments").ViewName;
				this.oModelUpdateFlag = false;

				var sClassData = [],
					sCharData = [],
					sCharNewButton;
				var sClassNewButton = true;
				var oMainViewModel = this.getView().getModel("mainView");
				var sApproveModel = this.getView().getModel("ApproveModel");
				var oMainViewData = oMainViewModel.getData();
				var sApproveData = sApproveModel.getData();
				var oJsonModel = new JSONModel();
				oMainViewData.enabled = true;
				this.getView().byId("idBtnCheck").setVisible(true);

				if (sap.ui.getCore().getModel("refreshModel") !== undefined) {
					var refreshModel = sap.ui.getCore().getModel("refreshModel");
					refreshModel.setProperty("/refreshSearch", false);
				}

				if (this.viewName === "CreateMspt") {
					oJsonModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex));
					this.oAttach = [];
					this.getView().setModel(oJsonModel, this.oModelName);

					if (oJsonModel.getData().viewParameter === "change") {
						if (oJsonModel.getData().ObtypMs === "" || oJsonModel.getData().ObtypMs === undefined) {
							oJsonModel.getData().ObtypMsEnabled = true;
						} else {
							oJsonModel.getData().ObtypMsEnabled = false;
						}
						if (oJsonModel.getData().Equnr === "" || oJsonModel.getData().Equnr === undefined) {
							oJsonModel.getData().EqunrEnabled = true;
						} else {
							oJsonModel.getData().EqunrEnabled = false;
						}
						if (oJsonModel.getData().Tplnr === "" || oJsonModel.getData().Tplnr === undefined) {
							oJsonModel.getData().TplnrEnabled = true;
						} else {
							oJsonModel.getData().TplnrEnabled = false;
						}
						if (oJsonModel.getData().Tplnr === "" || oJsonModel.getData().Tplnr === undefined) {
							oJsonModel.getData().TplnrEnabled = true;
						} else {
							oJsonModel.getData().TplnrEnabled = false;
						}
						if (oJsonModel.getData().Mptyp === "" || oJsonModel.getData().Mptyp === undefined) {
							oJsonModel.getData().MptypEnabled = true;
						} else {
							oJsonModel.getData().MptypEnabled = false;
						}
						if (oJsonModel.getData().AtnamMs === "" || oJsonModel.getData().AtnamMs === undefined) {
							oJsonModel.getData().AtnamMsEnabled = true;
						} else {
							oJsonModel.getData().AtnamMsEnabled = false;
						}
						oJsonModel.getData().MspointEnabled = false;
						oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("changeMspt");
					} else {
						oJsonModel.getData().MspointEnabled = true;
						oJsonModel.getData().ObtypMsEnabled = true;
						oJsonModel.getData().MptypEnabled = true;
						oJsonModel.getData().AtnamMsEnabled = true;
						oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("createMspt");
					}

					if (oJsonModel.getData().Mptyp === "L" && g.lamSwitch === "X") {
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
					sCharNewButton = oJsonModel.getData().charNewButton;
				}
				if (this.viewName === "ChangeMspt") {
					var sCrStatus = oEvent.getParameter("arguments").CrStatus;
					var sMsPoint = oEvent.getParameter("arguments").Mspt;
					oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("changeMspt");

					if (sCrStatus === "true") {
						sClassNewButton = false;
						sCharNewButton = false;
						oMainViewData.enabled = false;
					}

					this.sExistFlag = false;
					var oMatchItem;
					var oModelData = sap.ui.getCore().getModel(this.oModelName).getData();
					if (oModelData.length > 0) {
						for (var i = 0; i < oModelData.length; i++) {
							if (oModelData[i].Mspoint === sMsPoint) {
								oMatchItem = i;
								this.sExistFlag = true;
								break;
							}
						}
					}

					if (this.sExistFlag) {
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
						sCharNewButton = oModelData[oMatchItem].charNewButton;

						oModelData[oMatchItem].MspointEnabled = false;
						oModelData[oMatchItem].ObtypMsEnabled = false;
						oModelData[oMatchItem].EqunrEnabled = false;
						oModelData[oMatchItem].TplnrEnabled = false;
						oModelData[oMatchItem].MptypEnabled = false;
						oModelData[oMatchItem].AtnamMsEnabled = false;

						this.getView().setModel(new JSONModel(oModelData[oMatchItem]), this.oModelName);

						if (oModelData[oMatchItem].Mptyp === "L" && g.lamSwitch === "X") {
							this.lam.setVisible(true);
						} else {
							this.lam.setVisible(false);
						}
					} else {
						this.readMeasuringPointData(sMsPoint, sCrStatus);
					}
				}
				if (this.viewName === "Approve") {
					this.getView().byId("idBtnCheck").setVisible(false);
					oJsonModel.setData(sap.ui.getCore().getModel(this.oModelName).getProperty(this.rowIndex));
					oJsonModel.getData().MspointEnabled = false;
					oJsonModel.getData().ObtypMsEnabled = false;
					oJsonModel.getData().EqunrEnabled = false;
					oJsonModel.getData().TplnrEnabled = false;
					oJsonModel.getData().MptypEnabled = false;
					oJsonModel.getData().AtnamMsEnabled = false;
					this.getView().setModel(oJsonModel, this.oModelName);

					var AIWAPPROVE = new JSONModel();
					var pApproveData = sap.ui.getCore().getModel("AIWAPPROVE").getProperty("/AIWMSPT" + this.rowIndex);
					AIWAPPROVE.setData(pApproveData);
					this.getView().setModel(AIWAPPROVE, "AIWAPPROVE");

					oMainViewData.titleName = this.getOwnerComponent().getModel("i18n").getProperty("approveMspt");
					oMainViewData.enabled = false;
					sApproveData.createVisible = false;
					sApproveData.approveVisible = true;
					sApproveData.approveVisibleLin = false;

					this.lam.setVisible(sApproveData.createVisible);
					this.lamAprvSF.setModel(oJsonModel, "AIWLAM");
				}

				var classFragmentId = this.getView().createId("clsFrag");
				var newHeaderBtn = sap.ui.core.Fragment.byId(classFragmentId, "newHeader");
				newHeaderBtn.setEnabled(sClassNewButton);
				// var itemFragmentId = this.getView().createId("charFrag");
				// var newCharBtn = sap.ui.core.Fragment.byId(itemFragmentId, "newChar");
				// newCharBtn.setEnabled(sCharNewButton);
				this.class.setModel(new JSONModel(sClassData));
				this.char.setModel(new JSONModel(sCharData));
				this.class.setVisible(sApproveData.createVisible);
				this.char.setVisible(sApproveData.createVisible);
				
				if(this.viewName === "Approve"){
					var lamAprvFragID = this.getView().createId("lamAprvFrag");
					var lamAprvFragPanel = sap.ui.core.Fragment.byId(lamAprvFragID, "idPanelLinDataAprv");
					if(this.lamSwitch === "X"){
						lamAprvFragPanel.setVisible(true);
						sApproveData.approveVisibleLin = true;
					}else{
						lamAprvFragPanel.setVisible(false);
						sApproveData.approveVisibleLin = false;
					}
				}

				oMainViewModel.setData(oMainViewData);
				sApproveModel.setData(sApproveData);
			} else {
				return;
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

			if (sPath.indexOf("/ObtypMs") !== -1) {
				ValueHelpRequest.valueHelpMeasPointObj(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Equnr") !== -1) {
				ValueHelpRequest.valueHelpFunEquipment(oEvent, this);
			} else if (sPath.indexOf("/Tplnr") !== -1) {
				ValueHelpRequest.valueHelpFunFloc(oEvent, this);
			} else if (sPath.indexOf("/Mptyp") !== -1) {
				ValueHelpRequest.valueHelpFunMsptCat(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/AtnamMs") !== -1) {
				ValueHelpRequest.valueHelpFunChar(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Codgr") !== -1) {
				ValueHelpRequest.valueHelpFunCodeGrp(oEvent.getSource().getModel(this.oModelName).getData(), this);
			} else if (sPath.indexOf("/Decim") !== -1) {
				ValueHelpRequest.valueHelpDecimalPlace(oEvent.getSource().getModel(this.oModelName).getData(), this);
			}
		},

		measPointObjChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().ObtypMs;

			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().ObtypMs = "";
				oEvent.getSource().getModel(g.oModelName).getData().Txt = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onMeasPointObjChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().ObtypMs;

			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().ObtypMs = "";
				oEvent.getSource().getModel(g.oModelName).getData().Txt = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().ObtypMs = sValue.toUpperCase();
				ValueHelpRequest._changeMeasPointObject(oEvent.getSource().getModel(g.oModelName).getData(), g);
			}
		},

		measPontCatChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Mptyp;

			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Mptyp = "";
				oEvent.getSource().getModel(g.oModelName).getData().Mpttx = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onmeasPointCatChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Mptyp;

			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Mptyp = "";
				oEvent.getSource().getModel(g.oModelName).getData().Mpttx = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().Mptyp = sValue.toUpperCase();
				ValueHelpRequest._changeMeasPointCategory(oEvent.getSource().getModel(g.oModelName).getData(), g);
			}
		},

		charNameChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().AtnamMs;

			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().AtnamMs = "";
				oEvent.getSource().getModel(g.oModelName).getData().Atbez = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onCharNameChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().AtnamMs;

			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().AtnamMs = "";
				oEvent.getSource().getModel(g.oModelName).getData().Atbez = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().AtnamMs = sValue.toUpperCase();
				ValueHelpRequest._changeCharacteristicName(oEvent.getSource().getModel(g.oModelName).getData(), g);
			}
		},

		onDeciPlaceChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Decim;

			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Decim = "";
				// oEvent.getSource().getModel(g.oModelName).getData().Atbez = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().Decim = sValue.toUpperCase();
				ValueHelpRequest._changeDecimalPlace(oEvent.getSource().getModel(g.oModelName).getData(), g);
			}

		},

		codeGrpChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Codgr;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Codgr = "";
				oEvent.getSource().getModel(g.oModelName).getData().Codgrtxt = "";
			}
			oEvent.getSource().setValueState("None");
		},

		onCodeGrpChange: function (oEvent) {
			var g = this;
			var sValue = oEvent.getSource().getModel(g.oModelName).getData().Codgr;
			if (sValue === "" || sValue === undefined) {
				oEvent.getSource().getModel(g.oModelName).getData().Codgr = "";
				oEvent.getSource().getModel(g.oModelName).getData().CodgrVS = "None";
				oEvent.getSource().getModel(g.oModelName).getData().CodgrVST = "";
				oEvent.getSource().getModel(g.oModelName).getData().Codgrtxt = "";
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().Codgr = sValue.toUpperCase();
				ValueHelpRequest._changeCodeGroup(oEvent.getSource().getModel(g.oModelName).getData(), g);
			}
		},

		onValCodeSelect: function (oEvent) {
			var g = this;
			var select = oEvent.getParameters().selected;
			oEvent.getSource().getModel(g.oModelName).getData().AtnamMsVS = "None";
			oEvent.getSource().getModel(g.oModelName).getData().CodgrVS = "None";
			if (select) {
				oEvent.getSource().getModel(g.oModelName).getData().Cdsuf = true;
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().Cdsuf = false;
			}
		},

		onCounterSelect: function (oEvent) {
			var g = this;
			var select = oEvent.getParameters().selected;
			oEvent.getSource().getModel(g.oModelName).getData().AtnamMsVS = "None";
			oEvent.getSource().getModel(g.oModelName).getData().CodgrVS = "None";
			oEvent.getSource().getModel(g.oModelName).getData().Desir = "";
			oEvent.getSource().getModel(g.oModelName).getData().Cjumc = "";
			oEvent.getSource().getModel(g.oModelName).getData().Pyeac = "";
			if (select) {
				oEvent.getSource().getModel(g.oModelName).getData().Indct = true;
				oEvent.getSource().getModel(g.oModelName).getData().countEnable = true;
				oEvent.getSource().getModel(g.oModelName).getData().tEnable = false;
				oEvent.getSource().getModel(g.oModelName).getData().Cdsuf = false;
			} else {
				oEvent.getSource().getModel(g.oModelName).getData().Indct = false;
				oEvent.getSource().getModel(g.oModelName).getData().countEnable = false;
				oEvent.getSource().getModel(g.oModelName).getData().tEnable = true;
			}
		},

		onDonePress: function (oEvent) {
			var g = this;
			g.doneFlag = true;
			var oBundle = g.getView().getModel("i18n").getResourceBundle();
			var sSourceId = oEvent.getSource().getId();
			if (g.viewName === "CreateMspt" || g.oModelUpdateFlag === true) {
				g.handleValueState("Pttxt", "PttxtVS", oEvent);
				g.handleValueState("ObtypMs", "ObtypMsVS", oEvent);
				g.handleValueState("Mptyp", "MptypVS", oEvent);

				var sEqunrInpVis = oEvent.getSource().getModel(g.oModelName).getData().EqunrInpVis;
				if (sEqunrInpVis) {
					g.handleValueState("Equnr", "EqunrVS", oEvent);
				}
				var sTplnrInpVis = oEvent.getSource().getModel(g.oModelName).getData().TplnrInpVis;
				if (sTplnrInpVis) {
					g.handleValueState("Tplnr", "TplnrVS", oEvent);
				}
				var sDesirVis = oEvent.getSource().getModel(g.oModelName).getData().tEnable;
				if (sDesirVis) {
					// var sDesir = parseInt(oEvent.getSource().getModel(g.oModelName).getData().Desir);
					// var sMrmax = parseInt(oEvent.getSource().getModel(g.oModelName).getData().Mrmax);

					// if (sDesir > sMrmax) {
					// 	g.doneFlag = false;
					// 	g.invokeMessage(oBundle.getText("msptTargetExdMand"));
					// 	return;
					// }
					var sDesirVS = oEvent.getSource().getModel(g.oModelName).getData().DesirVS;
					if (sDesirVS === "Error") {
						g.doneFlag = false;
						g.invokeMessage(oBundle.getText("msptTargetExdMand"));
						return;
					}

				}

				if (g.doneFlag) {
					var msg;
					var sAtnamMs = oEvent.getSource().getModel(g.oModelName).getData().AtnamMs;
					var sCodgr = oEvent.getSource().getModel(g.oModelName).getData().Codgr;

					if (oEvent.getSource().getModel(g.oModelName).getData().Indct === true && (sAtnamMs === "" || sAtnamMs === undefined)) {
						// g.handleValueState("AtnamMs", "AtnamMsVS", oEvent);
						msg = g.getView().getModel("i18n").getProperty("MCOUNTER_CHAR_ERR");
						g.invokeMessage(msg);
						return;
					}
					if (oEvent.getSource().getModel(g.oModelName).getData().Cdsuf === true && (sCodgr === "" || sCodgr === undefined)) {
						// g.handleValueState("Codgr", "CodgrVS", oEvent);
						msg = g.getView().getModel("i18n").getProperty("VCODE_ERR");
						g.invokeMessage(msg);
						return;
					}

					if ((sAtnamMs === "" || sAtnamMs === undefined) && (sCodgr === "" || sCodgr === undefined)) {
						msg = g.getView().getModel("i18n").getProperty("CHAR_CODE_ERR");
						g.invokeMessage(msg);
						return;
					}
				}
			}

			if (g.doneFlag === false) {
				var mandMsg = g.getView().getModel("i18n").getProperty("MANDMSG");
				g.invokeMessage(mandMsg);
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

				if (g.oModelUpdateFlag && !g.sExistFlag) {
					var sJsonModel = sap.ui.getCore().getModel(g.oModelName).getData();
					g.getView().getModel(g.oModelName).getData().viewParameter = "change";
					sJsonModel.push(g.getView().getModel(g.oModelName).getData());
				}
				sap.ui.getCore().getModel(g.oModelName).refresh();
				g.currentFragment = undefined;
				g.rowIndex = undefined;

				var sPreviousHash = History.getInstance().getPreviousHash();
				if (sPreviousHash !== undefined) {
					history.go(-1);
				} else {
					g.getRouter().navTo("main", {}, true);
				}
			}
		},

		validateCheck: function () {
			var g = this;
			var sAIWData = g.getView().getModel(g.oModelName).getData();
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
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

			var sMsPoint = {
				"Point": sAIWData.Mspoint,
				"Equnr": sAIWData.Equnr,
				"Eqktx": sAIWData.Eqktx,
				"Tplnr": sAIWData.Tplnr,
				"Floctxt": sAIWData.Pltxt,
				"Mptyp": sAIWData.Mptyp,
				"Mpttx": sAIWData.Mpttx,
				"Codgr": sAIWData.Codgr,
				"Codgrtxt": sAIWData.Codgrtxt,
				"ObtypMs": sAIWData.ObtypMs,
				"Objtypetxt": sAIWData.Txt,
				"AtnamMs": sAIWData.AtnamMs,
				"Atbez": sAIWData.Atbez,
				"Indct": sAIWData.Indct,
				"Cdsuf": sAIWData.Cdsuf,
				"Cjumc": sAIWData.Cjumc,
				"Desir": sAIWData.Desir,
				"Pyeac": sAIWData.Pyeac,
				"Mrmin": sAIWData.Mrmin,
				"Mrmax": sAIWData.Mrmax,
				"Pttxt": sAIWData.Pttxt,
				"Psort": sAIWData.Psort,
				"Inact": sAIWData.Inact,
				"Mseh6": sAIWData.Mseh6,
				"Msehl": sAIWData.Msehl,
				"Decim": sAIWData.Decim.toString(),
				"Locas": sAIWData.Locas,
				"Maktx": sAIWData.Maktx,
				"Begru": sAIWData.Begru,
				"Begtx": sAIWData.Begtx,
				"Expon": sAIWData.Expon,
				"Mrngu": sAIWData.Mrngu,
				"Dstxt": sAIWData.Dstxt,
				"Indrv": sAIWData.Indrv,
				"Indtr": sAIWData.readTransfSel,
				"Trans": sAIWData.readTransfs,
				// "Inact": sAIWData.Inact
			};
			sPayload.MSPoint.push(sMsPoint);

			if (sAIWData.Mptyp === "L" && sAIWData.lam) {
				var sMSLAM = {
					"Mspoint": sAIWData.Mspoint,
					"Lrpid": sAIWData.lam.Lrpid,
					"Strtptatr": sAIWData.lam.Strtptatr,
					"Endptatr": sAIWData.lam.Endptatr,
					"Length": sAIWData.lam.Length,
					"LinUnit": sAIWData.lam.LinUnit,
					"Startmrkr": sAIWData.lam.Startmrkr,
					"Endmrkr": sAIWData.lam.Endmrkr,
					"Mrkdisst": sAIWData.lam.Mrkdisst,
					"Mrkdisend": sAIWData.lam.Mrkdisend,
					"MrkrUnit": sAIWData.lam.MrkrUnit
				};
				sPayload.MSLAM.push(sMSLAM);
			}

			var sMsClassList = sAIWData.classItems;
			if (sMsClassList) {
				if (sMsClassList.length > 0) {
					for (var h = 0; h < sMsClassList.length; h++) {
						var sMsClass = {
							"Mspoint": sAIWData.Mspoint,
							"Classtype": sMsClassList[h].Classtype,
							"Class": sMsClassList[h].Class,
							"Clstatus1": sMsClassList[h].Clstatus1
						};
						sPayload.MSClass.push(sMsClass);
					}
				}
			}

			var sMsCharList = sAIWData.characteristics;
			if (sMsCharList) {
				if (sMsCharList.length > 0) {
					for (var i = 0; i < sMsCharList.length; i++) {
						var sMsVal = {
							"Mspoint": sAIWData.Mspoint,
							"Atnam": sMsCharList[i].Atnam,
							"Textbez": sMsCharList[i].Textbez,
							"Atwrt": sMsCharList[i].Atwrt,
							"Class": sMsCharList[i].Class
						};
						sPayload.MSVal.push(sMsVal);
					}
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

			this.getView().byId("msptPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("msptPage").setBusy(false);
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
					g.getView().byId("msptPage").setBusy(false);
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

		/*
		 * Function to handle change of Target value
		 */
		onTargetValueChange: function () {
			var g = this;
			var oBundle = g.getView().getModel("i18n").getResourceBundle();
			var mAIWMSPTModel = this.getView().getModel("AIWMSPT");
			var sAIWMSPTData = mAIWMSPTModel.getData();
			if (sAIWMSPTData.Desir !== "" && sAIWMSPTData.Mrmax !== "" && sAIWMSPTData.Mrmin !== "") {
				if (parseInt(sAIWMSPTData.Desir) <= parseInt(sAIWMSPTData.Mrmax) && parseInt(sAIWMSPTData.Desir) >= parseInt(sAIWMSPTData.Mrmin)) {
					sAIWMSPTData.DesirVS = "None";
					sAIWMSPTData.DesirVST = "";
				} else {
					sAIWMSPTData.DesirVS = "Error";
					sAIWMSPTData.DesirVST = oBundle.getText("msptTargetExdMand"); //"Target value exceeds measurement range limit";
				}
			} else if (sAIWMSPTData.Desir !== "" && sAIWMSPTData.Mrmax !== "") {
				if (parseInt(sAIWMSPTData.Desir) <= parseInt(sAIWMSPTData.Mrmax)) {
					sAIWMSPTData.DesirVS = "None";
					sAIWMSPTData.DesirVST = "";
				} else {
					sAIWMSPTData.DesirVS = "Error";
					sAIWMSPTData.DesirVST = oBundle.getText("msptTargetExdMand"); //"Target value exceeds measurement range limit";
				}
			} else if (sAIWMSPTData.Desir !== "" && sAIWMSPTData.Mrmin !== "") {
				if (parseInt(sAIWMSPTData.Desir) >= parseInt(sAIWMSPTData.Mrmin)) {
					sAIWMSPTData.DesirVS = "None";
					sAIWMSPTData.DesirVST = "";
				} else {
					sAIWMSPTData.DesirVS = "Error";
					sAIWMSPTData.DesirVST = oBundle.getText("msptTargetExdMand"); //"Target value exceeds measurement range limit";
				}
			} else {
				sAIWMSPTData.DesirVS = "None";
				sAIWMSPTData.DesirVST = "";
			}
			mAIWMSPTModel.setData(sAIWMSPTData);
			//AIWMSPTModel.refresh();
		},

		/*
		 * Function to handle Read Transfer button press
		 */
		onMeasReadTransPress: function () {
			if (!this.dlgMSPTTransfer) {
				this.dlgMSPTTransfer = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.MeasPointTransfer", this); //ugiaiwui.mdg.aiw.request.Fragments.transfer.MeasPointTransfer
				this.getView().addDependent(this.dlgMSPTTransfer);
			}

			var mAIWMSPTModel = this.getView().getModel("AIWMSPT");
			var oAIWMSPTData = mAIWMSPTModel.getData();

			sap.ui.getCore().byId("lowerRange").setText(oAIWMSPTData.Mrmin);
			sap.ui.getCore().byId("upperRange").setText(oAIWMSPTData.Mrmax);
			sap.ui.getCore().byId("measRangeLimit").setText(oAIWMSPTData.Mseh6);
			sap.ui.getCore().byId("transSuppl").setSelected(false);
			sap.ui.getCore().byId("readingTrans").setText();
			sap.ui.getCore().byId("validFrom").setText();
			sap.ui.getCore().byId("timeMain").setText("00:00:00");
			sap.ui.getCore().byId("measPosition").setText();
			sap.ui.getCore().byId("mpDesc").setText();
			sap.ui.getCore().byId("RTfloc").setText();
			sap.ui.getCore().byId("RTflocdesc").setText();
			sap.ui.getCore().byId("RTequi").setText();
			sap.ui.getCore().byId("RTequidesc").setText();

			if (oAIWMSPTData.readTransfSel) {
				sap.ui.getCore().byId("transSuppl").setSelected(true);
			}
			if (oAIWMSPTData.RT) {
				if (oAIWMSPTData.RT.readTransf) {
					sap.ui.getCore().byId("readingTrans").setText(oAIWMSPTData.RT.readTransf);
				}
				if (oAIWMSPTData.RT.RTValidFrom) {
					sap.ui.getCore().byId("validFrom").setText(oAIWMSPTData.RT.RTValidFrom);
				}
				if (oAIWMSPTData.RT.RTTime) {
					sap.ui.getCore().byId("timeMain").setText(oAIWMSPTData.RT.RTTime);
				}
				if (oAIWMSPTData.RT.RTMeasPos) {
					sap.ui.getCore().byId("measPosition").setText(oAIWMSPTData.RT.RTMeasPos);
				}
				if (oAIWMSPTData.RT.RTMpDesc) {
					sap.ui.getCore().byId("mpDesc").setText(oAIWMSPTData.RT.RTMpDesc);
				}
				if (oAIWMSPTData.RT.RTFloc) {
					sap.ui.getCore().byId("RTfloc").setText(oAIWMSPTData.RT.RTFloc);
				}
				if (oAIWMSPTData.RT.RTFlocDesc) {
					sap.ui.getCore().byId("RTflocdesc").setText(oAIWMSPTData.RT.RTFlocDesc);
				}
				if (oAIWMSPTData.RT.RTEqui) {
					sap.ui.getCore().byId("RTequi").setText(oAIWMSPTData.RT.RTEqui);
				}
				if (oAIWMSPTData.RT.RTEquiDesc) {
					sap.ui.getCore().byId("RTequidesc").setText(oAIWMSPTData.RT.RTEquiDesc);
				}
			}

			if (sap.ui.getCore().byId("RTfloc").getText() === "" && sap.ui.getCore().byId("RTequi").getText() !== "") {
				sap.ui.getCore().byId("RTequi").setVisible(true);
				sap.ui.getCore().byId("RTequidesc").setVisible(true);
				sap.ui.getCore().byId("RTfloc").setVisible(false);
				sap.ui.getCore().byId("RTflocdesc").setVisible(false);
			} else {
				sap.ui.getCore().byId("RTequi").setVisible(false);
				sap.ui.getCore().byId("RTequidesc").setVisible(false);
				sap.ui.getCore().byId("RTfloc").setVisible(true);
				sap.ui.getCore().byId("RTflocdesc").setVisible(true);
			}

			this.dlgMSPTTransfer.open();
		},

		onTransferOKPress: function () {
			var mAIWMSPTModel = this.getView().getModel("AIWMSPT");
			var oAIWMSPTData = mAIWMSPTModel.getData();

			oAIWMSPTData.readTransfSel = true;
			oAIWMSPTData.readTransf = sap.ui.getCore().byId("readingTrans").getText();
			oAIWMSPTData.RT = {};
			oAIWMSPTData.RT.readTransf = sap.ui.getCore().byId("readingTrans").getText();
			oAIWMSPTData.RT.RTValidFrom = sap.ui.getCore().byId("validFrom").getText();
			oAIWMSPTData.RT.RTTime = sap.ui.getCore().byId("timeMain").getText();
			oAIWMSPTData.RT.RTMeasPos = sap.ui.getCore().byId("measPosition").getText();
			oAIWMSPTData.RT.RTMpDesc = sap.ui.getCore().byId("mpDesc").getText();
			oAIWMSPTData.RT.RTFloc = sap.ui.getCore().byId("RTfloc").getText();
			oAIWMSPTData.RT.RTFlocDesc = sap.ui.getCore().byId("RTflocdesc").getText();
			oAIWMSPTData.RT.RTEqui = sap.ui.getCore().byId("RTequi").getText();
			oAIWMSPTData.RT.RTEquiDesc = sap.ui.getCore().byId("RTequidesc").getText();
			mAIWMSPTModel.setData(oAIWMSPTData);

			this.dlgMSPTTransfer.close();
		},

		onTransferCancelPress: function () {
			this.dlgMSPTTransfer.close();
		},

		/*
		 * Function to handle MSPT Transfer segment button press
		 * @param oEvent
		 */
		onTransferChange: function (oEvent) {
			// var sKey = oEvent.getSource().getSelectedKey();
			var sKey = oEvent.getSource().getKey();
			oEvent.getSource().getParent().setSelectedKey(sKey);

			switch (sKey) {
			case "structure": //"STR":
				this.onStructurePress();
				break;
			case "History": //"HIS":
				this.onHistoryPress();
				break;
			case "propAssign": //"PA":
				this.onProposeAssignmentPress();
				break;
			case "AssignManual": //"AM":
				this.onAssignManuallyPress();
				break;
			case "cancel": //"CNL":
				this.onCancelTransferPress();
				break;
			}
		},

		/*
		 * Function to handle HISTORY dialog
		 */
		onHistoryPress: function () {
			var g = this;
			if (!this.dlgHistory) {
				this.dlgHistory = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.History", this); //ugiaiwui.mdg.aiw.request.Fragments.transfer.History
				this.getView().addDependent(this.dlgHistory);
			}

			this.readTransferData("HISTORY");
		},

		onHistoryClosePress: function () {
			this.dlgHistory.close();
		},

		readTransferData: function (flag) {
			var g=this;
			var mAIWMSPTModel = this.getView().getModel("AIWMSPT");
			var aAIWMSPTData = mAIWMSPTModel.getData();
			var oModel = this.getView().getModel();
			var sUrl = "/MSPointSet";
			var oPayload = {
				"Equnr": aAIWMSPTData.Equnr, //"10000228",
				"Tplnr": aAIWMSPTData.Tplnr, //"",
				"Mptyp": aAIWMSPTData.Mptyp, //"M",
				"Pttxt": aAIWMSPTData.Pttxt, //"xzcvb",
				"ObtypMs": aAIWMSPTData.ObtypMs, //"IEQ",
				"AtnamMs": aAIWMSPTData.AtnamMs, //"CBTA",
				"Mseh6": aAIWMSPTData.Mseh6, //"%",
				"Decim": aAIWMSPTData.Decim, //"2",
				"Indct": aAIWMSPTData.Indct, //false,
				"Point": aAIWMSPTData.Mspoint, //"1168",
				"Trans": sap.ui.getCore().byId("readingTrans").getText(),
				"Action": flag, // "HISTORY",
				"MspHier_N": [],
				"DataOrigin": [],
				"MSPTAssign": [],
				"History_N": []
			};

			var oTransObj = {
				Trans: sap.ui.getCore().byId("readingTrans").getText(),
				Datlo: formatter._formatDate(sap.ui.getCore().byId("validFrom").getText()),
				Timlo: formatter._timeConvert(sap.ui.getCore().byId("timeMain").getText()),
				Psort: sap.ui.getCore().byId("measPosition").getText(),
				Pttxt: sap.ui.getCore().byId("mpDesc").getText(),
				Tplnr: sap.ui.getCore().byId("RTfloc").getText(),
				Pltxt: sap.ui.getCore().byId("RTflocdesc").getText(),
				Equnr: sap.ui.getCore().byId("RTequi").getText(),
				Eqktx: sap.ui.getCore().byId("RTequidesc").getText()
			};
			oPayload.DataOrigin.push(oTransObj);

			var oBusyDialog = new BusyDialog();
			oBusyDialog.open();
			oModel.create(sUrl, oPayload, {
				success: function (r) {
					oBusyDialog.close();
					if (flag === "HISTORY") {
						var aHisResults = r.History_N.results;

						if(r.Equnr !== ""){
							sap.ui.getCore().byId("measPointObject").setText(r.Equnr);
							sap.ui.getCore().byId("measPointObjectDesc").setText(r.Eqktx);
						}else if(r.Tplnr !== ""){
							sap.ui.getCore().byId("measPointObject").setText(r.Tplnr);
							sap.ui.getCore().byId("measPointObjectDesc").setText(r.Floctxt);
						}
						sap.ui.getCore().byId("mspt").setText(r.Point);
						sap.ui.getCore().byId("msptDesc").setText(r.Pttxt);
						sap.ui.getCore().byId("measPos").setText(r.Psort);
						sap.ui.getCore().byId("delFlag").setText(r.LvormMs);
						sap.ui.getCore().byId("charName").setText(r.AtnamMs);
						sap.ui.getCore().byId("mpInactive").setText(r.Inact);

						var tblHistory = sap.ui.getCore().byId("itemDetails");
						var mHistoryItems = new JSONModel(aHisResults);
						tblHistory.setModel(mHistoryItems);

						if (aHisResults.length > 0) {
							sap.ui.getCore().byId("export").setEnabled(true);
						} else {
							sap.ui.getCore().byId("export").setEnabled(false);
						}

						g.dlgHistory.open();
					}
				},
				error: function (err) {
					oBusyDialog.close();
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

		OnExportPress: sap.m.Table.prototype.exportData || function () {
			var oModel = sap.ui.getCore().byId("itemDetails").getModel();
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					separatorChar: "\t",
					mimeType: "application/vnd.ms-excel",
					charset: "utf-8",
					fileExtension: "xls"
						// fileExtension: "csv",
						// separatorChar: ";"
				}),
				models: oModel,
				rows: {
					path: "/"
				},
				columns: [{
					name: "Valid From",
					template: {
						content: "{path:'Datlo', formatter:'.formatter.dateFormat'}"
					}
				}, {
					name: "Time",
					template: {
						content: "{path:'Timlo', formatter:'.formatter.getTime'}"
					}
				}, {
					name: "Valid To",
					template: {
						content: "{path:'Dathi', formatter:'.formatter.dateFormat'}"
					}
				}, {
					name: "Time",
					template: {
						content: "{path:'Timhi', formatter:'.formatter.getTime'}"
					}
				}, {
					name: "Reversal Indicator",
					template: {
						content: "{Cancl}"
					}
				}, {
					name: "MeasPoint Object",
					template: {
						content: "{Mpobk}"
					}
				}, {
					name: "Description",
					template: {
						content: "{Mpobt}"
					}
				}, {
					name: "Measurment Position",
					template: {
						content: "{Psort}"
					}
				}, {
					name: "Reading Transfer",
					template: {
						content: "{Trans}"
					}
				}, {
					name: "Description",
					template: {
						content: "{Pttxt}"
					}
				}, {
					name: "MeasPoint Inactive",
					template: {
						content: "{Inact}"
					}
				}, {
					name: "Deletion Flag",
					template: {
						content: "{Lvorm}"
					}
				}, {
					name: "Characteristic Name",
					template: {
						content: "{Atnam}"
					}
				}, {
					name: "Created On",
					template: {
						content: "{path:'Datlo', formatter:'.formatter.dateFormat'}"
					}
				}, {
					name: "Created By",
					template: {
						content: "{Namcr}"
					}
				}]
			});
			// console.log(oExport);
			oExport.saveFile().catch(function (oError) {

			}).then(function () {
				oExport.destroy();
			});
		},

		/*
		 * Function to handle ASSIGN MANUALLY dialog
		 */
		onAssignManuallyPress: function () {
			if (!this.dlgAssignManually) {
				this.dlgAssignManually = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.ManualAssign", this);
				this.getView().addDependent(this.dlgAssignManually);
			}
			this.dlgAssignManually.open();

			sap.ui.getCore().byId("msptInp").setValue();

			var sISOCurrentDate = new Date().toISOString();
			var sDefaultFromDate = new Date(sISOCurrentDate.slice(0, 10));
			// var sFromHours = sISOCurrentDate.slice(11,13); //sDefaultFromDate.getHours();
			// var sFromMinutes = sISOCurrentDate.slice(14,16); //sDefaultFromDate.getMinutes();
			// var sFromSeconds = sISOCurrentDate.slice(17,19); //sDefaultFromDate.getSeconds();
			var sDefaultFromTime = sISOCurrentDate.slice(11, 19); //sFromHours.toString() + ":" + sFromMinutes.toString() + ":" + sFromSeconds.toString();
			sap.ui.getCore().byId("validFromManual").setDateValue(sDefaultFromDate);
			sap.ui.getCore().byId("manualFromTime").setValue(sDefaultFromTime);

			var sDefaultToDate = new Date('December 31, 9999 23:59:59');
			var sToHours = sDefaultToDate.getHours();
			var sToMinutes = sDefaultToDate.getMinutes();
			var sToSeconds = sDefaultToDate.getSeconds();
			var sDefaultToTime = sToHours.toString() + ":" + sToMinutes.toString() + ":" + sToSeconds.toString();
			sap.ui.getCore().byId("validToManual").setDateValue(sDefaultToDate);
			sap.ui.getCore().byId("manualToTime").setValue(sDefaultToTime);
		},

		/*
		 * Function to handle 'valueHelpRequest' event of Measuring Pount of Assign Manually Dialog
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMeasPointHelp: function (oEvent) {
			var g = this;
			var oSource = oEvent.getSource();
			var dlgMsPoint = new sap.m.TableSelectDialog({
				title: g.getView().getModel("i18n").getProperty("MEASPOINT_TXT"),
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
								text: "Meas. Position"
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
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "MeasPt Category"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Counter"
							})
						]
					}), new sap.m.Column({
						demandPopin: true,
						minScreenWidth: "Tablet",
						header: [
							new sap.m.Text({
								text: "Functional Location"
							})
						]
					})
				],
				items: {
					path: "/MSPT_FL_VHSet",
					template: new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Point}"
							}),
							new sap.m.Text({
								text: "{Psort}"
							}),
							new sap.m.Text({
								text: "{Pttxt}"
							}),
							new sap.m.Text({
								text: "{Mptyp}"
							}),
							new sap.m.Text({
								text: "{Indct}"
							}),
							new sap.m.Text({
								text: "{Tplnr}"
							})
						]
					})

				},
				confirm: function (E) {
					oSource.setValue(E.getParameter("selectedItem").getCells()[0].getText());
					oSource.setValueState("None");
					g.deriveManualAssignData();
					// p.Mspoint = E.getParameter("selectedItem").getCells()[0].getText();
					// p.MspointVS = "None";
					// p.MspointVST = "";
					// g.getView().getModel(g.oModelName).refresh();

					// if (g._copyFragmentFlag) {
					// 	g._copyFragment.getModel("copyModel").refresh();
					// }
				},
				search: function (E) {
					var sValue = E.getParameter("value");
					if (E.getSource().getBinding("items")) {
						E.getSource().getBinding("items").filter(!sValue ? [] : [
							new sap.ui.model.Filter(
								[
									new sap.ui.model.Filter("Point", sap.ui.model.FilterOperator.Contains, sValue),
									new sap.ui.model.Filter("Pttxt", sap.ui.model.FilterOperator.Contains, sValue)
								],
								false)
						]);
					}

				}
			});

			var sPath = "/MSPT_FL_VHSet";
			var oModel = g.getView().getModel("valueHelp");
			var fnSuccess = function (h) {
				if (h.results.length > 0) {
					var I = new sap.m.ColumnListItem({
						type: "Active",
						unread: false,
						cells: [
							new sap.m.Text({
								text: "{Point}"
							}),
							new sap.m.Text({
								text: "{Psort}"
							}),
							new sap.m.Text({
								text: "{Pttxt}"
							}),
							new sap.m.Text({
								text: "{Mptyp}"
							}),
							new sap.m.Text({
								text: "{Indct}"
							}),
							new sap.m.Text({
								text: "{Tplnr}"
							})
						]
					});
					var e = new sap.ui.model.json.JSONModel();
					e.setData(h);
					dlgMsPoint.setModel(e);
					// dlgMsPoint.setGrowingThreshold(h.results.length);
					dlgMsPoint.bindAggregation("items", "/results", I);
				} else {
					dlgMsPoint.setNoDataText(g.getView().getModel("i18n").getProperty("NO_DATA"));
				}
			};
			var fnError = function () {};
			g._readData(sPath, oModel, fnSuccess, fnError());
			dlgMsPoint.open();
		},

		/*
		 * Function to handle 'change' event of Measuring Pount of Assign Manually Dialog
		 * @public
		 * @param {sap.ui.base.Event} oEvent
		 */
		onMeasPointAMChange: function (oEvent) {
			var g = this;
			var oSource = oEvent.getSource();
			var value = oEvent.getParameters().newValue;
			var c = value.toUpperCase();

			var q = "/MSPT_FL_VHSet";
			var m = this.getView().getModel("valueHelp");
			var aFilters = [new sap.ui.model.Filter("Point", "EQ", c)];
			m.read(q, {
				filters: aFilters,
				success: function (d, e) {
					if (d.results.length > 0) {
						oSource.setValue(d.results[0].Point);
						oSource.setValueState("None");
						g.deriveManualAssignData();
					} else {
						oSource.setValueState("Error");
						sap.ui.getCore().byId("measPosTxt").setText();
						sap.ui.getCore().byId("descPos").setText();
						sap.ui.getCore().byId("funcLoc").setText();
						sap.ui.getCore().byId("funcLocDesc").setText();
					}
				},
				error: function (e) {
					oSource.setValueState("Error");
					var b = JSON.parse(e.response.body);
					var d = b.error.message.value;
					// f.setValueStateText(d);
				}
			});
		},

		/*
		 * Function to Derive Manual Assign Data
		 * @public
		 */
		deriveManualAssignData: function () {
			var g = this;
			var mAIWMSPTModel = this.getView().getModel("AIWMSPT");
			var aAIWMSPTData = mAIWMSPTModel.getData();
			var charName = aAIWMSPTData.AtnamMs;

			var sMSPoint = sap.ui.getCore().byId("msptInp");
			var sDateFrom = sap.ui.getCore().byId("validFromManual");
			var sDateTo = sap.ui.getCore().byId("validToManual");
			var sTimeFrom = sap.ui.getCore().byId("manualFromTime");
			var sTimeTo = sap.ui.getCore().byId("manualToTime");

			var oModel = this.getView().getModel();
			var sUrl = "/AssignMANSet";
			var aFilter = [
				new sap.ui.model.Filter("Point", "EQ", aAIWMSPTData.Mspoint),
				new sap.ui.model.Filter("Trans", "EQ", sMSPoint.getValue()),
				new sap.ui.model.Filter("Atnam", "EQ", charName),
				new sap.ui.model.Filter("Datlo", "EQ", formatter._formatDate(sDateFrom.getDateValue())), //"2014-11-30T00:00:00"
				new sap.ui.model.Filter("Dathi", "EQ", formatter._formatDate(sDateTo.getDateValue())), //"2014-11-30T00:00:00"
				new sap.ui.model.Filter("Timlo", "EQ", formatter._timeConvert(sTimeFrom.getValue())), //"PT13H20M00S"
				new sap.ui.model.Filter("Timhi", "EQ", formatter._timeConvert(sTimeTo.getValue())), //"PT13H20M00S"
				new sap.ui.model.Filter("Indct", "EQ", aAIWMSPTData.Indct),
				new sap.ui.model.Filter("Equnr", "EQ", aAIWMSPTData.Equnr),
				new sap.ui.model.Filter("Tplnr", "EQ", aAIWMSPTData.Tplnr)
			];
			var oBusyDialog = new BusyDialog();
			oBusyDialog.open();
			oModel.read(sUrl, {
				filters: aFilter,
				success: function (r) {
					oBusyDialog.close();
					var oMSPT = r.results[0];
					sap.ui.getCore().byId("measPosTxt").setText(oMSPT.Psort);
					sap.ui.getCore().byId("descPos").setText(oMSPT.Pttxt);
					sap.ui.getCore().byId("funcLoc").setText(oMSPT.Mpobj);
					sap.ui.getCore().byId("funcLocDesc").setText(oMSPT.Mpobt);

					if (oMSPT.Message !== "") {
						sap.m.MessageBox.show(oMSPT.Message, {
							title: "Warning",
							icon: sap.m.MessageBox.Icon.WARNING,
							onClose: function () {}
						});
					}
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
						onClose: function () {
							sap.ui.getCore().byId("msptInp").setValue();
							sap.ui.getCore().byId("measPosTxt").setText();
							sap.ui.getCore().byId("descPos").setText();
							sap.ui.getCore().byId("funcLoc").setText();
							sap.ui.getCore().byId("funcLocDesc").setText();
						}
					});
				}
			});
		},

		/*
		 * Function to handle 'change' event of From Date
		 * @param oEvent
		 * @public
		 */
		onValidFromChange: function (oEvent) {
			var sDate = oEvent.getSource().getDateValue();
			var sHours = sDate.getHours().toString();
			var sMinutes = sDate.getMinutes().toString();
			var sSeconds = sDate.getSeconds().toString();
			var sTime = (sHours.length > 1 ? sHours : "0" + sHours) + ":" + (sMinutes.length > 1 ? sMinutes : "0" + sMinutes) + ":" + (sSeconds
				.length > 1 ? sSeconds : "0" + sSeconds);
			sap.ui.getCore().byId("manualFromTime").setValue(sTime);

			if (sap.ui.getCore().byId("msptInp").getValue() !== "") {
				this.deriveManualAssignData();
			}
		},

		/*
		 * Function to handle 'change' event of To Date
		 * @param oEvent
		 * @public
		 */
		onValidToChange: function (oEvent) {
			var sDate = oEvent.getSource().getDateValue();
			var sHours = sDate.getHours().toString();
			var sMinutes = sDate.getMinutes().toString();
			var sSeconds = sDate.getSeconds().toString();
			var sTime = (sHours.length > 1 ? sHours : "0" + sHours) + ":" + (sMinutes.length > 1 ? sMinutes : "0" + sMinutes) + ":" + (sSeconds
				.length > 1 ? sSeconds : "0" + sSeconds);
			sap.ui.getCore().byId("manualToTime").setValue(sTime);

			if (sap.ui.getCore().byId("msptInp").getValue() !== "") {
				this.deriveManualAssignData();
			}
		},

		onManualOKPress: function () {
			// var mAIWMSPTModel = this.getView().getModel("AIWMSPT");
			// var aAIWMSPTData = mAIWMSPTModel.getData();
			// aAIWMSPTData.readTransfSel = true;
			// aAIWMSPTData.readTransf = sap.ui.getCore().byId("msptInp").getValue();
			// mAIWMSPTModel.setData(aAIWMSPTData);
			var sMSPTTrans = sap.ui.getCore().byId("msptInp").getValue();
			var sFromDate = sap.ui.getCore().byId("validFromManual").getDateValue();
			var sFormatFromDate = formatter.dateFormat(sFromDate);
			var sFromTime = sap.ui.getCore().byId("manualFromTime").getValue();
			var sPos = sap.ui.getCore().byId("measPosTxt").getText();
			var sDesc = sap.ui.getCore().byId("descPos").getText();
			var sFloc = sap.ui.getCore().byId("funcLoc").getText();
			var sFlocDesc = sap.ui.getCore().byId("funcLocDesc").getText();

			sap.ui.getCore().byId("readingTrans").setText(sMSPTTrans);
			sap.ui.getCore().byId("validFrom").setText(sFormatFromDate);
			sap.ui.getCore().byId("timeMain").setText(sFromTime);
			sap.ui.getCore().byId("measPosition").setText(sPos);
			sap.ui.getCore().byId("RTfloc").setText(sFloc);
			sap.ui.getCore().byId("RTflocdesc").setText(sFlocDesc);

			this.dlgAssignManually.close();
		},

		onManualCancelPress: function () {
			this.dlgAssignManually.close();
		},

		/*
		 * Function to handle PROPOSE ASSIGNMENT dialog
		 */
		onProposeAssignmentPress: function () {
			if (!this.dlgRefDateTime) {
				this.dlgRefDateTime = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.ReferenceDateTime", this); //ugiaiwui.mdg.aiw.request.Fragments.transfer
				this.getView().addDependent(this.dlgRefDateTime);
			}

			var sDefaultDate = new Date();
			sap.ui.getCore().byId("refDate").setDateValue(sDefaultDate);
			var sHours = sDefaultDate.getHours();
			var sMinutes = sDefaultDate.getMinutes();
			var sSeconds = sDefaultDate.getSeconds();
			var sDefaultTime = sHours.toString() + ":" + sMinutes.toString() + ":" + sSeconds.toString();
			sap.ui.getCore().byId("refTime").setValue(sDefaultTime);

			this.dlgRefDateTime.open();

			this.transferFlag = "PROP_MSPT";
		},

		onCancelTransferPress: function () {
			var assignedValue = sap.ui.getCore().byId("readingTrans").getText();

			if (assignedValue === "") {
				return;
			}

			if (!this.dlgRefDateTime) {
				this.dlgRefDateTime = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.ReferenceDateTime", this); //ugiaiwui.mdg.aiw.request.Fragments.transfer
				this.getView().addDependent(this.dlgRefDateTime);
			}

			var sDefaultDate = new Date();
			sap.ui.getCore().byId("refDate").setDateValue(sDefaultDate);
			var sHours = sDefaultDate.getHours();
			var sMinutes = sDefaultDate.getMinutes();
			var sSeconds = sDefaultDate.getSeconds();
			var sDefaultTime = sHours.toString() + ":" + sMinutes.toString() + ":" + sSeconds.toString();
			sap.ui.getCore().byId("refTime").setValue(sDefaultTime);

			this.dlgRefDateTime.open();

			this.transferFlag = "CANCEL";
		},

		onCancelOKPress: function () {
			sap.ui.getCore().byId("readingTrans").setText();
			sap.ui.getCore().byId("validFrom").setText();
			sap.ui.getCore().byId("timeMain").setText();
			sap.ui.getCore().byId("measPosition").setText();
			sap.ui.getCore().byId("measPosition").setText();
			sap.ui.getCore().byId("RTfloc").setText();
			sap.ui.getCore().byId("RTflocdesc").setText();

			var mAIWMSPTModel = this.getView().getModel("AIWMSPT");
			var oAIWMSPTData = mAIWMSPTModel.getData();

			oAIWMSPTData.RT.readTransf = "";
			oAIWMSPTData.RT.RTValidFrom = "";
			oAIWMSPTData.RT.RTTime = "";
			oAIWMSPTData.RT.RTMeasPos = "";
			oAIWMSPTData.RT.RTMpDesc = "";
			oAIWMSPTData.RT.RTFloc = "";
			oAIWMSPTData.RT.RTFlocDesc = "";
			oAIWMSPTData.RT.RTEqui = "";
			oAIWMSPTData.RT.RTEquiDesc = "";

			this.dlgCancel.close();
			this.transferFlag = "";
		},

		onCancelCancelPress: function () {
			this.dlgCancel.close();

			this.transferFlag = "";
		},

		/*
		 * Function to handle STRUCTURE dialog
		 */
		onStructurePress: function () {
			if (!this.dlgRefDateTime) {
				this.dlgRefDateTime = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.ReferenceDateTime", this); //ugiaiwui.mdg.aiw.request.Fragments.transfer
				this.getView().addDependent(this.dlgRefDateTime);
			}

			var sDefaultDate = new Date();
			sap.ui.getCore().byId("refDate").setDateValue(sDefaultDate);
			var sHours = sDefaultDate.getHours();
			var sMinutes = sDefaultDate.getMinutes();
			var sSeconds = sDefaultDate.getSeconds();
			var sDefaultTime = sHours.toString() + ":" + sMinutes.toString() + ":" + sSeconds.toString();
			sap.ui.getCore().byId("refTime").setValue(sDefaultTime);

			this.dlgRefDateTime.open();

			this.transferFlag = "STRUCT";
		},

		onRefDateTimeOKPress: function () {
			this.dlgRefDateTime.close();

			if (this.transferFlag === "CANCEL") {
				if (!this.dlgCancel) {
					this.dlgCancel = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.Cancel", this); //ugiaiwui.mdg.aiw.request.Fragments.transfer
					this.getView().addDependent(this.dlgCancel);
				}

				var readTrans = sap.ui.getCore().byId("readingTrans").getText();
				var validFrm = sap.ui.getCore().byId("validFrom").getText();
				var timeMain = sap.ui.getCore().byId("timeMain").getText();
				var measPos = sap.ui.getCore().byId("measPosition").getText();
				var mpDesc = sap.ui.getCore().byId("mpDesc").getText();
				var floc = sap.ui.getCore().byId("RTfloc").getText();
				var flocDesc = sap.ui.getCore().byId("RTflocdesc").getText();
				var equi = sap.ui.getCore().byId("RTequi").getText();
				var equiDesc = sap.ui.getCore().byId("RTequidesc").getText();

				sap.ui.getCore().byId("readTransFr").setText(readTrans);
				sap.ui.getCore().byId("validFromCancel").setText(validFrm);
				sap.ui.getCore().byId("validTimeCancel").setText(timeMain);
				sap.ui.getCore().byId("measPosCancel").setText(measPos);
				sap.ui.getCore().byId("descCancel").setText(mpDesc);
				sap.ui.getCore().byId("flocCancel").setText(floc);
				sap.ui.getCore().byId("flocDescCancel").setText(flocDesc);
				sap.ui.getCore().byId("equiCancel").setText(equi).setVisible(true);
				sap.ui.getCore().byId("equiDescCancel").setText(equiDesc).setVisible(true);

				if (floc === "") {
					sap.ui.getCore().byId("flocCancel").setVisible(false);
					sap.ui.getCore().byId("flocDescCancel").setVisible(false);
				}
				if (equi === "") {
					sap.ui.getCore().byId("equiCancel").setVisible(false);
					sap.ui.getCore().byId("equiDescCancel").setVisible(false);
				}

				var sDefaultToDate = new Date('December 31, 9999 23:59:59');
				var sToHours = sDefaultToDate.getHours();
				var sToMinutes = sDefaultToDate.getMinutes()
				var sToSeconds = sDefaultToDate.getSeconds();
				var sDefaultToTime = sToHours.toString() + ":" + sToMinutes.toString() + ":" + sToSeconds.toString();
				sap.ui.getCore().byId("validToCancel").setText(formatter.dateFormat(sDefaultToDate));
				sap.ui.getCore().byId("validToTimeCancel").setText(sDefaultToTime);

				var sDefaultDate = new Date();
				var sDefaultDate = new Date();
				var sToHours = sDefaultDate.getHours();
				var sToMinutes = sDefaultDate.getMinutes();
				var sToSeconds = sDefaultDate.getSeconds();
				var sDefaultNewTime = sToHours.toString() + ":" + sToMinutes.toString() + ":" + sToSeconds.toString();
				sap.ui.getCore().byId("validToNewCancel").setDateValue(sDefaultDate);
				sap.ui.getCore().byId("validToNewTimeCancel").setValue(sDefaultNewTime);
				// sap.ui.getCore().byId("validToNew").setDateValue(sDefaultDate);

				this.dlgCancel.open();
			}

			if (this.transferFlag === "STRUCT") {
				if (!this.dlgStruct) {
					this.dlgStruct = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.Structure", this); //ugiaiwui.mdg.aiw.request.Fragments.transfer
					this.getView().addDependent(this.dlgStruct);
				}

				this.fetchTableData("STRUCT");
			}

			if (this.transferFlag === "PROP_MSPT") {
				if (!this.dlgPropAssign) {
					this.dlgPropAssign = sap.ui.xmlfragment("ugieamui.mdg.eam.lib.transfer.ProposeAssignment", this); //ugiaiwui.mdg.aiw.request.Fragments.transfer
					this.getView().addDependent(this.dlgPropAssign);
				}

				this.fetchTableData("PROP_MSPT");
			}
		},

		onRefDateTimeCancelPress: function () {
			this.dlgRefDateTime.close();
		},

		onStructClosePress: function () {
			this.dlgStruct.close();
		},

		fetchTableData: function (flag) {
			var g = this;
			var refDate = sap.ui.getCore().byId("refDate");
			var refTime = sap.ui.getCore().byId("refTime");
			var sAIWData = g.getView().getModel(g.oModelName).getData();
			var AIWFLOCModel = sap.ui.getCore().getModel("AIWFLOC").getData();
			var AIWEQUIModel = sap.ui.getCore().getModel("AIWEQUI").getData();
			var AIWMSPTModel = sap.ui.getCore().getModel("AIWMSPT").getData();
			var oCrType = sap.ui.getCore().getModel("tempCrTypeModel").getData();
			var sPayload = {
				"ChangeRequestType": oCrType.crtype,
				"CrDescription": oCrType.desc,
				"Action": flag,
				"Measpoint": sAIWData.Mspoint,
				"Trans": sap.ui.getCore().byId("readingTrans").getText(),
				"Datlo": formatter._formatDate(refDate.getDateValue()),
				"Timlo": formatter._timeConvert(refTime.getValue()),
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
				"OLVal": [],
				"MsptHier_N": [],
				"MsptAssign_N": [],
				"DataOrigin_N": []
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

			if (AIWMSPTModel.length > 0) {
				for (var j = 0; j < AIWMSPTModel.length; j++) {
					var sMsPoint = {
						"Point": AIWMSPTModel[j].Mspoint,
						"Equnr": AIWMSPTModel[j].Equnr,
						"Eqktx": AIWMSPTModel[j].Eqktx,
						"Tplnr": AIWMSPTModel[j].Tplnr,
						"Floctxt": AIWMSPTModel[j].Pltxt,
						"Mptyp": AIWMSPTModel[j].Mptyp,
						"Mpttx": AIWMSPTModel[j].Mpttx,
						"Codgr": AIWMSPTModel[j].Codgr,
						"Codgrtxt": AIWMSPTModel[j].Codgrtxt,
						"ObtypMs": AIWMSPTModel[j].ObtypMs,
						"Objtypetxt": AIWMSPTModel[j].Txt,
						"AtnamMs": AIWMSPTModel[j].AtnamMs,
						"Atbez": AIWMSPTModel[j].Atbez,
						"Indct": AIWMSPTModel[j].Indct,
						"Cdsuf": AIWMSPTModel[j].Cdsuf,
						"Cjumc": AIWMSPTModel[j].Cjumc,
						"Desir": AIWMSPTModel[j].Desir,
						"Pyeac": AIWMSPTModel[j].Pyeac,
						"Mrmin": AIWMSPTModel[j].Mrmin,
						"Mrmax": AIWMSPTModel[j].Mrmax,
						"Pttxt": AIWMSPTModel[j].Pttxt,
						"Psort": AIWMSPTModel[j].Psort,
						"Inact": AIWMSPTModel[j].Inact,
						"Mseh6": AIWMSPTModel[j].Mseh6,
						"Msehl": AIWMSPTModel[j].Msehl,
						"Decim": AIWMSPTModel[j].Decim.toString(), //parseFloat(AIWMSPTModel[j].Decim),
						"Locas": AIWMSPTModel[j].Locas,
						"Maktx": AIWMSPTModel[j].Maktx,
						"Begru": AIWMSPTModel[j].Begru,
						"Begtx": AIWMSPTModel[j].Begtx,
						"Expon": AIWMSPTModel[j].Expon,
						"Mrngu": AIWMSPTModel[j].Mrngu,
						"Dstxt": AIWMSPTModel[j].Dstxt,
						"Indrv": AIWMSPTModel[j].Indrv,
						"Indtr": AIWMSPTModel[j].readTransfSel,
						"Trans": AIWMSPTModel[j].readTransfs,
						// "Inact": AIWMSPTModel[j].Inact
					};
					if (AIWMSPTModel[j].Mspoint === sAIWData.Mspoint) {
						sMsPoint.Trans = sap.ui.getCore().byId("readingTrans").getText();
					}
					sPayload.MSPoint.push(sMsPoint);

					if (AIWMSPTModel[j].Mptyp === "L" && AIWMSPTModel[j].lam) {
						var sMSLAM = {
							"Mspoint": AIWMSPTModel[j].Mspoint,
							"Lrpid": AIWMSPTModel[j].lam.Lrpid,
							"Strtptatr": AIWMSPTModel[j].lam.Strtptatr,
							"Endptatr": AIWMSPTModel[j].lam.Endptatr,
							"Length": AIWMSPTModel[j].lam.Length,
							"LinUnit": AIWMSPTModel[j].lam.LinUnit,
							"Startmrkr": AIWMSPTModel[j].lam.Startmrkr,
							"Endmrkr": AIWMSPTModel[j].lam.Endmrkr,
							"Mrkdisst": AIWMSPTModel[j].lam.Mrkdisst,
							"Mrkdisend": AIWMSPTModel[j].lam.Mrkdisend,
							"MrkrUnit": AIWMSPTModel[j].lam.MrkrUnit
						};
						sPayload.MSLAM.push(sMSLAM);
					}

					var sMsClassList = AIWMSPTModel[j].classItems;
					if (sMsClassList) {
						if (sMsClassList.length > 0) {
							for (var h = 0; h < sMsClassList.length; h++) {
								var sMsClass = {
									"Mspoint": AIWMSPTModel[j].Mspoint,
									"Classtype": sMsClassList[h].Classtype,
									"Class": sMsClassList[h].Class,
									"Clstatus1": sMsClassList[h].Clstatus1
								};
								sPayload.MSClass.push(sMsClass);
							}
						}
					}

					var sMsCharList = AIWMSPTModel[j].characteristics;
					if (sMsCharList) {
						if (sMsCharList.length > 0) {
							for (var i = 0; i < sMsCharList.length; i++) {
								var sMsVal = {
									"Mspoint": AIWMSPTModel[j].Mspoint,
									"Atnam": sMsCharList[i].Atnam,
									"Textbez": sMsCharList[i].Textbez,
									"Atwrt": sMsCharList[i].Atwrt,
									"Class": sMsCharList[i].Class
								};
								sPayload.MSVal.push(sMsVal);
							}
						}
					}
				}
			}

			// var sMsPoint = {
			// 	"Point": sAIWData.Mspoint,
			// 	"Equnr": sAIWData.Equnr,
			// 	"Eqktx": sAIWData.Eqktx,
			// 	"Tplnr": sAIWData.Tplnr,
			// 	"Floctxt": sAIWData.Pltxt,
			// 	"Mptyp": sAIWData.Mptyp,
			// 	"Mpttx": sAIWData.Mpttx,
			// 	"Codgr": sAIWData.Codgr,
			// 	"Codgrtxt": sAIWData.Codgrtxt,
			// 	"ObtypMs": sAIWData.ObtypMs,
			// 	"Objtypetxt": sAIWData.Txt,
			// 	"AtnamMs": sAIWData.AtnamMs,
			// 	"Atbez": sAIWData.Atbez,
			// 	"Indct": sAIWData.Indct,
			// 	"Cdsuf": sAIWData.Cdsuf,
			// 	"Cjumc": sAIWData.Cjumc,
			// 	"Desir": sAIWData.Desir,
			// 	"Pyeac": sAIWData.Pyeac,
			// 	"Mrmin": sAIWData.Mrmin,
			// 	"Mrmax": sAIWData.Mrmax,
			// 	"Pttxt": sAIWData.Pttxt,
			// 	"Psort": sAIWData.Psort,
			// 	"Inact": sAIWData.Inact,
			// 	"Mseh6": sAIWData.Mseh6,
			// 	"Msehl": sAIWData.Msehl,
			// 	"Decim": sAIWData.Decim.toString(),
			// 	"Locas": sAIWData.Locas,
			// 	"Maktx": sAIWData.Maktx,
			// 	"Begru": sAIWData.Begru,
			// 	"Begtx": sAIWData.Begtx,
			// 	"Expon": sAIWData.Expon,
			// 	"Mrngu": sAIWData.Mrngu,
			// 	"Dstxt": sAIWData.Dstxt,
			// 	"Indrv": sAIWData.Indrv
			// 		// "Inact": sAIWData.Inact
			// };
			// sPayload.MSPoint.push(sMsPoint);

			// if (sAIWData.Mptyp === "L" && sAIWData.lam) {
			// 	var sMSLAM = {
			// 		"Mspoint": sAIWData.Mspoint,
			// 		"Lrpid": sAIWData.lam.Lrpid,
			// 		"Strtptatr": sAIWData.lam.Strtptatr,
			// 		"Endptatr": sAIWData.lam.Endptatr,
			// 		"Length": sAIWData.lam.Length,
			// 		"LinUnit": sAIWData.lam.LinUnit,
			// 		"Startmrkr": sAIWData.lam.Startmrkr,
			// 		"Endmrkr": sAIWData.lam.Endmrkr,
			// 		"Mrkdisst": sAIWData.lam.Mrkdisst,
			// 		"Mrkdisend": sAIWData.lam.Mrkdisend,
			// 		"MrkrUnit": sAIWData.lam.MrkrUnit
			// 	};
			// 	sPayload.MSLAM.push(sMSLAM);
			// }

			// var sMsClassList = sAIWData.classItems;
			// if (sMsClassList) {
			// 	if (sMsClassList.length > 0) {
			// 		for (var h = 0; h < sMsClassList.length; h++) {
			// 			var sMsClass = {
			// 				"Mspoint": sAIWData.Mspoint,
			// 				"Classtype": sMsClassList[h].Classtype,
			// 				"Class": sMsClassList[h].Class,
			// 				"Clstatus1": sMsClassList[h].Clstatus1
			// 			};
			// 			sPayload.MSClass.push(sMsClass);
			// 		}
			// 	}
			// }

			// var sMsCharList = sAIWData.characteristics;
			// if (sMsCharList) {
			// 	if (sMsCharList.length > 0) {
			// 		for (var i = 0; i < sMsCharList.length; i++) {
			// 			var sMsVal = {
			// 				"Mspoint": sAIWData.Mspoint,
			// 				"Atnam": sMsCharList[i].Atnam,
			// 				"Textbez": sMsCharList[i].Textbez,
			// 				"Atwrt": sMsCharList[i].Atwrt,
			// 				"Class": sMsCharList[i].Class
			// 			};
			// 			sPayload.MSVal.push(sMsVal);
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

			var oBusyDialog = new BusyDialog();
			oBusyDialog.open();
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					oBusyDialog.close();
					if (flag === "STRUCT") {
						var structResults = r.MsptHier_N.results;
						var aData = g.getTreeTblData(structResults);
						var model = new JSONModel(aData);
						var structTbl = sap.ui.getCore().byId("structure");
						structTbl.setModel(model);
						g.dlgStruct.open();
					}

					if (flag === "PROP_MSPT") {
						var proposeResults = r.MsptAssign_N.results;
						var model = new JSONModel(proposeResults);
						var proposeTbl = sap.ui.getCore().byId("propTab");
						proposeTbl.setModel(model);
						g.dlgPropAssign.open();

						g.propDataOrigin = proposeResults; //r.DataOrigin_N.results;
					}
				},
				error: function (err) {
					oBusyDialog.close();
					g.getView().byId("msptPage").setBusy(false);
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

		onProposeOKPress: function () {
			var proposeTbl = sap.ui.getCore().byId("propTab");
			if (proposeTbl.getSelectedItem()) {
				var selPath = proposeTbl.getSelectedItem().getBindingContext().getPath();
				selPath = selPath.split("/")[1];
				// var selItem = proposeTbl.getSelectedItem().getBindingContext().getModel().getData()[0];

				var selItem = this.propDataOrigin[selPath];

				var sMSPTTrans = selItem.Point;
				var sFormatDate = formatter.dateFormat(selItem.Datlo);
				var sFormattime = formatter.getTime(selItem.Timlo);
				var sPos = selItem.Psort;
				var sMpDesc = selItem.Pttxt;
				var sFloc = selItem.Tplnr;
				var sFlocDesc = selItem.TplnrTxt; //Pttxt;
				var sEqui = selItem.Equnr;
				var sEquiDesc = selItem.EqunrTxt; //Eqktx;

				sap.ui.getCore().byId("readingTrans").setText(sMSPTTrans);
				sap.ui.getCore().byId("validFrom").setText(sFormatDate);
				sap.ui.getCore().byId("timeMain").setText(sFormattime);
				sap.ui.getCore().byId("measPosition").setText(sPos);
				sap.ui.getCore().byId("mpDesc").setText(sMpDesc);
				sap.ui.getCore().byId("RTfloc").setText(sFloc);
				sap.ui.getCore().byId("RTflocdesc").setText(sFlocDesc);
				sap.ui.getCore().byId("RTequi").setText(sEqui);
				sap.ui.getCore().byId("RTequidesc").setText(sEquiDesc);

				if (sEqui === "") {
					sap.ui.getCore().byId("RTequi").setVisible(false);
					sap.ui.getCore().byId("RTequidesc").setVisible(false);
				}
				if (sFloc === "") {
					sap.ui.getCore().byId("RTfloc").setVisible(false);
					sap.ui.getCore().byId("RTflocdesc").setVisible(false);
				}
			}
			this.dlgPropAssign.close();
		},

		onProposeCancelPress: function () {
			this.dlgPropAssign.close();
		}

	});
});