/*global location history */
sap.ui.define([
	"ugiaiwui/mdg/aiw/request/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"ugiaiwui/mdg/aiw/request/model/formatter",
	// "ugiaiwui/mdg/aiw/request/util/common",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageBox",
	"ugiaiwui/mdg/aiw/library/js/ValueHelpProvider",
	"ugiaiwui/mdg/aiw/request/util/ValueHelpRequest",
	"sap/ui/core/message/Message"
], function (BaseController, JSONModel, History, formatter, Filter, FilterOperator, MessageBox, ValueHelpProvider,
	ValueHelpRequest, Message) { //common
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

	return BaseController.extend("ugiaiwui.mdg.aiw.request.controller.DetailObjectNetwork", {
		formatter: formatter,

		onInit: function () {
			this._oView = this.getView();
			this._oComponent = sap.ui.component(sap.ui.core.Component.getOwnerIdFor(this._oView));
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

			this.getRouter().getRoute("ONdetail").attachPatternMatched(this._onRouteMatched, this);

			var FieldsVisible = {
				delflgVisible: false
			};
			var FieldsVisibleModel = new JSONModel(FieldsVisible);
			this.getView().setModel(FieldsVisibleModel, "FieldsVisibleModel");

			var lamFragmentId = this.getView().createId("lamFrag");
			this.lam = sap.ui.core.Fragment.byId(lamFragmentId, "lamSimpleForm");
			this.oModelName = "AIWListONModel";

			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.getView().setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);
		},

		_onRouteMatched: function (oEvent) {
			var sParameter = oEvent.getParameter("name");
			if (sParameter === "ONdetail") {
				var g = this;
				this.currentObj = undefined;
				var AIWListONModel = sap.ui.getCore().getModel("AIWListONModel");
				var AIWListONData = AIWListONModel.getData();
				this.sPath = decodeURIComponent(oEvent.getParameter("arguments").itemPath);
				this.action = oEvent.getParameter("arguments").action;
				this.netId = oEvent.getParameter("arguments").netId;
				this.objType = oEvent.getParameter("arguments").objType;
				this.status = oEvent.getParameter("arguments").status;
				this.mode = oEvent.getParameter("arguments").mode;
				var sObj = {};
				var ONDetailModel = new JSONModel();

				var FieldsVisibleModel = this.getView().getModel("FieldsVisibleModel");
				var FieldsVisibleData = FieldsVisibleModel.getData();

				this.getView().byId("idBtnCheck").setVisible(true);

				if (this.action === "Change") {
					sObj.titleName = this.getView().getModel("i18n").getProperty("ChangeONHeader");
					this.existFlag = false;

					for (var i = 0; i < AIWListONData.length; i++) {
						if (AIWListONData[i].Objnetwrk === this.netId) {
							this.existFlag = true;
							this.currentObj = AIWListONData[i];
							ONDetailModel.setData(this.currentObj);
							this.getView().setModel(ONDetailModel, "ONDetailModel");
							g.attachModelEventHandlers(ONDetailModel);

							if (this.lamSwitch && this.lamSwitch === "X") {
								if (this.currentObj.Objnetwrk !== "" && this.currentObj.NetIDValueState !== "Error") {
									this.currentObj.lam.enableMarker = true;
								}
								this.lam.setVisible(true);
								this.lam.setModel(new JSONModel(this.currentObj), "AIWLAM");
							} else {
								this.lam.setVisible(false);
							}
							break;
						}
					}
					if (!this.existFlag) {
						// this.currentObj = {
						// 	"Objnetwrk": "",
						// 	"Netgrp": "",
						// 	"Netwtyp": "",
						// 	"Netxt": "",
						// 	"Ntobjtyp": "",

						// 	"NetgrpDesc": "",
						// 	"NetwtypDesc": "",
						// 	"NetgrpValueState": "None",
						// 	"NetwtypValueState": "None",

						// 	"NetIDEnable": false, //new
						// 	lam: {
						// 		Lrpid: "",
						// 		LrpidDesc: "",
						// 		Strtptatr: "",
						// 		Endptatr: "",
						// 		Length: "",
						// 		LinUnit: "",
						// 		LinUnitDesc: "",
						// 		Startmrkr: "",
						// 		Endmrkr: "",
						// 		Mrkdisst: "",
						// 		Mrkdisend: "",
						// 		MrkrUnit: "",
						// 		enableLrp: false,
						// 		enableMarker: false,
						// 		LrpidVS: "None",
						// 		StrtptatrVS: "None",
						// 		EndptatrVS: "None",
						// 		LinUnitVS: "None",
						// 		StartmrkrVS: "None",
						// 		EndmrkrVS: "None",
						// 		MrkdisstVS: "None",
						// 		MrkdisendVS: "None",
						// 		MrkrUnitVS: "None"
						// 	}
						// };
						// ONDetailModel.setData(this.currentObj);
						// this.getView().setModel(ONDetailModel, "ONDetailModel");
						this.readNetworkData(this.netId, this.objType, this.status);
					}
					this.oModelUpdateFlag = false;

					if (this.status === "true") {
						this.disableFields();
					} else {
						this.enableFields();
						// this.getView().getModel("mainView").getData().enableLRP = true;
						//this.getView().getModel("mainView").getData().enableNetId = false;
						// this.getView().getModel("mainView").refresh();
					}

					// var tlModel = sap.ui.getCore().getModel("tlModel"); //new code
					// tlModel.setProperty('/refresh', false);

					if (sap.ui.getCore().getModel("refreshModel") !== undefined) {
						var refreshModel = sap.ui.getCore().getModel("refreshModel");
						refreshModel.setProperty("/refreshSearch", false);
					}
				} else {
					// sObj.titleName = this.getView().getModel("i18n").getProperty("CreateONHeader");
					var AIWListONModel = sap.ui.getCore().getModel("AIWListONModel");
					this.currentObj = AIWListONModel.getProperty(this.sPath);
					ONDetailModel.setData(this.currentObj);
					this.getView().setModel(ONDetailModel, "ONDetailModel");
					this.enableFields();

					if (this.currentObj.onType !== undefined && this.currentObj.onType === "Change") {
						sObj.titleName = this.getView().getModel("i18n").getProperty("ChangeONHeader");
					} else {
						sObj.titleName = this.getView().getModel("i18n").getProperty("CreateONHeader");
					}

					//-----------------For Approval starts----------------------
					if (this.mode === "request") {
						FieldsVisibleData.delflgVisible = false;

						if (this.lamSwitch && this.lamSwitch === "X") {
							if (this.currentObj.Objnetwrk !== "" && this.currentObj.NetIDValueState !== "Error") {
								this.currentObj.lam.enableLrp = true;
							}
							this.lam.setVisible(true);
							this.lam.setModel(new JSONModel(this.currentObj), "AIWLAM");
							
							this.getView().byId("networkGrp").setVisible(true);
							this.getView().byId("networkGrpDesc").setVisible(true);
							this.getView().byId("networkTyp").setVisible(true);
							this.getView().byId("networkTypDesc").setVisible(true);
						} else {
							this.lam.setVisible(false);
							this.getView().byId("networkGrp").setVisible(false);
							this.getView().byId("networkGrpDesc").setVisible(false);
							this.getView().byId("networkTyp").setVisible(false);
							this.getView().byId("networkTypDesc").setVisible(false);
						}
					} else {
						this.getView().byId("idBtnCheck").setVisible(false);
						sObj.titleName = this.getView().getModel("i18n").getProperty("ONAppHdr");
						FieldsVisibleData.delflgVisible = true;
						this.disableFields();

						if (this.lamSwitch && this.lamSwitch === "X") {
							this.lam.setVisible(true);
							this.currentObj.lam.enableLrp = false;
							this.currentObj.lam.enableMarker = false;
							this.lam.setModel(new JSONModel(this.currentObj), "AIWLAM");
							
							this.getView().byId("networkGrp").setVisible(true);
							this.getView().byId("networkGrpDesc").setVisible(true);
							this.getView().byId("networkTyp").setVisible(true);
							this.getView().byId("networkTypDesc").setVisible(true);
						} else {
							this.lam.setVisible(false);
							this.lam.setVisible(false);
							this.getView().byId("networkGrp").setVisible(false);
							this.getView().byId("networkGrpDesc").setVisible(false);
							this.getView().byId("networkTyp").setVisible(false);
							this.getView().byId("networkTypDesc").setVisible(false);
						}
					}
					FieldsVisibleModel.setData(FieldsVisibleData);
					//-----------------For Approval ends----------------------
				}

				var oJsonModel = new JSONModel();
				oJsonModel.setData(sObj);
				this.getView().setModel(oJsonModel, "applicationModel");
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
					if (g.lamSwitch === "X" && g.mode === "request") {
						g.lam.setVisible(true);
						g.currentObj.lam.enableLrp = true;
						if (g.currentObj.lam.Lrpid !== "") {
							g.currentObj.lam.enableMarker = true;
						}
						g.lam.setModel(new JSONModel(g.currentObj), "AIWLAM");
					} else {
						g.lam.setVisible(false);
						g.currentObj.lam.enableLrp = false;
						g.currentObj.lam.enableMarker = false;
						g.lam.setModel(new JSONModel(g.currentObj), "AIWLAM");
					}
					
					if (g.lamSwitch === "X"){
						g.getView().byId("networkGrp").setVisible(true);
						g.getView().byId("networkGrpDesc").setVisible(true);
						g.getView().byId("networkTyp").setVisible(true);
						g.getView().byId("networkTypDesc").setVisible(true);
					}else{
						g.getView().byId("networkGrp").setVisible(false);
						g.getView().byId("networkGrpDesc").setVisible(false);
						g.getView().byId("networkTyp").setVisible(false);
						g.getView().byId("networkTypDesc").setVisible(false);
					}
				},
				error: function (err) {}
			});
		},

		onAfterRendering: function () {
			this.isLam();
		},

		onCancel: function () {
			var m = this.getView().getModel('i18n').getProperty("DATA_LOSS");
			var a = this.getView().getModel('i18n').getProperty("WARNING");
			sap.m.MessageBox.show(m, sap.m.MessageBox.Icon.WARNING, a, [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL], function (
				A) {
				if (A === 'OK') {
					window.history.back();
				}
			});
		},

		onObjectChange: function () {
			var oType = this.getView().byId("objType");
			if (oType.getValue() !== "") {
				oType.setValueState("None");

				if (oType.getSelectedKey() === "FL") {
					this.getView().byId("linkFrmEqCol").setVisible(false);
					this.getView().byId("linkToEqCol").setVisible(false);
					this.getView().byId("linkObjEqCol").setVisible(false);
					this.getView().byId("linkObjFlCol").setVisible(true);
					this.getView().byId("linkFrmFlCol").setVisible(true);
					this.getView().byId("linkToFlCol").setVisible(true);

				}
				if (oType.getSelectedKey() === "EQ") {

					this.getView().byId("linkFrmEqCol").setVisible(true);
					this.getView().byId("linkToEqCol").setVisible(true);
					this.getView().byId("linkObjEqCol").setVisible(true);
					this.getView().byId("linkObjFlCol").setVisible(false);
					this.getView().byId("linkFrmFlCol").setVisible(false);
					this.getView().byId("linkToFlCol").setVisible(false);
				}
				var id = this.getView().byId("netId").getValue();
				if (id !== "") {
					this.getView().byId("newLink").setEnabled(true);
				} else {
					this.getView().byId("newLink").setEnabled(false);
				}
			}
		},

		onTextChange: function () {
			var t = this.getView().byId("shortTxt");
			if (t.getValue() !== "") {
				t.setValueState("None");
			}
		},

		getCurrentTime: function () {
			var date = new Date();
			var hh = date.getHours();
			if (hh < 10) {
				hh = "0" + hh;
			}
			var min = date.getMinutes();
			if (min < 10) {
				min = "0" + min;
			}
			var ss = date.getSeconds();
			if (ss < 10) {
				ss = "0" + ss;
			}
			return hh + ":" + min + ":" + ss;
		},

		getCurrentDate: function () {
			var date = new Date();
			var mm = date.getMonth();
			var dd = date.getDate();
			var yyyy = date.getFullYear();
			//if (mm < 10) {
			if (mm < 9) { // modified condition as it was giving incorrect value for october month.
				mm = mm + 1;
				mm = "0" + mm;
			} else {
				mm = mm + 1;
			}
			if (dd < 10) {
				dd = "0" + dd;
			}
			return mm + "/" + dd + "/" + yyyy;
		},

		onLiveChange: function (oEvent) {
			if (oEvent.getSource().getValue() === " ") {
				oEvent.getSource().setValue("");
			}
			oEvent.getSource().setValueState("None");
			oEvent.getSource().setValueStateText("");
		},

		//Change case
		disableFields: function () {
			var g = this;
			var obj = {
				enable: false,
				//enableNetId: false,
				enableLRP: false
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			g.getView().setModel(oModel, "mainView");
			//g.getView().byId("submit").setEnabled(false);
			// var headerObj = this.getView().setModel("ONDetailModel").getData();
			// headerObj.NetIDEnable = false;                
			// this.getView().setModel("ONDetailModel").setData(headerObj);
		},

		enableFields: function () {
			var g = this;
			var obj = {
				enable: true,
				//enableNetId: true,
				enableLRP: false
			};
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(obj);
			g.getView().setModel(oModel, "mainView");
			//g.getView().byId("submit").setEnabled(true);
		},

		readNetworkData: function (n, o, s) {
			var g = this;
			var m = this.getView().getModel();
			var oFilter = [new sap.ui.model.Filter("Objnetwrk", "EQ", n), new sap.ui.model.Filter("Kantyp", "EQ", o)];
			var oExpand = ["ONLAM", "ONText", "ONetwork", "ONWClass", "ONVal", "ONALAM", "ONatevt", "ONattrp", "ONLink", "ONLLAM"];
			var url = "/ChangeRequestSet";
			this.getView().byId("detailPage").setBusy(true);
			m.read(url, {
				filters: oFilter,
				urlParameters: {
					"$expand": oExpand
				},
				success: function (r) {
					g.getView().byId("detailPage").setBusy(false);
					if (r.results.length > 0) {
						g.match = true;
						var d = r.results[0];
						var message = d.Message;
						if (message !== "") {
							g.createMessagePopover(message, "Error");
							// sap.m.MessageToast.show(message, {
							// 	duration: 15000,
							// 	animationDuration: 15000
							// });
						}
						var onObj = {
							"Objnetwrk": "",
							"Netgrp": "",
							"Netwtyp": "",
							"Netxt": "",
							"Ntobjtyp": "",

							"NetgrpDesc": "",
							"NetwtypDesc": "",
							"NetIDValueState": "None",
							"NetIDValueStateText": "",
							"NetgrpValueState": "None",
							"NetwtypValueState": "None",
							"ShrtTxtValueState": "None", //new

							"NetIDEnable": false,

							lam: {
								Lrpid: "",
								LrpidDesc: "",
								Strtptatr: "",
								Endptatr: "",
								Length: 0,
								LinUnit: "",
								LinUnitDesc: "",
								Startmrkr: "",
								Endmrkr: "",
								Mrkdisst: "",
								Mrkdisend: "",
								MrkrUnit: "",
								enableLrp: true,
								enableMarker: true,
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
						var objNetwork = d.ONetwork.results;
						if (objNetwork.length > 0) {
							var obj = objNetwork[0];
							onObj.Objnetwrk = obj.Objnetwrk;
							onObj.Netgrp = obj.Netgrp;
							onObj.NetgroupTxt = obj.NetgroupTxt;
							onObj.Netwtyp = obj.Netwtyp;
							onObj.NettypeTxt = obj.NettypeTxt;
							onObj.Netxt = obj.Netxt;
						}

						var networkLam = d.ONLAM.results;
						if (networkLam.length > 0) {
							onObj.lam.Lrpid = networkLam[0].Lrpid;
							onObj.lam.LrpidDesc = networkLam[0].LrpDescr
							onObj.lam.Objnetwrk = obj.Objnetwrk;
							onObj.lam.Strtptatr = networkLam[0].Strtptatr;
							onObj.lam.Endptatr = networkLam[0].Endptatr;
							onObj.lam.Length = networkLam[0].Length; //parseInt(networkLam[0].Length);
							onObj.lam.LinUnit = networkLam[0].LinUnit;
							onObj.lam.Startmrkr = networkLam[0].Startmrkr;
							onObj.lam.Endmrkr = networkLam[0].Endmrkr;
							onObj.lam.Mrkdisst = networkLam[0].Mrkdisst;
							onObj.lam.Mrkdisend = networkLam[0].Mrkdisend;
							onObj.lam.MrkrUnit = networkLam[0].MrkrUnit;
						}

						if (g.status === "true") {
							onObj.lam.enableLrp = false;
							onObj.lam.enableMarker = false;
						}

						var ONModel = new JSONModel(onObj);
						g.getView().setModel(ONModel, "ONDetailModel");
						g.getView().setModel(ONModel, "AIWLAM");
						// var ONDetailModel = g.getView().getModel("ONDetailModel");
						g.attachModelEventHandlers(ONModel);
					}
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

		clearFields: function () {
			var g = this;
			g.getView().byId("netId").setValueState("None");
			g.getView().byId("shortTxt").setValueState("None");
		},

		onDonePress: function (oEvent) {
			var sSourceId = oEvent.getSource().getId();
			if (this.mode === "request") {
				var g = this;
				var netId = this.getView().byId("netId");
				var netTxt = this.getView().byId("shortTxt");
				// var distSMarker = this.getView().byId("distStartMrkr");
				// var distEMarker = this.getView().byId("distEndMrkr");
				var ONDetailModel = g.getView().getModel("ONDetailModel");
				var ONDetailData = ONDetailModel.getData();

				var lamFragmentId = this.getView().createId("lamFrag");
				var distSMarker = sap.ui.core.Fragment.byId(lamFragmentId, "startMarker");
				var distEMarker = sap.ui.core.Fragment.byId(lamFragmentId, "endMarker");

				if (netId.getValue() === "" || netTxt.getValue() === "" || netId.getValueState() === "Error" || netTxt.getValueState() === "Error") {
					if (netId.getValue() === "" || netId.getValueState() === "Error") {
						ONDetailData.NetIDValueState = "Error";
					}
					if (netTxt.getValue() === "" || netTxt.getValueState() === "Error") {
						//netTxt.setValueState("Error");
						ONDetailData.ShrtTxtValueState = "Error";
					}
					ONDetailModel.setData(ONDetailData);
					var msg = this.getView().getModel("i18n").getProperty("MANDMSG");
					this.createMessagePopover(msg, "Error");
					// MessageBox.show(msg, {
					// 	title: "Error",
					// 	icon: sap.m.MessageBox.Icon.ERROR,
					// 	onClose: function () {}
					// });
					return;
				}

				// if (distSMarker.getValue() !== "") {
				// 	var validSDist = this.onDistStartChange();
				// 	if (!validSDist) {
				// 		return;
				// 	}
				// }
				// if (distEMarker.getValue() !== "") {
				// 	var validEDist = this.onDistEndChange();
				// 	if (!validEDist) {
				// 		return;
				// 	}
				// }

				if (sSourceId.indexOf("idBtnCheck") > -1) {
					this.validateCheck();
					return;
				}

				if (this.action === "Change") {
					if (this.oModelUpdateFlag === true) {
						var AIWListONDta = sap.ui.getCore().getModel("AIWListONModel").getData();
						if (!this.existFlag) {
							var ONDetailModel = g.getView().getModel("ONDetailModel");
							AIWListONDta.push(ONDetailModel.getData());
						}
						sap.ui.getCore().getModel("AIWListONModel").refresh();
					}
					// var tlModel = sap.ui.getCore().getModel("tlModel");
					// tlModel.setProperty('/refresh', false);
				}
				g.clearFields();
			}
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			}
		},

		validateCheck: function () {
			var g = this;
			var sAIWData = g.getView().getModel("ONDetailModel").getData();
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

			var onNetwork = {
				"Objnetwrk": sAIWData.Objnetwrk,
				"Netgrp": sAIWData.Netgrp,
				"Netwtyp": sAIWData.Netwtyp,
				"Netxt": sAIWData.Netxt,
				"Ntobjtyp": sAIWData.Ntobjtyp
			};
			sPayload.ONetwork.push(onNetwork);

			if (sAIWData.lam) {
				var onLAM = {
					"Objnetwrk": sAIWData.Objnetwrk,
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
				sPayload.ONLAM.push(onLAM);
			}

			this.getView().byId("detailPage").setBusy(true);
			var oModel = this.getView().getModel();
			oModel.create("/ChangeRequestSet", sPayload, {
				success: function (r) {
					g.getView().byId("detailPage").setBusy(false);
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
					g.getView().byId("detailPage").setBusy(false);
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

		////////////////// LAM Functions ///////////////////
		aiwNetIdChange: function (oEvent) {
			var g = this;
			var newValue = oEvent.getParameters().newValue;
			var M = this.getView().getModel("valueHelp");
			var a = oEvent.getSource();
			var existFlag = false;
			var sindex = parseInt(this.sPath.split("/")[1]);
			var AIWLAM = g.lam.getModel("AIWLAM");
			var aLam = AIWLAM.getData();

			if (newValue !== "") {
				if (newValue !== undefined) {
					var c = newValue.toUpperCase();
					var AIWListONModel = sap.ui.getCore().getModel("AIWListONModel").getData();
					if (AIWListONModel.length > 0) {
						for (var j = 0; j < AIWListONModel.length; j++) {
							if (j !== sindex) {
								if (AIWListONModel[j].Objnetwrk === newValue) {
									var msg = "Object Network " + newValue + " already locked in this CR";
									a.setValueState("Error");
									existFlag = true;
									this.createMessagePopover(msg, "Error");
									// MessageBox.show(msg, {
									// 	title: "Error",
									// 	icon: sap.m.MessageBox.Icon.ERROR,
									// 	onClose: function () {}
									// });
									break;
								}
							}
						}
					}
					if (!existFlag) {
						var oFilter = [new sap.ui.model.Filter("Netwid", "EQ", c)];
						M.read("/NetidSet", {
							filters: oFilter,
							success: function (r) {
								if (r.results.length > 0) {
									a.setValueState("Error");
									g.createMessagePopover("Object Network " + r.results[0].Netwid + " already exists", "Error");
									// MessageBox.show("Object Network " + r.results[0].Netwid + " already exists", {
									// 	title: "Error",
									// 	icon: sap.m.MessageBox.Icon.ERROR,
									// 	onClose: function () {}
									// });
									a.setValue(r.results[0].Netwid);
									// New Code
									aLam.lam.enableLrp = false;
									AIWLAM.setData(aLam);
									// var mainView = g.getView().getModel("mainView");
									// var mainViewData = mainView.getData();
									// mainViewData.enableLRP = false;
									// mainView.setData(mainViewData);
								} else {
									a.setValue(newValue.toUpperCase());
									a.setValueState("None");
									// New Code
									aLam.lam.enableLrp = true;
									AIWLAM.setData(aLam);
									// if (g.currentObj.Objnetwrk !== "" && g.currentObj.NetIDValueState !== "Error") {
									// 	var mainView = g.getView().getModel("mainView");
									// 	var mainViewData = mainView.getData();
									// 	mainViewData.enableLRP = true;
									// 	mainView.setData(mainViewData);
									// }
								}
							},
							error: function (err) {
								a.setValueState("Error");
								// New Code
								aLam.lam.enableLrp = false;
								AIWLAM.setData(aLam);
								// var mainView = g.getView().getModel("mainView");
								// var mainViewData = mainView.getData();
								// mainViewData.enableLRP = false;
								// mainView.setData(mainViewData);
							}
						});
					}
				}
			}
		},

		onNetWorkGrpVH: function (c) {
			this.networkGrpVH("networkGrp", c);
		},

		networkGrpVH: function (p, c) {
			var g = this;
			var a;
			a = this.getView().byId(p);
			var d = this.getView().byId("networkGrpDesc");

			var settings = {
				title: this.getView().getModel("i18n").getProperty("NET_GRP"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/NetGrpSet",
					template: new sap.m.StandardListItem({
						title: "{Netgrp}",
						description: "{Netgrp_txt}"
					})
				},
				confirm: function (E) {
					a.setValueState("None");
					a.setValueStateText("");
					d.setValue(E.getParameters().selectedItem.getProperty("description"));
					a.setValue(E.getParameters().selectedItem.getProperty("title"));
				}
			};

			var q = "/NetGrpSet";
			var M = this.getView().getModel("valueHelp");
			var nGrpSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "Netgrp", "Netgrp_txt");
			nGrpSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			nGrpSelectDialog.open();
		},

		onNetWorkTypeVH: function (c) {
			this.networkTypeVH("networkTyp", c);
		},

		networkTypeVH: function (p, c) {
			var g = this;
			var a;
			a = this.getView().byId(p);
			var d = this.getView().byId("networkTypDesc");

			var settings = {
				title: this.getView().getModel("i18n").getProperty("NET_TYP"),
				noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
				items: {
					path: "/NetTypSet",
					template: new sap.m.StandardListItem({
						title: "{NETYP}",
						description: "{NETYP_TXT}"
					})
				},
				confirm: function (E) {
					a.setValueState("None");
					a.setValueStateText("");
					d.setValue(E.getParameters().selectedItem.getProperty("description"));
					a.setValue(E.getParameters().selectedItem.getProperty("title"));
				}
			};

			var q = "/NetTypSet";
			var M = this.getView().getModel("valueHelp");
			var nTypSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "NETYP", "NETYP_TXT");
			nTypSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
			nTypSelectDialog.open();
		},

		netGrpChange: function () {
			var a = this.getView().byId("networkGrp");
			if (a.getValue() === "") {
				this.getView().byId("networkGrpDesc").setValue();
			}
			a.setValueState("None");
		},
		onNetGrpChange: function () {
			var t = this.getView().byId("networkGrp");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._networkGroup(t);
		},
		_networkGroup: function (f) {
			var c = f.getValue();
			var cd = this.getView().byId("networkGrpDesc");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var oFilter = [new sap.ui.model.Filter("Netgrp", "EQ", c)];
				var q = "/NetGrpSet";
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							f.setValueState("None");
							cd.setValue(d.results[0].Netgrp_txt);
							f.setValue(a);
						} else {
							f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");
						}
					},
					error: function (e) {
						f.setValueState("Error");
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.setValueStateText(d);
					}
				});
			} else {
				f.setValue(a);
			}
		},

		netTypeChange: function () {
			var a = this.getView().byId("networkTyp");
			if (a.getValue() === "") {
				this.getView().byId("networkTypDesc").setValue();
			}
			a.setValueState("None");
		},
		onNetTypeChange: function () {
			var t = this.getView().byId("networkTyp");
			var c = t.getValue().toUpperCase();
			t.setValue(c);
			this._networkType(t);
		},
		_networkType: function (f) {
			var c = f.getValue();
			var cd = this.getView().byId("networkTypDesc");
			var a = c.replace(/^[ ]+|[ ]+$/g, '');
			if (a !== "") {
				var oFilter = [new sap.ui.model.Filter("NETYP", "EQ", c)];
				var q = "/NetTypSet";
				var m = this.getView().getModel("valueHelp");
				m.read(q, {
					filters: oFilter,
					success: function (d, e) {
						if (d.results.length > 0) {
							f.setValueState("None");
							cd.setValue(d.results[0].NETYP_TXT);
							f.setValue(a);
						} else {
							f.setValueState("Error");
							cd.setValue();
							f.setValueStateText("Invalid Entry");
						}
					},
					error: function (e) {
						f.setValueState("Error");
						var b = JSON.parse(e.response.body);
						var d = b.error.message.value;
						f.setValueStateText(d);
					}
				});
			} else {
				f.setValue(a);
			}
		},

		// onDistStartChange: function () {
		// 	var isValid = false;
		// 	var AIWLAM = g.lam.getModel("AIWLAM");
		// 	var aLam = AIWLAM.getData();
		// 	// var d = this.getView().byId("distStartMrkr").getValue();
		// 	// var sp = this.getView().byId("startPoint");
		// 	var lamFragmentId = this.getView().createId("lamFrag");
		// 	var d = aLam.lam.Mrkdisst;  //sap.ui.core.Fragment.byId(lamFragmentId, "distStartMrkr").getValue();
		// 	//var sp = sap.ui.core.Fragment.byId(lamFragmentId, "startPoint");
		// 	var value = aLam.lam.Strtptatr; //sp.getValue();
		// 	var temp_sp;
		// 	var mUnit = sap.ui.core.Fragment.byId(lamFragmentId, "mrkrDistUnit"); //this.getView().byId("mrkrDistUnit");
		// 	var temp;

		// 	if (this.startPoint !== "" && mUnit.getValue() !== "") {
		// 		if (d !== "") {
		// 			if (this.startPoint.indexOf("+") > -1) {
		// 				temp = this.startPoint.split("+");
		// 				temp_sp = +parseInt(temp[1]);
		// 			} else if (this.startPoint.indexOf("-") > -1) {
		// 				temp = this.startPoint.split("-");
		// 				temp_sp = -parseInt(temp[1]);
		// 			} else {
		// 				temp_sp = parseInt(this.startPoint);
		// 			}
		// 			if (d.indexOf("+") > -1) {
		// 				var s = d.split("+");
		// 				d = +parseInt(s[1]);
		// 			} else if (d.indexOf("-") > -1) {
		// 				var t = d.split("-");
		// 				d = -parseInt(t[1]);
		// 			} else {
		// 				d = parseInt(d);
		// 			}
		// 			if (d === 0) {
		// 				sp.setValue(this.startPoint);
		// 			} else {
		// 				temp_sp = temp_sp + d;
		// 				sp.setValue(temp_sp);
		// 				this.lengthCheck();
		// 			}
		// 			isValid = true;
		// 		}
		// 	} else if (d === "") {
		// 		this.getView().byId("distStartMrkr").setValue(0);
		// 		sp.setValue(this.startPoint);

		// 		isValid = true;
		// 	} else if (value === "" && mUnit.getValue() === "") {
		// 		sp.setValueState("Error");
		// 		mUnit.setValueState("Error");
		// 		var msg = this.getView().getModel("i18n").getProperty("DIST_SM_UNIT_ERR_TXT");
		// 		isValid = false;
		// 		MessageBox.show(msg, {
		// 			title: "Error",
		// 			icon: sap.m.MessageBox.Icon.ERROR,
		// 			onClose: function () {}
		// 		});
		// 	} else if (value === "") {
		// 		sp.setValueState("Error");
		// 		var _msg = this.getView().getModel("i18n").getProperty("DIST_SM_ERR_TXT");
		// 		isValid = false;
		// 		MessageBox.show(_msg, {
		// 			title: "Error",
		// 			icon: sap.m.MessageBox.Icon.ERROR,
		// 			onClose: function () {}
		// 		});
		// 	} else if (mUnit.getValue() === "") {
		// 		mUnit.setValueState("Error");
		// 		var msgU = this.getView().getModel("i18n").getProperty("DIST_UNIT_ERR_TXT");
		// 		isValid = false;
		// 		MessageBox.show(msgU, {
		// 			title: "Error",
		// 			icon: sap.m.MessageBox.Icon.ERROR,
		// 			onClose: function () {}
		// 		});
		// 	}
		// 	return isValid;
		// },

		// onDistEndChange: function () {
		// 	var isValid = true;
		// 	// var d = this.getView().byId("distEndMrkr").getValue();
		// 	// var ep = this.getView().byId("endPoint");
		// 	var lamFragmentId = this.getView().createId("lamFrag");
		// 	var d = sap.ui.core.Fragment.byId(lamFragmentId, "distEndMrkr").getValue();
		// 	var ep = sap.ui.core.Fragment.byId(lamFragmentId, "endPoint");
		// 	var value = ep.getValue();
		// 	var temp_ep;

		// 	var temp;
		// 	var mUnit = sap.ui.core.Fragment.byId(lamFragmentId, "mrkrDistUnit"); //this.getView().byId("mrkrDistUnit");

		// 	if (this.endPoint !== "" && mUnit.getValue() !== "") {
		// 		if (d !== "") {
		// 			if (this.endPoint.indexOf("+") > -1) {
		// 				temp = this.endPoint.split("+");
		// 				temp_ep = +parseInt(temp[1]);
		// 			} else if (this.endPoint.indexOf("-") > -1) {
		// 				temp = this.endPoint.split("-");
		// 				temp_ep = -parseInt(temp[1]);
		// 			} else {
		// 				temp_ep = parseInt(this.endPoint);
		// 			}
		// 			if (d.indexOf("+") > -1) {
		// 				var s = d.split("+");
		// 				d = +parseInt(s[1]);
		// 			} else if (d.indexOf("-") > -1) {
		// 				var t = d.split("-");
		// 				d = -parseInt(t[1]);
		// 			} else {
		// 				d = parseInt(d);
		// 			}
		// 			if (d === 0) {
		// 				ep.setValue(this.endPoint);
		// 			} else {
		// 				temp_ep = temp_ep + d;
		// 				ep.setValue(temp_ep);
		// 				this.lengthCheck();
		// 			}
		// 			isValid = true;
		// 		}
		// 	} else if (d === "") {
		// 		ep.setValue(this.endPoint);
		// 		this.getView().byId("distEndMrkr").setValue(0);
		// 		isValid = true;
		// 	} else if (value === "" && mUnit.getValue() === "") {
		// 		ep.setValueState("Error");
		// 		mUnit.setValueState("Error");
		// 		var msg = this.getView().getModel("i18n").getProperty("DIST_EM_UNIT_ERR_TXT");
		// 		isValid = false;
		// 		MessageBox.show(msg, {
		// 			title: "Error",
		// 			icon: sap.m.MessageBox.Icon.ERROR,
		// 			onClose: function () {}
		// 		});
		// 	} else if (value === "") {
		// 		ep.setValueState("Error");
		// 		var _msg = this.getView().getModel("i18n").getProperty("DIST_EM_ERR_TXT");
		// 		isValid = false;
		// 		MessageBox.show(_msg, {
		// 			title: "Error",
		// 			icon: sap.m.MessageBox.Icon.ERROR,
		// 			onClose: function () {}
		// 		});
		// 	} else if (mUnit.getValue() === "") {
		// 		mUnit.setValueState("Error");
		// 		var msgU = this.getView().getModel("i18n").getProperty("DIST_UNIT_ERR_TXT");
		// 		isValid = false;
		// 		MessageBox.show(msgU, {
		// 			title: "Error",
		// 			icon: sap.m.MessageBox.Icon.ERROR,
		// 			onClose: function () {}
		// 		});
		// 	}
		// 	return isValid;
		// },

		// lengthCheck: function () {
		// 	var l;
		// 	// var sp = this.getView().byId("startPoint").getValue();
		// 	// var ep = this.getView().byId("endPoint").getValue();
		// 	var lamFragmentId = this.getView().createId("lamFrag");
		// 	var sp = sap.ui.core.Fragment.byId(lamFragmentId, "startPoint");
		// 	var ep = sap.ui.core.Fragment.byId(lamFragmentId, "endPoint");
		// 	var temp, stTemp;
		// 	if (ep !== "" && sp !== "") {
		// 		if (ep.indexOf("+") > -1) {
		// 			temp = ep.split("+");
		// 			temp = +parseInt(temp[1]);
		// 		}
		// 		if (ep.indexOf("-") > -1) {
		// 			temp = ep.split("-");
		// 			temp = -parseInt(temp[1]);
		// 		}
		// 		if (sp.indexOf("+") > -1) {
		// 			stTemp = sp.split("+");
		// 			stTemp = +parseInt(stTemp[1]);
		// 		}
		// 		if (sp.indexOf("-") > -1) {
		// 			stTemp = sp.split("-");
		// 			stTemp = -parseInt(stTemp[1]);
		// 		}
		// 		l = temp - stTemp;
		// 	} else if (ep === "" && sp === "") {
		// 		l = 0;
		// 	} else if (ep === "" && sp !== "") {
		// 		if (sp.indexOf("+") > -1) {
		// 			stTemp = sp.split("+");
		// 			stTemp = +parseInt(stTemp[1]);
		// 		}
		// 		if (sp.indexOf("-") > -1) {
		// 			stTemp = sp.split("-");
		// 			stTemp = -parseInt(stTemp[1]);
		// 		}
		// 		// l = 0 - stTemp;
		// 	} else if (ep !== "" && sp === "") {
		// 		if (ep.indexOf("+") > -1) {
		// 			temp = ep.split("+");
		// 			temp = +parseInt(temp[1]);
		// 		}
		// 		if (ep.indexOf("-") > -1) {
		// 			temp = ep.split("-");
		// 			temp = -parseInt(temp[1]);
		// 		}
		// 		// l = temp - 0;
		// 	}
		// 	sap.ui.core.Fragment.byId(lamFragmentId, "length").setValue(l); //this.getView().byId("length").setValue(l);
		// },

		////////////////// LAM old ///////////////
		/*onNetworkIdChange: function(e) {
			var v = e.getParameters().newValue;
			if (v !== "") {
				this.getView().byId("netId").setValue(v.toUpperCase());
				this.getView().byId("netId").setValueState("None");
				this.getView().byId("lrp").setEnabled(true);
				this.getView().byId("startPoint").setEnabled(true);
				this.getView().byId("endPoint").setEnabled(true);
				this.getView().byId("uom").setEnabled(true);
				/*var o = this.getView().byId("objType").getValue();
				if (o !== "") {
					this.getView().byId("newLink").setEnabled(true);
				} else {
					this.getView().byId("newLink").setEnabled(false);
				}*/
		/*}
		},*/

		// onNetworkLrpVH: function (c) {
		// 	this.networkLrpVH("lrp", c);
		// },

		// networkLrpVH: function (p, c) {
		// 	var g = this;
		// 	var a;
		// 	a = this.getView().byId(p);
		// 	var d = this.getView().byId("lrpDesc");

		// 	var settings = {
		// 		title: this.getView().getModel("i18n").getProperty("LRP"),
		// 		noDataText: this.getView().getModel("i18n").getProperty("LOAD") + "...",
		// 		items: {
		// 			path: "/NWLRPSet",
		// 			template: new sap.m.StandardListItem({
		// 				title: "{LRPID}",
		// 				description: "{LRP_TXT}"
		// 			})
		// 		},
		// 		confirm: function (E) {
		// 			a.setValueState("None");
		// 			a.setValueStateText("");
		// 			d.setValue(E.getParameters().selectedItem.getProperty("description"));
		// 			a.setValue(E.getParameters().selectedItem.getProperty("title"));
		// 			g.getView().byId("startMarker").setEnabled(true);
		// 			g.getView().byId("endMarker").setEnabled(true);
		// 			g.getView().byId("distStartMrkr").setEnabled(true);
		// 			g.getView().byId("distEndMrkr").setEnabled(true);
		// 			g.getView().byId("mrkrDistUnit").setEnabled(true);
		// 		}
		// 	};

		// 	var q = "/NWLRPSet";
		// 	var M = this.getView().getModel("valueHelp");
		// 	var nLrpSelectDialog = ValueHelpProvider.getSelectDialog(M, q, [], settings, "LRPID", "LRP_TXT");
		// 	nLrpSelectDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 	nLrpSelectDialog.open();
		// },

		// onEndPointVH: function (c) {
		// 	this.startPointVH("endPoint", c);
		// },

		// onStartPointVH: function (c) {
		// 	this.startPointVH("startPoint", c);
		// },

		// onLamUOMVH: function (c) {
		// 	this.lamUOMVH("uom", "uomDesc", c);
		// },

		// onMarkerDistUnit: function (c) {
		// 	this.lamUOMVH("mrkrDistUnit", "mrkrDistUnitDesc", c);
		// },

		// onStartMarkerVH: function (c) {
		// 	this.startPointVH("startMarker", c);
		// },

		// onEndMarkerVH: function (c) {
		// 	this.startPointVH("endMarker", c);
		// },

		// startPointVH: function (p, c) {
		// 	var g = this;
		// 	var a;
		// 	var P = p;
		// 	a = this.getView().byId(p);
		// 	var l = this.getView().byId("lrp").getValue();
		// 	var u = this.getView().byId("mrkrDistUnit");

		// 	var settings = {
		// 		title: g.getView().getModel("i18n").getProperty("STRT_POINT"),
		// 		noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
		// 		columns: [new sap.m.Column({
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>LINEARPOINT}"
		// 					})
		// 				]
		// 			}), new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>UOMSHORT}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",

		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>DISTANCE}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>UOMSHORT}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>MARKER}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>MARKERLOC}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>UOMSHORT}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>MARKTYPE}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>MARKDESC}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>LINREFPATTERN}"
		// 					})
		// 				]
		// 			})
		// 		],
		// 		items: {
		// 			path: "/StartpointSet?$filter=LRPID eq '" + l + "'",
		// 			template: new sap.m.ColumnListItem({
		// 				type: "Active",
		// 				unread: false,
		// 				cells: [
		// 					new sap.m.Text({
		// 						text: "{Linear_point}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Linear_unit}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Distance}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Distance_unit}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Marker}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Start_point}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Marker_linear_unit}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Marker_type}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{marker_txt}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{LRPID}"
		// 					})
		// 				]
		// 			})

		// 		},
		// 		confirm: function (E) {
		// 			if (p === "startMarker") {
		// 				a.setValue(E.getParameter("selectedItem").getCells()[4].getText());
		// 				g.getView().byId("startPoint").setValue((E.getParameter("selectedItem").getCells()[5].getText()));
		// 				g.getView().byId("distStartMrkr").setValue((E.getParameter("selectedItem").getCells()[2].getText()));
		// 				g.startPoint = E.getParameter("selectedItem").getCells()[5].getText();
		// 			} else if (p === "endMarker") {
		// 				a.setValue(E.getParameter("selectedItem").getCells()[4].getText());
		// 				g.getView().byId("endPoint").setValue(E.getParameter("selectedItem").getCells()[5].getText());
		// 				g.getView().byId("distEndMrkr").setValue((E.getParameter("selectedItem").getCells()[2].getText()));
		// 				g.endPoint = E.getParameter("selectedItem").getCells()[5].getText();
		// 			} else if (p === "startPoint") {
		// 				g.startPoint = E.getParameter("selectedItem").getCells()[5].getText();
		// 				a.setValue((E.getParameter("selectedItem").getCells()[5].getText()));
		// 				g.getView().byId("startMarker").setValue(E.getParameter("selectedItem").getCells()[4].getText());
		// 				g.getView().byId("distStartMrkr").setValue((E.getParameter("selectedItem").getCells()[2].getText()));
		// 			} else if (p === "endPoint") {
		// 				g.endPoint = E.getParameter("selectedItem").getCells()[5].getText();
		// 				a.setValue((E.getParameter("selectedItem").getCells()[5].getText()));
		// 				g.getView().byId("endMarker").setValue(E.getParameter("selectedItem").getCells()[4].getText());
		// 				g.getView().byId("distEndMrkr").setValue((E.getParameter("selectedItem").getCells()[2].getText()));
		// 			}
		// 			g.getView().byId("uom").setValue(E.getParameter("selectedItem").getCells()[1].getText());
		// 			g.getView().byId("mrkrDistUnit").setValue(E.getParameter("selectedItem").getCells()[6].getText());
		// 			g.lengthCheck();
		// 			a.setValueState("None");
		// 			a.setValueStateText("");
		// 			u.setValueState("None");
		// 		}
		// 	};

		// 	var sPath = "/StartpointSet";
		// 	var oFilters = [new sap.ui.model.Filter("LRPID", "EQ", l)];
		// 	var oModel = g.getView().getModel("valueHelp");
		// 	var cells = [
		// 		new sap.m.Text({
		// 			text: "{Linear_point}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Linear_unit}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Distance}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Distance_unit}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Marker}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Start_point}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Marker_linear_unit}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Marker_type}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{marker_txt}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{LRPID}"
		// 		})
		// 	];

		// 	var stSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Start_point", "Marker");
		// 	stSelectDialog.open();
		// 	stSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		// },

		// lamUOMVH: function (p, desc, c) {
		// 	var g = this;
		// 	var a;
		// 	var P = p;
		// 	a = this.getView().byId(p);
		// 	var d = this.getView().byId(desc);

		// 	var settings = {
		// 		title: g.getView().getModel("i18n").getProperty("UOM"),
		// 		noDataText: g.getView().getModel("i18n").getProperty("LOAD") + "...",
		// 		columns: [new sap.m.Column({
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>COMMERCIAL}"
		// 					})
		// 				]
		// 			}), new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>INTMEASUNIT}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",

		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>UNITTXT}"
		// 					})
		// 				]
		// 			}),
		// 			new sap.m.Column({
		// 				demandPopin: true,
		// 				minScreenWidth: "Tablet",
		// 				header: [
		// 					new sap.m.Text({
		// 						text: "{i18n>DIMSNTXT}"
		// 					})
		// 				]
		// 			})
		// 		],
		// 		items: {
		// 			path: "/LAMuomSet",
		// 			template: new sap.m.ColumnListItem({
		// 				type: "Active",
		// 				unread: false,
		// 				cells: [
		// 					new sap.m.Text({
		// 						text: "{Mseh3}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Msehi}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Msehl}"
		// 					}),
		// 					new sap.m.Text({
		// 						text: "{Txdim}"
		// 					})
		// 				]
		// 			})

		// 		},
		// 		confirm: function (E) {
		// 			a.setValueState("None");
		// 			a.setValueStateText("");
		// 			a.setValue(E.getParameter("selectedItem").getCells()[0].getText());
		// 			d.setValue(E.getParameter("selectedItem").getCells()[2].getText());
		// 		}
		// 	};
		// 	//var q = "/UserstatwonumberSet?$filter=Stsma eq '" + stsProf + "'";
		// 	var sPath = "/LAMuomSet";
		// 	var oFilters = [];
		// 	var oModel = g.getView().getModel("valueHelp");
		// 	var cells = [
		// 		new sap.m.Text({
		// 			text: "{Mseh3}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Msehi}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Msehl}"
		// 		}),
		// 		new sap.m.Text({
		// 			text: "{Txdim}"
		// 		})
		// 	];

		// 	var uSelectDialog = ValueHelpProvider.getValueHelp(oModel, sPath, cells, oFilters, settings, "Msehi", "Msehl");
		// 	uSelectDialog.open();
		// 	uSelectDialog.setModel(g.getView().getModel("i18n"), "i18n");
		// },

		// netLrpChange: function () {
		// 	var a = this.getView().byId("lrp");
		// 	if (a.getValue() === "") {
		// 		this.getView().byId("lrpDesc").setValue();
		// 	}
		// 	a.setValueState("None");
		// },
		// onNetLrpChange: function () {
		// 	var t = this.getView().byId("lrp");
		// 	var c = t.getValue().toUpperCase();
		// 	t.setValue(c);
		// 	this._linearRefPattern(t);
		// },
		// _linearRefPattern: function (f) {
		// 	var g = this;
		// 	var c = f.getValue();
		// 	var cd = this.getView().byId("lrpDesc");
		// 	var a = c.replace(/^[ ]+|[ ]+$/g, '');
		// 	if (a !== "") {
		// 		var oFilter = [new sap.ui.model.Filter("NETYP", "EQ", c)];
		// 		var q = "/NetTypSet";
		// 		var m = this.getView().getModel("valueHelp");
		// 		m.read(q, {
		// 			filters: oFilter,
		// 			success: function (d, e) {
		// 				if (d.results.length > 0) {
		// 					f.setValueState("None");
		// 					cd.setValue(d.results[0].NETYP_TXT);
		// 					f.setValue(a);
		// 					g.getView().byId("startMarker").setEnabled(true);
		// 					g.getView().byId("endMarker").setEnabled(true);
		// 					g.getView().byId("distStartMrkr").setEnabled(true);
		// 					g.getView().byId("distEndMrkr").setEnabled(true);
		// 					g.getView().byId("mrkrDistUnit").setEnabled(true);
		// 				} else {
		// 					f.setValueState("Error");
		// 					cd.setValue();
		// 					f.setValueStateText("Invalid Entry");
		// 				}
		// 			},
		// 			error: function (e) {
		// 				f.setValueState("Error");
		// 				var b = JSON.parse(e.response.body);
		// 				var d = b.error.message.value;
		// 				f.setValueStateText(d);
		// 			}
		// 		});
		// 	} else {
		// 		f.setValue(a);
		// 	}
		// },

		// uomChange: function () {
		// 	var a = this.getView().byId("uom");
		// 	if (a.getValue() === "") {
		// 		this.getView().byId("uomDesc").setValue();
		// 	}
		// 	a.setValueState("None");
		// },
		// onUomChange: function () {
		// 	var t = this.getView().byId("uom");
		// 	var c = t.getValue().toUpperCase();
		// 	t.setValue(c);
		// 	this._uom(t, "uom", "uomDesc");

		// },

		// markerUnitChange: function () {
		// 	var a = this.getView().byId("mrkrDistUnit");
		// 	if (a.getValue() === "") {
		// 		this.getView().byId("mrkrDistUnitDesc").setValue();
		// 	}
		// 	a.setValueState("None");

		// },
		// onMarkerUnitChange: function () {
		// 	var t = this.getView().byId("mrkrDistUnit");
		// 	var c = t.getValue().toUpperCase();
		// 	t.setValue(c);
		// 	this._uom(t, "mrkrDistUnit", "mrkrDistUnitDesc");

		// },

		// _uom: function (f, p, descp) {
		// 	var c = f.getValue();
		// 	var cd;
		// 	cd = this.getView().byId(descp);

		// 	var a = c.replace(/^[ ]+|[ ]+$/g, '');
		// 	if (a !== "") {
		// 		var oFilter = [new sap.ui.model.Filter("Msehi", "EQ", c)];
		// 		var q = "/LAMuomSet";
		// 		var m = this.getView().getModel("valueHelp");
		// 		m.read(q, {
		// 			filters: oFilter,
		// 			success: function (d, e) {
		// 				if (d.results.length > 0) {
		// 					f.setValueState("None");
		// 					cd.setValue(d.results[0].Msehl);
		// 					f.setValue(a);
		// 				} else {
		// 					f.setValueState("Error");
		// 					cd.setValue();
		// 					f.setValueStateText("Invalid Entry");
		// 				}
		// 			},
		// 			error: function (e) {
		// 				f.setValueState("Error");
		// 				var b = JSON.parse(e.response.body);
		// 				var d = b.error.message.value;
		// 				f.setValueStateText(d);
		// 			}
		// 		});
		// 	} else {
		// 		f.setValue(a);
		// 	}
		// },

		// startPointChange: function () {
		// 	var a = this.getView().byId("startPoint");
		// 	a.setValueState("None");
		// },
		// onStartPointChange: function () {
		// 	var t = this.getView().byId("startPoint");
		// 	var c = t.getValue().toUpperCase();
		// 	t.setValue(c);
		// 	this._startPoint(t, "startPoint");
		// },

		// endPointChange: function () {
		// 	var a = this.getView().byId("endPoint");
		// 	a.setValueState("None");
		// },
		// onEndPointChange: function () {
		// 	var t = this.getView().byId("endPoint");
		// 	var c = t.getValue().toUpperCase();
		// 	t.setValue(c);
		// 	this._startPoint(t, "endPoint");
		// },

		// startMarkerChange: function () {
		// 	var a = this.getView().byId("startMarker");
		// 	a.setValueState("None");
		// },
		// onStartMarkerChange: function () {
		// 	var t = this.getView().byId("startMarker");
		// 	var c = t.getValue().toUpperCase();
		// 	t.setValue(c);
		// 	this._startPoint(t, "startMarker");
		// },

		// endMarkerChange: function () {
		// 	var a = this.getView().byId("endMarker");
		// 	a.setValueState("None");
		// },
		// onEndMarkerChange: function () {
		// 	var t = this.getView().byId("endMarker");
		// 	var c = t.getValue().toUpperCase();
		// 	t.setValue(c);
		// 	this._startPoint(t, "endMarker");
		// },
		// _startPoint: function (f, p) {
		// 	var g = this;
		// 	var c = f.getValue();
		// 	var a = c.replace(/^[ ]+|[ ]+$/g, '');
		// 	var l = this.getView().byId("lrp").getValue();
		// 	var u = this.getView().byId("mrkrDistUnit");
		// 	var q;
		// 	var oFilter;
		// 	if (a !== "") {
		// 		if (p === "startPoint" || p === "endPoint") {
		// 			oFilter = [new sap.ui.model.Filter("LRPID", "EQ", l),
		// 				new sap.ui.model.Filter("Start_point", "EQ", c)
		// 			];
		// 			q = "/StartpointSet";
		// 		}
		// 		if (p === "startMarker" || p === "endMarker") {
		// 			oFilter = [new sap.ui.model.Filter("LRPID", "EQ", l),
		// 				new sap.ui.model.Filter("Marker", "EQ", c)
		// 			];
		// 			q = "/StartpointSet";
		// 		}
		// 		var m = this.getView().getModel("valueHelp");
		// 		m.read(q, {
		// 			filters: oFilter,
		// 			success: function (d, e) {
		// 				if (d.results.length > 0) {
		// 					if (p === "startMarker") {
		// 						f.setValue(d.results[0].Marker);
		// 						g.getView().byId("startPoint").setValue(d.results[0].Start_point);
		// 						g.getView().byId("distStartMrkr").setValue(d.results[0].Distance);
		// 						g.startPoint = d.results[0].Start_point;
		// 					} else if (p === "endMarker") {
		// 						f.setValue(d.results[0].Marker);
		// 						g.getView().byId("endPoint").setValue(d.results[0].Start_point);
		// 						g.getView().byId("distEndMrkr").setValue(d.results[0].Distance);
		// 						g.endPoint = d.results[0].Start_point;
		// 					} else if (p === "startpoint") {
		// 						g.startPoint = d.results[0].Start_point;
		// 						a.setValue(d.results[0].Start_point);
		// 						g.getView().byId("startMarker").setValue(d.results[0].Marker);
		// 						g.getView().byId("distStartMrkr").setValue(d.results[0].Distance);
		// 					} else if (p === "endPoint") {
		// 						g.endPoint = d.results[0].Start_point;
		// 						a.setValue(d.results[0].Start_point);
		// 						g.getView().byId("endMarker").setValue(d.results[0].Marker);
		// 						g.getView().byId("distEndMrkr").setValue(d.results[0].Distance);
		// 					}
		// 					g.getView().byId("uom").setValue(d.results[0].Linear_unit);
		// 					g.getView().byId("mrkrDistUnit").setValue(d.results[0].Marker_linear_unit);
		// 					g.lengthCheck();
		// 					f.setValueState("None");
		// 					u.setValueState("None");
		// 					f.setValue(a);
		// 				} else {
		// 					f.setValueState("Error");
		// 					f.setValueStateText("Invalid Entry");
		// 				}
		// 			},
		// 			error: function (e) {
		// 				f.setValueState("Error");
		// 				var b = JSON.parse(e.response.body);
		// 				var d = b.error.message.value;
		// 				f.setValueStateText(d);
		// 			}
		// 		});
		// 	} else {
		// 		f.setValue(a);
		// 	}
		// },

	});
});